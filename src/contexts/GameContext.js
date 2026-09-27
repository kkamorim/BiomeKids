import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  BIOME_CHAPTERS,
  JOURNEY_STEPS,
  SHOP_ITEMS,
  MISSION_TEMPLATES,
  getBiomeById,
  getJourneyStepById,
} from '../data/biomeJourney';
import { secureStorage } from '../services/secureStorage';

const GameContext = createContext(null);
const STORAGE_KEY = 'biomekids_journey_state_v2';
const SCHEMA_VERSION = 3;
const MAX_OFFLINE_SECONDS = 8 * 60 * 60;
const REQUIRED_LOCAL_LEVEL = 25;
const EMPTY_PROGRESS = Object.freeze({ ecoPoints: 0, pps: 0, tapPower: 1, unlockedNodes: [] });
const DEFAULT_STATS = Object.freeze({
  lessonsCompleted: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  ecosystemTaps: 0,
  nodesUnlocked: 0,
  shopPurchases: 0,
  missionsClaimed: 0,
  biomesCompleted: 0,
  totalCoinsEarned: 0,
  totalCoinsSpent: 0,
  totalDiamondsEarned: 0,
  totalDiamondsSpent: 0,
  totalXpEarned: 0,
  totalEcoPointsEarned: 0,
  lastLessonAt: null,
});

const number = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const positive = (value, fallback = 0) => Math.max(0, number(value, fallback));
const timestamp = (value, fallback = Date.now()) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = typeof value === 'string' ? Date.parse(value) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
};
const dayKey = (now = Date.now()) => {
  const date = new Date(now);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
};
const weekKey = (now = Date.now()) => {
  const date = new Date(now);
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return dayKey(start.getTime());
};
const missionCycleKey = (period, now = Date.now()) => (
  period === 'weekly' ? weekKey(now) : dayKey(now)
);
const uniqueStrings = (values) => [
  ...new Set((Array.isArray(values) ? values : []).filter((value) => typeof value === 'string')),
];
const slug = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-');

function biomeById(id) {
  if (!id) return null;
  try {
    return getBiomeById?.(id) || BIOME_CHAPTERS.find((biome) => biome.id === id) || null;
  } catch {
    return BIOME_CHAPTERS.find((biome) => biome.id === id) || null;
  }
}

function stepById(id) {
  if (!id) return null;
  try {
    return getJourneyStepById?.(id) || JOURNEY_STEPS.find((step) => step.id === id) || null;
  } catch {
    return JOURNEY_STEPS.find((step) => step.id === id) || null;
  }
}

function initialBiomeId() {
  const tropical = BIOME_CHAPTERS.find((biome) => {
    const value = slug(`${biome.id} ${biome.name} ${biome.shortName}`);
    return value.includes('floresta-tropical') || value.includes('tropical-rainforest');
  });
  return tropical?.id || BIOME_CHAPTERS[0]?.id || 'floresta-tropical';
}

function buildBiomeProgress(saved = {}) {
  const result = {};
  BIOME_CHAPTERS.forEach((biome) => {
    const value = saved[biome.id] || {};
    result[biome.id] = {
      ecoPoints: positive(value.ecoPoints ?? value.accumulatedPoints),
      pps: positive(value.pps ?? value.pointsPerSecond),
      tapPower: Math.max(1, positive(value.tapPower, 1)),
      unlockedNodes: uniqueStrings(value.unlockedNodes),
    };
  });
  return result;
}

function createInitialState(now = Date.now()) {
  return {
    schemaVersion: SCHEMA_VERSION,
    coins: 180,
    diamonds: 12,
    hearts: 5,
    maxHearts: 5,
    fuel: 5,
    maxFuel: 5,
    xp: 0,
    streak: 0,
    coinAccumulator: 0,
    activeBiomeId: initialBiomeId(),
    currentJourneyIndex: 0,
    completedSteps: [],
    biomeProgress: buildBiomeProgress(),
    collection: [],
    inventory: {},
    activeBoosts: { coinsUntil: null, xpUntil: null },
    missionProgress: {},
    claimedMissions: [],
    missionCycles: {
      dailyKey: dayKey(now),
      weeklyKey: weekKey(now),
      dailyBaseline: {},
      weeklyBaseline: {},
    },
    stats: { ...DEFAULT_STATS },
    lastSavedAt: now,
  };
}

function cleanMap(source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return {};
  return Object.fromEntries(Object.entries(source).map(([key, value]) => [key, positive(value)]));
}

