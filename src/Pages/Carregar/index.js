import React, { useEffect, useRef } from 'react';
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

export default function Carregar() {
  const navigation = useNavigation();
  const { checkAuth } = useAuth();
  const progress = useRef(new Animated.Value(0)).current;
  const isNavigating = useRef(false);

  useEffect(() => {
    // Inicia a checagem de autenticação silenciosa em paralelo
    const authPromise = checkAuth();

    // Anima a barra de progresso do início até 100%
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 3200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    });

    animation.start(async ({ finished }) => {
      // SÓ redireciona se a animação realmente tiver completado 100%
      if (finished && !isNavigating.current) {
        isNavigating.current = true;
        const isLogged = await authPromise;

        // Pausa de 350ms com a barra cheia para sensação de conclusão
        setTimeout(() => {
          if (isLogged) {
            navigation.replace('Territorio');
          } else {
            navigation.replace('Home');
          }
        }, 350);
      }
    });

    return () => {
      animation.stop();
    };
  }, []); // Executa exatamente uma vez na montagem da tela



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
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]}>
            <LinearGradient
              colors={['#b8f13b', '#8ad81f', '#5cb311']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradientFill}
            />
            {/* Brilho superior estilizado */}
            <View style={styles.glossHighlight} />

            {/* Patinha branca no final da barra */}
            <View style={styles.pawContainer}>
              <FontAwesome5 name="paw" size={17} color="#ffffff" style={styles.pawIcon} />
            </View>
          </Animated.View>
        </View>
      </View>

      <StatusBar style="dark" />
    </ImageBackground>
  );
}

