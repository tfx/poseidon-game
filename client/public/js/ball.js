var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 400;

var dx=3;
var dy=3;
var bx=5;
var by=5;
var count = 0;
// Draw Shape
function BallObject (x, y, color, radius) {
	this.x = x;
	this.y = y;
	this.color = color;
	this.radius = radius;
}
function drawBall (ball) 
{
	ctx.beginPath();
	ctx.fillStyle=ball.color;
	ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2,true);
	ctx.closePath();
   ctx.fill();
}

// Draw Target
function SquareObj (x, y, width, height, speed, color)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
}
function drawSqr (square)
{
    ctx.fillStyle = square.color;
    ctx.fillRect(square.x, square.y, square.width, square.height);
}

// Draw Bullet
function Bullet (source) {
	this.x = source.x;
	this.y = source.y;
	this.color = '#c00';
}
function drawBullet (bullet) {
	ctx.beginPath();
   ctx.fillStyle='#c00';
   // Draws a circle of radius 5 at the coordinates 100,100 on the canvas
   ctx.arc(bullet.x,bullet.y,5,0,Math.PI*2,true); 
	ctx.closePath();
   ctx.fill();
}

// Instances
var ball = new BallObject (Math.random() * canvas.width, Math.random() * canvas.height, '#0000ff', 20);
var Square = new SquareObj(250, 250, 50, 50, 200, '#c00');
var bullet = new Bullet (ball);
var bulletSet = [];
bulletSet.push(bullet);

// Update
function update (mod) {
	if( ball.x<0 || ball.x>canvas.width) {
		dx=-dx; 
	}
	if( ball.y<0 || ball.y>canvas.height) {
		dy=-dy;
	}
	ball.x+=dx;
	ball.y+=dy;
	
	bullet.x+=bx;
	bullet.y+=by;

	if (count != 0) {
		bulletSet = [];
		var bull = new Bullet(ball);
		bulletSet.push(bull);
	}
	count++;
}

// Render
function render() {
   ctx.fillStyle = '#000';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
	drawBall(ball);
	drawSqr (Square);

	if (count == 0) {
		drawBullet (bullet);
	} else {
		for (var key in bulletSet) {
			drawBullet(bulletSet[key]);
		}
	}
	
}


// Run
function run() {
   update((Date.now() - time) / 1000);
   render();
   time = Date.now();
}

var time = Date.now();
setInterval(run, 10);
