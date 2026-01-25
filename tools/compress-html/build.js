const fs = require('fs');
const path = require('path');

// Load centralized inscriptions config
const inscriptionsPath = path.join(__dirname, '..', 'inscriptions.json');
const inscriptions = JSON.parse(fs.readFileSync(inscriptionsPath, 'utf8'));

const args = process.argv.slice(2);
const baseUrlIndex = args.indexOf('--base-url');
let baseUrlInput = '';
if (baseUrlIndex >= 0) {
  const candidate = args[baseUrlIndex + 1];
  if (typeof candidate === 'string' && !candidate.startsWith('--')) {
    baseUrlInput = candidate;
  }
}
const baseUrl = baseUrlInput ? baseUrlInput.replace(/\/$/, '') : '';

let page_structure = fs.readFileSync('page-structure.html', {encoding:'utf8'});
const src_compressed = fs.readFileSync('src-compressed-string.base64', {encoding:'utf8'}).trim();

// Replace inscription ID placeholders
page_structure = page_structure.replace(/\{\{OCM_DIMENSIONS_ID\}\}/g, inscriptions.inscriptions['ocm-dimensions'].id);
page_structure = page_structure.replace(/\{\{FFLATE_LINE\}\}/g, inscriptions.inscriptions['ocm-dimensions'].lines.fflate);

// Replace compressed source placeholder
let page01 = page_structure.replace('SRC_COMPRESSED_STRING', src_compressed);

if (baseUrl) {
  page01 = page01.split('`/content/').join('`' + baseUrl + '/content/');
}

console.log(page01);
