import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  Calendar as CalendarIcon, 
  Settings, 
  X, 
  Menu,
  Home,
  ShoppingBag,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar, onSearch }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={toggleSidebar} 
          className="sidebar-toggle"
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="sidebar-overlay"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="sidebar-container"
            >
              <div className="sidebar-header">
                <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src="/logo_pr.jpg" alt="PR Logo" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border)', objectFit: 'cover' }} />
                  <div className="flex flex-col" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="text-lg luxury-text">PR</span>
                    <span className="text-[9px] tracking-widest text-muted uppercase">Perfumaria</span>
                  </div>
                </div>
                <button onClick={toggleSidebar} className="close-btn text-muted hover-text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="sidebar-content">
                {/* Search Bar */}
                <div className="sidebar-search">
                  <Search size={16} className="text-muted" />
                  <input 
                    type="text" 
                    placeholder="Buscar fragrâncias..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      onSearch(e.target.value);
                    }}
                    className="search-input"
                  />
                </div>

                {/* Clock & Date */}
                <div className="sidebar-widget">
                  <div className="flex items-center gap-3 text-muted">
                    <Clock size={16} />
                    <span className="text-sm font-medium text-foreground">{formatTime(currentTime)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted">
                    <CalendarIcon size={16} />
                    <span className="text-xs">{formatDate(currentTime)}</span>
                  </div>
                </div>

                <nav className="sidebar-nav">
                  <a href="#" className="nav-link active" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); toggleSidebar(); }}>
                    <Home size={18} />
                    <span>Início</span>
                  </a>
                  <a href="#colecao" className="nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('colecao')?.scrollIntoView({behavior:'smooth'}); toggleSidebar(); }}>
                    <ShoppingBag size={18} />
                    <span>Coleção</span>
                  </a>
                  <a href="#contato" className="nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('contato')?.scrollIntoView({behavior:'smooth'}); toggleSidebar(); }}>
                    <MessageCircle size={18} />
                    <span>Contato</span>
                  </a>
                  <a href="https://wa.me/5515996966772" target="_blank" rel="noopener noreferrer" className="nav-link">
                    <HelpCircle size={18} />
                    <span>Suporte</span>
                  </a>
                </nav>
              </div>

              <div className="sidebar-footer">
                <button className="nav-link w-full text-muted hover-text-white" style={{ background: 'none', border: 'none', padding: '0.75rem' }}>
                  <Settings size={18} />
                  <span>Configurações</span>
                </button>
                <div className="text-[10px] text-muted uppercase tracking-widest text-center mt-4">
                  v1.0.5 • PR PERFUMARIA
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
