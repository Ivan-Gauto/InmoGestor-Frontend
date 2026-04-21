import api from './index';
import axios from 'axios';

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

export const authService = {
  login: async (dni: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', { Dni: dni, Password: password });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          mensaje: (error.response.data as any)?.mensaje || 'Credenciales inválidas'
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
      const response = await api.post<RegisterResponse>('/auth/register', data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          mensaje: (error.response.data as any)?.mensaje || 'Error al registrar'
        };
      }
      return {
        success: false,
        mensaje: 'Error de conexión'
      };
    }
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<UsuarioInfo | null> => {
    try {
      const response = await api.get<{ success: boolean; data?: UsuarioInfo }>('/auth/me');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch {
      return null;
    }
  },
};

export default api;
