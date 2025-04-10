import * as THREE from 'three';
import { Character } from './Characters/Character.js';
import { Player } from './Characters/Player.js';
import { UI } from './Characters/UI.js';
import {Vector3} from "three";


// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Create clock
const clock = new THREE.Clock();

// Declare bounds
let bounds;

const player = new Player();
// Input handling
const mouse = new THREE.Vector2();
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};
window.addEventListener('keydown', (e) => {
  if (e.key in keys) keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
  if (e.key in keys) keys[e.key] = false;
});
window.addEventListener('mousemove', (event) => {
  // Convert screen coordinates to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Setup our scene
function init() {

  scene.background = new THREE.Color(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.y = 25;
  camera.lookAt(0,0,0);

  // Create Light
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0, 5, 5);
  scene.add(directionalLight);

  // Initialize bounds
  bounds = new THREE.Box3(
    new THREE.Vector3(-20,0,-20), // scene min
    new THREE.Vector3(20,0,20) // scene max
  );

  scene.add(player.gameObject)

  // First call to animate
  animate();
}


// animate loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // Change in time
  let deltaTime = clock.getDelta();

  player.update(keys, mouse, camera, deltaTime, bounds);
}

init();