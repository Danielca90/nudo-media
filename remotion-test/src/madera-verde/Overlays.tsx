import React from 'react';

const MONO = '"JetBrains Mono", monospace';
const SANS = 'Inter, sans-serif';

// Etiqueta con línea guía hasta el punto exacto del modelo.
export const Etiqueta: React.FC<{
  punto: {x: number; y: number};
  texto: string;
  dx?: number;
  dy?: number;
  op: number;
  color?: string;
}> = ({punto, texto, dx = 160, dy = -110, op, color = '#f5b942'}) => {
  if (op <= 0) return null;
  const anchoTxt = texto.length * 21 + 36;
  const lx = punto.x + dx;
  const ly = punto.y + dy;
  // la caja del texto siempre dentro de la pantalla (márgenes de 40 px)
  const izq = Math.max(40, Math.min(1040 - anchoTxt, dx >= 0 ? lx : lx - anchoTxt));
  const largo = Math.min(1, op * 1.6);
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, overflow: 'visible'}}>
        <line
          x1={punto.x}
          y1={punto.y}
          x2={punto.x + (lx - punto.x) * largo}
          y2={punto.y + (ly - punto.y) * largo}
          stroke={color}
          strokeWidth={3}
        />
        <circle cx={punto.x} cy={punto.y} r={8} fill={color} stroke="#000" strokeWidth={2} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: izq,
          top: ly - 26,
          opacity: Math.max(0, op * 2 - 1),
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 2,
          color,
          background: 'rgba(10,10,12,0.82)',
          border: `2px solid ${color}`,
          borderRadius: 8,
          padding: '6px 14px',
          whiteSpace: 'nowrap',
        }}
      >
        {texto}
      </div>
    </>
  );
};

// Tarjeta de datos (estilo panel), con fuente.
export const Tarjeta: React.FC<{
  titulo: string;
  top: number;
  op: number;
  fuente?: string;
  children: React.ReactNode;
  ancho?: number;
}> = ({titulo, top, op, fuente, children, ancho = 760}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: (1080 - ancho) / 2,
      width: ancho,
      opacity: op,
      transform: `translateY(${(1 - op) * 30}px)`,
      background: 'rgba(12,13,16,0.88)',
      border: '2px solid rgba(255,255,255,0.14)',
      borderRadius: 18,
      padding: '22px 30px',
      boxSizing: 'border-box',
      fontFamily: SANS,
      color: '#fff',
    }}
  >
    <div style={{fontSize: 26, fontWeight: 800, letterSpacing: 4, color: 'rgba(255,255,255,0.75)'}}>{titulo}</div>
    {children}
    {fuente && <div style={{marginTop: 10, fontSize: 20, color: 'rgba(255,255,255,0.45)'}}>{fuente}</div>}
  </div>
);

export const Barra: React.FC<{valor: number; max: number; color: string; etiqueta: string; texto: string}> = ({
  valor,
  max,
  color,
  etiqueta,
  texto,
}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 14}}>
    <div style={{width: 130, fontSize: 28, fontWeight: 700}}>{etiqueta}</div>
    <div style={{flex: 1, height: 26, background: 'rgba(255,255,255,0.08)', borderRadius: 13, overflow: 'hidden'}}>
      <div style={{width: `${Math.max(1.2, (valor / max) * 100)}%`, height: '100%', background: color, borderRadius: 13}} />
    </div>
    <div style={{width: 130, textAlign: 'right', fontFamily: MONO, fontSize: 34, fontWeight: 700, color}}>{texto}</div>
  </div>
);

export const Valor: React.FC<{texto: string; color?: string}> = ({texto, color = '#fff'}) => (
  <div style={{fontFamily: MONO, fontSize: 64, fontWeight: 700, color, marginTop: 6}}>{texto}</div>
);
