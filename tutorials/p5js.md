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

This generates `tools/p5js/index.html`, which is the file you will inscribe.

## 3) Test locally

For local preview, open `tools/p5js/index.html` and replace:

```
fetch(/content/...) → fetch(https://ordinals.com/content/...)
```

There are two `fetch` calls in the template: one for the OCM Dimensions inscription and one for the p5.js library.

## How recursion works here

The template in `tools/p5js/page-structure.html` downloads the `fflate` script from the OCM Dimensions inscription, loads the on-chain p5.js library, then runs your sketch after decompression.
