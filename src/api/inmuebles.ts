import api, { type ApiResponse } from './index';
import type { Inmueble } from '../types/inmueble';

export const inmueblesApi = {
  listar: async (): Promise<Inmueble[]> => {
    const response = await api.get<ApiResponse<Inmueble[]>>('/inmueble');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.mensaje || 'Error al obtener inmuebles');
  },

  listarDisponibles: async (): Promise<Inmueble[]> => {
    const response = await api.get<ApiResponse<Inmueble[]>>('/inmueble?disponibles=true');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.mensaje || 'Error al obtener inmuebles disponibles');
  },
};

export default api;