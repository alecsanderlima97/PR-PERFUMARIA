import React, { useState, useRef, useEffect } from 'react';
import { 
  Instagram, MessageCircle, Volume2, VolumeX, ArrowRight, Wind, Droplets, Sparkles,
  Play, Pause, ChevronRight, Search, ShoppingCart, ShoppingBag, Trash2, Minus, Plus,
  Heart, CheckCircle, ShieldCheck, Award, Info, ChevronLeft, X, LogIn, LogOut, User as UserIcon, Mail, Lock
} from 'lucide-react';
import { auth, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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

const MusicPlayer = ({ isDiscreet = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Erro ao reproduzir áudio:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  if (isDiscreet) {
    return (
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">
        <audio ref={audioRef} src="/assets/ambient-music.mp3" loop />
        <button onClick={togglePlay} className="text-white/70 hover:text-white transition-colors">
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <div className="hidden md:flex items-center gap-2">
           <Volume2 size={10} className="text-white/30" />
           <input
            type="range" min="0" max="1" step="0.01" value={volume}
            onChange={handleVolumeChange}
            className="w-12 h-[2px] bg-white/10 appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 left-8 z-[100] flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-full group transition-all duration-500 hover:bg-black/80 hover:scale-[1.02] shadow-2xl">
      <audio
        ref={audioRef}
        src="/assets/ambient-music.mp3"
        loop
      />
      
      <button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] relative overflow-hidden shrink-0"
      >
        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.5 }}
                className="absolute inset-0 border border-white/30 rounded-full"
              />
            ))}
          </div>
        )}
      </button>

      <div className="flex flex-col gap-1 pr-2 min-w-[100px]">
        <div className="flex items-center gap-3">
          <div className="flex gap-[2px] h-3 items-end overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: isPlaying ? [
                    '20%', '80%', '40%', '100%', '30%'
                  ][i] : '20%' 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.8 + (i * 0.1), 
                  repeatType: "reverse" 
                }}
                className="w-[2px] bg-white/60 rounded-full"
              />
            ))}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/70 whitespace-nowrap">Ambiente</span>
        </div>
        
        <div className="flex items-center gap-3 w-full">
          <Volume2 size={12} className="text-white/40 shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-[3px] bg-white/20 appearance-none cursor-pointer accent-white hover:accent-white transition-all rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
        </div>
      </div>
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

