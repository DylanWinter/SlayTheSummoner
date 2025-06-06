import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';
import {distance} from "three/tsl";
import {GLTFLoader} from "three/addons";

export class Projectile {
  constructor(position, direction, speed, isFriendly=true, damage=1) {
    this.gameObject = new THREE.Group();

    this.location = position;
    this.direction = direction;
    this.speed = speed;
    this.damage = damage;
    this.isFriendly = isFriendly;

    this.isAlive = true;

    this.loadModel();
    this.gameObject.lookAt(this.direction);
  }

  // Loads the .glb model
  loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      'Assets/arrow.gltf',
      (gltf) => {
        this.mesh = gltf.scene;
        this.gameObject.add(this.mesh);
        this.mesh.scale.set(2, 2, 2);
        this.mesh.rotation.x = -Math.PI/2;
      },
      undefined,
      (error) => {
        console.error('Error while loading projectile model:', error);
      }
    );
  }

  // Main update; called every frame
  update(deltaTime, map, enemies, player) {
    this.location = VectorUtil.add((VectorUtil.multiplyScalar(this.direction, this.speed * deltaTime)), this.location)
    this.handleCollision(this.location, map)
    if (this.isFriendly) {
      enemies.forEach(e => {
        this.handleEnemyCollision(e);
      })
    }
    else {
      this.handlePlayerCollision(player);
    }

    this.gameObject.position.copy(this.location);
  }

  // Checks for collisions independently in x and z directions. If none found, updates location in that direction.
  handleCollision(pos, map) {
    let gridPos = map.quantize(pos);
    try {
      if (!gridPos.isTraversable()) {
        this.isAlive = false;
      }
    }
    // Handles crash in case of a projectile being out of bounds somehow
    catch (error) {
      this.isAlive = false;
    }
  }

  // Checks for collision with enemies
  handleEnemyCollision(enemy) {
    if (this.location.distanceTo(enemy.location) < enemy.size && this.isAlive && this.isFriendly)
    {
      this.isAlive = false;
      enemy.takeDamage(this.damage);
    }
  }

  // Checks for collision with player
  handlePlayerCollision(player) {
    if (this.location.distanceTo(player.location) < player.hitboxSize && this.isAlive && !this.isFriendly) {
      this.isAlive = false
      player.takeDamage(this.damage);
    }
  }

}