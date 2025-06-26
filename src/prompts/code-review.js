import { z } from "zod";

export const codeReviewPrompt = {
  name: "code-review",
  description: "Systematic code review and quality assessment guide",
  arguments: {
    scope: z.enum(['full', 'changes', 'specific']).describe("Review scope - full codebase, recent changes, or specific files"),
    focus: z.enum(['quality', 'security', 'performance', 'maintainability', 'all']).describe("Review focus area"),
    filePattern: z.string().optional().describe("Specific file pattern to review (e.g., '*.js', '*.json')")
  },
  handler: async ({ scope, focus, filePattern }) => {
    const reviewGuide = `
## Code Review Guide

### 🔍 Review Configuration
**Scope:** ${scope.toUpperCase()}
**Focus:** ${focus.toUpperCase()}
${filePattern ? `**File Pattern:** ${filePattern}` : ''}

### 📋 Pre-Review Setup

**Step 1: Project Understanding**
- Access \`info://server\` for server architecture details
- Access \`config://app\` for application configuration
- Use \`list-files\` with "*" to understand project structure

**Step 2: File Analysis**
${scope === 'full' ? `
- Review all JavaScript files: \`list-files\` with "*.js"
- Check configuration files: \`list-files\` with "*.json"
- Examine documentation: \`list-files\` with "*.md"
- Review scripts: \`list-files\` with "*.sh"
` : scope === 'specific' && filePattern ? `
- Focus on specific pattern: \`list-files\` with "${filePattern}"
- Analyze related configuration files
- Check documentation for affected areas
` : `
- Identify changed files using file listing tools
- Map dependencies and related components
- Check configuration impact
`}

### 🎯 Review Focus Areas

${focus === 'quality' || focus === 'all' ? `
#### ✅ Code Quality Assessment
**Structure and Organization:**
- [ ] Logical file and directory organization
- [ ] Consistent naming conventions
- [ ] Appropriate module separation
- [ ] Clear entry points and dependencies

**Code Standards:**
- [ ] Consistent coding style
- [ ] Proper error handling
- [ ] Meaningful variable and function names
- [ ] Appropriate comments and documentation

**Best Practices:**
- [ ] DRY (Don't Repeat Yourself) principle
- [ ] Single Responsibility Principle
- [ ] Proper abstraction levels
- [ ] Clean and readable code
` : ''}

${focus === 'security' || focus === 'all' ? `
#### 🔒 Security Review
**Configuration Security:**
- [ ] Environment variables properly handled
- [ ] No hardcoded secrets or credentials
- [ ] Secure default configurations
- [ ] Proper access controls

**Code Security:**
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS protection measures
- [ ] Authentication and authorization

**Dependencies:**
- [ ] No vulnerable dependencies
- [ ] Regular security updates
- [ ] Minimal dependency footprint
- [ ] Trusted package sources
` : ''}

${focus === 'performance' || focus === 'all' ? `
#### ⚡ Performance Review
**Code Efficiency:**
- [ ] Optimized algorithms and data structures
- [ ] Minimal resource usage
- [ ] Efficient database queries
- [ ] Proper caching strategies

**Architecture Performance:**
- [ ] Scalable design patterns
- [ ] Efficient API endpoints
- [ ] Proper session management
- [ ] Resource cleanup and memory management

**Monitoring and Metrics:**
- [ ] Performance monitoring in place
- [ ] Error tracking and logging
- [ ] Health check endpoints
- [ ] Resource utilization tracking
` : ''}

${focus === 'maintainability' || focus === 'all' ? `
#### 🔧 Maintainability Review
**Code Maintainability:**
- [ ] Clear and comprehensive documentation
- [ ] Consistent project structure
- [ ] Proper version control practices
- [ ] Comprehensive test coverage

**Development Workflow:**
- [ ] Clear build and deployment processes
- [ ] Development environment setup
- [ ] Dependency management
- [ ] Configuration management

**Long-term Sustainability:**
- [ ] Regular dependency updates
- [ ] Backward compatibility considerations
- [ ] Migration and upgrade paths
- [ ] Knowledge documentation
` : ''}

### 🔧 Review Process

**Phase 1: Discovery**
1. \`list-files\` with pattern "*" - Overall structure
2. Access \`config://app\` - Application configuration
3. Access \`info://server\` - Server information
4. \`list-files\` with "*.json" - Configuration files

**Phase 2: Code Analysis**
${filePattern ? `
- Focus on \`list-files\` with "${filePattern}"
- Analyze specific file types and patterns
- Review related configuration and documentation
` : `
- \`list-files\` with "*.js" - JavaScript implementation
- \`list-files\` with "*.md" - Documentation review  
- \`list-files\` with "*.sh" - Script and automation review
`}

**Phase 3: Quality Assessment**
- Evaluate code against quality standards
- Check for security vulnerabilities
- Assess performance implications
- Review maintainability factors

### 📊 Review Checklist

**Architecture Review:**
- [ ] Project structure is logical and scalable
- [ ] Configuration is properly organized
- [ ] Dependencies are well-managed
- [ ] Documentation is comprehensive

**Code Quality:**
- [ ] Code follows established patterns
- [ ] Error handling is consistent
- [ ] Testing coverage is adequate
- [ ] Performance is optimized

**Security Assessment:**
- [ ] No security vulnerabilities identified
- [ ] Configuration is secure
- [ ] Dependencies are up-to-date
- [ ] Access controls are proper

**Maintainability:**
- [ ] Code is well-documented
- [ ] Structure supports future changes
- [ ] Development workflow is clear
- [ ] Knowledge transfer is possible

### 📝 Review Output Template

**Summary:**
- Overall code quality assessment
- Key strengths and areas for improvement
- Priority recommendations
- Risk assessment

**Detailed Findings:**
- File-by-file analysis results
- Specific issues and recommendations
- Security concerns and mitigations
- Performance optimization opportunities

**Action Items:**
- High-priority fixes required
- Medium-priority improvements
- Long-term architectural considerations
- Documentation and process updates

### 🚀 Getting Started

**Begin your review with:**
1. \`list-files\` tool with pattern "*" to understand the project structure
2. Access \`config://app\` resource to review configuration
3. Access \`info://server\` resource for architecture details

**Then proceed with targeted file analysis based on your review scope and focus.**
`;

    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: reviewGuide
        }
      }]
    };
  }
}; 