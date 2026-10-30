# Thouseef Roshan & Asna Parveen — Wedding Invitation

Static site (no build step). Upload the contents of this folder to Hostinger (public_html), or drag it onto Netlify / Vercel.

## Assets
| File | Purpose |
|---|---|
| assets/opening.mp4 | Opening film (your Islamic cinematic video, 720×1280, 8 s, played once after "Open Invitation") |
| assets/opening-poster.jpg | First frame of the opening film (shown before play, prevents flashes) |
| assets/hero.mp4 | Hero background loop (your dance5.mp4, 720x1280, cross-faded so the loop is seamless) |
| assets/hero-poster.jpg | Hero still = hero.mp4 first frame |
| assets/bg-tuscan.jpg, couple-frames.jpg, venue-bg.jpg, couple-footer-bg.jpg | Section backgrounds (graded stills from the film) |
| assets/gallery/arch-01…03.jpg | Gallery stills (4:5). Swap in real photographs any time (~720×900) |
| assets/og-image.jpg | 1200×630 share preview |
| assets/song.mp3 | Background music (carried over from the original template — replace if you prefer another nasheed/instrumental) |

## Edit in script.js (top, `CONFIG`)
- `weddingDate` — `2026-11-19T16:00:00+05:30`
- `ceremonyMapUrl` — the supplied Google Maps share link (set to `''` to hide the button)

## Before publishing: make the share preview reliable
No production URL was supplied, so `og:url`/`canonical` are omitted and `og:image` is a relative path.
Once you have a domain, in `index.html` change both
`content="assets/og-image.jpg"` (og:image and twitter:image) to `content="https://YOUR-DOMAIN/assets/og-image.jpg"`
and add `<meta property="og:url" content="https://YOUR-DOMAIN/">`. WhatsApp caches previews, so test with a fresh link.
