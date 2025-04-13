import * as THREE from 'three';
import { BaseEnemy } from './BaseEnemy.js';
import { State } from '../World/State.js';
import {VectorUtil} from "../Utils/VectorUtil";


export class ChasingEnemy extends BaseEnemy {

    constructor(player, gameMap) {
        super(player, gameMap);
        this.state = new PathingToPlayer();
        this.state.enterState(this);
        this.useCollision = false;

    }


    switchState(state) {
        this.state = state;
        this.state.enterState(this);
    }


    update(deltaTime, player, gameMap) {
        this.state.updateState(this, player, gameMap);
        // Update acceleration via velocity
        this.velocity.addScaledVector(this.acceleration, deltaTime);
        if (this.velocity.length() > this.topSpeed) {
            this.velocity.setLength(this.topSpeed);
        }


        // Point in the direction of movement
        if (this.velocity.length() > 0.1) {
            let angle = Math.atan2(this.velocity.x, this.velocity.z);
            this.gameObject.rotation.y = angle;
        }

        // Update velocity via location
        if (this.useCollision) {
            this.handleCollision(this.location,
              VectorUtil.add(VectorUtil.multiplyScalar(this.velocity, deltaTime), this.location),
              gameMap,
              deltaTime)
        }
        else {
            this.location.addScaledVector(this.velocity, deltaTime);
        }

        this.gameObject.position.copy(this.location);

        this.acceleration.setLength(0);
    }

}


export class PathingToPlayer extends State {

    enterState() {
        console.log("PathingToPlayer");
    }  


    updateState(enemy, player, gameMap) {
        this.useCollision = false;
        let distance = enemy.location.distanceTo(player.location);

        // Changes to evade state if the enemy is too close to the player
        if (distance < enemy.size * 5) {
            enemy.switchState(new EvadeFromPlayer());
        }

        // Shoot at the enemy if they are within a certain distance
        if (distance < enemy.size * 25) {
            enemy.shootAtPlayer(player);
        }

        // A* should be called in main to avoid inefficiency of every enemy calling it
        // path will be passed to each NPC via update

        // Create a start and end for the path
        let start = gameMap.quantize(enemy.location);
        let end = gameMap.quantize(player.location);

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
        enemy.useCollision = true;
        let distance = enemy.location.distanceTo(player.location);

        // Changes to A* pathfinding state if the enemy is too far away from the player
        if (distance > enemy.size * 15) {
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
