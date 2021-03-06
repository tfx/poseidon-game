var Player = function(startX, startY,stateVal, typeShip) {
	var x = startX,
	  y = startY,
	  state = stateVal,
	  type = typeShip,
	  id;

	var score=0,
	  level,
	  exp,
	  hp,
	  is_hit=false;

	var name;

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
		return type;
	}

	var setType = function(newType) {
		type = newType;
	} 

	var getName = function() {
		return name;
	}

	var setName = function(newName) {
		name = newName;
	} 

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		getState: getState,
		setState: setState,
		getScore: getScore,
		setScore: setScore,
		getLevel: getLevel,
		setLevel: setLevel,
		getExp: getExp,
		setExp: setExp,
		getHp: getHp,
		setHp: setHp,
		getType: getType,
		setType: setType,
		getName: getName,
		setName: setName,
		id: id,
		is_hit: is_hit
	}
}

exports.Player = Player;
