#!/bin/bash

# MCP Server Tools Examples
# Test all available tools with various scenarios

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Setup
setup_example "Tools"

# Step 1: List available tools
log_step "1. Listing available tools..."
make_mcp_request "tools/list" "{}" 2 | pretty_json
echo

# Step 2: BMI Calculator Examples
log_step "2. Testing BMI Calculator..."

echo "2a. Normal weight example:"
make_mcp_request "tools/call" '{
  "name": "calculate-bmi",
  "arguments": {
    "weightKg": 70,
    "heightM": 1.75
  }
}' 3 | pretty_json
echo

echo "2b. Underweight example:"
make_mcp_request "tools/call" '{
  "name": "calculate-bmi",
  "arguments": {
    "weightKg": 45,
    "heightM": 1.75
  }
}' 4 | pretty_json
echo

echo "2c. Overweight example:"
make_mcp_request "tools/call" '{
  "name": "calculate-bmi",
  "arguments": {
    "weightKg": 85,
    "heightM": 1.75
  }
}' 5 | pretty_json
echo

echo "2d. Obese example:"
make_mcp_request "tools/call" '{
  "name": "calculate-bmi",
  "arguments": {
    "weightKg": 100,
    "heightM": 1.75
  }
}' 6 | pretty_json
echo

# Step 3: Weather Fetcher Examples
log_step "3. Testing Weather Fetcher..."

cities=("London" "Paris" "Tokyo" "New York" "Sydney")
id=7

for city in "${cities[@]}"; do
    echo "3${id:6:1}. Weather in $city:"
    make_mcp_request "tools/call" "{
      \"name\": \"fetch-weather\",
      \"arguments\": {
        \"city\": \"$city\"
      }
    }" $id | pretty_json
    echo
    ((id++))
done

# Step 4: File Listing Examples
log_step "4. Testing File Lister..."

patterns=("*.js" "*.json" "*.md" "*.sh" "*")
declare -a pattern_names=("JavaScript files" "JSON files" "Markdown files" "Shell scripts" "All files")

for i in "${!patterns[@]}"; do
    pattern="${patterns[$i]}"
    name="${pattern_names[$i]}"
    
    echo "4$((i+1)). Listing $name ($pattern):"
    make_mcp_request "tools/call" "{
      \"name\": \"list-files\",
      \"arguments\": {
        \"pattern\": \"$pattern\"
      }
    }" $((id+i)) | pretty_json
    echo
done

# Step 5: Error Handling Examples
log_step "5. Testing Error Handling..."

echo "5a. Invalid tool name:"
make_mcp_request "tools/call" '{
  "name": "non-existent-tool",
  "arguments": {}
}' 20 | pretty_json
echo

echo "5b. Missing required parameters:"
make_mcp_request "tools/call" '{
  "name": "calculate-bmi",
  "arguments": {
    "weightKg": 70
  }
}' 21 | pretty_json
echo

echo "5c. Invalid parameter types:"
make_mcp_request "tools/call" '{
  "name": "calculate-bmi",
  "arguments": {
    "weightKg": "not-a-number",
    "heightM": 1.75
  }
}' 22 | pretty_json
echo

log_success "Tools testing complete!"
echo
echo "=== Summary ==="
echo "✅ BMI Calculator: Tested all weight categories"
echo "✅ Weather Fetcher: Tested multiple cities"
echo "✅ File Lister: Tested various file patterns"
echo "✅ Error Handling: Tested invalid inputs"
echo 