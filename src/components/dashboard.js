import React, { useState, useEffect, useCallback } from 'react';
import './dashboard.css';
import { supabase } from '../lib/supabase';
import { MdDashboard, MdFullscreen } from 'react-icons/md';
import { SiImessage } from "react-icons/si";
import { FaUserGear } from "react-icons/fa6";
import { TbLetterA } from "react-icons/tb";
import { AiFillRightCircle } from "react-icons/ai";
import { AiFillLeftCircle } from "react-icons/ai";
import { FaGavel, FaBalanceScale, FaFileAlt, FaBook, FaUsers, FaBuilding, FaClipboardList, FaSearch, FaCalendarAlt, FaCog, FaLaptop, FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaFolder, FaFolderOpen, FaDatabase, FaServer, FaCloud, FaLock, FaUnlock, FaKey, FaShieldAlt, FaUser, FaUserTie, FaIdCard, FaTools, FaWrench, FaCogs, FaHeadset, FaTicketAlt, FaBug, FaLifeRing, FaQuestionCircle, FaCommentDots, FaUserFriends, FaUserCheck, FaUserPlus, FaUserCog, FaHandshake, FaClipboard, FaUserMd, FaUserShield, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import { MdGavel, MdAccountBalance, MdDescription, MdLibraryBooks, MdPeople, MdBusiness, MdAssignment, MdEvent, MdHome, MdWork, MdSchool, MdLocalLibrary, MdAccountBalanceWallet, MdAssignmentInd, MdClass, MdContactMail, MdContactPhone, MdGrade, MdGroup, MdHistory, MdInfo, MdLaunch, MdList, MdLocationOn, MdMail, MdNotifications, MdPerson, MdPhone, MdPlace, MdPublic, MdSchedule, MdSecurity, MdSupervisorAccount, MdVerifiedUser, MdVisibility, MdBuild, MdSupport, MdReportProblem, MdHelpOutline, MdBugReport, MdHandyman, MdPersonAdd, MdGroupAdd, MdBadge, MdCardMembership, MdManageAccounts, MdWorkOutline } from 'react-icons/md';
import { AiOutlineBank, AiOutlineHome, AiOutlinePhone, AiOutlineMail, AiOutlineUser, AiOutlineTeam, AiOutlineFileText, AiOutlineFolder, AiOutlineSafety, AiOutlineSchedule, AiOutlineSetting, AiOutlineSearch, AiOutlineBook, AiOutlineGlobal, AiOutlineAudit, AiOutlineProject, AiOutlineDatabase } from 'react-icons/ai';
import { NotebookLM } from '@lobehub/icons';

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const CALENDAR_ID = 'c30807268699bd3ee379858bd2a143ad7d1b8aceacdcf20a9e138085cb70cad0@group.calendar.google.com';
const DRIVE_FOLDER_ID = '1kJ0XDQC8IP6WTvOFAQT4-iXRp308wLhc';

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
  const [mostrarFormularioNotebook, setMostrarFormularioNotebook] = useState(false);
  
  const [novoNotebook, setNovoNotebook] = useState({
    titulo: '',
    link: '',
    descricao: ''
  });
  
  const [editandoNotebook, setEditandoNotebook] = useState(null);
  const [tjscLinks, setTjscLinks] = useState([]);
  const [novoTjscLink, setNovoTjscLink] = useState({
    titulo: '',
    link: '',
    icone: 'FaGavel'
  });

  const [mostrarFormularioTjsc, setMostrarFormularioTjsc] = useState(false);
  const [editandoTjscLink, setEditandoTjscLink] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [carregandoCalendario, setCarregandoCalendario] = useState(false);
  const [showPowerBIModal, setShowPowerBIModal] = useState(false);
  
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [itemParaExcluir, setItemParaExcluir] = useState(null);
  const [tipoItemExcluir, setTipoItemExcluir] = useState('');

  const [mostrarGaleria, setMostrarGaleria] = useState(false);
  const [imagensGaleria, setImagensGaleria] = useState([]);
  const [imagemAtual, setImagemAtual] = useState(0);
  const [relatorioAtivo, setRelatorioAtivo] = useState('gerencial');

  const [arquivosDrive, setArquivosDrive] = useState([]);
  const [carregandoDrive, setCarregandoDrive] = useState(false);
  const [mostrarModalDrive, setMostrarModalDrive] = useState(false);
  const [pastasExpandidas, setPastasExpandidas] = useState({});
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
  const [mostrarSubmenuTemas, setMostrarSubmenuTemas] = useState(false);
  const [user, setUser] = useState(null);
  const [tema, setTema] = useState(() => {
  const temaSalvo = localStorage.getItem('tema');
    return temaSalvo || 'claro';
  });

  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
  
const loginGoogle = async () => {
  await supabase.auth.signInWithOAuth({ provider: 'google' });
};

const logout = async () => {
  await supabase.auth.signOut();
};

const carregarTjscLinks = useCallback(async () => {
  let linksServidor = []
  if (user) {
    let query = supabase.from('tjsc_links').select('*').order('titulo', { ascending: true })
    query = query.or(`is_default.eq.true,user_id.eq.${user.id}`)
    const { data, error } = await query
    if (!error) linksServidor = data || []
  } else {
    const { data, error } = await supabase.from('tjsc_links').select('*').eq('is_default', true).order('titulo', { ascending: true })
    if (!error) linksServidor = data || []
  }
  let linksLocal = []
  if (!user) {
    const local = localStorage.getItem('tjscLinksLocal')
    if (local) linksLocal = JSON.parse(local)
  }
  setTjscLinks([...linksServidor, ...linksLocal])
}, [user])

  useEffect(() => {
    carregarTjscLinks();
  }, [user, carregarTjscLinks]);

  useEffect(() => {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo && temaSalvo !== tema) {
      setTema(temaSalvo);
    }
    carregarAvisos();
    carregarNotebooks();
    carregarEventosCalendario();
    carregarArquivosDrive();
    document.body.className = `tema-${tema}`;
  }, [tema]);
  
  useEffect(() => {
    localStorage.setItem('notebooks', JSON.stringify(notebooks));
  }, [notebooks]);

