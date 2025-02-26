import { useState, useEffect } from 'react';
import withAuth from '../utils/authMiddleware';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const [checklists, setChecklists] = useState();
  const [composicoes, setComposicoes] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const checklistsData = await dashboardService.getChecklists();
        const composicoesData = await dashboardService.getComposicoes();
        setChecklists(checklistsData);
        setComposicoes(composicoesData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError(error); // Define o estado de erro
      } finally {
        setLoading(false); // Define o estado de carregamento como falso
      }
    };

    fetchData();
  },);

  if (loading) {
    return <div>Carregando...</div>; // Renderiza um indicador de carregamento
  }

  if (error) {
    return <div>Erro: {error.message}</div>; // Renderiza uma mensagem de erro
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Checklists</h2>
      {/* Renderiza os checklists */}
      <ul>
        {checklists.map((checklist) => (
          <li key={checklist.id}>
            {checklist.item} - {checklist.setor} - {checklist.equipe}
          </li>
        ))}
      </ul>

      <h2>Composições</h2>
      {/* Renderiza as composições */}
      <ul>
        {composicoes.map((composicao) => (
          <li key={composicao.id}>
            {composicao.placa} - {composicao.setor} - {composicao.turno}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withAuth(Dashboard);