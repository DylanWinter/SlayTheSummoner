import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';
import { UI } from './UI.js';
import {Projectile} from "./Projectile";
import {Vector3} from "three";
import {GLTFLoader} from "three/addons";

export class Player {
  constructor() {
    this.gameObject = new THREE.Group();

    this.location = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();

    this.changedNodes = true; // when true, NPCs that use A* will recalculate their path

    // Player Stats
    this.moveSpeed = 25;
    this.maxHealth = 3;
    this.health = this.maxHealth;
    this.strength = 1; // determines damage per attack
    this.isAlive = true;
    this.hasFoundExit = false;
    this.projectileSpeed = 40;
    this.hitboxSize = 0.75;

    // Creates UI and links it to the player
    this.ui = new UI(this);
    this.loadModel();
  }

  loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      'Assets/Rogue_Hooded.glb',
      (gltf) => {
        this.mesh = gltf.scene;
        this.gameObject.add(this.mesh);
        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(this.mesh);
        }

        console.log(gltf.animations)
        this.idleAnim = this.mixer.clipAction(gltf.animations[36]);
        this.fireAnim = this.mixer.clipAction(gltf.animations[6])
        this.runAnim = this.mixer.clipAction(gltf.animations[48])
        this.idleAnim.play();
      },
      undefined,
      (error) => {
        console.error('Error while loading player model:', error);
      }
    );
  }

  // Main function to handle player movement actions
  update(keys, mouse, camera, deltaTime, gameMap) {
    this.handleMovement(keys, deltaTime, gameMap);
    this.handleLook(mouse, camera);
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
    this.ui.update();
  }

  // Updates player movement based on keyboard input. Handles collisions.
  handleMovement(keys, deltaTime, gameMap) {
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
    // Plays animations based on direction of movement
    if (this.runAnim) {
      this.handleAnimation(moveVector);
    }
    let newPos = VectorUtil.add(moveVector, this.location)
    this.handleCollision(this.location, newPos, gameMap, moveVector);
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
    let gridNewX = map.quantize(new Vector3(newPos.x, 0, currPos.z));
    let gridNewZ = map.quantize(new Vector3(currPos.x, 0, newPos.z));
    if (gridNewX.isTraversable()) {
      this.location.x += moveVector.x;
    }
    if (gridNewZ.isTraversable()) {
      this.location.z += moveVector.z;
    }
    if (map.quantize(new Vector3(this.location.x, 0, this.location.z)).isExit()) {
      this.hasFoundExit = true;
    }
  }

  handleAnimation(moveVector) {
    let fadeTime = 0.1;
    if (moveVector.x === 0 && moveVector.z === 0) {
      // Idle
      this.runAnim.fadeOut(fadeTime).stop();
      this.idleAnim.play();
    } else if (moveVector.x !== 0 || moveVector.z !== 0) {
      // Moving
      if (!this.runAnim.isRunning()) {
        this.runAnim.reset().fadeIn(fadeTime).play();
      }
      this.idleAnim.fadeOut(fadeTime).stop();
    }
  }

  fire(scene, projArray) {
    let direction = (new Vector3(Math.sin(this.gameObject.rotation.y),
      0,
      Math.cos(this.gameObject.rotation.y))).normalize();
    let proj = new Projectile(this.location, direction, this.projectileSpeed);
    scene.add(proj.gameObject);
    projArray.push(proj);
    this.fireAnim.setLoop(THREE.LoopOnce);
    this.fireAnim.clampWhenFinished = true;
    this.fireAnim.reset();
    this.fireAnim.play();
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
      this.die();
    }
  }

  die() {
    const deathScreen = document.getElementById('death-screen');
    deathScreen.classList.add('show');

    // Wait 3 seconds then reload the page
    setTimeout(() => {
      window.location.reload();
    }, 5000)
  }


  getStrength() {
    return this.strength;
  }


  getMaxhealth() {
    return this.maxHealth;
  }


  getCurrentHealth() {
    return this.health;
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
    this.ui.updateUI();
  }


  // Used for strength upgrades/downgrades
  changeStrength(amount) {
    this.strength += amount;
    this.ui.updateUI();

    // Makes sure player does not go under 1 strength
    if (this.strength <= 0) {
      this.strength = 1;
      this.ui.updateUI();
    }
  }

}