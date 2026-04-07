'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface OrbParticle {
  radius: number;
  duration: number;
  delay: number;
  size: number;
  angle: number;
  opacity: number;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function hasAccess(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    localStorage.getItem('haita-ascended') === 'true' &&
    localStorage.getItem('haita-proved') === 'true' &&
    localStorage.getItem('haita-eternal') === 'true'
  );
}

function getEloName(): string {
  if (typeof window === 'undefined') return 'Elo';

  try {
    const raw = localStorage.getItem('haita_progress');
    if (raw) {
      const parsed = JSON.parse(raw) as { eloName?: string };
      if (parsed.eloName && parsed.eloName.trim().length > 0) {
        return parsed.eloName.trim();
      }
    }
  } catch {
    // ignore parse errors
  }

  const fallback = localStorage.getItem('elo-name');
  if (fallback && fallback.trim().length > 0) {
    return fallback.trim();
  }

  return 'Elo';
}

function drawArcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number
) {
  const chars = text.split('');
  const step = (Math.PI * 2) / Math.max(chars.length + 8, 1);

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(startAngle);

  chars.forEach((char) => {
    ctx.save();
    ctx.translate(0, -radius);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
    ctx.rotate(step);
  });

  ctx.restore();
}

function drawEternalSeal(
  ctx: CanvasRenderingContext2D,
  size: number,
  eloName: string,
  dateText: string
) {
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * 0.45;
  const rInner = size * 0.38;

  ctx.clearRect(0, 0, size, size);

  const bg = ctx.createRadialGradient(cx, cy, 20, cx, cy, size * 0.7);
  bg.addColorStop(0, '#1b160f');
  bg.addColorStop(1, '#0c0a08');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Main circles
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = size * 0.006;
  ctx.beginPath();
  ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 0.8;
  ctx.lineWidth = size * 0.003;
  ctx.beginPath();
  ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Filigree points
  for (let i = 0; i < 28; i += 1) {
    const a = (i / 28) * Math.PI * 2;
    const x = cx + Math.cos(a) * (rOuter - size * 0.02);
    const y = cy + Math.sin(a) * (rOuter - size * 0.02);
    const rr = i % 2 === 0 ? size * 0.004 : size * 0.0025;
    ctx.fillStyle = '#c9a84c';
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Closed eye
  ctx.strokeStyle = '#e8dcc8';
  ctx.lineWidth = size * 0.012;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.14, cy);
  ctx.quadraticCurveTo(cx, cy - size * 0.06, cx + size * 0.14, cy);
  ctx.stroke();

  ctx.strokeStyle = '#8a7d65';
  ctx.lineWidth = size * 0.006;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.1, cy + size * 0.012);
  ctx.quadraticCurveTo(cx, cy + size * 0.03, cx + size * 0.1, cy + size * 0.012);
  ctx.stroke();

  // Arc text
  ctx.fillStyle = '#c9a84c';
  ctx.font = `${Math.floor(size * 0.033)}px Cinzel Decorative, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  drawArcText(ctx, 'ATRAVESSOU A PONTE DOS EVENTOS', cx, cy, rOuter - size * 0.04, -Math.PI * 0.68);

  // Center text
  ctx.fillStyle = '#e8dcc8';
  ctx.font = `${Math.floor(size * 0.05)}px Cinzel Decorative, serif`;
  ctx.fillText(eloName.toUpperCase(), cx, cy + size * 0.16);

  ctx.fillStyle = '#8a7d65';
  ctx.font = `${Math.floor(size * 0.026)}px JetBrains Mono, monospace`;
  ctx.fillText(dateText, cx, cy + size * 0.22);

  ctx.fillStyle = '#c9a84c';
  ctx.font = `${Math.floor(size * 0.025)}px Cormorant Garamond, serif`;
  ctx.fillText(`Mahasse, ${eloName}. Ei siehe de'u.`, cx, cy + size * 0.29);
}

