'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TravessiaAudio, TravessiaSfx } from '@/lib/travessia-audio';

type CaptionStyle = 'whisper' | 'haita' | 'plain';
type TravessiaPhase = 'walking' | 'arrival';

type TravessiaEventType =
  | 'text'
  | 'skyIntensify'
  | 'sound'
  | 'shake'
  | 'shadow'
  | 'visual'
  | 'fogAdvance'
  | 'heartbeat'
  | 'silhouette'
  | 'skyTear'
  | 'bridgeNarrow'
  | 'lightAppear'
  | 'lightGrow'
  | 'arrival';

interface TravessiaEvent {
  at: number;
  type: TravessiaEventType;
  text?: string;
  style?: CaptionStyle;
  duration?: number;
  intensity?: number;
  bpm?: number;
  sound?: TravessiaSfx;
}

interface TravessiaState {
  distance: number;
  speed: number;
  lateral: number;
  targetLateral: number;
  skyPulse: number;
  fogDistance: number;
  phase: TravessiaPhase;
  heartbeatBpm: number;
  cameraShake: number;
  skyIntensity: number;
  fogBoost: number;
  bridgeNarrow: number;
  skyTear: boolean;
  lightStage: 0 | 1 | 2;
  idleSeconds: number;
  shadowSweep: number;
  silhouetteUntil: number;
  guardrailBroken: boolean;
  finalFade: number;
}

interface Particle {
  x: number;
  y: number;
  drift: number;
  bob: number;
  bobSpeed: number;
  size: number;
}

interface Crack {
  z: number;
  side: number;
  length: number;
  bend: number;
}

const TRAVESSIA_EVENTS: TravessiaEvent[] = [
  { at: 50, type: 'text', text: 'Você está na Ponte.', style: 'whisper', duration: 4000 },
  { at: 100, type: 'skyIntensify' },
  { at: 150, type: 'sound', sound: 'distantRumble' },
  { at: 200, type: 'shake', intensity: 0.3, text: 'O chão pulsa.', style: 'whisper', duration: 3200 },
  { at: 250, type: 'shadow' },
  {
    at: 300,
    type: 'text',
    text: 'Você está entre os mundos agora. Nem aqui, nem lá. Neste espaço, eu sou tudo que existe.',
    style: 'haita',
    duration: 8000,
  },
  { at: 350, type: 'visual' },
  {
    at: 400,
    type: 'fogAdvance',
    text: 'A névoa avança. Ela sempre avança.',
    style: 'whisper',
    duration: 4200,
  },
  { at: 450, type: 'heartbeat', bpm: 50 },
  { at: 500, type: 'text', text: 'Metade.', style: 'whisper', duration: 2200 },
  { at: 550, type: 'silhouette' },
  { at: 600, type: 'skyTear' },
  { at: 650, type: 'heartbeat', bpm: 70 },
  {
    at: 700,
    type: 'sound',
    sound: 'voices',
    text: 'Dois bilhões e meio de vozes. Eu ouço todas. Sempre ouvi.',
    style: 'haita',
    duration: 6000,
  },
  { at: 750, type: 'shake', intensity: 0.7 },
  { at: 800, type: 'bridgeNarrow' },
  { at: 850, type: 'heartbeat', bpm: 100 },
  { at: 900, type: 'lightAppear', text: 'Você a vê.', style: 'whisper', duration: 3000 },
  { at: 950, type: 'lightGrow', text: 'Quase.', style: 'whisper', duration: 2600 },
  { at: 1000, type: 'arrival' },
];

const IDLE_LINES = [
  'Não pare agora.',
  'A ponte não termina porque você hesita.',
  'A névoa não tem pressa. Ela só vence.',
  'Você queria chegar até aqui. Ande.',
];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hasGateAccess(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    localStorage.getItem('haita-ascended') === 'true' &&
    localStorage.getItem('haita-proved') === 'true' &&
    localStorage.getItem('haita-eternal') === 'true'
  );
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    drift: (Math.random() - 0.5) * 0.06,
    bob: Math.random() * Math.PI * 2,
    bobSpeed: 0.4 + Math.random() * 0.8,
    size: 1.2 + Math.random() * 1.8,
  }));
}

