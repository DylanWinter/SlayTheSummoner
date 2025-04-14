import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';


export class UI {
    constructor(player) {
      this.player = player; // links the UI to the player
      this.healthBarElement = this.createHealthBar();
      this.strengthTextElement = this.createTextElement();
      document.body.appendChild(this.healthBarElement);
      document.body.appendChild(this.strengthTextElement);


      this.updateUI();
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


    // --- Text elements for stats below the health bar --- //
    createTextElement() {
      const textElement = document.createElement('div');
      textElement.style.position = 'absolute';
      textElement.style.left = '20px'; // positioned on the left side
      textElement.style.color = '#000';
      textElement.style.fontSize = '18px';
      textElement.style.fontWeight = 'bold';
      textElement.style.pointerEvents = 'none';

      // Automatically adjust vertical spacing if a new stat element is appended
      if (!this.lastElementTop) {
        this.lastElementTop = 40; // sets initial top value for the first text element
      }
    
      textElement.style.top = `${this.lastElementTop}px`;

      const box = document.createElement('div');

      box.style.position = 'absolute';
      box.style.left = '20px';
      box.style.top  = `${this.lastElementTop}px`;
      box.style.width = '90px';
      box.style.height = '20px';
      box.style.backgroundColor = 'white';
      box.style.display = 'flex';
      box.style.alignItems = 'center';
      box.style.justifyContent = 'center';

      // Appends the box for the text before the text is created
      document.body.appendChild(box);

      this.lastElementTop += 30; // increments the top value for the next stat element

      return textElement;
    }

    
    updateUI() {
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

        // Updates the health bar text
        this.healthText.textContent = `${this.player.health} / ${this.player.maxHealth}`;

        // Updates strength text
        this.strengthTextElement.textContent = `Strength: ${this.player.strength}`;

    }
    

    update() {
        this.updateUI();
    }
}