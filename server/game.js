var util = require("util"),               // Utility resources (logging, object inspection, etc)
   io = require("socket.io"),          // Socket.IO
   Player = require("./Player").Player,   // Player class
   Enemy = require("./Enemy").Enemy, // Enemy Class
   Bullet = require("./Bullet").Bullet;

var socket,    // Socket controller
   players, // Array of connected players
   enemies, // Array of enemies
   coins; //Array of items

var bulletID = 0;
var testEnemy = new Enemy(200, 300,0, 1, 1);
var enemyID = 0;
 var testBullet = new Bullet(1,1, 1, 1, 1, 1, 1);

function init() {
   // Create an empty array to store players
   players = [];
   enemies = [];
   coins = [];

   // Set up Socket.IO to listen on port 8000
   socket = io.listen(8000);

   // Configure Socket.IO
   socket.configure(function() {
      
      socket.set("transports", ["websocket"]);
      
      socket.set("log level", 2);
   });

   for (num = 0; num < 30; num++) {
      var w = Math.floor(Math.random() * 1440);
      var h = Math.floor(Math.random() * 470);
      var newEnemy;
      if (num == 4 || num == 8) {
         newEnemy = new Enemy(w, h,0, -1, 1);
      } else if (num == 6) {
         newEnemy = new Enemy(w, h,0, 1, -1);
      } else if (num == 9) {
         newEnemy = new Enemy(w, h,0, -1, -1);
      } else {
         newEnemy = new Enemy(w, h,0, 1, 1);
      }
      newEnemy.id = enemyID;
      enemyID++;     
      enemies.push(newEnemy);
   }

   // Start listening for events
   setEventHandlers();

  
}


var setEventHandlers = function() {
   // Socket.IO
   socket.sockets.on("connection", onSocketConnection);
}

// New socket connection
function onSocketConnection(client) {
   util.log("New player has connected: "+client.id);

   //client.on("connect",addEnemies);

   // Listen for client disconnected
   client.on("disconnect", onClientDisconnect);

   // Listen for new player message
   client.on("new player", onNewPlayer);

   // Listen for move player message
   client.on("move player", onMovePlayer);

   //Listen for player shoot message
   client.on("player shoot", onPlayerShoot);

   client.on('chat', function (data) {
   
      // default value of the name of the sender.
      var sender = data.name;
      
      util.log(sender);

      // broadcast data recieved from the sender
      // to others who are connected, but not 
      // from the original sender.
      client.broadcast.emit('chat', {
         msg : data.message, 
         msgr : sender
      });
   });
   
   // listen for user registrations
   // then set the socket nickname to 
   socket.on('register', function (name) {
   
      // make a nickname paramater for this socket
      // and then set its value to the name recieved
      // from the register even above. and then run
      // the function that follows inside it.
      socket.set('nickname', name, function () {
      
         // this kind of emit will send to all! :D
       
      });
   });

   
   client.on("move enemy", onMoveEnemy);
}

function addEnemies() {
    //Spawn enemy
   var testEnemy = new Enemy(300, 300,0);
   testEnemy.id = 1;
   util.log("add tested enemy");
   this.broadcast.emit("new enemy", 
							  {id: testEnemy.id, 
								x: testEnemy.getX(), 
								y: testEnemy.getY(),
								state: testEnemy.getState()});
}

// Socket client has disconnected
function onClientDisconnect() {
   util.log("Player has disconnected: "+this.id);

   var removePlayer = playerById(this.id);

   // Player not found
   if (!removePlayer) {
      util.log("Player not found: "+this.id);
      return;
   }

   // Remove player from players array
   players.splice(players.indexOf(removePlayer), 1);

   // Broadcast removed player to connected socket clients
   this.broadcast.emit("remove player", {id: this.id});
}

