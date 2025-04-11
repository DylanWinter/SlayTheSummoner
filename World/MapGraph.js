import { MapNode } from './MapNode.js';
import { Player } from '../Characters/Player.js';

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

  // A* Pathfinding Implementation
  aStar(startNode, targetNode) {
    const openSet = []; // Nodes yet to be evaluated
    const closedSet = new Set(); // Nodes already evaluated
    const cameFrom = new Map(); // To reconstruct the path

    // Cost from start node to a given node
    const gScore = new Map();
    gScore.set(startNode, 0);

    // Estimated cost from a given node to the target node
    const fScore = new Map();
    fScore.set(startNode, this.heuristic(startNode, targetNode));

    openSet.push(startNode);

    while (openSet.length > 0) {
      // Find node with the lowest fScore
      let currentNode = this.getLowestFScoreNode(openSet, fScore);

      // If we reached the target, reconstruct the path
      if (currentNode === targetNode) {
        let path = [];
        while (cameFrom.has(currentNode)) {
          path.push(currentNode);
          currentNode = cameFrom.get(currentNode);
        }
        path.reverse(); // We built the path from target to start, so reverse it
        return path;
      }

      // Move currentNode from openSet to closedSet
      this.removeFromOpenSet(openSet, currentNode);
      closedSet.add(currentNode);

      // Check neighbors of currentNode
      let edges = currentNode.edges;
      for (let i = 0; i < edges.length; i++) {
        let neighbor = edges[i].node;
        let cost = edges[i].cost;

        if (closedSet.has(neighbor)) continue; // ignore already evaluated nodes

        const tentativeGScore = gScore.get(currentNode) + cost

        // If the neighbor is not in openSet or we found a better path
        if (!openSet.includes(neighbor) || tentativeGScore < gScore.get(neighbor)) {
          cameFrom.set(neighbor, currentNode);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(neighbor, gScore.get(neighbor) + this.heuristic(neighbor, targetNode));

          if (!openSet.includes(neighbor)) openSet.push(neighbor);
        }
      }
    }

    // Return an empty array if not path is found
    return [];
  }

  // Heuristic function that calculates Euclidean distance
  heuristic(node, targetNode) {
    const dx = node.i - targetNode.i;
    const dy = node.z - targetNode.z;

    return Math.sqrt(dx * dx + dy * dy);
  }

  // Helper function to get the node with the lowest fScore
  getLowestFScoreNode(openSet, fScore) {
    let lowestNode = openSet[0];
    for (let i = 1; i < openSet.length; i++) {
      if (fScore.get(openSet[i]) < fScore.get(lowestNode)) {
        lowestNode = openSet[i];
      }
    }
    return lowestNode;
  }

  // Helper function to remove a node from the openSet
  removeFromOpenSet(openSet, node) {
    const index = openSet.indexOf(node);
    if (index !== -1) {
      openSet.splice(index, 1);
    }
  }
}