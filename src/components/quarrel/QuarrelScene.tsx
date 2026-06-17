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
import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { Nanum_Gothic } from 'next/font/google';
import { AnimatePresence, motion } from 'framer-motion';
import { projects, Project, mediumLabels } from '@/data/projects';

// 나눔고딕 — 빌드타임 셀프호스팅(런타임 외부 요청 0).
// Nanum Gothic은 'latin' subset 파일에 한글 글리프가 포함됨(서브셋 미분리).
const nanumGothic = Nanum_Gothic({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-nanum',
  display: 'swap',
  preload: false, // 자막은 LCP가 아니므로 preload 불필요
});

const MODEL = '/models/ybot.glb';
useGLTF.preload(MODEL);

const TARGET_HEIGHT = 1.7;

// ── 스테이지 ────────────────────────────────────────────────
const UP = new THREE.Vector3(0, 1, 0);
const AXIS = new THREE.Vector3(1, 0, 1).normalize();
const SIDE = new THREE.Vector3().crossVectors(AXIS, UP).normalize();
const STAGE = new THREE.Vector3(0, 0, 0);

function at(s: number, t: number): [number, number, number] {
  const p = STAGE.clone().addScaledVector(AXIS, s).addScaledVector(SIDE, t);
  return [p.x, 0, p.z];
}

const PLAYER_S = -2.5;
const CAMERA_POS: [number, number, number] = [at(PLAYER_S, 0)[0], 1.6, at(PLAYER_S, 0)[2]];
const FACE: [number, number] = [CAMERA_POS[0], CAMERA_POS[2]];
const LOOK_YAW0 = Math.PI / 4;
const LOOK_PITCH0 = -0.08;

// ── 마네킹 정의 ─────────────────────────────────────────────
// Worker: 상업 포폴 (video medium)
// Media:  개인 미디어 (web + engine)
// Writer: 글쓰기 (writing)
// Shadow: 검은 마네킹 — 잠김
//
// 배치: 흰 자아 3명은 플레이어 중심 등거리(R_SELF) 반원 호에 선다 — 셋 다
//   같은 거리라 주인공 쏠림이 없고, 양옆이 플레이어 쪽으로 살짝 감싼다.
//   shadow(비평가)는 정반대편 모서리(뒤돌아야 보임).

type MannequinKey = 'worker' | 'media' | 'writer' | 'shadow';

interface MannequinDef {
  key: MannequinKey;
  label: string;
  sublabel: string;
  pos: [number, number, number];
  seed: number;
  critic: boolean;  // true = 검은 마네킹
  confront: boolean;
  // 패널 열릴 때 첫 대사
  openingLine: string;
  // 호버 시 짧은 힌트
  hoverLine: string;
  // 이 마네킹에 연결된 medium 필터 (projects.ts 기준)
  mediums: Array<'web' | 'video' | 'writing' | 'engine'>;
  // 작품별 TMI 대사 맵 (project id → 대사 배열)
  tmiMap: Record<string, string[]>;
}

const R_SELF = 2.5; // 플레이어 ↔ 흰 자아 등거리 반경
// 플레이어를 중심으로 시선축(+AXIS) 기준 phi°에 선 자아의 바닥 좌표
function ring(phiDeg: number, r = R_SELF): [number, number, number] {
  const phi = (phiDeg * Math.PI) / 180;
  return at(PLAYER_S + r * Math.cos(phi), r * Math.sin(phi));
}

