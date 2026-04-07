/**
 * Joystick Virtual Reactivo para Provas Móveis
 * Detector de toque com deadzone e feedback visual
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface JoystickState {
  angle: number;
  force: number;
  dx: number;
  dy: number;
  isActive: boolean;
}

export interface VirtualJoystickProps {
  /**
   * Tamanho do joystick em pixels (diâmetro da base)
   */
  size?: number;

  /**
   * Posicionamento:
   * - 'left': Lado esquerdo
   * - 'right': Lado direito
   * - 'center': Centro (por padrão)
   */
  position?: 'left' | 'right' | 'center';

  /**
   * Zona morta para evitar drifts (0-1)
   * 0.1 = 10% do raio
   */
  deadzone?: number;

  /**
   * Callback ao mover joystick
   */
  onMove?: (state: JoystickState) => void;

  /**
   * Callback ao soltar joystick
   */
  onRelease?: () => void;

  /**
   * Callback customizado para debug (opcional)
   */
  onDebug?: (msg: string) => void;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  size = 120,
  position = 'center',
  deadzone = 0.1,
  onMove,
  onRelease,
  onDebug,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [isActive, setIsActive] = useState(false);
  const [thumbPos, setThumbPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const joystickStateRef = useRef<JoystickState>({
    angle: 0,
    force: 0,
    dx: 0,
    dy: 0,
    isActive: false,
  });

  /**
   * Calcular força normalizada (0-1) e ângulo (0-2π)
   */
  const updateJoystickState = useCallback(
    (x: number, y: number, isTouching: boolean) => {
      if (!baseRef.current) return;

      const rect = baseRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = rect.width / 2;

      // Coordenadas relativas ao centro
      const dx = x - centerX;
      const dy = y - centerY;

      // Distância do centro
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Aplicar deadzone
      let normalizedDistance = distance / radius;
      if (normalizedDistance < deadzone) {
        normalizedDistance = 0;
      } else if (normalizedDistance > 1) {
        normalizedDistance = 1;
      }

      // Calcular ângulo (radianos, 0 = direita, π/2 = baixo)
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += Math.PI * 2;

      // Limitar posição visual do thumb ao raio
      const visualDistance = Math.min(distance, radius);
      const ratio = radius > 0 ? visualDistance / radius : 0;

      const newThumbPos = {
        x: (dx / distance) * visualDistance || 0,
        y: (dy / distance) * visualDistance || 0,
      };

      // Atualizar posição visual
      setThumbPos(newThumbPos);

      // Atualizar estado
      const newState: JoystickState = {
        angle: angle,
        force: normalizedDistance,
        dx: dx,
        dy: dy,
        isActive: isTouching,
      };

      joystickStateRef.current = newState;

      // Callback
      if (isTouching && onMove) {
        onMove(newState);
      }
    },
    [deadzone, onMove]
  );

  /**
   * Handler de toque iniciado
   */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!baseRef.current) return;

      const touch = e.touches[0];
      const rect = baseRef.current.getBoundingClientRect();

      setIsActive(true);
      updateJoystickState(touch.clientX - rect.left, touch.clientY - rect.top, true);
    },
    [updateJoystickState]
  );

  /**
   * Handler de toque em movimento
   */
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!baseRef.current || !isActive) return;

      const touch = e.touches[0];
      const rect = baseRef.current.getBoundingClientRect();

      updateJoystickState(touch.clientX - rect.left, touch.clientY - rect.top, true);
    },
    [isActive, updateJoystickState]
  );

  /**
   * Handler de toque finalizado
   */
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();

      setIsActive(false);
      setThumbPos({ x: 0, y: 0 });

      joystickStateRef.current = {
        angle: 0,
        force: 0,
        dx: 0,
        dy: 0,
        isActive: false,
      };

      if (onRelease) {
        onRelease();
      }
    },
    [onRelease]
  );

  /**
   * Handler de mouse (para debug em desktop)
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!baseRef.current) return;

      const rect = baseRef.current.getBoundingClientRect();
      setIsActive(true);
      updateJoystickState(e.clientX - rect.left, e.clientY - rect.top, true);
    },
    [updateJoystickState]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!baseRef.current || !isActive) return;

      const rect = baseRef.current.getBoundingClientRect();
      updateJoystickState(e.clientX - rect.left, e.clientY - rect.top, true);
    },
    [isActive, updateJoystickState]
  );

  const handleMouseUp = useCallback(() => {
    setIsActive(false);
    setThumbPos({ x: 0, y: 0 });

    joystickStateRef.current = {
      angle: 0,
      force: 0,
      dx: 0,
      dy: 0,
      isActive: false,
    };

    if (onRelease) {
      onRelease();
    }
  }, [onRelease]);

  useEffect(() => {
    if (isActive) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isActive, handleMouseMove, handleMouseUp]);

  // Posicionamento do container
  const positionClasses = {
    left: 'bottom-6 left-6',
    right: 'bottom-6 right-6',
    center: 'bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2',
  };

  const baseSize = size;
  const thumbSize = size * 0.4;

  return (
    <div
      ref={containerRef}
      className={`fixed ${positionClasses[position]} pointer-events-none z-40`}
    >
      <div
        ref={baseRef}
        className="pointer-events-auto relative rounded-full shadow-2xl cursor-grab active:cursor-grabbing transition-transform"
        style={{
          width: baseSize,
          height: baseSize,
          backgroundColor: isActive ? 'rgba(220, 38, 38, 0.3)' : 'rgba(220, 38, 38, 0.2)',
          border: '2px solid rgba(220, 38, 38, 0.6)',
          boxShadow: isActive
            ? '0 0 30px rgba(220, 38, 38, 0.8), inset 0 0 20px rgba(220, 38, 38, 0.4)'
            : '0 0 15px rgba(220, 38, 38, 0.4)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Marcas de direção (X Y) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            {/* Linha horizontal (X) */}
            <div
              className="absolute top-1/2 left-0 right-0 border-t border-dashed"
              style={{
                borderColor: 'rgba(220, 38, 38, 0.3)',
                transform: 'translateY(-50%)',
              }}
            />
            {/* Linha vertical (Y) */}
            <div
              className="absolute top-0 bottom-0 left-1/2 border-l border-dashed"
              style={{
                borderColor: 'rgba(220, 38, 38, 0.3)',
                transform: 'translateX(-50%)',
              }}
            />
          </div>
        </div>

        {/* Thumb (polegar) - animado com spring */}
        <div
          ref={thumbRef}
          className="absolute rounded-full transition-all"
          style={{
            width: thumbSize,
            height: thumbSize,
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${thumbPos.x}px), calc(-50% + ${thumbPos.y}px))`,
            backgroundColor: isActive
              ? 'rgba(250, 204, 21, 0.9)'
              : 'rgba(250, 204, 21, 0.7)',
            boxShadow: isActive
              ? `0 0 20px rgba(250, 204, 21, 1), 0 0 40px rgba(220, 38, 38, 0.6)`
              : `0 0 10px rgba(250, 204, 21, 0.6)`,
            border: '2px solid rgba(250, 204, 21, 1)',
            transitionProperty: isActive ? 'none' : 'transform box-shadow',
            transitionDuration: '0.1s',
          }}
        />

        {/* Label opcional */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs text-red-300 opacity-50 font-mono select-none">
              {position === 'left' ? 'MOVE' : 'ACT'}
            </span>
          </div>
        )}

        {/* Indicador de força (força radial) */}
        {isActive && joystickStateRef.current.force > 0 && (
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${baseSize * joystickStateRef.current.force * 0.9}px`,
              height: `${baseSize * joystickStateRef.current.force * 0.9}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              opacity: 0.5,
            }}
          />
        )}
      </div>

      {/* Debug overlay (desenvolvedores) */}
      {isActive && (
        <div
          className="absolute bottom-full mb-2 text-xs text-yellow-300 font-mono pointer-events-none whitespace-nowrap"
          style={{
            left: position === 'center' ? '50%' : undefined,
            transform: position === 'center' ? 'translateX(-50%)' : undefined,
          }}
        >
          <div>θ: {((joystickStateRef.current.angle * 180) / Math.PI).toFixed(0)}°</div>
          <div>F: {joystickStateRef.current.force.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
};

export default VirtualJoystick;
