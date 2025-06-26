import { z } from "zod";

export const healthAssessmentPrompt = {
  name: "health-assessment",
  description: "Comprehensive health assessment with BMI calculation and activity recommendations",
  arguments: {
    weight: z.string().describe("Weight in kilograms"),
    height: z.string().describe("Height in meters"),
    city: z.string().min(1).describe("City for weather-based activity recommendations"),
    goals: z.string().optional().describe("Health or fitness goals (optional)")
  },
  handler: async ({ weight, height, city, goals }) => {
    // Convert string arguments to numbers for calculations
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    
    const bmiAnalysis = `
## Personal Health Assessment

### BMI Analysis
Based on your weight of ${weightNum}kg and height of ${heightNum}m:

**Next Steps:**
1. Calculate your BMI using the BMI calculator tool
2. Check current weather in ${city} for activity planning
3. Get personalized recommendations based on results

### Recommended Actions:
- **BMI Calculation**: Use the calculate-bmi tool with weightKg: ${weightNum}, heightM: ${heightNum}
- **Weather Check**: Use the fetch-weather tool with city: "${city}"
- **Activity Planning**: Based on BMI category and weather conditions

### Health Goals
${goals ? `Your stated goals: ${goals}` : 'No specific goals provided - general health maintenance recommended'}

### Follow-up Recommendations:
- Monitor BMI regularly
- Adjust activities based on weather conditions
- Consider outdoor activities when weather permits
- Maintain consistent exercise routine regardless of weather

**Tools to use:**
1. \`calculate-bmi\` - Get your BMI and health category
2. \`fetch-weather\` - Check weather conditions in ${city}
3. \`config://app\` - Access server configuration for additional health features
`;

    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: bmiAnalysis
        }
      }]
    };
  }
}; 