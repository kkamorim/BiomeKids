import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppBackground from '../../components/AppBackground';
import BottomNavBar from '../../components/BottomNavBar';
import StatusHeader from '../../components/StatusHeader';
import { useGame } from '../../contexts/GameContext';
import { BIOME_CHAPTERS, JOURNEY_STEPS } from '../../data/biomeJourney';
import { layout, palette, spacing } from '../../theme/designSystem';
import styles from './styles';

const CATEGORY_META = {
  all: { label: 'Todos', icon: 'grid-outline' },
  flora: { label: 'Flora', icon: 'leaf-outline' },
  fauna: { label: 'Fauna', icon: 'paw-outline' },
  discovery: { label: 'Descoberta', icon: 'bulb-outline' },
  badge: { label: 'Insígnia', icon: 'ribbon-outline' },
};

const CATEGORY_ORDER = ['all', 'flora', 'fauna', 'discovery', 'badge'];
const BIOME_BY_ID = new Map(BIOME_CHAPTERS.map((biome) => [biome.id, biome]));

function normalizeCategory(category) {
  if (category === 'producer' || category === 'plant') return 'flora';
  if (category === 'consumer' || category === 'animal') return 'fauna';
  if (category === 'badge' || category === 'insignia') return 'badge';
  return category === 'flora' || category === 'fauna' ? category : 'discovery';
}

function itemId(item) {
  if (typeof item === 'string') return item;
  return item?.id || item?.key || item?.slug || null;
}

function createCatalog() {
  const entries = new Map();
  const add = (item, metadata) => {
    const id = itemId(item);
    if (!id) return;
    const previous = entries.get(id) || {};
    entries.set(id, {
      ...previous,
      ...item,
      ...metadata,
      id,
      category: normalizeCategory(item.category || metadata.category),
    });
  };

  JOURNEY_STEPS.forEach((step, stepIndex) => {
    if (!step.collectionItem) return;
    const isTransition = step.type === 'transition';
    add(step.collectionItem, {
      biomeId: step.collectionItem.biomeId || step.biomeId,
      sourceType: isTransition ? 'transition' : 'lesson',
      sourceOrder: step.globalLevel || stepIndex,
      unlockHint: isTransition
        ? 'Conclua a passagem para este bioma.'
        : 'Conclua a lição ' + step.localLevel + ': ' + step.title + '.',
    });
  });

  BIOME_CHAPTERS.forEach((biome) => {
    (biome.treeNodes || []).forEach((treeNode, nodeIndex) => {
      if (!treeNode.collectionItem) return;
      add(treeNode.collectionItem, {
        biomeId: treeNode.collectionItem.biomeId || biome.id,
        sourceType: 'tree',
        sourceOrder: 1000 + biome.order * 100 + nodeIndex,
        unlockHint: 'Desbloqueie ' + treeNode.name + ' na Árvore de Evolução.',
      });
    });
  });

  return [...entries.values()].sort((first, second) => {
    const firstBiome = BIOME_BY_ID.get(first.biomeId)?.order || 999;
    const secondBiome = BIOME_BY_ID.get(second.biomeId)?.order || 999;
    return firstBiome - secondBiome
      || (first.sourceOrder || 0) - (second.sourceOrder || 0)
      || String(first.name).localeCompare(String(second.name), 'pt-BR');
  });
}

const COLLECTION_CATALOG = createCatalog();

function AlbumCard({ item, width, theme, onPress }) {
  const category = CATEGORY_META[item.category] || CATEGORY_META.discovery;
  const locked = !item.unlocked;

  return (
    <Pressable
      accessibilityRole={'button'}
      accessibilityLabel={
        item.name + '. ' + (locked ? 'Bloqueado. ' + item.unlockHint : 'Descoberto.')
      }
      accessibilityState={{ disabled: false }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.itemCard,
        { width },
        locked && styles.itemCardLocked,
        pressed && styles.itemCardPressed,
      ]}
    >
      <View
        style={[
          styles.artFrame,
          { backgroundColor: locked ? palette.disabledSurface : theme.soft },
        ]}
      >
        <Text style={[styles.itemEmoji, locked && styles.itemEmojiLocked]}>
          {item.emoji || '*'}
        </Text>
        {locked ? (
          <View style={styles.lockBadge}>
            <Ionicons name={'lock-closed'} size={13} color={palette.inverseText} />
          </View>
        ) : (
          <View style={[styles.discoveredBadge, { backgroundColor: theme.primary }]}>
            <Ionicons name={'checkmark'} size={13} color={palette.inverseText} />
          </View>
        )}
      </View>

      <Text style={styles.itemName} numberOfLines={2}>
        {item.name}
      </Text>
      <View style={styles.itemFooter}>
        <Ionicons
          name={category.icon}
          size={12}
          color={locked ? palette.textSubtle : theme.dark}
        />
        <Text
          style={[styles.itemCategory, { color: locked ? palette.textSubtle : theme.dark }]}
          numberOfLines={1}
        >
          {category.label}
        </Text>
      </View>
    </Pressable>
  );
}