const iconesDisponiveis = {
  FaGavel, FaBalanceScale, FaFileAlt, FaBook, FaUsers, FaBuilding, 
  FaClipboardList, FaSearch, FaCalendarAlt, FaCog, FaLaptop, FaHome, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaInfoCircle, FaExclamationTriangle, 
  FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaFolder, FaFolderOpen, 
  FaDatabase, FaServer, FaCloud, FaLock, FaUnlock, FaKey, FaShieldAlt, 
  FaUser, FaUserTie, FaIdCard, FaTools, FaWrench, FaCogs, FaHeadset, 
  FaTicketAlt, FaBug, FaLifeRing, FaQuestionCircle, FaCommentDots, 
  FaUserFriends, FaUserCheck, FaUserPlus, FaUserCog, FaHandshake, 
  FaClipboard, FaUserMd, FaUserShield,
  MdGavel, MdAccountBalance, MdDescription, MdLibraryBooks, MdPeople, 
  MdBusiness, MdAssignment, MdEvent, MdHome, MdWork, MdSchool, 
  MdLocalLibrary, MdAccountBalanceWallet, MdAssignmentInd, MdClass, 
  MdContactMail, MdContactPhone, MdGrade, MdGroup, MdHistory, MdInfo, 
  MdLaunch, MdList, MdLocationOn, MdMail, MdNotifications, MdPerson, 
  MdPhone, MdPlace, MdPublic, MdSchedule, MdSecurity, MdSupervisorAccount, 
  MdVerifiedUser, MdVisibility, MdBuild, MdSupport, MdReportProblem, 
  MdHelpOutline, MdBugReport, MdHandyman, MdPersonAdd, MdGroupAdd, 
  MdBadge, MdCardMembership, MdManageAccounts, MdWorkOutline,
  AiOutlineBank, AiOutlineHome, AiOutlinePhone, AiOutlineMail, 
  AiOutlineUser, AiOutlineTeam, AiOutlineFileText, AiOutlineFolder, 
  AiOutlineSafety, AiOutlineSchedule, AiOutlineSetting, AiOutlineSearch, 
  AiOutlineBook, AiOutlineGlobal, AiOutlineAudit, AiOutlineProject, 
  AiOutlineDatabase
};

const categorias = {
  'Justiça': ['FaGavel', 'FaBalanceScale', 'MdGavel', 'MdAccountBalance'],
  'Documentos': ['FaFileAlt', 'FaBook', 'FaClipboard', 'MdDescription', 'MdLibraryBooks', 'AiOutlineFileText', 'AiOutlineBook'],
  'Pessoas': ['FaUsers', 'FaUser', 'FaUserTie', 'FaUserFriends', 'FaUserCheck', 'FaUserPlus', 'FaUserCog', 'FaUserMd', 'FaUserShield', 'MdPeople', 'MdPerson', 'MdPersonAdd', 'MdGroupAdd', 'AiOutlineUser', 'AiOutlineTeam'],
  'Prédios': ['FaBuilding', 'FaHome', 'MdBusiness', 'MdHome', 'MdWork', 'AiOutlineBank', 'AiOutlineHome'],
  'Comunicação': ['FaPhone', 'FaEnvelope', 'MdContactMail', 'MdContactPhone', 'MdMail', 'MdPhone', 'AiOutlinePhone', 'AiOutlineMail'],
  'Sistema': ['FaDatabase', 'FaServer', 'FaCloud', 'FaCog', 'FaCogs', 'FaTools', 'FaWrench', 'MdBuild', 'AiOutlineDatabase', 'AiOutlineProject'],
  'Segurança': ['FaLock', 'FaUnlock', 'FaKey', 'FaShieldAlt', 'MdSecurity', 'MdVerifiedUser', 'AiOutlineSafety'],
  'Interface': ['FaSearch', 'FaEye', 'FaInfoCircle', 'FaCheckCircle', 'FaTimesCircle', 'MdVisibility', 'MdInfo', 'AiOutlineSearch'],
  'Tempo': ['FaCalendarAlt', 'FaClock', 'MdEvent', 'MdSchedule', 'AiOutlineSchedule'],
  'Outros': ['FaMapMarkerAlt', 'FaExclamationTriangle', 'FaFolder', 'FaFolderOpen', 'FaLaptop', 'FaIdCard', 'FaHeadset', 'FaTicketAlt', 'FaBug', 'FaLifeRing', 'FaQuestionCircle', 'FaCommentDots', 'FaHandshake', 'MdAssignment', 'MdClass', 'MdGrade', 'MdGroup', 'MdHistory', 'MdLaunch', 'MdList', 'MdLocationOn', 'MdNotifications', 'MdPlace', 'MdPublic', 'MdSupport', 'MdReportProblem', 'MdHelpOutline', 'MdBugReport', 'MdHandyman', 'MdBadge', 'MdCardMembership', 'MdManageAccounts', 'MdWorkOutline', 'AiOutlineFolder', 'AiOutlineSetting', 'AiOutlineGlobal', 'AiOutlineAudit']
};

