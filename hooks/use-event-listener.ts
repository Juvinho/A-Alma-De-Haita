'use client';

import { useEffect } from 'react';

export function useEventListener(
  eventName: string,
  handler: (event: any) => void,
  element: EventTarget | null = typeof window !== 'undefined' ? window : null
) {
  useEffect(() => {
    if (!element) return;

    element.addEventListener(eventName, handler);

    return () => {
      element.removeEventListener(eventName, handler);
    };
  }, [eventName, handler, element]);
}