// Fonte única da trilha, árvores de evolução, loja e missões do BiomeKids.
// Os 225 níveis são gerados a partir de 45 unidades editoriais curadas.

const THEMES = {
  tropical: { primary: '#49A95B', secondary: '#B8E35A', dark: '#174B34', soft: '#E3F5D8', background: '#F1F9E9' },
  wetlands: { primary: '#258F91', secondary: '#73D4C8', dark: '#144D58', soft: '#DDF5F0', background: '#EEF9F6' },
  savanna: { primary: '#D58B25', secondary: '#F1C85B', dark: '#6D431C', soft: '#FFF0CE', background: '#FFF8E6' },
  desert: { primary: '#D16E35', secondary: '#F1B66B', dark: '#6D3826', soft: '#FCE9D5', background: '#FFF6EA' },
  grassland: { primary: '#70A23C', secondary: '#C5D95A', dark: '#36592A', soft: '#EEF5D8', background: '#F7FAEB' },
  temperate: { primary: '#B45B58', secondary: '#E49B67', dark: '#5D3437', soft: '#F8E4DE', background: '#FCF4EF' },
  taiga: { primary: '#287568', secondary: '#71B7A0', dark: '#173F3A', soft: '#E0F0E9', background: '#F0F7F4' },
  tundra: { primary: '#5E87A5', secondary: '#A9CCDC', dark: '#304C63', soft: '#E6F1F6', background: '#F4F9FB' },
  ocean: { primary: '#167BC1', secondary: '#58C5DB', dark: '#123F68', soft: '#DDEFF9', background: '#EEF8FD' },
};

const topic = (unit, subject, emoji, intro, clue, question, options, correctIndex, explanation) => ({
  unit, subject, emoji, intro, clue, question, options, correctIndex, explanation,
});

const node = (key, name, category, icon, description, cost, pps, tapBonus, level, parent = null) => ({
  key, name, category, icon, description, cost, pps, tapBonus, level, parent,
});

const careChallenge = (
  biomeId,
  key,
  title,
  icon,
  problem,
  sign,
  action,
  learning,
  requiredLocalLevel,
  requiredNodeKey,
  requiredScans,
  metric,
  reward,
  collectionEmoji
) => {
  const id = `${biomeId}-${key}`;
  return {
    id,
    title,
    icon,
    problem,
    sign,
    action,
    learning,
    requiredLocalLevel,
    requiredNodeId: `${biomeId}-${requiredNodeKey}`,
    requiredScans,
    metric,
    reward,
    collectionItem: {
      id: `${id}-registro`,
      name: title,
      emoji: collectionEmoji,
      category: 'care',
      biomeId,
      description: learning,
    },
  };
};

