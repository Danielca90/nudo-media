"""Arma visor.html (three.js) con los tres muebles embebidos. Correr después de generar_muebles.py."""
import base64
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
M = os.path.join(HERE, "modelos")
data = json.load(open(os.path.join(M, "despiece.json")))
modelos = {}
for k, v in data.items():
    glb = base64.b64encode(open(os.path.join(M, f"{k}.glb"), "rb").read()).decode()
    modelos[k] = {"titulo": v["titulo"], "glb": glb, "hueco": v["params"]["hueco"], "cotas": v["cotas"]}

HTML = r"""<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Muebles Nudo</title>
<style>
:root{--bg:#f4efe7;--ink:#2b2420;--muted:#7a6e64;--accent:#b5793d;--chip:#fff}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#1c1916;--ink:#efe7dc;--muted:#a89a8c;--chip:#2a2521}}
:root[data-theme="dark"]{--bg:#1c1916;--ink:#efe7dc;--muted:#a89a8c;--chip:#2a2521}
html,body{margin:0;height:100%;background:var(--bg);color:var(--ink);font:15px/1.4 -apple-system,system-ui,sans-serif;overflow:hidden}
#ui{position:fixed;top:0;left:0;right:0;padding:12px 16px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;z-index:2}
#ui h1{font-size:17px;margin:0 8px 0 0;width:100%}
button{border:1px solid color-mix(in srgb,var(--ink) 20%,transparent);background:var(--chip);color:var(--ink);border-radius:999px;padding:7px 13px;font:inherit;font-size:14px}
button.on{background:var(--accent);color:#fff;border-color:var(--accent)}
#c{position:fixed;inset:0}
.cota{font:600 13px system-ui;color:#1f5fa8;background:rgba(255,255,255,.85);padding:1px 5px;border-radius:4px;white-space:nowrap}
#nota{position:fixed;bottom:10px;left:16px;right:16px;color:var(--muted);font-size:12px}
</style>
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}}</script>
</head><body>
<div id="ui"><h1 id="tit"></h1><span id="tabs"></span>
<button id="bFr" class="on">Puertas / frentes</button><button id="bHu" class="on">Espacio</button><button id="bCo" class="on">Cotas</button></div>
<div id="c"></div>
<div id="nota">Azul: espacio disponible. Arrastra para girar, pellizca para zoom.</div>
<script type="module">
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {CSS2DRenderer,CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
const MODELOS = __DATA__;
const el=document.getElementById('c');
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;
el.appendChild(renderer.domElement);
const lab=new CSS2DRenderer();lab.domElement.style.position='fixed';lab.domElement.style.inset='0';lab.domElement.style.pointerEvents='none';el.appendChild(lab.domElement);
const scene=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(32,1,0.01,50);
const ctl=new OrbitControls(cam,renderer.domElement);ctl.enableDamping=true;
scene.add(new THREE.HemisphereLight(0xffffff,0x8a7a6a,1.6));
const sun=new THREE.DirectionalLight(0xffffff,1.6);sun.position.set(0.6,6,1.2);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-2,right:2,top:3,bottom:-1});scene.add(sun);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(10,10),new THREE.ShadowMaterial({opacity:.18}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
const P=(p)=>new THREE.Vector3(p[0]/1000,p[2]/1000,p[1]/1000);
let grp=null,frentes=[],hueco=null,cotas=null;
const st={fr:true,hu:true,co:true};
function bg(){scene.background=new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()||'#f4efe7');}
function cargar(k){
  if(grp){scene.remove(grp);grp.traverse(o=>{if(o.element)o.element.remove()});}
  grp=new THREE.Group();scene.add(grp);frentes=[];
  const m=MODELOS[k];document.getElementById('tit').textContent=m.titulo;
  document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.k===k));
  const bin=Uint8Array.from(atob(m.glb),c=>c.charCodeAt(0)).buffer;
  new GLTFLoader().parse(bin,'',g=>{
    g.scene.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;
      const e=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,30),new THREE.LineBasicMaterial({color:0x3a2c20,transparent:true,opacity:.55}));o.add(e);
      if(o.material.name==='frente')frentes.push(o);}});
    grp.add(g.scene);
    const h=m.hueco;const box=new THREE.Box3(P([0,0,0]),P([h[0],h[1],h[2]]));
    hueco=new THREE.Group();
    const hb=new THREE.Box3Helper(box,0x2f7fd8);hueco.add(hb);
    const sz=box.getSize(new THREE.Vector3()),ce=box.getCenter(new THREE.Vector3());
    const hm=new THREE.Mesh(new THREE.BoxGeometry(sz.x,sz.y,sz.z),new THREE.MeshBasicMaterial({color:0x2f7fd8,transparent:true,opacity:.06,depthWrite:false}));hm.position.copy(ce);hueco.add(hm);
    const tl=document.createElement('div');tl.className='cota';tl.style.color='#2f7fd8';tl.textContent=`espacio ${h[0]/10}×${h[1]/10}×${h[2]/10} cm`;
    const lo=new CSS2DObject(tl);lo.position.set(box.min.x,box.max.y+0.06,box.max.z);hueco.add(lo);
    grp.add(hueco);
    cotas=new THREE.Group();
    for(const c of m.cotas){const a=P(c.p0),b=P(c.p1);
      cotas.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),new THREE.LineBasicMaterial({color:0x1f5fa8})));
      const d=document.createElement('div');d.className='cota';d.textContent=c.texto;const o=new CSS2DObject(d);o.position.copy(a.clone().add(b).multiplyScalar(.5));cotas.add(o);}
    grp.add(cotas);
    aplicar();
    const ce2=box.getCenter(new THREE.Vector3());const asp=innerWidth/innerHeight;const r=Math.max(sz.y*1.95,sz.x*1.95/asp)+sz.z;
    ctl.target.copy(ce2);cam.position.set(ce2.x+r*.55,ce2.y+r*.25,ce2.z+r);ctl.update();
    window.__listo=k;
  });
}
function aplicar(){frentes.forEach(o=>o.visible=st.fr);if(hueco)hueco.visible=st.hu;if(cotas)cotas.visible=st.co;
  [['bFr','fr'],['bHu','hu'],['bCo','co']].forEach(([i,s])=>document.getElementById(i).classList.toggle('on',st[s]));}
const tabs=document.getElementById('tabs');
for(const k of Object.keys(MODELOS)){const b=document.createElement('button');b.textContent=MODELOS[k].titulo.split(' ')[0];b.dataset.k=k;b.onclick=()=>cargar(k);tabs.appendChild(b);}
bFr.onclick=()=>{st.fr=!st.fr;aplicar()};bHu.onclick=()=>{st.hu=!st.hu;aplicar()};bCo.onclick=()=>{st.co=!st.co;aplicar()};
function rs(){renderer.setSize(innerWidth,innerHeight);lab.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();}
addEventListener('resize',rs);rs();bg();
window.__cargar=cargar;window.__set=(o)=>{Object.assign(st,o);aplicar()};
cargar(new URLSearchParams(location.search).get('m')||Object.keys(MODELOS)[0]);
(function loop(){requestAnimationFrame(loop);ctl.update();renderer.render(scene,cam);lab.render(scene,cam);})();
</script></body></html>"""

out = HTML.replace("__DATA__", json.dumps(modelos))
open(os.path.join(HERE, "visor.html"), "w").write(out)
print("visor.html", len(out) // 1024, "KB")
