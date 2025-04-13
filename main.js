import * as THREE from 'three';
import { Player } from './Characters/Player.js';
import { UI } from './Characters/UI.js';
import {Vector3} from "three";
import { GameMap } from "./World/GameMap.js";
import { MapGraph } from "./World/MapGraph.js";
import { BaseEnemy } from './Characters/BaseEnemy.js';
import { ChasingEnemy } from './Characters/ChasingEnemy.js';
import { TurretEnemy } from './Characters/TurretEnemy.js';
import {LevelManager} from "./World/LevelManager";
import {MapNode} from "./World/MapNode";



// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
// Create clock
const clock = new THREE.Clock();
// Create map
let levelManager;

let enemies = [];
<<<<<<< HEAD
=======
let projectiles = [];
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196

let mapGraph;

// Create player
let player = new Player();

// Test NPC
let enemy;

// Declare the path to follow
let path;
let start;
let end;

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
<<<<<<< HEAD
window.addEventListener('click', () => {player.fire(scene, levelManager.gameMap.projectiles)});
=======
window.addEventListener('click', () => {player.fire(scene, projectiles)});
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196

// Set up our scene
function init() {

  scene.background = new THREE.Color(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

<<<<<<< HEAD
  camera.position.y = 55;
=======
  camera.position.y = 50;
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196
  camera.lookAt(player.gameObject.position);

  // Create Light
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0, 5, 5);
  scene.add(directionalLight);

<<<<<<< HEAD
  levelManager = new LevelManager(scene);
=======
  
  levelManager = new LevelManager(scene);
  

  player = new Player(gameMap);
  enemy = new TurretEnemy();
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196

  player.location.set(10, 0, 10);
  player.gameObject.position.copy(player.location); // Update visual position

  scene.add(player.gameObject)

  // First call to animate
  loadNextLevel();
  animate();
}

function loadNextLevel() {
<<<<<<< HEAD
  levelManager.gameMap.projectiles.forEach((projectile) => {scene.remove(projectile.gameObject);});
  levelManager.gameMap.projectiles = [];
=======
  projectiles.forEach((projectile) => {scene.remove(projectile.gameObject);});
  projectiles = [];
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196
  enemies.forEach(enemy => {scene.remove(enemy.gameObject);});
  enemies = [];
  player.hasFoundExit = false;
  levelManager.loadNextLevel();
  if (!levelManager.gameMap.quantize(player.location).isTraversable()) {
    let newNode = levelManager.gameMap.mapGraph.getRandomGroundNode();
    player.location = levelManager.gameMap.localize(newNode);
  }
<<<<<<< HEAD
  enemies = levelManager.instantiateEnemies();
  levelManager.incrementNextLevel();
=======
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196
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

<<<<<<< HEAD
  // Update projectiles
  levelManager.gameMap.projectiles.forEach((projectile) => {
    projectile.update(deltaTime, levelManager.gameMap, enemies, player);
=======
  // Update each projectile
  projectiles.forEach((projectile) => {
    projectile.update(deltaTime, levelManager.gameMap, enemies);
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196
    if (!projectile.isAlive) {
      scene.remove(projectile.gameObject);
    }
  });
<<<<<<< HEAD
  levelManager.gameMap.projectiles = levelManager.gameMap.projectiles.filter(projectile => projectile.isAlive);

  // Update enemies
  enemies.forEach((enemy) => {
    enemy.update(deltaTime, player, levelManager.gameMap);
  })
  enemies = enemies.filter(enemy => enemy.isAlive);
=======
  projectiles = projectiles.filter(projectile => projectile.isAlive);

  // Update enemies
  enemies.forEach((enemy) => {
    if (!enemy.isAlive) {
      scene.remove(enemy.gameObject);
    }
    else {
      enemy.update();
    }
  })
  enemies.filter(enemy => enemy.isAlive);
  enemies.filter(enemy => enemy.isAlive);
  enemies.filter(enemy => enemy.isAlive);
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196


  // Move camera
  camera.position.x = player.gameObject.position.x;
  camera.position.z = player.gameObject.position.z;


}

init();