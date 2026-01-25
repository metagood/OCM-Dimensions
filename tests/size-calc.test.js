const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SIZE_CALC = path.join(ROOT_DIR, 'tools', 'size-calc.js');
const TEST_DIR = path.join(__dirname, 'fixtures');

// Helper to run size-calc and capture output
function runSizeCalc(args = '') {
  try {
    const output = execSync(`node ${SIZE_CALC} ${args}`, {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { success: true, output, error: null };
  } catch (e) {
    return { success: false, output: e.stdout || '', error: e.stderr || e.message };
  }
}

describe('size-calc.js', () => {
  before(() => {
    // Create test fixtures directory
    if (!fs.existsSync(TEST_DIR)) {
      fs.mkdirSync(TEST_DIR, { recursive: true });
    }
    // Create test files
    fs.writeFileSync(path.join(TEST_DIR, 'small.js'), 'console.log("hello");');
    fs.writeFileSync(path.join(TEST_DIR, 'medium.js'), 'x'.repeat(10000));
    fs.writeFileSync(path.join(TEST_DIR, 'large.js'), 'y'.repeat(100000));
  });

  after(() => {
    // Clean up test fixtures
    if (fs.existsSync(TEST_DIR)) {
      fs.rmSync(TEST_DIR, { recursive: true });
    }
  });

  describe('--help flag', () => {
    it('should display help message', () => {
      const result = runSizeCalc('--help');
      assert.ok(result.success, 'Help command should succeed');
      assert.ok(result.output.includes('Usage:'), 'Should show usage');
      assert.ok(result.output.includes('--dir'), 'Should mention --dir option');
      assert.ok(result.output.includes('--json'), 'Should mention --json option');
    });
  });

  describe('missing file', () => {
    it('should error when no file specified', () => {
      const result = runSizeCalc('');
      assert.ok(!result.success, 'Should fail without file');
      assert.ok(result.error.includes('No files specified'), 'Should mention no files');
    });

    it('should error for non-existent file', () => {
      const result = runSizeCalc('nonexistent.js');
      assert.ok(!result.success, 'Should fail with missing file');
      assert.ok(result.error.includes('not found'), 'Should mention file not found');
    });
  });

  describe('single file analysis', () => {
    it('should analyze a single file', () => {
      const result = runSizeCalc(path.join(TEST_DIR, 'small.js'));
      assert.ok(result.success, `Should succeed: ${result.error}`);
      assert.ok(result.output.includes('Original size:'), 'Should show original size');
      assert.ok(result.output.includes('Compressed'), 'Should show compressed size');
      assert.ok(result.output.includes('Base64'), 'Should show base64 size');
      assert.ok(result.output.includes('Estimated final HTML'), 'Should show final size');
    });

    it('should show compression ratio', () => {
      const result = runSizeCalc(path.join(TEST_DIR, 'medium.js'));
      assert.ok(result.success, `Should succeed: ${result.error}`);
      assert.ok(result.output.includes('% reduction'), 'Should show compression ratio');
    });

    it('should show cost estimates', () => {
      const result = runSizeCalc(path.join(TEST_DIR, 'small.js'));
      assert.ok(result.output.includes('inscription costs'), 'Should show costs header');
      assert.ok(result.output.includes('sat/vB'), 'Should show fee rates');
      assert.ok(result.output.includes('sats'), 'Should show sats');
    });
  });

  describe('multiple files', () => {
    it('should analyze multiple files combined', () => {
      const file1 = path.join(TEST_DIR, 'small.js');
      const file2 = path.join(TEST_DIR, 'medium.js');
      const result = runSizeCalc(`${file1} ${file2}`);
      assert.ok(result.success, `Should succeed: ${result.error}`);
      assert.ok(result.output.includes('COMBINED TOTAL'), 'Should show combined total');
    });
  });

  describe('--dir option', () => {
    it('should analyze all files in directory', () => {
      const result = runSizeCalc(`--dir=${TEST_DIR}`);
      assert.ok(result.success, `Should succeed: ${result.error}`);
      assert.ok(result.output.includes('COMBINED TOTAL'), 'Should show combined total');
      assert.ok(result.output.includes('small.js'), 'Should list small.js');
      assert.ok(result.output.includes('medium.js'), 'Should list medium.js');
    });

    it('should error for non-existent directory', () => {
      const result = runSizeCalc('--dir=/nonexistent/path');
      assert.ok(!result.success, 'Should fail with missing directory');
      assert.ok(result.error.includes('not found'), 'Should mention directory not found');
    });
  });

  describe('--json option', () => {
    it('should output valid JSON for single file', () => {
      const result = runSizeCalc(`${path.join(TEST_DIR, 'small.js')} --json`);
      assert.ok(result.success, `Should succeed: ${result.error}`);

      let json;
      assert.doesNotThrow(() => {
        json = JSON.parse(result.output);
      }, 'Output should be valid JSON');

      assert.ok(json.file, 'JSON should have file property');
      assert.ok(typeof json.original === 'number', 'JSON should have original size');
      assert.ok(typeof json.compressed === 'number', 'JSON should have compressed size');
      assert.ok(typeof json.base64 === 'number', 'JSON should have base64 size');
      assert.ok(Array.isArray(json.costs), 'JSON should have costs array');
    });

    it('should output valid JSON for multiple files', () => {
      const file1 = path.join(TEST_DIR, 'small.js');
      const file2 = path.join(TEST_DIR, 'medium.js');
      const result = runSizeCalc(`${file1} ${file2} --json`);
      assert.ok(result.success, `Should succeed: ${result.error}`);

      let json;
      assert.doesNotThrow(() => {
        json = JSON.parse(result.output);
      }, 'Output should be valid JSON');

      assert.ok(Array.isArray(json.files), 'JSON should have files array');
      assert.ok(json.combined, 'JSON should have combined property');
    });
  });

  describe('size indicators', () => {
    it('should show green for small files', () => {
      const result = runSizeCalc(path.join(TEST_DIR, 'small.js'));
      // Check for ANSI green color code or "Excellent" message
      assert.ok(
        result.output.includes('\x1b[32m') || result.output.includes('< 50 KB'),
        'Should indicate good size'
      );
    });
  });

  describe('real project files', () => {
    it('should analyze tools/threejs/02_main.js', () => {
      const result = runSizeCalc('tools/threejs/02_main.js');
      assert.ok(result.success, `Should succeed: ${result.error}`);
      assert.ok(result.output.includes('Original size:'), 'Should show size info');
    });

    it('should analyze compressed-inputs directory', () => {
      const result = runSizeCalc('--dir=tools/threejs/compressed-inputs');
      assert.ok(result.success, `Should succeed: ${result.error}`);
    });
  });
});
