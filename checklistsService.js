const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Função para lidar com erros nas respostas
const handleResponse = async (response) => {
  if (!response.ok) {
    // Tenta extrair a mensagem de erro do corpo da resposta
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
  }
  
  // Para respostas 204 (No Content), retorna true em vez de tentar analisar JSON
  if (response.status === 204) {
    return true;
  }
  
  return response.json();
};

// Buscar todos os checklists
const getChecklists = async () => {
  const response = await fetch(`${API_URL}/checklaudos/all`);
  return handleResponse(response);
};

// Buscar checklists por setor e equipe
const getChecklistsBySectorAndTeam = async (setor, equipe) => {
  const response = await fetch(`${API_URL}/checklaudos/por-setor-equipe?setor=${setor}&equipe=${equipe}`);
  return handleResponse(response);
};

// Buscar checklists vencidos
const getExpiredChecklists = async () => {
  const response = await fetch(`${API_URL}/checklaudos/vencidos`);
  return handleResponse(response);
};

// Criar um novo checklist
const criarChecklist = async (checklistData) => {
  const response = await fetch(`${API_URL}/checklaudos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checklistData),
  });
  
  return handleResponse(response);
};

// Atualizar um checklist existente
const atualizarChecklist = async (id, checklistData) => {
  const response = await fetch(`${API_URL}/checklaudos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(checklistData),
  });
  
  return handleResponse(response);
};

// Excluir um checklist
const excluirChecklist = async (id) => {
  const response = await fetch(`${API_URL}/checklaudos/${id}`, {
    method: 'DELETE',
  });
  
  return handleResponse(response);
};

// Buscar composições (mantido da sua implementação original)
const getComposicoes = async () => {
  const response = await fetch(`${API_URL}/composicoes`);
  return handleResponse(response);
};

export default { 
  getChecklists, 
  getChecklistsBySectorAndTeam, 
  getExpiredChecklists, 
  criarChecklist, 
  atualizarChecklist, 
  excluirChecklist, 
  getComposicoes 
};