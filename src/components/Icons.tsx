interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const base = {
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function CheckIcon({ size = 18, color = 'currentColor', strokeWidth = 2.6 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={strokeWidth} {...base} aria-hidden="true">
      <path d="M5 12.5 L10 17.5 L19 7" />
    </svg>
  );
}

export function ChatIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...base} aria-hidden="true">
      <path d="M5 4 H19 A2 2 0 0 1 21 6 V14 A2 2 0 0 1 19 16 H11 L7 20 V16 H5 A2 2 0 0 1 3 14 V6 A2 2 0 0 1 5 4 Z" />
    </svg>
  );
}

export function MailIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...base} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7 L12 13 L21 7" />
    </svg>
  );
}

export function InstagramIcon({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...base} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5 H17.51" />
    </svg>
  );
}

export function ArrowUpIcon({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2.2} {...base} aria-hidden="true">
      <path d="M12 19 V5 M6 11 L12 5 L18 11" />
    </svg>
  );
}

export function ExternalIcon({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2.2} {...base} aria-hidden="true">
      <path d="M7 17 L17 7 M9 7 H17 V15" />
    </svg>
  );
}

export function DragIcon({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...base} aria-hidden="true">
      <path d="M4 12 H20 M4 12 L7 9 M4 12 L7 15 M20 12 L17 9 M20 12 L17 15" />
    </svg>
  );
}

/** Flat brand cube (header, footer, small marks). */
export function LogoCube({ size = 40, letters = true }: { size?: number; letters?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <polygon points="32,4 56,18 32,32 8,18" fill="#A9CBF5" />
      <polygon points="8,18 32,32 32,60 8,46" fill="#2F6FC4" />
      <polygon points="32,32 56,18 56,46 32,60" fill="#1B4E96" />
      {letters && (
        <>
          <text transform="matrix(1 -0.5833 1 0.5833 8 18)" x="12" y="19" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="20" fill="#0B1F33">R</text>
          <text transform="matrix(1 0.5833 0 1 8 18)" x="12" y="22" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="22" fill="#FFFFFF">S</text>
          <text transform="matrix(1 -0.5833 0 1 32 32)" x="12" y="22" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="22" fill="#FFFFFF">S</text>
        </>
      )}
    </svg>
  );
}
