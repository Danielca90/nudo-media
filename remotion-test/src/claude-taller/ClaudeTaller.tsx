import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {z} from 'zod';
import {COLAPSO, IMPACTOS, LIMITE, LINEAS, ONOMATOPEYAS, REVES, TRACK, TROMBON, f, Linea} from './tiempos';
import {SAFE, VIDEO} from '../estilo';

export const esquemaClaudeTaller = z.object({conVoz: z.boolean()});
type Props = z.infer<typeof esquemaClaudeTaller>;

const FUENTE = '"Inter", "Helvetica Neue", Arial, sans-serif';
const BORDE = (px: number): React.CSSProperties => ({WebkitTextStroke: `${px}px #000`, paintOrder: 'stroke fill'});
const CLAUDE = '#d97757';
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/* ---------- gancho ---------- */
const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12, stiffness: 180}});
  const sale = interpolate(frame, [f(1.3), f(1.6)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: SAFE.top + 40, left: 60, right: 60, textAlign: 'center', opacity: sale,
      transform: `scale(${0.7 + s * 0.3}) rotate(${(1 - s) * -4}deg)`}}>
      <div style={{fontFamily: FUENTE, fontWeight: 900, fontSize: 74, lineHeight: 1.12, color: '#fff', ...BORDE(12)}}>
        Un carpintero casual<br />trabajando con <span style={{color: '#ffb48f'}}>Claude</span>
      </div>
    </div>
  );
};