const BIOME_BLUEPRINTS = [
  {
    id: 'floresta-tropical', name: 'Floresta Tropical', shortName: 'Floresta', emoji: '🌴', theme: THEMES.tropical,
    description: 'Uma floresta quente, úmida e cheia de relações escondidas entre o solo e o dossel.',
    topics: [
      topic('Camadas da floresta', 'Dossel vivo', '🌳', 'A luz quase desaparece antes de alcançar o chão. Acima, uma cidade de folhas recebe o sol.', 'Copas altas formam o dossel, onde vivem aves, insetos e mamíferos arborícolas.', 'Qual camada recebe mais luz solar?', ['O dossel', 'O subsolo', 'O leito do rio'], 0, 'O dossel reúne as copas e recebe grande parte da luz.'),
      topic('Produtores gigantes', 'Castanheira', '🌰', 'Uma árvore atravessa gerações e oferece frutos para muitos moradores da mata.', 'Como produtora, ela transforma luz em energia e sustenta diferentes cadeias alimentares.', 'Por que árvores são chamadas de produtoras?', ['Caçam insetos', 'Produzem seu alimento por fotossíntese', 'Vivem sem água'], 1, 'Plantas usam luz, água e gás carbônico para produzir açúcares.'),
      topic('Predadores e equilíbrio', 'Onça-pintada', '🐆', 'Pegadas grandes surgem perto do rio, mas o animal quase não faz barulho.', 'A onça é predadora de topo e ajuda a controlar populações de outros animais.', 'Qual é o papel de um predador de topo?', ['Equilibrar populações', 'Produzir frutos', 'Polinizar flores'], 0, 'Predadores de topo evitam desequilíbrios na cadeia alimentar.'),
      topic('Pequenos engenheiros', 'Formigas-cortadeiras', '🐜', 'Folhas recortadas caminham pela trilha como pequenos barcos verdes.', 'As formigas levam folhas para cultivar fungos, que servem de alimento à colônia.', 'O que as formigas-cortadeiras cultivam?', ['Algas', 'Fungos', 'Musgos'], 1, 'Elas usam as folhas como substrato para um fungo alimentar.'),
      topic('Água que viaja', 'Rios voadores', '🌧️', 'Mesmo longe do oceano, nuvens enormes nascem sobre a floresta.', 'Árvores liberam vapor pela transpiração; os ventos transportam essa umidade.', 'Como a floresta ajuda a formar chuva?', ['Liberando vapor de água', 'Aquecendo rochas', 'Impedindo o vento'], 0, 'A evapotranspiração envia umidade à atmosfera.'),
    ],
    tree: [
      node('solo-vivo', 'Solo vivo', 'producer', '🌱', 'Fungos e raízes reciclam nutrientes.', 20, 1, 1, 1),
      node('bromelias', 'Bromélias', 'producer', '🌺', 'Reservatórios de água nas alturas.', 65, 2, 1, 5, 'solo-vivo'),
      node('polinizadores', 'Polinizadores', 'consumer', '🦋', 'Insetos conectam flores e frutos.', 120, 4, 2, 10, 'bromelias'),
      node('primatas', 'Primatas dispersores', 'consumer', '🐒', 'Frutos viajam pela floresta.', 220, 7, 2, 15, 'polinizadores'),
      node('onca', 'Onça-pintada', 'consumer', '🐆', 'Predadora de topo do ecossistema.', 380, 12, 3, 20, 'primatas'),
      node('rios-voadores', 'Rios voadores', 'discovery', '🌧️', 'A floresta movimenta água pelo continente.', 620, 20, 5, 25, 'onca'),
    ],
  },
  {
    id: 'alagados', name: 'Alagados', shortName: 'Alagados', emoji: '🪷', theme: THEMES.wetlands,
    description: 'Águas rasas, cheias e secas alternadas criam berçários para milhares de espécies.',
    topics: [
      topic('Pulso das águas', 'Ciclo de cheias', '🌊', 'Uma planície seca se transforma em um grande espelho d’água.', 'Cheias carregam nutrientes e conectam lagoas, rios e campos.', 'O que as cheias transportam?', ['Nutrientes', 'Apenas areia', 'Somente sal'], 0, 'A água redistribui nutrientes e organismos.'),
      topic('Jardins flutuantes', 'Aguapé', '🪷', 'Raízes pendem na água enquanto folhas flutuam ao sol.', 'Aguapés oferecem abrigo, mas o excesso pode indicar desequilíbrio.', 'Onde ficam as folhas do aguapé?', ['Flutuando na superfície', 'Sob as pedras', 'No topo de árvores'], 0, 'Suas folhas e pecíolos adaptados mantêm a planta flutuante.'),
      topic('Aves pescadoras', 'Tuiuiú', '🦩', 'Uma ave alta procura peixes com passos lentos na água rasa.', 'O tuiuiú usa o bico longo para capturar peixes e outros animais aquáticos.', 'Qual adaptação ajuda o tuiuiú a pescar?', ['Bico longo', 'Dentes afiados', 'Cauda prensil'], 0, 'O bico longo alcança presas em águas rasas.'),
      topic('Construtores de margens', 'Capivara', '🦫', 'Trilhas surgem entre a vegetação e a margem do rio.', 'Capivaras são herbívoras semiaquáticas e excelentes nadadoras.', 'A capivara se alimenta principalmente de quê?', ['Gramíneas e plantas', 'Peixes', 'Outras capivaras'], 0, 'Capivaras são herbívoras.'),
      topic('Guardião do rio', 'Jacaré', '🐊', 'Dois olhos aparecem acima da água enquanto quase todo o corpo permanece escondido.', 'Jacarés controlam presas e também criam refúgios aquáticos em períodos secos.', 'Por que os olhos ficam no alto da cabeça?', ['Para observar quase submerso', 'Para cavar raízes', 'Para respirar no solo'], 0, 'Essa posição permite vigiar mantendo o corpo escondido.'),
    ],
    tree: [
      node('algas', 'Algas e fitoplâncton', 'producer', '🦠', 'A base microscópica da teia aquática.', 25, 1, 1, 1),
      node('aguapes', 'Aguapés', 'producer', '🪷', 'Abrigo flutuante para pequenos animais.', 70, 2, 1, 5, 'algas'),
      node('peixes', 'Cardumes', 'consumer', '🐟', 'Ligam produtores a grandes predadores.', 135, 4, 2, 10, 'aguapes'),
      node('tuiuiu', 'Tuiuiú', 'consumer', '🦩', 'Ave símbolo das planícies inundáveis.', 240, 8, 2, 15, 'peixes'),
      node('jacare', 'Jacaré', 'consumer', '🐊', 'Regula a vida nos canais.', 410, 13, 3, 20, 'tuiuiu'),
      node('pulso-cheias', 'Pulso das cheias', 'discovery', '🌊', 'O ritmo que renova todo o alagado.', 680, 22, 5, 25, 'jacare'),
    ],
  },
  {
    id: 'savana', name: 'Savana', shortName: 'Savana', emoji: '🦒', theme: THEMES.savanna,
    description: 'Campos quentes com árvores espaçadas, grandes herbívoros e chuvas sazonais.',
    topics: [
      topic('Mar de capim', 'Gramíneas', '🌾', 'O vento desenha ondas em um campo dourado que parece não ter fim.', 'Gramíneas rebrotam perto do solo e resistem ao pastejo.', 'Que adaptação ajuda a gramínea a rebrotar?', ['Crescimento próximo ao solo', 'Folhas submersas', 'Raízes aéreas'], 0, 'Seus pontos de crescimento baixos sobrevivem ao pastejo.'),
      topic('Gigantes jardineiros', 'Elefante', '🐘', 'Galhos quebrados e pegadas redondas indicam a passagem de um gigante.', 'Elefantes abrem clareiras, transportam sementes e encontram água.', 'Como elefantes alteram a paisagem?', ['Abrem clareiras e dispersam sementes', 'Congelam o solo', 'Criam recifes'], 0, 'Eles são engenheiros do ecossistema.'),
      topic('Pescoço nas alturas', 'Girafa', '🦒', 'Folhas somem dos galhos mais altos, fora do alcance de quase todos.', 'A língua e o pescoço ajudam girafas a alcançar folhas de acácias.', 'Que alimento a girafa alcança com facilidade?', ['Folhas altas', 'Algas profundas', 'Líquens polares'], 0, 'Sua altura facilita explorar copas de árvores.'),
      topic('Caça cooperativa', 'Leão', '🦁', 'Marcas no capim mostram que vários caçadores se moveram juntos.', 'Leoas podem cooperar durante a caça e o grupo protege o território.', 'Qual vantagem existe na cooperação?', ['Enfrentar presas maiores', 'Produzir sementes', 'Respirar debaixo d’água'], 0, 'A cooperação aumenta as possibilidades de caça e defesa.'),
      topic('Fogo e renovação', 'Fogo natural', '🔥', 'Depois de uma tempestade, um raio acende o capim seco.', 'Incêndios naturais moderados podem reciclar nutrientes; excesso humano destrói habitats.', 'Todo fogo na savana tem o mesmo efeito?', ['Não, frequência e intensidade importam', 'Sim, sempre melhora', 'Sim, sempre destrói'], 0, 'O regime do fogo determina seus efeitos ecológicos.'),
    ],
    tree: [
      node('gramineas', 'Gramíneas', 'producer', '🌾', 'Produtores resistentes ao pastejo.', 30, 1, 1, 1),
      node('acacias', 'Acácias', 'producer', '🌳', 'Folhas e abrigo em plena planície.', 80, 3, 1, 5, 'gramineas'),
      node('herbivoros', 'Grandes herbívoros', 'consumer', '🦓', 'Manadas movimentam nutrientes.', 150, 5, 2, 10, 'acacias'),
      node('elefantes', 'Elefantes', 'consumer', '🐘', 'Gigantes que redesenham a paisagem.', 270, 8, 2, 15, 'herbivoros'),
      node('leoes', 'Leões', 'consumer', '🦁', 'Predadores que ajudam no equilíbrio.', 450, 14, 3, 20, 'elefantes'),
      node('ciclo-fogo', 'Ciclo do fogo', 'discovery', '🔥', 'Renovação quando ocorre no ritmo natural.', 720, 24, 5, 25, 'leoes'),
    ],
  },
  {
    id: 'deserto', name: 'Deserto', shortName: 'Deserto', emoji: '🏜️', theme: THEMES.desert,
    description: 'Pouca chuva, temperaturas extremas e soluções surpreendentes para guardar água.',
    topics: [
      topic('Reservas de água', 'Cactos', '🌵', 'Ao amanhecer, gotas raras escorrem por espinhos sobre um caule verde e grosso.', 'Cactos armazenam água no caule; espinhos reduzem perdas e afastam herbívoros.', 'Onde muitos cactos armazenam água?', ['No caule', 'Nos espinhos', 'Nas flores secas'], 0, 'O caule suculento funciona como reserva.'),
      topic('Vida noturna', 'Feneco', '🦊', 'Pegadas minúsculas aparecem quando a areia finalmente esfria.', 'O feneco sai à noite e suas orelhas grandes ajudam a perder calor.', 'Por que muitos animais do deserto são noturnos?', ['Para evitar o calor intenso', 'Para encontrar neve', 'Para fazer fotossíntese'], 0, 'A noite reduz o risco de superaquecimento e perda de água.'),
      topic('Navio do deserto', 'Dromedário', '🐪', 'Uma silhueta de uma corcova atravessa a planície sem beber por muito tempo.', 'A corcova armazena gordura, não água; seu corpo economiza água.', 'O que há principalmente na corcova?', ['Gordura', 'Água líquida', 'Areia'], 0, 'A gordura é uma reserva energética.'),
      topic('Chuva relâmpago', 'Flores efêmeras', '🌼', 'Depois de uma chuva curta, o chão se cobre de cores por poucos dias.', 'Sementes podem esperar muito tempo e germinar rapidamente quando há umidade.', 'O que permite a rápida floração?', ['Sementes dormentes', 'Gelo permanente', 'Marés'], 0, 'A dormência permite esperar pela rara chuva.'),
      topic('Frio sob as estrelas', 'Amplitude térmica', '🌡️', 'O dia queima, mas a noite exige abrigo contra o frio.', 'Ar seco e poucas nuvens deixam o calor escapar rapidamente após o pôr do sol.', 'Por que a noite pode esfriar tanto?', ['O calor escapa com poucas nuvens', 'O solo vira gelo sempre', 'A areia produz vento'], 0, 'Pouco vapor e poucas nuvens retêm menos calor.'),
    ],
    tree: [
      node('liquens', 'Líquens resistentes', 'producer', '🪨', 'Pioneiros sobre rochas expostas.', 35, 1, 1, 1),
      node('cactos', 'Cactos', 'producer', '🌵', 'Reservas vivas de água.', 90, 3, 1, 5, 'liquens'),
      node('insetos-noturnos', 'Insetos noturnos', 'consumer', '🦂', 'A cadeia desperta após o pôr do sol.', 165, 5, 2, 10, 'cactos'),
      node('feneco', 'Feneco', 'consumer', '🦊', 'Pequeno caçador de grandes orelhas.', 290, 9, 2, 15, 'insetos-noturnos'),
      node('dromedario', 'Dromedário', 'consumer', '🐪', 'Especialista em economizar água.', 480, 15, 3, 20, 'feneco'),
      node('chuva-rara', 'Explosão de flores', 'discovery', '🌼', 'A vida responde depressa à chuva.', 760, 25, 5, 25, 'dromedario'),
    ],
  },
  {
    id: 'pradarias', name: 'Pradarias', shortName: 'Pradarias', emoji: '🌾', theme: THEMES.grassland,
    description: 'Um oceano de gramíneas, raízes profundas, ventos fortes e grandes migrações.',
    topics: [
      topic('Floresta subterrânea', 'Raízes profundas', '🌱', 'Acima do solo há capim; abaixo, uma rede muito maior guarda carbono e água.', 'Raízes densas formam solos férteis e ajudam plantas a rebrotar.', 'Onde está grande parte da biomassa da pradaria?', ['Sob o solo', 'Nas nuvens', 'Em troncos altos'], 0, 'Muitas gramíneas investem em raízes extensas.'),
      topic('Pastadores viajantes', 'Bisão', '🦬', 'O chão vibra com uma manada que segue alimento e água.', 'O pastejo moderado renova gramíneas e transporta nutrientes.', 'O que uma manada transporta pelo campo?', ['Nutrientes e sementes', 'Corais', 'Neve marinha'], 0, 'Animais redistribuem nutrientes e sementes.'),
      topic('Corredor veloz', 'Ema', '🐦', 'Uma grande ave corre entre capins em vez de levantar voo.', 'Emas têm pernas fortes, alimentam-se de plantas e pequenos animais e dispersam sementes.', 'Qual é a principal defesa da ema?', ['Correr', 'Respirar sob a água', 'Escavar gelo'], 0, 'Suas pernas permitem grande velocidade.'),
      topic('Cidade subterrânea', 'Cão-da-pradaria', '🐿️', 'Assobios ecoam perto de muitas entradas no chão.', 'Tocas arejam o solo e abrigam outras espécies.', 'Como as tocas ajudam o ambiente?', ['Arejam o solo', 'Secam todos os rios', 'Impedem raízes'], 0, 'A escavação mistura e oxigena o solo.'),
      topic('Tempestade no horizonte', 'Ventos das planícies', '🌬️', 'Sem muitas árvores, nuvens e ventos atravessam o campo livremente.', 'Relevo aberto favorece ventos e mudanças rápidas no tempo.', 'Por que o vento percorre grandes distâncias?', ['Há poucas barreiras altas', 'O oceano está congelado', 'O capim cria motores'], 0, 'A paisagem aberta oferece pouca resistência.'),
    ],
    tree: [
      node('microbios-solo', 'Micróbios do solo', 'producer', '🦠', 'Reciclam matéria sob o capim.', 40, 1, 1, 1),
      node('gramineas', 'Gramíneas profundas', 'producer', '🌾', 'Raízes que constroem solo fértil.', 100, 3, 1, 5, 'microbios-solo'),
      node('polinizadores', 'Polinizadores', 'consumer', '🐝', 'Conectam as flores baixas.', 180, 6, 2, 10, 'gramineas'),
      node('pastadores', 'Grandes pastadores', 'consumer', '🦬', 'Movem nutrientes pela planície.', 310, 10, 2, 15, 'polinizadores'),
      node('predadores', 'Predadores corredores', 'consumer', '🐺', 'Acompanham manadas e equilibram populações.', 510, 16, 3, 20, 'pastadores'),
      node('carbono-solo', 'Carbono subterrâneo', 'discovery', '🌍', 'Raízes ajudam a guardar carbono no solo.', 800, 27, 5, 25, 'predadores'),
    ],
  },
  {
    id: 'floresta-temperada', name: 'Floresta Temperada', shortName: 'Temperada', emoji: '🍂', theme: THEMES.temperate,
    description: 'Quatro estações transformam folhas, alimentos e estratégias ao longo do ano.',
    topics: [
      topic('Relógio das folhas', 'Árvores decíduas', '🍁', 'A floresta troca o verde por amarelo e vermelho antes do inverno.', 'Árvores derrubam folhas para reduzir perda de água e danos pelo frio.', 'Por que muitas árvores perdem as folhas?', ['Para economizar recursos no frio', 'Para virar animais', 'Para produzir sal'], 0, 'A queda das folhas reduz custos no período desfavorável.'),
      topic('Despensa da floresta', 'Esquilo', '🐿️', 'Pequenos esconderijos de sementes aparecem sob folhas secas.', 'Esquilos guardam alimento e sementes esquecidas podem germinar.', 'Como o esquilo pode ajudar árvores?', ['Dispersando sementes', 'Cortando todas as raízes', 'Congelando frutos'], 0, 'Algumas sementes enterradas germinam.'),
      topic('Caçador discreto', 'Raposa', '🦊', 'Uma cauda avermelhada some entre arbustos ao entardecer.', 'Raposas são onívoras e ajustam a dieta conforme a estação.', 'O que significa ser onívoro?', ['Comer plantas e animais', 'Comer só folhas', 'Comer só pedras'], 0, 'Onívoros usam alimentos de origem vegetal e animal.'),
      topic('Sono de inverno', 'Hibernação', '🐻', 'Um abrigo silencioso guarda um animal durante os meses mais frios.', 'Alguns animais reduzem muito a atividade e o gasto de energia.', 'Qual a vantagem da hibernação?', ['Poupar energia quando falta alimento', 'Aprender a voar', 'Produzir luz'], 0, 'Metabolismo reduzido ajuda a atravessar períodos difíceis.'),
      topic('Primavera em rede', 'Flores e polinizadores', '🌸', 'Flores aparecem quase juntas quando os dias ficam maiores.', 'Temperatura e duração do dia sincronizam plantas e polinizadores.', 'O que sinaliza a mudança de estação?', ['Temperatura e duração do dia', 'Somente o barulho', 'A cor das rochas'], 0, 'Fotoperíodo e temperatura orientam ciclos sazonais.'),
    ],
    tree: [
      node('fungos', 'Fungos decompositores', 'producer', '🍄', 'Devolvem nutrientes das folhas ao solo.', 45, 1, 1, 1),
      node('carvalhos', 'Carvalhos', 'producer', '🌳', 'Produtores de bolotas e grandes abrigos.', 110, 4, 1, 5, 'fungos'),
      node('esquilos', 'Esquilos', 'consumer', '🐿️', 'Dispersores que montam despensas.', 195, 6, 2, 10, 'carvalhos'),
      node('raposas', 'Raposas', 'consumer', '🦊', 'Onívoras adaptáveis às estações.', 330, 10, 2, 15, 'esquilos'),
      node('ursos', 'Ursos', 'consumer', '🐻', 'Grandes consumidores de dieta variada.', 540, 17, 3, 20, 'raposas'),
      node('quatro-estacoes', 'Quatro estações', 'discovery', '🍂', 'O calendário que reorganiza toda a floresta.', 840, 28, 5, 25, 'ursos'),
    ],
  },
  {
    id: 'taiga', name: 'Taiga', shortName: 'Taiga', emoji: '🌲', theme: THEMES.taiga,
    description: 'Uma floresta de coníferas, invernos longos e animais preparados para a neve.',
    topics: [
      topic('Agulhas verdes', 'Coníferas', '🌲', 'Mesmo no inverno, muitas árvores continuam verdes sob a neve.', 'Folhas em forma de agulha têm revestimento ceroso e perdem pouca água.', 'Que formato ajuda a conservar água?', ['Agulhas estreitas', 'Folhas gigantes flutuantes', 'Pétalas ocas'], 0, 'Agulhas reduzem área exposta e perda de água.'),
      topic('Passos na neve', 'Lince', '🐈', 'Pegadas largas parecem flutuar sobre a neve fofa.', 'Patas grandes distribuem o peso e facilitam a caça no inverno.', 'Como patas largas ajudam o lince?', ['Funcionam como raquetes de neve', 'Aquecem árvores', 'Criam alimento'], 0, 'Elas diminuem a pressão sobre a neve.'),
      topic('Engenheiro do rio', 'Castor', '🦫', 'Galhos bloqueiam um riacho e criam uma nova lagoa.', 'Represas de castores formam áreas úmidas usadas por muitas espécies.', 'O que uma represa de castor pode criar?', ['Uma área úmida', 'Uma duna', 'Um recife tropical'], 0, 'A água represada cria novos habitats.'),
      topic('Viagem das manadas', 'Rena', '🦌', 'Centenas de animais seguem juntos em busca de alimento.', 'Renas migram entre áreas sazonais e encontram líquens sob a neve.', 'Por que as renas migram?', ['Para encontrar alimento e locais adequados', 'Para construir ninhos no mar', 'Para evitar toda luz'], 0, 'A migração acompanha recursos sazonais.'),
      topic('Noite luminosa', 'Aurora', '🌌', 'Faixas coloridas dançam no céu escuro do norte.', 'Partículas solares interagem com gases da atmosfera perto dos polos.', 'Onde a aurora acontece?', ['Na alta atmosfera', 'Dentro das árvores', 'Sob o solo'], 0, 'O brilho vem de interações na atmosfera.'),
    ],
    tree: [
      node('musgos', 'Musgos e líquens', 'producer', '🌿', 'Cobrem o solo frio e úmido.', 50, 1, 1, 1),
      node('coniferas', 'Coníferas', 'producer', '🌲', 'Agulhas preparadas para o inverno.', 120, 4, 1, 5, 'musgos'),
      node('lebres', 'Lebres-da-neve', 'consumer', '🐇', 'Herbívoros de pelagem sazonal.', 210, 7, 2, 10, 'coniferas'),
      node('linces', 'Linces', 'consumer', '🐈', 'Caçadores de patas largas.', 350, 11, 2, 15, 'lebres'),
      node('lobos', 'Lobos', 'consumer', '🐺', 'Predadores sociais das grandes florestas.', 570, 18, 3, 20, 'linces'),
      node('aurora', 'Aurora boreal', 'discovery', '🌌', 'Ciência do céu sobre a taiga.', 880, 30, 5, 25, 'lobos'),
    ],
  },
  {
    id: 'tundra', name: 'Tundra', shortName: 'Tundra', emoji: '❄️', theme: THEMES.tundra,
    description: 'Solo congelado, verão curto e uma vida que aproveita cada raio de sol.',
    topics: [
      topic('Chão congelado', 'Permafrost', '🧊', 'Mesmo no verão, uma camada profunda do solo continua dura como pedra.', 'Permafrost é solo que permanece congelado por pelo menos dois anos.', 'O que é permafrost?', ['Solo congelado por longos períodos', 'Uma nuvem quente', 'Uma árvore de gelo'], 0, 'É uma camada de solo permanentemente congelada.'),
      topic('Jardim rasteiro', 'Líquens', '🌿', 'Quase sem árvores, pequenas manchas coloridas crescem junto às rochas.', 'Líquens são associações entre fungo e parceiro fotossintetizante.', 'Por que crescem rente ao chão?', ['Há menos vento e mais calor local', 'Precisam de água salgada', 'Fogem de raízes'], 0, 'Perto do solo há abrigo contra ventos fortes.'),
      topic('Casaco que muda', 'Raposa-do-ártico', '🦊', 'Uma sombra branca no inverno fica acinzentada quando a neve derrete.', 'A pelagem sazonal ajuda na camuflagem e no isolamento.', 'Por que a cor da pelagem muda?', ['Para combinar com o ambiente', 'Para produzir comida', 'Para respirar melhor'], 0, 'A camuflagem acompanha a paisagem sazonal.'),
      topic('Gigante do gelo', 'Urso-polar', '🐻‍❄️', 'Pegadas enormes seguem a borda onde o gelo encontra o mar.', 'Ursos-polares dependem do gelo marinho para caçar focas.', 'Para que o urso usa o gelo marinho?', ['Como plataforma de caça', 'Para plantar árvores', 'Para encontrar frutos tropicais'], 0, 'O gelo oferece acesso às presas marinhas.'),
      topic('Verão acelerado', 'Explosão de insetos', '🦟', 'Em poucas semanas, flores, insetos e aves aparecem quase ao mesmo tempo.', 'O verão curto exige ciclos rápidos e alimenta aves migratórias.', 'Por que muitos eventos acontecem juntos?', ['A estação favorável é curta', 'O sol nunca existe', 'Não há água'], 0, 'A vida aproveita uma janela breve de calor e alimento.'),
    ],
    tree: [
      node('liquens', 'Líquens', 'producer', '🌿', 'Produtores pioneiros no frio.', 55, 1, 1, 1),
      node('arbustos-anoes', 'Arbustos-anões', 'producer', '🌱', 'Crescem protegidos junto ao chão.', 130, 4, 1, 5, 'liquens'),
      node('lemmings', 'Lemmings', 'consumer', '🐭', 'Pequenos herbívoros essenciais.', 225, 7, 2, 10, 'arbustos-anoes'),
      node('raposa-artico', 'Raposa-do-ártico', 'consumer', '🦊', 'Caçadora de pelagem sazonal.', 370, 12, 2, 15, 'lemmings'),
      node('urso-polar', 'Urso-polar', 'consumer', '🐻‍❄️', 'Predador ligado ao gelo marinho.', 600, 19, 3, 20, 'raposa-artico'),
      node('permafrost', 'Permafrost', 'discovery', '🧊', 'Solo que guarda carbono antigo.', 920, 31, 5, 25, 'urso-polar'),
    ],
  },
  {
    id: 'oceanos', name: 'Oceanos', shortName: 'Oceanos', emoji: '🌊', theme: THEMES.ocean,
    description: 'Da superfície iluminada ao abismo, correntes conectam a maior parte do planeta.',
    topics: [
      topic('Floresta invisível', 'Fitoplâncton', '🦠', 'Pontos microscópicos capturam luz em uma imensidão azul.', 'Fitoplâncton faz fotossíntese e sustenta grande parte das teias marinhas.', 'Quem forma a base de muitas teias oceânicas?', ['Fitoplâncton', 'Tubarões', 'Baleias'], 0, 'Microrganismos fotossintetizantes são produtores fundamentais.'),
      topic('Cidade de coral', 'Recife', '🪸', 'Pequenos animais constroem uma estrutura que abriga milhares de espécies.', 'Corais vivem associados a algas e sofrem quando a água aquece demais.', 'O coral é principalmente o quê?', ['Um animal colonial', 'Uma pedra sem vida', 'Uma árvore marinha'], 0, 'Pólipos animais formam colônias e esqueletos calcários.'),
      topic('Viagem das gigantes', 'Baleia-jubarte', '🐋', 'Um canto grave atravessa quilômetros de água durante uma longa viagem.', 'Jubartes migram entre áreas de alimentação e reprodução.', 'Por que a jubarte migra?', ['Usar áreas diferentes para alimentar e reproduzir', 'Procurar árvores', 'Fugir de toda água'], 0, 'A migração conecta regiões adequadas a fases diferentes da vida.'),
      topic('Correntes viajantes', 'Correntes oceânicas', '🌀', 'Uma garrafa imaginária poderia cruzar oceanos levada por rios dentro do mar.', 'Correntes distribuem calor, nutrientes e organismos.', 'O que as correntes transportam?', ['Calor e nutrientes', 'Apenas areia', 'Somente som'], 0, 'O movimento da água influencia clima e produtividade.'),
      topic('Luzes do abismo', 'Bioluminescência', '✨', 'No escuro total, um ponto azul acende e desaparece.', 'Alguns seres produzem luz para atrair, confundir ou comunicar.', 'Para que serve a bioluminescência?', ['Comunicação, defesa ou caça', 'Fazer fotossíntese no escuro', 'Aquecer todo o oceano'], 0, 'A luz biológica tem diferentes funções adaptativas.'),
    ],
    tree: [
      node('fitoplancton', 'Fitoplâncton', 'producer', '🦠', 'Produtores microscópicos do oceano.', 60, 1, 1, 1),
      node('algas', 'Florestas de algas', 'producer', '🌿', 'Abrigo e alimento na costa.', 140, 4, 1, 5, 'fitoplancton'),
      node('cardumes', 'Cardumes', 'consumer', '🐟', 'Energia em movimento pelas águas.', 240, 8, 2, 10, 'algas'),
      node('tartarugas', 'Tartarugas marinhas', 'consumer', '🐢', 'Viajantes entre praias e correntes.', 390, 12, 2, 15, 'cardumes'),
      node('baleias', 'Grandes baleias', 'consumer', '🐋', 'Transportam nutrientes por oceanos.', 630, 20, 3, 20, 'tartarugas'),
      node('abismo', 'Zona abissal', 'discovery', '✨', 'Vida adaptada à pressão e à escuridão.', 960, 32, 5, 25, 'baleias'),
    ],
  },
];