const SELVES: MannequinDef[] = [
  {
    key: 'worker',
    label: 'Worker',
    sublabel: 'Commercial',
    pos: ring(-30),
    seed: 0.0,
    critic: false,
    confront: true,
    openingLine: '',
    hoverLine: '',
    mediums: ['video'],
    tmiMap: {
      'video-work-2': [],
      'collab-hyunhwi': [],
    },
  },
  {
    key: 'media',
    label: 'Media',
    sublabel: 'Personal Work',
    pos: ring(0),
    seed: 0.4,
    critic: false,
    confront: true,
    openingLine: '',
    hoverLine: '',
    mediums: ['web', 'engine'],
    tmiMap: {
      'the-etched-mutation': [],
      'byeori-engine': [],
    },
  },
  {
    key: 'writer',
    label: 'Writer',
    sublabel: 'Text & Writing',
    pos: ring(30),
    seed: 0.8,
    critic: false,
    confront: true,
    openingLine: '',
    hoverLine: '',
    mediums: ['writing'],
    tmiMap: {},
  },
  {
    key: 'shadow',
    label: '.',
    sublabel: '',
    pos: at(-6.9, 0.0),
    seed: 0.6,
    critic: true,
    confront: true,
    openingLine: '',
    hoverLine: '',
    mediums: [],
    tmiMap: {},
  },
];

