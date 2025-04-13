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
let projectiles = [];

let mapGraph;

// Create player
let player;

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
window.addEventListener('click', () => {player.fire(scene, projectiles)});

// Set up our scene
function init() {

  scene.background = new THREE.Color(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.y = 75;
  camera.lookAt(player.gameObject.position);

  // Create Light
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0, 5, 5);
  scene.add(directionalLight);

  
  levelManager = new LevelManager(scene);
  

  player = new Player(gameMap);
  enemy = new TurretEnemy();

  player.location.set(10, 0, 10);
  player.gameObject.position.copy(player.location); // Update visual position

  scene.add(player.gameObject)

  scene.add(enemy.gameObject);

  //enemy.takeDamage(3);


  // Create a start and end for our path
  //start = enemy.getCurrentMapNode(gameMap);
  //end = player.getCurrentMapNode(gameMap);

  // Call path find on start to end
  //path = gameMap.pathFind(start, end);

  // First call to animate
  loadNextLevel();
  animate();
}

function loadNextLevel() {
  projectiles.forEach((projectile) => {scene.remove(projectile.gameObject);});
  projectiles = [];
  enemies.forEach(enemy => {scene.remove(enemy.gameObject);});
  enemies = [];
  player.hasFoundExit = false;
  levelManager.loadNextLevel();
  if (!levelManager.gameMap.quantize(player.location).isTraversable()) {
    let newNode = levelManager.gameMap.mapGraph.getRandomGroundNode();
    player.location = levelManager.gameMap.localize(newNode);
  }
  enemies = levelManager.instantiateEnemies();
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
  projectiles.forEach((projectile) => {
    projectile.update(deltaTime, levelManager.gameMap, enemies);
    if (!projectile.isAlive) {
      scene.remove(projectile.gameObject);
    }
  });
  projectiles = projectiles.filter(projectile => projectile.isAlive);

  // Update enemies
  enemies.forEach((enemy) => {
      enemy.update(deltaTime);
  })
  enemies.filter(enemy => enemy.isAlive);


  // Move camera
  camera.position.x = player.gameObject.position.x;
  camera.position.z = player.gameObject.position.z;

  //start = enemy.getCurrentMapNode(gameMap);
  //end = player.getCurrentMapNode(gameMap);
  //path = gameMap.pathFind(start, end);

  //let steer = enemy.simpleFollow(path);

  //enemy.applyForce(steer);

  enemy.update(deltaTime, player, gameMap);
}

init();