const ProfileMenu = ({ user, cartCount, onOpenCart, wishlistCount, onSetClass, onGoogleLogin }) => {
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
      <button onClick={() => setIsOpen(!isOpen)} className="profile-trigger flex items-center gap-2">
        <div className="profile-avatar-placeholder border border-white/10 overflow-hidden">
          {user ? (
            <img src={user.photoURL} alt="User" className="w-full h-full object-cover rounded-full" />
          ) : (
            <UserIcon size={14} className="text-white/40" />
          )}
        </div>
        {user && <span className="hidden md:block text-[9px] uppercase tracking-widest text-white/70">{user.displayName.split(' ')[0]}</span>}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="profile-dropdown"
          >
            <div className="dropdown-header">
              <span className="text-[10px] text-muted uppercase tracking-widest font-bold">
                {user ? user.email : 'Visitante'}
              </span>
              <button onClick={() => { onOpenCart(); setIsOpen(false); }} className="cart-link-btn flex items-center gap-2 relative">
                <ShoppingBag size={14} />
                <span className="cart-badge-mini">{cartCount}</span>
              </button>
            </div>
            
            <div className="dropdown-links">
              <button className="dropdown-item" onClick={handleWishlistClick}>
                <Heart size={14} className="text-white/40" /> Favoritos ({wishlistCount})
              </button>
              
              {user ? (
                <button className="dropdown-item text-red-400/80" onClick={() => { logout(); setIsOpen(false); }}>
                  <LogOut size={14} /> Sair
                </button>
              ) : (
                <button className="dropdown-item text-white" onClick={() => { if(onGoogleLogin) onGoogleLogin(); else signInWithGoogle(); setIsOpen(false); }}>
                  <LogIn size={14} /> Entrar com Google
                </button>
              )}
              
              <div className="h-[1px] bg-white/5 my-2" />
              <button className="dropdown-item" onClick={() => alert("Suporte Orquestra: +55 15 99847-8705")}><Info size={14}/> Suporte</button>
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

const Header = ({ user, searchQuery, onSearch, cartCount, onOpenCart, wishlistCount, onSetClass, onGoogleLogin }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-[1000] px-6 py-4 transition-all duration-500 ${isScrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center h-12 md:h-20 relative">
        {/* Lado Esquerdo: Navegação */}
        <div className="flex-1 flex items-center justify-start">
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex gap-8">
              <a href="#" className="text-[10px] uppercase tracking-widest text-muted hover:text-white transition-all no-underline font-medium">Início</a>
              <a href="#colecao" className="text-[10px] uppercase tracking-widest text-muted hover:text-white transition-all no-underline font-medium">Coleção</a>
              <a href="#featured" className="text-[10px] uppercase tracking-widest text-muted hover:text-white transition-all no-underline font-medium">Destaque</a>
            </nav>
          </div>
        </div>

        {/* Centro: Logo (Centralizada e Maior) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="header-logo-container cursor-pointer p-4 hover:scale-110 transition-all">
            <img src="/logo_pr.jpg" alt="PR" className="h-16 md:h-24 w-auto brightness-110 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
          </div>
        </div>

        {/* Lado Direito: Busca e Ícones */}
        <div className="flex-1 flex items-center justify-end gap-6">
          <div className="relative group hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar fragrância..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-white/20 transition-all w-32 lg:w-48 outline-none text-white placeholder:text-white/20"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <MusicPlayer isDiscreet={true} />
            </div>
            
            <button onClick={onOpenCart} className="cart-number-btn relative flex items-center justify-center bg-white/5 border border-white/10 w-10 h-10 rounded-full hover:bg-white/10 transition-all font-bold group">
              <ShoppingCart size={18} className="text-white/60 group-hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            <ProfileMenu 
              user={user} 
              cartCount={cartCount} 
              onOpenCart={onOpenCart} 
              wishlistCount={wishlistCount} 
              onSetClass={onSetClass} 
              onGoogleLogin={onGoogleLogin}
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const CartModal = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, updateCartItem }) => {
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [address, setAddress] = useState({ 
    cep: '', street: '', district: '', city: '', state: '', number: '', 
    firstName: '', lastName: '' 
  });
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [loadingCep, setLoadingCep] = useState(false);

  const subtotal = cart.reduce((acc, item) => {
    const volumeMultiplier = item.selectedVolume === '50ml' ? 0.7 : item.selectedVolume === '200ml' ? 1.7 : 1;
    return acc + (item.price * volumeMultiplier * item.quantity);
  }, 0);

  const total = subtotal + shipping - appliedDiscount;

  const handleCepChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setAddress({ ...address, cep: val });
    
    if (val.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${val}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setAddress(prev => ({
            ...prev,
            street: data.logradouro,
            district: data.bairro,
            city: data.localidade,
            state: data.uf
          }));
          const stateFreight = ['SP', 'RJ', 'MG', 'PR'].includes(data.uf) ? 15 : 35;
          setShipping(subtotal > 500 ? 0 : stateFreight);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'PR10') {
      setAppliedDiscount(subtotal * 0.1);
      alert('Cupom PR10 aplicado! 10% de desconto.');
    } else {
      alert('Cupom inválido.');
      setAppliedDiscount(0);
    }
  };

  const handleCheckout = () => {
    if (step === 'cart') {
      setStep('checkout');
      return;
    }

    if (!address.cep || !address.street || !address.number || !address.firstName) {
      alert('Por favor, preencha todos os campos obrigatórios para entrega.');
      return;
    }

    const itemsList = cart.map(i => {
      const vol = i.selectedVolume || '100ml';
      return `- ${i.name} (${vol}) (x${i.quantity})`;
    }).join('%0A');

    const deliveryInfo = `%0A*ENTREGA EM:* ${address.firstName} ${address.lastName}%0A${address.street}, ${address.number}%0A${address.district} - ${address.city}/${address.state}%0A*CEP:* ${address.cep}`;
    const moneyInfo = `%0A*Subtotal:* R$ ${subtotal.toFixed(2)}%0A*Frete:* ${shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toFixed(2)}`}${appliedDiscount > 0 ? `%0A*Desconto:* -R$ ${appliedDiscount.toFixed(2)}` : ''}%0A*TOTAL:* R$ ${total.toFixed(2)}`;
    const message = `*PEDIDO - PR PERFUMARIA*%0A%0A*ITENS:*%0A${itemsList}%0A${deliveryInfo}%0A${moneyInfo}%0A%0A_Aguardando confirmação._`;
    
    window.open(`https://wa.me/5515996966772?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="sidebar-overlay" style={{ zIndex: 2000 }} />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
            className="cart-drawer" 
            style={{ maxWidth: '1000px', width: '100%' }}
          >
            <div className="cart-header">
              <div className="flex items-center gap-4">
                 {step === 'checkout' && <button onClick={() => setStep('cart')} className="p-2 hover:bg-white/5 rounded-full"><ChevronLeft size={20}/></button>}
                 <h3 className="text-2xl luxury-text italic">{step === 'cart' ? 'Seu Carrinho' : 'Finalizar Pedido'}</h3>
              </div>
              <button onClick={onClose} className="close-btn"><X size={24}/></button>
            </div>
            
            <div className="cart-items flex-1 overflow-y-auto px-8 py-2">
              {cart.length === 0 ? (
                <div className="empty-cart flex flex-col items-center justify-center h-full opacity-30">
                  <ShoppingBag size={48} className="mb-4" />
                  <p className="uppercase tracking-widest text-[10px] font-bold">O carrinho está vazio</p>
                </div>
              ) : step === 'cart' ? (
                <div className="space-y-4">
                  {cart.map(item => {
                    const currentVol = item.selectedVolume || '100ml';
                    const priceWithVol = item.price * (currentVol === '50ml' ? 0.7 : currentVol === '200ml' ? 1.7 : 1);
                    return (
                      <div key={item.id} className="cart-item group border border-white/5 bg-white/[0.02] p-8 md:p-10 rounded-[2.5rem] relative hover:bg-white/[0.04] transition-all mb-4 shadow-2xl">
                        <div className="flex gap-12 items-center">
                          {/* Foto do Produto Imponente */}
                          <div className="w-40 h-52 rounded-3xl overflow-hidden border border-white/10 shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                          </div>
                          
                          {/* Informações de Alta Legibilidade */}
                          <div className="flex-1 flex flex-col min-w-0">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <h4 className="cart-item-name text-4xl md:text-5xl luxury-text mb-4 italic tracking-tight">{item.name}</h4>
                                <div className="flex gap-4 items-center">
                                  <span className="text-[12px] uppercase tracking-[0.4em] font-black px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 rounded-lg">{item.gender}</span>
                                  <span className="text-[12px] uppercase tracking-[0.4em] font-black px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 rounded-lg">{item.class}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="cart-item-price luxury-text text-3xl md:text-4xl text-white block mb-1">R$ {(priceWithVol * item.quantity).toFixed(2)}</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/20">Preço Unitário</span>
                              </div>
                            </div>
                            
                            <div className="mt-8 pt-10 border-t border-white/10 flex justify-between items-center">
                              <div className="flex items-center gap-16">
                                <div className="flex flex-col gap-3">
                                  <label className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Escolha o Volume</label>
                                  <select 
                                    value={currentVol} 
                                    onChange={(e) => updateCartItem(item.id, { selectedVolume: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[14px] uppercase tracking-[0.2em] font-bold outline-none cursor-pointer hover:border-white/40 transition-all"
                                  >
                                    <option value="50ml" className="bg-black">50ml Premium</option>
                                    <option value="100ml" className="bg-black">100ml Original</option>
                                    <option value="200ml" className="bg-black">200ml Collector</option>
                                  </select>
                                </div>

                                <div className="flex flex-col gap-3">
                                  <label className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Quantidade</label>
                                  <div className="quantity-controls flex items-center gap-8 bg-white/5 rounded-2xl px-6 py-3 border border-white/10">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="text-white/40 hover:text-white transition-colors scale-125"><Minus size={18}/></button>
                                    <span className="text-lg font-black min-w-[30px] text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="text-white/40 hover:text-white transition-colors scale-125"><Plus size={18}/></button>
                                  </div>
                                </div>
                              </div>
                              
                              <button onClick={() => removeFromCart(item.id)} className="flex items-center gap-3 text-white/10 hover:text-red-500 transition-all px-6 py-3 rounded-xl hover:bg-red-500/5 group/trash">
                                <Trash2 size={24} className="group-hover/trash:scale-110 transition-transform" />
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-0 group-hover/trash:opacity-100 transition-opacity">Remover Item</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="coupon-area pt-2">
                    <div className="flex gap-2">
                       <input 
                         type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="CUPOM DE DESCONTO"
                         className="flex-1 bg-white/5 border border-white/10 px-4 py-2.5 text-[10px] tracking-widest uppercase outline-none focus:border-white/30 transition-all"
                       />
                       <button onClick={applyCoupon} className="px-5 bg-white text-black text-[9px] font-bold uppercase tracking-widest hover:bg-white/90">OK</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="checkout-form space-y-4">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-widest text-white/30 ml-1">Nome</label>
                        <input type="text" value={address.firstName} onChange={(e) => setAddress({...address, firstName: e.target.value})} className="w-full bg-white/5 border border-white/10 p-2.5 text-xs outline-none focus:border-white/30" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-widest text-white/30 ml-1">Sobrenome</label>
                        <input type="text" value={address.lastName} onChange={(e) => setAddress({...address, lastName: e.target.value})} className="w-full bg-white/5 border border-white/10 p-2.5 text-xs outline-none focus:border-white/30" />
                      </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-widest text-white/40 ml-1">CEP {loadingCep && '...'}</label>
                        <input type="text" value={address.cep} onChange={handleCepChange} maxLength="8" placeholder="00000000" className="w-full bg-white/5 border border-white/10 p-2.5 text-xs outline-none focus:border-white/30" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-widest text-white/40 ml-1">Cidade / Estado</label>
                        <input type="text" value={address.state ? `${address.city} - ${address.state}` : address.city} readOnly className="w-full bg-white/5 border border-white/10 p-2.5 text-xs outline-none opacity-50" />
                      </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[8px] uppercase tracking-widest text-white/30 ml-1">Rua / Logradouro</label>
                        <input type="text" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} className="w-full bg-white/5 border border-white/10 p-2.5 text-xs outline-none focus:border-white/30" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-widest text-white/30 ml-1">Número</label>
                        <input type="text" value={address.number} onChange={(e) => setAddress({...address, number: e.target.value})} className="w-full bg-white/5 border border-white/10 p-2.5 text-xs outline-none focus:border-white/30" />
                      </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-widest text-white/30 ml-1">Bairro</label>
                        <input type="text" value={address.district} onChange={(e) => setAddress({...address, district: e.target.value})} className="w-full bg-white/5 border border-white/10 p-2.5 text-xs outline-none focus:border-white/30" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-widest text-white/30 ml-1">Complemento</label>
                        <input type="text" className="w-full bg-white/5 border border-white/10 p-2.5 text-xs outline-none focus:border-white/30" />
                      </div>
                   </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer p-8 border-t border-white/10 bg-black/80 backdrop-blur-xl">
                <div className="space-y-3 mb-8">
                   <div className="flex justify-between items-center text-white/40 text-[10px] uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                   </div>
                   {shipping > 0 && (
                     <div className="flex justify-between items-center text-white/40 text-[10px] uppercase tracking-widest">
                        <span>Frete</span>
                        <span>R$ {shipping.toFixed(2)}</span>
                     </div>
                   )}
                   {appliedDiscount > 0 && (
                     <div className="flex justify-between items-center text-green-400/60 text-[10px] uppercase tracking-widest">
                        <span>Desconto</span>
                        <span>- R$ {appliedDiscount.toFixed(2)}</span>
                     </div>
                   )}
                   <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Total Final</span>
                      <span className="text-4xl luxury-text">R$ {total.toFixed(2)}</span>
                   </div>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full py-5 flex items-center justify-center gap-4 group">
                  <span className="uppercase tracking-[0.3em] text-[10px] font-bold">{step === 'cart' ? 'Prosseguir para Entrega' : 'Finalizar no WhatsApp'}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const QuickViewModal = ({ perfume, onClose, onAddToCart }) => {
  return (
    <>
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
    </>
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
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeClass, setActiveClass] = useState('Todos');
  const [selectedGender, setSelectedGender] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
      showToast("Login com Google bem sucedido!");
    } catch (error) {
      console.error(error);
      showToast("Erro ao fazer login com Google.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Preencha todos os campos obrgatórios.");
      return;
    }
    setAuthLoading(true);
    try {
      if (authMode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        showToast("Conta criada com sucesso!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Login realizado com sucesso!");
      }
    } catch (error) {
      let msg = "Erro na autenticação.";
      if (error.code === 'auth/email-already-in-use') msg = "E-mail já está em uso.";
      if (error.code === 'auth/invalid-credential') msg = "Credenciais inválidas.";
      if (error.code === 'auth/weak-password') msg = "Senha muito fraca.";
      showToast(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        showToast(`Bem-vindo, ${currentUser.displayName}!`);
      }
    });
    return () => unsubscribe();
  }, []);

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

  const updateCartItem = (id, updates) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
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
    <div className="min-h-screen bg-black text-white relative">
      <style>{`
        /* Scrollbar mais larga e visível conforme solicitado */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.4); }
        ::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.2); 
          border-radius: 20px;
          border: 2px solid rgba(0,0,0,0.4);
        }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
        * { scrollbar-width: auto; scrollbar-color: rgba(255, 255, 255, 0.2) transparent; }
      `}</style>
      <SmokeBackground />
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onSearch={setSearchQuery}
        onSetClass={setActiveClass}
      />
      
      <Header 
        user={user}
        searchQuery={searchQuery} 
        onSearch={setSearchQuery} 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onSetClass={setActiveClass}
        onGoogleLogin={handleGoogleAuth}
      />

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        updateCartItem={updateCartItem}
      />

      <AnimatePresence>
        {selectedPerfume && (
          <QuickViewModal 
            perfume={selectedPerfume} 
            onClose={() => setSelectedPerfume(null)} 
            onAddToCart={addToCart} 
          />
        )}
      </AnimatePresence>

      <main className="container section-py pt-24 md:pt-32">
        {!user ? (
          <section className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden"
             >
               <img src="/logo_pr.jpg" alt="PR" className="h-20 mx-auto mb-6 rounded-xl ring-1 ring-white/20" />
               <h2 className="text-3xl luxury-text mb-2">
                 {authMode === 'login' ? 'Bem-vindo à PR' : 'Crie sua Conta'}
               </h2>
               <p className="text-muted text-xs mb-8 uppercase tracking-widest leading-relaxed">
                 Acesse nossa curadoria exclusiva de fragrâncias de nicho.
               </p>

               <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 mb-6">
                 {authMode === 'register' && (
                   <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                       <UserIcon size={18} />
                     </span>
                     <input 
                       type="text" 
                       placeholder="Seu Nome" 
                       value={name}
                       onChange={e => setName(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 transition-colors"
                     />
                   </div>
                 )}
                 <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                     <Mail size={18} />
                   </span>
                   <input 
                     type="email" 
                     placeholder="E-mail" 
                     value={email}
                     onChange={e => setEmail(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 transition-colors"
                   />
                 </div>
                 <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                     <Lock size={18} />
                   </span>
                   <input 
                     type="password" 
                     placeholder="Senha" 
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 transition-colors"
                   />
                 </div>
                 <button 
                   type="submit"
                   disabled={authLoading}
                   className="w-full btn-primary py-3 mt-2 flex items-center justify-center gap-2 group disabled:opacity-50"
                 >
                   {authLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                     <>
                       {authMode === 'login' ? 'Entrar' : 'Registrar'}
                       <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                     </>
                   )}
                 </button>
               </form>

               <div className="relative flex items-center justify-center mb-6">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-white/10"></div>
                 </div>
                 <span className="relative bg-black px-4 text-xs text-muted tracking-widest uppercase">Ou</span>
               </div>

               <button 
                 type="button"
                 onClick={handleGoogleAuth}
                 className="w-full bg-white text-black py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-white/90 transition-colors mb-6 text-sm font-medium"
               >
                 <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                 Continuar com Google
               </button>

               <div className="text-center">
                 <button 
                   type="button"
                   onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                   className="text-xs text-muted hover:text-white transition-colors uppercase tracking-widest"
                 >
                   {authMode === 'login' ? 'Não tem uma conta? Registre-se' : 'Já tem conta? Entre'}
                 </button>
               </div>
             </motion.div>
          </section>
        ) : (
          <>
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
          </>
        )}

        {/* Footer */}
        <footer id="contato" style={{ paddingTop: '8rem', borderTop: '1px solid var(--border)', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.02))' }}>
          <div className="grid md:grid-cols-2 gap-16 container">
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-8xl luxury-text italic mb-4">PR</h3>
                <p className="text-muted text-sm leading-relaxed max-w-sm mb-6">
                  Curadoria olfativa especializada. Sinta a diferença da perfumaria autêntica e exclusiva.
                </p>
                <div className="flex gap-12">
                  <a href="https://www.instagram.com/pr__perfumaria/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted hover:text-white transition-all no-underline font-bold group">
                    <span>INSTAGRAM</span>
                    <Instagram size={24} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <a href="https://wa.me/5515996966772" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted hover:text-white transition-all no-underline font-bold group">
                    <span>WHATSAPP</span>
                    <MessageCircle size={24} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm max-w-md">
                <p className="text-xs italic text-white/80 leading-relaxed mb-4">
                  "Obrigado por escolher a PR Perfumaria. Cada fragrância é uma história que levamos até você com todo carinho e dedicação. Sinta a essência do luxo em cada gota." ✨
                </p>
                <span className="text-[9px] uppercase tracking-widest text-muted">Com carinho, Equipe PR</span>
              </div>
            </div>

            <div className="flex flex-col justify-between items-start md:items-end gap-12">
              <div className="text-left md:text-right">
                <h4 className="text-[10px] uppercase tracking-[0.4em] text-muted mb-6 font-bold">Desenvolvido por</h4>
                <div className="text-5xl luxury-text mb-4">
                  <span style={{ color: '#3b82f6' }}>O</span><span style={{ color: 'white' }}>rquestra.cs</span>
                </div>
                <div className="flex items-center gap-3 md:justify-end text-muted hover:text-white transition-colors">
                  <MessageCircle size={16} className="text-blue-500" />
                  <a href="https://wa.me/5515998478705" target="_blank" rel="noopener noreferrer" className="text-sm tracking-widest no-underline text-inherit">
                    Suporte: +55 15 99847-8705
                  </a>
                </div>
              </div>

              <div className="w-full h-[1px] bg-white/5 md:hidden"></div>

              <div className="text-left md:text-right">
                <p className="text-xs tracking-widest uppercase text-muted mb-2 font-medium">Consultoria de Luxo Online</p>
                <p className="text-[10px] text-muted/40 uppercase tracking-[0.2em]">Atendimento Especializado 24h</p>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '8rem', paddingBottom: '3rem' }} className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.3em] text-muted uppercase container border-t border-white/5 pt-8">
            <span>© 2026 PR PERFUMARIA</span>
            <div className="flex items-center gap-2">
              <span style={{ opacity: 0.5 }}>By</span>
              <span className="font-bold text-white">
                <span style={{ color: '#3b82f6' }}>O</span>RQUESTRA.CS
              </span>
            </div>
          </div>
        </footer>
      </main>

      {/* Luxury Interstitial UI */}
      <LuxuryToast 
        message={toast.message} 
        isVisible={toast.visible} 
        onClose={() => setToast({ visible: false, message: '' })} 
      />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="back-to-top-float"
        title="Voltar ao Topo"
      >
        <Wind size={24} />
      </button>

    </div>
  );
}
