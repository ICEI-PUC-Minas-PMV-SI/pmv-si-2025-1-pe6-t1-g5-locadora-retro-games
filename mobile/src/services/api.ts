import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - using localhost since we're running mobile app on Windows host
const API_BASE_URL = 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and logging
api.interceptors.request.use(
  async (config) => {
    try {
      console.log(`📡 Making API request to: ${config.baseURL}${config.url}`);
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response from ${response.config.url}: ${response.status}`);
    return response;
  },
  async (error) => {
    console.error('❌ API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('authToken');
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

// Test API connectivity
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log(`🔍 Testing connection to: ${API_BASE_URL}`);
    const response = await api.get('/consoles?limit=1&page=1');
    console.log('✅ API connection successful:', response.status);
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return false;
  }
};

export default api;
