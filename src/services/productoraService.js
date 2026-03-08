import api from './api';

export const getProductoras = () => api.get('/productoras');
export const getProductora = (id) => api.get(`/productoras/${id}`);
export const createProductora = (productora) => api.post('/productoras', productora);
export const updateProductora = (id, productora) => api.put(`/productoras/${id}`, productora);
export const deleteProductora = (id) => api.delete(`/productoras/${id}`);