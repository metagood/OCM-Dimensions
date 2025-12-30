const fs = require('fs');

const args = process.argv.slice(2);
const baseUrlIndex = args.indexOf('--base-url');
let baseUrlInput = '';
if (baseUrlIndex >= 0) {
  const nextArg = args[baseUrlIndex + 1];
  if (nextArg && !nextArg.startsWith('--')) {
    baseUrlInput = nextArg;
  }
}
const baseUrl = baseUrlInput ? baseUrlInput.replace(/\/$/, '') : '';

const page_structure = fs.readFileSync('page-structure.html', {encoding:'utf8'});
const src_compressed = fs.readFileSync('src-compressed-string.base64', {encoding:'utf8'}).trim();
let page01 = page_structure.replace('SRC_COMPRESSED_STRING', src_compressed);

if (baseUrl) {
  page01 = page01.split('`/content/').join('`' + baseUrl + '/content/');
}

console.log(page01);
