export const staticResources = [
  {
    name: "config",
    uri: "config://app",
    metadata: {
      title: "Application Config",
      description: "Application configuration data",
      mimeType: "application/json"
    },
    handler: async (request) => ({
      contents: [{
        uri: request.href,
        mimeType: "application/json",
        text: JSON.stringify({
          appName: "MCP Server Example",
          version: "1.0.0",
          features: ["BMI Calculator", "Weather Fetcher", "File Lister"],
          lastUpdated: new Date().toISOString()
        }, null, 2)
      }]
    })
  },
  
  {
    name: "server-info",
    uri: "info://server",
    metadata: {
      title: "Server Information",
      description: "Information about the MCP server",
      mimeType: "text/plain"
    },
    handler: async (request) => ({
      contents: [{
        uri: request.href,
        mimeType: "text/plain",
        text: `MCP Server Example
Version: 1.0.0
Runtime: Node.js
Protocol: Model Context Protocol
Tools: 3 available
Resources: Multiple static and dynamic resources
`
      }]
    })
  }
]; 