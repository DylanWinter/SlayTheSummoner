import * as THREE from 'three';
import { BaseEnemy } from './BaseEnemy.js';
import { State } from '../World/State.js';
import {VectorUtil} from "../Utils/VectorUtil";


export class TurretEnemy extends BaseEnemy {

    constructor(player, gameMap) {
        super(player, gameMap);
        this.state = new ScanningForPlayer();
        this.state.enterState(this);
        this.useCollision = false;

    }


    switchState(state) {
        this.state = state;
        this.state.enterState(this);
    }


    update(deltaTime, player, gameMap) {
        super.update(deltaTime, player, gameMap);
        this.state.updateState(this, player, gameMap);
    }

    shootAtPlayer(player, gameMap) {

    }

}


export class ScanningForPlayer extends State {

    enterState() {
        console.log("ScanningForPlayer");
    }  


    updateState(enemy, player, gameMap) {
        let distance = enemy.location.distanceTo(player.location);

        // Changes to shooting state if the player is close enough and is within line of sight
        if (distance < enemy.size * 30) { // add an and to this if statement for LOS check
            enemy.switchState(new ShootingAtPlayer());
        }
    }
    
}


export class ShootingAtPlayer extends State {

    enterState() {
        console.log("ShootingAtPlayer");
    }

    
    updateState(enemy, player, gameMap) {
        let distance = enemy.location.distanceTo(player.location);

        // Changes to scanning state if player is too far away or breaks line of sight
        if (distance > enemy.size * 30) { // add an or to this if statement for LOS check
            enemy.switchState(new ScanningForPlayer());
        }

        else {
            enemy.shootAtPlayer(player);
        }
    }

}
