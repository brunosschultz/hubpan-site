import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import HubButton from './HubButton';

const LINKS = ['Início', 'O HUB PAN', 'PROINTER', 'GovIA', 'Fórum Mundial IA', 'Insights'];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Barra utilitária — h50, glass */}
      <div
        className="absolute top-0 left-0 right-0 z-20 h-[50px] flex items-center justify-end gutter gap-5"
        style={{ backdropFilter: 'blur(26.5px)', WebkitBackdropFilter: 'blur(26.5px)', background: 'rgba(21,40,82,0.20)' }}
      >
        <div className="hidden md:flex items-center gap-4 text-[12px] text-white font-normal">
          <span>GLOSSÁRIO</span>
          <span className="w-px h-[15px] bg-white/30" />
          <span>IMPRENSA</span>
          <span className="w-px h-[15px] bg-white/30" />
          <span>CASOS DE USO</span>
        </div>
        <div className="flex gap-2 ml-2">
          <span className="text-[14px] leading-none">🇧🇷</span>
          <span className="text-[14px] leading-none">🇺🇸</span>
          <span className="text-[14px] leading-none">🇪🇸</span>
        </div>
      </div>

      {/* Nav principal — top 83px */}
      <nav className="absolute top-[70px] lg:top-[83px] left-0 right-0 z-20 flex items-center gutter">
        <a href="#" className="flex-shrink-0 mr-8 xl:mr-[127px]">
          <img src="/images/logo-hubpan.png" alt="HUB PAN" className="w-[90px] h-[88px] lg:w-[117px] lg:h-[114px] object-contain" />
        </a>

        {/* Links desktop */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-[73px]">
          {LINKS.map((l) => (
            <a key={l} href="#" className="text-white text-[14px] font-medium whitespace-nowrap hover:text-lime transition-colors">
              {l}
            </a>
          ))}
        </div>

        {/* Botões desktop */}
        <div className="hidden lg:flex gap-3 ml-auto items-center">
          <HubButton size="xs" variant="cyan">ACESSAR PORTAL</HubButton>
          <HubButton size="xs" variant="navy" withIcon={false}>CONECTE-SE</HubButton>
        </div>

        {/* Hamburger mobile */}
        <button className="lg:hidden ml-auto text-white p-2" onClick={() => setOpen(true)} aria-label="Abrir menu">
          <Menu size={26} />
        </button>
      </nav>

      {/* Menu mobile (Sheet) */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-navy flex flex-col p-8">
            <div className="flex items-center justify-between mb-10">
              <img src="/images/logo-hubpan-white.png" alt="HUB PAN" className="h-[60px] object-contain" />
              <button onClick={() => setOpen(false)} className="text-white p-1" aria-label="Fechar menu">
                <X size={26} />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {LINKS.map((l) => (
                <a key={l} href="#" className="text-white text-[18px] font-medium" onClick={() => setOpen(false)}>
                  {l}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3 mt-auto">
              <HubButton size="sm" variant="cyan">ACESSAR PORTAL</HubButton>
              <HubButton size="sm" variant="navy" withIcon={false}>CONECTE-SE</HubButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
