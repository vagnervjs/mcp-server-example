import { z } from "zod";

// BMI categories for health classification
const BMI_CATEGORIES = {
  UNDERWEIGHT: 'Underweight',
  NORMAL: 'Normal weight', 
  OVERWEIGHT: 'Overweight',
  OBESE: 'Obese'
};

/**
 * Determines BMI category based on BMI value
 */
function getBmiCategory(bmi) {
  if (bmi < 18.5) return BMI_CATEGORIES.UNDERWEIGHT;
  if (bmi < 25) return BMI_CATEGORIES.NORMAL;
  if (bmi < 30) return BMI_CATEGORIES.OVERWEIGHT;
  return BMI_CATEGORIES.OBESE;
}

export const calculateBmiTool = {
  name: "calculate-bmi",
  config: {
    title: "BMI Calculator",
    description: "Calculate Body Mass Index from weight and height",
    inputSchema: {
      weightKg: z.number().positive().describe("Weight in kilograms"),
      heightM: z.number().positive().describe("Height in meters")
    }
  },
  handler: async ({ weightKg, heightM }) => {
    const bmi = weightKg / (heightM * heightM);
    const category = getBmiCategory(bmi);
    
    return {
      content: [{
        type: "text",
        text: `BMI: ${bmi.toFixed(2)} - Category: ${category}`
      }]
    };
  }
};