/**
 * Common HTTP utilities for the MCP server
 */

import { ErrorCode } from "@modelcontextprotocol/sdk/types.js";

/**
 * Creates a standardized error response using MCP error codes
 */
export function createErrorResponse(code, message, data = null) {
  const errorResponse = {
    error: {
      code,
      message
    }
  };

  if (data !== null) {
    errorResponse.error.data = data;
  }

  return errorResponse;
}

