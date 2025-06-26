export const serverConfig = {
  name: "mcp-server-example",
  version: "1.0.0",
  description: "A scalable MCP server example with tools and resources",
  
  // Server settings
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || 'localhost'
  },
  
  // MCP protocol settings
  mcp: {
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: true,
      resources: true,
      prompts: true
    }
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.NODE_ENV !== 'production'
  },
  
  // Session management
  session: {
    maxSessions: 100,
    cleanupInterval: 30000, // 30 seconds
    sessionTimeout: 300000  // 5 minutes
  }
}; 