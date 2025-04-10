import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';

export class Player {
  constructor() {
    let coneGeo = new THREE.ConeGeometry(0.5, 1, 10);
    let coneMat = new THREE.MeshStandardMaterial({color: "blue"});
    let mesh = new THREE.Mesh(coneGeo, coneMat);
    mesh.rotation.x = Math.PI/2;
    this.gameObject = new THREE.Group();
    this.gameObject.add(mesh);

    this.moveSpeed = 15;
    this.location = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
  }

  // Main function for player movement actions
  update(keys, mouse, camera, deltaTime, map) {
    this.handleMovement(keys, deltaTime, map);
    this.handleLook(mouse, camera);
  }

  // Moves the player based on keyboard inputs, checking for collisions
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
    let newPos = VectorUtil.add(this.location, moveVector)
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

  // Converts a world space position into a usable MapGraph index
  convertToGridIndex(location, map) {
    return new THREE.Vector3(
      Math.floor(location.x / map.tileSize) + Math.abs(map.bounds.max.x - map.bounds.min.x) / map.tileSize / 2,
      location.y,
      Math.floor(location.z / map.tileSize) + Math.abs(map.bounds.max.z - map.bounds.min.z) / map.tileSize / 2);
  }

}

