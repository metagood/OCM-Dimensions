# OCM Dimensions

Welcome to OCM Dimensions! This is a comprehensive suite of tools aimed at helping creators save space on the Bitcoin blockchain by compressing their HTML, Three.js, or p5.js files. By leveraging the Dimensions art, we're making it possible to inscribe more data onto Bitcoin, with no changes needed to the Ordinal protocol. 

This toolset comprises three key utilities: 

1. Compress HTML
2. Compress Three.js
3. Compress p5.js

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

### Compress Three.js

1. Navigate to the `threejs` directory with `cd ../threejs`.
2. Minify your `02_main.js` file and save it as `compressed-inputs/02_main.min.js`.
    - If you have `minify` installed, run `minify 02_main.js > compressed-inputs/02_main.min.js` in the terminal.
    - If you don't have `minify`, just put the js code in `compressed-inputs/02_main.min.js` directly.
3. Run `make clean && make` in the terminal.
4. Your final file will be `index.html`.
5. To check if `index.html` file works locally, open `index.html` and search and replace "fetch(/content/" with "fetch(https://ordinals.com/content/".

### Compress p5.js

1. Navigate to the `p5js` directory with `cd ../p5js`.
2. Put your js code in `input/02_main.js`.
3. Run `make clean && make` in the terminal.
4. Your final file will be `index.html`.
5. To check if `index.html` file works locally, open `index.html` and search and replace "fetch(/content/" with "fetch(https://ordinals.com/content/" (2 places).

## Inscribing Your Art
With your HTML, Three.js, or p5.js file compressed into `index.html`, you're ready to inscribe your art on the Bitcoin blockchain. Thanks to the OCM Dimensions, your art will be stored in a highly efficient manner, saving valuable space and allowing for more creativity. Happy coding and inscribing!

## Feedback
We appreciate your feedback and suggestions. Please create an issue in the GitHub issue tracker.
