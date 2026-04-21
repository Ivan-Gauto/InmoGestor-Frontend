import api from './index';

export const indicesApi = {
  listarTipos: async () => {
    const response = await api.get('/indice/tipos');
    return response.data; // { success, data: [] }
  },

  /**
   * Obtiene el valor vigente del índice.
   * El backend resuelve el caché, llama a la API externa si es necesario,
   * guarda en DB y retorna el valor. El front solo consume este endpoint.
   */
  obtenerValorActual: async (id: string) => {
    const response = await api.get(`/indice/${id}`);
    return response.data; // { success, data: { valor, ... } }
  },
};

export default api;
