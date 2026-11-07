const {chromium}=require('playwright');
(async()=>{const [html,pre,...ts]=process.argv.slice(2);
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader']});
const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
p.on('console',m=>{if(m.type()==='error')console.log('ERR',m.text())});p.on('pageerror',e=>console.log('PAGEERR',e.message));
await p.goto('file://'+html);await p.waitForFunction(()=>window.__listo,null,{timeout:30000});
for(const t of ts){const tr=await p.evaluate(t=>window.__frame(+t),t);await p.screenshot({path:`${pre}_${t}.png`});console.log(t,JSON.stringify(tr));}
await b.close();})();
