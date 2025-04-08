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

    this.moveSpeed = 10;
    this.location = new THREE.Vector3(0, 0, 0);
    this.raycaster = new THREE.Raycaster();
  }

  update(keys, mouse, camera, deltaTime, bounds) {
    this.handleMovement(keys, deltaTime, bounds);
    this.handleLook(mouse, camera);
  }

  handleMovement(keys, deltaTime, bounds) {
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
    this.location.add(moveVector);
    this.checkBounds(bounds)
    this.gameObject.position.copy(this.location);
  }

  handleLook(mouse, camera) {
    this.raycaster.setFromCamera(mouse, camera);
    const planeY = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectionPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(planeY, intersectionPoint);
    const dx = intersectionPoint.x - this.gameObject.position.x;
    const dz = intersectionPoint.z - this.gameObject.position.z;
    this.gameObject.rotation.y = Math.atan2(dx, dz);
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
}

