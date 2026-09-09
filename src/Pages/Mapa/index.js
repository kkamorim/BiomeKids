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
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { NavigationBar } from 'expo-navigation-bar';
import styles from './styles';

export default function Mapa() {
  const navigation = useNavigation();

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

  // 1. Array de Dados dos Biomas na ordem de progressão:
  // Pantanal (inicial) -> Amazônia -> Cerrado -> Caatinga -> Mata Atlântica -> Pampa
  const biomas = [
    {
      id: '1',
      nome: 'PANTANAL',
      liberado: true,
      imagem: require('../../../assets/Pantanal.png'),
      requisito: 'Liberado',
      rota: 'Territorio1',
    },
    {
      id: '2',
      nome: 'AMAZÔNIA',
      liberado: false,
      imagem: require('../../../assets/Amazonia.png'),
      requisito: 'Complete missões no Pantanal',
      rota: 'Territorio2',
    },
    {
      id: '3',
      nome: 'CERRADO',
      liberado: false,
      imagem: require('../../../assets/Cerrado.png'),
      requisito: 'Complete missões na Amazônia',
      rota: 'Territorio3',
    },
    {
      id: '4',
      nome: 'CAATINGA',
      liberado: false,
      // Placeholder enquanto você adiciona o Caatinga.png aos assets
      imagem: require('../../../assets/Caatinga.png'),
      requisito: 'Complete missões no Cerrado',
      rota: 'Territorio4',
    },
    {
      id: '5',
      nome: 'MATA ATLÂNTICA',
      liberado: false,
      // Placeholder enquanto você adiciona o MataAtlantica.png aos assets
      imagem: require('../../../assets/MataAtlantica.png'),
      requisito: 'Complete missões na Caatinga',
      rota: 'Territorio5',
    },
    {
      id: '6',
      nome: 'PAMPA',
      liberado: false,
      // Placeholder enquanto você adiciona o Pampa.png aos assets
      imagem: require('../../../assets/Pampa.png'),
      requisito: 'Complete missões na Mata Atlântica',
      rota: 'Territorio6',
    },
  ];

  // 2. Lógica ao tocar em um Bioma
  const handlePressBioma = (bioma) => {
    if (bioma.liberado) {
      if (bioma.rota) {
        navigation.navigate(bioma.rota);
      } else {
        Alert.alert('Eba!', `Bem-vindo à expedição no ${bioma.nome}!`);
      }
    } else {
      Alert.alert(
        'Área Bloqueada 🔒',
        `${bioma.requisito} para desbloquear o bioma ${bioma.nome}.`
      );
    }
  };

  // 3. Renderização de cada Card de Bioma
  const renderBiomaCard = ({ item }) => {
    return (
      <Pressable
        style={styles.cardContainer}
        onPress={() => handlePressBioma(item)}
      >
        {/* Ilha Flutuante (com sobreposição e cadeado cinza se bloqueado) */}
        <View style={styles.ilhaWrapper}>
          <Image
            source={item.imagem}
            style={[
              styles.ilhaImagem,
              !item.liberado && styles.ilhaBloqueadaImagem,
            ]}
            resizeMode="contain"
          />
        </View>

        {/* Placa de Identificação com Nome Centralizado */}
        <ImageBackground 
          source={require('../../../assets/placa-pedra.png')}
          style={item.liberado ? styles.placaLiberada : styles.placaBloqueada}
          imageStyle={!item.liberado ? { opacity: 0.85 } : undefined}
          resizeMode="stretch"
        >
          {!item.liberado && (
            <View style={styles.overlayBloqueado}>
              <View style={styles.cadeadoCircle}>
                <Ionicons name="lock-closed" size={22} color="#e2e8f0" />
              </View>
            </View>
          )}
          <Text 
            style={item.liberado ? styles.tituloLiberado : styles.tituloBloqueado}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {item.nome}
          </Text>
        </ImageBackground>
      </Pressable>
    );
  };

  // 4. Cabeçalho com Botão Voltar, Placa de Madeira Central e Diário
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        {/* Botão Voltar */}
        <Pressable
          style={styles.circleWoodBtn}
          onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
        >
          <Ionicons name="exit-outline" size={22} color="#ffe8b8" />
        </Pressable>

        {/* Placa Central de Madeira "MAPA" */}
        <Image
          style={styles.placaTopo}
          source={require('../../../assets/placa-mapa.png')}
          resizeMode="contain"
        />

        {/* Botão Diário */}
        <Pressable
          style={styles.diaryBtnWrapper}
          onPress={() => Alert.alert('Diário de Expedição', 'Em breve: seu diário e conquistas dos biomas!')}
        >
          <View style={styles.circleWoodBtnDiary}>
            <Ionicons name="book" size={20} color="#ffe8b8" />
          </View>
          <Text style={styles.diaryBtnLabel}>Diário</Text>
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
      {/* Mantém a barra de navegação do Android sempre oculta */}
      <NavigationBar hidden={true} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* FlatList em Grid de 2 Colunas */}
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

      {/* Barra de Navegação Inferior Estilo Tábua de Madeira */}
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBarPlank}>
          {/* Início */}
          <Pressable
            style={styles.tabItem}
            onPress={() => navigation.navigate('Home')}
          >
            <View style={styles.tabIconCircle}>
              <Ionicons name="home" size={19} color="#ffde9e" />
            </View>
            <Text style={styles.tabLabel}>Início</Text>
          </Pressable>

          {/* Missões com Badge */}
          <Pressable
            style={styles.tabItem}
            onPress={() => Alert.alert('Missões', 'Suas missões diárias de escoteiro!')}
          >
            <View style={styles.tabIconCircle}>
              <FontAwesome5 name="scroll" size={16} color="#ffde9e" />
              <View style={styles.badgeNotificacao}>
                <Text style={styles.badgeNotificacaoTexto}>3</Text>
              </View>
            </View>
            <Text style={styles.tabLabel}>Missões</Text>
          </Pressable>

          {/* Mapa (Aba Atual com Globo em Destaque) */}
          <Pressable style={styles.tabItemActive}>
            <View style={styles.activeGlobeCircle}>
              <Ionicons name="earth" size={30} color="#ffffff" />
            </View>
            <Text style={styles.tabLabelActive}>Mapa</Text>
          </Pressable>

          {/* Coleção */}
          <Pressable
            style={styles.tabItem}
            onPress={() => Alert.alert('Coleção', 'Álbum de figurinhas dos animais encontrados!')}
          >
            <View style={styles.tabIconCircle}>
              <FontAwesome5 name="paw" size={17} color="#ffde9e" />
            </View>
            <Text style={styles.tabLabel}>Coleção</Text>
          </Pressable>

          {/* Perfil */}
          <Pressable
            style={styles.tabItem}
            onPress={() => Alert.alert('Perfil', 'Seu perfil de escoteiro!')}
          >
            <View style={styles.tabIconCircle}>
              <Ionicons name="person" size={19} color="#ffde9e" />
            </View>
            <Text style={styles.tabLabel}>Perfil</Text>
          </Pressable>
        </View>
      </View>

      <StatusBar style="dark" translucent={true} />
    </ImageBackground>
  );
}