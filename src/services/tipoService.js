import api from './api';

export const getTipos = () => api.get('/tipos');
export const getTipo = (id) => api.get(`/tipos/${id}`);
export const createTipo = (tipo) => api.post('/tipos', tipo);
export const updateTipo = (id, tipo) => api.put(`/tipos/${id}`, tipo);
export const deleteTipo = (id) => api.delete(`/tipos/${id}`);