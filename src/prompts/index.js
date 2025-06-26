// Export all prompts
export { healthAssessmentPrompt } from './health-assessment.js';
export { projectAnalysisPrompt } from './project-analysis.js';
export { weatherPlanningPrompt } from './weather-planning.js';
export { codeReviewPrompt } from './code-review.js';
export { onboardingPrompt } from './onboarding.js';

import { healthAssessmentPrompt } from './health-assessment.js';
import { projectAnalysisPrompt } from './project-analysis.js';
import { weatherPlanningPrompt } from './weather-planning.js';
import { codeReviewPrompt } from './code-review.js';
import { onboardingPrompt } from './onboarding.js';

/**
 * Register all prompts with the MCP server
 */
export function registerAllPrompts(server) {
  const prompts = [
    healthAssessmentPrompt,
    projectAnalysisPrompt,
    weatherPlanningPrompt,
    codeReviewPrompt,
    onboardingPrompt
  ];
  
  prompts.forEach(prompt => {
    server.prompt(
      prompt.name,
      prompt.description,
      prompt.arguments,
      prompt.handler
    );
  });
  
  console.log(`Registered ${prompts.length} prompts: ${prompts.map(p => p.name).join(', ')}`);
} 