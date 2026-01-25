const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');

// Helper to run command
function run(cmd, cwd = ROOT_DIR) {
  return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

describe('Integration Tests', () => {
  describe('Makefile builds', () => {
    const workflows = ['threejs', 'p5js', 'compress-html'];

    workflows.forEach(workflow => {
      describe(`${workflow} Makefile`, () => {
        const workflowDir = path.join(TOOLS_DIR, workflow);
        const indexHtml = path.join(workflowDir, 'index.html');
        const indexLocalHtml = path.join(workflowDir, 'index.local.html');

        before(() => {
          // Clean and rebuild
          run('make clean && make', workflowDir);
        });

        it('should create index.html', () => {
          assert.ok(fs.existsSync(indexHtml), 'index.html should exist');
        });

        it('should create index.local.html', () => {
          assert.ok(fs.existsSync(indexLocalHtml), 'index.local.html should exist');
        });

        it('index.html should have relative paths', () => {
          const content = fs.readFileSync(indexHtml, 'utf8');
          assert.ok(content.includes('`/content/'), 'Should have relative /content/ paths');
          assert.ok(!content.includes('ordinals.com'), 'Should not have absolute URLs');
        });

        it('index.local.html should have absolute URLs', () => {
          const content = fs.readFileSync(indexLocalHtml, 'utf8');
          assert.ok(content.includes('ordinals.com'), 'Should have ordinals.com URLs');
        });
      });
    });
  });

  describe('build-cli.js vs Makefile consistency', () => {
    const workflows = ['threejs', 'p5js', 'compress-html'];

    workflows.forEach(workflow => {
      describe(`${workflow} consistency`, () => {
        it('should produce similar output size', () => {
          const workflowDir = path.join(TOOLS_DIR, workflow);

          // Build with Makefile
          run('make clean && make', workflowDir);
          const makefileOutput = fs.readFileSync(path.join(workflowDir, 'index.html'), 'utf8');

          // Build with CLI
          run(`node tools/build-cli.js --workflow=${workflow}`);
          const cliOutput = fs.readFileSync(path.join(workflowDir, 'index.html'), 'utf8');

          // Sizes should be within 5 bytes (minor differences from newlines/whitespace)
          const sizeDiff = Math.abs(makefileOutput.length - cliOutput.length);
          assert.ok(
            sizeDiff <= 5,
            `Output sizes should be similar (diff: ${sizeDiff} bytes)`
          );
        });

        it('should have same inscription IDs', () => {
          const workflowDir = path.join(TOOLS_DIR, workflow);
          const indexHtml = path.join(workflowDir, 'index.html');

          // Build with both methods
          run('make clean && make', workflowDir);
          const makefileContent = fs.readFileSync(indexHtml, 'utf8');

          run(`node tools/build-cli.js --workflow=${workflow}`);
          const cliContent = fs.readFileSync(indexHtml, 'utf8');

          // Extract inscription IDs
          const idPattern = /[a-f0-9]{64}i0/g;
          const makefileIds = makefileContent.match(idPattern) || [];
          const cliIds = cliContent.match(idPattern) || [];

          assert.deepStrictEqual(
            [...new Set(makefileIds)].sort(),
            [...new Set(cliIds)].sort(),
            'Inscription IDs should match'
          );
        });
      });
    });
  });

  describe('End-to-end workflow', () => {
    it('should complete full threejs workflow', () => {
      const workflowDir = path.join(TOOLS_DIR, 'threejs');

      // Clean
      run('make clean', workflowDir);
      assert.ok(!fs.existsSync(path.join(workflowDir, 'index.html')), 'Should be cleaned');

      // Build
      const output = run('node tools/build-cli.js --workflow=threejs');
      assert.ok(output.includes('SIZE REPORT'), 'Should show size report');

      // Verify output
      const indexHtml = path.join(workflowDir, 'index.html');
      assert.ok(fs.existsSync(indexHtml), 'Should create index.html');

      const content = fs.readFileSync(indexHtml, 'utf8');
      assert.ok(content.includes('<html>'), 'Should be valid HTML');
      assert.ok(content.includes('fflateCallback'), 'Should have fflate callback');
      assert.ok(content.includes('_dbg'), 'Should have debug mode');
    });

    it('should complete full p5js workflow with local testing', () => {
      const workflowDir = path.join(TOOLS_DIR, 'p5js');

      // Build for local testing
      run('node tools/build-cli.js --workflow=p5js --base-url=https://ordinals.com');

      // Verify
      const indexLocalHtml = path.join(workflowDir, 'index.local.html');
      assert.ok(fs.existsSync(indexLocalHtml), 'Should create index.local.html');

      const content = fs.readFileSync(indexLocalHtml, 'utf8');
      assert.ok(content.includes('https://ordinals.com'), 'Should have full URLs');
    });
  });

  describe('npm scripts', () => {
    it('npm run build:threejs should work', () => {
      const output = run('npm run build:threejs --silent');
      assert.ok(output.includes('Built:') || output.includes('SIZE REPORT'), 'Should complete build');
    });

    it('npm run size should show help', () => {
      const result = run('npm run size -- --help 2>&1 || true');
      assert.ok(
        result.includes('Usage') || result.includes('size-calc'),
        'Should show size-calc usage'
      );
    });
  });

  describe('Generated HTML validity', () => {
    const workflows = ['threejs', 'p5js', 'compress-html'];

    workflows.forEach(workflow => {
      it(`${workflow}/index.html should be valid HTML`, () => {
        run(`node tools/build-cli.js --workflow=${workflow}`);
        const indexHtml = path.join(TOOLS_DIR, workflow, 'index.html');
        const content = fs.readFileSync(indexHtml, 'utf8');

        // Basic HTML structure checks
        assert.ok(content.startsWith('<html>'), 'Should start with <html>');
        assert.ok(content.includes('</html>'), 'Should end with </html>');
        assert.ok(content.includes('<head>'), 'Should have head');
        assert.ok(content.includes('<body>'), 'Should have body');
        assert.ok(content.includes('<script>'), 'Should have script');

        // Should not have unresolved placeholders
        assert.ok(!content.includes('{{'), 'Should not have unresolved {{ placeholders');
        assert.ok(!content.includes('SRC_COMPRESSED_STRING'), 'Should not have SRC_COMPRESSED_STRING');
      });
    });
  });

  describe('Debug mode functionality', () => {
    it('should have debug mode code in generated HTML', () => {
      run('node tools/build-cli.js --workflow=threejs');
      const content = fs.readFileSync(path.join(TOOLS_DIR, 'threejs', 'index.html'), 'utf8');

      // Check debug infrastructure
      assert.ok(content.includes('_dbg=new URLSearchParams'), 'Should check URL params');
      assert.ok(content.includes(".has('debug')"), 'Should check for debug param');
      assert.ok(content.includes('if(_dbg)'), 'Should conditionally log');
      assert.ok(content.includes("'[OCM]'"), 'Should have OCM prefix');
    });
  });

  describe('Error handling in generated HTML', () => {
    it('should have try-catch blocks', () => {
      run('node tools/build-cli.js --workflow=threejs');
      const content = fs.readFileSync(path.join(TOOLS_DIR, 'threejs', 'index.html'), 'utf8');

      assert.ok(content.includes('try{'), 'Should have try block');
      assert.ok(content.includes('catch(e)'), 'Should have catch block');
      assert.ok(content.includes('console.error'), 'Should log errors');
    });

    it('should have user-friendly error messages', () => {
      run('node tools/build-cli.js --workflow=threejs');
      const content = fs.readFileSync(path.join(TOOLS_DIR, 'threejs', 'index.html'), 'utf8');

      assert.ok(content.includes('Error loading inscription'), 'Should have user message');
      assert.ok(content.includes('Check console'), 'Should point to console');
    });
  });
});
