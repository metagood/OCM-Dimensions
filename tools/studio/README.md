# OCM Dimensions Studio

A browser-based playground for authoring composable Bitcoin Ordinals
inscriptions. The user writes JavaScript or HTML, the studio wraps it in a
small loader that pulls libraries (Three.js, p5.js, Matter.js, GSAP, anime.js,
Tone.js, Lindenmayer, seedrandom, Chroma.js, fflate) recursively from other
on-chain inscriptions, and produces a single self-contained HTML file ready
for inscription.

The live preview iframe and the downloaded inscription are intended to render
identically.

## Files

### `index.html` — the on-chain studio

The original Studio inscription as it exists on Bitcoin at
`328a5e67e666a4d3fa9cf148649371a66d2d3e092257c4e7c8a7f894d15ce8b7i0`. This
file is byte-identical to what's served from
`ordinals.com/content/328a5e67…i0` and **must not be edited** — it is the
permanent, immutable artifact users currently rely on. Keep it as the
reference copy.

It supports 11 library workflows (Three.js, p5.js, plain HTML, Matter.js,
WebGL Fluid, GSAP, anime.js, Tone.js, Lindenmayer, seedrandom, Chroma.js)
with curated default templates for each. The sketch text is gzip-compressed,
base64-encoded into a `td='…'` global, and at runtime the wrapper fetches
the OCM Dimensions library inscription, splits it on newlines to extract
`fflate` (line 28) and the bundled Three.js (line 32), then decompresses
and evals the user code.

### `index.v2.html` — the audited rewrite

A local fork of `index.html` with a substantial set of fixes applied. It is
not yet inscribed; ship it as a new inscription when ready and direct users
to the new ID.

Layout, IDs, recursive-load mechanics, and template list are preserved so
existing tooling and on-chain dependencies (`fflate`, the OCM Dimensions
library, the per-library inscriptions) keep working.

#### Fixes applied in v2

**Functional fixes**

- WebGL Fluid silently dropped the user's code — both preview and download
  ran only the bare library. The default template for this workflow is full
  HTML (canvas + script), so the fix injects the user's HTML via the same
  `_ocmInjectHtml` flow used by the other HTML workflows (gsap, animejs,
  Tone.js, Lindenmayer, seedrandom, Chroma.js, plain HTML), then loads the
  fluid library. The lib auto-attaches to the user's `<canvas>` and any
  user setup scripts run.
- The p5.js preview only worked when the user wrote a literal
  `new p5(function(p) {...})`. Any other instantiation form (arrow, named
  reference, class) made the regex extractor fall back to the wrapper, which
  referenced an undefined `d3` and threw. Now the preview loads p5 upfront
  and runs user code as-is.
- `<script type="module">` and other script attributes were stripped by the
  generic-library handler, so module-syntax (`import` / `export`) inscriptions
  silently broke. The new injector preserves every attribute via DOMParser.
- The plain-HTML workflow set `document.body.innerHTML = userHtml`, which
  spilled the user's `<head>`, `<title>`, etc. into the body. Now `<head>`
  children are routed to `document.head` and `<body>` children to
  `document.body`.
- The Three.js / p5.js wrappers required exact callback names (`ocmCallback`,
  `fflateCallback2`); silently broke if the user removed them. Now the
  libraries are loaded *before* user code runs, so plain top-level code
  works. Old-style wrapped code is still called via a backward-compatibility
  hook.
- The watermark claimed `Using OCM Dimensions: …` even on paths that didn't
  use that library. Now it reads `Built with OCM Dimensions Studio v2 (lib: …)`.

**Preview / inscription parity**

