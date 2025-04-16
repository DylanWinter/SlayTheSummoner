import * as THREE from 'three';
import { MapNode } from './MapNode.js';

export class MapRenderer {


  // MapRenderer constructor
  constructor(gameMap, groundColor, obstacleColor) {
    this.gameMap = gameMap;

    this.groundColor = new THREE.Color(groundColor);
    this.obstacleColor = new THREE.Color(obstacleColor);
    this.exitColor = new THREE.Color(0x00FF00);
  }


  // To create the actual game object
  // associated with our GameMap
  createRendering() {
    const textureLoader = new THREE.TextureLoader();
    const groundTex = textureLoader.load("Assets/stacked-stones.jpg");
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(0.5, 0.5);
    groundTex.anisotropy = 4;
    const wallTex = textureLoader.load("Assets/878.jpg");
    wallTex.wrapS = THREE.RepeatWrapping;
    wallTex.wrapT = THREE.RepeatWrapping;
    wallTex.repeat.set(0.5, 0.5);
    groundTex.anisotropy = 4;

    let groundMaterial = new THREE.MeshStandardMaterial(
      { map: groundTex, color: this.groundColor, flatShading: true });
    let obstacleMaterial = new THREE.MeshStandardMaterial({
      map: wallTex, color: this.obstacleColor, flatShading: true });
    let exitMaterial = new THREE.MeshStandardMaterial({ color: this.exitColor, flatShading: true });
  
    // Group nodes by type
    let nodes = this.gameMap.mapGraph.nodes;
    let groundNodes = nodes.filter(n => n.type === MapNode.Type.Ground);
    let obstacleNodes = nodes.filter(n => n.type === MapNode.Type.Obstacle);
    let exitNodes = nodes.filter(n => n.type === MapNode.Type.Exit);

    // Create shared box geometry
    let tileGeometry = new THREE.BoxGeometry(
      this.gameMap.tileSize,
      this.gameMap.tileSize,
      this.gameMap.tileSize
      );

    // Create instanced meshes
    let groundMesh = new THREE.InstancedMesh(tileGeometry, groundMaterial, groundNodes.length);
    let obstacleMesh = new THREE.InstancedMesh(tileGeometry, obstacleMaterial, obstacleNodes.length);
    let exitMesh = new THREE.InstancedMesh(tileGeometry, exitMaterial, exitNodes.length)
   
    // Create mesh transforms per type
    this.setMeshTransforms(groundMesh, groundNodes);
    this.setMeshTransforms(obstacleMesh, obstacleNodes);
    this.setMeshTransforms(exitMesh, exitNodes);
  
    // Group everything
    let gameObject = new THREE.Group();
    gameObject.add(groundMesh, obstacleMesh, exitMesh);
    return gameObject;
   
  }

  // Set mesh transforms
  setMeshTransforms(mesh, nodeList) {
    let half = this.gameMap.tileSize / 2;
    let minX = this.gameMap.bounds.min.x;
    let minZ = this.gameMap.bounds.min.z;
    let tileSize = this.gameMap.tileSize;

    // Iterate over nodes
    for (let i = 0; i < nodeList.length; i++) {
      let node = nodeList[i];

      let elevation = (node.type === MapNode.Type.Obstacle) ? 1.5 : 0;

      // Get translation
      let x = minX + node.i * tileSize + half;
      let y = (tileSize * elevation)/2;
      let z = minZ + node.j * tileSize + half;

      // Create matrix to translate and scale
      let translation = new THREE.Matrix4().makeTranslation(x, y, z);
      let scale = new THREE.Matrix4().makeScale(1, elevation, 1);
      let matrix = translation.multiply(scale);

      mesh.setMatrixAt(i, matrix);
    }
  }

  // To create non-ground tile geometries
  addToTileGeometries(geometries, node) {

    // Can change this.gameMap.based on tile type
    let height = this.gameMap.tileSize;

    // Create tile geometry
    let geometry = this.createTileGeometry(node, height);

    // Add to the specified geometry
    geometries =
      BufferGeometryUtils.mergeGeometries(
        [geometries, geometry]
      );
    
    // Return the updated geometries
    return geometries;
  }


  // Create an individual tile geometry
  createTileGeometry(node, height) {
    // The coordinates of our top left edge of the tile
    let x = this.gameMap.bounds.min.x + (node.i * this.gameMap.tileSize) + this.gameMap.tileSize/2;
    let y = this.gameMap.tileSize/2;
    let z = this.gameMap.bounds.min.z + (node.j * this.gameMap.tileSize) + this.gameMap.tileSize/2;
    let position = new THREE.Vector3(x, y, z);
    
    // Set the geometry of our tile
    let geometry = 
      new THREE.BoxGeometry(
        this.gameMap.tileSize, 
        height,
        this.gameMap.tileSize
      );

    // Translate our geomtery to the required position
    geometry.translate(position);
    geometry.translate(0, height/2, 0);

    return geometry;
  }


  // Highlight a particular node/tile of a specified colour
  highlight(node, color) {
    
    let geometry = this.createTileGeometry(node, 1)
    let material = new THREE.MeshStandardMaterial({color: color});

    return new THREE.Mesh(geometry, material);

  }

}

