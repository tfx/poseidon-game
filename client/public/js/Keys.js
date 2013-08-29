var shot = AudioFX("../audio/shot.mp3");
var Keys = function() {
	var up, left, right, down;
		
	var onKeyDown = function(e) {
		var that = this,
			c = e.keyCode;
		switch (c) {
			// Controls
			case 65: // Left
				that.left = true;
				shot.play();
				break;
			case 87: // Up
				that.up = true;
				shot.play();
				break;
			case 68: // Right
				that.right = true; 
				shot.play();
				break;
			case 83: // Down
				that.down = true;
				shot.play();
				break;
		}
	}
	
	var onKeyUp = function(e) {
		var that = this,
			c = e.keyCode;
		switch (c) {
			case 65: // Left
				that.left = false;
				break;
			case 87: // Up
				that.up = false;
				break;
			case 68: // Right
				that.right = false;
				break;
			case 83: // Down
				that.down = false;
				break;
		}
	}

	return {
		up: up,
		left: left,
		right: right,
		down: down,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp
	}
}