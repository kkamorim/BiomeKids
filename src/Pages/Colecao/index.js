import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ImageBackground,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CurrencyHeader from '../../components/CurrencyHeader';
import BottomNavBar from '../../components/BottomNavBar';
import { useGame } from '../../contexts/GameContext';
import { ANIMALS, BIOMES, getEvolutionInfo } from '../../data/gameData';
import styles from './styles';

export default function Colecao() {
  const { animals: savedAnimals = {} } = useGame();
  const [selectedBiomeTab, setSelectedBiomeTab] = useState(1);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const biomeAnimals = ANIMALS[selectedBiomeTab] || [];

  return (
    <ImageBackground
      source={require('../../../assets/fundo-ceu.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Cabeçalho com Moedas e Diamantes */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>🐾 Álbum de Espécies</Text>
            <Text style={styles.headerSubtitle}>Descubra e cuide dos animais da fauna brasileira</Text>
          </View>
          <CurrencyHeader />
        </View>

        {/* Seletor de Biomas */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.biomeScroll}
          contentContainerStyle={styles.biomeScrollContent}
        >
          {BIOMES.map((b) => {
            const isSelected = selectedBiomeTab === b.id;
            return (
              <Pressable
                key={b.id}
                style={[styles.biomePill, isSelected && styles.biomePillActive]}
                onPress={() => setSelectedBiomeTab(b.id)}
              >
                <Text style={[styles.biomePillText, isSelected && styles.biomePillTextActive]}>
                  {b.nome}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Grade de Animais */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
        >
          <View style={styles.cardsGrid}>
            {biomeAnimals.map((animal) => {
              const animalState = savedAnimals[animal.id];
              const isDiscovered = !!animalState;
              const evoInfo = animalState
                ? getEvolutionInfo(animalState.stage)
                : { emoji: '🔒', label: 'Não descoberto' };

              return (
                <Pressable
                  key={animal.id}
                  style={[styles.animalCard, !isDiscovered && styles.animalCardLocked]}
                  onPress={() => setSelectedAnimal(animal)}
                >
                  <View style={styles.cardImageContainer}>
                    <Image
                      source={animal.imagem}
                      style={[styles.animalImg, !isDiscovered && styles.animalImgLocked]}
                      resizeMode="contain"
                    />
                    {!isDiscovered && (
                      <View style={styles.lockOverlay}>
                        <Ionicons name="lock-closed" size={24} color="#FFF" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.animalName} numberOfLines={1}>
                    {animal.nome}
                  </Text>
                  <View style={styles.stageTag}>
                    <Text style={styles.stageTagText}>
                      {evoInfo.emoji} {isDiscovered ? evoInfo.label : 'Bloqueado'}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={{ height: 90 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Modal de Detalhe do Animal */}
      <Modal
        visible={!!selectedAnimal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedAnimal(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedAnimal?.nome}</Text>
              <Pressable onPress={() => setSelectedAnimal(null)}>
                <Ionicons name="close-circle" size={26} color="#7A5229" />
              </Pressable>
            </View>

            <Image
              source={selectedAnimal?.imagem}
              style={styles.modalImage}
              resizeMode="contain"
            />

            <Text style={styles.modalScientificName}>
              Nome Científico: {selectedAnimal?.nomeCientifico || 'Espécie nativa'}
            </Text>

            <ScrollView style={styles.modalDescScroll}>
              <Text style={styles.modalDescText}>{selectedAnimal?.descricao}</Text>
              {selectedAnimal?.curiosidade && (
                <View style={styles.curiosityBox}>
                  <Text style={styles.curiosityTitle}>💡 Curiosidade de Escoteiro:</Text>
                  <Text style={styles.curiosityText}>{selectedAnimal.curiosidade}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Barra de Navegação Inferior de Madeira */}
      <BottomNavBar activeTab="Coleção" />
    </ImageBackground>
  );
}
