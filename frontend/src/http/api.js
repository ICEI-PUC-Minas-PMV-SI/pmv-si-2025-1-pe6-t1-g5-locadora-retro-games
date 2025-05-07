import axios from "axios";

console.log('sexo: ', process.env.REACT_APP_BASE_URL)

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// Optionally add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

api.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (401 === error.response.status) {
      localStorage.removeItem("token");
      return window.location.href = '/login'
  } else {
      return Promise.reject(error);
  }
});

export default api;
