import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * PlacedEntity.jsx
 * Componente polimórfico para Fauna (Animais), Flora (Árvores/Plantas)
 * e Estruturas construídas pelo jogador.
 *
 * Funcionalidades principais:
 * 1. Animação de pulo (escala de 1 para 1.25 e volta) ao ser clicado.
 * 2. Animação idle suave (flutuação/respiração orgânica via useFrame).
 * 3. Disparo de callback onEntityPress para abrir o Menu Radial 2D de Cuidados.
 * 4. Modelos procedurais Low-Poly embutidos para animais e árvores.
 */
export default function PlacedEntity({
  entity,
  onPress,
}) {
  const meshGroupRef = useRef();
  const [isJumping, setIsJumping] = useState(false);
  const jumpProgress = useRef(0);
  const randomOffset = useRef(Math.random() * 10);

  const {
    id,
    type = 'animal',
    name = 'Espécie',
    modelType = 'jaguar',
    position = [0, 0.5, 0],
    scale = 1,
  } = entity;

  // Intercepta o clique para disparar o pulo e acionar a UI 2D
  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsJumping(true);
    jumpProgress.current = 0;
    if (onPress) {
      onPress(entity);
    }
  };

  // Ciclo de Animação a 60 FPS (Loop do Three.js integrado ao React)
  useFrame((state, delta) => {
    if (!meshGroupRef.current) return;

    // 1. Animação de Pulo Ativo (Interação com a Criança)
    if (isJumping) {
      jumpProgress.current += delta * 5; // Duração de aprox. 0.4s
      const p = jumpProgress.current;

      if (p <= Math.PI) {
        // Senoide de 0 a PI: sobe até 1 e desce até 0
        const jumpY = Math.sin(p) * 0.4;
        const scaleFactor = 1 + Math.sin(p) * 0.25; // 1.0 -> 1.25 -> 1.0

        meshGroupRef.current.position.y = position[1] + jumpY;
        meshGroupRef.current.scale.set(
          scale * scaleFactor,
          scale * scaleFactor,
          scale * scaleFactor
        );
      } else {
        // Fim da animação de pulo
        setIsJumping(false);
        meshGroupRef.current.position.y = position[1];
        meshGroupRef.current.scale.set(scale, scale, scale);
      }
    } else if (type === 'animal') {
      // 2. Animação de Respiração / Idle sutil nos animais
      const t = state.clock.getElapsedTime() * 2 + randomOffset.current;
      const breathe = Math.sin(t) * 0.02;
      meshGroupRef.current.position.y = position[1] + breathe;
    }
  });

  return (
    <group
      ref={meshGroupRef}
      position={position}
      scale={[scale, scale, scale]}
      onPointerDown={handlePointerDown}
    >
      {/* Sombra de Contato Falsa (Ambient Occlusion Low-Poly) */}
      <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 12]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.22} />
      </mesh>

      {/* Renderização do Modelo Procedural Low-Poly */}
      <EntityModel type={type} modelType={modelType} name={name} />
    </group>
  );
}

/**
 * Modelos 3D Procedurais Voxel/Low-Poly nativos
 * Leves, esteticamente agradáveis e perfeitos para celular sem lag
 */
