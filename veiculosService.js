import axios from 'axios';

const API_URL = 'http://localhost:3001';

const veiculosService = {
  getVeiculos: async () => {
    try {
      const response = await axios.get(`${API_URL}/veiculos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      throw error;
    }
  },
  criarVeiculo: async (veiculo) => {
    try {
      const response = await axios.post(`${API_URL}/veiculos`, veiculo);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      throw error;
    }
  },
  atualizarVeiculo: async (id, veiculo) => {
    try {
      const response = await axios.put(`${API_URL}/veiculos/${id}`, veiculo);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw error;
    }
  },
  excluirVeiculo: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/veiculos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
      throw error;
    }
  },
};

export default veiculosService;