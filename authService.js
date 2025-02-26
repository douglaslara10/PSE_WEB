import axios from 'axios';

const API_URL = 'http://localhost:3001';

const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/usuarios/login`, credentials); // Usa a rota /usuarios/login
      return response;
    } catch (error) {
      if (error.response) {
        return error.response;
      } else {
        throw error;
      }
    }
  },
};

export default authService;