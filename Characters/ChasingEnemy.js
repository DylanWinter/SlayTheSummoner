import * as THREE from 'three';
import { BaseEnemy } from './BaseEnemy.js';
import { State } from '../World/State.js';
import {VectorUtil} from "../Utils/VectorUtil";
import {Vector3} from "three";
import {Projectile} from "./Projectile";


export class ChasingEnemy extends BaseEnemy {

    constructor() {
        super();
        this.state = new Wandering();
        this.state.enterState(this);
        this.useCollision = false;
        this.projectileSpeed = 25;

        this.fireCooldown = 1;
        this.fireTimer = this.fireCooldown;
        this.fleeRange = 15;
        this.range = 35;
        this.health = 4;

        this.loadModel("Assets/Skeleton_Rogue.glb");
    }


    switchState(state) {
        this.state = state;
        this.state.enterState(this);
    }

    // Main update; called every frame
    update(deltaTime, player, gameMap) {
        super.update(deltaTime, player, gameMap);
        this.state.updateState(this, player, gameMap, deltaTime);

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

        // For fleeing
        if (this.useCollision) {
            this.handleCollision(this.location,
              VectorUtil.add(VectorUtil.multiplyScalar(this.velocity, deltaTime), this.location),
              gameMap,
              deltaTime)
        }
        // For pathfinding
        else {
            this.location.addScaledVector(this.velocity, deltaTime);
        }

        this.gameObject.position.copy(this.location);

        this.acceleration.setLength(0);
    }


    // Fires a projectile at the player
    shootAtPlayer(player, gameMap){
        let direction = VectorUtil.sub(player.location, this.location).normalize();
        let proj = new Projectile(this.location, direction, this.projectileSpeed, false);
        gameMap.gameObject.parent.add(proj.gameObject);
        gameMap.projectiles.push(proj);
    }
}



// Default wandering state; wanders aimlessly
export class Wandering extends State {

    enterState(enemy) {
        enemy.useCollision = true;
        console.log("Wandering");
    } 

    updateState(enemy, player, gameMap, deltaTime) {
        let distance = enemy.location.distanceTo(player.location);

        let steer = enemy.wander();
        enemy.applyForce(steer);

        // Switch to A* pathfinding if the player is close enough
        if (distance < enemy.range) {
            enemy.switchState(new PathingToPlayer());
        }
    }

}


// Uses A* pathfinding to approach the player
export class PathingToPlayer extends State {

    enterState(enemy) {
        console.log("PathingToPlayer");
    }  


    updateState(enemy, player, gameMap, deltaTime) {
        let distance = enemy.location.distanceTo(player.location);

        // Changes to Flee state if the enemy is too close to the player
        if (distance < enemy.fleeRange) {
            enemy.switchState(new FleeFromPlayer());
        }

        // Shoot at the enemy if they are within a certain distance
        if (distance < enemy.range) {
            if (enemy.fireTimer <= 0) {
                enemy.shootAtPlayer(player, gameMap);
                enemy.fireTimer = enemy.fireCooldown;
            }
            else {
                enemy.fireTimer -= deltaTime;
            }
        }

        // Switch to wander state if the player is too far away
        else if (distance > enemy.range * 3) {
            enemy.switchState(new Wandering());
        }
        

        // A* Pathfinding
        // Create a start and end for the path
        let start = gameMap.quantize(enemy.location);
        let end = gameMap.quantize(player.location);

        // Call path find on start to end
        let path = gameMap.pathFind(start, end);

        let steer = enemy.simpleFollow(path);
        enemy.applyForce(steer);
        this.useCollision = false;
    }
    
}


// Runs away from the player
export class FleeFromPlayer extends State {

    enterState(enemy) {
        enemy.useCollision = true;
        console.log("FleeFromPlayer");
    }


    updateState(enemy, player, gameMap, deltaTime) {
        let distance = enemy.location.distanceTo(player.location);

        // Changes to A* pathfinding state if the enemy is too far away from the player
        if (distance > enemy.fleeRange) {
            enemy.switchState(new PathingToPlayer());
        }

        // Shoot at the enemy if they are within a certain distance
        if (distance < enemy.range) {
            if (enemy.fireTimer <= 0) {
                enemy.shootAtPlayer(player, gameMap);
                enemy.fireTimer = enemy.fireCooldown;
            }
            else {
                enemy.fireTimer -= deltaTime;
            }
        }

        let steer = enemy.flee(player.location);
        enemy.applyForce(steer);
    }

}
