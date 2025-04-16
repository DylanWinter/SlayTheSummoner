import * as THREE from 'three';
import { BaseEnemy } from './BaseEnemy.js';
import { State } from '../World/State.js';
import {VectorUtil} from "../Utils/VectorUtil";
import {Vector3} from "three";
import {Projectile} from "./Projectile";


export class BossEnemy extends BaseEnemy {

    constructor(levelManager) {
        super();
        this.levelManager = levelManager;
        this.useCollision = false;
        this.projectileSpeed = 25;

        this.fireCooldown = 1;
        this.fireTimer = this.fireCooldown;
        this.fleeRange = 10;
        this.range = 100; // the boss will always shoot at the player unless they are very far away somehow
        this.maxHealth = 50;
        this.health = this.maxHealth;
        this.size = 3;
        this.gameObject.scale.set(this.size, this.size, this.size); // Triples the size
        this.state = new Phase1();
        this.state.enterState(this);

        this.loadModel("Assets/Skeleton_Mage.glb");
    }


    switchState(state) {
        this.state = state;
        this.state.enterState(this);
    }


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

    shootAtPlayer(player, gameMap){
        let direction = VectorUtil.sub(player.location, this.location).normalize();
        let proj = new Projectile(this.location, direction, this.projectileSpeed, false);
        gameMap.gameObject.parent.add(proj.gameObject);
        gameMap.projectiles.push(proj);
    }

    die() {
        super.die();

        // Creates a victory screen that resets the game after 5 seconds
        const winScreen = document.getElementById('win-screen');
        winScreen.classList.add('show');
        setTimeout(() => {
          location.reload();
        }, 5000);
    }
}


export class Phase1 extends State {

    enterState(enemy) {
        enemy.useCollision = true;

        console.log("Phase1");
    }  


    updateState(enemy, player, gameMap, deltaTime) {
        let distance = enemy.location.distanceTo(player.location);

        // Changes to Phase 2 when 66% health is reached
        if (enemy.health <= enemy.maxHealth * 0.66) {
            enemy.switchState(new Phase2());
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

        if (distance < enemy.fleeRange) {
            let steer = enemy.flee(player.location);
            enemy.applyForce(steer);
        }
        else if (distance > 30) {
            let steer = enemy.seek(player.location);
            enemy.applyForce(steer);
        }
    }
    
}


export class Phase2 extends State {

    enterState(enemy) {

        // Boss fires faster and moves faster
        enemy.fireCooldown = 0.75;
        enemy.topSpeed = 35;
        enemy.maxForce = 30;

        // Spawns two chasing enemies to the left and right of the boss
        let spawnPosition = enemy.location.clone().add(new THREE.Vector3(5, 0, 0));
        enemy.levelManager.instantiateEnemy('chasing', spawnPosition)
        spawnPosition = enemy.location.clone().add(new THREE.Vector3(-5, 0, 0));
        enemy.levelManager.instantiateEnemy('chasing', spawnPosition)


        console.log("Phase2");
    }


    updateState(enemy, player, gameMap, deltaTime) {
        let distance = enemy.location.distanceTo(player.location);

        // Changes to Phase 3 when 33% health is reached
        if (enemy.health <= enemy.maxHealth * 0.33) {
            enemy.switchState(new Phase3());
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

        if (distance < enemy.fleeRange) {
            let steer = enemy.flee(player.location);
            enemy.applyForce(steer);
        }
        else if (distance > 20) { // more aggression
            let steer = enemy.seek(player.location);
            enemy.applyForce(steer);
        };
    }

}



export class Phase3 extends State {

    enterState(enemy) {
        enemy.fireCooldown = 0.25;
        enemy.topSpeed = 70;
        enemy.maxForce = 60;

        // Spawns two chasing enemies to the bottom left and bottom right of the boss
        let spawnPosition = enemy.location.clone().add(new THREE.Vector3(-5, 0, 5));
        enemy.levelManager.instantiateEnemy('chasing', spawnPosition)

        spawnPosition = enemy.location.clone().add(new THREE.Vector3(5, 0, 5));
        enemy.levelManager.instantiateEnemy('chasing', spawnPosition)

        // Spawns two phantom enemies to the top left and top right of the boss
        spawnPosition = enemy.location.clone().add(new THREE.Vector3(-5, 0, -5));
        enemy.levelManager.instantiateEnemy('phantom', spawnPosition)

        spawnPosition = enemy.location.clone().add(new THREE.Vector3(5, 0, -5));
        enemy.levelManager.instantiateEnemy('phantom', spawnPosition)

        console.log("Phase3");
    }


    updateState(enemy, player, gameMap, deltaTime) {
        let distance = enemy.location.distanceTo(player.location);


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

        if (distance < enemy.fleeRange / 2) { // will get very close
            let steer = enemy.flee(path);
            enemy.applyForce(steer);
        }
        else if (distance > 15) { // more aggression
            let steer = enemy.seek(player.location);
            enemy.applyForce(steer);
        }
    }

}
