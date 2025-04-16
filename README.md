# Slay the Summoner - By Joel Hicks and Dylan Winter
A dungeon crawler/bullet hell game about slaying an evil summoner. Final project for COMP4303 - AI in Computer Games. Written using Three.js.

## Setup

- Install three.js and vite in the local directory of the game using npm. Use the following commands: `npm install three` and `npm install vite`

- Now, type the following command: `npx vite`

- This will host the game on a local server. The address you must type into your browser is displayed in the terminal. It is by default `http://localhost:5173/`.

## How to Play

- The keys W, A, S, D control your character's up, left, right and down movement respectively.

- Left click shoots a projectile. Shoot the enemies to kill them, and dodge their attacks to survive!

- Face off against four enemy types: *Phantoms* who will relentlessly chase you through walls, 
  *Skeleton Archers* who will fire arrows from a distance, *Turrets* who do not move but rapidly fire arrows, and of course the mysterious *Summoner* himself. 

- Each level contains a warp to the next level, marked by a green square. You must find it to proceed.

- When enemies are defeated, they may randomly drop upgrade items. Don't neglect exploration, or you may find yourself too weak to fight the final boss!
  Red items will increase your damage, blue items will increase your max health and green items will heal you. 


## Implemented Topics

1. Complex Movement Algorithms
	- Some enemy NPCs will use **path following** to find their way to you.
	- Skeleton Archers (`ChasingEnemy.js`) will use to A* to generate a path to the player when in range, and will follow that path using simple path following. 

2. Decision Making
	- Enemy NPCs will use **state machines** to decide what to do based on their distance from you and their health.
	- Skeleton Archers (`ChasingEnemy.js`) will make decisions based on distance from the player
 		- When far away, they will wander.
   		- At medium distances, they will move towards the player and fire arrows.
     		- When too close, they will flee from the player.
       - The Summoner (`BossEnemy.js`) will make decisions based on its' remaining health.
       		- It will move through three distinct phases during the fight. 	 

3. Pathfinding
	- Some enemy NPCs will use **A\* pathfinding** to find a route to you.
	- Skeleton Archers (`ChasingEnemy.js`) will use to A* to generate a path to the player when in range.

4. Procedural Content Generation
	- Each level is procedurally generated using **cave generation via cellular automata** (`CaveGenerator.js`).

5. Simple Movement Algorithms
	- Some enemy NPCs will use the **wander** algorithm to meander around the map before you are within their range.
	- Skeleton Archers (`ChasingEnemy.js`) will simply wander around the map if the player is not within range.

## Acknowledgements
- Player and enemy assets from [KayKit](https://kaylousberg.itch.io/) on Itch.
- Environment textures from [Freepik](https://www.freepik.com/).
