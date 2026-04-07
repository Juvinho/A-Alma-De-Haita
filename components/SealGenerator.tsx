'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SealGeneratorProps {
  playerName: string;
  hintsUsed: number;
  completedDate?: Date;
}

const getTitulo = (dicas: number): string => {
  if (dicas === 0) return 'SEM MISERICÓRDIA';
  if (dicas <= 5) return 'DIGNO DE ATENÇÃO';
  if (dicas <= 15) return 'TOLERÁVEL';
  if (dicas <= 30) return 'MISERICÓRDIA CONCEDIDA';
  return 'ELA TEVE PIEDADE DE VOCÊ';
};

export default function SealGenerator({
  playerName,
  hintsUsed,
  completedDate = new Date(),
}: SealGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 630;

    // Fundo com gradiente
    const gradient = ctx.createRadialGradient(600, 315, 100, 600, 315, 800);
    gradient.addColorStop(0, '#1a0a0a');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Noise overlay sutil
    const imageData = ctx.getImageData(0, 0, 1200, 630);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 15;
      data[i] += noise;
      data[i + 1] += noise * 0.3;
      data[i + 2] += noise * 0.3;
    }
    ctx.putImageData(imageData, 0, 0);

    // Bordas decorativas
    ctx.strokeStyle = 'rgba(212, 160, 23, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 1140, 570);

    // Cantos com decoração
    const cornerSize = 40;
    ctx.strokeStyle = 'rgba(212, 160, 23, 0.5)';
    ctx.lineWidth = 1.5;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(30, 30 + cornerSize);
    ctx.lineTo(30, 30);
    ctx.lineTo(30 + cornerSize, 30);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(1170 - cornerSize, 30);
    ctx.lineTo(1170, 30);
    ctx.lineTo(1170, 30 + cornerSize);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(30, 600 - cornerSize);
    ctx.lineTo(30, 600);
    ctx.lineTo(30 + cornerSize, 600);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(1170 - cornerSize, 600);
    ctx.lineTo(1170, 600);
    ctx.lineTo(1170, 600 - cornerSize);
    ctx.stroke();

    // Runa Central (Olho com pupila losangular)
    const centerX = 600;
    const centerY = 120;

    // Elipse do olho
    ctx.strokeStyle = '#c9b99a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 35, 50, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Pupila losangular
    ctx.fillStyle = '#d4a017';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 15);
    ctx.lineTo(centerX + 12, centerY);
    ctx.lineTo(centerX, centerY + 15);
    ctx.lineTo(centerX - 12, centerY);
    ctx.closePath();
    ctx.fill();

    // Brilho no olho
    ctx.fillStyle = 'rgba(212, 160, 23, 0.6)';
    ctx.beginPath();
    ctx.arc(centerX - 8, centerY - 10, 6, 0, Math.PI * 2);
    ctx.fill();

    // Textos
    const fontColor = '#c9b99a';

    // Fonte Cinzel (fallback serif)
    ctx.font = "24px Georgia, serif";
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.fillText('── ATRAVESSOU OS VÉUS ──', 600, 200);

    ctx.font = "32px Georgia, serif";
    ctx.fillStyle = fontColor;
    ctx.fillText('DE HÄITA', 600, 235);

    // Nome em destaque
    ctx.font = "bold 48px Georgia, serif";
    ctx.fillStyle = '#d4a017';
    ctx.fillText(`« ${playerName} »`, 600, 300);

    // Linha divisória
    ctx.strokeStyle = 'rgba(212, 160, 23, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(100, 340);
    ctx.lineTo(1100, 340);
    ctx.stroke();
    ctx.setLineDash([]);

    // Estatísticas
    ctx.font = "14px Georgia, serif";
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    const dateStr = completedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    ctx.fillText(`20/20 enigmas · ${hintsUsed} dicas usadas`, 600, 370);
    ctx.fillText(dateStr, 600, 390);

    // Título por performance
    ctx.font = "bold 20px Georgia, serif";
    ctx.fillStyle = '#d4a017';
    ctx.fillText(getTitulo(hintsUsed), 600, 430);

    // Rodapé
    ctx.font = "14px Georgia, serif";
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.fillText('── fundação varguelia ──', 600, 580);

    setIsRendered(true);
  }, [playerName, hintsUsed, completedDate]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `haita-seal-${playerName}-${Date.now()}.png`;
    link.click();
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        if (blob) {
          const item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item]).then(() => {
            alert('Selo copiado para a área de transferência!');
          });
        }
      }, 'image/png');
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <canvas
        ref={canvasRef}
        className="w-full max-w-2xl border border-amber-900/30 rounded"
        style={{
          background: 'linear-gradient(135deg, #1a0a0a 0%, #0a0a0a 100%)',
        }}
      />

      <div className="flex gap-4">
        <button
          onClick={handleDownload}
          disabled={!isRendered}
          className="px-6 py-2 border border-amber-700 text-amber-700 hover:bg-amber-900/20 disabled:opacity-50 transition-all"
        >
          [ GRAVAR SELO ]
        </button>

        <button
          onClick={handleCopy}
          disabled={!isRendered}
          className="px-6 py-2 border border-amber-700 text-amber-700 hover:bg-amber-900/20 disabled:opacity-50 transition-all"
        >
          [ COPIAR ]
        </button>
      </div>
    </div>
  );
}