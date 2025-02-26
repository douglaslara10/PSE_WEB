import { useState, useEffect } from 'react';
import withAuth from '../utils/authMiddleware';
import veiculosService from '../services/veiculosService';

const Veiculos = () => {
  const [veiculos, setVeiculos] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [novaPlaca, setNovaPlaca] = useState(''); // Estado para a nova placa
  const [editandoVeiculo, setEditandoVeiculo] = useState(null); // Estado para o veículo sendo editado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await veiculosService.getVeiculos();
        setVeiculos(data);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  },);

  // Função para adicionar um novo veículo
  const adicionarVeiculo = async () => {
    try {
      await veiculosService.criarVeiculo({ placa: novaPlaca });
      setNovaPlaca(''); // Limpa o formulário
      // Atualiza a lista de veículos
      const data = await veiculosService.getVeiculos();
      setVeiculos(data);
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
      // Tratar erro (exibir mensagem para o usuário)
    }
  };

  // Função para editar um veículo existente
  const editarVeiculo = async (veiculo) => {
    try {
      await veiculosService.atualizarVeiculo(veiculo.id, { placa: veiculo.placa });
      setEditandoVeiculo(null); // Sai do modo de edição
      // Atualiza a lista de veículos
      const data = await veiculosService.getVeiculos();
      setVeiculos(data);
    } catch (error) {
      console.error('Erro ao editar veículo:', error);
      // Tratar erro (exibir mensagem para o usuário)
    }
  };

  // Função para excluir um veículo
  const excluirVeiculo = async (id) => {
    try {
      await veiculosService.excluirVeiculo(id);
      // Atualiza a lista de veículos
      const data = await veiculosService.getVeiculos();
      setVeiculos(data);
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
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
      <h1>Veículos</h1>

      {/* Formulário para adicionar novo veículo */}
      <h2>Adicionar Veículo</h2>
      <div>
        <label htmlFor="placa">Placa:</label>
        <input
          type="text"
          id="placa"
          value={novaPlaca}
          onChange={(e) => setNovaPlaca(e.target.value)}
        />
      </div>
      <button onClick={adicionarVeiculo}>Adicionar</button>

      {/* Lista de veículos */}
      <h2>Lista de Veículos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Placa</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {veiculos.map((veiculo) => (
            <tr key={veiculo.id}>
              <td>{veiculo.id}</td>
              <td>
                {editandoVeiculo?.id === veiculo.id? (
                  <input
                    type="text"
                    value={editandoVeiculo.placa}
                    onChange={(e) => setEditandoVeiculo({...editandoVeiculo, placa: e.target.value })}
                  />
                ): (
                  veiculo.placa
                )}
              </td>
              <td>
                {editandoVeiculo?.id === veiculo.id? (
                  <>
                    <button onClick={() => editarVeiculo(editandoVeiculo)}>Salvar</button>
                    <button onClick={() => setEditandoVeiculo(null)}>Cancelar</button>
                  </>
                ): (
                  <>
                    <button onClick={() => setEditandoVeiculo(veiculo)}>Editar</button>
                    <button onClick={() => excluirVeiculo(veiculo.id)}>Excluir</button>
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

export default withAuth(Veiculos);