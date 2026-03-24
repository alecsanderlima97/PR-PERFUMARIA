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
  Search,
  ShoppingCart,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Heart,
  CheckCircle,
  ShieldCheck,
  Award,
  Info,
  ChevronLeft,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { perfumes } from './data';
import Sidebar from './components/Sidebar';
import './index.css';

// Componente de Fumaça Dinâmica - Otimizado para Performance
const SmokeBackground = React.memo(() => {
  return (
    <div className="smoke-container">
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
            filter: 'blur(80px)'
          }}
        />
      ))}
      
      <motion.div 
        className="logo-overlay flex flex-col items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 3 }}
      >
          <img src="/logo_pr.jpg" alt="PR Logo" style={{ maxWidth: '200px' }} />
      </motion.div>
    </div>
  );
});

const MusicPlayer = ({ isDiscreet }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const musicUrl = "./assets/ambient-music.mp3"; 

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Áudio ativo"));
    }
    setIsPlaying(!isPlaying);
  };

  if (isDiscreet) {
    return (
      <div className="discreet-music-player">
        <audio ref={audioRef} src={musicUrl} loop />
        <button 
          onClick={togglePlay}
          className="music-toggle-btn"
          title={isPlaying ? "Pausar música" : "Ouvir música"}
        >
          {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>
    );
  }

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
    </div>
  );
};

const SmokeHeader = () => (
  <div className="header-smoke-container">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="header-smoke-puff"
        animate={{
          y: [-10, -40],
          x: [0, (i % 2 === 0 ? 15 : -15)],
          opacity: [0, 0.2, 0],
          scale: [0.8, 1.5]
        }}
        transition={{
          duration: 3 + i,
          repeat: Infinity,
          ease: "easeOut",
          delay: i * 1
        }}
      />
    ))}
  </div>
);

