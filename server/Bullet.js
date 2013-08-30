var Bullet = function(playerId,startX, startY, shotAngle, startSize, startColor, startSpeed) {
	var playerID = playerId,
		x = startX,
		y = startY,
		angle = shotAngle,
		size = startSize,
		color = startColor,
		speed = startSpeed,
		id;



	return {
		playerID:playerID,
		id:id,
		x:x,
		y:y,
		angle:angle,
		size:size,
		color:color,
		speed:speed
	}


}

exports.Bullet = Bullet;