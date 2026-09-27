import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AppBackground from '../../components/AppBackground';
import StatusHeader from '../../components/StatusHeader';
import BottomNavBar from '../../components/BottomNavBar';
import { useGame } from '../../contexts/GameContext';
import TreeBranch from './TreeBranch';
import styles from './styles';

const CATEGORIES = ['producer', 'consumer', 'discovery'];

export default function Evolution() {
  const navigation = useNavigation();
  const game = useGame();
  const biome = game.activeBiome;
  const progress = game.getBiomeProgress(biome.id);
  const [selected, setSelected] = useState(null);
  const [tapGain, setTapGain] = useState(null);
  const localLevel = useMemo(() => Math.max(0, ...game.completedSteps
    .map((id) => id.startsWith(biome.id + '-nivel-') ? Number(id.split('-').pop()) : 0)), [game.completedSteps, biome.id]);

  const tap = () => {
    const earned = game.tapEcosystem(biome.id);
    if (earned) {
      setTapGain('+' + earned);
      setTimeout(() => setTapGain(null), 500);
    }
  };

  const buy = () => {
    if (progress.unlockedNodes.includes(selected.id)) return setSelected(null);
    if (localLevel < selected.requiredLocalLevel) return Alert.alert('Estudo necessário', 'Alcance o nível ' + selected.requiredLocalLevel + ' deste bioma.');
    if (selected.requiredNodeId && !progress.unlockedNodes.includes(selected.requiredNodeId)) return Alert.alert('Caminho bloqueado', 'Desbloqueie primeiro o atributo conectado.');
    if (progress.ecoPoints < selected.cost) return Alert.alert('Eco pontos insuficientes', 'Toque no núcleo, estude e aguarde a renda automática.');
    if (game.buyEvolutionNode(biome.id, selected.id)) setSelected(null);
  };

  return (
    <AppBackground colors={[biome.theme.background, biome.theme.soft]}>
      <StatusHeader showBiomes onBiomesPress={() => navigation.navigate('Biomas')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: biome.theme.dark }]}>
          <View>
            <Text style={styles.eyebrow}>ECOSSISTEMA ATIVO</Text>
            <Text style={styles.title}>{biome.emoji} {biome.name}</Text>
            <Text style={styles.subtitle}>Toque, evolua e gere recursos mesmo fora do app.</Text>
          </View>
          <View style={styles.statRow}>
            <View style={styles.stat}><Text style={styles.statValue}>{Math.floor(progress.ecoPoints)}</Text><Text style={styles.statLabel}>eco pontos</Text></View>
            <View style={styles.stat}><Text style={styles.statValue}>+{progress.pps}/s</Text><Text style={styles.statLabel}>produção</Text></View>
            <View style={styles.stat}><Text style={styles.statValue}>{game.coinsPerMinute.toFixed(1)}</Text><Text style={styles.statLabel}>moedas/min</Text></View>
          </View>
        </View>

        <Pressable style={[styles.tapCore, { borderColor: biome.theme.primary }]} onPress={tap}>
          <View style={[styles.tapInner, { backgroundColor: biome.theme.primary }]}>
            <Text style={styles.tapEmoji}>{biome.emoji}</Text>
            <Text style={styles.tapTitle}>GERAR ENERGIA</Text>
            <Text style={styles.tapPower}>+{progress.tapPower} por toque</Text>
          </View>
          {tapGain ? <Text style={[styles.tapGain, { color: biome.theme.dark }]}>{tapGain}</Text> : null}
        </Pressable>

        <View style={styles.treeHeader}>
          <View><Text style={styles.treeEyebrow}>ÁRVORE DE EVOLUÇÃO</Text><Text style={styles.treeTitle}>{progress.unlockedNodes.length}/{biome.treeNodes.length} atributos</Text></View>
          <Pressable style={styles.trackButton} onPress={() => navigation.navigate('Journey')}><Ionicons name={'trail-sign'} size={18} color={biome.theme.dark} /><Text style={[styles.trackButtonText, { color: biome.theme.dark }]}>Trilha</Text></Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.branches}>
          {CATEGORIES.map((category) => <TreeBranch key={category} category={category} nodes={biome.treeNodes.filter((node) => node.category === category)} progress={progress} localLevel={localLevel} onNode={setSelected} />)}
        </ScrollView>
      </ScrollView>

      <Modal visible={Boolean(selected)} transparent animationType={'fade'} onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBackdrop}><View style={styles.modalCard}>
          <Pressable style={styles.modalClose} onPress={() => setSelected(null)}><Ionicons name={'close'} size={22} color={'#516158'} /></Pressable>
          <Text style={styles.modalEmoji}>{selected?.icon}</Text>
          <Text style={styles.modalTitle}>{selected?.name}</Text>
          <Text style={styles.modalDescription}>{selected?.description}</Text>
          <View style={styles.requirements}><Text style={styles.requirement}>🎓 Nível {selected?.requiredLocalLevel}</Text><Text style={styles.requirement}>🌿 {selected?.cost} eco</Text><Text style={styles.requirement}>⚡ +{selected?.pps}/s</Text></View>
          <Pressable style={[styles.buyButton, { backgroundColor: biome.theme.primary }]} onPress={buy}><Text style={styles.buyButtonText}>{progress.unlockedNodes.includes(selected?.id) ? 'Desbloqueado' : 'Desbloquear atributo'}</Text></Pressable>
        </View></View>
      </Modal>
      <BottomNavBar activeTab={'Árvore'} />
    </AppBackground>
  );
}
