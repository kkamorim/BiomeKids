/**
 * 🦁 ZOOKIDS — Catálogo Completo de Dados do Jogo
 * 
 * Fonte de verdade local para animais, biomas, quizzes, itens da loja e eventos.
 * O backend é a fonte de verdade persistente, mas este arquivo serve de fallback
 * offline e reduz chamadas de rede para dados estáticos.
 */

// ==============================================================================
// 1. BIOMAS E SEUS ANIMAIS
// ==============================================================================

export const BIOMES = [
  {
    id: 1,
    nome: 'PANTANAL',
    slug: 'pantanal',
    rota: 'Territorio1',
    cor: '#2E7D32',
    corSecundaria: '#81C784',
    imagem: require('../../assets/Pantanal.png'),
  },
  {
    id: 2,
    nome: 'AMAZÔNIA',
    slug: 'amazonia',
    rota: 'Territorio2',
    cor: '#1B5E20',
    corSecundaria: '#66BB6A',
    imagem: require('../../assets/Amazonia.png'),
  },
  {
    id: 3,
    nome: 'CERRADO',
    slug: 'cerrado',
    rota: 'Territorio3',
    cor: '#E65100',
    corSecundaria: '#FFB74D',
    imagem: require('../../assets/Cerrado.png'),
  },
  {
    id: 4,
    nome: 'CAATINGA',
    slug: 'caatinga',
    rota: 'Territorio4',
    cor: '#BF360C',
    corSecundaria: '#FFAB91',
    imagem: require('../../assets/Caatinga.png'),
  },
  {
    id: 5,
    nome: 'MATA ATLÂNTICA',
    slug: 'mata_atlantica',
    rota: 'Territorio5',
    cor: '#004D40',
    corSecundaria: '#80CBC4',
    imagem: require('../../assets/MataAtlantica.png'),
  },
  {
    id: 6,
    nome: 'PAMPA',
    slug: 'pampa',
    rota: 'Territorio6',
    cor: '#558B2F',
    corSecundaria: '#AED581',
    imagem: require('../../assets/Pampa.png'),
  },
];

