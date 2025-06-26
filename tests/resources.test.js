#!/usr/bin/env node

import { test, describe } from 'node:test';
import assert from 'node:assert';

import { staticResources } from '../src/resources/static-resources.js';
import { dynamicResources } from '../src/resources/dynamic-resources.js';
import { registerAllResources } from '../src/resources/index.js';

describe('Resource Functionality', () => {
  test('Static Resources - Config, Info, and Prompt Examples', async () => {
    // Test config resource
    const configResource = staticResources.find(r => r.name === 'config');
    assert.ok(configResource);
    
    const configResult = await configResource.handler({ href: 'config://app' });
    assert.ok(configResult.contents);
    
    const configData = JSON.parse(configResult.contents[0].text);
    assert.strictEqual(configData.appName, 'MCP Server Example');
    assert.strictEqual(configData.version, '1.0.0');
    assert.ok(Array.isArray(configData.features));
    
    // Test server info resource
    const infoResource = staticResources.find(r => r.name === 'server-info');
    assert.ok(infoResource);
    
    const infoResult = await infoResource.handler({ href: 'info://server' });
    assert.ok(infoResult.contents);
    assert.ok(infoResult.contents[0].text.includes('MCP Server Example'));
    assert.ok(infoResult.contents[0].text.includes('Node.js'));
    

    
    console.log('✅ Static resources provide correct configuration and server info');
  });
  
  test('Dynamic Resources - User profiles and repositories', async () => {
    // Test user profile resource
    const userResource = dynamicResources.find(r => r.name === 'user-profile');
    assert.ok(userResource);
    
    const userResult = await userResource.handler(
      { href: 'users://456/profile' },
      { userId: '456' }
    );
    
    const userData = JSON.parse(userResult.contents[0].text);
    assert.strictEqual(userData.id, '456');
    assert.strictEqual(userData.name, 'User 456');
    assert.strictEqual(userData.email, 'user456@example.com');
    assert.ok(userData.preferences);
    
    // Test repository resource
    const repoResource = dynamicResources.find(r => r.name === 'repository');
    assert.ok(repoResource);
    
    const repoResult = await repoResource.handler(
      { href: 'github://repos/facebook/react' },
      { owner: 'facebook', repo: 'react' }
    );
    
    const repoData = JSON.parse(repoResult.contents[0].text);
    assert.strictEqual(repoData.fullName, 'facebook/react');
    assert.strictEqual(repoData.owner.login, 'facebook');
    assert.strictEqual(repoData.name, 'react');
    
    console.log('✅ Dynamic resources generate correct user and repository data');
  });
  


  test('Resource Registration System', () => {
    // Mock server for testing registration
    const mockServer = {
      registeredResources: [],
      resource(name, uriOrTemplate, metadata, handler) {
        this.registeredResources.push({ name, uriOrTemplate, metadata, handler });
      }
    };
    
    registerAllResources(mockServer);
    
    assert.ok(mockServer.registeredResources.length >= 4); // 2 static + 2 dynamic
    
    const resourceNames = mockServer.registeredResources.map(r => r.name);
    assert.ok(resourceNames.includes('config'));
    assert.ok(resourceNames.includes('server-info'));
    assert.ok(resourceNames.includes('user-profile'));
    assert.ok(resourceNames.includes('repository'));
    
    console.log('✅ Resource registration system works correctly');
  });
}); 