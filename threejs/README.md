### Use Three.js

1. Navigate to the `threejs` directory with `cd ../threejs`.
2. Minify your `02_main.js` file and save it as `compressed-inputs/02_main.min.js`.
    - If you have `minify` installed, run `minify 02_main.js > compressed-inputs/02_main.min.js` in the terminal.
    - If you don't have `minify`, just put the js code in `compressed-inputs/02_main.min.js` directly.
3. Run `make clean && make` in the terminal.
4. Your final file will be `index.html`.
5. To check if `index.html` file works locally, open `index.html` and search and replace "fetch(/content/" with "fetch(https://ordinals.com/content/".
