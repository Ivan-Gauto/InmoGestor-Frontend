import api, { type ApiResponse } from './index';
import type { Pago, CuotaParaPago, RegistrarPagoRequest } from '../types/pago';

export const pagosApi = {
  listar: async (estado?: number): Promise<Pago[]> => {
    const url = estado !== undefined ? `/Pago?estado=${estado}` : '/Pago';
    const response = await api.get<ApiResponse<Pago[]>>(url);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.mensaje || 'Error al obtener los pagos');
  },

  obtenerCuota: async (cuotaId: number): Promise<CuotaParaPago> => {
    const response = await api.get<ApiResponse<CuotaParaPago>>(`/Pago/${cuotaId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.mensaje || 'Error al obtener la cuota');
  },

  obtenerCuotasPorContrato: async (contratoId: string): Promise<CuotaParaPago[]> => {
    const response = await api.get<ApiResponse<CuotaParaPago[]>>(`/Pago/contrato/${contratoId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.mensaje || 'Error al obtener las cuotas');
  },

  registrar: async (pagoData: RegistrarPagoRequest): Promise<{ pagoId: number }> => {
    const response = await api.post<ApiResponse<{ pagoId: number }>>('/Pago', pagoData);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.mensaje || 'Error al registrar el pago');
  },

  confirmar: async (pagoId: number): Promise<void> => {
    const response = await api.patch<ApiResponse<void>>(`/Pago/${pagoId}/confirmar`);
    if (!response.data.success) {
      throw new Error(response.data.mensaje || 'Error al confirmar el pago');
    }
  },


  rechazar: async (pagoId: number): Promise<void> => {
    const response = await api.patch<ApiResponse<void>>(`/Pago/${pagoId}/rechazar`);
    if (!response.data.success) {
      throw new Error(response.data.mensaje || 'Error al rechazar el pago');
    }
  },


  rechazarConMotivo: async (pagoId: number, motivo: string): Promise<void> => {
    const response = await api.patch<ApiResponse<void>>(`/Pago/${pagoId}/rechazar`, { motivo });
    if (!response.data.success) {
      throw new Error(response.data.mensaje || 'Error al rechazar el pago');
    }
  },

  anular: async (pagoId: number): Promise<void> => {
    const response = await api.patch<ApiResponse<void>>(`/Pago/${pagoId}/anular`);
    if (!response.data.success) {
      throw new Error(response.data.mensaje || 'Error al anular el pago');
    }
  }
};
