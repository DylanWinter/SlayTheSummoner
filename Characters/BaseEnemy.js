import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';
import { State } from '../World/State.js';
import {Vector3} from "three";

 /**
 * 
 * The BaseEnemy class will be used for:
 * NPC movement
 *
 **/
export class BaseEnemy {

  constructor(player, gameMap) {

    // Creating a game object for our BaseEnemy
    let geo = new THREE.SphereGeometry(this.size);
    let mat = new THREE.MeshStandardMaterial({color: "blue"});
    let mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI/2;

    this.gameObject = new THREE.Group();
    this.gameObject.add(mesh);

    this.location = new THREE.Vector3(0,0,0);
    this.velocity = new THREE.Vector3(0,0,0);
    this.acceleration = new THREE.Vector3(0,0,0);

    
    this.topSpeed = 10;
    this.mass = 1;
    this.maxForce = 15;
    this.size = 1;

    this.health = 3;
    this.isAlive = true;

    this.pathPoint = 0;
    
  }


  // To update our enemy
  update(deltaTime, player, gameMap) {
    if (!this.isAlive) return; // enemy does not need to update if it's dead
  }


  // Creates the path to the player with the aStar method,
  // then returns the coordinates of the next node in the path
  // Simple path follow
  simpleFollow(path) {
    
    // Check to make sure a path exists
    if (path.length() > 0) {
    
      // Getting the distance from our character to the path point
      let distance = this.location.distanceTo(path.get(this.pathPoint));

      // Check to see if it's less than a certain threshold
      // in this case, we can use our path radius
      if (distance < path.radius) {

        // If we are at the end of the path, arrive
        if (this.pathPoint === path.length()-1) {
          return this.arrive(path.get(this.pathPoint), path.radius);
          
        }
        // otherwise, increment our path point
        this.pathPoint++;
      }
      // return seek to the current path point
      return this.seek(path.get(this.pathPoint));
    }
    // if no path, return a 0 vector
    return new THREE.Vector3();

  }

  // Checks for collisions independently in x and z directions. If none found, updates location in that direction.
  handleCollision(currPos, newPos, map, deltaTime) {
    let gridNewX = map.quantize(new Vector3(newPos.x, 0, currPos.z));
    let gridNewZ = map.quantize(new Vector3(currPos.x, 0, newPos.z));
    if (gridNewX.isTraversable()) {
      this.location.x += this.velocity.x * deltaTime;
    }
    if (gridNewZ.isTraversable()) {
      this.location.z += this.velocity.z * deltaTime;
    }
  }

  // Apply force to our character
  applyForce(force) {
    force.divideScalar(this.mass);
    this.acceleration.add(force);
  }


  // Stop our character
  stop() {
    this.velocity.set(0, 0, 0);
  }

  // Seek steering behaviour
  seek(target) {

    // Calculate desired velocity
    let desired = VectorUtil.sub(target, this.location);
    desired.setLength(this.topSpeed);
  
    // Calculate steering force
    let steer = VectorUtil.sub(desired, this.velocity);

    if (steer.length() > this.maxForce) {
      steer.setLength(this.maxForce);
    }

    return steer;
  }

  // Flee steering behaviour
  flee(target) {

    let desired = new THREE.Vector3();
    desired.subVectors(target, this.location);
    desired.y = 0; // prevents vertical movement
    desired.setLength(this.topSpeed);

    // This is the only change compared
    // to our seek steering behaviour
    desired.multiplyScalar(-1);

    let steer = new THREE.Vector3();
    steer.subVectors(desired, this.velocity);     


    if (steer.length() > this.maxForce) {
      steer.setLength(this.maxForce);
    }

    return steer;

  }


  // Arrive steering behaviour
  arrive(target, radius) {

    let desired = new THREE.Vector3();
    desired.subVectors(target, this.location);

    let distance = desired.length();

    // If we are close enough to
    // the target, stop
    if (distance < 0.1) {
      this.stop();
    
    // Slow down if we are within
    // a specified radius to the target
    } else if (distance < radius) {
      let speed = (distance/radius) * this.topSpeed;
      desired.setLength(speed);
    
    // Otherwise, proceed as seek
    } else {
      desired.setLength(this.topSpeed);
    
    }

    // Apply our steering formula
    let steer = new THREE.Vector3();
    steer.subVectors(desired, this.velocity);

    if (steer.length() > this.maxForce) {
      steer.setLength(this.maxForce);
    }

    return steer;
  }

  // Will be implemented when projectiles are finished
  shootAtPlayer(player){
    
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isAlive = false;

    this.gameObject.parent.remove(this.gameObject);
    console.log("died");
  }

}