function mergeSavedState(saved, now = Date.now()) {
  const base = createInitialState(now);
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return base;
  const maxHearts = Math.max(1, Math.floor(positive(saved.maxHearts, base.maxHearts)));
  const maxFuel = Math.max(1, Math.floor(positive(saved.maxFuel, base.maxFuel)));
  const activeBiomeId = biomeById(saved.activeBiomeId) ? saved.activeBiomeId : base.activeBiomeId;
  const missionProgress = cleanMap(saved.missionProgress);
  const savedMissionCycles = saved.missionCycles && typeof saved.missionCycles === 'object'
    ? saved.missionCycles
    : null;
  return {
    ...base,
    schemaVersion: SCHEMA_VERSION,
    coins: positive(saved.coins, base.coins),
    diamonds: positive(saved.diamonds, base.diamonds),
    hearts: Math.min(maxHearts, positive(saved.hearts, base.hearts)),
    maxHearts,
    fuel: Math.min(maxFuel, positive(saved.fuel, base.fuel)),
    maxFuel,
    xp: positive(saved.xp),
    streak: Math.floor(positive(saved.streak)),
    coinAccumulator: Math.min(0.999999, positive(saved.coinAccumulator)),
    activeBiomeId,
    currentJourneyIndex: Math.min(
      JOURNEY_STEPS.length,
      Math.floor(positive(saved.currentJourneyIndex))
    ),
    completedSteps: uniqueStrings(saved.completedSteps),
    biomeProgress: buildBiomeProgress(saved.biomeProgress ?? saved.biomesProgress),
    collection: Array.isArray(saved.collection) ? saved.collection : [],
    inventory: cleanMap(saved.inventory),
    activeBoosts: {
      coinsUntil: timestamp(saved.activeBoosts?.coinsUntil, 0) > now
        ? timestamp(saved.activeBoosts.coinsUntil, 0) : null,
      xpUntil: timestamp(saved.activeBoosts?.xpUntil, 0) > now
        ? timestamp(saved.activeBoosts.xpUntil, 0) : null,
    },
    missionProgress,
    claimedMissions: uniqueStrings(saved.claimedMissions),
    missionCycles: {
      dailyKey: savedMissionCycles?.dailyKey || dayKey(now),
      weeklyKey: savedMissionCycles?.weeklyKey || weekKey(now),
      dailyBaseline: savedMissionCycles
        ? cleanMap(savedMissionCycles.dailyBaseline)
        : { ...missionProgress },
      weeklyBaseline: savedMissionCycles
        ? cleanMap(savedMissionCycles.weeklyBaseline)
        : { ...missionProgress },
    },
    stats: { ...DEFAULT_STATS, ...(saved.stats || {}) },
    lastSavedAt: timestamp(saved.lastSavedAt ?? saved.lastSavedTime, now),
  };
}

function refreshMissionCycles(state, now = Date.now()) {
  const dailyKey = dayKey(now);
  const weeklyKey = weekKey(now);
  const current = state.missionCycles || {};
  const dailyChanged = current.dailyKey !== dailyKey;
  const weeklyChanged = current.weeklyKey !== weeklyKey;
  if (!dailyChanged && !weeklyChanged) return state;
  return {
    ...state,
    missionCycles: {
      dailyKey,
      weeklyKey,
      dailyBaseline: dailyChanged
        ? { ...state.missionProgress }
        : cleanMap(current.dailyBaseline),
      weeklyBaseline: weeklyChanged
        ? { ...state.missionProgress }
        : cleanMap(current.weeklyBaseline),
    },
  };
}

function multipliers(state, now = Date.now()) {
  return {
    coins: timestamp(state.activeBoosts?.coinsUntil, 0) > now ? 2 : 1,
    xp: timestamp(state.activeBoosts?.xpUntil, 0) > now ? 2 : 1,
  };
}

function cleanBoosts(boosts, now) {
  return {
    coinsUntil: timestamp(boosts?.coinsUntil, 0) > now ? timestamp(boosts.coinsUntil, 0) : null,
    xpUntil: timestamp(boosts?.xpUntil, 0) > now ? timestamp(boosts.xpUntil, 0) : null,
  };
}

function extendBoost(boosts, key, minutes, now) {
  const startsAt = Math.max(now, timestamp(boosts?.[key], 0));
  return { ...boosts, [key]: startsAt + Math.max(1, positive(minutes, 30)) * 60000 };
}

