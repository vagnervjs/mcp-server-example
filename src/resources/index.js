export { staticResources } from './static-resources.js';
export { dynamicResources } from './dynamic-resources.js';

import { staticResources } from './static-resources.js';
import { dynamicResources } from './dynamic-resources.js';

/**
 * Register all resources with the MCP server
 */
export function registerAllResources(server) {
  // Register static resources
  staticResources.forEach(resource => {
    server.resource(resource.name, resource.uri, resource.metadata, resource.handler);
  });
  
  // Register dynamic resources with templates
  dynamicResources.forEach(resource => {
    server.resource(resource.name, resource.template, resource.metadata, resource.handler);
  });
  
  const totalResources = staticResources.length + dynamicResources.length;
  console.log(`Registered ${totalResources} resources (${staticResources.length} static, ${dynamicResources.length} dynamic)`);
} 