import { MapNode } from './MapNode.js';
import { Player } from '../Characters/Player.js';
import { MinHeap } from '../Utils/MinHeap.js'

// Want to make it so the node that the player is in is "tagged", so the NPCs can use A* to path to this node
// the NPCs will shoot at the player's coordinates
// use convertToGridIndex for coordinates, pass the x and z coordinates into MapGraph's getAt(i, j) method

export class MapGraph {
  
  // Constructor for our MapGraph class
  constructor(cols, rows) {

    this.nodes = [];
    // Columns and rows
    // as instance variables
    this.cols = cols;
    this.rows = rows;

  }

  // Get a node at a particular index
  get(index) {
    return this.nodes[index];
  }

  // Get a node at i and j indices
  getAt(i, j) {
    return this.get(j * this.cols + i);
  }

  // The number of nodes in our graph
  length() {
    return this.nodes.length;
  }


  // Create tile-based nodes
  createNodes(grid) {

    // node array for our Graph class
    this.nodes = [];
    // Loop over all rows and columns
    // to create all of our nodes
    // and add them to our node array
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {

        let type = grid[i][j] === 1 ? MapNode.Type.Obstacle : MapNode.Type.Ground;

        let node = new MapNode(this.length(), i, j, type);
        this.nodes.push(node);

      }
    }
  }
  
  // Create tile-based edges
  createEdges() {
    
    // Loop over all rows and columns
    // to create all of our edges
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {

        // The index of our current node
        let index = j * this.cols + i
        let current = this.nodes[index];

        // Check if the current node is traversable
        if (current.isTraversable()) {

          if (i > 0) {
          	let west = this.nodes[index - 1];
          	current.tryAddEdge(west, 1);
          }

          if (i < this.cols - 1) {
          	let east = this.nodes[index + 1];
          	current.tryAddEdge(east, 1);
          }

          if (j > 0) {
            let north = this.nodes[index - this.cols];
            current.tryAddEdge(north, 1);
          }

          if (j < this.rows - 1) {
            let south = this.nodes[index + this.cols];
            current.tryAddEdge(south, 1);
          }
        }
      }
    }
  }

  // A* Pathfinding
  aStar(start, end) {

    // Keep track of open nodes, costs, and parents
    let open = new MinHeap();
    let costs = new Map();
    let parents = new Map();

    // Add the start node to our open, costs, and parents
    open.enqueue(start, 0);
    costs.set(start.id, 0);
    parents.set(start.id, null);

    // While open still has nodes to traverse
    while (!open.isEmpty()) {

      // Get the lowest F cost node
      let current = open.dequeue();

      // If we've reached the end,
      // we know this is the lowest cost
      // Reconstruct the path
      if (current === end) {
        return this.backtrack(end, parents);
      }

      // Look at current's neighbours
      for (let edge of current.edges) {
        
        let neighbour = edge.node;
        
        // gCost is our original cost
        let gCost = edge.cost + costs.get(current.id);
        // hCost is our cost based on the heuristic
        let hCost = this.heuristic(neighbour, end);
        // fCost is combining the two
        let fCost = gCost + hCost;

        // If costs does not have our neighbour OR
        // It's cost is > than the current gCost
        if (!costs.has(neighbour.id) || (costs.get(neighbour.id) > gCost)) {
          // Add neighbour to our costs, parents, and open
          costs.set(neighbour.id, gCost);
          parents.set(neighbour.id, current);

          open.enqueue(neighbour, fCost);
        }

      }

    }
    // We haven't found a path
    return [];

  }

  // Heuristic function that calculates Euclidean distance
  heuristic(node, targetNode) {
    const dx = Math.abs(node.i - targetNode.i);
    const dz = Math.abs(node.j - targetNode.j);

    return Math.sqrt(dx * dx + dz * dz);
  }

  // Method to use our parents Map
  // to find a path to the specified end node
  backtrack(end, parents) {
    let path = [];
    let current = end;
    
    if (!parents.has(end.id)) {
      console.log("There is no path to the node: " + end.id);
      return path;
    }

    // Traverse backwards using our parent Map
    while (current !== null) {
      path.unshift(current);
      current = parents.get(current.id);
    }

    return path;
  }
}