// Catálogo de animais por bioma — cada animal tem quizzes e livros associados
export const ANIMALS = {
  // ─── PANTANAL (Territorio 1) ───
  1: [
    {
      id: 'pantanal_onca_pintada',
      nome: 'Onça-Pintada',
      nomeCientifico: 'Panthera onca',
      imagem: require('../../assets/onça_pintada.png'),
      descricao: '🌳 Vive em florestas densas e perto de rios.\n🦌 Alimenta-se de capivaras, veados e peixes.\n🌊 É uma excelente nadadora e caçadora solitária.',
      dieta: 'Carnívora — capivaras, veados, jacarés e peixes.',
      curiosidade: 'A mordida da onça-pintada é a mais forte entre todos os felinos do mundo!',
      evolucaoXP: { baby: 0, juvenile: 50, adult: 120 },
    },
    {
      id: 'pantanal_onca_parda',
      nome: 'Onça-Parda',
      nomeCientifico: 'Puma concolor',
      imagem: require('../../assets/onça_parda.png'),
      descricao: '🏔️ Habita montanhas, florestas e campos abertos.\n🦃 Alimenta-se de animais pequenos e médios.\n🌙 Caça principalmente ao entardecer e à noite.',
      dieta: 'Carnívora — pequenos mamíferos, aves e répteis.',
      curiosidade: 'A onça-parda também é chamada de suçuarana e é o segundo maior felino das Américas!',
      evolucaoXP: { baby: 0, juvenile: 50, adult: 120 },
    },
    {
      id: 'pantanal_jacare',
      nome: 'Jacaré',
      nomeCientifico: 'Caiman yacare',
      imagem: require('../../assets/jacare.png'),
      descricao: '🌿 Vive em rios, lagos e pântanos.\n🐟 Alimenta-se de peixes, aves e pequenos mamíferos.\n☀️ Passa horas tomando sol nas margens.',
      dieta: 'Carnívora — peixes, moluscos, crustáceos e aves.',
      curiosidade: 'O Pantanal tem a maior concentração de jacarés do mundo: mais de 10 milhões!',
      evolucaoXP: { baby: 0, juvenile: 40, adult: 100 },
    },
    {
      id: 'pantanal_cagado',
      nome: 'Cágado',
      nomeCientifico: 'Mesoclemmys vanderhaegei',
      imagem: require('../../assets/cágado.png'),
      descricao: '🏞️ Mora em rios, lagoas e brejos de água doce.\n🍃 Come frutas, folhas e pequenos insetos.\n🐢 Tem casco leve e gosta de nadar devagar.',
      dieta: 'Onívora — frutas, folhas, insetos e pequenos peixes.',
      curiosidade: 'Diferente das tartarugas, o cágado vive em água doce e tem pescoço retrátil lateral!',
      evolucaoXP: { baby: 0, juvenile: 35, adult: 85 },
    },
    {
      id: 'pantanal_elefante',
      nome: 'Elefante',
      nomeCientifico: 'Loxodonta africana',
      imagem: require('../../assets/elefante.png'),
      descricao: '🌾 Vive em savanas, florestas e áreas abertas.\n🍃 Alimenta-se de folhas, frutos e cascas de árvores.\n👨‍👩‍👧‍👦 Vive em grupos familiares liderados por uma fêmea.',
      dieta: 'Herbívora — folhas, frutos, cascas e raízes. Come até 150kg por dia!',
      curiosidade: 'Elefantes conseguem se reconhecer no espelho e sentem empatia por outros animais!',
      evolucaoXP: { baby: 0, juvenile: 60, adult: 140 },
    },
    {
      id: 'pantanal_flamingo',
      nome: 'Flamingo',
      nomeCientifico: 'Phoenicopterus roseus',
      imagem: require('../../assets/flamingo.png'),
      descricao: '🏖️ Habita lagos rasos e águas salgadas.\n🦐 Come pequenos camarões e algas.\n💃 Vive em grandes grupos e realiza "danças" coletivas.',
      dieta: 'Onívora — camarões, algas e larvas de insetos aquáticos.',
      curiosidade: 'A cor rosa do flamingo vem dos pigmentos dos camarões que ele come!',
      evolucaoXP: { baby: 0, juvenile: 40, adult: 100 },
    },
  ],
};

// ==============================================================================
// 2. QUIZZES POR ESPÉCIE
// ==============================================================================

