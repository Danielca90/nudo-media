// Objetos de escritorio para abrir videos de Arca con una imagen rica (bodegón sobre la mesa).
// Solo CSS + transform/opacity: render rápido. Billetes genéricos (no imitan ningún billete real).
import React from 'react';
import {COLOR, FUENTES} from './marca';
import {DOC, Papel, cop} from './documental';

const sombra = '0 30px 50px rgba(0,0,0,.55), 0 6px 14px rgba(0,0,0,.35)';
const MONO = `"Courier New", Courier, monospace`;
type Pos = {x: number; y: number; rot?: number; s?: number; style?: React.CSSProperties};
const ubicar = ({x, y, rot = 0, s = 1, style}: Pos): React.CSSProperties => ({
  position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${s})`, transformOrigin: '50% 50%', ...style,
});

/** Billete genérico (sin diseño de ningún billete real). */
export const Billete: React.FC<Pos> = (p) => (
  <div style={{...ubicar(p), width: 430, height: 200, borderRadius: 8, boxShadow: sombra, overflow: 'hidden',
    background: 'linear-gradient(120deg,#C9C2A3,#A9A585 45%,#BDB492)'}}>
    <div style={{position: 'absolute', inset: 12, border: '3px solid rgba(60,70,55,.35)', borderRadius: 6}} />
    <div style={{position: 'absolute', left: 30, top: 40, width: 120, height: 120, borderRadius: '50%',
      background: 'repeating-radial-gradient(circle, rgba(60,70,55,.3) 0 3px, transparent 3px 8px)'}} />
    <div style={{position: 'absolute', right: 34, top: 50, fontFamily: FUENTES.serif, fontWeight: 700, fontSize: 84, color: 'rgba(45,55,45,.75)'}}>$</div>
    <div style={{position: 'absolute', left: 170, top: 74, right: 110, height: 6, background: 'rgba(60,70,55,.25)', boxShadow: '0 22px 0 rgba(60,70,55,.2), 0 44px 0 rgba(60,70,55,.15)'}} />
  </div>
);
/** Fajo: varios billetes con banda dorada. */
export const Fajo: React.FC<Pos & {n?: number}> = ({n = 4, ...p}) => (
  <div style={{...ubicar(p), width: 430, height: 200}}>
    {Array.from({length: n}).map((_, i) => <Billete key={i} x={i * 4} y={-i * 6} rot={(i % 2 ? 1.5 : -1) * i} />)}
    <div style={{position: 'absolute', left: 180, top: -n * 6, width: 70, height: 200 + n * 6, background: `linear-gradient(90deg,${COLOR.doradoOsc},${COLOR.dorado},${COLOR.doradoOsc})`, boxShadow: '0 4px 8px rgba(0,0,0,.3)'}} />
  </div>
);

/** Calculadora con la cifra en pantalla. */
export const Calculadora: React.FC<Pos & {valor: string}> = ({valor, ...p}) => (
  <div style={{...ubicar(p), width: 360, height: 520, borderRadius: 28, boxShadow: sombra, background: 'linear-gradient(160deg,#2C3433,#161C1B)', padding: 26}}>
    <div style={{height: 110, borderRadius: 10, background: 'linear-gradient(180deg,#B9C7A8,#A5B593)', boxShadow: 'inset 0 4px 10px rgba(0,0,0,.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 18, fontFamily: MONO, fontWeight: 700, fontSize: 46, color: '#1E2A1E'}}>{valor}</div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 24}}>
      {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '=', '+'].map((k, i) => (
        <div key={i} style={{height: 64, borderRadius: 10, background: i % 4 === 3 ? COLOR.dorado : '#3A4442', color: i % 4 === 3 ? COLOR.teal : '#E8E4D8',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 30, boxShadow: '0 4px 0 rgba(0,0,0,.4)'}}>{k}</div>
      ))}
    </div>
  </div>
);

/** Desprendible de nómina. */
export const Desprendible: React.FC<Pos> = (p) => (
  <div style={ubicar(p)}>
    <Papel ancho={560} alto={420}>
      <div style={{padding: '30px 36px', fontFamily: MONO, color: DOC.tinta}}>
        <div style={{fontWeight: 700, fontSize: 24, letterSpacing: 4}}>COMPROBANTE DE NÓMINA</div>
        <div style={{fontSize: 18, opacity: 0.6, marginTop: 6}}>Periodo: noviembre 2026</div>
        <div style={{borderTop: '2px dashed rgba(31,36,35,.3)', margin: '18px 0'}} />
        {[['Salario básico', cop(3000000)], ['Auxilio de transporte', cop(249095)], ['Salud y pensión', '−' + cop(240000)]].map(([a, b]) => (
          <div key={a} style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, padding: '6px 0'}}><span>{a}</span><b>{b}</b></div>
        ))}
        <div style={{borderTop: '2px dashed rgba(31,36,35,.3)', margin: '14px 0'}} />
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, fontWeight: 700}}><span>NETO</span><span>{cop(3009095)}</span></div>
      </div>
    </Papel>
  </div>
);

/** Carnet de la trabajadora (identidad reservada). */
export const Carnet: React.FC<Pos> = (p) => (
  <div style={{...ubicar(p), width: 300, height: 440, borderRadius: 18, background: '#F4F1EA', boxShadow: sombra, overflow: 'hidden'}}>
    <div style={{height: 70, background: COLOR.teal}} />
    <div style={{position: 'absolute', left: 125, top: -40, width: 50, height: 90, borderRadius: 10, background: '#7C8A86'}} />
    <div style={{margin: '30px auto 0', width: 150, height: 170, background: '#9AA3A0', position: 'relative', overflow: 'hidden', borderRadius: 6}}>
      <div style={{position: 'absolute', left: 45, top: 26, width: 60, height: 66, borderRadius: '50%', background: '#5E6866'}} />
      <div style={{position: 'absolute', left: 15, top: 100, width: 120, height: 110, borderRadius: '50% 50% 0 0', background: '#5E6866'}} />
    </div>
    <div style={{width: 200, height: 22, background: '#141414', margin: '22px auto 0'}} />
    <div style={{textAlign: 'center', fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 20, color: COLOR.teal, marginTop: 14, letterSpacing: 2}}>ANALISTA</div>
    <div style={{textAlign: 'center', fontFamily: FUENTES.sans, fontWeight: 600, fontSize: 17, color: '#6B6F6C', marginTop: 6}}>Desde 2023</div>
  </div>
);

/** Bolígrafo. */
export const Boligrafo: React.FC<Pos> = (p) => (
  <div style={{...ubicar(p), width: 520, height: 34, borderRadius: 17, background: 'linear-gradient(180deg,#3A4442,#111816 60%,#0A0E0D)', boxShadow: '0 24px 40px rgba(0,0,0,.6)'}}>
    <div style={{position: 'absolute', left: -50, top: 9, width: 60, height: 16, background: 'linear-gradient(180deg,#D8C089,#A8843F)', clipPath: 'polygon(100% 0,100% 100%,0 50%)'}} />
    <div style={{position: 'absolute', right: 40, top: -6, width: 140, height: 10, background: COLOR.dorado, borderRadius: 4}} />
  </div>
);

/** Sello de tinta. */
export const SelloTinta: React.FC<Pos & {texto: string}> = ({texto, ...p}) => (
  <div style={{...ubicar(p), border: `8px solid ${COLOR.alerta}`, borderRadius: 10, padding: '12px 24px', fontFamily: FUENTES.sans, fontWeight: 900,
    fontSize: 46, color: COLOR.alerta, letterSpacing: 3, opacity: 0.9}}>{texto}</div>
);
