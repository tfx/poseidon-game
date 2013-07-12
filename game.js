var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 1536;
canvas.height = 768;

// Create sea background
function Background (image, width, height) {
    this.image = new Image();
    this.image.onload = true;
    this.image.src = image;
    this.width = width;
    this.height = height;
}

function drawBackground (sea) {
    for (l = 0; l < 24; l++) {
        for (i = 0; i < 12; i++)
        {
            ctx.drawImage(
                sea.image,
                l * 64,
                i * 64
            );
        }
    }

}


// Create a ship
function ShipSprite (image, width, height, speed, x, y, state) {
    this.image = new Image();
    this.image.onload = true;
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.state = state;
    this.speed = speed;
}

function drawSprite(ship) {
    ctx.drawImage(
        ship.image,
        ship.state * ship.height,
        0,
        ship.width,
        ship.height,
        ship.x,
        ship.y,
        ship.width,
        ship.height
    );
}


// Create a bullet
function Projectile(x, y, trajectory, size, color, speed) {
    this.x = x;
    this.y = y;
    this.trajectory = trajectory;
    this.size = size;
    this.color = color;
    this.speed = speed;
}

function Trajectory(startX, startY, endX, endY) {
    this.length = Math.sqrt(Math.pow((endX - startX), 2) + Math.pow((endY - startY), 2));
    this.x = (endX - startX) / this.length;
    this.y = (endY - startY) / this.length;
}

function drawSquare(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), size, size);
}

function updateProjectiles(mod) {
    for (var key in projectiles) {
        projectiles[key].x += projectiles[key].trajectory.x * projectiles[key].speed * mod;
        projectiles[key].y += projectiles[key].trajectory.y * projectiles[key].speed * mod;
        if (projectiles[key].x > canvas.width || projectiles[key].x < 0 || projectiles[key].y > canvas.height || projectiles[key].y < 0) {
            projectiles.splice(key, 1);
        }
    }
}


// Create an object
var background = new Background('water.png', 64, 64);
var pirate = new ShipSprite('ship-sprite.png', 186, 186,200,400, 400, 0);
pirate.projectileTimer = Date.now();
pirate.shootDelay = 200;
var projectiles = [];


// Handling user input
var keysDown = {};
window.addEventListener('keydown', function(e) {
    keysDown[e.keyCode] = true;
});
window.addEventListener('keyup', function(e) {
    delete keysDown[e.keyCode];
});
var mouse = {
    x: 0,
    y: 0,
    down: false
}
window.addEventListener('mousedown', function(e) {
    mouse.down = true;
});
window.addEventListener('mouseup', function(e) {
    mouse.down = false;
});
window.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX - canvas.offsetLeft;
    mouse.y = e.clientY - canvas.offsetTop;
});

function update(mod) {
    if (mouse.down && Date.now() - pirate.projectileTimer > pirate.shootDelay) {
        var trajectory = new Trajectory(pirate.x + pirate.width / 2, pirate.y + 15, mouse.x, mouse.y);
        var projectile = new Projectile(
            pirate.x + pirate.width / 2,
            pirate.y + 15,
            trajectory,
            10,
            '#0f0',
            1000 );
        projectiles.push(projectile);
        pirate.projectileTimer = Date.now();
    }
    updateProjectiles(mod);

    if (37 in keysDown) {
        pirate.state = 2; //left
        pirate.x -= pirate.speed * mod;
    }
    if (38 in keysDown) {
        pirate.state = 3; //up
        pirate.y -= pirate.speed * mod;
    }
    if (39 in keysDown) {
        pirate.state = 0; //right
        pirate.x += pirate.speed * mod;
    }
    if (40 in keysDown) {
        pirate.state = 1; //down
        pirate.y += pirate.speed * mod;
    }
}

function render() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBackground(background);
    drawSprite(pirate);

    for (var key in projectiles) {
        drawSquare(projectiles[key].x, projectiles[key].y, projectiles[key].size, projectiles[key].color);
    }
}

function run() {
    update((Date.now() - time) / 1000);
    render();
    time = Date.now();
}

var time = Date.now();
setInterval(run, 10);