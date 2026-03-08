import api from './api';

export const getDirectores = () => api.get('/directores');
export const getDirector = (id) => api.get(`/directores/${id}`);
export const createDirector = (director) => api.post('/directores', director);
export const updateDirector = (id, director) => api.put(`/directores/${id}`, director);
export const deleteDirector = (id) => api.delete(`/directores/${id}`);