export const CARE_BLUEPRINTS = Object.freeze({
  'floresta-tropical': [
    careChallenge(
      'floresta-tropical', 'mata-ciliar', 'Proteger o igarapé', 'water-outline',
      'A retirada da vegetação deixou a margem vulnerável à erosão.',
      'Água turva, raízes expostas e menos anfíbios aparecem depois da chuva.',
      'Recupere a mata ciliar com plantas nativas e acompanhe a transparência da água.',
      'Raízes seguram o solo, filtram sedimentos e mantêm o igarapé como abrigo para muitas espécies.',
      5, 'solo-vivo', 3, 'waterQuality',
      { coins: 90, xp: 70, ecoPoints: 120 }, '💧'
    ),
    careChallenge(
      'floresta-tropical', 'corredor-florestal', 'Reconectar as copas', 'git-network-outline',
      'Uma clareira larga separou grupos de árvores e isolou animais arborícolas.',
      'Há poucos frutos dispersos e os primatas evitam atravessar a área aberta.',
      'Crie um corredor de vegetação nativa entre os dois fragmentos.',
      'Corredores ecológicos permitem deslocamento, reprodução e dispersão de sementes.',
      15, 'primatas', 4, 'habitatConnectivity',
      { coins: 125, xp: 100, ecoPoints: 180 }, '🌳'
    ),
    careChallenge(
      'floresta-tropical', 'silencio-noturno', 'Devolver a noite à floresta', 'moon-outline',
      'Luz e ruído próximos da mata alteraram a rotina da fauna noturna.',
      'Pegadas desaparecem perto das áreas iluminadas e predadores mudam suas rotas.',
      'Reduza a iluminação, delimite uma zona silenciosa e monitore o retorno dos animais.',
      'Escuridão e silêncio também são partes do habitat e orientam caça, fuga e reprodução.',
      20, 'onca', 5, 'nocturnalBalance',
      { coins: 160, xp: 130, ecoPoints: 230, diamonds: 1 }, '🌙'
    ),
  ],
  alagados: [
    careChallenge(
      'alagados', 'agua-turva', 'Investigar a água turva', 'water-outline',
      'Sedimentos e nutrientes em excesso estão reduzindo a qualidade da água.',
      'A água perdeu transparência, há algas demais e poucos pequenos animais nas margens.',
      'Identifique a origem do escoamento e recupere a vegetação que filtra a água.',
      'Água limpa depende do que acontece em toda a margem e também rio acima.',
      5, 'algas', 3, 'waterQuality',
      { coins: 95, xp: 75, ecoPoints: 125 }, '🫧'
    ),
    careChallenge(
      'alagados', 'reconectar-cheias', 'Restaurar o pulso das cheias', 'repeat-outline',
      'Um canal bloqueado impediu a água de alcançar lagoas e campos sazonais.',
      'Peixes ficam isolados e áreas que deveriam alagar permanecem secas.',
      'Reconecte o fluxo com segurança e monitore dois ciclos de cheia e vazante.',
      'O pulso das águas transporta nutrientes, conecta habitats e organiza a vida dos alagados.',
      25, 'pulso-cheias', 5, 'floodConnectivity',
      { coins: 175, xp: 140, ecoPoints: 250, diamonds: 1 }, '🌊'
    ),
  ],
  savana: [
    careChallenge(
      'savana', 'solo-superpastejado', 'Recuperar o campo cansado', 'leaf-outline',
      'Pastejo intenso deixou grandes trechos sem cobertura vegetal.',
      'Solo exposto, capim muito baixo e menos insetos aparecem perto das rotas das manadas.',
      'Proteja áreas de descanso e favoreça o rebrote das gramíneas nativas.',
      'O pastejo pode renovar o campo, mas intensidade e tempo de recuperação precisam estar em equilíbrio.',
      10, 'herbivoros', 4, 'soilCover',
      { coins: 105, xp: 85, ecoPoints: 145 }, '🌾'
    ),
    careChallenge(
      'savana', 'fogo-fora-de-ritmo', 'Compreender o fogo', 'flame-outline',
      'Queimadas muito frequentes não dão tempo para plantas e animais se recuperarem.',
      'Árvores jovens desaparecem e o solo permanece descoberto por mais tempo.',
      'Investigue frequência e intensidade e escolha um plano de prevenção e manejo especializado.',
      'O efeito do fogo depende do bioma, da estação, da intensidade e do intervalo entre eventos.',
      25, 'ciclo-fogo', 5, 'fireBalance',
      { coins: 185, xp: 145, ecoPoints: 260, diamonds: 1 }, '🔥'
    ),
  ],
  deserto: [
    careChallenge(
      'deserto', 'crosta-do-solo', 'Proteger o chão vivo', 'footsteps-outline',
      'Passagens fora das trilhas quebraram a frágil crosta biológica do solo.',
      'Marcas profundas, poeira solta e menos líquens aparecem nas áreas pisoteadas.',
      'Delimite rotas, proteja o solo intacto e acompanhe sua lenta regeneração.',
      'Mesmo parecendo vazio, o solo desértico abriga organismos que reduzem erosão e guardam nutrientes.',
      5, 'liquens', 3, 'soilIntegrity',
      { coins: 100, xp: 80, ecoPoints: 135 }, '🪨'
    ),
    careChallenge(
      'deserto', 'uso-da-agua', 'Guardar cada gota', 'water-outline',
      'A retirada excessiva de água reduziu pequenas fontes usadas pela fauna.',
      'Bebedouros naturais secam mais cedo e pegadas se concentram em poucos pontos.',
      'Reduza perdas, proteja as fontes e monitore o consumo durante os períodos mais quentes.',
      'Em ambientes secos, economizar água e proteger fontes naturais sustenta toda a comunidade.',
      20, 'dromedario', 5, 'waterSecurity',
      { coins: 170, xp: 135, ecoPoints: 240, diamonds: 1 }, '💧'
    ),
  ],
  pradarias: [
    careChallenge(
      'pradarias', 'solo-exposto', 'Cobrir novamente o solo', 'earth-outline',
      'A remoção das gramíneas deixou o solo fértil exposto ao vento e à chuva.',
      'Poeira, pequenos sulcos e raízes descobertas avançam pelo campo.',
      'Recupere gramíneas nativas e mantenha restos vegetais protegendo o chão.',
      'Raízes profundas e cobertura vegetal conservam água, carbono e nutrientes no solo.',
      5, 'gramineas', 3, 'soilCover',
      { coins: 105, xp: 85, ecoPoints: 145 }, '🌱'
    ),
    careChallenge(
      'pradarias', 'rotas-fragmentadas', 'Abrir caminho para as manadas', 'navigate-outline',
      'Barreiras dividiram áreas de alimento, água e reprodução.',
      'Trilhas terminam de repente e os pastadores se acumulam em pequenos trechos.',
      'Reconecte passagens seguras e monitore o retorno das rotas sazonais.',
      'Animais migratórios precisam circular entre recursos que mudam ao longo do ano.',
      15, 'pastadores', 4, 'habitatConnectivity',
      { coins: 145, xp: 115, ecoPoints: 205 }, '🦬'
    ),
  ],
  'floresta-temperada': [
    careChallenge(
      'floresta-temperada', 'riacho-com-lixo', 'Limpar sem esquecer a origem', 'trash-outline',
      'Resíduos chegaram ao riacho e ameaçam animais e plantas das margens.',
      'Embalagens ficam presas nos galhos e a água acumula material depois da chuva.',
      'Retire os resíduos, identifique de onde vieram e previna uma nova entrada.',
      'Limpar ajuda no momento, mas impedir que o lixo alcance a água resolve a causa do problema.',
      5, 'carvalhos', 3, 'waterQuality',
      { coins: 110, xp: 90, ecoPoints: 150 }, '♻️'
    ),
    careChallenge(
      'floresta-temperada', 'noites-iluminadas', 'Criar uma noite segura', 'moon-outline',
      'Iluminação excessiva na borda da floresta alterou o comportamento noturno.',
      'Insetos se concentram nas lâmpadas e raposas evitam corredores muito claros.',
      'Direcione as luzes para baixo, reduza sua intensidade e preserve corredores escuros.',
      'Poluição luminosa muda orientação, alimentação e reprodução de muitas espécies.',
      15, 'raposas', 4, 'nocturnalBalance',
      { coins: 150, xp: 120, ecoPoints: 210 }, '🦊'
    ),
  ],
  taiga: [
    careChallenge(
      'taiga', 'solo-compactado', 'Cuidar do chão da taiga', 'footsteps-outline',
      'Tráfego repetido compactou o solo úmido entre musgos e coníferas.',
      'Poças permanecem na superfície, raízes ficam expostas e musgos desaparecem.',
      'Feche atalhos, concentre a passagem em trilhas e proteja a regeneração natural.',
      'Solo compactado recebe menos ar e água, dificultando o crescimento de raízes e pequenos organismos.',
      5, 'coniferas', 3, 'soilIntegrity',
      { coins: 115, xp: 90, ecoPoints: 155 }, '🌲'
    ),
    careChallenge(
      'taiga', 'corredor-migratorio', 'Reconectar a rota da floresta', 'git-network-outline',
      'Uma abertura extensa separou áreas usadas por predadores e grandes manadas.',
      'Pegadas contornam longas distâncias e encontros com alimento ficam menos frequentes.',
      'Proteja uma faixa contínua de floresta e acompanhe as rotas com câmeras de campo.',
      'Conectividade reduz isolamento e permite que animais acompanhem alimento e estações.',
      20, 'lobos', 5, 'habitatConnectivity',
      { coins: 180, xp: 140, ecoPoints: 250, diamonds: 1 }, '🐾'
    ),
  ],
  tundra: [
    careChallenge(
      'tundra', 'vegetacao-pisoteada', 'Proteger o jardim rasteiro', 'flower-outline',
      'Passagens repetidas danificaram plantas que crescem muito devagar.',
      'Líquens quebrados e trilhas de solo escuro permanecem visíveis por muito tempo.',
      'Desvie a circulação e proteja as áreas onde a vegetação ainda está se recuperando.',
      'Na tundra, a estação de crescimento é curta e pequenos danos podem levar anos para desaparecer.',
      5, 'arbustos-anoes', 3, 'vegetationCover',
      { coins: 120, xp: 95, ecoPoints: 160 }, '🌿'
    ),
    careChallenge(
      'tundra', 'permafrost-exposto', 'Manter o solo protegido', 'snow-outline',
      'A perda de cobertura deixou o solo congelado mais exposto ao aquecimento.',
      'O terreno afunda em pontos úmidos e novas poças aparecem onde o gelo do solo cedeu.',
      'Proteja a vegetação, limite novas perturbações e monitore temperatura e umidade.',
      'O permafrost guarda carbono antigo; protegê-lo melhora a resistência local, sem substituir ações climáticas amplas.',
      25, 'permafrost', 5, 'permafrostProtection',
      { coins: 195, xp: 150, ecoPoints: 275, diamonds: 1 }, '🧊'
    ),
  ],
  oceanos: [
    careChallenge(
      'oceanos', 'plastico-costeiro', 'Interromper o caminho do plástico', 'trash-outline',
      'Resíduos vindos da costa estão alcançando águas usadas por peixes e tartarugas.',
      'Fragmentos aparecem entre algas e nas linhas deixadas pela maré.',
      'Retire o material com segurança, rastreie sua origem e impeça novas entradas.',
      'Grande parte do cuidado marinho começa em terra, antes que o resíduo chegue à água.',
      5, 'algas', 4, 'marinePollution',
      { coins: 125, xp: 100, ecoPoints: 170 }, '🌊'
    ),
    careChallenge(
      'oceanos', 'rede-fantasma', 'Libertar a rota marinha', 'fish-outline',
      'Uma rede abandonada continua prendendo animais mesmo sem pescadores por perto.',
      'Marcas na rede, movimentos incomuns e animais evitando a área indicam perigo.',
      'Sinalize o local, acione uma equipe especializada e monitore a passagem após a retirada.',
      'Equipamentos perdidos continuam capturando fauna; prevenção e recolhimento especializado salvam vidas.',
      15, 'tartarugas', 5, 'wildlifeSafety',
      { coins: 175, xp: 140, ecoPoints: 250, diamonds: 1 }, '🐢'
    ),
  ],
});

