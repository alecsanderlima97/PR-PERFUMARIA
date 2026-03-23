import React, { useState, useRef, useEffect } from 'react';
import { 
  Instagram, 
  MessageCircle, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Wind, 
  Droplets, 
  Sparkles,
  Play,
  Pause,
  ChevronRight,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { perfumes } from './data';
import Sidebar from './components/Sidebar';
import './index.css';

// Componente de Fumaça Dinâmica - Otimizado para Performance
const SmokeBackground = React.memo(() => {
  return (
    <div className="smoke-container">
      {/* Camadas de fumaça reduzidas para melhor performance */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="smoke-cloud"
          initial={{ 
            x: Math.random() * 80 + '%', 
            y: Math.random() * 80 + '%',
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            x: [null, Math.random() * 100 + '%', Math.random() * 100 + '%'],
            y: [null, Math.random() * 100 + '%', Math.random() * 100 + '%'],
            opacity: [0, 0.4, 0],
            scale: [0.5, 2.5, 0.5],
            rotate: [0, 180 + Math.random() * 180]
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.04) 0%, transparent 75%)',
            filter: 'blur(80px)' // Blur levemente reduzido
          }}
        />
      ))}
      
      {/* Logo de Fundo Estilizado com Neblina */}
      <motion.div 
        className="logo-overlay flex flex-col items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 3 }}
      >
          <img src="/logo_pr.jpg" alt="PR Logo" style={{ maxWidth: '450px' }} />
      </motion.div>
    </div>
  );
});

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const musicUrl = "/bg-music.mp3"; 

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Interação do usuário necessária para áudio"));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="music-player-ui">
      <audio ref={audioRef} src={musicUrl} loop />
      <button 
        onClick={togglePlay}
        className="btn-primary"
        style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <span className="text-xs uppercase tracking-widest text-muted">
        {isPlaying ? "On" : "Off"}
      </span>
    </div>
  );
};

const Header = ({ searchQuery, onSearch }) => (
  <header className="header">
    <div className="flex flex-col">
      <h1 className="text-xl luxury-text" style={{ letterSpacing: '-0.05em' }}>PR</h1>
      <span className="text-[10px] tracking-widest text-muted uppercase">PERFUMARIA</span>
    </div>

    {/* Top Search Bar */}
    <div className="header-search md-flex">
      <Search size={16} className="text-muted" />
      <input 
        type="text" 
        placeholder="Procure sua fragrância..." 
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        className="top-search-input"
      />
    </div>

    <nav className="nav-links lg-flex">
      <a href="#colecao">Coleção</a>
      <a href="#consultoria">Consultoria</a>
      <a href="#contato">Contato</a>
    </nav>
    <div className="flex gap-4 items-center">
      <a href="https://www.instagram.com/pr__perfumaria/" target="_blank" rel="noopener noreferrer" className="text-foreground hover-text-white transition-all" style={{ opacity: 0.5 }}><Instagram size={18} /></a>
    </div>
  </header>
);