const LuxuryToast = ({ message, isVisible, onClose }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="luxury-toast"
      >
        <CheckCircle size={18} className="text-white" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-50 transition-opacity">
          <X size={14} />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

const ProfileMenu = ({ cartCount, onOpenCart, wishlistCount, onSetClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleWishlistClick = () => {
    onSetClass('Favoritos');
    setIsOpen(false);
    document.getElementById('colecao')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="profile-menu-container" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="profile-trigger">
        <div className="profile-avatar-placeholder">
          <img src="/logo_pr.jpg" alt="Profile" className="w-full h-full object-cover rounded-full" />
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="profile-dropdown"
          >
            <div className="dropdown-header">
              <span className="text-[10px] text-muted uppercase tracking-widest font-bold">Minha Conta</span>
              <button onClick={() => { onOpenCart(); setIsOpen(false); }} className="cart-link-btn flex items-center gap-2">
                <ShoppingCart size={14} />
                <span>({cartCount})</span>
              </button>
            </div>
            
            <div className="dropdown-links">
              <button className="dropdown-item" onClick={handleWishlistClick}>
                <Heart size={14} className="text-red-500" /> Favoritos ({wishlistCount})
              </button>
              <button className="dropdown-item" onClick={() => alert("Em breve: Autenticação!")}><Wind size={14}/> Login</button>
              <button className="dropdown-item" onClick={() => alert("Em breve: Gestão de Perfil!")}><Sparkles size={14}/> Perfil</button>
              <button className="dropdown-item" onClick={() => alert("SAC: 0800-456-7890")}><Info size={14}/> Suporte (SAC)</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HeroSplit = ({ onSelectGender }) => {
  return (
    <section className="hero-split-section">
      <div className="hero-split-container">
        {/* Lado Masculino */}
        <motion.div 
          className="hero-half masculine cursor-pointer"
          whileHover={{ flex: 1.5 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => onSelectGender('Masculino')}
        >
          <div className="hero-half-content">
            <span className="text-xs uppercase tracking-[0.4em] mb-4">Essência Viril</span>
            <h2 className="text-6xl luxury-text mb-8">Masculino</h2>
            <button className="btn-secondary">Explorar</button>
          </div>
          <div className="hero-half-bg">
            <img src="/perf_masc.png" alt="Masculino" />
          </div>
        </motion.div>

        {/* Lado Feminino */}
        <motion.div 
          className="hero-half feminine cursor-pointer"
          whileHover={{ flex: 1.5 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => onSelectGender('Feminino')}
        >
          <div className="hero-half-bg">
            <img src="/perf_fem.png" alt="Feminino" />
          </div>
          <div className="hero-half-content">
            <span className="text-xs uppercase tracking-[0.4em] mb-4">Aura Elegante</span>
            <h2 className="text-6xl luxury-text mb-8">Feminino</h2>
            <button className="btn-secondary">Explorar</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CatalogFilters = ({ activeClass, onSetClass }) => {
  const classes = ["Todos", "Aquático", "Noturno", "Balada", "Trabalho", "Favoritos"];

  return (
    <div className="catalog-filters-container container" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      <div className="filter-group">
        {classes.map(c => (
          <button 
            key={c} 
            className={`filter-btn ${activeClass === c ? 'active' : ''}`}
            onClick={() => onSetClass(c)}
            style={{ 
              background: activeClass === c ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: '1px solid var(--border)',
              padding: '0.4rem 1.2rem',
              color: activeClass === c ? '#fff' : 'var(--muted)',
              cursor: 'pointer',
              borderRadius: '20px',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              letterSpacing: '1px',
              transition: 'all 0.3s'
            }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
};

const Header = ({ searchQuery, onSearch, cartCount, onOpenCart, wishlistCount, onSetClass }) => (
  <header className="header">
    <div className="header-left">
    </div>

    <div className="header-center">
      <SmokeHeader />
      <div className="header-logo-container flex flex-col items-center">
        <img src="/logo_pr.jpg" alt="PR PERFUMARIA" className="h-10 md:h-12 w-auto object-contain brightness-110 contrast-125" />
      </div>
    </div>

    <div className="header-right flex items-center gap-6">
      <div className="header-search md-flex">
        <Search size={14} className="text-muted" />
        <input 
          type="text" 
          placeholder="Pesquisar..." 
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="top-search-input"
        />
      </div>
      <MusicPlayer isDiscreet={true} />
      <ProfileMenu cartCount={cartCount} onOpenCart={onOpenCart} wishlistCount={wishlistCount} onSetClass={onSetClass} />
    </div>
  </header>
);

const CartModal = ({ isOpen, onClose, cart, updateQuantity, removeFromCart }) => {
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const handleCheckout = () => {
    const message = `Olá! Gostaria de finalizar o pedido: %0A%0A${cart.map(i => `- ${i.name} (x${i.quantity}) - R$ ${i.price.toFixed(2)}`).join('%0A')}%0A%0ATotal: R$ ${total.toFixed(2)}%0A%0AForma de pagamento a combinar.`;
    window.open(`https://wa.me/5515996966772?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="sidebar-overlay"
            style={{ zIndex: 2000 }}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="cart-drawer"
          >
            <div className="cart-header">
              <h3 className="text-2xl luxury-text">Seu Carrinho</h3>
              <button onClick={onClose} className="close-btn"><X size={24}/></button>
            </div>
            
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag size={48} className="text-muted" />
                  <p>Seu carrinho está vazio.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price">R$ {item.price.toFixed(2)}</span>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, -1)}><Minus size={12}/></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}><Plus size={12}/></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="remove-item"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted">Total</span>
                  <span className="text-2xl luxury-text">R$ {total.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full py-4">
                  Finalizar Pedido <ArrowRight size={16} />
                </button>
                <div className="payment-methods mt-4">
                  <span className="text-[10px] text-muted uppercase tracking-widest text-center block">Pagamento via PIX ou Cartão</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const QuickViewModal = ({ perfume, onClose, onAddToCart }) => {
  if (!perfume) return null;

  return (
    <AnimatePresence>
      <motion.div 
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="sidebar-overlay"
        style={{ zIndex: 3000 }}
      />
      <motion.div 
        key="modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="quick-view-modal shadow-2xl overflow-hidden"
        style={{ height: 'auto', maxHeight: '90vh', width: '90%', maxWidth: '1000px', display: 'flex', flexDirection: 'column' }}
      >
        <button onClick={onClose} className="close-btn-modal z-50"><X size={20}/></button>
        
        <div className="grid md:grid-cols-2 h-full">
          <div className="quick-view-img relative h-[300px] md:h-full">
            <img 
              src={perfume.image || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800"} 
              alt={perfume.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] tracking-widest uppercase text-white border border-white/10">{perfume.volume}</span>
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] tracking-widest uppercase text-white border border-white/10 capitalize font-bold">{perfume.gender}</span>
            </div>
          </div>
          
          <div className="quick-view-content flex flex-col p-6 md:p-10 overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-white/50" />
                <span className="text-[10px] uppercase tracking-widest text-muted">{perfume.class}</span>
              </div>
              <h3 className="text-4xl md:text-5xl luxury-text leading-tight">{perfume.name}</h3>
              <p className="text-xs text-muted/60 mt-1 uppercase tracking-widest">{perfume.type}</p>
            </div>
            
            <p className="text-2xl font-light mb-6 italic text-white/90">R$ {perfume.price.toFixed(2)}</p>
            
            <div className="space-y-6 mb-10 overflow-auto">
              <div>
                <h5 className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3 font-bold border-b border-white/5 pb-2">Sinopse Olfativa</h5>
                <p className="text-sm text-muted/80 leading-relaxed font-light">{perfume.description}</p>
              </div>

              <div>
                <h5 className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3 font-bold border-b border-white/5 pb-2">Pirâmide de Notas</h5>
                <div className="flex flex-wrap gap-2">
                  {perfume.ingredients.map(ing => (
                    <span key={ing} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm text-[9px] uppercase tracking-widest text-white/70 hover:bg-white/10 transition-colors">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3 font-bold border-b border-white/5 pb-2">Selos & Qualidade</h5>
                <div className="flex flex-wrap gap-3">
                  {perfume.seals.map(seal => (
                    <div key={seal} className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-white/60">
                      <Award size={10} className="text-white/40" />
                      {seal}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 text-[9px] text-muted space-y-1">
                <p className="flex justify-between"><span>SAC:</span> <span className="text-white/40 font-mono">{perfume.sac}</span></p>
                {perfume.approvals.map((app, idx) => (
                   <p key={idx} className="flex justify-between"><span>CERTIFICAÇÃO:</span> <span className="text-white/40">{app}</span></p>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 mt-auto pt-6 border-t border-white/10">
              <button 
                onClick={() => { onAddToCart(perfume); onClose(); }} 
                className="btn-primary flex-1 py-4 uppercase text-[10px] tracking-[0.3em] font-bold"
              >
                Reservar agora
              </button>
              <button 
                onClick={() => window.open(perfume.whatsappLink, '_blank')}
                className="btn-secondary px-6 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                title="Dúvidas no WhatsApp"
              >
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const PerfumeCard = ({ perfume, onAddToCart, onToggleWishlist, isWishlisted, onQuickView }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className="glass-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="card-image-wrap mb-6" style={{ height: '300px', overflow: 'hidden', position: 'relative', borderRadius: '2px', border: '1px solid var(--border)' }}>
        <img 
          src={perfume.image || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800"} 
          alt={perfume.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="hover:scale-105"
        />
        <div className="card-badge" style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', padding: '2px 8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {perfume.gender}
        </div>
      </div>
      <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
        <div>
          <span className="text-xs uppercase tracking-widest text-muted" style={{ marginBottom: '0.5rem', display: 'block' }}>{perfume.type}</span>
          <h3 className="text-3xl luxury-text" style={{ fontSize: '2rem' }}>{perfume.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button 
            onClick={() => onToggleWishlist(perfume.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isWishlisted ? '#ff4d4d' : 'var(--muted)', transition: 'color 0.3s' }}
            title={isWishlisted ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
          >
            <Heart size={20} fill={isWishlisted ? "#ff4d4d" : "none"} />
          </button>
          <div className="flex flex-col items-end mt-2">
            <span className="text-lg luxury-text">R$ {perfume.price.toFixed(2)}</span>
            <div className="text-muted" style={{ fontSize: '0.7rem' }}>0{perfume.id}</div>
          </div>
        </div>
      </div>
      
      <p className="text-sm font-light text-muted leading-relaxed" style={{ marginBottom: '1.5rem', height: '3rem', overflow: 'hidden' }}>
        {perfume.description}
      </p>

      <div className="flex gap-2" style={{ flexWrap: 'wrap', marginBottom: '1.5rem' }}>
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
        Detalhes <ChevronRight size={14} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
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

      <div className="flex gap-2 mt-auto">
        <button 
          onClick={() => onAddToCart(perfume)}
          className="btn-primary"
          style={{ flex: 1 }}
        >
          Comprar <ShoppingCart size={14} style={{ marginLeft: '10px' }} />
        </button>
        <button 
          onClick={() => onQuickView(perfume)}
          className="btn-secondary px-4"
          title="Visualização Rápida"
        >
          <Sparkles size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [activeClass, setActiveClass] = useState('Todos');
  const [selectedGender, setSelectedGender] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 5;

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('pr_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pr_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeClass, searchQuery, selectedGender]);

  const [toast, setToast] = useState({ visible: false, message: '' });

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const isAdding = !prev.includes(id);
      if (isAdding) {
        showToast("Adicionado aos Favoritos");
      } else {
        showToast("Removido dos Favoritos");
      }
      return isAdding ? [...prev, id] : prev.filter(wId => wId !== id);
    });
  };

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const addToCart = (perfume) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === perfume.id);
      if (existing) {
        return prev.map(i => i.id === perfume.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...perfume, quantity: 1 }];
    });
    showToast(`${perfume.name} adicionado ao carrinho`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const filteredPerfumes = perfumes.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesClass = activeClass === 'Todos' || 
                         (activeClass === 'Favoritos' ? wishlist.includes(p.id) : p.class === activeClass);

    const matchesGender = selectedGender === 'Todos' || p.gender === selectedGender;

    return matchesSearch && matchesClass && matchesGender;
  });

  const totalPages = Math.ceil(filteredPerfumes.length / PER_PAGE);
  const paginatedPerfumes = filteredPerfumes.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const selectGender = (gender) => {
    setSelectedGender(gender);
    setActiveClass('Todos');
    const catalogElement = document.getElementById('colecao');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <SmokeBackground />
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onSearch={setSearchQuery}
      />
      
      <Header 
        searchQuery={searchQuery} 
        onSearch={setSearchQuery} 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onSetClass={setActiveClass}
      />

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      <QuickViewModal 
        perfume={selectedPerfume} 
        onClose={() => setSelectedPerfume(null)} 
        onAddToCart={addToCart} 
      />

      <main className="container section-py">
        {/* New Split Hero Section */}
        <HeroSplit onSelectGender={selectGender} />

        {/* Scent of the Month - Oud Supremo */}
        <section id="featured" style={{ marginBottom: '10rem' }}>
          <div className="grid md-grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div style={{ position: 'absolute', top: '-2rem', left: '-2rem', fontSize: '10rem', opacity: 0.05, fontFamily: 'Playfair Display' }}>07</div>
              <img 
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800" 
                alt="Oud Supremo" 
                style={{ width: '100%', height: '600px', objectFit: 'cover', border: '1px solid var(--border)' }} 
              />
              <div style={{ position: 'absolute', bottom: '2rem', right: '-2rem', background: '#fff', color: '#000', padding: '1.5rem', border: '1px solid #000' }}>
                <span className="text-xs uppercase tracking-widest font-bold">Destaque do Mês</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h4 className="text-xs uppercase tracking-widest text-muted" style={{ marginBottom: '1rem' }}>Coleção de Luxo</h4>
              <h2 className="text-7xl luxury-text" style={{ marginBottom: '2rem' }}>Oud Supremo</h2>
              <p className="text-muted leading-relaxed" style={{ marginBottom: '3rem', fontSize: '1.1rem' }}>
                O Oud Supremo não é apenas um perfume, é uma declaração de poder. 
                Composto pelo raro óleo de Agarwood, esta fragrância oriental amadeirada 
                foi desenhada para os momentos onde o luxo absoluto é a única opção.
              </p>
              
              <div className="flex gap-8 items-center" style={{ marginBottom: '4rem' }}>
                <div>
                  <span className="block text-xs text-muted uppercase tracking-widest">Preço</span>
                  <span className="text-2xl font-light">R$ 689,00</span>
                </div>
                <div style={{ width: '1px', height: '40px', background: 'var(--border)' }}></div>
                <div>
                  <span className="block text-xs text-muted uppercase tracking-widest">Família</span>
                  <span className="text-2xl font-light">Oriental</span>
                </div>
              </div>
              
              <button 
                onClick={() => addToCart(perfumes.find(p => p.id === 7))}
                className="btn-primary" 
                style={{ padding: '1.5rem 4rem' }}
              >
                Adquirir Experiência <ArrowRight size={18} style={{ marginLeft: '1rem' }} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Collection Section */}
        <section id="colecao" style={{ marginBottom: '10rem', paddingTop: '6rem' }}>
          <div className="flex flex-col md-flex justify-between items-end" style={{ marginBottom: '2rem' }}>
            <div>
              <h2 className="text-6xl luxury-text" style={{ marginBottom: '1rem' }}>Coleção</h2>
              <p className="text-muted text-xs tracking-widest uppercase">
                {searchQuery ? `Resultados para "${searchQuery}"` : wishlist.length > 0 && activeClass === 'Favoritos' ? 'Sua Seleção Exclusiva' : 'Fragrâncias de Nicho Selecionadas'}
              </p>
            </div>
          </div>

          <CatalogFilters 
            activeClass={activeClass}
            onSetClass={setActiveClass}
          />
          
          <div className="catalog-side">
            <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-4">
               <div>
                 <span className="text-[10px] text-muted tracking-[0.3em] uppercase block mb-1">Status da Visualização</span>
                 <div className="flex items-center gap-3">
                    <span className={`h-1.5 w-1.5 rounded-full ${selectedGender === 'Todos' ? 'bg-white' : 'bg-muted'}`}></span>
                    <span className="text-xs luxury-text">Exibindo: {(selectedGender === 'Todos' ? 'Coleção Completa' : selectedGender)} ({filteredPerfumes.length})</span>
                 </div>
               </div>
               
               {totalPages > 1 && (
                 <div className="pagination-controls flex items-center gap-4">
                   <button 
                     disabled={currentPage === 1}
                     onClick={() => { setCurrentPage(prev => prev - 1); document.getElementById('colecao').scrollIntoView(); }}
                     className="pagination-arrow disabled:opacity-30 hover:opacity-100 transition-all p-2 bg-white/5 rounded-full border border-white/10"
                   >
                     <ChevronLeft size={16} />
                   </button>
                   <span className="text-[10px] uppercase tracking-widest font-bold">Página {currentPage} de {totalPages}</span>
                   <button 
                     disabled={currentPage === totalPages}
                     onClick={() => { setCurrentPage(prev => prev + 1); document.getElementById('colecao').scrollIntoView(); }}
                     className="pagination-arrow disabled:opacity-30 hover:opacity-100 transition-all p-2 bg-white/5 rounded-full border border-white/10"
                   >
                     <ChevronRight size={16} />
                   </button>
                 </div>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <AnimatePresence mode="popLayout">
                {paginatedPerfumes.map(p => (
                  <PerfumeCard key={p.id} perfume={p} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(p.id)} onQuickView={setSelectedPerfume} />
                ))}
              </AnimatePresence>
            </div>

            {filteredPerfumes.length === 0 && (
              <div className="text-center py-20">
                <Wind size={48} className="mx-auto text-muted/20 mb-4 animate-pulse" />
                <p className="text-muted italic text-lg luxury-text">Nenhuma fragrância encontrada nesta seleção.</p>
                <button onClick={() => { setActiveClass('Todos'); setSelectedGender('Todos'); setSearchQuery(''); }} className="mt-6 text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 hover:text-white transition-colors">Limpar Filtros</button>
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
                <a href="https://wa.me/5515996966772" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-muted hover-text-white transition-all no-underline">WHATSAPP</a>
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

      {/* Luxury Interstitial UI */}
      <LuxuryToast 
        message={toast.message} 
        isVisible={toast.visible} 
        onClose={() => setToast({ visible: false, message: '' })} 
      />

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      <QuickViewModal 
        perfume={selectedPerfume} 
        onClose={() => setSelectedPerfume(null)} 
        onAddToCart={addToCart}
      />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="back-to-top-float"
        title="Voltar ao Topo"
      >
        <Wind size={24} />
      </button>

      <a 
        href="https://wa.me/5515996966772" 
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}
