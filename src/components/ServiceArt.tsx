import { motion } from 'motion/react';
import type { ServiceId } from '../data';

/*
  Small looping illustrations, one per service. All drawn on a 520 × 380 board.
*/

const loop = { repeat: Infinity, repeatDelay: 1.4 };
const ease = [0.22, 1, 0.36, 1] as const;
const grow = { transformBox: 'fill-box' as const, transformOrigin: '50% 100%' };

function Window({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <g>
      <rect x="20" y="20" width="480" height="340" rx="18" fill="#0F2944" stroke="#24476C" />
      <circle cx="44" cy="44" r="5" fill="#FF5F57" />
      <circle cx="62" cy="44" r="5" fill="#FEBC2E" />
      <circle cx="80" cy="44" r="5" fill="#28C840" />
      {title && (
        <>
          <rect x="160" y="34" width="200" height="20" rx="10" fill="#0B1F33" />
          <text x="260" y="48" textAnchor="middle" fontSize="11" fontFamily="Manrope, sans-serif" fill="#7F97B2">
            {title}
          </text>
        </>
      )}
      {children}
    </g>
  );
}

function Sistemas() {
  const bars = [70, 120, 95, 150, 125, 175, 140, 190];
  return (
    <Window>
      <rect x="20" y="64" width="100" height="296" fill="#0C2239" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="36" y={88 + i * 30} width={i === 1 ? 70 : 56} height="12" rx="6" fill={i === 1 ? '#7FB1EC' : '#24476C'} />
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={140 + i * 118} y="80" width="104" height="62" rx="10" fill="#0B1F33" stroke="#24476C" />
          <rect x={154 + i * 118} y="94" width="40" height="8" rx="4" fill="#3A5D82" />
          <motion.rect
            x={154 + i * 118}
            y="114"
            height="14"
            rx="7"
            fill={i === 1 ? '#7FB1EC' : '#2F6FC4'}
            initial={{ width: 0 }}
            animate={{ width: [0, 60 + i * 8] }}
            transition={{ duration: 1, delay: 0.2 + i * 0.12, ease, ...loop }}
          />
        </g>
      ))}
      <rect x="140" y="160" width="340" height="180" rx="12" fill="#0B1F33" stroke="#24476C" />
      {bars.map((h, i) => (
        <motion.rect
          key={i}
          x={162 + i * 39}
          y={322 - h * 0.75}
          width="22"
          height={h * 0.75}
          rx="5"
          fill={i === 5 ? '#7FB1EC' : '#1D5BB5'}
          style={grow}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [0, 1] }}
          transition={{ duration: 0.8, delay: 0.4 + i * 0.07, ease, ...loop }}
        />
      ))}
      <motion.path
        d="M162 290 L201 262 L240 274 L279 236 L318 248 L357 208 L396 222 L440 186"
        fill="none"
        stroke="#A9CBF5"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1] }}
        transition={{ duration: 1.4, delay: 0.9, ease, ...loop }}
      />
    </Window>
  );
}

