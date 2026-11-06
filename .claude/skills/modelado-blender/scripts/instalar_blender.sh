#!/usr/bin/env bash
# Instala Blender LTS sin pantalla en Linux x64 (entorno en la nube). Idempotente.
set -euo pipefail
VER="${BLENDER_VER:-4.5.15}"; SERIE="${VER%.*}"
DIR="/opt/blender-${VER}-linux-x64"
if [ ! -x "$DIR/blender" ]; then
  mkdir -p /opt/blender-dl
  curl -sSL -o /opt/blender-dl/b.tar.xz "https://download.blender.org/release/Blender${SERIE}/blender-${VER}-linux-x64.tar.xz"
  tar -xJf /opt/blender-dl/b.tar.xz -C /opt && rm -f /opt/blender-dl/b.tar.xz
fi
ln -sf "$DIR/blender" /usr/local/bin/blender
blender --version | head -1
