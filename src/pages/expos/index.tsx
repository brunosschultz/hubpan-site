import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { MapPin, Play, Flag, Calendar } from 'lucide-react';
import PageHero from '../../components/PageHero';
import CTABanner from '../../components/CTABanner';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';
import { BgEditChip, EIcon, EImg, ERich, ET, useEditColor } from '../../editor/fields';

/* ═══════════════════════════════════════════════════════════════════════════
   DADOS DAS EXPOs

   ⚠️ IMPORTANTE — o que é FATO e o que é PLACEHOLDER nesta página:

   FATOS REAIS (vieram do documento do cliente, podem ser tratados como
   verdade e NÃO devem ser alterados sem nova fonte):
   • EXPO BH® — fundada em 2017, em Belo Horizonte (MG), sob o nome
     "Fórum Pan-Americano da Inovação". Marco inicial da atuação nacional
     do grupo; primeira iniciativa de conexão entre governos, empresas,
     universidades e sociedade.
   • EXPO NYC® — realizada em Nova York; 4 edições. Em 2025 aconteceu na
     sede das Nações Unidas.
   • EXPO BOSTON — realizada em 2026, conectando o ecossistema brasileiro
     aos principais ambientes globais de inovação.
   • 15 edições do Fórum Pan-Americano no total; o conjunto culmina em 2026
     na fundação do HUB PAN (HUB PAN Latin America, em São Paulo, e
     HUB PAN Global, em Harvard Square, Cambridge).

   PLACEHOLDER (autorizado pelo Bruno só para ESTRUTURAR a página — o
   cliente popula com o material real depois). Todo item placeholder está
   marcado com `exemplo: true` e aparece na tela com o selo "EXEMPLO" +
   texto neutro. NÃO transformar nenhum desses em número/data que pareça
   real e verificável (nº de participantes, países, investimento, datas
   exatas de cada edição) sem material do cliente.

   IMAGENS: todas reaproveitadas de `public/images/` (nenhuma inventada).
   VÍDEOS: thumb SIMULADA — foto de capa (poster) + botão de play por
   cima, sem embed nenhum. A capa é uma foto já existente do site, marcada
   com o selo EXEMPLO como todo o resto do placeholder; quando o cliente
   mandar os vídeos, troca-se a capa pelo frame real e liga-se o player.
   ═══════════════════════════════════════════════════════════════════════ */

type Marco = { id: string; ano: string; titulo: string; desc: string; exemplo?: boolean };
type Foto = { id: string; img: string; legenda: string; exemplo?: boolean };

interface Expo {
  id: string;
  marca: string;
  eyebrow: string;
  local: string;
  resumo: string;
  historia: string;
  fundacao: { rotulo: string; valor: string };
  edicoes: { rotulo: string; valor: string };
  /** Imagem em destaque da EXPO — abre a seção, com peso visual.
   * Sempre uma foto JÁ EXISTENTE em `public/images/` (nada inventado). */
  destaque: string;
  marcos: Marco[];
  fotos: Foto[];
  video: { titulo: string; desc: string; poster: string };
  bg: string;
  accent: string;
}

