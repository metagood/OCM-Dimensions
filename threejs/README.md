# How to use Dimensions to use three.js

1. (optional)Download minify via npm:

> `npm i minify -g`

2. (optional)Minify 02_main.js and write to compressed-inputs/02_main.min.js:

> `minify 02_main.js > compressed-inputs/02_main.min.js`

If you don's use minify, just put the js code in compressed-inputs/02_main.min.js directly

3. Run make:

> `make clean && make`

4. The final file to upload as an inscription is index.html

5. (optional) To check if index.html file works locally, open index.html and search and replace "fetch(`/content/" with "fetch(`https://ordinals.com/content/"

