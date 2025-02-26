import { useState, useEffect } from 'react';
import withAuth from '../utils/authMiddleware';
import usuariosService from '../services/usuariosService';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [novoUsuario, setNovoUsuario] = useState({ matricula: '', senha: '' }); // Estado para o novo usuário
  const [editandoUsuario, setEditandoUsuario] = useState(null); // Estado para o usuário sendo editado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await usuariosService.getUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  },);

  // Função para adicionar um novo usuário
  const adicionarUsuario = async () => {
    try {
      await usuariosService.criarUsuario(novoUsuario);
      setNovoUsuario({ matricula: '', senha: '' }); // Limpa o formulário
      // Atualiza a lista de usuários
      const data = await usuariosService.getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      // Tratar erro (exibir mensagem para o usuário)
    }
  };

  // Função para editar um usuário existente
  const editarUsuario = async (usuario) => {
    try {
      await usuariosService.atualizarUsuario(usuario.id, usuario);
      setEditandoUsuario(null); // Sai do modo de edição
      // Atualiza a lista de usuários
      const data = await usuariosService.getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      // Tratar erro (exibir mensagem para o usuário)
    }
  };

  // Função para excluir um usuário
  const excluirUsuario = async (id) => {
    try {
      await usuariosService.excluirUsuario(id);
      // Atualiza a lista de usuários
      const data = await usuariosService.getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
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
      <h1>Usuários</h1>

      {/* Formulário para adicionar novo usuário */}
      <h2>Adicionar Usuário</h2>
      <div>
        <label htmlFor="matricula">Matrícula:</label>
        <input
          type="text"
          id="matricula"
          value={novoUsuario.matricula}
          onChange={(e) => setNovoUsuario({...novoUsuario, matricula: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="senha">Senha:</label>
        <input
          type="password"
          id="senha"
          value={novoUsuario.senha}
          onChange={(e) => setNovoUsuario({...novoUsuario, senha: e.target.value })}
        />
      </div>
      <button onClick={adicionarUsuario}>Adicionar</button>

      {/* Lista de usuários */}
      <h2>Lista de Usuários</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Matrícula</th>
            <th>Senha</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>
                {editandoUsuario?.id === usuario.id? (
                  <input
                    type="text"
                    value={editandoUsuario.matricula}
                    onChange={(e) => setEditandoUsuario({...editandoUsuario, matricula: e.target.value })}
                  />
                ): (
                  usuario.matricula
                )}
              </td>
              <td>
                {editandoUsuario?.id === usuario.id? (
                  <input
                    type="password"
                    value={editandoUsuario.senha}
                    onChange={(e) => setEditandoUsuario({...editandoUsuario, senha: e.target.value })}
                  />
                ): (
                  '*****' // Não exibir a senha diretamente
                )}
              </td>
              <td>
                {editandoUsuario?.id === usuario.id? (
                  <>
                    <button onClick={() => editarUsuario(editandoUsuario)}>Salvar</button>
                    <button onClick={() => setEditandoUsuario(null)}>Cancelar</button>
                  </>
                ): (
                  <>
                    <button onClick={() => setEditandoUsuario(usuario)}>Editar</button>
                    <button onClick={() => excluirUsuario(usuario.id)}>Excluir</button>
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

export default withAuth(Usuarios);