const alterarTema = (novoTema) => {
  setTema(novoTema);
  localStorage.setItem('tema', novoTema);
};

const carregarArquivosDrive = async () => {
  if (!GOOGLE_API_KEY) {
    console.error('API Key não encontrada');
    return;
  }
  
  setCarregandoDrive(true);
  try {
    const url = `https://www.googleapis.com/drive/v3/files?key=${GOOGLE_API_KEY}&q='${DRIVE_FOLDER_ID}'+in+parents&fields=files(id,name,mimeType,modifiedTime,size,webViewLink,webContentLink,thumbnailLink)&orderBy=name`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.status === 403) {
      console.error('Erro 403: Verifique as permissões da API Key para Google Drive');
      return;
    }
    
    if (data.error) {
      console.error('Erro da API Drive:', data.error);
      return;
    }
    
    const arquivos = data.files || [];
    const pastasPrincipais = arquivos.filter(arquivo => 
      arquivo.mimeType.includes('folder') && 
      (arquivo.name.toLowerCase().includes('livros') || arquivo.name.toLowerCase().includes('tutoriais'))
    );
    
    for (const pasta of pastasPrincipais) {
      const conteudoUrl = `https://www.googleapis.com/drive/v3/files?key=${GOOGLE_API_KEY}&q='${pasta.id}'+in+parents&fields=files(id,name,mimeType,modifiedTime,size,webViewLink,webContentLink,thumbnailLink)&orderBy=name`;
      
      try {
        const conteudoResponse = await fetch(conteudoUrl);
        const conteudoData = await conteudoResponse.json();
        
        if (conteudoData.files) {
          pasta.arquivos = conteudoData.files;
        }
      } catch (error) {
        console.error(`Erro ao carregar conteúdo da pasta ${pasta.name}:`, error);
        pasta.arquivos = [];
      }
    }
    
    const todasAsPastas = arquivos.filter(arquivo => arquivo.mimeType.includes('folder'));
    
    setArquivosDrive({ cardPrincipal: pastasPrincipais, todasPastas: todasAsPastas });
  } catch (error) {
    console.error('Erro ao carregar arquivos do Drive:', error);
  }
  setCarregandoDrive(false);
};

const getFileIcon = (mimeType) => {
  if (mimeType.includes('folder')) return <FaFolder />;
  if (mimeType.includes('document')) return <FaFileAlt />;
  if (mimeType.includes('spreadsheet')) return <FaFileAlt />;
  if (mimeType.includes('presentation')) return <FaFileAlt />;
  if (mimeType.includes('pdf')) return <FaFileAlt />;
  if (mimeType.includes('image')) return <FaFileAlt />;
  return <FaFileAlt />;
};

const getIconComponent = (iconName) => {
  const IconComponent = iconesDisponiveis[iconName];
  return IconComponent ? <IconComponent /> : <FaGavel />;
};

const togglePasta = (pastaId) => {
  setPastasExpandidas(prev => ({
    ...prev,
    [pastaId]: !prev[pastaId]
  }));
};

