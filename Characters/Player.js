import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';
import { UI } from './UI.js';
import {Projectile} from "./Projectile";
import {Vector3} from "three";

export class Player {
  constructor() {
    let coneGeo = new THREE.ConeGeometry(0.5, 1, 10);
    let coneMat = new THREE.MeshStandardMaterial({color: "blue"});
    let mesh = new THREE.Mesh(coneGeo, coneMat);
    mesh.rotation.x = Math.PI/2;

    this.gameObject = new THREE.Group();
    this.gameObject.add(mesh);

    this.location = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();

    // Player Stats
    this.moveSpeed = 15;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.strength = 1; // determines damage per attack
    this.bombs = 3;
    this.isAlive = true;
    this.projectileSpeed = 25;

    // Creates UI and links it to the player
    this.ui = new UI(this);
  }

  // Main function to handle player movement actions
  update(keys, mouse, camera, deltaTime, map) {
    this.handleMovement(keys, deltaTime, map);
    this.handleLook(mouse, camera);
    this.ui.update();
  }

  // Updates player movement based on keyboard input. Handles collisions.
  handleMovement(keys, deltaTime, map) {
    let moveVector = new THREE.Vector3();
    if (keys.a) {
      moveVector.add(new THREE.Vector3(-1, 0, 0));
    }
    if (keys.d) {
      moveVector.add(new THREE.Vector3(1, 0, 0));
    }
    if (keys.w) {
      moveVector.add(new THREE.Vector3(0, 0, -1));
    }
    if (keys.s) {
      moveVector.add(new THREE.Vector3(0, 0, 1));
    }
    moveVector.setLength(this.moveSpeed * deltaTime);
    let newPos = VectorUtil.add(moveVector, this.location)
    this.handleCollision(this.location, newPos, map, moveVector);
    this.gameObject.position.copy(this.location);
  }

  // Rotates the player based on mouse position
  handleLook(mouse, camera) {
    this.raycaster.setFromCamera(mouse, camera);
    const planeY = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectionPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(planeY, intersectionPoint);
    const dx = intersectionPoint.x - this.gameObject.position.x;
    const dz = intersectionPoint.z - this.gameObject.position.z;
    this.gameObject.rotation.y = Math.atan2(dx, dz);
  }

  // Checks for collisions independently in x and z directions. If none found, updates location in that direction.
  handleCollision(currPos, newPos, map, moveVector) {
    let oldGridIndex = this.convertToGridIndex(currPos, map);
    let newGridIndex = this.convertToGridIndex(newPos, map)
    if (map.mapGraph.getAt(newGridIndex.x, oldGridIndex.z).isTraversable()) {
      this.location.x += moveVector.x;
    }
    if (map.mapGraph.getAt(oldGridIndex.x, newGridIndex.z).isTraversable()) {
      this.location.z += moveVector.z;
    }
  }

  fire(scene, projArray) {
    let direction = (new Vector3(Math.sin(this.gameObject.rotation.y),
      0,
      Math.cos(this.gameObject.rotation.y))).normalize();
    let proj = new Projectile(this.location, direction, this.projectileSpeed);
    scene.add(proj.gameObject);
    projArray.push(proj);
  }

  // Converts a world space position into a usable MapGraph index
  convertToGridIndex(location, map) {
    return new THREE.Vector3(
      Math.floor(location.x / map.tileSize) + Math.abs(map.bounds.max.x - map.bounds.min.x) / map.tileSize / 2,
      location.y,
      Math.floor(location.z / map.tileSize) + Math.abs(map.bounds.max.z - map.bounds.min.z) / map.tileSize / 2);
  }


  // --- Player stats manipulation methods --- //

  takeDamage(amount) {
    this.health -= amount;
    this.ui.updateUI();

    console.log(
      `You took %c${amount}%c damage.`,
      "color: red; font-weight: bold;",
      "color: white;"
    );

    if (this.health <= 0) {
      this.health = 0;
      this.isAlive = false;

      console.log(`You are dead!`);
    }
  }

  heal(amount) {
    if (!this.isAlive) return; // heal does not happen if the player is dead
    this.health = Math.min(this.maxHealth, this.health + amount);
    this.ui.updateUI();
    
    console.log(`You healed for %c${amount}%c.`, "color: green; font-weight: bold;");

  }


  // Used for max health upgrades/downgrades
  changeMaxHealth(amount) {
    this.maxHealth += amount;
    this.updateUI();
  }


  // Used for strength upgrades/downgrades
  changeStrength(amount) {
    this.strength += amount;

    // Makes sure player does not go under 1 strength
    if (this.strength <= 0) {
      this.strength = 1;
    }
  }


  // Used to increment/decrement bomb count
  changeBombCount(amount) {
    this.bombs += amount;

    // Makes sure player does not have less than 0 bombs
    if (this.bombs < 0) {
      this.bombs = 0;
    }
  }
}