const EXPOS: Expo[] = [
  {
    id: 'bh',
    marca: 'EXPO BH®',
    eyebrow: 'A ORIGEM · BELO HORIZONTE',
    local: 'Belo Horizonte · Minas Gerais · Brasil',
    /* FATO */
    resumo: 'Fundada em 2017, em Belo Horizonte, como Fórum Pan-Americano da Inovação — o marco inicial da atuação nacional do grupo.',
    /* FATO */
    historia: 'A EXPO BH® nasceu em 2017, em Belo Horizonte (MG), com o nome de Fórum Pan-Americano da Inovação. Foi a primeira iniciativa do grupo a colocar governos, empresas, universidades e sociedade na mesma mesa — e é o ponto de partida de tudo o que veio depois. É a partir dela que se estrutura a atuação nacional que, anos mais tarde, alcançaria Nova York, Boston e a fundação do HUB PAN.',
    fundacao: { rotulo: 'Fundação', valor: '2017' },
    edicoes: { rotulo: 'Cidade-sede', valor: 'Belo Horizonte' },
    destaque: 'inst-sao-paulo',
    marcos: [
      /* FATO */
      { id: 'fundacao', ano: '2017', titulo: 'Fundação do Fórum Pan-Americano da Inovação', desc: 'Primeira edição realizada em Belo Horizonte (MG) — o nome original da marca que viria a ser a EXPO BH®.' },
      /* FATO */
      { id: 'nacional', ano: '2017', titulo: 'Marco inicial da atuação nacional', desc: 'A EXPO BH® estabelece a presença do grupo no Brasil e define o modelo de encontro que seria replicado nas edições seguintes.' },
      /* FATO */
      { id: 'quadrupla', ano: '2017', titulo: 'Primeira conexão entre governos, empresas, universidades e sociedade', desc: 'A proposta de reunir os quatro setores num mesmo ambiente de inovação nasce aqui e permanece como base de tudo o que veio depois.' },
      /* PLACEHOLDER — o cliente informa as edições e conquistas seguintes */
      { id: 'edicoes-seguintes', ano: '—', titulo: 'Edições seguintes em Belo Horizonte', desc: 'Espaço reservado para os marcos das edições seguintes da EXPO BH®. Conteúdo a ser preenchido com o material do cliente.', exemplo: true },
    ],
    fotos: [
      { id: 'f1', img: 'inst-sao-paulo', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f2', img: 'insights-hero-globo', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f3', img: 'insights-educacao-inclusiva', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f4', img: 'forum-onu-flags', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f5', img: 'prointer-hero-cambridge', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f6', img: 'inst-cambridge-harvard', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
    ],
    video: { titulo: 'Vídeo institucional da EXPO BH®', desc: 'Espaço reservado para o vídeo. O arquivo/link ainda será enviado pelo cliente.', poster: 'insights-educacao-inclusiva' },
    bg: '#ffffff',
    accent: '#2d4ebf',
  },
  {
    id: 'nyc',
    marca: 'EXPO NYC®',
    eyebrow: 'PROJEÇÃO INTERNACIONAL · NOVA YORK',
    local: 'Nova York · Estados Unidos',
    /* FATO */
    resumo: 'Quatro edições realizadas em Nova York. Em 2025, a EXPO NYC® aconteceu na sede das Nações Unidas.',
    /* FATO */
    historia: 'A EXPO NYC® levou o Fórum Pan-Americano para fora do Brasil e consolidou a dimensão internacional da atuação do grupo. Foram quatro edições realizadas em Nova York. Em 2025, a EXPO NYC® aconteceu na sede das Nações Unidas — um novo patamar de projeção internacional para as iniciativas, as organizações e os projetos brasileiros conectados ao grupo.',
    fundacao: { rotulo: 'Cidade-sede', valor: 'Nova York' },
    edicoes: { rotulo: 'Edições realizadas', valor: '4' },
    destaque: 'inst-hero-onu',
    marcos: [
      /* FATO */
      { id: 'internacionalizacao', ano: '—', titulo: 'A internacionalização do Fórum Pan-Americano', desc: 'A EXPO NYC® marca a saída do Brasil e a abertura de uma frente internacional permanente para o grupo.' },
      /* FATO */
      { id: 'quatro-edicoes', ano: '—', titulo: 'Quatro edições em Nova York', desc: 'A cidade se consolida como sede internacional recorrente das iniciativas do grupo.' },
      /* FATO */
      { id: 'onu-2025', ano: '2025', titulo: 'Edição na sede das Nações Unidas', desc: 'Em 2025, a EXPO NYC® é realizada na sede da ONU, consolidando um novo patamar de projeção internacional.' },
      /* PLACEHOLDER — datas exatas de cada uma das 4 edições vêm do cliente */
      { id: 'datas-edicoes', ano: '—', titulo: 'Detalhamento das quatro edições', desc: 'Espaço reservado para as datas, os temas e os destaques de cada edição. Conteúdo a ser preenchido com o material do cliente.', exemplo: true },
    ],
    fotos: [
      { id: 'f1', img: 'inst-nyc-onu', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f2', img: 'forum-onu-flags', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f3', img: 'inst-hero-onu', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f4', img: 'insights-hero-globo', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f5', img: 'inst-sao-paulo', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f6', img: 'insights-educacao-inclusiva', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
    ],
    video: { titulo: 'Vídeo da edição nas Nações Unidas', desc: 'Espaço reservado para o vídeo. O arquivo/link ainda será enviado pelo cliente.', poster: 'inst-nyc-onu' },
    bg: '#f5f5f5',
    accent: '#2d4ebf',
  },
  {
    id: 'boston',
    /* Sem ® — marca ainda não registrada */
    marca: 'EXPO BOSTON',
    eyebrow: 'ECOSSISTEMAS GLOBAIS · BOSTON',
    local: 'Boston · Massachusetts · Estados Unidos',
    /* FATO */
    resumo: 'Realizada em 2026, conectando o ecossistema brasileiro aos principais ambientes globais de inovação.',
    /* FATO */
    historia: 'A EXPO BOSTON foi realizada em 2026 e aproximou o ecossistema brasileiro dos principais ambientes globais de inovação. É a edição que fecha o ciclo do Fórum Pan-Americano e abre caminho, no mesmo ano, para a fundação do HUB PAN — com sede global em Harvard Square, Cambridge, a poucos minutos de Boston.',
    fundacao: { rotulo: 'Realização', valor: '2026' },
    edicoes: { rotulo: 'Cidade-sede', valor: 'Boston' },
    destaque: 'forum-hero-mit',
    marcos: [
      /* FATO */
      { id: 'realizacao', ano: '2026', titulo: 'Realização da EXPO BOSTON', desc: 'A edição acontece em 2026, em Boston (Massachusetts).' },
      /* FATO */
      { id: 'conexao', ano: '2026', titulo: 'Conexão com os ambientes globais de inovação', desc: 'A EXPO BOSTON aproxima o ecossistema brasileiro dos principais ambientes globais de inovação.' },
      /* FATO */
      { id: 'caminho-hubpan', ano: '2026', titulo: 'Antecede a fundação do HUB PAN', desc: 'No mesmo ano, o conjunto das três EXPOs culmina na fundação do HUB PAN, com sede global em Harvard Square, Cambridge.' },
      /* PLACEHOLDER — programação e destaques da edição vêm do cliente */
      { id: 'programacao', ano: '—', titulo: 'Programação e destaques da edição', desc: 'Espaço reservado para a programação, os participantes e os destaques da EXPO BOSTON. Conteúdo a ser preenchido com o material do cliente.', exemplo: true },
    ],
    fotos: [
      { id: 'f1', img: 'inst-boston-mit', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f2', img: 'forum-hero-mit', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f3', img: 'prointer-harvard-t', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f4', img: 'inst-cambridge-harvard', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f5', img: 'prointer-hero-cambridge', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
      { id: 'f6', img: 'insights-hero-globo', legenda: 'Registro histórico — legenda a definir com o cliente.', exemplo: true },
    ],
    video: { titulo: 'Vídeo da EXPO BOSTON', desc: 'Espaço reservado para o vídeo. O arquivo/link ainda será enviado pelo cliente.', poster: 'inst-boston-mit' },
    bg: '#ffffff',
    accent: '#2d4ebf',
  },
];

/* Resumo das três marcas, usado na seção de abertura. */
const RESUMO_CARDS = [
  { id: 'bh', marca: 'EXPO BH®', ano: '2017', local: 'Belo Horizonte, MG', desc: 'A origem. Fundada como Fórum Pan-Americano da Inovação.', img: 'inst-sao-paulo' },
  { id: 'nyc', marca: 'EXPO NYC®', ano: '4 edições', local: 'Nova York, EUA', desc: 'A projeção internacional. Em 2025, na sede das Nações Unidas.', img: 'inst-nyc-onu' },
  { id: 'boston', marca: 'EXPO BOSTON', ano: '2026', local: 'Boston, MA, EUA', desc: 'A conexão com os principais ambientes globais de inovação.', img: 'inst-boston-mit' },
];

/* Linha evolutiva — todos os passos são FATO (documento do cliente). */
const EVOLUCAO = [
  { id: 'bh', ano: '2017', titulo: 'EXPO BH®', desc: 'Fundação do Fórum Pan-Americano da Inovação, em Belo Horizonte (MG). Primeira conexão entre governos, empresas, universidades e sociedade.', img: 'inst-sao-paulo' },
  { id: 'nyc', ano: 'até 2025', titulo: 'EXPO NYC®', desc: 'Quatro edições em Nova York. Em 2025, na sede das Nações Unidas — novo patamar de projeção internacional.', img: 'inst-nyc-onu' },
  { id: 'boston', ano: '2026', titulo: 'EXPO BOSTON', desc: 'O ecossistema brasileiro conectado aos principais ambientes globais de inovação.', img: 'inst-boston-mit' },
  { id: 'hubpan', ano: '2026', titulo: 'Fundação do HUB PAN', desc: '15 edições do Fórum Pan-Americano culminam na fundação do HUB PAN: HUB PAN Latin America, em São Paulo, e HUB PAN Global, em Harvard Square, Cambridge.', img: 'inst-cambridge-harvard', destaque: true },
];

/* ═══════════ Peças reutilizadas ═══════════ */

/** Raio dos cards que têm FOTOGRAFIA. Menor que o raio padrão de card do
 * site (20px) de propósito: numa foto pequena, 20px de raio começa a ler
 * como forma arredondada em vez de fotografia retangular. A imagem sempre
 * preenche a área de ponta a ponta (sem margem/padding próprio) e o raio
 * vem só do card (`overflow-hidden`), nunca somado na própria imagem —
 * mesmo padrão de S6Numeros/S7ParaQuem/S9Insights. */
const FOTO_RADIUS = 12;

/** Altura da área de foto de cada card da galeria. É ela que define a
 * altura da grade 3×2 — e o vídeo ao lado (`h-full`) estica pra essa mesma
 * altura. Ancorar na FOTO (e não no vídeo) evita a circularidade de "a
 * linha do grid mede o conteúdo que por sua vez mede a linha do grid", que
 * fazia as fotos saírem quadradas. 150 × ~227px de largura = retângulo
 * ~3:2, proporção de fotografia. */
const FOTO_H = 150;

/** Selo "EXEMPLO" — marca visualmente todo conteúdo que ainda é placeholder,
 * pra ninguém confundir com informação confirmada pelo cliente. */
function SeloExemplo() {
  return (
    <span
      className="inline-block rounded-full px-2.5 py-1 align-middle"
      style={{ background: '#ebebeb', fontFamily: 'Inter', fontWeight: 600, fontSize: 9.5, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#797979' }}
    >
      Exemplo
    </span>
  );
}

/** Thumb de vídeo SIMULADA — capa (poster) + botão de play por cima, sem
 * embed. É só aparência: quando o cliente mandar os vídeos, troca-se a capa
 * pelo frame real e o bloco vira o player, sem mexer no layout.
 * `h-full` + coluna flex: estica na altura da linha do grid (pra casar com
 * a grade de 6 fotos ao lado) mantendo a proporção 16/9 como altura MÍNIMA
 * da área da capa (o `flex-1` só deixa ela crescer, nunca encolher). */
function VideoPlaceholder({ expo }: { expo: Expo }) {
  return (
    <div className="group h-full flex flex-col overflow-hidden" style={{ borderRadius: FOTO_RADIUS, border: '1px solid #ebebeb', background: '#fff' }} data-animate>
      {/* `flex-1` e `aspect-ratio` NÃO podem viver no mesmo elemento aqui:
         com `flex-basis: 0` a proporção se resolve contra uma altura já
         esticada e o bloco estoura (medido: 1200px em vez de 252px). Por
         isso a proporção fica num filho — ela define a altura MÍNIMA, e o
         pai (`flex-1`) só absorve a sobra quando a coluna estica. */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden" style={{ background: '#152852' }}>
        <div className="relative w-full h-full flex items-center justify-center" style={{ aspectRatio: '16 / 9' }}>
          <EImg
            k={`expos.${expo.id}.video.poster`} v={`/images/${expo.video.poster}.webp`}
            l={`EXPOs — capa do vídeo (${expo.marca})`}
            spec={{ w: 1280, h: 720, shape: 'paisagem', note: 'Capa do vídeo (frame de abertura). Fica atrás de um escurecimento com o botão de play no centro.' }}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Escurecimento: dá contraste pro play e deixa claro que é capa de
             vídeo, não uma foto da galeria ao lado. */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(6,9,25,0.15) 0%, rgba(6,9,25,0.45) 100%)' }} />
          {/* Botão de play — círculo branco translúcido com o triângulo
             preenchido (`fill`), que é o que faz "ler" como vídeo de verdade;
             o ícone de contorno sozinho parecia um botão comum. */}
          <span
            className="relative flex items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-110"
            style={{ width: 74, height: 74, background: 'rgba(255,255,255,0.92)', boxShadow: '0 8px 28px rgba(6,9,25,0.35)' }}
          >
            <EIcon k={`expos.${expo.id}.video.icone`} l={`EXPOs — ícone do espaço de vídeo (${expo.marca})`} defaultSize={30} style={{ marginLeft: 4 }}>
              <Play size={30} strokeWidth={0} fill="#2d4ebf" color="#2d4ebf" />
            </EIcon>
          </span>
          <BgEditChip
            k={`expos.${expo.id}.video.poster`} v={`/images/${expo.video.poster}.webp`}
            l={`EXPOs — capa do vídeo (${expo.marca})`}
            spec={{ w: 1280, h: 720, shape: 'paisagem', note: 'Capa do vídeo (frame de abertura). Fica atrás de um escurecimento com o botão de play no centro.' }}
            style={{ bottom: 10, right: 10, height: 28, fontSize: 11 }}
          />
        </div>
      </div>
      <div className="px-6 pb-6 pt-1 text-center">
        <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#152852' }}>
          <ET k={`expos.${expo.id}.video.titulo`} v={expo.video.titulo} l={`EXPOs — título do espaço de vídeo (${expo.marca})`} />
        </p>
        <p className="mb-3" style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: '21px', color: '#a7a4a4' }}>
          <ERich k={`expos.${expo.id}.video.desc`} l={`EXPOs — descrição do espaço de vídeo (${expo.marca})`}>{expo.video.desc}</ERich>
        </p>
        <SeloExemplo />
      </div>
    </div>
  );
}

/** Imagem em destaque da EXPO — abre a seção com peso visual, logo acima
 * da história e dos dados-chave. Retangular, cantos sutis, imagem flush
 * (sem margem interna); zoom suave no hover, padrão do site. */
function ExpoDestaque({ expo }: { expo: Expo }) {
  return (
    <div
      className="group overflow-hidden mb-10 lg:mb-12"
      style={{ borderRadius: FOTO_RADIUS, background: '#ebebeb' }}
      data-animate
    >
      <EImg
        k={`expos.${expo.id}.destaque.img`} v={`/images/${expo.destaque}.webp`}
        l={`EXPOs — imagem em destaque de ${expo.marca}`}
        spec={{ w: 2000, h: 900, shape: 'paisagem' }}
        alt=""
        className="block w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        style={{ height: 'clamp(220px, 30vw, 420px)' }}
      />
    </div>
  );
}

/** Card de marco. Componente próprio (e não JSX dentro do `.map()`) porque
 * `useTilt` é um hook — não pode ser chamado dentro de um map inline. */
function MarcoCard({ expo, m }: { expo: Expo; m: Marco }) {
  const tilt = useTilt<HTMLDivElement>(3, 5);
  return (
    <div
      ref={tilt}
      className="rounded-[20px] p-6 bg-white transition-shadow duration-300 hover:shadow-[0_14px_34px_rgba(21,40,82,0.10)]"
      style={{ border: m.exemplo ? '1px dashed #dcdcdc' : '1px solid #ecedf0' }}
      data-animate
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 34, height: 34, background: 'rgba(45,78,191,0.08)' }}>
          <EIcon k={`expos.${expo.id}.marco.${m.id}.icone`} l={`EXPOs — ícone do marco "${m.titulo.slice(0, 30)}…" (${expo.marca})`} defaultSize={16}>
            <Calendar size={16} strokeWidth={2} color="#2d4ebf" />
          </EIcon>
        </span>
        <span style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 18, lineHeight: 1, color: '#2d4ebf' }}>
          <ET k={`expos.${expo.id}.marco.${m.id}.ano`} v={m.ano} l={`EXPOs — ano do marco "${m.titulo.slice(0, 30)}…" (${expo.marca})`} />
        </span>
        {m.exemplo && <span className="ml-auto"><SeloExemplo /></span>}
      </div>
      <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 16, lineHeight: 1.35, color: '#152852' }}>
        <ERich k={`expos.${expo.id}.marco.${m.id}.titulo`} l={`EXPOs — título do marco "${m.titulo.slice(0, 30)}…" (${expo.marca})`}>{m.titulo}</ERich>
      </p>
      <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: '#797979' }}>
        <ERich k={`expos.${expo.id}.marco.${m.id}.desc`} l={`EXPOs — descrição do marco "${m.titulo.slice(0, 30)}…" (${expo.marca})`}>{m.desc}</ERich>
      </p>
    </div>
  );
}

