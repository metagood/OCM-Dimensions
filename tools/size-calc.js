#!/usr/bin/env node

/**
 * OCM Dimensions - Size Calculator
 *
 * Quick size estimates for files without a full build.
 *
 * Usage:
 *   node tools/size-calc.js <file>
 *   node tools/size-calc.js <file1> <file2> ...
 *   node tools/size-calc.js --dir=<directory>
 *
 * Options:
 *   --dir=<path>    Calculate for all files in directory
 *   --json          Output as JSON
 *   --help          Show this help message
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

// Size thresholds for color coding (in bytes)
const THRESHOLDS = {
  good: 50 * 1024,      // < 50KB = green
  warning: 100 * 1024,  // < 100KB = yellow
  // > 100KB = red
};

// Parse command line arguments
function parseArgs(argv) {
  const args = { files: [] };
  argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      args[key] = value === undefined ? true : value;
    } else {
      args.files.push(arg);
    }
  });
  return args;
}

// Format bytes to human readable
function formatBytes(bytes, useColor = true) {
  let formatted;
  if (bytes < 1024) {
    formatted = bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    formatted = (bytes / 1024).toFixed(2) + ' KB';
  } else {
    formatted = (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  if (!useColor) return formatted;

  if (bytes < THRESHOLDS.good) {
    return colors.green + formatted + colors.reset;
  } else if (bytes < THRESHOLDS.warning) {
    return colors.yellow + formatted + colors.reset;
  } else {
    return colors.red + formatted + colors.reset;
  }
}

// Calculate inscription cost estimates
function estimateCost(bytes) {
  const vBytes = Math.ceil(bytes * 1.5);
  const feeRates = [1, 5, 10, 20, 50];

  return feeRates.map(rate => ({
    rate,
    rateStr: `${rate} sat/vB`,
    sats: vBytes * rate,
    btc: ((vBytes * rate) / 100000000).toFixed(8)
  }));
}

// Calculate sizes for content
function calculateSizes(content) {
  const originalBuffer = Buffer.from(content);
  const compressed = zlib.gzipSync(originalBuffer, { level: 9 });
  const base64 = compressed.toString('base64');

  // Estimate final HTML size (template overhead ~500-800 bytes)
  const templateOverhead = 700;
  const estimatedFinalSize = base64.length + templateOverhead;

  return {
    original: originalBuffer.length,
    compressed: compressed.length,
    base64: base64.length,
    estimatedFinal: estimatedFinalSize,
    compressionRatio: ((1 - compressed.length / originalBuffer.length) * 100).toFixed(1)
  };
}

// Read files from directory
function readDirectory(dirPath) {
  const files = fs.readdirSync(dirPath)
    .filter(f => !f.startsWith('.'))
    .sort()
    .map(f => path.join(dirPath, f))
    .filter(f => fs.statSync(f).isFile());
  return files;
}

// Print size report for a file
function printReport(filePath, sizes, isJson = false) {
  if (isJson) {
    return {
      file: filePath,
      ...sizes,
      costs: estimateCost(sizes.estimatedFinal)
    };
  }

  console.log('\n' + colors.cyan + '=' .repeat(60) + colors.reset);
  console.log(colors.cyan + 'FILE: ' + colors.reset + filePath);
  console.log(colors.cyan + '=' .repeat(60) + colors.reset);

  console.log(`Original size:         ${formatBytes(sizes.original)}`);
  console.log(`Compressed (gzip -9):  ${formatBytes(sizes.compressed, false)} ${colors.dim}(${sizes.compressionRatio}% reduction)${colors.reset}`);
  console.log(`Base64 encoded:        ${formatBytes(sizes.base64, false)}`);
  console.log(`Estimated final HTML:  ${formatBytes(sizes.estimatedFinal)}`);

  console.log('\n' + colors.dim + 'Estimated inscription costs:' + colors.reset);
  const costs = estimateCost(sizes.estimatedFinal);
  costs.forEach(c => {
    console.log(`  ${c.rateStr.padEnd(12)} ${c.sats.toLocaleString().padStart(10)} sats`);
  });
}

// Print combined report for multiple files
function printCombinedReport(files, isJson = false) {
  let combinedContent = '';
  const fileDetails = [];

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    combinedContent += content;
    const sizes = calculateSizes(content);
    fileDetails.push({ file: filePath, sizes });
  });

  const combinedSizes = calculateSizes(combinedContent);

  if (isJson) {
    return {
      files: fileDetails.map(d => ({ file: d.file, ...d.sizes })),
      combined: {
        ...combinedSizes,
        costs: estimateCost(combinedSizes.estimatedFinal)
      }
    };
  }

  // Print individual files
  fileDetails.forEach(d => {
    console.log(`\n${colors.dim}${d.file}${colors.reset}`);
    console.log(`  Original: ${formatBytes(d.sizes.original)}  |  Compressed: ${formatBytes(d.sizes.compressed, false)}`);
  });

  // Print combined report
  console.log('\n' + colors.cyan + '=' .repeat(60) + colors.reset);
  console.log(colors.cyan + 'COMBINED TOTAL' + colors.reset);
  console.log(colors.cyan + '=' .repeat(60) + colors.reset);

  console.log(`Original size:         ${formatBytes(combinedSizes.original)}`);
  console.log(`Compressed (gzip -9):  ${formatBytes(combinedSizes.compressed, false)} ${colors.dim}(${combinedSizes.compressionRatio}% reduction)${colors.reset}`);
  console.log(`Base64 encoded:        ${formatBytes(combinedSizes.base64, false)}`);
  console.log(`Estimated final HTML:  ${formatBytes(combinedSizes.estimatedFinal)}`);

  console.log('\n' + colors.dim + 'Estimated inscription costs:' + colors.reset);
  const costs = estimateCost(combinedSizes.estimatedFinal);
  costs.forEach(c => {
    console.log(`  ${c.rateStr.padEnd(12)} ${c.sats.toLocaleString().padStart(10)} sats`);
  });

  // Size recommendations
  console.log('\n' + colors.dim + 'Size guide:' + colors.reset);
  console.log(`  ${colors.green}< 50 KB${colors.reset}   Excellent - very affordable inscription`);
  console.log(`  ${colors.yellow}< 100 KB${colors.reset}  Good - reasonable inscription cost`);
  console.log(`  ${colors.red}> 100 KB${colors.reset}  Large - consider optimizing your code`);
}

// Main function
function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    console.log(`
OCM Dimensions - Size Calculator

Calculate compression sizes and inscription cost estimates.

Usage:
  node tools/size-calc.js <file>
  node tools/size-calc.js <file1> <file2> ...
  node tools/size-calc.js --dir=<directory>

Options:
  --dir=<path>    Calculate for all files in directory
  --json          Output as JSON
  --help          Show this help message

Examples:
  node tools/size-calc.js my-sketch.js
  node tools/size-calc.js --dir=tools/threejs/compressed-inputs
  node tools/size-calc.js src/main.js src/helpers.js --json
`);
    process.exit(0);
  }

  let files = args.files;

  // Handle directory option
  if (args.dir) {
    if (!fs.existsSync(args.dir)) {
      console.error(`Error: Directory not found: ${args.dir}`);
      process.exit(1);
    }
    files = readDirectory(args.dir);
  }

  // Validate files
  if (files.length === 0) {
    console.error('Error: No files specified');
    console.error('Run with --help for usage information');
    process.exit(1);
  }

  // Check all files exist
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.error(`Error: File not found: ${file}`);
      process.exit(1);
    }
  }

  // Calculate and print report
  if (files.length === 1) {
    const content = fs.readFileSync(files[0], 'utf8');
    const sizes = calculateSizes(content);
    if (args.json) {
      console.log(JSON.stringify(printReport(files[0], sizes, true), null, 2));
    } else {
      printReport(files[0], sizes);
    }
  } else {
    if (args.json) {
      console.log(JSON.stringify(printCombinedReport(files, true), null, 2));
    } else {
      printCombinedReport(files);
    }
  }

  console.log('');
}

main();
