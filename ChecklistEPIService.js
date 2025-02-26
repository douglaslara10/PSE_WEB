// Arquivo: services/ChecklistEPIService.js
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

// Buscar checklist do colaborador
const getColaboradorChecklist = async (matricula) => {
  const response = await fetch(`/api/checklaudoepi/colaborador/${matricula}`);
  return handleResponse(response);
};

// Salvar novos itens de checklist
const saveChecklistItems = async (laudos) => {
  const response = await fetch(`/api/checklaudoepi/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ laudos }),
  });
  
  return handleResponse(response);
};

// Atualizar um item de checklist
const updateChecklistItem = async (matricula, itemId, status, completionDate) => {
  const response = await fetch(`/api/checklaudoepi/update/${matricula}/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
      completion_date: completionDate
    }),
  });
  
  return handleResponse(response);
};

// Excluir um item de checklist
const deleteChecklistItem = async (matricula, itemId) => {
  const response = await fetch(`/api/checklaudoepi/delete/${matricula}/${itemId}`, {
    method: 'DELETE',
  });
  
  return handleResponse(response);
};

// Verificar vencimentos dos itens de checklist
const verificarVencimentos = async (matricula) => {
  const response = await fetch(`/api/checklaudoepi/vencimentos/${matricula}`);
  return handleResponse(response);
};

export default {
  getColaboradorChecklist,
  saveChecklistItems,
  updateChecklistItem,
  deleteChecklistItem,
  verificarVencimentos
};