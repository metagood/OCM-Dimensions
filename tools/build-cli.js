#!/usr/bin/env node

/**
 * OCM Dimensions - Cross-Platform Build CLI
 *
 * Usage:
 *   node tools/build-cli.js --workflow=threejs
 *   node tools/build-cli.js --workflow=p5js --base-url=https://ordinals.com
 *   node tools/build-cli.js --workflow=compress-html
 *
 * Options:
 *   --workflow=<name>    Required. One of: threejs, p5js, compress-html
 *   --base-url=<url>     Optional. Base URL for local testing (creates index.local.html)
 *   --output=<file>      Optional. Custom output filename
 *   --help               Show this help message
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Parse command line arguments
function parseArgs(argv) {
  const args = {};
  argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      args[key] = value === undefined ? true : value;
    }
  });
  return args;
}

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Calculate inscription cost estimates
function estimateCost(bytes) {
  // Bitcoin inscription costs based on fee rates (sats/vB)
  // Inscription size overhead is approximately 1.5x the data size
  const vBytes = Math.ceil(bytes * 1.5);
  const feeRates = [1, 5, 10, 20, 50];

  return feeRates.map(rate => ({
    rate: `${rate} sat/vB`,
    sats: vBytes * rate,
    btc: ((vBytes * rate) / 100000000).toFixed(8)
  }));
}

// Print size report
function printSizeReport(stats) {
  console.log('\n' + '='.repeat(60));
  console.log('SIZE REPORT');
  console.log('='.repeat(60));
  console.log(`Original code size:    ${formatBytes(stats.originalSize)}`);
  console.log(`Compressed (gzip):     ${formatBytes(stats.compressedSize)} (${((1 - stats.compressedSize / stats.originalSize) * 100).toFixed(1)}% reduction)`);
  console.log(`Base64 encoded:        ${formatBytes(stats.base64Size)}`);
  console.log(`Final HTML size:       ${formatBytes(stats.finalSize)}`);
  console.log('-'.repeat(60));
  console.log('ESTIMATED INSCRIPTION COSTS:');
  const costs = estimateCost(stats.finalSize);
  costs.forEach(c => {
    console.log(`  ${c.rate.padEnd(12)} ${c.sats.toLocaleString().padStart(10)} sats  (${c.btc} BTC)`);
  });
  console.log('='.repeat(60) + '\n');
}

// Read and concatenate input files
function readInputFiles(inputDir) {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input directory not found: ${inputDir}`);
  }

  const files = fs.readdirSync(inputDir)
    .filter(f => !f.startsWith('.'))
    .sort();

  if (files.length === 0) {
    throw new Error(`No input files found in: ${inputDir}`);
  }

  let content = '';
  files.forEach(file => {
    const filePath = path.join(inputDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      content += fs.readFileSync(filePath, 'utf8');
    }
  });

  return content;
}

// Compress and encode content
function compressContent(content) {
  const compressed = zlib.gzipSync(Buffer.from(content), { level: 9 });
  const base64 = compressed.toString('base64');
  return {
    originalSize: Buffer.byteLength(content),
    compressedSize: compressed.length,
    base64Size: base64.length,
    base64: base64
  };
}

// Build the final HTML
function buildHtml(workflow, baseUrl) {
  const toolsDir = path.dirname(__filename);
  const workflowDir = path.join(toolsDir, workflow);

  // Load inscriptions config
  const inscriptionsPath = path.join(toolsDir, 'inscriptions.json');
  const inscriptions = JSON.parse(fs.readFileSync(inscriptionsPath, 'utf8'));
  const workflowConfig = inscriptions.workflows[workflow];

  if (!workflowConfig) {
    throw new Error(`Unknown workflow: ${workflow}. Available: ${Object.keys(inscriptions.workflows).join(', ')}`);
  }

  // Read input files
  const inputDir = path.join(workflowDir, workflowConfig.inputDir);
  const inputContent = readInputFiles(inputDir);

  // Compress content
  const compressed = compressContent(inputContent);

  // Read and process template
  const templatePath = path.join(workflowDir, workflowConfig.template);
  let template = fs.readFileSync(templatePath, 'utf8');

  // Replace inscription ID placeholders
  template = template.replace(/\{\{OCM_DIMENSIONS_ID\}\}/g, inscriptions.inscriptions['ocm-dimensions'].id);
  template = template.replace(/\{\{FFLATE_LINE\}\}/g, inscriptions.inscriptions['ocm-dimensions'].lines.fflate);
  template = template.replace(/\{\{THREEJS_LINE\}\}/g, inscriptions.inscriptions['ocm-dimensions'].lines.threejs);
  template = template.replace(/\{\{P5JS_ID\}\}/g, inscriptions.inscriptions['p5js'].id);

  // Replace compressed source placeholder
  let html = template.replace('SRC_COMPRESSED_STRING', compressed.base64);

  // Apply base URL if specified
  if (baseUrl) {
    const normalizedUrl = baseUrl.replace(/\/$/, '');
    html = html.split('`/content/').join('`' + normalizedUrl + '/content/');
  }

  return {
    html,
    stats: {
      ...compressed,
      finalSize: Buffer.byteLength(html)
    }
  };
}

// Main function
function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    console.log(`
OCM Dimensions - Cross-Platform Build CLI

Usage:
  node tools/build-cli.js --workflow=<name> [options]

Workflows:
  threejs        Build Three.js artwork
  p5js           Build p5.js sketch
  compress-html  Compress generic HTML

Options:
  --workflow=<name>    Required. Workflow to run
  --base-url=<url>     Base URL for testing (e.g., https://ordinals.com)
  --output=<file>      Custom output filename
  --help               Show this help message

Examples:
  node tools/build-cli.js --workflow=threejs
  node tools/build-cli.js --workflow=p5js --base-url=https://ordinals.com
  node tools/build-cli.js --workflow=compress-html --output=my-art.html
`);
    process.exit(0);
  }

  if (!args.workflow) {
    console.error('Error: --workflow is required');
    console.error('Run with --help for usage information');
    process.exit(1);
  }

  const validWorkflows = ['threejs', 'p5js', 'compress-html'];
  if (!validWorkflows.includes(args.workflow)) {
    console.error(`Error: Invalid workflow "${args.workflow}"`);
    console.error(`Valid workflows: ${validWorkflows.join(', ')}`);
    process.exit(1);
  }

  try {
    const toolsDir = path.dirname(__filename);
    const workflowDir = path.join(toolsDir, args.workflow);

    // Build the HTML
    const result = buildHtml(args.workflow, args['base-url']);

    // Determine output filename
    let outputFile;
    if (args.output) {
      outputFile = args.output;
    } else if (args['base-url']) {
      outputFile = path.join(workflowDir, 'index.local.html');
    } else {
      outputFile = path.join(workflowDir, 'index.html');
    }

    // Write output
    fs.writeFileSync(outputFile, result.html);
    console.log(`Built: ${outputFile}`);

    // Print size report
    printSizeReport(result.stats);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
