import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { MapPin, Play, Flag, Check, Images, Building2 } from 'lucide-react';
import PageHero from '../../components/PageHero';
import CTABanner from '../../components/CTABanner';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';
import { BgEditChip, EIcon, EImg, ERich, ET, useEditColor, useEditImage } from '../../editor/fields';

/* ═══════════════════════════════════════════════════════════════════════════
   DADOS DAS EXPOs

   ⚠️ TODO O CONTEÚDO DESTA PÁGINA É TEXTO OFICIAL DO CLIENTE (documento
   enviado pelo Gustavo em 06/08/2026), aplicado praticamente na íntegra —
   títulos, subtítulos, parágrafos, marcos e a linha evolutiva. NÃO
   reescrever "pra ficar melhor": qualquer alteração de conteúdo aqui
   precisa vir de uma nova versão do documento dele.

   Diferenças deliberadas em relação ao documento (as únicas):
   • ® mantido nas marcas (EXPO BH®, EXPO BOSTON®, EXPO NYC®, Brasil
     Master® Group). O documento novo veio sem ®, mas o próprio cliente
     pediu antes que todas as marcas registradas levassem ® e o rodapé do
     site já lista as três assim. Pendente de confirmação dele.
   • Ordem das seções conforme o documento: BH → BOSTON → NYC. Isso INVERTE
     a cronologia que o material anterior do mesmo cliente indicava (NYC
     antes de Boston) e que segue publicada na Home e no institucional —
     divergência conhecida, mantida de propósito até ele responder.
   • Nenhum número de edições ("4 edições", "15 edições") aparece aqui: o
     documento novo não os traz, então foram removidos em vez de mantidos
     por conta própria.

   GALERIA E VÍDEO: o documento diz literalmente "Em atualização" e "Em
   produção" — é esse o estado exibido, sem fotos ou capas de exemplo. Ao
   receber o material real, trocar o bloco vazio pela grade de fotos e ligar
   o player.

   IMAGENS: todas reaproveitadas de `public/images/` (nenhuma inventada), só
   como imagem de abertura de cada EXPO.
   ═══════════════════════════════════════════════════════════════════════ */

type Marco = { id: string; titulo: string };

interface Expo {
  id: string;
  marca: string;
  eyebrow: string;
  local: string;
  /** Frase de abertura da EXPO (primeiro parágrafo do documento). */
  resumo: string;
  /** Demais parágrafos, na ordem do documento. */
  historia: string[];
  /** Organizações citadas nominalmente pelo cliente (só a EXPO BOSTON tem). */
  parceiros?: string[];
  /** Dois dados-chave — ambos extraídos do próprio texto do cliente,
   * nunca estimados. */
  dado1: { rotulo: string; valor: string };
  dado2: { rotulo: string; valor: string };
  marcos: Marco[];
  /** Imagem de abertura da seção. */
  destaque: string;
  bg: string;
  accent: string;
}

