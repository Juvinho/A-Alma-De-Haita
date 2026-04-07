'use client';

import { useEffect, useRef } from 'react';

const FAVICON_OPEN = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" fill="#0a0a0a"/>
  <circle cx="32" cy="32" r="28" stroke="#8b0000" stroke-width="1.5" fill="none" opacity="0.8"/>
  <ellipse cx="32" cy="32" rx="18" ry="10" stroke="#8b0000" stroke-width="1.5" fill="none"/>
  <circle cx="32" cy="32" r="7" fill="#4a0000"/>
  <circle cx="32" cy="32" r="7" stroke="#8b0000" stroke-width="1" fill="none"/>
  <circle cx="32" cy="32" r="3.5" fill="#8b0000"/>
  <circle cx="32" cy="32" r="2" fill="#cc1111" opacity="0.9"/>
</svg>
`)}`;

const FAVICON_WATCHING = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" fill="#0a0a0a"/>
  <circle cx="32" cy="32" r="28" stroke="#8b0000" stroke-width="1.5" fill="none" opacity="0.5"/>
  <ellipse cx="32" cy="36" rx="18" ry="6" stroke="#8b0000" stroke-width="1.5" fill="none"/>
  <ellipse cx="32" cy="28" rx="18" ry="4" fill="#0a0a0a" stroke="none"/>
  <circle cx="32" cy="34" r="4" fill="#4a0000"/>
  <circle cx="32" cy="34" r="2.5" fill="#8b0000"/>
</svg>
`)}`;

const FAVICON_GOLD = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" fill="#0a0800"/>
  <circle cx="32" cy="32" r="28" stroke="#d4a017" stroke-width="1.5" fill="none" opacity="0.8"/>
  <ellipse cx="32" cy="32" rx="18" ry="10" stroke="#d4a017" stroke-width="1.5" fill="none"/>
  <circle cx="32" cy="32" r="7" fill="#3d2900"/>
  <circle cx="32" cy="32" r="7" stroke="#d4a017" stroke-width="1" fill="none"/>
  <circle cx="32" cy="32" r="3.5" fill="#d4a017"/>
  <circle cx="32" cy="32" r="2" fill="#ffcc44" opacity="0.9"/>
</svg>
`)}`;

function setFavicon(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = href;
}

export default function DynamicFavicon() {
  const parousia = useRef(false);

  useEffect(() => {
    setFavicon(FAVICON_OPEN);

    // Check parousia
    if (localStorage.getItem('haita-ascended') === 'true') {
      parousia.current = true;
      setFavicon(FAVICON_GOLD);
    }

    // Watch for parousia event
    function onParousia() {
      parousia.current = true;
      setFavicon(FAVICON_GOLD);
    }
    window.addEventListener('haita-parousia', onParousia);

    // Tab hidden: watching favicon
    function onVisibility() {
      if (parousia.current) return;
      if (document.hidden) {
        setFavicon(FAVICON_WATCHING);
      } else {
        setFavicon(FAVICON_OPEN);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('haita-parousia', onParousia);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return null;
}
