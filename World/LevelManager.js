import { GameMap } from "./GameMap";
import {BaseEnemy} from "../Characters/BaseEnemy";
import {ChasingEnemy} from "../Characters/ChasingEnemy";
import {TurretEnemy} from "../Characters/TurretEnemy";
import {PhantomEnemy} from "../Characters/PhantomEnemy";
import {BossEnemy} from "../Characters/BossEnemy";
import { Item } from "./Item.js";


export class LevelManager {
  constructor(scene) {
    this.scene = scene;
    this.gameMap = new GameMap();
    this.nextLevel = 0;

    this.levels = [
      {type: 'default', groundColor: 0xFFFFFF, obstacleColor: 0x555555, itemAmount: 4,
        enemies: ['phantom', 'phantom','phantom','phantom','phantom', 'turret', 'turret', 'turret']},
      {type: 'default', groundColor: 0x4169e1, obstacleColor: 0xDC143C, itemAmount: 5,
        enemies: ['phantom', 'phantom', 'turret', 'turret', 'turret', 'turret', 'chasing', 'chasing', 'chasing']},
      {type: 'default', groundColor: 0xDDDDDD, obstacleColor: 0x555555, itemAmount: 6,
        enemies: ['phantom', 'phantom', 'phantom', 'chasing', 'chasing', 'chasing', 'chasing', 'chasing', 'chasing', 'chasing']},
      {type: 'boss', groundColor: 0xDDDDDD, obstacleColor: 0x555555,
        enemies: ['boss']},
    ]
  }

  // Loads the next level in the list
  loadNextLevel() {
    this.scene.remove(this.gameMap.gameObject);
    let levelInfo = this.levels[this.nextLevel]
    if (levelInfo.type === 'default') {
      this.gameMap = new GameMap(levelInfo.groundColor, levelInfo.obstacleColor);
    }
    else if (levelInfo.type === 'boss') {
      this.gameMap = new GameMap(levelInfo.groundColor, levelInfo.obstacleColor,
        150, 150, false);
    }
    this.scene.add(this.gameMap.gameObject);
  }

  // Spawns all enemies in the level data
  instantiateEnemies() {
    let enemyData = this.levels[this.nextLevel].enemies;
    for (let enemyType of enemyData) {
      let enemy = this.instantiateEnemy(enemyType)
    }
  }

  // Instantiates a single enemy. If a Vector3 pos if given, spawns it at that point. Otherwise, chooses a random node.
  instantiateEnemy(type, pos=null) {
    let spawn;
    let enemy;

    if (!pos) {
      spawn = this.gameMap.mapGraph.getRandomGroundNode();
    }
    else {
      spawn = this.gameMap.quantize(pos);
    }

    switch (type)
    {
      case 'base':
        enemy = new BaseEnemy();
        break;
      case 'chasing':
        enemy = new ChasingEnemy();
        break;
      case 'turret':
        enemy = new TurretEnemy();
        break;
      case 'phantom':
        enemy = new PhantomEnemy();
        break;
      case 'boss':
        enemy = new BossEnemy(this);
        break;
      default:
        console.log("Invalid enemy type in instantiateEnemies:", type);
        break;
    }

    this.gameMap.enemies.push(enemy);
    enemy.location = (this.gameMap.localize(spawn));
    this.scene.add(enemy.gameObject);
    return enemy;
  }

  incrementNextLevel() {
    this.nextLevel += 1;
  }

  // Spawns all items in the level data
  instantiateItems() {
    let itemData = this.levels[this.nextLevel].itemAmount;
    for (let i = 0; i < itemData; i++) {
      let item = this.instantiateItem()
    }
  }

  instantiateItem() {
    let spawn = this.gameMap.mapGraph.getRandomGroundNode();;
  
    // Weighted random selection
    let rand = Math.random();
    let type;

    if (rand < 0.5) {
      type = Item.Type.Heal; // 50% chance of a heal spawning
    } 
    else if (rand < 0.75) {
      type = Item.Type.StrengthUp; // 25% chance of a strengthUp spawning
    } 
    else {
      type = Item.Type.MaxHealthUp; // 25% chance of a maxHealthUp spawning
    }
  
    let item = new Item(type);

    this.gameMap.items.push(item);
    item.location = this.gameMap.localize(spawn);
    this.scene.add(item.gameObject);

    return item;
    }
  

}
