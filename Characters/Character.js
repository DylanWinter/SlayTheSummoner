import * as THREE from 'three';

/**
 * 
 * The Character class will be used for:
 * NPC movement and Player movement
 *
 **/
export class Character {

  constructor(color = "red") {

    // Creating a cone game object for our Character
    let coneGeo = new THREE.ConeGeometry(0.5, 1, 10);
    let coneMat = new THREE.MeshStandardMaterial({color: color});
    let mesh = new THREE.Mesh(coneGeo, coneMat);
    mesh.rotation.x = Math.PI/2;

    this.gameObject = new THREE.Group();
    this.gameObject.add(mesh);

    this.location = new THREE.Vector3(0,0,0);
    this.velocity = new THREE.Vector3(0,0,0);
    this.acceleration = new THREE.Vector3(0,0,0);
    
    this.topSpeed = 10;
    this.mass = 1;
    this.maxForce = 15;

  }

  // Wrap around the scene
  checkBounds(bounds) {
    this.location.x = THREE.MathUtils.euclideanModulo(
        this.location.x - bounds.min.x,
        bounds.max.x - bounds.min.x
      ) + bounds.min.x;

    this.location.z = THREE.MathUtils.euclideanModulo(
        this.location.z - bounds.min.z,
        bounds.max.z - bounds.min.z
      ) + bounds.min.z;

  }
  
  // To update our character
  update(deltaTime, bounds) {
    // Update acceleration via velocity
    this.velocity.addScaledVector(this.acceleration, deltaTime);
    if (this.velocity.length() > this.topSpeed) {
      this.velocity.setLength(this.topSpeed);
    }
    
    // Update velocity via location
    this.location.addScaledVector(this.velocity, deltaTime);
    
    this.checkBounds(bounds);
    this.gameObject.position.copy(this.location);
  }

  // Apply force to our character
  applyForce(force) {
    force.divideScalar(this.mass);
    this.acceleration.add(force);
  }

}