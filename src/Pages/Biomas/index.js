import React, { useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  Image,
  ImageBackground,
  FlatList,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationBar } from 'expo-navigation-bar';
import BottomNavBar from '../../components/BottomNavBar';
import { useGame } from '../../contexts/GameContext';
import styles from './styles';

export default function Biomas() {
  const navigation = useNavigation();
  const { unlockedBiomes = [1], gameState } = useGame();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setHidden(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        NavigationBar.setHidden(true);
      }
    }, [])
  );

  // 1. Catálogo dos 6 Biomas Brasileiros (ordem idêntica à referência)
  const biomas = [
    {
      id: 'pantanal',
      numericId: 1,
      nome: 'PANTANAL',
      liberado: true,
      imagem: require('../../../assets/Pantanal.png'),
      requisito: 'Liberado',
      rota: 'Territorio1',
    },
    {
      id: 'amazonia',
      numericId: 2,
      nome: 'AMAZÔNIA',
      liberado: true,
      imagem: require('../../../assets/Amazonia.png'),
      requisito: 'Complete missões no Pantanal',
      rota: 'Territorio2',
    },
    {
      id: 'cerrado',
      numericId: 3,
      nome: 'CERRADO',
      liberado: false,
      imagem: require('../../../assets/Cerrado.png'),
      requisito: 'Complete missões na Amazônia',
      rota: 'Territorio3',
    },
    {
      id: 'caatinga',
      numericId: 4,
      nome: 'CAATINGA',
      liberado: false,
      imagem: require('../../../assets/Caatinga.png'),
      requisito: 'Complete missões no Cerrado',
      rota: 'Territorio4',
    },
    {
      id: 'mata-atlantica',
      numericId: 5,
      nome: 'MATA ATLÂNTICA',
      liberado: false,
      imagem: require('../../../assets/MataAtlantica.png'),
      requisito: 'Complete missões na Caatinga',
      rota: 'Territorio5',
    },
    {
      id: 'pampa',
      numericId: 6,
      nome: 'PAMPA',
      liberado: false,
      imagem: require('../../../assets/Pampa.png'),
      requisito: 'Complete missões na Mata Atlântica',
      rota: 'Territorio6',
    },
  ];

  // 2. Tocar em um Bioma
  const handlePressBioma = (bioma) => {
    const isUnlocked = bioma.liberado || unlockedBiomes.includes(bioma.numericId);
    if (isUnlocked) {
      navigation.navigate('BiomeMap', {
        biomeId: bioma.id,
        biomaNome: bioma.nome,
        territorioRota: bioma.rota,
      });
    } else {
      Alert.alert(
        'Área Bloqueada 🔒',
        `${bioma.requisito} para desbloquear o bioma ${bioma.nome}.`
      );
    }
  };

  // 3. Card do Bioma com ilha flutuante e placa estilizada
  const renderBiomaCard = ({ item }) => {
    const isUnlocked = item.liberado || unlockedBiomes.includes(item.numericId);

    return (
      <Pressable
        style={styles.cardContainer}
        onPress={() => handlePressBioma(item)}
      >
        {/* Ilha Flutuante Ilustrada */}
        <View style={styles.ilhaWrapper}>
          <Image
            source={item.imagem}
            style={[
              styles.ilhaImagem,
              !isUnlocked && styles.ilhaBloqueadaImagem,
            ]}
            resizeMode="contain"
          />
        </View>

        {/* Placa de Identificação com Nome e Status */}
        {isUnlocked ? (
          // Placa Verde de Madeira (Liberado)
          <View style={styles.placaVerdeWrapper}>
            <View style={styles.containerLiberado}>
              <Text style={styles.tituloVerde} numberOfLines={1}>
                {item.nome}
              </Text>
              <Text style={styles.liberadoText}>Liberado</Text>
            </View>
            <View style={styles.cadeadoCircleOpen}>
              <Ionicons name="lock-open" size={16} color="#388E3C" />
            </View>
          </View>
        ) : (
          // Placa de Pedra Cinza (Bloqueado com Cadeado)
          <View style={styles.placaCinzaWrapper}>
            <View style={styles.placaCinzaTextCol}>
              <Text style={styles.tituloCinza} numberOfLines={1}>
                {item.nome}
              </Text>
              <Text style={styles.requisitoCinza} numberOfLines={1}>
                {item.requisito}
              </Text>
            </View>
            <View style={styles.cadeadoCircle}>
              <Ionicons name="lock-closed" size={16} color="#E0E0E0" />
            </View>
          </View>
        )}
      </Pressable>
    );
  };

  // 4. Cabeçalho: Voltar à esquerda | Placa MAPA central | Ícone de Perfil à direita
  // (SEM moedas nem diamantes, exatamente como solicitado pelo usuário)
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        {/* Botão Voltar */}
        <Pressable
          style={styles.circleWoodBtn}
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color="#FFE8B8" />
        </Pressable>

        {/* Placa Central de Madeira "MAPA" */}
        <Image
          style={styles.placaTopo}
          source={require('../../../assets/placa-mapa.png')}
          resizeMode="contain"
        />

        {/* Botão de Perfil no Canto Superior Direito */}
        <Pressable
          style={styles.circleWoodBtn}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Ionicons name="person" size={22} color="#FFE8B8" />
        </Pressable>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/fundo-ceu.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <NavigationBar hidden={true} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Grid de Biomas (2 Colunas) */}
        <FlatList
          data={biomas}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderBiomaCard}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      {/* Barra de Navegação Inferior de Madeira Fixa */}
      <BottomNavBar activeTab="Mapa" />

      <StatusBar style="dark" translucent={true} />
    </ImageBackground>
  );
}
