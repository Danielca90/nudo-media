// Kit reutilizable de motion graphics para Arca Jurídica.
// Todo se anima con useCurrentFrame(); los tiempos se dan en segundos de la voz.
import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import {COLOR, FUENTES, FPS, W, H, SEGURO} from './marca';
import {createAvatar} from '@dicebear/core';
import {notionists} from '@dicebear/collection';

export type Palabra = {text: string; start: number; end: number};

// ---------- tiempo ----------
export const useT = () => useCurrentFrame() / FPS;
/** 0→1 con resorte, empezando en el segundo `en`. */
export const usePop = (en: number, rigidez = 170, amort = 13) => {
  const frame = useCurrentFrame();
  return spring({frame: frame - Math.round(en * FPS), fps: FPS, config: {stiffness: rigidez, damping: amort}});
};
/** 0→1 lineal suavizado entre `a` y `b` segundos. */
export const tramo = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
/** Visible entre `ini` y `fin` con entrada y salida suaves (0..1). */
export const ventana = (t: number, ini: number, fin: number, d = 0.25) =>
  Math.min(tramo(t, ini, ini + d), 1 - tramo(t, fin - d, fin));

// ---------- fondo: oficina ----------
const edificios = Array.from({length: 14}, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 91.7 + n * 13.3) + 1) / 2);
  return {x: 60 + i * 62, w: 50 + r(1) * 34, h: 160 + r(2) * 300, tono: r(3)};
});

