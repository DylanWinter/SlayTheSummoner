import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';
import { GameMap } from "./GameMap";
<<<<<<< HEAD
import {BaseEnemy} from "../Characters/BaseEnemy";
import {ChasingEnemy} from "../Characters/ChasingEnemy";
import {TurretEnemy} from "../Characters/TurretEnemy";
=======
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196


export class LevelManager {
  constructor(scene) {
    this.scene = scene;
    this.gameMap = new GameMap();
<<<<<<< HEAD
    this.nextLevel = 0;

    this.levels = [
      {type: 'default', groundColor: 0xDDDDDD, obstacleColor: 0x555555, enemies: ['chasing']},
=======
    this.currentLevel = 0;

    this.levels = [
      {type: 'default', groundColor: 0xDDDDDD, obstacleColor: 0x555555},
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196
      {type: 'default', groundColor: 0x4169e1, obstacleColor: 0xDC143C},
      {type: 'default', groundColor: 0xDDDDDD, obstacleColor: 0x555555},
      {type: 'boss', groundColor: 0xDDDDDD, obstacleColor: 0x555555},
    ]
  }

  loadNextLevel() {
    this.scene.remove(this.gameMap.gameObject);
<<<<<<< HEAD
    let levelInfo = this.levels[this.nextLevel]
=======
    let levelInfo = this.levels[this.currentLevel]
>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196
    if (levelInfo.type === 'default') {
      this.gameMap = new GameMap(levelInfo.groundColor, levelInfo.obstacleColor);
    }
    else if (levelInfo.type === 'boss') {
      console.log("Boss fight!");
    }
<<<<<<< HEAD
    this.scene.add(this.gameMap.gameObject);
  }

  instantiateEnemies() {
    let enemyData = this.levels[this.nextLevel].enemies;
    let enemies = [];
    for (let enemyType of enemyData) {

      let spawn = this.gameMap.mapGraph.getRandomGroundNode();
      let enemy;

      switch (enemyType)
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
        default:
          console.log("Invalid enemy type in instantiateEnemies:", enemyType);
          break;
      }

      enemy.location = (this.gameMap.localize(spawn));
      enemies.push(enemy);
      this.scene.add(enemy.gameObject);
    }
    return enemies;
  }

  incrementNextLevel() {
    this.nextLevel += 1;
  }

=======
    this.currentLevel += 1;
    this.scene.add(this.gameMap.gameObject);
  }

>>>>>>> 09569f173d74eb506860fb025c031482a1ae5196

}