const PerfumeCard = ({ perfume }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className="glass-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex justify-between items-start" style={{ marginBottom: '1.5rem' }}>
        <div>
          <span className="text-xs uppercase tracking-widest text-muted" style={{ marginBottom: '0.5rem', display: 'block' }}>{perfume.type}</span>
          <h3 className="text-4xl luxury-text">{perfume.name}</h3>
        </div>
        <div className="flex items-center justify-center text-muted" style={{ width: '3rem', height: '3rem', border: '1px solid var(--border)', fontSize: '0.7rem' }}>
           0{perfume.id}
        </div>
      </div>
      
      <p className="text-sm font-light text-muted leading-relaxed" style={{ marginBottom: '2rem' }}>
        {perfume.description}
      </p>

      <div className="flex gap-2" style={{ flexWrap: 'wrap', marginBottom: '2rem' }}>
        {perfume.ingredients.slice(0, 3).map((ing, idx) => (
          <span key={idx} className="text-xs px-2 py-1" style={{ border: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.6rem' }}>
            {ing}
          </span>
        ))}
      </div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs flex items-center gap-2 uppercase tracking-widest text-muted"
        style={{ cursor: 'pointer', background: 'none', border: 'none', marginBottom: '1.5rem' }}
      >
        Consultoria <ChevronRight size={14} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}
          >
            <div className="grid md-grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted" style={{ marginBottom: '0.5rem' }}><Wind size={12}/> Notas</h4>
                <ul className="text-xs text-muted" style={{ listStyle: 'none' }}>
                  {perfume.ingredients.map((i, idx) => <li key={idx} style={{ marginBottom: '2px' }}>• {i}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted" style={{ marginBottom: '0.5rem' }}><Sparkles size={12}/> Uso</h4>
                <p className="text-xs text-muted italic">"{perfume.usageNotes}"</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <a 
        href={perfume.link}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{ marginTop: 'auto', width: '100%' }}
      >
        Especialista <ArrowRight size={14} style={{ marginLeft: '10px' }} />
      </a>
    </motion.div>
  );
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPerfumes = perfumes.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen">
      <SmokeBackground />
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onSearch={setSearchQuery}
      />
      <MusicPlayer />
      <Header searchQuery={searchQuery} onSearch={setSearchQuery} />

      <main className="container section-py">
        {/* Hero Section */}
        <section className="grid lg-grid-cols-2 gap-16 items-center" style={{ minHeight: '85vh', marginBottom: '8rem' }}>
          <div className="flex flex-col justify-center">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs uppercase tracking-widest text-muted"
              style={{ marginBottom: '2rem', display: 'block' }}
            >
              Exclusividade & Requinte
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-8xl luxury-text"
              style={{ marginBottom: '3rem' }}
            >
              A Essência <br /> <span className="italic" style={{ fontWeight: '400' }}>do Indescritível</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted"
              style={{ maxWidth: '30rem', marginBottom: '3.5rem', fontWeight: '300' }}
            >
              O mais alto nível em perfumaria. Fragrâncias de nicho importadas e nacionais selecionadas com rigor. 
              Entendemos cada nota para traduzir sua personalidade em perfume. CEO @pablo_riicardo__ ⚜️
            </motion.p>
            
            <div className="flex gap-4">
              <a href="#colecao" className="btn-primary" style={{ paddingInline: '3rem' }}>Descobrir</a>
              <a 
                href="https://drive.google.com/file/d/1pWqnM5zKr0jj6VhcOiy-D8HUS7FJzCVC/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-secondary"
                style={{ 
                  border: '1px solid var(--border)', 
                  padding: '1rem 2rem', 
                  fontSize: '0.7rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '2px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'var(--foreground)'
                }}
              >
                Catálogo PDF
              </a>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="hero-image-container md-hidden lg-flex"
            style={{ borderRadius: '2px' }}
          >
            <img 
              src="/hero.png" 
              alt="Luxury Perfume" 
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, black, transparent)' }}></div>
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }} className="flex justify-between items-end">
              <span className="text-4xl luxury-text italic">EST. 2026</span>
            </div>
          </motion.div>
        </section>

        {/* Collection Section */}
        <section id="colecao" style={{ marginBottom: '10rem' }}>
          <div className="flex flex-col md-flex justify-between items-end" style={{ marginBottom: '4rem' }}>
            <div>
              <h2 className="text-6xl luxury-text" style={{ marginBottom: '1rem' }}>Coleção</h2>
              <p className="text-muted text-xs tracking-widest uppercase">
                {searchQuery ? `Resultados para "${searchQuery}"` : 'Fragrâncias de Nicho'}
              </p>
            </div>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)', margin: '0 4rem', display: 'none' }} className="md-flex"></div>
          </div>
          
          <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPerfumes.map(p => (
                <PerfumeCard key={p.id} perfume={p} />
              ))}
            </AnimatePresence>
            {filteredPerfumes.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted italic">
                Nenhum perfume encontrado para sua busca.
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer id="contato" style={{ paddingTop: '5rem', borderTop: '1px solid var(--border)' }}>
          <div className="grid md-grid-cols-2 gap-16">
            <div>
              <h3 className="text-8xl luxury-text italic" style={{ marginBottom: '2rem' }}>PR</h3>
              <p className="text-muted text-sm" style={{ maxWidth: '20rem', marginBottom: '3rem' }}>
                Curadoria olfativa especializada. Sinta a diferença da perfumaria autêntica.
              </p>
              <div className="flex gap-8">
                <a href="https://www.instagram.com/pr__perfumaria/" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-muted hover-text-white transition-all no-underline">INSTAGRAM</a>
                <a href="https://wa.me/5516997951932" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-muted hover-text-white transition-all no-underline">WHATSAPP</a>
              </div>
            </div>
            <div className="flex flex-col justify-center items-start md-items-end">
              <a 
                href="https://drive.google.com/file/d/1pWqnM5zKr0jj6VhcOiy-D8HUS7FJzCVC/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl luxury-text italic text-foreground no-underline"
                style={{ marginBottom: '1rem', borderBottom: '1px solid currentColor' }}
              >
                Catálogo @pr__perfumaria
              </a>
              <p className="text-xs tracking-widest uppercase text-muted">Consultoria de Luxo Online</p>
            </div>
          </div>
          
          <div style={{ marginTop: '8rem', paddingBottom: '3rem' }} className="flex flex-col md-flex justify-between items-center gap-4 text-xs tracking-widest text-muted uppercase">
            <span>© 2026 PR PERFUMARIA</span>
            <span style={{ fontSize: '0.6rem', opacity: 0.5 }}>By Antigravity Design</span>
          </div>
        </footer>
      </main>

      <a 
        href="https://wa.me/5516997951932" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}