// ── Mannequin 컴포넌트 ──────────────────────────────────────
function Mannequin({
  def,
  onHover,
  onActivate,
}: {
  def: MannequinDef;
  onHover?: (v: boolean) => void;
  onActivate?: () => void;
}) {
  const { scene, animations } = useGLTF(MODEL);
  const cloned = useMemo(() => SkeletonUtils.clone(scene) as THREE.Group, [scene]);
  const { actions } = useAnimations(animations, cloned);

  useEffect(() => {
    const action = Object.values(actions)[0];
    if (action) {
      action.reset();
      action.time = def.seed * (action.getClip().duration || 1);
      action.setEffectiveTimeScale(0.9);
      action.play();
    }
  }, [actions, def.seed]);

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
        if (def.critic) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.color = new THREE.Color('#0e0e0e');
          mat.roughness = 0.6;
          mesh.material = mat;
        }
      }
    });
  }, [cloned, def.critic]);

  const dx = FACE[0] - def.pos[0];
  const dz = FACE[1] - def.pos[2];
  const rotY = def.confront ? Math.atan2(dx, dz) : Math.atan2(-dx, -dz);

  return (
    <group>
      <primitive object={cloned} position={def.pos} rotation={[0, rotY, 0]} />
      <mesh
        position={[def.pos[0], 0.84, def.pos[2]]}
        onPointerOver={(e) => { e.stopPropagation(); onHover?.(true); }}
        onPointerOut={(e) => { e.stopPropagation(); onHover?.(false); }}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 6) return;
          onActivate?.();
        }}
      >
        <capsuleGeometry args={[0.26, 1.15, 4, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── 방 ──────────────────────────────────────────────────────
function Room() {
  const wall = '#ecebe6';
  const floor = '#e6e4de';
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color={floor} roughness={0.72} metalness={0} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.2, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color={wall} roughness={1} metalness={0} />
      </mesh>
      <mesh position={[0, 2.1, -5.5]} receiveShadow>
        <planeGeometry args={[16, 8.4]} />
        <meshStandardMaterial color={wall} roughness={1} metalness={0} />
      </mesh>
      <mesh position={[0, 2.1, 5.5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[16, 8.4]} />
        <meshStandardMaterial color={wall} roughness={1} metalness={0} />
      </mesh>
      <mesh position={[-5.5, 2.1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[16, 8.4]} />
        <meshStandardMaterial color={wall} roughness={1} metalness={0} />
      </mesh>
      <mesh position={[5.5, 2.1, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[16, 8.4]} />
        <meshStandardMaterial color={wall} roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

// ── 1인칭 시점 컨트롤 ───────────────────────────────────────
function LookControls({ locked }: { locked: boolean }) {
  const { camera, gl } = useThree();
  const st = useRef({ dragging: false, px: 0, py: 0, yaw: LOOK_YAW0, pitch: LOOK_PITCH0 });

  useEffect(() => {
    if (locked) return;
    const dom = gl.domElement;
    const down = (e: PointerEvent) => { st.current.dragging = true; st.current.px = e.clientX; st.current.py = e.clientY; };
    const up = () => { st.current.dragging = false; };
    const move = (e: PointerEvent) => {
      if (!st.current.dragging) return;
      st.current.yaw -= (e.clientX - st.current.px) * 0.003;
      st.current.pitch = Math.max(-1.2, Math.min(0.9, st.current.pitch - (e.clientY - st.current.py) * 0.003));
      st.current.px = e.clientX;
      st.current.py = e.clientY;
    };
    dom.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointermove', move);
    return () => { dom.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); window.removeEventListener('pointermove', move); };
  }, [gl, locked]);

  useFrame(() => {
    const { yaw, pitch } = st.current;
    camera.position.set(CAMERA_POS[0], CAMERA_POS[1], CAMERA_POS[2]);
    const cp = Math.cos(pitch);
    camera.lookAt(CAMERA_POS[0] + Math.sin(yaw) * cp, CAMERA_POS[1] + Math.sin(pitch), CAMERA_POS[2] + Math.cos(yaw) * cp);
  });

  return null;
}

// ── 포트폴리오 패널 ─────────────────────────────────────────
function PortfolioPanel({
  def,
  onClose,
  onProjectClick,
  tmiLine,
}: {
  def: MannequinDef;
  onClose: () => void;
  onProjectClick: (p: Project) => void;
  tmiLine: string;
}) {
  // 이 마네킹에 해당하는 프로젝트 필터링
  const items = projects.filter((p) => def.mediums.includes(p.medium));
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeProject = items.find((p) => p.id === activeId) ?? null;

  const handleSelect = (p: Project) => {
    setActiveId(p.id);
    onProjectClick(p);
  };

  // YouTube watch URL → embed URL 변환
  const toEmbed = (url: string): string | null => {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&?/]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  };

  return (
    <motion.div
      className="fixed inset-0 z-30 flex"
      style={{ background: 'rgba(236,235,230,0.0)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 왼쪽 1/3 — 얼빡샷 사이드 */}
      <div
        className="relative flex flex-col items-center justify-center flex-shrink-0"
        style={{ width: '33.333%', background: '#f0eeea' }}
      >
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-[10px] tracking-[0.25em] uppercase text-stone-400 hover:text-stone-700 transition-colors"
        >
          [close]
        </button>

        {/* 마네킹 실루엣 플레이스홀더 */}
        <div className="flex flex-col items-center gap-5 px-8">
          <div
            className="w-28 h-52 rounded-sm"
            style={{
              background: 'linear-gradient(180deg, #ccc9c2 0%, #b5b2ab 100%)',
            }}
          />
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-stone-500">
              {def.label}
            </p>
            <p className="text-[10px] tracking-wider text-stone-400 mt-1">
              {def.sublabel}
            </p>
          </div>
        </div>

        {/* TMI 대사 */}
        <AnimatePresence mode="wait">
          {tmiLine && (
            <motion.p
              key={tmiLine}
              className="absolute bottom-10 left-0 right-0 px-8 text-center text-xs text-stone-500 italic leading-relaxed"
              style={{ fontFamily: "'Times New Roman', 'Nanum Myeongjo', serif" }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4 }}
            >
              &ldquo;{tmiLine}&rdquo;
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* 오른쪽 2/3 — 포폴 패널 */}
      <div
        className="flex flex-col overflow-hidden"
        style={{ width: '66.667%', background: '#fafaf8' }}
      >
        {/* 헤더 */}
        <div className="px-10 pt-10 pb-6 border-b border-stone-200">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-800">
            {def.label}
          </h2>
          <p
            className="text-xs text-stone-400 tracking-wide mt-1 italic"
            style={{ fontFamily: "'Times New Roman', 'Nanum Myeongjo', serif" }}
          >
            {def.openingLine}
          </p>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 목록 */}
          <div className="w-60 flex-shrink-0 overflow-y-auto border-r border-stone-200 py-2">
            {items.length === 0 && (
              <p className="px-6 py-8 text-xs text-stone-300 tracking-wider">— empty —</p>
            )}
            {items.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p)}
                className={`w-full text-left px-6 py-4 border-b border-stone-100 transition-colors ${
                  activeId === p.id
                    ? 'bg-stone-100 text-stone-800'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
                }`}
              >
                <p className="text-xs font-semibold tracking-wide">{p.title}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  {p.year} · {mediumLabels[p.medium] ?? p.medium}
                </p>
              </button>
            ))}
          </div>

          {/* 상세 */}
          <div className="flex-1 overflow-y-auto p-10">
            <AnimatePresence mode="wait">
              {activeProject ? (
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* 제목 + 링크 */}
                  <div className="flex items-start justify-between mb-5 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-stone-800 leading-snug">
                        {activeProject.title}
                      </h3>
                      <p className="text-[10px] text-stone-400 mt-1">
                        {activeProject.year} · {mediumLabels[activeProject.medium] ?? activeProject.medium}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {activeProject.links.map((lk) => (
                        <a
                          key={lk.label}
                          href={lk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] tracking-[0.2em] uppercase text-stone-400 hover:text-stone-700 border border-stone-300 hover:border-stone-500 px-3 py-1.5 transition-colors"
                        >
                          {lk.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* 설명 */}
                  <p className="text-sm text-stone-600 leading-relaxed mb-8 whitespace-pre-line">
                    {activeProject.description}
                  </p>

                  {/* 미디어 이미지 */}
                  {activeProject.media && (
                    <div className="mb-8">
                      <img
                        src={activeProject.media}
                        alt={activeProject.title}
                        className="w-full object-cover"
                        style={{ maxHeight: '260px' }}
                      />
                    </div>
                  )}

                  {/* YouTube 임베드 */}
                  {activeProject.links.map((lk) => {
                    const embed = toEmbed(lk.url);
                    return embed ? (
                      <div key={lk.label} className="aspect-video w-full bg-stone-100 mb-8">
                        <iframe
                          src={embed}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : null;
                  })}

                  {/* PDF 임베드 */}
                  {activeProject.links.map((lk) =>
                    lk.url.endsWith('.pdf') ? (
                      <div key={lk.label} className="w-full h-96 bg-stone-100 mb-8">
                        <iframe src={lk.url} className="w-full h-full" />
                      </div>
                    ) : null
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-full"
                >
                  <p className="text-xs text-stone-300 tracking-[0.3em]">select a work</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── 메인 씬 ─────────────────────────────────────────────────
export default function QuarrelScene() {
  const [dpr, setDpr] = useState(1.5);
  const [hovering, setHovering] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [activeKey, setActiveKey] = useState<MannequinKey | null>(null);
  const [tmiLine, setTmiLine] = useState('');
  const cursorRef = useRef<HTMLDivElement>(null);
  const timers = useRef<{ shake?: number; sub?: number }>({});

  // 커서 추적
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (cursorRef.current) cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(timers.current.shake);
    window.clearTimeout(timers.current.sub);
  }, []);

  // 흰 마네킹 클릭 → 패널 열기
  const handleSelf = useCallback((key: MannequinKey) => {
    const def = SELVES.find((s) => s.key === key)!;
    setActiveKey(key);
    setTmiLine(def.openingLine);
  }, []);

  // 검은 마네킹 클릭 → 잠김
  const handleLocked = useCallback(() => {
    setSubtitle('아직은 접근 할 수 없어');
    setShaking(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setShaking(true)));
    window.clearTimeout(timers.current.shake);
    timers.current.shake = window.setTimeout(() => setShaking(false), 520);
    window.clearTimeout(timers.current.sub);
    timers.current.sub = window.setTimeout(() => setSubtitle(''), 2800);
  }, []);

  // 패널 내 프로젝트 클릭 → TMI 대사
  const handleProjectClick = useCallback((p: Project) => {
    if (!activeKey) return;
    const def = SELVES.find((s) => s.key === activeKey)!;
    const lines = def.tmiMap[p.id];
    if (lines && lines.length > 0) {
      setTmiLine(lines[Math.floor(Math.random() * lines.length)]);
    }
  }, [activeKey]);

  const activeDef = SELVES.find((s) => s.key === activeKey) ?? null;
  const panelOpen = activeKey !== null;

  return (
    <div
      className={nanumGothic.variable}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#ecebe6',
        touchAction: 'none',
        cursor: 'none',
      }}
    >
      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: CAMERA_POS, fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <color attach="background" args={['#ecebe6']} />
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
        <AdaptiveDpr pixelated />

        <Suspense fallback={null}>
          <Environment files="/hdri/studio.hdr" />
          <Room />
          {SELVES.map((s) => (
            <Mannequin
              key={s.key}
              def={s}
              onHover={s.critic ? undefined : setHovering}
              onActivate={s.critic ? handleLocked : () => handleSelf(s.key)}
            />
          ))}
          <ContactShadows position={[0, 0.01, 0]} opacity={0.55} scale={14} blur={2.6} far={4.5} resolution={1024} color="#000000" />
        </Suspense>

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

        <LookControls locked={panelOpen} />
      </Canvas>

      {/* 포트폴리오 패널 */}
      <AnimatePresence>
        {panelOpen && activeDef && (
          <PortfolioPanel
            key={activeKey!}
            def={activeDef}
            onClose={() => { setActiveKey(null); setTmiLine(''); }}
            onProjectClick={handleProjectClick}
            tmiLine={tmiLine}
          />
        )}
      </AnimatePresence>

      {/* 커스텀 커서 */}
      <div ref={cursorRef} className="q-cursor">
        <div className={'q-ring' + (hovering ? ' hover' : '') + (shaking ? ' shake' : '')} />
      </div>

      {/* 영화 자막 — 넷플릭스 톤(검회색 박스 + 나눔고딕) */}
      <div className={'q-subtitle' + (subtitle ? ' show' : '')}>
        {subtitle && <span>{subtitle}</span>}
      </div>

      <style>{`
        .q-cursor {
          position: fixed; top: 0; left: 0; z-index: 50;
          pointer-events: none; will-change: transform; display: none;
        }
        @media (hover: hover) and (pointer: fine) { .q-cursor { display: block; } }
        .q-ring {
          position: absolute; top: 0; left: 0;
          width: 26px; height: 26px;
          border: 1.5px solid #737373; border-radius: 50%;
          background: rgba(115,115,115,0);
          transform: translate(-50%, -50%);
          transition: width 0.18s ease, height 0.18s ease, background 0.18s ease, border-color 0.18s ease;
        }
        .q-ring.hover { width: 60px; height: 60px; background: rgba(115,115,115,0.14); }
        .q-ring.shake {
          border-color: #e23b3b; background: rgba(226,59,59,0.2);
          animation: q-shake 0.5s cubic-bezier(0.36,0.07,0.19,0.97);
        }
        @keyframes q-shake {
          0%   { transform: translate(-50%,-50%) rotate(0); }
          15%  { transform: translate(calc(-50% - 4px),-50%) rotate(-5deg); }
          30%  { transform: translate(calc(-50% + 4px),-50%) rotate(5deg); }
          45%  { transform: translate(calc(-50% - 3px),-50%) rotate(-3deg); }
          60%  { transform: translate(calc(-50% + 3px),-50%) rotate(3deg); }
          75%  { transform: translate(calc(-50% - 2px),-50%) rotate(-2deg); }
          100% { transform: translate(-50%,-50%) rotate(0); }
        }
        .q-subtitle {
          position: fixed;
          left: 50%;
          bottom: 9%;
          transform: translateX(-50%) translateY(8px);
          max-width: 86vw;
          text-align: center;
          opacity: 0;
          pointer-events: none;
          z-index: 60;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .q-subtitle.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        /* 텍스트 줄에만 깔리는 검회색 박스 — 넷플릭스 자막 톤 */
        .q-subtitle span {
          background: rgba(34, 34, 34, 0.85);
          color: #ffffff;
          font-family: var(--font-nanum), 'Malgun Gothic',
            'Apple SD Gothic Neo', sans-serif;
          font-weight: 400;
          font-size: clamp(18px, 2.5vw, 30px);
          line-height: 1.55;
          letter-spacing: 0.005em;
          padding: 0.1em 0.42em;
          border-radius: 2px;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
