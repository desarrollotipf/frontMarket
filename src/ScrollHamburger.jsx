import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * CONFIGURACIÓN DE CAPAS (Fácil de modificar o reemplazar por imágenes)
 * Cada capa define sus transformaciones matemáticas mapeadas al progreso de scroll (0 a 1).
 * Si proporcionas `imageSrc`, el componente renderizará tu imagen real en vez del placeholder SVG.
 */
export const DEFAULT_BURGER_LAYERS = [
  {
    id: 'bun-top',
    name: 'Pan Superior Brioche',
    tag: 'Capa 01',
    category: 'Panadería Artesanal',
    description: 'Brioche horneado a diario con mantequilla clarificada y semillas de sésamo blanco tostado.',
    side: 'right',
    accentColor: '#F59E0B',
    borderColor: '#D97706',
    badge: 'Masa Madre 48h',
    zIndex: 30,
    // [0.0 = Cerrada, 0.08 = Abriéndose visiblemente, 0.42 = 100% Abierta y se mantiene así]
    timeline: {
      input:          [0,    0.08,  0.42,  1.0],
      y:              [-75,  -170,  -285,  -285],
      x:              [0,       8,    18,    18],
      rotate:         [0,    -1.8,  -3.5,  -3.5],
      scale:          [1,    1.02,  1.04,  1.04],
      labelOpacity:   [0.0,   0.9,   1.0,   1.0],
      calloutOpacity: [0.0,   0.6,   1.0,   1.0],
    },
    imageSrc: null,
  },
  {
    id: 'lettuce',
    name: 'Lechuga Batavia',
    tag: 'Capa 02',
    category: 'Vegetales Frescos',
    description: 'Hojas tiernas y crujientes cultivadas hidropónicamente, secadas en frío.',
    side: 'left',
    accentColor: '#10B981',
    borderColor: '#059669',
    badge: '100% Orgánica',
    zIndex: 25,
    timeline: {
      input:          [0,    0.08,  0.42,  1.0],
      y:              [-35,  -105,  -175,  -175],
      x:              [0,     -12,   -25,   -25],
      rotate:         [0,     1.2,   2.5,   2.5],
      scale:          [1,    1.01,  1.02,  1.02],
      labelOpacity:   [0.0,   0.9,   1.0,   1.0],
      calloutOpacity: [0.0,   0.6,   1.0,   1.0],
    },
    imageSrc: null,
  },
  {
    id: 'tomato',
    name: 'Tomate Roma en Rodajas',
    tag: 'Capa 03',
    category: 'Vegetales Frescos',
    description: 'Doble rodaja de corte grueso (8mm), aderezada con sal marina gruesa.',
    side: 'right',
    accentColor: '#EF4444',
    borderColor: '#DC2626',
    badge: 'Corte Fresco 8mm',
    zIndex: 20,
    timeline: {
      input:          [0,    0.08,  0.42,  1.0],
      y:              [-12,   -42,   -65,   -65],
      x:              [0,      10,    20,    20],
      rotate:         [0,    -1.0,  -2.0,  -2.0],
      scale:          [1,    1.01,  1.02,  1.02],
      labelOpacity:   [0.0,   0.9,   1.0,   1.0],
      calloutOpacity: [0.0,   0.6,   1.0,   1.0],
    },
    imageSrc: null,
  },
  {
    id: 'cheese',
    name: 'Queso Cheddar Fundido',
    tag: 'Capa 04',
    category: 'Lácteos Selectos',
    description: 'Cheddar madurado 12 meses, fundido sobre la carne al vapor para máxima cremosidad.',
    side: 'left',
    accentColor: '#FBBF24',
    borderColor: '#F59E0B',
    badge: 'Maduración 12m',
    zIndex: 16,
    timeline: {
      input:          [0,    0.08,  0.42,  1.0],
      y:              [10,     30,    48,    48],
      x:              [0,      -8,   -18,   -18],
      rotate:         [0,     1.0,   2.0,   2.0],
      scale:          [1,    1.01,  1.02,  1.02],
      labelOpacity:   [0.0,   0.9,   1.0,   1.0],
      calloutOpacity: [0.0,   0.6,   1.0,   1.0],
    },
    imageSrc: null,
  },
  {
    id: 'patty',
    name: 'Carne Angus 200g',
    tag: 'Capa 05',
    category: 'Proteína Premium',
    description: 'Medallón 200g blend 80/20 (tapa y costilla), sellado a 260°C con costra caramelizada.',
    side: 'right',
    accentColor: '#B45309',
    borderColor: '#78350F',
    badge: '200g • Blend 80/20',
    zIndex: 12,
    timeline: {
      input:          [0,    0.08,  0.42,  1.0],
      y:              [38,     98,   158,   158],
      x:              [0,      10,    22,    22],
      rotate:         [0,    -0.8,  -1.5,  -1.5],
      scale:          [1,    1.01,  1.03,  1.03],
      labelOpacity:   [0.0,   0.9,   1.0,   1.0],
      calloutOpacity: [0.0,   0.6,   1.0,   1.0],
    },
    imageSrc: null,
  },
  {
    id: 'bun-bottom',
    name: 'Pan Inferior Sellado',
    tag: 'Capa 06',
    category: 'Panadería Artesanal',
    description: 'Base de brioche sellada a fuego vivo con mantequilla para retener todos los jugos.',
    side: 'left',
    accentColor: '#D97706',
    borderColor: '#92400E',
    badge: 'Base Sellada',
    zIndex: 8,
    timeline: {
      input:          [0,    0.08,  0.42,  1.0],
      y:              [78,    175,   270,   270],
      x:              [0,      -8,   -14,   -14],
      rotate:         [0,     1.2,   2.5,   2.5],
      scale:          [1,    1.01,  1.02,  1.02],
      labelOpacity:   [0.0,   0.9,   1.0,   1.0],
      calloutOpacity: [0.0,   0.6,   1.0,   1.0],
    },
    imageSrc: null,
  },
];

