var Enemy = function(imgsrc, width, height, speed,startX, startY,stateval) {
	var x = startX,
		y = startY,
		id,
		moveAmount = speed,
		image = document.createElement('img'),		
		width = width,
		height = height,
		state = stateval;
	var projectileTimer,
		shootDelay;

	image.onload = function() {
		image.src = imgsrc;
	}

	image.src = imgsrc;
	
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

	var update = function(newState) {
		// Previous position
		var prevX = x,
			prevY = y;

		state = newState;
		if (newState ==0 ) { //Move right

			x += moveAmount;
		} else if (newState == 1) { //Move down
			y += moveAmount;
		} else if (newState == 2) { //Move left
			x -= moveAmount;
		} else if (newState == 3) { //Move up
			y -= moveAmount;
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

	

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getState: getState,
		setState: setState,		
		update: update,
		draw: draw
	}
}