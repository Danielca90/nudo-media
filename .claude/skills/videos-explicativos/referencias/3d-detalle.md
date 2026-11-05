# 3D Explainer Detail: How to Decide and Build

Read this file whenever a video request explains how something works, shows a product or
object, or would look better in 3D. These rules complement the main video skill: keep its
format, branding, voice and caption rules, and use this file for **what the visuals should be
and how detailed they must be**.

## 0. Work autonomously

The user gives only a concept ("how a car wheel works"). You make every creative and
technical decision: story, shots, cameras, materials, effects, narration, captions.

- Do not ask the user which techniques, angles or effects to use. Decide.
- Ask a question only if the concept itself is ambiguous (e.g. "wheel" could mean the tire,
  the hub bearing, or the whole drivetrain) — and then propose a default in the same message.
- Before building, write a short production plan (section 2) and proceed without waiting
  for approval unless the main skill says otherwise.

## 1. Understand the mechanism first

A detailed video comes from understanding the object, not from effects. Before any code:

1. List the **real parts** of the object (aim for 10–30 named parts for a mechanical subject).
   Example for a car wheel: tire tread, sidewall, steel belts, rim, spokes, lug nuts, hub,
   wheel bearing (inner race, balls, outer race, cage), brake disc, caliper, pads, axle.
2. Describe **how it works as a sequence of cause → effect** (3–6 steps).
3. Find the **"aha" moment**: the one hidden thing most people don't know (the bearing
   balls rolling, the pads clamping the disc, the steel belts inside the rubber). The video
   is built around revealing it.
4. Note the **real proportions, colors and materials** of each part.

## 2. Production plan (write it before coding)

Default reel: 1080×1920, 25–45 seconds, 8–14 shots. Structure:

| Beat | Time | Purpose |
|---|---|---|
| Hook | 0–2 s | Dramatic shot of the object + a question or surprising claim |
| Context | 2–6 s | Full object, establishing shot |
| Reveal | 6–25 s | Go inside: cutaway / x-ray / exploded view, one part per shot |
| Action | 25–35 s | Show it working: motion, forces, particles |
| Payoff | last 3–5 s | Reassemble, hero orbit, one-line takeaway |

For every shot, write one line: `shot # · duration · shot type · camera move · what is revealed · narration line`.

Rules:
- One idea per shot. Cut or change camera every **2–4 seconds**. Never hold a static shot over 3 s.
- Use at least **4 different shot types** per video (see section 5).
- Narration drives timing: shot durations are set from the voiceover timestamps, not guessed.

## 3. Default technology: real 3D in code

- Default to **Three.js with React Three Fiber** (+ `@react-three/drei`,
  `@react-three/postprocessing`). If the pipeline is Remotion, use `@remotion/three`.
- Use flat 2D (HTML/CSS/SVG) only for title cards, labels, captions and simple diagrams —
  never for the main object of an explainer.
- **Everything must be deterministic from the frame number**: no `Date.now()`, no unseeded
  `Math.random()`, no physics that depends on real time. Use a seeded random generator and
  compute every position from `frame / fps`. Otherwise frames flicker or differ between renders.

## 4. Modeling: the detail standard

The #1 reason results look "simple" is too few parts and raw primitives. Required:

- **Hierarchy of named parts.** Build the object as a tree of groups (`wheel > hub > bearing > balls[]`)
  so each part can be moved, hidden, highlighted or exploded on its own.
- **Detail budget:** the hero object has **at least 30 distinct meshes**; a close-up subject has
  secondary detail (bolts, seams, grooves, threads, labels, vents, welds).
- **No raw primitives with sharp edges.** Use `RoundedBoxGeometry`, `ExtrudeGeometry` with
  `bevelEnabled`, `LatheGeometry` for round profiles (rims, pistons, bottles), `TubeGeometry`
  along curves (cables, hoses), and `InstancedMesh` for repeated parts (tread blocks, chain links,
  bolts, ball bearings, strands).
- **Procedural patterns** for rich surfaces: tread patterns, knurling, cable strands twisted
  along a helix, honeycomb, perforations — generate them in loops, don't fake them with color.
- **Real scale and proportions** (work in meters; a car wheel is ~0.65 m).
- **External models are allowed:** if a free, licensed glTF/GLB model exists (Khronos samples,
  Poly Pizza, Sketchfab CC0/CC-BY), load it with `useGLTF` and credit it where the license
  requires. Prefer procedural when the object is simple enough to build well in code, or when
  parts must animate separately and the model isn't split into parts.

## 5. Explanation techniques (choose per shot)

