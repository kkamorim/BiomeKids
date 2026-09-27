import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppBackground from '../../components/AppBackground';
import StatusHeader from '../../components/StatusHeader';
import BottomNavBar from '../../components/BottomNavBar';
import { useGame } from '../../contexts/GameContext';
import styles from './styles';

function rewardText(reward) {
  return [reward.coins && '🪙 ' + reward.coins, reward.xp && '⭐ ' + reward.xp, reward.diamonds && '💎 ' + reward.diamonds, reward.fuel && '⚡ ' + reward.fuel, reward.boost && '🚀 boost'].filter(Boolean).join('  ');
}

export default function Missoes() {
  const game = useGame();
  const [period, setPeriod] = useState('daily');
  const missions = game.missions.filter((mission) => mission.period === period);
  return (
    <AppBackground colors={['#EEF8E9', '#FFF9EB']}>
      <StatusHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>CENTRAL DE MISSÕES</Text>
        <Text style={styles.title}>Pequenas metas, grandes descobertas</Text>
        <Text style={styles.subtitle}>Ganhe moedas, XP, diamantes, combustível e multiplicadores.</Text>
        <View style={styles.tabs}>
          <Pressable onPress={() => setPeriod('daily')} style={[styles.tab, period === 'daily' && styles.tabActive]}><Text style={[styles.tabText, period === 'daily' && styles.tabTextActive]}>☀️ Diárias</Text></Pressable>
          <Pressable onPress={() => setPeriod('weekly')} style={[styles.tab, period === 'weekly' && styles.tabActive]}><Text style={[styles.tabText, period === 'weekly' && styles.tabTextActive]}>📅 Semanais</Text></Pressable>
        </View>
        {missions.map((mission) => {
          const percent = Math.min(100, Math.round((mission.progress / mission.target) * 100));
          return (
            <View key={mission.id} style={[styles.card, mission.completed && styles.cardDone]}>
              <View style={styles.cardTop}>
                <View style={styles.iconBox}><Ionicons name={mission.period === 'daily' ? 'sunny' : 'calendar'} size={23} color={'#3F8D43'} /></View>
                <View style={styles.cardCopy}><Text style={styles.cardTitle}>{mission.title}</Text><Text style={styles.cardDescription}>{mission.description}</Text></View>
                <Text style={styles.progressNumber}>{Math.min(mission.progress, mission.target)}/{mission.target}</Text>
              </View>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: String(percent) + '%' }]} /></View>
              <View style={styles.cardFooter}>
                <Text style={styles.reward}>{rewardText(mission.reward)}</Text>
                {mission.claimed ? (
                  <View style={styles.claimed}><Ionicons name={'checkmark-circle'} size={17} color={'#3D9D54'} /><Text style={styles.claimedText}>Resgatada</Text></View>
                ) : (
                  <Pressable disabled={!mission.completed} onPress={() => game.claimMission(mission.id)} style={[styles.claimButton, !mission.completed && styles.claimDisabled]}><Text style={styles.claimText}>{mission.completed ? 'Resgatar' : 'Em andamento'}</Text></Pressable>
                )}
              </View>
            </View>
          );
        })}
        <View style={styles.tip}><Text style={styles.tipEmoji}>💡</Text><Text style={styles.tipText}>Missões diárias reiniciam a cada dia; semanais, toda segunda-feira.</Text></View>
      </ScrollView>
      <BottomNavBar activeTab={'Missões'} />
    </AppBackground>
  );
}
