import axios from 'axios';

const API_URL = 'http://localhost:3001';

const relatoriosService = {
  getRelatorios: async () => {
    try {
      const response = await axios.get(`${API_URL}/composicoes`); // Adapte a rota se necessário
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      throw error;
    }
  },
};

export default relatoriosService;