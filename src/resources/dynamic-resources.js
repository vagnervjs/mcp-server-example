import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

export const dynamicResources = [
  {
    name: "user-profile",
    template: new ResourceTemplate("users://{userId}/profile", { list: undefined }),
    metadata: {
      title: "User Profile",
      description: "User profile information by ID"
    },
    handler: async (uri, args) => {
      const { userId } = args;
      
      // Mock user data
      const userData = {
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        createdAt: new Date().toISOString(),
        preferences: {
          theme: "dark",
          notifications: true
        }
      };
      
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(userData, null, 2)
        }]
      };
    }
  },
  
  {
    name: "repository",
    template: new ResourceTemplate("github://repos/{owner}/{repo}", { list: undefined }),
    metadata: {
      title: "GitHub Repository",
      description: "Repository information from GitHub"
    },
    handler: async (uri, args) => {
      const { owner, repo } = args;
      
      // Mock repository data
      const repoData = {
        fullName: `${owner}/${repo}`,
        owner: { login: owner },
        name: repo,
        description: `Repository ${repo} owned by ${owner}`,
        language: "JavaScript",
        stars: Math.floor(Math.random() * 10000),
        forks: Math.floor(Math.random() * 1000),
        lastUpdated: new Date().toISOString()
      };
      
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(repoData, null, 2)
        }]
      };
    }
  }
]; 