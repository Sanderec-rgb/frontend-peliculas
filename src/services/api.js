import axios from 'axios';

// IMPORTANTE: Esta URL debe apuntar a tu BACKEND en Render
const API_URL = 'https://api-rest-nodejs-3-xlee.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Para debugging
api.interceptors.request.use(request => {
  console.log('📤 Enviando a:', request.url);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('📥 Respuesta:', response.status);
    return response;
  },
  error => {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      console.error(`   ¿El backend está corriendo en ${API_URL}?`);
    }
    return Promise.reject(error);
  }
);

export default api;