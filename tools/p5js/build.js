const fs = require('fs');
const page_structure = fs.readFileSync('page-structure.html', {encoding:'utf8'});
const src_compressed = fs.readFileSync('src-compressed-string.base64', {encoding:'utf8'}).trim()
const page01 = page_structure.replace('SRC_COMPRESSED_STRING', src_compressed);
console.log(page01);
