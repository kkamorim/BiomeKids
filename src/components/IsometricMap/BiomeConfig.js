/**
 * Dicionário de Configuração dos Biomas (BiomeConfig.js)
 * Define propriedades visuais, paleta, entidades 2.5D (Fauna/Flora/Estruturas)
 * e lotes de construção interativos para o Diorama Isométrico do BiomeKids.
 */

export const BIOMES_CONFIG = {
  // 1. PANTANAL
  'pantanal': {
    id: 'pantanal',
    numericId: 1,
    nome: 'PANTANAL',
    subtitulo: 'A maior planície alagável do planeta com fauna abundante',
    baseImage: require('../../../assets/Pantanal.png'),
    skyColors: ['#E0F7FA', '#B2EBF2'],
    accentColor: '#00838F',
    baseColor: '#4A5D23',
    surfaceColor: '#6F8F3D',
    waterColor: '#00ACC1',
    hasWetlandSplit: true,
    foliageType: 'wetland',
    initialEntities: [
      {
        id: 'pan_capivara',
        type: 'animal',
        name: 'Capivara',
        subtitle: 'O maior roedor do mundo, adora nadar!',
        image: require('../../../assets/Pantanal.png'),
        emoji: '🦫',
        bubble: '🍎',
        x: 48, // porcentagem X no diorama
        y: 62, // porcentagem Y no diorama
        scale: 1,
      },
      {
        id: 'pan_tuiuiu',
        type: 'animal',
        name: 'Tuiuiú (Jabiru)',
        subtitle: 'Ave símbolo do Pantanal com ninho gigante',
        image: require('../../../assets/aveTuiuiú.png'),
        emoji: '🕊️',
        bubble: '💧',
        x: 72,
        y: 50,
        scale: 1.1,
      },
      {
        id: 'pan_jacare',
        type: 'animal',
        name: 'Jacaré-do-Pantanal',
        subtitle: 'Passa horas tomando sol nas margens',
        image: require('../../../assets/jacare.png'),
        emoji: '🐊',
        bubble: '💚',
        x: 24,
        y: 72,
        scale: 0.95,
      },
    ],
    structures: [
      {
        id: 'struct_vet',
        name: 'Posto de Resgate Veterinário',
        desc: 'Reabilita animais feridos do Pantanal',
        icon: '🏥',
        x: 82,
        y: 28,
      },
      {
        id: 'struct_bridge',
        name: 'Passarela Suspensa de Madeira',
        desc: 'Permite aos escoteiros observarem o brejo',
        icon: '🪵',
        x: 52,
        y: 38,
      },
    ],
    flora: [
      { id: 'f1', name: 'Vitória-Régia', icon: '🪷', x: 38, y: 78 },
      { id: 'f2', name: 'Figueira Pantaneira', icon: '🌳', x: 18, y: 32 },
    ],
    buildPlots: [
      { id: 'plot_1', x: 28, y: 52, label: 'Lote Livre 1' },
      { id: 'plot_2', x: 68, y: 72, label: 'Lote Livre 2' },
      { id: 'plot_3', x: 80, y: 46, label: 'Lote Livre 3' },
    ],
  },

  // 2. AMAZÔNIA
  'amazonia': {
    id: 'amazonia',
    numericId: 2,
    nome: 'AMAZÔNIA',
    subtitulo: 'A maior floresta tropical do mundo cortada por rios majestosos',
    baseImage: require('../../../assets/Amazonia.png'),
    skyColors: ['#E8F5E9', '#C8E6C9'],
    accentColor: '#1B5E20',
    baseColor: '#174D2C',
    surfaceColor: '#2D7A46',
    waterColor: '#0288D1',
    hasRiver: true,
    foliageType: 'rainforest',
    initialEntities: [
      {
        id: 'amz_tucano',
        type: 'animal',
        name: 'Tucano-Toco',
        subtitle: 'Bico longo e colorido para colher frutas',
        image: require('../../../assets/Amazonia.png'),
        emoji: '🦜',
        bubble: '🍎',
        x: 76,
        y: 34,
        scale: 1,
      },
      {
        id: 'amz_onca',
        type: 'animal',
        name: 'Onça-Pintada',
        subtitle: 'O maior felino das Américas, excelente nadadora',
        image: require('../../../assets/onça_pintada.png'),
        emoji: '🐆',
        bubble: '💚',
        x: 48,
        y: 65,
        scale: 1.1,
      },
    ],
    structures: [
      {
        id: 'struct_tower',
        name: 'Torre de Observação do Dossel',
        desc: 'Vigilância ecológica no topo das árvores',
        icon: '🔭',
        x: 20,
        y: 32,
      },
      {
        id: 'struct_greenhouse',
        name: 'Viveiro de Mudas Nativas',
        desc: 'Cultivo de sementes da floresta',
        icon: '🌱',
        x: 82,
        y: 58,
      },
    ],
    flora: [
      { id: 'f3', name: 'Castanheira Gigante', icon: '🌳', x: 22, y: 55 },
      { id: 'f4', name: 'Vitória-Régia do Rio', icon: '🪷', x: 50, y: 76 },
    ],
    buildPlots: [
      { id: 'plot_1', x: 30, y: 68, label: 'Lote Livre 1' },
      { id: 'plot_2', x: 68, y: 70, label: 'Lote Livre 2' },
      { id: 'plot_3', x: 80, y: 40, label: 'Lote Livre 3' },
    ],
  },

  // 3. CERRADO
  'cerrado': {
    id: 'cerrado',
    numericId: 3,
    nome: 'CERRADO',
    subtitulo: 'A savana brasileira com árvores retorcidas e riquíssima biodiversidade',
    baseImage: require('../../../assets/Cerrado.png'),
    skyColors: ['#FFF3E0', '#FFE0B2'],
    accentColor: '#E65100',
    baseColor: '#8D6E3B',
    surfaceColor: '#C9954A',
    waterColor: '#29B6F6',
    foliageType: 'savanna',
    initialEntities: [
      {
        id: 'cer_lobo',
        type: 'animal',
        name: 'Lobo-Guará',
        subtitle: 'Pernas longas e elegantes para caminhar na relva',
        image: require('../../../assets/Cerrado.png'),
        emoji: '🦊',
        bubble: '🍎',
        x: 32,
        y: 56,
        scale: 1,
      },
      {
        id: 'cer_tamandua',
        type: 'animal',
        name: 'Tamanduá-Bandeira',
        subtitle: 'Focinho comprido para encontrar formigas',
        image: require('../../../assets/tamandua.jpg'),
        emoji: '🐾',
        bubble: '💧',
        x: 65,
        y: 64,
        scale: 0.95,
      },
    ],
    structures: [
      {
        id: 'struct_fire',
        name: 'Posto de Prevenção de Queimadas',
        desc: 'Proteção contra incêndios no período seco',
        icon: '🚒',
        x: 80,
        y: 35,
      },
      {
        id: 'struct_pond',
        name: 'Bebedouro Natural de Fauna',
        desc: 'Fonte de água fresca para os animais',
        icon: '💧',
        x: 52,
        y: 70,
      },
    ],
    flora: [
      { id: 'f5', name: 'Ipê-Amarelo Florido', icon: '🌲', x: 22, y: 38 },
      { id: 'f6', name: 'Pequizeiro do Cerrado', icon: '🌳', x: 78, y: 55 },
    ],
    buildPlots: [
      { id: 'plot_1', x: 24, y: 68, label: 'Lote Livre 1' },
      { id: 'plot_2', x: 74, y: 70, label: 'Lote Livre 2' },
      { id: 'plot_3', x: 48, y: 44, label: 'Lote Livre 3' },
    ],
  },

  // 4. CAATINGA
  'caatinga': {
    id: 'caatinga',
    numericId: 4,
    nome: 'CAATINGA',
    subtitulo: 'Bioma exclusivamente brasileiro, berço de cactos e espécies resistentes',
    baseImage: require('../../../assets/Caatinga.png'),
    skyColors: ['#FFFDE7', '#FFF9C4'],
    accentColor: '#BF360C',
    baseColor: '#8C5A32',
    surfaceColor: '#D4A373',
    waterColor: '#26C6DA',
    hasDunes: true,
    foliageType: 'dryland',
    initialEntities: [
      {
        id: 'caa_asabranca',
        type: 'animal',
        name: 'Asa-Branca',
        subtitle: 'Pomba sertaneja símbolo da resistência nordestina',
        image: require('../../../assets/asaBranca.jpg'),
        emoji: '🕊️',
        bubble: '🌾',
        x: 52,
        y: 32,
        scale: 1,
      },
      {
        id: 'caa_lagarto',
        type: 'animal',
        name: 'Lagarto Teiú',
        subtitle: 'Ágil e veloz nas pedras e solo seco',
        image: require('../../../assets/Caatinga.png'),
        emoji: '🦎',
        bubble: '💚',
        x: 35,
        y: 62,
        scale: 0.95,
      },
    ],
    structures: [
      {
        id: 'struct_cistern',
        name: 'Cisterna Comunitária Ecológica',
        desc: 'Captação e conservação de água da chuva',
        icon: '🚰',
        x: 78,
        y: 42,
      },
      {
        id: 'struct_solar',
        name: 'Painel Solar do Santuário',
        desc: 'Energia limpa para a base dos escoteiros',
        icon: '☀️',
        x: 20,
        y: 48,
      },
    ],
    flora: [
      { id: 'f7', name: 'Mandacaru Gigante', icon: '🌵', x: 26, y: 35 },
      { id: 'f8', name: 'Xique-Xique em Flor', icon: '🌵', x: 74, y: 65 },
    ],
    buildPlots: [
      { id: 'plot_1', x: 50, y: 70, label: 'Lote Livre 1' },
      { id: 'plot_2', x: 70, y: 55, label: 'Lote Livre 2' },
      { id: 'plot_3', x: 25, y: 65, label: 'Lote Livre 3' },
    ],
  },

  // 5. MATA ATLÂNTICA
  'mata-atlantica': {
    id: 'mata-atlantica',
    numericId: 5,
    nome: 'MATA ATLÂNTICA',
    subtitulo: 'Florestas costeiras com montanhas, bromélias e cachoeiras',
    baseImage: require('../../../assets/MataAtlantica.png'),
    skyColors: ['#E0F2F1', '#B2DFDB'],
    accentColor: '#004D40',
    baseColor: '#184E3A',
    surfaceColor: '#2D6A4F',
    waterColor: '#00ACC1',
    hasRiver: true,
    foliageType: 'rainforest',
    initialEntities: [
      {
        id: 'mat_mico',
        type: 'animal',
        name: 'Mico-Leão-Dourado',
        subtitle: 'Símbolo internacional da conservação brasileira',
        image: require('../../../assets/micoLeao.jpeg'),
        emoji: '🐒',
        bubble: '🍌',
        x: 35,
        y: 35,
        scale: 1,
      },
      {
        id: 'mat_tucano',
        type: 'animal',
        name: 'Tucano-de-Bico-Verde',
        subtitle: 'Habitante das copas altas das montanhas',
        image: require('../../../assets/MataAtlantica.png'),
        emoji: '🦜',
        bubble: '💧',
        x: 78,
        y: 32,
        scale: 1,
      },
    ],
    structures: [
      {
        id: 'struct_vet2',
        name: 'Centro de Triagem e Reabilitação',
        desc: 'Proteção às espécies de primatas',
        icon: '🏥',
        x: 20,
        y: 50,
      },
      {
        id: 'struct_viewpoint',
        name: 'Mirante das Cachoeiras',
        desc: 'Ponto turístico e educativo do parque',
        icon: '🔭',
        x: 75,
        y: 55,
      },
    ],
    flora: [
      { id: 'f9', name: 'Palmito Juçara', icon: '🌴', x: 48, y: 62 },
      { id: 'f10', name: 'Bromélia Imperial', icon: '🌺', x: 28, y: 72 },
    ],
    buildPlots: [
      { id: 'plot_1', x: 42, y: 74, label: 'Lote Livre 1' },
      { id: 'plot_2', x: 65, y: 68, label: 'Lote Livre 2' },
      { id: 'plot_3', x: 82, y: 44, label: 'Lote Livre 3' },
    ],
  },

  // 6. PAMPA
  'pampa': {
    id: 'pampa',
    numericId: 6,
    nome: 'PAMPA',
    subtitulo: 'Coxilhas verdes onduladas, arroios cristalinos e campos abertos',
    baseImage: require('../../../assets/Pampa.png'),
    skyColors: ['#F1F8E9', '#DCEDC8'],
    accentColor: '#33691E',
    baseColor: '#456B2F',
    surfaceColor: '#79A84B',
    waterColor: '#42A5F5',
    foliageType: 'grassland',
    initialEntities: [
      {
        id: 'pam_ema',
        type: 'animal',
        name: 'Ema Campeira',
        subtitle: 'A maior ave das Américas, corre em grande velocidade',
        image: require('../../../assets/Pampa.png'),
        emoji: '🦤',
        bubble: '🌾',
        x: 34,
        y: 54,
        scale: 1.1,
      },
      {
        id: 'pam_veado',
        type: 'animal',
        name: 'Veado-Campeiro',
        subtitle: 'Gracioso herbívoro dos campos do sul',
        image: require('../../../assets/Pampa.png'),
        emoji: '🦌',
        bubble: '💧',
        x: 76,
        y: 42,
        scale: 1,
      },
    ],
    structures: [
      {
        id: 'struct_windmill',
        name: 'Catavento Ecológico de Água',
        desc: 'Gera energia eólica para bombear água limpa',
        icon: '💨',
        x: 82,
        y: 28,
      },
      {
        id: 'struct_ranch',
        name: 'Rancho do Guarda do Parque',
        desc: 'Base de apoio para patrulha dos pampas',
        icon: '⛺',
        x: 18,
        y: 42,
      },
    ],
    flora: [
      { id: 'f11', name: 'Capim-dos-Pampas', icon: '🌾', x: 26, y: 68 },
      { id: 'f12', name: 'Carqueja Silvestre', icon: '🌿', x: 68, y: 70 },
    ],
    buildPlots: [
      { id: 'plot_1', x: 48, y: 68, label: 'Lote Livre 1' },
      { id: 'plot_2', x: 74, y: 60, label: 'Lote Livre 2' },
      { id: 'plot_3', x: 30, y: 44, label: 'Lote Livre 3' },
    ],
  },
};

