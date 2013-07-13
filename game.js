var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 1536;
canvas.height = 768;



var Square = {
    x: 600,
    y: 600,
    width: 50,
    height: 50,
    speed: 200,
    color: '#c00'
};

// Class sea background
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


// Class ship
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


// Class bullet
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

function validProjectilesKill (projectiles)
{
    for (var key in projectiles) {
        if (
            projectiles[key].x < Square.x + Square.width &&
                projectiles[key].x + Square.width > Square.x &&
                projectiles[key].y < Square.y + Square.height &&
                projectiles[key].y + Square.height > Square.y
            )

        {
            Square.x = Math.random() * canvas.width;
            Square.y = Math.random() * canvas.height;
        }
    }
}


// Class enemy
function Enemy (image, width, height, x, y, speed)
{
    this.image = new Image();
    this.image.onload = true;
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.speed = speed;
}

function drawEnemy (enemy)
{
    ctx.drawImage(
        enemy.image,
        0,
        0,
        enemy.width,
        enemy.height,
        0,
        0,
        enemy.width,
        enemy.height
    );
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


// Update function
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
    validProjectilesKill (projectiles);

    if (65 in keysDown) {
        pirate.state = 2; //A
        pirate.x -= pirate.speed * mod;
    }
    if (87 in keysDown) {
        pirate.state = 3; //W
        pirate.y -= pirate.speed * mod;
    }
    if (68 in keysDown) {
        pirate.state = 0; //D
        pirate.x += pirate.speed * mod;
    }
    if (83 in keysDown) {
        pirate.state = 1; //S
        pirate.y += pirate.speed * mod;
    }


    if (
        pirate.x < Square.x + Square.width &&
            pirate.x + pirate.width > Square.x &&
            pirate.y < Square.y + Square.height &&
            pirate.y + pirate.height > Square.y
        )
    {
        Square.x = Math.random() * canvas.width;
        Square.y = Math.random() * canvas.height;
    }

}


// Render
function render() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBackground(background);
    drawSprite(pirate);

    for (var key in projectiles) {
        drawSquare(projectiles[key].x, projectiles[key].y, projectiles[key].size, projectiles[key].color);
    }

    ctx.fillStyle = Square.color;
    ctx.fillRect(Square.x, Square.y, Square.width, Square.height);
}


// Run
function run() {
    update((Date.now() - time) / 1000);
    render();
    time = Date.now();
}

var time = Date.now();
setInterval(run, 10);