function createCracks(count: number): Crack[] {
  return Array.from({ length: count }, () => ({
    z: 0.45 + Math.random() * 0.53,
    side: (Math.random() * 1.6 - 0.8),
    length: 0.04 + Math.random() * 0.1,
    bend: (Math.random() * 2 - 1) * 0.12,
  }));
}

export default function TravessiaClient() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const captionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleCaptionRef = useRef<number>(0);
  const distanceUiRef = useRef<number>(0);
  const audioRef = useRef<TravessiaAudio | null>(null);
  const triggeredRef = useRef<Set<number>>(new Set());
  const keysRef = useRef({ up: false, left: false, right: false });
  const movingRef = useRef(false);
  const hiddenRef = useRef(false);

  const particlesRef = useRef<Particle[]>(createParticles(18));
  const cracksRef = useRef<Crack[]>(createCracks(20));

  const stateRef = useRef<TravessiaState>({
    distance: 0,
    speed: 0,
    lateral: 0,
    targetLateral: 0,
    skyPulse: 0,
    fogDistance: 0,
    phase: 'walking',
    heartbeatBpm: 40,
    cameraShake: 0,
    skyIntensity: 1,
    fogBoost: 0,
    bridgeNarrow: 0,
    skyTear: false,
    lightStage: 0,
    idleSeconds: 0,
    shadowSweep: -1,
    silhouetteUntil: 0,
    guardrailBroken: false,
    finalFade: 0,
  });

  const [guardReady, setGuardReady] = useState(false);
  const [distanceUi, setDistanceUi] = useState(0);
  const [caption, setCaption] = useState('');
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>('whisper');
  const [typedCaption, setTypedCaption] = useState('');
  const [isHolding, setIsHolding] = useState(false);

  const textSpeed = useMemo(() => {
    if (captionStyle === 'haita') return 80;
    if (captionStyle === 'plain') return 35;
    return 42;
  }, [captionStyle]);

  const showCaption = useCallback((text: string, style: CaptionStyle = 'whisper', duration = 3800) => {
    setCaption(text);
    setCaptionStyle(style);

    if (captionTimeoutRef.current) {
      clearTimeout(captionTimeoutRef.current);
    }

    captionTimeoutRef.current = setTimeout(() => {
      setCaption('');
    }, duration);
  }, []);

  useEffect(() => {
    setTypedCaption('');
    if (!caption) return;

    let idx = 0;
    const timer = setInterval(() => {
      idx += 1;
      setTypedCaption(caption.slice(0, idx));
      if (idx >= caption.length) {
        clearInterval(timer);
      }
    }, textSpeed);

    return () => clearInterval(timer);
  }, [caption, textSpeed]);

  const ensureAudio = useCallback(async () => {
    if (!audioRef.current) {
      audioRef.current = new TravessiaAudio();
      await audioRef.current.init();
    }
    await audioRef.current.resume();
  }, []);

  const finishTravessia = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('haita-crossed', 'true');
    }
    router.replace('/eternidade');
  }, [router]);

  const runEvent = useCallback(
    (event: TravessiaEvent) => {
      const s = stateRef.current;

      if (event.text) {
        showCaption(event.text, event.style ?? 'whisper', event.duration ?? 3500);
      }

      switch (event.type) {
        case 'skyIntensify': {
          s.skyIntensity = Math.min(1.7, s.skyIntensity + 0.3);
          audioRef.current?.setPulseIntensity(0.6);
          break;
        }
        case 'sound': {
          if (event.sound) audioRef.current?.playSfx(event.sound);
          break;
        }
        case 'shake': {
          s.cameraShake = Math.max(s.cameraShake, event.intensity ?? 0.3);
          if (navigator.vibrate) {
            navigator.vibrate([120, 70, 120]);
          }
          if ((event.intensity ?? 0) > 0.6) {
            audioRef.current?.playSfx('metalCreak');
            s.guardrailBroken = true;
          }
          break;
        }
        case 'shadow': {
          s.shadowSweep = 0;
          break;
        }
        case 'visual': {
          s.guardrailBroken = true;
          break;
        }
        case 'fogAdvance': {
          s.fogBoost = clamp(s.fogBoost + 0.16, 0, 0.55);
          break;
        }
        case 'heartbeat': {
          s.heartbeatBpm = event.bpm ?? s.heartbeatBpm;
          audioRef.current?.setHeartbeat(s.heartbeatBpm);
          break;
        }
        case 'silhouette': {
          s.silhouetteUntil = performance.now() + 10_000;
          break;
        }
        case 'skyTear': {
          s.skyTear = true;
          audioRef.current?.playSfx('windGust');
          break;
        }
        case 'bridgeNarrow': {
          s.bridgeNarrow = clamp(s.bridgeNarrow + 0.1, 0, 0.35);
          break;
        }
        case 'lightAppear': {
          s.lightStage = 1;
          s.cameraShake = 0;
          s.fogBoost = clamp(s.fogBoost - 0.08, 0, 0.55);
          s.heartbeatBpm = 70;
          audioRef.current?.setHeartbeat(70);
          break;
        }
        case 'lightGrow': {
          s.lightStage = 2;
          s.cameraShake = 0;
          s.heartbeatBpm = 40;
          audioRef.current?.setHeartbeat(40);
          break;
        }
        case 'arrival': {
          if (s.phase === 'arrival') break;
          s.phase = 'arrival';
          s.finalFade = 0;
          showCaption('', 'plain', 0);
          audioRef.current?.playSfx('arrival');
          setTimeout(() => {
            finishTravessia();
          }, 5000);
          break;
        }
        case 'text':
        default:
          break;
      }
    },
    [finishTravessia, showCaption]
  );

  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, dt: number) => {
    const s = stateRef.current;

    const shakeX = (Math.random() - 0.5) * s.cameraShake * 12;
    const shakeY = (Math.random() - 0.5) * s.cameraShake * 7;

    const horizonY = Math.floor(height * 0.44 + shakeY);
    const vanishX = Math.floor(width * 0.5 + s.lateral * 1.6 + shakeX);

    ctx.clearRect(0, 0, width, height);

    // Sky
    const skyPulseStrength = 0.15 * s.skyIntensity;
    const skyPulse = 1 + Math.sin(s.skyPulse) * skyPulseStrength;
    const skyRadius = Math.max(width, height) * (0.75 + skyPulse * 0.15);
    const skyGradient = ctx.createRadialGradient(vanishX, horizonY * 0.45, 10, vanishX, horizonY * 0.45, skyRadius);
    skyGradient.addColorStop(0, 'rgba(139,0,0,0.95)');
    skyGradient.addColorStop(1, 'rgba(42,0,0,1)');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, horizonY + 2);

    if (s.skyTear) {
      const tearW = width * 0.22;
      const tearH = height * 0.12;
      ctx.fillStyle = 'rgba(180,20,20,0.55)';
      ctx.beginPath();
      ctx.moveTo(vanishX - tearW * 0.55, horizonY * 0.32);
      ctx.lineTo(vanishX - tearW * 0.2, horizonY * 0.26);
      ctx.lineTo(vanishX + tearW * 0.15, horizonY * 0.3);
      ctx.lineTo(vanishX + tearW * 0.5, horizonY * 0.24);
      ctx.lineTo(vanishX + tearW * 0.25, horizonY * 0.35 + tearH * 0.2);
      ctx.lineTo(vanishX - tearW * 0.3, horizonY * 0.36 + tearH * 0.3);
      ctx.closePath();
      ctx.fill();
    }

    // Bridge geometry
    const narrowDynamic = clamp(((s.distance - 800) / 220), 0, 1) * 0.2;
    const halfBottom = width * (0.36 - s.bridgeNarrow - narrowDynamic * 0.6);
    const halfTop = width * 0.032;

    const leftBottom = vanishX - halfBottom;
    const rightBottom = vanishX + halfBottom;
    const leftTop = vanishX - halfTop;
    const rightTop = vanishX + halfTop;

    // Asphalt
    const asphaltPulse = 1 + Math.sin(s.skyPulse + 0.2) * 0.06;
    const asphalt = Math.floor(42 * asphaltPulse);
    ctx.fillStyle = `rgb(${asphalt},${asphalt},${asphalt})`;
    ctx.beginPath();
    ctx.moveTo(leftTop, horizonY);
    ctx.lineTo(rightTop, horizonY);
    ctx.lineTo(rightBottom, height);
    ctx.lineTo(leftBottom, height);
    ctx.closePath();
    ctx.fill();

    // Asphalt seams
    const scroll = (s.distance * 0.012) % 1;
    ctx.strokeStyle = 'rgba(110,110,110,0.45)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 28; i += 1) {
      const d = ((i / 28) + scroll) % 1;
      const perspective = Math.pow(d, 1.7);
      const y = horizonY + perspective * (height - horizonY);
      const roadHalf = lerp(halfTop, halfBottom, perspective);
      ctx.beginPath();
      ctx.moveTo(vanishX - roadHalf, y);
      ctx.lineTo(vanishX + roadHalf, y);
      ctx.stroke();
    }

    // Guardrails
    ctx.strokeStyle = 'rgba(85,85,85,0.92)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftBottom, height);
    ctx.lineTo(leftTop, horizonY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rightBottom, height);
    ctx.lineTo(rightTop, horizonY);
    ctx.stroke();

    // Posts and lamps
    const postFlow = (s.distance * 0.015) % 1;
    for (let i = 0; i < 20; i += 1) {
      const d = ((i / 20) + postFlow) % 1;
      const p = Math.pow(d, 1.6);
      const y = horizonY + p * (height - horizonY);
      const roadHalf = lerp(halfTop, halfBottom, p);
      const postHeight = 8 + 28 * p;

      const leftX = vanishX - roadHalf;
      const rightX = vanishX + roadHalf;

      ctx.strokeStyle = 'rgba(130,130,130,0.7)';
      ctx.lineWidth = 1 + p * 1.4;

      ctx.beginPath();
      ctx.moveTo(leftX, y);
      ctx.lineTo(leftX, y - postHeight);
      ctx.stroke();

      const rightBroken = s.guardrailBroken && s.distance > 730 && d > 0.65 && d < 0.78;
      if (!rightBroken) {
        ctx.beginPath();
        ctx.moveTo(rightX, y);
        ctx.lineTo(rightX, y - postHeight);
        ctx.stroke();
      }

      const postDistanceMark = s.distance + (1 - d) * 100;
      const lampDead = postDistanceMark > 400;
      const lampBroken = postDistanceMark > 700;
      let lampColor = lampDead ? 'rgba(90,90,90,0.25)' : 'rgba(220,180,90,0.45)';
      if (postDistanceMark > 890 && postDistanceMark < 990) {
        lampColor = 'rgba(230,200,120,0.75)';
      }
      if (lampBroken) {
        lampColor = 'rgba(70,70,70,0.2)';
      }

      ctx.fillStyle = lampColor;
      ctx.beginPath();
      ctx.arc(leftX, y - postHeight, 1.2 + p * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cracks from distance 400+
    if (s.distance >= 400) {
      const crackProgress = clamp((s.distance - 400) / 400, 0, 1);
      cracksRef.current.forEach((crack, idx) => {
        if (idx / cracksRef.current.length > crackProgress) return;
        const z1 = crack.z;
        const z2 = clamp(crack.z + crack.length, 0, 0.995);

        const p1 = Math.pow(z1, 1.6);
        const p2 = Math.pow(z2, 1.6);

        const y1 = horizonY + p1 * (height - horizonY);
        const y2 = horizonY + p2 * (height - horizonY);

        const half1 = lerp(halfTop, halfBottom, p1);
        const half2 = lerp(halfTop, halfBottom, p2);

        const x1 = vanishX + half1 * crack.side;
        const x2 = vanishX + half2 * (crack.side + crack.bend);

        ctx.strokeStyle = 'rgba(190,40,40,0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255,90,90,0.1)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
    }

    // Shadow sweep event
    if (s.shadowSweep >= 0 && s.shadowSweep <= 1) {
      const sweepX = lerp(leftBottom - width * 0.3, rightBottom + width * 0.3, s.shadowSweep);
      const sweepW = width * 0.4;
      const grad = ctx.createLinearGradient(sweepX - sweepW, horizonY, sweepX + sweepW, height);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.42)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(leftBottom, horizonY, rightBottom - leftBottom, height - horizonY);
    }

    // Silhouette in fog
    if (performance.now() < s.silhouetteUntil && s.lateral > -8) {
      ctx.fillStyle = 'rgba(10,10,10,0.22)';
      const sx = width * 0.16;
      const sy = horizonY + (height - horizonY) * 0.35;
      ctx.fillRect(sx, sy - 60, 18, 70);
      ctx.beginPath();
      ctx.arc(sx + 9, sy - 67, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fog layers
    const fogAlpha = 0.08 + s.fogDistance * 0.42;
    const leftFog = ctx.createLinearGradient(0, 0, width * (0.38 - s.fogDistance * 0.15), 0);
    leftFog.addColorStop(0, `rgba(255,245,245,${fogAlpha})`);
    leftFog.addColorStop(1, 'rgba(255,245,245,0)');
    ctx.fillStyle = leftFog;
    ctx.fillRect(0, horizonY - 20, width, height - horizonY + 40);

    const rightFog = ctx.createLinearGradient(width, 0, width * (0.62 + s.fogDistance * 0.15), 0);
    rightFog.addColorStop(0, `rgba(255,245,245,${fogAlpha})`);
    rightFog.addColorStop(1, 'rgba(255,245,245,0)');
    ctx.fillStyle = rightFog;
    ctx.fillRect(0, horizonY - 20, width, height - horizonY + 40);

    const horizonFog = ctx.createLinearGradient(0, horizonY - 30, 0, height);
    horizonFog.addColorStop(0, `rgba(255,242,242,${0.05 + s.fogDistance * 0.28})`);
    horizonFog.addColorStop(1, 'rgba(255,242,242,0)');
    ctx.fillStyle = horizonFog;
    ctx.fillRect(0, horizonY - 30, width, height - horizonY + 30);

    // Floating particles
    particlesRef.current.forEach((particle) => {
      particle.x += particle.drift * dt;
      particle.bob += particle.bobSpeed * dt;
      if (particle.x > 1.05) particle.x = -0.05;
      if (particle.x < -0.05) particle.x = 1.05;

      const px = particle.x * width;
      const py = horizonY * 0.2 + particle.y * (height * 0.8) + Math.sin(particle.bob) * 6;

      const lightFactor = s.lightStage === 0 ? 0 : clamp((s.distance - 900) / 120, 0, 1);
      const r = Math.floor(180 + 60 * lightFactor);
      const g = Math.floor(40 + 160 * lightFactor);
      const b = Math.floor(40 + 60 * lightFactor);
      ctx.fillStyle = `rgba(${r},${g},${b},0.45)`;
      ctx.beginPath();
      ctx.arc(px, py, particle.size + lightFactor * 0.6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Golden light at the end
    if (s.lightStage > 0) {
      const grow = s.lightStage === 1 ? clamp((s.distance - 900) / 50, 0, 1) : 1 + clamp((s.distance - 950) / 50, 0, 1) * 6;
      const lightRadius = 4 + grow * 18;
      const lightGrad = ctx.createRadialGradient(vanishX, horizonY + 8, 2, vanishX, horizonY + 8, lightRadius * 3.5);
      lightGrad.addColorStop(0, 'rgba(255,230,160,0.95)');
      lightGrad.addColorStop(0.5, 'rgba(230,190,90,0.35)');
      lightGrad.addColorStop(1, 'rgba(230,190,90,0)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.arc(vanishX, horizonY + 8, lightRadius * 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Final white-gold fade
    if (s.phase === 'arrival') {
      ctx.fillStyle = `rgba(255,245,220,${clamp(s.finalFade, 0, 1)})`;
      ctx.fillRect(0, 0, width, height);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!hasGateAccess()) {
      router.replace('/');
      return;
    }

    if (localStorage.getItem('haita-crossed') === 'true') {
      router.replace('/eternidade');
      return;
    }

    setGuardReady(true);
  }, [router]);

  useEffect(() => {
    if (!guardReady) return;

    function setCanvasSize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }

    function onKeyDown(ev: KeyboardEvent) {
      if (ev.key === 'ArrowUp' || ev.key.toLowerCase() === 'w') {
        keysRef.current.up = true;
        movingRef.current = true;
        setIsHolding(true);
        void ensureAudio();
      }
      if (ev.key === 'ArrowLeft' || ev.key.toLowerCase() === 'a') {
        keysRef.current.left = true;
      }
      if (ev.key === 'ArrowRight' || ev.key.toLowerCase() === 'd') {
        keysRef.current.right = true;
      }
    }

    function onKeyUp(ev: KeyboardEvent) {
      if (ev.key === 'ArrowUp' || ev.key.toLowerCase() === 'w') {
        keysRef.current.up = false;
        movingRef.current = false;
        setIsHolding(false);
      }
      if (ev.key === 'ArrowLeft' || ev.key.toLowerCase() === 'a') {
        keysRef.current.left = false;
      }
      if (ev.key === 'ArrowRight' || ev.key.toLowerCase() === 'd') {
        keysRef.current.right = false;
      }
    }

    function onVisibility() {
      hiddenRef.current = document.hidden;
    }

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('visibilitychange', onVisibility);

    const tick = (ts: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!lastTsRef.current) lastTsRef.current = ts;
      let dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      dt = clamp(dt, 0, 0.05);

      if (!hiddenRef.current) {
        const s = stateRef.current;

        const horizontal = (keysRef.current.right ? 1 : 0) - (keysRef.current.left ? 1 : 0);
        s.targetLateral = clamp(s.targetLateral + horizontal * 55 * dt, -30, 30);
        if (horizontal === 0) {
          s.targetLateral *= 0.96;
        }
        s.lateral += (s.targetLateral - s.lateral) * Math.min(1, dt * 8);

        const wantsMove = movingRef.current || keysRef.current.up;
        const targetSpeed = wantsMove ? 4 : 0;
        s.speed += (targetSpeed - s.speed) * Math.min(1, dt * 3.2);

        if (s.phase === 'walking') {
          s.distance = clamp(s.distance + s.speed * dt, 0, 1000);
        }

        if (s.speed < 0.15) {
          s.idleSeconds += dt;
          if (s.idleSeconds > 30) {
            s.fogBoost = clamp(s.fogBoost + dt * 0.04, 0, 0.35);
          }
        } else {
          s.idleSeconds = 0;
          s.fogBoost = clamp(s.fogBoost - dt * 0.02, 0, 0.35);
        }

        if (s.idleSeconds > 10 && ts - idleCaptionRef.current > 11_000) {
          idleCaptionRef.current = ts;
          const line = IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)] ?? IDLE_LINES[0];
          showCaption(line, 'whisper', 2600);
        }

        if (performance.now() < s.silhouetteUntil && s.lateral <= -8) {
          s.silhouetteUntil = 0;
        }

        s.skyPulse += dt * ((Math.PI * 2) / 3);
        s.fogDistance = clamp(s.distance / 1800 + s.fogBoost, 0, 0.9);

        if (s.cameraShake > 0) {
          s.cameraShake = Math.max(0, s.cameraShake - dt * 0.35);
        }

        if (s.shadowSweep >= 0) {
          s.shadowSweep += dt / 4;
          if (s.shadowSweep > 1) s.shadowSweep = -1;
        }

        if (s.phase === 'arrival') {
          s.finalFade = clamp(s.finalFade + dt * 0.35, 0, 1);
        }

        TRAVESSIA_EVENTS.forEach((ev, idx) => {
          if (triggeredRef.current.has(idx)) return;
          if (s.distance >= ev.at) {
            triggeredRef.current.add(idx);
            runEvent(ev);
          }
        });

        if (s.distance >= 1000 && s.phase !== 'arrival') {
          const arrivalIdx = TRAVESSIA_EVENTS.findIndex((ev) => ev.type === 'arrival');
          if (arrivalIdx >= 0 && !triggeredRef.current.has(arrivalIdx)) {
            triggeredRef.current.add(arrivalIdx);
            runEvent(TRAVESSIA_EVENTS[arrivalIdx]);
          }
        }

        const roundedDistance = Math.floor(s.distance);
        if (roundedDistance !== distanceUiRef.current) {
          distanceUiRef.current = roundedDistance;
          setDistanceUi(roundedDistance);
        }
      }

      drawFrame(ctx, window.innerWidth, window.innerHeight, dt);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (captionTimeoutRef.current) {
        clearTimeout(captionTimeoutRef.current);
      }
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('visibilitychange', onVisibility);
      audioRef.current?.destroy();
      audioRef.current = null;
    };
  }, [drawFrame, ensureAudio, guardReady, runEvent, showCaption]);

  const handleTouchStart = useCallback(async (ev: React.PointerEvent<HTMLDivElement>) => {
    if (ev.clientY > window.innerHeight * 0.55) return;
    movingRef.current = true;
    setIsHolding(true);
    await ensureAudio();
  }, [ensureAudio]);

  const handleTouchEnd = useCallback(() => {
    movingRef.current = false;
    setIsHolding(false);
  }, []);

  const handleSkip = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('haita-crossed', 'true');
    }
    router.replace('/eternidade');
  }, [router]);

  if (!guardReady) {
    return <main className="min-h-screen bg-black" />;
  }

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-black select-none"
      onPointerDown={handleTouchStart}
      onPointerUp={handleTouchEnd}
      onPointerCancel={handleTouchEnd}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 font-mono text-[11px] tracking-widest text-[#f2d9c2] opacity-55">
          DISTANCIA {distanceUi.toString().padStart(4, '0')} / 1000
        </div>

        <div className="absolute top-4 right-4 font-mono text-[10px] tracking-widest text-[#f2d9c2] opacity-35">
          {isHolding ? 'AVANCANDO' : 'PAREI'}
        </div>

        {caption && (
          <div className="absolute bottom-[16%] left-1/2 -translate-x-1/2 w-[min(92vw,860px)] px-4">
            <p
              className="text-center leading-relaxed"
              style={{
                fontFamily: captionStyle === 'haita' ? 'Cinzel Decorative, serif' : 'Cormorant Garamond, serif',
                color: captionStyle === 'haita' ? '#d4a017' : '#f2d9c2',
                letterSpacing: captionStyle === 'haita' ? '0.04em' : '0.02em',
                fontSize: captionStyle === 'haita' ? '1rem' : '0.95rem',
                textShadow:
                  captionStyle === 'haita'
                    ? '0 0 18px rgba(212,160,23,0.25)'
                    : '0 0 12px rgba(0,0,0,0.6)',
                opacity: captionStyle === 'whisper' ? 0.75 : 0.92,
              }}
            >
              {typedCaption}
            </p>
          </div>
        )}

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center">
          <p className="font-mono text-[10px] tracking-widest text-[#f2d9c2] opacity-45">
            W / SETA CIMA OU TOQUE E SEGURE NO TOPO
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSkip}
        className="absolute right-2 bottom-2 z-20 text-[8px] font-mono tracking-widest uppercase text-[#f2d9c2] opacity-10 hover:opacity-35 focus:opacity-60 transition-opacity"
      >
        pular
      </button>
    </main>
  );
}
