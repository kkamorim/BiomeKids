import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import IsometricBiomeDiorama from '../../components/IsometricMap/IsometricBiomeDiorama';
import { BIOMES_CONFIG, getBiomeConfig } from '../../components/IsometricMap/BiomeConfig';
import CurrencyHeader from '../../components/CurrencyHeader';
import BottomNavBar from '../../components/BottomNavBar';
import { useGame } from '../../contexts/GameContext';
import styles from './styles';

export default function BiomeMapScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { coins = 10, addCoins, feedAnimal, waterAnimal } = useGame();

  // Bioma ativo (recebido por parâmetro ou padrão Pantanal)
  const initialBiomeKey = route.params?.biomeId || route.params?.biomaNome || 'pantanal';
  const [selectedBiomeKey, setSelectedBiomeKey] = useState(initialBiomeKey);
  const currentBiome = getBiomeConfig(selectedBiomeKey);

  // Lista dinâmica de entidades adicionadas no diorama pelo jogador
  const [customEntities, setCustomEntities] = useState([]);

  // Modo Edição / Construção ativo
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);

  // Modal de Cuidados do Animal
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [careSuccessMessage, setCareSuccessMessage] = useState('');

  // Modal de Informação de Estrutura
  const [selectedStructure, setSelectedStructure] = useState(null);

  // Modal Seletor de Biomas
  const [biomePickerVisible, setBiomePickerVisible] = useState(false);

  // 1. Clique em animal (abre modal de cuidados)
  const handleAnimalPress = (animal) => {
    setSelectedAnimal(animal);
    setCareSuccessMessage('');
  };

  // 2. Clique em estrutura ecológica (abre modal informativo)
  const handleStructurePress = (structure) => {
    setSelectedStructure(structure);
  };

  // 3. Clique em lote de construção
  const handlePlotPress = (plot) => {
    setSelectedPlot(plot);
  };

  // 4. Ações de cuidados com o animal
  const handleCareAction = (actionType) => {
    if (!selectedAnimal) return;

    if (actionType === 'water') {
      waterAnimal(selectedAnimal.id);
      addCoins(5);
      setCareSuccessMessage('💧 +5 Moedas! Animal hidratado e refrescado!');
    } else if (actionType === 'feed') {
      feedAnimal(selectedAnimal.id);
      addCoins(10);
      setCareSuccessMessage('🍎 +10 Moedas! Animal alimentado com carinho!');
    } else if (actionType === 'play') {
      addCoins(15);
      setCareSuccessMessage('🎾 +15 Moedas! Brincadeira divertida no bioma!');
    }

    setTimeout(() => {
      setCareSuccessMessage('');
    }, 2500);
  };

  // 5. Adicionar nova muda ou estrutura no lote selecionado
  const handlePlaceItem = (type, name, price) => {
    if (!selectedPlot) return;

    if (coins < price) {
      Alert.alert(
        'Moedas Insuficientes 🪙',
        `Você precisa de ${price} moedas para plantar ou construir este item.`
      );
      return;
    }

    addCoins(-price);

    const newEntity = {
      id: `custom_${Date.now()}`,
      type: type,
      name: name,
      x: selectedPlot.x,
      y: selectedPlot.y,
    };

    setCustomEntities((prev) => [...prev, newEntity]);
    setSelectedPlot(null);
    Alert.alert('Sucesso! 🎉', `"${name}" foi adicionado com sucesso ao seu bioma!`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* CAMADA 1: DIORAMA ISOMÉTRICO 2.5D INTERATIVO */}
      <View style={styles.mapLayer}>
        <IsometricBiomeDiorama
          biomeConfig={currentBiome}
          customEntities={customEntities}
          isEditMode={isEditMode}
          onAnimalPress={handleAnimalPress}
          onStructurePress={handleStructurePress}
          onPlotPress={handlePlotPress}
        />
      </View>

      {/* CAMADA 2: HUD NATIVO COM MOEDAS NO CANTO SUPERIOR DIREITO */}
      <SafeAreaView style={styles.hudOverlay} pointerEvents="box-none">
        {/* CABEÇALHO GLOBAL */}
        <View style={styles.header}>
          {/* Botão Voltar */}
          <Pressable
            style={styles.circleBtn}
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Biomas')}
          >
            <Ionicons name="arrow-back" size={24} color="#FFE8B8" />
          </Pressable>

          {/* Badge Central do Bioma com Seletor */}
          <Pressable
            style={styles.biomeBadge}
            onPress={() => setBiomePickerVisible(true)}
          >
            <Text style={styles.biomeBadgeIcon}>🌿</Text>
            <Text style={styles.biomeBadgeText} numberOfLines={1}>
              {currentBiome.nome}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#FFE8B8" />
          </Pressable>

          {/* MOEDAS E DIAMANTES NO CANTO SUPERIOR DIREITO (Conforme solicitado!) */}
          <CurrencyHeader />
        </View>

        {/* DICA DE INTERAÇÃO FLUTUANTE */}
        <View style={styles.hintContainer} pointerEvents="none">
          <Text style={styles.hintText}>
            👆 Toque no animal para cuidar • Toque no terreno para construir • Arraste o mapa
          </Text>
        </View>

        {/* BOTÃO FLUTUANTE DE MODO EDIÇÃO / CONSTRUÇÃO */}
        <Pressable
          style={[styles.editModeToggleBtn, isEditMode && styles.editModeToggleBtnActive]}
          onPress={() => setIsEditMode(!isEditMode)}
        >
          <Ionicons
            name={isEditMode ? 'checkmark-circle' : 'hammer'}
            size={20}
            color="#FFF"
          />
          <Text style={styles.editModeToggleText}>
            {isEditMode ? 'Concluir Edição' : 'Modo Construção'}
          </Text>
        </Pressable>
      </SafeAreaView>

      {/* MODAL 1: CUIDADOS COM O ANIMAL */}
      <Modal
        visible={!!selectedAnimal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedAnimal(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.careCard}>
            <View style={styles.careHeader}>
              <Text style={styles.careAvatar}>{selectedAnimal?.emoji || '🐾'}</Text>
              <View style={styles.careTitleWrapper}>
                <Text style={styles.careAnimalName}>{selectedAnimal?.name}</Text>
                <Text style={styles.careAnimalSubtitle}>{selectedAnimal?.subtitle || 'Espécie Nativa Protegida'}</Text>
              </View>
              <Pressable
                style={styles.careCloseBtn}
                onPress={() => setSelectedAnimal(null)}
              >
                <Ionicons name="close" size={24} color="#7A5229" />
              </Pressable>
            </View>

            {careSuccessMessage ? (
              <View style={styles.successToast}>
                <Text style={styles.successToastText}>{careSuccessMessage}</Text>
              </View>
            ) : null}

            {/* Ações de Cuidados */}
            <View style={styles.careActionsGrid}>
              <Pressable
                style={styles.careBtn}
                onPress={() => handleCareAction('water')}
              >
                <Text style={styles.careBtnIcon}>💧</Text>
                <Text style={styles.careBtnLabel}>Dar Água</Text>
                <Text style={styles.careBtnReward}>+5 🪙</Text>
              </Pressable>

              <Pressable
                style={styles.careBtn}
                onPress={() => handleCareAction('feed')}
              >
                <Text style={styles.careBtnIcon}>🍎</Text>
                <Text style={styles.careBtnLabel}>Alimentar</Text>
                <Text style={styles.careBtnReward}>+10 🪙</Text>
              </Pressable>

              <Pressable
                style={styles.careBtn}
                onPress={() => handleCareAction('play')}
              >
                <Text style={styles.careBtnIcon}>🎾</Text>
                <Text style={styles.careBtnLabel}>Brincar</Text>
                <Text style={styles.careBtnReward}>+15 🪙</Text>
              </Pressable>
            </View>

            {/* Atalho de Curiosidade / Estudo */}
            <Pressable
              style={styles.studyShortcutBtn}
              onPress={() => {
                setSelectedAnimal(null);
                navigation.navigate('Estudos');
              }}
            >
              <Ionicons name="school-outline" size={18} color="#2D6A4F" />
              <Text style={styles.studyShortcutText}>Ver Ficha de Estudo e Quiz</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: CONSTRUÇÃO / PLANTIO NO LOTE */}
      <Modal
        visible={!!selectedPlot}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedPlot(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.buildCard}>
            <View style={styles.buildHeader}>
              <Text style={styles.buildTitle}>🌱 Plantar ou Construir</Text>
              <Pressable onPress={() => setSelectedPlot(null)}>
                <Ionicons name="close-circle" size={24} color="#7A5229" />
              </Pressable>
            </View>
            <Text style={styles.buildSubtitle}>
              Escolha uma melhoria ecológica para instalar neste lote do bioma:
            </Text>

            <View style={styles.buildOptionsGrid}>
              <Pressable
                style={styles.buildOptionBtn}
                onPress={() => handlePlaceItem('tree', 'Muda de Árvore Nativa', 15)}
              >
                <Text style={styles.buildOptionIcon}>🌳</Text>
                <Text style={styles.buildOptionName}>Árvore Nativa</Text>
                <Text style={styles.buildOptionPrice}>🪙 15 Moedas</Text>
              </Pressable>

              <Pressable
                style={styles.buildOptionBtn}
                onPress={() => handlePlaceItem('plant', 'Arbusto Protetor', 10)}
              >
                <Text style={styles.buildOptionIcon}>🌿</Text>
                <Text style={styles.buildOptionName}>Arbusto Floral</Text>
                <Text style={styles.buildOptionPrice}>🪙 10 Moedas</Text>
              </Pressable>

              <Pressable
                style={styles.buildOptionBtn}
                onPress={() => handlePlaceItem('structure', 'Bebedouro da Fauna', 20)}
              >
                <Text style={styles.buildOptionIcon}>💧</Text>
                <Text style={styles.buildOptionName}>Bebedouro</Text>
                <Text style={styles.buildOptionPrice}>🪙 20 Moedas</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: INFORMAÇÃO DA ESTRUTURA ECOLÓGICA */}
      <Modal
        visible={!!selectedStructure}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedStructure(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.structureCard}>
            <Text style={styles.structureCardIcon}>{selectedStructure?.icon}</Text>
            <Text style={styles.structureCardTitle}>{selectedStructure?.name}</Text>
            <Text style={styles.structureCardDesc}>{selectedStructure?.desc}</Text>
            <Pressable
              style={styles.structureCardCloseBtn}
              onPress={() => setSelectedStructure(null)}
            >
              <Text style={styles.structureCardCloseText}>Entendido!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: SELETOR DE BIOMAS */}
      <Modal
        visible={biomePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBiomePickerVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>🌍 Escolha o Bioma</Text>
              <Pressable onPress={() => setBiomePickerVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#666" />
              </Pressable>
            </View>

            <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
              {Object.keys(BIOMES_CONFIG).map((key) => {
                const b = BIOMES_CONFIG[key];
                const isSelected = selectedBiomeKey === key;
                return (
                  <Pressable
                    key={key}
                    style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                    onPress={() => {
                      setSelectedBiomeKey(key);
                      setBiomePickerVisible(false);
                    }}
                  >
                    <View style={[styles.colorPreview, { backgroundColor: b.accentColor }]} />
                    <View style={styles.pickerItemTextWrapper}>
                      <Text style={[styles.pickerItemName, isSelected && styles.pickerItemNameSelected]}>
                        {b.nome}
                      </Text>
                      <Text style={styles.pickerItemSub}>{b.subtitulo}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={22} color="#2D6A4F" />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* BARRA DE NAVEGAÇÃO INFERIOR DE MADEIRA FIXA NO RODAPÉ */}
      <BottomNavBar activeTab="Mapa" />
    </View>
  );
}
