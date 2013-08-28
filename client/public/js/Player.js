var Player = function(imgsrc, widthW, heightH, speed,startX, startY,stateval, typeShip) {
	var x = startX,
	  y = startY,
	  id,
	  moveAmount = speed,
	  image = document.createElement('img'),		
	  width = widthW,
	  height = heightH,
	  state = stateval,
	  color = typeShip
	;
	var projectileTimer,
	  shootDelay;

	var score,
	  level,
	  exp,
	  hp;

	image.onload = function() {
		
	}

	image.src = imgsrc;
	

	// Getters and setters
	var getX = function() {
		return x;
	}

	var getY = function() {
		return y;
	}

	var setX = function(newX) {
		x = newX;
	}

	var setY = function(newY) {
		y = newY;
	}

	var getState = function() {
		return state;
	}
	var setState = function(newState) {
		state = newState;
	}

	var setScore = function(newScore) {
		score = newScore;
	}

	var getScore = function() {
		return score;
	}

	var setLevel = function(newLevel) {
		level = newLevel;
	}

	var getLevel = function() {
		return level;
	}

	var setExp = function(newExp) {
		exp = newExp;
	}

	var getExp = function() {
		return exp;
	}

	var setHp = function(newHp) {
		hp = newHp;
	}

	var getHp = function() {
		return hp;
	}

	var getType = function() {
		return color;
	}

	var setType = function(newType) {
		color= newType;
	}

	// Update player position
	var update = function(keys) {
		// Previous position
		var prevX = x,
		prevY = y;

		// Up key takes priority over down
		if (keys.up) {
			state = 3;
			y -= moveAmount;
		} else if (keys.down) {
			state = 1;
			y += moveAmount;
		}

		// Left key takes priority over right
		if (keys.left) {
			state = 2;
			x -= moveAmount;
		} else if (keys.right) {
			state = 0;
			x += moveAmount;
		}

		return (prevX != x || prevY != y) ? true : false;
	}

	// Draw player
	var draw = function(ctx) {
		//console.log(image.src);
		ctx.drawImage(
	      image,
	      state * height,
	      0,
	      width,
	      height,
	      x,
	      y,
	      width,
	      height
	   );
	}

	

	
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getScore: getScore,
		setScore: setScore,
		getLevel: getLevel,
		setLevel: setLevel,
		getExp: getExp,
		setExp: setExp,
		getHp: getHp,
		setHp: setHp,
		getState: getState,
		setState: setState,	
		setType: setType,
		getType: getType,
		update: update,
		draw: draw
	}
}
