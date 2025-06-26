#!/usr/bin/env node

import { createHttpServer } from './server/http-server.js';
import { serverConfig } from './config/server-config.js';

/**
 * Main entry point for the MCP server
 */
async function main() {
  console.log('🚀 Starting MCP Server...');
  
  try {
    const { app, sessionManager } = createHttpServer();
    
    // Start the HTTP server
    const server = app.listen(serverConfig.server.port, serverConfig.server.host, () => {
      console.log(`🌟 Server running on http://${serverConfig.server.host}:${serverConfig.server.port}`);
      console.log('📋 Available endpoints:');
      console.log('   • POST /mcp - Main MCP protocol endpoint');
      console.log('   • GET  /mcp - Server-to-client notifications (SSE)');
      console.log('   • DELETE /mcp - Session termination');
      console.log('   • GET  /health - Health check');
      console.log('');
      console.log('💡 Test with: curl http://localhost:3000/health');
      console.log('🎯 Use curl-examples.sh or npm test:integration to test MCP functionality');
    });

    // Start session cleanup
    sessionManager.startCleanup();

    // Graceful shutdown handling
    const gracefulShutdown = (signal) => {
      console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);
      
      sessionManager.stopCleanup();
      
      server.close((err) => {
        if (err) {
          console.error('❌ Error during server shutdown:', err);
          process.exit(1);
        }
        
        console.log('✅ Server closed successfully');
        console.log('👋 Goodbye!');
        process.exit(0);
      });
      
      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        console.error('⏰ Graceful shutdown timeout. Forcing exit...');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

// Run the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
} 