export const QUIZZES = {
  pantanal_onca_pintada: [
    {
      id: 'quiz_onca_pintada_1',
      titulo: 'Dieta da Onça-Pintada',
      perguntas: [
        {
          pergunta: 'Do que a onça-pintada se alimenta principalmente?',
          opcoes: ['Frutas e folhas', 'Capivaras, veados e peixes', 'Insetos e sementes', 'Apenas peixes'],
          correta: 1,
          explicacao: 'A onça-pintada é carnívora e caça capivaras, veados, jacarés e até peixes!',
        },
        {
          pergunta: 'Qual a principal habilidade da onça-pintada na natureza?',
          opcoes: ['Voar longas distâncias', 'Nadar muito bem', 'Escalar montanhas', 'Correr a 120km/h'],
          correta: 1,
          explicacao: 'A onça-pintada é uma excelente nadadora e frequentemente caça dentro da água!',
        },
        {
          pergunta: 'Onde a onça-pintada costuma viver?',
          opcoes: ['Desertos secos', 'Florestas densas perto de rios', 'Topos de montanhas', 'Cavernas subterrâneas'],
          correta: 1,
          explicacao: 'Ela prefere florestas densas com acesso a rios e lagos para caçar.',
        },
        {
          pergunta: 'A onça-pintada é um animal solitário ou vive em bandos?',
          opcoes: ['Vive em bandos de 20', 'É solitária', 'Vive em pares', 'Vive em famílias de 5'],
          correta: 1,
          explicacao: 'A onça-pintada é solitária — cada uma tem seu próprio território!',
        },
      ],
      recompensaXP: 30,
    },
  ],
  pantanal_onca_parda: [
    {
      id: 'quiz_onca_parda_1',
      titulo: 'Conhecendo a Onça-Parda',
      perguntas: [
        {
          pergunta: 'Qual é outro nome popular da onça-parda?',
          opcoes: ['Tigre', 'Suçuarana', 'Leopardo', 'Guepardo'],
          correta: 1,
          explicacao: 'A onça-parda também é chamada de suçuarana, puma ou leão-da-montanha.',
        },
        {
          pergunta: 'Em que período do dia a onça-parda costuma caçar?',
          opcoes: ['De manhã cedo', 'Ao meio-dia', 'Ao entardecer e à noite', 'Nunca caça'],
          correta: 2,
          explicacao: 'A onça-parda é mais ativa ao entardecer e durante a noite.',
        },
        {
          pergunta: 'Onde a onça-parda pode ser encontrada?',
          opcoes: ['Apenas no mar', 'Montanhas, florestas e campos', 'Apenas em zoológicos', 'Apenas na neve'],
          correta: 1,
          explicacao: 'É um dos felinos mais adaptáveis, vivendo em montanhas, florestas e campos.',
        },
      ],
      recompensaXP: 25,
    },
  ],
  pantanal_jacare: [
    {
      id: 'quiz_jacare_1',
      titulo: 'Jacaré do Pantanal',
      perguntas: [
        {
          pergunta: 'Quantos jacarés existem no Pantanal aproximadamente?',
          opcoes: ['Mil', 'Cem mil', 'Mais de 10 milhões', 'Apenas 50'],
          correta: 2,
          explicacao: 'O Pantanal é lar de mais de 10 milhões de jacarés — a maior concentração do mundo!',
        },
        {
          pergunta: 'O que o jacaré faz por horas nas margens dos rios?',
          opcoes: ['Dorme profundamente', 'Toma sol', 'Brinca com outros jacarés', 'Cava buracos'],
          correta: 1,
          explicacao: 'Jacarés são répteis de sangue frio e precisam do sol para regular sua temperatura.',
        },
        {
          pergunta: 'Do que o jacaré se alimenta?',
          opcoes: ['Apenas plantas', 'Peixes, aves e pequenos mamíferos', 'Apenas frutas', 'Pedras e areia'],
          correta: 1,
          explicacao: 'O jacaré é carnívoro e se alimenta de peixes, aves e pequenos mamíferos.',
        },
      ],
      recompensaXP: 25,
    },
  ],
  pantanal_cagado: [
    {
      id: 'quiz_cagado_1',
      titulo: 'O Cágado de Água Doce',
      perguntas: [
        {
          pergunta: 'Qual a diferença entre cágado e tartaruga?',
          opcoes: ['São a mesma coisa', 'O cágado vive em água doce', 'A tartaruga é menor', 'O cágado voa'],
          correta: 1,
          explicacao: 'O cágado vive em água doce (rios e lagoas), enquanto tartarugas marinhas vivem no mar.',
        },
        {
          pergunta: 'O que o cágado come?',
          opcoes: ['Apenas carne', 'Frutas, folhas e insetos', 'Apenas pedras', 'Nada, ele faz fotossíntese'],
          correta: 1,
          explicacao: 'O cágado é onívoro e come frutas, folhas e pequenos insetos.',
        },
        {
          pergunta: 'Como o cágado recolhe o pescoço para dentro do casco?',
          opcoes: ['Para trás (reto)', 'De lado (lateral)', 'Ele não recolhe', 'Girando em círculos'],
          correta: 1,
          explicacao: 'O cágado recolhe o pescoço lateralmente, diferente das tartarugas que recolhem reto.',
        },
      ],
      recompensaXP: 20,
    },
  ],
  pantanal_elefante: [
    {
      id: 'quiz_elefante_1',
      titulo: 'O Gigante Gentil',
      perguntas: [
        {
          pergunta: 'Quanto um elefante come por dia?',
          opcoes: ['5 kg', '30 kg', 'Até 150 kg', '500 kg'],
          correta: 2,
          explicacao: 'Um elefante adulto come cerca de 150 kg de vegetação por dia!',
        },
        {
          pergunta: 'Quem lidera o grupo familiar de elefantes?',
          opcoes: ['O macho mais forte', 'A fêmea mais velha', 'O filhote mais novo', 'Não há líder'],
          correta: 1,
          explicacao: 'Os grupos de elefantes são matriarcais — liderados pela fêmea mais velha e experiente.',
        },
        {
          pergunta: 'Os elefantes conseguem se reconhecer no espelho?',
          opcoes: ['Sim!', 'Não', 'Apenas os bebês', 'Apenas quando treinados'],
          correta: 0,
          explicacao: 'Sim! Elefantes são um dos poucos animais que passam no teste do espelho — sinal de autoconsciência.',
        },
      ],
      recompensaXP: 25,
    },
  ],
  pantanal_flamingo: [
    {
      id: 'quiz_flamingo_1',
      titulo: 'O Dançarino Rosa',
      perguntas: [
        {
          pergunta: 'Por que os flamingos são cor-de-rosa?',
          opcoes: ['Nascem assim', 'Por causa dos camarões que comem', 'Tingem as penas', 'Por causa do sol'],
          correta: 1,
          explicacao: 'Os pigmentos carotenoides dos camarões e algas dão a cor rosa às penas!',
        },
        {
          pergunta: 'Como os flamingos se alimentam?',
          opcoes: ['Mergulham fundo na água', 'Filtram a água com o bico', 'Caçam peixes grandes', 'Comem no chão'],
          correta: 1,
          explicacao: 'Flamingos têm um bico especial que funciona como filtro para pegar pequenos organismos da água.',
        },
        {
          pergunta: 'O que os flamingos fazem em grupo?',
          opcoes: ['Dormem sempre', 'Danças coletivas', 'Brigam entre si', 'Constroem casas'],
          correta: 1,
          explicacao: 'Flamingos são conhecidos por suas "danças" coletivas, que servem para socializar e escolher parceiros.',
        },
      ],
      recompensaXP: 20,
    },
  ],
};

