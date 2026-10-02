import React, { useMemo, useRef, useState } from 'react';
import { Alert, Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AppBackground from '../../components/AppBackground';
import BottomNavBar from '../../components/BottomNavBar';
import StatusHeader from '../../components/StatusHeader';
import { useGame } from '../../contexts/GameContext';
import { alpha, palette } from '../../theme/designSystem';
import styles from './styles';

const INDICATORS = [
  { key: 'water', label: 'Água', icon: 'water-outline' },
  { key: 'habitat', label: 'Habitat', icon: 'leaf-outline' },
  { key: 'biodiversity', label: 'Diversidade', icon: 'paw-outline' },
  { key: 'foodWeb', label: 'Teia', icon: 'git-network-outline' },
];

function getLocalLevel(completedSteps, biomeId) {
  return completedSteps.reduce((highest, id) => {
    if (!id.startsWith(`${biomeId}-nivel-`)) return highest;
    return Math.max(highest, Number(id.split('-').pop()) || 0);
  }, 0);
}

function Indicator({ item, value, color }) {
  return (
    <View style={styles.indicator}>
      <View style={styles.indicatorTop}>
        <Ionicons name={item.icon} size={15} color={color} />
        <Text style={styles.indicatorValue}>{value}%</Text>
      </View>
      <Text style={styles.indicatorLabel}>{item.label}</Text>
      <View style={styles.indicatorTrack}>
        <View style={[styles.indicatorFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function ChallengeCard({ challenge, status, onResolve, biome }) {
  const tone = status.kind === 'resolved'
    ? palette.success
    : status.kind === 'ready' ? biome.theme.primary : palette.textMuted;
  return (
    <View style={[styles.caseCard, status.kind === 'resolved' && styles.caseCardResolved]}>
      <View style={[styles.caseIcon, { backgroundColor: alpha(tone, 0.12) }]}>
        <Ionicons name={challenge.icon || 'leaf-outline'} size={22} color={tone} />
      </View>
      <View style={styles.caseCopy}>
        <View style={styles.caseTitleRow}>
          <Text style={styles.caseTitle}>{challenge.title}</Text>
          <Text style={[styles.caseStatus, { color: tone }]}>{status.label}</Text>
        </View>
        <Text style={styles.caseProblem}>{challenge.problem}</Text>
        <View style={styles.evidenceNote}>
          <Ionicons name={'search-outline'} size={14} color={palette.river} />
          <Text style={styles.evidenceText}>{challenge.sign}</Text>
        </View>
        {status.kind === 'ready' ? (
          <Pressable style={[styles.resolveButton, { backgroundColor: biome.theme.dark }]} onPress={onResolve}>
            <Ionicons name={'hand-left-outline'} size={16} color={palette.inverseText} />
            <Text style={styles.resolveButtonText}>Aplicar cuidado</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default function Expedition() {
  const navigation = useNavigation();
  const game = useGame();
  const biome = game.activeBiome;
  const progress = game.getBiomeProgress(biome.id);
  const [lastGain, setLastGain] = useState(null);
  const [notice, setNotice] = useState('Procure sinais no ambiente');
  const scale = useRef(new Animated.Value(1)).current;
  const localLevel = useMemo(
    () => getLocalLevel(game.completedSteps, biome.id),
    [game.completedSteps, biome.id]
  );
  const challenges = biome.careChallenges || [];
  const resolved = progress.resolvedChallenges || [];
  const observed = progress.observedNodes || [];
  const unlockedSignals = biome.treeNodes.filter((node) => progress.unlockedNodes.includes(node.id));
  const pendingSignals = unlockedSignals.filter((node) => !observed.includes(node.id));

  const scan = () => {
    const earned = game.tapEcosystem(biome.id);
    if (!earned) return;
    setLastGain(`+${earned} dados`);
    setNotice(pendingSignals.length ? 'Uma nova pista apareceu no habitat' : 'Varredura registrada no caderno');
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.98, duration: 90, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setLastGain(null), 650);
  };

  const observe = (node) => {
    const success = game.observeEvolutionNode?.(biome.id, node.id);
    if (success) setNotice(`${node.name} foi registrado no Caderno de Campo`);
  };

  const challengeStatus = (challenge) => {
    if (resolved.includes(challenge.id)) return { kind: 'resolved', label: 'ESTÁVEL' };
    if (localLevel < challenge.requiredLocalLevel) {
      return { kind: 'locked', label: `ESTUDO ${challenge.requiredLocalLevel}` };
    }
    if (challenge.requiredNodeId && !progress.unlockedNodes.includes(challenge.requiredNodeId)) {
      return { kind: 'locked', label: 'TEIA INCOMPLETA' };
    }
    const remaining = Math.max(0, (challenge.requiredScans || 0) - (progress.fieldScans || 0));
    if (remaining > 0) return { kind: 'locked', label: `${remaining} PISTAS` };
    return { kind: 'ready', label: 'AÇÃO PRONTA' };
  };

  const stabilize = (challenge) => {
    if (game.resolveCareChallenge?.(biome.id, challenge.id)) {
      setNotice(`${challenge.title}: recuperação iniciada e monitorada`);
      Alert.alert('Habitat mais estável', challenge.learning || challenge.action);
    }
  };

  const healthScore = (key, index) => {
    const base = 24 + Math.round((progress.unlockedNodes.length / Math.max(1, biome.treeNodes.length)) * 34);
    const matching = challenges.filter((item) => item.metric === key && resolved.includes(item.id)).length;
    const generalCare = resolved.length * 7;
    return Math.min(96, base + generalCare + matching * 11 + index * 2);
  };

  return (
    <AppBackground colors={[biome.theme.background, palette.background]}>
      <StatusHeader variant={'expedition'} showBiomes onBiomesPress={() => navigation.navigate('Biomas')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headingRow}>
          <View style={styles.headingCopy}>
            <Text style={styles.kicker}>EXPEDIÇÃO ATIVA · SETOR {biome.order}</Text>
            <Text style={styles.title}>{biome.name}</Text>
            <Text style={styles.subtitle}>Observe o ambiente, reúna evidências e cuide do que perdeu o equilíbrio.</Text>
          </View>
          <View style={styles.weatherTag}>
            <Ionicons name={'partly-sunny-outline'} size={19} color={palette.sun} />
            <Text style={styles.weatherText}>08:40 · úmido</Text>
          </View>
        </View>

        <Animated.View style={[styles.diorama, { borderColor: biome.theme.dark, transform: [{ scale }] }]}>
          <Pressable accessibilityRole={'button'} accessibilityLabel={'Varrer o habitat e coletar dados de campo'} onPress={scan} style={styles.scenePressable}>
            <View style={[styles.sky, { backgroundColor: alpha(biome.theme.secondary, 0.26) }]}>
              <View style={styles.sun} />
              <View style={[styles.contour, styles.contourOne, { borderColor: alpha(biome.theme.dark, 0.16) }]} />
              <View style={[styles.contour, styles.contourTwo, { borderColor: alpha(biome.theme.dark, 0.13) }]} />
            </View>
            <View style={[styles.canopyBack, { backgroundColor: alpha(biome.theme.primary, 0.44) }]} />
            <View style={[styles.canopyFront, { backgroundColor: biome.theme.dark }]} />
            <View style={[styles.ground, { backgroundColor: palette.soil }]}>
              <View style={[styles.stream, { backgroundColor: alpha(palette.river, 0.82) }]} />
            </View>

            {unlockedSignals.slice(0, 4).map((node, index) => {
              const isObserved = observed.includes(node.id);
              return (
                <View
                  key={node.id}
                  style={[
                    styles.signalPin,
                    { left: `${18 + index * 21}%`, top: `${27 + (index % 2) * 22}%` },
                    isObserved && styles.signalPinObserved,
                  ]}
                >
                  <Ionicons name={isObserved ? 'checkmark' : 'scan'} size={15} color={isObserved ? palette.inverseText : biome.theme.dark} />
                </View>
              );
            })}

            <View style={styles.scanTarget}>
              <View style={[styles.scanRing, { borderColor: biome.theme.primary }]}>
                <Ionicons name={'scan-outline'} size={31} color={biome.theme.dark} />
              </View>
              <Text style={styles.scanTitle}>Varrer o habitat</Text>
              <Text style={styles.scanMeta}>+{progress.tapPower} dados por observação</Text>
            </View>
            {lastGain ? <Text style={[styles.gain, { color: biome.theme.dark }]}>{lastGain}</Text> : null}
          </Pressable>
          <View style={styles.sceneCaption}>
            <Ionicons name={'compass-outline'} size={16} color={palette.mossDeep} />
            <Text style={styles.sceneCaptionText}>{notice}</Text>
            <Text style={styles.sceneCounter}>{progress.fieldScans || 0} pistas</Text>
          </View>
        </Animated.View>

        <View style={styles.resourceStrip}>
          <View style={styles.resourceBlock}>
            <Text style={styles.resourceValue}>{Math.floor(progress.ecoPoints)}</Text>
            <Text style={styles.resourceLabel}>dados de campo</Text>
          </View>
          <View style={styles.rule} />
          <View style={styles.resourceBlock}>
            <Text style={styles.resourceValue}>+{progress.pps}/s</Text>
            <Text style={styles.resourceLabel}>rede ativa</Text>
          </View>
          <View style={styles.rule} />
          <View style={styles.resourceBlock}>
            <Text style={styles.resourceValue}>{resolved.length}/{challenges.length}</Text>
            <Text style={styles.resourceLabel}>cuidados</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionKicker}>PAINEL DO HABITAT</Text>
            <Text style={styles.sectionTitle}>Sinais de equilíbrio</Text>
          </View>
          <Pressable style={styles.textAction} onPress={() => navigation.navigate('Evolution')}>
            <Text style={[styles.textActionLabel, { color: biome.theme.dark }]}>Abrir Teia</Text>
            <Ionicons name={'arrow-forward'} size={15} color={biome.theme.dark} />
          </Pressable>
        </View>
        <View style={styles.indicatorGrid}>
          {INDICATORS.map((item, index) => (
            <Indicator key={item.key} item={item} value={healthScore(item.key, index)} color={biome.theme.primary} />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionKicker}>REGISTROS DISPONÍVEIS</Text>
            <Text style={styles.sectionTitle}>Pistas liberadas pela Teia</Text>
          </View>
          <Text style={styles.countNote}>{observed.length}/{unlockedSignals.length}</Text>
        </View>
        {unlockedSignals.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.signalList}>
            {unlockedSignals.map((node) => {
              const isObserved = observed.includes(node.id);
              return (
                <View key={node.id} style={[styles.signalCard, isObserved && styles.signalCardObserved]}>
                  <Ionicons name={node.category === 'consumer' ? 'paw-outline' : node.category === 'producer' ? 'leaf-outline' : 'sparkles-outline'} size={22} color={isObserved ? palette.moss : palette.bark} />
                  <Text style={styles.signalName} numberOfLines={2}>{node.name}</Text>
                  <Text style={styles.signalHint}>{isObserved ? 'No caderno' : 'Sinal encontrado'}</Text>
                  {!isObserved ? (
                    <Pressable style={[styles.observeButton, { borderColor: biome.theme.primary }]} onPress={() => observe(node)}>
                      <Text style={[styles.observeText, { color: biome.theme.dark }]}>Registrar</Text>
                    </Pressable>
                  ) : null}
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <Pressable style={styles.emptyNote} onPress={() => navigation.navigate('Evolution')}>
            <Ionicons name={'git-network-outline'} size={21} color={palette.bark} />
            <Text style={styles.emptyNoteText}>Restaure a primeira conexão na Teia para revelar sinais no mapa.</Text>
          </Pressable>
        )}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionKicker}>CASOS DE RESTAURAÇÃO</Text>
            <Text style={styles.sectionTitle}>Cuidar também é investigar</Text>
          </View>
          <Pressable style={styles.textAction} onPress={() => navigation.navigate('Missoes')}>
            <Text style={[styles.textActionLabel, { color: biome.theme.dark }]}>Missões</Text>
          </Pressable>
        </View>
        <View style={styles.caseList}>
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              status={challengeStatus(challenge)}
              onResolve={() => stabilize(challenge)}
              biome={biome}
            />
          ))}
        </View>

        <View style={styles.unityNote}>
          <Ionicons name={'layers-outline'} size={19} color={palette.river} />
          <Text style={styles.unityNoteText}>Este diorama já usa as regras do jogo. O mapa feito no Unity poderá substituir apenas a cena, mantendo estudos, Teia, recompensas e Caderno sincronizados.</Text>
        </View>
      </ScrollView>
      <BottomNavBar activeTab={'Expedição'} />
    </AppBackground>
  );
}
