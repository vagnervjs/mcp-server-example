#!/bin/bash

# MCP Server Prompts Examples
# Test all available prompts with various parameter combinations

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Setup
setup_example "Prompts"

# Step 1: List available prompts
log_step "1. Listing available prompts..."
make_mcp_request "prompts/list" "{}" 2 | pretty_json
echo

# Step 2: Health Assessment Prompt
log_step "2. Testing Health Assessment Prompt..."

echo "2a. Basic health assessment:"
make_mcp_request "prompts/get" '{
  "name": "health-assessment",
  "arguments": {
    "weight": "70",
    "height": "1.75",
    "city": "London"
  }
}' 3 | format_prompt_text 25
echo "... (truncated for brevity) ..."
echo

echo "2b. Health assessment with goals:"
make_mcp_request "prompts/get" '{
  "name": "health-assessment",
  "arguments": {
    "weight": "85",
    "height": "1.80",
    "city": "Paris",
    "goals": "lose weight and improve fitness"
  }
}' 4 | format_prompt_text 20
echo "... (truncated for brevity) ..."
echo

echo "2c. Health assessment for different body type:"
make_mcp_request "prompts/get" '{
  "name": "health-assessment",
  "arguments": {
    "weight": "55",
    "height": "1.65",
    "city": "Tokyo",
    "goals": "build muscle and gain weight"
  }
}' 5 | format_prompt_text 15
echo "... (truncated for brevity) ..."
echo

# Step 3: Project Analysis Prompt
log_step "3. Testing Project Analysis Prompt..."

echo "3a. Project overview analysis:"
make_mcp_request "prompts/get" '{
  "name": "project-analysis",
  "arguments": {
    "focus": "overview"
  }
}' 6 | format_prompt_text 20
echo "... (truncated for brevity) ..."
echo

echo "3b. Code structure analysis:"
make_mcp_request "prompts/get" '{
  "name": "project-analysis",
  "arguments": {
    "focus": "structure",
    "fileTypes": "js,json,md"
  }
}' 7 | format_prompt_text 15
echo "... (truncated for brevity) ..."
echo

echo "3c. Configuration analysis:"
make_mcp_request "prompts/get" '{
  "name": "project-analysis",
  "arguments": {
    "focus": "config",
    "fileTypes": "json,yaml,env"
  }
}' 8 | format_prompt_text 15
echo "... (truncated for brevity) ..."
echo

# Step 4: Weather Planning Prompt
log_step "4. Testing Weather Planning Prompt..."

echo "4a. Travel planning:"
make_mcp_request "prompts/get" '{
  "name": "weather-planning",
  "arguments": {
    "cities": "London, Paris, Tokyo",
    "activity": "travel",
    "duration": "weekend"
  }
}' 9 | format_prompt_text 20
echo "... (truncated for brevity) ..."
echo

echo "4b. Outdoor activity planning:"
make_mcp_request "prompts/get" '{
  "name": "weather-planning",
  "arguments": {
    "cities": "Berlin, Amsterdam, Copenhagen",
    "activity": "outdoor"
  }
}' 10 | format_prompt_text 15
echo "... (truncated for brevity) ..."
echo

echo "4c. Fitness planning:"
make_mcp_request "prompts/get" '{
  "name": "weather-planning",
  "arguments": {
    "cities": "New York, Boston",
    "activity": "fitness",
    "duration": "week"
  }
}' 11 | format_prompt_text 15
echo "... (truncated for brevity) ..."
echo

# Step 5: Code Review Prompt
log_step "5. Testing Code Review Prompt..."

echo "5a. Full code review with quality focus:"
make_mcp_request "prompts/get" '{
  "name": "code-review",
  "arguments": {
    "scope": "full",
    "focus": "quality"
  }
}' 12 | format_prompt_text 20
echo "... (truncated for brevity) ..."
echo

echo "5b. Security-focused review:"
make_mcp_request "prompts/get" '{
  "name": "code-review",
  "arguments": {
    "scope": "changes",
    "focus": "security",
    "filePattern": "*.js"
  }
}' 13 | format_prompt_text 15
echo "... (truncated for brevity) ..."
echo

echo "5c. Performance review:"
make_mcp_request "prompts/get" '{
  "name": "code-review",
  "arguments": {
    "scope": "specific",
    "focus": "performance",
    "filePattern": "src/server/*.js"
  }
}' 14 | format_prompt_text 15
echo "... (truncated for brevity) ..."
echo

# Step 6: Onboarding Prompt
log_step "6. Testing Onboarding Prompt..."

echo "6a. Developer onboarding (intermediate):"
make_mcp_request "prompts/get" '{
  "name": "onboarding",
  "arguments": {
    "role": "developer",
    "experience": "intermediate",
    "focus": "testing and automation"
  }
}' 15 | format_prompt_text 25
echo "... (truncated for brevity) ..."
echo

echo "6b. Admin onboarding (expert):"
make_mcp_request "prompts/get" '{
  "name": "onboarding",
  "arguments": {
    "role": "admin",
    "experience": "expert"
  }
}' 16 | format_prompt_text 20
echo "... (truncated for brevity) ..."
echo

echo "6c. User onboarding (beginner):"
make_mcp_request "prompts/get" '{
  "name": "onboarding",
  "arguments": {
    "role": "user",
    "experience": "beginner",
    "focus": "basic usage and getting started"
  }
}' 17 | format_prompt_text 20
echo "... (truncated for brevity) ..."
echo

echo "6d. Reviewer onboarding (intermediate):"
make_mcp_request "prompts/get" '{
  "name": "onboarding",
  "arguments": {
    "role": "reviewer",
    "experience": "intermediate",
    "focus": "code quality and security"
  }
}' 18 | format_prompt_text 15
echo "... (truncated for brevity) ..."
echo

# Step 7: Error Handling
log_step "7. Testing Error Handling..."

echo "7a. Invalid prompt name:"
make_mcp_request "prompts/get" '{
  "name": "non-existent-prompt",
  "arguments": {}
}' 30 | pretty_json
echo

echo "7b. Missing required parameters:"
make_mcp_request "prompts/get" '{
  "name": "health-assessment",
  "arguments": {
    "weight": "70"
  }
}' 31 | pretty_json
echo

echo "7c. Invalid parameter values:"
make_mcp_request "prompts/get" '{
  "name": "project-analysis",
  "arguments": {
    "focus": "invalid-focus"
  }
}' 32 | pretty_json
echo

log_success "Prompts testing complete!"
echo
echo "=== Summary ==="
echo "✅ Health Assessment: BMI + weather planning guidance"
echo "✅ Project Analysis: Code exploration and analysis"
echo "✅ Weather Planning: Multi-city activity planning"
echo "✅ Code Review: Quality, security, and performance"
echo "✅ Onboarding: Role-based team member guidance"
echo "✅ Error Handling: Invalid prompts and parameters"
echo 