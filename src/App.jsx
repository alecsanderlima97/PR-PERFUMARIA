import { useState } from 'react';
import {
  Check,
  ChevronRight,
  Instagram,
  Menu,
  MessageCircle,
  Play,
  Sparkles,
  X,
} from 'lucide-react';
import './index.css';

const WHATSAPP = '5515996966772';

const perfumes = [
  {
    name: 'Invictus',
    brand: 'Rabanne',
    family: 'Amadeirado fresco',
    mood: 'Energia · frescor · presença',
    image: '/perfumes-real/invictus.avif',
    source: 'Imagem oficial Rabanne',
    className: 'product-card--silver',
  },
  {
    name: 'Good Girl',
    brand: 'Carolina Herrera',
    family: 'Floral ambarado',
    mood: 'Elegância · intensidade · contraste',
    image: '/perfumes-real/good-girl.avif',
    source: 'Imagem oficial Carolina Herrera',
    className: 'product-card--blue',
  },
  {
    name: 'Libre',
    brand: 'Yves Saint Laurent',
    family: 'Floral de lavanda',
    mood: 'Liberdade · sofisticação · calor',
    image: '/perfumes-real/libre.webp',
    source: 'Imagem oficial YSL Beauty',
    className: 'product-card--gold',
  },
];

const messageLink = (message) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="PR Perfumaria — início">
      <img src="/logo_pr.jpg" alt="" />
      <span><strong>PR</strong><small>Perfumaria</small></span>
    </a>
  );
}

function WhatsAppCta({ children, message, light = false }) {
  return (
    <a
      className={`cta ${light ? 'cta--light' : ''}`}
      href={messageLink(message)}
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle size={18} aria-hidden="true" />
      {children}
    </a>
  );
}

