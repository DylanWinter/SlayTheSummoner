import * as THREE from 'three';


export class Item {

  static Type = Object.freeze({
    StrengthUp: Symbol("strengthUp"),
    MaxHealthUp: Symbol("maxHealthUp"),
    Heal: Symbol("heal"),
  });

  // To create an item to use in our scene
  constructor(type) {

    // Radius used for testing if we are close to recycloBot
    this.radius = 3;

    // Set our type
    this.type = type;

    // Initializing location just in case
    this.location = new THREE.Vector3(0,0,0);

    this.isAlive = true;
    
    // Sets the colour of our item based on type
    switch (type) {
      case (Item.Type.StrengthUp):
        this.color = 'red';
        break;
      case (Item.Type.MaxHealthUp):
        this.color = 'blue';
        break;
      case (Item.Type.Heal):
        this.color = 'green';
        break;
      default:
        console.log("Invalid item type: " + type);
    }

    // Initialize the game object
    let geometry = new THREE.SphereGeometry(this.radius, 16, 16);
    let material = new THREE.MeshStandardMaterial({color: this.color});
    this.gameObject = new THREE.Mesh(geometry, material);
    
  }

  // To update our enemy
  update(deltaTime, player, gameMap) {
    if (!this.isAlive) {
      return;
    }
    this.onPickup(player);
    this.gameObject.position.copy(this.location);
  
  }
  
  // To set the location of our item
  setLocation(location) {
    this.location = location;
    this.gameObject.position.copy(this.location);
  }

  onPickup(player) {
    let distance = this.location.distanceTo(player.location);

    if (distance <= this.radius) {
        if (this.type == Item.Type.StrengthUp) {
            player.changeStrength(1);

            this.gameObject.parent.remove(this.gameObject); // remove the item after it is picked up
            this.isAlive = false;
        }
        else if (this.type == Item.Type.MaxHealthUp) {
            player.changeMaxHealth(1);

            this.gameObject.parent.remove(this.gameObject);
            this.isAlive = false;
        }
        else if (this.type == Item.Type.Heal) {
            if (player.getCurrentHealth == player.getMaxHealth) {
              return; // do nothing if the player is already at full health
            }
            else {
              player.heal(1);
            }
        }


    }
  }

}