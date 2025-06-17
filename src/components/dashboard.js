import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { supabase } from '../lib/supabase';
import { MdDashboard } from "react-icons/md";

const Dashboard = () => {
  const [avisos, setAvisos] = useState([]);
  const [novoAviso, setNovoAviso] = useState({
    titulo: '',
    descricao: '',
    tipo: 'warning',
    imagens: []
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
      
      const avisosProcessados = data.map(aviso => ({
        ...aviso,
        imagens: typeof aviso.imagens === 'string' ? JSON.parse(aviso.imagens) : (aviso.imagens || [])
      }));
      
      setAvisos(avisosProcessados || []);
    } catch (error) {
      console.error('Erro ao carregar avisos:', error);
    }
  };
  
  const adicionarAviso = async () => {
    if (editandoAviso) {
      await salvarEdicao();
      return;
    }
    
    if (novoAviso.titulo.trim()) {
      try {
        const { error } = await supabase
          .from('avisos')
          .insert([{
            titulo: novoAviso.titulo,
            descricao: novoAviso.descricao,
            tipo: novoAviso.tipo,
            imagens: JSON.stringify(novoAviso.imagens)
          }]);
        
        if (error) throw error;
        
        await carregarAvisos();
        setNovoAviso({ titulo: '', descricao: '', tipo: 'warning', imagens: [] });
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
      tipo: aviso.tipo,
      imagens: aviso.imagens || []
    });
    setMostrarFormulario(true);
  };

  const salvarEdicao = async () => {
    if (novoAviso.titulo.trim()) {
      try {
        const { error } = await supabase
          .from('avisos')
          .update({
            titulo: novoAviso.titulo,
            descricao: novoAviso.descricao,
            tipo: novoAviso.tipo,
            imagens: JSON.stringify(novoAviso.imagens)
          })
          .eq('id', editandoAviso.id);
        
        if (error) throw error;
        
        await carregarAvisos();
        setNovoAviso({ titulo: '', descricao: '', tipo: 'warning', imagens: [] });
        setMostrarFormulario(false);
        setEditandoAviso(null);
      } catch (error) {
        console.error('Erro ao editar aviso:', error);
      }
    }
  };

const formatText = (command) => {
  document.execCommand(command, false, null);
};

const handleImagePaste = (e) => {
  if (novoAviso.imagens.length >= 3) return;
  
  const items = e.clipboardData.items;
  for (let item of items) {
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile();
      const reader = new FileReader();
      reader.onload = (event) => {
        setNovoAviso({...novoAviso, imagens: [...novoAviso.imagens, event.target.result]});
      };
      reader.readAsDataURL(file);
      break;
    }
  }
};

const handleImageDrop = (e) => {
  e.preventDefault();
  if (novoAviso.imagens.length >= 3) return;
  
  const files = Array.from(e.dataTransfer.files).filter(file => file.type.indexOf('image') !== -1);
  const remainingSlots = 3 - novoAviso.imagens.length;
  const filesToProcess = files.slice(0, remainingSlots);
  
  filesToProcess.forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setNovoAviso(prev => ({...prev, imagens: [...prev.imagens, event.target.result]}));
    };
    reader.readAsDataURL(file);
  });
};

const removerImagem = (index) => {
  const novasImagens = novoAviso.imagens.filter((_, i) => i !== index);
  setNovoAviso({...novoAviso, imagens: novasImagens});
};

const abrirGaleria = (imagens) => {
  const overlay = document.createElement('div');
  overlay.className = 'image-popup-overlay';
  overlay.onclick = (e) => {
    if (e.target === overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };
  
  const popup = document.createElement('div');
  popup.className = 'image-popup';
  
  const gallery = document.createElement('div');
  gallery.className = 'image-gallery';
  
  imagens.forEach((img, index) => {
    const imgElement = document.createElement('img');
    imgElement.src = img;
    imgElement.className = 'image-popup-content';
    imgElement.style.display = index === 0 ? 'block' : 'none';
    gallery.appendChild(imgElement);
  });
  
  if (imagens.length > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '‹';
    prevBtn.className = 'gallery-nav prev';
    
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '›';
    nextBtn.className = 'gallery-nav next';
    
    const counter = document.createElement('div');
    counter.className = 'gallery-counter';
    counter.innerHTML = `1 / ${imagens.length}`;
    
    let currentIndex = 0;
    
    const updateGallery = () => {
      gallery.children[currentIndex].style.display = 'none';
      currentIndex = (currentIndex + 1) % imagens.length;
      gallery.children[currentIndex].style.display = 'block';
      counter.innerHTML = `${currentIndex + 1} / ${imagens.length}`;
    };
    
    const updateGalleryPrev = () => {
      gallery.children[currentIndex].style.display = 'none';
      currentIndex = currentIndex === 0 ? imagens.length - 1 : currentIndex - 1;
      gallery.children[currentIndex].style.display = 'block';
      counter.innerHTML = `${currentIndex + 1} / ${imagens.length}`;
    };
    
    nextBtn.onclick = updateGallery;
    prevBtn.onclick = updateGalleryPrev;
    
    popup.appendChild(prevBtn);
    popup.appendChild(nextBtn);
    popup.appendChild(counter);
  }
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.className = 'image-popup-close';
  closeBtn.onclick = () => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };
  
  popup.appendChild(gallery);
  popup.appendChild(closeBtn);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
};

  function cancelarEdicao() {
    setEditandoAviso(null);
    setNovoAviso({ titulo: '', descricao: '', tipo: 'warning', imagens: [] });
    setMostrarFormulario(false);
  }

