# OCM Dimensions

Welcome to OCM Dimensions! 

OCM Dimensions is a high-resolution, 3D animated and generative ordinal collection, making it a pioneer among collections on Bitcoin since its inscription in February 2023. Dimensions innovates in the following areas:

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

This toolset comprises three key utilities: 

1. Compress HTML
2. Use Three.js
3. Use p5.js

Let's walk through how to use each of them.

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

## Usage
### Compress HTML

1. Navigate to the `compress-html` directory with `cd compress-html`.
2. Place your `.html` file in the `input` directory.
3. Run `make clean && make` in the terminal.
4. Your compressed file will be `index.html`.
5. To check if `index.html` file works locally, open `index.html` and search and replace "fetch(/content/" with "fetch(https://ordinals.com/content/".

### Use Three.js

1. Navigate to the `threejs` directory with `cd ../threejs`.
2. Minify your `02_main.js` file and save it as `compressed-inputs/02_main.min.js`.
    - If you have `minify` installed, run `minify 02_main.js > compressed-inputs/02_main.min.js` in the terminal.
    - If you don't have `minify`, just put the js code in `compressed-inputs/02_main.min.js` directly.
3. Run `make clean && make` in the terminal.
4. Your final file will be `index.html`.
5. To check if `index.html` file works locally, open `index.html` and search and replace "fetch(/content/" with "fetch(https://ordinals.com/content/".

### Use p5.js

1. Navigate to the `p5js` directory with `cd ../p5js`.
2. Put your js code in `input/02_main.js`.
3. Run `make clean && make` in the terminal.
4. Your final file will be `index.html`.
5. To check if `index.html` file works locally, open `index.html` and search and replace "fetch(/content/" with "fetch(https://ordinals.com/content/" (2 places).

## Inscribing Your Art
With your HTML, Three.js, or p5.js file compressed into `index.html`, you're ready to inscribe your art on the Bitcoin blockchain. Thanks to the OCM Dimensions, your art will be stored in a highly efficient manner, saving valuable space and allowing for more creativity. Happy coding and inscribing!

## Feedback
We appreciate your feedback and suggestions. Please create an issue in the GitHub issue tracker.
