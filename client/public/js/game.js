var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var score = Math.random();



var keys, localPlayer, remotePlayers,socket;

var background,projectiles,enemy,coin;

var enemies;

function init() {
   canvas.width = window.innerWidth-10;
   canvas.height = window.innerHeight-10;

   keys = new Keys();
   var startX = Math.round(Math.random()*(canvas.width-5)),
       startY = Math.round(Math.random()*(canvas.height-5));
	var typeShip = Math.floor(Math.random() * 3) + 1;
   // Initialise the local player
   // Create an object
   background = new Background('water.png', 64, 64);
	switch(typeShip) {
	case 1:
		localPlayer = new Player('black-sprite.png', 186, 186,2,startX, startY, 1);
		localPlayer.setType(1);
		break;
	case 2:
		localPlayer = new Player('red-sprite.png', 186, 186,2,startX, startY, 2);
		localPlayer.setType(2);
		break;
	default:
		localPlayer = new Player('green-sprite.png', 186, 186,2,startX, startY, 3);
		localPlayer.setType(3);
		break;
	}
	localPlayer.setHp(100);
	localPlayer.setScore(0);
   localPlayer.projectileTimer = Date.now();
   localPlayer.shootDelay = 200;
   projectiles = [];
   //enemy = new Sprite ('enemy.png', 50,50, Math.random() * canvas.width, Math.random() * canvas.height, 200, true);
   //coin = new Sprite ('coin.png', 25, 25,Math.random() * canvas.width, Math.random() * canvas.height, 0, false);


   //localPlayer = new Player(startX, startY);
   socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});

   // Initialise remote players array
   remotePlayers = [];

   //Initilise enemies array
   enemies =[];

   // Start listening for events
   setEventHandlers();
}

var setEventHandlers = function() {
   // Keyboard
   window.addEventListener("keydown", onKeydown, false);
   window.addEventListener("keyup", onKeyup, false);

   // Window resize
   window.addEventListener("resize", onResize, false);

   // Socket connection successful
   socket.on("connect", onSocketConnected);

   // Socket disconnection
   socket.on("disconnect", onSocketDisconnect);

   // New player message received
   socket.on("new player", onNewPlayer);

   // Player move message received
   socket.on("move player", onMovePlayer);

   // Player removed message received
   socket.on("remove player", onRemovePlayer);

   socket.on("new enemy", onNewEnemy);
}

// Keyboard key down
function onKeydown(e) {
   if (localPlayer) {
      keys.onKeyDown(e);
   }
}

// Keyboard key up
function onKeyup(e) {
   if (localPlayer) {
      keys.onKeyUp(e);
   }
}

function onResize(e) {
   // Maximise the canvas
   canvas.width = window.innerWidth-10;
   canvas.height = window.innerHeight-10;
}


// Socket connected
function onSocketConnected() {
   console.log("Connected to socket server");

   // Send local player data to the game server
   socket.emit("new player", 
					{x: localPlayer.getX(), 
					 y: localPlayer.getY(), 
					 state: localPlayer.getState(), 
					 type: localPlayer.getType()});
}

// Socket disconnected
function onSocketDisconnect() {
   console.log("Disconnected from socket server");
}

// New player
function onNewPlayer(data) {
   console.log("New player connected: "+data.id);

	var newPlayer;

   // Initialise the new player
	switch(data.type) {
	case 1:
		newPlayer = new Player('black-sprite.png', 186, 186,2,data.x, data.y, 1);
		break;
	case 2:
		newPlayer = new Player('red-sprite.png', 186, 186,2,data.x, data.y, 2);
		break;
	case 3:
		newPlayer = new Player('green-sprite.png', 186, 186,2,data.x, data.y, 3);
		break;
	}
   newPlayer.id = data.id;

   // Add new player to the remote players array
   remotePlayers.push(newPlayer);
}

// Move player
function onMovePlayer(data) {
   var movePlayer = playerById(data.id);

   // Player not found
   if (!movePlayer) {
      console.log("Player not found: "+data.id);
      return;
   }

   // Update player position
   movePlayer.setX(data.x);
   movePlayer.setY(data.y);
   movePlayer.setState(data.state);
}

// Remove player
function onRemovePlayer(data) {
   var removePlayer = playerById(data.id);

   // Player not found
   if (!removePlayer) {
      console.log("Player not found: "+data.id);
      return;
   }

   // Remove player from array
   remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
}

function onNewEnemy(data) {
   var enemy = new Enemy('enemy.png', 50,50,2,data.x,data.y,data.state);
   enemy.id = data.id;
   enemies.push(enemy);
   console.log("add test enemy");
}

// Class sea background
function Background (image, width, height) {
   this.image = new Image();
   this.image.onload = true;
   this.image.src = image;
   this.width = width;
   this.height = height;
}

