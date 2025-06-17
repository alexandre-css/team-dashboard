import React, { useState, useEffect, useCallback } from 'react';
import './dashboard.css';
import { supabase } from '../lib/supabase';
import { MdDashboard } from "react-icons/md";
import { FaGavel, FaBalanceScale, FaFileAlt, FaBook, FaUsers, FaBuilding, FaClipboardList, FaSearch, FaCalendarAlt, FaCog, FaLaptop, FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaFolder, FaFolderOpen, FaDatabase, FaServer, FaCloud, FaLock, FaUnlock, FaKey, FaShieldAlt, FaUser, FaUserTie, FaIdCard, FaTools, FaWrench, FaCogs, FaHeadset, FaTicketAlt, FaBug, FaLifeRing, FaQuestionCircle, FaCommentDots, FaUserFriends, FaUserCheck, FaUserPlus, FaUserCog, FaHandshake, FaClipboard, FaUserMd, FaUserShield } from 'react-icons/fa';
import { MdGavel, MdAccountBalance, MdDescription, MdLibraryBooks, MdPeople, MdBusiness, MdAssignment, MdEvent, MdHome, MdWork, MdSchool, MdLocalLibrary, MdAccountBalanceWallet, MdAssignmentInd, MdClass, MdContactMail, MdContactPhone, MdGrade, MdGroup, MdHistory, MdInfo, MdLaunch, MdList, MdLocationOn, MdMail, MdNotifications, MdPerson, MdPhone, MdPlace, MdPublic, MdSchedule, MdSecurity, MdSupervisorAccount, MdVerifiedUser, MdVisibility, MdBuild, MdSupport, MdReportProblem, MdHelpOutline, MdBugReport, MdHandyman, MdPersonAdd, MdGroupAdd, MdBadge, MdCardMembership, MdManageAccounts, MdWorkOutline } from 'react-icons/md';
import { AiOutlineBank, AiOutlineHome, AiOutlinePhone, AiOutlineMail, AiOutlineUser, AiOutlineTeam, AiOutlineFileText, AiOutlineFolder, AiOutlineSafety, AiOutlineSchedule, AiOutlineSetting, AiOutlineSearch, AiOutlineBook, AiOutlineGlobal, AiOutlineAudit, AiOutlineProject, AiOutlineDatabase } from 'react-icons/ai';

const Dashboard = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [lastNotification, setLastNotification] = useState('');
  const [lastAvisoCount, setLastAvisoCount] = useState(0);
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
    link: '',
    icone: 'FaGavel'
  });
  const [mostrarFormularioTjsc, setMostrarFormularioTjsc] = useState(false);
  const [editandoTjscLink, setEditandoTjscLink] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      await carregarAvisos();
      await carregarNotebooks();
      await carregarTjscLinks();
    };
    
    carregarDados();
  
    const interval = setInterval(() => {
      carregarDados();
    }, 30000);
  
    return () => clearInterval(interval);
  }, []);
  
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

  const carregarAvisos = useCallback(async () => {
    const { data, error } = await supabase
      .from('avisos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao carregar avisos:', error);
    } else {
      if (lastAvisoCount > 0 && data.length > lastAvisoCount) {
        const novoAviso = data[0];
        setLastNotification(`Novo aviso: ${novoAviso.titulo}`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }
      setLastAvisoCount(data.length);
      const avisosProcessados = data.map(aviso => ({
        ...aviso,
        imagens: typeof aviso.imagens === 'string' ? JSON.parse(aviso.imagens || '[]') : (Array.isArray(aviso.imagens) ? aviso.imagens : [])
      }));
      setAvisos(avisosProcessados || []);
    }
  }, [lastAvisoCount]);
  
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
      imagens: Array.isArray(aviso.imagens) ? aviso.imagens : []
    });
    setMostrarFormulario(true);
    
    setTimeout(() => {
      const editor = document.querySelector('.rich-textarea');
      if (editor) {
        editor.innerHTML = aviso.descricao;
      }
    }, 100);
  };

const formatText = (command) => {
  document.execCommand(command, false, null);
};

