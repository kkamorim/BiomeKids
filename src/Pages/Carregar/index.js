import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  ImageBackground,
  Animated,
  Text,
  Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from './styles';

import { useAuth } from '../../contexts/AuthContext';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function Carregar() {
  const navigation = useNavigation();
  const { isAuthenticated, isLoading } = useAuth();
  const progress = useRef(new Animated.Value(0)).current;
  const isNavigating = useRef(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    // Anima a barra de progresso do início até 100%
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 2200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    });

    animation.start(({ finished }) => setAnimationFinished(Boolean(finished)));

    return () => {
      animation.stop();
    };
  }, [progress]);

  useEffect(() => {
    if (!animationFinished || isLoading || isNavigating.current) return undefined;
    isNavigating.current = true;
    const timer = setTimeout(() => {
      navigation.replace(isAuthenticated ? 'Journey' : 'Home');
    }, 250);
    return () => clearTimeout(timer);
  }, [animationFinished, isAuthenticated, isLoading, navigation]);



  // Interpolação para a largura da barra
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['12%', '100%'],
  });

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../../assets/splash-kids.png')}
      resizeMode="cover"
    >
      <View style={styles.placaContainer}>
        <Image
          style={styles.placa}
          source={require('../../../assets/placa-biomekids.png')}
          resizeMode="contain"
        />
      </View>

      <View style={styles.loadingWrapper}>
        <Text style={styles.loadingText}>Carregando...</Text>

        {/* Barra de carregamento estilizada */}
        <View style={styles.progressBarTrack}>
          <AnimatedLinearGradient
            colors={['#b8f13b', '#7ecb19', '#4ca810']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: progressWidth }]}
          >
            {/* Brilho superior estilizado */}
            <View style={styles.glossHighlight} />

            {/* Patinha branca no final da barra */}
            <View style={styles.pawContainer}>
              <FontAwesome5 name="paw" size={17} color="#ffffff" style={styles.pawIcon} />
            </View>
          </AnimatedLinearGradient>
        </View>
      </View>

      <StatusBar style="dark" />
    </ImageBackground>
  );
}

