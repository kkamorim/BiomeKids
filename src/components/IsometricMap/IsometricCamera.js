import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';

/**
 * IsometricCamera.jsx
 * Configura uma câmera ortográfica (sem ponto de fuga/perspectiva),
 * posicionada estrategicamente em [10, 10, 10] e orientada para [0, 0, 0].
 * Isso produz o ângulo isométrico axonométrico clássico onde os eixos X, Y e Z
 * formam exatamente 120° entre si na projeção 2D.
 */
export default function IsometricCamera({ zoom = 48 }) {
  const cameraRef = useRef();
  const { size } = useThree();

  // Ajusta dinamicamente a distância focal / zoom conforme a largura de tela mobile
  const responsiveZoom = Math.min(size.width, size.height) > 600 ? zoom * 1.3 : zoom;

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, 0, 0);
      cameraRef.current.updateProjectionMatrix();
    }
  }, [responsiveZoom]);

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      position={[10, 10, 10]}
      zoom={responsiveZoom}
      near={-50}
      far={100}
      onUpdate={(self) => self.lookAt(0, 0, 0)}
    />
  );
}