/**
 * SVGs placeholders geométricos vectoriales de alta fidelidad para cada ingrediente.
 * Si luego se agregan fotos, se reemplazan automáticamente.
 */
function BurgerLayerPlaceholder({ layer }) {
  switch (layer.id) {
    case 'bun-top':
      return (
        <svg viewBox="0 0 380 110" style={styles.svgShape}>
          <defs>
            <linearGradient id="topBunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="60%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <filter id="bunGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#D97706" floodOpacity="0.35" />
            </filter>
          </defs>
          {/* Cúpula del pan superior */}
          <path
            d="M 20 95 C 20 25, 360 25, 360 95 C 360 102, 20 102, 20 95 Z"
            fill="url(#topBunGrad)"
            stroke="#92400E"
            strokeWidth="3.5"
            filter="url(#bunGlow)"
          />
          {/* Brillo especular superior */}
          <path
            d="M 70 42 C 140 24, 240 24, 310 42"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Semillas de sésamo */}
          {[
            { cx: 110, cy: 45, r: 24 },
            { cx: 155, cy: 35, r: -15 },
            { cx: 190, cy: 32, r: 8 },
            { cx: 230, cy: 37, r: -20 },
            { cx: 275, cy: 48, r: 18 },
            { cx: 135, cy: 62, r: 10 },
            { cx: 175, cy: 55, r: -8 },
            { cx: 215, cy: 56, r: 25 },
            { cx: 255, cy: 66, r: -12 },
            { cx: 90, cy: 68, r: 35 },
            { cx: 300, cy: 68, r: -30 },
          ].map((seed, i) => (
            <ellipse
              key={i}
              cx={seed.cx}
              cy={seed.cy}
              rx="4.5"
              ry="2.6"
              transform={`rotate(${seed.r} ${seed.cx} ${seed.cy})`}
              fill="#FEF3C7"
              stroke="#B45309"
              strokeWidth="1"
            />
          ))}
        </svg>
      );

    case 'lettuce':
      return (
        <svg viewBox="0 0 400 65" style={styles.svgShape}>
          <defs>
            <linearGradient id="lettuceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <path
            d="M 15 32 
               C 35 10, 65 12, 90 28 
               C 115 44, 145 15, 175 26 
               C 205 37, 230 14, 260 25 
               C 290 36, 320 12, 345 30 
               C 370 48, 385 30, 392 35
               C 385 55, 360 52, 335 44
               C 305 34, 275 55, 240 45
               C 205 35, 175 56, 140 46
               C 105 36, 75 56, 45 44
               C 25 36, 10 45, 15 32 Z"
            fill="url(#lettuceGrad)"
            stroke="#047857"
            strokeWidth="3"
          />
          {/* Nervaduras de la hoja */}
          <path d="M 50 30 Q 90 32 140 38" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 180 32 Q 230 28 290 36" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'tomato':
      return (
        <svg viewBox="0 0 380 60" style={styles.svgShape}>
          <defs>
            <linearGradient id="tomatoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="60%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
          </defs>
          {/* Rodaja Izquierda */}
          <g>
            <rect x="25" y="10" width="155" height="40" rx="20" fill="url(#tomatoGrad)" stroke="#991B1B" strokeWidth="3" />
            <circle cx="65" cy="30" r="7" fill="#7F1D1D" opacity="0.6" />
            <circle cx="100" cy="30" r="7" fill="#7F1D1D" opacity="0.6" />
            <circle cx="135" cy="30" r="7" fill="#7F1D1D" opacity="0.6" />
            <ellipse cx="65" cy="30" rx="3" ry="1.5" fill="#FEE2E2" />
            <ellipse cx="100" cy="30" rx="3" ry="1.5" fill="#FEE2E2" />
            <ellipse cx="135" cy="30" rx="3" ry="1.5" fill="#FEE2E2" />
          </g>
          {/* Rodaja Derecha */}
          <g>
            <rect x="200" y="10" width="155" height="40" rx="20" fill="url(#tomatoGrad)" stroke="#991B1B" strokeWidth="3" />
            <circle cx="240" cy="30" r="7" fill="#7F1D1D" opacity="0.6" />
            <circle cx="275" cy="30" r="7" fill="#7F1D1D" opacity="0.6" />
            <circle cx="310" cy="30" r="7" fill="#7F1D1D" opacity="0.6" />
            <ellipse cx="240" cy="30" rx="3" ry="1.5" fill="#FEE2E2" />
            <ellipse cx="275" cy="30" rx="3" ry="1.5" fill="#FEE2E2" />
            <ellipse cx="310" cy="30" rx="3" ry="1.5" fill="#FEE2E2" />
          </g>
        </svg>
      );

    case 'cheese':
      return (
        <svg viewBox="0 0 380 65" style={styles.svgShape}>
          <defs>
            <linearGradient id="cheeseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="40%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          </defs>
          {/* Capa de queso derretido con esquinas caídas */}
          <path
            d="M 30 15 
               L 350 15 
               L 355 24 
               C 345 35, 335 45, 325 58 
               C 318 55, 312 40, 305 24 
               L 200 24 
               C 192 36, 185 52, 175 60 
               C 168 52, 162 36, 155 24 
               L 65 24 
               C 55 42, 45 54, 35 56 
               C 28 50, 24 32, 30 15 Z"
            fill="url(#cheeseGrad)"
            stroke="#CA8A04"
            strokeWidth="3"
          />
        </svg>
      );

    case 'patty':
      return (
        <svg viewBox="0 0 380 80" style={styles.svgShape}>
          <defs>
            <linearGradient id="pattyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="50%" stopColor="#5B290B" />
              <stop offset="100%" stopColor="#3E1A04" />
            </linearGradient>
          </defs>
          {/* Medallón de carne con textura rústica */}
          <rect x="25" y="10" width="330" height="60" rx="26" fill="url(#pattyGrad)" stroke="#271002" strokeWidth="3.5" />
          {/* Marcas de parrilla / grill sellado */}
          <line x1="85" y1="18" x2="115" y2="62" stroke="#1D0A01" strokeWidth="4.5" strokeLinecap="round" opacity="0.75" />
          <line x1="140" y1="18" x2="170" y2="62" stroke="#1D0A01" strokeWidth="4.5" strokeLinecap="round" opacity="0.75" />
          <line x1="195" y1="18" x2="225" y2="62" stroke="#1D0A01" strokeWidth="4.5" strokeLinecap="round" opacity="0.75" />
          <line x1="250" y1="18" x2="280" y2="62" stroke="#1D0A01" strokeWidth="4.5" strokeLinecap="round" opacity="0.75" />
          {/* Jugos / brillo de sellado térmico */}
          <circle cx="105" cy="38" r="2.5" fill="#F59E0B" opacity="0.6" />
          <circle cx="160" cy="42" r="3" fill="#F59E0B" opacity="0.6" />
          <circle cx="215" cy="34" r="2" fill="#F59E0B" opacity="0.7" />
          <circle cx="270" cy="40" r="3" fill="#F59E0B" opacity="0.6" />
        </svg>
      );

    case 'bun-bottom':
      return (
        <svg viewBox="0 0 380 75" style={styles.svgShape}>
          <defs>
            <linearGradient id="bottomBunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="60%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
          </defs>
          {/* Base del pan */}
          <path
            d="M 30 10 L 350 10 C 350 10, 355 48, 330 62 C 300 70, 80 70, 50 62 C 25 48, 30 10, 30 10 Z"
            fill="url(#bottomBunGrad)"
            stroke="#78350F"
            strokeWidth="3.5"
          />
          {/* Línea de tueste a la plancha */}
          <line x1="45" y1="14" x2="335" y2="14" stroke="#78350F" strokeWidth="3" opacity="0.6" />
        </svg>
      );

    default:
      return (
        <div style={{ ...styles.fallbackBox, borderColor: layer.accentColor }}>
          <span style={{ color: layer.accentColor, fontWeight: 'bold' }}>{layer.name}</span>
        </div>
      );
  }
}

