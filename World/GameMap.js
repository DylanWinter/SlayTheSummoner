import * as THREE from 'three';
import { MapGraph } from './MapGraph.js';
import { MapRenderer } from './MapRenderer.js';
import { CaveGenerator } from './CaveGenerator.js';
import { Path } from './Path.js';

export class GameMap {

  // Constructor for our GameMap class
  constructor(groundColor=0xDDDDDD, obstacleColor=0x555555) {
<<<<<<< HEAD

    this.projectiles = [];

=======
  
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196
    // Initialize bounds in here!
    this.bounds = new THREE.Box3(
      new THREE.Vector3(-150,0,-100), // scene min
      new THREE.Vector3(150,0,100) // scene max
    );

    // worldSize is a Vector3 with 
    // the dimensions of our bounds
    this.worldSize = new THREE.Vector3();
    this.bounds.getSize(this.worldSize);

    // Let's define a tile size
    // for our tile-based map
    this.tileSize = 2;
    // Columns and rows of our tile world
    let cols = this.worldSize.x/this.tileSize;
    let rows = this.worldSize.z/this.tileSize;


    // Create our graph!
    this.mapGraph = new MapGraph(cols, rows);


    // Put our cave generator here!
    let caveGenerator = new CaveGenerator(this.mapGraph);
    caveGenerator.generate(10, 0.35);


    // Create our map renderer
    this.mapRenderer = new MapRenderer(this, groundColor, obstacleColor);

    // Create our game object
    this.gameObject = this.mapRenderer.createRendering();

  }


  // Returns the mapGraph instance variable
  getMapGraph() {
    return this.mapGraph;
  }


  // Method to path find with A*
  pathFind(start, end) {
    
    // aStar returns a map based on nodes    
    let nodePath = this.mapGraph.aStar(start, end, this.mapGraph.heuristic(start, end));

    // Create a path that our character can understand
    let path = new Path(this.tileSize/2);

    // For each point in our nodePath, add a localized version to our path
    for (let p of nodePath) {
      //let highlightedObject = this.mapRenderer.highlight(p, 'yellow');
      //this.gameObject.add(highlightedObject);

      path.points.push(this.localize(p));
    }
    
    // Return path (ensure this is not nodePath!)
    return path;
  
  }


  // Method to get from node to world location
  localize(node) {
    let x = this.bounds.min.x + (node.i * this.tileSize) + this.tileSize/2;
    let y = 0;
    let z = this.bounds.min.z + (node.j * this.tileSize) + this.tileSize/2;
    return new THREE.Vector3(x, y, z);
  }

  // Method to get from world location to node
  quantize(location) {
    let nodeI = Math.floor((location.x - this.bounds.min.x)/this.tileSize);
    let nodeJ = Math.floor((location.z - this.bounds.min.z)/this.tileSize);

    return this.mapGraph.getAt(nodeI, nodeJ);
  }

}