const EXPOS: Expo[] = [
  {
    id: 'bh',
    marca: 'EXPO BH®',
    eyebrow: 'O MARCO FUNDADOR',
    local: 'Belo Horizonte · Minas Gerais · Brasil',
    resumo: 'Realizada em Belo Horizonte, a EXPO BH® representa o marco fundador do Fórum Pan-Americano da Inovação.',
    historia: [
      'Concebida para conectar inovação, desenvolvimento sustentável e transformação governamental, tornou-se um ambiente permanente de relacionamento entre governos, universidades, empresas, startups e especialistas dedicados à construção de cidades mais inteligentes, sustentáveis e competitivas.',
      'Ao longo de suas edições, consolidou-se como uma referência nacional na promoção da inovação pública, contribuindo para o fortalecimento do ecossistema govtech brasileiro e para a construção das bases institucionais que possibilitaram a internacionalização do movimento.',
    ],
    dado1: { rotulo: 'Fundação', valor: '2017' },
    dado2: { rotulo: 'Cidade-sede', valor: 'Belo Horizonte' },
    marcos: [
      { id: 'm1', titulo: 'Fundação do Fórum Pan-Americano da Inovação.' },
      { id: 'm2', titulo: 'Realização da EXPO BH®.' },
      { id: 'm3', titulo: 'Consolidação da agenda de inovação pública.' },
      { id: 'm4', titulo: 'Fortalecimento do ecossistema govtech brasileiro.' },
      { id: 'm5', titulo: 'Origem da internacionalização do ecossistema.' },
    ],
    destaque: 'inst-sao-paulo',
    bg: '#ffffff',
    accent: '#2d4ebf',
  },
  {
    id: 'boston',
    marca: 'EXPO BOSTON®',
    eyebrow: 'A CONEXÃO ENTRE AS AMÉRICAS E CAMBRIDGE',
    local: 'Boston · Cambridge · Massachusetts · Estados Unidos',
    resumo: 'A EXPO BOSTON® representa a internacionalização do Fórum Pan-Americano da Inovação junto ao principal ecossistema de inovação do mundo.',
    historia: [
      'Concebida para aproximar governos, universidades, empresas e startups das Américas ao ambiente de inovação de Cambridge, fortaleceu uma rede permanente de cooperação construída no entorno estratégico das universidades Harvard e MIT.',
      'Ao longo dessa trajetória, o ecossistema estabeleceu relações institucionais com importantes organizações internacionais, consolidando uma base de cooperação que hoje sustenta a atuação internacional do HUB PAN.',
      'Foi também nesse ambiente que nasceram as bases institucionais do Fórum Mundial de Inteligência Artificial (WAIF), cuja agenda internacional terá continuidade em Cambridge, Massachusetts, em maio de 2027.',
    ],
    parceiros: ['Microsoft', 'MIPAD', 'Boston City Group', 'EcoVentures', 'Garreta Group', 'Eco2U', 'Tap The Fifth', 'Challinne Corporate Academy'],
    dado1: { rotulo: 'Ecossistema', valor: 'Harvard e MIT' },
    dado2: { rotulo: 'Próxima agenda', valor: 'Maio de 2027' },
    marcos: [
      { id: 'm1', titulo: 'Internacionalização do ecossistema.' },
      { id: 'm2', titulo: 'Consolidação da rede internacional de cooperação.' },
      { id: 'm3', titulo: 'Aproximação com o ecossistema de Cambridge (Harvard e MIT).' },
      { id: 'm4', titulo: 'Lançamento internacional do Fórum Mundial de Inteligência Artificial.' },
      { id: 'm5', titulo: 'Construção da agenda Cambridge 2027.' },
    ],
    destaque: 'forum-hero-mit',
    bg: '#f5f5f5',
    accent: '#2d4ebf',
  },
  {
    id: 'nyc',
    marca: 'EXPO NYC®',
    eyebrow: 'A INOVAÇÃO CONECTADA À AGENDA GLOBAL',
    local: 'Nova York · Estados Unidos',
    resumo: 'A EXPO NYC® consolidou a presença institucional do ecossistema em Nova York, fortalecendo o relacionamento com lideranças empresariais, universidades, startups, investidores e organismos internacionais.',
    historia: [
      'A iniciativa ampliou a presença internacional construída nas Américas e consolidou uma plataforma dedicada ao diálogo sobre inovação, cidades inteligentes, desenvolvimento econômico, sustentabilidade e cooperação internacional.',
      'Sua evolução conduz à realização da EXPO NYC® ONU Edition, fortalecendo a conexão do ecossistema com o sistema das Nações Unidas e ampliando sua projeção internacional.',
    ],
    dado1: { rotulo: 'Cidade-sede', valor: 'Nova York' },
    dado2: { rotulo: 'Próxima etapa', valor: 'ONU Edition' },
    marcos: [
      { id: 'm1', titulo: 'Fundação da EXPO NYC®.' },
      { id: 'm2', titulo: 'Consolidação da presença institucional em Nova York.' },
      { id: 'm3', titulo: 'Fortalecimento da cooperação internacional.' },
      { id: 'm4', titulo: 'Construção da agenda ONU.' },
      { id: 'm5', titulo: 'Preparação da EXPO NYC® ONU Edition.' },
    ],
    destaque: 'inst-hero-onu',
    bg: '#ffffff',
    accent: '#2d4ebf',
  },
];

/** Cards de resumo da abertura — o subtítulo de cada EXPO no documento. */
const RESUMO_CARDS = [
  { id: 'bh', marca: 'EXPO BH®', local: 'Belo Horizonte · Brasil', desc: 'O marco fundador.', img: 'inst-sao-paulo' },
  { id: 'boston', marca: 'EXPO BOSTON®', local: 'Cambridge · Estados Unidos', desc: 'A conexão entre as Américas e Cambridge.', img: 'forum-hero-mit' },
  { id: 'nyc', marca: 'EXPO NYC®', local: 'Nova York · Estados Unidos', desc: 'A inovação conectada à agenda global.', img: 'inst-hero-onu' },
];

/** Linha evolutiva — a sequência exata enviada pelo cliente, do Brasil
 * Master® Group aos Governos Inteligentes. Sem anos: o documento não os
 * traz, e inventar data aqui seria criar fato. */
const EVOLUCAO = [
  { id: 'bmg', titulo: 'Brasil Master® Group' },
  { id: 'forum', titulo: 'Fórum Pan-Americano da Inovação' },
  { id: 'bh', titulo: 'EXPO BH®' },
  { id: 'boston', titulo: 'EXPO BOSTON®' },
  { id: 'nyc', titulo: 'EXPO NYC®' },
  { id: 'hubpan', titulo: 'HUB PAN' },
  { id: 'waif', titulo: 'Fórum Mundial de Inteligência Artificial (WAIF)' },
  { id: 'governos', titulo: 'Governos Inteligentes', destaque: true },
];

