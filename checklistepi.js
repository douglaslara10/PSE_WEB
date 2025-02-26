import React, { useState, useEffect } from 'react';
import styles from '../../styles/Checklists.module.css';
import ChecklistService from '../services/ChecklistService';

const ChecklistEPI = () => {
  // Estados para gerenciar os dados
  const [colaborador, setColaborador] = useState({ matricula: '', nome: '' });
  const [checklistItems, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    item: '',
    laudo: '',
    vencimento: '',
  });

  // Estado para filtros
  const [filtros, setFiltros] = useState({
    status: 'todos',
    dataVencimento: '',
  });

  // Buscar checklist do colaborador quando a matrícula for informada
  useEffect(() => {
    if (colaborador.matricula) {
      buscarChecklistColaborador();
    }
  }, [colaborador.matricula]);

  // Função para buscar checklist do colaborador
  const buscarChecklistColaborador = async () => {
    if (!colaborador.matricula) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/checklaudoepi/colaborador/${colaborador.matricula}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Erro ao buscar checklist');
      
      setChecklistItems(data);
    } catch (err) {
      setError(err.message);
      showNotification('error', `Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar novo item ao checklist
  const adicionarItem = async (e) => {
    e.preventDefault();
    
    if (!colaborador.matricula || !formData.item || !formData.vencimento) {
      return showNotification('warning', 'Preencha todos os campos obrigatórios');
    }
    
    setLoading(true);
    
    try {
      const payload = {
        laudos: [{
          colaborador_matricula: colaborador.matricula,
          item: formData.item,
          laudo: formData.laudo || 'N/A',
          vencimento: formData.vencimento
        }]
      };
      
      const response = await fetch('/api/checklaudoepi/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Erro ao salvar item');
      
      showNotification('success', 'Item adicionado com sucesso');
      setFormData({ item: '', laudo: '', vencimento: '' });
      buscarChecklistColaborador();
    } catch (err) {
      showNotification('error', `Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar um item
  const atualizarItem = async (e) => {
    e.preventDefault();
    
    if (!currentItem) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/checklaudoepi/update/${colaborador.matricula}/${currentItem.checklist_item_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'active',
          completion_date: formData.vencimento
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Erro ao atualizar item');
      
      showNotification('success', 'Item atualizado com sucesso');
      setShowModal(false);
      buscarChecklistColaborador();
    } catch (err) {
      showNotification('error', `Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Função para remover um item
  const removerItem = async (itemId) => {
    if (!confirm('Tem certeza que deseja remover este item?')) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/checklaudoepi/delete/${colaborador.matricula}/${itemId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Erro ao remover item');
      
      showNotification('success', 'Item removido com sucesso');
      buscarChecklistColaborador();
    } catch (err) {
      showNotification('error', `Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir o modal de edição
  const abrirModalEdicao = (item) => {
    setCurrentItem(item);
    setFormData({
      item: item.item_name,
      laudo: item.laudo_number || '',
      vencimento: formatarDataParaInput(item.completion_date)
    });
    setShowModal(true);
  };

  // Função para exibir notificações
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Função auxiliar para formatar data para input
  const formatarDataParaInput = (dataString) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toISOString().split('T')[0];
  };

  // Função para determinar o status de um item baseado na data de vencimento
  const getItemStatus = (vencimento) => {
    if (!vencimento) return 'normal';
    
    const dataVencimento = new Date(vencimento);
    const hoje = new Date();
    const diff = Math.floor((dataVencimento - hoje) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return 'vencido';
    if (diff <= 30) return 'proximo';
    return 'normal';
  };

  // Função para aplicar filtros aos itens
  const getItensFilteredAndSorted = () => {
    let itens = [...checklistItems];
    
    // Aplicar filtro de status
    if (filtros.status !== 'todos') {
      itens = itens.filter(item => {
        const status = getItemStatus(item.completion_date);
        return status === filtros.status;
      });
    }
    
    // Aplicar filtro de data de vencimento
    if (filtros.dataVencimento) {
      const dataFiltro = new Date(filtros.dataVencimento);
      itens = itens.filter(item => {
        const dataVencimento = new Date(item.completion_date);
        return dataVencimento.toISOString().split('T')[0] === dataFiltro.toISOString().split('T')[0];
      });
    }
    
    // Ordenar por data de vencimento (do mais próximo ao mais distante)
    itens.sort((a, b) => {
      const dataA = new Date(a.completion_date);
      const dataB = new Date(b.completion_date);
      return dataA - dataB;
    });
    
    return itens;
  };

  // Função para limpar os filtros
  const limparFiltros = () => {
    setFiltros({
      status: 'todos',
      dataVencimento: ''
    });
  };

  // Função para lidar com mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para lidar com mudanças nos filtros
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h1>Checklist de EPIs e Laudos</h1>
        <p>Gerencie os equipamentos de proteção individual e laudos médicos dos colaboradores</p>
      </header>

      <div className={styles.contentGrid}>
        {/* Seção de filtros */}
        <div className={styles.filtersCard}>
          <h2>Filtros</h2>
          <form className={styles.filterForm}>
            <div className={styles.formGroup}>
              <label htmlFor="matricula">Matrícula do Colaborador</label>
              <input
                type="text"
                id="matricula"
                className={styles.input}
                value={colaborador.matricula}
                onChange={(e) => setColaborador({ ...colaborador, matricula: e.target.value })}
                placeholder="Digite a matrícula"
              />
            </div>
            
            {colaborador.matricula && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="nome">Nome do Colaborador</label>
                  <input
                    type="text"
                    id="nome"
                    className={styles.input}
                    value={colaborador.nome}
                    onChange={(e) => setColaborador({ ...colaborador, nome: e.target.value })}
                    placeholder="Digite o nome"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    className={styles.select}
                    value={filtros.status}
                    onChange={handleFiltroChange}
                  >
                    <option value="todos">Todos</option>
                    <option value="vencido">Vencidos</option>
                    <option value="proximo">Próximos a vencer</option>
                    <option value="normal">Regulares</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="dataVencimento">Data de Vencimento</label>
                  <input
                    type="date"
                    id="dataVencimento"
                    name="dataVencimento"
                    className={styles.input}
                    value={filtros.dataVencimento}
                    onChange={handleFiltroChange}
                  />
                </div>
                
                <button
                  type="button"
                  className={styles.resetButton}
                  onClick={limparFiltros}
                >
                  Limpar Filtros
                </button>
              </>
            )}
            
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.addButton}
                onClick={buscarChecklistColaborador}
                disabled={!colaborador.matricula || loading}
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Seção do formulário */}
        {colaborador.matricula && (
          <div className={styles.formCard}>
            <h2>Adicionar Item</h2>
            <form className={styles.addForm} onSubmit={adicionarItem}>
              <div className={styles.formGroup}>
                <label htmlFor="item">Item EPI / Laudo *</label>
                <input
                  type="text"
                  id="item"
                  name="item"
                  className={styles.input}
                  value={formData.item}
                  onChange={handleInputChange}
                  placeholder="Nome do EPI ou Laudo"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="laudo">Número do Laudo/Documento</label>
                <input
                  type="text"
                  id="laudo"
                  name="laudo"
                  className={styles.input}
                  value={formData.laudo}
                  onChange={handleInputChange}
                  placeholder="Número do laudo (opcional)"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="vencimento">Data de Vencimento *</label>
                <input
                  type="date"
                  id="vencimento"
                  name="vencimento"
                  className={styles.input}
                  value={formData.vencimento}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.addButton}
                  disabled={loading}
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Seção de tabela */}
        {colaborador.matricula && (
          <div className={styles.tableSection}>
            <h2>Lista de EPIs e Laudos</h2>
            
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Carregando dados...</p>
              </div>
            ) : error ? (
              <div className={styles.errorContainer}>
                <div className={styles.errorIcon}>!</div>
                <h3>Erro ao carregar os dados</h3>
                <p>{error}</p>
                <button className={styles.retryButton} onClick={buscarChecklistColaborador}>
                  Tentar Novamente
                </button>
              </div>
            ) : checklistItems.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <p>Nenhum item encontrado para este colaborador</p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Laudo/Ref.</th>
                      <th>Vencimento</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getItensFilteredAndSorted().map((item) => {
                      const status = getItemStatus(item.completion_date);
                      return (
                        <tr key={item.checklist_item_id} className={`${styles.tableRow} ${styles[status]}`}>
                          <td>{item.item_name}</td>
                          <td>{item.laudo_number || 'N/A'}</td>
                          <td>
                            {item.completion_date
                              ? new Date(item.completion_date).toLocaleDateString('pt-BR')
                              : 'Não informado'}
                          </td>
                          <td>
                            <span className={styles[`status-${status}`]}>
                              {status === 'vencido'
                                ? 'Vencido'
                                : status === 'proximo'
                                ? 'Próximo'
                                : 'Regular'}
                            </span>
                          </td>
                          <td className={styles.actions}>
                            <button
                              className={styles.editButton}
                              onClick={() => abrirModalEdicao(item)}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => removerItem(item.checklist_item_id)}
                              title="Remover"
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
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Editar Item</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form className={styles.editForm} onSubmit={atualizarItem}>
              <div className={styles.formGroup}>
                <label htmlFor="edit-item">Item EPI / Laudo</label>
                <input
                  type="text"
                  id="edit-item"
                  name="item"
                  className={styles.input}
                  value={formData.item}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="edit-laudo">Número do Laudo/Documento</label>
                <input
                  type="text"
                  id="edit-laudo"
                  name="laudo"
                  className={styles.input}
                  value={formData.laudo}
                  onChange={handleInputChange}
                  placeholder="Número do laudo (opcional)"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="edit-vencimento">Data de Vencimento</label>
                <input
                  type="date"
                  id="edit-vencimento"
                  name="vencimento"
                  className={styles.input}
                  value={formData.vencimento}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={loading}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notificação */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ChecklistEPI;