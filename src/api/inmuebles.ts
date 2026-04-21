import axios from 'axios';
import type { Inmueble } from '../types/inmueble';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('inmogestor_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const headers = getAuthHeader();
  Object.assign(config.headers, headers);
  return config;
});

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  mensaje?: string;
}

export const inmueblesApi = {
  listar: async (): Promise<Inmueble[]> => {
    const response = await api.get<ApiResponse<Inmueble[]>>('/inmuebles');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.mensaje || 'Error al obtener inmuebles');
  },
};

export default api;
