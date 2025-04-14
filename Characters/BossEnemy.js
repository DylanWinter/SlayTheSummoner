import * as THREE from 'three';
import { BaseEnemy } from './BaseEnemy.js';
import { State } from '../World/State.js';
import {VectorUtil} from "../Utils/VectorUtil";
import {Vector3} from "three";
import {Projectile} from "./Projectile";


export class BossEnemy extends BaseEnemy {

    constructor() {
        super();
        this.state = new Phase1();
        this.state.enterState(this);
        this.useCollision = false;
        this.projectileSpeed = 25;

        this.fireCooldown = 1;
        this.fireTimer = this.fireCooldown;
        this.range = 100; // the boss will always shoot at the player unless they are very far away somehow
        this.maxHealth = 200;
        this.health = 200;
        this.size = 3;
        this.gameObject.scale.set(3, 1, 3); // Triples the size
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
}


export class Phase1 extends State {

    enterState(enemy) {
        enemy.useCollision = true;

        // Spawns two turret enemies to the left and right of the boss
        let spawnPosition = enemy.location.clone().add(new THREE.Vector3(-5, 0, 0));
        instantiateEnemy(turret, spawnPosition)
        spawnPosition = enemy.location.clone().add(new THREE.Vector3(5, 0, 0));
        instantiateEnemy(turret, spawnPosition)

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

        if (distance < 10) {
            let steer = enemy.flee(path);
            enemy.applyForce(steer);
        }
        else if (distance < 50) {
            let steer = enemy.seek(player.location);
            enemy.applyForce(steer);
        }
    }
    
}


export class Phase2 extends State {

    enterState(enemy) {

        // Boss fires faster and moves faster
        this.fireCooldown = 0.75;
        enemy.topSpeed = 20;
        enemy.maxForce = 25;

        // Spawns two turret enemies above and under the boss
        let spawnPosition = enemy.location.clone().add(new THREE.Vector3(0, 0, -5));
        instantiateEnemy('turret', spawnPosition)
        spawnPosition = enemy.location.clone().add(new THREE.Vector3(0, 0, 5));
        instantiateEnemy('turret', spawnPosition)

        // Spawns two chasing enemies to the left and right of the boss
        spawnPosition = enemy.location.clone().add(new THREE.Vector3(5, 0, 0));
        instantiateEnemy('chasing', spawnPosition)
        spawnPosition = enemy.location.clone().add(new THREE.Vector3(-5, 0, 0));
        instantiateEnemy('chasing', spawnPosition)


        console.log("Phase2");
    }


    updateState(enemy, player, gameMap, deltaTime) {
        let distance = enemy.location.distanceTo(player.location);

        // Changes to Phase 3 when 33% health is reached
        if (enemy.health <= enemy.maxHealth * 0.33) {
            enemy.switchState(new Phase3());
        }

        // Shoot at the enemy if they are within a certain distance
        if (distance < this.range) {
            if (enemy.fireTimer <= 0) {
                enemy.shootAtPlayer(player, gameMap);
                enemy.fireTimer = enemy.fireCooldown;
            }
            else {
                enemy.fireTimer -= deltaTime;
            }
        }

        if (distance < 10) {
            let steer = enemy.flee(path);
            enemy.applyForce(steer);
        }
        else if (distance < 20) { // more aggression
            let steer = enemy.seek(player.location);
            enemy.applyForce(steer);
        };
    }

}



export class Phase3 extends State {

    enterState(enemy) {
        this.fireCooldown = 0.25;
        enemy.topSpeed = 40;
        enemy.maxForce = 35;

        // Spawns four turret enemies above, under, left and right of the boss
        let spawnPosition = enemy.location.clone().add(new THREE.Vector3(0, 0, -5));
        instantiateEnemy('turret', spawnPosition)

        spawnPosition = enemy.location.clone().add(new THREE.Vector3(0, 0, 5));
        instantiateEnemy('turret', spawnPosition)

        spawnPosition = enemy.location.clone().add(new THREE.Vector3(-5, 0, 0));
        instantiateEnemy('chasing', spawnPosition)

        spawnPosition = enemy.location.clone().add(new THREE.Vector3(-5, 0, 0));
        instantiateEnemy('chasing', spawnPosition)

        // Spawns two chasing enemies to the bottom left and bottom right of the boss
        spawnPosition = enemy.location.clone().add(new THREE.Vector3(-5, 0, 5));
        instantiateEnemy('chasing', spawnPosition)

        spawnPosition = enemy.location.clone().add(new THREE.Vector3(5, 0, 5));
        instantiateEnemy('chasing', spawnPosition)

        // Spawns two phantom enemies to the top left and top right of the boss
        spawnPosition = enemy.location.clone().add(new THREE.Vector3(-5, 0, -5));
        instantiateEnemy('chasing', spawnPosition)

        spawnPosition = enemy.location.clone().add(new THREE.Vector3(5, 0, -5));
        instantiateEnemy('chasing', spawnPosition)

        console.log("Phase3");
    }


    updateState(enemy, player, gameMap, deltaTime) {
        let distance = enemy.location.distanceTo(player.location);


        // Shoot at the enemy if they are within a certain distance
        if (distance < this.range) {
            if (enemy.fireTimer <= 0) {
                enemy.shootAtPlayer(player, gameMap);
                enemy.fireTimer = enemy.fireCooldown;
            }
            else {
                enemy.fireTimer -= deltaTime;
            }
        }

        if (distance < 5) { // will get very close
            let steer = enemy.flee(path);
            enemy.applyForce(steer);
        }
        else if (distance < 20) {
            let steer = enemy.seek(player.location);
            enemy.applyForce(steer);
        };
    }

}