const LESSON_STAGES = [
  { type: 'story', icon: 'book-outline', prefix: 'Mistério' },
  { type: 'clue', icon: 'search-outline', prefix: 'Pista' },
  { type: 'challenge', icon: 'bulb-outline', prefix: 'Investigação' },
  { type: 'choice', icon: 'compass-outline', prefix: 'Decisão' },
  { type: 'checkpoint', icon: 'ribbon-outline', prefix: 'Checkpoint' },
];

const slugify = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

function lessonFor(blueprint, topicData, topicIndex, stageIndex, globalLevel) {
  const stage = LESSON_STAGES[stageIndex];
  const localLevel = topicIndex * 5 + stageIndex + 1;
  const subjectId = slugify(topicData.subject);
  const stagePrompts = [
    `Uma nova evidência sobre ${topicData.subject} apareceu na expedição.`,
    'Observe a pista científica antes de registrar sua hipótese.',
    'Compare as adaptações e descubra qual explicação faz sentido.',
    'Sua equipe precisa escolher uma ação baseada no que aprendeu.',
    'Reúna todas as pistas para concluir esta unidade.',
  ];
  return {
    id: `${blueprint.id}-nivel-${localLevel}`,
    type: 'lesson',
    lessonType: stage.type,
    globalLevel,
    localLevel,
    biomeId: blueprint.id,
    unit: topicData.unit,
    title: `${stage.prefix}: ${topicData.subject}`,
    subtitle: stageIndex === 4 ? 'Feche a unidade e ganhe um bônus' : stagePrompts[stageIndex],
    icon: stage.icon,
    story: [topicData.intro, `${topicData.clue} ${stagePrompts[stageIndex]}`],
    question: {
      prompt: topicData.question,
      options: topicData.options,
      correctIndex: topicData.correctIndex,
      explanation: topicData.explanation,
    },
    reward: {
      coins: 12 + localLevel * 2 + (stageIndex === 4 ? 18 : 0),
      xp: 18 + localLevel * 3 + (stageIndex === 4 ? 24 : 0),
      ecoPoints: 20 + localLevel * 4 + (stageIndex === 4 ? 35 : 0),
    },
    collectionItem: stageIndex === 4 ? {
      id: `${blueprint.id}-${subjectId}`,
      name: topicData.subject,
      emoji: topicData.emoji,
      category: topicIndex < 2 ? 'flora' : topicIndex < 4 ? 'fauna' : 'discovery',
      biomeId: blueprint.id,
      description: topicData.explanation,
    } : null,
  };
}