/**
 * Sub-componente de capa individual con interpolación reactiva vía `useTransform`
 */
function BurgerLayerItem({ layer, scrollProgress, index }) {
  const { timeline } = layer;

  // Mapeos continuos a partir del scroll (0.0 a 1.0)
  const translateY = useTransform(scrollProgress, timeline.input, timeline.y);
  const translateX = useTransform(scrollProgress, timeline.input, timeline.x);
  const rotate = useTransform(scrollProgress, timeline.input, timeline.rotate);
  const scale = useTransform(scrollProgress, timeline.input, timeline.scale);
  const labelOpacity = useTransform(scrollProgress, timeline.input, timeline.labelOpacity);
  const calloutOpacity = useTransform(scrollProgress, timeline.input, timeline.calloutOpacity);

  // Stacking z-index natural para que el pan superior quede arriba y el inferior abajo
  const zIndex = layer.zIndex ?? (30 - index * 4);

  return (
    <motion.div
      key={layer.id}
      style={{
        ...styles.layerWrapper,
        zIndex,
        y: translateY,
        x: translateX,
        rotate: rotate,
        scale: scale,
      }}
    >
      {/* Contenedor central del ingrediente */}
      <div style={styles.layerCore}>
        {layer.imageSrc ? (
          <img
            src={layer.imageSrc}
            alt={layer.name}
            style={styles.realImage}
          />
        ) : (
          <BurgerLayerPlaceholder layer={layer} />
        )}

        {/* Etiqueta central: aparece fluidamente al separarse las capas */}
        <motion.div
          style={{
            ...styles.centerLabelContainer,
            opacity: labelOpacity,
          }}
        >
          <span
            style={{
              ...styles.centerLabel,
              backgroundColor: 'rgba(10, 11, 14, 0.88)',
              borderColor: layer.accentColor,
              color: '#FFFFFF',
              boxShadow: `0 4px 14px rgba(0,0,0,0.6), 0 0 10px ${layer.accentColor}33`,
            }}
          >
            <span style={{ ...styles.layerIndicatorDot, backgroundColor: layer.accentColor }} />
            {layer.name}
          </span>
        </motion.div>
      </div>

      {/* Tarjeta de Especificación Apple Parallax flotante (aparece suavemente durante el scroll) */}
      <motion.div
        style={{
          ...styles.calloutCard,
          ...(layer.side === 'left' ? styles.calloutLeft : styles.calloutRight),
          opacity: calloutOpacity,
          borderLeft: layer.side === 'left' ? `2px solid ${layer.accentColor}` : undefined,
          borderRight: layer.side === 'right' ? `2px solid ${layer.accentColor}` : undefined,
        }}
      >
        <div style={styles.calloutHeader}>
          <span style={{ ...styles.calloutTag, color: layer.accentColor }}>{layer.tag}</span>
          <span style={styles.calloutBadge}>{layer.badge}</span>
        </div>
        <h4 style={styles.calloutTitle}>{layer.name}</h4>
        <p style={styles.calloutDesc}>{layer.description}</p>
        
        {/* Línea conectora gráfica hacia la capa */}
        <div
          style={{
            ...styles.connectorLine,
            ...(layer.side === 'left' ? styles.connectorRightAlign : styles.connectorLeftAlign),
            backgroundColor: `${layer.accentColor}55`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * COMPONENTE PRINCIPAL: ScrollHamburger
 * 
 * Inicia de inmediato desde el primer scroll hacia abajo (sin secciones vacías previas).
 * Al cargar la página, la hamburguesa se muestra 100% armada y completa en el centro.
 */
export default function ScrollHamburger({
  layers = DEFAULT_BURGER_LAYERS,
  smoothPhysics = false,
  sectionHeight = '300vh',
}) {
  const containerRef = useRef(null);
  const [useSmoothInertia, setUseSmoothInertia] = useState(smoothPhysics);

  // useScroll mapea el scroll relativo del contenedor padre que arranca desde el tope de la pantalla
  const { scrollYProgress: rawScrollProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Amortiguador de resorte Apple ultra-reactivo (sin retardo)
  const springScrollProgress = useSpring(rawScrollProgress, {
    stiffness: 240,
    damping: 28,
    restDelta: 0.001,
  });

  // Si useSmoothInertia es false, la respuesta es 100% inmediata e instantánea al toque del scroll
  const activeProgress = useSmoothInertia ? springScrollProgress : rawScrollProgress;

  // El texto inicial se desvanece en los primeros milímetros de scroll
  const introOpacity = useTransform(activeProgress, [0, 0.03, 0.10], [1, 0.4, 0]);
  const introScale = useTransform(activeProgress, [0, 0.12], [1, 0.92]);
  const introY = useTransform(activeProgress, [0, 0.12], [0, -30]);

  // Indicador de "Hamburguesa Armada" que desaparece con el primer scroll
  const assembledBadgeOpacity = useTransform(activeProgress, [0, 0.02, 0.06], [1, 0.2, 0]);

  // HUD de vista explosiva: aparece y se queda activo mientras está abierta
  const explodedHudOpacity = useTransform(activeProgress, [0.04, 0.14, 0.96, 1.0], [0, 1, 1, 0.8]);

  // Perspectiva 3D que se abre y se mantiene estable para inspección
  const stackPerspectiveRotateX = useTransform(activeProgress, [0, 0.35, 1], [0, 10, 10]);
  const stackPerspectiveRotateY = useTransform(activeProgress, [0, 0.35, 1], [0, -6, -6]);

  return (
    <div style={styles.pageContainer}>
      {/* CONTENEDOR PINEADO QUE INICIA DESDE EL PRIMER SCROLL EN EL TOPE */}
      <div
        ref={containerRef}
        style={{
          ...styles.stickyWrapper,
          height: sectionHeight,
        }}
      >
        {/* PANTALLA STICKY FIJA DURANTE LA ANIMACIÓN */}
        <div style={styles.stickyScreen}>
          {/* RESPLANDOR AMBIENTAL RADIAL DE FONDO */}
          <div style={styles.ambientGlow} />

          {/* BARRA SUPERIOR HUD */}
          <header style={styles.topHud}>
            <div style={styles.hudBrand}>
              <span style={styles.hudLogo}>🍔</span>
              <span style={styles.hudTitle}>Burger Pro Max Architecture</span>
            </div>

            <div style={styles.hudControls}>
              <button
                type="button"
                onClick={() => setUseSmoothInertia(!useSmoothInertia)}
                style={{
                  ...styles.toggleBtn,
                  backgroundColor: useSmoothInertia ? '#22C55E22' : '#ffffff11',
                  borderColor: useSmoothInertia ? '#22C55E' : '#ffffff22',
                  color: useSmoothInertia ? '#4ADE80' : '#888899',
                }}
                title="Alterna entre inercia de resorte suave o scroll directo"
              >
                Inercia Suave: {useSmoothInertia ? 'ON' : 'OFF'}
              </button>
            </div>
          </header>

          {/* TÍTULO HERO INTEGRADO EN EL STICKY (VISIBLE EN SCROLL = 0) */}
          <motion.div
            style={{
              ...styles.heroFloatingTitle,
              opacity: introOpacity,
              scale: introScale,
              y: introY,
            }}
          >
            <div style={styles.badgePill}>Apple-Style Parallax • Scroll to Deconstruct</div>
            <h1 style={styles.heroHeading}>
              Hamburguesa <span style={styles.titleGradient}>Completa Armada</span>
            </h1>
            <p style={styles.heroSub}>
              Haz scroll hacia abajo para deconstruir en 6 capas calibradas ↓
            </p>
          </motion.div>

          {/* HUD SUPERIOR DE VISTA EXPLOSIVA (APARECE AL HACER SCROLL) */}
          <motion.div style={{ ...styles.progressHud, opacity: explodedHudOpacity }}>
            <div style={styles.stageBreadcrumb}>
              <span style={styles.stageDot} />
              <span>VISTA ANATÓMICA DESGLOSADA (6 CAPAS)</span>
            </div>
            <div style={styles.progressBarTrack}>
              <motion.div
                style={{
                  ...styles.progressBarFill,
                  scaleX: activeProgress,
                  transformOrigin: 'left',
                }}
              />
            </div>
          </motion.div>

          {/* ESCENARIO PRINCIPAL: STACK DE CAPAS INTERPOLADAS */}
          <div style={styles.viewportStage}>
            {/* BADGE DE ENSAMBLE CUANDO ESTÁ CERRADA */}
            <motion.div
              style={{
                ...styles.assembledPill,
                opacity: assembledBadgeOpacity,
              }}
            >
              <span>Ensamble 100% Hermético</span>
            </motion.div>

            <motion.div
              style={{
                ...styles.burgerStackContainer,
                rotateX: stackPerspectiveRotateX,
                rotateY: stackPerspectiveRotateY,
              }}
            >
              {layers.map((layer, index) => (
                <BurgerLayerItem
                  key={layer.id}
                  layer={layer}
                  scrollProgress={activeProgress}
                  index={index}
                />
              ))}
            </motion.div>
          </div>

          {/* PIE DE ESTADO */}
          <div style={styles.bottomStatusPill}>
            <span style={styles.bottomStatusText}>
              Scroll descendente continuo • Interpolación 100% fluida
            </span>
          </div>
        </div>
      </div>

      {/* SECCIÓN POST-ANIMACIÓN: SE LIBERA EL SCROLL NORMAL AL LLEGAR AL FINAL */}
      <section style={styles.outroSection}>
        <div style={styles.outroCard}>
          <div style={styles.outroTag}>Secuencia Finalizada</div>
          <h2 style={styles.outroTitle}>Scroll Liberado con Éxito</h2>
          <p style={styles.outroDesc}>
            Al finalizar la deconstrucción en el contenedor pineado, el scroll estándar continúa sin bloqueos ni saltos.
          </p>
          <div style={styles.codeSnippetBox}>
            <div style={styles.codeHeader}>
              <span>ScrollHamburger.jsx</span>
              <span style={styles.codeBadge}>Autocontenido</span>
            </div>
            <pre style={styles.codeSnippet}>
{`// Para reemplazar por imágenes reales:
const MIS_CAPAS = DEFAULT_BURGER_LAYERS.map(capa => ({
  ...capa,
  imageSrc: '/imagenes/' + capa.id + '.png'
}));`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}

// ESTILOS EN LÍNEA AUTOCONTENIDOS (No requiere Tailwind ni CSS externo adicional)
const styles = {
  pageContainer: {
    backgroundColor: '#0a0b0e',
    color: '#F3F4F6',
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    minHeight: '100vh',
    overflowX: 'clip',
    position: 'relative',
  },
  badgePill: {
    fontSize: '0.85rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '999px',
    padding: '6px 18px',
    marginBottom: '20px',
  },
  mainTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    maxWidth: '850px',
    margin: '0 auto 20px',
    letterSpacing: '-0.03em',
  },
  titleGradient: {
    background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 50%, #EF4444 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    color: '#9CA3AF',
    maxWidth: '620px',
    margin: '0 auto 40px',
    lineHeight: 1.6,
  },
  scrollIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginTop: '20px',
  },
  scrollText: {
    fontSize: '0.85rem',
    color: '#6B7280',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  mouseIcon: {
    width: '26px',
    height: '42px',
    borderRadius: '16px',
    border: '2px solid rgba(255, 255, 255, 0.25)',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '6px',
  },
  mouseWheel: {
    width: '4px',
    height: '8px',
    backgroundColor: '#F59E0B',
    borderRadius: '2px',
    animation: 'bounce 1.6s infinite ease-in-out',
  },
  stickyWrapper: {
    position: 'relative',
    width: '100%',
  },
  stickyScreen: {
    position: 'sticky',
    top: 0,
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '1200px',
  },
  ambientGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '650px',
    height: '650px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.03) 45%, transparent 70%)',
    filter: 'blur(40px)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  topHud: {
    position: 'absolute',
    top: '24px',
    left: '24px',
    right: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 40,
  },
  hudBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(15, 17, 24, 0.75)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '8px 16px',
    borderRadius: '999px',
  },
  hudLogo: {
    fontSize: '1.2rem',
  },
  hudTitle: {
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    color: '#E5E7EB',
  },
  hudControls: {
    display: 'flex',
    gap: '10px',
  },
  toggleBtn: {
    cursor: 'pointer',
    border: '1px solid',
    borderRadius: '999px',
    padding: '7px 16px',
    fontSize: '0.78rem',
    fontWeight: 600,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease',
  },
  progressHud: {
    position: 'absolute',
    top: '84px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    zIndex: 35,
    pointerEvents: 'none',
  },
  stageBreadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#F59E0B',
    textTransform: 'uppercase',
  },
  stageDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#F59E0B',
    boxShadow: '0 0 8px #F59E0B',
  },
  progressBarTrack: {
    width: '240px',
    height: '3px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: '2px',
  },
  heroFloatingTitle: {
    position: 'absolute',
    top: '80px',
    textAlign: 'center',
    zIndex: 10,
    pointerEvents: 'none',
    maxWidth: '750px',
    padding: '0 20px',
  },
  heroHeading: {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
    fontWeight: 800,
    color: '#F9FAFB',
    marginBottom: '6px',
    letterSpacing: '-0.02em',
  },
  heroSub: {
    fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
    color: '#9CA3AF',
  },
  assembledPill: {
    position: 'absolute',
    top: '165px',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.35)',
    color: '#FBBF24',
    padding: '4px 14px',
    borderRadius: '999px',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    zIndex: 35,
    pointerEvents: 'none',
    boxShadow: '0 0 16px rgba(245, 158, 11, 0.2)',
  },
  viewportStage: {
    position: 'relative',
    width: '100%',
    maxWidth: '1100px',
    height: '700px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  burgerStackContainer: {
    position: 'relative',
    width: '400px',
    height: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transformStyle: 'preserve-3d',
  },
  layerWrapper: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transformStyle: 'preserve-3d',
    willChange: 'transform',
  },
  layerCore: {
    position: 'relative',
    width: '380px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgShape: {
    width: '100%',
    height: 'auto',
    display: 'block',
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.45))',
  },
  realImage: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.6))',
  },
  fallbackBox: {
    width: '360px',
    height: '55px',
    borderRadius: '14px',
    border: '2px solid',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabelContainer: {
    position: 'absolute',
    zIndex: 25,
    pointerEvents: 'none',
  },
  centerLabel: {
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    padding: '5px 14px',
    borderRadius: '999px',
    border: '1.5px solid',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
  },
  layerIndicatorDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
  },
  calloutCard: {
    position: 'absolute',
    width: '260px',
    backgroundColor: 'rgba(15, 18, 28, 0.85)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '14px 18px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
    pointerEvents: 'none',
    zIndex: 30,
  },
  calloutLeft: {
    right: '105%',
    marginRight: '20px',
  },
  calloutRight: {
    left: '105%',
    marginLeft: '20px',
  },
  calloutHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  calloutTag: {
    fontSize: '0.7rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  calloutBadge: {
    fontSize: '0.65rem',
    color: '#9CA3AF',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  calloutTitle: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '4px',
  },
  calloutDesc: {
    fontSize: '0.75rem',
    color: '#9CA3AF',
    lineHeight: 1.4,
  },
  connectorLine: {
    position: 'absolute',
    top: '50%',
    width: '20px',
    height: '1.5px',
  },
  connectorRightAlign: {
    left: '100%',
  },
  connectorLeftAlign: {
    right: '100%',
  },
  bottomStatusPill: {
    position: 'absolute',
    bottom: '24px',
    backgroundColor: 'rgba(20, 24, 36, 0.65)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '999px',
    padding: '6px 18px',
    zIndex: 35,
  },
  bottomStatusText: {
    fontSize: '0.75rem',
    color: '#9CA3AF',
    letterSpacing: '0.02em',
  },
  outroSection: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    backgroundColor: '#0a0b0e',
    background: 'radial-gradient(circle at 50% 80%, #151824 0%, #0a0b0e 70%)',
  },
  outroCard: {
    maxWidth: '680px',
    width: '100%',
    backgroundColor: 'rgba(17, 20, 29, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
  },
  outroTag: {
    display: 'inline-block',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#22C55E',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '999px',
    padding: '4px 14px',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  outroTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '12px',
  },
  outroDesc: {
    fontSize: '0.95rem',
    color: '#9CA3AF',
    lineHeight: 1.6,
    marginBottom: '28px',
  },
  codeSnippetBox: {
    backgroundColor: '#07080a',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    textAlign: 'left',
    overflow: 'hidden',
  },
  codeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    fontSize: '0.75rem',
    color: '#9CA3AF',
    fontFamily: "'JetBrains Mono', monospace",
  },
  codeBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    color: '#F59E0B',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.7rem',
  },
  codeSnippet: {
    margin: 0,
    padding: '16px',
    fontSize: '0.8rem',
    color: '#D1D5DB',
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.5,
    overflowX: 'auto',
  },
};