/** Uma fotografia da galeria: foto retangular flush no topo (altura fixa
 * `FOTO_H`, sem margem interna, raio só do card) + legenda embaixo. Zoom
 * suave no hover, padrão S6Numeros/S7ParaQuem/S9Insights. */
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
        <p className="mb-2" style={{ fontFamily: 'Inter', fontSize: 12.5, lineHeight: '19px', color: '#797979' }}>
          <ERich k={`expos.${expo.id}.foto.${f.id}.legenda`} l={`EXPOs — legenda da fotografia ${f.id} de ${expo.marca}`}>{f.legenda}</ERich>
        </p>
        {f.exemplo && <SeloExemplo />}
      </figcaption>
    </figure>
  );
}

/** Uma EXPO: destaque + história + fundação + marcos + fotos + vídeo. */
function ExpoSection({ expo }: { expo: Expo }) {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor(`expos.${expo.id}.bg`, expo.bg, `${expo.marca} — fundo da seção`);

  return (
    <section ref={ref} id={`expos-${expo.id}`} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      {/* Imagem em destaque da EXPO */}
      <ExpoDestaque expo={expo} />

      {/* Cabeçalho da EXPO */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-10 lg:gap-16 items-start mb-14">
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
            <ERich k={`expos.${expo.id}.resumo`} l={`EXPOs — resumo de ${expo.marca}`} baseW={620}>{expo.resumo}</ERich>
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k={`expos.${expo.id}.historia`} l={`EXPOs — história de ${expo.marca}`} baseW={620}>{expo.historia}</ERich>
          </p>
        </div>

        {/* Dois dados-chave — só informação confirmada pelo cliente */}
        <div className="grid grid-cols-2 gap-4 w-full" data-animate>
          <div className="rounded-[20px] p-6" style={{ background: '#152852' }}>
            <p className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(26px,2.4vw,36px)', lineHeight: 1, color: '#d2e718' }}>
              <ET k={`expos.${expo.id}.dado1.valor`} v={expo.fundacao.valor} l={`EXPOs — valor do dado 1 (${expo.marca})`} />
            </p>
            <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
              <ET k={`expos.${expo.id}.dado1.rotulo`} v={expo.fundacao.rotulo} l={`EXPOs — rótulo do dado 1 (${expo.marca})`} />
            </p>
          </div>
          <div className="rounded-[20px] p-6" style={{ background: '#2d4ebf' }}>
            <p className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(26px,2.4vw,36px)', lineHeight: 1, color: '#fff' }}>
              <ET k={`expos.${expo.id}.dado2.valor`} v={expo.edicoes.valor} l={`EXPOs — valor do dado 2 (${expo.marca})`} />
            </p>
            <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
              <ET k={`expos.${expo.id}.dado2.rotulo`} v={expo.edicoes.rotulo} l={`EXPOs — rótulo do dado 2 (${expo.marca})`} />
            </p>
          </div>
        </div>
      </div>

      {/* Linha evolutiva da própria EXPO — principais marcos */}
      <div className="mb-14">
        <p className="mb-7" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#a7a4a4' }} data-animate>
          <ET k={`expos.${expo.id}.marcos.titulo`} v="Principais marcos" l={`EXPOs — título da lista de marcos (${expo.marca})`} />
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expo.marcos.map((m) => <MarcoCard key={m.id} expo={expo} m={m} />)}
        </div>
      </div>

      {/* Registros históricos — 6 fotografias + espaço de vídeo.
         `items-stretch` (default do grid, aqui explícito) + `h-full` nas
         duas colunas: a linha do grid tem a altura do vídeo (o item mais
         alto) e a grade 3×2 de fotos estica pra exatamente essa altura —
         nada de sobra embaixo de um lado só. */}
      <div>
        <p className="mb-7" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#a7a4a4' }} data-animate>
          <ET k={`expos.${expo.id}.registros.titulo`} v="Fotografias, registros históricos e vídeos" l={`EXPOs — título da galeria (${expo.marca})`} />
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4 items-stretch">
          {/* 1 → 2 → 3 colunas: em cada faixa a célula fica mais larga que
             os 150px de altura da foto, então a imagem lê sempre como
             retângulo deitado (nunca quadrada). */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expo.fotos.map((f) => <FotoCard key={f.id} expo={expo} f={f} />)}
          </div>
          <VideoPlaceholder expo={expo} />
        </div>
      </div>
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
          <ET k={`expos.intro.card.${c.id}.ano`} v={c.ano} l={`EXPOs — selo do card "${c.marca}"`} />
          {' · '}
          <ET k={`expos.intro.card.${c.id}.local`} v={c.local} l={`EXPOs — local do card "${c.marca}"`} />
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>
          <ERich k={`expos.intro.card.${c.id}.desc`} l={`EXPOs — descrição do card "${c.marca}"`}>{c.desc}</ERich>
        </p>
      </div>
    </div>
  );
}


