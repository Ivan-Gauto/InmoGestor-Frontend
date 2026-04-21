import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginRequest {
  dni: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  mensaje: string;
  token?: string;
  usuario?: {
    usuarioId: string;
    dni: string;
    nombre: string;
    apellido: string;
    email?: string;
    rolNombre: string;
  };
}

export interface UsuarioInfo {
  usuarioId: string;
  dni: string;
  nombre: string;
  apellido: string;
  email?: string;
  rolNombre: string;
}

export interface RegisterRequest {
  Dni: string;
  Password: string;
  Nombre: string;
  Apellido: string;
  Email: string;
  RolNombre: string;
}

export interface RegisterResponse {
  success: boolean;
  mensaje: string;
}

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('inmogestor_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor global para redireccionar al login si el token expira o es inválido en /auth
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('inmogestor_token');
      localStorage.removeItem('inmogestor_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (dni: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await authApi.post<LoginResponse>('/auth/login', { Dni: dni, Password: password });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          mensaje: error.response.data?.mensaje || 'Credenciales inválidas'
        };
      }
      return {
        success: false,
        mensaje: 'Error de conexión'
      };
    }
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await authApi.post<RegisterResponse>('/auth/register', data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          mensaje: error.response.data?.mensaje || 'Error al registrar'
        };
      }
      return {
        success: false,
        mensaje: 'Error de conexión'
      };
    }
  },

  logout: async (): Promise<void> => {
    await authApi.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<UsuarioInfo | null> => {
    try {
      const response = await authApi.get<{ success: boolean; data?: UsuarioInfo }>('/auth/me');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch {
      return null;
    }
  },
};

export default authApi;
