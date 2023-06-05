function ocmCallback() {
  const renderer = new THREE.WebGLRenderer({ antialias: !0 });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
  camera.position.set(0, 0.6, 50.5);

  const ambientLight = new THREE.AmbientLight(0x330066, 0.5);
  scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(1, 1, 1);
scene.add(light);

  const geometry = new THREE.TorusKnotGeometry(10, 2, 200, 20, 6, 8);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffaa, wireframe: false });
  const torusKnot = new THREE.Mesh(geometry, material); scene.add(torusKnot);

  scene.add(torusKnot);

function animate() {
  requestAnimationFrame( animate );

  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.01;

  renderer.render( scene, camera );
}

animate();

  document.querySelector("#scene").appendChild(renderer.domElement);
}
