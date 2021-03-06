var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var score = Math.random();
var music = AudioFX("audio/in_game.mp3");
//music.play();
var shot = AudioFX("audio/shot.mp3");

var keys, localPlayer, remotePlayers,socket;

var background,projectiles,enemy,coin;

var enemies;
var bullets;

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
   
   //Make the bullets array to store all the bullets
   bullets = [];
  
   socket = io.connect("http://localhost", {port: 8000});
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
	socket.on("move enemy", onMoveEnemy);
   socket.on("remove enemy", onRemoveEnemy);

   socket.on('chat', function (data) {            
            $("#txtAreaDisplay").val($("#txtAreaDisplay").val()+"\r\n[" + data.msgr + ']: ' + data.msg);
   });

   socket.on("new bullet",onNewBullet);
   socket.on("move bullet",onMoveBullet);
   socket.on("remove bullet",onRemoveBullet);

   socket.on("hit enemy",onHitEnemy);
}

function onHitEnemy(data) {
   $('#score').html(data.newScore);
   console.log("update score");
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
   var playerName = "";
   while (playerName=="") {
      playerName = prompt("enter player name:");      
   }
   localPlayer.setName(playerName);

   // Send local player data to the game server
   socket.emit("new player", 
					{x: localPlayer.getX(), 
					 y: localPlayer.getY(), 
					 state: localPlayer.getState(), 
					 type: localPlayer.getType(),
                name: localPlayer.getName()                
               });
   

   

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
		newPlayer = new Player('black-sprite.png', 186, 186,3,data.x, data.y, 1);
		break;
	case 2:
		newPlayer = new Player('red-sprite.png', 186, 186,3,data.x, data.y, 2);
		break;
	case 3:
		newPlayer = new Player('green-sprite.png', 186, 186,3,data.x, data.y, 3);
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
   //console.log("add test enemy " + enemy.id);
}

function onMoveEnemy (data) {
	var moveEnemy = enemyById(data.id);

   if (!moveEnemy) {
      //console.log("Enemy not found: ");
      return;
   }	else {
	moveEnemy.setX(data.x);
	moveEnemy.setY(data.y);
		//console.log("enemy found!!");
	}
	
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
   //console.log("mouse x: " + mouse.x + " - mouse y: "+ mouse.y);
});


