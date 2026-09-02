import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  Image,
  Pressable,
} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { useState, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const navigation = useNavigation();

  const AnimatedButton = ({ title, onPress }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
        <Animated.View style={[styles.btn, { transform: [{ scale }] }]}>
          <Text style={styles.btnText}>{title}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (

    <View style={styles.container}>

      <View style={styles.placaContainer}>
        <Image
          style={styles.placa}
          source={require('../../../assets/placa-biomekids.png')}
          resizeMode="contain"
        />
      </View>


      <View style={styles.containerText}>
        <Text style={styles.tittle}>Preparado para a Expedição Escoteiro?</Text>
        <Text style={styles.subtittle}>Estude os animais, fotografe a natureza e desbloqueie biomas incríveis para o seu mapa.</Text>
      </View>

      <View style={styles.btnContainer}>
        <Pressable
          style={styles.btnEntrar}
          onPress={() => navigation.navigate('Entrar')}
        >
          <Text style={styles.btnEntrarText}><FontAwesome name="paw" size={20} color="#FFF" /> Entrar</Text>
        </Pressable>

        <Pressable
          style={styles.btnCadastro}
          onPress={() => navigation.navigate('Conta')}
        >
          <Text style={styles.btnCadastroText}><Ionicons name="globe-outline" size={20} color="#FFF" /> Criar Conta</Text>
        </Pressable>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
