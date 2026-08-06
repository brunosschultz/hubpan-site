import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { MapPin, Play, Flag, Check, Building2 } from 'lucide-react';
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

   GALERIA E VÍDEO: o documento diz "Em atualização" e "Em produção". A
   grade de 6 fotos está montada com imagens PROVISÓRIAS (as legendas dizem
   isso) e o card de vídeo mantém o selo "Em produção" — quando o material
   real chegar, é só trocar os arquivos e ligar o player, sem mexer no
   layout.

   IMAGENS: todas reaproveitadas de `public/images/` (nenhuma inventada) —
   abertura de cada EXPO, galeria e as fotos das seções de apresentação.
   ═══════════════════════════════════════════════════════════════════════ */

type Marco = { id: string; titulo: string };
type Foto = { id: string; img: string; legenda: string };

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
  /** 6 fotografias da galeria. Todas provisórias — o cliente informou que a
   * galeria está "em atualização"; por isso o selo de estado continua na
   * seção, mesmo com a grade já montada. */
  fotos: Foto[];
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
    fotos: [
      { id: 'f1', img: 'insights-educacao-inclusiva', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f2', img: 'inst-sao-paulo', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f3', img: 'forum-onu-flags', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f4', img: 'prointer-hero-cambridge', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f5', img: 'inst-cambridge-harvard', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f6', img: 'inst-nyc-onu', legenda: 'Registro histórico — legenda a definir com o cliente.' },
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
    fotos: [
      { id: 'f1', img: 'inst-boston-mit', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f2', img: 'prointer-harvard-t', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f3', img: 'inst-cambridge-harvard', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f4', img: 'prointer-hero-cambridge', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f5', img: 'forum-hero-mit', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f6', img: 'insights-hero-globo', legenda: 'Registro histórico — legenda a definir com o cliente.' },
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
    fotos: [
      { id: 'f1', img: 'inst-nyc-onu', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f2', img: 'forum-onu-flags', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f3', img: 'inst-hero-onu', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f4', img: 'insights-hero-globo', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f5', img: 'inst-sao-paulo', legenda: 'Registro histórico — legenda a definir com o cliente.' },
      { id: 'f6', img: 'insights-educacao-inclusiva', legenda: 'Registro histórico — legenda a definir com o cliente.' },
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

/** Altura da área de foto de cada card da galeria. É ela que define a altura
 * da grade 3×2 — e o vídeo ao lado (`h-full`) estica pra essa mesma altura.
 * Ancorar na FOTO (e não no vídeo) evita a circularidade de "a linha do grid
 * mede o conteúdo que por sua vez mede a linha do grid", que já fez as fotos
 * saírem quadradas. 150 × ~227px de largura = retângulo ~3:2. */
const FOTO_H = 150;

/** Progressão de cor dos cards de marco — pedido do Bruno pra dar dinamismo.
 * Não é decoração aleatória: é a paleta da marca em ordem, do lime ao
 * navy900, então a sequência de marcos "esquenta e escurece" conforme
 * avança, reforçando a leitura de evolução no tempo. `escuro` diz se o
 * texto por cima é branco (o contraste muda no meio da sequência). */
const MARCO_CORES = [
  { bg: '#d2e718', escuro: false },
  { bg: '#00e4ff', escuro: false },
  { bg: '#2d4ebf', escuro: true },
  { bg: '#152852', escuro: true },
  { bg: '#060919', escuro: true },
];

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

/** Bloco de registros de uma EXPO: grade de 6 fotografias à esquerda e o
 * vídeo à direita — layout que já estava consolidado e que o Bruno pediu de
 * volta. As fotos são provisórias (reaproveitadas do banco do site) e o
 * vídeo ainda não existe: por isso o selo "Em produção" fica no card do
 * vídeo, que é o único cujo conteúdo o cliente declarou como pendente de
 * verdade — as legendas das fotos já avisam que serão definidas com ele. */
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
        <ET k={`expos.${expo.id}.registros.titulo`} v="Fotografias, registros históricos e vídeos" l={`EXPOs — título dos registros (${expo.marca})`} />
      </p>
      {/* Grade 3×2 de fotos à esquerda + vídeo à direita.
         `items-stretch` (default do grid, aqui explícito) + `h-full` nas duas
         colunas: a linha do grid tem a altura do vídeo (o item mais alto) e a
         grade de fotos estica pra exatamente essa altura — sem sobra embaixo
         de um lado só. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4 items-stretch">
        {/* 1 → 2 → 3 colunas: em cada faixa a célula fica mais larga que os
           150px de altura da foto, então a imagem lê sempre como retângulo
           deitado (nunca quadrada). */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {expo.fotos.map((f) => <FotoCard key={f.id} expo={expo} f={f} />)}
        </div>

        {/* Vídeo institucional — em produção. Mantém a moldura de thumb (capa
           + botão de play) porque é assim que o bloco vai ficar quando o
           vídeo chegar; a "capa" é a cor da marca, não uma foto — uma foto
           aqui sugeriria um frame real de um vídeo que ainda não existe. */}
        <div className="group h-full flex flex-col overflow-hidden" style={{ borderRadius: FOTO_RADIUS, border: '1px solid #ebebeb', background: '#fff' }} data-animate>
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
function MarcoCard({ expo, m, i }: { expo: Expo; m: Marco; i: number }) {
  const tilt = useTilt<HTMLDivElement>(3, 5);
  const c = MARCO_CORES[i % MARCO_CORES.length];
  const [bg, bgProps] = useEditColor(`expos.${expo.id}.marco.${m.id}.bg`, c.bg, `${expo.marca} — cor do marco ${i + 1}`);
  const texto = c.escuro ? '#fff' : '#152852';
  return (
    <div
      ref={tilt}
      className="flex flex-col justify-between rounded-[20px] p-7 min-h-[190px] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(21,40,82,0.22)]"
      {...bgProps}
      style={{ background: bg }}
      data-animate
    >
      <div className="flex items-center justify-between mb-6">
        <span
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 38, height: 38, background: c.escuro ? 'rgba(255,255,255,0.14)' : 'rgba(21,40,82,0.10)' }}
        >
          <EIcon k={`expos.${expo.id}.marco.${m.id}.icone`} l={`EXPOs — ícone do marco ${i + 1} (${expo.marca})`} defaultSize={17}>
            <Check size={17} strokeWidth={2.6} color={texto} />
          </EIcon>
        </span>
        {/* Número do marco — dá ordem de leitura à sequência de cores */}
        <span style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 30, lineHeight: 1, color: texto, opacity: 0.28 }}>
          {String(i + 1).padStart(2, '0')}
        </span>
      </div>
      <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 16, lineHeight: '25px', color: texto }}>
        <ERich k={`expos.${expo.id}.marco.${m.id}.titulo`} l={`EXPOs — marco ${i + 1} (${expo.marca})`}>{m.titulo}</ERich>
      </p>
    </div>
  );
}

