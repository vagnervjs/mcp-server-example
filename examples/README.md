# MCP Server Examples

This directory contains organized examples for testing the MCP Server functionality using cURL.

## 📁 Structure

```
examples/
├── curl/
│   ├── common.sh      # Shared utilities and functions
│   ├── tools.sh       # Tools testing examples
│   ├── resources.sh   # Resources testing examples
│   ├── prompts.sh     # Prompts testing examples
│   └── all.sh         # Complete test suite
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- MCP server running on `localhost:3000`
- `curl` installed
- `jq` installed (optional, for pretty JSON formatting)

### Start the server
```bash
npm start
```

### Run examples

**Individual functionality testing:**
```bash
# Test tools only
./examples/curl/tools.sh

# Test resources only
./examples/curl/resources.sh

# Test prompts only
./examples/curl/prompts.sh
```

**Complete test suite:**
```bash
# Run all tests in sequence
./examples/curl/all.sh
```

## 📋 What Each Script Tests

### 🔧 Tools (`tools.sh`)
- **BMI Calculator**: All weight categories (underweight, normal, overweight, obese)
- **Weather Fetcher**: Multiple cities worldwide
- **File Lister**: Various file patterns and types
- **Error Handling**: Invalid tools, missing parameters, wrong types

### 📚 Resources (`resources.sh`)
- **Static Resources**: Application config and server info
- **Dynamic Resources**: User profiles and GitHub repositories
- **Template Patterns**: Complex URI handling with special characters
- **Error Handling**: Invalid URIs and malformed requests

### 🎯 Prompts (`prompts.sh`)
- **Health Assessment**: BMI calculation with weather-based recommendations
- **Project Analysis**: Code exploration and analysis guidance
- **Weather Planning**: Multi-city activity planning for different purposes
- **Code Review**: Quality, security, and performance review guides
- **Onboarding**: Role-based team member guidance
- **Error Handling**: Invalid prompts and parameter validation

### 🎭 Complete Suite (`all.sh`)
- Runs all individual scripts in sequence
- Tests session isolation between different functionality areas
- Provides comprehensive verification of all MCP Server capabilities

## 🔧 Common Utilities (`common.sh`)

The shared utilities provide:

- **Colored logging**: Info, success, warning, error messages
- **Server health checks**: Verify server is running before testing
- **Session management**: Initialize, manage, and cleanup MCP sessions
- **Request helpers**: Simplified MCP request functions
- **Output formatting**: Pretty JSON and prompt text formatting

### Key Functions:
- `setup_example()` - Initialize testing environment
- `make_mcp_request()` - Send MCP protocol requests
- `pretty_json()` - Format JSON responses
- `format_prompt_text()` - Extract and format prompt content

## 🎨 Output Features

- **Color-coded messages**: Easy to distinguish different types of output
- **Progress indicators**: Clear step-by-step execution
- **Truncated output**: Prompt responses are limited to relevant portions
- **Error handling**: Graceful failure with helpful error messages
- **Session cleanup**: Automatic cleanup on script exit

## 📊 Example Usage

```bash
# Quick tools test
./examples/curl/tools.sh

# Expected output:
# === MCP Server Tools Examples ===
# ✅ Server is running at http://localhost:3000
# ✅ Session initialized: 12345678...
# 
# 🔄 1. Listing available tools...
# {
#   "jsonrpc": "2.0",
#   "id": 2,
#   "result": {
#     "tools": [...]
#   }
# }
# ...
```

## 🔍 Troubleshooting

**Server not running:**
```
❌ Server is not running at http://localhost:3000
ℹ️  Please start the server with: npm start
```

**Missing jq (optional):**
- Scripts work without `jq` but JSON won't be pretty-printed
- Install with: `brew install jq` (macOS) or `apt-get install jq` (Ubuntu)

**Permission errors:**
```bash
chmod +x examples/curl/*.sh
```

## 🎯 Integration with npm Scripts

The examples integrate with the project's npm scripts:

```bash
# Run manual tests (uses the complete suite)
npm run test:manual

# This executes: ./examples/curl/all.sh
```

## 📝 Customization

You can customize the examples by:

1. **Modifying server URL**: Edit `SERVER_URL` in `common.sh`
2. **Adding new test cases**: Extend individual scripts with more examples
3. **Creating new scripts**: Use `common.sh` utilities for consistency
4. **Adjusting output**: Modify `format_prompt_text()` line limits

## 🤝 Contributing

When adding new examples:

1. Use the shared `common.sh` utilities
2. Follow the existing naming and structure patterns
3. Include error handling examples
4. Add appropriate logging and output formatting
5. Update this README with new functionality

---

**Note**: These examples demonstrate the full MCP Server capabilities and serve as both testing tools and documentation for API usage patterns. 