import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const [avisos, setAvisos] = useState([]);
  const [novoAviso, setNovoAviso] = useState({
    titulo: '',
    descricao: '',
    tipo: 'warning'
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoAviso, setEditandoAviso] = useState(null);
  const [notebooks, setNotebooks] = useState([]);
  
  const [novoNotebook, setNovoNotebook] = useState({
    titulo: '',
    link: '',
    descricao: ''
  });
  
  const [mostrarFormularioNotebook, setMostrarFormularioNotebook] = useState(false);
  const [editandoNotebook, setEditandoNotebook] = useState(null);
  const [tjscLinks, setTjscLinks] = useState([]);
  const [novoTjscLink, setNovoTjscLink] = useState({
    titulo: '',
    link: ''
  });
  const [mostrarFormularioTjsc, setMostrarFormularioTjsc] = useState(false);
  const [editandoTjscLink, setEditandoTjscLink] = useState(null);

  useEffect(() => {
    carregarAvisos();
    carregarNotebooks();
    carregarTjscLinks();
  }, []);
  
  useEffect(() => {
    localStorage.setItem('notebooks', JSON.stringify(notebooks));
  }, [notebooks]);
  
const carregarNotebooks = async () => {
  try {
    const { data, error } = await supabase
      .from('notebooks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setNotebooks(data || []);
  } catch (error) {
    console.error('Erro ao carregar notebooks:', error);
  }
};

const carregarTjscLinks = async () => {
  try {
    const { data, error } = await supabase
      .from('tjsc_links')
      .select('*')
      .order('titulo', { ascending: true });
    
    if (error) throw error;
    setTjscLinks(data || []);
  } catch (error) {
    console.error('Erro ao carregar links TJSC:', error);
  }
};

  const carregarAvisos = async () => {
    try {
      const { data, error } = await supabase
        .from('avisos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAvisos(data || []);
    } catch (error) {
      console.error('Erro ao carregar avisos:', error);
    }
  };
  
  const adicionarAviso = async () => {
    if (editandoAviso) {
      await salvarEdicao();
      return;
    }
    
    if (novoAviso.titulo.trim() && novoAviso.descricao.trim()) {
      try {
        const { error } = await supabase
          .from('avisos')
          .insert([{
            titulo: novoAviso.titulo,
            descricao: novoAviso.descricao,
            tipo: novoAviso.tipo
          }]);
        
        if (error) throw error;
        
        await carregarAvisos();
        setNovoAviso({ titulo: '', descricao: '', tipo: 'warning' });
        setMostrarFormulario(false);
      } catch (error) {
        console.error('Erro ao adicionar aviso:', error);
      }
    }
  };
  
  const removerAviso = async (id) => {
    try {
      const { error } = await supabase
        .from('avisos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await carregarAvisos();
    } catch (error) {
      console.error('Erro ao remover aviso:', error);
    }
  };

  const editarAviso = (aviso) => {
    setEditandoAviso(aviso);
    setNovoAviso({
      titulo: aviso.titulo,
      descricao: aviso.descricao,
      tipo: aviso.tipo
    });
    setMostrarFormulario(true);
  };

  const salvarEdicao = async () => {
    if (novoAviso.titulo.trim() && novoAviso.descricao.trim()) {
      try {
        const { error } = await supabase
          .from('avisos')
          .update({
            titulo: novoAviso.titulo,
            descricao: novoAviso.descricao,
            tipo: novoAviso.tipo
          })
          .eq('id', editandoAviso.id);
        
        if (error) throw error;
        
        await carregarAvisos();
        setNovoAviso({ titulo: '', descricao: '', tipo: 'warning' });
        setMostrarFormulario(false);
        setEditandoAviso(null);
      } catch (error) {
        console.error('Erro ao editar aviso:', error);
      }
    }
  };

  const cancelarEdicao = () => {
    setEditandoAviso(null);
    setNovoAviso({ titulo: '', descricao: '', tipo: 'warning' });
    setMostrarFormulario(false);
  };

const adicionarNotebook = async () => {
  if (editandoNotebook) {
    await salvarEdicaoNotebook();
    return;
  }
  
  if (novoNotebook.titulo.trim() && novoNotebook.link.trim()) {
    try {
      const { error } = await supabase
        .from('notebooks')
        .insert([{
          titulo: novoNotebook.titulo,
          link: novoNotebook.link,
          descricao: novoNotebook.descricao
        }]);
      
      if (error) throw error;
      
      await carregarNotebooks();
      setNovoNotebook({ titulo: '', link: '', descricao: '' });
      setMostrarFormularioNotebook(false);
    } catch (error) {
      console.error('Erro ao adicionar notebook:', error);
    }
  }
};

const editarNotebook = (notebook) => {
  setEditandoNotebook(notebook);
  setNovoNotebook({
    titulo: notebook.titulo,
    link: notebook.link,
    descricao: notebook.descricao
  });
  setMostrarFormularioNotebook(true);
};

const salvarEdicaoNotebook = async () => {
  if (novoNotebook.titulo.trim() && novoNotebook.link.trim()) {
    try {
      const { error } = await supabase
        .from('notebooks')
        .update({
          titulo: novoNotebook.titulo,
          link: novoNotebook.link,
          descricao: novoNotebook.descricao
        })
        .eq('id', editandoNotebook.id);
      
      if (error) throw error;
      
      await carregarNotebooks();
      setNovoNotebook({ titulo: '', link: '', descricao: '' });
      setMostrarFormularioNotebook(false);
      setEditandoNotebook(null);
    } catch (error) {
      console.error('Erro ao editar notebook:', error);
    }
  }
};

const cancelarEdicaoNotebook = () => {
  setEditandoNotebook(null);
  setNovoNotebook({ titulo: '', link: '', descricao: '' });
  setMostrarFormularioNotebook(false);
};

const removerNotebook = async (id) => {
  try {
    const { error } = await supabase
      .from('notebooks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await carregarNotebooks();
  } catch (error) {
    console.error('Erro ao remover notebook:', error);
  }
};

const adicionarTjscLink = async () => {
  if (editandoTjscLink) {
    await salvarEdicaoTjscLink();
    return;
  }
  
  if (novoTjscLink.titulo.trim() && novoTjscLink.link.trim()) {
    try {
      const { error } = await supabase
        .from('tjsc_links')
        .insert([{
          titulo: novoTjscLink.titulo,
          link: novoTjscLink.link
        }]);
      
      if (error) throw error;
      
      await carregarTjscLinks();
      setNovoTjscLink({ titulo: '', link: '' });
      setMostrarFormularioTjsc(false);
    } catch (error) {
      console.error('Erro ao adicionar link TJSC:', error);
    }
  }
};

const editarTjscLink = (link) => {
  setEditandoTjscLink(link);
  setNovoTjscLink({
    titulo: link.titulo,
    link: link.link
  });
  setMostrarFormularioTjsc(true);
};

const salvarEdicaoTjscLink = async () => {
  if (novoTjscLink.titulo.trim() && novoTjscLink.link.trim()) {
    try {
      const { error } = await supabase
        .from('tjsc_links')
        .update({
          titulo: novoTjscLink.titulo,
          link: novoTjscLink.link
        })
        .eq('id', editandoTjscLink.id);
      
      if (error) throw error;
      
      await carregarTjscLinks();
      setNovoTjscLink({ titulo: '', link: '' });
      setMostrarFormularioTjsc(false);
      setEditandoTjscLink(null);
    } catch (error) {
      console.error('Erro ao editar link TJSC:', error);
    }
  }
};

const cancelarEdicaoTjscLink = () => {
  setEditandoTjscLink(null);
  setNovoTjscLink({ titulo: '', link: '', descricao: '' });
  setMostrarFormularioTjsc(false);
};

const removerTjscLink = async (id) => {
  try {
    const { error } = await supabase
      .from('tjsc_links')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await carregarTjscLinks();
  } catch (error) {
    console.error('Erro ao remover link TJSC:', error);
  }
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
              <h3>📢 Avisos </h3>
              <button className="add-btn" onClick={() => {
                if (mostrarFormulario && editandoAviso) {
                  cancelarEdicao();
                } else {
                  setMostrarFormulario(!mostrarFormulario);
                }
              }}>
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
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button onClick={adicionarAviso} className="form-submit">
                      {editandoAviso ? 'Salvar Edição' : 'Adicionar Aviso'}
                    </button>
                    {editandoAviso && (
                      <button onClick={cancelarEdicao} className="form-cancel">
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              )}
              {avisos.map(aviso => (
                <div key={aviso.id} className="aviso-item">
                  <div className={`aviso-dot ${aviso.tipo}`}></div>
                  <div className="aviso-text">
                    <strong>{aviso.titulo}</strong>
                    <p>{aviso.descricao}</p>
                    <span className="aviso-time">
                      {new Date(aviso.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="aviso-actions">
                    <button 
                      onClick={() => editarAviso(aviso)}
                      className="edit-btn"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => removerAviso(aviso.id)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        
          <div className="card calendario-card">
            <div className="card-header">
              <h3>
                <span className="google-calendar-icon"></span>
                Calendário
              </h3>
            </div>
            <div className="card-content">
              <iframe 
                src="https://calendar.google.com/calendar/embed?src=c30807268699bd3ee379858bd2a143ad7d1b8aceacdcf20a9e138085cb70cad0%40group.calendar.google.com&ctz=America%2FSao_Paulo&mode=AGENDA"
                style={{border: 0, width: '100%', height: '350px'}}
                frameBorder="0"
                scrolling="no"
                title="Google Calendar"
              />
            </div>
          </div>
        
          <div className="card arquivos-card">
            <div className="card-header">
              <h3>
                <span className="google-drive-icon"></span>
                Google Drive
              </h3>
              <button className="drive-btn" onClick={() => window.open('https://drive.google.com', '_blank')}>
                Abrir Drive
              </button>
            </div>
            <div className="card-content">
              <iframe 
                src="https://drive.google.com/embeddedfolderview?id=1kJ0XDQC8IP6WTvOFAQT4-iXRp308wLhc#list"
                style={{border: 0, width: '100%', height: '300px'}}
                frameBorder="0"
                title="Google Drive"
              />
            </div>
          </div>
        
          <div className="card metricas-card">
            <div className="card powerbi-card">
              <div className="card-header">
                <h3>
                  <span className="powerbi-icon"></span>
                  Gerencial de Gabinete
                </h3>
                <button className="drive-btn" onClick={() => window.open('https://app.powerbi.com', '_blank')}>
                  Abrir Power BI
                </button>
              </div>
              <div className="card-content">
                <iframe 
                  title="Gerencial de Gabinete"
                  src="https://app.powerbi.com/reportEmbed?reportId=6a74e9aa-0de1-415a-8cc6-5c243b756f73&appId=6556e9bb-d287-4773-9065-6dc5aaae8deb&autoAuth=true&ctid=400b79f8-9f13-47c7-923f-4b1695bf3b29"
                  frameBorder="0"
                  allowFullScreen={true}
                />
        </div>
      </div>
    </div>

    <div className="card notebook-card">
      <div className="card-header">
        <h3>
          <img 
            src="https://notebooklm.google.com/_/static/branding/v5/light_mode/icon.svg" 
            alt="NotebookLM" 
            style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}}
            />
          NotebookLM
        </h3>
        <button className="add-btn" onClick={() => {
          if (mostrarFormularioNotebook && editandoNotebook) {
            cancelarEdicaoNotebook();
          } else {
            setMostrarFormularioNotebook(!mostrarFormularioNotebook);
          }
        }}>
          {mostrarFormularioNotebook ? '×' : '+'}
        </button>
      </div>
      <div className="card-content">
        {mostrarFormularioNotebook && (
          <div className="notebook-form">
            <input
              type="text"
              placeholder="Título do notebook"
              value={novoNotebook.titulo}
              onChange={(e) => setNovoNotebook({...novoNotebook, titulo: e.target.value})}
              className="form-input"
            />
            <input
              type="url"
              placeholder="Link do NotebookLM"
              value={novoNotebook.link}
              onChange={(e) => setNovoNotebook({...novoNotebook, link: e.target.value})}
              className="form-input"
            />
            <textarea
              placeholder="Descrição do notebook"
              value={novoNotebook.descricao}
              onChange={(e) => setNovoNotebook({...novoNotebook, descricao: e.target.value})}
              className="form-textarea"
            />
            <div style={{display: 'flex', gap: '8px'}}>
              <button onClick={adicionarNotebook} className="form-submit">
                {editandoNotebook ? 'Salvar Edição' : 'Adicionar Notebook'}
              </button>
              {editandoNotebook && (
                <button onClick={cancelarEdicaoNotebook} className="form-cancel">
                  Cancelar
                </button>
              )}
            </div>
          </div>
        )}
        {notebooks.map(notebook => (
          <div key={notebook.id} className="notebook-item">
            <div className="notebook-text">
              <strong>{notebook.titulo}</strong>
              <p>{notebook.descricao}</p>
              <a href={notebook.link} target="_blank" rel="noopener noreferrer" className="notebook-link">
                Abrir Notebook
              </a>
              <span className="notebook-time">
                {new Date(notebook.created_at).toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="notebook-actions">
              <button 
                onClick={() => editarNotebook(notebook)}
                className="edit-btn"
              >
                ✏️
              </button>
              <button 
                onClick={() => removerNotebook(notebook.id)}
                className="remove-btn"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    <div className="card tjsc-card">
      <div className="card-header">
        <h3>
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwjLt4fG-DbafxSalutZqSasYowTPqx8BpExCZhYlV3qudDsO9H28H6l8de5Uw3q1m6RA&usqp=CAU" 
            alt="TJSC" 
            style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}}
          />
          TJSC
        </h3>
        <button className="add-btn" onClick={() => {
          if (mostrarFormularioTjsc && editandoTjscLink) {
            cancelarEdicaoTjscLink();
          } else {
            setMostrarFormularioTjsc(!mostrarFormularioTjsc);
          }
        }}>
          {mostrarFormularioTjsc ? '×' : '+'}
        </button>
      </div>
      <div className="card-content">
        {mostrarFormularioTjsc && (
          <div className="tjsc-form">
            <input
              type="text"
              placeholder="Título do link"
              value={novoTjscLink.titulo}
              onChange={(e) => setNovoTjscLink({...novoTjscLink, titulo: e.target.value})}
              className="form-input"
            />
            <input
              type="url"
              placeholder="Link do TJSC"
              value={novoTjscLink.link}
              onChange={(e) => setNovoTjscLink({...novoTjscLink, link: e.target.value})}
              className="form-input"
            />
            <div style={{display: 'flex', gap: '8px'}}>
              <button onClick={adicionarTjscLink} className="form-submit">
                {editandoTjscLink ? 'Salvar Edição' : 'Adicionar Link'}
              </button>
              {editandoTjscLink && (
                <button onClick={cancelarEdicaoTjscLink} className="form-cancel">
                  Cancelar
                </button>
              )}
            </div>
          </div>
        )}
        {tjscLinks.map(link => (
          <div key={link.id} className="tjsc-item">
            <div className="tjsc-text">
              <strong>{link.titulo}</strong>
              <a href={link.link} target="_blank" rel="noopener noreferrer" className="tjsc-link">
                Abrir Link
              </a>
            </div>
            <div className="tjsc-actions">
              <button 
                onClick={() => editarTjscLink(link)}
                className="edit-btn"
              >
                ✏️
              </button>
              <button 
                onClick={() => removerTjscLink(link.id)}
                className="remove-btn"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default Dashboard;