/* ═══════════ Peças reutilizadas ═══════════ */

/** Raio dos cards que têm FOTOGRAFIA. Menor que o raio padrão de card do
 * site (20px) de propósito: numa foto pequena, 20px de raio começa a ler
 * como forma arredondada em vez de fotografia retangular. */
const FOTO_RADIUS = 12;

/** Selo neutro de estado — "Em atualização" / "Em produção", exatamente o
 * que o cliente escreveu no documento. Não é um placeholder nosso: é o
 * status oficial do material. */
function SeloEstado({ texto }: { texto: string }) {
  return (
    <span
      className="inline-block rounded-full px-3 py-1 align-middle"
      style={{ background: '#ebebeb', fontFamily: 'Inter', fontWeight: 600, fontSize: 9.5, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#797979' }}
    >
      {texto}
    </span>
  );
}

/** Bloco de registros de uma EXPO: galeria e vídeo, ambos ainda sem
 * material do cliente. Em vez de fotos de exemplo (que sugeriam registros
 * reais que não existem), cada um mostra o próprio estado declarado por
 * ele — "Em atualização" e "Em produção". */
function Registros({ expo }: { expo: Expo }) {
  /* Capa do vídeo via `useEditImage` (fundo CSS) e NÃO `EImg`: aqui o
   * fallback é VAZIO — ainda não existe vídeo, então não existe frame de
   * capa. Um `<img src="">` faz o navegador rebaixar a página inteira de
   * novo (aviso real do React no console); como fundo, "sem imagem"
   * simplesmente não pinta nada e a cor da marca aparece. Mesmo padrão já
   * usado nos heroes "cor OU imagem" do site. */
  const POSTER_SPEC = { w: 1280, h: 720, shape: 'paisagem' as const, note: 'Frame de abertura do vídeo. Enquanto não houver vídeo, o bloco fica só com a cor da marca.' };
  const [poster, posterProps] = useEditImage(`expos.${expo.id}.video.poster`, '', `EXPOs — capa do vídeo (${expo.marca})`, POSTER_SPEC);
  void posterProps; // o clique direto é coberto pelo BgEditChip abaixo
  return (
    <div>
      <p className="mb-7" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#a7a4a4' }} data-animate>
        <ET k={`expos.${expo.id}.registros.titulo`} v="Galeria e vídeo institucional" l={`EXPOs — título dos registros (${expo.marca})`} />
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Galeria — em atualização */}
        <div
          className="flex flex-col items-center justify-center text-center px-8 py-14"
          style={{ borderRadius: FOTO_RADIUS, border: '1px dashed #dcdcdc', background: '#fafafa' }}
          data-animate
        >
          <span className="flex items-center justify-center rounded-full mb-5" style={{ width: 64, height: 64, background: 'rgba(45,78,191,0.08)' }}>
            <EIcon k={`expos.${expo.id}.galeria.icone`} l={`EXPOs — ícone da galeria (${expo.marca})`} defaultSize={26}>
              <Images size={26} strokeWidth={1.8} color="#2d4ebf" />
            </EIcon>
          </span>
          <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: '#152852' }}>
            <ET k={`expos.${expo.id}.galeria.titulo`} v="Galeria" l={`EXPOs — título da galeria (${expo.marca})`} />
          </p>
          <p className="mb-4" style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '22px', color: '#797979', maxWidth: 320 }}>
            <ERich k={`expos.${expo.id}.galeria.desc`} l={`EXPOs — descrição da galeria (${expo.marca})`}>
              Fotografias e registros históricos da {expo.marca}.
            </ERich>
          </p>
          <SeloEstado texto="Em atualização" />
        </div>

        {/* Vídeo institucional — em produção. Mantém a moldura de thumb (capa
           + botão de play) porque é assim que o bloco vai ficar quando o
           vídeo chegar; a "capa" é a cor da marca, não uma foto — uma foto
           aqui sugeriria um frame real de um vídeo que ainda não existe. */}
        <div className="group flex flex-col overflow-hidden" style={{ borderRadius: FOTO_RADIUS, border: '1px solid #ebebeb', background: '#fff' }} data-animate>
          <div className="relative w-full flex-1 flex items-center justify-center" style={{ background: '#152852', minHeight: 200 }}>
            {poster && (
              <div
                className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
            )}
            <div className="absolute inset-0 pointer-events-none" style={{ background: poster ? 'linear-gradient(180deg, rgba(6,9,25,0.10) 0%, rgba(6,9,25,0.40) 100%)' : 'none' }} />
            <span
              className="relative flex items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-110"
              style={{ width: 74, height: 74, background: 'rgba(255,255,255,0.92)', boxShadow: '0 8px 28px rgba(6,9,25,0.35)' }}
            >
              <EIcon k={`expos.${expo.id}.video.icone`} l={`EXPOs — ícone do vídeo (${expo.marca})`} defaultSize={30} style={{ marginLeft: 4 }}>
                <Play size={30} strokeWidth={0} fill="#2d4ebf" color="#2d4ebf" />
              </EIcon>
            </span>
            <BgEditChip
              k={`expos.${expo.id}.video.poster`} v=""
              l={`EXPOs — capa do vídeo (${expo.marca})`}
              spec={POSTER_SPEC}
              style={{ bottom: 10, right: 10, height: 28, fontSize: 11 }}
            />
          </div>
          <div className="px-6 py-6 text-center">
            <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: '#152852' }}>
              <ET k={`expos.${expo.id}.video.titulo`} v="Vídeo institucional" l={`EXPOs — título do vídeo (${expo.marca})`} />
            </p>
            <p className="mb-4" style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '22px', color: '#797979' }}>
              <ERich k={`expos.${expo.id}.video.desc`} l={`EXPOs — descrição do vídeo (${expo.marca})`}>
                Vídeo institucional da {expo.marca}.
              </ERich>
            </p>
            <SeloEstado texto="Em produção" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Imagem de abertura da EXPO — retangular, cantos sutis, imagem flush;
 * zoom suave no hover, padrão do site. */
