'use client';

import { useState, useEffect } from 'react';

export type SpriteExpression =
  | 'normal'
  | 'happy'
  | 'thinking'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'surprised_2'
  | 'crying'
  | 'smug'
  | 'expr_09'
  | 'expr_10'
  | 'expr_11'
  | 'expr_12'
  | 'expr_13'
  | 'expr_14'
  | 'expr_15'
  | 'expr_16'
  | 'expr_17'
  | 'expr_18'
  | 'expr_19'
  | 'expr_20'
  | 'expr_21'
  | 'expr_22'
  | 'expr_23'
  | 'expr_24'
  | 'expr_25'
  | 'expr_26'
  | 'expr_27'
  | 'expr_28'
  | 'expr_29'
  | 'expr_30'
  | 'expr_31'
  | 'expr_32'
  | 'expr_33'
  | 'expr_34'
  | 'expr_35'
  | 'expr_36'
  | 'expr_37'
  | 'expr_38';

interface SpriteProps {
  character: string;
  expression?: SpriteExpression;
  animated?: boolean;
  duration?: number;
  className?: string;
}

/**
 * Exibe sprite processado com suporte a animação
 *
 * Uso:
 *   <Sprite character="enygma" expression="happy" />
 *   <Sprite character="maya" animated duration={300} />
 */
export function Sprite({
  character,
  expression = 'normal',
  animated = false,
  duration = 300,
  className = '',
}: SpriteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const spritePath = `/sprites/${character}_${expression}_sprite.png`;

  useEffect(() => {
    // Preload image
    const img = new window.Image();
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      console.warn(`Failed to load sprite: ${spritePath}`);
      setError(true);
    };
    img.src = spritePath;
  }, [spritePath]);

  if (error) {
    return (
      <div className="sprite-error">
        ⚠️ Sprite não encontrado: {spritePath}
      </div>
    );
  }

  return (
    <div
      className={`sprite-container ${animated ? 'sprite-animated' : ''} ${className}`}
      style={
        {
          '--animation-duration': `${duration}ms`,
        } as React.CSSProperties
      }
    >
      <img
        src={spritePath}
        alt={`${character} - ${expression}`}
        className={`sprite-image ${isLoading ? 'sprite-loading' : ''}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}

export default Sprite;
