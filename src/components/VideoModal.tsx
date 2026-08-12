import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Modal de vídeo em tela cheia — o vídeo toca DENTRO do site, centralizado e
 * grande, em vez de mandar o visitante embora pro YouTube.
 *
 * Decisões que valem registrar:
 *
 * • **Portal pro `document.body`**: o conteúdo do site vive dentro do
 *   `#smooth-content`, que o ScrollSmoother move com `transform`. Qualquer
 *   `position: fixed` lá dentro passa a se posicionar em relação a esse
 *   ancestral transformado, não à janela — mesmo motivo pelo qual o menu
 *   mobile e a barra fixa do NavBar já usam portal.
 *
 * • **O iframe só existe enquanto o modal está aberto**. Montar o embed do
 *   YouTube junto com a página custaria requisições e cookies de terceiro em
 *   TODA visita, mesmo pra quem nunca clica em assistir — peso e privacidade
 *   à toa. Fechar o modal desmonta o iframe, o que também para o vídeo (não
 *   precisa de API do player pra isso).
 *
 * • **`youtube-nocookie.com`**: mesma reprodução, sem cookie de rastreamento
 *   até o play. Detalhe pequeno que evita conversa desnecessária sobre LGPD.
 */

/** Aceita o link normal do YouTube (`watch?v=`, `youtu.be/` ou já o embed) e
 * devolve só o id — assim a constante do projeto pode ficar no formato que o
 * cliente manda, sem ninguém precisar converter na mão. */
export function youtubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

interface VideoModalProps {
  aberto: boolean;
  onFechar: () => void;
  /** Link do YouTube (formato normal, o mesmo que o cliente envia) */
  url: string;
  /** Usado no `title` do iframe — importante pra leitor de tela */
  titulo?: string;
}

export default function VideoModal({ aberto, onFechar, url, titulo = 'Vídeo' }: VideoModalProps) {
  /* Esc fecha. O listener só existe enquanto o modal está aberto, pra não
   * ficar um handler global escutando a página inteira à toa. */
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onFechar(); };
    document.addEventListener('keydown', onKey);
    /* Trava a rolagem do fundo enquanto o vídeo está aberto — sem isso a
     * página continua correndo atrás do modal quando o usuário rola. */
    const overflowAntes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflowAntes;
    };
  }, [aberto, onFechar]);

  if (!aberto) return null;

  const id = youtubeId(url);

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
    >
      {/* Fundo escurecido — clicar fora fecha */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(6,9,25,0.92)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        onClick={onFechar}
      />

      <button
        onClick={onFechar}
        aria-label="Fechar vídeo"
        className="absolute top-5 right-5 sm:top-8 sm:right-8 flex items-center justify-center rounded-full transition-colors"
        style={{ width: 46, height: 46, background: 'rgba(255,255,255,0.12)', color: '#fff' }}
      >
        <X size={22} strokeWidth={2} />
      </button>

      {/* 16/9 limitado pela largura E pela altura da tela: `max-h-[80vh]` +
          `aspect-video` garante que o vídeo caiba inteiro mesmo em janela
          baixa (notebook), sem cortar nem gerar rolagem. */}
      <div className="relative w-full max-w-[1200px] aspect-video max-h-[80vh] overflow-hidden rounded-[14px]" style={{ background: '#000' }}>
        {id ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={titulo}
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          /* Link inválido não pode virar tela preta silenciosa — mostra o
             motivo e oferece o link cru como saída. */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
            <p style={{ fontFamily: 'Inter', fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>
              Não foi possível carregar o vídeo.
            </p>
            <a href={url} target="_blank" rel="noreferrer" style={{ fontFamily: 'Inter', fontSize: 14, color: '#d2e718', textDecoration: 'underline' }}>
              Abrir no YouTube
            </a>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
