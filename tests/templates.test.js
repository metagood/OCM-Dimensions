const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT_DIR, 'tools');

describe('page-structure.html templates', () => {
  describe('threejs template', () => {
    const templatePath = path.join(TOOLS_DIR, 'threejs', 'page-structure.html');
    let template;

    it('should exist', () => {
      assert.ok(fs.existsSync(templatePath), 'Template file should exist');
      template = fs.readFileSync(templatePath, 'utf8');
    });

    it('should have OCM_DIMENSIONS_ID placeholder', () => {
      assert.ok(template.includes('{{OCM_DIMENSIONS_ID}}'), 'Should have OCM_DIMENSIONS_ID placeholder');
    });

    it('should have FFLATE_LINE placeholder', () => {
      assert.ok(template.includes('{{FFLATE_LINE}}'), 'Should have FFLATE_LINE placeholder');
    });

    it('should have THREEJS_LINE placeholder', () => {
      assert.ok(template.includes('{{THREEJS_LINE}}'), 'Should have THREEJS_LINE placeholder');
    });

    it('should have SRC_COMPRESSED_STRING placeholder', () => {
      assert.ok(template.includes('SRC_COMPRESSED_STRING'), 'Should have SRC_COMPRESSED_STRING placeholder');
    });

    it('should have debug mode initialization', () => {
      assert.ok(template.includes('_dbg'), 'Should have _dbg variable');
      assert.ok(template.includes('URLSearchParams'), 'Should check URLSearchParams');
      assert.ok(template.includes("'debug'"), 'Should check for debug param');
    });

    it('should have debug logging function', () => {
      assert.ok(template.includes('_log'), 'Should have _log function');
      assert.ok(template.includes('[OCM]'), 'Should use [OCM] prefix');
    });

    it('should have error handling', () => {
      assert.ok(template.includes('try{'), 'Should have try block');
      assert.ok(template.includes('catch'), 'Should have catch block');
      assert.ok(template.includes('console.error'), 'Should log errors');
    });

    it('should have user-friendly error display', () => {
      assert.ok(template.includes('Error loading inscription'), 'Should show user-friendly error');
      assert.ok(template.includes('color:red'), 'Should style error in red');
    });

    it('should be valid HTML structure', () => {
      assert.ok(template.includes('<html>'), 'Should have html tag');
      assert.ok(template.includes('<head>'), 'Should have head tag');
      assert.ok(template.includes('<body>'), 'Should have body tag');
      assert.ok(template.includes('</html>'), 'Should close html tag');
    });
  });

  describe('p5js template', () => {
    const templatePath = path.join(TOOLS_DIR, 'p5js', 'page-structure.html');
    let template;

    it('should exist', () => {
      assert.ok(fs.existsSync(templatePath), 'Template file should exist');
      template = fs.readFileSync(templatePath, 'utf8');
    });

    it('should have OCM_DIMENSIONS_ID placeholder', () => {
      assert.ok(template.includes('{{OCM_DIMENSIONS_ID}}'), 'Should have OCM_DIMENSIONS_ID placeholder');
    });

    it('should have P5JS_ID placeholder', () => {
      assert.ok(template.includes('{{P5JS_ID}}'), 'Should have P5JS_ID placeholder');
    });

    it('should have FFLATE_LINE placeholder', () => {
      assert.ok(template.includes('{{FFLATE_LINE}}'), 'Should have FFLATE_LINE placeholder');
    });

    it('should have debug mode', () => {
      assert.ok(template.includes('_dbg'), 'Should have _dbg variable');
      assert.ok(template.includes('_log'), 'Should have _log function');
    });

    it('should fetch p5.js library', () => {
      assert.ok(template.includes('p5r=await fetch'), 'Should fetch p5.js');
    });
  });

  describe('compress-html template', () => {
    const templatePath = path.join(TOOLS_DIR, 'compress-html', 'page-structure.html');
    let template;

    it('should exist', () => {
      assert.ok(fs.existsSync(templatePath), 'Template file should exist');
      template = fs.readFileSync(templatePath, 'utf8');
    });

    it('should have OCM_DIMENSIONS_ID placeholder', () => {
      assert.ok(template.includes('{{OCM_DIMENSIONS_ID}}'), 'Should have OCM_DIMENSIONS_ID placeholder');
    });

    it('should have FFLATE_LINE placeholder', () => {
      assert.ok(template.includes('{{FFLATE_LINE}}'), 'Should have FFLATE_LINE placeholder');
    });

    it('should have debug mode', () => {
      assert.ok(template.includes('_dbg'), 'Should have _dbg variable');
      assert.ok(template.includes('_log'), 'Should have _log function');
    });

    it('should extract and execute scripts', () => {
      assert.ok(template.includes('matchAll'), 'Should use matchAll for scripts');
      assert.ok(template.includes('<script'), 'Should match script tags');
    });

    it('should replace document body', () => {
      assert.ok(template.includes('document.body.innerHTML'), 'Should replace body innerHTML');
    });
  });
});

