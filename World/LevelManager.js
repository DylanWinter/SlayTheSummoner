import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';
import { GameMap } from "./GameMap";
import {BaseEnemy} from "../Characters/BaseEnemy";


export class LevelManager {
  constructor(scene) {
    this.scene = scene;
    this.gameMap = new GameMap();
    this.nextLevel = 0;

    this.levels = [
      {type: 'default', groundColor: 0xDDDDDD, obstacleColor: 0x555555, enemies: ['base']},
      {type: 'default', groundColor: 0x4169e1, obstacleColor: 0xDC143C},
      {type: 'default', groundColor: 0xDDDDDD, obstacleColor: 0x555555},
      {type: 'boss', groundColor: 0xDDDDDD, obstacleColor: 0x555555},
    ]
  }

  loadNextLevel() {
    this.scene.remove(this.gameMap.gameObject);
    let levelInfo = this.levels[this.nextLevel]
    if (levelInfo.type === 'default') {
      this.gameMap = new GameMap(levelInfo.groundColor, levelInfo.obstacleColor);
    }
    else if (levelInfo.type === 'boss') {
      console.log("Boss fight!");
    }
    this.scene.add(this.gameMap.gameObject);
  }

  instantiateEnemies() {
    let enemyData = this.levels[this.nextLevel].enemies;
    let enemies = [];
    for (let enemyType of enemyData) {

      let spawn = this.gameMap.mapGraph.getRandomGroundNode();
      let enemy;

      if (enemyType === 'base') {
        enemy = new BaseEnemy();
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


}