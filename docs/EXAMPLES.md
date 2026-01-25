# OCM Dimensions Examples

Real code examples to help you get started quickly.

## Table of Contents

1. [Three.js Examples](#threejs-examples)
2. [p5.js Examples](#p5js-examples)
3. [HTML Compression Examples](#html-compression-examples)
4. [Advanced Patterns](#advanced-patterns)

---

## Three.js Examples

### Basic Rotating Cube

The simplest Three.js example - a colored cube rotating in 3D space.

**File: `tools/threejs/compressed-inputs/02_main.min.js`**

```javascript
function ocmCallback() {
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);

  // Create camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('scene').appendChild(renderer.domElement);

  // Create cube
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff88 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Add light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
```

**Build and test:**
```bash
npm run build:threejs:local
open tools/threejs/index.local.html
```

---

### Particle System

A more complex example with animated particles.

```javascript
function ocmCallback() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('scene').appendChild(renderer.domElement);

  // Create particles
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

    colors[i * 3] = Math.random();
    colors[i * 3 + 1] = Math.random();
    colors[i * 3 + 2] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  function animate() {
    requestAnimationFrame(animate);
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;
    renderer.render(scene, camera);
  }
  animate();
}
```

---

### Generative Sphere

A sphere with vertex displacement for organic movement.

```javascript
function ocmCallback() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('scene').appendChild(renderer.domElement);

  // Create sphere with more segments for smooth deformation
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshNormalMaterial({ wireframe: true });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  const originalPositions = geometry.attributes.position.array.slice();
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.02;

    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i + 1];
      const z = originalPositions[i + 2];

      const noise = Math.sin(x * 3 + time) * Math.sin(y * 3 + time) * Math.sin(z * 3 + time) * 0.1;
      const length = Math.sqrt(x * x + y * y + z * z);
      const scale = (1 + noise) / length;

      positions[i] = x * scale;
      positions[i + 1] = y * scale;
      positions[i + 2] = z * scale;
    }
    geometry.attributes.position.needsUpdate = true;

    sphere.rotation.y += 0.005;
    renderer.render(scene, camera);
  }
  animate();
}
```

---

## p5.js Examples

### Basic Sketch

A simple animated circle pattern.

**File: `tools/p5js/input/02_main.js`**

```javascript
function fflateCallback2() {
  // Decompress and execute p5.js
  const p5Code = fflate.strFromU8(
    fflate.gunzipSync(
      new Uint8Array(Array.from(atob(d3)).map(c => c.charCodeAt(0)))
    )
  );
  eval(p5Code);

  // Your sketch
  new p5(function(p) {
    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);
    };

    p.draw = function() {
      p.background(0, 0, 10, 10);

      const centerX = p.width / 2;
      const centerY = p.height / 2;

      for (let i = 0; i < 50; i++) {
        const angle = p.frameCount * 0.02 + i * 0.2;
        const radius = 100 + i * 5;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        p.noStroke();
        p.fill((i * 7 + p.frameCount) % 360, 80, 90, 50);
        p.circle(x, y, 20 + i * 0.5);
      }
    };

    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  });
}
```

**Build and test:**
```bash
npm run build:p5js:local
open tools/p5js/index.local.html
```

---

### Generative Art Pattern

A more complex generative pattern using noise.

```javascript
function fflateCallback2() {
  const p5Code = fflate.strFromU8(
    fflate.gunzipSync(
      new Uint8Array(Array.from(atob(d3)).map(c => c.charCodeAt(0)))
    )
  );
  eval(p5Code);

  new p5(function(p) {
    let cols, rows;
    const scale = 20;
    let zoff = 0;

    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight);
      cols = p.floor(p.width / scale);
      rows = p.floor(p.height / scale);
      p.colorMode(p.HSB, 360, 100, 100);
    };

    p.draw = function() {
      p.background(0);

      let yoff = 0;
      for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
          const angle = p.noise(xoff, yoff, zoff) * p.TWO_PI * 2;
          const hue = (p.noise(xoff, yoff, zoff + 100) * 360 + p.frameCount) % 360;

          p.push();
          p.translate(x * scale + scale / 2, y * scale + scale / 2);
          p.rotate(angle);
          p.stroke(hue, 80, 90);
          p.strokeWeight(2);
          p.line(0, 0, scale * 0.8, 0);
          p.pop();

          xoff += 0.1;
        }
        yoff += 0.1;
      }
      zoff += 0.005;
    };
  });
}
```

---

### Interactive Sketch

A sketch that responds to mouse movement.

```javascript
function fflateCallback2() {
  const p5Code = fflate.strFromU8(
    fflate.gunzipSync(
      new Uint8Array(Array.from(atob(d3)).map(c => c.charCodeAt(0)))
    )
  );
  eval(p5Code);

  new p5(function(p) {
    const particles = [];
    const maxParticles = 200;

    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.colorMode(p.HSB, 360, 100, 100, 100);
    };

    p.draw = function() {
      p.background(0, 0, 5, 20);

      // Add particle at mouse
      if (p.frameCount % 2 === 0 && particles.length < maxParticles) {
        particles.push({
          x: p.mouseX,
          y: p.mouseY,
          vx: p.random(-2, 2),
          vy: p.random(-2, 2),
          size: p.random(5, 15),
          hue: p.random(360),
          life: 255
        });
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 2;

        if (pt.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.noStroke();
        p.fill(pt.hue, 80, 90, pt.life / 255 * 100);
        p.circle(pt.x, pt.y, pt.size);
      }
    };
  });
}
```

---

## HTML Compression Examples

### Simple HTML Page

Compress a complete HTML page with inline CSS and JavaScript.

**File: `tools/compress-html/input/my-page.html`**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      background: #1a1a2e;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: system-ui;
    }
    .container {
      text-align: center;
      color: white;
    }
    h1 {
      font-size: 4rem;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello, Bitcoin!</h1>
    <p>This page lives forever on-chain.</p>
  </div>
  <script>
    console.log('Inscribed at:', new Date().toISOString());
  </script>
</body>
</html>
```

**Build:**
```bash
npm run build:compress-html:local
open tools/compress-html/index.local.html
```

---

### Canvas Animation

A self-contained HTML page with canvas animation.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 1
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#4ecdc4';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();
  </script>
</body>
</html>
```

---

## Advanced Patterns

### Using Hash for Randomness

Use the inscription ID or transaction hash for deterministic randomness.

```javascript
function ocmCallback() {
  // Get inscription ID from URL for randomness seed
  const url = window.location.pathname;
  const inscriptionId = url.split('/').pop() || 'default';

  // Simple hash function
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  // Seeded random number generator
  function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  const seed = hashCode(inscriptionId);
  let randomIndex = seed;

  function random(min = 0, max = 1) {
    return min + seededRandom(randomIndex++) * (max - min);
  }

  // Now use random() for deterministic, reproducible randomness
  const color1 = `hsl(${random(0, 360)}, 80%, 60%)`;
  const color2 = `hsl(${random(0, 360)}, 80%, 60%)`;

  // ... rest of your artwork
}
```

---

### Responsive Canvas

Ensure your artwork looks good on any screen size.

```javascript
function ocmCallback() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  const container = document.getElementById('scene');
  container.appendChild(renderer.domElement);

  function updateSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
  }

  updateSize();
  window.addEventListener('resize', updateSize);

  // Your artwork code here...
}
```

---

### Minimal Size Tips

Keep your inscription as small as possible.

```javascript
// BEFORE (verbose)
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize);

// AFTER (minimal)
onresize=_=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
};

// Tips:
// - Use single-letter variable names: a,b,c instead of width,height,depth
// - Remove 'window.' prefix (innerWidth instead of window.innerWidth)
// - Use arrow functions: _=>{} instead of function(){}
// - Remove semicolons (optional in most cases)
// - Remove unnecessary whitespace
// - Use onresize= instead of addEventListener('resize',...)
```

---

### Check Your Size

Always check size before inscribing:

```bash
# Quick check
node tools/size-calc.js my-code.js

# Check after minification
npx terser my-code.js -c -m -o my-code.min.js
node tools/size-calc.js my-code.min.js
```

---

## File Size Guidelines

| Size | Rating | Typical Fee (10 sat/vB) |
|------|--------|------------------------|
| < 5 KB | Excellent | ~$1-2 |
| 5-20 KB | Good | ~$2-10 |
| 20-50 KB | Moderate | ~$10-25 |
| 50-100 KB | Large | ~$25-50 |
| > 100 KB | Very Large | ~$50+ |

*Fees vary based on Bitcoin network conditions and BTC price.*

---

## Need More Examples?

- Check `tools/threejs/02_main.js` for the included Three.js example
- Check `tools/p5js/input/` for p5.js examples
- Check `tools/compress-html/examples/` for HTML compression examples
- Browse existing inscriptions on ordinals.com for inspiration
