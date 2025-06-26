import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAllTools } from '../tools/index.js';
import { registerAllResources } from '../resources/index.js';
import { registerAllPrompts } from '../prompts/index.js';
import { serverConfig } from '../config/server-config.js';

/**
 * Creates and configures the MCP server instance
 * @returns {McpServer} Configured MCP server
 */
export function createMcpServer() {
  const server = new McpServer({
    name: serverConfig.name,
    version: serverConfig.version
  });

  // Register all tools, resources, and prompts
  registerAllTools(server);
  registerAllResources(server);
  registerAllPrompts(server);

  console.log(`✅ MCP Server "${serverConfig.name}" v${serverConfig.version} initialized`);
  console.log(`📝 Description: ${serverConfig.description}`);
  
  return server;
}

/**
 * Session management utilities
 */
export class SessionManager {
  constructor() {
    this.transports = new Map();
    this.cleanupInterval = null;
    this.maxSessions = serverConfig.session.maxSessions;
  }

  addTransport(sessionId, transport) {
    // Remove oldest session if we hit the limit
    if (this.transports.size >= this.maxSessions) {
      const oldestSession = this.transports.keys().next().value;
      this.removeTransport(oldestSession);
      console.warn(`🚨 Session limit reached. Removed oldest session: ${oldestSession}`);
    }

    this.transports.set(sessionId, transport);
    console.log(`📡 Session ${sessionId} added (total: ${this.transports.size})`);
  }

  removeTransport(sessionId) {
    if (this.transports.has(sessionId)) {
      this.transports.delete(sessionId);
      console.log(`🗑️ Session ${sessionId} removed (total: ${this.transports.size})`);
      return true;
    }
    return false;
  }

  getTransport(sessionId) {
    return this.transports.get(sessionId);
  }

  hasSession(sessionId) {
    return this.transports.has(sessionId);
  }

  getSessionCount() {
    return this.transports.size;
  }

  startCleanup() {
    if (this.cleanupInterval) return;
    
    this.cleanupInterval = setInterval(() => {
      // Here you could implement session timeout logic
      console.log(`🧹 Session cleanup check: ${this.transports.size} active sessions`);
    }, serverConfig.session.cleanupInterval);
    
    console.log('🔄 Session cleanup started');
  }

  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('⏹️ Session cleanup stopped');
    }
  }
} 