function ExpoDestaque({ expo }: { expo: Expo }) {
  return (
    <div className="group overflow-hidden mb-10 lg:mb-12" style={{ borderRadius: FOTO_RADIUS, background: '#ebebeb' }} data-animate>
      <EImg
        k={`expos.${expo.id}.destaque.img`} v={`/images/${expo.destaque}.webp`}
        l={`EXPOs — imagem de abertura de ${expo.marca}`}
        spec={{ w: 2000, h: 900, shape: 'paisagem' }}
        alt=""
        className="block w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        style={{ height: 'clamp(220px, 30vw, 420px)' }}
      />
    </div>
  );
}

/** Card de marco. Os marcos do documento são frases únicas, sem ano e sem
 * descrição — por isso o card não tem mais selo de data (inventar uma
 * seria criar fato que o cliente não deu). */
function MarcoCard({ expo, m }: { expo: Expo; m: Marco }) {
  const tilt = useTilt<HTMLDivElement>(3, 5);
  return (
    <div
      ref={tilt}
      className="flex items-start gap-4 rounded-[20px] p-6 bg-white transition-shadow duration-300 hover:shadow-[0_14px_34px_rgba(21,40,82,0.10)]"
      style={{ border: '1px solid #ecedf0' }}
      data-animate
    >
      <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 34, height: 34, background: 'rgba(45,78,191,0.08)' }}>
        <EIcon k={`expos.${expo.id}.marco.${m.id}.icone`} l={`EXPOs — ícone do marco "${m.titulo.slice(0, 30)}…" (${expo.marca})`} defaultSize={16}>
          <Check size={16} strokeWidth={2.4} color="#2d4ebf" />
        </EIcon>
      </span>
      <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 15.5, lineHeight: '25px', color: '#152852' }}>
        <ERich k={`expos.${expo.id}.marco.${m.id}.titulo`} l={`EXPOs — marco "${m.titulo.slice(0, 30)}…" (${expo.marca})`}>{m.titulo}</ERich>
      </p>
    </div>
  );
}

