// ═══════════════════════════════════════════════════════════
// STUDY ILLUSTRATIONS — Inline SVG diagrams for study material
// Maps section titles → visual diagrams for key concepts
// ═══════════════════════════════════════════════════════════

import { useTheme } from '../../theme/ThemeContext';

// ── HELPER: themed wrapper ──────────────────────────────
function DiagramBox({ children, caption }) {
  const { theme } = useTheme();
  return (
    <div style={{
      margin: '16px 0',
      padding: 16,
      background: theme.primaryLight,
      borderRadius: 12,
      border: `1px solid ${theme.border}`,
    }}>
      {children}
      {caption && (
        <div style={{
          marginTop: 10, fontSize: 12, color: theme.textMuted,
          textAlign: 'center', fontStyle: 'italic', lineHeight: 1.4,
        }}>
          {caption}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 1. THE IMAGING CHAIN — equipment: "The Big Picture"
// ═══════════════════════════════════════════════════════════
function ImagingChain() {
  const { theme } = useTheme();
  const boxes = [
    { label: 'X-Ray Tube', icon: '⚡', sub: 'Produces x-rays' },
    { label: 'Filters', icon: '🔲', sub: 'Clean & aim beam' },
    { label: 'Patient', icon: '🧍', sub: 'Creates shadow' },
    { label: 'Receptor', icon: '📡', sub: 'II or flat panel' },
    { label: 'Processing', icon: '🖥️', sub: 'Signal → image' },
    { label: 'Display', icon: '🖵', sub: 'Monitor' },
    { label: 'Your Eyes', icon: '👁️', sub: 'Final link' },
  ];
  return (
    <DiagramBox caption="The fluoroscopy imaging chain — every topic maps to one of these links">
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 600, gap: 0, justifyContent: 'center' }}>
          {boxes.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                background: theme.surface,
                border: `2px solid ${theme.primary}`,
                borderRadius: 10,
                padding: '8px 10px',
                textAlign: 'center',
                minWidth: 70,
              }}>
                <div style={{ fontSize: 20 }}>{b.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: theme.text, marginTop: 2 }}>{b.label}</div>
                <div style={{ fontSize: 9, color: theme.textMuted, marginTop: 1 }}>{b.sub}</div>
              </div>
              {i < boxes.length - 1 && (
                <svg width="20" height="20" style={{ flexShrink: 0 }}>
                  <polygon points="4,6 16,10 4,14" fill={theme.primary} />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 2. X-RAY TUBE CROSS SECTION
// ═══════════════════════════════════════════════════════════
function XRayTubeDiagram() {
  const { theme } = useTheme();
  const primary = theme.primary;
  const text = theme.text;
  const muted = theme.textMuted;
  return (
    <DiagramBox caption="X-ray tube — electrons from heated cathode strike the spinning anode, producing x-rays">
      <svg viewBox="0 0 400 200" width="100%" style={{ maxWidth: 440 }}>
        {/* Tube housing */}
        <rect x="30" y="30" width="340" height="140" rx="20" fill="none" stroke={muted} strokeWidth="2" strokeDasharray="6,4" />
        <text x="200" y="22" textAnchor="middle" fontSize="11" fill={muted} fontWeight="600">Vacuum Tube Housing</text>
        {/* Cathode side */}
        <rect x="60" y="70" width="60" height="60" rx="6" fill={primary + '22'} stroke={primary} strokeWidth="2" />
        <text x="90" y="95" textAnchor="middle" fontSize="11" fill={text} fontWeight="700">Cathode</text>
        <text x="90" y="110" textAnchor="middle" fontSize="9" fill={muted}>Filament</text>
        <text x="90" y="122" textAnchor="middle" fontSize="8" fill={muted}>(tungsten)</text>
        {/* Electron beam */}
        <line x1="120" y1="100" x2="250" y2="100" stroke={theme.warning} strokeWidth="3" strokeDasharray="8,4" />
        <polygon points="250,94 264,100 250,106" fill={theme.warning} />
        <text x="185" y="90" textAnchor="middle" fontSize="9" fill={theme.warning} fontWeight="600">Electrons →</text>
        {/* Anode side */}
        <circle cx="290" cy="100" r="40" fill={primary + '15'} stroke={primary} strokeWidth="2" />
        <text x="290" y="96" textAnchor="middle" fontSize="11" fill={text} fontWeight="700">Anode</text>
        <text x="290" y="110" textAnchor="middle" fontSize="9" fill={muted}>Spinning disc</text>
        {/* X-ray arrows coming from anode */}
        <line x1="310" y1="68" x2="340" y2="40" stroke={theme.error} strokeWidth="2" />
        <line x1="325" y1="80" x2="360" y2="60" stroke={theme.error} strokeWidth="2" />
        <line x1="330" y1="100" x2="370" y2="100" stroke={theme.error} strokeWidth="2" />
        <text x="370" y="48" fontSize="10" fill={theme.error} fontWeight="700">X-rays</text>
        {/* Labels */}
        <text x="90" y="155" textAnchor="middle" fontSize="9" fill={muted}>− (negative)</text>
        <text x="290" y="155" textAnchor="middle" fontSize="9" fill={muted}>+ (positive)</text>
        {/* Heat label */}
        <text x="290" y="170" textAnchor="middle" fontSize="8" fill={theme.error}>~99% heat, ~1% x-rays</text>
      </svg>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 3. IMAGE INTENSIFIER CROSS-SECTION
// ═══════════════════════════════════════════════════════════
function ImageIntensifierDiagram() {
  const { theme } = useTheme();
  const p = theme.primary;
  const t = theme.text;
  const m = theme.textMuted;
  return (
    <DiagramBox caption="Image intensifier — converts faint x-ray shadow into bright visible image (5,000-20,000× amplification)">
      <svg viewBox="0 0 420 220" width="100%" style={{ maxWidth: 460 }}>
        {/* II body - tapered shape */}
        <path d="M 40,20 L 100,10 L 320,10 L 380,60 L 380,160 L 320,210 L 100,210 L 40,200 Z"
          fill={theme.primaryLight} stroke={p} strokeWidth="2" />
        {/* Input phosphor */}
        <rect x="44" y="30" width="20" height="160" rx="4" fill={theme.success + '33'} stroke={theme.success} strokeWidth="1.5" />
        <text x="54" y="115" textAnchor="middle" fontSize="8" fill={theme.success} fontWeight="700"
          transform="rotate(-90 54 115)">Input Phosphor (CsI)</text>
        {/* Photocathode */}
        <rect x="68" y="35" width="10" height="150" rx="2" fill={theme.warning + '44'} stroke={theme.warning} strokeWidth="1" />
        {/* Electrostatic lenses */}
        <ellipse cx="185" cy="110" rx="20" ry="55" fill="none" stroke={m} strokeWidth="1.5" strokeDasharray="4,3" />
        <ellipse cx="230" cy="110" rx="16" ry="45" fill="none" stroke={m} strokeWidth="1.5" strokeDasharray="4,3" />
        <ellipse cx="270" cy="110" rx="12" ry="35" fill="none" stroke={m} strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="225" y="60" textAnchor="middle" fontSize="9" fill={m}>Electrostatic Lenses</text>
        <text x="225" y="72" textAnchor="middle" fontSize="8" fill={m}>(25,000 V)</text>
        {/* Electron paths */}
        <line x1="82" y1="50" x2="340" y2="95" stroke={theme.warning} strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
        <line x1="82" y1="110" x2="340" y2="110" stroke={theme.warning} strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
        <line x1="82" y1="170" x2="340" y2="125" stroke={theme.warning} strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
        {/* Output phosphor */}
        <rect x="340" y="85" width="20" height="50" rx="4" fill={theme.success + '44'} stroke={theme.success} strokeWidth="1.5" />
        <text x="350" y="115" textAnchor="middle" fontSize="7" fill={theme.success} fontWeight="600"
          transform="rotate(-90 350 115)">Output (P20)</text>
        {/* Labels */}
        <text x="54" y="212" textAnchor="middle" fontSize="8" fill={t} fontWeight="600">9" wide</text>
        <text x="350" y="145" textAnchor="middle" fontSize="8" fill={t} fontWeight="600">~1" wide</text>
        {/* X-rays entering */}
        <line x1="10" y1="80" x2="38" y2="80" stroke={theme.error} strokeWidth="2" markerEnd="none" />
        <line x1="10" y1="110" x2="38" y2="110" stroke={theme.error} strokeWidth="2" />
        <line x1="10" y1="140" x2="38" y2="140" stroke={theme.error} strokeWidth="2" />
        <polygon points="38,76 44,80 38,84" fill={theme.error} />
        <polygon points="38,106 44,110 38,114" fill={theme.error} />
        <polygon points="38,136 44,140 38,144" fill={theme.error} />
        <text x="10" y="170" fontSize="9" fill={theme.error} fontWeight="600">X-rays in</text>
        {/* Light output */}
        <line x1="362" y1="110" x2="400" y2="110" stroke={theme.success} strokeWidth="2" />
        <polygon points="400,106 410,110 400,114" fill={theme.success} />
        <text x="380" y="100" fontSize="9" fill={theme.success} fontWeight="600">Light out</text>
        {/* Gain formula */}
        <text x="210" y="195" textAnchor="middle" fontSize="10" fill={t} fontWeight="700">
          Brightness Gain = Minification × Flux
        </text>
        <text x="210" y="208" textAnchor="middle" fontSize="9" fill={m}>
          (9/1)² × 50 = 4,050× typical
        </text>
      </svg>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 4. FLAT PANEL DETECTOR LAYERS
// ═══════════════════════════════════════════════════════════
function FlatPanelDiagram() {
  const { theme } = useTheme();
  const p = theme.primary;
  const t = theme.text;
  const m = theme.textMuted;
  return (
    <DiagramBox caption="Flat panel detector — fewer conversion steps than II, no geometric distortion">
      <svg viewBox="0 0 380 220" width="100%" style={{ maxWidth: 400 }}>
        {/* X-rays coming down */}
        <line x1="120" y1="10" x2="120" y2="45" stroke={theme.error} strokeWidth="2" />
        <line x1="190" y1="10" x2="190" y2="45" stroke={theme.error} strokeWidth="2" />
        <line x1="260" y1="10" x2="260" y2="45" stroke={theme.error} strokeWidth="2" />
        <polygon points="116,42 120,52 124,42" fill={theme.error} />
        <polygon points="186,42 190,52 192,42" fill={theme.error} />
        <polygon points="256,42 260,52 264,42" fill={theme.error} />
        <text x="190" y="18" textAnchor="middle" fontSize="10" fill={theme.error} fontWeight="600">X-rays ↓</text>
        {/* Layer 1 - Scintillator */}
        <rect x="60" y="52" width="260" height="35" rx="4" fill={theme.success + '25'} stroke={theme.success} strokeWidth="2" />
        <text x="190" y="72" textAnchor="middle" fontSize="11" fill={t} fontWeight="700">Scintillator (CsI)</text>
        <text x="190" y="84" textAnchor="middle" fontSize="8" fill={m}>X-ray → Light</text>
        {/* Arrow */}
        <line x1="190" y1="87" x2="190" y2="100" stroke={theme.success} strokeWidth="2" />
        <polygon points="186,98 190,106 194,98" fill={theme.success} />
        {/* Layer 2 - Photodiode array */}
        <rect x="60" y="106" width="260" height="35" rx="4" fill={theme.warning + '25'} stroke={theme.warning} strokeWidth="2" />
        <text x="190" y="126" textAnchor="middle" fontSize="11" fill={t} fontWeight="700">Photodiode Array (a-Si)</text>
        <text x="190" y="138" textAnchor="middle" fontSize="8" fill={m}>Light → Electrical charge</text>
        {/* Arrow */}
        <line x1="190" y1="141" x2="190" y2="154" stroke={theme.warning} strokeWidth="2" />
        <polygon points="186,152 190,160 194,152" fill={theme.warning} />
        {/* Layer 3 - TFT readout */}
        <rect x="60" y="160" width="260" height="35" rx="4" fill={p + '25'} stroke={p} strokeWidth="2" />
        <text x="190" y="180" textAnchor="middle" fontSize="11" fill={t} fontWeight="700">TFT Switches (readout)</text>
        <text x="190" y="192" textAnchor="middle" fontSize="8" fill={m}>Charge → Digital signal</text>
        {/* Output */}
        <line x1="190" y1="195" x2="190" y2="210" stroke={p} strokeWidth="2" />
        <polygon points="186,208 190,216 194,208" fill={p} />
        <text x="190" y="218" textAnchor="middle" fontSize="9" fill={p} fontWeight="600" dominantBaseline="hanging">→ Digital Image</text>
        {/* Side annotation - DEL size */}
        <text x="345" y="130" fontSize="9" fill={m} fontWeight="500">DEL size:</text>
        <text x="345" y="143" fontSize="9" fill={m}>200–1,400 μm</text>
      </svg>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 5. C-ARM GEOMETRY
// ═══════════════════════════════════════════════════════════
function CArmDiagram() {
  const { theme } = useTheme();
  const p = theme.primary;
  const t = theme.text;
  const m = theme.textMuted;
  return (
    <DiagramBox caption="C-arm configuration — tube below (less operator scatter), receptor above (close to patient)">
      <svg viewBox="0 0 320 260" width="100%" style={{ maxWidth: 340 }}>
        {/* C-arm arc */}
        <path d="M 90,220 Q 30,120 90,30 L 230,30 Q 290,120 230,220"
          fill="none" stroke={m} strokeWidth="4" />
        {/* Tube at bottom */}
        <rect x="110" y="205" width="100" height="35" rx="6" fill={theme.error + '22'} stroke={theme.error} strokeWidth="2" />
        <text x="160" y="225" textAnchor="middle" fontSize="11" fill={t} fontWeight="700">X-Ray Tube</text>
        <text x="160" y="250" textAnchor="middle" fontSize="9" fill={theme.error}>⚡ Below table</text>
        {/* Receptor at top */}
        <rect x="110" y="20" width="100" height="30" rx="6" fill={theme.success + '22'} stroke={theme.success} strokeWidth="2" />
        <text x="160" y="40" textAnchor="middle" fontSize="11" fill={t} fontWeight="700">Receptor</text>
        <text x="160" y="14" textAnchor="middle" fontSize="9" fill={theme.success}>II or FPD ↑</text>
        {/* Patient on table */}
        <rect x="80" y="115" width="160" height="12" rx="2" fill={m + '44'} stroke={m} strokeWidth="1" />
        <text x="260" y="125" fontSize="9" fill={m}>Table</text>
        {/* Patient */}
        <ellipse cx="160" cy="100" rx="40" ry="20" fill={p + '22'} stroke={p} strokeWidth="1.5" />
        <text x="160" y="104" textAnchor="middle" fontSize="10" fill={t} fontWeight="600">Patient</text>
        {/* Beam */}
        <line x1="140" y1="205" x2="120" y2="130" stroke={theme.error} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
        <line x1="160" y1="205" x2="160" y2="130" stroke={theme.error} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
        <line x1="180" y1="205" x2="200" y2="130" stroke={theme.error} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
        {/* Scatter arrows */}
        <line x1="120" y1="95" x2="60" y2="70" stroke={theme.warning} strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="120" y1="100" x2="55" y2="110" stroke={theme.warning} strokeWidth="1.5" strokeDasharray="3,3" />
        <line x1="120" y1="105" x2="60" y2="140" stroke={theme.warning} strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="30" y="105" fontSize="8" fill={theme.warning} fontWeight="600">Scatter</text>
        {/* Distances */}
        <text x="280" y="175" fontSize="9" fill={m} fontWeight="500">Min SSD:</text>
        <text x="280" y="188" fontSize="9" fill={t} fontWeight="700">Fixed: 18"</text>
        <text x="280" y="201" fontSize="9" fill={t} fontWeight="700">Mobile: 12"</text>
      </svg>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 6. TIME-DISTANCE-SHIELDING TRIANGLE
// ═══════════════════════════════════════════════════════════
function TDSTriangle() {
  const { theme } = useTheme();
  const p = theme.primary;
  const t = theme.text;
  const m = theme.textMuted;
  return (
    <DiagramBox caption="The three pillars of radiation protection — ALARA in practice">
      <svg viewBox="0 0 320 220" width="100%" style={{ maxWidth: 340 }}>
        {/* Triangle */}
        <polygon points="160,20 40,190 280,190" fill={p + '10'} stroke={p} strokeWidth="2" />
        {/* Center text */}
        <text x="160" y="130" textAnchor="middle" fontSize="14" fill={p} fontWeight="800">ALARA</text>
        <text x="160" y="148" textAnchor="middle" fontSize="9" fill={m}>As Low As Reasonably</text>
        <text x="160" y="160" textAnchor="middle" fontSize="9" fill={m}>Achievable</text>
        {/* Top vertex - TIME */}
        <circle cx="160" cy="20" r="16" fill={theme.error + '22'} stroke={theme.error} strokeWidth="2" />
        <text x="160" y="25" textAnchor="middle" fontSize="10" fill={theme.error} fontWeight="700">⏱️</text>
        <text x="160" y="10" textAnchor="middle" fontSize="11" fill={t} fontWeight="700" dominantBaseline="auto">TIME</text>
        <text x="215" y="55" fontSize="8" fill={m}>Minimize</text>
        <text x="215" y="65" fontSize="8" fill={m}>beam-on time</text>
        {/* Bottom-left - DISTANCE */}
        <circle cx="40" cy="190" r="16" fill={theme.success + '22'} stroke={theme.success} strokeWidth="2" />
        <text x="40" y="195" textAnchor="middle" fontSize="10" fill={theme.success} fontWeight="700">📏</text>
        <text x="40" y="215" textAnchor="middle" fontSize="11" fill={t} fontWeight="700">DISTANCE</text>
        <text x="28" y="170" fontSize="8" fill={m} textAnchor="end">Inverse square</text>
        <text x="28" y="180" fontSize="8" fill={m} textAnchor="end">law: 2× dist = ¼ dose</text>
        {/* Bottom-right - SHIELDING */}
        <circle cx="280" cy="190" r="16" fill={theme.warning + '22'} stroke={theme.warning} strokeWidth="2" />
        <text x="280" y="195" textAnchor="middle" fontSize="10" fill={theme.warning} fontWeight="700">🛡️</text>
        <text x="280" y="215" textAnchor="middle" fontSize="11" fill={t} fontWeight="700">SHIELDING</text>
        <text x="295" y="170" fontSize="8" fill={m}>Lead aprons,</text>
        <text x="295" y="180" fontSize="8" fill={m}>thyroid shields</text>
      </svg>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 7. SCATTER RADIATION PATTERN
// ═══════════════════════════════════════════════════════════
function ScatterDiagram() {
  const { theme } = useTheme();
  const m = theme.textMuted;
  const t = theme.text;
  return (
    <DiagramBox caption="The patient is your primary radiation source — scatter radiates in all directions">
      <svg viewBox="0 0 360 200" width="100%" style={{ maxWidth: 380 }}>
        {/* Patient circle */}
        <circle cx="180" cy="100" r="30" fill={theme.primary + '22'} stroke={theme.primary} strokeWidth="2" />
        <text x="180" y="98" textAnchor="middle" fontSize="10" fill={t} fontWeight="600">Patient</text>
        <text x="180" y="110" textAnchor="middle" fontSize="8" fill={m}>(scatter source)</text>
        {/* Scatter arrows in all directions */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 180 + Math.cos(rad) * 35;
          const y1 = 100 + Math.sin(rad) * 35;
          const x2 = 180 + Math.cos(rad) * 65;
          const y2 = 100 + Math.sin(rad) * 65;
          return (
            <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={theme.warning} strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
          );
        })}
        {/* Distance markers */}
        <circle cx="180" cy="100" r="55" fill="none" stroke={theme.error + '44'} strokeWidth="1" strokeDasharray="4,3" />
        <text x="244" y="62" fontSize="8" fill={theme.error} fontWeight="600">1 ft: 500 mrad/hr</text>
        <circle cx="180" cy="100" r="80" fill="none" stroke={theme.warning + '44'} strokeWidth="1" strokeDasharray="4,3" />
        <text x="270" y="42" fontSize="8" fill={theme.warning} fontWeight="600">3 ft: ~55 mrad/hr</text>
        {/* Operator */}
        <circle cx="310" cy="100" r="14" fill={theme.success + '22'} stroke={theme.success} strokeWidth="1.5" />
        <text x="310" y="104" textAnchor="middle" fontSize="10">🧑‍⚕️</text>
        <text x="310" y="125" textAnchor="middle" fontSize="8" fill={theme.success} fontWeight="600">Operator</text>
        <text x="310" y="136" textAnchor="middle" fontSize="8" fill={m}>Stand back!</text>
      </svg>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 8. PROTECTIVE EQUIPMENT
// ═══════════════════════════════════════════════════════════
function ProtectiveEquipmentDiagram() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  const items = [
    { emoji: '🥽', label: 'Lead Glasses', detail: '0.25 mm Pb', eff: '85–90% reduction', y: 0 },
    { emoji: '🧣', label: 'Thyroid Shield', detail: '0.5 mm Pb', eff: 'Protects thyroid', y: 1 },
    { emoji: '🦺', label: 'Lead Apron', detail: '0.25–0.5 mm Pb', eff: '97–99.9% reduction', y: 2 },
    { emoji: '🧤', label: 'Lead Gloves', detail: '0.25 mm Pb', eff: 'Hand protection', y: 3 },
  ];
  return (
    <DiagramBox caption="Personal protective equipment — your radiation armor">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: theme.surface,
            borderRadius: 10,
            padding: '10px 12px',
            border: `1px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>{item.emoji}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t }}>{item.label}</div>
              <div style={{ fontSize: 11, color: theme.primary, fontWeight: 600 }}>{item.detail}</div>
              <div style={{ fontSize: 10, color: m }}>{item.eff}</div>
            </div>
          </div>
        ))}
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 9. DOSE LIMITS — 5/15/50 VISUAL
// ═══════════════════════════════════════════════════════════
function DoseLimitsDiagram() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  const bars = [
    { label: 'Whole Body', val: 5, unit: 'rem/yr', color: theme.error, w: 10 },
    { label: 'Eye Lens', val: 15, unit: 'rem/yr', color: theme.warning, w: 30 },
    { label: 'Skin/Extremities', val: 50, unit: 'rem/yr', color: theme.success, w: 100 },
  ];
  return (
    <DiagramBox caption="Annual occupational dose limits — the 5-15-50 pattern">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
        {bars.map((b, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: t }}>{b.label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: b.color }}>{b.val} {b.unit}</span>
            </div>
            <div style={{ height: 20, background: theme.border, borderRadius: 6, overflow: 'hidden' }}>
              <div style={{
                width: `${b.w}%`, height: '100%', background: b.color,
                borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 10, color: '#FFF', fontWeight: 700 }}>{b.val * 10} mSv</span>
              </div>
            </div>
          </div>
        ))}
        <div style={{
          marginTop: 4, padding: '8px 12px', background: theme.surface,
          borderRadius: 8, border: `1px solid ${theme.border}`,
        }}>
          <div style={{ fontSize: 11, color: m, textAlign: 'center' }}>
            <strong style={{ color: t }}>Under 18:</strong> 10% of all limits &nbsp;|&nbsp;
            <strong style={{ color: t }}>Lifetime:</strong> 1 rem × age
          </div>
        </div>
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 10. DOSE RATE LIMITS — 5/10/20
// ═══════════════════════════════════════════════════════════
function DoseRateLimitsDiagram() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  const levels = [
    { label: 'Standard (no ABC)', max: '5 R/min', color: theme.success, pct: 25 },
    { label: 'With ABC', max: '10 R/min', color: theme.warning, pct: 50 },
    { label: 'High-Level / Boost', max: '20 R/min', color: theme.error, pct: 100 },
  ];
  return (
    <DiagramBox caption="Equipment dose rate limits at the tabletop — the 5-10-20 pattern">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {levels.map((lv, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 12px', borderRadius: 10, background: theme.surface,
            border: `1px solid ${lv.color}33`,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: lv.color + '22',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${lv.color}`, flexShrink: 0,
            }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: lv.color }}>{i + 1}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t }}>{lv.label}</div>
              <div style={{ fontSize: 12, color: m, marginTop: 2 }}>Max: <strong style={{ color: lv.color }}>{lv.max}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 11. CELL DAMAGE CHAIN — radbio
// ═══════════════════════════════════════════════════════════
function CellDamageChain() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  const steps = [
    { icon: '☢️', label: 'Radiation Photon', sub: 'enters body' },
    { icon: '⚛️', label: 'Ionization', sub: 'electrons knocked off' },
    { icon: '💧', label: 'Free Radicals', sub: 'from water molecules' },
    { icon: '🧬', label: 'DNA Damage', sub: 'strand breaks' },
    { icon: '🔧', label: 'Cell Response', sub: 'repair attempted' },
  ];
  return (
    <DiagramBox caption="The chain of radiation damage — from photon to biological effect">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: theme.surface, borderRadius: 10, padding: '8px 16px',
              border: `1px solid ${theme.border}`, minWidth: 220,
            }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t }}>{s.label}</div>
                <div style={{ fontSize: 11, color: m }}>{s.sub}</div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <svg width="20" height="16">
                <polygon points="6,2 14,2 10,14" fill={theme.primary} />
              </svg>
            )}
          </div>
        ))}
        {/* Fork at the end */}
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <div style={{
            background: theme.successBg, borderRadius: 10, padding: '8px 14px',
            textAlign: 'center', border: `2px solid ${theme.success}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.success }}>✓ Repair succeeds</div>
            <div style={{ fontSize: 10, color: m }}>No harm</div>
          </div>
          <div style={{
            background: theme.errorBg, borderRadius: 10, padding: '8px 14px',
            textAlign: 'center', border: `2px solid ${theme.error}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.error }}>✕ Repair fails</div>
            <div style={{ fontSize: 10, color: m }}>Cell death or mutation</div>
          </div>
        </div>
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 12. DETERMINISTIC vs STOCHASTIC
// ═══════════════════════════════════════════════════════════
function DetermStochDiagram() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  return (
    <DiagramBox caption="Two types of radiation effects — threshold vs. no-threshold">
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {/* Deterministic */}
        <div style={{
          flex: '1 1 140px', background: theme.surface, borderRadius: 12,
          padding: 14, border: `2px solid ${theme.error}`,
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: theme.error, marginBottom: 8 }}>Deterministic</div>
          <div style={{ fontSize: 12, color: t, lineHeight: 1.6 }}>
            <div>✓ Has a <strong>threshold</strong></div>
            <div>✓ <strong>Severity</strong> ↑ with dose</div>
            <div>✓ Predictable onset</div>
          </div>
          <div style={{
            marginTop: 8, fontSize: 11, color: m, background: theme.errorBg,
            borderRadius: 6, padding: '6px 8px',
          }}>
            Examples: skin burns, cataracts, hair loss, sterility
          </div>
        </div>
        {/* Stochastic */}
        <div style={{
          flex: '1 1 140px', background: theme.surface, borderRadius: 12,
          padding: 14, border: `2px solid ${theme.warning}`,
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: theme.warning, marginBottom: 8 }}>Stochastic</div>
          <div style={{ fontSize: 12, color: t, lineHeight: 1.6 }}>
            <div>✕ No threshold (LNT)</div>
            <div>✓ <strong>Probability</strong> ↑ with dose</div>
            <div>✓ Years–decades latency</div>
          </div>
          <div style={{
            marginTop: 8, fontSize: 11, color: m, background: theme.warningBg,
            borderRadius: 6, padding: '6px 8px',
          }}>
            Examples: cancer, genetic effects
          </div>
        </div>
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 13. SKIN DOSE PROGRESSION
// ═══════════════════════════════════════════════════════════
function SkinDoseProgression() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  const levels = [
    { dose: '2 Gy', effect: 'Early erythema', desc: 'Faint redness, fades in days', severity: 1 },
    { dose: '3 Gy', effect: 'Temporary hair loss', desc: 'Regrows in weeks-months', severity: 2 },
    { dose: '6 Gy', effect: 'Main erythema', desc: 'Like a sunburn, edema', severity: 3 },
    { dose: '7 Gy', effect: 'Permanent hair loss', desc: 'Follicles destroyed', severity: 4 },
    { dose: '14 Gy', effect: 'Dry desquamation', desc: 'Skin peels, itchy', severity: 5 },
    { dose: '18 Gy', effect: 'Moist desquamation', desc: 'Blisters, weeps, painful', severity: 6 },
    { dose: '24+ Gy', effect: 'Ulceration/necrosis', desc: 'May need surgery', severity: 7 },
  ];
  const getColor = (sev) => {
    if (sev <= 2) return theme.warning;
    if (sev <= 4) return '#E67E22';
    return theme.error;
  };
  return (
    <DiagramBox caption="Skin dose thresholds — progressive damage with increasing dose">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {levels.map((lv, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '6px 10px', borderRadius: 8,
            background: getColor(lv.severity) + '08',
            borderLeft: `4px solid ${getColor(lv.severity)}`,
          }}>
            <div style={{
              minWidth: 50, fontSize: 13, fontWeight: 800,
              color: getColor(lv.severity),
            }}>
              {lv.dose}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t }}>{lv.effect}</div>
              <div style={{ fontSize: 11, color: m }}>{lv.desc}</div>
            </div>
            <div style={{
              width: `${lv.severity * 14}%`, minWidth: 20, maxWidth: 80,
              height: 6, borderRadius: 3,
              background: getColor(lv.severity),
            }} />
          </div>
        ))}
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 14. FETAL SENSITIVITY TIMELINE
// ═══════════════════════════════════════════════════════════
function FetalTimelineDiagram() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  const periods = [
    { weeks: '0–2', phase: 'Pre-implant', risk: 'All or nothing', color: theme.warning, desc: 'Death or normal' },
    { weeks: '2–8', phase: 'Organogenesis', risk: 'Malformations', color: theme.error, desc: 'HIGHEST RISK' },
    { weeks: '8–15', phase: 'Brain dev.', risk: 'Intellectual disability', color: theme.error, desc: 'Critical window' },
    { weeks: '15–25', phase: 'Growth', risk: 'Reduced risk', color: theme.warning, desc: 'Declining sensitivity' },
    { weeks: '25+', phase: 'Maturation', risk: 'Like newborn', color: theme.success, desc: 'Stochastic risk only' },
  ];
  return (
    <DiagramBox caption="Fetal radiosensitivity by gestational age — effects depend on timing">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {periods.map((p, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 10,
            background: p.color + '10',
            border: `1px solid ${p.color}33`,
          }}>
            <div style={{
              minWidth: 48, padding: '4px 8px', borderRadius: 6,
              background: p.color + '22', textAlign: 'center',
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: p.color }}>{p.weeks}</div>
              <div style={{ fontSize: 8, color: m }}>weeks</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t }}>{p.phase}</div>
              <div style={{ fontSize: 11, color: p.color, fontWeight: 600 }}>{p.risk}</div>
            </div>
            <div style={{
              fontSize: 9, color: p.desc === 'HIGHEST RISK' ? '#FFF' : m,
              background: p.desc === 'HIGHEST RISK' ? theme.error : 'transparent',
              padding: p.desc === 'HIGHEST RISK' ? '3px 8px' : 0,
              borderRadius: 6, fontWeight: p.desc === 'HIGHEST RISK' ? 700 : 400,
            }}>
              {p.desc}
            </div>
          </div>
        ))}
        <div style={{
          marginTop: 4, fontSize: 11, color: m, textAlign: 'center',
          padding: '6px 10px', background: theme.surface, borderRadius: 8,
          border: `1px solid ${theme.border}`,
        }}>
          <strong style={{ color: t }}>Fetal limit:</strong> 0.5 rem total pregnancy &nbsp;|&nbsp; 0.05 rem/month after declaration
        </div>
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 15. DSA SUBTRACTION CONCEPT
// ═══════════════════════════════════════════════════════════
function DSADiagram() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  return (
    <DiagramBox caption="Digital Subtraction Angiography — background removal reveals vessels">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Mask image */}
        <div style={{
          width: 90, height: 90, borderRadius: 10, background: theme.surface,
          border: `2px solid ${theme.border}`, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <rect x="10" y="15" width="40" height="30" rx="4" fill={m + '44'} />
            <circle cx="30" cy="30" r="8" fill={m + '22'} stroke={m} strokeWidth="1" />
          </svg>
          <div style={{ fontSize: 10, fontWeight: 600, color: t }}>Mask</div>
          <div style={{ fontSize: 8, color: m }}>before contrast</div>
        </div>
        {/* Minus sign */}
        <div style={{ fontSize: 24, fontWeight: 800, color: theme.error }}>−</div>
        {/* Live image */}
        <div style={{
          width: 90, height: 90, borderRadius: 10, background: theme.surface,
          border: `2px solid ${theme.border}`, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <rect x="10" y="15" width="40" height="30" rx="4" fill={m + '44'} />
            <circle cx="30" cy="30" r="8" fill={m + '22'} stroke={m} strokeWidth="1" />
            <path d="M 15,50 Q 25,20 35,35 Q 45,50 50,15" fill="none" stroke={theme.error} strokeWidth="2.5" />
          </svg>
          <div style={{ fontSize: 10, fontWeight: 600, color: t }}>Live</div>
          <div style={{ fontSize: 8, color: m }}>with contrast</div>
        </div>
        {/* Equals */}
        <div style={{ fontSize: 24, fontWeight: 800, color: theme.success }}>=</div>
        {/* Result */}
        <div style={{
          width: 90, height: 90, borderRadius: 10, background: theme.surface,
          border: `2px solid ${theme.success}`, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path d="M 15,50 Q 25,20 35,35 Q 45,50 50,15" fill="none" stroke={theme.error} strokeWidth="3" />
          </svg>
          <div style={{ fontSize: 10, fontWeight: 600, color: theme.success }}>Vessels only!</div>
          <div style={{ fontSize: 8, color: m }}>background gone</div>
        </div>
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 16. PIXEL MATRIX / BIT DEPTH
// ═══════════════════════════════════════════════════════════
function PixelMatrixDiagram() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  return (
    <DiagramBox caption="Digital images are grids of numbers — more bits = more gray shades">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
        {/* Mini pixel grid */}
        <svg viewBox="0 0 120 120" width="110" height="110">
          {[0,1,2,3,4,5,6,7].map(r =>
            [0,1,2,3,4,5,6,7].map(c => {
              const v = Math.floor(Math.random() * 200 + 55);
              return (
                <rect key={`${r}-${c}`} x={c*15} y={r*15} width="14" height="14" rx="1"
                  fill={`rgb(${v},${v},${v})`} />
              );
            })
          )}
        </svg>
        {/* Bit depth table */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: t, marginBottom: 6 }}>Bit Depth → Gray Levels</div>
          {[
            { bits: '8-bit', levels: '256' },
            { bits: '10-bit', levels: '1,024' },
            { bits: '12-bit', levels: '4,096' },
            { bits: '14-bit', levels: '16,384' },
          ].map((b, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', gap: 20,
              fontSize: 12, color: t, padding: '3px 0',
              borderBottom: i < 3 ? `1px solid ${theme.border}` : 'none',
            }}>
              <span style={{ fontWeight: 600, color: theme.primary }}>{b.bits}</span>
              <span>{b.levels} shades</span>
            </div>
          ))}
          <div style={{ fontSize: 10, color: m, marginTop: 6 }}>
            Modern fluoro: 12–14 bits
          </div>
        </div>
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 17. QA TESTING SCHEDULE
// ═══════════════════════════════════════════════════════════
function QAScheduleDiagram() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  const schedule = [
    { freq: 'Daily', color: theme.success, tests: ['Visual image check', 'Monitor brightness', 'Timer & dead-man switch'] },
    { freq: 'Weekly', color: theme.warning, tests: ['ABC with phantom', 'Image quality phantom', 'Artifact check'] },
    { freq: 'Annually', color: theme.error, tests: ['Full dose measurements', 'Resolution, HVL, uniformity', 'Collimation accuracy', 'Lead apron inspection'] },
  ];
  return (
    <DiagramBox caption="QA testing schedule — catch problems before they cause harm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {schedule.map((s, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            padding: '10px 12px', borderRadius: 10,
            background: s.color + '08', borderLeft: `4px solid ${s.color}`,
          }}>
            <div style={{
              minWidth: 60, padding: '4px 10px', borderRadius: 6,
              background: s.color + '22', textAlign: 'center',
              fontSize: 12, fontWeight: 800, color: s.color,
            }}>
              {s.freq}
            </div>
            <div style={{ flex: 1 }}>
              {s.tests.map((test, j) => (
                <div key={j} style={{ fontSize: 12, color: t, lineHeight: 1.6 }}>
                  • {test}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ fontSize: 11, color: m, textAlign: 'center', marginTop: 4 }}>
          Records: QA ≥ 3 years &nbsp;|&nbsp; Film processor ≥ 1 year &nbsp;|&nbsp; Dosimetry: duration of license
        </div>
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 18. MAGNIFICATION MODE DOSE
// ═══════════════════════════════════════════════════════════
function MagModeDiagram() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  return (
    <DiagramBox caption="Magnification mode — better resolution but higher dose">
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Normal mode */}
        <div style={{ textAlign: 'center' }}>
          <svg viewBox="0 0 100 100" width="90" height="90">
            <circle cx="50" cy="50" r="45" fill={theme.primary + '15'} stroke={theme.primary} strokeWidth="2" />
            <text x="50" y="45" textAnchor="middle" fontSize="10" fill={t} fontWeight="700">9" mode</text>
            <text x="50" y="60" textAnchor="middle" fontSize="8" fill={m}>~4 lp/mm</text>
            <text x="50" y="72" textAnchor="middle" fontSize="8" fill={theme.success}>1× dose</text>
          </svg>
          <div style={{ fontSize: 11, fontWeight: 600, color: t }}>Normal</div>
        </div>
        {/* Arrow */}
        <div style={{ fontSize: 20, color: theme.primary }}>→</div>
        {/* Mag mode */}
        <div style={{ textAlign: 'center' }}>
          <svg viewBox="0 0 100 100" width="90" height="90">
            <circle cx="50" cy="50" r="45" fill={theme.border + '55'} stroke={theme.border} strokeWidth="1" strokeDasharray="4,3" />
            <circle cx="50" cy="50" r="30" fill={theme.warning + '15'} stroke={theme.warning} strokeWidth="2" />
            <text x="50" y="45" textAnchor="middle" fontSize="10" fill={t} fontWeight="700">6" mode</text>
            <text x="50" y="60" textAnchor="middle" fontSize="8" fill={m}>~6 lp/mm</text>
            <text x="50" y="72" textAnchor="middle" fontSize="8" fill={theme.error}>2.25× dose</text>
          </svg>
          <div style={{ fontSize: 11, fontWeight: 600, color: t }}>Magnified</div>
        </div>
        {/* Formula */}
        <div style={{
          padding: '10px 14px', borderRadius: 10, background: theme.surface,
          border: `1px solid ${theme.border}`, fontSize: 12,
        }}>
          <div style={{ color: t, fontWeight: 600, marginBottom: 4 }}>Dose increase:</div>
          <div style={{ color: theme.primary, fontWeight: 700, fontSize: 14 }}>(9÷6)² = 2.25×</div>
          <div style={{ color: m, fontSize: 10, marginTop: 4 }}>ABC ↑ mA to compensate</div>
          <div style={{ color: m, fontSize: 10 }}>for dimmer image</div>
        </div>
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 19. INVERSE SQUARE LAW
// ═══════════════════════════════════════════════════════════
function InverseSquareDiagram() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  return (
    <DiagramBox caption="Inverse square law — doubling distance reduces intensity to 1/4">
      <svg viewBox="0 0 340 140" width="100%" style={{ maxWidth: 360 }}>
        {/* Source */}
        <circle cx="30" cy="70" r="14" fill={theme.error + '33'} stroke={theme.error} strokeWidth="2" />
        <text x="30" y="74" textAnchor="middle" fontSize="8" fill={theme.error} fontWeight="700">Source</text>
        {/* Diverging beam lines */}
        <line x1="44" y1="60" x2="320" y2="20" stroke={theme.error} strokeWidth="1" opacity="0.3" />
        <line x1="44" y1="70" x2="320" y2="70" stroke={theme.error} strokeWidth="1" opacity="0.3" />
        <line x1="44" y1="80" x2="320" y2="120" stroke={theme.error} strokeWidth="1" opacity="0.3" />
        {/* Distance markers */}
        <line x1="110" y1="48" x2="110" y2="92" stroke={theme.primary} strokeWidth="2" />
        <text x="110" y="108" textAnchor="middle" fontSize="10" fill={t} fontWeight="700">1 ft</text>
        <text x="110" y="120" textAnchor="middle" fontSize="10" fill={theme.error} fontWeight="700">100%</text>
        <line x1="190" y1="36" x2="190" y2="104" stroke={theme.warning} strokeWidth="2" />
        <text x="190" y="108" textAnchor="middle" fontSize="10" fill={t} fontWeight="700">2 ft</text>
        <text x="190" y="120" textAnchor="middle" fontSize="10" fill={theme.warning} fontWeight="700">25%</text>
        <line x1="270" y1="24" x2="270" y2="116" stroke={theme.success} strokeWidth="2" />
        <text x="270" y="108" textAnchor="middle" fontSize="10" fill={t} fontWeight="700">3 ft</text>
        <text x="270" y="120" textAnchor="middle" fontSize="10" fill={theme.success} fontWeight="700">11%</text>
        {/* Formula */}
        <text x="190" y="138" textAnchor="middle" fontSize="11" fill={theme.primary} fontWeight="700">
          I = I₀ / d²
        </text>
      </svg>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// 20. BEAM INTERACTIONS
// ═══════════════════════════════════════════════════════════
function BeamInteractionsDiagram() {
  const { theme } = useTheme();
  const t = theme.text;
  const m = theme.textMuted;
  return (
    <DiagramBox caption="X-ray interactions with tissue — photoelectric creates contrast, Compton creates fog">
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Photoelectric */}
        <div style={{
          flex: '1 1 140px', background: theme.surface, borderRadius: 12,
          padding: 14, border: `2px solid ${theme.success}`, textAlign: 'center',
        }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>💎</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: theme.success }}>Photoelectric</div>
          <div style={{ fontSize: 11, color: t, marginTop: 6, lineHeight: 1.5 }}>
            X-ray <strong>absorbed</strong> completely
          </div>
          <div style={{ fontSize: 11, color: m, marginTop: 4, lineHeight: 1.4 }}>
            Dominant: low kVp, high-Z tissue (bone)
          </div>
          <div style={{
            marginTop: 8, fontSize: 11, color: '#FFF', fontWeight: 700,
            background: theme.success, borderRadius: 6, padding: '4px 8px',
          }}>
            Creates CONTRAST ✓
          </div>
        </div>
        {/* Compton */}
        <div style={{
          flex: '1 1 140px', background: theme.surface, borderRadius: 12,
          padding: 14, border: `2px solid ${theme.error}`, textAlign: 'center',
        }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>💨</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: theme.error }}>Compton Scatter</div>
          <div style={{ fontSize: 11, color: t, marginTop: 6, lineHeight: 1.5 }}>
            X-ray <strong>bounces off</strong> electron
          </div>
          <div style={{ fontSize: 11, color: m, marginTop: 4, lineHeight: 1.4 }}>
            Dominant: higher kVp, soft tissue
          </div>
          <div style={{
            marginTop: 8, fontSize: 11, color: '#FFF', fontWeight: 700,
            background: theme.error, borderRadius: 6, padding: '4px 8px',
          }}>
            Creates FOG ✕
          </div>
        </div>
      </div>
    </DiagramBox>
  );
}

// ═══════════════════════════════════════════════════════════
// SECTION-TO-ILLUSTRATION MAPPING
// ═══════════════════════════════════════════════════════════

const ILLUSTRATION_MAP = {
  // Equipment
  "The Big Picture: What Fluoroscopy Actually Is": ImagingChain,
  "Link 1 — The X-Ray Tube: Where It All Starts": XRayTubeDiagram,
  "Link 2 — The Beam Meets the Patient": BeamInteractionsDiagram,
  "Link 3A — Catching the Image: The Image Intensifier (II)": ImageIntensifierDiagram,
  "Link 3A (continued) — II Modes, Quirks, and Problems": MagModeDiagram,
  "Link 3B — Catching the Image: Flat Panel Detectors (FPD)": FlatPanelDiagram,
  "The C-Arm: Putting It All Together": CArmDiagram,
  "Beam Control: Collimation, Filtration, and Distance": InverseSquareDiagram,

  // Digital
  "The Digital Image: Pixels, Matrices, and Bit Depth": PixelMatrixDiagram,
  "Digital Subtraction Angiography (DSA)": DSADiagram,

  // Radiation Protection
  "The Big Picture: One Rule Governs Everything": TDSTriangle,
  "The Operator's Exposure: Where It Comes From": ScatterDiagram,
  "Protective Equipment: Your Radiation Armor": ProtectiveEquipmentDiagram,

  // Dose Limits
  "Occupational Dose Limits: The Numbers You Must Know": DoseLimitsDiagram,
  "Dose Rate Limits for Equipment": DoseRateLimitsDiagram,

  // Radiation Biology
  "The Big Picture: What Radiation Actually Does to Your Body": CellDamageChain,
  "How Cells Respond to Radiation Damage": DetermStochDiagram,
  "Skin Dose Thresholds: What Happens at Each Level": SkinDoseProgression,
  "Fetal Dose: Protecting the Most Vulnerable Patient": FetalTimelineDiagram,

  // QA
  "Testing Schedule and Record-Keeping": QAScheduleDiagram,
};

/**
 * Returns the illustration component for a given section title, or null.
 */
export function getIllustration(sectionTitle) {
  return ILLUSTRATION_MAP[sectionTitle] || null;
}

export default ILLUSTRATION_MAP;
