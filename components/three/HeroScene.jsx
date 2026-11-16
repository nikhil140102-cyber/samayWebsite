"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, PerformanceMonitor, Sparkles, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ---------- Procedural vintage microphone ---------- */
function Microphone({ dark }) {
  const grill = useRef();
  const metal = useMemo(
    () => new THREE.MeshStandardMaterial({ color: dark ? "#d9d9de" : "#2a2a2e", metalness: 1, roughness: 0.22 }),
    [dark]
  );
  const body = useMemo(
    () => new THREE.MeshStandardMaterial({ color: dark ? "#141416" : "#0d0d0f", metalness: 0.75, roughness: 0.35 }),
    [dark]
  );
  const red = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ff2e3f", emissive: "#ff1a2c", emissiveIntensity: 1.6, metalness: 0.4, roughness: 0.3 }),
    []
  );

  // Tapered handle via lathe for a smooth profile
  const handleGeo = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      pts.push(new THREE.Vector2(0.17 + 0.13 * Math.pow(1 - t, 1.6), -t * 1.9));
    }
    pts.push(new THREE.Vector2(0, -1.9));
    pts.unshift(new THREE.Vector2(0, 0));
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  useFrame((_, dt) => {
    if (grill.current) grill.current.rotation.y += dt * 0.15;
  });

  return (
    <group>
      {/* head */}
      <mesh position={[0, 0.62, 0]} material={body}>
        <sphereGeometry args={[0.5, 64, 64]} />
      </mesh>
      <mesh ref={grill} position={[0, 0.62, 0]}>
        <icosahedronGeometry args={[0.53, 5]} />
        <meshStandardMaterial attach="material" color={dark ? "#e6e6ea" : "#3a3a40"} metalness={1} roughness={0.25} wireframe />
      </mesh>
      {/* red band */}
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={red}>
        <torusGeometry args={[0.37, 0.045, 24, 96]} />
      </mesh>
      <mesh position={[0, 0.22, 0]} material={metal}>
        <cylinderGeometry args={[0.36, 0.3, 0.16, 64]} />
      </mesh>
      {/* handle */}
      <mesh position={[0, 0.14, 0]} geometry={handleGeo} material={body} />
      {/* end cap */}
      <mesh position={[0, -1.78, 0]} material={metal}>
        <cylinderGeometry args={[0.18, 0.16, 0.14, 48]} />
      </mesh>
      <mesh position={[0, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]} material={metal}>
        <torusGeometry args={[0.285, 0.018, 16, 80]} />
      </mesh>
    </group>
  );
}

/* ---------- Chess pawn (lathe) ---------- */
function Pawn({ color = "#ff2e3f", ...props }) {
  const geo = useMemo(() => {
    const p = [
      [0, 0], [0.42, 0], [0.42, 0.08], [0.36, 0.12], [0.3, 0.2], [0.22, 0.28], [0.16, 0.5],
      [0.13, 0.72], [0.24, 0.78], [0.24, 0.84], [0.12, 0.88], [0.19, 0.98], [0.2, 1.08],
      [0.16, 1.18], [0.08, 1.24], [0, 1.26],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(p, 48);
  }, []);
  return (
    <mesh geometry={geo} {...props}>
      <meshStandardMaterial color={color} metalness={0.6} roughness={0.25} />
    </mesh>
  );
}

/* ---------- Rig: mouse parallax + scroll transform ---------- */
function Rig({ children, reduced }) {
  const group = useRef();
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const scroll = Math.min(1.4, window.scrollY / window.innerHeight);
    const k = 1 - Math.pow(0.001, dt); // frame-rate independent damping
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, target.current.x * 0.45 + scroll * 1.6, k);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, target.current.y * 0.18 + scroll * 0.35, k);
    g.position.y = THREE.MathUtils.lerp(g.position.y, scroll * 1.6, k);
    const s = 1 - scroll * 0.25;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, s, k));
    // gentle camera drift
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, target.current.x * 0.35, k * 0.5);
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={group}>{children}</group>;
}

export default function HeroScene({ dark = true, compact = false }) {
  const wrap = useRef(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.5);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only API, read after hydration to avoid SSR mismatch
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  const speed = reduced ? 0 : 1;

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, dpr]}
        camera={{ position: [0, 0, 6.2], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
        <ambientLight intensity={dark ? 0.25 : 0.7} />
        <spotLight position={[3, 6, 4]} angle={0.4} penumbra={1} intensity={dark ? 60 : 35} color="#ffffff" />
        <pointLight position={[-3, -1, 2]} intensity={dark ? 30 : 12} color="#ff2e3f" />
        <pointLight position={[2.5, 1, -2]} intensity={dark ? 18 : 6} color="#ff6b6b" />

        <Rig reduced={reduced}>
          <Float speed={1.4 * speed} rotationIntensity={0.35} floatIntensity={0.8}>
            <group position={compact ? [0.75, -0.55, -0.5] : [0.55, 0.3, 0]} rotation={[0.12, 0, -0.32]} scale={compact ? 0.62 : 0.95}>
              <Microphone dark={dark} />
            </group>
          </Float>
          {!compact && (
            <>
              <Float speed={2 * speed} rotationIntensity={1.2} floatIntensity={1.4}>
                <Pawn position={[-0.35, -1.75, -0.8]} rotation={[0.4, 0, 0.5]} scale={0.45} />
              </Float>
              <Float speed={1.6 * speed} rotationIntensity={1} floatIntensity={1.2}>
                <Pawn color={dark ? "#e8e8ec" : "#1a1a1d"} position={[2.6, -1.0, -1.4]} rotation={[-0.3, 0, -0.6]} scale={0.42} />
              </Float>
            </>
          )}
          <Sparkles
            count={compact ? 40 : 110}
            scale={[9, 6, 4]}
            size={2.2}
            speed={0.35 * speed}
            color={dark ? "#ff5a66" : "#e11d2e"}
            opacity={0.8}
          />
        </Rig>

        <ContactShadows position={[0, -2.2, 0]} opacity={dark ? 0.6 : 0.3} scale={10} blur={2.6} far={4} />
        {/* Studio reflections built in-scene — no HDR file download needed */}
        <Environment resolution={256}>
          <Lightformer intensity={2} position={[0, 4, 3]} scale={[8, 1, 1]} />
          <Lightformer intensity={1.2} position={[-4, 1, -2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
          <Lightformer intensity={3} color="#ff2e3f" position={[4, 0, 1]} rotation-y={-Math.PI / 2} scale={[3, 3, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