/* ---------- globos de diálogo ---------- */
const Globo: React.FC<{linea: Linea; conVoz: boolean}> = ({linea, conVoz}) => {
  const desde = linea.aparece ?? linea.inicio;
  const frame = useCurrentFrame() + f(desde); // frame absoluto (la Sequence empieza cuando aparece el globo)
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const tr = TRACK[Math.min(frame, TRACK.length - 1)][linea.quien];
  const entra = spring({frame: frame - f(desde), fps, config: {damping: 11, stiffness: 220}});
  const sale = interpolate(t, [linea.fin - 0.2, linea.fin], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const grita = linea.palabras.some((p) => p.text === p.text.toUpperCase() && /[A-ZÁ]/.test(p.text));
  const ancho = 640;
  // fuera de cuadro (primeros planos): el globo entra desde el borde por donde está el personaje
  const fuera = tr[0] > VIDEO.width - 40;
  const x = clamp(tr[0] - ancho / 2, 50, VIDEO.width - SAFE.right - ancho + 100);
  const y = fuera ? 1520 : clamp(tr[1] - 90, SAFE.top + 200, 1400);
  const colaX = clamp(tr[0] - x, 70, ancho - 70);
  const esClaude = linea.quien === 'claude';
  return (
    <div style={{position: 'absolute', left: x, top: y, width: ancho, transform: `translateY(-100%) scale(${entra * sale})`,
      transformOrigin: `${colaX}px 100%`}}>
      <div style={{background: '#fff', border: `6px solid ${esClaude ? CLAUDE : '#111'}`, borderRadius: grita ? 18 : 44, padding: '22px 30px',
        boxShadow: '0 10px 0 rgba(0,0,0,0.25)', textAlign: 'center', fontFamily: FUENTE, fontWeight: 900,
        fontSize: grita ? 64 : 50, lineHeight: 1.15, color: '#111', transform: grita ? `rotate(${Math.sin(t * 40) * 1.5}deg)` : undefined}}>
        {linea.palabras.map((p, i) => {
          const visible = conVoz ? t >= p.t - 0.05 : true;
          const pop = conVoz ? spring({frame: frame - f(p.t - 0.05), fps, config: {damping: 14, stiffness: 300}}) : 1;
          const activa = conVoz && t >= p.t - 0.05 && (i === linea.palabras.length - 1 || t < linea.palabras[i + 1].t - 0.05);
          return (
            <span key={i} style={{display: 'inline-block', margin: '0 7px', opacity: visible ? 1 : 0.12,
              transform: `scale(${visible ? 0.8 + pop * 0.2 : 1})`, color: activa ? (esClaude ? '#b4532f' : '#c2410c') : '#111'}}>
              {p.text}
            </span>
          );
        })}
      </div>
      {/* cola del globo */}
      <svg width={ancho} height={70} style={{position: 'absolute', left: 0, top: '100%', marginTop: -6, overflow: 'visible'}}>
        {fuera ? (
          <path d={`M ${ancho - 150} 0 L ${ancho + 30} 60 L ${ancho - 80} 0 Z`} fill="#fff" stroke={esClaude ? CLAUDE : '#111'} strokeWidth={6} strokeLinejoin="round" />
        ) : (
          <path d={`M ${colaX - 34} 0 L ${colaX} 62 L ${colaX + 34} 0`} fill="#fff" stroke={esClaude ? CLAUDE : '#111'} strokeWidth={6} strokeLinejoin="round" />
        )}
        <rect x={fuera ? ancho - 152 : colaX - 31} y={-7} width={fuera ? 70 : 62} height={10} fill="#fff" />
      </svg>
    </div>
  );
};

/* ---------- onomatopeyas del látigo ---------- */
const Onomatopeya: React.FC<{texto: string; i: number}> = ({texto, i}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const abs = frame + f(IMPACTOS[i]);
  const tr = TRACK[Math.min(abs, TRACK.length - 1)].claude;
  const s = spring({frame, fps, config: {damping: 8, stiffness: 260}});
  const op = interpolate(frame, [12, 20], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lado = i % 2 ? -1 : 1;
  return (
    <div style={{position: 'absolute', left: clamp(tr[0] + lado * 270 - 160, 30, 730), top: clamp(tr[1] + 60, 420, 1350), width: 320, textAlign: 'center',
      transform: `scale(${s * 1.15}) rotate(${lado * -12}deg)`, opacity: op, fontFamily: FUENTE, fontWeight: 900, fontSize: 96, color: '#ffd23f', ...BORDE(14)}}>
      {texto}
    </div>
  );
};

/* ---------- ventana del portátil: la repisa al revés ---------- */
const VentanaReves: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + REVES.inicio;
  const entra = spring({frame, fps, config: {damping: 13, stiffness: 200}});
  const sale = interpolate(t, [REVES.fin - 0.25, REVES.fin], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const giro = spring({frame: frame - f(REVES.giro - REVES.inicio), fps, config: {damping: 10, stiffness: 120}});
  const bien = t >= REVES.giro;
  return (
    <div style={{position: 'absolute', left: 140, top: SAFE.top + 30, width: 800, transform: `scale(${entra * sale}) rotate(-2deg)`, transformOrigin: '50% 0'}}>
      <Ventana titulo="video-mueble-pared · vista previa">
        <div style={{position: 'relative', height: 330, background: '#efe4d2', overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 0, transform: `rotate(${180 - giro * 180}deg)`}}>
            {/* pared con repisa flotante */}
            <div style={{position: 'absolute', left: 190, top: 150, width: 420, height: 30, background: '#c98a45', border: '4px solid #6b4423', borderRadius: 4}} />
            {[260, 520].map((x) => <div key={x} style={{position: 'absolute', left: x, top: 180, width: 20, height: 60, background: '#888', border: '3px solid #333'}} />)}
            <div style={{position: 'absolute', left: 250, top: 82, width: 46, height: 68, background: '#8a5a33', border: '4px solid #4b2e18', borderRadius: 6}} />
            <div style={{position: 'absolute', left: 470, top: 102, width: 70, height: 48, background: '#5f8f3e', border: '4px solid #2f4d1f', borderRadius: 24}} />
          </div>
          <div style={{position: 'absolute', left: 20, bottom: 14, fontFamily: FUENTE, fontWeight: 900, fontSize: 40, color: bien ? '#15803d' : '#dc2626', ...BORDE(0)}}>
            {bien ? '✓ Repisa v4' : '✗ Repisa v3'}
          </div>
        </div>
      </Ventana>
    </div>
  );
};

/* ---------- aviso de límite ---------- */
const AvisoLimite: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 9, stiffness: 160}});
  const sale = interpolate(frame, [f(COLAPSO - LIMITE) + 8, f(COLAPSO - LIMITE) + 16], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 110, top: SAFE.top + 40, width: 860, transform: `scale(${s * sale})`, transformOrigin: '50% 30%'}}>
      <Ventana titulo="Claude" alerta>
        <div style={{padding: '34px 40px 40px', textAlign: 'center', fontFamily: FUENTE, background: '#fff'}}>
          <div style={{fontSize: 92, lineHeight: 1}}>⚠️</div>
          <div style={{fontWeight: 900, fontSize: 56, color: '#111', marginTop: 14, lineHeight: 1.1}}>Alcanzaste el límite de uso</div>
          <div style={{fontWeight: 700, fontSize: 38, color: '#555', marginTop: 12}}>de esta sesión</div>
          <div style={{display: 'inline-block', marginTop: 26, padding: '14px 34px', borderRadius: 14, background: '#e5e7eb', color: '#6b7280', fontWeight: 800, fontSize: 34}}>
            Vuelve más tarde
          </div>
        </div>
      </Ventana>
    </div>
  );
};

