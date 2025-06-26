#!/bin/bash

# MCP Server Complete Examples
# Runs all example scripts in sequence

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

echo "=== MCP Server Complete Testing Suite ==="
echo

# Check if server is running
check_server || exit 1

echo
log_info "Running complete test suite..."
echo "This will test tools, resources, and prompts in sequence."
echo "Each section will use its own session for isolation."
echo

# Run individual test scripts
echo "📋 Test Plan:"
echo "  1. Tools Testing (BMI, Weather, File Listing)"
echo "  2. Resources Testing (Static & Dynamic)"
echo "  3. Prompts Testing (All 5 prompts with variations)"
echo

read -p "Press Enter to continue or Ctrl+C to cancel..."
echo

# Tools Testing
log_step "=== PHASE 1: TOOLS TESTING ==="
echo
if bash "$SCRIPT_DIR/tools.sh"; then
    log_success "Tools testing completed successfully"
else
    log_error "Tools testing failed"
    exit 1
fi

echo
echo "=================================="
echo

# Resources Testing  
log_step "=== PHASE 2: RESOURCES TESTING ==="
echo
if bash "$SCRIPT_DIR/resources.sh"; then
    log_success "Resources testing completed successfully"
else
    log_error "Resources testing failed"
    exit 1
fi

echo
echo "=================================="
echo

# Prompts Testing
log_step "=== PHASE 3: PROMPTS TESTING ==="
echo
if bash "$SCRIPT_DIR/prompts.sh"; then
    log_success "Prompts testing completed successfully"
else
    log_error "Prompts testing failed"
    exit 1
fi

echo
echo "=================================="
echo

# Final Summary
log_success "🎉 COMPLETE TEST SUITE FINISHED!"
echo
echo "=== FINAL SUMMARY ==="
echo "✅ Tools: BMI Calculator, Weather Fetcher, File Lister"
echo "✅ Resources: Static (config, info) + Dynamic (users, repos)"
echo "✅ Prompts: Health, Project Analysis, Weather Planning, Code Review, Onboarding"
echo "✅ Error Handling: Invalid inputs and edge cases"
echo "✅ Session Management: Multiple isolated sessions"
echo
echo "🔧 All MCP Server functionality verified!"
echo "📊 Ready for production use!"
echo 