/** Uma EXPO: abertura + história + dados-chave + marcos + registros. */
function ExpoSection({ expo }: { expo: Expo }) {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor(`expos.${expo.id}.bg`, expo.bg, `${expo.marca} — fundo da seção`);

  return (
    <section ref={ref} id={`expos-${expo.id}`} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <ExpoDestaque expo={expo} />

      {/* Cabeçalho da EXPO */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-10 lg:gap-16 items-start mb-14">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>
            <ET k={`expos.${expo.id}.eyebrow`} v={expo.eyebrow} l={`EXPOs — selo da seção ${expo.marca}`} />
          </p>
          <h2 className="mb-5" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(34px,4vw,54px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            <ERich k={`expos.${expo.id}.marca`} l={`EXPOs — nome da marca ${expo.marca}`}>{expo.marca}</ERich>
          </h2>
          <p className="flex items-center gap-2 mb-6" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: expo.accent }} data-animate>
            <EIcon k={`expos.${expo.id}.local.icone`} l={`EXPOs — ícone de local (${expo.marca})`} defaultSize={16}>
              <MapPin size={16} strokeWidth={2} color={expo.accent} />
            </EIcon>
            <ET k={`expos.${expo.id}.local`} v={expo.local} l={`EXPOs — local de ${expo.marca}`} />
          </p>
          <p className="mb-6" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 18, lineHeight: '30px', color: '#152852' }} data-animate>
            <ERich k={`expos.${expo.id}.resumo`} l={`EXPOs — abertura de ${expo.marca}`} baseW={620}>{expo.resumo}</ERich>
          </p>
          <div className="space-y-5">
            {expo.historia.map((p, i) => (
              <p key={i} style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
                <ERich k={`expos.${expo.id}.historia.p${i + 1}`} l={`EXPOs — parágrafo ${i + 1} de ${expo.marca}`} baseW={620}>{p}</ERich>
              </p>
            ))}
          </div>

          {/* Organizações citadas nominalmente pelo cliente (só a BOSTON) */}
          {expo.parceiros && (
            <div className="mt-8" data-animate>
              <p className="mb-4" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#a7a4a4' }}>
                <ET k={`expos.${expo.id}.parceiros.titulo`} v="Relações institucionais construídas" l={`EXPOs — título das organizações (${expo.marca})`} />
              </p>
              <div className="flex flex-wrap gap-2">
                {expo.parceiros.map((nome, i) => (
                  <span
                    key={nome}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2"
                    style={{ background: '#fff', border: '1px solid #ecedf0', fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: '#152852' }}
                  >
                    <EIcon k={`expos.${expo.id}.parceiro.${i + 1}.icone`} l={`EXPOs — ícone da organização "${nome}"`} defaultSize={14}>
                      <Building2 size={14} strokeWidth={2} color={expo.accent} />
                    </EIcon>
                    <ET k={`expos.${expo.id}.parceiro.${i + 1}`} v={nome} l={`EXPOs — organização "${nome}"`} />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dois dados-chave — ambos vindos do texto do cliente */}
        <div className="grid grid-cols-2 gap-4 w-full" data-animate>
          <div className="rounded-[20px] p-6" style={{ background: '#152852' }}>
            <p className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(20px,1.9vw,28px)', lineHeight: 1.1, color: '#d2e718' }}>
              <ET k={`expos.${expo.id}.dado1.valor`} v={expo.dado1.valor} l={`EXPOs — valor do dado 1 (${expo.marca})`} />
            </p>
            <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
              <ET k={`expos.${expo.id}.dado1.rotulo`} v={expo.dado1.rotulo} l={`EXPOs — rótulo do dado 1 (${expo.marca})`} />
            </p>
          </div>
          <div className="rounded-[20px] p-6" style={{ background: '#2d4ebf' }}>
            <p className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(20px,1.9vw,28px)', lineHeight: 1.1, color: '#fff' }}>
              <ET k={`expos.${expo.id}.dado2.valor`} v={expo.dado2.valor} l={`EXPOs — valor do dado 2 (${expo.marca})`} />
            </p>
            <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
              <ET k={`expos.${expo.id}.dado2.rotulo`} v={expo.dado2.rotulo} l={`EXPOs — rótulo do dado 2 (${expo.marca})`} />
            </p>
          </div>
        </div>
      </div>

      {/* Principais marcos */}
      <div className="mb-14">
        <p className="mb-7" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#a7a4a4' }} data-animate>
          <ET k={`expos.${expo.id}.marcos.titulo`} v="Principais marcos" l={`EXPOs — título da lista de marcos (${expo.marca})`} />
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expo.marcos.map((m) => <MarcoCard key={m.id} expo={expo} m={m} />)}
        </div>
      </div>

      <Registros expo={expo} />
    </section>
  );
}

/* ═══════════ Seções ═══════════ */

/** Card de resumo de uma EXPO (seção de abertura). Componente próprio por
 * causa do `useTilt` (hook — não pode rodar dentro de um `.map()` inline). */
function ResumoCard({ c }: { c: (typeof RESUMO_CARDS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(3, 5);
  return (
    <div
      ref={tilt}
      className="group overflow-hidden bg-white transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(21,40,82,0.10)]"
      style={{ borderRadius: FOTO_RADIUS, border: '1px solid #ecedf0' }}
      data-animate
    >
      <div className="overflow-hidden" style={{ height: 200 }}>
        <EImg
          k={`expos.intro.card.${c.id}.img`} v={`/images/${c.img}.webp`}
          l={`EXPOs — foto do card "${c.marca}"`}
          spec={{ w: 800, h: 560, shape: 'paisagem' }}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="p-7">
        <p className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.1, color: '#152852' }}>
          <ERich k={`expos.intro.card.${c.id}.marca`} l={`EXPOs — nome do card "${c.marca}"`}>{c.marca}</ERich>
        </p>
        <p className="mb-4" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11.5, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#2d4ebf' }}>
          <ET k={`expos.intro.card.${c.id}.local`} v={c.local} l={`EXPOs — local do card "${c.marca}"`} />
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>
          <ERich k={`expos.intro.card.${c.id}.desc`} l={`EXPOs — descrição do card "${c.marca}"`}>{c.desc}</ERich>
        </p>
      </div>
    </div>
  );
}

/** Abertura da página — o texto de apresentação das EXPOs, na íntegra. */
function SecIntro() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('expos.intro.bg', '#f5f5f5', 'Abertura — fundo da seção');
  return (
    <section ref={ref} id="expos-intro" className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="grid lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-10 lg:gap-20 mb-14">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>
            <ET k="expos.intro.eyebrow" v="AS EXPOS" l="EXPOs — selo da seção de abertura" />
          </p>
          <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,3.4vw,46px)', letterSpacing: '-0.5px', lineHeight: 1.04, color: '#152852' }} data-animate>
            <ERich k="expos.intro.titulo" l="EXPOs — título da seção de abertura">Plataformas territoriais das Américas.</ERich>
          </h2>
        </div>

        <div className="space-y-5">
          <p style={{ fontFamily: 'Inter', fontSize: 16.5, lineHeight: '28px', color: '#152852' }} data-animate>
            <ERich k="expos.intro.p1" l="EXPOs — abertura, parágrafo 1" baseW={720}>
              O Fórum Pan-Americano da Inovação é uma plataforma internacional de inovação, cooperação e desenvolvimento institucional, fundada pelo <strong className="font-semibold">Brasil Master® Group</strong> com o propósito de conectar governos, universidades, empresas, centros de pesquisa, investidores e organismos internacionais na construção de soluções para os grandes desafios das Américas.
            </ERich>
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="expos.intro.p2" l="EXPOs — abertura, parágrafo 2" baseW={720}>
              Criado em 2017, apenas dois anos após a adoção da Agenda 2030 para o Desenvolvimento Sustentável pela Organização das Nações Unidas (ONU), o Fórum iniciou, de forma pioneira, um movimento para integrar inovação, cidades inteligentes, empreendedorismo e os Objetivos de Desenvolvimento Sustentável (ODS) em um ecossistema privado dedicado à inovação, à transformação governamental e ao desenvolvimento de impacto.
            </ERich>
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="expos.intro.p3" l="EXPOs — abertura, parágrafo 3" baseW={720}>
              Sua atuação acontece por meio das EXPOs, plataformas territoriais realizadas em diferentes cidades das Américas, que aproximam ecossistemas estratégicos e promovem conexões entre conhecimento, inovação, investimentos, empreendedorismo e cooperação internacional.
            </ERich>
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="expos.intro.p4" l="EXPOs — abertura, parágrafo 4" baseW={720}>
              Juntas, EXPO BH®, EXPO BOSTON® e EXPO NYC® constituem o Fórum Pan-Americano da Inovação, formando a primeira plataforma pan-americana de inovação de impacto construída para conectar as Américas.
            </ERich>
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="expos.intro.p5" l="EXPOs — abertura, parágrafo 5" baseW={720}>
              Com a fundação do HUB PAN, o Fórum inicia uma nova etapa de sua trajetória. O HUB PAN passa a exercer sua coordenação estratégica, articulação internacional e expansão institucional, fortalecendo sua presença nas Américas e ampliando sua atuação para novos ecossistemas globais.
            </ERich>
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="expos.intro.p6" l="EXPOs — abertura, parágrafo 6" baseW={720}>
              Essa evolução culmina na criação do Fórum Mundial de Inteligência Artificial (WAIF), iniciativa que amplia o alcance internacional da plataforma e inaugura uma nova agenda global dedicada ao desenvolvimento dos Governos Inteligentes.
            </ERich>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RESUMO_CARDS.map((c) => <ResumoCard key={c.id} c={c} />)}
      </div>
    </section>
  );
}

