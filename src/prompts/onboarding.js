import { z } from "zod";

export const onboardingPrompt = {
  name: "onboarding",
  description: "Comprehensive onboarding guide for new team members and users",
  arguments: {
    role: z.enum(['developer', 'user', 'admin', 'reviewer']).describe("Role of the person being onboarded"),
    experience: z.enum(['beginner', 'intermediate', 'expert']).describe("Experience level with similar systems"),
    focus: z.string().optional().describe("Specific areas of interest or responsibility")
  },
  handler: async ({ role, experience, focus }) => {
    const onboardingGuide = `
## Welcome! Onboarding Guide

### 👋 Getting Started
**Role:** ${role.toUpperCase()}
**Experience Level:** ${experience.toUpperCase()}
${focus ? `**Focus Areas:** ${focus}` : ''}

### 🎯 Onboarding Path for ${role.charAt(0).toUpperCase() + role.slice(1)}

${role === 'developer' ? `
#### 💻 Developer Onboarding

**Phase 1: System Understanding (30 minutes)**
1. **Project Overview**
   - Use \`list-files\` with "*" to see the complete project structure
   - Access \`info://server\` to understand the server architecture
   - Access \`config://app\` to review application configuration

2. **Code Architecture**
   - Use \`list-files\` with "*.js" to explore JavaScript implementation
   - Use \`list-files\` with "*.json" to understand configuration files
   - Use \`list-files\` with "*.md" to read documentation

**Phase 2: Development Environment (15 minutes)**
- Review package.json and dependencies
- Understand build and test scripts
- Set up local development environment
- Test basic functionality

**Phase 3: Code Deep Dive (45 minutes)**
- Explore tools implementation in src/tools/
- Understand resource management in src/resources/
- Review server configuration and setup
- Understand session management and HTTP handling

${experience === 'beginner' ? `
**Beginner-Specific Steps:**
- Start with basic tool testing (BMI calculator)
- Use simple weather API calls to understand flow
- Focus on understanding one component at a time
- Ask questions about unfamiliar patterns
` : experience === 'intermediate' ? `
**Intermediate-Specific Steps:**
- Focus on architecture patterns and design decisions
- Understand MCP protocol implementation
- Review error handling and edge cases
- Explore testing strategies and coverage
` : `
**Expert-Specific Steps:**
- Evaluate architectural decisions and trade-offs
- Identify optimization opportunities
- Review security implementations
- Consider scalability and performance aspects
`}
` : ''}

${role === 'user' ? `
#### 👤 User Onboarding

**Phase 1: System Introduction (15 minutes)**
1. **Understanding Available Features**
   - Access \`info://server\` to see what the system provides
   - Access \`config://app\` to understand available features
   - Use the available prompts for guidance

2. **Basic Tool Usage**
   - Try the BMI calculator with sample data
   - Test weather information for your city
   - Explore file listing capabilities

**Phase 2: Practical Usage (20 minutes)**
- Calculate your personal BMI
- Check weather for places you care about
- Understand how to combine different tools
- Practice with example prompts

${experience === 'beginner' ? `
**Getting Started Tips:**
- Start with simple, single-tool requests
- Use the prompt examples as templates
- Don't worry about complex scenarios initially
- Ask for help when commands don't work as expected
` : `
**Advanced Usage:**
- Explore multi-tool workflows
- Create custom prompt combinations
- Understand resource access patterns
- Experiment with complex scenarios
`}
` : ''}

${role === 'admin' ? `
#### ⚙️ Administrator Onboarding

**Phase 1: System Architecture (20 minutes)**
1. **Infrastructure Understanding**
   - Access \`info://server\` for server details and capabilities
   - Access \`config://app\` for application configuration
   - Use \`list-files\` with "*.json" to review all configuration files

2. **Security and Access**
   - Review session management implementation
   - Understand authentication and authorization
   - Check security configurations and best practices

**Phase 2: Operations and Monitoring (25 minutes)**
- Understand health check endpoints
- Review logging and error handling
- Test session management and cleanup
- Verify resource access controls

**Phase 3: Maintenance and Scaling (15 minutes)**
- Review deployment configurations
- Understand backup and recovery procedures
- Plan for scaling and performance optimization
- Document operational procedures

${experience === 'expert' ? `
**Expert Administrator Focus:**
- Evaluate security posture and compliance
- Plan for high availability and disaster recovery
- Optimize performance and resource utilization
- Implement advanced monitoring and alerting
` : `
**Standard Administrator Tasks:**
- Monitor system health and performance
- Manage user access and permissions
- Perform regular maintenance and updates
- Respond to operational issues
`}
` : ''}

${role === 'reviewer' ? `
#### 🔍 Code Reviewer Onboarding

**Phase 1: Review Standards (15 minutes)**
1. **Code Quality Standards**
   - Use \`list-files\` with "*.js" to understand code structure
   - Access \`config://app\` to understand configuration standards
   - Review documentation patterns and requirements

2. **Review Process**
   - Understand testing requirements and coverage
   - Learn security review checklist
   - Know performance and scalability considerations

**Phase 2: Review Tools and Process (20 minutes)**
- Practice using file listing for code discovery
- Understand how to access server information
- Learn to evaluate configuration changes
- Practice systematic review methodology

${experience === 'expert' ? `
**Expert Reviewer Focus:**
- Architectural decision evaluation
- Security vulnerability assessment
- Performance impact analysis
- Long-term maintainability considerations
` : `
**Standard Review Process:**
- Code quality and standards compliance
- Functional correctness verification
- Basic security and performance checks
- Documentation and testing adequacy
`}
` : ''}

### 🔧 Essential Tools to Master

**Core Tools:**
1. **\`list-files\`** - Project exploration and file discovery
   - Pattern: "*" for complete overview
   - Pattern: "*.js" for code files
   - Pattern: "*.json" for configuration
   - Pattern: "*.md" for documentation

2. **\`calculate-bmi\`** - Example tool for understanding API patterns
   - Parameters: weightKg (number), heightM (number)
   - Good for testing basic functionality

3. **\`fetch-weather\`** - External API simulation
   - Parameter: city (string)
   - Demonstrates data fetching patterns

**Core Resources:**
1. **\`config://app\`** - Application configuration and features
2. **\`info://server\`** - Server architecture and capabilities
3. **Available Prompts** - Use health-assessment, project-analysis, weather-planning, code-review, and onboarding prompts
4. **\`users://{id}/profile\`** - Dynamic resource examples
5. **\`github://repos/{owner}/{repo}\`** - External data integration

### 📚 Learning Path by Experience Level

${experience === 'beginner' ? `
#### 🌱 Beginner Path (2-3 hours total)
**Week 1: Basics**
- Day 1: System overview and basic tool usage (30 min)
- Day 2: Simple prompt practice (30 min)
- Day 3: Resource exploration (30 min)
- Day 4: Combining tools (30 min)
- Day 5: Review and questions (30 min)

**Week 2: Building Confidence**
- Practice daily with different scenarios
- Try all available tools and resources
- Ask questions and get help
- Start creating your own prompts
` : experience === 'intermediate' ? `
#### 🚀 Intermediate Path (1-2 hours total)
**Day 1: System Deep Dive (45 min)**
- Complete architecture understanding
- Advanced tool combinations
- Resource access patterns
- Error handling and edge cases

**Day 2: Practical Application (45 min)**
- Real-world scenario practice
- Custom prompt development
- Integration with other systems
- Performance and optimization awareness
` : `
#### 🎯 Expert Path (1 hour total)
**Quick Assessment (30 min)**
- Rapid system architecture review
- Security and performance evaluation
- Integration possibilities assessment
- Optimization opportunities identification

**Strategic Planning (30 min)**
- Advanced use case development
- System extension possibilities
- Integration with existing workflows
- Knowledge transfer planning
`}

### ✅ Onboarding Checklist

**System Understanding:**
- [ ] Can navigate project structure using \`list-files\`
- [ ] Understands server capabilities via \`info://server\`
- [ ] Knows application configuration via \`config://app\`
- [ ] Has reviewed documentation and examples

**Tool Proficiency:**
- [ ] Can use BMI calculator correctly
- [ ] Can fetch weather for different cities
- [ ] Can list and find specific files
- [ ] Understands resource access patterns

**Role-Specific Competency:**
${role === 'developer' ? `
- [ ] Can set up development environment
- [ ] Understands code architecture and patterns
- [ ] Can run tests and verify functionality
- [ ] Knows how to extend and modify system
` : role === 'user' ? `
- [ ] Can perform common tasks independently
- [ ] Knows how to get help when needed
- [ ] Understands system capabilities and limitations
- [ ] Can create effective prompts for tasks
` : role === 'admin' ? `
- [ ] Can monitor system health and performance
- [ ] Understands security and access controls
- [ ] Can perform maintenance and updates
- [ ] Knows troubleshooting procedures
` : `
- [ ] Can perform systematic code reviews
- [ ] Understands quality and security standards
- [ ] Can evaluate architectural decisions
- [ ] Knows escalation procedures for issues
`}

### 🚀 Next Steps

**Immediate Actions:**
1. Start with \`list-files\` using pattern "*" to explore the system
2. Access \`info://server\` to understand capabilities
3. Review \`config://app\` for configuration details
4. Try basic tool operations to build confidence

**This Week:**
- Complete the onboarding checklist for your role
- Practice with different tools and scenarios
- Ask questions and seek clarification
- Document your learning and insights

**Ongoing Development:**
- Regular practice with new scenarios
- Stay updated with system changes
- Share knowledge with other team members
- Contribute to documentation and examples

**Ready to begin? Start by exploring the project structure with \`list-files\` pattern "*"**
`;

    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: onboardingGuide
        }
      }]
    };
  }
}; 