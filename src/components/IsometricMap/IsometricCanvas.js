import React, { Suspense, useState, useRef } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import IsometricCamera from './IsometricCamera';
import BiomeBlock from './BiomeBlock';
import PlacedEntity from './PlacedEntity';

/**
 * IsometricCanvas.jsx
 * Envolve o contexto WebGL (Canvas do R3F Native) com iluminação estúdio/natureza
 * balanceada (AmbientLight + DirectionalLights frontal e de preenchimento).
 *
 * Controles de Pan Suave:
 * Implementados via PanResponder nativo do React Native, manipulando o deslocamento
 * do diorama no plano XZ sem alterar o ângulo da câmera ortográfica.
 * Isso garante que a projeção isométrica matemática [10, 10, 10] permaneça intacta!
 */
export default function IsometricCanvas({
  biomeConfig,
  entities = [],
  onTilePress,
  onEntityPress,
  selectedCoord,
}) {
  // Controle de Pan do Diorama (Arrastar o mapa pelo toque na tela)
  const [panOffset, setPanOffset] = useState([0, 0, 0]);
  const lastPan = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Ativa o pan somente se houver movimento significativo do dedo (> 8px)
        return Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8;
      },
      onPanResponderGrant: () => {
        lastPan.current = { x: panOffset[0], y: panOffset[2] };
      },
      onPanResponderMove: (evt, gestureState) => {
        // Converte o delta de pixels do toque 2D em translação suave 3D
        // Sensibilidade calculada para resposta tátil natural
        const sensitivity = 0.012;
        const newX = lastPan.current.x + (gestureState.dx - gestureState.dy) * sensitivity * 0.7;
        const newZ = lastPan.current.y + (gestureState.dy + gestureState.dx) * sensitivity * 0.7;

        // Limita o alcance de arrasto para o mapa não sumir da tela (clamp bounds)
        const clampedX = Math.max(-3.5, Math.min(3.5, newX));
        const clampedZ = Math.max(-3.5, Math.min(3.5, newZ));

        setPanOffset([clampedX, 0, clampedZ]);
      },
    })
  ).current;

  // Lista combinada de entidades (configuração padrão do bioma + adicionadas pelo usuário)
  const activeEntities = entities.length > 0 ? entities : biomeConfig?.initialEntities || [];

  return (
    <View style={styles.canvasWrapper} {...panResponder.panHandlers}>
      <Canvas
        style={styles.canvas}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Câmera Isométrica Ortográfica Fixa [10, 10, 10] */}
        <IsometricCamera zoom={46} />

        {/* ILUMINAÇÃO ESTÚDIO LOW-POLY */}
        {/* 1. Luz Ambiente Suave e Quente (evita sombras 100% pretas) */}
        <ambientLight color="#FFF6EA" intensity={0.9} />

        {/* 2. Luz Direcional Principal de Sol (cria sombras e volumes nítidos) */}
        <directionalLight
          position={[12, 18, 10]}
          intensity={1.2}
          color="#FFFDF5"
        />

        {/* 3. Luz de Preenchimento (Fill Light) no lado oposto para dar brilho de contorno */}
        <directionalLight
          position={[-10, 8, -12]}
          intensity={0.4}
          color="#D8F3DC"
        />

        {/* GRUPO DO DIORAMA FLUTUANTE (com suporte a Pan suave) */}
        <group position={panOffset}>
          <Suspense fallback={null}>
            {/* Bloco Diorama do Chão do Bioma */}
            <BiomeBlock
              biomeConfig={biomeConfig}
              onTilePress={onTilePress}
              selectedCoord={selectedCoord}
            />

            {/* Entidades Posicionadas (Animais, Árvores, Estruturas) */}
            {activeEntities.map((entity) => (
              <PlacedEntity
                key={entity.id}
                entity={entity}
                onPress={onEntityPress}
              />
            ))}
          </Suspense>
        </group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  canvasWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
