import axios from "axios";
import { getNavigate } from "../utils/navigateHelper";
import { toast } from "../utils/Toast";

let sessionExpiredPromise = null; // Variável para sincronizar o tratamento do 401

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (401 === error.response.status) {
      if (!sessionExpiredPromise) {
        // Cria uma nova Promise para sincronizar o tratamento do 401
        sessionExpiredPromise = new Promise((resolve) => {
          localStorage.removeItem("token");
          toast.error("Sessão expirada. Faça login novamente.");
          const navigate = getNavigate();
          if (navigate) {
            navigate("/login");
          } else {
            window.location.href = "/login";
          }
          // Reseta a Promise após um curto período
          sessionExpiredPromise = null;
          resolve();
        });
      }
      return sessionExpiredPromise.then(() => Promise.reject(error));
    }
    return Promise.reject(error);
  }
);

export default api;
