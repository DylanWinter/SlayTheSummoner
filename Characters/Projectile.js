import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';
import {distance} from "three/tsl";

export class Projectile {
<<<<<<< HEAD
  constructor(position, direction, speed, isFriendly=true) {
=======
  constructor(position, direction, speed, lifespan=2) {
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196

    let sphereGeo = new THREE.SphereGeometry(0.2);
    let coneMat = new THREE.MeshStandardMaterial({color: "blue"});
    let mesh = new THREE.Mesh(sphereGeo, coneMat);
    mesh.rotation.x = Math.PI/2;

    this.gameObject = new THREE.Group();
    this.gameObject.add(mesh);

    this.location = position;
    this.direction = direction;
    this.speed = speed;
<<<<<<< HEAD
    this.damage = 1;
    this.isFriendly = isFriendly;
=======
    this.lifespan = lifespan;
    this.damage = 1;
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196

    this.isAlive = true;
  }

<<<<<<< HEAD
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

=======
  update(deltaTime, map, enemies) {
    this.location = VectorUtil.add((VectorUtil.multiplyScalar(this.direction, this.speed * deltaTime)), this.location)
    this.handleCollision(this.location, map)
    enemies.forEach(e => {
      this.handleEnemyCollision(e);
    })
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196
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
<<<<<<< HEAD
    if (this.location.distanceTo(enemy.location) < enemy.size && this.isAlive && this.isFriendly)
=======
    if (this.location.distanceTo(enemy.location) < enemy.size && this.isAlive)
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196
    {
      this.isAlive = false;
      enemy.takeDamage(this.damage);
    }
  }

<<<<<<< HEAD
  handlePlayerCollision(player) {
    if (this.location.distanceTo(player.location) < player.hitboxSize && this.isAlive && !this.isFriendly) {
      this.isAlive = false
      player.takeDamage(this.damage);
    }
  }

=======
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196
}