function IntroExperience({ stage, onStart, onFinish }) {
  if (stage === 'site') return null;

  return (
    <section className={`intro-screen intro-screen--${stage}`} aria-label="Abertura da PR Perfumaria">
      {stage === 'gate' ? (
        <button className="intro-screen__gate" type="button" onClick={onStart}>
          <span className="intro-screen__halo" aria-hidden="true" />
          <img src="/logo_pr.jpg" alt="PR Perfumaria" />
          <span className="intro-screen__brand"><strong>PR</strong><small>PERFUMARIA</small></span>
          <span className="intro-screen__action"><Play size={15} fill="currentColor" aria-hidden="true" /> Entrar na experiência</span>
        </button>
      ) : (
        <div className="intro-screen__video">
          <video
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={onFinish}
            onError={onFinish}
            aria-label="Filme de abertura da PR Perfumaria"
          >
            <source src="/video/pr-intro.mp4" type="video/mp4" />
          </video>
          <div className="intro-screen__shade" aria-hidden="true" />
          <button className="intro-screen__skip" type="button" onClick={onFinish}>Entrar no site</button>
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [introStage, setIntroStage] = useState('gate');
  const mainMessage = 'Olá! Vim pelo site da PR Perfumaria e quero ajuda para encontrar um perfume que combine comigo.';

  const startIntro = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntroStage('site');
      return;
    }
    setIntroStage('playing');
  };

  return (
    <>
    <div className={`page ${introStage === 'site' ? 'page--entered' : 'page--locked'}`} aria-hidden={introStage !== 'site'}>
      <header className="header">
        <div className="header__inner">
          <Brand />
          <nav className={`nav ${menuOpen ? 'nav--open' : ''}`} aria-label="Navegação principal">
            <a href="#curadoria" onClick={() => setMenuOpen(false)}>A curadoria</a>
            <a href="#destaques" onClick={() => setMenuOpen(false)}>Destaques</a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</a>
            <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
          </nav>
          <a className="header__contact" href={messageLink(mainMessage)} target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> Falar com a PR
          </a>
          <button
            className="menu"
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="fog" aria-hidden="true">
            <span className="fog__veil fog__veil--one" />
            <span className="fog__veil fog__veil--two" />
            <span className="fog__veil fog__veil--three" />
          </div>
          <div className="hero__copy">
            <p className="eyebrow"><span /> Curadoria de perfumes · Atendimento pessoal</p>
            <h1>
              Um perfume não é só uma fragrância.
              <em> É como você escolhe ser lembrado.</em>
            </h1>
            <p className="hero__lead">
              Conte seu estilo, a ocasião e o que você gosta. A PR ajuda a encontrar opções que façam sentido para você — direto pelo WhatsApp.
            </p>
            <div className="hero__actions">
              <WhatsAppCta message={mainMessage}>Quero uma indicação</WhatsAppCta>
              <a className="quiet-link" href="#destaques">Ver perfumes em destaque</a>
            </div>
            <div className="assurances">
              <span><Check size={15} /> Sugestões pelo seu perfil</span>
              <span><Check size={15} /> Disponibilidade sob consulta</span>
              <span><Check size={15} /> Atendimento pelo WhatsApp</span>
            </div>
          </div>

          <div className="hero__showcase" aria-label="Perfumes em destaque">
            <div className="hero__glow" />
            <div className="hero-product hero-product--back">
              <img src="/perfumes-real/invictus.avif" alt="Invictus, da Rabanne" />
              <small>Invictus</small>
            </div>
            <div className="hero-product hero-product--front">
              <img src="/perfumes-real/good-girl.avif" alt="Good Girl, da Carolina Herrera" />
              <small>Good Girl</small>
            </div>
            <div className="hero-product hero-product--side">
              <img src="/perfumes-real/libre.webp" alt="Libre, de Yves Saint Laurent" />
              <small>Libre</small>
            </div>
            <div className="hero__note">
              <Sparkles size={18} />
              <span><small>Uma seleção real</small><strong>Escolhida para começar a conversa</strong></span>
            </div>
          </div>
        </section>

        <section className="statement section" id="curadoria">
          <p className="section-label">01 · Uma nova forma de escolher</p>
          <div className="statement__grid">
            <h2>O catálogo pode ser enorme. <em>Sua escolha não precisa ser.</em></h2>
            <div>
              <p>Em vez de jogar centenas de opções na tela, a PR começa entendendo você: rotina, referências, ocasião e personalidade.</p>
              <p>O site inspira. A conversa transforma essa inspiração em indicações mais certeiras.</p>
            </div>
          </div>
        </section>

        <section className="featured section" id="destaques">
          <div className="section-heading">
            <div>
              <p className="section-label">02 · Perfumes em destaque</p>
              <h2>Fragrâncias reais.<br /><em>Atendimento próximo.</em></h2>
            </div>
            <p>Uma pequena vitrine para despertar o interesse. O catálogo completo e a disponibilidade são consultados diretamente com a PR.</p>
          </div>

          <div className="products">
            {perfumes.map((perfume, index) => (
              <article className={`product-card ${perfume.className}`} key={perfume.name}>
                <div className="product-card__visual">
                  <span className="product-card__number">0{index + 1}</span>
                  <img src={perfume.image} alt={`${perfume.name}, da ${perfume.brand}`} />
                  <small>{perfume.source}</small>
                </div>
                <div className="product-card__copy">
                  <p>{perfume.brand}</p>
                  <h3>{perfume.name}</h3>
                  <span>{perfume.family}</span>
                  <small>{perfume.mood}</small>
                  <a
                    href={messageLink(`Olá! Vim pelo site da PR Perfumaria e gostaria de consultar o ${perfume.name}, da ${perfume.brand}.`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Consultar disponibilidade <ChevronRight size={17} />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="legal-note">Marcas e imagens pertencem aos seus respectivos titulares. A PR Perfumaria não declara estoque permanente; confirme a disponibilidade no atendimento.</p>
        </section>

        <section className="process" id="como-funciona">
          <div className="process__inner">
            <div className="process__intro">
              <p className="section-label">03 · Como funciona</p>
              <h2>Da dúvida à indicação, <em>em uma conversa.</em></h2>
              <p>Sem cadastro, sem carrinho e sem páginas infinitas.</p>
            </div>
            <ol>
              <li><span>01</span><div><h3>Conte o que procura</h3><p>Fale da ocasião, do seu estilo ou de perfumes que já gostou.</p></div></li>
              <li><span>02</span><div><h3>Receba sugestões</h3><p>A PR apresenta possibilidades alinhadas ao seu perfil e confirma a disponibilidade.</p></div></li>
              <li><span>03</span><div><h3>Escolha com mais clareza</h3><p>Tire suas dúvidas diretamente no WhatsApp antes de decidir.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="contact section" id="contato">
          <div className="contact__products" aria-hidden="true">
            <img src="/perfumes-real/libre.webp" alt="" />
            <img src="/perfumes-real/invictus.avif" alt="" />
          </div>
          <div className="contact__copy">
            <p className="eyebrow"><span /> Sua fragrância pode começar aqui</p>
            <h2>Não sabe o nome do perfume? <em>Não tem problema.</em></h2>
            <p>Diga como quer se sentir — leve, elegante, marcante ou inesquecível — e deixe a PR ajudar na escolha.</p>
            <WhatsAppCta message={mainMessage} light>Conversar com a PR agora</WhatsAppCta>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__top">
          <Brand />
          <p>Curadoria de perfumes com atendimento próximo e pessoal.</p>
          <div className="socials">
            <a href="https://www.instagram.com/pr__perfumaria/" target="_blank" rel="noreferrer"><Instagram size={18} /> Instagram</a>
            <a href={messageLink(mainMessage)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 PR Perfumaria</span>
          <span>Experiência digital por <strong>Orquestra.cs</strong></span>
        </div>
      </footer>

      <a className="floating" href={messageLink(mainMessage)} target="_blank" rel="noreferrer" aria-label="Conversar com a PR Perfumaria pelo WhatsApp">
        <MessageCircle size={25} />
      </a>
    </div>
    <IntroExperience stage={introStage} onStart={startIntro} onFinish={() => setIntroStage('site')} />
    </>
  );
}
