// Globals
const chars = [
	"images/char-boy.png",
	"images/char-cat-girl.png",
	"images/char-horn-girl.png",
	"images/char-pink-girl.png",
	"images/char-princess-girl.png",
];
const tileX = 100;
const tileY = 80;
let keybindings = {
	" ": "pause",
	Escape: "pause",
	w: "up",
	ArrowUp: "up",
	a: "left",
	ArrowLeft: "left",
	s: "down",
	ArrowDown: "down",
	d: "right",
	ArrowRight: "right",
};
let currentChar = 0;
let isPaused = false;

class Enemy {
	constructor(initialY = 1, speed = 1) {
		// Location
		this.initialX = -2 * tileX;
		this.initialY = tileY * initialY - tileY / 2;
		this.x = this.initialX;
		this.y = this.initialY;
		this.speed = speed;

		// Game state
		this.sprite = "images/enemy-bug.png";
	}

	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}

	reset() {
		this.x = this.initialX;
		this.y = this.initialY;
	}

	update(dt) {
		// Increment location per time step until resetting
		if (!isPaused) {
			if (this.x < tileX * 5) {
				this.x += tileX * 2 * this.speed * dt;
			} else {
				this.x = this.initialX;
			}
		}

		// Check for player collision
		if (
			player.y === this.y &&
			player.x + tileX / 2 > this.x &&
			this.x + tileX / 2 > player.x
		) {
			resetGame();
		}
	}
}

class Hero {
	constructor() {
		// Location
		this.hasControl = true;
		this.hasWon = false;
		this.initialX = tileX * 2;
		this.initialY = tileY * 5 - tileY / 2;
		this.x = this.initialX;
		this.y = this.initialY;

		// Game state
		this.health = 1;
		this.sprite = chars[currentChar];
	}

	// NOTE: Smooth movement looked nicer but felt worse to play; this snappy
	// movement feels more precise and responsive.
	handleInput(inputKey) {
		if (!isPaused) {
			if (inputKey === "left" && this.x > 0) {
				this.x -= tileX;
			} else if (inputKey === "up" && this.y > 0) {
				this.y -= tileY;
			} else if (inputKey === "right" && this.x < tileX * 4) {
				this.x += tileX;
			} else if (inputKey === "down" && this.y < this.initialY) {
				this.y += tileY;
			}
		}
	}

	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}

	reset() {
		this.sprite = chars[currentChar];
		this.x = this.initialX;
		this.y = this.initialY;
	}

	// Increment location per time step and check collision
	update(dt) {
		// Check victory condition
		if (this.y === 0 - tileY / 2 && !this.hasWon) {
			this.hasWon = true;

			// TODO: Add a victory modal
			resetGame();
			this.hasWon = false;
		}
	}
}

function pause() {
	isPaused = true;
}

function resetGame() {
	togglePlayerControl();
	pause();
	if (currentChar >= 4) {
		currentChar = 0;
	} else {
		currentChar++;
	}

	// Freeze frame for screen effect
	ctx.filter = "grayscale()";
	setTimeout(function () {
		ctx.filter = "none";
		player.reset();
		allEnemies.forEach(function (enemy) {
			enemy.reset();
		});
		unpause();
		togglePlayerControl();
	}, 500);
}

function togglePause(inputKey) {
	if (inputKey === "pause" && !isPaused) {
		pause();
	} else if (inputKey === "pause" && isPaused) {
		unpause();
	}
}

function togglePlayerControl() {
	if (player.hasControl) {
		keybindings = {};
		player.hasControl = false;
	} else if (!player.hasControl) {
		keybindings = {
			" ": "pause",
			Escape: "pause",
			w: "up",
			ArrowUp: "up",
			a: "left",
			ArrowLeft: "left",
			s: "down",
			ArrowDown: "down",
			d: "right",
			ArrowRight: "right",
		};
		player.hasControl = true;
	}
}

function unpause() {
	isPaused = false;
}

// AddEventListeners
document.addEventListener("keydown", function (e) {
	togglePause(keybindings[e.key]);
	player.handleInput(keybindings[e.key]);
});

// Initial state
const allEnemies = [];
const enemy1 = new Enemy(1, 2);
const enemy2 = new Enemy(2, 3);
const enemy3 = new Enemy(3, 1);
allEnemies.push(enemy1, enemy2, enemy3);
const player = new Hero();
