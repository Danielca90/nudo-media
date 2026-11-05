#!/usr/bin/env bash
# Utilidades FFmpeg del pipeline de videos (Remotion + HyperFrames).
# Uso: herramientas/ffmpeg.sh <comando> [args]
set -euo pipefail
cmd="${1:-ayuda}"; shift || true
case "$cmd" in
  normalizar)  # in.mp4 out.mp4 — audio a -14 LUFS (Instagram/TikTok), video sin recodificar
    ffmpeg -v error -i "$1" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k "$2" -y ;;
  empalmar-voz)  # base.mp3 corte_seg cola.mp3 out.mp3 — corta la voz en un segundo y pega otra toma (0,2 s de silencio)
    ffmpeg -v error -i "$1" -i "$3" -filter_complex "[0:a]atrim=0:$2,asetpts=PTS-STARTPTS[a];anullsrc=r=44100:cl=mono,atrim=0:0.2[s];[1:a]asetpts=PTS-STARTPTS[b];[a][s][b]concat=n=3:v=0:a=1" -ar 44100 -ac 1 -b:a 128k "$4" -y ;;
  musica)  # video.mp4 musica.mp3 out.mp4 [volumen=0.18] — música de fondo que baja sola cuando habla la voz (ducking)
    vol="${4:-0.18}"
    ffmpeg -v error -i "$1" -stream_loop -1 -i "$2" -filter_complex "[1:a]volume=$vol,afade=t=in:d=0.8[m];[m][0:a]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=300[duck];[0:a][duck]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest "$3" -y ;;
  unir)  # out.mp4 a.mp4 b.mp4 ... — concatena clips (p. ej. intro 3D de HyperFrames + video de Remotion); recodifica para igualar formatos
    out="$1"; shift; n=$#; inputs=(); filt=""
    for i in $(seq 0 $((n-1))); do inputs+=(-i "${@:$((i+1)):1}"); filt+="[$i:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p[v$i];"; done
    for i in $(seq 0 $((n-1))); do filt+="[v$i][$i:a]"; done
    ffmpeg -v error "${inputs[@]}" -filter_complex "${filt}concat=n=$n:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset medium -c:a aac -b:a 192k "$out" -y ;;
  superponer)  # base.mp4 capa.(mov|webm) inicio_seg out.mp4 — pone un clip con transparencia (HyperFrames --format mov/webm) encima del video
    ffmpeg -v error -i "$1" -itsoffset "$3" -i "$2" -filter_complex "[0:v][1:v]overlay=0:0:eof_action=pass:enable='gte(t,$3)'[v]" -map "[v]" -map 0:a -c:v libx264 -crf 18 -c:a copy "$4" -y ;;
  silencio)  # in.mp4 out.mp4 — agrega pista de audio muda (para clips 3D sin sonido antes de unir)
    ffmpeg -v error -i "$1" -f lavfi -i anullsrc=r=48000:cl=stereo -c:v copy -c:a aac -shortest "$2" -y ;;
  portada)  # in.mp4 segundo out.jpg — cuadro para la portada del reel
    ffmpeg -v error -ss "$2" -i "$1" -frames:v 1 -q:v 2 "$3" -y ;;
  hoja)  # in.mp4 out.png [n=8] — hoja de contacto con n cuadros repartidos (revisión rápida)
    n="${3:-8}"; dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")
    ffmpeg -v error -i "$1" -vf "fps=$n/$dur,scale=240:-1,tile=${n}x1" -frames:v 1 "$2" -y ;;
  revisar)  # in.mp4 — duración, resolución, fps y volumen integrado
    ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact "$1"
    ffmpeg -hide_banner -i "$1" -af ebur128=framelog=quiet -f null - 2>&1 | grep -E "I:|LRA:" | head -2 ;;
  *) sed -n '2,4p' "$0"; grep -E '^  [a-z-]+\)' "$0" | sed 's/)  #/ —/' ;;
esac