const adicionarNotebook = async () => {
  if (editandoNotebook) {
    await salvarEdicaoNotebook();
    return;
  }
  
  if (novoNotebook.titulo.trim() && novoNotebook.link.trim()) {
    try {
      const { error } = await supabase
        .from('avisos')
        .insert([{
          titulo: novoAviso.titulo,
          descricao: novoAviso.descricao,
          tipo: novoAviso.tipo,
          imagens: novoAviso.imagens
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
        .from('avisos')
        .update({
          titulo: novoAviso.titulo,
          descricao: novoAviso.descricao,
          tipo: novoAviso.tipo,
          imagens: novoAviso.imagens
        })
        .eq('id', editandoAviso.id);
      
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
      <div className="header-section">
        <h2 className="main-title"><MdDashboard style={{marginRight: '8px', color: '#3b82f6'}} />TeamDash</h2>
      </div>
      <div className="main-content">
        <header className="dashboard-header">
          <div className="title-section">
            <h1>Dashboard</h1>
            <span className="subtitle">Gabinete Alexandre Morais da Rosa</span>
          </div>
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
                  <div className="rich-editor">
                    <div className="editor-toolbar">
                      <button type="button" onClick={() => formatText('bold')} className="format-btn">
                        <b>B</b>
                      </button>
                      <button type="button" onClick={() => formatText('italic')} className="format-btn">
                        <i>I</i>
                      </button>
                      <button type="button" onClick={() => formatText('underline')} className="format-btn">
                        <u>U</u>
                      </button>
                    </div>
                    <div
                      contentEditable
                      className="rich-textarea"
                      onInput={(e) => setNovoAviso({...novoAviso, descricao: e.target.innerHTML})}
                      dangerouslySetInnerHTML={{__html: novoAviso.descricao}}
                      suppressContentEditableWarning={true}
                    />
                  </div>
                  <div className="image-upload">
                    <label>Anexar imagens (máximo 3):</label>
                    <div 
                      className="image-drop-zone"
                      onPaste={handleImagePaste}
                      onDrop={handleImageDrop}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {novoAviso.imagens.length > 0 ? (
                        <div className="images-preview">
                          {novoAviso.imagens.map((img, index) => (
                            <div key={index} className="image-preview">
                              <img src={img} alt={`Preview ${index + 1}`} />
                              <button type="button" onClick={() => removerImagem(index)}>
                                ×
                              </button>
                            </div>
                          ))}
                          {novoAviso.imagens.length < 3 && (
                            <div className="add-more-message">
                              Cole mais imagens aqui (máximo {3 - novoAviso.imagens.length})
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="drop-message">
                          Cole imagens aqui (Ctrl+V) ou arraste arquivos (máximo 3)
                        </div>
                      )}
                    </div>
                  </div>
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
                    <div dangerouslySetInnerHTML={{__html: aviso.descricao}} />
                    <div className="aviso-images">
                      {(aviso.imagens && aviso.imagens.length > 0) && (
                        <button 
                          onClick={() => abrirGaleria(aviso.imagens)}
                          className="image-icon"
                          title={`Ver ${aviso.imagens.length} imagem${aviso.imagens.length > 1 ? 's' : ''} anexada${aviso.imagens.length > 1 ? 's' : ''}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                          </svg>
                          {aviso.imagens.length > 1 && <span className="image-count">{aviso.imagens.length}</span>}
                        </button>
                      )}
                    </div>
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
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg" 
                    alt="Power BI" 
                    style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}}
                    />
                  Power BI
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