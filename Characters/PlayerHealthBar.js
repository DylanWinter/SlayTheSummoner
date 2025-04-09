import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';


export class HealthBar {
    constructor(player) {
      this.player = player; // links the health bar to the player
      this.healthBarElement = this.createHealthBar();
      document.body.appendChild(this.healthBarElement);

      this.updateHealthBar();
    }


    // --- Player health bar methods --- //

    createHealthBar() {
        // Creates a div element for the health bar
        const healthBar = document.createElement('div');
        healthBar.style.position = 'absolute';
        healthBar.style.top = '10px';
        healthBar.style.left = '50%';
        healthBar.style.transform = 'translateX(-50%)';
        healthBar.style.height = '20px';
        healthBar.style.transition = 'width 0.2s ease';
    
        return healthBar;
    }

    updateHealthBar() {
        const healthPercentage = this.player.health / this.player.maxHealth; // 0 to 1
        this.healthBarElement.style.width = `${healthPercentage * 100}%`;
    
        // Changes color of the health bar based on health
        if (healthPercentage > 0.5) {
          this.healthBarElement.style.backgroundColor = '#00ff00'; // green when health is good
        } else if (healthPercentage > 0.2) {
          this.healthBarElement.style.backgroundColor = '#ffff00'; // yellow when health is moderate
        } else {
          this.healthBarElement.style.backgroundColor = '#ff0000'; // red when health is low
        }
    }
    
    update() {
        this.updateHealthBar();
    }
}