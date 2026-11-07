const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [html,dir,trackOut]=process.argv.slice(2);fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader']});
const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
p.on('pageerror',e=>console.log('PAGEERR',e.message));
await p.goto('file://'+html);await p.waitForFunction(()=>window.__listo,null,{timeout:30000});
const dur=await p.evaluate(()=>window.__dur);const n=Math.round(dur*30);const tr=[];
for(let i=0;i<n;i++){tr.push(await p.evaluate(t=>window.__frame(t),i/30));await p.screenshot({path:`${dir}/f${String(i).padStart(4,'0')}.png`});}
fs.writeFileSync(trackOut,JSON.stringify(tr));await b.close();console.log(n,'frames');})();
