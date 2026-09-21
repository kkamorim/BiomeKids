import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { ANIMALS, QUIZZES, BOOKS, CRISIS_EVENTS, getScoutLevel, getEvolutionStage } from '../data/gameData';

const GameContext = createContext(null);

// ==============================================================================
// Estado inicial do jogo (usado antes de carregar do backend)
// ==============================================================================
const INITIAL_STATE = {
  // Economia
  coins: 10,
  totalCoinsEarned: 10,

  // Progressão
  xp: 0,
  level: 1,
  title: 'Escoteiro Iniciante',
  dailyStreak: 0,

  // Biomas desbloqueados (IDs dos territórios)
  unlockedBiomes: [1],

  // Animais do jogador: { [animalId]: { researchXP, hunger, thirst, happiness, stage, hasScientistBonus, lastFedAt, lastWateredAt } }
  animals: {},

  // Inventário: { [itemId]: quantity }
  inventory: {},

  // Progresso de estudo: { [animalId]: { booksRead: [], quizzesCompleted: [], isScientist } }
  studyProgress: {},

  // Missões ativas
  missions: {
    daily: [],
    weekly: [],
    biome: [],
  },

  // Eventos de crise ativos
  activeEvents: [],

  // Controle diário
  dailyActions: {
    animalsFed: 0,
    quizzesCompleted: 0,
    biomesVisited: 0,
    lastResetDate: null,
  },
};

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [isGameLoading, setIsGameLoading] = useState(true);

  // ─── Inicializar dados do Pantanal ao criar novo jogo ───
  useEffect(() => {
    if (Object.keys(gameState.animals).length === 0) {
      const pantanalAnimals = ANIMALS[1] || [];
      const initialAnimals = {};
      const initialStudy = {};

      pantanalAnimals.forEach((animal) => {
        initialAnimals[animal.id] = {
          researchXP: 0,
          hunger: 80,
          thirst: 80,
          happiness: 70,
          stage: 'baby',
          hasScientistBonus: false,
          lastFedAt: new Date().toISOString(),
          lastWateredAt: new Date().toISOString(),
        };
        initialStudy[animal.id] = {
          booksRead: [],
          quizzesCompleted: [],
          isScientist: false,
        };
      });

      setGameState((prev) => ({
        ...prev,
        animals: initialAnimals,
        studyProgress: initialStudy,
      }));
    }
    setIsGameLoading(false);
  }, []);

  // ==============================================================================
  // AÇÕES DE CUIDADO (Mapa / Território)
  // ==============================================================================

  /**
   * Alimentar um animal (comida básica = gratuita)
   * Se o jogador tem cientista bonus, rende 2x
   */
  const feedAnimal = useCallback((animalId, isPremiumItem = false, itemEffect = 0) => {
    setGameState((prev) => {
      const animal = prev.animals[animalId];
      if (!animal) return prev;

      const scientistMultiplier = animal.hasScientistBonus ? 2 : 1;
      const baseRestore = isPremiumItem ? itemEffect : 20;
      const hungerRestore = Math.min(100, animal.hunger + baseRestore * scientistMultiplier);
      const happinessBoost = isPremiumItem ? (itemEffect * 0.5 * scientistMultiplier) : (5 * scientistMultiplier);

      const newDailyActions = {
        ...prev.dailyActions,
        animalsFed: prev.dailyActions.animalsFed + 1,
      };

      return {
        ...prev,
        animals: {
          ...prev.animals,
          [animalId]: {
            ...animal,
            hunger: hungerRestore,
            happiness: Math.min(100, animal.happiness + happinessBoost),
            lastFedAt: new Date().toISOString(),
          },
        },
        dailyActions: newDailyActions,
      };
    });
  }, []);

  /**
   * Dar água ao animal (gratuito)
   */
  const waterAnimal = useCallback((animalId) => {
    setGameState((prev) => {
      const animal = prev.animals[animalId];
      if (!animal) return prev;

      return {
        ...prev,
        animals: {
          ...prev.animals,
          [animalId]: {
            ...animal,
            thirst: Math.min(100, animal.thirst + 25),
            happiness: Math.min(100, animal.happiness + 3),
            lastWateredAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  // ==============================================================================
  // AÇÕES DE ESTUDO (Aba Estudos)
  // ==============================================================================

  /**
   * Completar um quiz — dá XP de pesquisa ao animal e pode evoluí-lo
   */
  const completeQuiz = useCallback((animalId, quizId, score, maxScore) => {
    setGameState((prev) => {
      const animal = prev.animals[animalId];
      const study = prev.studyProgress[animalId];
      if (!animal || !study) return prev;

      // Encontra o quiz para saber a recompensa
      const animalQuizzes = QUIZZES[animalId] || [];
      const quiz = animalQuizzes.find((q) => q.id === quizId);
      if (!quiz) return prev;

      // Calcula XP ganho (proporcional ao score)
      const scoreRatio = score / maxScore;
      const xpGained = Math.round(quiz.recompensaXP * scoreRatio);

      // Atualiza XP de pesquisa e verifica evolução
      const newResearchXP = animal.researchXP + xpGained;

      // Pega thresholds do catálogo de animais
      const biomeId = Object.keys(ANIMALS).find((key) =>
        ANIMALS[key].some((a) => a.id === animalId)
      );
      const animalData = biomeId ? ANIMALS[biomeId].find((a) => a.id === animalId) : null;
      const thresholds = animalData?.evolucaoXP || { baby: 0, juvenile: 50, adult: 120 };

      const newStage = getEvolutionStage(newResearchXP, thresholds);

      // Verifica se é cientista (todos os quizzes e livros completos)
      const newQuizzesCompleted = study.quizzesCompleted.includes(quizId)
        ? study.quizzesCompleted
        : [...study.quizzesCompleted, quizId];

      const totalQuizzes = animalQuizzes.length;
      const totalBooks = (BOOKS[animalId] || []).length;
      const isScientist =
        newQuizzesCompleted.length >= totalQuizzes && study.booksRead.length >= totalBooks;

      // XP global do escoteiro
      const newXP = prev.xp + xpGained;
      const newLevel = getScoutLevel(newXP);

      const newDailyActions = {
        ...prev.dailyActions,
        quizzesCompleted: prev.dailyActions.quizzesCompleted + 1,
      };

      return {
        ...prev,
        xp: newXP,
        level: newLevel.level,
        title: newLevel.title,
        animals: {
          ...prev.animals,
          [animalId]: {
            ...animal,
            researchXP: newResearchXP,
            stage: newStage,
            hasScientistBonus: isScientist,
          },
        },
        studyProgress: {
          ...prev.studyProgress,
          [animalId]: {
            ...study,
            quizzesCompleted: newQuizzesCompleted,
            isScientist,
          },
        },
        dailyActions: newDailyActions,
      };
    });
  }, []);

  /**
   * Ler um livro — dá XP e aproxima do status de Cientista
   */
  const readBook = useCallback((animalId, bookId) => {
    setGameState((prev) => {
      const animal = prev.animals[animalId];
      const study = prev.studyProgress[animalId];
      if (!animal || !study) return prev;
      if (study.booksRead.includes(bookId)) return prev; // Já lido

      const books = BOOKS[animalId] || [];
      const book = books.find((b) => b.id === bookId);
      if (!book) return prev;

      const newBooksRead = [...study.booksRead, bookId];
      const newResearchXP = animal.researchXP + book.xpRecompensa;

      // Verifica cientista
      const totalQuizzes = (QUIZZES[animalId] || []).length;
      const totalBooks = books.length;
      const isScientist =
        study.quizzesCompleted.length >= totalQuizzes && newBooksRead.length >= totalBooks;

      // XP global
      const newXP = prev.xp + book.xpRecompensa;
      const newLevel = getScoutLevel(newXP);

      // Evolução
      const biomeId = Object.keys(ANIMALS).find((key) =>
        ANIMALS[key].some((a) => a.id === animalId)
      );
      const animalData = biomeId ? ANIMALS[biomeId].find((a) => a.id === animalId) : null;
      const thresholds = animalData?.evolucaoXP || { baby: 0, juvenile: 50, adult: 120 };
      const newStage = getEvolutionStage(newResearchXP, thresholds);

      return {
        ...prev,
        xp: newXP,
        level: newLevel.level,
        title: newLevel.title,
        animals: {
          ...prev.animals,
          [animalId]: {
            ...animal,
            researchXP: newResearchXP,
            stage: newStage,
            hasScientistBonus: isScientist,
          },
        },
        studyProgress: {
          ...prev.studyProgress,
          [animalId]: {
            ...study,
            booksRead: newBooksRead,
            isScientist,
          },
        },
      };
    });
  }, []);

  // ==============================================================================
  // AÇÕES DA LOJA
  // ==============================================================================

  const purchaseItem = useCallback((itemId, price) => {
    setGameState((prev) => {
      if (prev.coins < price) return prev; // Sem moedas suficientes

      const currentQty = prev.inventory[itemId] || 0;
      return {
        ...prev,
        coins: prev.coins - price,
        inventory: {
          ...prev.inventory,
          [itemId]: currentQty + 1,
        },
      };
    });
  }, []);

  const useItem = useCallback((itemId) => {
    setGameState((prev) => {
      const currentQty = prev.inventory[itemId] || 0;
      if (currentQty <= 0) return prev;

      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          [itemId]: currentQty - 1,
        },
      };
    });
  }, []);

  // ==============================================================================
  // AÇÕES DE MISSÕES
  // ==============================================================================

  const claimMissionReward = useCallback((missionType, missionIndex, rewardCoins, rewardXP) => {
    setGameState((prev) => {
      const missions = { ...prev.missions };
      const missionList = [...(missions[missionType] || [])];

      if (!missionList[missionIndex] || missionList[missionIndex].claimed) return prev;

      missionList[missionIndex] = {
        ...missionList[missionIndex],
        claimed: true,
      };

      const newXP = prev.xp + rewardXP;
      const newLevel = getScoutLevel(newXP);

      return {
        ...prev,
        coins: prev.coins + rewardCoins,
        totalCoinsEarned: prev.totalCoinsEarned + rewardCoins,
        xp: newXP,
        level: newLevel.level,
        title: newLevel.title,
        missions: {
          ...missions,
          [missionType]: missionList,
        },
      };
    });
  }, []);

  // ==============================================================================
  // AÇÕES DE CRISE
  // ==============================================================================

  const resolveCrisis = useCallback((eventIndex, rewardCoins, rewardXP) => {
    setGameState((prev) => {
      const events = [...prev.activeEvents];
      if (!events[eventIndex]) return prev;

      events[eventIndex] = {
        ...events[eventIndex],
        resolved: true,
      };

      const newXP = prev.xp + rewardXP;
      const newLevel = getScoutLevel(newXP);

      return {
        ...prev,
        coins: prev.coins + rewardCoins,
        totalCoinsEarned: prev.totalCoinsEarned + rewardCoins,
        xp: newXP,
        level: newLevel.level,
        title: newLevel.title,
        activeEvents: events,
      };
    });
  }, []);

  /**
   * Registra visita ao bioma (para missões diárias)
   */
  const visitBiome = useCallback((biomeId) => {
    setGameState((prev) => ({
      ...prev,
      dailyActions: {
        ...prev.dailyActions,
        biomesVisited: prev.dailyActions.biomesVisited + 1,
      },
    }));
  }, []);

  /**
   * Adiciona moedas diretamente (ex: bônus de completar todas as missões)
   */
  const addCoins = useCallback((amount) => {
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + amount,
      totalCoinsEarned: prev.totalCoinsEarned + amount,
    }));
  }, []);

  // ==============================================================================
  // HELPERS COMPUTADOS
  // ==============================================================================

  /**
   * Verifica se algum animal precisa de atenção (para o badge no tab do Mapa)
   */
  const animalsNeedingAttention = useMemo(() => {
    return Object.entries(gameState.animals).filter(
      ([, animal]) => animal.hunger < 30 || animal.thirst < 30 || animal.happiness < 20
    );
  }, [gameState.animals]);

  /**
   * Conta missões completas mas não resgatadas
   */
  const unclaimedMissions = useMemo(() => {
    let count = 0;
    Object.values(gameState.missions).forEach((missionList) => {
      missionList.forEach((m) => {
        if (m.completed && !m.claimed) count++;
      });
    });
    return count;
  }, [gameState.missions]);

  /**
   * Número de espécies desbloqueadas
   */
  const unlockedSpeciesCount = useMemo(() => {
    return Object.keys(gameState.animals).length;
  }, [gameState.animals]);

  // ==============================================================================
  // VALOR DO CONTEXT
  // ==============================================================================
  const value = useMemo(
    () => ({
      ...gameState,
      gameState,
      isGameLoading,

      // Ações
      feedAnimal,
      waterAnimal,
      completeQuiz,
      readBook,
      purchaseItem,
      useItem,
      claimMissionReward,
      resolveCrisis,
      visitBiome,
      addCoins,

      // Computados
      animalsNeedingAttention,
      unclaimedMissions,
      unlockedSpeciesCount,
    }),
    [
      gameState,
      isGameLoading,
      feedAnimal,
      waterAnimal,
      completeQuiz,
      readBook,
      purchaseItem,
      useItem,
      claimMissionReward,
      resolveCrisis,
      visitBiome,
      addCoins,
      animalsNeedingAttention,
      unclaimedMissions,
      unlockedSpeciesCount,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame deve ser utilizado dentro de um GameProvider');
  }
  return context;
}
