# Three.js workflow

This workflow uses the OCM Dimensions inscription to load **fflate + Three.js** on-chain, then injects your compressed scene logic.

## 1) Add your scene code

1. Open `tools/threejs/02_main.js` and add your Three.js scene code.
2. Minify the file into `tools/threejs/compressed-inputs/02_main.min.js`.

Example minify command (optional):

```bash
minify tools/threejs/02_main.js > tools/threejs/compressed-inputs/02_main.min.js
```

## 2) Build the inscription HTML

```bash
cd tools/threejs
make clean && make
```

This generates `tools/threejs/index.html`, which is the file you will inscribe.

## 3) Test locally

For local preview, open `tools/threejs/index.html` and replace:

```
fetch(/content/...) → fetch(https://ordinals.com/content/...)
```

This lets your browser download the on-chain libraries without running an Ord server.

## How recursion works here

The template in `tools/threejs/page-structure.html` fetches the OCM Dimensions inscription and extracts the embedded `fflate` and `Three.js` scripts before running your compressed scene.
