import express from "express";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

import { createMcpServer, SessionManager } from './server.js';
import { serverConfig } from '../config/server-config.js';
import { createErrorResponse } from './http-utils.js';

/**
 * Creates and configures the HTTP server
 */
export function createHttpServer() {
  const app = express();
  const mcpServer = createMcpServer();
  const sessionManager = new SessionManager();

  // Middleware
  app.use(express.json());
  
  // Request logging middleware
  if (serverConfig.logging.enableRequestLogging) {
    app.use((req, res, next) => {
      const sessionId = req.headers['mcp-session-id'];
      console.log(`📥 ${req.method} ${req.path} - Session: ${sessionId || 'none'}`);
      next();
    });
  }

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      server: serverConfig.name,
      version: serverConfig.version,
      activeSessions: sessionManager.getSessionCount(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // Main MCP endpoint - POST requests for client-to-server communication
  app.post('/mcp', async (req, res) => {
    try {
      const sessionId = req.headers['mcp-session-id'];
      let transport;

      if (sessionId && sessionManager.hasSession(sessionId)) {
        // Reuse existing transport
        transport = sessionManager.getTransport(sessionId);
        
        if (!transport) {
          return res.status(400).json(
            createErrorResponse(ErrorCode.InvalidRequest, 'Session not found or expired')
          );
        }
      } else if (!sessionId && isInitializeRequest(req.body)) {
        // New initialization request
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (newSessionId) => {
            sessionManager.addTransport(newSessionId, transport);
          }
        });

        // Clean up transport when closed
        transport.onclose = () => {
          if (transport.sessionId) {
            sessionManager.removeTransport(transport.sessionId);
          }
        };
        
        // Connect to the MCP server
        await mcpServer.connect(transport);
      } else {
        // Invalid request
        return res.status(400).json(
          createErrorResponse(ErrorCode.InvalidRequest, 'Invalid request: No valid session ID or initialization request')
        );
      }

      // Handle the request through the transport
      await transport.handleRequest(req, res, req.body);
      
    } catch (error) {
      console.error('❌ Error handling MCP request:', error);
      
      if (!res.headersSent) {
        res.status(500).json(
          createErrorResponse(ErrorCode.InternalError, 'Internal server error', error.message)
        );
      }
    }
  });

  // Handle GET requests for server-to-client notifications via SSE
  app.get('/mcp', async (req, res) => {
    try {
      const sessionId = req.headers['mcp-session-id'];
      
      if (!sessionId || !sessionManager.hasSession(sessionId)) {
        return res.status(400).json(
          createErrorResponse(ErrorCode.InvalidRequest, 'Invalid or missing session ID')
        );
      }
      
      const transport = sessionManager.getTransport(sessionId);
      await transport.handleRequest(req, res);
      
    } catch (error) {
      console.error('❌ Error handling GET request:', error);
      
      if (!res.headersSent) {
        res.status(500).send('Internal server error');
      }
    }
  });

  // Handle DELETE requests for session termination
  app.delete('/mcp', async (req, res) => {
    try {
      const sessionId = req.headers['mcp-session-id'];
      
      if (!sessionId) {
        return res.status(400).json(
          createErrorResponse(ErrorCode.InvalidRequest, 'Session ID required for termination')
        );
      }

      if (sessionManager.hasSession(sessionId)) {
        const transport = sessionManager.getTransport(sessionId);
        
        if (transport) {
          await transport.handleRequest(req, res);
        }
        
        sessionManager.removeTransport(sessionId);
        console.log(`🔚 Session ${sessionId} terminated`);
      }
      
      if (!res.headersSent) {
        res.status(200).json({ message: 'Session terminated' });
      }
      
    } catch (error) {
      console.error('❌ Error handling DELETE request:', error);
      
      if (!res.headersSent) {
        res.status(500).send('Internal server error');
      }
    }
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Path ${req.originalUrl} not found`,
      availableEndpoints: ['/health', '/mcp']
    });
  });

  // Error handler
  app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    
    if (!res.headersSent) {
      res.status(500).json(
        createErrorResponse(ErrorCode.InternalError, 'Internal server error')
      );
    }
  });

  return { app, sessionManager };
} 