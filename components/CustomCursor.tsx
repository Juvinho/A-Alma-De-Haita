'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let x = -100, y = -100;
    let raf: number;

    function update() {
      if (cursor) {
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
      }
      raf = requestAnimationFrame(update);
    }

    function onMove(e: MouseEvent) {
      x = e.clientX;
      y = e.clientY;
    }

    function onEnter(e: MouseEvent) {
      const target = e.target as Element;
      if (target.matches('a, button, [role="button"], input, label')) {
        setHovering(true);
      }
    }

    function onLeave(e: MouseEvent) {
      const target = e.target as Element;
      if (target.matches('a, button, [role="button"], input, label')) {
        setHovering(false);
      }
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onEnter);
    window.addEventListener('mouseout', onLeave);
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onEnter);
      window.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`cursor-custom ${hovering ? 'hovering' : ''}`}
    />
  );
}
