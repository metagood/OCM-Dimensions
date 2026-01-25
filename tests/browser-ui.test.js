const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const BROWSER_UI_PATH = path.join(ROOT_DIR, 'tools', 'browserUI', 'index.html');

describe('Browser UI (tools/browserUI/index.html)', () => {
  let content;

  it('should exist', () => {
    assert.ok(fs.existsSync(BROWSER_UI_PATH), 'Browser UI file should exist');
    content = fs.readFileSync(BROWSER_UI_PATH, 'utf8');
  });

  describe('Size Preview Section', () => {
    it('should have size preview container', () => {
      assert.ok(content.includes('id="sizePreview"'), 'Should have sizePreview element');
    });

    it('should have original size display', () => {
      assert.ok(content.includes('id="originalSize"'), 'Should have originalSize element');
    });

    it('should have compressed size display', () => {
      assert.ok(content.includes('id="compressedSize"'), 'Should have compressedSize element');
    });

    it('should have base64 size display', () => {
      assert.ok(content.includes('id="base64Size"'), 'Should have base64Size element');
    });

    it('should have final size display', () => {
      assert.ok(content.includes('id="finalSize"'), 'Should have finalSize element');
    });

    it('should have size indicator', () => {
      assert.ok(content.includes('id="sizeIndicator"'), 'Should have sizeIndicator element');
    });
  });

  describe('Cost Preview Section', () => {
    it('should have cost preview container', () => {
      assert.ok(content.includes('id="costPreview"'), 'Should have costPreview element');
    });

    it('should have fee rate displays', () => {
      assert.ok(content.includes('id="cost1"'), 'Should have 1 sat/vB cost');
      assert.ok(content.includes('id="cost5"'), 'Should have 5 sat/vB cost');
      assert.ok(content.includes('id="cost10"'), 'Should have 10 sat/vB cost');
      assert.ok(content.includes('id="cost20"'), 'Should have 20 sat/vB cost');
    });
  });

  describe('Error Handling', () => {
    it('should have error display container', () => {
      assert.ok(content.includes('id="errorDisplay"'), 'Should have errorDisplay element');
    });

    it('should have error message element', () => {
      assert.ok(content.includes('id="errorMessage"'), 'Should have errorMessage element');
    });

    it('should have showError function', () => {
      assert.ok(content.includes('function showError'), 'Should have showError function');
    });

    it('should have hideError function', () => {
      assert.ok(content.includes('function hideError'), 'Should have hideError function');
    });
  });

  describe('Size Calculation Functions', () => {
    it('should have formatBytes function', () => {
      assert.ok(content.includes('function formatBytes'), 'Should have formatBytes function');
    });

    it('should have formatSats function', () => {
      assert.ok(content.includes('function formatSats'), 'Should have formatSats function');
    });

    it('should have calculateSizes function', () => {
      assert.ok(content.includes('function calculateSizes'), 'Should have calculateSizes function');
    });

    it('should have estimateCost function', () => {
      assert.ok(content.includes('function estimateCost'), 'Should have estimateCost function');
    });

    it('should have updateSizePreview function', () => {
      assert.ok(content.includes('function updateSizePreview'), 'Should have updateSizePreview function');
    });
  });

  describe('Real-time Updates', () => {
    it('should have debounce for text input', () => {
      assert.ok(content.includes('debounceTimer'), 'Should have debounce timer');
      assert.ok(content.includes('setTimeout'), 'Should use setTimeout for debounce');
    });

    it('should listen to inputText changes', () => {
      assert.ok(
        content.includes("getElementById('inputText').addEventListener"),
        'Should listen to inputText events'
      );
    });

    it('should listen to fileInput changes', () => {
      assert.ok(
        content.includes("getElementById('fileInput').addEventListener"),
        'Should listen to fileInput events'
      );
    });
  });

  describe('Size Thresholds', () => {
    it('should define SIZE_THRESHOLDS', () => {
      assert.ok(content.includes('SIZE_THRESHOLDS'), 'Should have SIZE_THRESHOLDS');
    });

    it('should have good threshold (50KB)', () => {
      assert.ok(content.includes('50 * 1024'), 'Should have 50KB threshold');
    });

    it('should have warning threshold (100KB)', () => {
      assert.ok(content.includes('100 * 1024'), 'Should have 100KB threshold');
    });
  });

  describe('Size Indicator Classes', () => {
    it('should have good class styling', () => {
      assert.ok(content.includes('.size-indicator.good'), 'Should have .good class');
    });

    it('should have warning class styling', () => {
      assert.ok(content.includes('.size-indicator.warning'), 'Should have .warning class');
    });

    it('should have danger class styling', () => {
      assert.ok(content.includes('.size-indicator.danger'), 'Should have .danger class');
    });
  });

  describe('Compression', () => {
    it('should use fflate library', () => {
      assert.ok(content.includes('fflate'), 'Should reference fflate');
      assert.ok(content.includes('fflate.gzipSync'), 'Should use gzipSync');
    });

    it('should use compression level 6', () => {
      assert.ok(content.includes('level: 6'), 'Should use compression level 6');
    });
  });

  describe('Inscribed Libraries', () => {
    it('should have inscribedLibraries object', () => {
      assert.ok(content.includes('inscribedLibraries'), 'Should have inscribedLibraries');
    });

    it('should have fflate library', () => {
      assert.ok(content.includes("fflate:"), 'Should have fflate entry');
    });

    it('should have p5.js library', () => {
      assert.ok(content.includes("p5:"), 'Should have p5 entry');
    });

    it('should have Three.js library', () => {
      assert.ok(content.includes("threejs:"), 'Should have threejs entry');
    });

    it('should have correct inscription IDs', () => {
      // fflate ID
      assert.ok(
        content.includes('6bac7ab4ce8d5d32f202c2e31bba2b5476a18275802b4e0595c708760f9f56b5i0'),
        'Should have fflate inscription ID'
      );
      // p5.js ID
      assert.ok(
        content.includes('255ce0c5a0d8aca39510da72e604ef8837519028827ba7b7f723b7489f3ec3a4i0'),
        'Should have p5.js inscription ID'
      );
      // Three.js/OCM Dimensions ID
      assert.ok(
        content.includes('2dbdf9ebbec6be793fd16ae9b797c7cf968ab2427166aaf390b90b71778266abi0'),
        'Should have Three.js inscription ID'
      );
    });
  });

  describe('Input validation', () => {
    it('should validate empty text input', () => {
      assert.ok(
        content.includes('Please enter some code'),
        'Should validate empty text'
      );
    });

    it('should validate empty file input', () => {
      assert.ok(
        content.includes('Please select at least one file'),
        'Should validate empty files'
      );
    });
  });

  describe('External dependencies', () => {
    it('should load fflate from CDN', () => {
      assert.ok(content.includes('cdn.jsdelivr.net/npm/fflate'), 'Should load fflate from CDN');
    });

    it('should load Handlebars from CDN', () => {
      assert.ok(content.includes('handlebars'), 'Should load Handlebars');
    });
  });
});
