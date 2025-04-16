import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';
import {Vector3} from "three";
import {GLTFLoader} from "three/addons";
import {Item} from "../World/Item";


export class BaseEnemy {

  constructor() {
    this.size = 1;

    // Creating a game object for our BaseEnemy
    let geo = new THREE.SphereGeometry(this.size);
    let mat = new THREE.MeshStandardMaterial({color: "red"});
    this.mesh = new THREE.Mesh(geo, mat);

    this.gameObject = new THREE.Group();
    this.gameObject.add(this.mesh);

    this.location = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = new THREE.Vector3(0, 0, 0);


    this.topSpeed = 10;
    this.mass = 1;
    this.maxForce = 15;
    this.size = 1;
    this.wanderAngle = Math.random() * (Math.PI * 2);

    this.health = 3;
    this.isAlive = true;

    this.pathPoint = 0;
    this.gameMap = null;
  }

  // Loads a model and applies a material if given
  loadModel(modelPath, material = null) {
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        this.gameObject.remove(this.mesh);
        this.mesh = gltf.scene;
        // Apply material if given
        if (material) {
          this.mesh.traverse((child) => {
            if (child.isMesh) {
              child.material = material
            }
          });
        }
        // Get animation
        this.gameObject.add(this.mesh);
        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(this.mesh);
        }
        this.runAnim = this.mixer.clipAction(gltf.animations[90])
        this.runAnim.play();
      },
      undefined,
      (error) => {
        console.error('Error while loading player model:', error);
      }
    );
  }


  // To update our enemy
  update(deltaTime, player, gameMap) {
    if (!this.isAlive) {
      return;
    }
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
    if (!this.gameMap) {
      this.gameMap = gameMap;
    }
    this.gameObject.position.copy(this.location);
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
        if (this.pathPoint === path.length() - 1) {
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

  // Gradually slows the character down to a stop
  slowToStop() {
    if (this.velocity.lengthSq() > 0.001) {
      const deceleration = this.velocity.clone().multiplyScalar(-1);

      // Limits the deceleration force so it doesn’t stop instantly
      if (deceleration.length() > this.maxForce) {
        deceleration.setLength(this.maxForce);
      }

      // Ensure no Y component in the force
      deceleration.y = 0;

      this.applyForce(deceleration);
    } else {
      this.stop(); // Fully stop if we're already very slow
    }

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

  // Wander steering behaviour
  wander() {

    let distance = 10;
    let radius = 10;
    let angleOffset = 0.3;

    let futureLocation = this.velocity.clone();
    futureLocation.setLength(distance);
    futureLocation.add(this.location);

    let target = new THREE.Vector3(radius * Math.sin(this.wanderAngle), 0, radius * Math.cos(this.wanderAngle));
    target.add(futureLocation);

    let steer = this.seek(target);

    let change = Math.random() * (angleOffset * 2) - angleOffset;
    this.wanderAngle = this.wanderAngle + change;

    return steer;
  }


  // Subtracts amount from health; dies if health reaches 0
  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0 && this.isAlive) {
      this.die();
    }
  }


  // Dies
  die() {
    this.dropItem();
    this.isAlive = false;
    this.gameObject.parent.remove(this.gameObject);
  }


  // Randomly determines whether the enemy will drop an item, and spawns one if so
  dropItem() {
    const chance = Math.random();
    let item;
    if (chance < 0.4) {
      item = new Item(Item.Type.Heal);
    } 
    else if (chance < 0.5) {
      item = new Item(Item.Type.MaxHealthUp);
    } 
    else if (chance <= 0.6) {
      item = new Item(Item.Type.StrengthUp);
    }

    if (item) {
      item.setLocation(this.location.clone());
      this.gameMap.items.push(item);
      this.gameObject.parent.add(item.gameObject);
    }
  }
}