const Ventana: React.FC<{titulo: string; alerta?: boolean; children: React.ReactNode}> = ({titulo, alerta, children}) => (
  <div style={{borderRadius: 22, overflow: 'hidden', border: '6px solid #111', boxShadow: '0 16px 0 rgba(0,0,0,0.3)', background: '#fff'}}>
    <div style={{height: 58, background: alerta ? '#fde2dc' : '#e9e6df', display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', borderBottom: '4px solid #111'}}>
      {['#ef4444', '#f59e0b', '#22c55e'].map((c) => <div key={c} style={{width: 22, height: 22, borderRadius: 11, background: c, border: '3px solid #111'}} />)}
      <div style={{marginLeft: 10, fontFamily: FUENTE, fontWeight: 800, fontSize: 28, color: '#333'}}>{titulo}</div>
    </div>
    {children}
  </div>
);

/* ---------- cierre ---------- */
const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 1540, left: 0, right: 0, textAlign: 'center', fontFamily: FUENTE, fontWeight: 700, fontSize: 36, color: '#fff', ...BORDE(7), opacity: op}}>
      @somos_nudodesign
    </div>
  );
};

/* ---------- composición ---------- */
export const ClaudeTaller: React.FC<Props> = ({conVoz}) => {
  return (
    <AbsoluteFill style={{background: '#2b2d31'}}>
      <OffthreadVideo src={staticFile('claude-taller/escena3d.mp4')} muted />
      <Sequence durationInFrames={f(1.65)}><Gancho /></Sequence>
      <Sequence from={f(REVES.inicio)} durationInFrames={f(REVES.fin - REVES.inicio)}><VentanaReves /></Sequence>
      <Sequence from={f(LIMITE)} durationInFrames={f(COLAPSO - LIMITE) + 20}><AvisoLimite /></Sequence>
      {LINEAS.map((l, i) => (
        <Sequence key={i} from={f(l.aparece ?? l.inicio)} durationInFrames={f(l.fin - (l.aparece ?? l.inicio))}><Globo linea={l} conVoz={conVoz} /></Sequence>
      ))}
      {IMPACTOS.map((t, i) => (
        <Sequence key={i} from={f(t)} durationInFrames={22}><Onomatopeya texto={ONOMATOPEYAS[i]} i={i} /></Sequence>
      ))}
      <Sequence from={f(TROMBON)}><Cierre /></Sequence>

      {/* ---------- audio ---------- */}
      {conVoz && LINEAS.map((l, i) => (
        <Sequence key={i} from={f(l.inicio)}><Audio src={staticFile(`claude-taller/${l.voz}`)} volume={l.volumen ?? (l.quien === 'claude' ? 1.15 : 1)} /></Sequence>
      ))}
      {/* base de percusión (adrenalina): se corta en seco con el aviso de límite */}
      <Sequence durationInFrames={f(LIMITE)}>
        <Audio src={staticFile('claude-taller/percusion1.mp3')} loop
          volume={(fr) => interpolate(fr / 30, [0, 1, 12.6, 15.3], [0.0, 0.32, 0.38, 0.5], {extrapolateRight: 'clamp'})} />
      </Sequence>
      <Sequence from={f(12.65)} durationInFrames={f(LIMITE - 12.65)}>
        <Audio src={staticFile('claude-taller/percusion2.mp3')} loop volume={0.32} />
      </Sequence>
      {/* tecleo: más fuerte a medida que sube el estrés */}
      <Sequence durationInFrames={f(LIMITE)}>
        <Audio src={staticFile('claude-taller/teclado.mp3')} loop
          volume={(fr) => interpolate(fr / 30, [0, 5.9, 11.2, 12.65, 15.3], [0.22, 0.3, 0.42, 0.6, 0.7], {extrapolateRight: 'clamp'})} />
      </Sequence>
      <Sequence from={f(12.65)} durationInFrames={f(LIMITE - 12.65)}>
        <Audio src={staticFile('claude-taller/teclado.mp3')} loop volume={0.4} playbackRate={1.35} />
      </Sequence>
      {IMPACTOS.map((t, i) => (
        <Sequence key={i} from={f(t - 0.06)}><Audio src={staticFile(`claude-taller/latigo${(i % 3) + 1}.mp3`)} volume={1.0} /></Sequence>
      ))}
      <Sequence from={f(LIMITE)}><Audio src={staticFile('claude-taller/error.mp3')} volume={0.9} /></Sequence>
      <Sequence from={f(TROMBON)}><Audio src={staticFile('claude-taller/trombon.mp3')} volume={0.8} /></Sequence>
    </AbsoluteFill>
  );
};