/**
 * Resolver configuração do bioma por chave ou nome
 */
export function getBiomeConfig(keyOrId) {
  if (!keyOrId) return BIOMES_CONFIG['pantanal'];

  const normalized = String(keyOrId).toLowerCase().trim();

  if (BIOMES_CONFIG[normalized]) {
    return BIOMES_CONFIG[normalized];
  }

  // Busca inteligente
  if (normalized.includes('pantanal')) return BIOMES_CONFIG['pantanal'];
  if (normalized.includes('amaz') || normalized.includes('tropical') || normalized.includes('florest')) return BIOMES_CONFIG['amazonia'];
  if (normalized.includes('cerrado')) return BIOMES_CONFIG['cerrado'];
  if (normalized.includes('caatinga')) return BIOMES_CONFIG['caatinga'];
  if (normalized.includes('mata') || normalized.includes('atlant')) return BIOMES_CONFIG['mata-atlantica'];
  if (normalized.includes('pampa')) return BIOMES_CONFIG['pampa'];

  // Busca por id numérico
  for (const k in BIOMES_CONFIG) {
    if (BIOMES_CONFIG[k].numericId === Number(normalized)) {
      return BIOMES_CONFIG[k];
    }
  }

  return BIOMES_CONFIG['pantanal'];
}