// Update function
function update() {
   if (mouse.down && Date.now() - localPlayer.projectileTimer > localPlayer.shootDelay) {
      dy = mouse.y -localPlayer.getY();
      dx = mouse.x - localPlayer.getX();
      theta = Math.atan2(dy, dx);
      theta *= 180/Math.PI;
      //console.log(localPlayer.getID());
      socket.emit("player shoot",{         
         playerX : localPlayer.getX(),
         playerY : localPlayer.getY(),
         angle: theta
      });
   }

   if (localPlayer.update(keys)) {
     
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

   // for (var key in projectiles) {
   //    //console.log("key: "+key.x);
   //    drawSquare(projectiles[key].x, projectiles[key].y, projectiles[key].size, projectiles[key].color);
   // }

   // Draw the remote players
   var i;
   for (i = 0; i < remotePlayers.length; i++) {
      remotePlayers[i].draw(ctx);
   }

   //Draw the enemies
   for (i =0;i<enemies.length;i++) {
      enemies[i].draw(ctx);
   }

   for (i =0;i<bullets.length;i++) {

      //bullets[i].draw(ctx);
      ctx.fillStyle = bullets[i].color;
      ctx.fillRect(Math.round(bullets[i].x), Math.round(bullets[i].y), bullets[i].size, bullets[i].size);
   }

}


// Run
function run() {
   update();
   render();
}

init();
//setInterval(run, 1000/60);
//run();

// shim layer with setTimeout fallback
// Copyrigtt Paul Irish http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


// usage:
// instead of setInterval(render, 16) ....

(function animloop(){
  requestAnimFrame(animloop);
  run();
})();

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


var btnEnterText = document.getElementById("btnEnterText");
var txtTextInput = document.getElementById("txtTextArea");
var txtTextDisplay = document.getElementById("txtAreaDisplay");
var textInputPanel = document.getElementById("txtTextInput");
var isWritting = 0;
var logs = document.getElementById("Logs")
var btnClose = document.getElementById("btnCloseLog");
var btnClear = document.getElementById("btnClearLog");
textInputPanel.style.display = "none";
document.onkeydown = function() {
   if (event.keyCode == 13) {  
    addText();
 }
 if(event.keyCode == 192){
   closeLog();
}
}

//Enter button event handler
btnEnterText.addEventListener("click",function(){ 
   textInputPanel.style.display = "none";

}, false);

//Close Log Button
btnClose.addEventListener("click", function(){
   if (logs.style.display=="block"){
      logs.style.display="none" 
   }else{
      logs.style.display="block" 
   }

},false);

//clear log button
btnClear.addEventListener("click", function(){
   txtTextDisplay.value="";
}, false);

function closeLog(){
   if (logs.style.display=="block"){
      logs.style.display="none" 
   }else{
      logs.style.display="block" 
   }
}

function addText(){

   if (textInputPanel.style.display=="block"){
      txtTextInput.focus();
      var text=txtTextInput.value;
      if(text == "cmd clear"){
         txtTextDisplay.value="";
      }else if(text == "cmd close"){
         closeLog();
      }else if(text == "cmd show"){
         closeLog();
      }else if(text.length!=0){
         sendMessageToServer(); 
      }
      isWritting = 0;
      textInputPanel.style.display="none"
   }
   else{
      isWritting = 0;
      isWritting = 1;
      textInputPanel.style.display="block"  ;
      txtTextInput.focus();   
      txtTextInput.value="";
   }
}

 $(document).ready(function(){

            var logs = $("#txtAreaDisplay");
            var input = $("#txtTextArea");
            var btnSend =  $("button:#btnEnterText");
            btnSend.click(function(){      
               //alert("xxx");
               // send message on inputbox to server
               socket.emit('chat', {name: localPlayer.getName(),
                  message: input.val() });
               
               logs.val(logs.val()+"\r\n[" + localPlayer.getName() + ']: ' + input.val());
               
               // then we empty the text on the input box.
               input.val('');
            });
            
           

            music.play();
});

// listen for chat event and recieve data

function sendMessageToServer(){      
      // send message on inputbox to server
      socket.emit('chat', {name: localPlayer.getName(),message: $("#txtTextArea").val() });
      
      $("#txtAreaDisplay").val( $("#txtAreaDisplay").val()+"\r\n[" + localPlayer.getName() + ']: ' + $("#txtTextArea").val());
      
      // then we empty the text on the input box.
      $("#txtTextArea").val('');
   };

function onNewBullet(data) {
   var bullet = new Bullet(data.x,data.y,data.size,data.color);
   bullet.id = data.id;
   bullets.push(bullet);
  // console.log("add new bullet:" + bullet.id)
}

function onMoveBullet(data) {
   var bullet = bulletById(data.id);
   if (!bullet) {
      console.log('no bullet');
   } else {
     // console.log('move bullet' + bullet.id + "from pos: " +bullet.x+"to new pos" + data.x + "!!");
      bullet.x = data.x;
      bullet.y = data.y;

      
   }  
}

function onRemoveBullet(data) {
   for (i = 0; i < bullets.length; i++) {
      if (bullets[i].id == data.id)
         bullets.splice(i,1);
   }
}

function onRemoveEnemy(data) {
   for (i = 0; i < enemies.length; i++) {
      if (enemies[i].id == data.id)
         enemies.splice(i,1);
   }
}

function bulletById(id) {
   
   for (i = 0; i < bullets.length; i++) {
      if (bullets[i].id == id)
         return bullets[i];
   }
   
   return false;
}
