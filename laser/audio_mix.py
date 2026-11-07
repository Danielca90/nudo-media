#!/usr/bin/env python3
"""Mezcla de audio de los reels: voz (ElevenLabs) + base musical sintetizada + efectos de láser. Todo propio, sin derechos de terceros.
Lee los tiempos de remotion-test/src/laser/tiempos.json y escribe public/laser/audio/mix_vN.mp3 normalizado a -14 LUFS."""
import json, os, subprocess, wave, sys
import numpy as np

SR = 44100
AQUI = os.path.dirname(os.path.abspath(__file__))
REM = os.path.join(AQUI, '..', 'remotion-test')
T = json.load(open(os.path.join(REM, 'src', 'laser', 'tiempos.json')))
rng = np.random.default_rng(7)

def env(n, a=0.005, r=0.1):
    e = np.ones(n); na = int(a*SR); nr = int(r*SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e

def lp(x, k):  # media móvil (paso bajo simple)
    c = np.cumsum(np.insert(x, 0, 0)); y = (c[k:] - c[:-k]) / k
    return np.concatenate([np.full(k - 1, y[0]), y])

def sizzle(d):
    n = int(d*SR)
    ruido = rng.standard_normal(n)
    alto = ruido - lp(ruido, 6)               # chisporroteo agudo
    crep = np.zeros(n); idx = rng.integers(0, n, int(d*55)); crep[idx] = rng.uniform(0.5, 1, len(idx))
    crep = np.convolve(crep, np.exp(-np.linspace(0, 9, 120)), 'same')
    modul = 0.65 + 0.35*np.sin(2*np.pi*np.linspace(0, d, n)*9 + 1.3)
    zumbido = 0.25*np.sin(2*np.pi*118*np.arange(n)/SR) + 0.12*np.sin(2*np.pi*236*np.arange(n)/SR)
    return (0.5*alto*modul + 1.1*crep + zumbido) * env(n, 0.04, 0.2)

def whoosh(d=0.7):
    n = int(d*SR); ruido = rng.standard_normal(n)
    k = np.linspace(4, 60, n).astype(int); out = np.zeros(n)
    for a in range(0, n, 2048):
        kk = max(2, int(k[a])); seg = ruido[a:a+2048]
        out[a:a+2048] = lp(np.concatenate([np.zeros(kk), seg]), kk)[kk:][:len(seg)] if False else seg - lp(seg, kk)
    e = np.sin(np.linspace(0, np.pi, n))**2
    return out * e * 0.9

def pop(d=0.12):
    n = int(d*SR); t = np.arange(n)/SR
    f = 900*np.exp(-t*14) + 260
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*30)

def tick(d=0.2):
    n = int(d*SR); t = np.arange(n)/SR
    return (np.sin(2*np.pi*1500*t) + 0.5*np.sin(2*np.pi*2250*t)) * np.exp(-t*28) * 0.7

def ding(d=1.6):
    n = int(d*SR); t = np.arange(n)/SR
    return sum(a*np.sin(2*np.pi*f*t)*np.exp(-t*r) for f, a, r in [(1318, 1, 2.6), (1976, .45, 3.5), (2637, .25, 5), (3951, .1, 8)])

def kick(): n = int(.22*SR); t = np.arange(n)/SR; return np.sin(2*np.pi*np.cumsum(45 + 110*np.exp(-t*28))/SR) * np.exp(-t*11)
def hat(): n = int(.05*SR); return (lambda r: r - lp(r, 3))(rng.standard_normal(n)) * np.exp(-np.linspace(0, 7, n)) * 0.35
def nota(f, d, a=0.3):
    n = int(d*SR); t = np.arange(n)/SR
    v = np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*2*f*t)*np.exp(-t*3) + 0.15*np.sin(2*np.pi*3*f*t)*np.exp(-t*6)
    return v * np.exp(-t*2.2) * env(n, .004, .05) * a

def musica(dur, bpm=94):
    n = int(dur*SR); m = np.zeros(n); beat = 60/bpm
    acordes = [(220.0, [440.0, 523.25, 659.25]), (174.61, [349.23, 440.0, 523.25]), (261.63, [523.25, 659.25, 784.0]), (196.0, [392.0, 493.88, 587.33])]
    b = 0
    while b*beat < dur:
        t0 = b*beat; bar = int(b // 4) % 4; raiz, ac = acordes[bar]; i0 = int(t0*SR)
        def add(x, off=0):
            s = i0 + int(off*SR); e = min(n, s + len(x))
            if s < n: m[s:e] += x[:e-s]
        if b % 4 in (0, 2): add(kick()*0.9)
        add(hat(), beat/2); 
        if b % 4 == 0: add(nota(raiz/2, beat*3.8, 0.5))
        for j, f in enumerate(ac): add(nota(f, beat*1.8, 0.16), beat*0.5*j)
        b += 1
    m *= np.minimum(1, np.linspace(0, dur, n)/1.0) * np.minimum(1, (dur - np.linspace(0, dur, n))/1.5)
    return m

def cargar_voz(ruta):
    tmp = '/tmp/voz.wav'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', ruta, '-ar', str(SR), '-ac', '1', tmp], check=True)
    w = wave.open(tmp); x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64)/32768; return x

def mezclar(nombre):
    V = T[nombre]; dur = V['duracion']; n = int(dur*SR)
    voz = cargar_voz(os.path.join(REM, 'public', V['voz']))
    pista_voz = np.zeros(n); s = int(V['offset']*SR); pista_voz[s:s+len(voz)] = voz[:n-s]
    # ducking: la música baja cuando habla la voz
    ev = lp(np.abs(pista_voz), int(0.12*SR)); ev = np.clip(ev/ (ev.max()+1e-9)*4, 0, 1)
    mus = musica(dur) * (0.55 - 0.33*ev)
    fx = np.zeros(n)
    def poner(x, t, g):
        s = int(t*SR)
        if s < n: e = min(n, s+len(x)); fx[s:e] += x[:e-s]*g
    for e in V['eventos']:
        tipo, g = e['tipo'], e.get('g', 1)
        x = {'sizzle': lambda: sizzle(e.get('d', 1.5)), 'whoosh': whoosh, 'pop': pop, 'tick': tick, 'ding': ding}[tipo]()
        poner(x, e['t'], g*0.5)
    if 'pops' in V:
        p = V['pops']
        for i in range(p['n']): poner(pop(0.09), p['desde'] + (p['hasta']-p['desde'])*i/p['n'], 0.22)
    total = pista_voz*1.0 + mus*0.9 + fx*0.9
    total = np.tanh(total*1.1)
    pcm = (np.clip(total, -1, 1)*32767).astype(np.int16)
    wav = '/tmp/mix_%s.wav' % nombre
    w = wave.open(wav, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
    out = os.path.join(REM, 'public', 'laser', 'audio', 'mix_%s.mp3' % nombre)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9', '-ar', '44100', '-b:a', '192k', out], check=True)
    r = subprocess.run(['ffmpeg', '-i', out, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
    print(nombre, [l.strip() for l in r.split('\n') if 'mean_volume' in l or 'max_volume' in l])

for k in (sys.argv[1:] or ['v1', 'v2', 'v3']): mezclar(k)
