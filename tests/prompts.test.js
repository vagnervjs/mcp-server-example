#!/usr/bin/env node

import { test, describe } from 'node:test';
import assert from 'node:assert';

import { healthAssessmentPrompt } from '../src/prompts/health-assessment.js';
import { projectAnalysisPrompt } from '../src/prompts/project-analysis.js';
import { weatherPlanningPrompt } from '../src/prompts/weather-planning.js';
import { codeReviewPrompt } from '../src/prompts/code-review.js';
import { onboardingPrompt } from '../src/prompts/onboarding.js';
import { registerAllPrompts } from '../src/prompts/index.js';

describe('Prompt Functionality', () => {
  test('Health Assessment Prompt - Basic Usage', async () => {
    const result = await healthAssessmentPrompt.handler({
      weight: 70,
      height: 1.75,
      city: "London"
    });
    
    assert.ok(result.messages);
    assert.ok(result.messages[0].content.text);
    assert.ok(result.messages[0].content.text.includes('Personal Health Assessment'));
    assert.ok(result.messages[0].content.text.includes('70kg'));
    assert.ok(result.messages[0].content.text.includes('1.75m'));
    assert.ok(result.messages[0].content.text.includes('London'));
    assert.ok(result.messages[0].content.text.includes('calculate-bmi'));
    assert.ok(result.messages[0].content.text.includes('fetch-weather'));
    
    console.log('✅ Health assessment prompt generates comprehensive guidance');
  });

  test('Health Assessment Prompt - With Goals', async () => {
    const result = await healthAssessmentPrompt.handler({
      weight: 85,
      height: 1.80,
      city: "Paris",
      goals: "build muscle and improve endurance"
    });
    
    assert.ok(result.messages[0].content.text.includes('build muscle and improve endurance'));
    assert.ok(result.messages[0].content.text.includes('85kg'));
    assert.ok(result.messages[0].content.text.includes('Paris'));
    
    console.log('✅ Health assessment prompt includes user goals');
  });

  test('Project Analysis Prompt - Different Focus Areas', async () => {
    const testCases = [
      { focus: 'overview', fileTypes: undefined },
      { focus: 'structure', fileTypes: 'js,json' },
      { focus: 'config', fileTypes: undefined },
      { focus: 'all', fileTypes: 'md,txt' }
    ];
    
    for (const testCase of testCases) {
      const result = await projectAnalysisPrompt.handler(testCase);
      
      assert.ok(result.messages[0].content.text.includes('Project Analysis Guide'));
      assert.ok(result.messages[0].content.text.includes(testCase.focus.toUpperCase()));
      assert.ok(result.messages[0].content.text.includes('list-files'));
      
      if (testCase.fileTypes) {
        assert.ok(result.messages[0].content.text.includes(testCase.fileTypes));
      }
    }
    
    console.log('✅ Project analysis prompt adapts to different focus areas');
  });

  test('Weather Planning Prompt - Different Activities', async () => {
    const activities = ['travel', 'outdoor', 'fitness', 'general'];
    
    for (const activity of activities) {
      const result = await weatherPlanningPrompt.handler({
        cities: "London, Paris, Tokyo",
        activity,
        duration: "weekend"
      });
      
      assert.ok(result.messages[0].content.text.includes('Weather Planning Assistant'));
      assert.ok(result.messages[0].content.text.includes(activity.toUpperCase()));
      assert.ok(result.messages[0].content.text.includes('London'));
      assert.ok(result.messages[0].content.text.includes('Paris'));
      assert.ok(result.messages[0].content.text.includes('Tokyo'));
      assert.ok(result.messages[0].content.text.includes('fetch-weather'));
      assert.ok(result.messages[0].content.text.includes('weekend'));
    }
    
    console.log('✅ Weather planning prompt handles different activity types');
  });

  test('Code Review Prompt - Scope and Focus Combinations', async () => {
    const testCombinations = [
      { scope: 'full', focus: 'quality' },
      { scope: 'changes', focus: 'security' },
      { scope: 'specific', focus: 'performance', filePattern: '*.js' },
      { scope: 'full', focus: 'all' }
    ];
    
    for (const combo of testCombinations) {
      const result = await codeReviewPrompt.handler(combo);
      
      assert.ok(result.messages[0].content.text.includes('Code Review Guide'));
      assert.ok(result.messages[0].content.text.includes(combo.scope.toUpperCase()));
      assert.ok(result.messages[0].content.text.includes(combo.focus.toUpperCase()));
      assert.ok(result.messages[0].content.text.includes('list-files'));
      
      if (combo.filePattern) {
        assert.ok(result.messages[0].content.text.includes(combo.filePattern));
      }
    }
    
    console.log('✅ Code review prompt adapts to different scope and focus combinations');
  });

  test('Onboarding Prompt - Different Roles and Experience Levels', async () => {
    const roles = ['developer', 'user', 'admin', 'reviewer'];
    const experienceLevels = ['beginner', 'intermediate', 'expert'];
    
    for (const role of roles) {
      for (const experience of experienceLevels) {
        const result = await onboardingPrompt.handler({
          role,
          experience,
          focus: 'testing and automation'
        });
        
        assert.ok(result.messages[0].content.text.includes('Onboarding Guide'));
        assert.ok(result.messages[0].content.text.includes(role.toUpperCase()));
        assert.ok(result.messages[0].content.text.includes(experience.toUpperCase()));
        assert.ok(result.messages[0].content.text.includes('testing and automation'));
        assert.ok(result.messages[0].content.text.includes('list-files'));
        
        // Role-specific content checks
        if (role === 'developer') {
          assert.ok(result.messages[0].content.text.includes('Developer Onboarding'));
        } else if (role === 'admin') {
          assert.ok(result.messages[0].content.text.includes('Administrator Onboarding'));
        }
      }
    }
    
    console.log('✅ Onboarding prompt customizes for different roles and experience levels');
  });

  test('Prompt Schema Validation', () => {
    // Test that all prompts have required properties
    const prompts = [
      healthAssessmentPrompt,
      projectAnalysisPrompt,
      weatherPlanningPrompt,
      codeReviewPrompt,
      onboardingPrompt
    ];
    
    prompts.forEach(prompt => {
      assert.ok(prompt.name);
      assert.ok(prompt.description);
      assert.ok(prompt.arguments);
      assert.ok(typeof prompt.handler === 'function');
      
      // Check that arguments are properly defined with Zod schemas
      assert.ok(prompt.arguments);
      Object.values(prompt.arguments).forEach(argSchema => {
        assert.ok(argSchema._def); // Zod schema has _def property
      });
    });
    
    console.log('✅ All prompts have valid schema definitions');
  });

  test('Prompt Registration System', () => {
    // Mock server for testing registration
    const mockServer = {
      registeredPrompts: [],
      prompt(name, description, argumentsSchema, handler) {
        this.registeredPrompts.push({ name, description, argumentsSchema, handler });
      }
    };
    
    registerAllPrompts(mockServer);
    
    assert.strictEqual(mockServer.registeredPrompts.length, 5);
    
    const promptNames = mockServer.registeredPrompts.map(p => p.name);
    assert.ok(promptNames.includes('health-assessment'));
    assert.ok(promptNames.includes('project-analysis'));
    assert.ok(promptNames.includes('weather-planning'));
    assert.ok(promptNames.includes('code-review'));
    assert.ok(promptNames.includes('onboarding'));
    
    console.log('✅ Prompt registration system works correctly');
  });

  test('Prompt Content Quality', async () => {
    // Test that prompts generate useful, actionable content
    const healthResult = await healthAssessmentPrompt.handler({
      weight: 70,
      height: 1.75,
      city: "London"
    });
    
    const content = healthResult.messages[0].content.text;
    
    // Check for actionable instructions
    assert.ok(content.includes('calculate-bmi'));
    assert.ok(content.includes('fetch-weather'));
    assert.ok(content.includes('weightKg: 70'));
    assert.ok(content.includes('heightM: 1.75'));
    assert.ok(content.includes('city: "London"'));
    
    // Check for structured guidance
    assert.ok(content.includes('Next Steps:'));
    assert.ok(content.includes('Recommended Actions:'));
    assert.ok(content.includes('Tools to use:'));
    
    console.log('✅ Prompts generate high-quality, actionable content');
  });

  test('Prompt Parameter Handling', async () => {
    // Test optional parameters
    const resultWithoutGoals = await healthAssessmentPrompt.handler({
      weight: 75,
      height: 1.80,
      city: "Berlin"
    });
    
    assert.ok(resultWithoutGoals.messages[0].content.text.includes('No specific goals provided'));
    
    const resultWithGoals = await healthAssessmentPrompt.handler({
      weight: 75,
      height: 1.80,
      city: "Berlin",
      goals: "marathon training"
    });
    
    assert.ok(resultWithGoals.messages[0].content.text.includes('marathon training'));
    
    console.log('✅ Prompts handle optional parameters correctly');
  });
}); 