import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// The #hero3d canvas lives inside partials/hero.html, injected async by
// include.js, so wait for it to exist before touching the DOM.
document.addEventListener('includes:loaded', () => {
  const canvas = document.getElementById('hero3d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!canvas || reducedMotion) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 9;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Core wireframe icosahedron
  const coreGeo = new THREE.IcosahedronGeometry(3, 1);
  const coreEdges = new THREE.EdgesGeometry(coreGeo);
  const coreMat = new THREE.LineBasicMaterial({ color: 0x38e0d8, transparent: true, opacity: 0.55 });
  const core = new THREE.LineSegments(coreEdges, coreMat);
  scene.add(core);

  // Glowing vertex points
  const pointsMat = new THREE.PointsMaterial({ color: 0x7c8cff, size: 0.085 });
  const points = new THREE.Points(coreGeo, pointsMat);
  scene.add(points);

  // Faint outer shell
  const outerGeo = new THREE.IcosahedronGeometry(4.5, 1);
  const outerEdges = new THREE.EdgesGeometry(outerGeo);
  const outerMat = new THREE.LineBasicMaterial({ color: 0x7c8cff, transparent: true, opacity: 0.12 });
  const outer = new THREE.LineSegments(outerEdges, outerMat);
  scene.add(outer);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  function animate() {
    requestAnimationFrame(animate);
    core.rotation.y += 0.0028;
    core.rotation.x += 0.0012;
    points.rotation.copy(core.rotation);
    outer.rotation.y -= 0.0009;
    outer.rotation.x -= 0.0006;

    camera.position.x += (mouseX * 1.3 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 1.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
});
