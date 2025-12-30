# OCM Dimensions

Welcome to OCM Dimensions!

[OCM Dimensions](https://onchainmonkey.com/ocm-dimensions) is a high-resolution, 3D animated and generative ordinal collection, making it a pioneer among collections on Bitcoin since its inscription in February 2023. Dimensions innovates in the following areas:

1. Recursion and composability
2. Code libraries - compression, Three.js, p5.js - the main subject of this GitHub repo, using these libraries, anyone can
   create art on Bitcoin. It's completely open, decentralized, and the art renders automatically on all Ord explorers from
   using the on-chain libraries.
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
4. Your compressed file will be `index.html`.
5. To check if `index.html` file works locally, open `index.html` and search and replace "fetch(/content/" with "fetch(https://ordinals.com/content/".

### Use Three.js

1. Navigate to the `tools/threejs` directory with `cd tools/threejs`.
2. Minify your `02_main.js` file and save it as `compressed-inputs/02_main.min.js`.
    - If you have `minify` installed, run `minify 02_main.js > compressed-inputs/02_main.min.js` in the terminal.
    - If you don't have `minify`, just put the js code in `compressed-inputs/02_main.min.js` directly.
3. Run `make clean && make` in the terminal.
4. Your final file will be `index.html`.
5. To check if `index.html` file works locally, open `index.html` and search and replace "fetch(/content/" with "fetch(https://ordinals.com/content/".

### Use p5.js

1. Navigate to the `tools/p5js` directory with `cd tools/p5js`.
2. Put your js code in `input/02_main.js`.
3. Run `make clean && make` in the terminal.
4. Your final file will be `index.html`.
5. To check if `index.html` file works locally, open `index.html` and search and replace "fetch(/content/" with "fetch(https://ordinals.com/content/" (2 places).

## Local testing tip

When testing locally, replace `fetch(/content/...)` with `fetch(https://ordinals.com/content/...)` so the browser can access the on-chain library content without an Ord server running locally.

## Tests

Run a smoke test build of all three command-line workflows:

```bash
./scripts/run-smoke-tests.sh
```

## Inscribing Your Art

With your HTML, Three.js, or p5.js file compressed into `index.html`, you're ready to inscribe your art on the Bitcoin blockchain. Thanks to the OCM Dimensions, your art will be stored in a highly efficient manner, saving valuable space and allowing for more creativity. Happy coding and inscribing!

## Feedback

We appreciate your feedback and suggestions. Please create an issue in the GitHub issue tracker.