// New player has joined
function onNewPlayer(data) {
   // Create a new player
   var newPlayer = new Player(data.x, data.y,data.state, data.type);
   newPlayer.id = this.id;
   newPlayer.setName(data.name);
   socket.set('nickname', data.name); 

   // Broadcast new player to connected socket clients
   this.broadcast.emit("new player", 
							  {id: newPlayer.id, 
								x: newPlayer.getX(), 
								y: newPlayer.getY(),
								state: newPlayer.getState(),
								type: newPlayer.getType(),
                        name: newPlayer.getName()
							  });

   // Send existing players to the new player
   var i, existingPlayer;
   for (i = 0; i < players.length; i++) {
      existingPlayer = players[i];
      this.emit("new player", 
					 {id: existingPlayer.id, 
					  x: existingPlayer.getX(), 
					  y: existingPlayer.getY(),
					  state: existingPlayer.getState(),
					  type: existingPlayer.getType(),
                 name: existingPlayer.getName()
					 });
   }
      
   // Add new player to the players array
   players.push(newPlayer);

   //Send enemy to the new player
	/*
	var testEnemy = new Enemy(200, 300,0);
   testEnemy.id = 1;
   util.log("add tested enemy");
   this.emit("new enemy", {id: testEnemy.id, x: testEnemy.getX(), y: testEnemy.getY(),state: testEnemy.getState()});
	 */
 //  this.emit("new enemy", {id: 2, x: 150, y: 400,state: 0});
 //  this.emit("new enemy", {id: 3, x: 50, y: 400,state: 0});
	var num, existingEnemy;
	for (num = 0; num < 10; num++) {
		
		this.emit("new enemy", {
			id: enemies[num].id, 
			x: enemies[num].getX(), 
			y: enemies[num].getY(),
			state: enemies[num].getState(),
			mx: enemies[num].getMx(),
			my:enemies[num].getMy()
		});
		
		util.log("add tested enemy" + num);
	}

}

// Player has moved
function onMovePlayer(data) {
   // Find player in array
   var movePlayer = playerById(this.id);

   // Player not found
   if (!movePlayer) {
      util.log("Player not found: "+this.id);
      return;
   }

   // Update player position
   movePlayer.setX(data.x);
   movePlayer.setY(data.y);
   movePlayer.setState(data.state);

   // Broadcast updated position to connected socket clients
   this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(),state: movePlayer.getState()});
}

// Enemy has moved
function onMoveEnemy () {
	var num, existingEnemy;
	for (num = 0; num < enemies.length; num++) {
		existingEnemy = enemies[num];
		var x = existingEnemy.getX();
		var y = existingEnemy.getY();
		var mx = existingEnemy.getMx() ;
		var my = existingEnemy.getMy();

		if (x + mx > 1440 || x + mx < 0)
			mx = -mx;
		if (y + my > 650 || y + my < 0)
			my = -my;
		
		x += mx;
		y += my;

		existingEnemy.setX(x);
		existingEnemy.setY(y);
		existingEnemy.setMx(mx);
		existingEnemy.setMy(my);
		socket.sockets.emit("move enemy", 
								  {id: existingEnemy.id, 
									x: existingEnemy.getX(), 
									y: existingEnemy.getY(),
									state: existingEnemy.getState()
													 });	
	}
   //checkCollidePlayer();
}


function onPlayerShoot(data) {   
   var shootPlayer = playerById(this.id);
   if (!shootPlayer) {
      util.log("player not found" + data.playerID);
   } else {
      //util.log("player "+shootPlayer.getName()+" shoot: angle: "+data.angle);
      var color = "";
      if (shootPlayer.getType()==1) {
         color="black";
      }
      if (shootPlayer.getType()==2) {
         color="red";
      }
      if (shootPlayer.getType()==3) {
         color="green";
      } 
      var bullet = new Bullet(this.id,data.playerX+100,data.playerY+100,data.angle,10,color,30);
      bullet.id = bulletID;
      bulletID++;
      socket.sockets.emit("new bullet",{
         id: bullet.id,
         x: bullet.x,
         y: bullet.y,
         size: bullet.size,
         color: bullet.color
      })
      var that = this;
      var fireBullet = setInterval(function(){
         //util.log("move "+ bullet.x+" to ");
         
            bullet.x += bullet.speed * Math.cos(bullet.angle);
            bullet.y += bullet.speed * Math.sin(bullet.angle);
            checkCollide(bullet);
            //util.log(bullet.x);
            socket.sockets.emit("move bullet",{
               id: bullet.id,
               x: bullet.x,
               y: bullet.y
            });
         
      },60);

      setTimeout(function(){
         clearInterval(fireBullet);
         socket.sockets.emit("remove bullet",{
            id: bullet.id
         })
      }, 3000);


   }

}

