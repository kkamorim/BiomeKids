import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AppBackground from '../../components/AppBackground';
import styles from './styles';

const FEATURES = [
  { icon: 'earth', value: '9', label: 'biomas do mundo' },
  { icon: 'school', value: '225', label: 'níveis de estudo' },
  { icon: 'git-network', value: '9', label: 'árvores de evolução' },
];

const PATH_PREVIEW = [
  { icon: 'leaf', label: 'Descubra', color: '#58CC02' },
  { icon: 'book', label: 'Aprenda', color: '#1CB0F6' },
  { icon: 'git-network', label: 'Evolua', color: '#F5A623' },
];

export default function Home() {
  const navigation = useNavigation();

  return (
    <AppBackground
      gradientColors={['#F1FBEA', '#E6F7DF', '#FFF8E8']}
      decorationColors={['#58CC02', '#1CB0F6', '#F5A623']}
    >
      <StatusBar style={'dark'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Ionicons name={'leaf'} size={25} color={'#FFFFFF'} />
          </View>
          <View>
            <Text style={styles.brandName}>BiomeKids</Text>
            <Text style={styles.brandTag}>EXPLORE · APRENDA · PROTEJA</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.eyebrowPill}>
            <Ionicons name={'sparkles'} size={15} color={'#3F9700'} />
            <Text style={styles.eyebrowText}>UMA AVENTURA PELO PLANETA</Text>
          </View>

          <Text style={styles.title}>Aprender ciências é</Text>
          <Text style={styles.titleAccent}>cultivar um mundo inteiro.</Text>

          <Text style={styles.subtitle}>
            Avance por uma trilha de estudos, complete a árvore de evolução de cada
            bioma e descubra como todos os seres vivos estão conectados.
          </Text>

          <View style={styles.pathCard}>
            <View style={styles.pathLine} />
            {PATH_PREVIEW.map((item) => (
              <View key={item.label} style={styles.pathStep}>
                <View style={[styles.pathNode, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={24} color={'#FFFFFF'} />
                </View>
                <Text style={styles.pathLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.featureRow}>
            {FEATURES.map((feature) => (
              <View key={feature.label} style={styles.featureItem}>
                <Ionicons name={feature.icon} size={18} color={'#3F9700'} />
                <Text style={styles.featureValue}>{feature.value}</Text>
                <Text style={styles.featureLabel}>{feature.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole={'button'}
            accessibilityLabel={'Explorar a trilha de estudos'}
            onPress={() => navigation.navigate('Journey')}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <View style={styles.primaryIcon}>
              <Ionicons name={'compass'} size={22} color={'#3F9700'} />
            </View>
            <View style={styles.buttonCopy}>
              <Text style={styles.primaryButtonText}>Explorar agora</Text>
              <Text style={styles.primaryButtonHint}>Comece pela Floresta Tropical</Text>
            </View>
            <Ionicons name={'arrow-forward'} size={22} color={'#FFFFFF'} />
          </Pressable>

          <View style={styles.accountRow}>
            <Pressable
              accessibilityRole={'button'}
              onPress={() => navigation.navigate('Entrar')}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Ionicons name={'log-in-outline'} size={19} color={'#245C16'} />
              <Text style={styles.secondaryButtonText}>Entrar</Text>
            </Pressable>

            <Pressable
              accessibilityRole={'button'}
              onPress={() => navigation.navigate('Cadastro')}
              style={({ pressed }) => [
                styles.outlineButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Ionicons name={'person-add-outline'} size={19} color={'#087FB5'} />
              <Text style={styles.outlineButtonText}>Criar conta</Text>
            </Pressable>
          </View>

          <Text style={styles.footerText}>
            Seu progresso fica salvo neste dispositivo. Crie uma conta para continuar
            sua expedição em segurança.
          </Text>
        </View>
      </ScrollView>
    </AppBackground>
  );
}
