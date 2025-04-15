import * as THREE from 'three';
import { BaseEnemy } from './BaseEnemy.js';
import { State } from '../World/State.js';
import {VectorUtil} from "../Utils/VectorUtil";
import {Projectile} from "./Projectile";
import {deltaTime} from "three/tsl";


export class TurretEnemy extends BaseEnemy {

    constructor(player, gameMap) {
        super(player, gameMap);
        this.state = new ScanningForPlayer();
        this.state.enterState(this);
        this.useCollision = false;
        this.range = 55;

        this.projectileSpeed = 25;
        this.fireCooldown = 0.4;
        this.fireTimer = this.fireCooldown;
    }


    switchState(state) {
        this.state = state;
        this.state.enterState(this);
    }


    update(deltaTime, player, gameMap) {
        super.update(deltaTime, player, gameMap);
        this.state.updateState(this, player, gameMap, deltaTime);
    }

    shootAtPlayer(player, gameMap){
        let direction = VectorUtil.sub(player.location, this.location).normalize();
        let proj = new Projectile(this.location, direction, this.projectileSpeed, false);
        gameMap.gameObject.parent.add(proj.gameObject);
        gameMap.projectiles.push(proj);
    }

}


export class ScanningForPlayer extends State {

    enterState() {
        console.log("ScanningForPlayer");
    }  


    updateState(enemy, player, gameMap) {
        let distance = enemy.location.distanceTo(player.location);

        // Changes to shooting state if the player is close enough and is within line of sight

        if (distance < enemy.range) { // add an and to this if statement for LOS check
            enemy.switchState(new ShootingAtPlayer());
        }
    }
    
}


export class ShootingAtPlayer extends State {

    enterState() {
        console.log("ShootingAtPlayer");
    }


    updateState(enemy, player, gameMap, deltaTime) {
        let distance = enemy.location.distanceTo(player.location);

        // Changes to scanning state if player is too far away or breaks line of sight
        if (distance > enemy.range) { // add an or to this if statement for LOS check
            enemy.switchState(new ScanningForPlayer());
        }

        else {
            if (enemy.fireTimer <= 0) {
                enemy.fireTimer = enemy.fireCooldown;
                enemy.shootAtPlayer(player, gameMap);
            }
            else {
                enemy.fireTimer -= deltaTime;
            }
        }
    }

}
