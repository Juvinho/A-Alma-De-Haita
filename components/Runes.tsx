export interface RuneProps {
  className?: string;
  color?: string;
}

export function RuneVeil({ className, color = 'currentColor' }: RuneProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="20" y1="0" x2="20" y2="64" stroke={color} strokeWidth="1.5" />
      <line x1="44" y1="0" x2="44" y2="64" stroke={color} strokeWidth="1.5" />
      <path
        d="M 20 32 Q 32 16, 44 32"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

export function RuneEye({ className, color = 'currentColor' }: RuneProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="32" cy="32" rx="18" ry="24" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M 32 16 L 28 32 L 32 48 L 36 32 Z" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="32" cy="32" r="6" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function RuneChain({ className, color = 'currentColor' }: RuneProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 5 links */}
      <circle cx="10" cy="32" r="5" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="22" cy="32" r="5" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="32" cy="32" r="5" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="42" cy="32" r="5" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="54" cy="32" r="5" stroke={color} strokeWidth="1.5" fill="none" />
      
      {/* Connecting lines */}
      <line x1="15" y1="32" x2="17" y2="32" stroke={color} strokeWidth="1.5" />
      <line x1="27" y1="32" x2="27" y2="32" stroke={color} strokeWidth="1.5" />
      <line x1="37" y1="32" x2="37" y2="32" stroke={color} strokeWidth="1.5" />
      <line x1="47" y1="32" x2="49" y2="32" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export function RuneBridge({ className, color = 'currentColor' }: RuneProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main arch */}
      <path
        d="M 12 48 Q 32 16, 52 48"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Support lines */}
      <line x1="20" y1="40" x2="20" y2="56" stroke={color} strokeWidth="1.5" />
      <line x1="32" y1="20" x2="32" y2="56" stroke={color} strokeWidth="1.5" />
      <line x1="44" y1="40" x2="44" y2="56" stroke={color} strokeWidth="1.5" />
      
      {/* Crack in middle */}
      <line x1="31" y1="25" x2="33" y2="35" stroke={color} strokeWidth="1.5" />
      <line x1="33" y1="25" x2="31" y2="35" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export function RuneSeal({ className, color = 'currentColor' }: RuneProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="1.5" fill="none" />
      
      {/* Inner geometric pattern */}
      <circle cx="32" cy="32" r="14" stroke={color} strokeWidth="1.5" fill="none" />
      
      {/* Radiating lines */}
      <line x1="32" y1="4" x2="32" y2="12" stroke={color} strokeWidth="1.5" />
      <line x1="32" y1="52" x2="32" y2="60" stroke={color} strokeWidth="1.5" />
      <line x1="4" y1="32" x2="12" y2="32" stroke={color} strokeWidth="1.5" />
      <line x1="52" y1="32" x2="60" y2="32" stroke={color} strokeWidth="1.5" />
      
      {/* Diagonal radiating */}
      <line x1="15" y1="15" x2="20" y2="20" stroke={color} strokeWidth="1.5" />
      <line x1="49" y1="49" x2="44" y2="44" stroke={color} strokeWidth="1.5" />
      <line x1="49" y1="15" x2="44" y2="20" stroke={color} strokeWidth="1.5" />
      <line x1="15" y1="49" x2="20" y2="44" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export function RuneWrath({ className, color = 'currentColor' }: RuneProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="32" cy="32" r="12" stroke={color} strokeWidth="1.5" fill="none" />
      
      {/* Irregular rays */}
      <line x1="32" y1="20" x2="32" y2="8" stroke={color} strokeWidth="1.5" />
      <line x1="32" y1="44" x2="32" y2="56" stroke={color} strokeWidth="1.5" />
      <line x1="20" y1="32" x2="8" y2="32" stroke={color} strokeWidth="1.5" />
      <line x1="44" y1="32" x2="56" y2="32" stroke={color} strokeWidth="1.5" />
      
      {/* Diagonal rays */}
      <line x1="27" y1="27" x2="18" y2="18" stroke={color} strokeWidth="1.5" />
      <line x1="37" y1="37" x2="46" y2="46" stroke={color} strokeWidth="1.5" />
      <line x1="37" y1="27" x2="46" y2="18" stroke={color} strokeWidth="1.5" />
      <line x1="27" y1="37" x2="18" y2="46" stroke={color} strokeWidth="1.5" />
      
      {/* Extra offset rays for chaos */}
      <line x1="32" y1="22" x2="32" y2="6" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="24" y1="32" x2="8" y2="32" stroke={color} strokeWidth="1" opacity="0.6" />
    </svg>
  );
}