export const BIOME_CHAPTERS = BIOME_BLUEPRINTS.map((blueprint, index) => {
  const order = index + 1;
  const startLevel = 1 + index * 26;
  const endLevel = startLevel + 24;
  const treeNodes = blueprint.tree.map((item) => {
    const mapLayer = item.category === 'producer'
      ? 'flora'
      : item.category === 'consumer' ? 'fauna' : 'environment';
    const mapDescription = item.category === 'producer'
      ? `${item.name} passa a ocupar e sustentar novas áreas do mapa.`
      : item.category === 'consumer'
        ? `${item.name} pode surgir no mapa quando habitat, horário e clima forem adequados.`
        : `${item.name} ativa uma nova transformação ambiental observável no mapa.`;
    return {
      id: `${blueprint.id}-${item.key}`,
      name: item.name,
      category: item.category,
      icon: item.icon,
      description: item.description,
      mapDescription,
      effects: {
        worldTags: [`${blueprint.id}:${item.key}`],
        mapLayer,
        ecoPointsPerSecond: item.pps,
        scanPowerBonus: item.tapBonus,
      },
      cost: item.cost,
      pps: item.pps,
      tapBonus: item.tapBonus,
      requiredLocalLevel: item.level,
      requiredNodeId: item.parent ? `${blueprint.id}-${item.parent}` : null,
      collectionItem: {
        id: `${blueprint.id}-node-${item.key}`,
        name: item.name,
        emoji: item.icon,
        category: item.category === 'producer' ? 'flora' : item.category === 'consumer' ? 'fauna' : 'discovery',
        biomeId: blueprint.id,
        description: item.description,
      },
    };
  });
  const careChallenges = (CARE_BLUEPRINTS[blueprint.id] || []).map((challenge) => ({
    ...challenge,
    reward: { ...challenge.reward },
    collectionItem: { ...challenge.collectionItem },
  }));
  return {
    id: blueprint.id,
    name: blueprint.name,
    shortName: blueprint.shortName,
    emoji: blueprint.emoji,
    description: blueprint.description,
    order,
    theme: blueprint.theme,
    startLevel,
    endLevel,
    units: blueprint.topics.map((item, topicIndex) => ({
      id: `${blueprint.id}-unidade-${topicIndex + 1}`,
      name: item.unit,
      subject: item.subject,
      startLocalLevel: topicIndex * 5 + 1,
      endLocalLevel: topicIndex * 5 + 5,
    })),
    treeNodes,
    careChallenges,
    mainMission: {
      id: `${blueprint.id}-missao-principal`,
      title: `Restaurar ${blueprint.name}`,
      description: 'Conclua os 25 níveis, forme todas as conexões da Teia da Vida e estabilize os desafios de cuidado.',
      requiredLessons: 25,
      requiredNodes: treeNodes.length,
      requiredCare: careChallenges.length,
      reward: { coins: 500 + index * 100, xp: 300 + index * 40, diamonds: 8 },
    },
  };
});

