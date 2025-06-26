// Export all tools
export { calculateBmiTool } from './calculate-bmi.js';
export { fetchWeatherTool } from './fetch-weather.js';
export { listFilesTool } from './list-files.js';

import { calculateBmiTool } from './calculate-bmi.js';
import { fetchWeatherTool } from './fetch-weather.js';
import { listFilesTool } from './list-files.js';

/**
 * Register all tools with the MCP server
 */
export function registerAllTools(server) {
  const tools = [calculateBmiTool, fetchWeatherTool, listFilesTool];
  
  tools.forEach(tool => {
    // Use the MCP server tool method
    server.registerTool(tool.name, tool.config, tool.handler);
  });
  
  console.log(`Registered ${tools.length} tools: ${tools.map(t => t.name).join(', ')}`);
} 