const handleImagePaste = (e) => {
  const imagensArray = Array.isArray(novoAviso.imagens) ? novoAviso.imagens : [];
  if (imagensArray.length >= 3) return;
  
  const items = e.clipboardData.items;
  for (let item of items) {
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile();
      const reader = new FileReader();
      reader.onload = (event) => {
        setNovoAviso({...novoAviso, imagens: [...imagensArray, event.target.result]});
      };
      reader.readAsDataURL(file);
      break;
    }
  }
};

const handleImageDrop = (e) => {
  e.preventDefault();
  const imagensArray = Array.isArray(novoAviso.imagens) ? novoAviso.imagens : [];
  if (imagensArray.length >= 3) return;
  
  const files = Array.from(e.dataTransfer.files).filter(file => file.type.indexOf('image') !== -1);
  const remainingSlots = 3 - imagensArray.length;
  const filesToProcess = files.slice(0, remainingSlots);
  
  filesToProcess.forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setNovoAviso(prev => ({...prev, imagens: [...(Array.isArray(prev.imagens) ? prev.imagens : []), event.target.result]}));
    };
    reader.readAsDataURL(file);
  });
};

const removerImagem = (index) => {
  const imagensArray = Array.isArray(novoAviso.imagens) ? novoAviso.imagens : [];
  const novasImagens = imagensArray.filter((_, i) => i !== index);
  setNovoAviso({...novoAviso, imagens: novasImagens});
};

const abrirGaleria = (imagens) => {
  if (!Array.isArray(imagens) || imagens.length === 0) return;
  
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

  const cancelarEdicao = () => {
    setEditandoAviso(null);
    setMostrarFormulario(false);
    setNovoAviso({
      titulo: '',
      descricao: '',
      tipo: 'warning',
      imagens: []
    });
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
          link: novoTjscLink.link,
          icone: novoTjscLink.icone
        }]);
      
      if (error) throw error;
      
      await carregarTjscLinks();
      setNovoTjscLink({ titulo: '', link: '', icone: 'FaGavel' });
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
    link: link.link,
    icone: link.icone || 'FaGavel'
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
          link: novoTjscLink.link,
          icone: novoTjscLink.icone
        })
        .eq('id', editandoTjscLink.id);
      
      if (error) throw error;
      
      await carregarTjscLinks();
      setNovoTjscLink({ titulo: '', link: '', icone: 'FaGavel' });
      setMostrarFormularioTjsc(false);
      setEditandoTjscLink(null);
    } catch (error) {
      console.error('Erro ao editar link TJSC:', error);
    }
  }
};