function applyBoost(boosts, boost, now) {
  if (!boost) return boosts;
  if (Array.isArray(boost)) return boost.reduce((next, item) => applyBoost(next, item, now), boosts);
  const item = typeof boost === 'string' ? { type: boost } : boost;
  if (!item || typeof item !== 'object') return boosts;
  const type = slug(item.type || item.kind || item.id);
  const minutes = item.durationMinutes ?? item.minutes ?? item.duration ?? 30;
  let next = boosts;
  if (type.includes('coin') || type.includes('moeda')) next = extendBoost(next, 'coinsUntil', minutes, now);
  if (type.includes('xp')) next = extendBoost(next, 'xpUntil', minutes, now);
  if (item.coinsMinutes || item.coinMinutes) {
    next = extendBoost(next, 'coinsUntil', item.coinsMinutes ?? item.coinMinutes, now);
  }
  if (item.xpMinutes) next = extendBoost(next, 'xpUntil', item.xpMinutes, now);
  return next;
}

function rewardValue(reward, ...keys) {
  const key = keys.find((candidate) => reward?.[candidate] !== undefined);
  return key ? positive(reward[key]) : 0;
}

function grantReward(state, reward = {}, now = Date.now()) {
  const active = multipliers(state, now);
  const coins = Math.round(rewardValue(reward, 'coins', 'coin') * active.coins);
  const xp = Math.round(rewardValue(reward, 'xp') * active.xp);
  const diamonds = Math.round(rewardValue(reward, 'diamonds', 'diamond'));
  const fuel = Math.round(rewardValue(reward, 'fuel'));
  const ecoPoints = rewardValue(reward, 'ecoPoints', 'ecosystemPoints');
  const progress = state.biomeProgress[state.activeBiomeId] || { ...EMPTY_PROGRESS };
  let activeBoosts = applyBoost(cleanBoosts(state.activeBoosts, now), reward.boost, now);
  if (reward.coinBoostMinutes) activeBoosts = extendBoost(activeBoosts, 'coinsUntil', reward.coinBoostMinutes, now);
  if (reward.xpBoostMinutes) activeBoosts = extendBoost(activeBoosts, 'xpUntil', reward.xpBoostMinutes, now);
  return {
    ...state,
    coins: state.coins + coins,
    diamonds: state.diamonds + diamonds,
    fuel: Math.min(state.maxFuel, state.fuel + fuel),
    xp: state.xp + xp,
    biomeProgress: ecoPoints > 0 ? {
      ...state.biomeProgress,
      [state.activeBiomeId]: {
        ...progress,
        ecoPoints: positive(progress.ecoPoints) + ecoPoints,
      },
    } : state.biomeProgress,
    activeBoosts,
    stats: {
      ...state.stats,
      totalCoinsEarned: positive(state.stats.totalCoinsEarned) + coins,
      totalDiamondsEarned: positive(state.stats.totalDiamondsEarned) + diamonds,
      totalXpEarned: positive(state.stats.totalXpEarned) + xp,
      totalEcoPointsEarned: positive(state.stats.totalEcoPointsEarned) + ecoPoints,
    },
  };
}

function applyPassive(state, now = Date.now()) {
  state = refreshMissionCycles(state, now);
  const previousSavedAt = timestamp(state.lastSavedAt, now);
  const elapsed = Math.min(
    MAX_OFFLINE_SECONDS,
    Math.max(0, Math.floor((now - previousSavedAt) / 1000))
  );
  const activeBoosts = cleanBoosts(state.activeBoosts, now);
  if (elapsed < 1) {
    const changed = activeBoosts.coinsUntil !== state.activeBoosts?.coinsUntil
      || activeBoosts.xpUntil !== state.activeBoosts?.xpUntil;
    return changed ? { ...state, activeBoosts } : state;
  }
  let earned = 0;
  let totalPps = 0;
  const biomeProgress = Object.fromEntries(Object.entries(state.biomeProgress).map(([id, value]) => {
    const pps = positive(value.pps);
    const amount = pps * elapsed;
    totalPps += pps;
    earned += amount;
    return [id, { ...value, ecoPoints: positive(value.ecoPoints) + amount }];
  }));
  const effectiveEnd = previousSavedAt + elapsed * 1000;
  const boostUntil = timestamp(state.activeBoosts?.coinsUntil, 0);
  const boostedSeconds = Math.max(
    0,
    Math.min(elapsed, (Math.min(boostUntil, effectiveEnd) - previousSavedAt) / 1000)
  );
  const accumulatedCoins = positive(state.coinAccumulator)
    + (totalPps * (elapsed + boostedSeconds)) / 60;
  const coinsEarned = Math.floor(accumulatedCoins);
  return {
    ...state,
    coins: state.coins + coinsEarned,
    coinAccumulator: accumulatedCoins - coinsEarned,
    biomeProgress,
    activeBoosts,
    missionProgress: coinsEarned > 0
      ? bumpMetrics(state.missionProgress, [
        { names: ['coinsEarned', 'passiveCoins'], amount: coinsEarned },
      ])
      : state.missionProgress,
    stats: {
      ...state.stats,
      totalCoinsEarned: positive(state.stats.totalCoinsEarned) + coinsEarned,
      totalEcoPointsEarned: positive(state.stats.totalEcoPointsEarned) + earned,
    },
    lastSavedAt: now,
  };
}

