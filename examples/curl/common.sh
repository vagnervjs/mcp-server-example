#!/bin/bash

# Common utilities for MCP Server cURL examples
# Source this file in other scripts: source examples/curl/common.sh

# Configuration
SERVER_URL="http://localhost:3000"
SESSION_ID=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "${BLUE}🔄 $1${NC}"
}

# Check if server is running
check_server() {
    log_step "Checking if MCP server is running..."
    
    if curl -s "$SERVER_URL/health" > /dev/null 2>&1; then
        log_success "Server is running at $SERVER_URL"
        return 0
    else
        log_error "Server is not running at $SERVER_URL"
        log_info "Please start the server with: npm start"
        return 1
    fi
}

# Initialize MCP session
init_session() {
    log_step "Initializing MCP session..."
    
    RESPONSE_HEADERS=$(mktemp)
    
    curl -s -D $RESPONSE_HEADERS -o /dev/null -X POST "$SERVER_URL/mcp" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json, text/event-stream" \
      -d '{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {
          "protocolVersion": "2024-11-05",
          "capabilities": {
            "tools": {},
            "resources": {},
            "prompts": {}
          },
          "clientInfo": {
            "name": "curl-examples",
            "version": "1.0.0"
          }
        }
      }'
    
    SESSION_ID=$(grep -i mcp-session-id $RESPONSE_HEADERS | awk '{print $2}' | tr -d '\r')
    rm $RESPONSE_HEADERS

    if [ -z "$SESSION_ID" ]; then
        log_error "Failed to initialize session"
        return 1
    fi

    log_success "Session initialized: ${SESSION_ID:0:8}..."
    return 0
}

# Make MCP request
make_mcp_request() {
    local method="$1"
    local params="$2"
    local id="${3:-$(date +%s)}"
    
    if [ -z "$SESSION_ID" ]; then
        log_error "No active session. Call init_session first."
        return 1
    fi
    
    curl -s -X POST "$SERVER_URL/mcp" \
      -H "Content-Type: application/json" \
      -H "Accept: application/json, text/event-stream" \
      -H "mcp-session-id: $SESSION_ID" \
      -d "{
        \"jsonrpc\": \"2.0\",
        \"id\": $id,
        \"method\": \"$method\",
        \"params\": $params
      }" | grep 'data: ' | sed 's/data: //'
}

# Cleanup session
cleanup_session() {
    if [ -n "$SESSION_ID" ]; then
        log_step "Cleaning up session..."
        curl -s -X DELETE "$SERVER_URL/mcp" \
          -H "mcp-session-id: $SESSION_ID" > /dev/null 2>&1
        log_success "Session cleaned up"
    fi
}

# Setup for examples
setup_example() {
    local example_name="$1"
    
    echo "=== MCP Server $example_name Examples ==="
    echo
    
    check_server || exit 1
    init_session || exit 1
    
    # Trap to cleanup on exit
    trap cleanup_session EXIT
    
    echo
}

# Pretty print JSON response
pretty_json() {
    if command -v jq > /dev/null 2>&1; then
        jq .
    else
        cat
    fi
}

# Extract and format prompt text
format_prompt_text() {
    local lines="${1:-20}"
    if command -v jq > /dev/null 2>&1; then
        jq -r '.result.messages[0].content.text' | head -n "$lines"
    else
        cat
    fi
} 