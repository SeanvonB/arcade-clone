// Globals
const chars = [
	"images/char-boy.png",
	"images/char-cat-girl.png",
	"images/char-horn-girl.png",
	"images/char-pink-girl.png",
	"images/char-princess-girl.png",
];
const overlay = document.querySelector(".overlay");
const tileX = 100;
const tileY = 80;
let keybindings = {
	" ": "pause",
	a: "left",
	ArrowDown: "down",
	ArrowLeft: "left",
	ArrowRight: "right",
	ArrowUp: "up",
	d: "right",
	Escape: "pause",
	s: "down",
	w: "up",
};
let currentChar = 0;
let hasControl = true;
let hasWon = false;
let isPaused = false;

class Enemy {
	constructor(initialY = 1, speed = 100) {
		this.initialX = -1 * tileX;
		this.initialY = tileY * initialY - tileY / 2;
		this.speed = speed;
		this.sprite = "images/enemy-bug.png";
		this.x = this.initialX;
		this.y = this.initialY;
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
				this.x += this.speed * dt;
			} else {
				this.x = this.initialX;
			}
		}
	}
}

class Hero {
	constructor() {
		this.initialX = tileX * 2;
		this.initialY = tileY * 6 - tileY / 2;
		this.x = this.initialX;
		this.y = this.initialY;
		this.health = 1;
		this.sprite = chars[currentChar];
	}

	// NOTE: Smooth movement looked nicer but felt worse to play; this snappy
	// movement feels more precise and responsive.
	handleInput(inputKey) {
		switch (inputKey) {
			case "down":
				if (
					// Boundaries of screen and terrain
					this.y === tileY * 6 - tileY / 2 ||
					(this.x !== tileX * 2 && this.y == tileY * 5 - tileY / 2) ||
					(this.x === tileX * 2 && this.y == tileY * 2 - tileY / 2)
				) {
					break;
				} else {
					this.y += tileY;
					break;
				}
			case "left":
				if (
					this.x === 0 ||
					(this.x === tileX * 2 && this.y == tileY * 6 - tileY / 2) ||
					(this.x === tileX * 2 && this.y === 0 - tileY / 2) ||
					(this.x === tileX * 3 && this.y === tileY * 3 - tileY / 2)
				) {
					break;
				} else {
					this.x -= tileX;
					break;
				}
			case "right":
				if (
					this.x === tileX * 4 ||
					(this.x === tileX * 2 && this.y == tileY * 6 - tileY / 2) ||
					(this.x === tileX * 2 && this.y === 0 - tileY / 2) ||
					(this.x === tileX * 1 && this.y === tileY * 3 - tileY / 2)
				) {
					break;
				} else {
					this.x += tileX;
					break;
				}
			case "up":
				if (
					this.y === 0 - tileY ||
					(this.x !== tileX * 2 && this.y == tileY * 1 - tileY / 2) ||
					(this.x === tileX * 2 && this.y == tileY * 4 - tileY / 2)
				) {
					break;
				} else {
					this.y -= tileY;
					break;
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

	update(dt) {
		// Check collision
		if (!isPaused) {
			allEnemies.forEach(function (enemy) {
				if (
					player.y === enemy.y &&
					player.x + tileX / 2 > enemy.x &&
					enemy.x + tileX / 2 > player.x
				) {
					player.health -= 1;
				}
			});
		}
		if (player.health <= 0) {
			player.health = 1;
			resetGame();
		}

		// Check win condition
		if (this.y === 0 - tileY / 2 && !this.hasWon) {
			hasWon = true;
			resetGame();
			hasWon = false;
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

	// Victory
	if (hasWon) {
		overlay.textContent = "Victory";
		ctx.filter = "sepia()";
		overlay.style.color = "#eef";
		overlay.style.fontFamily = "Verdana, Geneva, Tahoma, sans-serif";
		overlay.classList.remove("hidden");
		allEnemies.forEach(function (enemy) {
			enemy.reset();
		});

		// Freeze frame, then reset
		setTimeout(function () {
			ctx.filter = "none";
			overlay.classList.add("hidden");
			player.reset();
			unpause();
			togglePlayerControl();
		}, 1500);
	}

	// Defeat
	else {
		overlay.textContent = ["WASTED", "YOU DIED"][
			Math.floor(Math.random() * 2)
		];
		if (overlay.textContent === "WASTED") {
			ctx.filter = "grayscale()";
			overlay.style.color = "#933";
			overlay.style.fontFamily =
				"Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
		} else {
			ctx.filter = "brightness(25%)";
			overlay.style.color = "#f30";
			overlay.style.fontFamily =
				"Garamond, Georgia, 'Times New Roman', Times, serif";
		}
		overlay.classList.remove("hidden");

		// Freeze frame, then reset
		setTimeout(function () {
			ctx.filter = "none";
			overlay.classList.add("hidden");
			player.reset();
			allEnemies.forEach(function (enemy) {
				enemy.reset();
			});
			unpause();
			togglePlayerControl();
		}, 1000);
	}
}

function togglePause(inputKey) {
	if (inputKey === "pause" && !isPaused) {
		pause();
	} else if (inputKey === "pause" && isPaused) {
		unpause();
	}
}

function togglePlayerControl() {
	if (hasControl) {
		keybindings = {};
		hasControl = false;
	} else if (!hasControl) {
		keybindings = {
			" ": "pause",
			a: "left",
			ArrowDown: "down",
			ArrowLeft: "left",
			ArrowRight: "right",
			ArrowUp: "up",
			d: "right",
			Escape: "pause",
			s: "down",
			w: "up",
		};
		hasControl = true;
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
const enemy1 = new Enemy(1, 400);
const enemy2 = new Enemy(2, 500);
const enemy3 = new Enemy(4, 200);
const enemy4 = new Enemy(5, 300);
allEnemies.push(enemy1, enemy2, enemy3, enemy4);
const player = new Hero();
