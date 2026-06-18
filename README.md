# Sound Assets

The game references these optional sound effect files:

- click.mp3
- move.mp3
- ai.mp3
- win.mp3
- draw.mp3

Drop your own .mp3 files with these exact names into this folder
(`public/sounds/`) to enable sound effects.

If these files are missing, the app still runs perfectly fine —
`playSound()` in src/App.jsx silently catches playback errors.
