// Global measurement variables
const tileX = 101;
const tileY = 83;
let isPaused = false;

// Global pause functions
function pause() {
    for (let enemy in allEnemies) {
        enemy.pause = true;
    }
    player.pause = true;
    isPaused = true;
}

function pauseToggle(inputKey) {
    if (inputKey === "pause" && !isPaused) {
        pause();
    } else if (inputKey === "pause" && isPaused) {
        unpause();
    } 
}

function unpause() {
    for (let enemy in allEnemies) {
        enemy.pause = false;
    }
    player.pause = false;
    isPaused = false;
}

// Enemies that the player must avoid
class Enemy {
    constructor(initialY = 1, speed = 1) {
        // Location on screen
        this.x = 0 - tileX;
        this.y = (tileY * initialY) - (tileY / 2);
        this.speed = speed;

        // Game stats
        this.pause = false;

        // Assign image to enemy sprite
        this.sprite = 'images/enemy-bug.png';
    }

    // Draw enemy sprite on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Update enemy position as location values change
    update(dt) {
        if (!isPaused) {
            if (this.x < tileX * 5) {
                this.x += tileX * 2 * this.speed * dt;
            }
            else {this.x = 0 - tileX;}
        }
    }
}

// Hero who the player controls
class Hero {
    constructor() {
        // Location on screen
        this.initialX = tileX * 2;
        this.initialY = (tileY * 5) - (tileY / 2);
        this.x = this.initialX;
        this.y = this.initialY;

        // Game stats
        this.health = 1;
        this.pause = false;

        // Assign image to hero sprite
        this.sprite = "images/char-boy.png";
    }

    // Change sprite location based on player inputs
    handleInput(inputKey) {
        if (!this.pause) {
            if (inputKey === "left" && this.x > 0) {
                this.x -= tileX;
            } else if (inputKey === "up" && this.y > 0) {
                this.y -= tileY;
            } else if (inputKey === "right" && this.x < (tileX * 4)) {
                this.x += tileX;
            } else if (inputKey === "down" && this.y < this.initialY) {
                this.y += tileY;
            }
        }
    }

    // Draw player sprite on screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Update player collision and status checks
    update(dt) {
        // Check enemy collision
        for (let enemy of allEnemies) {
            if (enemy.y === this.y &&
            (enemy.x + (tileX / 2)) > this.x &&
            (this.x + (tileX / 2)) > enemy.x) {
                this.x = this.initialX;
                this.y = this.initialY;
            }
        }
    }
}


// Instantiate actors
const allEnemies = [];
const enemy1 = new Enemy(1, 2);
const enemy2 = new Enemy(2, 3);
const enemy3 = new Enemy(3, 1);
allEnemies.push(enemy1, enemy2, enemy3);

const player = new Hero();



// Listen for key presses and sends them to .handleInput()
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        27: "pause",
        32: "pause",
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: "left",
        68: "right",
        83: "down",
        87: "up"
    };

    pauseToggle(allowedKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
});
