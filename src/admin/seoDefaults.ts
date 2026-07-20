/**
 * Cópia de referência (só pra exibir como placeholder no editor de SEO do
 * Painel Admin) dos títulos/descrições padrão hoje hardcoded em `App.tsx`.
 * NÃO é fonte de verdade — o valor que realmente vale é o de `App.tsx`
 * (renderizado ao vivo) ou, se existir, o override salvo em
 * `content_overrides` (chaves `seo.<slug>.*`). Se editar um título em
 * `App.tsx`, considere atualizar aqui também — mas se ficar desatualizado
 * o pior caso é um placeholder impreciso, não um bug funcional.
 */
export const SEO_DEFAULTS: Record<string, { title: string; description: string }> = {
  home: {
    title: 'HUB PAN — Plataforma Internacional de Inovação',
    description: 'Unimos as Américas e África ao ecossistema global de inovação, educação, IA, impacto e cooperação. Conheça o HUB PAN.',
  },
  'o-hub-pan': {
    title: 'O HUB PAN — Conheça o Ecossistema',
    description: 'Seja como governo, empresa, educador, investidor ou comunidade — descubra o caminho certo pra você dentro do ecossistema HUB PAN.',
  },
  prointer: {
    title: 'PROINTER — Intercâmbio de Impacto em Harvard e Nova York',
    description: 'Programa gratuito que leva professores da rede pública e afroempreendedores para Harvard Square, MIT e as Nações Unidas — passagem, hospedagem e curadoria completas.',
  },
  govia: {
    title: 'GovIA — Plataforma de IA para o Setor Público',
    description: 'Assinatura institucional de inteligência artificial para municípios, estados e consórcios públicos — sem cartão de crédito. Ferramentas, formação e Observatório de IA.',
  },
  'forum-mundial-ia': {
    title: 'Fórum Mundial de Inteligência Artificial (WAIF) — Cambridge 2027',
    description: 'O maior ativo estratégico do HUB PAN reúne players globais de IA, policy makers, pesquisadores e investidores em Cambridge, Massachusetts.',
  },
  insights: {
    title: 'HUB PAN Insights — Observatórios, Pesquisas e White Papers',
    description: 'Observatórios temáticos, pesquisas, artigos e relatórios sobre inovação, IA, governança, educação e cooperação internacional.',
  },
  contato: {
    title: 'Contato — Fale com o HUB PAN',
    description: 'Seja qual for seu perfil — governo, empresa, educador ou parceiro — encontre o caminho certo pra entrar no ecossistema HUB PAN.',
  },
  glossario: {
    title: 'Glossário HUB PAN — Conceitos de Inovação, IA e Impacto',
    description: 'Definições claras dos conceitos centrais do ecossistema HUB PAN — para qualquer pessoa entender o que fazemos e por quê.',
  },
  imprensa: {
    title: 'Imprensa & Mídia — Press Kit HUB PAN',
    description: 'Material estruturado para jornalistas e pesquisadores: dados do Observatório de IA, releases institucionais, press kit e contato com a assessoria.',
  },
  'casos-de-uso': {
    title: 'Casos de Uso — Resultados Reais do HUB PAN',
    description: 'Dados, histórias e resultados documentados de quem já viveu o que o HUB PAN propõe.',
  },
};
