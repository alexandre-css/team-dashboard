import React, { useState } from 'react';
import './dashboard.css';

const Dashboard = () => {
  const [avisos, setAvisos] = useState([
    {
      id: 1,
      tipo: 'urgent',
      titulo: 'Reunião de equipe',
      descricao: 'Amanhã às 14:00 - Sala de conferências',
      tempo: '2 horas atrás'
    },
    {
      id: 2,
      tipo: 'info',
      titulo: 'Nova política de home office',
      descricao: 'Confira as diretrizes atualizadas',
      tempo: '1 dia atrás'
    }
  ]);
  
  const [novoAviso, setNovoAviso] = useState({
    titulo: '',
    descricao: '',
    tipo: 'info'
  });
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const adicionarAviso = () => {
    if (novoAviso.titulo.trim() && novoAviso.descricao.trim()) {
      const aviso = {
        id: Date.now(),
        ...novoAviso,
        tempo: 'agora'
      };
      setAvisos([aviso, ...avisos]);
      setNovoAviso({ titulo: '', descricao: '', tipo: 'info' });
      setMostrarFormulario(false);
    }
  };
  
  const removerAviso = (id) => {
    setAvisos(avisos.filter(aviso => aviso.id !== id));
  };

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
              <button className="add-btn" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
                {mostrarFormulario ? '×' : '+'}
              </button>
            </div>
            <div className="card-content">
              {mostrarFormulario && (
                <div className="aviso-form">
                  <select 
                    value={novoAviso.tipo}
                    onChange={(e) => setNovoAviso({...novoAviso, tipo: e.target.value})}
                    className="form-select"
                  >
                    <option value="info">Info</option>
                    <option value="urgent">Urgente</option>
                    <option value="warning">Aviso</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Título do aviso"
                    value={novoAviso.titulo}
                    onChange={(e) => setNovoAviso({...novoAviso, titulo: e.target.value})}
                    className="form-input"
                  />
                  <textarea
                    placeholder="Descrição do aviso"
                    value={novoAviso.descricao}
                    onChange={(e) => setNovoAviso({...novoAviso, descricao: e.target.value})}
                    className="form-textarea"
                  />
                  <button onClick={adicionarAviso} className="form-submit">
                    Adicionar Aviso
                  </button>
                </div>
              )}
              {avisos.map(aviso => (
                <div key={aviso.id} className="aviso-item">
                  <div className={`aviso-dot ${aviso.tipo}`}></div>
                  <div className="aviso-text">
                    <strong>{aviso.titulo}</strong>
                    <p>{aviso.descricao}</p>
                    <span className="aviso-time">{aviso.tempo}</span>
                  </div>
                  <button 
                    onClick={() => removerAviso(aviso.id)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card calendario-card">
            <div className="card-header">
              <h3>📅 Calendário</h3>
            </div>
            <div className="card-content">
              <iframe 
                src="https://calendar.google.com/calendar/embed?src=c30807268699bd3ee379858bd2a143ad7d1b8aceacdcf20a9e138085cb70cad0%40group.calendar.google.com&ctz=America%2FSao_Paulo"
                style={{border: 0, width: '100%', height: '350px'}}
                frameBorder="0"
                scrolling="no"
                title="Google Calendar"
              />
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