import api from './api';

export const getGeneros = () => api.get('/generos');
export const getGenero = (id) => api.get(`/generos/${id}`);
export const createGenero = (genero) => api.post('/generos', genero);
export const updateGenero = (id, genero) => api.put(`/generos/${id}`, genero);
export const deleteGenero = (id) => api.delete(`/generos/${id}`);