const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const BUILD_CLI = path.join(ROOT_DIR, 'tools', 'build-cli.js');

// Helper to run build-cli and capture output
function runBuildCli(args = '') {
  try {
    const output = execSync(`node ${BUILD_CLI} ${args}`, {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { success: true, output, error: null };
  } catch (e) {
    return { success: false, output: e.stdout || '', error: e.stderr || e.message };
  }
}

describe('build-cli.js', () => {
  describe('--help flag', () => {
    it('should display help message', () => {
      const result = runBuildCli('--help');
      assert.ok(result.success, 'Help command should succeed');
      assert.ok(result.output.includes('Usage:'), 'Should show usage');
      assert.ok(result.output.includes('--workflow'), 'Should mention --workflow');
      assert.ok(result.output.includes('threejs'), 'Should list threejs workflow');
      assert.ok(result.output.includes('p5js'), 'Should list p5js workflow');
      assert.ok(result.output.includes('compress-html'), 'Should list compress-html workflow');
    });
  });

  describe('missing workflow', () => {
    it('should error when no workflow specified', () => {
      const result = runBuildCli('');
      assert.ok(!result.success, 'Should fail without workflow');
      assert.ok(result.error.includes('--workflow is required'), 'Should mention workflow required');
    });
  });

  describe('invalid workflow', () => {
    it('should error for unknown workflow', () => {
      const result = runBuildCli('--workflow=invalid');
      assert.ok(!result.success, 'Should fail with invalid workflow');
      assert.ok(result.error.includes('Invalid workflow'), 'Should mention invalid workflow');
    });
  });

  describe('threejs workflow', () => {
    const outputFile = path.join(ROOT_DIR, 'tools', 'threejs', 'index.html');

    before(() => {
      // Ensure src-compressed-string.base64 exists
      execSync('make src-compressed-string.base64', {
        cwd: path.join(ROOT_DIR, 'tools', 'threejs'),
        stdio: 'ignore'
      });
    });

    it('should build threejs workflow successfully', () => {
      const result = runBuildCli('--workflow=threejs');
      assert.ok(result.success, `Build should succeed: ${result.error}`);
      assert.ok(result.output.includes('Built:'), 'Should show built message');
      assert.ok(result.output.includes('SIZE REPORT'), 'Should show size report');
      assert.ok(fs.existsSync(outputFile), 'index.html should be created');
    });

    it('should include correct inscription ID', () => {
      const content = fs.readFileSync(outputFile, 'utf8');
      assert.ok(
        content.includes('2dbdf9ebbec6be793fd16ae9b797c7cf968ab2427166aaf390b90b71778266abi0'),
        'Should contain OCM Dimensions inscription ID'
      );
    });

    it('should include debug mode code', () => {
      const content = fs.readFileSync(outputFile, 'utf8');
      assert.ok(content.includes('_dbg'), 'Should contain debug flag');
      assert.ok(content.includes('URLSearchParams'), 'Should check URL params');
    });

    it('should show size statistics', () => {
      const result = runBuildCli('--workflow=threejs');
      assert.ok(result.output.includes('Original code size:'), 'Should show original size');
      assert.ok(result.output.includes('Compressed (gzip):'), 'Should show compressed size');
      assert.ok(result.output.includes('Base64 encoded:'), 'Should show base64 size');
      assert.ok(result.output.includes('Final HTML size:'), 'Should show final size');
    });

    it('should show inscription cost estimates', () => {
      const result = runBuildCli('--workflow=threejs');
      assert.ok(result.output.includes('ESTIMATED INSCRIPTION COSTS'), 'Should show costs header');
      assert.ok(result.output.includes('sat/vB'), 'Should show fee rates');
      assert.ok(result.output.includes('sats'), 'Should show sats');
    });
  });

  describe('threejs workflow with --base-url', () => {
    const outputFile = path.join(ROOT_DIR, 'tools', 'threejs', 'index.local.html');

    it('should build with base URL', () => {
      const result = runBuildCli('--workflow=threejs --base-url=https://ordinals.com');
      assert.ok(result.success, `Build should succeed: ${result.error}`);
      assert.ok(fs.existsSync(outputFile), 'index.local.html should be created');
    });

    it('should include base URL in fetch calls', () => {
      const content = fs.readFileSync(outputFile, 'utf8');
      assert.ok(
        content.includes('https://ordinals.com/content/'),
        'Should contain base URL in fetch'
      );
    });
  });

  describe('p5js workflow', () => {
    const outputFile = path.join(ROOT_DIR, 'tools', 'p5js', 'index.html');

    before(() => {
      execSync('make src-compressed-string.base64', {
        cwd: path.join(ROOT_DIR, 'tools', 'p5js'),
        stdio: 'ignore'
      });
    });

    it('should build p5js workflow successfully', () => {
      const result = runBuildCli('--workflow=p5js');
      assert.ok(result.success, `Build should succeed: ${result.error}`);
      assert.ok(fs.existsSync(outputFile), 'index.html should be created');
    });

    it('should include p5.js inscription ID', () => {
      const content = fs.readFileSync(outputFile, 'utf8');
      assert.ok(
        content.includes('255ce0c5a0d8aca39510da72e604ef8837519028827ba7b7f723b7489f3ec3a4i0'),
        'Should contain p5.js inscription ID'
      );
    });

    it('should include OCM Dimensions inscription ID', () => {
      const content = fs.readFileSync(outputFile, 'utf8');
      assert.ok(
        content.includes('2dbdf9ebbec6be793fd16ae9b797c7cf968ab2427166aaf390b90b71778266abi0'),
        'Should contain OCM Dimensions inscription ID'
      );
    });
  });

  describe('compress-html workflow', () => {
    const outputFile = path.join(ROOT_DIR, 'tools', 'compress-html', 'index.html');

    before(() => {
      execSync('make src-compressed-string.base64', {
        cwd: path.join(ROOT_DIR, 'tools', 'compress-html'),
        stdio: 'ignore'
      });
    });

    it('should build compress-html workflow successfully', () => {
      const result = runBuildCli('--workflow=compress-html');
      assert.ok(result.success, `Build should succeed: ${result.error}`);
      assert.ok(fs.existsSync(outputFile), 'index.html should be created');
    });
  });

  describe('custom output file', () => {
    const customOutput = path.join(ROOT_DIR, 'tools', 'threejs', 'custom-output.html');

    after(() => {
      if (fs.existsSync(customOutput)) {
        fs.unlinkSync(customOutput);
      }
    });

    it('should create file with custom name', () => {
      const result = runBuildCli(`--workflow=threejs --output=${customOutput}`);
      assert.ok(result.success, `Build should succeed: ${result.error}`);
      assert.ok(fs.existsSync(customOutput), 'Custom output file should be created');
    });
  });
});