function EntityModel({ type, modelType }) {
  // ANIMAIS
  if (type === 'animal') {
    switch (modelType) {
      case 'alligator': // Jacaré-do-Pantanal
        return (
          <group position={[0, -0.2, 0]}>
            {/* Corpo comprido verde */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.45, 0.16, 0.9]} />
              <meshStandardMaterial color="#2D6A4F" roughness={0.7} flatShading />
            </mesh>
            {/* Focinho */}
            <mesh position={[0, -0.02, 0.55]}>
              <boxGeometry args={[0.3, 0.12, 0.4]} />
              <meshStandardMaterial color="#1B4332" roughness={0.7} flatShading />
            </mesh>
            {/* Olhos saltados */}
            <mesh position={[-0.12, 0.12, 0.3]}>
              <sphereGeometry args={[0.06, 6, 6]} />
              <meshStandardMaterial color="#FFD166" />
            </mesh>
            <mesh position={[0.12, 0.12, 0.3]}>
              <sphereGeometry args={[0.06, 6, 6]} />
              <meshStandardMaterial color="#FFD166" />
            </mesh>
            {/* Cauda */}
            <mesh position={[0, 0, -0.6]}>
              <coneGeometry args={[0.18, 0.5, 4]} rotation={[-Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#1B4332" flatShading />
            </mesh>
          </group>
        );

      case 'capybara': // Capivara
        return (
          <group position={[0, -0.15, 0]}>
            {/* Corpo robusto arredondado/voxel */}
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[0.45, 0.4, 0.7]} />
              <meshStandardMaterial color="#8D5B4C" roughness={0.8} flatShading />
            </mesh>
            {/* Cabeça quadrada fofa */}
            <mesh position={[0, 0.22, 0.4]}>
              <boxGeometry args={[0.35, 0.32, 0.35]} />
              <meshStandardMaterial color="#A0695B" roughness={0.8} flatShading />
            </mesh>
            {/* Focinho escuro */}
            <mesh position={[0, 0.12, 0.58]}>
              <boxGeometry args={[0.18, 0.14, 0.1]} />
              <meshStandardMaterial color="#3E2723" flatShading />
            </mesh>
            {/* Orelhas pequeninas */}
            <mesh position={[-0.14, 0.4, 0.3]}>
              <boxGeometry args={[0.06, 0.08, 0.06]} />
              <meshStandardMaterial color="#5D4037" />
            </mesh>
            <mesh position={[0.14, 0.4, 0.3]}>
              <boxGeometry args={[0.06, 0.08, 0.06]} />
              <meshStandardMaterial color="#5D4037" />
            </mesh>
            {/* Patinhas curtas */}
            <mesh position={[-0.18, -0.2, 0.22]}>
              <boxGeometry args={[0.1, 0.18, 0.1]} />
              <meshStandardMaterial color="#5D4037" />
            </mesh>
            <mesh position={[0.18, -0.2, 0.22]}>
              <boxGeometry args={[0.1, 0.18, 0.1]} />
              <meshStandardMaterial color="#5D4037" />
            </mesh>
            <mesh position={[-0.18, -0.2, -0.22]}>
              <boxGeometry args={[0.1, 0.18, 0.1]} />
              <meshStandardMaterial color="#5D4037" />
            </mesh>
            <mesh position={[0.18, -0.2, -0.22]}>
              <boxGeometry args={[0.1, 0.18, 0.1]} />
              <meshStandardMaterial color="#5D4037" />
            </mesh>
          </group>
        );

      case 'jaguar': // Onça-Pintada
      default:
        return (
          <group position={[0, -0.15, 0]}>
            {/* Corpo dourado alaranjado */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.42, 0.35, 0.75]} />
              <meshStandardMaterial color="#F4A261" roughness={0.7} flatShading />
            </mesh>
            {/* Cabeça */}
            <mesh position={[0, 0.26, 0.42]}>
              <boxGeometry args={[0.34, 0.3, 0.3]} />
              <meshStandardMaterial color="#E76F51" roughness={0.7} flatShading />
            </mesh>
            {/* Orelhas */}
            <mesh position={[-0.12, 0.44, 0.35]}>
              <coneGeometry args={[0.07, 0.12, 4]} />
              <meshStandardMaterial color="#264653" />
            </mesh>
            <mesh position={[0.12, 0.44, 0.35]}>
              <coneGeometry args={[0.07, 0.12, 4]} />
              <meshStandardMaterial color="#264653" />
            </mesh>
            {/* Manchas características (Low-Poly rosettes) */}
            <mesh position={[0.22, 0.18, 0]}>
              <boxGeometry args={[0.02, 0.1, 0.12]} />
              <meshStandardMaterial color="#2B1810" />
            </mesh>
            <mesh position={[-0.22, 0.18, 0.1]}>
              <boxGeometry args={[0.02, 0.1, 0.1]} />
              <meshStandardMaterial color="#2B1810" />
            </mesh>
            {/* Cauda curva */}
            <mesh position={[0, 0.2, -0.45]} rotation={[-0.4, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 0.4, 4]} />
              <meshStandardMaterial color="#E76F51" flatShading />
            </mesh>
          </group>
        );
    }
  }

  // FLORA E VEGETAÇÃO
  if (type === 'tree') {
    switch (modelType) {
      case 'pine_tree': // Pinheiro Boreal / Taiga
        return (
          <group position={[0, -0.3, 0]}>
            {/* Tronco marrom */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.1, 0.14, 0.5, 5]} />
              <meshStandardMaterial color="#4A2E18" flatShading />
            </mesh>
            {/* Cone inferior de folhas */}
            <mesh position={[0, 0.6, 0]}>
              <coneGeometry args={[0.7, 0.7, 5]} />
              <meshStandardMaterial color="#2D3A22" flatShading />
            </mesh>
            {/* Cone médio */}
            <mesh position={[0, 0.95, 0]}>
              <coneGeometry args={[0.55, 0.65, 5]} />
              <meshStandardMaterial color="#3A4D2C" flatShading />
            </mesh>
            {/* Cone do topo com neve sutil */}
            <mesh position={[0, 1.25, 0]}>
              <coneGeometry args={[0.35, 0.55, 5]} />
              <meshStandardMaterial color="#E0FAFF" flatShading />
            </mesh>
          </group>
        );

      case 'autumn_tree_orange': // Carvalho Outonal
      case 'autumn_tree_red':
        const foliageColor = modelType === 'autumn_tree_red' ? '#C1121F' : '#F77F00';
        return (
          <group position={[0, -0.3, 0]}>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.12, 0.18, 0.7, 6]} />
              <meshStandardMaterial color="#583119" flatShading />
            </mesh>
            {/* Copa geométrica em blocos sobrepostos */}
            <mesh position={[0, 0.9, 0]}>
              <dodecahedronGeometry args={[0.65]} />
              <meshStandardMaterial color={foliageColor} flatShading />
            </mesh>
          </group>
        );

      case 'baobab': // Baobá da Savana
        return (
          <group position={[0, -0.3, 0]}>
            {/* Tronco muito largo e imponente */}
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.32, 0.45, 1.0, 7]} />
              <meshStandardMaterial color="#7F5539" flatShading />
            </mesh>
            {/* Copa achatada característica de savana */}
            <mesh position={[0, 1.05, 0]}>
              <cylinderGeometry args={[0.85, 0.5, 0.35, 6]} />
              <meshStandardMaterial color="#B08968" flatShading />
            </mesh>
          </group>
        );

      case 'tropical_tree': // Árvore Tropical
      default:
        return (
          <group position={[0, -0.3, 0]}>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.12, 0.16, 0.8, 6]} />
              <meshStandardMaterial color="#5C3D2E" flatShading />
            </mesh>
            {/* Copa volumosa verde-escura */}
            <mesh position={[0, 0.95, 0]}>
              <icosahedronGeometry args={[0.65, 0]} />
              <meshStandardMaterial color="#2D6A4F" flatShading />
            </mesh>
            <mesh position={[0, 1.3, 0]}>
              <icosahedronGeometry args={[0.45, 0]} />
              <meshStandardMaterial color="#40916C" flatShading />
            </mesh>
          </group>
        );
    }
  }

  // PLANTAS E DETALHES
  if (type === 'plant') {
    switch (modelType) {
      case 'cactus': // Cacto do Deserto
        return (
          <group position={[0, -0.2, 0]}>
            {/* Tronco principal do cacto */}
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.2, 0.8, 0.2]} />
              <meshStandardMaterial color="#40916C" flatShading />
            </mesh>
            {/* Braço esquerdo */}
            <mesh position={[-0.2, 0.45, 0]}>
              <boxGeometry args={[0.2, 0.12, 0.14]} />
              <meshStandardMaterial color="#2D6A4F" flatShading />
            </mesh>
            <mesh position={[-0.25, 0.6, 0]}>
              <boxGeometry args={[0.14, 0.35, 0.14]} />
              <meshStandardMaterial color="#2D6A4F" flatShading />
            </mesh>
            {/* Florzinha amarela no topo */}
            <mesh position={[0, 0.85, 0]}>
              <sphereGeometry args={[0.07, 5, 5]} />
              <meshStandardMaterial color="#E9C46A" />
            </mesh>
          </group>
        );

      case 'water_lily': // Vitória-Régia
        return (
          <group position={[0, -0.28, 0]}>
            {/* Folha redonda flutuante */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.38, 0.4, 0.04, 12]} />
              <meshStandardMaterial color="#2D6A4F" flatShading />
            </mesh>
            {/* Flor branca/rosa no centro */}
            <mesh position={[0, 0.06, 0]}>
              <dodecahedronGeometry args={[0.1]} />
              <meshStandardMaterial color="#FFB703" />
            </mesh>
          </group>
        );

      case 'reeds': // Juncos
      default:
        return (
          <group position={[0, -0.2, 0]}>
            <mesh position={[-0.08, 0.25, 0]}>
              <cylinderGeometry args={[0.03, 0.04, 0.6, 4]} />
              <meshStandardMaterial color="#7CB342" flatShading />
            </mesh>
            <mesh position={[0.08, 0.35, 0.05]}>
              <cylinderGeometry args={[0.03, 0.04, 0.8, 4]} />
              <meshStandardMaterial color="#558B2F" flatShading />
            </mesh>
          </group>
        );
    }
  }

  // ESTRUTURAS
  return (
    <group position={[0, -0.2, 0]}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#E76F51" flatShading />
      </mesh>
    </group>
  );
}