const cancelarEdicaoTjscLink = () => {
  setEditandoTjscLink(null);
  setNovoTjscLink({ titulo: '', link: '', icone: 'FaGavel' });
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

const getIconComponent = (iconName) => {
  const iconMap = {
    FaGavel: <FaGavel style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaBalanceScale: <FaBalanceScale style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaFileAlt: <FaFileAlt style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaBook: <FaBook style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaUsers: <FaUsers style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaBuilding: <FaBuilding style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaClipboardList: <FaClipboardList style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaSearch: <FaSearch style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaCalendarAlt: <FaCalendarAlt style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaCog: <FaCog style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaLaptop: <FaLaptop style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaHome: <FaHome style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaPhone: <FaPhone style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaEnvelope: <FaEnvelope style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaMapMarkerAlt: <FaMapMarkerAlt style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaInfoCircle: <FaInfoCircle style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaCheckCircle: <FaCheckCircle style={{marginRight: '8px', color: '#10b981', fontSize: '18px'}} />,
    FaExclamationTriangle: <FaExclamationTriangle style={{marginRight: '8px', color: '#f59e0b', fontSize: '18px'}} />,
    FaTimesCircle: <FaTimesCircle style={{marginRight: '8px', color: '#ef4444', fontSize: '18px'}} />,
    FaClock: <FaClock style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaEye: <FaEye style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaFolder: <FaFolder style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaFolderOpen: <FaFolderOpen style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaDatabase: <FaDatabase style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaServer: <FaServer style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaCloud: <FaCloud style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaLock: <FaLock style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaUnlock: <FaUnlock style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaKey: <FaKey style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaShieldAlt: <FaShieldAlt style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaUser: <FaUser style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaUserTie: <FaUserTie style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaIdCard: <FaIdCard style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdGavel: <MdGavel style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdAccountBalance: <MdAccountBalance style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdDescription: <MdDescription style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdLibraryBooks: <MdLibraryBooks style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdPeople: <MdPeople style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdBusiness: <MdBusiness style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdAssignment: <MdAssignment style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdEvent: <MdEvent style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdHome: <MdHome style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdWork: <MdWork style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdSchool: <MdSchool style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdLocalLibrary: <MdLocalLibrary style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdAccountBalanceWallet: <MdAccountBalanceWallet style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdAssignmentInd: <MdAssignmentInd style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdClass: <MdClass style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdContactMail: <MdContactMail style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdContactPhone: <MdContactPhone style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdGrade: <MdGrade style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdGroup: <MdGroup style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdHistory: <MdHistory style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdInfo: <MdInfo style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdLaunch: <MdLaunch style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdList: <MdList style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdLocationOn: <MdLocationOn style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdMail: <MdMail style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdNotifications: <MdNotifications style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdPerson: <MdPerson style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdPhone: <MdPhone style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdPlace: <MdPlace style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdPublic: <MdPublic style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdSchedule: <MdSchedule style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdSecurity: <MdSecurity style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdSupervisorAccount: <MdSupervisorAccount style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdVerifiedUser: <MdVerifiedUser style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdVisibility: <MdVisibility style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineBank: <AiOutlineBank style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineHome: <AiOutlineHome style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlinePhone: <AiOutlinePhone style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineMail: <AiOutlineMail style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineUser: <AiOutlineUser style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineTeam: <AiOutlineTeam style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineFileText: <AiOutlineFileText style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineFolder: <AiOutlineFolder style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineDatabase: <AiOutlineDatabase style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineSafety: <AiOutlineSafety style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineSchedule: <AiOutlineSchedule style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineSetting: <AiOutlineSetting style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineSearch: <AiOutlineSearch style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineBook: <AiOutlineBook style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineGlobal: <AiOutlineGlobal style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineAudit: <AiOutlineAudit style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    AiOutlineProject: <AiOutlineProject style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaTools: <FaTools style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaWrench: <FaWrench style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaCogs: <FaCogs style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaHeadset: <FaHeadset style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaTicketAlt: <FaTicketAlt style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaBug: <FaBug style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaLifeRing: <FaLifeRing style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaQuestionCircle: <FaQuestionCircle style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaCommentDots: <FaCommentDots style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdBuild: <MdBuild style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdSupport: <MdSupport style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdReportProblem: <MdReportProblem style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdHelpOutline: <MdHelpOutline style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdBugReport: <MdBugReport style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdHandyman: <MdHandyman style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaUserFriends: <FaUserFriends style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaUserCheck: <FaUserCheck style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaUserPlus: <FaUserPlus style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaUserCog: <FaUserCog style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaHandshake: <FaHandshake style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaClipboard: <FaClipboard style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaUserMd: <FaUserMd style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    FaUserShield: <FaUserShield style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdPersonAdd: <MdPersonAdd style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdGroupAdd: <MdGroupAdd style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdBadge: <MdBadge style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdCardMembership: <MdCardMembership style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdManageAccounts: <MdManageAccounts style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
    MdWorkOutline: <MdWorkOutline style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />,
  };
  return iconMap[iconName] || <FaGavel style={{marginRight: '8px', color: '#3b82f6', fontSize: '18px'}} />;
};

const adicionarAviso = async () => {
  if (!novoAviso.titulo.trim()) return;
  
  const avisoData = {
    tipo: novoAviso.tipo,
    titulo: novoAviso.titulo,
    descricao: novoAviso.descricao,
    imagens: novoAviso.imagens
  };

  if (editandoAviso) {
    const { error } = await supabase
      .from('avisos')
      .update(avisoData)
      .eq('id', editandoAviso.id);
    
    if (error) {
      console.error('Erro ao atualizar aviso:', error);
    } else {
      setEditandoAviso(null);
      setMostrarFormulario(false);
      carregarAvisos();
    }
  } else {
    const { error } = await supabase
      .from('avisos')
      .insert([avisoData]);
    
    if (error) {
      console.error('Erro ao adicionar aviso:', error);
    } else {
      setMostrarFormulario(false);
      carregarAvisos();
    }
  }
  
  setNovoAviso({
    titulo: '',
    descricao: '',
    tipo: 'warning',
    imagens: []
  });
};

  return (

    <div className="dashboard">
      {showNotification && (
        <div className="notification-popup">
          <div className="notification-content">
            <div className="notification-icon">🔔</div>
            <div className="notification-text">{lastNotification}</div>
            <button 
              className="notification-close"
              onClick={() => setShowNotification(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
  
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
                      onInput={(e) => {
                        setNovoAviso({...novoAviso, descricao: e.target.innerHTML});
                      }}
                      placeholder="Descrição do aviso..."
                      suppressContentEditableWarning={true}
                      style={{minHeight: '80px'}}
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
                      {(novoAviso.imagens && Array.isArray(novoAviso.imagens) && novoAviso.imagens.length > 0) ? (
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
                          <span className="image-label">
                            {aviso.imagens.length > 1 ? `${aviso.imagens.length} imagens` : '1 imagem'}
                          </span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="expand-icon">
                            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                          </svg>
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
                  <div className="icon-selector">
                    <label>Escolha um ícone:</label>
                    <div className="icon-grid">
                      <div className="icon-category">
                        <div className="category-header">Jurídico</div>
                        {[
                          { key: 'FaGavel', component: <FaGavel />, label: 'Martelo' },
                          { key: 'FaBalanceScale', component: <FaBalanceScale />, label: 'Balança' },
                          { key: 'MdGavel', component: <MdGavel />, label: 'Martelo MD' },
                          { key: 'MdAccountBalance', component: <MdAccountBalance />, label: 'Tribunal' },
                          { key: 'MdVerifiedUser', component: <MdVerifiedUser />, label: 'Usuário Verificado' },
                          { key: 'MdSecurity', component: <MdSecurity />, label: 'Segurança' },
                          { key: 'FaShieldAlt', component: <FaShieldAlt />, label: 'Escudo' },
                          { key: 'FaLock', component: <FaLock />, label: 'Cadeado' },
                          { key: 'FaUnlock', component: <FaUnlock />, label: 'Desbloqueado' },
                          { key: 'FaKey', component: <FaKey />, label: 'Chave' },
                          { key: 'FaIdCard', component: <FaIdCard />, label: 'ID' },
                          { key: 'FaUserTie', component: <FaUserTie />, label: 'Advogado' }
                        ].map(icon => (
                          <div
                            key={icon.key}
                            className={`icon-option ${novoTjscLink.icone === icon.key ? 'selected' : ''}`}
                            onClick={() => setNovoTjscLink({...novoTjscLink, icone: icon.key})}
                            title={icon.label}
                          >
                            {icon.component}
                            <span>{icon.label}</span>
                          </div>
                        ))}
                      </div>
                  
                      <div className="icon-category">
                        <div className="category-header">Pessoas e RH</div>
                        {[
                          { key: 'FaUsers', component: <FaUsers />, label: 'Pessoas' },
                          { key: 'FaUser', component: <FaUser />, label: 'Pessoa' },
                          { key: 'FaUserFriends', component: <FaUserFriends />, label: 'Recursos Humanos' },
                          { key: 'FaUserCheck', component: <FaUserCheck />, label: 'Aprovação RH' },
                          { key: 'FaUserPlus', component: <FaUserPlus />, label: 'Contratar' },
                          { key: 'FaUserCog', component: <FaUserCog />, label: 'Gestão de Pessoas' },
                          { key: 'FaHandshake', component: <FaHandshake />, label: 'Relacionamento' },
                          { key: 'FaUserShield', component: <FaUserShield />, label: 'Proteção do Servidor' },
                          { key: 'MdPeople', component: <MdPeople />, label: 'Pessoas MD' },
                          { key: 'MdGroup', component: <MdGroup />, label: 'Grupo' },
                          { key: 'MdPersonAdd', component: <MdPersonAdd />, label: 'Adicionar Pessoa' },
                          { key: 'MdGroupAdd', component: <MdGroupAdd />, label: 'Adicionar ao Grupo' },
                          { key: 'MdManageAccounts', component: <MdManageAccounts />, label: 'Gerenciar Contas' },
                          { key: 'MdBadge', component: <MdBadge />, label: 'Crachá' },
                          { key: 'AiOutlineUser', component: <AiOutlineUser />, label: 'Usuário Outline' },
                          { key: 'AiOutlineTeam', component: <AiOutlineTeam />, label: 'Equipe' }
                        ].map(icon => (
                          <div
                            key={icon.key}
                            className={`icon-option ${novoTjscLink.icone === icon.key ? 'selected' : ''}`}
                            onClick={() => setNovoTjscLink({...novoTjscLink, icone: icon.key})}
                            title={icon.label}
                          >
                            {icon.component}
                            <span>{icon.label}</span>
                          </div>
                        ))}
                      </div>
                  
                      <div className="icon-category">
                        <div className="category-header">Organizações e Trabalho</div>
                        {[
                          { key: 'FaBuilding', component: <FaBuilding />, label: 'Prédio' },
                          { key: 'MdBusiness', component: <MdBusiness />, label: 'Negócios' },
                          { key: 'MdWork', component: <MdWork />, label: 'Trabalho' },
                          { key: 'MdWorkOutline', component: <MdWorkOutline />, label: 'Trabalho RH' },
                          { key: 'AiOutlineBank', component: <AiOutlineBank />, label: 'Banco' }
                        ].map(icon => (
                          <div
                            key={icon.key}
                            className={`icon-option ${novoTjscLink.icone === icon.key ? 'selected' : ''}`}
                            onClick={() => setNovoTjscLink({...novoTjscLink, icone: icon.key})}
                            title={icon.label}
                          >
                            {icon.component}
                            <span>{icon.label}</span>
                          </div>
                        ))}
                      </div>
                  
                      <div className="icon-category">
                        <div className="category-header">Comunicação</div>
                        {[
                          { key: 'FaPhone', component: <FaPhone />, label: 'Telefone' },
                          { key: 'FaEnvelope', component: <FaEnvelope />, label: 'Email' },
                          { key: 'MdContactMail', component: <MdContactMail />, label: 'Contato Email' },
                          { key: 'MdContactPhone', component: <MdContactPhone />, label: 'Contato Telefone' },
                          { key: 'MdMail', component: <MdMail />, label: 'Correio' },
                          { key: 'MdPhone', component: <MdPhone />, label: 'Telefone MD' },
                          { key: 'AiOutlineMail', component: <AiOutlineMail />, label: 'Email Outline' },
                          { key: 'AiOutlinePhone', component: <AiOutlinePhone />, label: 'Telefone Outline' },
                          { key: 'FaCommentDots', component: <FaCommentDots />, label: 'Mensagens' }
                        ].map(icon => (
                          <div
                            key={icon.key}
                            className={`icon-option ${novoTjscLink.icone === icon.key ? 'selected' : ''}`}
                            onClick={() => setNovoTjscLink({...novoTjscLink, icone: icon.key})}
                            title={icon.label}
                          >
                            {icon.component}
                            <span>{icon.label}</span>
                          </div>
                        ))}
                      </div>
                  
                      <div className="icon-category">
                        <div className="category-header">Localização</div>
                        {[
                          { key: 'FaMapMarkerAlt', component: <FaMapMarkerAlt />, label: 'Localização' },
                          { key: 'FaHome', component: <FaHome />, label: 'Casa' },
                          { key: 'MdHome', component: <MdHome />, label: 'Casa MD' },
                          { key: 'MdLocationOn', component: <MdLocationOn />, label: 'Localização MD' },
                          { key: 'MdPlace', component: <MdPlace />, label: 'Lugar' },
                          { key: 'AiOutlineHome', component: <AiOutlineHome />, label: 'Casa Outline' }
                        ].map(icon => (
                          <div
                            key={icon.key}
                            className={`icon-option ${novoTjscLink.icone === icon.key ? 'selected' : ''}`}
                            onClick={() => setNovoTjscLink({...novoTjscLink, icone: icon.key})}
                            title={icon.label}
                          >
                            {icon.component}
                            <span>{icon.label}</span>
                          </div>
                        ))}
                      </div>
                  
                      <div className="icon-category">
                        <div className="category-header">Documentos e Arquivos</div>
                        {[
                          { key: 'FaFileAlt', component: <FaFileAlt />, label: 'Documento' },
                          { key: 'FaBook', component: <FaBook />, label: 'Livro' },
                          { key: 'FaFolder', component: <FaFolder />, label: 'Pasta' },
                          { key: 'FaFolderOpen', component: <FaFolderOpen />, label: 'Pasta Aberta' },
                          { key: 'FaClipboard', component: <FaClipboard />, label: 'Prancheta' },
                          { key: 'FaClipboardList', component: <FaClipboardList />, label: 'Lista' },
                          { key: 'MdDescription', component: <MdDescription />, label: 'Descrição' },
                          { key: 'MdLibraryBooks', component: <MdLibraryBooks />, label: 'Biblioteca' },
                          { key: 'MdAssignment', component: <MdAssignment />, label: 'Atribuição' },
                          { key: 'MdAssignmentInd', component: <MdAssignmentInd />, label: 'Atribuição Individual' },
                          { key: 'MdLocalLibrary', component: <MdLocalLibrary />, label: 'Biblioteca Local' },
                          { key: 'MdList', component: <MdList />, label: 'Lista MD' },
                          { key: 'AiOutlineFileText', component: <AiOutlineFileText />, label: 'Arquivo Texto' },
                          { key: 'AiOutlineFolder', component: <AiOutlineFolder />, label: 'Pasta Outline' },
                          { key: 'AiOutlineBook', component: <AiOutlineBook />, label: 'Livro Outline' }
                        ].map(icon => (
                          <div
                            key={icon.key}
                            className={`icon-option ${novoTjscLink.icone === icon.key ? 'selected' : ''}`}
                            onClick={() => setNovoTjscLink({...novoTjscLink, icone: icon.key})}
                            title={icon.label}
                          >
                            {icon.component}
                            <span>{icon.label}</span>
                          </div>
                        ))}
                      </div>
                  
                      <div className="icon-category">
                        <div className="category-header">Tecnologia</div>
                        {[
                          { key: 'FaDatabase', component: <FaDatabase />, label: 'Banco de Dados' },
                          { key: 'FaServer', component: <FaServer />, label: 'Servidor' },
                          { key: 'FaCloud', component: <FaCloud />, label: 'Nuvem' },
                          { key: 'FaLaptop', component: <FaLaptop />, label: 'Laptop' },
                          { key: 'AiOutlineDatabase', component: <AiOutlineDatabase />, label: 'BD Outline' }
                        ].map(icon => (
                          <div
                            key={icon.key}
                            className={`icon-option ${novoTjscLink.icone === icon.key ? 'selected' : ''}`}
                            onClick={() => setNovoTjscLink({...novoTjscLink, icone: icon.key})}
                            title={icon.label}
                          >
                            {icon.component}
                            <span>{icon.label}</span>
                          </div>
                        ))}
                      </div>
                  
                      <div className="icon-category">
                        <div className="category-header">Ferramentas e Suporte</div>
                        {[
                          { key: 'FaSearch', component: <FaSearch />, label: 'Busca' },
                          { key: 'FaCog', component: <FaCog />, label: 'Configuração' },
                          { key: 'FaTools', component: <FaTools />, label: 'Ferramentas' },
                          { key: 'FaWrench', component: <FaWrench />, label: 'Chave Inglesa' },
                          { key: 'FaCogs', component: <FaCogs />, label: 'Engrenagens' },
                          { key: 'FaHeadset', component: <FaHeadset />, label: 'Suporte' },
                          { key: 'FaTicketAlt', component: <FaTicketAlt />, label: 'Chamado' },
                          { key: 'FaBug', component: <FaBug />, label: 'Bug/Problema' },
                          { key: 'FaLifeRing', component: <FaLifeRing />, label: 'Ajuda' },
                          { key: 'FaQuestionCircle', component: <FaQuestionCircle />, label: 'Dúvida' },
                          { key: 'MdBuild', component: <MdBuild />, label: 'Construir/Reparar' },
                          { key: 'MdSupport', component: <MdSupport />, label: 'Suporte MD' },
                          { key: 'MdReportProblem', component: <MdReportProblem />, label: 'Reportar Problema' },
                          { key: 'MdHelpOutline', component: <MdHelpOutline />, label: 'Ajuda MD' },
                          { key: 'MdBugReport', component: <MdBugReport />, label: 'Relatório de Bug' },
                          { key: 'MdHandyman', component: <MdHandyman />, label: 'Técnico/Manutenção' },
                          { key: 'AiOutlineSearch', component: <AiOutlineSearch />, label: 'Busca Outline' },
                          { key: 'AiOutlineSetting', component: <AiOutlineSetting />, label: 'Config Outline' }
                        ].map(icon => (
                          <div
                            key={icon.key}
                            className={`icon-option ${novoTjscLink.icone === icon.key ? 'selected' : ''}`}
                            onClick={() => setNovoTjscLink({...novoTjscLink, icone: icon.key})}
                            title={icon.label}
                          >
                            {icon.component}
                            <span>{icon.label}</span>
                          </div>
                        ))}
                      </div>
                  
                      <div className="icon-category">
                        <div className="category-header">Tempo e Eventos</div>
                        {[
                          { key: 'FaCalendarAlt', component: <FaCalendarAlt />, label: 'Calendário' },
                          { key: 'FaClock', component: <FaClock />, label: 'Relógio' },
                          { key: 'MdEvent', component: <MdEvent />, label: 'Evento' },
                          { key: 'MdSchedule', component: <MdSchedule />, label: 'Cronograma' },
                          { key: 'MdHistory', component: <MdHistory />, label: 'Histórico' },
                          { key: 'AiOutlineSchedule', component: <AiOutlineSchedule />, label: 'Cronograma Outline' }
                        ].map(icon => (
                          <div
                            key={icon.key}
                            className={`icon-option ${novoTjscLink.icone === icon.key ? 'selected' : ''}`}
                            onClick={() => setNovoTjscLink({...novoTjscLink, icone: icon.key})}
                            title={icon.label}
                          >
                            {icon.component}
                            <span>{icon.label}</span>
                          </div>
                        ))}
                      </div>
                  
                      <div className="icon-category">
                        <div className="category-header">Status e Indicadores</div>
                        {[
                          { key: 'FaInfoCircle', component: <FaInfoCircle />, label: 'Informação' },
                          { key: 'FaCheckCircle', component: <FaCheckCircle />, label: 'Sucesso' },
                          { key: 'FaExclamationTriangle', component: <FaExclamationTriangle />, label: 'Aviso' },
                          { key: 'FaTimesCircle', component: <FaTimesCircle />, label: 'Erro' },
                          { key: 'FaEye', component: <FaEye />, label: 'Visualizar' },
                          { key: 'MdInfo', component: <MdInfo />, label: 'Info MD' },
                          { key: 'MdNotifications', component: <MdNotifications />, label: 'Notificações' },
                          { key: 'MdVisibility', component: <MdVisibility />, label: 'Visibilidade' },
                          { key: 'MdLaunch', component: <MdLaunch />, label: 'Lançar' },
                          { key: 'MdPublic', component: <MdPublic />, label: 'Público' }
                        ].map(icon => (
                          <div
                            key={icon.key}
                            className={`icon-option ${novoTjscLink.icone === icon.key ? 'selected' : ''}`}
                            onClick={() => setNovoTjscLink({...novoTjscLink, icone: icon.key})}
                            title={icon.label}
                          >
                            {icon.component}
                            <span>{icon.label}</span>
                          </div>
                        ))}
                      </div>
                  
                      <div className="icon-category">
                        <div className="category-header">Educação e Avaliação</div>
                        {[
                          { key: 'MdSchool', component: <MdSchool />, label: 'Escola' },
                          { key: 'MdClass', component: <MdClass />, label: 'Classe' },
                          { key: 'MdGrade', component: <MdGrade />, label: 'Grau' },
                          { key: 'MdCardMembership', component: <MdCardMembership />, label: 'Cartão de Membro' },
                          { key: 'AiOutlineProject', component: <AiOutlineProject />, label: 'Projeto' },
                          { key: 'AiOutlineGlobal', component: <AiOutlineGlobal />, label: 'Global' },
                          { key: 'AiOutlineAudit', component: <AiOutlineAudit />, label: 'Auditoria' },
                          { key: 'AiOutlineSafety', component: <AiOutlineSafety />, label: 'Segurança Outline' }
                        ].map(icon => (
                          <div
                            key={icon.key}
                            className={`icon-option ${novoTjscLink.icone === icon.key ? 'selected' : ''}`}
                            onClick={() => setNovoTjscLink({...novoTjscLink, icone: icon.key})}
                            title={icon.label}
                          >
                            {icon.component}
                            <span>{icon.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
                    <strong>
                      {getIconComponent(link.icone)} {link.titulo}
                    </strong>
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