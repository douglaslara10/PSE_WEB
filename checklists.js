import { useState, useEffect, useCallback } from 'react';
import withAuth from '../utils/authMiddleware';
import checklistsService from '../services/checklistsService';
import styles from '../styles/Checklists.module.css';

const Checklists = () => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [novoChecklist, setNovoChecklist] = useState({
    setor: '',
    equipe: '',
    item: '',
    laudo: '',
    vencimento: '',
  });
  const [editandoChecklist, setEditandoChecklist] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    setor: '',
    equipe: '',
    status: 'todos'
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Função para buscar checklists - usando useCallback para evitar dependências cíclicas
  const fetchChecklists = useCallback(async () => {
    try {
      setLoading(true);
      const data = await checklistsService.getChecklists();
      setChecklists(data);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar checklists:', error);
      setError(error);
      showNotification('Erro ao carregar dados. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  // Função para mostrar notificações
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Função para adicionar um novo checklist
  const adicionarChecklist = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!novoChecklist.setor || !novoChecklist.equipe || !novoChecklist.item) {
      showNotification('Por favor, preencha todos os campos obrigatórios.', 'warning');
      return;
    }
    
    try {
      await checklistsService.criarChecklist(novoChecklist);
      setNovoChecklist({ setor: '', equipe: '', item: '', laudo: '', vencimento: '' });
      showNotification('Checklist adicionado com sucesso!', 'success');
      await fetchChecklists();
    } catch (error) {
      console.error('Erro ao adicionar checklist:', error);
      showNotification('Erro ao adicionar checklist. Tente novamente.', 'error');
    }
  };

  // Função para iniciar edição
  const iniciarEdicao = (checklist) => {
    setEditandoChecklist({...checklist});
  };

  // Função para cancelar edição
  const cancelarEdicao = () => {
    setEditandoChecklist(null);
  };

  // Função para editar um checklist existente
  const editarChecklist = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!editandoChecklist.setor || !editandoChecklist.equipe || !editandoChecklist.item) {
      showNotification('Por favor, preencha todos os campos obrigatórios.', 'warning');
      return;
    }
    
    try {
      await checklistsService.atualizarChecklist(editandoChecklist.id, editandoChecklist);
      showNotification('Checklist atualizado com sucesso!', 'success');
      setEditandoChecklist(null);
      await fetchChecklists();
    } catch (error) {
      console.error('Erro ao editar checklist:', error);
      showNotification('Erro ao editar checklist. Tente novamente.', 'error');
    }
  };

  // Função para confirmar exclusão
  const confirmarExclusao = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este checklist?')) {
      excluirChecklist(id);
    }
  };

  // Função para excluir um checklist
  const excluirChecklist = async (id) => {
    try {
      await checklistsService.excluirChecklist(id);
      showNotification('Checklist excluído com sucesso!', 'success');
      await fetchChecklists();
    } catch (error) {
      console.error('Erro ao excluir checklist:', error);
      showNotification('Erro ao excluir checklist. Tente novamente.', 'error');
    }
  };

  // Verifica se um checklist está próximo do vencimento (30 dias)
  const verificarVencimento = (dataVencimento) => {
    if (!dataVencimento) return 'normal';
    
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffDias = Math.floor((vencimento - hoje) / (1000 * 60 * 60 * 24));
    
    if (diffDias < 0) return 'vencido';
    if (diffDias <= 30) return 'proximo';
    return 'normal';
  };

  // Formatar data para exibição
  const formatarData = (data) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  // Filtrar checklists com base nas opções selecionadas
  const checklistsFiltrados = checklists.filter(checklist => {
    const matchSetor = !filterOptions.setor || checklist.setor.toLowerCase().includes(filterOptions.setor.toLowerCase());
    const matchEquipe = !filterOptions.equipe || checklist.equipe.toLowerCase().includes(filterOptions.equipe.toLowerCase());
    
    if (filterOptions.status === 'vencidos') {
      const statusVencimento = verificarVencimento(checklist.vencimento);
      return matchSetor && matchEquipe && statusVencimento === 'vencido';
    } else if (filterOptions.status === 'proximos') {
      const statusVencimento = verificarVencimento(checklist.vencimento);
      return matchSetor && matchEquipe && statusVencimento === 'proximo';
    }
    
    return matchSetor && matchEquipe;
  });

  // Lista de setores únicos para os filtros
  const setoresUnicos = [...new Set(checklists.map(checklist => checklist.setor))];
  const equipesUnicas = [...new Set(checklists.map(checklist => checklist.equipe))];

  // Componente de carregamento
  if (loading && checklists.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // Componente de erro
  if (error && checklists.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>!</div>
        <h2>Erro ao carregar dados</h2>
        <p>{error.message || 'Ocorreu um erro ao buscar os checklists.'}</p>
        <button className={styles.retryButton} onClick={fetchChecklists}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Notificação */}
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <header className={styles.pageHeader}>
        <h1>Gerenciamento de Laudos</h1>
        <p>Controle e monitore todos os laudos e seus vencimentos</p>
      </header>

      <div className={styles.contentGrid}>
        {/* Seção de Filtros */}
        <section className={styles.filtersCard}>
          <h2>Filtros</h2>
          <div className={styles.filterForm}>
            <div className={styles.formGroup}>
              <label htmlFor="filtroSetor">Setor:</label>
              <select
                id="filtroSetor"
                value={filterOptions.setor}
                onChange={(e) => setFilterOptions({...filterOptions, setor: e.target.value})}
                className={styles.select}
              >
                <option value="">Todos os setores</option>
                {setoresUnicos.map((setor, index) => (
                  <option key={index} value={setor}>{setor}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="filtroEquipe">Equipe:</label>
              <select
                id="filtroEquipe"
                value={filterOptions.equipe}
                onChange={(e) => setFilterOptions({...filterOptions, equipe: e.target.value})}
                className={styles.select}
              >
                <option value="">Todas as equipes</option>
                {equipesUnicas.map((equipe, index) => (
                  <option key={index} value={equipe}>{equipe}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="filtroStatus">Status:</label>
              <select
                id="filtroStatus"
                value={filterOptions.status}
                onChange={(e) => setFilterOptions({...filterOptions, status: e.target.value})}
                className={styles.select}
              >
                <option value="todos">Todos</option>
                <option value="vencidos">Vencidos</option>
                <option value="proximos">Próximos ao vencimento</option>
              </select>
            </div>

            <button 
              className={styles.resetButton}
              onClick={() => setFilterOptions({setor: '', equipe: '', status: 'todos'})}
            >
              Limpar filtros
            </button>
          </div>
        </section>

        {/* Seção de Novo Checklist */}
        <section className={styles.formCard}>
          <h2>Adicionar Novo Laudo</h2>
          <form onSubmit={adicionarChecklist} className={styles.addForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="setor">Setor:</label>
                <input
                  type="text"
                  id="setor"
                  value={novoChecklist.setor}
                  onChange={(e) => setNovoChecklist({...novoChecklist, setor: e.target.value})}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="equipe">Equipe:</label>
                <input
                  type="text"
                  id="equipe"
                  value={novoChecklist.equipe}
                  onChange={(e) => setNovoChecklist({...novoChecklist, equipe: e.target.value})}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="item">Item:</label>
                <input
                  type="text"
                  id="item"
                  value={novoChecklist.item}
                  onChange={(e) => setNovoChecklist({...novoChecklist, item: e.target.value})}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="laudo">Número do Laudo:</label>
                <input
                  type="text"
                  id="laudo"
                  value={novoChecklist.laudo}
                  onChange={(e) => setNovoChecklist({...novoChecklist, laudo: e.target.value})}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="vencimento">Data de Vencimento:</label>
                <input
                  type="date"
                  id="vencimento"
                  value={novoChecklist.vencimento}
                  onChange={(e) => setNovoChecklist({...novoChecklist, vencimento: e.target.value})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.addButton}>
                  Adicionar Laudo
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Tabela de Checklists */}
        <section className={styles.tableSection}>
          <h2>Laudos Cadastrados</h2>
          
          {checklistsFiltrados.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <p>Nenhum laudo encontrado para os filtros selecionados.</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Setor</th>
                    <th>Equipe</th>
                    <th>Item</th>
                    <th>Laudo</th>
                    <th>Vencimento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {checklistsFiltrados.map((checklist) => {
                    const statusVencimento = verificarVencimento(checklist.vencimento);
                    
                    return (
                      <tr 
                        key={checklist.id} 
                        className={`${styles.tableRow} ${styles[statusVencimento]}`}
                      >
                        <td>{checklist.setor}</td>
                        <td>{checklist.equipe}</td>
                        <td>{checklist.item}</td>
                        <td>{checklist.laudo}</td>
                        <td>
                          <span className={styles[`status-${statusVencimento}`]}>
                            {formatarData(checklist.vencimento)}
                          </span>
                        </td>
                        <td className={styles.actions}>
                          <button 
                            onClick={() => iniciarEdicao(checklist)} 
                            className={styles.editButton}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => confirmarExclusao(checklist.id)} 
                            className={styles.deleteButton}
                            title="Excluir"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Modal de Edição */}
      {editandoChecklist && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Editar Laudo</h3>
              <button 
                className={styles.closeButton} 
                onClick={cancelarEdicao}
              >
                ×
              </button>
            </div>
            <form onSubmit={editarChecklist} className={styles.editForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="editSetor">Setor:</label>
                  <input
                    type="text"
                    id="editSetor"
                    value={editandoChecklist.setor}
                    onChange={(e) => setEditandoChecklist({...editandoChecklist, setor: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editEquipe">Equipe:</label>
                  <input
                    type="text"
                    id="editEquipe"
                    value={editandoChecklist.equipe}
                    onChange={(e) => setEditandoChecklist({...editandoChecklist, equipe: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="editItem">Item:</label>
                  <input
                    type="text"
                    id="editItem"
                    value={editandoChecklist.item}
                    onChange={(e) => setEditandoChecklist({...editandoChecklist, item: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="editLaudo">Número do Laudo:</label>
                  <input
                    type="text"
                    id="editLaudo"
                    value={editandoChecklist.laudo}
                    onChange={(e) => setEditandoChecklist({...editandoChecklist, laudo: e.target.value})}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="editVencimento">Data de Vencimento:</label>
                  <input
                    type="date"
                    id="editVencimento"
                    value={editandoChecklist.vencimento}
                    onChange={(e) => setEditandoChecklist({...editandoChecklist, vencimento: e.target.value})}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveButton}>
                  Salvar Alterações
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={cancelarEdicao}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Checklists);