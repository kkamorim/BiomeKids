import React, { useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * BiomeBlock.jsx
 * Renderiza o bloco de diorama 3D flutuante (estilo Low-Poly/Voxel).
 * Possui uma base profunda com camadas geológicas e a superfície específica
 * de cada bioma (rios, dunas, gelo, divisão terra/água).
 *
 * Inclui raycaster ativo no onPointerDown para capturar as coordenadas [x, y, z]
 * para posicionamento de itens da Loja/Construção.
 */
export default function BiomeBlock({
  biomeConfig,
  onTilePress,
  selectedCoord,
}) {
  const [hoveredCoord, setHoveredCoord] = useState(null);

  const {
    baseColor = '#1B4332',
    surfaceColor = '#2D6A4F',
    waterColor = '#0077B6',
    hasRiver = false,
    hasWetlandSplit = false,
    hasDunes = false,
    hasIcePond = false,
    foliageType = 'rainforest',
  } = biomeConfig || {};

  // Dimensões do diorama flutuante
  const BLOCK_SIZE = 5.6;
  const BASE_HEIGHT = 1.6;
  const TOP_HEIGHT = 0.4;

  const handlePointerDown = (event) => {
    event.stopPropagation();
    // Intercepta o ponto de interseção do Raycaster
    if (event.point) {
      const coords = [
        parseFloat(event.point.x.toFixed(2)),
        parseFloat((TOP_HEIGHT / 2).toFixed(2)),
        parseFloat(event.point.z.toFixed(2)),
      ];
      setHoveredCoord(coords);
      if (onTilePress) {
        onTilePress(coords);
      }
    }
  };

  return (
    <group position={[0, -BASE_HEIGHT / 2, 0]}>
      {/* 1. Base Flutuante Inferior (Subsolo rochoso/terroso estilo diorama) */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[BLOCK_SIZE, BASE_HEIGHT, BLOCK_SIZE]} />
        <meshStandardMaterial
          color="#3A281E"
          roughness={0.9}
          metalness={0.05}
          flatShading={true}
        />
      </mesh>

      {/* Camada intermediária de transição geológica (estrato) */}
      <mesh position={[0, BASE_HEIGHT * 0.35, 0]}>
        <boxGeometry args={[BLOCK_SIZE * 1.01, 0.25, BLOCK_SIZE * 1.01]} />
        <meshStandardMaterial
          color="#52392A"
          roughness={0.85}
          flatShading={true}
        />
      </mesh>

      {/* 2. Camada Superior: Superfície do Bioma */}
      {hasWetlandSplit ? (
        // Pantanal / Áreas Úmidas (50% terra firme, 50% água rasa)
        <group position={[0, BASE_HEIGHT / 2 + TOP_HEIGHT / 2, 0]}>
          {/* Metade Terra Firme */}
          <mesh
            position={[-BLOCK_SIZE / 4, 0, 0]}
            receiveShadow
            onPointerDown={handlePointerDown}
          >
            <boxGeometry args={[BLOCK_SIZE / 2, TOP_HEIGHT, BLOCK_SIZE]} />
            <meshStandardMaterial
              color={surfaceColor || baseColor}
              roughness={0.7}
              flatShading={true}
            />
          </mesh>

          {/* Metade Água Rasa Cristalina */}
          <mesh
            position={[BLOCK_SIZE / 4, -0.08, 0]}
            receiveShadow
            onPointerDown={handlePointerDown}
          >
            <boxGeometry args={[BLOCK_SIZE / 2, TOP_HEIGHT * 0.6, BLOCK_SIZE]} />
            <meshStandardMaterial
              color={waterColor}
              transparent={true}
              opacity={0.88}
              roughness={0.15}
              metalness={0.2}
              flatShading={true}
            />
          </mesh>

          {/* Ilhotas na água */}
          <mesh position={[1.4, 0.02, -0.8]} onPointerDown={handlePointerDown}>
            <cylinderGeometry args={[0.45, 0.55, 0.15, 6]} />
            <meshStandardMaterial color={baseColor} roughness={0.8} />
          </mesh>
          <mesh position={[1.8, 0.02, 1.2]} onPointerDown={handlePointerDown}>
            <cylinderGeometry args={[0.35, 0.45, 0.15, 5]} />
            <meshStandardMaterial color={baseColor} roughness={0.8} />
          </mesh>
        </group>
      ) : hasRiver ? (
        // Biomas com Rio (ex: Florestas Tropicais / Amazônia)
        <group position={[0, BASE_HEIGHT / 2 + TOP_HEIGHT / 2, 0]}>
          {/* Margem Esquerda */}
          <mesh
            position={[-1.7, 0, 0]}
            receiveShadow
            onPointerDown={handlePointerDown}
          >
            <boxGeometry args={[2.2, TOP_HEIGHT, BLOCK_SIZE]} />
            <meshStandardMaterial
              color={surfaceColor || baseColor}
              roughness={0.7}
              flatShading={true}
            />
          </mesh>

          {/* Leito do Rio (rebaixado com água cintilante) */}
          <mesh
            position={[0, -0.09, 0]}
            receiveShadow
            onPointerDown={handlePointerDown}
          >
            <boxGeometry args={[1.2, TOP_HEIGHT * 0.55, BLOCK_SIZE]} />
            <meshStandardMaterial
              color={waterColor}
              transparent={true}
              opacity={0.9}
              roughness={0.1}
              metalness={0.2}
              flatShading={true}
            />
          </mesh>

          {/* Margem Direita */}
          <mesh
            position={[1.7, 0, 0]}
            receiveShadow
            onPointerDown={handlePointerDown}
          >
            <boxGeometry args={[2.2, TOP_HEIGHT, BLOCK_SIZE]} />
            <meshStandardMaterial
              color={surfaceColor || baseColor}
              roughness={0.7}
              flatShading={true}
            />
          </mesh>

          {/* Pedrinhas na margem do rio */}
          <mesh position={[-0.6, 0.02, -1.2]}>
            <dodecahedronGeometry args={[0.12]} />
            <meshStandardMaterial color="#8D99AE" roughness={0.9} />
          </mesh>
          <mesh position={[0.62, 0.02, 0.8]}>
            <dodecahedronGeometry args={[0.15]} />
            <meshStandardMaterial color="#8D99AE" roughness={0.9} />
          </mesh>
        </group>
      ) : hasDunes ? (
        // Deserto com Ondulações Suaves de Dunas Low-Poly
        <group position={[0, BASE_HEIGHT / 2 + TOP_HEIGHT / 2, 0]}>
          <mesh
            position={[0, 0, 0]}
            receiveShadow
            onPointerDown={handlePointerDown}
          >
            <boxGeometry args={[BLOCK_SIZE, TOP_HEIGHT, BLOCK_SIZE]} />
            <meshStandardMaterial
              color={baseColor}
              roughness={0.9}
              flatShading={true}
            />
          </mesh>
          {/* Crista da duna 1 */}
          <mesh position={[-0.8, 0.15, -0.6]} rotation={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.4, 1.2, 0.3, 5]} />
            <meshStandardMaterial color={surfaceColor} roughness={0.9} flatShading={true} />
          </mesh>
          {/* Crista da duna 2 */}
          <mesh position={[1.1, 0.12, 1.0]} rotation={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.3, 0.9, 0.25, 5]} />
            <meshStandardMaterial color={surfaceColor} roughness={0.9} flatShading={true} />
          </mesh>
        </group>
      ) : hasIcePond ? (
        // Tundra com Neve e Lago de Gelo
        <group position={[0, BASE_HEIGHT / 2 + TOP_HEIGHT / 2, 0]}>
          <mesh
            position={[0, 0, 0]}
            receiveShadow
            onPointerDown={handlePointerDown}
          >
            <boxGeometry args={[BLOCK_SIZE, TOP_HEIGHT, BLOCK_SIZE]} />
            <meshStandardMaterial
              color={surfaceColor || '#FFFFFF'}
              roughness={0.5}
              metalness={0.1}
              flatShading={true}
            />
          </mesh>
          {/* Lago de Gelo Cristalino Azul */}
          <mesh position={[0.6, 0.02, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.9, 7]} />
            <meshStandardMaterial
              color={waterColor || '#E0FAFF'}
              roughness={0.05}
              metalness={0.3}
              transparent={true}
              opacity={0.92}
            />
          </mesh>
        </group>
      ) : (
        // Padrão Geral (Savanas, Campos, Florestas Temperadas, Taiga, Mediterrâneo)
        <group position={[0, BASE_HEIGHT / 2 + TOP_HEIGHT / 2, 0]}>
          <mesh
            position={[0, 0, 0]}
            receiveShadow
            onPointerDown={handlePointerDown}
          >
            <boxGeometry args={[BLOCK_SIZE, TOP_HEIGHT, BLOCK_SIZE]} />
            <meshStandardMaterial
              color={surfaceColor || baseColor}
              roughness={0.75}
              flatShading={true}
            />
          </mesh>

          {/* Detalhes de elevação suave em relevo voxel */}
          <mesh position={[-1.6, 0.1, -1.5]} onPointerDown={handlePointerDown}>
            <boxGeometry args={[1.4, 0.2, 1.4]} />
            <meshStandardMaterial color={baseColor} roughness={0.8} flatShading={true} />
          </mesh>
          <mesh position={[1.5, 0.08, 1.3]} onPointerDown={handlePointerDown}>
            <boxGeometry args={[1.2, 0.16, 1.2]} />
            <meshStandardMaterial color={baseColor} roughness={0.8} flatShading={true} />
          </mesh>
        </group>
      )}

      {/* 3. Indicador Visual de Ponto Selecionado pelo Raycaster (Reticula 3D) */}
      {(selectedCoord || hoveredCoord) && (
        <group
          position={[
            (selectedCoord || hoveredCoord)[0],
            BASE_HEIGHT / 2 + TOP_HEIGHT + 0.05,
            (selectedCoord || hoveredCoord)[2],
          ]}
        >
          {/* Anel de seleção suave */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.22, 0.3, 16]} />
            <meshBasicMaterial color="#FFD166" side={THREE.DoubleSide} />
          </mesh>
          {/* Ponto central */}
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#EF476F" />
          </mesh>
        </group>
      )}
    </group>
  );
}
