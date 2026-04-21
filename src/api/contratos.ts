import axios from 'axios';
import type { Contrato, CrearContratoRequest, ApiResponse } from '../types/contrato';

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

export const contratosApi = {
  listar: async (estado?: number): Promise<Contrato[]> => {
    const url = estado !== undefined ? `/contratos?estado=${estado}` : `/contratos`;
    const response = await api.get<ApiResponse<Contrato[]>>(url);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.mensaje || 'Error al obtener contratos');
  },

  obtenerPorId: async (id: number): Promise<Contrato> => {
    const response = await api.get<ApiResponse<Contrato>>(`/contratos/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.mensaje || 'Error al obtener contrato');
  },

  crear: async (contrato: CrearContratoRequest): Promise<number> => {
    const response = await api.post<ApiResponse<{ contratoId: number }>>('/contratos', contrato);
    if (response.data.success && response.data.data) {
      return response.data.data.contratoId;
    }
    throw new Error(response.data.mensaje || 'Error al crear contrato');
  },

  rescindir: async (id: number): Promise<void> => {
    const response = await api.put<ApiResponse<void>>(`/contratos/${id}/anular`);
    if (!response.data.success) {
      throw new Error(response.data.mensaje || 'Error al rescindir contrato');
    }
  },
};

export default api;