function SecIntro() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('expos.intro.bg', '#f5f5f5', 'Abertura — fundo da seção');
  return (
    <section ref={ref} id="expos-intro" className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="max-w-[760px] mb-14">
        <p className="eyebrow text-muted mb-6" data-animate>
          <ET k="expos.intro.eyebrow" v="TRÊS MARCAS, UMA MESMA TRAJETÓRIA" l="EXPOs — selo da seção de abertura" />
        </p>
        <h2 className="mb-5" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="expos.intro.titulo" l="EXPOs — título da seção de abertura">De Belo Horizonte a Boston.</ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16.5, lineHeight: '28px', color: '#797979' }} data-animate>
          <ERich k="expos.intro.desc" l="EXPOs — descrição da seção de abertura" baseW={720}>
            As EXPOs são as marcas do Fórum Pan-Americano da Inovação. Começaram em 2017, em Belo Horizonte, alcançaram a sede das Nações Unidas em Nova York e chegaram a Boston em 2026 — e é desse conjunto que nasce o HUB PAN.
          </ERich>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RESUMO_CARDS.map((c) => <ResumoCard key={c.id} c={c} />)}
      </div>
    </section>
  );
}

function EvolucaoCard({ p }: { p: (typeof EVOLUCAO)[number] }) {
  const tilt = useTilt<HTMLDivElement>(3, 5);
  const destaque = 'destaque' in p && p.destaque;
  return (
    <div
      ref={tilt}
      className="group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
      style={{ borderRadius: FOTO_RADIUS, background: destaque ? '#d2e718' : 'rgba(255,255,255,0.06)', border: destaque ? undefined : '1px solid rgba(255,255,255,0.12)' }}
      data-animate
    >
      <div className="overflow-hidden" style={{ height: 160 }}>
        <EImg
          k={`expos.evolucao.${p.id}.img`} v={`/images/${p.img}.webp`}
          l={`EXPOs — foto da linha evolutiva "${p.titulo}"`}
          spec={{ w: 800, h: 560, shape: 'paisagem' }}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="p-7 flex flex-col flex-1">
        <p className="mb-3" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, letterSpacing: '1.8px', textTransform: 'uppercase', color: destaque ? 'rgba(21,40,82,0.65)' : '#d2e718' }}>
          <ET k={`expos.evolucao.${p.id}.ano`} v={p.ano} l={`EXPOs — ano da etapa "${p.titulo}"`} />
        </p>
        <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.1, color: destaque ? '#152852' : '#fff' }}>
          <ERich k={`expos.evolucao.${p.id}.titulo`} l={`EXPOs — título da etapa "${p.titulo}"`}>{p.titulo}</ERich>
        </h3>
        <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: destaque ? 'rgba(21,40,82,0.8)' : 'rgba(255,255,255,0.75)' }}>
          <ERich k={`expos.evolucao.${p.id}.desc`} l={`EXPOs — descrição da etapa "${p.titulo}"`}>{p.desc}</ERich>
        </p>
      </div>
    </div>
  );
}

