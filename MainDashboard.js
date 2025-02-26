import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Dashboard.module.css';
import Checklists from './checklists';


const MainDashboard = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [expiredChecklists, setExpiredChecklists] = useState([]);
  const [loadingChecklists, setLoadingChecklists] = useState(true);
  const [isLaudosSubmenuOpen, setIsLaudosSubmenuOpen] = useState(false);
  const toggleLaudosSubmenu = () => {
    setIsLaudosSubmenuOpen(!isLaudosSubmenuOpen);
  };

  useEffect(() => {
    // Animation to show dashboard after page load
    const timer = setTimeout(() => {
      setShowDashboard(true);
    }, 100);

    // Get user data from localStorage
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.nome || 'Colaborador');
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }

    // Fetch expired checklists
    fetchExpiredChecklists();
    
    return () => clearTimeout(timer);
  }, [router]);

  const fetchExpiredChecklists = async () => {
    try {
      const response = await fetch('/checklists/expired');
      if (response.status === 200) {
        const data = await response.json();
        setExpiredChecklists(data);
      }
    } catch (error) {
      console.error('Erro ao buscar checklists vencidos:', error);
    } finally {
      setLoadingChecklists(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`${styles.dashboardContainer} ${showDashboard ? styles.visible : ''}`}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoWrapper}>
            <div className={styles.logoGlow}></div>
            <Image 
              src="/images/logo.png" 
              alt="PSE Energia" 
              width={120} 
              height={60}
              className={styles.logo}
              priority
            />
          </div>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </button>
        </div>
        
        <div className={styles.menuContainer}>
          <div 
            className={`${styles.menuItem} ${activeMenu === 'dashboard' ? styles.active : ''}`}
            onClick={() => setActiveMenu('dashboard')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            {isSidebarOpen && <span>Dashboard</span>}
          </div>
          
          <div 
            className={`${styles.menuItem} ${activeMenu === 'checklists' ? styles.active : ''}`}
            onClick={() => setActiveMenu('checklists')}
          >
            
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
           <line x1="16" y1="17" x2="8" y2="17"></line>
           <polyline points="10 9 9 9 8 9"></polyline>

            </svg>
            {isSidebarOpen && <span>Laudos</span>}
          </div>
          
          <div 
  className={`${styles.menuItem} ${activeMenu === 'laudos' ? styles.active : ''}`}
  onClick={() => {
    setActiveMenu('laudos');
    toggleLaudosSubmenu(); // Alterna o submenu
  }}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M9 11l3 3L22 4"></path>
  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
  </svg>
  {isSidebarOpen && <span>Checklists</span>}
</div>

{/* Submenu para Laudos */}
{isLaudosSubmenuOpen && (
  <div className={styles.submenu}>
    <div 
      className={`${styles.submenuItem} ${activeMenu === 'laudoEPI' ? styles.active : ''}`}
      onClick={() => setActiveMenu('laudoEPI')}
    >
      {isSidebarOpen && <span>Laudo EPI</span>}
    </div>
    <div 
      className={`${styles.submenuItem} ${activeMenu === 'laudoEquipe' ? styles.active : ''}`}
      onClick={() => setActiveMenu('laudoEquipe')}
    >
      {isSidebarOpen && <span>Laudo Equipe</span>}
    </div>
    <div 
      className={`${styles.submenuItem} ${activeMenu === 'laudoVeiculo' ? styles.active : ''}`}
      onClick={() => setActiveMenu('laudoVeiculo')}
    >
      {isSidebarOpen && <span>Laudo Veículo</span>}
    </div>
  </div>
)}


          
          <div 
            className={`${styles.menuItem} ${activeMenu === 'colaboradores' ? styles.active : ''}`}
            onClick={() => setActiveMenu('colaboradores')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            {isSidebarOpen && <span>Colaboradores</span>}
          </div>
          
          <div 
            className={`${styles.menuItem} ${activeMenu === 'relatorios' ? styles.active : ''}`}
            onClick={() => setActiveMenu('relatorios')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
              <line x1="2" y1="20" x2="22" y2="20"></line>
            </svg>
            {isSidebarOpen && <span>Relatórios</span>}
          </div>
          
          <div 
            className={`${styles.menuItem} ${activeMenu === 'configuracoes' ? styles.active : ''}`}
            onClick={() => setActiveMenu('configuracoes')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            {isSidebarOpen && <span>Configurações</span>}
          </div>
        </div>
        
        <div className={styles.sidebarFooter}>
          <div 
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {isSidebarOpen && <span>Sair</span>}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>Bem-vindo, {userName}</h1>
            <p>Painel de Controle</p>
          </div>
          <div className={styles.userProfile}>
            <div className={styles.notificationIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className={styles.notificationBadge}>3</span>
            </div>
            <div className={styles.profileCircle}>
              <span>{userName.charAt(0)}</span>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        {activeMenu === 'dashboard' && (
          <div className={styles.dashboardContent}>
            {/* Stats Cards */}
            <div className={styles.statsContainer}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <h3>Total Colaboradores</h3>
                  <p className={styles.statValue}>134</p>
                  <span className={styles.statChange}>+12% <span className={styles.statPeriod}>este mês</span></span>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <h3>Laudos Ativos</h3>
                  <p className={styles.statValue}>287</p>
                  <span className={styles.statChange}>+5% <span className={styles.statPeriod}>este mês</span></span>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.warningIcon}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <h3>Laudos Vencidos</h3>
                  <p className={styles.statValue}>2</p>
                  <span className={`${styles.statChange} ${styles.negative}`}>+8% <span className={styles.statPeriod}>este mês</span></span>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <h3>Atividades</h3>
                  <p className={styles.statValue}>42</p>
                  <span className={styles.statChange}>+18% <span className={styles.statPeriod}>esta semana</span></span>
                </div>
              </div>
            </div>
            
            {/* Charts and Tables Section */}
            <div className={styles.chartsContainer}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h3>Distribuição de Laudos por Setor</h3>
                  <div className={styles.chartActions}>
                    <button className={styles.chartButton}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className={styles.chartContent}>
                  <div className={styles.doughnutChartPlaceholder}>
                    <div className={styles.pieSegment} style={{ transform: 'rotate(0deg)', backgroundColor: 'var(--primary-gold-dark)'  }}></div>
                    <div className={styles.pieSegment} style={{ transform: 'rotate(120deg)', backgroundColor: 'var(--primary-gold)' }}></div>
                    <div className={styles.pieSegment} style={{ transform: 'rotate(240deg)', backgroundColor: 'var(--shadow-soft)' }}></div>
                    <div className={styles.pieCenter}></div>
                  </div>
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                      <span className={styles.legendColor} style={{ backgroundColor: 'var(--primary-gold-dark)' }}></span>
                      <span className={styles.legendText}>Linha Viva (45%)</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={styles.legendColor} style={{ backgroundColor: 'var(--primary-gold)' }}></span>
                      <span className={styles.legendText}>Emergência (35%)</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={styles.legendColor} style={{ backgroundColor: 'var(--primary-gold-light)' }}></span>
                      <span className={styles.legendText}>Outros (20%)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h3>Vencimentos Previstos</h3>
                  <div className={styles.chartActions}>
                    <button className={styles.chartButton}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className={styles.chartContent}>
                  <div className={styles.barChartPlaceholder}>
                    <div className={styles.barGroup}>
                      <div className={styles.barLabel}>Mar</div>
                      <div className={styles.barValue} style={{ height: '65%' }}><span>65</span></div>
                    </div>
                    <div className={styles.barGroup}>
                      <div className={styles.barLabel}>Abr</div>
                      <div className={styles.barValue} style={{ height: '40%' }}><span>40</span></div>
                    </div>
                    <div className={styles.barGroup}>
                      <div className={styles.barLabel}>Mai</div>
                      <div className={styles.barValue} style={{ height: '80%' }}><span>80</span></div>
                    </div>
                    <div className={styles.barGroup}>
                      <div className={styles.barLabel}>Jun</div>
                      <div className={styles.barValue} style={{ height: '55%' }}><span>55</span></div>
                    </div>
                    <div className={styles.barGroup}>
                      <div className={styles.barLabel}>Jul</div>
                      <div className={styles.barValue} style={{ height: '30%' }}><span>30</span></div>
                    </div>
                    <div className={styles.barGroup}>
                      <div className={styles.barLabel}>Ago</div>
                      <div className={styles.barValue} style={{ height: '45%' }}><span>45</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity Table */}
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h3>Laudos Recentemente Atualizados</h3>
                <button className={styles.viewAllButton}>Ver todos</button>
              </div>
              <div className={styles.tableContent}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Setor</th>
                      <th>Equipe</th>
                      <th>Item</th>
                      <th>Laudo</th>
                      <th>Vencimento</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Linha Viva</td>
                      <td>Equipe A</td>
                      <td>ALICATE AMPERIMETRO DIGITAL MINIPA ET-3200</td>
                      <td>LAUDO123</td>
                      <td>31/12/2024</td>
                      <td><span className={styles.statusBadge}>Ativo</span></td>
                    </tr>
                    <tr>
                      <td>Emergência</td>
                      <td>Equipe B</td>
                      <td>ATERRAMENTO TEMP MT 34,5KV</td>
                      <td>LAUDO456</td>
                      <td>30/06/2025</td>
                      <td><span className={styles.statusBadge}>Ativo</span></td>
                    </tr>
                    <tr>
                      <td>Linha Viva</td>
                      <td>Equipe C</td>
                      <td>BASTÃO DE MANOBRA</td>
                      <td>LAUDO789</td>
                      <td>15/03/2024</td>
                      <td><span className={`${styles.statusBadge} ${styles.expired}`}>Vencido</span></td>
                    </tr>
                    <tr>
                      <td>Manutenção</td>
                      <td>Equipe D</td>
                      <td>DETECTOR DE TENSÃO</td>
                      <td>LAUDO101</td>
                      <td>22/04/2025</td>
                      <td><span className={styles.statusBadge}>Ativo</span></td>
                    </tr>
                    <tr>
                      <td>Emergência</td>
                      <td>Equipe B</td>
                      <td>ESCADA EXTENSÍVEL</td>
                      <td>LAUDO202</td>
                      <td>10/01/2024</td>
                      <td><span className={`${styles.statusBadge} ${styles.expired}`}>Vencido</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


{activeMenu === 'checklists' ? (
  <Checklists/>
) 

//adicionar page menu acima

:activeMenu !== 'dashboard' && (
          <div className={styles.comingSoonContainer}>
            <div className={styles.comingSoonContent}>
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h2>Em Desenvolvimento</h2>
              <p>Este módulo está em fase de implementação. Volte em breve!</p>
              <button className={styles.returnButton} onClick={() => setActiveMenu('dashboard')}>
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainDashboard;