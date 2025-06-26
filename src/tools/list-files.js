import { z } from "zod";
import { extname } from "node:path";

// MIME types for different file extensions
const MIME_TYPES = {
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.md': 'text/markdown',
  '.sh': 'application/x-sh',
  '.txt': 'text/plain'
};

/**
 * Gets MIME type for a file extension
 */
function getMimeType(extension) {
  return MIME_TYPES[extension] || 'application/octet-stream';
}

export const listFilesTool = {
  name: "list-files",
  config: {
    title: "File Lister", 
    description: "List project files matching a pattern",
    inputSchema: {
      pattern: z.string().min(1).describe("File pattern to match (e.g., *.js, *.md)")
    }
  },
  handler: async ({ pattern }) => {
    const mockFiles = {
      "*.js": [
        "src/index.js", 
        "src/server.js", 
        "src/http-server.js",
        "src/tools/calculate-bmi.js",
        "src/tools/fetch-weather.js",
        "src/tools/list-files.js"
      ],
      "*.md": ["README.md"],
      "*.json": ["package.json"],
      "*.sh": ["curl-examples.sh"],
      "*": [
        "src/index.js", 
        "src/server.js", 
        "src/http-server.js",
        "README.md", 
        "package.json", 
        "curl-examples.sh"
      ]
    };
    
    const files = mockFiles[pattern] || [];
    const content = [];
    
    // Add summary text
    content.push({
      type: "text",
      text: `Found ${files.length} files matching "${pattern}":`
    });
    
    // Add file resources
    files.forEach(file => {
      const extension = extname(file);
      const mimeType = getMimeType(extension);
      const fileType = extension.substring(1) || 'file'; // Remove the dot
      
      content.push({
        type: "resource",
        resource: {
          uri: `file:///project/${file}`,
          text: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} file: ${file}`,
          mimeType
        }
      });
    });
    
    return { content };
  }
}; 