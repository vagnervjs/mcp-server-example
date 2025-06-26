import { z } from "zod";

export const projectAnalysisPrompt = {
  name: "project-analysis",
  description: "Comprehensive project analysis and codebase exploration",
  arguments: {
    focus: z.enum(['overview', 'structure', 'config', 'all']).describe("Analysis focus area"),
    fileTypes: z.string().optional().describe("Specific file types to analyze (e.g., 'js,json,md')")
  },
  handler: async ({ focus, fileTypes }) => {
    const analysisGuide = `
## Project Analysis Guide

### Analysis Focus: ${focus.toUpperCase()}

${focus === 'overview' || focus === 'all' ? `
### 📋 Project Overview
**Step 1: Get Project Structure**
- Use \`list-files\` tool with pattern "*" to see all files
- Review the overall project organization
- Identify main directories and file types

**Step 2: Configuration Analysis**
- Access \`config://app\` resource for application settings
- Access \`info://server\` resource for server information
- Review configuration files using \`list-files\` with pattern "*.json"
` : ''}

${focus === 'structure' || focus === 'all' ? `
### 🏗️ Code Structure Analysis
**File Type Analysis:**
${fileTypes ? `
- Focus on specified types: ${fileTypes}
- Use \`list-files\` with patterns: ${fileTypes.split(',').map(type => `"*.${type.trim()}"`).join(', ')}
` : `
- JavaScript files: Use \`list-files\` with pattern "*.js"
- Configuration files: Use \`list-files\` with pattern "*.json"
- Documentation: Use \`list-files\` with pattern "*.md"
- Scripts: Use \`list-files\` with pattern "*.sh"
`}

**Architecture Understanding:**
- Identify entry points and main modules
- Map component relationships
- Understand build and deployment structure
` : ''}

${focus === 'config' || focus === 'all' ? `
### ⚙️ Configuration Deep Dive  
**Server Configuration:**
- Access \`config://app\` for application configuration
- Access \`info://server\` for runtime information
- Review environment-specific settings

**Project Configuration:**
- List configuration files: \`list-files\` with "*.json"
- Analyze package.json, tsconfig.json, etc.
- Understand build and development setup
` : ''}

### 🔧 Recommended Tool Sequence:

1. **Project Overview**: \`list-files\` with pattern "*"
2. **Server Info**: Access \`info://server\` resource
3. **Configuration**: Access \`config://app\` resource
4. **Specific Files**: Use \`list-files\` with targeted patterns
5. **Documentation**: \`list-files\` with pattern "*.md"

### 📊 Analysis Checklist:
- [ ] Overall project structure understood
- [ ] Configuration files reviewed
- [ ] Main entry points identified
- [ ] Dependencies and tools catalogued
- [ ] Documentation coverage assessed
- [ ] Build and deployment process understood

### 💡 Next Steps:
After running the analysis tools, you'll have a comprehensive understanding of:
- Project architecture and organization
- Available functionality and features
- Configuration and deployment setup
- Development workflow and tools
- Documentation and maintenance status

**Start with:** \`list-files\` tool using pattern "*" to get the full project overview.
`;

    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: analysisGuide
        }
      }]
    };
  }
}; 