function SecEvolucao() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('expos.evolucao.bg', '#152852', 'Linha evolutiva — fundo da seção');
  return (
    <section ref={ref} id="expos-evolucao" className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="max-w-[760px] mb-14">
        <p className="mb-6 flex items-center gap-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#d2e718' }} data-animate>
          <EIcon k="expos.evolucao.icone" l="EXPOs — ícone da linha evolutiva" defaultSize={16}>
            <Flag size={16} strokeWidth={2} color="#d2e718" />
          </EIcon>
          <ET k="expos.evolucao.eyebrow" v="LINHA EVOLUTIVA · 15 EDIÇÕES" l="EXPOs — selo da linha evolutiva" />
        </p>
        <h2 className="mb-5 text-white" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1 }} data-animate>
          <ERich k="expos.evolucao.titulo" l="EXPOs — título da linha evolutiva">Como as três EXPOs culminam no HUB PAN.</ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16.5, lineHeight: '28px', color: '#d6d6d6' }} data-animate>
          <ERich k="expos.evolucao.desc" l="EXPOs — descrição da linha evolutiva" baseW={720}>
            Foram 15 edições do Fórum Pan-Americano da Inovação entre Belo Horizonte, Nova York e Boston. Em 2026, essa trajetória se consolida na fundação do HUB PAN — com o HUB PAN Latin America, em São Paulo, e o HUB PAN Global, em Harvard Square, Cambridge.
          </ERich>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {EVOLUCAO.map((p) => <EvolucaoCard key={p.id} p={p} />)}
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
        eyebrow={<ET k="expos.hero.eyebrow" v="EXPO BH® · EXPO NYC® · EXPO BOSTON" l="EXPOs — rótulo do hero" />}
        title={<ERich k="expos.hero.titulo" l="EXPOs — título do hero">As EXPOs do Fórum Pan-Americano.</ERich>}
        sub={<ERich k="expos.hero.sub" l="EXPOs — subtítulo do hero" baseW={660}>De Belo Horizonte, em 2017, à sede das Nações Unidas e a Boston. A história, os marcos e os registros das três EXPOs que deram origem ao HUB PAN.</ERich>}
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
      {EXPOS.map((e) => <ExpoSection key={e.id} expo={e} />)}
      <SecEvolucao />

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
