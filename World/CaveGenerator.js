import { MapNode } from './MapNode.js';
import { MapGraph } from './MapGraph.js';


// Cave Generator class
export class CaveGenerator {

  constructor(graph) {
    this.graph = graph;
  }

  // Grid bounds check
  inGrid(x, y) {
    return (x >= 0 && x < this.graph.cols) && 
           (y >= 0 && y < this.graph.rows);
  }


  // Generate
  generate(numIterations, density, onlyEdges=false) {
    while (true) {

      // Initialize our grid
      let grid = this.initGrid(density);

      if (onlyEdges) {
        // used to create boss arena
        grid = this.createEdgesOnly(grid);
      }
      else {
        // apply numIterations on our CA grid
        for (let i = 0; i < numIterations; i++) {
          grid = this.applyCA(grid);
        }
      }

      // Create nodes and edges
      // of course, in the real world it's probably better
      // to validate our grid then create nodes + edges
      this.graph.createNodes(grid);
      this.graph.createEdges();

      if (this.validate()) {
        if (!onlyEdges) {
          let ground = this.graph.nodes.filter(n => n.type === MapNode.Type.Ground);
          let randomNode = ground[Math.floor(Math.random() * ground.length)];
          randomNode.type = MapNode.Type.Exit;
        }
        return;
      }
    }
  }

  // Initialize our grid with noise at a rate of density
  initGrid(density) {
    let grid = [];
    
    // iterative over cols
    for (let i = 0; i < this.graph.cols; i++) {
      let col = [];

      // iterate over rows
      for (let j = 0; j < this.graph.rows; j++) {

        // set our cell to be 1 or 0 randomly at a rate of density
        let cell = Math.random() < density ? 1 : 0;
        col.push(cell);
      }

      grid.push(col);

    }
    return grid;
  }

  createEdgesOnly(grid) {
    let nextGrid = [];
    // iterate over cols
    for (let i = 0; i < this.graph.cols; i++) {
      let col = [];
      // iterate over rows
      for (let j = 0; j < this.graph.rows; j++) {
        let newCell = 0;
        if (i === 0 ||  j === 0) {
          newCell = 1;
        }
        if (i === this.graph.cols - 1 || j === this.graph.rows - 1) {
          newCell = 1;
        }
        col.push(newCell);
      }
      nextGrid.push(col);
    }
    return nextGrid;
  }

  // Perform one iteration of our CA rules
  applyCA(grid) {

    // make sure to create a new grid to not overwrite!
    let nextGrid = [];

    // iterate over cols
    for (let i = 0; i < this.graph.cols; i++) {
      let col = [];
      
      // iterate over rows
      for (let j = 0; j < this.graph.rows; j++) {

        // count obstacles at cell i, j
        let obsCount = this.countObstacles(grid, i, j);

        // if it's >= 4, set to 1
        let newCell = obsCount >= 4 ? 1 : 0;
        col.push(newCell);
      }

      nextGrid.push(col);

    }
    return nextGrid;

  }

  // Count surrounding obstacle cells or tiles
  countObstacles(grid, i, j) {
    let count = 0;

    // Iterate over surrounding tiles/cells
    // di and dj are offset indices of i, j
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {

        // get neighbour indices
        let ni = i + di;
        let nj = j + dj;

        // if not looking at the current cell
        if (!(di === 0 && dj === 0)) {

          // if ni, nj is not in the grid OR it is an obstacle
          if (!this.inGrid(ni, nj) || grid[ni][nj] === 1) {

            // increment coutner
            count++;
          }
        }
      }
    }
    return count;
  }
  
  // Validate to ensure all ground nodes are connected (BFS)
  validate() {

    // record reachable nodes
    let reachable = new Set();

    // get our ground nodes
    let groundNodes = this.graph.nodes.filter(n => n.type === MapNode.Type.Ground);

    // pick an arbitrary ground node to start from
    let start = groundNodes[0];
    let queue = [start];
    reachable.add(start.id);

    // while there are nodes to look at
    while (queue.length > 0) {

      // shift is basically dequeue
      // removes element at index 0
      let current = queue.shift();
      
      // iterate over edges
      for (let edge of current.edges) {

        // if not already in our reachable, 
        // add to reachable and our queue to look at later
        if (!reachable.has(edge.node.id)) {
          reachable.add(edge.node.id);
          queue.push(edge.node);
        }
      }
    }
    // this is valid if the ground nodes size is the same as reachable size
    return groundNodes.length === reachable.size;
  }

}









