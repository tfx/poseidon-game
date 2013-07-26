var Enemy = function(startX, startY,stateVal) {
	var x = startX,
		y = startY,
		state = stateVal,
		id;

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

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getState: getState,
		setState: setState,
		id: id
	}
}
exports.Enemy = Enemy;