/** O Fórum Pan-Americano da Inovação — a base institucional sobre a qual
 * as três EXPOs se apoiam. Seção nova, texto integral do cliente. */
function SecForum() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('expos.forum.bg', '#ffffff', 'Fórum Pan-Americano — fundo da seção');
  return (
    <section ref={ref} id="expos-forum" className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="max-w-[820px] mb-12">
        <p className="eyebrow text-muted mb-6" data-animate>
          <ET k="expos.forum.eyebrow" v="A BASE INSTITUCIONAL" l="EXPOs — selo do Fórum Pan-Americano" />
        </p>
        <h2 className="mb-5" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1.02, color: '#152852' }} data-animate>
          <ERich k="expos.forum.titulo" l="EXPOs — título do Fórum Pan-Americano">Fórum Pan-Americano da Inovação</ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 18, lineHeight: '30px', color: '#2d4ebf' }} data-animate>
          <ERich k="expos.forum.sub" l="EXPOs — subtítulo do Fórum Pan-Americano" baseW={720}>
            Conectando as Américas por meio da inovação
          </ERich>
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-x-16 gap-y-5 max-w-[1100px]">
        <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="expos.forum.p1" l="EXPOs — Fórum, parágrafo 1" baseW={520}>
            Fundado em 2017, o Fórum Pan-Americano da Inovação nasceu da compreensão de que os grandes desafios do continente exigem soluções construídas por meio da cooperação entre governos, universidades, empresas, centros de pesquisa e organismos internacionais.
          </ERich>
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="expos.forum.p2" l="EXPOs — Fórum, parágrafo 2" baseW={520}>
            Muito antes de a inovação se consolidar como prioridade nas agendas públicas, a plataforma iniciou um movimento pioneiro de aproximação entre inovação, cidades inteligentes, empreendedorismo e os Objetivos de Desenvolvimento Sustentável (ODS), contribuindo para fortalecer uma nova cultura de colaboração entre diferentes setores da sociedade.
          </ERich>
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="expos.forum.p3" l="EXPOs — Fórum, parágrafo 3" baseW={520}>
            Ao longo dessa trajetória, consolidou uma ampla rede de relacionamento institucional e expandiu sua atuação para os Estados Unidos, aproximando o ecossistema brasileiro de alguns dos mais relevantes ambientes globais de ciência, tecnologia, educação e empreendedorismo.
          </ERich>
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="expos.forum.p4" l="EXPOs — Fórum, parágrafo 4" baseW={520}>
            Hoje, o Fórum Pan-Americano da Inovação representa a base institucional sobre a qual se desenvolvem as iniciativas internacionais do ecossistema HUB PAN, conectando uma história construída nas Américas a uma nova agenda global voltada à inovação, à cooperação internacional e ao desenvolvimento dos Governos Inteligentes.
          </ERich>
        </p>
      </div>
    </section>
  );
}

