import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_BASE_WIDTH = SCREEN_WIDTH * 1.35;
const MAP_BASE_HEIGHT = MAP_BASE_WIDTH * 0.72;

export default function IsometricBiomeDiorama({
  biomeConfig,
  customEntities = [],
  isEditMode = false,
  onAnimalPress,
  onStructurePress,
  onPlotPress,
}) {
  // Animação de Pan (Arrastar o mapa suavemente)
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Animação de respiração contínua (Idle dos animais)
  const breatheAnim = useRef(new Animated.Value(0)).current;

  // Animação de pulo individual de animais
  const [jumpingAnimalId, setJumpingAnimalId] = useState(null);
  const jumpAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Loop de respiração suave
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breatheAnim]);

  // PanResponder para movimentação suave do mapa pelo toque
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 6 || Math.abs(gestureState.dy) > 6;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        // Clamping para não sumir da tela
        const maxOffset = 140;
        const currentX = pan.x._value;
        const currentY = pan.y._value;

        Animated.spring(pan, {
          toValue: {
            x: Math.max(-maxOffset, Math.min(maxOffset, currentX)),
            y: Math.max(-maxOffset, Math.min(maxOffset, currentY)),
          },
          friction: 6,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  // Dispara o pulo do animal ao tocar
  const handleAnimalTap = (animal) => {
    setJumpingAnimalId(animal.id);
    jumpAnim.setValue(1);

    Animated.sequence([
      Animated.spring(jumpAnim, {
        toValue: 1.28,
        friction: 3,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(jumpAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => setJumpingAnimalId(null));

    if (onAnimalPress) {
      onAnimalPress(animal);
    }
  };

  // Interpolações de respiração
  const breatheTranslateY = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const breatheScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  const { initialEntities = [], structures = [], flora = [], buildPlots = [] } =
    biomeConfig || {};

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View
        style={[
          styles.mapCanvas,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
      >
        {/* 1. BASE ISOMÉTRICA ILUSTRADA DO BIOMA (Ilha Flutuante 2.5D) */}
        <View style={styles.islandBaseContainer}>
          <Image
            source={biomeConfig?.baseImage}
            style={styles.islandImage}
            resizeMode="contain"
          />

          {/* Sombra de Contato Suave */}
          <View style={styles.islandShadow} />
        </View>

        {/* 2. CAMADA DE FLORA NATIVA */}
        {flora.map((item) => (
          <View
            key={item.id}
            style={[
              styles.floraPin,
              { left: `${item.x}%`, top: `${item.y}%` },
            ]}
          >
            <Text style={styles.floraEmoji}>{item.icon}</Text>
            <View style={styles.floraBadge}>
              <Text style={styles.floraText}>{item.name}</Text>
            </View>
          </View>
        ))}

        {/* 3. CAMADA DE ESTRUTURAS ECOLÓGICAS (Posto Veterinário, Torre, etc.) */}
        {structures.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.structurePin,
              { left: `${item.x}%`, top: `${item.y}%` },
            ]}
            onPress={() => onStructurePress && onStructurePress(item)}
          >
            <View style={styles.structureIconWrapper}>
              <Text style={styles.structureEmoji}>{item.icon}</Text>
            </View>
            <View style={styles.structureBadge}>
              <Text style={styles.structureText} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          </Pressable>
        ))}

        {/* 4. CAMADA DE ANIMAIS VIVOS INTERATIVOS (Fauna) */}
        {initialEntities.map((animal) => {
          const isJumping = jumpingAnimalId === animal.id;

          return (
            <Animated.View
              key={animal.id}
              style={[
                styles.animalContainer,
                { left: `${animal.x}%`, top: `${animal.y}%` },
                {
                  transform: [
                    { translateY: isJumping ? -18 : breatheTranslateY },
                    { scale: isJumping ? jumpAnim : breatheScale },
                  ],
                },
              ]}
            >
              <Pressable
                onPress={() => handleAnimalTap(animal)}
                style={styles.animalTouchable}
              >
                {/* Balão de Necessidade Flutuante (💧 Sede / 🍎 Fome / 💚 Carinho) */}
                <View style={styles.needBubble}>
                  <Text style={styles.needBubbleText}>{animal.bubble || '💚'}</Text>
                </View>

                {/* Avatar / Imagem do Animal */}
                <View style={styles.animalAvatarRing}>
                  <Text style={styles.animalEmoji}>{animal.emoji}</Text>
                </View>

                {/* Plaquinha com Nome do Animal */}
                <View style={styles.animalNameBadge}>
                  <Text style={styles.animalNameText}>{animal.name}</Text>
                </View>
              </Pressable>
            </Animated.View>
          );
        })}

        {/* 5. ENTIDADES ADICIONADAS PELO JOGADOR (Modo Construção) */}
        {customEntities.map((entity) => (
          <View
            key={entity.id}
            style={[
              styles.customEntityPin,
              { left: `${entity.x}%`, top: `${entity.y}%` },
            ]}
          >
            <Text style={styles.customEntityEmoji}>
              {entity.type === 'tree' ? '🌳' : entity.type === 'structure' ? '💧' : '🌱'}
            </Text>
            <View style={styles.customEntityBadge}>
              <Text style={styles.customEntityText}>{entity.name}</Text>
            </View>
          </View>
        ))}

        {/* 6. LOTES DE CONSTRUÇÃO (Ativos no Modo Edição) */}
        {isEditMode &&
          buildPlots.map((plot) => (
            <Pressable
              key={plot.id}
              style={[
                styles.buildPlot,
                { left: `${plot.x}%`, top: `${plot.y}%` },
              ]}
              onPress={() => onPlotPress && onPlotPress(plot)}
            >
              <View style={styles.buildPlotRing}>
                <Text style={styles.buildPlotPlus}>➕</Text>
                <Text style={styles.buildPlotLabel}>Plantar / Construir</Text>
              </View>
            </Pressable>
          ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  mapCanvas: {
    width: MAP_BASE_WIDTH,
    height: MAP_BASE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  islandBaseContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  islandImage: {
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  islandShadow: {
    position: 'absolute',
    bottom: -15,
    width: '78%',
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    zIndex: 1,
    transform: [{ scaleX: 1.2 }],
  },

  // ANIMAIS INTERATIVOS
  animalContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    width: 72,
    marginLeft: -36,
    marginTop: -42,
  },
  animalTouchable: {
    alignItems: 'center',
  },
  needBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FFE082',
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: -6,
    zIndex: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  needBubbleText: {
    fontSize: 13,
  },
  animalAvatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2.5,
    borderColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  animalEmoji: {
    fontSize: 26,
  },
  animalNameBadge: {
    backgroundColor: 'rgba(30, 41, 59, 0.88)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  animalNameText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },

  // ESTRUTURAS ECOLÓGICAS
  structurePin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 9,
    width: 80,
    marginLeft: -40,
    marginTop: -38,
  },
  structureIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderWidth: 2,
    borderColor: '#0288D1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  structureEmoji: {
    fontSize: 22,
  },
  structureBadge: {
    backgroundColor: 'rgba(2, 136, 209, 0.92)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    maxWidth: 78,
  },
  structureText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
  },

  // FLORA NATIVA
  floraPin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 8,
    width: 60,
    marginLeft: -30,
    marginTop: -28,
  },
  floraEmoji: {
    fontSize: 24,
  },
  floraBadge: {
    backgroundColor: 'rgba(46, 125, 50, 0.82)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 1,
  },
  floraText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },

  // LOTES DE CONSTRUÇÃO (Modo Edição)
  buildPlot: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 15,
    width: 76,
    marginLeft: -38,
    marginTop: -26,
  },
  buildPlotRing: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#F57C00',
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 5,
    alignItems: 'center',
    elevation: 5,
  },
  buildPlotPlus: {
    fontSize: 16,
  },
  buildPlotLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E65100',
    marginTop: 2,
    textAlign: 'center',
  },

  // ENTIDADES CUSTOMIZADAS
  customEntityPin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
    width: 64,
    marginLeft: -32,
    marginTop: -30,
  },
  customEntityEmoji: {
    fontSize: 24,
  },
  customEntityBadge: {
    backgroundColor: '#388E3C',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 2,
  },
  customEntityText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
