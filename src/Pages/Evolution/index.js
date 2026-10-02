import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AppBackground from '../../components/AppBackground';
import StatusHeader from '../../components/StatusHeader';
import BottomNavBar from '../../components/BottomNavBar';
import { useGame } from '../../contexts/GameContext';
import { palette } from '../../theme/designSystem';
import TreeBranch from './TreeBranch';
import styles from './styles';

const CATEGORIES = ['producer', 'consumer', 'discovery'];

export default function Evolution() {
  const navigation = useNavigation();
  const game = useGame();
  const biome = game.activeBiome;
  const progress = game.getBiomeProgress(biome.id);
  const [selected, setSelected] = useState(null);
  const localLevel = useMemo(() => Math.max(0, ...game.completedSteps
    .map((id) => id.startsWith(`${biome.id}-nivel-`) ? Number(id.split('-').pop()) : 0)), [game.completedSteps, biome.id]);

  const buy = () => {
    if (!selected) return;
    if (progress.unlockedNodes.includes(selected.id)) return setSelected(null);
    if (localLevel < selected.requiredLocalLevel) {
      return Alert.alert('Estudo necessário', `Conclua o estudo ${selected.requiredLocalLevel} deste bioma.`);
    }
    if (selected.requiredNodeId && !progress.unlockedNodes.includes(selected.requiredNodeId)) {
      return Alert.alert('Relação ausente', 'Restaure primeiro a conexão anterior desta rede ecológica.');
    }
    if (progress.ecoPoints < selected.cost) {
      return Alert.alert('Dados insuficientes', 'Colete pistas na Expedição ou aguarde a produção da rede ativa.');
    }
    if (game.buyEvolutionNode(biome.id, selected.id)) setSelected(null);
  };

  const observed = progress.observedNodes || [];
  const selectedUnlocked = selected && progress.unlockedNodes.includes(selected.id);

  return (
    <AppBackground colors={[biome.theme.background, palette.background]}>
      <StatusHeader variant={'evolution'} showBiomes onBiomesPress={() => navigation.navigate('Biomas')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={[styles.heroRule, { backgroundColor: biome.theme.primary }]} />
          <View style={styles.heroTop}>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>PAINEL DE RELAÇÕES · {biome.shortName}</Text>
              <Text style={styles.title}>Teia da Vida</Text>
              <Text style={styles.subtitle}>Estudos revelam conexões. Dados de campo restauram cada relação e mudam o mapa vivo.</Text>
            </View>
            <Pressable style={[styles.mapButton, { borderColor: biome.theme.primary }]} onPress={() => navigation.navigate('Expedition')}>
              <Ionicons name={'map-outline'} size={19} color={biome.theme.dark} />
              <Text style={[styles.mapButtonText, { color: biome.theme.dark }]}>Ver mapa</Text>
            </Pressable>
          </View>
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{Math.floor(progress.ecoPoints)}</Text>
              <Text style={styles.statLabel}>dados disponíveis</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>+{progress.pps}/s</Text>
              <Text style={styles.statLabel}>rede ativa</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{progress.unlockedNodes.length}/{biome.treeNodes.length}</Text>
              <Text style={styles.statLabel}>conexões</Text>
            </View>
          </View>
        </View>

        <View style={styles.fieldNote}>
          <Ionicons name={'information-circle-outline'} size={19} color={palette.river} />
          <Text style={styles.fieldNoteText}>Restaurar uma conexão cria condições no habitat. Para entrar no Caderno, o elemento ainda precisa ser observado na Expedição.</Text>
        </View>

        <View style={styles.treeHeader}>
          <View>
            <Text style={styles.treeEyebrow}>REDE ECOLÓGICA</Text>
            <Text style={styles.treeTitle}>Do solo ao equilíbrio</Text>
          </View>
          <View style={styles.levelStamp}>
            <Text style={styles.levelStampSmall}>ESTUDO</Text>
            <Text style={styles.levelStampValue}>{localLevel}/25</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.branches}>
          {CATEGORIES.map((category) => (
            <TreeBranch
              key={category}
              category={category}
              nodes={biome.treeNodes.filter((node) => node.category === category)}
              progress={progress}
              localLevel={localLevel}
              onNode={setSelected}
            />
          ))}
        </ScrollView>

        <View style={styles.legend}>
          <View style={styles.legendItem}><View style={[styles.legendMark, styles.legendRestored]} /><Text style={styles.legendText}>Restaurada</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendMark, { borderColor: biome.theme.primary }]} /><Text style={styles.legendText}>Disponível</Text></View>
          <View style={styles.legendItem}><Ionicons name={'lock-closed-outline'} size={13} color={palette.textMuted} /><Text style={styles.legendText}>Requer estudo</Text></View>
        </View>
      </ScrollView>

      <Modal visible={Boolean(selected)} transparent animationType={'slide'} onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelected(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Pressable style={styles.modalClose} onPress={() => setSelected(null)}>
              <Ionicons name={'close'} size={21} color={palette.textMuted} />
            </Pressable>
            <View style={[styles.modalIcon, { backgroundColor: biome.theme.soft }]}>
              <Ionicons name={selected?.category === 'consumer' ? 'paw-outline' : selected?.category === 'producer' ? 'leaf-outline' : 'sparkles-outline'} size={30} color={biome.theme.dark} />
            </View>
            <Text style={styles.modalKicker}>{selectedUnlocked ? 'CONEXÃO RESTAURADA' : 'CONEXÃO DA TEIA'}</Text>
            <Text style={styles.modalTitle}>{selected?.name}</Text>
            <Text style={styles.modalDescription}>{selected?.description}</Text>
            <View style={styles.mapEffect}>
              <Ionicons name={'map-outline'} size={17} color={palette.river} />
              <Text style={styles.mapEffectText}>{selected?.mapDescription || `Ao restaurar, ${selected?.name?.toLowerCase()} passa a influenciar o habitat e pode ser observado no mapa.`}</Text>
            </View>
            <View style={styles.requirements}>
              <View style={styles.requirement}><Ionicons name={'book-outline'} size={15} color={palette.bark} /><Text style={styles.requirementValue}>{selected?.requiredLocalLevel}</Text><Text style={styles.requirementLabel}>estudo</Text></View>
              <View style={styles.requirement}><Ionicons name={'analytics-outline'} size={15} color={palette.river} /><Text style={styles.requirementValue}>{selected?.cost}</Text><Text style={styles.requirementLabel}>dados</Text></View>
              <View style={styles.requirement}><Ionicons name={'pulse-outline'} size={15} color={palette.moss} /><Text style={styles.requirementValue}>+{selected?.pps}/s</Text><Text style={styles.requirementLabel}>produção</Text></View>
            </View>
            <Pressable disabled={selectedUnlocked} style={[styles.buyButton, { backgroundColor: selectedUnlocked ? palette.disabled : biome.theme.dark }]} onPress={buy}>
              <Text style={styles.buyButtonText}>{selectedUnlocked ? (observed.includes(selected?.id) ? 'Registrada no caderno' : 'Vá observar no mapa') : 'Restaurar conexão'}</Text>
              {!selectedUnlocked ? <Ionicons name={'arrow-forward'} size={18} color={palette.inverseText} /> : null}
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
      <BottomNavBar activeTab={'Teia'} />
    </AppBackground>
  );
}
