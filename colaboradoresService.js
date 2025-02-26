import axios from 'axios';

const API_URL = 'http://localhost:3001';

const colaboradoresService = {
  getColaboradores: async () => {
    try {
      const response = await axios.get(`${API_URL}/colaboradores`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar colaboradores:', error);
      throw error;
    }
  },
  criarColaborador: async (colaborador) => {
    try {
      const response = await axios.post(`${API_URL}/colaboradores`, colaborador);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar colaborador:', error);
      throw error;
    }
  },
  atualizarColaborador: async (id, colaborador) => {
    try {
      // Adapte a rota para atualizar o colaborador, se necessário
      const response = await axios.put(`${API_URL}/colaboradores/${id}`, colaborador);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error);
      throw error;
    }
  },
  excluirColaborador: async (id) => {
    try {
      // Adapte a rota para excluir o colaborador, se necessário
      const response = await axios.delete(`${API_URL}/colaboradores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir colaborador:', error);
      throw error;
    }
  },
};

export default colaboradoresService;