'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  useGLTF,
  useAnimations,
  AdaptiveDpr,
  PerformanceMonitor,
  Text,
} from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { projects, mediumLabels } from '@/data/projects';
import * as THREE from 'three';
// drei의 GLTFLoader와 '같은' three-stdlib에서 SkeletonUtils를 가져온다.
// three/examples/jsm 경로로 가져오면 프로덕션 빌드에서 three 인스턴스가 갈려
// clone 내부의 instanceof SkinnedMesh가 깨지고 → 스킨 메시(마네킹)가 안 보인다.
import { SkeletonUtils } from 'three-stdlib';

// 흰 자아 모델 — 기존 ybot.glb는 지오메트리 바운딩과 스켈레톤 스케일이 어긋나
// (Armature 0.01 + bbox 6.3배 불일치) 정규화가 깨지므로, 비평가와 동일한
// 파이프라인(FBX2glTF + gltf-transform draco)으로 원본 FBX에서 재변환한 모델을 쓴다.
const MODEL = '/models/ybot-standing.glb';
// ybot.glb는 Draco 압축 → 디코더 필요. CDN(gstatic) 대신 자체 호스팅(/draco/)으로
// 고정해 배포 환경(교차출처/CDN 변수)에서도 안정적으로 로드되게 한다.
const DRACO_PATH = '/draco/';
useGLTF.preload(MODEL, DRACO_PATH);
// 비평가 전용 모델 — Mixamo Sitting Idle (마네킹/Sitting Idle.fbx → GLB 변환·Draco 압축)
const CRITIC_MODEL = '/models/critic-sitting.glb';
useGLTF.preload(CRITIC_MODEL, DRACO_PATH);

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
// word: 안면에 박히는 분류명 (화면 왼쪽=commissions / 가운데=work / 오른쪽=studies)
const SELVES = [
  { key: 'novelist',    label: '소설가',     word: 'commissions', pos: at(0.2, -1.1), seed: 0.0, critic: false, confront: true },
  { key: 'film',        label: '영화',       word: 'work',        pos: at(-0.2, 0.0), seed: 0.4, critic: false, confront: true },
  { key: 'interactive', label: '인터랙티브', word: 'studies',     pos: at(0.2,  1.1), seed: 0.8, critic: false, confront: true },
  { key: 'critic',      label: '비평가',     word: '',            pos: at(-6.9, 0.0), seed: 0.6, critic: true,  confront: true },
];

// 비평가 언락 조건: 세 분류를 모두 '방문'해야 한다(방문 기록은 localStorage에 저장).
const REQUIRED_VISITS = ['commissions', 'work', 'studies'] as const;
const VISIT_KEY = 'quarrel:visited';
const CRITIC_DEST = '/critic'; // 언락 후 이동할 비평가 전용 페이지

function readVisited(): Set<string> {
  try {
    const arr = JSON.parse(localStorage.getItem(VISIT_KEY) || '[]') as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}
function markVisited(word: string) {
  if (!word) return;
  try {
    const s = readVisited();
    s.add(word);
    localStorage.setItem(VISIT_KEY, JSON.stringify([...s]));
  } catch {}
}
function criticUnlocked(): boolean {
  const s = readVisited();
  return REQUIRED_VISITS.every((w) => s.has(w));
}

// 머리 위 분류명 라벨: 마네킹과 같은 방향(플레이어 쪽)을 보며, 살짝 떠서 오르내린다
const WORD_HEIGHT = 2.04; // 머리 위 여백(머리끝 1.7m + 0.34m)
function FloatingWord({
  word,
  pos,
  rotY,
  seed,
  onHover,
  onActivate,
}: {
  word: string;
  pos: [number, number, number];
  rotY: number;
  seed: number;
  onHover?: (v: boolean) => void;
  onActivate?: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (g) {
      // seed로 위상을 흩어 셋이 같은 박자로 출렁이지 않게
      g.position.y =
        WORD_HEIGHT + Math.sin(clock.elapsedTime * 1.1 + seed * 7) * 0.03;
    }
  });
  return (
    <group ref={ref} position={[pos[0], WORD_HEIGHT, pos[2]]}>
      <Text
        rotation={[0, rotY, 0]}
        fontSize={0.09}
        color="#3a3833"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.14}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover?.(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover?.(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 6) return;
          onActivate?.();
        }}
      >
        {word}
      </Text>
    </group>
  );
}

// 터치(모바일) 기기 감지 — 스킨드 메시 GPU 이슈 회피 분기용.
// 데스크톱은 항상 false → 기존 렌더 경로 100% 불변.
// (이 씬은 ssr:false로만 마운트되므로 초기값에서 바로 matchMedia를 읽어도 안전)
function useCoarsePointer(): boolean {
  const [coarse] = useState(
    () =>
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(pointer: coarse)').matches,
  );
  return coarse;
}

