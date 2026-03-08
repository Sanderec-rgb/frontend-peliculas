import api from './api';

export const getMedias = () => api.get('/media');
export const getMedia = (id) => api.get(`/medias/${id}`);
export const createMedia = (media) => api.post('/medias', media);
export const updateMedia = (id, media) => api.put(`/medias/${id}`, media);
export const deleteMedia = (id) => api.delete(`/medias/${id}`);