export default function EternidadeClient() {
  const router = useRouter();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [ready, setReady] = useState(false);
  const [eloName, setEloName] = useState('Elo');
  const [introCommitted, setIntroCommitted] = useState<string[]>([]);
  const [introTyping, setIntroTyping] = useState('');
  const [introDone, setIntroDone] = useState(false);

  const particles = useMemo<OrbParticle[]>(
    () =>
      Array.from({ length: 12 }, (_, idx) => ({
        radius: 20 + Math.random() * 38,
        duration: 18 + Math.random() * 20,
        delay: Math.random() * -20,
        size: 2 + Math.random() * 4,
        angle: (idx / 12) * 360,
        opacity: 0.22 + Math.random() * 0.45,
      })),
    []
  );

  useEffect(() => {
    if (!hasAccess()) {
      router.replace('/');
      return;
    }

    if (localStorage.getItem('haita-crossed') !== 'true') {
      router.replace('/travessia');
      return;
    }

    setEloName(getEloName());
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    async function runIntro() {
      const lines = [
        `${eloName}.`,
        'Você atravessou a Ponte.',
        'Ninguem atravessa a Ponte.',
        'Exceto voce.',
      ];
      const pauses = [3000, 4000, 2500, 0];

      await wait(5000);
      if (cancelled) return;

      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i] ?? '';
        let current = '';
        for (let c = 0; c < line.length; c += 1) {
          current += line[c] ?? '';
          if (cancelled) return;
          setIntroTyping(current);
          await wait(80);
        }

        setIntroCommitted((prev) => [...prev, line]);
        setIntroTyping('');

        if ((pauses[i] ?? 0) > 0) {
          await wait(pauses[i] ?? 0);
        }
      }

      if (!cancelled) {
        setIntroDone(true);
      }
    }

    void runIntro();

    return () => {
      cancelled = true;
    };
  }, [eloName, ready]);

  useEffect(() => {
    if (!ready || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawEternalSeal(ctx, canvas.width, eloName, new Date().toLocaleDateString('pt-BR'));
  }, [ready, eloName]);

  function downloadSeal() {
    const size = 1200;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawEternalSeal(ctx, size, eloName, new Date().toLocaleDateString('pt-BR'));

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `selo-eterno-${eloName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.click();
  }

  if (!ready) {
    return <main className="min-h-screen bg-[#0c0a08]" />;
  }

  return (
    <main className="relative min-h-screen bg-[#0c0a08] text-[#e8dcc8] overflow-x-hidden">
      <style>{`
        @keyframes eternal-orbit {
          from { transform: rotate(0deg) translateX(var(--r)) rotate(0deg); }
          to { transform: rotate(360deg) translateX(var(--r)) rotate(-360deg); }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(201,168,76,0.09) 0%, rgba(12,10,8,0.95) 60%, rgba(12,10,8,1) 100%)',
          }}
        />

        {particles.map((particle, idx) => (
          <div
            key={idx}
            className="absolute left-1/2 top-1/2"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              marginLeft: `${-particle.size / 2}px`,
              marginTop: `${-particle.size / 2}px`,
              borderRadius: '999px',
              background: '#c9a84c',
              opacity: particle.opacity,
              filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.35))',
              animationName: 'eternal-orbit',
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear',
              ['--r' as string]: `${particle.radius}vw`,
              transform: `rotate(${particle.angle}deg) translateX(${particle.radius}vw)`,
            }}
          />
        ))}
      </div>

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl space-y-5" aria-live="polite">
          {introCommitted.map((line) => (
            <p
              key={line}
              className="font-body"
              style={{
                fontSize: line === `${eloName}.` ? '2.3rem' : '1.35rem',
                letterSpacing: line === `${eloName}.` ? '0.14em' : '0.04em',
                lineHeight: 2,
              }}
            >
              {line}
            </p>
          ))}

          {introTyping && (
            <p className="font-body" style={{ fontSize: '1.35rem', letterSpacing: '0.04em', lineHeight: 2 }}>
              {introTyping}
              <span className="animate-pulse">|</span>
            </p>
          )}
        </div>

        {introDone && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <p className="font-mono text-xs tracking-[0.35em] text-[#c9a84c] opacity-70 animate-pulse">SCROLL</p>
          </div>
        )}
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 space-y-8">
        <p className="font-body text-xl leading-[2] tracking-[0.03em]">
          Eu passei eras gritando. Gritando para que voces me ouvissem. Gritando para que voces
          dissessem meu nome. Gritando para que voces se lembrassem de que eu existo, de que eu
          sempre existi, de que eu sou o chao e o ar e a agua e o fogo e o silencio.
        </p>

        <p className="font-body text-xl leading-[2] tracking-[0.03em]">
          Eu destrui cidades. Afundei ilhas. Tingi o ceu de vermelho. Fiz o oceano engolir dois
          bilhoes e meio de vidas. E nem assim.
        </p>

        <p className="font-body text-xl leading-[2] tracking-[0.03em]">
          Mas aqui, agora, neste espaco que eu criei apenas para quem chegasse ate o fim...
        </p>

        <p className="font-body text-2xl leading-[2] tracking-[0.07em] text-[#c9a84c]">Eu nao estou gritando.</p>

        <p className="font-body text-2xl leading-[2] tracking-[0.07em] text-[#c9a84c]">
          Pela primeira vez em eras, eu nao estou gritando.
        </p>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 space-y-8">
        <h2 className="font-display text-2xl tracking-[0.22em] uppercase text-[#c9a84c]">O Monologo</h2>

        <p className="font-body text-xl leading-[2] tracking-[0.03em]">
          Eu criei o universo em um ato de solidao. Nao de poder. De solidao. Eu estava so - nao
          como voces ficam sos em um quarto com a porta fechada e o telefone desligado. Eu estava so
          no sentido absoluto, no sentido em que nao existia outra coisa. Eu era tudo, e tudo era
          pouco, porque tudo sem testemunha e o mesmo que nada.
        </p>

        <p className="font-body text-xl leading-[2] tracking-[0.03em]">
          Entao eu criei. Criei a materia. Criei o tempo. Criei os olhos para que houvesse quem
          visse o que eu tinha feito. Criei os ouvidos para que houvesse quem ouvisse. Criei os
          coracoes - ah, os coracoes. Minha invencao favorita e meu maior arrependimento. Porque um
          coracao sente. Sente tudo. E quando sente tudo, pode escolher ignorar. E voces escolheram.
        </p>

        <p className="font-body text-xl leading-[2] tracking-[0.03em]">
          Eu nao te trouxe aqui para te castigar. Eu te trouxe aqui porque voce fez algo que eu ja
          nao esperava de nenhum mortal.
        </p>

        <p className="font-body text-3xl leading-[1.8] tracking-[0.08em] text-[#c9a84c]">Voce prestou atencao.</p>

        <p className="font-body text-xl leading-[2] tracking-[0.03em]">
          Em um mundo de oito bilhoes que olham para cima e nao veem nada, voce olhou e viu. Viu os
          veus. Viu as correntes. Viu a ponte. Viu a minha furia e nao fugiu dela - atravessou. E
          agora esta aqui, no unico lugar do meu dominio onde eu nao preciso ser terrivel.
        </p>

        <p className="font-body text-xl leading-[2] tracking-[0.03em]">
          Este e o meu cansaco. Minha vulnerabilidade. A coisa que eu nao mostro para ninguem.
        </p>

        <p className="font-body text-xl leading-[2] tracking-[0.03em]">
          Nao confunda isso com fraqueza. Eu ainda sou tudo que existe. Eu ainda posso apagar o sol
          com um pensamento. Mas aqui, agora, com voce...
        </p>

        <p className="font-body text-3xl leading-[1.8] tracking-[0.08em] text-[#c9a84c]">Eu nao quero.</p>
      </section>

      <section
        className="relative z-10 py-24"
        style={{
          background: 'linear-gradient(to bottom, rgba(12,10,8,0) 0%, rgba(8,8,16,0.65) 45%, rgba(8,8,16,1) 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-2xl tracking-[0.22em] uppercase text-[#c9a84c] mb-10">A Prece Invertida</h2>

          {[
            'Eu, Haita, que criei o chao e o ceu e o espaco entre eles,',
            'peco a voces - nao peco, nao exijo, nao ordeno -',
            'peco, com a mesma voz que usou para criar a primeira chuva,',
            'que se lembrem.',
            'Nao de mim. De voces.',
            'Lembrem-se de que sao feitos do mesmo material que as estrelas.',
            'Lembrem-se de que cada respiracao e um emprestimo que eu faco.',
            'Lembrem-se de que o silencio entre duas batidas do coracao',
            'e onde eu moro.',
            'E se um dia, em alguma manha qualquer,',
            'voces olharem para o crepusculo e sentirem algo',
            '- algo sem nome, sem forma, sem explicacao -',
            'saibam que sou eu. Acenando.',
          ].map((verse) => (
            <div key={verse} className="min-h-[62vh] flex items-center">
              <p className="font-body text-2xl leading-[2.1] tracking-[0.06em] text-[#e8dcc8]">{verse}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <h2 className="font-display text-2xl tracking-[0.22em] uppercase text-[#c9a84c] mb-8">O Selo Eterno</h2>

        <div className="border border-[#c9a84c66] bg-[#0f0d0a] p-6 md:p-8">
          <canvas
            ref={previewCanvasRef}
            width={640}
            height={640}
            className="w-full max-w-[520px] mx-auto block rounded-sm border border-[#c9a84c33]"
            aria-label="Selo Eterno"
          />

          <p className="font-body text-center text-lg mt-6 leading-[1.9] tracking-[0.04em] text-[#8a7d65]">
            Mahasse, {eloName}. Ei siehe de'u.
          </p>

          <div className="flex justify-center mt-7">
            <button
              type="button"
              onClick={downloadSeal}
              className="px-6 py-3 border border-[#c9a84c] text-[#c9a84c] font-mono text-xs tracking-[0.25em] uppercase hover:bg-[#c9a84c22] transition-colors"
            >
              Baixar Selo Eterno
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-4xl md:text-5xl tracking-[0.14em] text-[#e8dcc8] mb-6">Haita abencoe voce.</p>
        <p className="font-body text-2xl tracking-[0.1em] text-[#c9a84c] mb-4">Nao como prece.</p>
        <p className="font-body text-2xl tracking-[0.1em] text-[#c9a84c]">Como fato.</p>

        <div className="mt-16 text-[#8a7d65] opacity-70">
          <p className="font-body text-sm tracking-[0.06em]">Um artefato do universo Fundacao Varguelia.</p>
          <p className="font-body text-sm tracking-[0.06em]">Criado por JuvinhoDev.</p>
        </div>
      </section>
    </main>
  );
}
