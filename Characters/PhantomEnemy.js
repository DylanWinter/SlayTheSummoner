import * as THREE from 'three';
import { BaseEnemy } from './BaseEnemy.js';
import { State } from '../World/State.js';
import {VectorUtil} from "../Utils/VectorUtil";
import {Vector3} from "three";
import {Projectile} from "./Projectile";
import {deltaTime, distance} from "three/tsl";


export class PhantomEnemy extends BaseEnemy {

    constructor() {
        super();
        this.useCollision = false;
        this.projectileSpeed = 25;

        this.fireCooldown = 1;
        this.fireTimer = this.fireCooldown;
        this.topSpeed = 5;
        this.damage = 1;
        this.health = 7;
        this.loadModel("Assets/Phantom.glb", new THREE.MeshStandardMaterial({
            color: "black",
            transparent: true,
            opacity: 0.4
        }))
    }


    switchState(state) {
        this.state = state;
        this.state.enterState(this);
    }


    update(deltaTime, player, gameMap) {
        super.update(deltaTime, player, gameMap);
        this.acceleration = this.seek(player.location)

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

        this.location.addScaledVector(this.velocity, deltaTime);

        this.gameObject.position.copy(this.location);

        this.handleCollisionWithPlayer(player);
        this.acceleration.setLength(0);
    }

    handleCollisionWithPlayer(player) {
        if (this.location.distanceTo(player.location) <= player.hitboxSize) {
            this.die();
            player.takeDamage(this.damage);
        }
    }

}
