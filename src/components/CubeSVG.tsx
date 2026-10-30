/** Static layered cube: shown while the 3D cube loads, or when WebGL is unavailable. */
export default function CubeSVG({ className = '' }: { className?: string }) {
  return (
    <svg className={`cube-svg ${className}`} viewBox="-4 -4 72 72" role="img" aria-label="Cubo da Rock Software Solutions em três camadas">
      <polygon points="8,36.67 32,50.67 32,60 8,46" fill="#14396A" />
      <polygon points="32,50.67 56,36.67 56,46 32,60" fill="#1D5BB5" />
      <polygon points="8,27.33 32,41.33 32,50.67 8,36.67" fill="#14396A" />
      <polygon points="32,41.33 56,27.33 56,36.67 32,50.67" fill="#2163BE" />
      <polygon points="8,18 32,32 32,41.33 8,27.33" fill="#14396A" />
      <polygon points="32,32 56,18 56,27.33 32,41.33" fill="#1D5BB5" />
      <polygon points="32,4 56,18 32,32 8,18" fill="#A9CBF5" />
      <path d="M8 27.33 L32 41.33 L56 27.33 M8 36.67 L32 50.67 L56 36.67" fill="none" stroke="#0B1F33" strokeWidth=".4" opacity=".6" />
      <text transform="matrix(1 -0.5833 1 0.5833 8 18)" x="12" y="19" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="20" fill="#0B1F33">R</text>
      <text transform="matrix(1 0.5833 0 1 8 18)" x="12" y="22" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="22" fill="#FFFFFF">S</text>
      <text transform="matrix(1 -0.5833 0 1 32 32)" x="12" y="22" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="22" fill="#FFFFFF">S</text>
    </svg>
  );
}