| Technique | How | Use when |
|---|---|---|
| **Cutaway** | `material.clippingPlanes` slicing the object; cap the cut with a contrasting color | Showing layers or inner parts |
| **X-ray** | Fade outer shell to transmission/low-opacity glass, keep inner parts solid | Showing a part working inside |
| **Exploded view** | Animate parts outward along their assembly axis, then back | Showing how it is assembled |
| **Highlight** | Emissive glow or rim light on the active part, desaturate the rest | Naming a part in the narration |
| **Flow / force lines** | Animated dashed curves, arrows, particle streams | Air, fluid, electricity, force, heat |
| **Labels** | Text anchored to a 3D point (drei `Html`/`Billboard`) with a leader line | First appearance of each part |
| **Slow motion / time freeze** | Scale animation time down or stop it while the camera moves | The "aha" moment |
| **Macro close-up** | Camera very close, shallow depth of field | Small, high-detail parts |
| **Comparison** | Split screen or side-by-side (worn vs new, with vs without) | Explaining why it matters |

Shot types: establishing, slow orbit, push-in, pull-out, close-up/macro, top-down, low hero
angle, tracking/follow, cutaway, exploded, POV.

## 6. Materials and lighting (never default gray)

- Use `MeshPhysicalMaterial` / `MeshStandardMaterial` for every part. Presets:

| Material | Settings |
|---|---|
| Painted metal | color, metalness 0.3–0.5, roughness 0.35, clearcoat 0.6 |
| Chrome / polished steel | metalness 1, roughness 0.05–0.15 |
| Brushed / cast metal | metalness 1, roughness 0.4–0.6 |
| Rubber | metalness 0, roughness 0.9, near-black (#1a1a1a) |
| Glass | transmission 1, thickness 0.2–1, roughness 0–0.05, ior 1.5 |
| Translucent plastic | transmission 0.6–0.9, roughness 0.3, colored attenuationColor |
| Copper | color #b87333, metalness 1, roughness 0.25 |

- Lighting: always an **environment map** (drei `<Environment preset="studio|warehouse|city" />`
  or an HDRI) for realistic reflections, plus a key light with **soft shadows** and a rim light
  to separate the object from the background. Add `<ContactShadows />` under objects.
- Tone mapping: ACES Filmic. Use a background with depth (gradient, subtle floor, fog), not flat black.
- Keep the palette consistent with the brand rules in the main skill.

## 7. Post-processing (subtle, always on)

`EffectComposer` with: **Bloom** (low intensity, only on emissive/hot parts), **Depth of Field**
(focus on the subject of each shot), **SSAO/N8AO** (ambient occlusion in crevices),
**Vignette**, light **Noise/grain**, optional **ChromaticAberration** at very low strength.

## 8. Particles (when they mean something)

Use particles to show something physical, not as decoration: dust when a blade hits soil,
sparks from friction, air flow, water, heat shimmer, electricity along a wire, smoke from
exhaust. Build them with `InstancedMesh` or `Points` + a seeded generator, animate
deterministically from the frame number, and keep each system between ~500 and 20,000 particles.

## 9. Camera direction

- Define a camera keyframe list per shot (position, target, FOV) and interpolate with easing
  (ease-in-out cubic). No linear moves, no camera teleporting inside a shot.
- Every shot has a move (orbit, push, drift) — even if slow.
- Vary lens: wide (FOV 50–60) for context, tele (FOV 20–30) for close-ups.
- Focus (DOF) follows the part being described.
- Keep the subject inside the vertical safe area (section 11).

## 10. Voiceover and captions

- Write narration from the shot list: short spoken sentences, one per shot, ~2.5 words per second.
- Generate the voiceover with the TTS tool defined in the main skill, get **word-level timestamps**
  (or transcribe the generated audio to get them), and set shot durations from them.
- Captions are word-timed, 1–4 words on screen at a time, highlight the current word, and
  match the narration exactly. Part names in captions match the 3D labels.
- Language, tone and caption style follow the main skill.

## 11. Output settings

- 1080×1920, 30 fps (60 fps for fast motion), rendered with `deviceScaleFactor: 2` (supersampling)
  when render time allows.
- Encode H.264, `yuv420p`, CRF 18 or ~8–12 Mbps, AAC 192 kbps.
- Reels safe area: keep text and the key subject out of roughly the top 250 px, the bottom
  380 px and the right 120 px (platform UI covers them).

## 12. Self-review loop (mandatory)

Before delivering, render **one still frame from each shot** and look at them. Check against this
list, fix what fails, re-render the stills. Do up to 3 rounds.

- [ ] Would this frame look good as a thumbnail? Is anything gray, flat or blocky?
- [ ] Hero object has visible secondary detail and rounded edges in close-ups.
- [ ] Every surface has a real material; reflections are visible on metal and glass.
- [ ] Lighting has shadows, a rim light and contrast with the background.
- [ ] The "aha" part is clearly revealed (cutaway / x-ray / exploded) and labeled.
- [ ] At least 4 shot types; no static shot over 3 s; DOF focus on the right part.
- [ ] Particles (if used) explain something physical.
- [ ] Captions are inside the safe area, readable and synced; narration and visuals match.
- [ ] No flicker between frames (deterministic animation).

Then render the full video, check the duration and audio sync, and deliver.
