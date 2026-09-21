import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CurrencyHeader from '../../components/CurrencyHeader';
import BottomNavBar from '../../components/BottomNavBar';
import { useGame } from '../../contexts/GameContext';
import styles from './styles';

export default function Missoes() {
  const navigation = useNavigation();
  const { addCoins, dailyActions = {} } = useGame();
  const [activeCategory, setActiveCategory] = useState('diarias');

  const [missions, setMissions] = useState([
    {
      id: 'm1',
      type: 'diarias',
      title: 'Hidratar os Animais',
      description: 'Dê água para 2 animais no mapa do bioma.',
      progress: Math.min(2, dailyActions?.animalsFed || 1),
      total: 2,
      rewardCoins: 15,
      rewardXP: 30,
      claimed: false,
    },
    {
      id: 'm2',
      type: 'diarias',
      title: 'Biólogo Estudioso',
      description: 'Complete 1 quiz na aba de Estudos.',
      progress: Math.min(1, dailyActions?.quizzesCompleted || 0),
      total: 1,
      rewardCoins: 20,
      rewardXP: 40,
      claimed: false,
    },
    {
      id: 'm3',
      type: 'bioma',
      title: 'Explorador do Pantanal',
      description: 'Encontre e cuide da Capivara e do Tuiuiú.',
      progress: 1,
      total: 2,
      rewardCoins: 25,
      rewardXP: 50,
      claimed: false,
    },
    {
      id: 'm4',
      type: 'bioma',
      title: 'Reflorestar a Amazônia',
      description: 'Plante 1 muda nativa no Modo Edição.',
      progress: 0,
      total: 1,
      rewardCoins: 30,
      rewardXP: 60,
      claimed: false,
    },
  ]);

  const handleClaim = (missionId, rewardCoins) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, claimed: true } : m))
    );
    addCoins(rewardCoins);
  };

  const filteredMissions = missions.filter((m) =>
    activeCategory === 'todas' ? true : m.type === activeCategory
  );

  return (
    <ImageBackground
      source={require('../../../assets/fundo-ceu.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Cabeçalho com Moedas e Diamantes no Canto Superior Direito */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>📜 Missões</Text>
            <Text style={styles.headerSubtitle}>Complete tarefas ecológicas e ganhe moedas!</Text>
          </View>
          <CurrencyHeader />
        </View>

        {/* Abas de Categoria */}
        <View style={styles.tabFilter}>
          <Pressable
            style={[styles.filterBtn, activeCategory === 'diarias' && styles.filterBtnActive]}
            onPress={() => setActiveCategory('diarias')}
          >
            <Text
              style={[styles.filterBtnText, activeCategory === 'diarias' && styles.filterBtnTextActive]}
            >
              ☀️ Diárias
            </Text>
          </Pressable>

          <Pressable
            style={[styles.filterBtn, activeCategory === 'bioma' && styles.filterBtnActive]}
            onPress={() => setActiveCategory('bioma')}
          >
            <Text
              style={[styles.filterBtnText, activeCategory === 'bioma' && styles.filterBtnTextActive]}
            >
              🌿 Do Bioma
            </Text>
          </Pressable>
        </View>

        {/* Lista de Missões */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredMissions.map((item) => {
            const isCompleted = item.progress >= item.total;
            const progressPercent = Math.min(100, (item.progress / item.total) * 100);

            return (
              <View key={item.id} style={styles.missionCard}>
                <View style={styles.missionCardHeader}>
                  <View style={styles.missionIcon}>
                    <Ionicons
                      name={item.type === 'diarias' ? 'sunny' : 'leaf'}
                      size={22}
                      color="#2E7D32"
                    />
                  </View>
                  <View style={styles.missionTitleWrapper}>
                    <Text style={styles.missionTitle}>{item.title}</Text>
                    <Text style={styles.missionDesc}>{item.description}</Text>
                  </View>
                </View>

                {/* Barra de Progresso */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                  </View>
                  <Text style={styles.progressText}>
                    {item.progress}/{item.total}
                  </Text>
                </View>

                {/* Recompensa e Ação */}
                <View style={styles.cardFooter}>
                  <View style={styles.rewardBadges}>
                    <View style={styles.rewardPill}>
                      <Text style={styles.rewardPillText}>🪙 +{item.rewardCoins}</Text>
                    </View>
                    <View style={[styles.rewardPill, styles.rewardPillXP]}>
                      <Text style={styles.rewardPillText}>⭐ +{item.rewardXP} XP</Text>
                    </View>
                  </View>

                  {item.claimed ? (
                    <View style={styles.claimedBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.claimedText}>Resgatado</Text>
                    </View>
                  ) : isCompleted ? (
                    <Pressable
                      style={styles.claimBtn}
                      onPress={() => handleClaim(item.id, item.rewardCoins)}
                    >
                      <Text style={styles.claimBtnText}>Resgatar</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>Em andamento</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
          <View style={{ height: 90 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Barra de Navegação Inferior de Madeira */}
      <BottomNavBar activeTab="Missões" />
    </ImageBackground>
  );
}