export default function Colecao() {
  const { width: windowWidth } = useWindowDimensions();
  const game = useGame();
  const collection = Array.isArray(game.collection) ? game.collection : [];
  const activeBiome = game.activeBiome || BIOME_CHAPTERS[0];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBiomeId, setSelectedBiomeId] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const unlockedById = useMemo(() => {
    const map = new Map();
    collection.forEach((entry) => {
      const id = itemId(entry);
      if (id) map.set(id, entry);
    });
    return map;
  }, [collection]);

  const catalog = useMemo(() => {
    const baseIds = new Set(COLLECTION_CATALOG.map((item) => item.id));
    const knownItems = COLLECTION_CATALOG.map((item) => {
      const savedItem = unlockedById.get(item.id);
      return {
        ...item,
        ...(savedItem && typeof savedItem === 'object' ? savedItem : {}),
        id: item.id,
        category: normalizeCategory(savedItem?.category || item.category),
        unlocked: unlockedById.has(item.id),
      };
    });
    const extras = collection
      .filter((entry) => itemId(entry) && !baseIds.has(itemId(entry)))
      .map((entry, index) => ({
        ...(typeof entry === 'object' ? entry : { id: entry, name: 'Descoberta bônus' }),
        id: itemId(entry),
        biomeId: entry?.biomeId || activeBiome?.id || BIOME_CHAPTERS[0]?.id,
        category: normalizeCategory(entry?.category),
        sourceType: 'bonus',
        sourceOrder: 9000 + index,
        unlockHint: 'Recompensa especial já descoberta.',
        unlocked: true,
      }));
    return [...knownItems, ...extras];
  }, [activeBiome?.id, collection, unlockedById]);

  const filteredCatalog = useMemo(() => catalog.filter((item) => (
    (selectedCategory === 'all' || item.category === selectedCategory)
    && (selectedBiomeId === 'all' || item.biomeId === selectedBiomeId)
  )), [catalog, selectedBiomeId, selectedCategory]);

  const unlockedCount = catalog.filter((item) => item.unlocked).length;
  const progress = catalog.length ? unlockedCount / catalog.length : 0;
  const contentWidth = Math.min(windowWidth, layout.maxContentWidth);
  const columns = contentWidth >= 680 ? 4 : contentWidth >= 470 ? 3 : 2;
  const availableWidth = Math.max(260, contentWidth - spacing.lg * 2);
  const cardWidth = Math.floor(
    (availableWidth - spacing.md * (columns - 1)) / columns
  );
  const backgroundTheme = activeBiome?.theme || {
    primary: palette.primary,
    secondary: palette.secondary,
    dark: palette.primaryDeep,
    soft: palette.primarySoft,
    background: palette.background,
  };

  const visibleBiomes = selectedBiomeId === 'all'
    ? BIOME_CHAPTERS
    : BIOME_CHAPTERS.filter((biome) => biome.id === selectedBiomeId);

  const selectedBiome = selectedItem ? BIOME_BY_ID.get(selectedItem.biomeId) : null;
  const selectedTheme = selectedBiome?.theme || backgroundTheme;
  const selectedCategoryMeta = selectedItem
    ? CATEGORY_META[selectedItem.category] || CATEGORY_META.discovery
    : CATEGORY_META.discovery;

  return (
    <AppBackground
      colors={[
        backgroundTheme.background || palette.background,
        backgroundTheme.soft || palette.backgroundMuted,
        palette.backgroundWarm,
      ]}
      decorationColors={[
        backgroundTheme.primary || palette.primary,
        backgroundTheme.secondary || palette.secondary,
        palette.warning,
      ]}
    >
      <StatusHeader showBiomes />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIcon}>
              <Ionicons name={'albums'} size={30} color={backgroundTheme.primary} />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>CADERNO DE CAMPO</Text>
              <Text style={styles.title}>Álbum dos 9 biomas</Text>
              <Text style={styles.subtitle}>
                Cada lição e evolução revela uma nova página da natureza.
              </Text>
            </View>
          </View>

          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Descobertas registradas</Text>
            <Text style={[styles.progressValue, { color: backgroundTheme.dark }]}>
              {unlockedCount}/{catalog.length}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: String(Math.round(progress * 100)) + '%',
                  backgroundColor: backgroundTheme.primary,
                },
              ]}
            />
          </View>
        </View>

        <Text style={styles.filterTitle}>O que você quer explorar?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CATEGORY_ORDER.map((categoryId) => {
            const category = CATEGORY_META[categoryId];
            const selected = selectedCategory === categoryId;
            return (
              <Pressable
                key={categoryId}
                accessibilityRole={'button'}
                accessibilityLabel={'Filtrar por ' + category.label}
                accessibilityState={{ selected }}
                onPress={() => setSelectedCategory(categoryId)}
                style={[
                  styles.filterChip,
                  selected && {
                    backgroundColor: backgroundTheme.primary,
                    borderColor: backgroundTheme.primary,
                  },
                ]}
              >
                <Ionicons
                  name={category.icon}
                  size={16}
                  color={selected ? palette.inverseText : palette.textMuted}
                />
                <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.biomeRow}
        >
          <Pressable
            accessibilityRole={'button'}
            accessibilityLabel={'Mostrar todos os biomas'}
            accessibilityState={{ selected: selectedBiomeId === 'all' }}
            onPress={() => setSelectedBiomeId('all')}
            style={[
              styles.biomeChip,
              selectedBiomeId === 'all' && styles.biomeChipActive,
            ]}
          >
            <Text style={styles.biomeChipEmoji}>9</Text>
            <Text
              style={[
                styles.biomeChipText,
                selectedBiomeId === 'all' && styles.biomeChipTextActive,
              ]}
            >
              Todos
            </Text>
          </Pressable>
          {BIOME_CHAPTERS.map((biome) => {
            const selected = selectedBiomeId === biome.id;
            return (
              <Pressable
                key={biome.id}
                accessibilityRole={'button'}
                accessibilityLabel={'Mostrar álbum de ' + biome.name}
                accessibilityState={{ selected }}
                onPress={() => setSelectedBiomeId(biome.id)}
                style={[
                  styles.biomeChip,
                  selected && {
                    backgroundColor: biome.theme.primary,
                    borderColor: biome.theme.primary,
                  },
                ]}
              >
                <Text style={styles.biomeChipEmoji}>{biome.emoji}</Text>
                <Text style={[styles.biomeChipText, selected && styles.biomeChipTextActive]}>
                  {biome.shortName}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {visibleBiomes.map((biome) => {
          const items = filteredCatalog.filter((item) => item.biomeId === biome.id);
          if (!items.length) return null;
          const discovered = items.filter((item) => item.unlocked).length;
          return (
            <View key={biome.id} style={styles.biomeSection}>
              <View style={styles.sectionHeader}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: biome.theme.soft }]}
                >
                  <Text style={styles.sectionEmoji}>{biome.emoji}</Text>
                </View>
                <View style={styles.sectionCopy}>
                  <Text style={styles.sectionTitle}>{biome.name}</Text>
                  <Text style={styles.sectionSubtitle}>
                    {discovered} de {items.length} páginas reveladas
                  </Text>
                </View>
                <View style={[styles.sectionCount, { backgroundColor: biome.theme.soft }]}>
                  <Text style={[styles.sectionCountText, { color: biome.theme.dark }]}>
                    {Math.round((discovered / items.length) * 100)}%
                  </Text>
                </View>
              </View>

              <View style={styles.grid}>
                {items.map((item) => (
                  <AlbumCard
                    key={item.id}
                    item={item}
                    width={cardWidth}
                    theme={biome.theme}
                    onPress={() => setSelectedItem(item)}
                  />
                ))}
              </View>
            </View>
          );
        })}

        {!filteredCatalog.length ? (
          <View style={styles.emptyCard}>
            <Ionicons name={'search'} size={30} color={palette.textSubtle} />
            <Text style={styles.emptyTitle}>Nenhuma página neste filtro</Text>
            <Text style={styles.emptyText}>
              Escolha outra categoria ou volte para todos os biomas.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <BottomNavBar activeTab={'Colecao'} />

      <Modal
        visible={Boolean(selectedItem)}
        transparent
        animationType={'fade'}
        statusBarTranslucent
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            accessibilityRole={'button'}
            accessibilityLabel={'Fechar detalhes'}
            onPress={() => setSelectedItem(null)}
            style={styles.modalDismiss}
          />
          {selectedItem ? (
            <View style={[styles.modalCard, { borderColor: selectedTheme.primary }]}>
              <View style={styles.modalHeader}>
                <View
                  style={[styles.modalBiomeBadge, { backgroundColor: selectedTheme.soft }]}
                >
                  <Text style={styles.modalBiomeEmoji}>{selectedBiome?.emoji || '*'}</Text>
                  <Text style={[styles.modalBiomeText, { color: selectedTheme.dark }]}>
                    {selectedBiome?.shortName || 'BiomeKids'}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole={'button'}
                  accessibilityLabel={'Fechar detalhes da descoberta'}
                  hitSlop={10}
                  onPress={() => setSelectedItem(null)}
                  style={styles.closeButton}
                >
                  <Ionicons name={'close'} size={22} color={palette.text} />
                </Pressable>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalContent}
              >
                <View
                  style={[
                    styles.modalArt,
                    {
                      backgroundColor: selectedItem.unlocked
                        ? selectedTheme.soft
                        : palette.disabledSurface,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalEmoji,
                      !selectedItem.unlocked && styles.itemEmojiLocked,
                    ]}
                  >
                    {selectedItem.emoji || '*'}
                  </Text>
                  {!selectedItem.unlocked ? (
                    <View style={styles.modalLock}>
                      <Ionicons
                        name={'lock-closed'}
                        size={22}
                        color={palette.inverseText}
                      />
                    </View>
                  ) : null}
                </View>

                <View style={styles.modalTitleRow}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: selectedTheme.soft },
                    ]}
                  >
                    <Ionicons
                      name={selectedCategoryMeta.icon}
                      size={14}
                      color={selectedTheme.dark}
                    />
                    <Text style={[styles.categoryBadgeText, { color: selectedTheme.dark }]}>
                      {selectedCategoryMeta.label}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.stateBadge,
                      selectedItem.unlocked
                        ? styles.stateBadgeUnlocked
                        : styles.stateBadgeLocked,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stateBadgeText,
                        selectedItem.unlocked
                          ? styles.stateBadgeTextUnlocked
                          : styles.stateBadgeTextLocked,
                      ]}
                    >
                      {selectedItem.unlocked ? 'DESCOBERTO' : 'BLOQUEADO'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalDescription}>
                  {selectedItem.unlocked
                    ? selectedItem.description || 'Uma descoberta especial do ecossistema.'
                    : 'Esta página ainda está esperando pela sua expedição.'}
                </Text>

                <View
                  style={[
                    styles.unlockBox,
                    {
                      backgroundColor: selectedItem.unlocked
                        ? selectedTheme.soft
                        : palette.surfaceMuted,
                    },
                  ]}
                >
                  <Ionicons
                    name={selectedItem.unlocked ? 'checkmark-circle' : 'compass-outline'}
                    size={22}
                    color={selectedItem.unlocked ? selectedTheme.primary : palette.textMuted}
                  />
                  <View style={styles.unlockCopy}>
                    <Text style={styles.unlockTitle}>
                      {selectedItem.unlocked ? 'Registro concluído' : 'Como descobrir'}
                    </Text>
                    <Text style={styles.unlockText}>
                      {selectedItem.unlocked
                        ? 'Esta página já faz parte do seu caderno de campo.'
                        : selectedItem.unlockHint}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          ) : null}
        </View>
      </Modal>
    </AppBackground>
  );
}
