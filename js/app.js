// Enemies that the player must avoid
class Enemy {
    constructor() {
        // Location on screen
        this.x = 0;
        this.y = 141; // 166 minus 25 centers the sprite visually

        // Assign image to enemy sprite
        this.sprite = 'images/enemy-bug.png';
    }

    // Draw enemy sprite on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Update enemy position as location values change
    update(dt) {
        // Update position based on movement*dt
    }
}

// Hero who the player controls
class Hero {
    constructor(heroType) {
        // Location on screen
        this.x = 202;
        this.y = 375; // 415 minus 40 centers the sprite visually

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
const enemy1 = new Enemy();
allEnemies.push(enemy1);

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
