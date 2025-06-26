import { z } from "zod";

export const weatherPlanningPrompt = {
  name: "weather-planning",
  description: "Weather-based activity and travel planning assistant",
  arguments: {
    cities: z.string().describe("Comma-separated list of cities to check"),
    activity: z.enum(['travel', 'outdoor', 'fitness', 'general']).describe("Type of activity planning"),
    duration: z.string().optional().describe("Duration of planning (e.g., 'weekend', 'week', 'month')")
  },
  handler: async ({ cities, activity, duration }) => {
    const cityList = cities.split(',').map(city => city.trim());
    const durationText = duration || 'current conditions';
    
    const planningGuide = `
## Weather Planning Assistant

### 🌤️ Planning Overview
**Cities to check:** ${cityList.join(', ')}
**Activity type:** ${activity.toUpperCase()}
**Planning duration:** ${durationText}

### 📋 Weather Check Sequence
${cityList.map((city, index) => `
${index + 1}. **${city}**
   - Use \`fetch-weather\` tool with city: "${city}"
   - Note temperature and conditions
   - Evaluate suitability for ${activity} activities`).join('')}

### 🎯 Activity-Specific Recommendations

${activity === 'travel' ? `
#### ✈️ Travel Planning
**Weather Considerations:**
- Temperature ranges for packing decisions
- Precipitation likelihood for itinerary planning
- Seasonal weather patterns for timing
- Comparison between destinations

**Decision Factors:**
- Best weather windows for sightseeing
- Indoor vs outdoor activity balance
- Transportation weather impacts
- Seasonal clothing requirements
` : ''}

${activity === 'outdoor' ? `
#### 🏞️ Outdoor Activity Planning
**Weather Suitability:**
- Temperature comfort ranges
- Precipitation and wind conditions
- Visibility and safety factors
- Equipment and clothing needs

**Activity Recommendations:**
- Hiking, cycling, sports feasibility
- Photography and nature activities
- Camping and outdoor events
- Water sports and beach activities
` : ''}

${activity === 'fitness' ? `
#### 💪 Fitness Activity Planning
**Exercise Considerations:**
- Outdoor vs indoor workout decisions
- Running and cycling conditions
- Heat/cold safety precautions
- Hydration and gear requirements

**Workout Adaptations:**
- Weather-appropriate exercise intensity
- Alternative indoor options
- Seasonal fitness routines
- Equipment and safety gear
` : ''}

${activity === 'general' ? `
#### 📅 General Activity Planning
**Daily Planning:**
- Commute and transportation impacts
- Clothing and preparation needs
- Event and meeting considerations
- Recreational activity options

**Lifestyle Adaptations:**
- Work-from-home vs office decisions
- Social and outdoor event planning
- Shopping and errand timing
- Health and comfort considerations
` : ''}

### 🔧 Tool Usage Instructions

**Step 1: Weather Data Collection**
${cityList.map(city => `- \`fetch-weather\` with city: "${city}"`).join('\n')}

**Step 2: Comparative Analysis**
- Compare temperature ranges across cities
- Evaluate precipitation patterns
- Assess overall conditions for ${activity}

**Step 3: Decision Making**
- Rank cities by weather suitability
- Identify optimal timing windows
- Plan weather-contingent alternatives

### 📊 Evaluation Criteria

**Temperature Suitability:**
- Ideal range for ${activity} activities
- Extreme weather considerations
- Seasonal appropriateness

**Precipitation Impact:**
- Rain/snow likelihood and intensity
- Indoor alternative availability
- Equipment and preparation needs

**Overall Conditions:**
- Wind, humidity, visibility factors
- Air quality considerations
- Safety and comfort levels

### 💡 Planning Tips

**Multi-City Comparison:**
- Create weather comparison matrix
- Identify best and worst conditions
- Plan flexible itineraries

**Timing Optimization:**
- Consider weather windows
- Plan backup activities
- Monitor forecast changes

**Preparation Checklist:**
- Weather-appropriate clothing
- Activity-specific equipment
- Safety and emergency preparations
- Alternative indoor options

**Next Step:** Start by checking weather for ${cityList[0]} using the \`fetch-weather\` tool, then proceed through the remaining cities for comparison.
`;

    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: planningGuide
        }
      }]
    };
  }
}; 