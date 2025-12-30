# p5.js workflow

This workflow uses recursion to load the **fflate** helper from OCM Dimensions and the on-chain **p5.js** library, then injects your sketch.

## 1) Add your sketch

1. Edit `tools/p5js/input/02_main.js` with your p5.js sketch.
2. Keep the file small; it will be compressed by the build step.

## 2) Build the inscription HTML

```bash
cd tools/p5js
make clean && make
```

This generates `tools/p5js/index.html`, which is the file you will inscribe,
plus `tools/p5js/index.local.html` for local previews.

## 3) Test locally

For local preview, open `tools/p5js/index.local.html`. The local file already targets
`https://ordinals.com/content/...` for both the OCM Dimensions inscription and the
p5.js library.

## How recursion works here

The template in `tools/p5js/page-structure.html` downloads the `fflate` script from the OCM Dimensions inscription, loads the on-chain p5.js library, then runs your sketch after decompression.
