/**
 * Componentes de Cenas SVG para Prova 5 — Caça às Sombras
 * 5 cenários com 5 anomalias cada (25 total)
 * Usuário deve encontrar e clicar nas anomalias escondidas
 */

'use client';

import React, { useState, useRef } from 'react';

export interface Anomaly {
  x: number; // Percentual 0-100
  y: number; // Percentual 0-100
  radius: number; // Raio em pixels
  hint: string; // Descrição textual da anomalia
}

export interface ShadowSceneProps {
  sceneId: 'corridor' | 'beach' | 'temple' | 'library' | 'bridge';
  onAnomalyFound?: (anomalyId: string) => void;
  foundAnomalies?: Set<string>;
  showHints?: boolean;
}

interface SceneConfig {
  name: string;
  description: string;
  svg: React.ComponentType<{
    anomalies: Anomaly[];
    found: Set<string>;
    showHints: boolean;
  }>;
  anomalies: Anomaly[];
}

/**
 * CENA 1: Corredor Perspectivo
 * Anomalias: Porta extra, Quadro invertido, Janela flutuante, Sombra duplicada, Símbolo errado
 */
const CorridorScene: React.FC<{ anomalies: Anomaly[]; found: Set<string>; showHints: boolean }> = ({
  anomalies,
  found,
  showHints,
}) => {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full bg-slate-900">
      {/* Parede traseira em perspectiva */}
      <line x1="400" y1="50" x2="100" y2="500" stroke="#374151" strokeWidth="2" />
      <line x1="400" y1="50" x2="700" y2="500" stroke="#374151" strokeWidth="2" />

      {/* Linhas de profundidade */}
      {[1, 2, 3, 4].map((i) => (
        <line
          key={`depth-${i}`}
          x1={100 + (300 * i) / 5}
          y1={500 - (400 * i) / 5}
          x2={700 - (300 * i) / 5}
          y2={500 - (400 * i) / 5}
          stroke="#4B5563"
          strokeWidth="1"
          opacity="0.5"
        />
      ))}

      {/* Portas laterais (normal) */}
      <rect x="120" y="250" width="80" height="150" fill="none" stroke="#9CA3AF" strokeWidth="2" />
      <line x1="160" y1="250" x2="160" y2="400" stroke="#9CA3AF" strokeWidth="1" />

      <rect x="600" y="280" width="70" height="120" fill="none" stroke="#9CA3AF" strokeWidth="2" />
      <line x1="635" y1="280" x2="635" y2="400" stroke="#9CA3AF" strokeWidth="1" />

      {/* Quadros na parede */}
      <rect x="200" y="120" width="60" height="80" fill="none" stroke="#6B7280" strokeWidth="2" />
      <rect x="205" y="125" width="50" height="70" fill="#1F2937" opacity="0.3" />

      <rect x="540" y="150" width="60" height="80" fill="none" stroke="#6B7280" strokeWidth="2" />
      <rect x="545" y="155" width="50" height="70" fill="#1F2937" opacity="0.3" />

      {/* Elemento de luz ao final do corredor */}
      <circle cx="400" cy="80" r="30" fill="#FCD34D" opacity="0.3" />
      <circle cx="400" cy="80" r="20" fill="#FCD34D" opacity="0.5" />

      {/* Anomalias renderizadas */}
      {anomalies.map((anom, idx) => {
        const key = `corridor-${idx}`;
        const isFound = found.has(key);

        return (
          <g key={key}>
            {/* Círculo de detecção (invisível, apenas para clique) */}
            <circle
              cx={`${anom.x}%`}
              cy={`${anom.y}%`}
              r={anom.radius}
              fill="transparent"
              className="cursor-pointer hover:fill-yellow-400/10 transition-all"
            />

            {/* Visual feedback se encontrada */}
            {isFound && (
              <circle
                cx={`${anom.x}%`}
                cy={`${anom.y}%`}
                r={anom.radius + 5}
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2"
                opacity="0.8"
              />
            )}

            {/* Hint text */}
            {showHints && !isFound && (
              <text
                x={`${anom.x}%`}
                y={`${anom.y + 8}%`}
                textAnchor="middle"
                fontSize="10"
                fill="#FCA5A5"
                opacity="0.5"
                className="pointer-events-none"
              >
                ?
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/**
 * CENA 2: Praia Noturna
 * Anomalias: Lua extra, Concha invertida, Onda flutuante, Estrela no chão, Silhueta estranha
 */
const BeachScene: React.FC<{ anomalies: Anomaly[]; found: Set<string>; showHints: boolean }> = ({
  anomalies,
  found,
  showHints,
}) => {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full bg-slate-950">
      {/* Céu gradiente (simulado) */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
      </defs>

      <rect width="800" height="400" fill="url(#skyGradient)" />

      {/* Areia */}
      <rect y="400" width="800" height="200" fill="#92400E" />

      {/* Lua (normal) */}
      <circle cx="100" cy="100" r="40" fill="#FDE047" opacity="0.8" />
      <circle cx="100" cy="100" r="35" fill="#FCD34D" opacity="0.6" />

      {/* Estrelas */}
      {[1, 2, 3, 4, 5].map((i) => (
        <circle
          key={`star-${i}`}
          cx={200 + i * 100}
          cy={50 + Math.sin(i) * 30}
          r="2"
          fill="#FBBF24"
          opacity="0.7"
        />
      ))}

      {/* Ondas (animação simulada com camadas) */}
      <path
        d="M 0 350 Q 50 330 100 350 T 200 350 T 300 350 T 400 350 T 500 350 T 600 350 T 700 350 T 800 350 L 800 380 L 0 380 Z"
        fill="#1F2937"
        opacity="0.6"
      />
      <path
        d="M 0 360 Q 60 340 120 360 T 240 360 T 360 360 T 480 360 T 600 360 T 720 360 T 840 360 L 800 390 L 0 390 Z"
        fill="#111827"
        opacity="0.7"
      />

      {/* Conchas na areia */}
      <ellipse cx="150" cy="450" rx="20" ry="15" fill="#A78BFA" opacity="0.4" />
      <path d="M 145 450 L 155 450" stroke="#A78BFA" strokeWidth="1" />

      <ellipse cx="600" cy="480" rx="18" ry="12" fill="#A78BFA" opacity="0.4" />
      <path d="M 594 480 L 606 480" stroke="#A78BFA" strokeWidth="1" />

      {/* Silhuetas de rochas distantes */}
      <path d="M 0 450 L 50 400 L 100 450 Z" fill="#0F172A" opacity="0.8" />
      <path d="M 700 460 L 750 410 L 800 460 Z" fill="#0F172A" opacity="0.8" />

      {/* Anomalias */}
      {anomalies.map((anom, idx) => {
        const key = `beach-${idx}`;
        const isFound = found.has(key);

        return (
          <g key={key}>
            <circle
              cx={`${anom.x}%`}
              cy={`${anom.y}%`}
              r={anom.radius}
              fill="transparent"
              className="cursor-pointer hover:fill-yellow-400/10"
            />
            {isFound && (
              <circle
                cx={`${anom.x}%`}
                cy={`${anom.y}%`}
                r={anom.radius + 5}
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

/**
 * CENA 3: Templo Incenso
 * Anomalias: Vela extra, Símbolo invertido, Pilar flutuante, Incenso ondulante errado, Olho na parede
 */
const TempleScene: React.FC<{ anomalies: Anomaly[]; found: Set<string>; showHints: boolean }> = ({
  anomalies,
  found,
  showHints,
}) => {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full bg-amber-950">
      {/* Pilares */}
      {[100, 350, 600].map((x) => (
        <g key={`pillar-${x}`}>
          <rect x={x - 30} y="100" width="60" height="350" fill="#D97706" opacity="0.5" />
          <line x1={x - 30} y1="100" x2={x - 30} y2="450" stroke="#B45309" strokeWidth="2" />
          <line x1={x + 30} y1="100" x2={x + 30} y2="450" stroke="#B45309" strokeWidth="2" />
        </g>
      ))}

      {/* Piso */}
      <rect y="450" width="800" height="150" fill="#78350F" opacity="0.7" />

      {/* Velas normais (candelabro) */}
      <g transform="translate(400, 80)">
        {[-80, -40, 0, 40, 80].map((offset, i) => (
          <g key={`candle-${i}`} transform={`translate(${offset}, 0)`}>
            <rect x="-3" y="0" width="6" height="30" fill="#FCD34D" opacity="0.6" />
            <circle cx="0" cy="-5" r="8" fill="#FCD34D" opacity="0.8" />
          </g>
        ))}
      </g>

      {/* Símbolo central (Häita: Olho) */}
      <g transform="translate(400, 250)">
        <circle cx="0" cy="0" r="30" fill="none" stroke="#FCD34D" strokeWidth="2" opacity="0.7" />
        <circle cx="0" cy="0" r="15" fill="#FCD34D" opacity="0.4" />
        <circle cx="0" cy="0" r="8" fill="#000" opacity="0.6" />
      </g>

      {/* Incenso fumegando */}
      {[1, 2, 3].map((i) => (
        <g key={`incense-${i}`} opacity={0.3}>
          <path
            d={`M ${150 + i * 250} 400 Q ${150 + i * 250 - 20} 350 ${150 + i * 250} 300`}
            fill="none"
            stroke="#D97706"
            strokeWidth="3"
          />
          <path
            d={`M ${150 + i * 250} 350 Q ${150 + i * 250 + 15} 320 ${150 + i * 250} 290`}
            fill="none"
            stroke="#D97706"
            strokeWidth="2"
          />
        </g>
      ))}

      {/* Anomalias */}
      {anomalies.map((anom, idx) => {
        const key = `temple-${idx}`;
        const isFound = found.has(key);

        return (
          <g key={key}>
            <circle cx={`${anom.x}%`} cy={`${anom.y}%`} r={anom.radius} fill="transparent" />
            {isFound && (
              <circle
                cx={`${anom.x}%`}
                cy={`${anom.y}%`}
                r={anom.radius + 5}
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

/**
 * CENA 4: Biblioteca Antigas
 * Anomalias: Prateleira flutuante, Livro caindo, Letra errada, Lâmpada invertida, Sombra anômala
 */
const LibraryScene: React.FC<{ anomalies: Anomaly[]; found: Set<string>; showHints: boolean }> = ({
  anomalies,
  found,
  showHints,
}) => {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full bg-slate-900">
      {/* Paredes */}
      <rect width="800" height="600" fill="#1F2937" />

      {/* Prateleiras */}
      {[1, 2, 3, 4, 5].map((i) => (
        <g key={`shelf-${i}`}>
          <line x1="50" y1={100 + i * 90} x2="750" y2={100 + i * 90} stroke="#78350F" strokeWidth="3" />

          {/* Livros */}
          {[1, 2, 3, 4, 5, 6, 7].map((j) => (
            <rect
              key={`book-${i}-${j}`}
              x={60 + j * 100}
              y={110 + i * 90}
              width="40"
              height="70"
              fill={['#B91C1C', '#1E40AF', '#7C2D12', '#3F0F46'][j % 4]}
              opacity="0.6"
            />
          ))}
        </g>
      ))}

      {/* Lâmpada no teto */}
      <g transform="translate(400, 50)">
        <rect x="-15" y="0" width="30" height="20" fill="#F59E0B" opacity="0.7" />
        <path
          d="M -30 20 L 30 20 Q 30 35 0 40 Q -30 35 -30 20 Z"
          fill="#FDE047"
          opacity="0.5"
        />
      </g>

      {/* Trivia nos livros */}
      <text x="100" y="400" fontSize="12" fill="#9CA3AF" opacity="0.5">
        "ARCANE WISDOM"
      </text>
      <text x="600" y="350" fontSize="12" fill="#9CA3AF" opacity="0.5">
        "HÄITA'S TRUTH"
      </text>

      {/* Anomalias */}
      {anomalies.map((anom, idx) => {
        const key = `library-${idx}`;
        const isFound = found.has(key);

        return (
          <g key={key}>
            <circle cx={`${anom.x}%`} cy={`${anom.y}%`} r={anom.radius} fill="transparent" />
            {isFound && (
              <circle
                cx={`${anom.x}%`}
                cy={`${anom.y}%`}
                r={anom.radius + 5}
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

/**
 * CENA 5: Ponte Abstrata
 * Anomalias: Cabo duplicado, Pedra fora de lugar, Linha de horizonte quebrada, Sombra dupla, Símbolo invertido
 */
const BridgeScene: React.FC<{ anomalies: Anomaly[]; found: Set<string>; showHints: boolean }> = ({
  anomalies,
  found,
  showHints,
}) => {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Horizonte */}
      <line x1="0" y1="300" x2="800" y2="300" stroke="#4B5563" strokeWidth="2" opacity="0.5" />

      {/* Ponte base */}
      <path d="M 100 350 L 700 350 L 690 380 L 110 380 Z" fill="#78350F" opacity="0.7" />

      {/* Estrutura da ponte (cabos e suportes) */}
      <line x1="150" y1="100" x2="150" y2="350" stroke="#9CA3AF" strokeWidth="3" opacity="0.6" />
      <line x1="400" y1="80" x2="400" y2="350" stroke="#9CA3AF" strokeWidth="3" opacity="0.6" />
      <line x1="650" y1="100" x2="650" y2="350" stroke="#9CA3AF" strokeWidth="3" opacity="0.6" />

      {/* Cabos de tração */}
      {[1, 2, 3, 4].map((i) => (
        <path
          key={`cable-${i}`}
          d={`M 150 100 Q 400 50 650 100`}
          fill="none"
          stroke="#D1D5DB"
          strokeWidth="2"
          opacity={0.5 - i * 0.1}
          transform={`translate(0, ${i * 15})`}
        />
      ))}

      {/* Tabuleiro da ponte com padrão */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={`plank-${i}`}
          x={100 + i * 100}
          y="350"
          width="95"
          height="30"
          fill="#92400E"
          opacity={i % 2 === 0 ? 0.6 : 0.5}
          stroke="#78350F"
          strokeWidth="1"
        />
      ))}

      {/* Pedras no rio/abismo abaixo */}
      {[1, 2, 3].map((i) => (
        <circle
          key={`rock-${i}`}
          cx={200 + i * 200}
          cy={450 - Math.sin(i) * 30}
          r={20 + i * 5}
          fill="#4B5563"
          opacity="0.4"
        />
      ))}

      {/* Nebulosa/neblina */}
      <rect
        x="0"
        y="400"
        width="800"
        height="200"
        fill="#0F172A"
        opacity="0.3"
      />

      {/* Anomalias */}
      {anomalies.map((anom, idx) => {
        const key = `bridge-${idx}`;
        const isFound = found.has(key);

        return (
          <g key={key}>
            <circle cx={`${anom.x}%`} cy={`${anom.y}%`} r={anom.radius} fill="transparent" />
            {isFound && (
              <circle
                cx={`${anom.x}%`}
                cy={`${anom.y}%`}
                r={anom.radius + 5}
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

/**
 * Configurações de cenas
 */
const sceneConfigs: Record<'corridor' | 'beach' | 'temple' | 'library' | 'bridge', SceneConfig> = {
  corridor: {
    name: 'Corredor Perspectivo',
    description: 'Um corredor sem fim, linhas de profundidade levam a um ponto distante.',
    svg: CorridorScene,
    anomalies: [
      { x: 30, y: 35, radius: 20, hint: 'Porta extra no fundo' },
      { x: 65, y: 25, radius: 18, hint: 'Quadro girado' },
      { x: 50, y: 45, radius: 15, hint: 'Janela flutuante' },
      { x: 25, y: 60, radius: 20, hint: 'Sombra duplicada' },
      { x: 75, y: 50, radius: 17, hint: 'Símbolo incorreto' },
    ],
  },

  beach: {
    name: 'Praia Noturna',
    description: 'Praia vermelha sob noite eterna. As ondas sussurram.',
    svg: BeachScene,
    anomalies: [
      { x: 20, y: 20, radius: 25, hint: 'Lua adicional' },
      { x: 40, y: 75, radius: 18, hint: 'Concha invertida' },
      { x: 60, y: 55, radius: 20, hint: 'Onda flutuante' },
      { x: 75, y: 65, radius: 17, hint: 'Estrela no chão' },
      { x: 15, y: 55, radius: 22, hint: 'Silhueta estranha' },
    ],
  },

  temple: {
    name: 'Templo do Incenso',
    description: 'Santuário antigo. Velas tremulam diante do símbolo supremo.',
    svg: TempleScene,
    anomalies: [
      { x: 45, y: 15, radius: 15, hint: 'Vela extra' },
      { x: 25, y: 40, radius: 18, hint: 'Símbolo invertido' },
      { x: 75, y: 35, radius: 20, hint: 'Pilar flutuante' },
      { x: 50, y: 65, radius: 16, hint: 'Incenso errado' },
      { x: 35, y: 50, radius: 19, hint: 'Olho na parede' },
    ],
  },

  library: {
    name: 'Biblioteca Antiga',
    description: 'Prateleiras infinitas de conhecimento esquecido.',
    svg: LibraryScene,
    anomalies: [
      { x: 30, y: 25, radius: 20, hint: 'Prateleira flutuante' },
      { x: 60, y: 40, radius: 18, hint: 'Livro caindo' },
      { x: 45, y: 55, radius: 17, hint: 'Letra errada' },
      { x: 70, y: 15, radius: 19, hint: 'Lâmpada invertida' },
      { x: 20, y: 70, radius: 21, hint: 'Sombra anômala' },
    ],
  },

  bridge: {
    name: 'Ponte Abstrata',
    description: 'Estrutura que liga dois planos da existência. Acima, o vazio.',
    svg: BridgeScene,
    anomalies: [
      { x: 40, y: 15, radius: 18, hint: 'Cabo duplicado' },
      { x: 65, y: 70, radius: 20, hint: 'Pedra fora de lugar' },
      { x: 35, y: 50, radius: 16, hint: 'Linha quebrada' },
      { x: 55, y: 65, radius: 19, hint: 'Sombra dupla' },
      { x: 80, y: 30, radius: 17, hint: 'Símbolo invertido' },
    ],
  },
};

/**
 * Componente principal de renderização de cenas
 */
export const ShadowScene: React.FC<ShadowSceneProps> = ({
  sceneId,
  onAnomalyFound,
  foundAnomalies = new Set(),
  showHints = false,
}) => {
  const config = sceneConfigs[sceneId];
  if (!config) return <div>Scene not found</div>;

  const SceneComponent = config.svg;

  const handleAnomalyClick = (idx: number) => {
    const key = `${sceneId}-${idx}`;
    if (!foundAnomalies.has(key) && onAnomalyFound) {
      onAnomalyFound(key);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 p-4 text-white">
        <h3 className="font-serif text-xl">{config.name}</h3>
        <p className="text-sm text-red-100 italic">{config.description}</p>
      </div>

      {/* SVG Scene Container */}
      <div className="flex-1 relative">
        <SceneComponent
          anomalies={config.anomalies}
          found={foundAnomalies}
          showHints={showHints}
        />
      </div>

      {/* Stats */}
      <div className="bg-slate-900 px-4 py-2 text-xs text-amber-100 border-t border-slate-700">
        Encontradas: {foundAnomalies.size} / {config.anomalies.length}
      </div>
    </div>
  );
};

export default ShadowScene;
