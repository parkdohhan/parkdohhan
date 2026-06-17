'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  useGLTF,
  useAnimations,
  AdaptiveDpr,
  PerformanceMonitor,
} from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

const MODEL = '/models/ybot.glb';
useGLTF.preload(MODEL);

const TARGET_HEIGHT = 1.7; // m

// ── 무대 축(스테이지) ───────────────────────────────────────
// 플레이어(카메라)는 방의 뒷-왼쪽 모서리 근처에 서서 앞-오른쪽 모서리를
// 바라본다. s = 시선축 거리(+가 플레이어에서 멀어지는 쪽), t = 좌우.
const UP = new THREE.Vector3(0, 1, 0);
const AXIS = new THREE.Vector3(1, 0, 1).normalize(); // 플레이어 시선 방향
const SIDE = new THREE.Vector3().crossVectors(AXIS, UP).normalize();
const STAGE = new THREE.Vector3(0, 0, 0); // 무대 기준점(자아 군집 중심)

// 무대 기준점에서 시선축 s, 좌우 t 만큼 떨어진 바닥 좌표
function at(s: number, t: number): [number, number, number] {
  const p = STAGE.clone().addScaledVector(AXIS, s).addScaledVector(SIDE, t);
  return [p.x, 0, p.z];
}

// 플레이어는 자아 군집 뒤(모서리 쪽)에 선다 = 예전 비평가 자리.
const PLAYER_S = -2.5;
const CAMERA_POS: [number, number, number] = [
  at(PLAYER_S, 0)[0],
  1.6,
  at(PLAYER_S, 0)[2],
];
// 마네킹들이 바라보는 지점 = 플레이어 발밑 (yaw 계산에만 사용)
const FACE: [number, number] = [CAMERA_POS[0], CAMERA_POS[2]];

// 1인칭 초기 시선: 앞-오른쪽 모서리(+AXIS) = 세 자아를 마주 본다. 뒤돌면 비평가.
const LOOK_YAW0 = Math.PI / 4;
const LOOK_PITCH0 = -0.08;

// 세 자아: 플레이어 바로 앞(+AXIS)에 완만한 호로 서서 플레이어를 마주 본다.
// 비평가: 정반대편(−AXIS, 플레이어 등 뒤) 모서리에 홀로 서서 플레이어를 본다.
//   → 정면을 보면 세 자아만, 뒤돌아야 비평가만 보인다(한 화면에 같이 안 잡힘).
const SELVES = [
  { key: 'novelist',    label: '소설가',     pos: at(0.2, -1.1),  seed: 0.0, critic: false, confront: true },
  { key: 'film',        label: '영화',       pos: at(-0.2, 0.0),  seed: 0.4, critic: false, confront: true },
  { key: 'interactive', label: '인터랙티브', pos: at(0.2,  1.1),  seed: 0.8, critic: false, confront: true },
  { key: 'critic',      label: '비평가',     pos: at(-6.9, 0.0),  seed: 0.6, critic: true,  confront: true },
];

function Mannequin({
  pos,
  face,
  seed = 0,
  critic = false,
  confront = false,
}: {
  pos: [number, number, number];
  face: [number, number];
  seed?: number;
  critic?: boolean;
  confront?: boolean;
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
      action.time = seed * (action.getClip().duration || 1);
      action.setEffectiveTimeScale(0.9);
      action.play();
    }
  }, [actions, seed]);

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

  // 모델 기본 정면축은 +Z. dir = face - pos (= 플레이어 발밑 방향).
  // confront=false: 플레이어를 등지고 정면 모서리를 향함(세 자아).
  // confront=true : 모서리에 서서 플레이어/자아군을 마주 봄(비평가).
  const dx = face[0] - pos[0];
  const dz = face[1] - pos[2];
  const rotY = confront ? Math.atan2(dx, dz) : Math.atan2(-dx, -dz);

  return <primitive object={cloned} position={pos} rotation={[0, rotY, 0]} />;
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

// 1인칭 시점: 카메라 위치는 초기 좌표에 고정, 드래그로 제자리에서 시점만 회전.
function LookControls() {
  const { camera, gl } = useThree();
  const st = useRef({
    dragging: false,
    px: 0,
    py: 0,
    yaw: LOOK_YAW0,
    pitch: LOOK_PITCH0,
  });

  useEffect(() => {
    const dom = gl.domElement;
    const down = (e: PointerEvent) => {
      st.current.dragging = true;
      st.current.px = e.clientX;
      st.current.py = e.clientY;
    };
    const up = () => {
      st.current.dragging = false;
    };
    const move = (e: PointerEvent) => {
      if (!st.current.dragging) return;
      const dx = e.clientX - st.current.px;
      const dy = e.clientY - st.current.py;
      st.current.px = e.clientX;
      st.current.py = e.clientY;
      st.current.yaw -= dx * 0.003;
      // 위아래는 과회전 방지로 클램프 (좌우는 360° 자유)
      st.current.pitch = Math.max(
        -1.2,
        Math.min(0.9, st.current.pitch - dy * 0.003),
      );
    };
    dom.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointermove', move);
    return () => {
      dom.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointermove', move);
    };
  }, [gl]);

  useFrame(() => {
    const { yaw, pitch } = st.current;
    // 몸(위치)은 고정, 시선만 회전
    camera.position.set(CAMERA_POS[0], CAMERA_POS[1], CAMERA_POS[2]);
    const cp = Math.cos(pitch);
    camera.lookAt(
      CAMERA_POS[0] + Math.sin(yaw) * cp,
      CAMERA_POS[1] + Math.sin(pitch),
      CAMERA_POS[2] + Math.cos(yaw) * cp,
    );
  });

  return null;
}

export default function QuarrelScene() {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#ecebe6',
        touchAction: 'none',
      }}
    >
      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: CAMERA_POS, fov: 42, near: 0.1, far: 100 }}
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
            <Mannequin
              key={s.key}
              pos={s.pos}
              face={FACE}
              seed={s.seed}
              critic={s.critic}
              confront={s.confront}
            />
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

        <LookControls />
      </Canvas>
    </div>
  );
}
