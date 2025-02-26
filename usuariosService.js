import axios from 'axios';

const API_URL = 'http://localhost:3001';

const usuariosService = {
  getUsuarios: async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`); // Adapte a rota se necessário
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },
  criarUsuario: async (usuario) => {
    try {
      const response = await axios.post(`${API_URL}/usuarios`, usuario); // Adapte a rota se necessário
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },
  atualizarUsuario: async (id, usuario) => {
    try {
      const response = await axios.put(`${API_URL}/usuarios/${id}`, usuario); // Adapte a rota se necessário
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },
  excluirUsuario: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/usuarios/${id}`); // Adapte a rota se necessário
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw error;
    }
  },
};

export default usuariosService;