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
    title: 'HUB PAN — Infraestrutura Global que Conecta Ecossistemas',
    description: 'O HUB PAN é a infraestrutura global de convergência que conecta ecossistemas, governos, empresas e universidades das Américas e da África em inovação e IA.',
  },
  'o-hub-pan': {
    title: 'O Que É o HUB PAN? Infraestrutura de Convergência',
    description: 'O que é o HUB PAN? Conheça a história e as marcas fundadoras — de Belo Horizonte a Harvard Square, com mais de 100 projetos abrigados desde 2017.',
  },
  prointer: {
    title: 'PROINTER — Professores da Rede Pública e Afroempreendedores',
    description: 'Programa que leva professores da rede pública e afroempreendedores para Harvard Square, MIT e as Nações Unidas — passagem, hospedagem e curadoria completas.',
  },
  govia: {
    title: 'eGovIA — Governança de IA para a Administração Pública',
    description: 'Governança de inteligência artificial para municípios, estados e consórcios públicos: conformidade legal, agentes por secretaria e Observatório de IA.',
  },
  expos: {
    title: 'EXPOs — EXPO BH, EXPO NYC e EXPO BOSTON | HUB PAN',
    description: 'A história das EXPOs do Fórum Pan-Americano da Inovação: da fundação em Belo Horizonte, em 2017, à sede da ONU em Nova York e a Boston, até o HUB PAN.',
  },
  'forum-mundial-ia': {
    title: 'Fórum Mundial de Inteligência Artificial — Cambridge 2027',
    description: 'O Fórum Mundial de Inteligência Artificial reúne players globais de IA, policy makers, pesquisadores e investidores em Cambridge, Massachusetts, em 2027.',
  },
  insights: {
    title: 'HUB PAN Insights — Observatório de IA e Inovação',
    description: 'Observatório de IA e conteúdo do HUB PAN: pesquisas, artigos e relatórios sobre inovação, inteligência artificial, governança e cooperação internacional.',
  },
  contato: {
    title: 'Contato — Fale com o HUB PAN e Conecte-se',
    description: 'Fale com o HUB PAN: seja qual for seu perfil — governo, empresa, educador ou parceiro — encontre o caminho certo pra se conectar à infraestrutura.',
  },
  glossario: {
    title: 'Glossário HUB PAN — Conceitos de Inovação, IA e Impacto',
    description: 'Glossário HUB PAN: definições claras dos conceitos centrais de inovação, IA, governança e impacto — pra qualquer pessoa entender o que fazemos e por quê.',
  },
  imprensa: {
    title: 'Imprensa & Mídia — Press Kit Oficial do HUB PAN',
    description: 'Press kit oficial do HUB PAN pra jornalistas e pesquisadores: dados do Observatório de IA, releases institucionais e contato com a assessoria.',
  },
  'casos-de-uso': {
    title: 'Casos de Uso do HUB PAN — Resultados Reais',
    description: 'Casos de uso do HUB PAN: resultados reais de professoras da rede pública, prefeituras e startups que já viveram o que propomos.',
  },
};
