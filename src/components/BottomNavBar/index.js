import React from 'react';
import { View, Text, Pressable, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useGame } from '../../contexts/GameContext';
import styles from './styles';

export default function BottomNavBar({ activeTab = 'Mapa' }) {
  const navigation = useNavigation();
  const { unclaimedMissions = 0 } = useGame();

  const isMapaActive = activeTab === 'Mapa' || activeTab === 'BiomeMap';

  const handleNavigate = (tabName, routeName) => {
    // Se o usuário está dentro de um mapa de bioma e clica no botão Mapa, volta para a seleção de biomas
    if (activeTab === 'BiomeMap' && tabName === 'Mapa') {
      navigation.navigate('Biomas');
      return;
    }

    if (activeTab === tabName) return;
    navigation.navigate(routeName);
  };

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      {/* Placa de Madeira com Folhas nos Cantos */}
      <ImageBackground
        source={require('../../../assets/placa-navegacao.png')}
        style={styles.woodBarBackground}
        resizeMode="stretch"
      >
        <View style={styles.navRow}>
          {/* 1. Estudos */}
          <Pressable
            style={styles.navItem}
            onPress={() => handleNavigate('Estudos', 'Estudos')}
          >
            <View style={[styles.iconCircle, activeTab === 'Estudos' && styles.iconCircleActive]}>
              <Ionicons
                name={activeTab === 'Estudos' ? 'book' : 'book-outline'}
                size={22}
                color={activeTab === 'Estudos' ? '#FFE082' : '#FFE8B8'}
              />
            </View>
            <Text style={[styles.navText, activeTab === 'Estudos' && styles.navTextActive]}>
              Estudos
            </Text>
          </Pressable>

          {/* 2. Missões */}
          <Pressable
            style={styles.navItem}
            onPress={() => handleNavigate('Missões', 'Missoes')}
          >
            <View style={[styles.iconCircle, activeTab === 'Missões' && styles.iconCircleActive]}>
              <Ionicons
                name={activeTab === 'Missões' ? 'ribbon' : 'ribbon-outline'}
                size={23}
                color={activeTab === 'Missões' ? '#FFE082' : '#FFE8B8'}
              />
              {/* Badge de missões */}
              {unclaimedMissions > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unclaimedMissions}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.navText, activeTab === 'Missões' && styles.navTextActive]}>
              Missões
            </Text>
          </Pressable>

          {/* 3. MAPA (Botão Central Elevado em Relevo com Globo) */}
          <View style={styles.centerItemWrapper}>
            <Pressable
              style={styles.centerButton}
              onPress={() => handleNavigate('Mapa', 'Biomas')}
            >
              <View style={[styles.centerGlobeRing, isMapaActive && styles.centerGlobeRingActive]}>
                <Ionicons name="earth" size={32} color="#FFF" />
              </View>
              <Text style={[styles.centerText, isMapaActive && styles.centerTextActive]}>
                Mapa
              </Text>
            </Pressable>
          </View>

          {/* 4. Coleção */}
          <Pressable
            style={styles.navItem}
            onPress={() => handleNavigate('Coleção', 'Colecao')}
          >
            <View style={[styles.iconCircle, activeTab === 'Coleção' && styles.iconCircleActive]}>
              <FontAwesome5
                name="paw"
                size={20}
                color={activeTab === 'Coleção' ? '#FFE082' : '#FFE8B8'}
              />
            </View>
            <Text style={[styles.navText, activeTab === 'Coleção' && styles.navTextActive]}>
              Coleção
            </Text>
          </Pressable>

          {/* 5. Loja */}
          <Pressable
            style={styles.navItem}
            onPress={() => handleNavigate('Loja', 'Loja')}
          >
            <View style={[styles.iconCircle, activeTab === 'Loja' && styles.iconCircleActive]}>
              <Ionicons
                name={activeTab === 'Loja' ? 'basket' : 'basket-outline'}
                size={22}
                color={activeTab === 'Loja' ? '#FFE082' : '#FFE8B8'}
              />
            </View>
            <Text style={[styles.navText, activeTab === 'Loja' && styles.navTextActive]}>
              Loja
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}