const carregarEventosCalendario = async () => {
  if (!GOOGLE_API_KEY) {
    console.error('API Key não encontrada');
    return;
  }
  
  setCarregandoCalendario(true);
  try {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    const timeMin = now.toISOString();
    const timeMax = endOfMonth.toISOString();
    
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${GOOGLE_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&maxResults=50&singleEvents=true&orderBy=startTime`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.status === 403) {
      console.error('Erro 403: Adicione localhost:3001 nas restrições da API Key');
      return;
    }
    
    if (data.error) {
      console.error('Erro da API:', data.error);
      return;
    }
    
    setEventos(data.items || []);
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  }
  setCarregandoCalendario(false);
};

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

const removerDirecaoUnicode = (texto) => {
  return texto.replace(/[\u202A-\u202E\u200E\u200F\u2066-\u2069]/g, '');
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
          descricao: removerDirecaoUnicode(novoAviso.descricao),
          tipo: novoAviso.tipo,
          imagens: JSON.stringify(novoAviso.imagens),
          user_id: user.id
        }]);
      if (error) throw error;
      await carregarAvisos();
      setNovoAviso({ titulo: '', descricao: '', tipo: 'warning', imagens: [] });
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Erro ao adicionar aviso:', error);
    }
  }
}

const editarAviso = (aviso) => {
  setEditandoAviso(aviso);
  setNovoAviso({
    titulo: aviso.titulo,
    descricao: removerDirecaoUnicode(aviso.descricao),
    tipo: aviso.tipo,
    imagens: aviso.imagens || []
  });
  setMostrarFormulario(true);
  setTimeout(() => {
    const formulario = document.querySelector('.aviso-form');
    if (formulario) {
      formulario.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, 100);
};

const salvarEdicao = async () => {
  if (novoAviso.titulo.trim()) {
    try {
      const { error } = await supabase
        .from('avisos')
        .update({
          titulo: novoAviso.titulo,
          descricao: removerDirecaoUnicode(novoAviso.descricao),
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
  setImagensGaleria(imagens);
  setImagemAtual(0);
  setMostrarGaleria(true);
};

const fecharGaleria = () => {
  setMostrarGaleria(false);
  setImagensGaleria([]);
  setImagemAtual(0);
};

const proximaImagem = () => {
  if (imagemAtual < imagensGaleria.length - 1) {
    setImagemAtual(imagemAtual + 1);
  }
};

const imagemAnterior = () => {
  if (imagemAtual > 0) {
    setImagemAtual(imagemAtual - 1);
  }
};

const cancelarEdicao = () => {
  setEditandoAviso(null);
  setNovoAviso({ titulo: '', descricao: '', tipo: 'warning', imagens: [] });
  setMostrarFormulario(false);
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
  
  setTimeout(() => {
    const formulario = document.querySelector('.notebook-form');
    if (formulario) {
      formulario.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, 100);
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

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

const adicionarTjscLink = async () => {
  if (editandoTjscLink) {
    await salvarEdicaoTjscLink()
    return
  }
  if (novoTjscLink.titulo.trim() && novoTjscLink.link.trim()) {
    if (user && user.email === ADMIN_EMAIL) {
      const { error } = await supabase
        .from('tjsc_links')
        .insert([{
          titulo: novoTjscLink.titulo,
          link: novoTjscLink.link,
          icone: novoTjscLink.icone,
          user_id: user.id,
          is_default: true
        }])
      if (error) return
      await carregarTjscLinks()
    } else {
      const local = localStorage.getItem('tjscLinksLocal')
      const linksLocal = local ? JSON.parse(local) : []
      const novoLink = {
        id: Date.now(),
        titulo: novoTjscLink.titulo,
        link: novoTjscLink.link,
        icone: novoTjscLink.icone,
        is_default: false
      }
      localStorage.setItem('tjscLinksLocal', JSON.stringify([...linksLocal, novoLink]))
      setTjscLinks(prev => [...prev, novoLink])
    }
    setNovoTjscLink({ titulo: '', link: '', icone: 'FaGavel' })
    setMostrarFormularioTjsc(false)
    setEditandoTjscLink(null)
  }
}

const editarTjscLink = (link) => {
  setEditandoTjscLink(link)
  setNovoTjscLink({
    titulo: link.titulo,
    link: link.link,
    icone: link.icone || 'FaGavel'
  })
  setMostrarFormularioTjsc(true)
}


const salvarEdicaoTjscLink = async () => {
  if (novoTjscLink.titulo.trim() && novoTjscLink.link.trim()) {
    if (user && user.email === ADMIN_EMAIL && editandoTjscLink.is_default) {
      try {
        const { error } = await supabase
          .from('tjsc_links')
          .update({
            titulo: novoTjscLink.titulo,
            link: novoTjscLink.link,
            icone: novoTjscLink.icone
          })
          .eq('id', editandoTjscLink.id)
        if (error) throw error
        await carregarTjscLinks()
      } catch (error) {
        console.error('Erro ao editar link TJSC:', error)
      }
    } else {
      const local = localStorage.getItem('tjscLinksLocal')
      let linksLocal = local ? JSON.parse(local) : []
      linksLocal = linksLocal.map(l =>
        l.id === editandoTjscLink.id
          ? { ...l, titulo: novoTjscLink.titulo, link: novoTjscLink.link, icone: novoTjscLink.icone }
          : l
      )
      localStorage.setItem('tjscLinksLocal', JSON.stringify(linksLocal))
      setTjscLinks(prev =>
        prev.map(l =>
          l.id === editandoTjscLink.id
            ? { ...l, titulo: novoTjscLink.titulo, link: novoTjscLink.link, icone: novoTjscLink.icone }
            : l
        )
      )
    }
    setNovoTjscLink({ titulo: '', link: '', icone: 'FaGavel' })
    setMostrarFormularioTjsc(false)
    setEditandoTjscLink(null)
  }
}

const cancelarEdicaoTjscLink = () => {
  setEditandoTjscLink(null);
  setNovoTjscLink({ titulo: '', link: '', icone: 'FaGavel' });
  setMostrarFormularioTjsc(false);
};

const removerTjscLink = async (id) => {
  const link = tjscLinks.find(l => l.id === id)
  if (user && user.email === ADMIN_EMAIL && link.is_default) {
    try {
      const { error } = await supabase
        .from('tjsc_links')
        .delete()
        .eq('id', id)
      if (error) throw error
      await carregarTjscLinks()
    } catch (error) {
      console.error('Erro ao remover link TJSC:', error)
    }
  } else {
    const local = localStorage.getItem('tjscLinksLocal')
    let linksLocal = local ? JSON.parse(local) : []
    linksLocal = linksLocal.filter(l => l.id !== id)
    localStorage.setItem('tjscLinksLocal', JSON.stringify(linksLocal))
    setTjscLinks(prev => prev.filter(l => l.id !== id))
  }
}

const confirmarExclusao = (id, tipo) => {
  setItemParaExcluir(id);
  setTipoItemExcluir(tipo);
  setMostrarConfirmacao(true);
};

const executarExclusao = () => {
  if (tipoItemExcluir === 'aviso') {
    removerAviso(itemParaExcluir);
  } else if (tipoItemExcluir === 'notebook') {
    removerNotebook(itemParaExcluir);
  } else if (tipoItemExcluir === 'tjsc') {
    removerTjscLink(itemParaExcluir);
  }
  setMostrarConfirmacao(false);
  setItemParaExcluir(null);
  setTipoItemExcluir('');
};

const cancelarExclusao = () => {
  setMostrarConfirmacao(false);
  setItemParaExcluir(null);
  setTipoItemExcluir('');
};

  return (

    <div className="dashboard">
      <div className="header-section">
        <div className="header-left">
          <h1 className="main-title">
            <MdDashboard size={26} />
            TeamDash
          </h1>
          <div className="subtitle-container">
            <span className="gabinete-label">Gabinete</span>
            <span className="desembargador-name">Alexandre Morais da Rosa</span>
          </div>
        </div>

        <div
          className={`user-info${user && user.app_metadata?.provider === 'google' ? ' capsula-google' : ''}`}
          onMouseEnter={() => setMostrarMenuUsuario(true)}
          onMouseLeave={() => setMostrarMenuUsuario(false)}
        >
          {user ? (
            <>
              <div className="user-avatar">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                ) : (
                  <TbLetterA />
                )}
              </div>
              <span className="user-name">{user.user_metadata?.name || user.email}</span>
            </>
          ) : (

            <button className="gsi-material-button" onClick={loginGoogle}>
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path className="g-shape" fill="currentColor" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path className="g-shape" fill="currentColor" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="#fff" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#fff" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  </svg>
                </div>
                <span className="gsi-material-button-contents">Entrar com Google</span>
                <span style={{ display: 'none' }}>Sign in with Google</span>
              </div>
            </button>
          )}
        
          {mostrarMenuUsuario && (
            <div className="user-menu"
              onMouseEnter={() => setMostrarMenuUsuario(true)}
              onMouseLeave={() => { setMostrarMenuUsuario(false); setMostrarSubmenuTemas(false); }}
            >
              <div className="user-menu-header">
                <div className="user-avatar-large"><FaUserGear /></div>
                <div className="user-details">
                  <h4>Configurações</h4>
                </div>
              </div>
              <div className="user-menu-items">
                <div className="user-menu-item">
                  <div className="menu-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <span>My Profile</span>
                </div>
                <div className="user-menu-item">
                  <div className="menu-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <span>User's Task</span>
                </div>
                <div className="user-menu-item">
                  <div className="menu-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                  </div>
                  <span>Case Study</span>
                </div>
                <div className="user-menu-item">
                  <div className="menu-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <circle cx="12" cy="16" r="1"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <span>Security</span>
                </div>
                <div className="user-menu-item">
                  <div className="menu-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
                    </svg>
                  </div>
                  <span>Your Ability</span>
                </div>
                <div className="user-menu-item tema-submenu"
                  onMouseEnter={() => setMostrarSubmenuTemas(true)}
                >
                  <div className="menu-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </div>
                  <span>Temas</span>
                  {mostrarSubmenuTemas && (
                    <div className="tema-options-dropdown">
                        <div className="tema-option" onClick={() => alterarTema('claro')}>
                          <div className="tema-preview tema-claro"></div>
                          <span>Padrão</span>
                        </div>
                        <div className="tema-option" onClick={() => alterarTema('escuro')}>
                          <div className="tema-preview tema-escuro"></div>
                          <span>Escuro</span>
                        </div>
                        <div className="tema-option" onClick={() => alterarTema('vermelho')}>
                          <div className="tema-preview tema-vermelho"></div>
                          <span>Vermelho</span>
                        </div>
                        <div className="tema-option" onClick={() => alterarTema('verde')}>
                          <div className="tema-preview tema-verde"></div>
                          <span>Verde</span>
                        </div>
                        <div className="tema-option" onClick={() => alterarTema('rosa')}>
                          <div className="tema-preview tema-rosa"></div>
                          <span>Rosa</span>
                        </div>
                        <div className="tema-option" onClick={() => alterarTema('black')}>
                          <div className="tema-preview tema-black"></div>
                          <span>Preto</span>
                        </div>
                        <div className="tema-option" onClick={() => alterarTema('tjsc')}>
                          <div className="tema-preview tema-tjsc"></div>
                          <span>Musgo</span>
                        </div>
                      </div>
                  )}
                </div>
                {user && (
                  <div className="user-menu-item logout" onClick={logout}
                  onMouseEnter={() => setMostrarMenuUsuario(true)}
                  onMouseLeave={() => setMostrarMenuUsuario(false)}
                  >
                    <div className="menu-item-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16,17 21,12 16,7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                    </div>
                    <span>Logout</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="main-content">
        <div className="dashboard-grid">
          <div className="card avisos-card">
            <div className="card-header">
              <h3>
                <SiImessage size={25} style={{marginRight: '8px'}} />
                Avisos
              </h3>
              <button 
                onClick={() => {
                  if (mostrarFormulario) {
                    setMostrarFormulario(false);
                    setNovoAviso({ titulo: '', descricao: '', tipo: 'warning', imagens: [] });
                    if (editandoAviso) {
                      setEditandoAviso(null);
                    }
                  } else {
                    setMostrarFormulario(true);
                    setTimeout(() => {
                      const formulario = document.querySelector('.aviso-form');
                      if (formulario) {
                        formulario.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'start' 
                        });
                      }
                    }, 100);
                  }
                }} 
                className="add-btn"
                title={mostrarFormulario ? "Cancelar" : "Adicionar aviso"}
              >
                {mostrarFormulario ? '×' : '+'}
              </button>
            </div>

            <div className="card-content">
              <div className="avisos-lista">
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
                        dir="ltr"
                        onBlur={e => {
                          let textoLimpo = removerDirecaoUnicode(e.target.innerHTML);
                          if (textoLimpo === '<br>' || textoLimpo === '&nbsp;' || textoLimpo.trim() === '') {
                            textoLimpo = '';
                            e.target.innerHTML = '';
                          }
                          setNovoAviso({...novoAviso, descricao: textoLimpo});
                        }}
                        suppressContentEditableWarning={true}
                      >
                        {novoAviso.descricao}
                      </div>
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
                      {!novoAviso.titulo.trim() && mostrarFormulario && (
                        <div style={{color: '#dc2626', fontSize: '0.95em', marginTop: '22px'}}>
                          O título do aviso é obrigatório.
                        </div>
                      )}
                      {editandoAviso && (
                        <button onClick={cancelarEdicao} className="form-cancel">
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {avisos.map(aviso => (
                  <div className={`aviso-item ${aviso.tipo}`} key={aviso.id}>
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
                            <span className="image-count-text">{aviso.imagens.length}</span>
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
                        title="Editar aviso"
                      >
                      </button>
                      <button 
                        onClick={() => confirmarExclusao(aviso.id, 'aviso')}
                        className="remove-btn"
                        title="Excluir aviso"
                      >
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
              
            <div className="card calendario-card">
              <div className="card-header">
                <h3>
                  <img 
                    src="https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_31.ico" 
                    alt="Google Calendar" 
                    style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}}
                  />
                  Próximos Eventos
                </h3>
              </div>
              <div className="card-content" style={{padding: 0}}>
                {carregandoCalendario ? (
                  <div className="loading-calendar">
                    <span>Carregando eventos...</span>
                  </div>
                ) : (
                  <div className="eventos-lista">
                    {eventos.length > 0 ? (
                      eventos.map(evento => {
                        const eventDate = new Date(evento.start.dateTime || evento.start.date + 'T00:00:00');
                        const isUrgent = evento.summary.toLowerCase().includes('limite');
                        const hasTime = evento.start.dateTime;
                        const hasLocation = evento.location;
                        
                        return (
                          <div key={evento.id} className="evento-item">
                            <div className="evento-date-section">
                              <div className="evento-weekday">
                                {eventDate.toLocaleDateString('pt-BR', { weekday: 'short' })}
                              </div>
                              <div className="evento-day">
                                {eventDate.getDate().toString().padStart(2, '0')}
                              </div>
                              <div className="evento-month">
                                {eventDate.toLocaleDateString('pt-BR', { month: 'short' })}
                              </div>
                            </div>
                            
                            <div className="evento-info">
                              {hasTime && (
                                <div className="evento-time-badge">
                                  {new Date(evento.start.dateTime).toLocaleTimeString('pt-BR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })} - {new Date(evento.end.dateTime).toLocaleTimeString('pt-BR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                              )}
                              
                              <h4 className="evento-title">{evento.summary}</h4>
                              
                              {hasLocation && (
                                <div className="evento-location">
                                  {evento.location}
                                </div>
                              )}
                            </div>
                            
                            <div className={`evento-status ${isUrgent ? 'urgent' : ''}`}></div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-events">
                        <span>Nenhum evento encontrado</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
        
          <div className="card arquivos-card">
            <div className="card-header">
              <h3>
                <span className="google-drive-icon"></span>
                Google Drive
              </h3>
              <div className="card-controls">
                <button 
                  className="drive-btn" 
                  onClick={() => setMostrarModalDrive(true)}
                  title="Ver todos os arquivos"
                >
                  <FaExternalLinkAlt size={14} />
                </button>
                <button 
                  className="drive-btn" 
                  onClick={() => window.open('https://drive.google.com', '_blank')}
                  title="Abrir Google Drive"
                >
                  Abrir Drive
                </button>
              </div>
            </div>

            <div className="card-content">
              {carregandoDrive ? (
                <div className="loading-drive">
                  <span>Carregando arquivos...</span>
                </div>
              ) : (
                <div className="arquivos-lista">
                  {arquivosDrive.cardPrincipal?.map(pasta => (
                    <div key={pasta.id} className="pasta-container">
                      <div 
                        className="pasta-header"
                        onClick={() => togglePasta(pasta.id)}
                      >
                        <div className="pasta-info">
                          <div className="pasta-icon">
                            {pastasExpandidas[pasta.id] ? <FaFolderOpen /> : <FaFolder />}
                          </div>
                          <h4 className="pasta-nome">{pasta.name}</h4>
                        </div>
                        <div className="pasta-toggle">
                          {pastasExpandidas[pasta.id] ? '▼' : '▶'}
                        </div>
                      </div>
                      
                      {pastasExpandidas[pasta.id] && pasta.arquivos && (
                        <div className="pasta-conteudo">
                          {pasta.arquivos.map(arquivo => (
                            <div key={arquivo.id} className="arquivo-item-submenu">
                              <div className="arquivo-icon-small">
                                {getFileIcon(arquivo.mimeType)}
                              </div>
                              <div className="arquivo-info-submenu">
                                <h5 
                                  className="arquivo-nome-submenu arquivo-nome-link"
                                  onClick={() => window.open(arquivo.webViewLink, '_blank')}
                                >
                                  {arquivo.name}
                                </h5>
                              </div>
                              <div className="arquivo-actions-submenu">
                                {arquivo.webContentLink && (
                                  <button 
                                    onClick={() => window.open(arquivo.webContentLink, '_blank')}
                                    className="download-btn-small"
                                    title="Baixar arquivo"
                                  >
                                    <FaDownload size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )) || []}
                </div>
              )}
                  </div>
                </div>
              
                <div className="card metricas-card">
                  <div className="card powerbi-card">
                    <div className="card-header">
                      <h3>
                        <img 
                          src="https://powerbi.microsoft.com/pictures/application-logos/svg/powerbi.svg" 
                          alt="Power BI" 
                          style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}}
                        />
                        Power BI
                      </h3>
                      <div className="powerbi-tabs">
                        <button 
                          className={`tab-btn ${relatorioAtivo === 'gerencial' ? 'active' : ''}`}
                          onClick={() => setRelatorioAtivo('gerencial')}
                        >
                          Gerencial
                        </button>
                        <button 
                          className={`tab-btn ${relatorioAtivo === 'metas' ? 'active' : ''}`}
                          onClick={() => setRelatorioAtivo('metas')}
                        >
                          Metas 2025
                        </button>
                      </div>
                      <button 
                        className="expand-btn"
                        onClick={() => setShowPowerBIModal(true)}
                        title="Abrir em tela cheia"
                      >
                        <MdFullscreen size={20} />
                      </button>
                    </div>
                    <div className="card-content" style={{padding: 0}}>
                      {relatorioAtivo === 'gerencial' ? (
                        <iframe
                          title="Gerencial de Gabinete - Preview"
                          width="100%"
                          height="100%"
                          src="https://app.powerbi.com/reportEmbed?reportId=6a74e9aa-0de1-415a-8cc6-5c243b756f73&appId=6556e9bb-d287-4773-9065-6dc5aaae8deb&autoAuth=true&ctid=400b79f8-9f13-47c7-923f-4b1695bf3b29&$filter=Desembargador eq 'ALEXANDRE MORAIS DA ROSA'"
                          frameBorder="0"
                          style={{borderRadius: '0 0 12px 12px'}}
                        />
                      ) : (
                        <iframe
                          title="Metas Nacionais 2025 - Preview"
                          width="100%"
                          height="100%"
                          src="https://app.powerbi.com/reportEmbed?reportId=70c60c77-b6fc-4266-ac19-4dc1631f7a4d&autoAuth=true&ctid=400b79f8-9f13-47c7-923f-4b1695bf3b29"
                          frameBorder="0"
                          style={{borderRadius: '0 0 12px 12px'}}
                        />
                      )}
                    </div>
                  </div>
                </div>
      
                <div className="card notebook-card">
                  <div className="card-header">
                    <h3>
                      <NotebookLM.Combine size={20} style={{marginRight: '8px'}} />
                    </h3>
                    <button 
                      onClick={() => {
                        if (mostrarFormularioNotebook && editandoNotebook) {
                          cancelarEdicaoNotebook();
                        } else {
                          setMostrarFormularioNotebook(!mostrarFormularioNotebook);
                        }
                      }} 
                      className="add-btn"
                      title={mostrarFormularioNotebook ? "Cancelar" : "Adicionar notebook"}
                    >
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
                          placeholder="Link do notebook"
                          value={novoNotebook.link}
                          onChange={(e) => setNovoNotebook({...novoNotebook, link: e.target.value})}
                          className="form-input"
                        />
                        <input
                          type="text"
                          placeholder="Descrição (opcional)"
                          value={novoNotebook.descricao}
                          onChange={(e) => setNovoNotebook({...novoNotebook, descricao: e.target.value})}
                          className="form-input"
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
                      <a 
                        href={notebook.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="notebook-item-link"
                        key={notebook.id}
                        onMouseEnter={(e) => {
                          const actions = e.currentTarget.querySelector('.notebook-hover-actions');
                          if (actions) actions.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          const actions = e.currentTarget.querySelector('.notebook-hover-actions');
                          if (actions) actions.style.opacity = '0';
                        }}
                      >
                        <div className="notebook-item">
                          <div className="notebook-icon-circle">
                            <NotebookLM size={12} style={{color: 'white'}} />
                          </div>
                          <div className="notebook-content">
                            <h4 className="notebook-titulo">{notebook.titulo}</h4>
                            <p className="notebook-descricao">{notebook.descricao}</p>
                          </div>
                          <div className="notebook-hover-actions">
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                editarNotebook(notebook);
                              }}
                              className="edit-btn"
                              title="Editar notebook"
                            >
                            </button>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                confirmarExclusao(notebook.id, 'notebook');
                              }}
                              className="remove-btn"
                              title="Excluir notebook"
                            >
                            </button>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="card tjsc-card">
                  <div className="card-header">
                    <h3>
                      <img 
                        src={require('../assets/images/tjsc-icon.png')} 
                        alt="TJSC" 
                        style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}}
                      />
                      TJSC
                    </h3>
                    <button 
                      className="add-btn" 
                      onClick={() => setMostrarFormularioTjsc(true)}
                      title="Adicionar link"
                    >
                      +
                    </button>
                  </div>
                  <div className="card-content">
                    {tjscLinks.map(link => (
                      <div 
                        key={link.id} 
                        className="tjsc-item"
                        onDoubleClick={() => editarTjscLink(link)}
                        title="Clique duplo para editar"
                      >
                        <a 
                          href={link.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="tjsc-link-title"
                        >
                          <span className="tjsc-icon">{getIconComponent(link.icone)}</span>
                          <span className="tjsc-text">{link.titulo}</span>
                        </a>
                        <div className="tjsc-hover-actions">
                          <button 
                            onClick={() => editarTjscLink(link)}
                            className="edit-btn"
                            title="Editar link"
                          >
                          </button>
                          <button onClick={() => confirmarExclusao(link.id, 'tjsc')} className="remove-btn" title="Excluir link">
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

        {mostrarFormularioTjsc && (
          <div className="modal-overlay">
            <div className="modal-content tjsc-form-modal">
              <div className="modal-header">
                <h2>
                  <img 
                    src={require('../assets/images/tjsc-icon.png')} 
                    alt="TJSC" 
                    style={{width: '24px', height: '24px', marginRight: '8px', verticalAlign: 'middle'}}
                  />
                  {editandoTjscLink ? 'Editar Link TJSC' : 'Adicionar Link TJSC'}
                </h2>
                <button 
                  className="modal-close"
                  onClick={() => {
                    setMostrarFormularioTjsc(false);
                    if (editandoTjscLink) {
                      cancelarEdicaoTjscLink();
                    }
                  }}
                  title="Fechar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
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
                  <div className="icon-selector">
                    <label>Selecionar Ícone:</label>
                    {Object.entries(categorias).map(([categoria, icones]) => (
                      <div key={categoria} className="icon-category">
                        <h4>{categoria}</h4>
                        <div className="icon-grid">
                          {icones.map(iconName => (
                            <div 
                              key={iconName} 
                              className={`icon-option ${novoTjscLink.icone === iconName ? 'selected' : ''}`}
                              onClick={() => setNovoTjscLink({...novoTjscLink, icone: iconName})}
                            >
                              {getIconComponent(iconName)}
                              <span>{iconName.replace(/^(Fa|Md|AiOutline)/, '')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                    <button 
                      onClick={() => {
                        setMostrarFormularioTjsc(false);
                        if (editandoTjscLink) {
                          cancelarEdicaoTjscLink();
                        }
                      }} 
                      className="form-cancel"
                    >
                      Cancelar
                    </button>
                    <button onClick={adicionarTjscLink} className="form-submit">
                      {editandoTjscLink ? 'Salvar Edição' : 'Adicionar Link'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {mostrarModalDrive && (
        <div className="modal-overlay">
          <div className="modal-content drive-modal">
            <div className="modal-header">
              <h2>
                <span className="google-drive-icon"></span>
                Google Drive - Todas as Pastas
              </h2>
              <button 
                className="modal-close"
                onClick={() => setMostrarModalDrive(false)}
                title="Fechar"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="drive-actions">
                <button 
                  onClick={carregarArquivosDrive}
                  className="refresh-btn"
                  disabled={carregandoDrive}
                >
                  {carregandoDrive ? 'Carregando...' : 'Atualizar'}
                </button>
                <button 
                  onClick={() => window.open(`https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, '_blank')}
                  className="open-folder-btn"
                >
                  Abrir Pasta no Drive
                </button>
              </div>
              <div className="arquivos-grid">
                {arquivosDrive.todasPastas?.map(arquivo => (
                  <div 
                    key={arquivo.id} 
                    className="arquivo-card"
                    onClick={() => window.open(arquivo.webViewLink, '_blank')}
                  >
                    <div className="arquivo-info-card">
                      <div className="arquivo-title-container">
                        <div className="arquivo-icon-small">
                          {getFileIcon(arquivo.mimeType)}
                        </div>
                        <h4 
                          className="arquivo-nome-card"
                          title={arquivo.name}
                        >
                          {arquivo.name}
                        </h4>
                      </div>
                    </div>
                    <div className="arquivo-actions-card">
                      {arquivo.webContentLink && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(arquivo.webContentLink, '_blank');
                          }}
                          className="download-btn"
                          title="Baixar arquivo"
                        >
                          <FaDownload />
                        </button>
                      )}
                    </div>
                  </div>
                )) || []}
              </div>
            </div>
          </div>
        </div>
      )}

        {showPowerBIModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>
                  <img 
                    src="https://powerbi.microsoft.com/pictures/application-logos/svg/powerbi.svg" 
                    alt="Power BI" 
                    style={{width: '24px', height: '24px', marginRight: '8px', verticalAlign: 'middle'}}
                  />
                  Power BI - {relatorioAtivo === 'gerencial' ? 'Gerencial de Gabinete' : 'Metas Nacionais 2025'}
                </h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowPowerBIModal(false)}
                  title="Fechar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="modal-body" style={{padding: 0}}>
                {relatorioAtivo === 'gerencial' ? (
                  <iframe
                    title="Gerencial de Gabinete"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/reportEmbed?reportId=6a74e9aa-0de1-415a-8cc6-5c243b756f73&appId=6556e9bb-d287-4773-9065-6dc5aaae8deb&autoAuth=true&ctid=400b79f8-9f13-47c7-923f-4b1695bf3b29&$filter=Desembargador eq 'ALEXANDRE MORAIS DA ROSA'"
                    frameBorder="0"
                    allowFullScreen={true}
                  />
                ) : (
                  <iframe
                    title="Metas Nacionais 2025"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/reportEmbed?reportId=70c60c77-b6fc-4266-ac19-4dc1631f7a4d&autoAuth=true&ctid=400b79f8-9f13-47c7-923f-4b1695bf3b29"
                    frameBorder="0"
                    allowFullScreen={true}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        
        {mostrarGaleria && (
          <div className="modal-overlay" onClick={fecharGaleria}>
            <div className="galeria-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={fecharGaleria}>×</button>
              <div className="galeria-content">
                <img 
                  src={imagensGaleria[imagemAtual]} 
                  alt={`Imagem ${imagemAtual + 1}`}
                  className="galeria-imagem"
                />
                {imagensGaleria.length > 1 && (
                  <>
                    <button 
                      className="galeria-nav prev" 
                      onClick={imagemAnterior}
                      disabled={imagemAtual === 0}
                    >
                      <AiFillLeftCircle size={32} />
                    </button>
                    <button 
                      className="galeria-nav next" 
                      onClick={proximaImagem}
                      disabled={imagemAtual === imagensGaleria.length - 1}
                    >
                      <AiFillRightCircle size={32} />
                    </button>
                    <div className="galeria-counter">
                      {imagemAtual + 1} / {imagensGaleria.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {mostrarConfirmacao && (
          <div className="modal-overlay">
            <div className="confirmation-modal">
              <h3>Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir este item?</p>
              <div className="confirmation-buttons">
                <button onClick={executarExclusao} className="confirm-delete-btn">
                  Excluir
                </button>
                <button onClick={cancelarExclusao} className="cancel-btn">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      );
};

export default Dashboard;