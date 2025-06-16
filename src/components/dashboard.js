import React from 'react';
import './dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="logo">
          <h2>📊 TeamDash</h2>
        </div>
        <nav className="nav-menu">
          <div className="nav-item active">
            <span className="nav-icon">🏠</span>
            Dashboard
          </div>
          <div className="nav-item">
            <span className="nav-icon">📝</span>
            Avisos
          </div>
          <div className="nav-item">
            <span className="nav-icon">📅</span>
            Calendário
          </div>
          <div className="nav-item">
            <span className="nav-icon">📁</span>
            Arquivos
          </div>
          <div className="nav-item">
            <span className="nav-icon">📊</span>
            Métricas
          </div>
        </nav>
      </div>

      <div className="main-content">
        <header className="dashboard-header">
          <h1>Dashboard da Equipe</h1>
          <div className="user-info">
            <span>Bem-vindo, Admin</span>
            <div className="user-avatar">A</div>
          </div>
        </header>

        <div className="dashboard-grid">
          <div className="card avisos-card">
            <div className="card-header">
              <h3>📢 Avisos Recentes</h3>
              <button className="add-btn">+</button>
            </div>
            <div className="card-content">
              <div className="aviso-item">
                <div className="aviso-dot urgent"></div>
                <div className="aviso-text">
                  <strong>Reunião de equipe</strong>
                  <p>Amanhã às 14:00 - Sala de conferências</p>
                  <span className="aviso-time">2 horas atrás</span>
                </div>
              </div>
              <div className="aviso-item">
                <div className="aviso-dot info"></div>
                <div className="aviso-text">
                  <strong>Nova política de home office</strong>
                  <p>Confira as diretrizes atualizadas</p>
                  <span className="aviso-time">1 dia atrás</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card calendario-card">
            <div className="card-header">
              <h3>📅 Calendário</h3>
              <select className="month-selector">
                <option>Janeiro 2025</option>
              </select>
            </div>
            <div className="card-content">
              <div className="calendario-placeholder">
                <div className="evento-item">
                  <span className="evento-time">14:00</span>
                  <span className="evento-title">Reunião de equipe</span>
                </div>
                <div className="evento-item">
                  <span className="evento-time">16:30</span>
                  <span className="evento-title">Review do projeto</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card arquivos-card">
            <div className="card-header">
              <h3>📁 Arquivos Recentes</h3>
              <button className="drive-btn">Google Drive</button>
            </div>
            <div className="card-content">
              <div className="arquivo-item">
                <div className="arquivo-icon">📄</div>
                <div className="arquivo-info">
                  <strong>Relatório Mensal.pdf</strong>
                  <p>Modificado há 2 horas</p>
                </div>
                <button className="download-btn">⬇</button>
              </div>
              <div className="arquivo-item">
                <div className="arquivo-icon">📊</div>
                <div className="arquivo-info">
                  <strong>Planilha Orçamento.xlsx</strong>
                  <p>Modificado ontem</p>
                </div>
                <button className="download-btn">⬇</button>
              </div>
            </div>
          </div>

          <div className="card metricas-card">
            <div className="card-header">
              <h3>📊 Métricas</h3>
              <select className="period-selector">
                <option>Este mês</option>
              </select>
            </div>
            <div className="card-content">
              <div className="metric-item">
                <div className="metric-value">85%</div>
                <div className="metric-label">Produtividade</div>
                <div className="metric-change positive">+5%</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">23</div>
                <div className="metric-label">Tarefas</div>
                <div className="metric-change neutral">±0</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">12h</div>
                <div className="metric-label">Tempo médio</div>
                <div className="metric-change negative">-2h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;