/** Um elo da linha evolutiva. A sequência é a do cliente, com uma linha
 * contínua ligando os elos — mesma leitura das setas do documento. */
function EvolucaoPasso({ p, i, ultimo }: { p: (typeof EVOLUCAO)[number]; i: number; ultimo: boolean }) {
  const destaque = 'destaque' in p && p.destaque;
  return (
    <li className="relative pl-14 pb-8 last:pb-0" data-animate>
      {/* Linha vertical ligando este elo ao próximo */}
      {!ultimo && (
        <span className="absolute left-[19px] top-10 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.18)' }} aria-hidden />
      )}
      <span
        className="absolute left-0 top-0 flex items-center justify-center rounded-full"
        style={{
          width: 39, height: 39,
          background: destaque ? '#d2e718' : 'rgba(255,255,255,0.08)',
          border: destaque ? undefined : '1px solid rgba(255,255,255,0.18)',
          fontFamily: 'Luxenta', fontWeight: 600, fontSize: 14,
          color: destaque ? '#152852' : '#d2e718',
        }}
      >
        {String(i + 1).padStart(2, '0')}
      </span>
      <p
        className="pt-2"
        style={{
          fontFamily: 'Luxenta',
          fontWeight: destaque ? 600 : 400,
          fontSize: 'clamp(19px,1.7vw,24px)',
          lineHeight: 1.2,
          color: destaque ? '#d2e718' : '#fff',
        }}
      >
        <ERich k={`expos.evolucao.${p.id}.titulo`} l={`EXPOs — elo "${p.titulo}" da linha evolutiva`}>{p.titulo}</ERich>
      </p>
    </li>
  );
}