/** Oficina plana en la paleta de la marca. `foco` 0 = nítida, 1 = desenfocada al fondo. */
export const Oficina: React.FC<{foco?: number; zoom?: number}> = ({foco = 0, zoom = 1}) => {
  const t = useT();
  const deriva = Math.sin(t * 0.35) * 8;
  return (
    <AbsoluteFill style={{background: COLOR.pared}}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom}) translateX(${deriva}px)`,
          filter: `blur(${foco * 10}px)`,
        }}
      >
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#CFE0DC" />
              <stop offset="1" stopColor="#EAF1EE" />
            </linearGradient>
            <linearGradient id="pared" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F2EFE7" />
              <stop offset="1" stopColor="#E4DFD2" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="url(#pared)" />
          {/* ventana */}
          <rect x={90} y={300} width={900} height={760} rx={6} fill="url(#cielo)" />
          {edificios.map((e, i) => (
            <g key={i}>
              <rect x={e.x + 40} y={1060 - e.h} width={e.w} height={e.h}
                fill={e.tono > 0.6 ? COLOR.tealClaro : e.tono > 0.3 ? '#B7CEC9' : '#A9C4BF'} />
              {Array.from({length: Math.floor(e.h / 46)}, (_, k) => (
                <rect key={k} x={e.x + 52} y={1060 - e.h + 18 + k * 46} width={e.w - 24} height={8}
                  fill="#F4F1E6" opacity={0.7} />
              ))}
            </g>
          ))}
          <rect x={90} y={300} width={900} height={760} rx={6} fill="none" stroke="#FFFFFF" strokeWidth={26} />
          <rect x={530} y={300} width={20} height={760} fill="#FFFFFF" />
          <rect x={90} y={660} width={900} height={16} fill="#FFFFFF" />
          {/* bandera de Colombia junto a la ventana, como en las piezas de la firma */}
          <g transform="translate(905 1110)">
            <rect x={-4} y={-10} width={8} height={420} fill={COLOR.doradoOsc} />
            <path d="M4 0 h120 v40 h-120z" fill="#F2C230" />
            <path d="M4 40 h120 v20 h-120z" fill="#1F4E9C" />
            <path d="M4 60 h120 v20 h-120z" fill="#C8313B" />
          </g>
          {/* zócalo y escritorio */}
          <rect x={0} y={1240} width={W} height={H - 1240} fill={COLOR.teal} />
          <rect x={0} y={1240} width={W} height={10} fill={COLOR.dorado} />
          <rect x={0} y={1420} width={W} height={60} fill={COLOR.teal2} />
          {/* planta */}
          <g transform="translate(150 1240)">
            <path d="M-50 0 h100 l-14 120 h-72z" fill={COLOR.dorado} />
            {[-60, -30, 0, 30, 60].map((a, i) => (
              <ellipse key={i} cx={Math.sin((a * Math.PI) / 180) * 70} cy={-80 - Math.cos((a * Math.PI) / 180) * 30}
                rx={26} ry={90} fill={i % 2 ? '#3F7058' : '#2F5E49'}
                transform={`rotate(${a + Math.sin(t * 0.8 + i) * 2} ${Math.sin((a * Math.PI) / 180) * 70} ${-80 - Math.cos((a * Math.PI) / 180) * 30})`} />
            ))}
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- capa de marca fija ----------
export const TituloFijo: React.FC<{lineas: [string, string]; hasta: number; ante?: string}> = ({lineas, hasta, ante}) => {
  const t = useT();
  const entra = usePop(0.05, 160, 16);
  const sale = tramo(t, hasta - 0.3, hasta);
  return (
    <div style={{position: 'absolute', top: SEGURO.top - 30, left: 50, right: 50, display: 'flex', justifyContent: 'center',
      opacity: 1 - sale, transform: `translateY(${(1 - entra) * -60}px)`}}>
      <div style={{background: COLOR.teal, padding: '22px 34px 24px', transform: 'skewX(-6deg)',
        borderLeft: `10px solid ${COLOR.dorado}`, boxShadow: '0 18px 40px rgba(10,30,30,.28)'}}>
        <div style={{transform: 'skewX(6deg)', textAlign: 'center'}}>
          {ante && <div style={{fontFamily: FUENTES.sans, fontWeight: 800, color: COLOR.dorado, fontSize: 22, letterSpacing: 5, marginBottom: 8}}>{ante}</div>}
          <div style={{fontFamily: FUENTES.serif, color: COLOR.crema, fontSize: 50, lineHeight: 1.15}}>{lineas[0]}</div>
          <div style={{fontFamily: FUENTES.serif, color: COLOR.dorado, fontSize: 50, lineHeight: 1.15, fontWeight: 700}}>{lineas[1]}</div>
        </div>
      </div>
    </div>
  );
};

/** Emblema + @ sobre el zócalo, dentro de la zona segura (arriba lo tapa la interfaz de Instagram). */
export const MarcaEsquina: React.FC<{hasta: number; y?: number}> = ({hasta, y = 1372}) => {
  const t = useT();
  const o = ventana(t, 0.2, hasta);
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center',
      alignItems: 'center', gap: 16, opacity: o * 0.95}}>
      <Img src={staticFile('arca/emblema-claro.png')} style={{height: 40}} />
      <span style={{fontFamily: FUENTES.serif, fontSize: 26, color: COLOR.crema, letterSpacing: 2}}>ARCA JURÍDICA</span>
      <span style={{width: 2, height: 28, background: COLOR.dorado}} />
      <span style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 26, color: COLOR.dorado}}>@arcajuridica</span>
    </div>
  );
};

// ---------- subtítulos por frase ----------
/** Frases cortas (máx. `max` palabras o hasta un signo), blancas con borde oscuro; palabras clave en dorado. */
export const Subtitulos: React.FC<{palabras: Palabra[]; claves: string[]; y?: number; max?: number; hasta?: number}> = ({
  palabras, claves, y = 1430, max = 4, hasta = 999,
}) => {
  const t = useT();
  const frame = useCurrentFrame();
  if (t > hasta) return null;
  const bloques: number[][] = [];
  let actual: number[] = [];
  palabras.forEach((p, i) => {
    actual.push(i);
    if (/[.,:?!]$/.test(p.text) || actual.length >= max) {
      bloques.push(actual);
      actual = [];
    }
  });
  if (actual.length) bloques.push(actual);
  const idx = bloques.findIndex((b, i) => {
    const ini = palabras[b[0]].start - 0.08;
    const sig = bloques[i + 1];
    const fin = sig ? palabras[sig[0]].start - 0.08 : palabras[b[b.length - 1]].end + 0.6;
    return t >= ini && t < fin;
  });
  if (idx < 0) return null;
  const b = bloques[idx];
  const limpia = (s: string) => s.toLowerCase().replace(/[¿?¡!.,:]/g, '');
  const sClave = new Set(claves.map(limpia));
  const entra = spring({frame: frame - Math.round((palabras[b[0]].start - 0.08) * FPS), fps: FPS, config: {stiffness: 260, damping: 18}});
  return (
    <div style={{position: 'absolute', top: y, left: SEGURO.left, right: SEGURO.right - 60, textAlign: 'center',
      transform: `translateY(${(1 - entra) * 24}px) scale(${0.92 + entra * 0.08})`, opacity: Math.min(1, entra * 1.4)}}>
      {b.map((i) => {
        const p = palabras[i];
        const dicha = p.start - 0.08 <= t;
        const clave = sClave.has(limpia(p.text));
        return (
          <span key={i} style={{
            display: 'inline-block', margin: '0 10px', fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 70,
            lineHeight: 1.2, textTransform: 'uppercase',
            color: clave ? COLOR.dorado : '#FFFFFF', opacity: dicha ? 1 : 0.55,
            WebkitTextStroke: `10px ${COLOR.teal}`, paintOrder: 'stroke fill',
            textShadow: '0 6px 18px rgba(0,0,0,.25)',
          }}>{p.text.replace(/[¿?¡!,:]/g, '').replace(/\.$/, '')}</span>
        );
      })}
    </div>
  );
};

// ---------- piezas gráficas ----------
export const Sello: React.FC<{texto: string; en: number; color?: string; rot?: number; size?: number}> = ({
  texto, en, color = COLOR.alerta, rot = -10, size = 64,
}) => {
  const p = usePop(en, 320, 16);
  const t = useT();
  if (t < en) return null;
  return (
    <div style={{display: 'inline-block', transform: `rotate(${rot}deg) scale(${2.4 - 1.4 * p})`, opacity: Math.min(1, p * 2),
      border: `8px solid ${color}`, borderRadius: 14, padding: '10px 26px', color, fontFamily: FUENTES.sans,
      fontWeight: 800, fontSize: size, letterSpacing: 3, background: 'rgba(255,255,255,.88)', whiteSpace: 'nowrap'}}>
      {texto}
    </div>
  );
};

/** Sacudida corta tras un impacto (px). */
export const useSacudida = (en: number, fuerza = 14) => {
  const t = useT();
  const d = t - en;
  if (d < 0 || d > 0.35) return 0;
  return Math.sin(d * 90) * fuerza * (1 - d / 0.35);
};

export const Hoja: React.FC<{titulo: string; ancho?: number; alto?: number; lineas?: number; trazo?: number; children?: React.ReactNode}> = ({
  titulo, ancho = 600, alto = 760, lineas = 7, trazo = 1, children,
}) => (
  <div style={{position: 'relative', width: ancho, height: alto, background: COLOR.papel, borderRadius: 10,
    boxShadow: '0 30px 60px rgba(10,30,30,.25)', padding: '56px 54px', boxSizing: 'border-box', borderTop: `14px solid ${COLOR.teal}`}}>
    <div style={{fontFamily: FUENTES.serif, fontSize: 38, color: COLOR.teal, fontWeight: 700, lineHeight: 1.2}}>{titulo}</div>
    <div style={{height: 4, width: 90, background: COLOR.dorado, margin: '22px 0 34px'}} />
    {Array.from({length: lineas}, (_, i) => {
      const w = [100, 92, 97, 84, 95, 70, 88, 60][i % 8];
      const v = Math.max(0, Math.min(1, trazo * lineas - i));
      return <div key={i} style={{height: 14, borderRadius: 7, background: '#DCE3E1', width: `${w * v}%`, marginBottom: 26}} />;
    })}
    {children}
  </div>
);

/** Flecha circular de renovación que gira. */
export const Ciclo: React.FC<{size: number; color?: string; vuelta: number}> = ({size, color = COLOR.alerta, vuelta}) => (
  <svg width={size} height={size} viewBox="-100 -100 200 200" style={{transform: `rotate(${vuelta * 360}deg)`}}>
    {[0, 180].map((a) => (
      <g key={a} transform={`rotate(${a})`}>
        <path d="M -78 -20 A 80 80 0 0 1 60 -53" fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" />
        <path d="M 46 -78 L 76 -50 L 38 -36 Z" fill={color} />
      </g>
    ))}
  </svg>
);

export const Check: React.FC<{p: number; size?: number}> = ({p, size = 90}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={46} fill={COLOR.ok} transform={`scale(${p})`} style={{transformOrigin: '50px 50px'}} />
    <path d="M28 52 L44 67 L73 35" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={80} strokeDashoffset={80 * (1 - Math.max(0, p * 1.4 - 0.4))} />
  </svg>
);

// ---------- cierre ----------
export const Cierre: React.FC<{desde: number}> = ({desde}) => {
  const t = useT();
  const o = tramo(t, desde, desde + 0.35);
  const p = usePop(desde + 0.15, 140, 14);
  const lema = tramo(t, desde + 0.6, desde + 1.1);
  if (t < desde) return null;
  return (
    <AbsoluteFill style={{background: COLOR.teal, opacity: o, alignItems: 'center', justifyContent: 'center', gap: 40}}>
      <Img src={staticFile('arca/logo-claro.png')} style={{width: 640, transform: `scale(${0.8 + 0.2 * p})`, opacity: p}} />
      <div style={{fontFamily: FUENTES.serif, fontStyle: 'italic', fontSize: 52, color: COLOR.dorado, opacity: lema,
        transform: `translateY(${(1 - lema) * 20}px)`}}>Tu empresa en buenas manos</div>
      <div style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 40, color: COLOR.crema, opacity: lema, letterSpacing: 1}}>
        @arcajuridica
      </div>
    </AbsoluteFill>
  );
};

// ---------- cámara 2D ----------
export type ClaveCam = {t: number; s?: number; x?: number; y?: number};
/** Acercamientos y paneos por claves de tiempo (escala y desplazamiento del escenario, con suavizado). */
export const Camara: React.FC<{claves: ClaveCam[]; children: React.ReactNode}> = ({claves, children}) => {
  const t = useT();
  const val = (k: 's' | 'x' | 'y', def: number) => {
    const ts = claves.map((c) => c.t);
    const vs = claves.map((c) => c[k] ?? def);
    if (ts.length === 1) return vs[0];
    return interpolate(t, ts, vs, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  };
  return (
    <AbsoluteFill style={{transform: `translate(${val('x', 0)}px, ${val('y', 0)}px) scale(${val('s', 1)})`}}>{children}</AbsoluteFill>
  );
};

// ---------- número de paso ----------
/** Número grande que entra al centro y luego se reduce a insignia arriba a la izquierda. */
export const Paso: React.FC<{n: number; en: number; hasta: number; etiqueta: string}> = ({n, en, hasta, etiqueta}) => {
  const t = useT();
  const entra = usePop(en, 260, 15);
  if (t < en || t > hasta) return null;
  const va = tramo(t, en + 0.75, en + 1.15);
  const sale = tramo(t, hasta - 0.2, hasta);
  const x = interpolate(va, [0, 1], [540, 150]);
  const y = interpolate(va, [0, 1], [880, 430]);
  const s = interpolate(va, [0, 1], [1, 0.32]);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${x + (1 - entra) * 600}px, ${y}px)`, opacity: 1 - sale}}>
      <div style={{transform: `translate(-50%, -50%) scale(${s})`, display: 'flex', alignItems: 'center', gap: 40}}>
        <div style={{width: 420, height: 420, borderRadius: '50%', background: COLOR.teal, border: `16px solid ${COLOR.dorado}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 60px rgba(0,0,0,.3)'}}>
          <span style={{fontFamily: FUENTES.serif, fontWeight: 700, fontSize: 300, color: COLOR.dorado, lineHeight: 1}}>{n}</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 90 * (1 - va) + 80 * va, top: -40 + 10 * va, opacity: va,
        whiteSpace: 'nowrap', fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 40, color: COLOR.teal,
        background: 'rgba(255,255,255,.9)', padding: '8px 20px', borderRadius: 10}}>{etiqueta}</div>
    </div>
  );
};

// ---------- remate de venta: "Arca se encarga" ----------
export type Servicio = {texto: string; en: number};
/**
 * Propuesta de valor al final de cada video (ver skill estilo-arca-juridica).
 * 1) pila de documentos del tema ("no tienes que hacerlo solo"), 2) escudo de Arca,
 * 3) lista de servicios con check dorado en cada verbo, 4) botón ESCRÍBENOS.
 */
export const CierreServicios: React.FC<{
  desde: number; hasta: number; documentos: string[]; arcaEn: number; servicios: Servicio[]; escribenosEn: number;
}> = ({desde, hasta, documentos, arcaEn, servicios, escribenosEn}) => {
  const t = useT();
  const frame = useCurrentFrame();
  const escudo = usePop(arcaEn, 200, 13);
  const boton = usePop(escribenosEn, 240, 11);
  const o = ventana(t, desde, hasta, 0.2);
  if (o <= 0) return null;
  const pila = 1 - tramo(t, arcaEn - 0.1, arcaEn + 0.35);
  const lista = tramo(t, arcaEn + 0.2, arcaEn + 0.6);
  const latido = t > escribenosEn + 0.4 ? 1 + Math.sin((frame / FPS - escribenosEn) * 6) * 0.03 : 1;
  return (
    <AbsoluteFill style={{opacity: o}}>
      {/* 1. pila de documentos */}
      {pila > 0 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 190, opacity: pila,
          transform: `scale(${0.85 + 0.15 * pila}) translateY(${(1 - pila) * 120}px)`}}>
          {documentos.map((d, i) => {
            const p = spring({frame: frame - Math.round((desde + i * 0.22) * FPS), fps: FPS, config: {stiffness: 220, damping: 14}});
            const rot = [-7, 5, -3, 8][i % 4];
            return (
              <div key={d} style={{position: 'absolute', transform: `translateY(${(1 - p) * -700 + i * -26}px) rotate(${rot}deg)`}}>
                <div style={{width: 520, height: 300, background: COLOR.papel, borderRadius: 10, borderTop: `12px solid ${COLOR.teal}`,
                  boxShadow: '0 20px 40px rgba(0,0,0,.22)', padding: '30px 36px', boxSizing: 'border-box'}}>
                  <div style={{fontFamily: FUENTES.serif, fontWeight: 700, fontSize: 34, color: COLOR.teal}}>{d}</div>
                  {[92, 80, 86].map((w, k) => <div key={k} style={{height: 12, width: `${w}%`, background: '#DCE3E1', borderRadius: 6, marginTop: 22}} />)}
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}
      {/* 2-4. escudo + servicios + botón */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 170, gap: 30}}>
        <div style={{transform: `scale(${escudo})`, position: 'relative', width: 230, height: 260}}>
          <svg width={230} height={260} viewBox="0 0 230 260" style={{position: 'absolute', filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.3))'}}>
            <path d="M115 8 L 218 46 V 120 C 218 186, 172 230, 115 252 C 58 230, 12 186, 12 120 V 46 Z" fill={COLOR.teal} stroke={COLOR.dorado} strokeWidth={10} />
          </svg>
          <Img src={staticFile('arca/emblema-claro.png')} style={{position: 'absolute', left: 40, top: 92, width: 150}} />
        </div>
        <div style={{opacity: lista, transform: `translateY(${(1 - lista) * 40}px)`, width: 820, background: COLOR.papel, borderRadius: 22,
          padding: '30px 42px', boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,.25)', borderTop: `14px solid ${COLOR.teal}`}}>
          <div style={{fontFamily: FUENTES.serif, fontWeight: 700, fontSize: 44, color: COLOR.teal, marginBottom: 10}}>
            Arca Jurídica <span style={{color: COLOR.doradoOsc}}>se encarga</span>
          </div>
          {servicios.map((s, i) => {
            const c = tramo(t, s.en, s.en + 0.3);
            return (
              <div key={s.texto} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '14px 0',
                borderBottom: i < servicios.length - 1 ? '2px solid #E4E9E7' : 'none'}}>
                <div style={{width: 56, height: 56, borderRadius: 28, background: c > 0 ? COLOR.dorado : '#E4E9E7', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + Math.sin(c * Math.PI) * 0.25})`, flexShrink: 0}}>
                  <svg width={34} height={34} viewBox="0 0 100 100"><path d="M22 52 L 42 71 L 78 31" fill="none" stroke={COLOR.teal} strokeWidth={14}
                    strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - c)} /></svg>
                </div>
                <div style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 36, color: c > 0.5 ? COLOR.tinta : '#9AA8A6', lineHeight: 1.15}}>{s.texto}</div>
              </div>
            );
          })}
        </div>
        <div style={{transform: `scale(${boton * latido})`, background: COLOR.dorado, color: COLOR.teal, borderRadius: 999, padding: '20px 56px',
          fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 48, letterSpacing: 2, boxShadow: '0 20px 40px rgba(0,0,0,.3)'}}>
          ESCRÍBENOS
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- serie "Actualidad laboral" ----------
/** Tarjeta de fuente: entidad, sala, número y fecha. Da credibilidad a las noticias. */
export const Fuente: React.FC<{entidad: string; detalle: string; numero: string; fecha: string; en: number}> = ({entidad, detalle, numero, fecha, en}) => {
  const p = usePop(en, 200, 15);
  return (
    <div style={{transform: `scale(${0.7 + 0.3 * p}) translateY(${(1 - p) * 60}px)`, opacity: Math.min(1, p * 1.5), width: 820,
      background: COLOR.papel, borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,.28)'}}>
      <div style={{background: COLOR.teal, padding: '22px 36px', display: 'flex', alignItems: 'center', gap: 22}}>
        <svg width={64} height={64} viewBox="0 0 100 100"><path d="M50 8 L 92 30 H 8 Z" fill={COLOR.dorado} />
          {[18, 38, 58, 78].map((x) => <rect key={x} x={x} y={36} width={8} height={40} fill={COLOR.dorado} />)}<rect x={8} y={80} width={84} height={10} fill={COLOR.dorado} /></svg>
        <div>
          <div style={{fontFamily: FUENTES.serif, fontWeight: 700, fontSize: 38, color: COLOR.crema}}>{entidad}</div>
          <div style={{fontFamily: FUENTES.sans, fontWeight: 600, fontSize: 26, color: COLOR.dorado}}>{detalle}</div>
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 36px'}}>
        <span style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 52, color: COLOR.tinta, letterSpacing: 1}}>{numero}</span>
        <span style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 28, color: '#6B7B79'}}>{fecha}</span>
      </div>
    </div>
  );
};

// ---------- avatares (DiceBear notionists, CC0) ----------
/** Avatar sobrio de trazo lineal sobre círculo de la marca. Opciones fijas: sin gestos ni íconos en la ropa. */
export const Avatar: React.FC<{semilla: string; size?: number; fondo?: string; mujer?: boolean}> = ({semilla, size = 150, fondo = COLOR.crema, mujer}) => {
  const uri = React.useMemo(
    () =>
      createAvatar(notionists, {
        seed: semilla,
        gestureProbability: 0,
        bodyIconProbability: 0,
        beardProbability: mujer ? 0 : 30,
        glassesProbability: 20,
      }).toDataUri(),
    [semilla, mujer],
  );
  return (
    <div style={{width: size, height: size, borderRadius: '50%', background: fondo, overflow: 'hidden', border: `5px solid ${COLOR.dorado}`, flexShrink: 0}}>
      <Img src={uri} style={{width: '100%', height: '100%'}} />
    </div>
  );
};
