'use client';

import { usePathname } from 'next/navigation';
import CustomCursor from '@/components/CustomCursor';
import CornerWhispers from '@/components/CornerWhispers';
import HaitaBackground from '@/components/HaitaBackground';
import AudioToggle from '@/components/AudioToggle';
import InitialWarning from '@/components/InitialWarning';
import HorrorOrchestrator from '@/components/HorrorOrchestrator';
import HaitaTerminal from '@/components/HaitaTerminal';

export default function AppShellEffects() {
  const pathname = usePathname();

  const isSilentRoute = pathname?.startsWith('/travessia') || pathname?.startsWith('/eternidade');

  if (isSilentRoute) {
    return null;
  }

  return (
    <>
      <HaitaBackground />
      <CustomCursor />
      <CornerWhispers />
      <AudioToggle />
      <InitialWarning />
      <HorrorOrchestrator />
      <HaitaTerminal />
    </>
  );
}
