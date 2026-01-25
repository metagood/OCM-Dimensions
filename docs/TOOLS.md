# OCM Dimensions Tools Reference

Complete documentation for all OCM Dimensions tools.

## Table of Contents

1. [Build CLI (`build-cli.js`)](#build-cli-build-clijs)
2. [Size Calculator (`size-calc.js`)](#size-calculator-size-calcjs)
3. [Browser UI](#browser-ui)
4. [NPM Scripts](#npm-scripts)
5. [Configuration (`inscriptions.json`)](#configuration-inscriptionsjson)
6. [Debug Mode](#debug-mode)

---

## Build CLI (`build-cli.js`)

The cross-platform build tool for creating inscription-ready HTML files.

### Location
```
tools/build-cli.js
```

### Basic Usage

```bash
node tools/build-cli.js --workflow=<name> [options]
```

### Workflows

| Workflow | Description | Input Directory |
|----------|-------------|-----------------|
| `threejs` | Three.js 3D graphics | `tools/threejs/compressed-inputs/` |
| `p5js` | p5.js creative coding | `tools/p5js/input/` |
| `compress-html` | Generic HTML compression | `tools/compress-html/input/` |

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--workflow=<name>` | **Required.** Workflow to run | `--workflow=threejs` |
| `--base-url=<url>` | Base URL for local testing | `--base-url=https://ordinals.com` |
| `--output=<file>` | Custom output filename | `--output=my-art.html` |
| `--help` | Show help message | `--help` |

### Examples

**Build for inscription:**
```bash
node tools/build-cli.js --workflow=threejs
# Creates: tools/threejs/index.html
```

**Build for local testing:**
```bash
node tools/build-cli.js --workflow=threejs --base-url=https://ordinals.com
# Creates: tools/threejs/index.local.html
```

**Custom output file:**
```bash
node tools/build-cli.js --workflow=p5js --output=my-sketch.html
# Creates: my-sketch.html
```

### Output

The build CLI outputs:
1. The built HTML file
2. A size report with:
   - Original code size
   - Compressed (gzip) size
   - Base64 encoded size
   - Final HTML size
   - Estimated inscription costs at various fee rates

### Size Report Example

```
============================================================
SIZE REPORT
============================================================
Original code size:    1.27 KB
Compressed (gzip):     642 B (50.7% reduction)
Base64 encoded:        856 B
Final HTML size:       2.22 KB
------------------------------------------------------------
ESTIMATED INSCRIPTION COSTS:
  1 sat/vB          3,405 sats  (0.00003405 BTC)
  5 sat/vB         17,025 sats  (0.00017025 BTC)
  10 sat/vB        34,050 sats  (0.00034050 BTC)
  20 sat/vB        68,100 sats  (0.00068100 BTC)
  50 sat/vB       170,250 sats  (0.00170250 BTC)
============================================================
```

---

## Size Calculator (`size-calc.js`)

Standalone tool for quick size estimates without a full build.

### Location
```
tools/size-calc.js
```

### Basic Usage

```bash
node tools/size-calc.js <file>
node tools/size-calc.js <file1> <file2> ...
node tools/size-calc.js --dir=<directory>
```

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--dir=<path>` | Analyze all files in directory | `--dir=src/` |
| `--json` | Output as JSON | `--json` |
| `--help` | Show help message | `--help` |

### Examples

**Single file:**
```bash
node tools/size-calc.js my-sketch.js
```

**Multiple files:**
```bash
node tools/size-calc.js lib.js main.js utils.js
```

**Entire directory:**
```bash
node tools/size-calc.js --dir=tools/threejs/compressed-inputs
```

**JSON output (for scripting):**
```bash
node tools/size-calc.js my-code.js --json
```

### Output

**Human-readable output:**
```
============================================================
FILE: my-sketch.js
============================================================
Original size:         1.02 KB
Compressed (gzip -9):  499 B (52.4% reduction)
Base64 encoded:        668 B
Estimated final HTML:  1.34 KB

Estimated inscription costs:
  1 sat/vB          2,052 sats
  5 sat/vB         10,260 sats
  10 sat/vB        20,520 sats
  20 sat/vB        41,040 sats
  50 sat/vB       102,600 sats
```

**JSON output:**
```json
{
  "file": "my-sketch.js",
  "original": 1045,
  "compressed": 499,
  "base64": 668,
  "estimatedFinal": 1368,
  "compressionRatio": "52.4",
  "costs": [
    { "rate": 1, "rateStr": "1 sat/vB", "sats": 2052, "btc": "0.00002052" },
    { "rate": 5, "rateStr": "5 sat/vB", "sats": 10260, "btc": "0.00010260" }
  ]
}
```

### Size Indicators

The tool uses color-coded indicators:
- **Green (< 50 KB)**: Excellent - very affordable inscription
- **Yellow (< 100 KB)**: Good - reasonable inscription cost
- **Red (> 100 KB)**: Large - consider optimizing your code

---

## Browser UI

A visual interface for compressing code without using the command line.

### Location
```
tools/browserUI/index.html
```

### How to Use

1. Open `tools/browserUI/index.html` in your web browser
2. Select the libraries you need (fflate is always included)
3. Paste your code OR upload files
4. See real-time size preview
5. Click "Compress" to generate output
6. Download the compressed HTML

### Features

#### Real-time Size Preview
As you type or paste code, you'll see:
- Original size
- Compressed size
- Base64 encoded size
- Estimated final HTML size
- Color-coded size indicator
- Estimated inscription costs

#### Library Selection
Choose which on-chain libraries to include:
- **fflate** (always included) - Compression/decompression
- **p5.js** - Creative coding library
- **Three.js** - 3D graphics library

#### Input Methods
- **Paste Code**: Directly paste JavaScript into the textarea
- **Upload Files**: Select one or more files to combine and compress

### Screenshot

```
┌─────────────────────────────────────────────────────┐
│  Real-time Size Preview                             │
├─────────────────────────────────────────────────────┤
│  Original Size    │  Compressed (gzip)              │
│  1.02 KB          │  499 B (52% smaller)            │
├─────────────────────────────────────────────────────┤
│  Base64 Encoded   │  Est. Final HTML                │
│  668 B            │  1.34 KB                        │
├─────────────────────────────────────────────────────┤
│  ✓ Excellent! Very affordable inscription size.    │
├─────────────────────────────────────────────────────┤
│  Estimated Inscription Cost                         │
│  1 sat/vB    2,052 sats                            │
│  5 sat/vB    10.3K sats                            │
│  10 sat/vB   20.5K sats                            │
│  20 sat/vB   41.0K sats                            │
└─────────────────────────────────────────────────────┘
```

---

## NPM Scripts

Convenient shortcuts defined in `package.json`.

### Build Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run build:threejs` | `node tools/build-cli.js --workflow=threejs` | Build Three.js project |
| `npm run build:threejs:local` | `...--base-url=https://ordinals.com` | Build for local testing |
| `npm run build:p5js` | `node tools/build-cli.js --workflow=p5js` | Build p5.js project |
| `npm run build:p5js:local` | `...--base-url=https://ordinals.com` | Build for local testing |
| `npm run build:compress-html` | `node tools/build-cli.js --workflow=compress-html` | Compress HTML |
| `npm run build:compress-html:local` | `...--base-url=https://ordinals.com` | Build for local testing |
| `npm run build:all` | Runs all build commands | Build everything |
| `npm run build:all:local` | Runs all local builds | Build all for testing |

### Utility Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run size` | `node tools/size-calc.js` | Run size calculator |

### Test Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm test` | `node --test tests/*.test.js` | Run all tests |
| `npm run test:build-cli` | Tests for build-cli.js | Test build CLI |
| `npm run test:size-calc` | Tests for size-calc.js | Test size calculator |
| `npm run test:templates` | Tests for templates | Test HTML templates |
| `npm run test:browser-ui` | Tests for browser UI | Test browser interface |
| `npm run test:integration` | End-to-end tests | Test full workflows |
| `npm run test:smoke` | `./scripts/run-smoke-tests.sh` | Quick smoke tests |

---

## Configuration (`inscriptions.json`)

Central configuration file for all inscription IDs and workflow settings.

### Location
```
tools/inscriptions.json
```

### Structure

```json
{
  "inscriptions": {
    "ocm-dimensions": {
      "id": "2dbdf9eb...i0",
      "name": "OCM Dimensions",
      "description": "Parent inscription containing fflate and Three.js libraries",
      "lines": {
        "fflate": 28,
        "threejs": 32
      }
    },
    "fflate": {
      "id": "6bac7ab4...i0",
      "name": "fflate",
      "description": "Standalone fflate compression library"
    },
    "p5js": {
      "id": "255ce0c5...i0",
      "name": "p5.js",
      "description": "p5.js creative coding library"
    }
  },
  "workflows": {
    "threejs": {
      "description": "Three.js 3D graphics workflow",
      "requires": ["ocm-dimensions"],
      "inputDir": "compressed-inputs",
      "template": "page-structure.html"
    }
  },
  "defaults": {
    "baseUrl": "https://ordinals.com",
    "contentPath": "/content/"
  }
}
```

### Inscription IDs

| Name | Inscription ID | Contents |
|------|----------------|----------|
| OCM Dimensions | `2dbdf9ebbec6be793fd16ae9b797c7cf968ab2427166aaf390b90b71778266abi0` | fflate + Three.js |
| fflate | `6bac7ab4ce8d5d32f202c2e31bba2b5476a18275802b4e0595c708760f9f56b5i0` | Compression library |
| p5.js | `255ce0c5a0d8aca39510da72e604ef8837519028827ba7b7f723b7489f3ec3a4i0` | Creative coding library |

### Line Numbers

The OCM Dimensions inscription contains multiple libraries. They're extracted by line number:
- **Line 28**: fflate compression library
- **Line 32**: Three.js library (compressed)

---

## Debug Mode

All generated HTML files support debug mode for troubleshooting.

### How to Enable

Add `?debug` to the URL:

```
file:///path/to/index.local.html?debug
```

Or in a browser:
```
https://ordinals.com/content/<inscription-id>?debug
```

### What It Shows

Open your browser's Developer Console (F12) to see:

```
[OCM] Fetching OCM Dimensions inscription...
[OCM] OCM Dimensions loaded, extracting libraries...
[OCM] fflate line: 28 , Three.js line: 32
[OCM] Decompressing user code...
[OCM] User code loaded successfully
```

### Debug Messages

| Message | Meaning |
|---------|---------|
| `Fetching OCM Dimensions inscription...` | Starting to load libraries |
| `OCM Dimensions loaded, extracting libraries...` | Successfully fetched, now parsing |
| `fflate line: X, Three.js line: Y` | Extracting specific lines |
| `Fetching p5.js library...` | Loading p5.js (p5js workflow only) |
| `Decompressing user code...` | About to decompress your code |
| `User code loaded successfully` | Your code is running! |

### Error Messages

If something goes wrong, you'll see user-friendly errors:

```
Error loading inscription libraries. Check console for details.
```

The console will show the actual error:
```
[OCM] Failed to load libraries: Error: Fetch failed: 404
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Fetch failed: 404` | Inscription not found | Check the inscription ID |
| `Decompression failed` | Corrupted data | Rebuild your project |
| `fflate is not defined` | Library not loaded | Check network/CORS |

---

## Makefile (Legacy)

Each workflow also supports the original Makefile approach.

### Usage

```bash
cd tools/threejs
make clean && make
```

### Targets

| Target | Description |
|--------|-------------|
| `make` or `make all` | Build everything |
| `make index.html` | Build inscription file |
| `make index.local.html` | Build local test file |
| `make src-compressed-string.base64` | Compress input files |
| `make clean` | Remove generated files |

### When to Use Makefiles

- On Unix/Mac systems with `make` installed
- When you prefer the traditional approach
- For CI/CD pipelines that expect Makefiles

### When to Use build-cli.js

- On Windows (no `make` required)
- When you want size reports
- For cross-platform scripts
- When using npm scripts

Both approaches produce identical output.

---

## Quick Reference Card

```bash
# ═══════════════════════════════════════════════════════
#  OCM DIMENSIONS - QUICK REFERENCE
# ═══════════════════════════════════════════════════════

# BUILD COMMANDS
npm run build:threejs              # Build Three.js
npm run build:threejs:local        # Build for local testing
npm run build:p5js                 # Build p5.js
npm run build:compress-html        # Compress HTML

# SIZE CHECK
node tools/size-calc.js <file>     # Check file size
node tools/size-calc.js --dir=src  # Check directory

# TESTING
npm test                           # Run all tests
npm run test:smoke                 # Quick smoke test

# DEBUG
# Add ?debug to URL to see console logs

# FILES
# index.html       → Inscribe this
# index.local.html → Test locally
# inscriptions.json → Central config

# ═══════════════════════════════════════════════════════
```
