# BiomeKids

Aplicativo educativo gamificado sobre os biomas do mundo, construído com React Native e Expo.

## Experiência principal

O projeto segue uma jornada contínua inspirada em trilhas de aprendizagem:

- 9 capítulos: Floresta Tropical, Alagados, Savana, Deserto, Pradarias, Floresta Temperada, Taiga, Tundra e Oceanos;
- 25 níveis de estudo por bioma, totalizando 225 níveis;
- uma transição visual após cada capítulo, como o nível 26 entre Floresta Tropical e Alagados;
- uma árvore de evolução própria por bioma, com atributos liberados pelo nível de estudo e comprados com pontos ecológicos;
- produção automática de pontos ecológicos e moedas globais, inclusive durante períodos fora do aplicativo;
- missão principal que exige os 25 níveis e a árvore completa antes de liberar o bioma seguinte.

## Sistemas

- aulas curtas com história, pergunta e recompensa;
- moedas, diamantes, XP, corações e combustível;
- missões diárias e semanais com ciclos reais de reinício;
- multiplicadores temporários de moedas e XP;
- loja de energia, boosts e cosméticos;
- coleção com 107 registros de flora, fauna, descobertas e insígnias;
- perfil, conquistas, estatísticas e progresso persistente no dispositivo.

O antigo mapa 2D/3D, territórios e dependências Three.js foram removidos. A navegação atual é formada por Trilha, Árvore de Evolução, Missões, Coleção e Loja.

## Executar

```bash
npm install
npm run web
```

Outros comandos:

```bash
npm run android
npm run ios
npm run export:web
```

## Estrutura principal

- `src/data/biomeJourney.js`: capítulos, níveis, árvores, loja e missões;
- `src/contexts/GameContext.js`: progresso, economia, renda passiva e persistência;
- `src/Pages/Journey`: trilha de aprendizagem;
- `src/Pages/Lesson`: experiência de aula;
- `src/Pages/Evolution`: árvore ativa do bioma;
- `src/Pages/Transition`: passagem visual entre biomas.
