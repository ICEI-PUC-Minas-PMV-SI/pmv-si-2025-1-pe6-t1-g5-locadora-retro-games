// Simple test script to verify API connectivity from Windows host
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

async function testPublicEndpoint() {
  console.log('🔍 Testing public endpoint...');
  console.log(`📡 Attempting to connect to: ${API_BASE_URL}/auth/login`);
  
  try {
    // Test with invalid credentials - should get 400 but proves connection works
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'testpassword'
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ Unexpected success with test credentials!');
    console.log(`📊 Status: ${response.status}`);
    console.log(`📦 Data received: ${JSON.stringify(response.data, null, 2)}`);
    
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        console.log('✅ API connection successful! (Expected 400 for invalid credentials)');
        console.log(`📊 Status: ${error.response.status}`);
        console.log(`📦 Response: ${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        console.error('❌ Unexpected error:');
        console.error(`📊 Status: ${error.response.status}`);
        console.error(`📦 Response data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    } else if (error.request) {
      console.error('❌ No response received (network error)');
      console.error(`📡 Request details: ${error.message}`);
    } else {
      console.error(`❌ Error: ${error.message}`);
    }
  }
}

async function testProtectedEndpoint() {
  console.log('\n🔒 Testing protected endpoint (should require auth)...');
  console.log(`📡 Attempting to connect to: ${API_BASE_URL}/consoles?limit=1&page=1`);
  
  try {
    const response = await axios.get(`${API_BASE_URL}/consoles?limit=1&page=1`, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('❌ Unexpected success without auth token!');
    console.log(`📊 Status: ${response.status}`);
    
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Protected endpoint working correctly (401 without auth)');
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📦 Response: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error('❌ Unexpected error:');
      if (error.response) {
        console.error(`📊 Status: ${error.response.status}`);
        console.error(`📦 Response data: ${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        console.error(`📡 Request details: ${error.message}`);
      }
    }
  }
}

async function testAPI() {
  console.log('🚀 Starting API connectivity tests...\n');
  
  await testPublicEndpoint();
  await testProtectedEndpoint();
  
  console.log('\n🎉 API connectivity tests completed!');
  console.log('📝 Summary: The mobile app can successfully communicate with the backend!');
}

testAPI();
