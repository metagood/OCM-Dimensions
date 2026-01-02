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

You will need the following installed on your machine:
- Node.js and npm. You can download these from [here](https://nodejs.org/).
- `make` command. This is usually pre-installed on Unix-based systems. For Windows, you can use a utility like [Make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm).

### Installation

You can download the tools directly from this GitHub repository. Simply click on the 'Code' button on this page and then click 'Download ZIP'. Once downloaded, unzip the file and navigate to the resulting directory in your terminal.

If you have `git` installed, you can also clone this repository by running:

```bash
git clone https://github.com/metagood/OCM-Dimensions.git
cd OCM-Dimensions
```

### Workflows

Pick the workflow that matches your project:

- **Browser UI** (no terminal needed): open `tools/browserUI/index.html` in your browser and use the **Compile** button to generate a ready-to-inscribe page.
- **Three.js**: use `tools/threejs` to compress your scene logic and auto-load the on-chain Three.js + fflate bundle.
- **p5.js**: use `tools/p5js` to compress your sketch and auto-load the on-chain p5.js library.
- **Compress HTML**: use `tools/compress-html` when you already have a full HTML page you want to gzip+base64 and stream on-chain.

For guided walkthroughs, start in `tutorials/README.md`.

### Usage

#### Compress HTML

1. Navigate to the `tools/compress-html` directory with `cd tools/compress-html`.
2. Place your `.html` file in the `input` directory.
3. Run `make clean && make` in the terminal.
4. Your compressed file will be `index.html` (for inscribing) and `index.local.html` (for local preview).
5. Open `index.local.html` in a browser to test locally with the Ordinals content URLs already in place.

#### Use Three.js

1. Navigate to the `tools/threejs` directory with `cd tools/threejs`.
2. Minify your `02_main.js` file and save it as `compressed-inputs/02_main.min.js`.
    - If you have `minify` installed, run `minify 02_main.js > compressed-inputs/02_main.min.js` in the terminal.
    - If you don't have `minify`, just put the js code in `compressed-inputs/02_main.min.js` directly.
3. Run `make clean && make` in the terminal.
4. Your final files will be `index.html` (for inscribing) and `index.local.html` (for local preview).
5. Open `index.local.html` in a browser to test locally with the Ordinals content URLs already in place.

#### Use p5.js

1. Navigate to the `tools/p5js` directory with `cd tools/p5js`.
2. Put your js code in `input/02_main.js`.
3. Run `make clean && make` in the terminal.
4. Your final files will be `index.html` (for inscribing) and `index.local.html` (for local preview).
5. Open `index.local.html` in a browser to test locally with the Ordinals content URLs already in place.

### Local testing tip

The `make` targets now generate `index.local.html` for each workflow with `https://ordinals.com` prefilled for the content fetches. Use it for local preview, and inscribe `index.html` as-is.

### Tests

Run a smoke test build of all three command-line workflows:

```bash
./scripts/run-smoke-tests.sh
```

---

## Repository Structure

- **tools/compress-html/** - Compress a single HTML file using gzip and base64.
- **tools/threejs/** - Helper scripts for Three.js projects.
- **tools/p5js/** - Helper scripts for p5.js projects.
- **tools/browserUI/** - In-browser interface to bundle code with selected libraries.
- **tools/compress-html/examples/** - Samples demonstrating larger pieces of content.
- **tools/compress-html/onepage/** - Example output from the browser UI.
- **tutorials/** - Step-by-step guides for the Three.js, p5.js, and compressed HTML workflows.
- **scripts/** - Repository smoke tests.

Each directory includes a README with specific build instructions.

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