function drawBackground (sea) {
   for (l = 0; l < 24; l++) {
      for (i = 0; i < 12; i++)
      {
         ctx.drawImage(
            sea.image,
            l * 64,
            i * 64
         );
      }
   }
}




// Class bullet
function Projectile(x, y, trajectory, size, color, speed) {
   this.x = x;
   this.y = y;
   this.trajectory = trajectory;
   this.size = size;
   this.color = color;
   this.speed = speed;
}

function Trajectory(startX, startY, endX, endY) {
   this.length = Math.sqrt(Math.pow((endX - startX), 2) + Math.pow((endY - startY), 2));
   this.x = (endX - startX) / this.length;
   this.y = (endY - startY) / this.length;
}

function drawSquare(x, y, size, color) {
   ctx.fillStyle = color;
   ctx.fillRect(Math.round(x), Math.round(y), size, size);
}

function updateProjectiles(mod) {
   for (var key in projectiles) {
      projectiles[key].x += projectiles[key].trajectory.x * projectiles[key].speed * mod;
      projectiles[key].y += projectiles[key].trajectory.y * projectiles[key].speed * mod;
      if (projectiles[key].x > canvas.width || projectiles[key].x < 0 || projectiles[key].y > canvas.height || projectiles[key].y < 0) {
         projectiles.splice(key, 1);
      }
   }
}


var mouse = {
   x: 0,
   y: 0,
   down: false
}
window.addEventListener('mousedown', function(e) {
   mouse.down = true;
});
window.addEventListener('mouseup', function(e) {
   mouse.down = false;
});
window.addEventListener('mousemove', function(e) {
   mouse.x = e.clientX - canvas.offsetLeft;
   mouse.y = e.clientY - canvas.offsetTop;
});


// Update function
function update(mod) {
   if (mouse.down && Date.now() - localPlayer.projectileTimer > localPlayer.shootDelay) {
      var trajectory = new Trajectory(localPlayer.x + localPlayer.width / 2, localPlayer.y + 15, mouse.x, mouse.y);
      var projectile = new Projectile(
         localPlayer.x + localPlayer.width / 2,
         localPlayer.y + 15,
         trajectory,
         10,
         '#0f0',
         1000 );
      projectiles.push(projectile);
      localPlayer.projectileTimer = Date.now();
   }
   updateProjectiles(mod);
	// for (var key in projectiles) {
	//      if (
	//         projectiles[key].x < enemy.x + enemy.width &&
	//            projectiles[key].x + enemy.width > enemy.x &&
	//            projectiles[key].y < enemy.y + enemy.height &&
	//            projectiles[key].y + enemy.height > enemy.y
	//      )

	//      {
	//         var x = enemy.x;
	//         var y = enemy.y;
	//         enemy.x = Math.random() * canvas.width;
	//         enemy.y = Math.random() * canvas.height;
	// 		coin.loaded = true;
	// 		coin.x = x;
	// 		coin.y = y;
	//      }
	// }

   // if (65 in keysDown) {
   //    pirate.state = 2; //A
   //    pirate.x -= pirate.speed * mod;
   // }
   // if (87 in keysDown) {
   //    pirate.state = 3; //W
   //    pirate.y -= pirate.speed * mod;
   // }
   // if (68 in keysDown) {
   //    pirate.state = 0; //D
   //    pirate.x += pirate.speed * mod;
   // }
   // if (83 in keysDown) {
   //    pirate.state = 1; //S
   //    pirate.y += pirate.speed * mod;
   // }

   if (localPlayer.update(keys)) {
      // Send local player data to the game server
      //console.log("move player");
      socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY(),state: localPlayer.getState()});
   }

}


// Render
function render() {
   ctx.fillStyle = '#000';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
   drawBackground(background);
   //drawSprite(pirate);
   localPlayer.draw(ctx);

   for (var key in projectiles) {
      drawSquare(projectiles[key].x, projectiles[key].y, projectiles[key].size, projectiles[key].color);
   }

   // Draw the remote players
   var i;
   for (i = 0; i < remotePlayers.length; i++) {
      remotePlayers[i].draw(ctx);
   }

   //Draw the enemies
   for (i =0;i<enemies.length;i++) {
      enemies[i].draw(ctx);
   }

}


// Run
function run() {
   update((Date.now() - time) / 1000);
   render();
   time = Date.now();
}

var time = Date.now();
init();
setInterval(run, 10);
//run();

function playerById(id) {
   
   for (i = 0; i < remotePlayers.length; i++) {
      if (remotePlayers[i].id == id)
         return remotePlayers[i];
   }
   
   return false;
}

function enemyById(id) {
   
   for (i=0;i<enemies.length;i++) {
      if (enemies[i].id==id) {
         return enemies[i];
      }
   }
   return false;
}
