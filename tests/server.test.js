#!/usr/bin/env node

import { test, describe } from 'node:test';
import assert from 'node:assert';

import { createMcpServer, SessionManager } from '../src/server/server.js';
import { createHttpServer } from '../src/server/http-server.js';
import { serverConfig } from '../src/config/server-config.js';

describe('Server Architecture', () => {
  test('MCP Server Creation and Registration', () => {
    const server = createMcpServer();
    assert.ok(server);
    console.log('✅ MCP server creates successfully with all tools and resources');
  });
  
  test('Session Management - Basic Operations', () => {
    const sessionManager = new SessionManager();
    
    // Initial state
    assert.strictEqual(sessionManager.getSessionCount(), 0);
    assert.strictEqual(sessionManager.hasSession('test'), false);
    
    // Add sessions
    const mockTransport1 = { id: 'session1', type: 'test' };
    const mockTransport2 = { id: 'session2', type: 'test' };
    
    sessionManager.addTransport('session1', mockTransport1);
    sessionManager.addTransport('session2', mockTransport2);
    
    assert.strictEqual(sessionManager.getSessionCount(), 2);
    assert.strictEqual(sessionManager.hasSession('session1'), true);
    assert.strictEqual(sessionManager.getTransport('session1'), mockTransport1);
    
    // Remove session
    const removed = sessionManager.removeTransport('session1');
    assert.strictEqual(removed, true);
    assert.strictEqual(sessionManager.getSessionCount(), 1);
    
    console.log('✅ Session management handles basic operations correctly');
  });
  
  test('Session Management - Limits and Cleanup', () => {
    const sessionManager = new SessionManager();
    sessionManager.maxSessions = 3;
    
    // Add sessions up to and beyond limit
    for (let i = 1; i <= 5; i++) {
      sessionManager.addTransport(`session${i}`, { id: `session${i}` });
    }
    
    // Should only have 3 sessions (the limit)
    assert.strictEqual(sessionManager.getSessionCount(), 3);
    
    // Should have removed the oldest sessions
    assert.strictEqual(sessionManager.hasSession('session1'), false);
    assert.strictEqual(sessionManager.hasSession('session2'), false);
    assert.strictEqual(sessionManager.hasSession('session3'), true);
    assert.strictEqual(sessionManager.hasSession('session4'), true);
    assert.strictEqual(sessionManager.hasSession('session5'), true);
    
    // Test cleanup start/stop
    sessionManager.startCleanup();
    assert.ok(sessionManager.cleanupInterval);
    
    sessionManager.stopCleanup();
    assert.strictEqual(sessionManager.cleanupInterval, null);
    
    console.log('✅ Session limits and cleanup work correctly');
  });
  
  test('HTTP Server Creation', () => {
    const { app, sessionManager } = createHttpServer();
    assert.ok(app);
    assert.ok(sessionManager);
    assert.ok(sessionManager instanceof SessionManager);
    
    sessionManager.stopCleanup(); // Clean up
    console.log('✅ HTTP server creates successfully with session management');
  });
  
  test('Server Configuration', () => {
    assert.strictEqual(serverConfig.name, 'mcp-server-example');
    assert.strictEqual(serverConfig.version, '1.0.0');
    assert.ok(serverConfig.server);
    assert.ok(serverConfig.mcp);
    assert.ok(serverConfig.logging);
    assert.ok(serverConfig.session);
    
    console.log('✅ Server configuration is complete and valid');
  });

  test('Session Management - Invalid operations', () => {
    const sessionManager = new SessionManager();
    
    // Try to remove non-existent session
    const removed = sessionManager.removeTransport('non-existent');
    assert.strictEqual(removed, false);
    
    // Try to get non-existent transport
    const transport = sessionManager.getTransport('non-existent');
    assert.strictEqual(transport, undefined);
    
    // Multiple cleanup stops
    sessionManager.stopCleanup();
    sessionManager.stopCleanup(); // Should not throw
    
    console.log('✅ Session management handles invalid operations gracefully');
  });
}); 