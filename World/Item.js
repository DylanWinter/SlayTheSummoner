import * as THREE from 'three';
import {GLTFLoader} from "three/addons";


export class Item {

  static Type = Object.freeze({
    StrengthUp: Symbol("strengthUp"),
    MaxHealthUp: Symbol("maxHealthUp"),
    Heal: Symbol("heal"),
  });

  // To create an item to use in our scene
  constructor(type) {
    this.gameObject = new THREE.Group();

    this.radius = 0.7;

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

    this.loadModel();
  }

  loadModel() {
    const loader = new GLTFLoader();
    let material = new THREE.MeshStandardMaterial({color: this.color});
    loader.load(
      "Assets/bottle_C_brown.gltf",
      (gltf) => {
        this.gameObject.remove(this.mesh);
        this.mesh = gltf.scene;
        // Apply material if given
        if (material) {
          this.mesh.traverse((child) => {
            if (child.isMesh) {
              child.material = material
            }
          });
        }
        this.gameObject.add(this.mesh);
      },
      undefined,
      (error) => {
        console.error('Error while loading player model:', error);
      }
    );
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

  // Checks distance to player, provides buff if within range
  onPickup(player) {
    let distance = this.location.distanceTo(player.location);

    if (distance <= this.radius) {
        if (this.type === Item.Type.StrengthUp) {
            player.changeStrength(1);

            this.gameObject.parent.remove(this.gameObject); // removes the item after it is picked up
            this.isAlive = false;
        }
        else if (this.type === Item.Type.MaxHealthUp) {
            player.changeMaxHealth(1);
            player.heal(1);

            this.gameObject.parent.remove(this.gameObject);
            this.isAlive = false;
        }
        else if (this.type === Item.Type.Heal) {
            if (player.health < player.maxHealth) {
              player.heal(1);

              this.gameObject.parent.remove(this.gameObject);

              this.isAlive = false;
            }
        }
    }
  }

}