import * as THREE from 'three';
import { BaseEnemy } from './BaseEnemy.js';
import { State } from '../World/State.js';


export class ChasingEnemy extends BaseEnemy {

    constructor(player, gameMap) {
        super(player, gameMap);

        //this.player = player;
        //this.gameMap = gameMap;
        
        this.state = new PathingToPlayer();
        this.state.enterState(this);

    }

    switchState(state) {
        this.state = state;
        this.state.enterState(this);
    }


    update(deltaTime, player, gameMap) {
        this.state.updateState(this, player, gameMap);
        super.update(deltaTime);
    }

}


export class PathingToPlayer extends State {

    enterState() {
        console.log("PathingToPlayer");
    }  

    updateState(enemy, player, gameMap) {
        let distance = enemy.location.distanceTo(player.location);

        // Changes to evade state if the enemy is too close to the player
        if (distance < enemy.size * 5) {
            enemy.switchState(new EvadeFromPlayer());
        }

        // Shoot at the enemy if they are within a certain distance
        if (distance < enemy.size * 25) {
            enemy.shootAtPlayer(player);
        }

        // Checks if A* needs to be recalculated for pathing
        // this will be implemented if calling A* on multiple NPCs is too taxing
        //if (player.checkNodeChange()) {

        // Create a start and end for the path
        let start = enemy.getCurrentMapNode(gameMap);
        let end = player.getCurrentMapNode(gameMap);

        // Call path find on start to end
        let path = gameMap.pathFind(start, end);

        let steer = enemy.simpleFollow(path);
        enemy.applyForce(steer);

    }
    
}


export class EvadeFromPlayer extends State {

    enterState() {
        console.log("EvadeFromPlayer");
    }

    updateState(enemy, player, gameMap) {
        let distance = enemy.location.distanceTo(player.location);

        // Changes to A* pathfinding state if the enemy is too far away from the player
        if (distance > enemy.size * 15) {
            //enemy.stop()
            enemy.switchState(new PathingToPlayer());
        }

        // Shoot at the enemy if they are within a certain distance
        if (distance < enemy.size * 25) {
            enemy.shootAtPlayer(player);
        }


        let steer = enemy.flee(player.location);
        enemy.applyForce(steer);

    }

}