describe('inscriptions.json', () => {
  const configPath = path.join(TOOLS_DIR, 'inscriptions.json');
  let config;

  it('should exist', () => {
    assert.ok(fs.existsSync(configPath), 'Config file should exist');
  });

  it('should be valid JSON', () => {
    assert.doesNotThrow(() => {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }, 'Should be valid JSON');
  });

  it('should have inscriptions object', () => {
    assert.ok(config.inscriptions, 'Should have inscriptions object');
  });

  it('should have ocm-dimensions inscription', () => {
    const ocm = config.inscriptions['ocm-dimensions'];
    assert.ok(ocm, 'Should have ocm-dimensions');
    assert.ok(ocm.id, 'Should have id');
    assert.ok(ocm.lines, 'Should have lines');
    assert.strictEqual(ocm.lines.fflate, 28, 'fflate should be line 28');
    assert.strictEqual(ocm.lines.threejs, 32, 'threejs should be line 32');
  });

  it('should have fflate inscription', () => {
    const fflate = config.inscriptions['fflate'];
    assert.ok(fflate, 'Should have fflate');
    assert.ok(fflate.id, 'Should have id');
  });

  it('should have p5js inscription', () => {
    const p5js = config.inscriptions['p5js'];
    assert.ok(p5js, 'Should have p5js');
    assert.ok(p5js.id, 'Should have id');
  });

  it('should have workflows object', () => {
    assert.ok(config.workflows, 'Should have workflows object');
    assert.ok(config.workflows.threejs, 'Should have threejs workflow');
    assert.ok(config.workflows.p5js, 'Should have p5js workflow');
    assert.ok(config.workflows['compress-html'], 'Should have compress-html workflow');
  });

  it('should have valid inscription IDs (64 hex chars + i0)', () => {
    const idPattern = /^[a-f0-9]{64}i0$/;
    Object.values(config.inscriptions).forEach(inscription => {
      assert.ok(
        idPattern.test(inscription.id),
        `Invalid inscription ID format: ${inscription.id}`
      );
    });
  });
});

describe('build.js files', () => {
  const workflows = ['threejs', 'p5js', 'compress-html'];

  workflows.forEach(workflow => {
    describe(`${workflow}/build.js`, () => {
      const buildPath = path.join(TOOLS_DIR, workflow, 'build.js');
      let content;

      it('should exist', () => {
        assert.ok(fs.existsSync(buildPath), 'Build file should exist');
        content = fs.readFileSync(buildPath, 'utf8');
      });

      it('should require fs module', () => {
        assert.ok(content.includes("require('fs')"), 'Should require fs');
      });

      it('should require path module', () => {
        assert.ok(content.includes("require('path')"), 'Should require path');
      });

      it('should load inscriptions.json', () => {
        assert.ok(content.includes('inscriptions.json'), 'Should reference inscriptions.json');
      });

      it('should support --base-url flag', () => {
        assert.ok(content.includes('--base-url'), 'Should check for --base-url');
        assert.ok(content.includes('baseUrl'), 'Should have baseUrl variable');
      });

      it('should replace OCM_DIMENSIONS_ID placeholder', () => {
        assert.ok(content.includes('OCM_DIMENSIONS_ID'), 'Should replace OCM_DIMENSIONS_ID');
      });

      it('should replace FFLATE_LINE placeholder', () => {
        assert.ok(content.includes('FFLATE_LINE'), 'Should replace FFLATE_LINE');
      });

      it('should replace SRC_COMPRESSED_STRING', () => {
        assert.ok(content.includes('SRC_COMPRESSED_STRING'), 'Should replace SRC_COMPRESSED_STRING');
      });
    });
  });
});
