<!-- Paste this block into your existing video skill's SKILL.md, near the top
     (after the frontmatter). Put 3d-explainer-detail.md in the skill's references/ folder. -->

## Visual detail standard (always applies)

The user will usually give only a concept ("how a car wheel works"). Produce the whole video
yourself — research, script, shots, 3D scene, cameras, effects, voiceover and captions —
without asking which techniques to use.

For any explainer, product or object video, read `references/3d-explainer-detail.md` before
planning and follow it. In short:

- Build the main object in **real 3D with Three.js** (React Three Fiber), never flat 2D shapes.
- Understand the mechanism first: list the real parts, the cause → effect sequence and the
  hidden "aha" moment, and build the video around revealing it.
- Hero object: 30+ named parts, rounded edges, secondary detail, physical materials,
  environment lighting, soft shadows and subtle post-processing.
- Explain with cutaways, x-ray transparency, exploded views, highlights, labels and
  meaningful particles; change camera every 2–4 s using at least 4 shot types.
- Time the shots to the voiceover; word-timed captions inside the Reels safe area.
- Render one still per shot and self-review against the checklist before the final render.
