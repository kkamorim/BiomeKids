import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber/native';

/**
 * IsometricCamera.jsx
 * Configura uma câmera ortográfica (sem ponto de fuga/perspectiva),
 * posicionada estrategicamente em [10, 10, 10] e orientada para [0, 0, 0].
 * Isso produz o ângulo isométrico axonométrico clássico onde os eixos X, Y e Z
 * formam exatamente 120° entre si na projeção 2D.
 */
export default function IsometricCamera({ zoom = 46 }) {
  const { camera, size } = useThree();

  // Ajusta dinamicamente a distância focal / zoom conforme a largura de tela mobile
  const responsiveZoom = Math.min(size.width, size.height) > 600 ? zoom * 1.25 : zoom;

  useLayoutEffect(() => {
    camera.position.set(10, 10, 10);
    camera.zoom = responsiveZoom;
    camera.near = 0.1;
    camera.far = 100;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, responsiveZoom]);

  return null;
}
