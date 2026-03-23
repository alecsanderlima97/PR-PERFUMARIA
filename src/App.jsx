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
  Plus
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
        animate={{ opacity: 0.08 }}
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
      audioRef.current.play().catch(e => console.log("Áudio ativo"));
    }
    setIsPlaying(!isPlaying);
  };

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
};

const Header = ({ searchQuery, onSearch, cartCount, onOpenCart }) => (
  <header className="header">
    <div className="flex items-center gap-8">
      <div className="header-logo-container flex flex-col">
        <h1 className="text-xl luxury-text" style={{ fontSize: '1.5rem', lineHeight: '1' }}>PR</h1>
        <span className="text-[9px] tracking-[0.3em] text-muted uppercase">PERFUMARIA</span>
      </div>
    </div>

    <div className="header-search md-flex">
      <Search size={14} className="text-muted" />
      <input 
        type="text" 
        placeholder="Essência, nota ou fragrância..." 
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        className="top-search-input"
      />
    </div>

    <div className="flex gap-6 items-center">
      <nav className="nav-links lg-flex" style={{ marginRight: '1rem' }}>
        <a href="#colecao">Coleção</a>
        <a href="#contato">Contato</a>
      </nav>
      
      <div className="flex gap-4 items-center">
        <button onClick={onOpenCart} className="cart-trigger relative">
          <ShoppingCart size={20} className="text-foreground" />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>
        <MusicPlayer />
      </div>
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

const PerfumeCard = ({ perfume, onAddToCart }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className="glass-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
        <div>
          <span className="text-xs uppercase tracking-widest text-muted" style={{ marginBottom: '0.5rem', display: 'block' }}>{perfume.type}</span>
          <h3 className="text-4xl luxury-text">{perfume.name}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg luxury-text">R$ {perfume.price.toFixed(2)}</span>
          <div className="text-muted" style={{ fontSize: '0.7rem' }}>0{perfume.id}</div>
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
      </div>
    </motion.div>
  );
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);

  const addToCart = (perfume) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === perfume.id);
      if (existing) {
        return prev.map(i => i.id === perfume.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...perfume, quantity: 1 }];
    });
    setIsCartOpen(true);
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
      
      <Header 
        searchQuery={searchQuery} 
        onSearch={setSearchQuery} 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      <main className="container section-py">
        {/* New Centered Hero Section */}
        <section className="hero-centered-section">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <span className="text-xs uppercase tracking-[0.6em] text-muted mb-8">Exclusividade & Requinte</span>
            <h2 className="text-8xl luxury-text mb-12 lg:text-9xl">
              A Essência <br /> <span className="italic">do Indescritível</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mb-12 font-light leading-relaxed">
              O mais alto nível em perfumaria. Fragrâncias de nicho importadas e nacionais selecionadas com rigor. 
              CEO @pablo_riicardo__ ⚜️
            </p>
            
            <div className="flex gap-6 mb-20">
              <a href="#colecao" className="btn-primary px-12">Explorar Coleção</a>
              <a 
                href="https://drive.google.com/file/d/1pWqnM5zKr0jj6VhcOiy-D8HUS7FJzCVC/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-secondary px-8"
              >
                Catálogo PDF
              </a>
            </div>

            {/* Sub-hero image presentation - Moved down and adjusted */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1.5 }}
              className="center-hero-image"
            >
              <img src="/hero.png" alt="Luxury Perfume" className="w-full h-full object-cover grayscale brightness-75" />
              <div className="image-overlay-gradient"></div>
              <div className="image-caption">
                <span className="luxury-text italic text-4xl">Since 2026</span>
              </div>
            </motion.div>
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
                <PerfumeCard key={p.id} perfume={p} onAddToCart={addToCart} />
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
