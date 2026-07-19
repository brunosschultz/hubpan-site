import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Cartão vertical (retrato) — maior e mais dramático que um cartão de crédito comum. */
const W = 312;
const H = 480;
const RADIUS = 28;

/** Face do cartão em CSS puro (sem canvas) — usada duas vezes, uma por metade,
 * cada instância clipada por um wrapper com overflow:hidden. Leve: nenhum canvas,
 * nenhum sprite, nenhum nó DOM extra por partícula. */
function CardFace() {
  return (
    <div className="absolute inset-0" style={{ width: W, height: H, borderRadius: RADIUS, background: 'linear-gradient(160deg, #152852 0%, #2d4ebf 100%)' }}>
      <div className="absolute" style={{ left: 34, top: 40, width: 50, height: 38, borderRadius: 8, background: 'linear-gradient(135deg, #d2e718 0%, #a8c400 100%)' }} />
      <p className="absolute m-0" style={{ top: 46, right: 32, fontFamily: 'Inter', fontWeight: 700, fontSize: 16, lineHeight: '20px', color: '#fff' }}>HUB</p>
      <p className="absolute m-0" style={{ top: 66, right: 32, fontFamily: 'Inter', fontWeight: 700, fontSize: 16, lineHeight: '20px', color: '#fff' }}>PAN</p>
      {[0, 1, 2, 3].map((i) => (
        <p key={i} className="absolute m-0" style={{ left: 34, top: 228 + i * 38, fontFamily: 'monospace', fontSize: 22, color: 'rgba(255,255,255,0.75)' }}>••••</p>
      ))}
      <p className="absolute m-0" style={{ left: 34, top: H - 59, fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>SEM CARTÃO NECESSÁRIO</p>
    </div>
  );
}

/**
 * Mockup 3D de um cartão vertical que se abre em duas metades ao rolar a seção —
 * corte limpo ao meio, leve (só 2 elementos animados via GSAP, sem canvas nem
 * partículas). Metáfora: "não precisa de cartão de crédito".
 */
export default function CreditCardMock() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !leftRef.current || !rightRef.current) return;

    const section = wrap.closest('section') || wrap;

    // StrictMode roda o effect 2x em dev — mata qualquer ScrollTrigger
    // remanescente deste trigger antes de criar o novo.
    ScrollTrigger.getAll().filter((st) => st.trigger === section).forEach((st) => st.kill());

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 12%',
          end: 'center top',
          scrub: 0.5,
        },
      });
      tl.to(leftRef.current, { x: -34, rotation: -6, opacity: 0, ease: 'none' }, 0);
      tl.to(rightRef.current, { x: 34, rotation: 6, opacity: 0, ease: 'none' }, 0);
      if (shadowRef.current) {
        tl.to(shadowRef.current, { opacity: 0, ease: 'none' }, 0);
      }
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative mx-auto" style={{ width: W, height: H, perspective: 900 }}>
      <div
        ref={shadowRef}
        className="absolute inset-0"
        style={{ borderRadius: RADIUS, boxShadow: '0 30px 60px rgba(21,40,82,0.35)', transform: 'rotateY(-18deg) rotateX(9deg) rotateZ(-2deg)' }}
      />
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-18deg) rotateX(9deg) rotateZ(-2deg)' }}>
        <div ref={leftRef} className="absolute top-0 left-0 overflow-hidden" style={{ width: W / 2, height: H, borderRadius: `${RADIUS}px 0 0 ${RADIUS}px` }}>
          <CardFace />
        </div>
        <div ref={rightRef} className="absolute top-0 overflow-hidden" style={{ left: W / 2, width: W / 2, height: H, borderRadius: `0 ${RADIUS}px ${RADIUS}px 0` }}>
          <div className="absolute inset-0" style={{ left: -(W / 2) }}>
            <CardFace />
          </div>
        </div>
      </div>
    </div>
  );
}