/** Uma fotografia da galeria: foto retangular no topo (altura fixa `FOTO_H`,
 * sem margem interna) + legenda embaixo, com zoom suave no hover. */
function FotoCard({ expo, f }: { expo: Expo; f: Foto }) {
  return (
    <figure
      className="group flex flex-col h-full overflow-hidden bg-white transition-shadow duration-300 hover:shadow-[0_14px_34px_rgba(21,40,82,0.10)]"
      style={{ borderRadius: FOTO_RADIUS, border: '1px solid #ecedf0' }}
      data-animate
    >
      <div className="shrink-0 overflow-hidden" style={{ height: FOTO_H }}>
        <EImg
          k={`expos.${expo.id}.foto.${f.id}.img`} v={`/images/${f.img}.webp`}
          l={`EXPOs — fotografia ${f.id} de ${expo.marca}`}
          spec={{ w: 800, h: 560, shape: 'paisagem' }}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <figcaption className="p-4 shrink-0">
        <p style={{ fontFamily: 'Inter', fontSize: 12.5, lineHeight: '19px', color: '#797979' }}>
          <ERich k={`expos.${expo.id}.foto.${f.id}.legenda`} l={`EXPOs — legenda da fotografia ${f.id} de ${expo.marca}`}>{f.legenda}</ERich>
        </p>
      </figcaption>
    </figure>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {expo.marcos.map((m, i) => <MarcoCard key={m.id} expo={expo} m={m} i={i} />)}
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
      {/* Título em largura cheia, não espremido numa coluna estreita ao lado
          de um bloco de texto muito maior — era o desequilíbrio que o Bruno
          apontou. Agora o título abre a seção como manchete e o texto vem
          embaixo, dividindo espaço com uma fotografia. */}
      <div className="max-w-[900px] mb-12 lg:mb-16">
        <p className="eyebrow text-muted mb-6" data-animate>
          <ET k="expos.intro.eyebrow" v="AS EXPOS" l="EXPOs — selo da seção de abertura" />
        </p>
        <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(34px,4.4vw,58px)', letterSpacing: '-1px', lineHeight: 1.02, color: '#152852' }} data-animate>
          <ERich k="expos.intro.titulo" l="EXPOs — título da seção de abertura">Plataformas territoriais das Américas.</ERich>
        </h2>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-16 mb-14 items-start">
        {/* Fotografia da abertura — `lg:sticky` deixa a imagem acompanhar a
            leitura dos parágrafos ao lado em vez de sumir no primeiro scroll;
            é o recurso que dá o ar editorial das referências que o Bruno
            usa, sem depender de animação nenhuma. */}
        <figure className="group relative overflow-hidden lg:sticky lg:top-28" style={{ borderRadius: FOTO_RADIUS }} data-animate>
          <EImg
            k="expos.intro.img" v="/images/forum-onu-flags.webp"
            l="EXPOs — fotografia da seção de abertura"
            spec={{ w: 1600, h: 1400, shape: 'retrato', note: 'Imagem de apoio da abertura. Provisória — trocar pelo registro real das EXPOs.' }}
            alt=""
            className="block w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            style={{ height: 'clamp(320px, 42vw, 560px)' }}
          />
          {/* Legenda sobre a foto, com degradê próprio — evita um bloco de
              texto extra embaixo e mantém a imagem "cheia". */}
          <figcaption
            className="absolute inset-x-0 bottom-0 p-6"
            style={{ background: 'linear-gradient(to top, rgba(6,9,25,0.78), transparent)' }}
          >
            <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, lineHeight: '20px', color: 'rgba(255,255,255,0.92)' }}>
              <ERich k="expos.intro.img.legenda" l="EXPOs — legenda da fotografia de abertura">
                Cooperação internacional: a agenda que atravessa as três EXPOs.
              </ERich>
            </p>
          </figcaption>
        </figure>

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

      {/* Texto à esquerda, fotografia à direita — espelho da seção anterior
          (que tem a foto à esquerda), pra a página alternar o ritmo em vez de
          repetir a mesma composição duas vezes seguidas. */}
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 lg:gap-16 items-start">
      <div className="space-y-5">
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

        {/* Fotografia com um card sobreposto na base — a sobreposição é o que
            tira o bloco do retângulo óbvio e dá o acabamento das referências
            que o Bruno usa. `pb-14` na figura reserva o espaço que o card
            invade, senão ele encostaria no conteúdo de baixo. */}
        <figure className="relative pb-14 lg:pb-16" data-animate>
          <div className="group overflow-hidden" style={{ borderRadius: FOTO_RADIUS }}>
            <EImg
              k="expos.forum.img" v="/images/inst-cambridge-harvard.webp"
              l="EXPOs — fotografia do Fórum Pan-Americano"
              spec={{ w: 1400, h: 1050, shape: 'paisagem', note: 'Imagem de apoio da seção institucional. Provisória — trocar por registro real.' }}
              alt=""
              className="block w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              style={{ height: 'clamp(300px, 36vw, 480px)' }}
            />
          </div>
          <figcaption
            className="absolute left-6 right-10 bottom-0 rounded-[20px] p-6 lg:p-7"
            style={{ background: '#152852', boxShadow: '0 22px 48px rgba(6,9,25,0.20)' }}
          >
            <p className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(22px,2vw,30px)', lineHeight: 1.05, color: '#d2e718' }}>
              <ERich k="expos.forum.selo.titulo" l="EXPOs — título do selo sobre a foto">Desde 2017</ERich>
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '22px', color: 'rgba(255,255,255,0.78)' }}>
              <ERich k="expos.forum.selo.desc" l="EXPOs — texto do selo sobre a foto">
                Uma rede institucional construída das Américas a Cambridge.
              </ERich>
            </p>
          </figcaption>
        </figure>
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
        /* Fundo fotográfico em vez do navy chapado. Provisória (banco de
           imagens do site) — trocável pelo painel a qualquer momento. O
           PageHero aplica um degradê escuro por cima quando há imagem, então
           o texto branco continua legível. */
        bgImageDefault="/images/insights-hero-globo.webp"
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
