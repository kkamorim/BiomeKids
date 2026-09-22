// @refresh reset
import React, { Component, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Canvas } from '@react-three/fiber/native';

import BiomeBlock from './BiomeBlock';
import IsometricCamera from './IsometricCamera';
import PlacedEntity from './PlacedEntity';

const MAP_RADIUS = 2.35;

function percentToPosition(item, height = 0.45) {
  if (Array.isArray(item.position)) return item.position;

  const x = ((Number(item.x ?? 50) - 50) / 50) * MAP_RADIUS;
  const z = ((Number(item.y ?? 50) - 50) / 50) * MAP_RADIUS;
  return [x, height, z];
}

function inferAnimalModel(item) {
  const value = `${item.id || ''} ${item.name || ''}`.toLowerCase();
  if (value.includes('jacar')) return 'alligator';
  if (value.includes('capivara')) return 'capybara';
  if (/tuiui|tucano|asa-branca|ema|ave/.test(value)) return 'bird';
  return 'jaguar';
}

function inferFloraModel(item, biomeId) {
  const value = `${item.id || ''} ${item.name || ''}`.toLowerCase();
  if (value.includes('vitória') || value.includes('vitoria')) return 'water_lily';
  if (value.includes('cacto') || biomeId === 'caatinga') return 'cactus';
  if (biomeId === 'pampa') return 'reeds';
  return 'tropical_tree';
}

function createSceneEntities(biomeConfig, customEntities) {
  const animals = (biomeConfig?.initialEntities || []).map((item) => ({
    ...item,
    type: 'animal',
    modelType: item.modelType || inferAnimalModel(item),
    position: percentToPosition(item, 0.42),
    scale: (item.scale || 1) * 0.82,
  }));

  const flora = (biomeConfig?.flora || []).map((item) => {
    const modelType = item.modelType || inferFloraModel(item, biomeConfig?.id);
    return {
      ...item,
      type: modelType === 'tropical_tree' ? 'tree' : 'plant',
      modelType,
      position: percentToPosition(item, 0.35),
      scale: 0.72,
    };
  });

  const structures = (biomeConfig?.structures || []).map((item) => ({
    ...item,
    type: 'structure',
    modelType: 'eco_station',
    position: percentToPosition(item, 0.38),
    scale: 0.8,
  }));

  const placed = (customEntities || []).map((item) => ({
    ...item,
    position: percentToPosition(item, 0.38),
    scale: item.scale || 0.75,
  }));

  return [...animals, ...flora, ...structures, ...placed];
}

function BuildPlotMarker({ plot, onPress }) {
  const position = percentToPosition(plot, 0.3);

  return (
    <group position={position} onPointerDown={(event) => {
      event.stopPropagation();
      onPress?.({ ...plot, position });
    }}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.31, 20]} />
        <meshBasicMaterial color='#FFD166' transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 12]} />
        <meshBasicMaterial color='#EF6C00' />
      </mesh>
    </group>
  );
}

class SceneErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('Falha ao iniciar o mapa 3D:', error);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.feedback}>
          <Text style={styles.feedbackTitle}>O mapa 3D não pôde iniciar</Text>
          <Text style={styles.feedbackText}>Reabra esta tela ou reinicie o Expo Go.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function IsometricCanvas({
  biomeConfig,
  customEntities = [],
  isEditMode = false,
  onEntityPress,
  onPlotPress,
  onTilePress,
  onReady,
  onError,
  selectedCoord,
}) {
  const sceneEntities = useMemo(
    () => createSceneEntities(biomeConfig, customEntities),
    [biomeConfig, customEntities]
  );

  const skyColor = biomeConfig?.skyColors?.[0] || '#E0F2FE';

  return (
    <View style={[styles.wrapper, { backgroundColor: skyColor }]} collapsable={false}>
      <SceneErrorBoundary key={biomeConfig?.id} onError={onError}>
        <Canvas
          style={styles.canvas}
          orthographic
          camera={{ position: [10, 10, 10], zoom: 46, near: 0.1, far: 100 }}
          frameloop='always'
          onCreated={({ camera, gl }) => {
            camera.lookAt(0, 0, 0);
            gl.setClearColor(skyColor, 1);
            onReady?.();
          }}
        >
          <IsometricCamera zoom={46} />
          <ambientLight color='#FFF6EA' intensity={0.85} />
          <hemisphereLight args={['#DFF6FF', '#5B3A29', 0.55]} />
          <directionalLight position={[12, 18, 10]} intensity={1.25} color='#FFFDF5' />
          <directionalLight position={[-10, 8, -12]} intensity={0.35} color='#D8F3DC' />

          <group>
            <BiomeBlock
              biomeConfig={biomeConfig}
              onTilePress={onTilePress}
              selectedCoord={selectedCoord}
            />

            {sceneEntities.map((entity) => (
              <PlacedEntity key={entity.id} entity={entity} onPress={onEntityPress} />
            ))}

            {isEditMode && (biomeConfig?.buildPlots || []).map((plot) => (
              <BuildPlotMarker key={plot.id} plot={plot} onPress={onPlotPress} />
            ))}
          </group>
        </Canvas>
      </SceneErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, width: '100%', height: '100%' },
  canvas: { flex: 1, width: '100%', height: '100%' },
  feedback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#E0F2FE',
  },
  feedbackTitle: { color: '#1B4332', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  feedbackText: { color: '#52796F', fontSize: 13, marginTop: 8, textAlign: 'center' },
});
