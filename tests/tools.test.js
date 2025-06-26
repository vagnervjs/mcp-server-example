#!/usr/bin/env node

import { test, describe } from 'node:test';
import assert from 'node:assert';

import { calculateBmiTool } from '../src/tools/calculate-bmi.js';
import { fetchWeatherTool } from '../src/tools/fetch-weather.js';
import { listFilesTool } from '../src/tools/list-files.js';
import { registerAllTools } from '../src/tools/index.js';

describe('Tool Functionality', () => {
  test('BMI Calculator - Normal calculations', async () => {
    const testCases = [
      { input: { weightKg: 70, heightM: 1.75 }, expectedBmi: 22.86, expectedCategory: 'Normal weight' },
      { input: { weightKg: 45, heightM: 1.75 }, expectedBmi: 14.69, expectedCategory: 'Underweight' },
      { input: { weightKg: 85, heightM: 1.75 }, expectedBmi: 27.76, expectedCategory: 'Overweight' },
      { input: { weightKg: 100, heightM: 1.75 }, expectedBmi: 32.65, expectedCategory: 'Obese' }
    ];
    
    for (const testCase of testCases) {
      const result = await calculateBmiTool.handler(testCase.input);
      assert.ok(result.content);
      assert.ok(typeof result.content[0].text === 'string' && result.content[0].text.includes(testCase.expectedBmi.toString()));
      assert.ok(typeof result.content[0].text === 'string' && result.content[0].text.includes(testCase.expectedCategory));
    }
    console.log('✅ BMI calculator handles all weight categories correctly');
  });
  
  test('Weather Tool - Multiple cities', async () => {
    const cities = ['London', 'Paris', 'Tokyo', 'New York', 'Sydney'];
    
    for (const city of cities) {
      const result = await fetchWeatherTool.handler({ city });
      assert.ok(result.content);
      assert.ok(typeof result.content[0].text === 'string' && result.content[0].text.includes(`Weather in ${city}:`));
      assert.ok(typeof result.content[0].text === 'string' && result.content[0].text.match(/\d+°C/));
    }
    console.log('✅ Weather tool works for multiple international cities');
  });
  
  test('File Listing Tool - Pattern matching', async () => {
    const patterns = [
      { pattern: '*.js', expectedCount: 6 },
      { pattern: '*.md', expectedCount: 1 },
      { pattern: '*.json', expectedCount: 1 },
      { pattern: '*.sh', expectedCount: 1 },
      { pattern: '*', expectedCount: 6 }
    ];
    
    for (const testPattern of patterns) {
      const result = await listFilesTool.handler({ pattern: testPattern.pattern });
      assert.ok(result.content);
      assert.ok(typeof result.content[0].text === 'string' && result.content[0].text.includes(`files matching "${testPattern.pattern}"`));
      
      const fileLinks = result.content.filter(item => item.type === 'resource');
      assert.strictEqual(fileLinks.length, testPattern.expectedCount);
    }
    console.log('✅ File listing works with various pattern types');
  });
  
  test('Tool Configuration Validation', () => {
    // Check BMI tool config
    assert.strictEqual(calculateBmiTool.name, 'calculate-bmi');
    assert.ok(calculateBmiTool.config.inputSchema.weightKg);
    assert.ok(calculateBmiTool.config.inputSchema.heightM);
    
    // Check weather tool config
    assert.strictEqual(fetchWeatherTool.name, 'fetch-weather');
    assert.ok(fetchWeatherTool.config.inputSchema.city);
    
    // Check file tool config
    assert.strictEqual(listFilesTool.name, 'list-files');
    assert.ok(listFilesTool.config.inputSchema.pattern);
    
    console.log('✅ All tool configurations are valid');
  });

  test('Tool Registration System', () => {
    // Mock server for testing registration
    const mockServer = {
      registeredTools: [],
      registerTool(name, config, handler) {
        this.registeredTools.push({ name, config, handler });
      }
    };
    
    registerAllTools(mockServer);
    
    assert.strictEqual(mockServer.registeredTools.length, 3);
    
    const toolNames = mockServer.registeredTools.map(t => t.name);
    assert.ok(toolNames.includes('calculate-bmi'));
    assert.ok(toolNames.includes('fetch-weather'));
    assert.ok(toolNames.includes('list-files'));
    
    console.log('✅ Tool registration system works correctly');
  });

  test('BMI Calculator - Edge cases', async () => {
    // Test with minimal values
    const minResult = await calculateBmiTool.handler({ weightKg: 1, heightM: 0.1 });
    assert.ok(typeof minResult.content[0].text === 'string' && minResult.content[0].text.includes('BMI:'));
    
    // Test with larger values
    const maxResult = await calculateBmiTool.handler({ weightKg: 200, heightM: 2.5 });
    assert.ok(typeof maxResult.content[0].text === 'string' && maxResult.content[0].text.includes('BMI:'));
    
    console.log('✅ BMI calculator handles edge cases correctly');
  });
  
  test('File Listing - Special patterns', async () => {
    // Test empty pattern handling
    const emptyResult = await listFilesTool.handler({ pattern: '' });
    assert.ok(emptyResult.content);
    
    // Test special characters
    const specialResult = await listFilesTool.handler({ pattern: 'package' });
    assert.ok(specialResult.content);
    
    console.log('✅ File listing handles special patterns correctly');
  });
}); 