function itemKey(item) {
  if (typeof item === 'string') return item;
  return item?.id || item?.key || item?.slug || JSON.stringify(item);
}

function addCollection(collection, item) {
  if (!item || collection.some((entry) => itemKey(entry) === itemKey(item))) return collection;
  return [...collection, item];
}

function bumpMetrics(progress, groups) {
  const next = { ...progress };
  groups.forEach(({ names, amount = 1, maximum = false }) => {
    [...new Set(names.filter(Boolean))].forEach((name) => {
      next[name] = maximum
        ? Math.max(positive(next[name]), amount)
        : positive(next[name]) + amount;
    });
  });
  return next;
}

function localLevel(state, biomeId) {
  return JOURNEY_STEPS.reduce((highest, step) => (
    step.type === 'lesson'
    && step.biomeId === biomeId
    && state.completedSteps.includes(step.id)
      ? Math.max(highest, positive(step.localLevel)) : highest
  ), 0);
}

function treeComplete(state, biomeId) {
  const nodes = biomeById(biomeId)?.treeNodes || [];
  const unlocked = state.biomeProgress[biomeId]?.unlockedNodes || [];
  return nodes.length > 0 && nodes.every((node) => unlocked.includes(node.id));
}

const biomeReady = (state, biomeId) => (
  localLevel(state, biomeId) >= REQUIRED_LOCAL_LEVEL && treeComplete(state, biomeId)
);

function biomeUnlocked(state, biomeId) {
  const ordered = [...BIOME_CHAPTERS].sort((a, b) => number(a.order) - number(b.order));
  const index = ordered.findIndex((biome) => biome.id === biomeId);
  if (index < 0) return false;
  if (index === 0) return true;
  const transition = JOURNEY_STEPS.find((step) => step.type === 'transition' && step.toBiomeId === biomeId);
  return transition
    ? state.completedSteps.includes(transition.id)
    : biomeReady(state, ordered[index - 1].id);
}

function stepUnlocked(state, value) {
  const step = typeof value === 'string' ? stepById(value) : value;
  if (!step) return false;
  if (state.completedSteps.includes(step.id)) return true;
  const index = JOURNEY_STEPS.findIndex((entry) => entry.id === step.id);
  if (index < 0) return false;
  const previous = JOURNEY_STEPS[index - 1];
  if (previous && !state.completedSteps.includes(previous.id)) return false;
  return step.type === 'transition' ? biomeReady(state, step.biomeId) : biomeUnlocked(state, step.biomeId);
}

function nextJourneyIndex(completedSteps) {
  const index = JOURNEY_STEPS.findIndex((step) => !completedSteps.includes(step.id));
  return index < 0 ? JOURNEY_STEPS.length : index;
}

function nextStreak(current, lastLessonAt, now) {
  if (!lastLessonAt) return 1;
  const previous = new Date(timestamp(lastLessonAt, 0));
  const today = new Date(now);
  const previousDay = new Date(previous.getFullYear(), previous.getMonth(), previous.getDate()).getTime();
  const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const days = Math.round((currentDay - previousDay) / 86400000);
  if (days <= 0) return Math.max(1, current);
  return days === 1 ? Math.max(1, current) + 1 : 1;
}