export const JOURNEY_STEPS = BIOME_CHAPTERS.flatMap((biome, biomeIndex) => {
  const blueprint = BIOME_BLUEPRINTS[biomeIndex];
  const lessons = blueprint.topics.flatMap((topicData, topicIndex) => (
    LESSON_STAGES.map((_, stageIndex) => lessonFor(
      blueprint,
      topicData,
      topicIndex,
      stageIndex,
      biome.startLevel + topicIndex * 5 + stageIndex
    ))
  ));
  const nextBiome = BIOME_CHAPTERS[biomeIndex + 1];
  if (!nextBiome) return lessons;
  return [
    ...lessons,
    {
      id: `transicao-${biome.id}-${nextBiome.id}`,
      type: 'transition',
      globalLevel: biome.endLevel + 1,
      localLevel: null,
      biomeId: biome.id,
      fromBiomeId: biome.id,
      toBiomeId: nextBiome.id,
      unit: 'Passagem de ambiente',
      title: `${biome.name} → ${nextBiome.name}`,
      subtitle: `A paisagem muda e uma nova expedição começa em ${nextBiome.name}.`,
      icon: 'navigate-circle-outline',
      reward: { ...biome.mainMission.reward, fuel: 2 },
      collectionItem: {
        id: `passaporte-${nextBiome.id}`,
        name: `Passaporte: ${nextBiome.name}`,
        emoji: nextBiome.emoji,
        category: 'badge',
        biomeId: nextBiome.id,
        description: `Medalha de entrada no capítulo ${nextBiome.name}.`,
      },
    },
  ];
});

