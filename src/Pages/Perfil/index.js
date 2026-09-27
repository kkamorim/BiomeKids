import React, { useMemo } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AppBackground from '../../components/AppBackground';
import BottomNavBar from '../../components/BottomNavBar';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { BIOME_CHAPTERS, JOURNEY_STEPS } from '../../data/biomeJourney';
import styles from './styles';

const XP_PER_LEVEL = 250;

const formatNumber = (value) => {
  const number = Number(value) || 0;
  if (number >= 1000000) return (number / 1000000).toFixed(1).replace('.0', '') + ' mi';
  if (number >= 1000) return (number / 1000).toFixed(1).replace('.0', '') + ' mil';
  return String(Math.floor(number));
};

const roleForLevel = (level) => {
  if (level >= 20) return 'Guardião do planeta';
  if (level >= 12) return 'Ecólogo de campo';
  if (level >= 6) return 'Pesquisador da natureza';
  return 'Explorador iniciante';
};

function askForConfirmation(title, message, confirmLabel, action) {
  if (Platform.OS === 'web' && typeof globalThis.confirm === 'function') {
    if (globalThis.confirm(message)) action();
    return;
  }

  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: action },
  ]);
}

function showNotice(title, message) {
  if (Platform.OS === 'web' && typeof globalThis.alert === 'function') {
    globalThis.alert(message);
    return;
  }
  Alert.alert(title, message);
}

