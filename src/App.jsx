// backup: 2026-03-24 22:51:33
import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import { 
  Instagram, MessageCircle, Volume2, VolumeX, ArrowRight, Wind, Droplets, Sparkles,
  Play, Pause, ChevronRight, Search, ShoppingCart, ShoppingBag, Trash2, Minus, Plus,
  Heart, CheckCircle, ShieldCheck, Award, Info, ChevronLeft, X, LogIn, LogOut, User as UserIcon, Mail, Lock, Shield
} from 'lucide-react';
import { auth, googleProvider, db } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { 
  setDoc, 
  getDoc, 
  doc, 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  Timestamp 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { perfumes } from './data';
import Sidebar from './components/Sidebar';
import './index.css';

const CatalogTitleIcon = () => (
  <motion.div 
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="relative w-12 h-12 flex items-center justify-center mb-4"
  >
    <div className="absolute inset-0 border border-white/20 rotate-45 rounded-sm"></div>
    <div className="absolute inset-2 border border-blue-500/30 rotate-45 rounded-sm"></div>
    <Sparkles size={20} className="text-white relative z-10 animate-pulse" />
  </motion.div>
);

const SmokeBackground = memo(() => {
  return (
    <div className="smoke-container" style={{ background: '#000' }}>
      <div className="logo-overlay flex flex-col items-center justify-center pointer-events-none opacity-[0.05]">
          <img 
            src="/logo_pr.jpg" 
            alt="PR" 
            style={{ 
              width: '280px', 
              height: 'auto', 
              filter: 'grayscale(1) invert(1) opacity(0.3)'
            }} 
          />
      </div>
    </div>
  );
});

const MusicPlayer = memo(({ isDiscreet = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const attemptPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        // Autoplay bloqueado pelo navegador até interação
      }
    };

    const handleInteraction = () => {
      if (audio.paused) {
        attemptPlay();
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };

    if (!isPlaying) {
      window.addEventListener('click', handleInteraction);
      window.addEventListener('touchstart', handleInteraction);
      window.addEventListener('scroll', handleInteraction);
    }

    return () => {
      cleanupListeners();
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log("Erro ao reproduzir áudio:", e));
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const musicUrl = "https://cdn.pixabay.com/audio/2026/02/15/audio_808b227045.mp3";

  return (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">
      <audio ref={audioRef} src={musicUrl} loop />
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
});

const SmokeHeader = memo(() => null);

const LuxuryToast = memo(({ message, isVisible, onClose }) => (
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
));

const ProfileMenu = memo(({ user, cartCount, onOpenCart, wishlistCount, onSetClass, onGoogleLogin, onOpenOrders }) => {
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

              {user && (
                <button className="dropdown-item" onClick={() => { onOpenOrders(); setIsOpen(false); }}>
                  <ShieldCheck size={14} className="text-white/40" /> Meus Pedidos
                </button>
              )}
              
              {user ? (
                <button className="dropdown-item text-red-400/80" onClick={() => { signOut(auth); setIsOpen(false); }}>
                  <LogOut size={14} /> Sair
                </button>
              ) : (
                <button className="dropdown-item text-white" onClick={() => { if(onGoogleLogin) onGoogleLogin(); else signInWithPopup(auth, googleProvider); setIsOpen(false); }}>
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
});

const OrdersModal = memo(({ isOpen, onClose, user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isOpen) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="sidebar-overlay" style={{ zIndex: 6000 }} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl max-h-[80vh] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl z-[6001] overflow-hidden flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl luxury-text gold-gradient-text">Meus Pedidos</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar-thin">
              {loading ? (
                <div className="flex justify-center py-20"><div className="h-8 w-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 opacity-30 uppercase tracking-widest text-xs">Nenhum pedido realizado ainda</div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] text-muted uppercase tracking-widest mb-1">ID: {order.id.slice(0, 8)}</p>
                          <p className="text-xs text-white/60">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-widest ${order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                          {order.status === 'pending' ? 'Pendente' : 'Concluído'}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs font-light">
                            <span>{item.quantity}x {item.name} ({item.selectedVolume || '100ml'})</span>
                            <span>R$ {((item.price * (item.selectedVolume === '50ml' ? 0.7 : item.selectedVolume === '200ml' ? 1.7 : 1)) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-xs uppercase tracking-widest text-muted">Total</span>
                        <span className="text-lg luxury-text">R$ {order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

const HeroSplit = memo(({ onSelectGender }) => {
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
            <h2 className="text-6xl luxury-text mb-8 md:text-7xl lg:text-8xl gold-gradient-text">Masculino</h2>
            <button className="btn-luxury">Explorar</button>
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
            <h2 className="text-6xl luxury-text mb-8 md:text-7xl lg:text-8xl gold-gradient-text">Feminino</h2>
            <button className="btn-luxury">Explorar</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

const Testimonials = memo(() => {
  const reviews = [
    { name: "Larissa M.", text: "A curadoria é impecável. O perfume Oud Supremo é simplesmente divino!", rating: 5 },
    { name: "Ricardo S.", text: "Entrega rápida e embalagem de luxo. A PR realmente sabe o que faz.", rating: 5 },
    { name: "Mariana F.", text: "Fragrâncias exclusivas que não encontro em nenhum outro lugar. Recomendo!", rating: 5 }
  ];

  return (
    <section className="py-24 border-t border-white/5 bg-black/20">
      <div className="container">
        <div className="text-center mb-16">
          <h4 className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Depoimentos</h4>
          <h2 className="text-5xl luxury-text gold-gradient-text">O que dizem nossos clientes</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="premium-glass p-8 hover:bg-white/5 transition-all group"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(r.rating)].map((_, i) => <Sparkles key={i} size={12} className="text-gold" />)}
              </div>
              <p className="text-muted italic mb-6 leading-relaxed">"{r.text}"</p>
              <h5 className="text-[10px] uppercase tracking-widest text-white/50">{r.name}</h5>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

const CatalogFilters = memo(({ activeClass, onSetClass, selectedGender, onSetGender }) => {
  const classes = ["Todos", "Aquático", "Noturno", "Balada", "Trabalho", "Favoritos"];
  const genders = ["Todos", "Masculino", "Feminino", "Unissex"];

  return (
    <div className="catalog-filters-container container flex flex-col gap-6 items-center mb-10">
      {/* Filtro de Gênero */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted w-full text-center mb-2 block font-bold">Filtrar por Gênero</span>
        {genders.map(g => (
          <button 
            key={g} 
            className={`filter-btn ${selectedGender === g ? 'active' : ''}`}
            onClick={() => onSetGender(g)}
            style={{ 
              background: selectedGender === g ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: '1px solid var(--border)',
              padding: '0.4rem 1.2rem',
              color: selectedGender === g ? '#fff' : 'var(--muted)',
              cursor: 'pointer',
              borderRadius: '20px',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              letterSpacing: '1px',
              transition: 'all 0.3s'
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Filtro de Classe */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted w-full text-center mb-2 block font-bold">Fragrância de Preferência</span>
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
});

const Header = memo(({ user, searchQuery, onSearch, cartCount, onOpenCart, wishlistCount, onSetClass, onGoogleLogin }) => {
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
      className={`fixed top-0 left-0 right-0 z-[1000] px-6 py-4 transition-all duration-500 ${isScrolled ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5 saturate-[1.8]' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center h-10 md:h-14 relative">
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-bold">
          <div className="header-logo-container cursor-pointer p-2 hover:scale-105 transition-all">
            <img src="/logo_pr.jpg" alt="PR" className="h-10 md:h-16 w-auto brightness-110 rounded-lg shadow-2xl logo-glow" />
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
});

const CartModal = memo(({ isOpen, onClose, cart, updateQuantity, removeFromCart, updateCartItem, user }) => {
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [address, setAddress] = useState({ 
    cep: '', street: '', district: '', city: '', state: '', number: '', 
    firstName: '', lastName: '', cpf: '', birthDate: '', phone: ''
  });
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [loadingCep, setLoadingCep] = useState(false);

  const subtotal = useMemo(() => cart.reduce((acc, item) => {
    const volumeMultiplier = item.selectedVolume === '50ml' ? 0.7 : item.selectedVolume === '200ml' ? 1.7 : 1;
    return acc + (item.price * volumeMultiplier * item.quantity);
  }, 0), [cart]);

  const total = useMemo(() => subtotal + shipping - appliedDiscount, [subtotal, shipping, appliedDiscount]);

  const handleCepChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setAddress({ ...address, cep: val });
    
    if (val.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch('https://viacep.com.br/ws/' + val + '/json/');
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
    } else {
      alert('Cupom inválido.');
      setAppliedDiscount(0);
    }
  };

  const handleCheckout = async () => {
    if (step === 'cart') {
      setStep('checkout');
      return;
    }

    if (!address.cep || !address.street || !address.number || !address.firstName || !address.cpf || !address.phone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const itemsList = cart.map(i => `- ${i.name} (${i.selectedVolume || '100ml'}) (x${i.quantity})`).join('%0A');
    const deliveryInfo = `%0A*CLIENTE:* ${address.firstName} ${address.lastName}%0A*CPF:* ${address.cpf}%0A*DATA NASC:* ${address.birthDate}%0A*CONTATO:* ${address.phone}%0A*ENDEREÇO:* ${address.street}, ${address.number}%0A${address.city}/${address.state}`;
    const moneyInfo = `%0A*TOTAL:* R$ ${total.toFixed(2)}`;
    const message = `*PEDIDO PR PERFUMARIA*%0A%0A*ITENS:*%0A${itemsList}${deliveryInfo}${moneyInfo}`;
    
    // Salvar pedido no Firestore se o usuário estiver logado
    if (user) {
      try {
        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          userEmail: user.email,
          items: cart,
          address: address,
          subtotal: subtotal,
          shipping: shipping,
          discount: appliedDiscount,
          total: total,
          status: 'pending',
          createdAt: Timestamp.now()
        });
      } catch (error) {
        console.error("Erro ao salvar pedido no Firestore:", error);
      }
    }

    window.open(`https://wa.me/5515996966772?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="sidebar-overlay" style={{ zIndex: 5000 }} />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
            className="cart-drawer-shein" 
            style={{ 
              position: 'fixed', top: 0, right: 0, height: '100vh', width: '100%', maxWidth: '500px',
              background: '#0a0a0a', zIndex: 5001, display: 'flex', flexDirection: 'column',
              boxShadow: '-10px 0 50px rgba(0,0,0,0.5)', borderLeft: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            {/* Header Estilo SHEIN: Limpo e Direto */}
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                 {step === 'checkout' && <button onClick={() => setStep('cart')} className="hover:opacity-50"><ChevronLeft size={20}/></button>}
                 <h3 className="text-lg uppercase tracking-widest font-bold">Carrinho ({cart.length})</h3>
              </div>
              <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar-thin">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-20">
                  <ShoppingBag size={48} className="mb-4" />
                  <p className="uppercase tracking-widest text-[10px] font-bold">Seu carrinho está vazio</p>
                </div>
              ) : step === 'cart' ? (
                <div className="space-y-4">
                  {cart.map(item => {
                    const currentVol = item.selectedVolume || '100ml';
                    const priceWithVol = item.price * (currentVol === '50ml' ? 0.7 : currentVol === '200ml' ? 1.7 : 1);
                    return (
                      <div key={item.id} className="flex gap-4 bg-white/[0.02] p-4 rounded-xl relative group">
                        <div className="w-20 h-28 rounded-lg overflow-hidden shrink-0 border border-white/10">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                             <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold uppercase tracking-wide truncate pr-6">{item.name}</h4>
                                <button onClick={() => removeFromCart(item.id)} className="text-white/20 hover:text-white"><Trash2 size={16}/></button>
                             </div>
                             <div className="flex gap-2 mt-1">
                                <span className="text-[9px] uppercase tracking-widest text-white/40">{item.gender}</span>
                                <span className="text-[9px] uppercase tracking-widest text-white/40">{item.class}</span>
                             </div>
                          </div>
                          
                          <div className="flex justify-between items-end">
                             <div className="space-y-2">
                                <div className="flex gap-1">
                                   {['50ml', '100ml', '200ml'].map(v => (
                                     <button key={v} onClick={() => updateCartItem(item.id, { selectedVolume: v })} className={`text-[8px] px-2 py-1 rounded border ${currentVol === v ? 'border-white bg-white text-black' : 'border-white/10 text-white/40 hover:border-white/30'}`}>{v}</button>
                                   ))}
                                </div>
                                <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-1 w-fit">
                                   <button onClick={() => updateQuantity(item.id, -1)} className="text-white/40 hover:text-white"><Minus size={12}/></button>
                                   <span className="text-xs font-bold min-w-[15px] text-center">{item.quantity}</span>
                                   <button onClick={() => updateQuantity(item.id, 1)} className="text-white/40 hover:text-white"><Plus size={12}/></button>
                                </div>
                             </div>
                             <span className="text-base font-bold">R$ {(priceWithVol * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-6 p-2">
                   <h4 className="text-[10px] tracking-[0.2em] font-bold uppercase text-white/40 mb-6 border-b border-white/5 pb-2">Dados de Entrega / Cliente</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Nome" value={address.firstName} onChange={(e) => setAddress({...address, firstName: e.target.value})} className="bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-white/30 rounded-lg" />
                      <input type="text" placeholder="Sobrenome" value={address.lastName} onChange={(e) => setAddress({...address, lastName: e.target.value})} className="bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-white/30 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <input type="text" placeholder="CPF" value={address.cpf} onChange={(e) => setAddress({...address, cpf: e.target.value})} className="bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-white/30 rounded-lg" />
                       <input type="text" placeholder="Contato" value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} className="bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-white/30 rounded-lg" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[8px] uppercase tracking-widest text-white/20 ml-2">Data de Nascimento</label>
                       <input type="date" value={address.birthDate} onChange={(e) => setAddress({...address, birthDate: e.target.value})} className="w-full bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-white/30 rounded-lg" />
                    </div>
                   <input type="text" placeholder="CEP" value={address.cep} onChange={handleCepChange} maxLength="8" className="w-full bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-white/30 rounded-lg" />
                   <div className="flex gap-4">
                      <input type="text" placeholder="Rua" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} className="flex-[3] bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-white/30 rounded-lg" />
                      <input type="text" placeholder="Nº" value={address.number} onChange={(e) => setAddress({...address, number: e.target.value})} className="flex-1 bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-white/30 rounded-lg" />
                   </div>
                   <input type="text" placeholder="Cidade / Estado" value={address.state ? `${address.city} - ${address.state}` : address.city} readOnly className="w-full bg-white/5 border border-white/10 p-3 text-xs outline-none opacity-40 rounded-lg" />
                </div>
              )}
            </div>

            {/* Footer Fixo Estilo SHEIN */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-black/60 backdrop-blur-xl">
                <div className="space-y-2 mb-6">
                   <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest font-bold">
                      {address.firstName && (
                        <div className="flex justify-between text-[10px] text-white/60 uppercase tracking-widest font-bold">
                           <span>Cliente</span>
                           <span>{address.firstName} {address.lastName}</span>
                        </div>
                      )}
                      <span>Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                   </div>
                   {shipping > 0 && (
                     <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest font-bold">
                        <span>Frete</span>
                        <span>R$ {shipping.toFixed(2)}</span>
                     </div>
                   )}
                   <div className="flex justify-between text-base font-black pt-2 border-t border-white/5">
                      <span>Total estimado</span>
                      <span className="text-xl">R$ {total.toFixed(2)}</span>
                   </div>
                </div>
                
                <div className="flex gap-2 mb-4">
                   <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Código de desconto" className="flex-1 bg-white/5 border border-white/10 px-4 py-2 text-[10px] outline-none rounded-lg" />
                   <button onClick={applyCoupon} className="px-5 bg-white/10 text-white text-[10px] font-bold rounded-lg hover:bg-white/20 transition-all">OK</button>
                </div>

                <button onClick={handleCheckout} className="w-full bg-white text-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-black hover:bg-white/90 transition-all flex items-center justify-center gap-2 group">
                  {step === 'cart' ? 'Finalizar Compra' : 'Confirmar Pedido'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[8px] text-white/20 text-center mt-4 uppercase tracking-widest font-bold">Compra Segura • Envio para todo o Brasil</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

const SparkleEffect = memo(() => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );
});

const QuickViewModal = memo(({ perfume, onClose, onAddToCart }) => {
  if (!perfume) return null;
  
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 z-[3000] backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-0 m-auto w-[95vw] md:w-[70vw] max-w-5xl h-[85vh] bg-[#050505] z-[3001] rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex flex-col md:flex-row group premium-glass"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white z-10 transition-colors bg-white/5 p-2 rounded-full"
        >
          <X size={24} />
        </button>
        
        <div className="md:w-1/2 h-[40vh] md:h-full relative overflow-hidden bg-black flex items-center justify-center p-8">
          <SparkleEffect />
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={perfume.image || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800"} 
            alt={perfume.name} 
            className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform duration-1000"
          />
        </div>
        
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col bg-gradient-to-br from-[#0a0a0a] to-black overflow-y-auto">
          <div className="flex flex-col h-full"> 
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold px-2 py-0.5 border border-white/10 rounded-sm">{perfume.gender}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold px-2 py-0.5 border border-white/10 rounded-sm">0{perfume.id}</span>
              </div>
              <h3 className="text-4xl md:text-5xl luxury-text leading-tight gold-gradient-text">{perfume.name}</h3>
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
                className="btn-luxury flex-1 py-4 uppercase text-[10px] tracking-[0.3em] font-bold"
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
});

const PerfumeCard = memo(({ perfume, onAddToCart, onToggleWishlist, isWishlisted, onQuickView }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      className="glass-card product-card group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="card-image-wrap mb-6" style={{ height: '300px', overflow: 'hidden', position: 'relative', borderRadius: '2px', border: '1px solid var(--border)' }}>
        <SparkleEffect />
        <img 
          src={perfume.image || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800"} 
          alt={perfume.name} 
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="hover:scale-105"
        />
        {/* ... resto ... */}
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
          className="btn-luxury text-white"
          style={{ flex: 1 }}
        >
          Comprar <ShoppingCart size={14} style={{ marginLeft: '10px' }} />
        </button>
        <button 
          onClick={() => onQuickView(perfume)}
          className="btn-secondary px-4 transition-all hover:bg-gold hover:text-black"
          title="Visualização Rápida"
        >
          <Sparkles size={14} />
        </button>
      </div>
    </motion.div>
  );
});

export default function App() {
  const [user, setUser] = useState(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
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
      const result = await signInWithPopup(auth, googleProvider);
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          cart: [],
          wishlist: [],
          createdAt: Timestamp.now()
        });
      }
      
      showToast(`Bem-vindo, ${result.user.displayName}!`);
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
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sincronização em tempo real do carrinho e favoritos
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribeData = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                if (data.cart) setCart(data.cart);
                if (data.wishlist) setWishlist(data.wishlist);
            } else {
                // Criar documento inicial se não existir
                setDoc(userDocRef, {
                  email: currentUser.email,
                  displayName: currentUser.displayName,
                  photoURL: currentUser.photoURL,
                  cart: [],
                  wishlist: [],
                  createdAt: Timestamp.now()
                });
            }
        });
        return () => unsubscribeData();
      } else {
        setCart([]);
        setWishlist([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeClass, searchQuery, selectedGender]);

  const [toast, setToast] = useState({ visible: false, message: '' });

  const toggleWishlist = async (id) => {
    const isAdding = !wishlist.includes(id);
    const newWishlist = isAdding ? [...wishlist, id] : wishlist.filter(wId => wId !== id);
    
    setWishlist(newWishlist);
    showToast(isAdding ? "Adicionado aos Favoritos" : "Removido dos Favoritos");

    if (user) {
        try {
            await setDoc(doc(db, 'users', user.uid), { wishlist: newWishlist }, { merge: true });
        } catch (err) {
            console.error("Erro ao sincronizar favoritos:", err);
        }
    }
  };

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const addToCart = async (perfume) => {
    let newCart;
    const existing = cart.find(i => i.id === perfume.id);
    if (existing) {
        newCart = cart.map(i => i.id === perfume.id ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
        newCart = [...cart, { ...perfume, quantity: 1, selectedVolume: '100ml' }];
    }
    
    setCart(newCart);
    showToast(`${perfume.name} adicionado ao carrinho`);

    if (user) {
        try {
            await setDoc(doc(db, 'users', user.uid), { cart: newCart }, { merge: true });
        } catch (err) {
            console.error("Erro ao sincronizar carrinho:", err);
        }
    }
  };

  const updateQuantity = async (id, delta) => {
    const newCart = cart.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    });

    setCart(newCart);
    if (user) {
        try {
            await setDoc(doc(db, 'users', user.uid), { cart: newCart }, { merge: true });
        } catch (err) {
            console.error("Erro ao sincronizar quantidade:", err);
        }
    }
  };

  const removeFromCart = async (id) => {
    const newCart = cart.filter(i => i.id !== id);
    setCart(newCart);
    if (user) {
        try {
            await setDoc(doc(db, 'users', user.uid), { cart: newCart }, { merge: true });
        } catch (err) {
            console.error("Erro ao remover do carrinho:", err);
        }
    }
  };

  const updateCartItem = async (id, updates) => {
    const newCart = cart.map(i => i.id === id ? { ...i, ...updates } : i);
    setCart(newCart);
    if (user) {
        try {
            await setDoc(doc(db, 'users', user.uid), { cart: newCart }, { merge: true });
        } catch (err) {
            console.error("Erro ao atualizar item do carrinho:", err);
        }
    }
  };

  const filteredPerfumes = useMemo(() => {
    return perfumes.filter(p => {
      const matchesSearch = (p.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) || 
                           (p.ingredients || []).some(ing => ing.toLowerCase().includes((searchQuery || '').toLowerCase()));
      
      const matchesClass = activeClass === 'Todos' || 
                           (activeClass === 'Favoritos' ? wishlist.includes(p.id) : p.class === activeClass);

      const matchesGender = selectedGender === 'Todos' || p.gender === selectedGender;

      return matchesSearch && matchesClass && matchesGender;
    });
  }, [searchQuery, activeClass, selectedGender, wishlist]);

  const totalPages = Math.ceil(filteredPerfumes.length / PER_PAGE);
  
  const paginatedPerfumes = useMemo(() => {
    return filteredPerfumes.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  }, [filteredPerfumes, currentPage]);

  const selectGender = (gender) => {
    setSelectedGender(gender);
    setActiveClass('Todos');
    const catalogElement = document.getElementById('colecao');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white relative">
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
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        updateCartItem={updateCartItem}
        user={user}
      />

      <OrdersModal 
        isOpen={isOrdersOpen} 
        onClose={() => setIsOrdersOpen(false)} 
        user={user}
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
                  <h4 className="text-xs uppercase tracking-widest text-gold" style={{ marginBottom: '1rem' }}>Coleção de Luxo</h4>
                  <h2 className="text-7xl luxury-text gold-gradient-text" style={{ marginBottom: '2rem' }}>Oud Supremo</h2>
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
                    className="btn-luxury" 
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
                  <CatalogTitleIcon />
                  <h2 className="text-6xl luxury-text" style={{ marginBottom: '1rem' }}>Coleção</h2>
                  <p className="text-muted text-xs tracking-widest uppercase">
                    {searchQuery ? `Resultados para "${searchQuery}"` : wishlist.length > 0 && activeClass === 'Favoritos' ? 'Sua Seleção Exclusiva' : 'Fragrâncias de Nicho Selecionadas'}
                  </p>
                </div>
              </div>

              <CatalogFilters 
                activeClass={activeClass}
                onSetClass={setActiveClass}
                selectedGender={selectedGender}
                onSetGender={setSelectedGender}
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


            <Testimonials />

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
                  <span style={{ color: '#0070f3' }}>O</span><span style={{ color: 'white' }}>rquestra.cs</span>
                </div>
                <div className="flex flex-col gap-2 md:items-end text-muted hover:text-white transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageCircle size={16} className="text-blue-500" />
                    <a href="https://wa.me/5515998478705" target="_blank" rel="noopener noreferrer" className="text-sm tracking-widest no-underline text-inherit">
                      +55 15 99847-8705
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-blue-500" />
                    <a href="mailto:orquestracs@gmail.com" className="text-sm tracking-widest no-underline text-inherit uppercase">
                      orquestracs@gmail.com
                    </a>
                  </div>
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
                <span style={{ color: '#0070f3' }}>O</span>RQUESTRA.CS
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
