import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';
import {distance} from "three/tsl";

export class Projectile {
  constructor(position, direction, speed, lifespan=2) {

    let sphereGeo = new THREE.SphereGeometry(0.2);
    let coneMat = new THREE.MeshStandardMaterial({color: "blue"});
    let mesh = new THREE.Mesh(sphereGeo, coneMat);
    mesh.rotation.x = Math.PI/2;

    this.gameObject = new THREE.Group();
    this.gameObject.add(mesh);

    this.location = position;
    this.direction = direction;
    this.speed = speed;
    this.lifespan = lifespan;
    this.damage = 1;

    this.isAlive = true;
  }

  update(deltaTime, map, enemies) {
    this.location = VectorUtil.add((VectorUtil.multiplyScalar(this.direction, this.speed * deltaTime)), this.location)
    this.handleCollision(this.location, map)
    enemies.forEach(e => {
      this.handleEnemyCollision(e);
    })
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

  handleEnemyCollision(enemy) {
    console.log(this.location.x, enemy.gameObject.position.x)
    if (this.location.distanceTo(enemy.location) < enemy.size && this.isAlive)
    {
      this.isAlive = false;
      enemy.takeDamage(this.damage);
    }
  }

}