function Mannequin({
  pos,
  face,
  word = '',
  seed = 0,
  critic = false,
  confront = false,
  onHover,
  onActivate,
}: {
  pos: [number, number, number];
  face: [number, number];
  word?: string;
  seed?: number;
  critic?: boolean;
  confront?: boolean;
  onHover?: (v: boolean) => void;
  onActivate?: () => void;
}) {
  // 비평가는 앉은 자세(Sitting Idle) 전용 모델을 쓴다
  const { scene, animations } = useGLTF(
    critic ? CRITIC_MODEL : MODEL,
    DRACO_PATH,
  );
  // SkeletonUtils.clone: 스킨드 메시·스켈레톤을 안전하게 복제 (4개 독립 인스턴스)
  // 정규화용 키는 '지오메트리(바인드 포즈) bbox × 노드 행렬'로 잰다.
  // Box3.setFromObject는 SkinnedMesh에서 본 행렬 기반 특수 바운딩을 타는데,
  // 본이 갱신되기 전엔 붕괴된 값(≈0.28m)이 나와 6배 거인 스케일 버그가 생겼다.
  // 지오메트리 bbox는 포즈·마운트·bake 순서와 무관하게 항상 T자 키를 준다.
  const cloned = useMemo(() => {
    const c = SkeletonUtils.clone(scene) as THREE.Group;
    c.updateMatrixWorld(true);
    const box = new THREE.Box3();
    const tmp = new THREE.Box3();
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.geometry) {
        if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
        tmp.copy(m.geometry.boundingBox!).applyMatrix4(m.matrixWorld);
        box.union(tmp);
      }
    });
    c.userData.bindHeight = box.getSize(new THREE.Vector3()).y;
    return c;
  }, [scene]);
  const { actions, mixer } = useAnimations(animations, cloned);

  // 터치 기기에서만 분기 (데스크톱=false → 아래 두 useEffect 모두 기존과 동일 동작)
  const coarse = useCoarsePointer();

  // idle 애니메이션 재생 — 데스크톱만 (모바일은 정적 포즈로 구워서 스키닝 회피)
  useEffect(() => {
    if (coarse) return;
    const action = Object.values(actions)[0];
    if (action) {
      action.reset();
      action.time = seed * (action.getClip().duration || 1);
      action.setEffectiveTimeScale(0.9);
      action.play();
    }
  }, [actions, seed, coarse]);

  // 모바일 전용: 모바일 GPU는 스킨드 메시(뼈 텍스처 스키닝)를 못 그려 마네킹이
  // 안 보인다. → idle 한 포즈를 CPU 스키닝으로 구워(bake) 정적 Mesh로 교체해
  // 스키닝 셰이더를 아예 안 타게 한다. 방(일반 메시)이 보이므로 정적 메시는 반드시 보인다.
  useEffect(() => {
    if (!coarse) return;
    // 자연스러운 자세를 위해 idle 한 프레임을 적용한 뒤 그 포즈로 굽는다
    const action = Object.values(actions)[0];
    if (action) {
      action.reset();
      action.play();
      mixer.setTime(seed * (action.getClip().duration || 1) + 0.01);
    }
    cloned.updateMatrixWorld(true);

    const skinnedMeshes: THREE.SkinnedMesh[] = [];
    cloned.traverse((o) => {
      if ((o as THREE.SkinnedMesh).isSkinnedMesh) {
        skinnedMeshes.push(o as THREE.SkinnedMesh);
      }
    });

    const vtx = new THREE.Vector3();
    for (const sm of skinnedMeshes) {
      sm.skeleton.update();
      const geo = sm.geometry.clone();
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        vtx.fromBufferAttribute(posAttr, i);
        sm.applyBoneTransform(i, vtx); // 로컬 정점 → 스키닝된 위치
        posAttr.setXYZ(i, vtx.x, vtx.y, vtx.z);
      }
      posAttr.needsUpdate = true;
      geo.computeVertexNormals();
      geo.deleteAttribute('skinIndex');
      geo.deleteAttribute('skinWeight');

      const staticMesh = new THREE.Mesh(geo, sm.material);
      staticMesh.name = sm.name;
      staticMesh.castShadow = true;
      staticMesh.frustumCulled = false;
      sm.parent?.add(staticMesh);
      sm.parent?.remove(sm);
    }
    if (action) action.stop();
  }, [cloned, coarse, actions, mixer, seed]);

  // 키 정규화(1.7m) + 그림자 + 비평가는 검은 톤
  useEffect(() => {
    // 클론 직후 재둔 바인드 포즈 키 사용 (bake 이후 bbox는 포즈에 따라 달라짐)
    const h = (cloned.userData.bindHeight as number) || 0;
    if (h > 0) cloned.scale.setScalar(TARGET_HEIGHT / h);

    cloned.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = false;
        mesh.frustumCulled = false;
        // 변환본은 Mixamo 원본 텍스처(살구색)를 갖고 있어 항상 오버라이드한다:
        // 흰 자아 = 밝은 무채색, 비평가 = 무광 검정
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
        mat.map = null;
        mat.color = new THREE.Color(critic ? '#0e0e0e' : '#eaeaea');
        mat.roughness = critic ? 0.6 : 0.4;
        mat.metalness = 0;
        mesh.material = mat;
      }
    });
  }, [cloned, critic]);

  // 모델 기본 정면축은 +Z. dir = face - pos (= 플레이어 발밑 방향).
  // confront=false: 플레이어를 등지고 정면 모서리를 향함(세 자아).
  // confront=true : 모서리에 서서 플레이어/자아군을 마주 봄(비평가).
  const dx = face[0] - pos[0];
  const dz = face[1] - pos[2];
  const rotY = confront ? Math.atan2(dx, dz) : Math.atan2(-dx, -dz);

  return (
    <group>
      <primitive object={cloned} position={pos} rotation={[0, rotY, 0]} />
      {/* 머리 위에 떠 있는 분류명 — 숨 쉬듯 천천히 오르내린다 (라벨도 클릭 가능) */}
      {word && (
        <FloatingWord
          word={word}
          pos={pos}
          rotY={rotY}
          seed={seed}
          onHover={onHover}
          onActivate={onActivate}
        />
      )}
      {/* 상호작용 프록시 — 몸통을 감싸는 가는 캡슐로 hover 영역을 몸에 밀착
          (넓은 박스보다 "딱 마네킹에 닿는" 느낌. 스킨드 메시 직접 레이캐스트보다 안정적) */}
      <mesh
        position={[pos[0], 0.84, pos[2]]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover?.(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover?.(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 6) return; // 드래그(시점 회전)는 클릭으로 치지 않음
          onActivate?.();
        }}
      >
        {/* 반지름을 팔까지 여유 있게 — 클릭이 빗나가지 않도록 */}
        <capsuleGeometry args={[0.34, 1.15, 4, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Room() {
  const wall = '#c3b8a7'; // 빛바랜 회갈색(muted taupe) 벽지
  const floor = '#ddd6c9'; // 벽과 어울리게 살짝 따뜻한 회색 바닥
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

// 1인칭 시점: 카메라 위치 고정, 시선은 커서를 따라 좌우 제한 범위 안에서만 움직인다.
// 좌우 한계를 끈질기게 밀면(EDGE_HOLD) 화면이 잘게 떨리기 시작하고,
// 계속 밀고 있는 동안 떨림을 유지한 채 천천히 갈리듯 돌아 등 뒤(비평가 쪽)로 넘어간다.
// 중간에 놓으면 되돌아간다(절반을 넘겼으면 마저 넘어간다).
const YAW_RANGE = 0.5; // 좌우 시선 가동 범위(rad) — 세 자아가 화면을 벗어나지 않는 폭
const PITCH_RANGE = 0.22;
const EDGE_ZONE = 0.9; // |nx|가 이 이상이면 한계를 미는 중
const EDGE_HOLD = 1.4; // 저항이 무너지기까지 미는 누적 시간(s)
const GRIND_SPEED = Math.PI / 1.8; // 미는 동안의 회전 속도(rad/s) — 반 바퀴에 1.8s
const SHAKE_MAX = 0.014; // 떨림 진폭(rad) — 아주 잔잔하게
const SHAKE_FREQ = 10; // 떨림 주파수(rad/s) — 부드러운 사인 스웨이
const MOVE_GRACE = 0.12; // 이 시간 안에 커서가 움직였으면 '미는 중'으로 간주(s)

// 클릭 포커스: 마네킹 얼굴 정면으로 다가가는 카메라 무빙
const FOCUS_DIST = 1.15; // 얼굴에서 카메라까지 거리(m)
const FOCUS_EYE = 1.52; // 포커스 시 카메라 높이(m)
const FOCUS_FACE_Y = 1.5; // 바라보는 지점(얼굴) 높이(m)
type FocusTarget = { pos: [number, number, number]; rotY: number };
// 프레임마다 재사용하는 임시 벡터 (GC 방지)
const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _fPos = new THREE.Vector3();
const _fLook = new THREE.Vector3();

function LookControls({ focus }: { focus: FocusTarget | null }) {
  const { camera } = useThree();
  const st = useRef({
    nx: 0, // 커서 정규화 좌표 [-1, 1]
    ny: 0,
    base: LOOK_YAW0, // 현재 시선 중심(앞=자아들 / 뒤=비평가)
    yaw: LOOK_YAW0,
    pitch: LOOK_PITCH0,
    pressure: 0, // 한계를 미는 누적 압력
    grind: null as null | { from: number; dir: number }, // 갈리듯 돌아가는 중
    t: 0,
    sinceMove: 999, // 마지막 커서 이동 이후 경과(s) — '미는 중'인지 판별
    f: 0, // 포커스 블렌드 0(자유 시점)→1(얼굴 정면)
    lastFocus: null as FocusTarget | null, // 복귀 무빙 동안 참조할 마지막 타깃
  });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      st.current.nx = (e.clientX / window.innerWidth) * 2 - 1;
      st.current.ny = (e.clientY / window.innerHeight) * 2 - 1;
      st.current.sinceMove = 0; // 방금 커서가 움직임
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useFrame((_, dt) => {
    const s = st.current;
    const d = Math.min(dt, 0.05);
    s.t += d;
    s.sinceMove += d;

    // 포커스 블렌드: 클릭 시 1로, 닫으면 0으로 지수 접근 (다가가는/돌아오는 무빙)
    if (focus) s.lastFocus = focus;
    s.f += ((focus ? 1 : 0) - s.f) * (1 - Math.exp(-3.2 * d));
    if (!focus && s.f < 0.002) s.f = 0;

    let shake = 0;
    const atEdge = Math.abs(s.nx) > EDGE_ZONE;
    // 옵션2: 가장자리를 '실제로 미는 중'(방금 커서가 움직임)일 때만 압력이 쌓인다.
    // 가만히 두면 안 걸린다. (이미 돌파해 갈리는 중이면 위치만으로 유지)
    // 포커스 중에는 한계 공략/시선 추적을 모두 정지한다.
    const pushing = !focus && atEdge && s.sinceMove < MOVE_GRACE;

    if (focus) {
      s.pressure = 0;
    } else if (s.grind) {
      const g = s.grind;
      const to = g.from + g.dir * Math.PI;
      const samePush = atEdge && (s.nx > 0 ? -1 : 1) === g.dir;
      if (samePush) {
        // 미는 동안: 지속적인 떨림을 유지한 채 천천히 갈리듯 돌아간다
        s.base += g.dir * GRIND_SPEED * d;
        shake = SHAKE_MAX;
        if ((to - s.base) * g.dir <= 0) {
          s.base = to; // 반 바퀴 완료 — 등 뒤 도착
          s.grind = null;
          s.pressure = 0;
        }
      } else {
        // 놓으면 가까운 쪽으로 복귀 (절반을 넘겼으면 마저 넘어간다)
        const target = Math.abs(s.base - g.from) > Math.PI / 2 ? to : g.from;
        s.base += (target - s.base) * (1 - Math.exp(-5 * d));
        shake = SHAKE_MAX * 0.4; // 잦아드는 잔떨림
        if (Math.abs(target - s.base) < 0.01) {
          s.base = target;
          s.grind = null;
          s.pressure = 0;
        }
      }
    } else {
      // 가장자리를 누르는 동안 압력이 쌓이고, 떼면 빠르게 식는다
      if (pushing) s.pressure += d;
      else s.pressure = Math.max(0, s.pressure - d * 2);

      const p = Math.min(1, s.pressure / EDGE_HOLD);
      shake = SHAKE_MAX * p * p; // 압력에 비례해 커지는 떨림

      if (s.pressure >= EDGE_HOLD) {
        // 저항이 무너진다 — 이후 미는 동안 계속 돌아간다
        s.grind = { from: s.base, dir: s.nx > 0 ? -1 : 1 };
      }
    }

    // 커서를 따라가는 시선 — base 중심 ±YAW_RANGE 안에서만 (포커스 중엔 동결)
    if (!focus) {
      const targetYaw = s.base - s.nx * YAW_RANGE;
      const targetPitch = LOOK_PITCH0 - s.ny * PITCH_RANGE;
      const l = 1 - Math.exp(-8 * d); // 프레임레이트 무관 감쇠 lerp
      s.yaw += (targetYaw - s.yaw) * l;
      s.pitch += (targetPitch - s.pitch) * l;
    }

    // 잔잔한 흔들림 — 계단형 랜덤 대신 부드러운 사인 스웨이(두 축 다른 주파수).
    const jy = shake * Math.sin(s.t * SHAKE_FREQ);
    const jp = shake * 0.6 * Math.sin(s.t * SHAKE_FREQ * 1.3 + 1.1);

    const yaw = s.yaw + jy;
    const pitch = Math.max(-1.2, Math.min(0.9, s.pitch + jp));
    // 자유 시점 포즈: 몸(위치)은 고정, 떨릴 때만 미세하게 흔들린다
    _pos.set(CAMERA_POS[0], CAMERA_POS[1] + jp * 0.12, CAMERA_POS[2]);
    const cp = Math.cos(pitch);
    _look.set(
      CAMERA_POS[0] + Math.sin(yaw) * cp,
      CAMERA_POS[1] + Math.sin(pitch),
      CAMERA_POS[2] + Math.cos(yaw) * cp,
    );

    // 포커스 포즈: 얼굴 정면 FOCUS_DIST 앞에서 얼굴을 마주 본다 — f로 두 포즈를 섞는다
    const lf = s.lastFocus;
    if (s.f > 0 && lf) {
      const dirX = Math.sin(lf.rotY); // 마네킹이 보는 방향 = 얼굴 앞쪽
      const dirZ = Math.cos(lf.rotY);
      // 넓은 화면: 카메라와 시선을 함께 오른쪽으로 평행이동 → 얼굴이 화면
      // 왼쪽으로 비켜나 오른쪽에 작업물 패널 자리가 생긴다. (모바일은 중앙 유지
      // — 패널이 위, 대화창이 아래로 가므로) 오른쪽 벡터 = (dirZ, 0, -dirX).
      const side = window.innerWidth > 720 ? 0.34 : 0;
      const offX = dirZ * side;
      const offZ = -dirX * side;
      _fPos.set(
        lf.pos[0] + dirX * FOCUS_DIST + offX,
        FOCUS_EYE,
        lf.pos[2] + dirZ * FOCUS_DIST + offZ,
      );
      _fLook.set(lf.pos[0] + offX, FOCUS_FACE_Y, lf.pos[2] + offZ);
      _pos.lerp(_fPos, s.f);
      _look.lerp(_fLook, s.f);
    }

    camera.position.copy(_pos);
    camera.lookAt(_look);
  });

  return null;
}

// ── 자아 페르소나 대화창 ─────────────────────────────
// 인사말·플레이스홀더만 클라이언트에 둔다 (페르소나 본체는 서버 전용)
const CHAT_META: Record<string, { greeting: string; placeholder: string }> = {
  commissions: {
    greeting: '의뢰 쪽을 맡고 있는 자아입니다. 작업 얘기라면 편하게 물어보세요.',
    placeholder: 'commissions에게 물어보기…',
  },
  work: {
    greeting: '…왔네. 뭐부터 물어볼래.',
    placeholder: 'work에게 말 걸기…',
  },
  studies: {
    greeting: '아, 여긴 아직 정리 중인데. 그래도 뭐든 물어봐요.',
    placeholder: 'studies에게 물어보기…',
  },
};

type ChatMsg = { role: 'user' | 'assistant'; content: string };

function PersonaChat({ word }: { word: string }) {
  const meta = CHAT_META[word] ?? CHAT_META.work;
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: 'assistant', content: meta.greeting },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  // 새 메시지마다 로그를 맨 아래로
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const next: ChatMsg[] = [...msgs, { role: 'user', content: text }];
    setMsgs([...next, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);
    try {
      // trailingSlash: true 설정이라 슬래시 필수 (없으면 308 redirect)
      const res = await fetch('/api/quarrel-chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ self: word, messages: next }),
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      // 스트리밍: 토큰이 도착하는 대로 마지막 말풍선에 흘려 넣는다
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs([...next, { role: 'assistant', content: acc }]);
      }
      if (!acc.trim()) throw new Error('empty');
    } catch {
      setMsgs([
        ...next,
        { role: 'assistant', content: '…지금은 말이 안 나오네. 잠시 뒤에 다시.' },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="q-chat-dock" onClick={(e) => e.stopPropagation()}>
      <div className="q-chat-log" ref={logRef}>
        {msgs.map((m, i) => (
          <div
            key={i}
            className={
              'q-bubble ' +
              (m.role === 'assistant' ? 'ai' : 'me') +
              (busy && i === msgs.length - 1 && !m.content ? ' typing' : '')
            }
          >
            {m.content}
          </div>
        ))}
      </div>
      <div className="q-chat-row">
        <input
          className="q-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            // 한글 IME 조합 중 Enter는 무시 (조합 확정 Enter로 이중 전송 방지)
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) send();
          }}
          placeholder={meta.placeholder}
          maxLength={500}
        />
        <button
          className="q-chat-send"
          onClick={send}
          disabled={busy || !input.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
}

// 포커스 시: 얼굴은 왼쪽, 오른쪽에 작업물 패널, 하단에 자아와의 대화창
function WorkPanel({ word, onClose }: { word: string; onClose: () => void }) {
  const list = projects.filter((p) => p.category === word && !p.easterEgg);
  return (
    <div className="q-focus-layer" onClick={onClose}>
      <div className="q-side-panel" onClick={(e) => e.stopPropagation()}>
        <button className="q-panel-close" onClick={onClose} aria-label="close">
          ×
        </button>
        <h2 className="q-panel-word">{word}</h2>
        {list.map((p) => (
          <article className="q-work" key={p.id}>
            <div className="q-work-meta">
              {mediumLabels[p.medium]} · {p.year}
            </div>
            <h3 className="q-work-title">{p.title}</h3>
            {p.video && (
              <video
                className="q-work-media"
                src={p.video}
                controls
                playsInline
                preload="metadata"
              />
            )}
            {!p.video && p.media && (
              <div className="q-work-imgbox">
                <Image
                  src={p.media}
                  alt=""
                  fill
                  sizes="640px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <p className="q-work-desc">{p.description}</p>
            {p.links.length > 0 && (
              <div className="q-work-links">
                {p.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
        {list.length === 0 && <p className="q-work-desc">비어 있음.</p>}
      </div>
      <PersonaChat word={word} />
    </div>
  );
}

export default function QuarrelScene() {
  const [dpr, setDpr] = useState(1.5);
  const [hovering, setHovering] = useState(false); // 흰 자아 호버 → 커서 확대
  const [pressing, setPressing] = useState(false); // 흰 자아 클릭 피드백
  const [shaking, setShaking] = useState(false); // 비평가 클릭 → 커서 흔들림
  const [subtitle, setSubtitle] = useState(''); // 영화 자막
  const [focused, setFocused] = useState<
    null | { word: string; pos: [number, number, number]; rotY: number }
  >(null); // 클릭된 자아 — 얼굴 줌 + 작업물 패널
  const router = useRouter();
  const cursorRef = useRef<HTMLDivElement>(null);
  const criticInvited = useRef(false); // 언락 후 첫 클릭(초대) 여부 — 두 번째 클릭에 입장
  const timers = useRef<{
    shake?: number;
    sub?: number;
    press?: number;
  }>({});

  // 커스텀 커서가 포인터를 따라다니게 (state 리렌더 없이 ref로 직접)
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = cursorRef.current;
      if (el) el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  // 언마운트 시 타이머 정리
  useEffect(
    () => () => {
      window.clearTimeout(timers.current.shake);
      window.clearTimeout(timers.current.sub);
      window.clearTimeout(timers.current.press);
    },
    [],
  );

  // ESC로 포커스 해제 (카메라 복귀 + 패널 닫힘)
  useEffect(() => {
    if (!focused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocused(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focused]);

  // 흰 자아 클릭: 커서 수축 피드백 → 얼굴 정면으로 카메라 접근 + 작업물 패널
  const handleSelf = (self: (typeof SELVES)[number]) => {
    setPressing(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPressing(true)));
    window.clearTimeout(timers.current.press);
    timers.current.press = window.setTimeout(() => setPressing(false), 220);
    setHovering(false);
    markVisited(self.word); // 비평가 언락용 방문 기록
    // 마네킹이 보는 방향(플레이어 쪽) = 얼굴 정면. Mannequin의 rotY와 같은 식.
    const rotY = Math.atan2(FACE[0] - self.pos[0], FACE[1] - self.pos[2]);
    setFocused({ word: self.word, pos: self.pos, rotY });
  };

  // 비평가 클릭: 잠김 = 거부 연출 / 언락 첫 클릭 = 초대 자막 / 두 번째 클릭 = 입장
  // (언락 직후 바로 이동하면 빈 화면 전환이 버그처럼 읽혀서 한 박자 둔다)
  const handleLocked = () => {
    if (criticUnlocked()) {
      if (criticInvited.current) {
        router.push(CRITIC_DEST);
        return;
      }
      criticInvited.current = true;
      setSubtitle('…이제 들어와도 돼');
      window.clearTimeout(timers.current.sub);
      timers.current.sub = window.setTimeout(() => setSubtitle(''), 2800);
      return;
    }
    setSubtitle('아직은 접근 할 수 없어');
    setShaking(false);
    // 더블 rAF로 클래스 제거→재부여 → 연속 클릭에도 애니메이션 재시작
    requestAnimationFrame(() => requestAnimationFrame(() => setShaking(true)));
    window.clearTimeout(timers.current.shake);
    timers.current.shake = window.setTimeout(() => setShaking(false), 520);
    window.clearTimeout(timers.current.sub);
    timers.current.sub = window.setTimeout(() => setSubtitle(''), 2800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#c3b8a7',
        touchAction: 'none',
        cursor: focused ? 'auto' : 'none', // 패널이 열리면 시스템 커서로
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
        <color attach="background" args={['#c3b8a7']} />

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
              word={s.word}
              seed={s.seed}
              critic={s.critic}
              confront={s.confront}
              onHover={s.critic ? undefined : setHovering}
              onActivate={s.critic ? handleLocked : () => handleSelf(s)}
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

        <LookControls
          focus={focused ? { pos: focused.pos, rotY: focused.rotY } : null}
        />
      </Canvas>

      {/* 커스텀 원형 커서 (difference 블렌드) — 패널이 열리면 시스템 커서에 양보 */}
      {!focused && (
        <div ref={cursorRef} className="q-cursor">
          <div
            className={
              'q-ring' +
              (hovering ? ' hover' : '') +
              (pressing ? ' press' : '') +
              (shaking ? ' shake' : '')
            }
          />
        </div>
      )}

      {/* 영화 자막 */}
      <div className={'q-subtitle' + (subtitle ? ' show' : '')}>{subtitle}</div>

      {/* 얼굴 줌 위로 떠오르는 작업물 박스 */}
      {focused && (
        <WorkPanel word={focused.word} onClose={() => setFocused(null)} />
      )}

      <style>{`
        .q-cursor {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 50;
          pointer-events: none;
          will-change: transform;
          display: none; /* 터치 기기에선 숨김(좌상단 잔상 방지) */
        }
        @media (hover: hover) and (pointer: fine) {
          .q-cursor {
            display: block;
          }
        }
        .q-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 26px;
          height: 26px;
          border: 1.5px solid #737373;
          border-radius: 50%;
          background: rgba(115, 115, 115, 0);
          transform: translate(-50%, -50%);
          transition: width 0.18s ease, height 0.18s ease,
            background 0.18s ease, border-color 0.18s ease;
        }
        .q-ring.hover {
          width: 60px;
          height: 60px;
          background: rgba(115, 115, 115, 0.14);
        }
        .q-ring.press {
          width: 18px;
          height: 18px;
          background: rgba(115, 115, 115, 0.3);
        }
        .q-ring.shake {
          border-color: #e23b3b;
          background: rgba(226, 59, 59, 0.2);
          animation: q-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
        @keyframes q-shake {
          0%   { transform: translate(-50%, -50%) rotate(0); }
          15%  { transform: translate(calc(-50% - 4px), -50%) rotate(-5deg); }
          30%  { transform: translate(calc(-50% + 4px), -50%) rotate(5deg); }
          45%  { transform: translate(calc(-50% - 3px), -50%) rotate(-3deg); }
          60%  { transform: translate(calc(-50% + 3px), -50%) rotate(3deg); }
          75%  { transform: translate(calc(-50% - 2px), -50%) rotate(-2deg); }
          100% { transform: translate(-50%, -50%) rotate(0); }
        }
        /* 넷플릭스식 자막 — 검은 반투명 박스 + 맑은 고딕 흰 글자 */
        .q-subtitle {
          position: fixed;
          left: 50%;
          bottom: 9%;
          transform: translateX(-50%) translateY(10px);
          width: fit-content;
          max-width: 84vw;
          padding: 0.2em 0.6em;
          text-align: center;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.72);
          border-radius: 4px;
          font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo',
            'Noto Sans KR', sans-serif;
          font-size: clamp(17px, 2.3vw, 26px);
          font-weight: 500;
          line-height: 1.35;
          letter-spacing: 0.01em;
          opacity: 0;
          pointer-events: none;
          z-index: 60;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .q-subtitle.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        /* ── 포커스 레이어: 우측 작업물 패널 + 하단 대화창 ── */
        .q-focus-layer {
          position: fixed;
          inset: 0;
          z-index: 70;
          cursor: auto;
        }
        @keyframes q-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        /* 카메라가 얼굴에 다가간 뒤(0.4s 지연) 오른쪽에서 미끄러져 들어온다 */
        .q-side-panel {
          position: absolute;
          top: 14px;
          right: 14px;
          bottom: 14px;
          width: min(400px, 44vw);
          overflow-y: auto;
          touch-action: pan-y;
          background: rgba(246, 244, 238, 0.97);
          color: #2b2a27;
          border: 1px solid rgba(43, 42, 39, 0.25);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
          padding: clamp(20px, 2.6vw, 36px);
          animation: q-slide-in 0.55s cubic-bezier(0.22, 0.9, 0.3, 1) 0.4s both;
        }
        @keyframes q-slide-in {
          from { opacity: 0; transform: translateX(26px); }
          to   { opacity: 1; transform: none; }
        }
        /* ── 하단 대화창 (얼굴 아래) ── */
        .q-chat-dock {
          position: absolute;
          left: 14px;
          bottom: 14px;
          width: min(520px, calc(100vw - min(400px, 44vw) - 56px));
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: q-fade-in 0.4s ease 0.6s both;
        }
        .q-chat-log {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 34vh;
          overflow-y: auto;
          padding: 4px;
          touch-action: pan-y;
        }
        .q-bubble {
          max-width: 86%;
          padding: 0.5em 0.8em;
          border-radius: 6px;
          font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo',
            'Noto Sans KR', sans-serif;
          font-size: 14px;
          line-height: 1.55;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .q-bubble.ai {
          align-self: flex-start;
          background: rgba(0, 0, 0, 0.72);
          color: #fff;
        }
        .q-bubble.me {
          align-self: flex-end;
          background: rgba(246, 244, 238, 0.95);
          color: #2b2a27;
          border: 1px solid rgba(43, 42, 39, 0.2);
        }
        .q-bubble.typing::after {
          content: '…';
          animation: q-blink 1s steps(1) infinite;
        }
        @keyframes q-blink {
          50% { opacity: 0.2; }
        }
        .q-chat-row {
          display: flex;
          gap: 8px;
        }
        .q-chat-input {
          flex: 1;
          min-width: 0;
          padding: 0.7em 0.9em;
          border-radius: 6px;
          border: 1px solid rgba(43, 42, 39, 0.35);
          background: rgba(246, 244, 238, 0.96);
          color: #2b2a27;
          font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo',
            'Noto Sans KR', sans-serif;
          font-size: 14px;
          outline: none;
        }
        .q-chat-input:focus {
          border-color: rgba(43, 42, 39, 0.7);
        }
        .q-chat-send {
          padding: 0 18px;
          border: none;
          border-radius: 6px;
          background: #2b2a27;
          color: #f4f2ec;
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .q-chat-send:disabled {
          opacity: 0.45;
          cursor: default;
        }
        /* 모바일: 패널은 위쪽 시트, 대화창은 아래 전체 폭 */
        @media (max-width: 720px) {
          .q-side-panel {
            top: 0;
            left: 0;
            right: 0;
            bottom: auto;
            width: auto;
            max-height: 44vh;
          }
          .q-chat-dock {
            left: 8px;
            right: 8px;
            bottom: 8px;
            width: auto;
          }
          .q-chat-log { max-height: 26vh; }
        }
        .q-panel-close {
          position: sticky;
          top: 0;
          float: right;
          margin: -8px -8px 0 0;
          width: 36px;
          height: 36px;
          border: none;
          background: none;
          color: #6b675e;
          font-size: 26px;
          line-height: 1;
          cursor: pointer;
        }
        .q-panel-close:hover { color: #2b2a27; }
        .q-panel-word {
          font-family: 'Times New Roman', 'Nanum Myeongjo', serif;
          font-size: clamp(22px, 3vw, 30px);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin: 0 0 8px;
        }
        .q-work {
          padding: 28px 0;
          border-top: 1px solid rgba(43, 42, 39, 0.16);
        }
        .q-work:first-of-type { border-top: none; }
        .q-work-meta {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #8a8478;
          margin-bottom: 4px;
        }
        .q-work-title {
          font-family: 'Times New Roman', 'Nanum Myeongjo', serif;
          font-size: clamp(18px, 2.4vw, 24px);
          font-weight: 600;
          margin: 0 0 14px;
        }
        .q-work-media {
          display: block;
          width: 100%;
          background: #111;
          margin-bottom: 14px;
        }
        .q-work-imgbox {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          margin-bottom: 14px;
          background: #d8d3c7;
        }
        .q-work-desc {
          font-size: 14px;
          line-height: 1.75;
          white-space: pre-line;
          color: #46433c;
          margin: 0 0 16px;
        }
        .q-work-links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .q-work-links a {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #2b2a27;
          text-decoration: none;
          border: 1px solid rgba(43, 42, 39, 0.4);
          padding: 7px 14px;
          transition: background 0.18s ease, color 0.18s ease;
        }
        .q-work-links a:hover {
          background: #2b2a27;
          color: #f4f2ec;
        }
      `}</style>
    </div>
  );
}