function Sites() {
  const t = { duration: 5.2, repeat: Infinity, ease: 'easeInOut' as const };
  const pop = (start: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: [0, 0, 1, 1, 0], y: [12, 12, 0, 0, 0] },
    transition: { ...t, times: [0, start, start + 0.08, 0.92, 1] },
  });
  return (
    <Window title="suaempresa.com.br">
      <motion.g {...pop(0.02)}>
        <rect x="44" y="76" width="70" height="12" rx="6" fill="#7FB1EC" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={330 + i * 50} y="78" width="36" height="8" rx="4" fill="#3A5D82" />
        ))}
      </motion.g>
      <motion.g {...pop(0.1)}>
        <rect x="44" y="118" width="230" height="22" rx="6" fill="#E6EEF7" />
        <rect x="44" y="148" width="180" height="22" rx="6" fill="#E6EEF7" />
        <rect x="44" y="184" width="200" height="9" rx="4.5" fill="#3A5D82" />
        <rect x="44" y="200" width="160" height="9" rx="4.5" fill="#3A5D82" />
      </motion.g>
      <motion.g {...pop(0.18)}>
        <rect x="44" y="224" width="120" height="34" rx="10" fill="#1D5BB5" />
        <rect x="66" y="237" width="76" height="8" rx="4" fill="#FFFFFF" />
      </motion.g>
      <motion.g {...pop(0.14)}>
        <rect x="300" y="112" width="176" height="146" rx="14" fill="#14396A" />
        <polygon points="388,140 430,164 388,188 346,164" fill="#7FB1EC" />
        <polygon points="346,164 388,188 388,230 346,206" fill="#2F6FC4" />
        <polygon points="388,188 430,164 430,206 388,230" fill="#1D5BB5" />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.g key={i} {...pop(0.26 + i * 0.05)}>
          <rect x={44 + i * 148} y="280" width="136" height="60" rx="10" fill="#0B1F33" stroke="#24476C" />
          <rect x={58 + i * 148} y="294" width="60" height="8" rx="4" fill="#7FB1EC" />
          <rect x={58 + i * 148} y="310" width="96" height="7" rx="3.5" fill="#3A5D82" />
        </motion.g>
      ))}
      <motion.g
        initial={{ x: 300, y: 330, opacity: 0 }}
        animate={{ x: [300, 300, 120, 120, 120], y: [330, 330, 246, 246, 246], opacity: [0, 1, 1, 1, 0] }}
        transition={{ ...t, times: [0, 0.45, 0.62, 0.9, 1] }}
      >
        <path d="M0 0 L0 22 L6 16 L11 27 L15 25 L10 14 L18 14 Z" fill="#FFFFFF" stroke="#0B1F33" strokeWidth="1.5" />
      </motion.g>
      <motion.circle
        cx="104"
        cy="241"
        r="10"
        fill="none"
        stroke="#A9CBF5"
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 0, 2.6], opacity: [0, 0.9, 0] }}
        transition={{ ...t, times: [0, 0.63, 0.78] }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
    </Window>
  );
}

