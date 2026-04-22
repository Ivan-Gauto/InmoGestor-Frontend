import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Instancia central de Axios para toda la aplicación.
 * Incluye configuración de URL base e interceptores de seguridad.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el Token de forma automática
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('inmogestor_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globales (ej. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401 y NO es una ruta de autenticación, redireccionamos
    if (error.response?.status === 401 && !error.config.url?.includes('/auth/')) {
      localStorage.removeItem('inmogestor_token');
      localStorage.removeItem('inmogestor_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Interfaz genérica para las respuestas del Backend
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  mensaje?: string;
}

export default api;
