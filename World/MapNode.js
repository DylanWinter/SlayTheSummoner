export class MapNode {

    // Enum-like object
    static Type = Object.freeze({
        Ground: Symbol("ground"),
        Obstacle: Symbol("obstacle"),
        Exit: Symbol("exit")
    });
  

    // MapNode constructor
    constructor(id, i, j, type, maxHealth = 50) {
        this.id = id;
        this.i = i;
        this.j = j;
        this.type = type;
        this.edges = [];

        if (this.type === MapNode.Type.Obstacle) {
            this.maxHealth = maxHealth;
        }
    }
  

    // Adds an edge to the node
    addEdge(node, cost) {
        this.edges.push({node: node, cost: cost});
    }
  

    // Tries to add an edge to the node
    tryAddEdge(node, cost) {
        if (node.isTraversable()) {
            this.addEdge(node, cost);
        }
    }


    // Checks if the node can be traversed
    isTraversable() {
        return this.type === MapNode.Type.Ground || this.type === MapNode.Type.Exit;
    }


    // Checks if the node can be destroyed, i.e. if it has health
    isDestructible() {
        return this.hasOwnProperty('maxHealth')
    }


    // Checks if the node is an exit
    isExit() {
        return this.type === MapNode.Type.Exit;
    }
  }