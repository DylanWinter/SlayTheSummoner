import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';
import { GameMap } from "./GameMap";
import {BaseEnemy} from "../Characters/BaseEnemy";
import {ChasingEnemy} from "../Characters/ChasingEnemy";
import {TurretEnemy} from "../Characters/TurretEnemy";
import {PhantomEnemy} from "../Characters/PhantomEnemy";
import {BossEnemy} from "../Characters/BossEnemy";


export class LevelManager {
  constructor(scene) {
    this.scene = scene;
    this.gameMap = new GameMap();
    this.nextLevel = 0;

    this.levels = [
      {type: 'boss', groundColor: 0xDDDDDD, obstacleColor: 0x555555, enemies: ['phantom', "phantom"]},
      {type: 'default', groundColor: 0x4169e1, obstacleColor: 0xDC143C, enemies: []},
      {type: 'default', groundColor: 0xDDDDDD, obstacleColor: 0x555555, enemies: []},
      {type: 'boss', groundColor: 0xDDDDDD, obstacleColor: 0x555555, enemies: []},
    ]
  }

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

  instantiateEnemies() {
    let enemyData = this.levels[this.nextLevel].enemies;
    let enemies = [];
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


}
