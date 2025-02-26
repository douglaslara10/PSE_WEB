import { useState, useEffect } from 'react';
import withAuth from '../utils/authMiddleware';
import colaboradoresService from '../services/colaboradoresService';

const Colaboradores = () => {
  const [colaboradores, setColaboradores] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [novoColaborador, setNovoColaborador] = useState({
    nome: '',
    matricula: '',
    // outros campos relevantes
  });
  const [editandoColaborador, setEditandoColaborador] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await colaboradoresService.getColaboradores();
        setColaboradores(data);
      } catch (error) {
        console.error('Erro ao buscar colaboradores:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  },);

  // Função para adicionar um novo colaborador
  const adicionarColaborador = async () => {
    try {
      await colaboradoresService.criarColaborador(novoColaborador);
      setNovoColaborador({ nome: '', matricula: '' }); // Limpa o formulário
      // Atualiza a lista de colaboradores
      const data = await colaboradoresService.getColaboradores();
      setColaboradores(data);
    } catch (error) {
      console.error('Erro ao adicionar colaborador:', error);
      // Tratar erro (exibir mensagem para o usuário)
    }
  };

  // Função para editar um colaborador existente
  const editarColaborador = async (colaborador) => {
    try {
      await colaboradoresService.atualizarColaborador(colaborador.id, colaborador);
      setEditandoColaborador(null); // Sai do modo de edição
      // Atualiza a lista de colaboradores
      const data = await colaboradoresService.getColaboradores();
      setColaboradores(data);
    } catch (error) {
      console.error('Erro ao editar colaborador:', error);
      // Tratar erro (exibir mensagem para o usuário)
    }
  };

  // Função para excluir um colaborador
  const excluirColaborador = async (id) => {
    try {
      await colaboradoresService.excluirColaborador(id);
      // Atualiza a lista de colaboradores
      const data = await colaboradoresService.getColaboradores();
      setColaboradores(data);
    } catch (error) {
      console.error('Erro ao excluir colaborador:', error);
      // Tratar erro (exibir mensagem para o usuário)
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error.message}</div>;
  }

  return (
    <div>
      <h1>Colaboradores</h1>

      <h2>Adicionar Colaborador</h2>
      <div>
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          id="nome"
          value={novoColaborador.nome}
          onChange={(e) => setNovoColaborador({...novoColaborador, nome: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="matricula">Matrícula:</label>
        <input
          type="text"
          id="matricula"
          value={novoColaborador.matricula}
          onChange={(e) => setNovoColaborador({...novoColaborador, matricula: e.target.value })}
        />
      </div>
      {/* Adicione outros campos relevantes */}
      <button onClick={adicionarColaborador}>Adicionar</button>

      <h2>Lista de Colaboradores</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Matrícula</th>
            {/* Adicione outros cabeçalhos relevantes */}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.map((colaborador) => (
            <tr key={colaborador.id}>
              <td>{colaborador.id}</td>
              <td>
                {editandoColaborador?.id === colaborador.id? (
                  <input
                    type="text"
                    value={editandoColaborador.nome}
                    onChange={(e) => setEditandoColaborador({...editandoColaborador, nome: e.target.value })}
                  />
                ): (
                  colaborador.nome
                )}
              </td>
              <td>
                {editandoColaborador?.id === colaborador.id? (
                  <input
                    type="text"
                    value={editandoColaborador.matricula}
                    onChange={(e) => setEditandoColaborador({...editandoColaborador, matricula: e.target.value })}
                  />
                ): (
                  colaborador.matricula
                )}
              </td>
              {/* Adicione outros campos relevantes */}
              <td>
                {editandoColaborador?.id === colaborador.id? (
                  <>
                    <button onClick={() => editarColaborador(editandoColaborador)}>Salvar</button>
                    <button onClick={() => setEditandoColaborador(null)}>Cancelar</button>
                  </>
                ): (
                  <>
                    <button onClick={() => setEditandoColaborador(colaborador)}>Editar</button>
                    <button onClick={() => excluirColaborador(colaborador.id)}>Excluir</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withAuth(Colaboradores);