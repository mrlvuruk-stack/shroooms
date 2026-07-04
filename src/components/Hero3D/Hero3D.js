import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./Hero3D.css";

// ── CUSTOM ERROR BOUNDARY FOR WEBGL CRASHES ──
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("WebGL 3D Context Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Silent fallback, parents render fallback image
    }
    return this.props.children;
  }
}

// ── PROCEDURAL MUSHROOM SCENE COMPONENT ──
const MushroomScene = ({ onFirstFrameRendered }) => {
  const groupRef = useRef();
  const capRef = useRef();
  const stemRef = useRef();
  const frameCount = useRef(0);

  // Spores floating animation
  const sporesRef = useRef();
  const sporeCount = 24;
  const positions = useRef(
    new Float32Array(
      Array.from({ length: sporeCount * 3 }, () => (Math.random() - 0.5) * 4)
    )
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    // Trigger scene-ready callback on 2nd frame of actual GPU rendering
    if (frameCount.current < 2) {
      frameCount.current++;
      if (frameCount.current === 2 && onFirstFrameRendered) {
        onFirstFrameRendered();
      }
    }

    const time = state.clock.getElapsedTime();

    // Slow idle hover
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.12;

    // Pointer Parallax (Interpolation using lerp for smooth motion)
    const pointer = state.pointer || state.mouse || { x: 0, y: 0 };
    const targetX = pointer.x * 0.25;
    const targetY = pointer.y * 0.15;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetY,
      0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      time * 0.1, // Slow constant rotation
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -targetX,
      0.05
    );

    // Float particles (spores) upward
    if (sporesRef.current) {
      const posAttr = sporesRef.current.geometry.attributes.position;
      for (let i = 0; i < sporeCount; i++) {
        let y = posAttr.getY(i);
        y += 0.006; // upward speed
        if (y > 2) {
          y = -2; // Reset at bottom
        }
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── MUSHROOM CAP ── */}
      <mesh ref={capRef} position={[0, 0.4, 0]}>
        <sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#a28a5c"
          roughness={0.6}
          metalness={0.1}
          flatShading={false}
        />
      </mesh>

      {/* ── GILLS (UNDER CAP) ── */}
      <mesh position={[0, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.18, 1.18, 0.05, 32]} />
        <meshStandardMaterial color="#8c7a6b" roughness={0.8} />
      </mesh>

      {/* ── STEM ── */}
      <mesh ref={stemRef} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.22, 0.35, 1.6, 32]} />
        <meshStandardMaterial color="#e6dfd1" roughness={0.5} />
      </mesh>

      {/* ── FLOATING SPORES (PARTICLES) ── */}
      <points ref={sporesRef}>
        <bufferGeometry>
          <bufferAttribute
            attachObject={["attributes", "position"]}
            args={[positions.current, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#a28a5c"
          size={0.06}
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

// ── MAIN CANVAS COMPONENT ──
const Hero3D = ({ onReady }) => {
  const [loaded, setLoaded] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  // Handle Tab visibility status change (GPU performance saver)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleFirstFrame = () => {
    setLoaded(true);
    if (onReady) onReady();
  };

  return (
    <div
      className={`hero-canvas-container ${loaded ? "fade-in" : ""}`}
      role="img"
      aria-hidden="true"
    >
      <WebGLErrorBoundary>
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 3.8], fov: 45 }}
          frameloop={tabVisible ? "always" : "never"}
        >
          {/* Lights */}
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 8, 5]} intensity={0.7} />
          <pointLight position={[-4, -3, -2]} intensity={0.2} color="#faf8f5" />

          {/* Mushroom */}
          <MushroomScene onFirstFrameRendered={handleFirstFrame} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};

export default Hero3D;