export const SHOP_ITEMS = [
  { id: 'coracoes-completos', name: 'Corações completos', description: 'Recupere todos os corações para continuar aprendendo.', category: 'energia', icon: '❤️', currency: 'coins', price: 70, type: 'hearts', value: 5 },
  { id: 'combustivel-2', name: 'Cantíl de campo', description: 'Recupere 2 unidades de combustível de expedição.', category: 'energia', icon: '⚡', currency: 'coins', price: 55, type: 'fuel', value: 2 },
  { id: 'combustivel-5', name: 'Kit de expedição', description: 'Complete todo o tanque de combustível.', category: 'energia', icon: '🎒', currency: 'diamonds', price: 6, type: 'fuel', value: 5 },
  { id: 'turbo-moedas-30', name: 'Moedas em dobro', description: 'Dobra estudos e renda automática por 30 minutos.', category: 'boost', icon: '🪙', currency: 'coins', price: 95, type: 'coinBoost', durationMinutes: 30, effect: { type: 'coinBoost', value: 2 } },
  { id: 'turbo-xp-30', name: 'XP em dobro', description: 'Dobra o XP recebido por 30 minutos.', category: 'boost', icon: '⭐', currency: 'coins', price: 110, type: 'xpBoost', durationMinutes: 30, effect: { type: 'xpBoost', value: 2 } },
  { id: 'turbo-total-60', name: 'Hora dourada', description: 'Ativa moedas e XP em dobro por uma hora.', category: 'boost', icon: '✨', currency: 'diamonds', price: 10, type: 'allBoost', durationMinutes: 60, effect: { type: 'allBoost', value: 2 } },
  { id: 'avatar-capivara', name: 'Avatar Capivara', description: 'Cosmético tranquilo para o seu perfil.', category: 'cosmetico', icon: '🦫', currency: 'coins', price: 180, type: 'cosmetic', value: 1, cosmeticSlot: 'avatar' },
  { id: 'avatar-tucano', name: 'Avatar Tucano', description: 'Cosmético colorido de explorador.', category: 'cosmetico', icon: '🦜', currency: 'diamonds', price: 14, type: 'cosmetic', value: 1, cosmeticSlot: 'avatar' },
];

