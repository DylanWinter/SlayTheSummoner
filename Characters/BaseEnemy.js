import * as THREE from 'three';

export class BaseEnemy {

  constructor() {
    this.size = 1;

    // Creating a game object for our BaseEnemy
    let geo = new THREE.SphereGeometry(this.size);
    let mat = new THREE.MeshStandardMaterial({color: "red"});
    let mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI/2;
    this.gameObject = new THREE.Group();
    this.gameObject.add(mesh);

    this.location = new THREE.Vector3(0,0,0);
    this.health = 3;

    this.isAlive = true;
  }

  // To update our character
  update(deltaTime, bounds) {

  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isAlive = false;
  }

}