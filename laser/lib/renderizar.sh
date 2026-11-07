#!/bin/bash
# Mockups SVG → PNG 1200×1200 y vista previa de hojas de corte
cd "$(dirname "$0")/.."
python3 - <<'PY' > /tmp/jobs.json
import glob, json, os
jobs=[]
for f in sorted(glob.glob('mockups/*.svg')):
    jobs.append([f, f[:-4]+'.png', 1200, 1200, 1])
print(json.dumps(jobs))
PY
NODE_PATH=$(npm root -g) node lib/render.js "$(cat /tmp/jobs.json)"
