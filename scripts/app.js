// Globals
const tileX = 101;
const tileY = 83;
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
let isPaused = false;

class Enemy {
	constructor(initialY = 1, speed = 1) {
		// Location
		this.initialY = tileY * initialY - tileY / 2;
		this.x = 0 - tileX;
		this.y = this.initialY;
		this.speed = speed;

		// Game state
		this.pause = false;
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
				this.x = 0 - tileX;
			}
		}

		// Check for player collision
		if (
			player.y === this.y &&
			player.x + tileX / 2 > this.x &&
			this.x + tileX / 2 > player.x
		) {
			// TODO: Add a defeat modal or screen effect
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
		this.pause = false;
		this.sprite = "images/char-boy.png";
	}

	handleInput(inputKey) {
		if (!this.pause) {
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
		this.x = this.initialX;
		this.y = this.initialY;
	}

	// Increment location per time step and check collision
	// TODO: Smooth hero animation with `dt`
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
	for (let enemy in allEnemies) {
		enemy.pause = true;
	}
	player.pause = true;
	isPaused = true;
}

function resetGame() {
	togglePlayerControl();
	pause();
	allEnemies.forEach(function (enemy) {
		enemy.reset();
	});
	player.reset();
	unpause();
	togglePlayerControl();
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
	for (let enemy in allEnemies) {
		enemy.pause = false;
	}
	player.pause = false;
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
