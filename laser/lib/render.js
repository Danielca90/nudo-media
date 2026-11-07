// node render.js in.svg out.png [ancho alto]  — SVG → PNG con Chromium (Playwright preinstalado)
const {chromium} = require('playwright');
const fs = require('fs'); const path = require('path');
(async () => {
  const jobs = JSON.parse(process.argv[2]); // [[in,out,w,h,scale]]
  const b = await chromium.launch();
  for (const [i, o, w, h, s] of jobs) {
    const p = await b.newPage({viewport: {width: w, height: h}, deviceScaleFactor: s || 1});
    await p.setContent('<body style="margin:0;background:#fff">' + fs.readFileSync(i, 'utf8').replace(/<svg ([^>]*?)width="[^"]+" height="[^"]+"/, '<svg $1style="width:100%;height:100%"') + '</body>');
    await p.screenshot({path: o});
    await p.close();
  }
  await b.close();
})();
