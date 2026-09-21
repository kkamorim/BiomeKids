import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Image,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { getScoutLevel, getXPToNextLevel } from '../../data/gameData';
import styles from './styles';

export default function Perfil() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { xp = 0, coins = 10, totalCoinsEarned = 10, dailyStreak = 1, dailyActions = {} } = useGame();

  // Nível do escoteiro
  const scoutLevel = getScoutLevel(xp);
  const xpProgression = getXPToNextLevel(xp);

  // Estados de Acessibilidade
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Lista de Conquistas
  const achievements = [
    {
      id: '1',
      title: 'Primeiro Resgate',
      description: 'Alimente ou hidrate seu primeiro animal.',
      icon: 'heart',
      completed: (dailyActions?.animalsFed || 0) > 0,
      reward: '+20 🪙',
    },
    {
      id: '2',
      title: 'Biólogo Mirim',
      description: 'Acerte 100% em qualquer quiz de estudo.',
      icon: 'school',
      completed: (dailyActions?.quizzesCompleted || 0) > 0,
      reward: '+30 🪙',
    },
    {
      id: '3',
      title: 'Guardião das Águas',
      description: 'Ajude os animais do Pantanal a se refrescarem.',
      icon: 'water',
      completed: true,
      reward: '+15 🪙',
    },
    {
      id: '4',
      title: 'Explorador da Floresta',
      description: 'Desbloqueie o mapa da Amazônia.',
      icon: 'compass',
      completed: false,
      reward: '+50 🪙',
    },
  ];

  // Ação de Logout
  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta 🚪',
      'Tem certeza de que deseja sair? Seu progresso salvo permanecerá seguro.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/fundo-ceu.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Pressable
            style={styles.backBtn}
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Biomas')}
          >
            <Ionicons name="arrow-back" size={22} color="#4A3428" />
          </Pressable>

          <Text style={styles.headerTitle}>Perfil do Escoteiro</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Card do Escoteiro */}
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={48} color="#2E7D32" />
              </View>
              <View style={styles.badgeLevel}>
                <Text style={styles.badgeLevelText}>{scoutLevel.level}</Text>
              </View>
            </View>

            <Text style={styles.userName}>{user?.nome || 'Escoteiro Biome'}</Text>
            <Text style={styles.userRole}>{scoutLevel.icon} {scoutLevel.title}</Text>

            {/* Barra de XP */}
            <View style={styles.xpSection}>
              <View style={styles.xpRow}>
                <Text style={styles.xpLabel}>Experiência (XP)</Text>
                <Text style={styles.xpValue}>
                  {xpProgression.current} / {xpProgression.total} XP
                </Text>
              </View>
              <View style={styles.xpBarBackground}>
                <View
                  style={[
                    styles.xpBarFill,
                    { width: `${Math.min(100, Math.max(8, xpProgression.progress * 100))}%` },
                  ]}
                />
              </View>
            </View>

            {/* Estatísticas Rápidas */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>🪙</Text>
                <Text style={styles.statNumber}>{coins}</Text>
                <Text style={styles.statLabel}>Moedas</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>💎</Text>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Diamantes</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statNumber}>{dailyStreak}d</Text>
                <Text style={styles.statLabel}>Expedição</Text>
              </View>
            </View>
          </View>

          {/* 1. SEÇÃO: CONQUISTAS */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trophy" size={20} color="#F57C00" />
              <Text style={styles.sectionTitle}>Conquistas da Expedição</Text>
            </View>

            {achievements.map((item) => (
              <View
                key={item.id}
                style={[styles.achievementItem, item.completed && styles.achievementItemCompleted]}
              >
                <View
                  style={[
                    styles.achievementIconCircle,
                    item.completed ? styles.achievementIconDone : styles.achievementIconPending,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.completed ? '#FFF' : '#9E9E9E'}
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>{item.title}</Text>
                  <Text style={styles.achievementDesc}>{item.description}</Text>
                </View>
                <View style={styles.achievementReward}>
                  {item.completed ? (
                    <Ionicons name="checkmark-circle" size={24} color="#2E7D32" />
                  ) : (
                    <Text style={styles.rewardText}>{item.reward}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* 2. SEÇÃO: ACESSIBILIDADE */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="accessibility" size={20} color="#1976D2" />
              <Text style={styles.sectionTitle}>Acessibilidade e Inclusão</Text>
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionLabel}>Leitura em Voz Alta (TTS)</Text>
                <Text style={styles.optionDesc}>Narração automática de textos e quizzes</Text>
              </View>
              <Switch
                value={ttsEnabled}
                onValueChange={setTtsEnabled}
                trackColor={{ false: '#CFD8DC', true: '#81C784' }}
                thumbColor={ttsEnabled ? '#2E7D32' : '#ECEFF1'}
              />
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionLabel}>Modo Alto Contraste</Text>
                <Text style={styles.optionDesc}>Contorno e cores nítidas para fácil leitura</Text>
              </View>
              <Switch
                value={highContrast}
                onValueChange={setHighContrast}
                trackColor={{ false: '#CFD8DC', true: '#81C784' }}
                thumbColor={highContrast ? '#2E7D32' : '#ECEFF1'}
              />
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionLabel}>Tamanho de Texto Aumentado</Text>
                <Text style={styles.optionDesc}>Letras maiores e mais espaçadas</Text>
              </View>
              <Switch
                value={largeFont}
                onValueChange={setLargeFont}
                trackColor={{ false: '#CFD8DC', true: '#81C784' }}
                thumbColor={largeFont ? '#2E7D32' : '#ECEFF1'}
              />
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionLabel}>Efeitos Sonoros (SFX)</Text>
                <Text style={styles.optionDesc}>Sons de animais, cliques e recompensas</Text>
              </View>
              <Switch
                value={sfxEnabled}
                onValueChange={setSfxEnabled}
                trackColor={{ false: '#CFD8DC', true: '#81C784' }}
                thumbColor={sfxEnabled ? '#2E7D32' : '#ECEFF1'}
              />
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionLabel}>Música Ambiente da Selva</Text>
                <Text style={styles.optionDesc}>Trilha sonora relaxante nos biomas</Text>
              </View>
              <Switch
                value={musicEnabled}
                onValueChange={setMusicEnabled}
                trackColor={{ false: '#CFD8DC', true: '#81C784' }}
                thumbColor={musicEnabled ? '#2E7D32' : '#ECEFF1'}
              />
            </View>
          </View>

          {/* 3. SEÇÃO: CONFIGURAÇÕES E SISTEMA */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="settings" size={20} color="#546E7A" />
              <Text style={styles.sectionTitle}>Configurações do Jogo</Text>
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionLabel}>Notificações Diárias</Text>
                <Text style={styles.optionDesc}>Lembrar de alimentar os animais resgatados</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#CFD8DC', true: '#81C784' }}
                thumbColor={notificationsEnabled ? '#2E7D32' : '#ECEFF1'}
              />
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoRowLabel}>Versão do Jogo</Text>
              <Text style={styles.infoRowValue}>BiomeKids v1.2 Educativo</Text>
            </View>
          </View>

          {/* 4. BOTÃO DE LOGOUT */}
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
            <Text style={styles.logoutBtnText}>Sair da Conta</Text>
          </Pressable>

          <View style={styles.footerSpacing} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
