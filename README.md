Slay the Summoner by Joel Hicks and Dylan Winter


INSTALLATION AND SETUP:

- To make the game playable, install three.js and vite in the local directory of the game (Slay the Summoner) using a command line interface with npm. Use the following commands: "npm install --save three" and "npm install --save-dev vite"

- Now, type the following command: "npx vite"

- This will host the game on a local server. The address you must type into your browser is displayed after the "Local:" text. It is usually "http://localhost:5173/".


HOW TO PLAY:

- The keys W, A, S, D control your character's up, left, right and down movement respectively.

- Left click shoots a projectile. Shoot the enemies to kill them, and dodge their attacks to survive!

- Each level contains a warp to the next level. You must find it to proceed.

- Each level contains powerups and heals that are scattered randomly, and dropped by enemies when killed. Don't neglect exploration, or you may find yourself too weak to fight the final boss!


IMPLEMENTED TOPICS:

1. Path Following
	- Some enemy NPCs will use path following to find their way to you.
	- To see this, move close enough to a ChasingEnemy NPC to make it follow you.
		- If you stay close enough but not too close, it will move towards you, following an efficient path even around obstacles.

2. State Machines
	- Enemy NPCs will use state machines to decide what to do based on their distance from you and their health.
	- To see this, move towards a ChasingEnemy NPC if you are far away, or move away from it if you are close.
		- When you are too far away, it will wander and not shoot.
		- When you are within its range but not too close, it will pathfind to you and shoot.
		- When you move too close, the NPC will flee and shoot.

3. A* Pathfinding Algorithm
	- Some enemy NPCs will use A* pathfinding to find a route to you.
	- To see this, move a significant distance away from a ChasingEnemy NPC and hide behind a solid obstacle, while still being within its range.
		- It will pathfind to you, moving around the obstacles.

4. Procedural Dungeon Generation
	- Each level (apart from the final boss's arena) is procedurally generated.
	- To see this, you can reload the page and watch the environment change into another procedurally generated one.

5. Simple Movement Algorithms
	- Some enemy NPCs will use the wander algorithm to wander around the map before you are within their range.
	- To see this, stay far away from a ChasingEnemy NPC to avoid its detection. You will see it wander using this algorithm.
