import api from './index';

export const indicesApi = {
  obtenerCacheActual: async (id: string) => {
    const response = await api.get(`/indice/${id}`);
    return response.data; // { success, data: { valor, ... } }
  },

  guardarCache: async (idTipoIndice: string, valor: number) => {
    const response = await api.post(`/indice`, {
      idTipoIndice,
      valor
    });
    return response.data;
  }
};

export default api;
