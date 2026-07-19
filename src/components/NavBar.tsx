import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import HubButton from './HubButton';
import { EImg, ET } from '../editor/fields';

/* Rótulos do menu são editáveis pelo editor visual (chaves nav.*) — como o
   NavBar é compartilhado, a edição vale automaticamente pra todas as páginas. */
const LINKS: { label: string; to: string }[] = [
  { label: 'Início', to: '/' },
  { label: 'O HUB PAN', to: '/o-hub-pan' },
  { label: 'PROINTER', to: '/prointer' },
  { label: 'GovIA', to: '/govia' },
  { label: 'Fórum Mundial IA', to: '/forum-mundial-ia' },
  { label: 'Insights', to: '/insights' },
];

const UTIL_LINKS: { label: string; to: string }[] = [
  { label: 'GLOSSÁRIO', to: '/glossario' },
  { label: 'IMPRENSA', to: '/imprensa' },
  { label: 'CASOS DE USO', to: '/casos-de-uso' },
];

const navKey = (to: string) => `nav.link.${to.replace(/\//g, '') || 'inicio'}`;

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      {/* Barra utilitária — h50, glass */}
      <div
        className="absolute top-0 left-0 right-0 z-20 h-[50px] flex items-center justify-end gutter gap-5"
        style={{ backdropFilter: 'blur(26.5px)', WebkitBackdropFilter: 'blur(26.5px)', background: 'rgba(21,40,82,0.20)' }}
      >
        <div className="hidden md:flex items-center gap-4 text-[12px] text-white font-normal">
          {UTIL_LINKS.map((l, i) => (
            <span key={l.to} className="flex items-center gap-4">
              {i > 0 && <span className="w-px h-[15px] bg-white/30" />}
              <Link to={l.to} className="hover:text-lime transition-colors">
                <ET k={navKey(l.to)} v={l.label} l={`Menu superior — "${l.label}"`} />
              </Link>
            </span>
          ))}
        </div>
        <div className="flex gap-2 ml-2">
          <span className="text-[14px] leading-none">🇧🇷</span>
          <span className="text-[14px] leading-none">🇺🇸</span>
          <span className="text-[14px] leading-none">🇪🇸</span>
        </div>
      </div>

      {/* Nav principal — top 83px */}
      <nav className="absolute top-[70px] lg:top-[83px] left-0 right-0 z-20 flex items-center gutter">
        <Link to="/" className="flex-shrink-0 mr-8 xl:mr-[127px]">
          <EImg
            k="nav.logo" v="/images/logo-hubpan.png"
            l="Logo do site (menu)"
            spec={{ w: 468, h: 456, shape: 'quadrada', fit: 'contain', note: 'Logo principal com fundo transparente (PNG ou SVG).' }}
            alt="HUB PAN"
            className="w-[90px] h-[88px] lg:w-[117px] lg:h-[114px] object-contain"
          />
        </Link>

        {/* Links desktop */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-[73px]">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-[14px] font-medium whitespace-nowrap transition-colors ${
                pathname === l.to ? 'text-lime' : 'text-white hover:text-lime'
              }`}
            >
              <ET k={navKey(l.to)} v={l.label} l={`Menu — "${l.label}"`} />
            </Link>
          ))}
        </div>

        {/* Botões desktop */}
        <div className="hidden lg:flex gap-3 ml-auto items-center">
          <HubButton size="xs" variant="cyan"><ET k="nav.btn1" v="ACESSAR PORTAL" l="Menu — botão Acessar Portal" /></HubButton>
          <Link to="/contato">
            <HubButton size="xs" variant="navy" withIcon={false}><ET k="nav.btn2" v="CONECTE-SE" l="Menu — botão Conecte-se" /></HubButton>
          </Link>
        </div>

        {/* Hamburger mobile */}
        <button className="lg:hidden ml-auto text-white p-2" onClick={() => setOpen(true)} aria-label="Abrir menu">
          <Menu size={26} />
        </button>
      </nav>

      {/* Menu mobile (Sheet) — via portal: fica FORA do #smooth-content, senão o
          transform do ScrollSmoother quebra o position:fixed (vira relativo ao
          ancestral transformado em vez do viewport). */}
      {open && createPortal(
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-navy flex flex-col p-8">
            <div className="flex items-center justify-between mb-10">
              <img src="/images/logo-hubpan-white.png" alt="HUB PAN" className="h-[60px] object-contain" />
              <button onClick={() => setOpen(false)} className="text-white p-1" aria-label="Fechar menu">
                <X size={26} />
              </button>
            </div>
            <div className="flex flex-col gap-7">
              {LINKS.map((l) => (
                <Link key={l.to} to={l.to} className={`text-[18px] font-medium ${pathname === l.to ? 'text-lime' : 'text-white'}`} onClick={() => setOpen(false)}>
                  <ET k={navKey(l.to)} v={l.label} l={`Menu — "${l.label}"`} />
                </Link>
              ))}
              <div className="h-px bg-white/20 my-1" />
              {UTIL_LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="text-[14px] font-medium text-white/70" onClick={() => setOpen(false)}>
                  <ET k={navKey(l.to)} v={l.label} l={`Menu superior — "${l.label}"`} />
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3 mt-auto">
              <HubButton size="sm" variant="cyan"><ET k="nav.btn1" v="ACESSAR PORTAL" l="Menu — botão Acessar Portal" /></HubButton>
              <Link to="/contato" onClick={() => setOpen(false)}>
                <HubButton size="sm" variant="navy" withIcon={false}><ET k="nav.btn2" v="CONECTE-SE" l="Menu — botão Conecte-se" /></HubButton>
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
