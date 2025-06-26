import { z } from "zod";

export const fetchWeatherTool = {
  name: "fetch-weather",
  config: {
    title: "Weather Fetcher",
    description: "Get weather information for a city",
    inputSchema: {
      city: z.string().min(1).describe("Name of the city")
    }
  },
  handler: async ({ city }) => {
    const temperature = Math.floor(Math.random() * 30) + 5; // 5-35°C
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly cloudy'][Math.floor(Math.random() * 4)];
    
    return {
      content: [{
        type: "text",
        text: `Weather in ${city}: ${temperature}°C, ${conditions}`
      }]
    };
  }
}; 