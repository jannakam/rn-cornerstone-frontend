import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { Text3D, Center, Float } from '@react-three/drei/native';
import { useTheme } from 'tamagui';

const FloatingText = ({ text, position, color, size = 1 }) => {
  const meshRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (meshRef.current) {
      // Position text at eye level
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);

  useFrame((state) => {
    if (meshRef.current) {
      // Make text always face the camera
      meshRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0}
      floatIntensity={2}
      floatingRange={[-0.1, 0.1]}
    >
      <Center>
        <Text3D
          ref={meshRef}
          font="/fonts/helvetiker_regular.typeface.json"
          size={size}
          height={0.2}
          position={position}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          {text}
          <meshStandardMaterial color={color} />
        </Text3D>
      </Center>
    </Float>
  );
};

const AROverlay = ({ checkpoint }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Checkpoint Name */}
        <FloatingText
          text={checkpoint.name}
          position={[0, 2, 0]}
          color={theme.magenta7.val}
          size={0.5}
        />

        {/* Points */}
        <FloatingText
          text={`${checkpoint.points} points`}
          position={[0, 1, 0]}
          color={theme.cyan8.val}
          size={0.3}
        />

        {/* Steps */}
        <FloatingText
          text={`${checkpoint.steps} steps`}
          position={[0, 0, 0]}
          color={theme.lime7.val}
          size={0.3}
        />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'transparent',
  },
});

export default AROverlay; 