function checkCollidePlayer() {
   for (j=0;j<players.length;j++) {
      var player = players[j];
      for (i=0;i<enemies.length;i++) {
      //util.log("check collide with enemy "+i);
      var enemy = enemies[i];
      if ((Math.abs(player.getX()-enemy.getX())<30)&&(Math.abs(player.getY()-enemy.getY())<30))
      {
         
         setTimeout(function(){
            util.log("hit!!");
             player.setScore(player.getScore()-1);
         socket.sockets.emit("hit enemy",{
            playerID: player.playerID,
            newScore: player.getScore()            
         });  
         },500);
             
        
      }

      
   }
   }
   
}

function checkCollide(bullet) {
    //if (
   //         projectiles[key].x < enemy.x + enemy.width &&
   //            projectiles[key].x + enemy.width > enemy.x &&
   //            projectiles[key].y < enemy.y + enemy.height &&
   //            projectiles[key].y + enemy.height > enemy.y
   //      )

   for (i=0;i<enemies.length;i++) {
      //util.log("check collide with enemy "+i);
      var enemy = enemies[i];
      if ((Math.abs(bullet.x-enemy.getX())<30)&&(Math.abs(bullet.y-enemy.getY())<30))
      {
         util.log("hit!!");
         
         var hitPlayer = playerById(bullet.playerID);
         
         hitPlayer.setScore(hitPlayer.getScore()+1);
         socket.sockets.emit("hit enemy",{
            playerID: bullet.playerID,
            newScore: hitPlayer.getScore()            
         });

         socket.sockets.emit("remove enemy",{
            id: enemy.id      
         });

         enemies.splice(i,1);
         setTimeout(function(){            
            spawnEnemy();   
         },700);
      }

      
   }
}

function spawnEnemy() {
    var w = Math.floor(Math.random() * 1440);
      var h = Math.floor(Math.random() * 470);
      var num = Math.floor(Math.random()*10);
      var newEnemy;
      if (num == 4 || num == 8) {
         newEnemy = new Enemy(w, h,0, -1, 1);
      } else if (num == 6) {
         newEnemy = new Enemy(w, h,0, 1, -1);
      } else if (num == 9) {
         newEnemy = new Enemy(w, h,0, -1, -1);
      } else {
         newEnemy = new Enemy(w, h,0, 1, 1);
      }
      newEnemy.id = ++enemyID;
      //enemyID++;     
      //util.log("add more enemy: "+newEnemy.id);
      enemies.push(newEnemy);
      var num, existingEnemy;
         
         socket.sockets.emit("new enemy", {
            id: newEnemy.id, 
            x: newEnemy.getX(), 
            y: newEnemy.getY(),
            state: newEnemy.getState(),
            mx: newEnemy.getMx(),
            my:newEnemy.getMy()
         });
         
         util.log("add tested enemy" + newEnemy.id);
      
      util.log("enemy size:" + enemies.length);

}

function moveBullet(bullet) {
   bullet.x += bullet.speed * Math.cos(bullet.angle);
   bullet.y += bullet.speed * Math.sin(bullet.angle);
   socket.sockets.emit("move bullet",{
      id: bullet.id,
      x: bullet.x,
      y: bullet.y
   });
}

function playerById(id) {
   var i;
   for (i = 0; i < players.length; i++) {
      if (players[i].id == id)
         return players[i];
   }
   
   return false;
}

function enemyById(id) {
    var i;
   for (i = 0; i < enemies.length; i++) {
      if (enemies[i].id == id)
         return enemies[i];
   }
   
   return false;
}
init();
setInterval(onMoveEnemy,1000/40);
