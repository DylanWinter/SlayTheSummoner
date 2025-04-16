import * as THREE from 'three';
import { Player } from './Characters/Player.js';
import {LevelManager} from "./World/LevelManager";

// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
// Create clock
const clock = new THREE.Clock();
// Create map
let levelManager;

// Create player
let player = new Player();

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
window.addEventListener('click', () => {player.fire(scene, levelManager.gameMap.projectiles)});

// Set up our scene
function init() {

  scene.background = new THREE.Color(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.y = 40;
  camera.lookAt(player.gameObject.position);

  // Create Light
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0, 5, 5);
  scene.add(directionalLight);

  levelManager = new LevelManager(scene);

  player.location.set(10, 0, 10);
  player.gameObject.position.copy(player.location); // Update visual position

  scene.add(player.gameObject)

  // First call to animate
  loadNextLevel();
  animate();
}

function loadNextLevel() {
  levelManager.gameMap.projectiles.forEach((projectile) => {scene.remove(projectile.gameObject);});
  levelManager.gameMap.projectiles = [];
  levelManager.gameMap.enemies.forEach(enemy => {scene.remove(enemy.gameObject);});
  levelManager.gameMap.enemies = [];
  levelManager.gameMap.items.forEach(item => {scene.remove(item.gameObject);});
  levelManager.gameMap.items = [];
  player.hasFoundExit = false;
  levelManager.loadNextLevel();
  if (!levelManager.gameMap.quantize(player.location).isTraversable()) {
    let newNode = levelManager.gameMap.mapGraph.getRandomGroundNode();
    player.location = levelManager.gameMap.localize(newNode);
  }
  levelManager.instantiateEnemies();
  levelManager.instantiateItems();
  levelManager.incrementNextLevel();
}


// animate loop
function animate() {

  // Load next level when exit is found
  if (player.hasFoundExit) {
    loadNextLevel();
  }

  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // Change in time
  let deltaTime = clock.getDelta();

  // Update player based on input
  player.update(keys, mouse, camera, deltaTime, levelManager.gameMap);
  
  // Update projectiles
  levelManager.gameMap.projectiles.forEach((projectile) => {
    projectile.update(deltaTime, levelManager.gameMap, levelManager.gameMap.enemies, player);
    if (!projectile.isAlive) {
      scene.remove(projectile.gameObject);
    }
  });
  levelManager.gameMap.projectiles = levelManager.gameMap.projectiles.filter(projectile => projectile.isAlive);

  // Update enemies
  levelManager.gameMap.enemies.forEach((enemy) => {
    enemy.update(deltaTime, player, levelManager.gameMap);
  })
  levelManager.gameMap.enemies = levelManager.gameMap.enemies.filter(enemy => enemy.isAlive);

  // Update pickups
  levelManager.gameMap.items.forEach((item) => {
    item.update(deltaTime, player, levelManager.gameMap);
  })
  levelManager.gameMap.item = levelManager.gameMap.items.filter(enemy => enemy.isAlive);


  // Move camera
  camera.position.x = player.gameObject.position.x;
  camera.position.z = player.gameObject.position.z;


}

init();