// ==============================================================================
// 3. LIVROS EDUCATIVOS POR ESPÉCIE
// ==============================================================================

export const BOOKS = {
  pantanal_onca_pintada: [
    {
      id: 'book_onca_1',
      titulo: 'Habitat da Onça-Pintada',
      conteudo: 'A onça-pintada (Panthera onca) é o maior felino das Américas. Ela vive em florestas tropicais densas, especialmente perto de rios e lagoas. O Pantanal brasileiro é um dos últimos grandes refúgios para essa espécie magnífica.\n\nDiferente de outros felinos, a onça-pintada ama a água! Ela é uma excelente nadadora e frequentemente caça dentro de rios e lagos.',
      xpRecompensa: 15,
    },
    {
      id: 'book_onca_2',
      titulo: 'A Caça e a Mordida',
      conteudo: 'A mordida da onça-pintada é a mais poderosa entre todos os felinos do mundo! Com ela, consegue perfurar até cascos de tartarugas e crânios de jacarés.\n\nEla é uma caçadora solitária e noturna, usando emboscadas silenciosas para pegar suas presas de surpresa.',
      xpRecompensa: 15,
    },
    {
      id: 'book_onca_3',
      titulo: 'Conservação da Onça',
      conteudo: 'A onça-pintada está ameaçada de extinção no Brasil. As principais ameaças são o desmatamento, que destrói seu habitat, e o conflito com fazendeiros.\n\nProjetos como o "Onçafari" no Pantanal trabalham para proteger esses animais através do ecoturismo e da educação ambiental.',
      xpRecompensa: 20,
    },
  ],
  // Livros simplificados para os outros animais
  pantanal_onca_parda: [
    { id: 'book_parda_1', titulo: 'A Onça-Parda na Natureza', conteudo: 'A onça-parda, ou suçuarana, é o segundo maior felino das Américas. Ao contrário da onça-pintada, ela não tem manchas — seu pelo é uniforme, de cor parda.\n\nEla é incrivelmente adaptável e pode viver em montanhas, florestas, cerrados e até áreas próximas a cidades.', xpRecompensa: 15 },
    { id: 'book_parda_2', titulo: 'Caçadora Silenciosa', conteudo: 'A onça-parda caça ao entardecer e à noite, usando sua visão noturna aguçada. Ela se alimenta de veados, tatus, pacas e até aves.\n\nApesar de grande, ela é tímida e evita encontros com humanos sempre que possível.', xpRecompensa: 15 },
  ],
  pantanal_jacare: [
    { id: 'book_jacare_1', titulo: 'O Rei dos Rios', conteudo: 'O jacaré-do-pantanal (Caiman yacare) é um dos répteis mais abundantes do Brasil. No Pantanal, existem mais de 10 milhões deles!\n\nEles são animais de sangue frio e precisam tomar sol para regular sua temperatura corporal.', xpRecompensa: 15 },
    { id: 'book_jacare_2', titulo: 'O Jacaré e o Ecossistema', conteudo: 'Jacarés são fundamentais para o equilíbrio do Pantanal. Eles controlam a população de peixes e outros animais, mantendo o ecossistema saudável.\n\nSeus ninhos abandonados servem de abrigo para tartarugas e outros répteis.', xpRecompensa: 15 },
  ],
  pantanal_cagado: [
    { id: 'book_cagado_1', titulo: 'Cágado: O Nadador', conteudo: 'O cágado é um réptil de água doce que vive em rios, lagoas e brejos. Diferente das tartarugas marinhas, ele tem patas com membranas para nadar em águas calmas.\n\nEle recolhe o pescoço de lado para dentro do casco — uma característica única!', xpRecompensa: 15 },
  ],
  pantanal_elefante: [
    { id: 'book_elefante_1', titulo: 'O Gigante Inteligente', conteudo: 'Elefantes são os maiores animais terrestres do mundo e um dos mais inteligentes! Eles têm memória excepcional, sentem empatia e até choram quando perdem um companheiro.\n\nVivem em grupos familiares liderados pela fêmea mais velha, chamada matriarca.', xpRecompensa: 15 },
    { id: 'book_elefante_2', titulo: 'Ecologia do Elefante', conteudo: 'Elefantes são "engenheiros do ecossistema" — ao derrubar árvores e cavar poços, eles criam habitats para dezenas de outras espécies.\n\nUm elefante bebe até 200 litros de água por dia e come cerca de 150 kg de vegetação!', xpRecompensa: 15 },
  ],
  pantanal_flamingo: [
    { id: 'book_flamingo_1', titulo: 'A Vida em Rosa', conteudo: 'Flamingos nascem brancos ou cinzas! A cor rosa só aparece depois que começam a comer camarões e algas ricos em pigmentos carotenoides.\n\nEles vivem em colônias enormes — às vezes com milhares de indivíduos — e fazem "danças" sincronizadas para atrair parceiros.', xpRecompensa: 15 },
  ],
};

