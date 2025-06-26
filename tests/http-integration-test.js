#!/usr/bin/env node

import { createHttpServer } from '../src/server/http-server.js';
import { serverConfig } from '../src/config/server-config.js';

// Simple HTTP client for testing
import http from 'node:http';

const log = (message) => console.log(`✅ ${message}`);
const error = (message) => console.log(`❌ ${message}`);

// Test configuration
const TEST_PORT = 3001; // Use different port to avoid conflicts
const TEST_HOST = 'localhost';

// Update config for testing
const originalPort = serverConfig.server.port;
serverConfig.server.port = TEST_PORT;

async function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: TEST_HOST,
      port: TEST_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseData
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runHttpTests() {
  console.log('\n🌐 Starting HTTP Server Integration Tests...\n');
  
  // Start the test server
  const { app, sessionManager } = createHttpServer();
  const server = app.listen(TEST_PORT, TEST_HOST, () => {
    console.log(`🚀 Test server running on http://${TEST_HOST}:${TEST_PORT}`);
  });

  try {
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 100));

    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await makeRequest('GET', '/health');
    
    if (healthResponse.statusCode === 200) {
      const healthData = JSON.parse(healthResponse.body);
      if (healthData.status === 'healthy' && healthData.server === 'mcp-server-example') {
        log('Health endpoint works correctly');
      } else {
        throw new Error('Health endpoint returned incorrect data');
      }
    } else {
      throw new Error(`Health endpoint returned status ${healthResponse.statusCode}`);
    }

    // Test 2: MCP Initialization
    console.log('2. Testing MCP initialization...');
    const initRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {}, resources: {} },
        clientInfo: { name: 'test-client', version: '1.0.0' }
      }
    };

    const initResponse = await makeRequest('POST', '/mcp', initRequest);
    
    if (initResponse.statusCode === 200 && initResponse.headers['mcp-session-id']) {
      const sessionId = initResponse.headers['mcp-session-id'];
      log(`MCP initialization successful, session ID: ${sessionId.substring(0, 8)}...`);
      
      // Test 3: Tools List
      console.log('3. Testing tools list...');
      const toolsRequest = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {}
      };

      const toolsResponse = await makeRequest('POST', '/mcp', toolsRequest, {
        'mcp-session-id': sessionId
      });

      if (toolsResponse.statusCode === 200) {
        log('Tools list request successful');
        
        // Test 4: Tool Call
        console.log('4. Testing BMI tool call...');
        const bmiRequest = {
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/call',
          params: {
            name: 'calculate-bmi',
            arguments: { weightKg: 70, heightM: 1.75 }
          }
        };

        const bmiResponse = await makeRequest('POST', '/mcp', bmiRequest, {
          'mcp-session-id': sessionId
        });

        if (bmiResponse.statusCode === 200) {
          log('BMI tool call successful');
          
          // Test 5: Invalid Session
          console.log('5. Testing invalid session handling...');
          const invalidSessionResponse = await makeRequest('POST', '/mcp', toolsRequest, {
            'mcp-session-id': 'invalid-session-id'
          });

          if (invalidSessionResponse.statusCode === 400) {
            log('Invalid session handling works correctly');
          } else {
            throw new Error('Invalid session should return 400');
          }

          // Test 6: Session Termination
          console.log('6. Testing session termination...');
          const deleteResponse = await makeRequest('DELETE', '/mcp', null, {
            'mcp-session-id': sessionId
          });

          if (deleteResponse.statusCode === 200) {
            log('Session termination successful');
          } else {
            throw new Error(`Session termination failed with status ${deleteResponse.statusCode}`);
          }

        } else {
          throw new Error(`BMI tool call failed with status ${bmiResponse.statusCode}`);
        }
      } else {
        throw new Error(`Tools list failed with status ${toolsResponse.statusCode}`);
      }
    } else {
      throw new Error(`MCP initialization failed with status ${initResponse.statusCode}`);
    }

    // Test 7: 404 Handling
    console.log('7. Testing 404 handling...');
    const notFoundResponse = await makeRequest('GET', '/nonexistent');
    
    if (notFoundResponse.statusCode === 404) {
      const notFoundData = JSON.parse(notFoundResponse.body);
      if (notFoundData.error === 'Not Found') {
        log('404 handling works correctly');
      } else {
        throw new Error('404 response format incorrect');
      }
    } else {
      throw new Error(`Expected 404, got ${notFoundResponse.statusCode}`);
    }

    console.log('\n🎉 All HTTP integration tests passed!\n');

  } catch (err) {
    error(`HTTP integration test failed: ${err.message}`);
    process.exitCode = 1;
  } finally {
    // Cleanup
    sessionManager.stopCleanup();
    server.close();
    serverConfig.server.port = originalPort; // Restore original port
    console.log('🧹 Test server cleaned up');
  }
}

// Run the tests
runHttpTests().catch(err => {
  error(`Test runner failed: ${err.message}`);
  process.exit(1);
}); 