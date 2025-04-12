import * as THREE from 'three';
import { VectorUtil } from '../Utils/VectorUtil.js';
import { GameMap } from "./GameMap";


export class LevelManager {
  constructor(scene) {
    this.scene = scene;
    this.gameMap = new GameMap();
    this.currentLevel = 0;

    this.levels = [
      {type: 'default', groundColor: 0xDDDDDD, obstacleColor: 0x555555},
      {type: 'default', groundColor: 0x4169e1, obstacleColor: 0xDC143C},
      {type: 'default', groundColor: 0xDDDDDD, obstacleColor: 0x555555},
      {type: 'boss', groundColor: 0xDDDDDD, obstacleColor: 0x555555},
    ]
  }

  loadNextLevel() {
    this.scene.remove(this.gameMap.gameObject);
    let levelInfo = this.levels[this.currentLevel]
    if (levelInfo.type === 'default') {
      this.gameMap = new GameMap(levelInfo.groundColor, levelInfo.obstacleColor);
    }
    else if (levelInfo.type === 'boss') {
      console.log("Boss fight!");
    }
    this.currentLevel += 1;
    this.scene.add(this.gameMap.gameObject);
  }


}