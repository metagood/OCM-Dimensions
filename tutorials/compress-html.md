# Compress a full HTML page

Use this workflow if you already have a complete HTML page and want to gzip+base64 it for a small on-chain footprint.

## 1) Add your HTML

1. Copy your HTML file into `tools/compress-html/input/`.
2. Make sure the file contains any scripts or styles you want to run on-chain.

## 2) Build the inscription HTML

```bash
cd tools/compress-html
make clean && make
```

This generates `tools/compress-html/index.html`, which is the file you will inscribe.
It also generates `tools/compress-html/index.local.html` for local previews.

## 3) Test locally

Open `tools/compress-html/index.local.html` to preview locally. The `index.local.html`
file already points to `https://ordinals.com/content/...` so the browser can fetch
the on-chain `fflate` script without running an Ord server.

## How recursion works here

The template in `tools/compress-html/page-structure.html` downloads the `fflate` script from the OCM Dimensions inscription and uses it to decompress your HTML at render time.
