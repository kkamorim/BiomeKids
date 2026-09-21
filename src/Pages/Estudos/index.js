import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ImageBackground,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../../contexts/GameContext';
import { BIOMES, ANIMALS, QUIZZES, BOOKS, getEvolutionInfo } from '../../data/gameData';
import CurrencyHeader from '../../components/CurrencyHeader';
import BottomNavBar from '../../components/BottomNavBar';
import styles from './styles';

export default function Estudos() {
  const navigation = useNavigation();
  const { studyProgress = {}, animals = {}, readBook } = useGame();
  const [selectedBiome, setSelectedBiome] = useState(1);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  const biomeAnimals = ANIMALS[selectedBiome] || [];

  const getStudyStatus = (animalId) => {
    const study = studyProgress?.[animalId];
    if (!study) return { booksRead: 0, totalBooks: 0, quizzesDone: 0, totalQuizzes: 0, isScientist: false };

    const totalBooks = (BOOKS[animalId] || []).length;
    const totalQuizzes = (QUIZZES[animalId] || []).length;

    return {
      booksRead: study.booksRead.length,
      totalBooks,
      quizzesDone: study.quizzesCompleted.length,
      totalQuizzes,
      isScientist: study.isScientist,
    };
  };

  const renderBiomeTab = (biome) => {
    const isActive = selectedBiome === biome.id;
    return (
      <Pressable
        key={biome.id}
        style={[styles.biomeTab, isActive && styles.biomeTabActive]}
        onPress={() => setSelectedBiome(biome.id)}
      >
        <Text style={[styles.biomeTabText, isActive && styles.biomeTabTextActive]}>
          {biome.nome}
        </Text>
      </Pressable>
    );
  };

  const renderAnimalCard = ({ item }) => {
    const status = getStudyStatus(item.id);
    const animalState = animals?.[item.id];
    const evolutionInfo = animalState ? getEvolutionInfo(animalState.stage) : getEvolutionInfo('egg');
    const progressPercent =
      status.totalBooks + status.totalQuizzes > 0
        ? ((status.booksRead + status.quizzesDone) / (status.totalBooks + status.totalQuizzes)) * 100
        : 0;

    return (
      <Pressable
        style={styles.animalCard}
        onPress={() => setSelectedAnimal(item)}
      >
        <View style={styles.animalCardImageWrapper}>
          <Image source={item.imagem} style={styles.animalCardImage} resizeMode="contain" />
          {status.isScientist && (
            <View style={styles.scientistBadge}>
              <Text style={styles.scientistBadgeText}>🧪</Text>
            </View>
          )}
        </View>

        <View style={styles.animalCardInfo}>
          <Text style={styles.animalCardName} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.animalCardStage}>
            {evolutionInfo.emoji} {evolutionInfo.label}
          </Text>

          {/* Barra de Progresso de Estudo */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {status.booksRead + status.quizzesDone}/{status.totalBooks + status.totalQuizzes} estudos
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderAnimalDetail = () => {
    if (!selectedAnimal) return null;

    const status = getStudyStatus(selectedAnimal.id);
    const animalBooks = BOOKS[selectedAnimal.id] || [];
    const animalQuizzes = QUIZZES[selectedAnimal.id] || [];
    const study = studyProgress?.[selectedAnimal.id];

    return (
      <Modal
        visible={!!selectedAnimal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedAnimal(null)}
      >
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailModalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.detailHeader}>
                <Pressable style={styles.detailCloseBtn} onPress={() => setSelectedAnimal(null)}>
                  <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
                <Image source={selectedAnimal.imagem} style={styles.detailImage} resizeMode="contain" />
                <Text style={styles.detailName}>{selectedAnimal.nome}</Text>
                <Text style={styles.detailScientific}>{selectedAnimal.nomeCientifico}</Text>

                {status.isScientist && (
                  <View style={styles.scientistFullBadge}>
                    <Text style={styles.scientistFullBadgeText}>🧪 Cientista Júnior</Text>
                  </View>
                )}
              </View>

              {/* Descrição */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>📋 Sobre</Text>
                <Text style={styles.detailDescription}>{selectedAnimal.descricao}</Text>
              </View>

              {/* Dieta */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>🍽️ Dieta</Text>
                <Text style={styles.detailDescription}>{selectedAnimal.dieta}</Text>
              </View>

              {/* Curiosidade */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>💡 Curiosidade</Text>
                <Text style={styles.detailDescription}>{selectedAnimal.curiosidade}</Text>
              </View>

              {/* Livros */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>
                  📚 Livros ({status.booksRead}/{status.totalBooks})
                </Text>
                {animalBooks.map((book) => {
                  const isRead = study?.booksRead?.includes(book.id);
                  return (
                    <Pressable
                      key={book.id}
                      style={[styles.bookCard, isRead && styles.bookCardRead]}
                      onPress={() => {
                        setCurrentBook(book);
                        setShowBookModal(true);
                      }}
                    >
                      <View style={styles.bookCardIcon}>
                        <Ionicons
                          name={isRead ? 'checkmark-circle' : 'book'}
                          size={22}
                          color={isRead ? '#66BB6A' : '#FFB74D'}
                        />
                      </View>
                      <View style={styles.bookCardInfo}>
                        <Text style={styles.bookCardTitle}>{book.titulo}</Text>
                        <Text style={styles.bookCardXP}>
                          {isRead ? '✓ Lido' : `+${book.xpRecompensa} XP`}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#9e9e9e" />
                    </Pressable>
                  );
                })}
              </View>

              {/* Quizzes */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>
                  🧠 Quizzes ({status.quizzesDone}/{status.totalQuizzes})
                </Text>
                {animalQuizzes.map((quiz) => {
                  const isDone = study?.quizzesCompleted?.includes(quiz.id);
                  return (
                    <Pressable
                      key={quiz.id}
                      style={[styles.quizCard, isDone && styles.quizCardDone]}
                      onPress={() => {
                        setSelectedAnimal(null);
                        navigation.navigate('QuizScreen', {
                          animalId: selectedAnimal.id,
                          quizId: quiz.id,
                        });
                      }}
                    >
                      <View style={styles.quizCardIcon}>
                        <FontAwesome5
                          name={isDone ? 'check-circle' : 'question-circle'}
                          size={20}
                          color={isDone ? '#66BB6A' : '#42A5F5'}
                        />
                      </View>
                      <View style={styles.quizCardInfo}>
                        <Text style={styles.quizCardTitle}>{quiz.titulo}</Text>
                        <Text style={styles.quizCardXP}>
                          {isDone ? '✓ Completo' : `+${quiz.recompensaXP} XP • ${quiz.perguntas.length} perguntas`}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#9e9e9e" />
                    </Pressable>
                  );
                })}
              </View>

              {/* Atalhos */}
              <View style={styles.detailSection}>
                <Pressable
                  style={styles.shortcutButton}
                  onPress={() => {
                    setSelectedAnimal(null);
                    // Encontra o bioma do animal
                    const biome = BIOMES.find((b) => b.id === selectedBiome);
                    if (biome) navigation.navigate(biome.rota);
                  }}
                >
                  <Ionicons name="map" size={18} color="#fff" />
                  <Text style={styles.shortcutButtonText}> Ver no Habitat</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderBookModal = () => {
    if (!currentBook || !selectedAnimal) return null;

    return (
      <Modal
        visible={showBookModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowBookModal(false)}
      >
        <View style={styles.bookModalOverlay}>
          <View style={styles.bookModalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.bookModalTitle}>{currentBook.titulo}</Text>
              <View style={styles.bookModalDivider} />
              <Text style={styles.bookModalText}>{currentBook.conteudo}</Text>
            </ScrollView>

            <Pressable
              style={styles.bookModalButton}
              onPress={() => {
                if (readBook && selectedAnimal && currentBook) {
                  readBook(selectedAnimal.id, currentBook.id);
                }
                setShowBookModal(false);
              }}
            >
              <Text style={styles.bookModalButtonText}>
                {studyProgress?.[selectedAnimal.id]?.booksRead?.includes(currentBook.id)
                  ? 'Fechar'
                  : `Concluir Leitura (+${currentBook.xpRecompensa} XP)`}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/fundo-ceu.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>📚 Centro de Pesquisa</Text>
            <Text style={styles.headerSubtitle}>Estude os animais e evolua sua coleção!</Text>
          </View>
          <CurrencyHeader />
        </View>

        {/* Tabs de Biomas */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.biomeTabsContainer}
          contentContainerStyle={styles.biomeTabsContent}
        >
          {BIOMES.map(renderBiomeTab)}
        </ScrollView>

        {/* Lista de Animais */}
        <FlatList
          data={biomeAnimals}
          keyExtractor={(item) => item.id}
          renderItem={renderAnimalCard}
          contentContainerStyle={[styles.animalListContent, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      {/* Modais */}
      {renderAnimalDetail()}
      {renderBookModal()}

      {/* Barra de Navegação Inferior de Madeira */}
      <BottomNavBar activeTab="Estudos" />
    </ImageBackground>
  );
}