function SecEvolucao() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('expos.evolucao.bg', '#152852', 'Linha evolutiva — fundo da seção');
  return (
    <section ref={ref} id="expos-evolucao" className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-10 lg:gap-20">
        <div>
          <p className="mb-6 flex items-center gap-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#d2e718' }} data-animate>
            <EIcon k="expos.evolucao.icone" l="EXPOs — ícone da linha evolutiva" defaultSize={16}>
              <Flag size={16} strokeWidth={2} color="#d2e718" />
            </EIcon>
            <ET k="expos.evolucao.eyebrow" v="LINHA EVOLUTIVA" l="EXPOs — selo da linha evolutiva" />
          </p>
          <h2 className="mb-5 text-white" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,3.4vw,46px)', letterSpacing: '-0.5px', lineHeight: 1.04 }} data-animate>
            <ERich k="expos.evolucao.titulo" l="EXPOs — título da linha evolutiva">Do Brasil Master® Group aos Governos Inteligentes.</ERich>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#d6d6d6' }} data-animate>
            <ERich k="expos.evolucao.desc" l="EXPOs — descrição da linha evolutiva" baseW={400}>
              A trajetória que liga a origem do grupo às três EXPOs, à fundação do HUB PAN e à nova agenda global de inovação.
            </ERich>
          </p>
        </div>

        <ol className="lg:pt-2">
          {EVOLUCAO.map((p, i) => (
            <EvolucaoPasso key={p.id} p={p} i={i} ultimo={i === EVOLUCAO.length - 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Portal Global HUB PAN — fechamento da página, texto integral do cliente. */
function SecPortal() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('expos.portal.bg', '#f5f5f5', 'Portal Global — fundo da seção');
  return (
    <section ref={ref} id="expos-portal" className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="max-w-[820px]">
        <p className="eyebrow text-muted mb-6" data-animate>
          <ET k="expos.portal.eyebrow" v="INFRAESTRUTURA DIGITAL OFICIAL" l="EXPOs — selo do Portal Global" />
        </p>
        <h2 className="mb-8" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1.02, color: '#152852' }} data-animate>
          <ERich k="expos.portal.titulo" l="EXPOs — título do Portal Global">Portal Global HUB PAN</ERich>
        </h2>
        <div className="space-y-5">
          <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 18, lineHeight: '30px', color: '#152852' }} data-animate>
            <ERich k="expos.portal.p1" l="EXPOs — Portal Global, parágrafo 1" baseW={760}>
              O Portal Global HUB PAN passa a reunir, em um único ambiente digital, todas as iniciativas internacionais do ecossistema.
            </ERich>
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="expos.portal.p2" l="EXPOs — Portal Global, parágrafo 2" baseW={760}>
              A partir desta nova fase, as páginas da EXPO BH®, EXPO BOSTON®, EXPO NYC® e do Fórum Mundial de Inteligência Artificial (WAIF) passam a estar concentradas exclusivamente no Portal Global HUB PAN, disponível em português, inglês e espanhol.
            </ERich>
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="expos.portal.p3" l="EXPOs — Portal Global, parágrafo 3" baseW={760}>
              Mais do que um portal institucional, esta plataforma representa a infraestrutura digital oficial do ecossistema, conectando governos, universidades, empresas, centros de pesquisa e organismos internacionais em torno de uma agenda comum de inovação, cooperação internacional e desenvolvimento dos Governos Inteligentes.
            </ERich>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ Página ═══════════ */

export default function Expos() {
  return (
    <>
      <PageHero
        id="expos-hero"
        bgKey="expos.hero"
        eyebrow={<ET k="expos.hero.eyebrow" v="EXPO BH® · EXPO BOSTON® · EXPO NYC®" l="EXPOs — rótulo do hero" />}
        title={<ERich k="expos.hero.titulo" l="EXPOs — título do hero">Uma plataforma.<br />Três cidades.<br />Um movimento continental.</ERich>}
        sub={<ERich k="expos.hero.sub" l="EXPOs — subtítulo do hero" baseW={660}>O Fórum Pan-Americano da Inovação conecta governos, universidades, empresas, centros de pesquisa, investidores e organismos internacionais na construção de soluções para os grandes desafios das Américas.</ERich>}
        actions={<>
          <HubButton
            size="lg" variant="lime"
            onClick={() => ScrollSmoother.get()?.scrollTo('#expos-evolucao', true)}
            iconKey="expos.hero.cta1.icone" iconLabel="EXPOs — botão do hero (principal), ícone"
            styleKey="expos.hero.cta1" styleLabel="EXPOs — botão do hero (principal)"
          >
            <ET k="expos.hero.cta1" v="Ver a linha evolutiva" l="EXPOs — botão do hero (principal)" />
          </HubButton>
          <HubButton
            size="lg" variant="blue" to="/o-hub-pan"
            iconKey="expos.hero.cta2.icone" iconLabel="EXPOs — botão do hero (secundário), ícone"
            styleKey="expos.hero.cta2" styleLabel="EXPOs — botão do hero (secundário)"
          >
            <ET k="expos.hero.cta2" v="Conhecer o HUB PAN" l="EXPOs — botão do hero (secundário)" />
          </HubButton>
        </>}
      />

      <SecIntro />
      <SecForum />
      {EXPOS.map((e) => <ExpoSection key={e.id} expo={e} />)}
      <SecEvolucao />
      <SecPortal />

      <CTABanner
        id="expos-cta"
        title={<ERich k="expos.cta.titulo" l="EXPOs — título do CTA final">Quer participar da próxima edição?</ERich>}
        sub={<ERich k="expos.cta.sub" l="EXPOs — subtítulo do CTA final">Fale com nossa equipe sobre participação, patrocínio ou parceria institucional nas EXPOs e no HUB PAN.</ERich>}
        actions={<>
          <HubButton
            size="md" variant="lime" to="/contato"
            iconKey="expos.cta.btn1.icone" iconLabel="EXPOs — botão do CTA final (principal), ícone"
            styleKey="expos.cta.btn1" styleLabel="EXPOs — botão do CTA final (principal)"
          >
            <ET k="expos.cta.btn1" v="Falar com nossa equipe" l="EXPOs — botão do CTA final (principal)" />
          </HubButton>
          <HubButton
            size="md" variant="outline-light" to="/forum-mundial-ia"
            iconKey="expos.cta.btn2.icone" iconLabel="EXPOs — botão do CTA final (secundário), ícone"
            styleKey="expos.cta.btn2" styleLabel="EXPOs — botão do CTA final (secundário)"
          >
            <ET k="expos.cta.btn2" v="Conhecer o Fórum Mundial de IA" l="EXPOs — botão do CTA final (secundário)" />
          </HubButton>
        </>}
      />
    </>
  );
}
