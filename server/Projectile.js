var Projectile = function(startX, startY, startTrajectory, startSize, startColor, startSpeed) {
	var x = startX,
		y = startY,
		trajectory = startTrajectory,
		size = startSize,
		color = startColor,
		speed = startSpeed;

}

var Trajectory = function(startX, startY, endX, endY) {
	var length = Math.sqrt(Math.pow((endX - startX), 2) + Math.pow((endY - startY), 2));
	this.x = (endX - startX) / this.length;
   	this.y = (endY - startY) / this.length;
}