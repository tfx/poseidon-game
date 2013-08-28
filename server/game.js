var util = require("util"),               // Utility resources (logging, object inspection, etc)
   io = require("socket.io"),          // Socket.IO
   Player = require("./Player").Player;   // Player class
   Enemy = require("./Enemy").Enemy; // Enemy Class


var socket,    // Socket controller
   players, // Array of connected players
   enemies, // Array of enemies
   coins; //Array of items


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

   

}

function addEnemies() {
    //Spawn enemy
   var testEnemy = new Enemy(300, 300,0);
   testEnemy.id = 1;
   util.log("add tested enemy");
   this.broadcast.emit("new enemy", {id: testEnemy.id, x: testEnemy.getX(), y: testEnemy.getY(),state: testEnemy.getState()});
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

   // Broadcast new player to connected socket clients
   this.broadcast.emit("new player", 
							  {id: newPlayer.id, 
								x: newPlayer.getX(), 
								y: newPlayer.getY(),
								state: newPlayer.getState(),
								type: newPlayer.getType()
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
					  type: existingPlayer.getType()
					 });
   }
      
   // Add new player to the players array
   players.push(newPlayer);

   //Send enemy to the new player
   var testEnemy = new Enemy(200, 300,0);
   testEnemy.id = 1;
   util.log("add tested enemy");
   this.emit("new enemy", {id: testEnemy.id, x: testEnemy.getX(), y: testEnemy.getY(),state: testEnemy.getState()});
   this.emit("new enemy", {id: 2, x: 150, y: 400,state: 0});
   this.emit("new enemy", {id: 3, x: 50, y: 400,state: 0});

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

function onPlayerShoot(data) {

}

function addEnemy() {

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
