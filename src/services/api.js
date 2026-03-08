import axios from 'axios';

// IMPORTANTE: Esta URL debe apuntar a tu BACKEND (Node.js)
// NO es la URL de phpMyAdmin, es la URL de tu API
const API_URL = 'http://localhost:3000/api'; // Puerto 3000 (el de tu backend)

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
    if (error.code === 'ECONNREFUSED') {
      console.error('   ¿El backend está corriendo en http://localhost:3000?');
    }
    return Promise.reject(error);
  }
);

export default api;