- User code containing `</script>` (e.g. inside a string literal, a regex,
  or any user-authored HTML template's own `<script>` tags) terminated the
  preview wrapper's `<script>` block early via the HTML tokenizer. Fixed by
  a `_safeJson` helper that escapes every `<` to `<` when JSON-embedding
  user code into preview HTML.
- The preview iframe's null origin meant `fetch('/content/X')` and
  `fetch('/r/blockheight')` failed, while the same code worked on-chain.
  The preview iframe now installs a `window.fetch` shim that rewrites both
  `/content/` and `/r/` paths to `https://ordinals.com/...`.
- Resource URLs like `<img src="/content/X">`, `<link href="/content/X">`,
  CSS `url(/content/X)`, and `<script src="/content/X">` don't go through
  `fetch`, so the override above wasn't enough. Each preview iframe head
  now includes `<base href="${fetchBase}/content/">` so every relative URL
  — including bare inscription IDs like `<img src="abc...i0">` — resolves
  to ordinals.com exactly the way it would on-chain.
- `ordinals.com` enforces a strict CSP (`default-src https://ordinals.com/content/
  https://ordinals.com/r/ 'unsafe-eval' 'unsafe-inline' data: blob:`) that
  blocks every URL outside its own paths. Inscriptions referencing external
  CDNs would silently fail on-chain but render fine in preview. The same CSP
  is now applied to the preview iframe via a `<meta http-equiv>` tag, so
  external-CDN failures surface during preview instead of after inscription.
- `<script>` elements nested inside `<svg>` (or any non-top-level position)
  never executed in the v1 generic handler. The injector now walks the
  parsed tree recursively, recreating every `<script>` element as a fresh
  `document.createElement('script')` so it executes regardless of nesting
  depth.
- `addEventListener('DOMContentLoaded', …)` and `addEventListener('load', …)`
  in user scripts never fired, because `_ocmInjectHtml` runs after the
  iframe is already loaded. The injector now installs a polyfill that
  schedules these handlers on the next microtask so user code that waits
  for DOM ready actually runs.

**Hardening / correctness**

- The wrapper assigned the inscription payload via implicit-global
  `td = '…'`. Now uses `let td = '…'` so user code in strict mode doesn't
  trip and the variable can't accidentally be referenced from user code's
  global scope.
- `_ocmInjectHtml` was a top-level function declaration — a property of
  `window`, exposed to and shadowable by user code. Now a `const` arrow
  function, in script lexical scope only.
- The p5.js wrapper unconditionally set `window.d3 = <p5 base64>` for
  backward compatibility, which permanently shadowed D3.js for users who
  wanted to combine D3 and p5. Now the assignment only happens if the
  user defined the legacy `fflateCallback2` callback.
- The template-button dropdown used inline `onclick="loadTemplate(TEMPLATES[…])"`
  handlers, but `const TEMPLATES` lives in the script's lexical scope, not
  on `window`. Inline handlers couldn't see it, so clicking templates
  silently threw `ReferenceError`. Buttons now use `addEventListener`
  closures that capture the template directly.
- A self-inflicted bug from earlier development: a comment in the studio's
  own JS contained the literal characters `</script>`. The HTML tokenizer
  doesn't care that it's inside `//`, and closed the script block early,
  preventing the entire second half of the script from running (including
  `init()`). The comment has been reworded.
- Templates dropdown buttons are created via `appendChild` instead of
  `innerHTML` string interpolation.
- The size estimator's `templateOverhead` constant has been raised from
  700 to 1800 bytes to match measured wrapper sizes after all the v2
  additions.
- The fee/cost estimator was wrong by ~40×. The previous formula treated
  the inscription HTML's bytes as vBytes directly (`final * 1.5`) and
  hardcoded 10 sat/vB. The new formula models the actual transactions:
  - commit tx ≈ 150 vB
  - reveal tx non-witness overhead ≈ 115 vB
  - inscription envelope + content goes in the witness → SegWit 4× discount
    → `ceil((40 + final) / 4)` vB
  - total × user-specified fee rate (default 1 sat/vB)
  A 2 KB inscription now reports ~775 sats at 1 sat/vB instead of 30,000.

#### UI additions in v2

- Footer has an editable fee-rate input (default 1 sat/vB, minimum clamped
  to 1) so users can model the cost at current network conditions. The
  estimator also displays the vByte count next to the sat cost for
  sanity-checking against mempool dashboards.
- Header tag indicates "v2".

#### Documented limitations (intentionally not fixed)

These are sandbox or environment differences between the preview iframe and
the real on-chain rendering context. They cannot be fully closed without
giving up sandbox isolation that protects the studio itself.

- `localStorage`, `IndexedDB`, `BroadcastChannel`, `Web Workers`, and
  motion / sensor APIs throw `DOMException` in the preview iframe but work
  on the real inscription served from ordinals.com (with user permission for
  sensors). Adding `allow-same-origin` to the iframe sandbox would let user
  code scribble in the studio's own storage — bad trade.
- `location.href` returns `about:srcdoc` in preview vs the actual inscription
  URL on-chain. Code that derives the inscription ID from `location.pathname`
  will read different values in the two contexts.
- `<a>` clicks can't navigate the iframe (sandbox blocks top-level
  navigation). URL resolution itself is correct.
- Top-level `await`, `import`, `export` are rejected by `(0,eval)`'s
  classic-script context. Workaround: wrap in `(async () => { … })()`.
- `document.write()` after first paint wipes the document — universal
  browser behaviour, not OCM-specific.
- `while (true)` freezes the preview iframe — same as it would on-chain.
- User code that does `var THREE = …` (etc.) silently shadows the loaded
  library; no runtime detection.

## Verification

Both files can be loaded directly in a browser via `file://` or a static
server. The preview iframe fetches its dependencies from
`https://ordinals.com` when not running on-chain, so an internet connection
is required for live previews.

To inscribe v2, treat the file like any HTML inscription — feed it to your
preferred ord wallet's `inscribe` command. The watermark in v2's output
identifies the studio version; if the inscriber wants their own attribution
they can edit the `watermark` constant in `buildInscriptionHtml`.
