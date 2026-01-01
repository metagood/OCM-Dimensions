# OCM Dimensions

Welcome to OCM Dimensions!

[OCM Dimensions](https://onchainmonkey.com/ocm-dimensions) is a high-resolution, 3D animated and generative ordinal collection, making it a pioneer among collections on Bitcoin since its inscription in February 2023. Dimensions innovates in the following areas:

1. Recursion and composability
2. Code libraries - compression, Three.js, p5.js - the main subject of this GitHub repo. Using these libraries, anyone can
   create art on Bitcoin. It's completely open, decentralized, and the art renders automatically on all Ordinals explorers
   by using the on-chain libraries.
3. Generative inscriptions
4. File size - OCM Dimensions does all this in less than 500 bytes per inscription
5. Provenance and parent-child
6. On-chain randomization and reveal with a fair launch
7. Reinscription
8. 3D animated and interactive
9. Streaming from a satoshi, and adjusts to screen resolution and aspect ratio
10. Special sats and sat manipulation art - the OCM Collection was inscribed on sequential block 78 sats that matched the
    numbers in the collection, and was a parent-child cursed collection.

Read more [about OCM Dimensions.](https://onchainmonkey.medium.com/ocm-dimensions-unveiling-the-many-dimensions-of-bitcoin-ordinals-c850688db68e)

This GitHub repository for OCM Dimensions is a suite of tools aimed at helping creators save space on the Bitcoin blockchain by compressing their HTML, and empower creators with the powerful libraries of Three.js, and p5.js which we inscribed on Bitcoin. By leveraging the Dimensions art, we're making it possible to have more power inscribing on Bitcoin, with no changes needed to the Ordinal protocol.

## Why Dimensions matters: art, recursion, and a growing forest

**Art on Bitcoin** matters because it turns creativity into permanent, globally verifiable culture. Bitcoin is a durable, censorship-resistant media substrate; inscribing art gives it provenance baked into the chain and resilience that outlasts platforms. The tight byte limits push artists toward elegant systems: compact code, generative logic, and smart reuse.

**Ordinals protocol context.** Ordinals associate data with individual satoshis, making inscriptions first-class, on-chain artifacts that can be rendered by Ordinals-aware viewers. OCM was influential in shaping early protocol standards and best practices around recursion and parent-child provenance, helping define how inscriptions can reference one another and preserve lineage on Bitcoin.

**Recursion** is the superpower that makes this possible at scale. Dimensions shows how a single inscription can load other inscriptions at render time, referencing shared libraries, assets, or even other artworks. This makes composability real: creators build once, reuse everywhere, and stay inside strict size limits. Recursion turns Bitcoin into a modular art platform, not just a storage layer. OCM Dimensions is an **early and highly influential example of recursive art on Bitcoin**, and was among the first to show how recursion can be used with shared code libraries to create on-chain art at scale.

**Firsts that changed the medium.** OCM Dimensions was first to inscribe **Three.js** and **p5.js** on Bitcoin and to pair them with **fflate** compression for real-time, generative art on-chain. Those libraries became the backbone for creators who want powerful visuals in tiny inscriptions.

**Dimensions as a root** was always the concept. It intentionally included on-chain libraries for art so that Dimensions could be the root from which a forest of Bitcoin-native creations could grow. Two years later, that vision is real: those libraries now power **tens of thousands of works on Bitcoin**, and they are the **most widely used shared libraries by creators on Bitcoin**, each inheriting the same compact, on-chain, composable DNA.

## Background: Ordinals, art on Bitcoin, and why these tools exist

**Ordinals** are a way to associate data with individual satoshis. When you "inscribe" HTML, JavaScript, or media, that content becomes part of Bitcoin's history and can be rendered directly by Ordinals-aware viewers. OCM Dimensions uses **recursion** (fetching other inscriptions at render time) so creators can reference shared on-chain libraries instead of uploading duplicate code.

**Art on Bitcoin** pushes creators to work within tight file-size limits. Generative art thrives in this environment because small, parameterized code can output infinite variety. The tooling in this repo focuses on keeping your inscriptions tiny while still enabling rich visuals.

**Why Three.js and p5.js?** Three.js unlocks real-time 3D graphics and animation in the browser, while p5.js is a creative coding toolkit popular for generative visuals. OCM Dimensions inscribed compact versions of these libraries so you can pull them on-chain when your work renders.

**OCM Dimensions and OnChainMonkey.** OnChainMonkey (OCM) is a leading Bitcoin-native art project. OCM Dimensions extends that lineage by demonstrating what's possible with recursive on-chain libraries, compressing complex 3D generative work into exceptionally small inscriptions.

## On-chain library inscriptions

These inscriptions are the foundation of the workflow in this repo. You use recursion (fetching on-chain content from within your inscription) to load the libraries at render time.

- OCM Dimensions (fflate + Three.js): `2dbdf9ebbec6be793fd16ae9b797c7cf968ab2427166aaf390b90b71778266abi0`
- p5.js library: `255ce0c5a0d8aca39510da72e604ef8837519028827ba7b7f723b7489f3ec3a4i0`

Direct links:
- https://ordinals.com/inscription/2dbdf9ebbec6be793fd16ae9b797c7cf968ab2427166aaf390b90b71778266abi0
- https://ordinals.com/inscription/255ce0c5a0d8aca39510da72e604ef8837519028827ba7b7f723b7489f3ec3a4i0

## Repository Structure

- **tools/compress-html/** – Compress a single HTML file using gzip and base64.
- **tools/threejs/** – Helper scripts for Three.js projects.
- **tools/p5js/** – Helper scripts for p5.js projects.
- **tools/browserUI/** – In-browser interface to bundle code with selected libraries.
- **tools/compress-html/examples/** – Samples demonstrating larger pieces of content.
- **tools/compress-html/onepage/** – Example output from the browser UI.
- **tutorials/** – Step-by-step guides for the Three.js, p5.js, and compressed HTML workflows.
- **scripts/** – Repository smoke tests.

Each directory includes a README with specific build instructions.

## Prerequisites

You will need the following installed on your machine:
- Node.js and npm. You can download these from [here](https://nodejs.org/).
- `make` command. This is usually pre-installed on Unix-based systems. For Windows, you can use a utility like [Make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm).

## Installation

You can download the tools directly from this GitHub repository. Simply click on the 'Code' button on this page and then click 'Download ZIP'. Once downloaded, unzip the file and navigate to the resulting directory in your terminal.

If you have `git` installed, you can also clone this repository by running:

```bash
git clone https://github.com/metagood/OCM-Dimensions.git
cd OCM-Dimensions
```

## Quick start

Pick the workflow that matches your project:

- **Browser UI** (no terminal needed): open `tools/browserUI/index.html` in your browser and use the **Compile** button to generate a ready-to-inscribe page.
- **Three.js**: use `tools/threejs` to compress your scene logic and auto-load the on-chain Three.js + fflate bundle.
- **p5.js**: use `tools/p5js` to compress your sketch and auto-load the on-chain p5.js library.
- **Compress HTML**: use `tools/compress-html` when you already have a full HTML page you want to gzip+base64 and stream on-chain.

For guided walkthroughs, start in `tutorials/README.md`.

## Usage

### Compress HTML

1. Navigate to the `tools/compress-html` directory with `cd tools/compress-html`.
2. Place your `.html` file in the `input` directory.
3. Run `make clean && make` in the terminal.
4. Your compressed file will be `index.html` (for inscribing) and `index.local.html` (for local preview).
5. Open `index.local.html` in a browser to test locally with the Ordinals content URLs already in place.

### Use Three.js

1. Navigate to the `tools/threejs` directory with `cd tools/threejs`.
2. Minify your `02_main.js` file and save it as `compressed-inputs/02_main.min.js`.
    - If you have `minify` installed, run `minify 02_main.js > compressed-inputs/02_main.min.js` in the terminal.
    - If you don't have `minify`, just put the js code in `compressed-inputs/02_main.min.js` directly.
3. Run `make clean && make` in the terminal.
4. Your final files will be `index.html` (for inscribing) and `index.local.html` (for local preview).
5. Open `index.local.html` in a browser to test locally with the Ordinals content URLs already in place.

### Use p5.js

1. Navigate to the `tools/p5js` directory with `cd tools/p5js`.
2. Put your js code in `input/02_main.js`.
3. Run `make clean && make` in the terminal.
4. Your final files will be `index.html` (for inscribing) and `index.local.html` (for local preview).
5. Open `index.local.html` in a browser to test locally with the Ordinals content URLs already in place.

## Local testing tip

The `make` targets now generate `index.local.html` for each workflow with `https://ordinals.com` prefilled for the content fetches. Use it for local preview, and inscribe `index.html` as-is.

## Tests

Run a smoke test build of all three command-line workflows:

```bash
./scripts/run-smoke-tests.sh
```

## Inscribing Your Art

With your HTML, Three.js, or p5.js file compressed into `index.html`, you're ready to inscribe your art on the Bitcoin blockchain. Thanks to the OCM Dimensions, your art will be stored in a highly efficient manner, saving valuable space and allowing for more creativity. Happy coding and inscribing!

## Feedback

We appreciate your feedback and suggestions. Please create an issue in the GitHub issue tracker.
