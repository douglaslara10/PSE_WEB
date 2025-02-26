const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getChecklists = async () => {
  // Corrigir o endpoint para um existente no backend
  const response = await fetch(`${API_URL}/checklaudos`); // Substituir '/checklists' por '/checklaudos'
  if (!response.ok) {
    throw new Error('Erro ao buscar checklists');
  }
  return response.json();
};

const getComposicoes = async () => {
  const response = await fetch(`${API_URL}/composicoes`);
  if (!response.ok) {
    throw new Error('Erro ao buscar composições');
  }
  return response.json();
};

export default { getChecklists, getComposicoes };