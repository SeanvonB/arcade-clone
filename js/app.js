// Enemies that the player must avoid
class Enemy {
    constructor(xInitial = 0, yInitial = 0, speedInitial = 1) {
        // Location on screen
        this.x = xInitial - 101;
        this.y = yInitial + ((83 / 3) * 2);
        this.speed = speedInitial;

        // Assign image to enemy sprite
        this.sprite = 'images/enemy-bug.png';
    }

    // Draw enemy sprite on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Update enemy position as location values change
    update(dt) {
        if (this.x < 505) {this.x += 202 * this.speed * dt;}
        else {this.x = -101;}
    }
}

// Hero who the player controls
class Hero {
    constructor(heroType) {
        // Location on screen
        this.x = 202;
        this.y = 415 - (83 / 3);

        // Game stats
        this.health = 1;

        // Assign image to hero sprite
        this.sprite = "images/char-boy.png";
    }

    // Change sprite location based on player inputs
    handleInput(inputKey) {
        if (inputKey === "left" && this.x > 0) {this.x -= 101;}
        else if (inputKey === "up" && this.y > 0) {this.y -= 83;}
        else if (inputKey === "right" && this.x < 404) {this.x += 101;}
        else if (inputKey === "down" && this.y < 375) {this.y += 83;}
    }

    // Draw player sprite on screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Update player position as location values change
    update(dt) {
        // Update position based on movement*dt
    }
}


// Instantiate actors
const allEnemies = [];
const enemy1 = new Enemy(0, 0, 2);
const enemy2 = new Enemy(0, 83, 3);
const enemy3 = new Enemy(0, 166);
allEnemies.push(enemy1, enemy2, enemy3);

const player = new Hero();



// Listen for key presses and sends them to .handleInput()
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
