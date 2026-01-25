# OCM Dimensions

![Bitcoin](https://img.shields.io/badge/Bitcoin-Ordinals-orange)
![Status](https://img.shields.io/badge/status-live-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![OnChain](https://img.shields.io/badge/on--chain-100%25-brightgreen)

> **OCM Dimensions** is a landmark Bitcoin Ordinals project: high-resolution, interactive 3D generative art rendered entirely from on-chain code.
> Launched in February 2023 by the OnChainMonkey team, it proved—early and definitively—that Bitcoin can support sophisticated, permanent digital art without off-chain dependencies.

---

## TL;DR (For Collectors & Builders)

- Fully on-chain, interactive 3D generative art on Bitcoin
- Each artwork rendered live from code, not stored images
- Uses recursion, compression, and shared on-chain libraries
- Historic early sats + early Ordinals experimentation
- Open-source tools included to build your own Bitcoin-native art

---

![OCM Dimensions Artwork](https://onchainmonkey.com/static/media/dimensions-story.4bc80bb4386dd8f6f1c3.webp)

*Example OCM Dimensions artwork. Each piece is a live-rendered 3D animated sculpture generated entirely from code inscribed on Bitcoin.*

---

## Table of Contents

- [Why OCM Dimensions Matters](#why-ocm-dimensions-matters)
- [Historical Context: Bitcoin Ordinals & On-Chain Art](#historical-context-bitcoin-ordinals--on-chain-art)
- [Technical Firsts](#technical-firsts)
- [About This Repository](#about-this-repository)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Repository Structure](#repository-structure)
- [Inscribing on Bitcoin](#inscribing-on-bitcoin)
- [Contributing](#contributing)
- [Philosophy](#philosophy)
- [Further Reading](#further-reading)

---

## Why OCM Dimensions Matters

OCM Dimensions expanded the boundaries of what was thought possible on Bitcoin:

- **High-fidelity 3D art**
  Each piece is a real-time rendered 3D animation that adapts to any screen resolution, including 4K+ displays.

- **Extreme on-chain efficiency**
  Each artwork is under ~1KB despite its visual complexity—made possible through generative code, compression, and recursion.

- **Protocol-level permanence**
  No IPFS. No APIs. No servers. Everything needed to render the art lives on Bitcoin itself.

- **Bitcoin-native provenance**
  Early parent-child inscription patterns define collection membership and authenticity directly on-chain.

OCM Dimensions helped establish Bitcoin Ordinals as a serious medium for generative and conceptual digital art.

---

## Historical Context: Bitcoin Ordinals & On-Chain Art

Bitcoin Ordinals allow individual satoshis to carry arbitrary data—turning the smallest unit of Bitcoin into a permanent digital artifact.

However, Bitcoin’s block space is scarce and expensive. Early assumptions were that only simple images or text could be inscribed sustainably.

OCM Dimensions challenged that assumption.

By combining:
- **Generative art** (code instead of images),
- **Compression** (gzip + base64),
- **Recursion** (shared on-chain libraries: Three.js, p5.js),

OCM Dimensions demonstrated that **complex, interactive, high-resolution art** could live entirely on Bitcoin.

Many techniques now considered standard in advanced Ordinals development—recursive calls, shared libraries, parent-child provenance—were first demonstrated publicly at scale in OCM Dimensions.

Part of the art of Dimensions is the concept of being a seed in a growing network of art on Bitcoin. Each new artwork created that is enabled by Dimensions is a new branch in the growing on-chain "tree" of networked art. Now, after two years, the tree has grown into a forest of art works by numerous artists and thousands of works (many still waiting to be discovered!). OCM Dimensions is one of the most linked inscriptions on Bitcoin.

---

## Technical Firsts

### Recursive Inscriptions
OCM Dimensions pioneered recursion with code on Bitcoin, allowing inscriptions to call other inscriptions at render time. This made modular, composable on-chain software possible.

### On-Chain Libraries
Compressed versions of:
- **Three.js** (3D rendering)
- **p5.js** (generative art)
- **fflate** (compression)

were inscribed once and reused across artworks—dramatically reducing size and enabling rich visuals.

### Parent-Child Provenance
A parent inscription defines the collection. Child inscriptions define individual artworks. Authenticity and membership are verifiable at the protocol level.

### Historic Satoshis
Early Dimensions pieces were inscribed on satoshis mined in January 2009, embedding the work directly into Bitcoin’s earliest history.

### On-Chain Random Reveal
The first fully on-chain random reveal mechanisms on Bitcoin, ensuring fair distribution without off-chain randomness. Originally thought impossible with immutable inscriptions.

---

## About This Repository

This repository contains the **open-source tooling** developed for OCM Dimensions, and available for everyone to use.

It enables artists and developers to:
- Build generative and interactive Ordinals
- Compress HTML/JS for Bitcoin constraints
- Reuse on-chain libraries via recursion
- Create rich visuals without protocol changes

These tools are production-proven by OCM Dimensions itself.

The On-chain library inscriptions:

These inscriptions are the foundation of the workflow in this repo. You use recursion (fetching on-chain content from within your inscription) to load the libraries at render time.

- OCM Dimensions (fflate + Three.js): `2dbdf9ebbec6be793fd16ae9b797c7cf968ab2427166aaf390b90b71778266abi0`
- p5.js library: `255ce0c5a0d8aca39510da72e604ef8837519028827ba7b7f723b7489f3ec3a4i0`

Direct links:
- https://ordinals.com/inscription/2dbdf9ebbec6be793fd16ae9b797c7cf968ab2427166aaf390b90b71778266abi0
- https://ordinals.com/inscription/255ce0c5a0d8aca39510da72e604ef8837519028827ba7b7f723b7489f3ec3a4i0

---

## Quick Start

### Prerequisites

- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- That's it! No other dependencies required.

### Installation

```bash
git clone https://github.com/metagood/OCM-Dimensions.git
cd OCM-Dimensions
```

### Build Your First Inscription (2 minutes)

```bash
# Build a Three.js project for local testing
npm run build:threejs:local

# Open in browser to see the 3D animation
open tools/threejs/index.local.html

# When ready to inscribe, build the final version
npm run build:threejs
# → Creates tools/threejs/index.html (inscribe this!)
```

The build output shows size and estimated inscription costs:

```
============================================================
SIZE REPORT
============================================================
Original code size:    1.27 KB
Compressed (gzip):     642 B (50.7% reduction)
Final HTML size:       2.22 KB
------------------------------------------------------------
ESTIMATED INSCRIPTION COSTS:
  10 sat/vB        34,050 sats  (0.00034050 BTC)
============================================================
```

### Choose Your Workflow

| Workflow | Command | Use Case |
|----------|---------|----------|
| **Three.js** | `npm run build:threejs` | 3D graphics and animations |
| **p5.js** | `npm run build:p5js` | Creative coding sketches |
| **Compress HTML** | `npm run build:compress-html` | Any HTML/CSS/JS page |
| **Browser UI** | Open `tools/browserUI/index.html` | No terminal needed |

### Check File Sizes

Before inscribing, check your code size:

```bash
node tools/size-calc.js your-code.js
```

### Debug Mode

Add `?debug` to any URL to see console logs:
```
tools/threejs/index.local.html?debug
```

### Run Tests

```bash
npm test              # Run all tests (149 tests)
npm run test:smoke    # Quick smoke test
```

---

## Documentation

New to OCM Dimensions? Start here:

| Document | Description |
|----------|-------------|
| **[Getting Started Guide](docs/GETTING_STARTED.md)** | Complete beginner tutorial - your first inscription in 5 minutes |
| **[Tools Reference](docs/TOOLS.md)** | Detailed documentation for all tools and options |
| **[Examples](docs/EXAMPLES.md)** | Copy-paste code examples for Three.js, p5.js, and HTML |
| **[Tutorials](tutorials/README.md)** | Step-by-step workflow guides |

### Quick Reference

```bash
# Build commands
npm run build:threejs         # Build Three.js project
npm run build:threejs:local   # Build for local testing
npm run build:p5js            # Build p5.js project
npm run build:compress-html   # Compress generic HTML

# Size checking
node tools/size-calc.js <file>        # Check a file
node tools/size-calc.js --dir=src/    # Check a directory

# Testing
npm test                      # Run all tests
```

---

## Repository Structure

```
OCM-Dimensions/
├── docs/                           # Documentation
│   ├── GETTING_STARTED.md          # Beginner tutorial
│   ├── TOOLS.md                    # Tools reference
│   └── EXAMPLES.md                 # Code examples
├── tools/
│   ├── build-cli.js                # Cross-platform build CLI
│   ├── size-calc.js                # Size calculator tool
│   ├── inscriptions.json           # Central inscription config
│   ├── browserUI/                  # Visual interface (no terminal)
│   ├── threejs/                    # Three.js workflow
│   ├── p5js/                       # p5.js workflow
│   └── compress-html/              # Generic HTML compression
├── tutorials/                      # Step-by-step workflow guides
├── tests/                          # Test suite (149 tests)
├── scripts/                        # CI/smoke tests
└── package.json                    # NPM scripts
```

### Key Files

| File | Purpose |
|------|---------|
| `tools/build-cli.js` | Main build tool - works on Windows, Mac, Linux |
| `tools/size-calc.js` | Check file sizes and estimate costs |
| `tools/inscriptions.json` | All inscription IDs in one place |
| `tools/browserUI/index.html` | Visual tool - no terminal needed |

---

## Inscribing on Bitcoin

Once your final `index.html` is ready, inscribe it using any Ordinals-compatible wallet or service.

Your artwork will render directly from on-chain code—no external infrastructure required.

---

## Contributing

Issues, pull requests, and improvements are welcome.
This repo exists to expand what’s possible for art and software on Bitcoin.

---

## Philosophy

OCM Dimensions treats Bitcoin as:

- A monetary system
- A permanence layer
- A medium for generative art

By embracing Bitcoin’s constraints, it reveals new creative possibilities—where art, code, and provenance converge at the protocol layer.

---

## Further Reading

- https://onchainmonkey.com/collection/ocm-dimensions
- https://bitcoinmagazine.com/technical/the-rise-of-ordinals-and-nfts-on-the-medium-of-bitcoin
