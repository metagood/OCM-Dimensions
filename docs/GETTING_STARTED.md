# Getting Started with OCM Dimensions

This guide will walk you through creating your first on-chain generative artwork using OCM Dimensions tools. No prior blockchain experience needed!

## Table of Contents

1. [What You'll Learn](#what-youll-learn)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Your First Project (5 minutes)](#your-first-project-5-minutes)
5. [Understanding the Output](#understanding-the-output)
6. [Next Steps](#next-steps)

---

## What You'll Learn

By the end of this guide, you'll know how to:
- Compress your JavaScript/HTML code for Bitcoin inscription
- Use on-chain libraries (Three.js, p5.js) without including them in your inscription
- Test your artwork locally before inscribing
- Estimate inscription costs

---

## Prerequisites

### Required Software

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **A code editor** (optional but recommended)
   - VS Code: https://code.visualstudio.com/
   - Or any text editor you're comfortable with

3. **A web browser**
   - Chrome, Firefox, Safari, or Edge

### No Blockchain Wallet Needed (Yet)

You don't need a Bitcoin wallet to develop and test. You'll only need one when you're ready to inscribe your final artwork.

---

## Installation

### Step 1: Download the Repository

**Option A: Using Git (recommended)**
```bash
git clone https://github.com/metagood/OCM-Dimensions.git
cd OCM-Dimensions
```

**Option B: Download ZIP**
1. Go to https://github.com/metagood/OCM-Dimensions
2. Click the green "Code" button
3. Click "Download ZIP"
4. Unzip and open a terminal in that folder

### Step 2: Verify Installation

Run this command to make sure everything works:
```bash
node tools/build-cli.js --help
```

You should see:
```
OCM Dimensions - Cross-Platform Build CLI

Usage:
  node tools/build-cli.js --workflow=<name> [options]
...
```

**That's it! You're ready to create.**

---

## Your First Project (5 minutes)

Let's create a simple animated cube using Three.js. Don't worry if you don't know Three.js—we'll provide the code.

### Step 1: Look at the Example Code

Open `tools/threejs/02_main.js` in your editor. This is a sample Three.js scene:

```javascript
function ocmCallback() {
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // ... creates an animated 3D scene
}
```

### Step 2: Build Your First Inscription

Run this command from the project root:

```bash
npm run build:threejs
```

You'll see output like this:
```
Built: /path/to/tools/threejs/index.html

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

### Step 3: Test Locally

Build a version you can test in your browser:

```bash
npm run build:threejs:local
```

Now open `tools/threejs/index.local.html` in your web browser. You should see the 3D animation!

### Step 4: Enable Debug Mode

Add `?debug` to the URL to see what's happening behind the scenes:

```
file:///path/to/tools/threejs/index.local.html?debug
```

Open your browser's Developer Console (F12 or Cmd+Option+I) to see debug messages:
```
[OCM] Fetching OCM Dimensions inscription...
[OCM] OCM Dimensions loaded, extracting libraries...
[OCM] fflate line: 28 , Three.js line: 32
[OCM] Decompressing user code...
[OCM] User code loaded successfully
```

---

## Understanding the Output

### What Files Were Created?

| File | Purpose |
|------|---------|
| `index.html` | **Inscribe this!** Contains your compressed code with relative paths |
| `index.local.html` | For testing locally. Has full URLs to ordinals.com |

### What's Inside index.html?

Your `index.html` is a tiny HTML file (~2KB) that:
1. Fetches the Three.js library from an existing Bitcoin inscription
2. Decompresses your code using fflate
3. Runs your scene

**Your code is compressed and embedded.** The Three.js library (~500KB) is NOT included—it's loaded from Bitcoin at runtime via recursion.

### The Size Report Explained

```
Original code size:    1.27 KB    ← Your raw JavaScript
Compressed (gzip):     642 B      ← After gzip compression
Base64 encoded:        856 B      ← After base64 encoding (for embedding)
Final HTML size:       2.22 KB    ← Total inscription size
```

### Inscription Cost Estimates

The costs shown are estimates based on:
- **sat/vB**: Satoshis per virtual byte (Bitcoin fee rate)
- Higher fee rates = faster confirmation
- 10-20 sat/vB is typical during normal network conditions

---

## Next Steps

### Try Different Workflows

**p5.js (Creative Coding)**
```bash
# Edit tools/p5js/input/02_main.js with your sketch
npm run build:p5js
npm run build:p5js:local
# Open tools/p5js/index.local.html
```

**Generic HTML Compression**
```bash
# Put any HTML file in tools/compress-html/input/
npm run build:compress-html
npm run build:compress-html:local
# Open tools/compress-html/index.local.html
```

### Check Your Code Size Before Building

Use the size calculator to estimate sizes without a full build:

```bash
node tools/size-calc.js your-code.js
```

### Use the Browser UI (No Terminal Needed)

Open `tools/browserUI/index.html` in your browser for a visual interface:
1. Select libraries (Three.js, p5.js)
2. Paste your code
3. See real-time size estimates
4. Download the compressed HTML

### Read the Tutorials

Detailed workflow guides are in the `tutorials/` folder:
- `tutorials/threejs.md` - Three.js workflow
- `tutorials/p5js.md` - p5.js workflow
- `tutorials/compress-html.md` - Generic HTML compression

### Run the Test Suite

Verify everything works:
```bash
npm test
```

---

## Common Questions

### Q: Why is my code compressed?

Bitcoin block space is expensive. Compression reduces your inscription size (and cost) by 50-70%.

### Q: Where does Three.js come from?

Three.js is already inscribed on Bitcoin! Your code fetches it at runtime from inscription `2dbdf9eb...i0`. This is called "recursion."

### Q: Can I use other libraries?

Yes! Any JavaScript can be compressed. For libraries not already on-chain, you'll need to include them in your code (which increases size).

### Q: How do I actually inscribe?

Once your `index.html` is ready:
1. Get a Bitcoin wallet that supports Ordinals (Xverse, Leather, etc.)
2. Use an inscription service (ord, Gamma, Ordinals Bot, etc.)
3. Upload your `index.html` and pay the inscription fee

### Q: What if my code is too big?

- Minify your code (remove comments, whitespace)
- Remove unused code
- Use shorter variable names
- Consider if you really need all that functionality

Use `node tools/size-calc.js your-file.js` to check sizes quickly.

---

## Getting Help

- **GitHub Issues**: https://github.com/metagood/OCM-Dimensions/issues
- **Tutorials**: Check the `tutorials/` folder
- **Examples**: Look at `tools/threejs/02_main.js` for working code

---

## Quick Reference

```bash
# Build commands
npm run build:threejs         # Build Three.js project
npm run build:threejs:local   # Build for local testing
npm run build:p5js            # Build p5.js project
npm run build:p5js:local      # Build for local testing
npm run build:compress-html   # Compress generic HTML

# Check file sizes
node tools/size-calc.js <file>
node tools/size-calc.js --dir=<directory>

# Run tests
npm test

# Get help
node tools/build-cli.js --help
node tools/size-calc.js --help
```

**Ready to create your first on-chain artwork? Start with the example in `tools/threejs/02_main.js` and make it your own!**