// ==============================================================================
// 4. EVENTOS DE CRISE POR BIOMA
// ==============================================================================

export const CRISIS_EVENTS = {
  1: [ // Pantanal
    {
      tipo: 'polluted_river',
      titulo: '🏭 Rio Poluído!',
      descricao: 'O rio do Pantanal está com a água contaminada! Os jacarés e peixes estão em perigo.',
      resolucaoTipo: 'quiz',
      quizTopico: 'filtração de água',
      perguntasResolucao: [
        {
          pergunta: 'Qual processo natural ajuda a filtrar a água dos rios?',
          opcoes: ['Evaporação', 'Filtragem pelas raízes das plantas', 'Congelamento', 'Aquecimento solar'],
          correta: 1,
          explicacao: 'As raízes das plantas aquáticas e ripárias filtram poluentes da água naturalmente!',
        },
        {
          pergunta: 'O que podemos fazer para proteger os rios?',
          opcoes: ['Jogar mais lixo', 'Não usar agrotóxicos perto deles', 'Desviar toda a água', 'Nada, eles se limpam sozinhos'],
          correta: 1,
          explicacao: 'Evitar agrotóxicos e resíduos perto dos rios é essencial para manter a água limpa.',
        },
      ],
      recompensaMoedas: 3,
      recompensaXP: 25,
    },
    {
      tipo: 'drought',
      titulo: '☀️ Seca Severa!',
      descricao: 'O nível da água no Pantanal caiu drasticamente! Os animais estão com sede.',
      resolucaoTipo: 'quiz',
      quizTopico: 'ciclo da água',
      perguntasResolucao: [
        {
          pergunta: 'O que causa a seca prolongada no Pantanal?',
          opcoes: ['Muita chuva', 'Desmatamento e mudanças climáticas', 'Presença de jacarés', 'Ventos fortes'],
          correta: 1,
          explicacao: 'O desmatamento reduz a umidade do ar e as chuvas, causando secas cada vez mais longas.',
        },
        {
          pergunta: 'Como os animais se adaptam à seca?',
          opcoes: ['Migram para áreas com água', 'Ficam onde estão sem fazer nada', 'Constroem piscinas', 'Param de beber água'],
          correta: 0,
          explicacao: 'Durante secas, muitos animais migram para áreas onde ainda há rios e lagoas com água.',
        },
      ],
      recompensaMoedas: 3,
      recompensaXP: 25,
    },
  ],
};