function Apps() {
  const t = { duration: 5, repeat: Infinity, ease: 'easeInOut' as const };
  return (
    <g>
      <rect x="182" y="14" width="156" height="352" rx="30" fill="#0F2944" stroke="#24476C" strokeWidth="2" />
      <rect x="236" y="26" width="48" height="8" rx="4" fill="#0B1F33" />
      <rect x="198" y="50" width="70" height="10" rx="5" fill="#E6EEF7" />
      <rect x="198" y="66" width="46" height="7" rx="3.5" fill="#3A5D82" />
      {[0, 1, 2, 3].map((i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: [0, 1, 1, 0], x: [24, 0, 0, 0] }}
          transition={{ ...t, times: [0, 0.12 + i * 0.06, 0.92, 1] }}
        >
          <rect x="198" y={92 + i * 56} width="124" height="46" rx="10" fill="#0B1F33" stroke="#24476C" />
          <rect x="208" y={102 + i * 56} width="26" height="26" rx="8" fill={i === 0 ? '#1D5BB5' : '#14396A'} />
          <rect x="242" y={106 + i * 56} width="60" height="7" rx="3.5" fill="#A9BBCF" />
          <rect x="242" y={118 + i * 56} width="40" height="6" rx="3" fill="#3A5D82" />
        </motion.g>
      ))}
      <motion.circle
        cx="306"
        cy="334"
        r="14"
        fill="#1D5BB5"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      <path d="M300 334 H312 M306 328 V340" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <motion.g
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: [-70, -70, 0, 0, -70], opacity: [0, 0, 1, 1, 0] }}
        transition={{ ...t, times: [0, 0.4, 0.5, 0.85, 0.95] }}
      >
        <rect x="96" y="40" width="328" height="58" rx="16" fill="#E6EEF7" />
        <circle cx="126" cy="69" r="15" fill="#1D5BB5" />
        <path d="M119 69 L124 74 L133 64" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="152" y="65" fontSize="14" fontWeight="800" fontFamily="Manrope, sans-serif" fill="#0B1F33">
          Vistoria enviada
        </text>
        <text x="152" y="83" fontSize="12" fontWeight="600" fontFamily="Manrope, sans-serif" fill="#4A5B6C">
          Fotos e assinatura salvas no sistema
        </text>
      </motion.g>
      <g opacity=".9">
        <rect x="40" y="250" width="110" height="80" rx="14" fill="#0F2944" stroke="#24476C" />
        <motion.path
          d="M56 304 C70 280, 82 318, 96 296 S120 282, 134 300"
          fill="none"
          stroke="#7FB1EC"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.2, times: [0, 0.6, 1] }}
        />
        <rect x="56" y="312" width="78" height="2" fill="#3A5D82" />
      </g>
      <g opacity=".9">
        <rect x="372" y="250" width="110" height="80" rx="14" fill="#0F2944" stroke="#24476C" />
        <circle cx="427" cy="286" r="16" fill="none" stroke="#7FB1EC" strokeWidth="3" />
        <motion.circle
          cx="427"
          cy="286"
          r="16"
          fill="none"
          stroke="#7FB1EC"
          strokeWidth="2"
          animate={{ scale: [1, 1.9], opacity: [0.8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <circle cx="427" cy="286" r="5" fill="#7FB1EC" />
      </g>
    </g>
  );
}

function Integracoes() {
  const nodes = [
    { x: 90, y: 92, label: 'ERP' },
    { x: 430, y: 92, label: 'Banco' },
    { x: 90, y: 300, label: 'Pagamentos' },
    { x: 430, y: 300, label: 'WhatsApp' },
  ];
  const cx = 260;
  const cy = 196;
  return (
    <g>
      {nodes.map((n, i) => (
        <g key={n.label}>
          <motion.line
            x1={n.x}
            y1={n.y}
            x2={cx}
            y2={cy}
            stroke="#24476C"
            strokeWidth="2"
            strokeDasharray="6 8"
            animate={{ strokeDashoffset: [0, -28] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.circle
            r="5"
            fill="#7FB1EC"
            animate={{ cx: i % 2 ? [n.x, cx] : [cx, n.x], cy: i % 2 ? [n.y, cy] : [cy, n.y], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.45, ease: 'easeInOut', times: [0, 0.15, 0.85, 1] }}
          />
        </g>
      ))}
      {nodes.map((n) => (
        <g key={n.label + 'box'}>
          <rect x={n.x - 64} y={n.y - 26} width="128" height="52" rx="14" fill="#0F2944" stroke="#24476C" />
          <text x={n.x} y={n.y + 6} textAnchor="middle" fontSize="16" fontWeight="800" fontFamily="Manrope, sans-serif" fill="#E6EEF7">
            {n.label}
          </text>
        </g>
      ))}
      <motion.circle
        cx={cx}
        cy={cy}
        r="58"
        fill="none"
        stroke="#1D5BB5"
        strokeWidth="2"
        animate={{ scale: [1, 1.25], opacity: [0.7, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      <circle cx={cx} cy={cy} r="58" fill="#0B1F33" stroke="#2F6FC4" strokeWidth="2" />
      <g transform={`translate(${cx - 30} ${cy - 30}) scale(0.94)`}>
        <polygon points="32,4 56,18 32,32 8,18" fill="#A9CBF5" />
        <polygon points="8,18 32,32 32,60 8,46" fill="#2F6FC4" />
        <polygon points="32,32 56,18 56,46 32,60" fill="#1B4E96" />
      </g>
    </g>
  );
}

const arts: Record<ServiceId, () => React.ReactElement> = {
  sistemas: Sistemas,
  sites: Sites,
  apps: Apps,
  integracoes: Integracoes,
};

export default function ServiceArt({ id }: { id: ServiceId }) {
  const Art = arts[id];
  return (
    <svg className="service-art" viewBox="0 0 520 380" aria-hidden="true">
      <Art />
    </svg>
  );
}