export const MISSION_TEMPLATES = [
  { id: 'diaria-2-licoes', period: 'daily', title: 'Duas descobertas', description: 'Conclua 2 níveis hoje.', metric: 'lessonsCompleted', target: 2, reward: { coins: 45, xp: 35, fuel: 1 } },
  { id: 'diaria-25-toques', period: 'daily', title: 'Pistas de campo', description: 'Faça 8 varreduras e colete pistas no mapa.', metric: 'fieldScans', target: 8, reward: { coins: 35, ecoPoints: 60 } },
  { id: 'diaria-1-no', period: 'daily', title: 'Nova conexão', description: 'Forme 1 nova conexão na Teia da Vida.', metric: 'nodesUnlocked', target: 1, reward: { diamonds: 2, xp: 45 } },
  { id: 'semanal-12-licoes', period: 'weekly', title: 'Pesquisador da semana', description: 'Conclua 12 níveis nesta semana.', metric: 'lessonsCompleted', target: 12, reward: { coins: 220, xp: 180, diamonds: 4 } },
  { id: 'semanal-4-nos', period: 'weekly', title: 'Teia em expansão', description: 'Forme 4 conexões nas Teias da Vida.', metric: 'nodesUnlocked', target: 4, reward: { coins: 180, fuel: 3, boost: { type: 'coinBoost', durationMinutes: 30 } } },
  { id: 'semanal-5-missoes', period: 'weekly', title: 'Ritmo de explorador', description: 'Resgate 5 recompensas de missão.', metric: 'missionsClaimed', target: 5, reward: { diamonds: 6, xp: 240, boost: { type: 'xpBoost', durationMinutes: 30 } } },
  { id: 'semanal-1-cuidado', period: 'weekly', title: 'Bioma em recuperação', description: 'Estabilize 1 desafio de cuidado ambiental.', metric: 'careChallengesResolved', target: 1, reward: { coins: 200, xp: 180, diamonds: 4, fuel: 2 } },
];

export const getBiomeById = (id) => BIOME_CHAPTERS.find((biome) => biome.id === id) || null;
export const getJourneyStepById = (id) => JOURNEY_STEPS.find((step) => step.id === id) || null;

export default {
  CARE_BLUEPRINTS,
  BIOME_CHAPTERS,
  JOURNEY_STEPS,
  SHOP_ITEMS,
  MISSION_TEMPLATES,
  getBiomeById,
  getJourneyStepById,
};
