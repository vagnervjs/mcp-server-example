#!/bin/bash

# MCP Server Resources Examples
# Test all available resources (static and dynamic)

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Setup
setup_example "Resources"

# Step 1: List available resources
log_step "1. Listing available resources..."
make_mcp_request "resources/list" "{}" 2 | pretty_json
echo

# Step 2: Static Resources
log_step "2. Testing Static Resources..."

echo "2a. Application configuration:"
make_mcp_request "resources/read" '{
  "uri": "config://app"
}' 3 | pretty_json
echo

echo "2b. Server information:"
make_mcp_request "resources/read" '{
  "uri": "info://server"
}' 4 | pretty_json
echo

# Step 3: Dynamic Resources - User Profiles
log_step "3. Testing Dynamic Resources - User Profiles..."

user_ids=("123" "456" "789" "admin" "test-user")

for i in "${!user_ids[@]}"; do
    user_id="${user_ids[$i]}"
    echo "3$((i+1)). User profile for ID: $user_id"
    make_mcp_request "resources/read" "{
      \"uri\": \"users://$user_id/profile\"
    }" $((5+i)) | pretty_json
    echo
done

# Step 4: Dynamic Resources - GitHub Repositories
log_step "4. Testing Dynamic Resources - GitHub Repositories..."

declare -a repos=(
    "facebook/react"
    "microsoft/vscode"
    "nodejs/node"
    "vercel/next.js"
    "example/demo-repo"
)

for i in "${!repos[@]}"; do
    repo="${repos[$i]}"
    echo "4$((i+1)). Repository: $repo"
    make_mcp_request "resources/read" "{
      \"uri\": \"github://repos/$repo\"
    }" $((10+i)) | pretty_json
    echo
done

# Step 5: Resource Template Testing
log_step "5. Testing Resource Templates..."

echo "5a. User profile with special characters:"
make_mcp_request "resources/read" '{
  "uri": "users://user-with-dashes_and_underscores/profile"
}' 20 | pretty_json
echo

echo "5b. Repository with complex name:"
make_mcp_request "resources/read" '{
  "uri": "github://repos/org-name/repo.with.dots"
}' 21 | pretty_json
echo

# Step 6: Error Handling
log_step "6. Testing Error Handling..."

echo "6a. Invalid resource URI:"
make_mcp_request "resources/read" '{
  "uri": "invalid://resource"
}' 30 | pretty_json
echo

echo "6b. Malformed URI:"
make_mcp_request "resources/read" '{
  "uri": "not-a-valid-uri"
}' 31 | pretty_json
echo

echo "6c. Missing URI parameter:"
make_mcp_request "resources/read" '{}' 32 | pretty_json
echo

# Step 7: Resource Metadata Exploration
log_step "7. Exploring Resource Metadata..."

log_info "Resources provide rich metadata including:"
echo "  • MIME types for content negotiation"
echo "  • Descriptions for user understanding"
echo "  • Template patterns for dynamic resources"
echo "  • Completion support for resource URIs"
echo

log_success "Resources testing complete!"
echo
echo "=== Summary ==="
echo "✅ Static Resources: Configuration and server info"
echo "✅ Dynamic Resources: User profiles and repositories"
echo "✅ Template Patterns: Complex URI handling"
echo "✅ Error Handling: Invalid and malformed URIs"
echo "✅ Metadata: Rich resource descriptions"
echo 