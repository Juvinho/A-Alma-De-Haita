'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityY: number;
  velocityX: number;
  life: number;
  maxLife: number;
  baseColor: string;
}

interface ParticleFieldProps {
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
}

export default function ParticleField({
  intensity = 'medium',
  color = '#8b0000',
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Determine particle count based on intensity
    const particleCountMap = {
      low: 20,
      medium: 40,
      high: 80,
    };
    const targetParticleCount = particleCountMap[intensity];

    // Initialize particles
    const createParticle = (): Particle => {
      const colors = [
        '#8b0000',
        '#a02020',
        '#c04020',
        '#8b1a1a',
        '#a0341a',
      ];
      const baseColor = colors[Math.floor(Math.random() * colors.length)];

      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        velocityY: -(Math.random() * 0.3 + 0.2),
        velocityX: (Math.random() - 0.5) * 0.4,
        life: 0,
        maxLife: Math.random() * 200 + 300,
        baseColor,
      };
    };

    // Initialize with partial set
    particlesRef.current = Array.from(
      { length: Math.floor(targetParticleCount / 2) },
      createParticle
    );

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn new particles to reach target count
      while (particlesRef.current.length < targetParticleCount * 0.95) {
        particlesRef.current.push(createParticle());
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.life++;
        const progress = particle.life / particle.maxLife;

        // Fade in and out
        if (progress < 0.1) {
          particle.opacity = (progress / 0.1) * (Math.random() * 0.5 + 0.3);
        } else if (progress > 0.85) {
          particle.opacity = ((1 - progress) / 0.15) * (Math.random() * 0.5 + 0.3);
        }

        // Update position with sinusoidal movement
        particle.y += particle.velocityY;
        particle.x += particle.velocityX + Math.sin(particle.life * 0.02) * 0.15;

        // Draw particle with glow
        ctx.fillStyle = particle.baseColor;
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow
        ctx.strokeStyle = particle.baseColor;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = particle.opacity * 0.5;
        ctx.stroke();

        // Keep particle if still alive
        return particle.y > -10 && particle.life < particle.maxLife;
      });

      ctx.globalAlpha = 1;
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isClient, intensity]);

  if (!isClient) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ backgroundColor: 'rgb(10, 10, 10)' }}
    />
  );
}