// ==============================================================================
// 5. NÍVEIS DE ESCOTEIRO
// ==============================================================================

export const SCOUT_LEVELS = [
  { level: 1, title: 'Escoteiro Iniciante', xpRequired: 0, icon: '🌱' },
  { level: 2, title: 'Explorador Curioso', xpRequired: 100, icon: '🔍' },
  { level: 3, title: 'Rastreador de Trilhas', xpRequired: 300, icon: '🐾' },
  { level: 4, title: 'Guardião da Fauna', xpRequired: 600, icon: '🦁' },
  { level: 5, title: 'Cientista Júnior', xpRequired: 1000, icon: '🧪' },
  { level: 6, title: 'Biólogo de Campo', xpRequired: 1600, icon: '🔬' },
  { level: 7, title: 'Protetor dos Biomas', xpRequired: 2500, icon: '🌿' },
  { level: 8, title: 'Mestre da Natureza', xpRequired: 4000, icon: '🏆' },
  { level: 9, title: 'Lenda do Pantanal', xpRequired: 6000, icon: '⭐' },
  { level: 10, title: 'Guardião Supremo', xpRequired: 10000, icon: '👑' },
];

// ==============================================================================
// 6. CATEGORIAS DA LOJA
// ==============================================================================

export const SHOP_CATEGORIES = [
  { id: 'food_rare', nome: '🍎 Alimentos Raros', icone: 'nutrition', cor: '#E53935' },
  { id: 'seed', nome: '🌱 Sementes Exóticas', icone: 'leaf', cor: '#43A047' },
  { id: 'accessory', nome: '🎩 Acessórios', icone: 'glasses', cor: '#8E24AA' },
  { id: 'automation', nome: '⚙️ Automação', icone: 'cog', cor: '#1565C0' },
  { id: 'potion', nome: '🧪 Poções', icone: 'flask', cor: '#F57C00' },
];

// ==============================================================================
// 7. HELPERS
// ==============================================================================

/**
 * Calcula o nível do escoteiro com base no XP total
 */
export function getScoutLevel(xp) {
  let currentLevel = SCOUT_LEVELS[0];
  for (const level of SCOUT_LEVELS) {
    if (xp >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

/**
 * Calcula XP necessário para o próximo nível
 */
export function getXPToNextLevel(xp) {
  const currentLevel = getScoutLevel(xp);
  const nextLevel = SCOUT_LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return { current: xp, needed: 0, total: 0, progress: 1 };

  const xpIntoLevel = xp - currentLevel.xpRequired;
  const xpNeeded = nextLevel.xpRequired - currentLevel.xpRequired;
  return {
    current: xpIntoLevel,
    needed: xpNeeded - xpIntoLevel,
    total: xpNeeded,
    progress: xpIntoLevel / xpNeeded,
  };
}

/**
 * Retorna o estágio de evolução baseado no XP de pesquisa
 */
export function getEvolutionStage(researchXP, thresholds) {
  if (researchXP >= thresholds.adult) return 'adult';
  if (researchXP >= thresholds.juvenile) return 'juvenile';
  if (researchXP >= thresholds.baby) return 'baby';
  return 'egg';
}

/**
 * Retorna emoji e label para cada estágio de evolução
 */
export function getEvolutionInfo(stage) {
  const info = {
    egg: { emoji: '🥚', label: 'Ovo', cor: '#90A4AE' },
    baby: { emoji: '🐣', label: 'Filhote', cor: '#FFD54F' },
    juvenile: { emoji: '🦊', label: 'Juvenil', cor: '#4FC3F7' },
    adult: { emoji: '🦁', label: 'Adulto', cor: '#66BB6A' },
  };
  return info[stage] || info.egg;
}
