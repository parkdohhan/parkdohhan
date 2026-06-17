'use client';

import { Canvas } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  OrbitControls,
  useGLTF,
  useAnimations,
  AdaptiveDpr,
  PerformanceMonitor,
} from '@react-three/drei';
import { Suspense, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

const MODEL = '/models/ybot.glb';
useGLTF.preload(MODEL);

// 4중 자아 — 흰 방 안에 원형 배치, 중심을 바라본다.
// angle: 0 = 정면, 180 = 비평가(정반대, 처음엔 카메라 뒤).
const SELVES = [
  { key: 'novelist', label: '소설가', angle: -50 },
  { key: 'film', label: '영화', angle: 0 },
  { key: 'interactive', label: '인터랙티브', angle: 50 },
  { key: 'critic', label: '비평가', angle: 180 },
];

const TARGET_HEIGHT = 1.7; // m

function Mannequin({
  angle,
  radius = 2.3,
  critic = false,
}: {
  angle: number;
  radius?: number;
  critic?: boolean;
}) {
  const { scene, animations } = useGLTF(MODEL);
  // SkeletonUtils.clone: 스킨드 메시·스켈레톤을 안전하게 복제 (4개 독립 인스턴스)
  const cloned = useMemo(() => SkeletonUtils.clone(scene) as THREE.Group, [scene]);
  const { actions } = useAnimations(animations, cloned);

  // idle 애니메이션 재생 (개체마다 시작 시점을 흩어 동기화를 깸)
  useEffect(() => {
    const action = Object.values(actions)[0];
    if (action) {
      action.reset();
      action.time = (angle + 180) * 0.01 * (action.getClip().duration || 1);
      action.setEffectiveTimeScale(0.9);
      action.play();
    }
  }, [actions, angle]);

  // 키 정규화(1.7m) + 그림자 + 비평가는 검은 톤
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const h = box.getSize(new THREE.Vector3()).y;
    if (h > 0) cloned.scale.setScalar(TARGET_HEIGHT / h);

    cloned.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = false;
        mesh.frustumCulled = false;
        if (critic) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.color = new THREE.Color('#0e0e0e');
          mat.roughness = 0.6;
          mesh.material = mat;
        }
      }
    });
  }, [cloned, critic]);

  const rad = (angle * Math.PI) / 180;
  const x = Math.sin(rad) * radius;
  const z = -Math.cos(rad) * radius;

  return (
    <primitive
      object={cloned}
      position={[x, 0, z]}
      // 중심(카메라)을 바라보도록 회전
      rotation={[0, rad + Math.PI, 0]}
    />
  );
}

function Room() {
  const wall = '#ecebe6';
  const floor = '#e6e4de';
  return (
    <group>
      {/* 바닥 — 약한 반사로 실사감 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color={floor} roughness={0.72} metalness={0} />
      </mesh>
      {/* 천장 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.2, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color={wall} roughness={1} metalness={0} />
      </mesh>
      {/* 뒷벽 */}
      <mesh position={[0, 2.1, -5.5]} receiveShadow>
        <planeGeometry args={[16, 8.4]} />
        <meshStandardMaterial color={wall} roughness={1} metalness={0} />
      </mesh>
      {/* 앞벽(카메라 뒤) */}
      <mesh position={[0, 2.1, 5.5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[16, 8.4]} />
        <meshStandardMaterial color={wall} roughness={1} metalness={0} />
      </mesh>
      {/* 좌벽 */}
      <mesh position={[-5.5, 2.1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[16, 8.4]} />
        <meshStandardMaterial color={wall} roughness={1} metalness={0} />
      </mesh>
      {/* 우벽 */}
      <mesh position={[5.5, 2.1, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[16, 8.4]} />
        <meshStandardMaterial color={wall} roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

export default function QuarrelScene() {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#ecebe6' }}>
      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [0, 1.5, 4.2], fov: 42, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <color attach="background" args={['#ecebe6']} />

        {/* 모바일 성능: 프레임 떨어지면 dpr 자동 하향 */}
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.5)}
        />
        <AdaptiveDpr pixelated />

        <Suspense fallback={null}>
          {/* HDRI 환경광 — 반사·앰비언트의 사실감 (배경엔 안 깔고 흰 벽 유지) */}
          <Environment files="/hdri/studio.hdr" />
          <Room />
          {SELVES.map((s) => (
            <Mannequin key={s.key} angle={s.angle} critic={s.key === 'critic'} />
          ))}
          {/* 발밑 접지 그림자 — 실사감의 핵심, shadowMap보다 저렴 */}
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.55}
            scale={14}
            blur={2.6}
            far={4.5}
            resolution={1024}
            color="#000000"
          />
        </Suspense>

        {/* 키 라이트 — 부드러운 단일 그림자 (모바일 부담 최소) */}
        <ambientLight intensity={0.35} />
        <directionalLight
          castShadow
          position={[4.5, 7, 3.5]}
          intensity={2.4}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={22}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-7}
          shadow-bias={-0.0004}
        />

        <OrbitControls
          target={[0, 1.15, 0]}
          enablePan={false}
          minDistance={2}
          maxDistance={7}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
    </div>
  );
}
