var Bullet = function(startX, startY, startSize, startColor) {
	var x = startX,
		y = startY,		
		size = startSize,
		color = startColor,		
		id
		;

	// Draw player
	var draw = function(ctx) {
		//console.log(image.src);
		ctx.fillStyle = color;
   		ctx.fillRect(Math.round(x), Math.round(y), size, size);
	}	
	return {
		id: id,
		x:x,
		y:y,		
		size:size,
		color:color,
		draw:draw
	}
}