var Enemy = function(startX, startY,stateVal, mX, mY) {
	var x = startX,
		y = startY,
		state = stateVal,
	  mx = mX,
	  my = mY,
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

	var setMx = function (newMx) {
		mx = newMx;
	}
	var setMy = function (newMy) {
		my= newMy;
	}

	var getMx = function () {
		return mx;
	}

	var getMy = function () {
		return my;
	}

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getState: getState,
		setState: setState,
		getMy: getMy,
		setMy: setMy,
		getMx: getMx,
		setMx: setMx,
		id: id
	}
}
exports.Enemy = Enemy;
