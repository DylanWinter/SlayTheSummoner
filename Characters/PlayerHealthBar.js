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
        healthBar.style.pointerEvents = 'none'; // let clicks pass through

        // Create and style the health text
        this.healthText = document.createElement('div');
        this.healthText.style.position = 'absolute';
        this.healthText.style.top = '0';
        this.healthText.style.left = '0';
        this.healthText.style.width = '100%';
        this.healthText.style.height = '100%';
        this.healthText.style.display = 'flex';
        this.healthText.style.alignItems = 'center';
        this.healthText.style.justifyContent = 'center';
        this.healthText.style.pointerEvents = 'none';
        this.healthText.style.color = '#000';
        this.healthText.style.fontWeight = 'bold';

        // Adds the text to the bar
        healthBar.appendChild(this.healthText);
    
        return healthBar;
    }

    
    updateHealthBar() {
        const healthPercentage = this.player.health / this.player.maxHealth; // 0 to 1
        this.healthBarElement.style.width = `${healthPercentage * 100}%`;
    
        // Changes color of the health bar based on health
        if (healthPercentage > 0.5) {
          this.healthBarElement.style.backgroundColor = '#00ff00'; // green when health is good
        } 
        else if (healthPercentage > 0.2) {
          this.healthBarElement.style.backgroundColor = '#ffff00'; // yellow when health is moderate
        } 
        else {
          this.healthBarElement.style.backgroundColor = '#ff0000'; // red when health is low
        }

        // Update the text
        this.healthText.textContent = `${this.player.health} / ${this.player.maxHealth}`;
    }
    

    update() {
        this.updateHealthBar();
    }
}