export default function Perfil() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const game = useGame();

  const {
    xp = 0,
    streak = 0,
    coins = 0,
    diamonds = 0,
    collection = [],
    completedSteps = [],
    biomeProgress = {},
    unlockedBiomes = [],
    journeyProgress = {},
    stats = {},
    resetProgress,
  } = game;

  const completedSet = useMemo(() => new Set(completedSteps), [completedSteps]);
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const currentLevelXp = xp % XP_PER_LEVEL;
  const xpPercent = Math.min(100, (currentLevelXp / XP_PER_LEVEL) * 100);
  const displayName = user?.fullName || user?.nome || user?.name || 'Explorador BiomeKids';
  const displayEmail = user?.email || 'Progresso local neste dispositivo';

  const biomeSummaries = useMemo(() => BIOME_CHAPTERS.map((biome, index) => {
    const lessonIds = JOURNEY_STEPS
      .filter((step) => step.type === 'lesson' && step.biomeId === biome.id)
      .map((step) => step.id);
    const lessons = lessonIds.filter((id) => completedSet.has(id)).length;
    const progress = biomeProgress[biome.id] || {};
    const nodes = Array.isArray(progress.unlockedNodes) ? progress.unlockedNodes.length : 0;
    const totalNodes = biome.treeNodes?.length || 1;
    const percent = Math.round(
      Math.min(1, (lessons / 25) * 0.75 + (nodes / totalNodes) * 0.25) * 100
    );
    return {
      ...biome,
      lessons,
      nodes,
      totalNodes,
      percent,
      complete: lessons >= 25 && nodes >= totalNodes,
      unlocked: index === 0 || unlockedBiomes.includes(biome.id),
    };
  }), [biomeProgress, completedSet, unlockedBiomes]);

  const completedBiomes = biomeSummaries.filter((biome) => biome.complete).length;

  const achievements = [
    {
      id: 'first-lesson',
      icon: 'leaf',
      title: 'Primeira descoberta',
      description: 'Conclua seu primeiro nível de estudo.',
      complete: (stats.lessonsCompleted || 0) >= 1,
    },
    {
      id: 'streak',
      icon: 'flame',
      title: 'Ritmo natural',
      description: 'Mantenha uma sequência de 3 dias.',
      complete: streak >= 3,
    },
    {
      id: 'tree',
      icon: 'git-network',
      title: 'Raízes fortes',
      description: 'Desbloqueie 3 atributos de evolução.',
      complete: (stats.nodesUnlocked || 0) >= 3,
    },
    {
      id: 'biome',
      icon: 'earth',
      title: 'Guardião de bioma',
      description: 'Complete estudos e árvore de um bioma.',
      complete: completedBiomes >= 1,
    },
    {
      id: 'collection',
      icon: 'albums',
      title: 'Caderno de campo',
      description: 'Registre 10 itens na coleção.',
      complete: collection.length >= 10,
    },
    {
      id: 'planet',
      icon: 'trophy',
      title: 'Guardião do planeta',
      description: 'Conclua toda a trilha dos 9 biomas.',
      complete: (journeyProgress.percent || 0) >= 100,
    },
  ];

  const completedAchievements = achievements.filter((item) => item.complete).length;

  const profileStats = [
    { icon: 'school', value: stats.lessonsCompleted || 0, label: 'níveis' },
    { icon: 'git-network', value: stats.nodesUnlocked || 0, label: 'atributos' },
    { icon: 'albums', value: collection.length, label: 'registros' },
    { icon: 'earth', value: completedBiomes, label: 'biomas' },
    { icon: 'cash', value: formatNumber(stats.totalCoinsEarned), label: 'moedas ganhas' },
    { icon: 'checkmark-done', value: stats.missionsClaimed || 0, label: 'missões' },
  ];

  const handleReset = () => {
    askForConfirmation(
      'Recomeçar progresso',
      'Isso apaga níveis, moedas, árvores, coleção e missões salvas neste dispositivo. Esta ação não pode ser desfeita.',
      'Recomeçar',
      async () => {
        try {
          await resetProgress();
          showNotice('Tudo pronto', 'Sua nova expedição começou na Floresta Tropical.');
        } catch {
          showNotice('Não foi possível recomeçar', 'Tente novamente em alguns instantes.');
        }
      }
    );
  };

  const handleLogout = () => {
    askForConfirmation(
      'Sair da conta',
      'Seu progresso local continuará salvo neste dispositivo.',
      'Sair',
      async () => {
        await logout();
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      }
    );
  };

  const activeColors = game.activeBiome?.theme;

  return (
    <AppBackground
      gradientColors={[
        activeColors?.background || '#F2FAEC',
        activeColors?.soft || '#E7F5DF',
        '#FFF8E8',
      ]}
      decorationColors={[
        activeColors?.primary || '#58CC02',
        activeColors?.secondary || '#1CB0F6',
        '#F5A623',
      ]}
    >
      <StatusBar style={'dark'} />

      <View style={styles.header}>
        <Pressable
          accessibilityRole={'button'}
          accessibilityLabel={'Voltar'}
          hitSlop={8}
          onPress={() => (
            navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Journey')
          )}
          style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
        >
          <Ionicons name={'arrow-back'} size={21} color={'#245C16'} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerEyebrow}>CADERNO DO EXPLORADOR</Text>
          <Text style={styles.headerTitle}>Meu perfil</Text>
        </View>
        <View style={styles.headerButtonPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name={'person'} size={42} color={'#3F9700'} />
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{level}</Text>
            </View>
          </View>

          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{displayEmail}</Text>
          <View style={styles.rolePill}>
            <Ionicons name={'ribbon'} size={15} color={'#F5A623'} />
            <Text style={styles.roleText}>{roleForLevel(level)}</Text>
          </View>

          <View style={styles.xpBlock}>
            <View style={styles.xpLabels}>
              <Text style={styles.xpLabel}>Nível {level}</Text>
              <Text style={styles.xpValue}>
                {currentLevelXp} / {XP_PER_LEVEL} XP
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.xpFill, { width: xpPercent + '%' }]} />
            </View>
            <Text style={styles.nextLevel}>
              Faltam {XP_PER_LEVEL - currentLevelXp} XP para o próximo nível
            </Text>
          </View>

          <View style={styles.walletRow}>
            <View style={styles.walletItem}>
              <Ionicons name={'flame'} size={19} color={'#FF8A1F'} />
              <Text style={styles.walletValue}>{streak}</Text>
              <Text style={styles.walletLabel}>dias</Text>
            </View>
            <View style={styles.walletDivider} />
            <View style={styles.walletItem}>
              <Ionicons name={'cash'} size={19} color={'#D99B00'} />
              <Text style={styles.walletValue}>{formatNumber(coins)}</Text>
              <Text style={styles.walletLabel}>moedas</Text>
            </View>
            <View style={styles.walletDivider} />
            <View style={styles.walletItem}>
              <Ionicons name={'diamond'} size={18} color={'#1CB0F6'} />
              <Text style={styles.walletValue}>{formatNumber(diamonds)}</Text>
              <Text style={styles.walletLabel}>diamantes</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>SUA JORNADA</Text>
            <Text style={styles.sectionTitle}>Progresso nos 9 biomas</Text>
          </View>
          <View style={styles.percentPill}>
            <Text style={styles.percentPillText}>
              {Math.round(journeyProgress.percent || 0)}%
            </Text>
          </View>
        </View>

        <View style={styles.biomeList}>
          {biomeSummaries.map((biome) => (
            <View
              key={biome.id}
              style={[
                styles.biomeCard,
                !biome.unlocked && styles.biomeCardLocked,
              ]}
            >
              <View
                style={[
                  styles.biomeIcon,
                  { backgroundColor: biome.theme?.soft || '#E8F4E1' },
                ]}
              >
                <Text style={styles.biomeEmoji}>
                  {biome.unlocked ? biome.emoji : '🔒'}
                </Text>
              </View>
              <View style={styles.biomeCopy}>
                <View style={styles.biomeTitleRow}>
                  <Text style={styles.biomeName}>{biome.name}</Text>
                  <Text
                    style={[
                      styles.biomePercent,
                      { color: biome.theme?.dark || '#245C16' },
                    ]}
                  >
                    {biome.percent}%
                  </Text>
                </View>
                <View style={styles.biomeMetaRow}>
                  <Text style={styles.biomeMeta}>{biome.lessons}/25 níveis</Text>
                  <Text style={styles.biomeMeta}>
                    {biome.nodes}/{biome.totalNodes} atributos
                  </Text>
                </View>
                <View style={styles.biomeProgressTrack}>
                  <View
                    style={[
                      styles.biomeProgressFill,
                      {
                        width: biome.percent + '%',
                        backgroundColor: biome.theme?.primary || '#58CC02',
                      },
                    ]}
                  />
                </View>
              </View>
              {biome.complete ? (
                <Ionicons name={'checkmark-circle'} size={22} color={'#43A047'} />
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>EM NÚMEROS</Text>
            <Text style={styles.sectionTitle}>Estatísticas da expedição</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {profileStats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <Ionicons name={item.icon} size={20} color={'#3F9700'} />
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionEyebrow}>CONQUISTAS</Text>
            <Text style={styles.sectionTitle}>Marcos do explorador</Text>
          </View>
          <View style={styles.achievementCount}>
            <Ionicons name={'trophy'} size={15} color={'#D98C00'} />
            <Text style={styles.achievementCountText}>
              {completedAchievements}/{achievements.length}
            </Text>
          </View>
        </View>

        <View style={styles.achievementList}>
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                achievement.complete && styles.achievementCardComplete,
              ]}
            >
              <View
                style={[
                  styles.achievementIcon,
                  achievement.complete && styles.achievementIconComplete,
                ]}
              >
                <Ionicons
                  name={achievement.complete ? achievement.icon : 'lock-closed'}
                  size={20}
                  color={achievement.complete ? '#FFFFFF' : '#8B9988'}
                />
              </View>
              <View style={styles.achievementCopy}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
              </View>
              {achievement.complete ? (
                <Ionicons name={'checkmark-circle'} size={22} color={'#43A047'} />
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.accountCard}>
          <View style={styles.accountHeading}>
            <Ionicons name={'settings'} size={20} color={'#687A65'} />
            <Text style={styles.accountTitle}>Conta e progresso</Text>
          </View>

          <Pressable
            accessibilityRole={'button'}
            onPress={handleReset}
            style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}
          >
            <Ionicons name={'refresh'} size={20} color={'#B45A00'} />
            <View style={styles.actionCopy}>
              <Text style={styles.resetButtonText}>Recomeçar progresso</Text>
              <Text style={styles.actionHint}>Apaga a expedição salva neste dispositivo</Text>
            </View>
            <Ionicons name={'chevron-forward'} size={18} color={'#B45A00'} />
          </Pressable>

          <Pressable
            accessibilityRole={'button'}
            onPress={handleLogout}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
          >
            <Ionicons name={'log-out-outline'} size={20} color={'#D94343'} />
            <View style={styles.actionCopy}>
              <Text style={styles.logoutButtonText}>Sair da conta</Text>
              <Text style={styles.actionHint}>Voltar para a tela inicial</Text>
            </View>
            <Ionicons name={'chevron-forward'} size={18} color={'#D94343'} />
          </Pressable>
        </View>

        <Text style={styles.version}>BiomeKids · versão educativa 2.0</Text>
      </ScrollView>

      <BottomNavBar activeTab={'Perfil'} />
    </AppBackground>
  );
}