function missionValue(state, mission) {
  if (!mission?.metric) return 0;
  const value = mission.metric === 'streak'
    ? Math.max(state.streak, positive(state.missionProgress.streak))
    : positive(state.missionProgress[mission.metric] ?? state.stats[mission.metric]);
  const baselineKey = mission.period === 'weekly' ? 'weeklyBaseline' : 'dailyBaseline';
  const baseline = positive(state.missionCycles?.[baselineKey]?.[mission.metric]);
  return Math.max(0, value - baseline);
}

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(() => createInitialState());
  const [isGameLoading, setIsGameLoading] = useState(true);
  const stateRef = useRef(gameState);
  const persistTimer = useRef(null);
  const lastPersistedAt = useRef(0);

  const replaceState = useCallback((next) => {
    stateRef.current = next;
    setGameState(next);
  }, []);

  const commit = useCallback((mutator) => {
    const previous = stateRef.current;
    const current = refreshMissionCycles(previous, Date.now());
    const outcome = mutator(current);
    const next = outcome?.state || current;
    if (next !== previous) replaceState(next);
    return outcome?.result ?? (next !== previous);
  }, [replaceState]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let saved = null;
      try {
        const raw = await secureStorage.getItem(STORAGE_KEY);
        saved = raw ? JSON.parse(raw) : null;
      } catch (error) {
        console.warn('Nao foi possivel carregar o progresso do BiomeKids:', error);
      }
      if (cancelled) return;
      const now = Date.now();
      replaceState(applyPassive(mergeSavedState(saved, now), now));
      setIsGameLoading(false);
    })();
    return () => { cancelled = true; };
  }, [replaceState]);

  useEffect(() => {
    if (isGameLoading) return undefined;
    const interval = setInterval(() => {
      commit((current) => {
        const next = applyPassive(current, Date.now());
        return { state: next, result: next !== current };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [commit, isGameLoading]);

  useEffect(() => {
    if (isGameLoading) return undefined;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    const delay = Math.max(0, 2000 - (Date.now() - lastPersistedAt.current));
    persistTimer.current = setTimeout(async () => {
      await secureStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current));
      lastPersistedAt.current = Date.now();
      persistTimer.current = null;
    }, delay);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
      persistTimer.current = null;
    };
  }, [gameState, isGameLoading]);

  useEffect(() => () => {
    secureStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current));
  }, []);

  const completeLesson = useCallback((stepId, options = {}) => commit((current) => {
    const step = stepById(stepId);
    if (!step || step.type !== 'lesson') return { state: current, result: false };
    if (current.completedSteps.includes(step.id)) return { state: current, result: true };
    if (!stepUnlocked(current, step) || current.fuel < 1) return { state: current, result: false };

    const now = Date.now();
    const completedSteps = [...current.completedSteps, step.id];
    const streak = nextStreak(current.streak, current.stats.lastLessonAt, now);
    let next = grantReward({
      ...current,
      fuel: current.fuel - 1,
      streak,
      activeBiomeId: step.biomeId || current.activeBiomeId,
      completedSteps,
      currentJourneyIndex: nextJourneyIndex(completedSteps),
      stats: {
        ...current.stats,
        lessonsCompleted: positive(current.stats.lessonsCompleted) + 1,
        correctAnswers: positive(current.stats.correctAnswers) + (options.correct === false ? 0 : 1),
        lastLessonAt: now,
      },
    }, step.reward, now);

    next = {
      ...next,
      collection: addCollection(next.collection, step.collectionItem),
      missionProgress: bumpMetrics(next.missionProgress, [
        { names: ['lessonsCompleted', 'lessons', 'completedLessons'] },
        { names: [`${step.biomeId}:lessons`] },
        { names: ['streak'], amount: streak, maximum: true },
      ]),
      lastSavedAt: now,
    };
    return { state: next, result: true };
  }), [commit]);

  const answerIncorrect = useCallback(() => commit((current) => {
    if (current.hearts <= 0) return { state: current, result: false };
    return {
      state: {
        ...current,
        hearts: Math.max(0, current.hearts - 1),
        missionProgress: bumpMetrics(current.missionProgress, [
          { names: ['incorrectAnswers', 'mistakes'] },
        ]),
        stats: {
          ...current.stats,
          incorrectAnswers: positive(current.stats.incorrectAnswers) + 1,
        },
        lastSavedAt: Date.now(),
      },
      result: true,
    };
  }), [commit]);

  const tapEcosystem = useCallback((biomeId) => commit((current) => {
    if (!biomeUnlocked(current, biomeId)) return { state: current, result: false };
    const progress = current.biomeProgress[biomeId] || { ...EMPTY_PROGRESS };
    const earned = Math.max(1, positive(progress.tapPower, 1));
    return {
      state: {
        ...current,
        biomeProgress: {
          ...current.biomeProgress,
          [biomeId]: { ...progress, ecoPoints: progress.ecoPoints + earned },
        },
        missionProgress: bumpMetrics(current.missionProgress, [
          { names: ['ecosystemTaps', 'taps'] },
          { names: ['ecoPointsEarned'], amount: earned },
        ]),
        stats: {
          ...current.stats,
          ecosystemTaps: positive(current.stats.ecosystemTaps) + 1,
          totalEcoPointsEarned: positive(current.stats.totalEcoPointsEarned) + earned,
        },
        lastSavedAt: Date.now(),
      },
      result: earned,
    };
  }), [commit]);

  const buyEvolutionNode = useCallback((biomeId, nodeId) => commit((current) => {
    const biome = biomeById(biomeId);
    const node = biome?.treeNodes?.find((entry) => entry.id === nodeId);
    const progress = current.biomeProgress[biomeId];
    if (!node || !progress || !biomeUnlocked(current, biomeId)) {
      return { state: current, result: false };
    }
    if (progress.unlockedNodes.includes(node.id)) return { state: current, result: true };
    if (localLevel(current, biomeId) < positive(node.requiredLocalLevel)) {
      return { state: current, result: false };
    }
    if (node.requiredNodeId && !progress.unlockedNodes.includes(node.requiredNodeId)) {
      return { state: current, result: false };
    }
    const cost = positive(node.cost);
    if (progress.ecoPoints < cost) return { state: current, result: false };
    return {
      state: {
        ...current,
        biomeProgress: {
          ...current.biomeProgress,
          [biomeId]: {
            ...progress,
            ecoPoints: progress.ecoPoints - cost,
            pps: progress.pps + positive(node.pps),
            tapPower: progress.tapPower + positive(node.tapBonus),
            unlockedNodes: [...progress.unlockedNodes, node.id],
          },
        },
        collection: addCollection(current.collection, node.collectionItem),
        missionProgress: bumpMetrics(current.missionProgress, [
          { names: ['nodesUnlocked', 'evolutionNodes'] },
          { names: [`${biomeId}:nodes`] },
        ]),
        stats: { ...current.stats, nodesUnlocked: positive(current.stats.nodesUnlocked) + 1 },
        lastSavedAt: Date.now(),
      },
      result: true,
    };
  }), [commit]);

  const purchaseShopItem = useCallback((itemId) => commit((current) => {
    const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
    if (!item) return { state: current, result: false };
    const currency = item.currency === 'diamonds' ? 'diamonds' : 'coins';
    const price = positive(item.price);
    if (current[currency] < price) return { state: current, result: false };
    if (item.type === 'hearts' && current.hearts >= current.maxHearts) {
      return { state: current, result: false };
    }
    if (item.type === 'fuel' && current.fuel >= current.maxFuel) {
      return { state: current, result: false };
    }
    if (item.type === 'cosmetic' && positive(current.inventory[item.id]) > 0) {
      return { state: current, result: false };
    }

    const now = Date.now();
    let next = {
      ...current,
      [currency]: current[currency] - price,
      inventory: { ...current.inventory, [item.id]: (current.inventory[item.id] || 0) + 1 },
      stats: {
        ...current.stats,
        shopPurchases: positive(current.stats.shopPurchases) + 1,
        totalCoinsSpent: positive(current.stats.totalCoinsSpent) + (currency === 'coins' ? price : 0),
        totalDiamondsSpent: positive(current.stats.totalDiamondsSpent)
          + (currency === 'diamonds' ? price : 0),
      },
    };
    if (item.type === 'hearts') {
      next.hearts = Math.min(current.maxHearts, current.hearts + Math.max(1, positive(item.value, current.maxHearts)));
    } else if (item.type === 'fuel') {
      next.fuel = Math.min(current.maxFuel, current.fuel + Math.max(1, positive(item.value, current.maxFuel)));
    } else if (item.type === 'coinBoost') {
      next.activeBoosts = extendBoost(current.activeBoosts, 'coinsUntil', item.durationMinutes, now);
    } else if (item.type === 'xpBoost') {
      next.activeBoosts = extendBoost(current.activeBoosts, 'xpUntil', item.durationMinutes, now);
    } else if (item.type === 'allBoost') {
      next.activeBoosts = extendBoost(current.activeBoosts, 'coinsUntil', item.durationMinutes, now);
      next.activeBoosts = extendBoost(next.activeBoosts, 'xpUntil', item.durationMinutes, now);
    }
    next = {
      ...next,
      missionProgress: bumpMetrics(next.missionProgress, [
        { names: ['shopPurchases', 'purchases'] },
        { names: [`purchases:${item.category}`] },
      ]),
      lastSavedAt: now,
    };
    return { state: next, result: true };
  }), [commit]);

  const claimMission = useCallback((missionId) => commit((rawState) => {
    const current = refreshMissionCycles(rawState, Date.now());
    const mission = MISSION_TEMPLATES.find((entry) => entry.id === missionId);
    const claimKey = mission
      ? mission.id + ':' + missionCycleKey(mission.period)
      : null;
    if (!mission || current.claimedMissions.includes(claimKey)) {
      return { state: current, result: false };
    }
    if (missionValue(current, mission) < Math.max(1, positive(mission.target, 1))) {
      return { state: current, result: false };
    }
    const now = Date.now();
    const rewarded = grantReward(current, mission.reward, now);
    return {
      state: {
        ...rewarded,
        claimedMissions: [...current.claimedMissions, claimKey],
        missionProgress: bumpMetrics(rewarded.missionProgress, [
          { names: ['missionsClaimed'] },
        ]),
        stats: {
          ...rewarded.stats,
          missionsClaimed: positive(current.stats.missionsClaimed) + 1,
        },
        lastSavedAt: now,
      },
      result: true,
    };
  }), [commit]);

  const selectBiome = useCallback((biomeId) => commit((current) => {
    if (!biomeUnlocked(current, biomeId)) return { state: current, result: false };
    if (current.activeBiomeId === biomeId) return { state: current, result: true };
    return {
      state: {
        ...current,
        activeBiomeId: biomeId,
        missionProgress: bumpMetrics(current.missionProgress, [
          { names: ['biomesVisited', 'biomeVisits'] },
        ]),
        lastSavedAt: Date.now(),
      },
      result: true,
    };
  }), [commit]);

  const setActiveBiomeFromJourney = useCallback((stepId) => commit((current) => {
    const step = stepId ? stepById(stepId) : JOURNEY_STEPS[current.currentJourneyIndex];
    if (!step) return { state: current, result: false };
    if (step.type !== 'transition') {
      if (!step.biomeId || !biomeUnlocked(current, step.biomeId)) {
        return { state: current, result: false };
      }
      if (current.activeBiomeId === step.biomeId) return { state: current, result: true };
      return {
        state: { ...current, activeBiomeId: step.biomeId, lastSavedAt: Date.now() },
        result: true,
      };
    }

    if (!step.toBiomeId) return { state: current, result: false };
    if (current.completedSteps.includes(step.id)) {
      return {
        state: { ...current, activeBiomeId: step.toBiomeId, lastSavedAt: Date.now() },
        result: true,
      };
    }
    if (!stepUnlocked(current, step)) return { state: current, result: false };

    const now = Date.now();
    const completedSteps = [...current.completedSteps, step.id];
    let next = grantReward({
      ...current,
      completedSteps,
      currentJourneyIndex: nextJourneyIndex(completedSteps),
      activeBiomeId: step.toBiomeId,
      stats: {
        ...current.stats,
        biomesCompleted: positive(current.stats.biomesCompleted) + 1,
      },
    }, step.reward, now);
    next = {
      ...next,
      collection: addCollection(next.collection, step.collectionItem),
      missionProgress: bumpMetrics(next.missionProgress, [
        { names: ['biomesCompleted', 'transitionsCompleted'] },
      ]),
      lastSavedAt: now,
    };
    return { state: next, result: true };
  }), [commit]);

  const addCoins = useCallback((amount) => commit((current) => {
    const change = number(amount);
    if (!change) return { state: current, result: false };
    const coins = Math.max(0, current.coins + change);
    return {
      state: {
        ...current,
        coins,
        stats: {
          ...current.stats,
          totalCoinsEarned: positive(current.stats.totalCoinsEarned)
            + Math.max(0, coins - current.coins),
        },
        lastSavedAt: Date.now(),
      },
      result: true,
    };
  }), [commit]);

  const purchaseItem = useCallback((itemId, legacyPrice) => {
    if (SHOP_ITEMS.some((item) => item.id === itemId)) return purchaseShopItem(itemId);
    return commit((current) => {
      const price = positive(legacyPrice);
      if (!itemId || current.coins < price) return { state: current, result: false };
      return {
        state: {
          ...current,
          coins: current.coins - price,
          inventory: { ...current.inventory, [itemId]: (current.inventory[itemId] || 0) + 1 },
          stats: {
            ...current.stats,
            shopPurchases: positive(current.stats.shopPurchases) + 1,
            totalCoinsSpent: positive(current.stats.totalCoinsSpent) + price,
          },
          lastSavedAt: Date.now(),
        },
        result: true,
      };
    });
  }, [commit, purchaseShopItem]);

  const resetProgress = useCallback(async () => {
    replaceState(createInitialState());
    await secureStorage.deleteItem(STORAGE_KEY);
    return true;
  }, [replaceState]);

  const getBiomeProgress = useCallback((biomeId) => (
    stateRef.current.biomeProgress[biomeId] || { ...EMPTY_PROGRESS }
  ), []);
  const isBiomeUnlocked = useCallback((biomeId) => biomeUnlocked(stateRef.current, biomeId), []);
  const isStepUnlocked = useCallback((stepOrId) => stepUnlocked(stateRef.current, stepOrId), []);

  const activeBiome = useMemo(() => biomeById(gameState.activeBiomeId), [gameState.activeBiomeId]);
  const currentStep = JOURNEY_STEPS[gameState.currentJourneyIndex] || null;
  const activeBiomeProgress = gameState.biomeProgress[gameState.activeBiomeId] || EMPTY_PROGRESS;
  const activeMultipliers = multipliers(gameState);
  const totalPps = Object.values(gameState.biomeProgress)
    .reduce((sum, progress) => sum + positive(progress.pps), 0);
  const coinsPerMinute = totalPps * activeMultipliers.coins;
  const missions = useMemo(() => MISSION_TEMPLATES.map((mission) => {
    const progress = missionValue(gameState, mission);
    const target = Math.max(1, positive(mission.target, 1));
    return {
      ...mission,
      progress,
      target,
      completed: progress >= target,
      claimed: gameState.claimedMissions.includes(
        mission.id + ':' + missionCycleKey(mission.period)
      ),
    };
  }), [gameState]);
  const unclaimedMissions = missions.filter((mission) => mission.completed && !mission.claimed).length;
  const unlockedBiomes = BIOME_CHAPTERS
    .filter((biome) => biomeUnlocked(gameState, biome.id))
    .map((biome) => biome.id);
  const totalEvolutionNodes = BIOME_CHAPTERS.reduce(
    (sum, biome) => sum + (biome.treeNodes?.length || 0),
    0
  );
  const completedEvolutionNodes = Object.values(gameState.biomeProgress).reduce(
    (sum, progress) => sum + (progress.unlockedNodes?.length || 0),
    0
  );
  const totalJourneyObjectives = JOURNEY_STEPS.length + totalEvolutionNodes;
  const completedJourneyObjectives = gameState.completedSteps.length + completedEvolutionNodes;
  const journeyProgress = {
    completed: completedJourneyObjectives,
    total: totalJourneyObjectives,
    lessonsAndTransitions: gameState.completedSteps.length,
    evolutionNodes: completedEvolutionNodes,
    percent: totalJourneyObjectives
      ? Math.min(100, (completedJourneyObjectives / totalJourneyObjectives) * 100)
      : 100,
    currentIndex: gameState.currentJourneyIndex,
  };
  const missionSummary = {
    total: missions.length,
    completed: missions.filter((mission) => mission.completed).length,
    claimed: missions.filter((mission) => mission.claimed).length,
    unclaimed: unclaimedMissions,
  };

  const value = useMemo(() => ({
    ...gameState,
    gameState,
    isGameLoading,
    activeBiome,
    currentStep,
    activeBiomeProgress,
    activeMultipliers,
    coinMultiplier: activeMultipliers.coins,
    xpMultiplier: activeMultipliers.xp,
    coinsPerMinute,
    missions,
    missionSummary,
    journeyProgress,
    unclaimedMissions,
    unlockedBiomes,
    unlockedSpeciesCount: gameState.collection.length,

    completeLesson,
    answerIncorrect,
    tapEcosystem,
    buyEvolutionNode,
    purchaseShopItem,
    claimMission,
    selectBiome,
    setActiveBiomeFromJourney,
    resetProgress,
    getBiomeProgress,
    isStepUnlocked,
    isBiomeUnlocked,

    // Aliases temporarios para telas que ainda usam a API anterior.
    addCoins,
    purchaseItem,
    globalCoins: gameState.coins,
    dailyStreak: gameState.streak,
    totalCoinsEarned: gameState.stats.totalCoinsEarned,
    biomesProgress: gameState.biomeProgress,
    lastSavedTime: gameState.lastSavedAt,
  }), [
    gameState,
    isGameLoading,
    activeBiome,
    currentStep,
    activeBiomeProgress,
    activeMultipliers.coins,
    activeMultipliers.xp,
    missions,
    unclaimedMissions,
    unlockedBiomes,
    completeLesson,
    answerIncorrect,
    tapEcosystem,
    buyEvolutionNode,
    purchaseShopItem,
    claimMission,
    selectBiome,
    setActiveBiomeFromJourney,
    resetProgress,
    getBiomeProgress,
    isStepUnlocked,
    isBiomeUnlocked,
    addCoins,
    purchaseItem,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame deve ser utilizado dentro de um GameProvider');
  return context;
}
