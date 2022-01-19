// Globals
const chars = [
	"images/char-boy.png",
	"images/char-cat-girl.png",
	"images/char-horn-girl.png",
	"images/char-princess.png",
];
const game = document.querySelector(".game");
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
	constructor(initialY = 1, speed = 100, reverse = false) {
		if (reverse) {
			this.initialX = 5 * tileX;
			this.sprite = "images/enemy-reverse.png";
		} else {
			this.initialX = -1 * tileX;
			this.sprite = "images/enemy-bug.png";
		}
		this.initialY = tileY * initialY - tileY / 2;
		this.reverse = reverse;
		this.speed = speed;
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
			if (this.reverse) {
				if (this.x > tileX * -1) {
					this.x -= this.speed * dt;
				} else {
					this.x = this.initialX;
				}
			} else if (!this.reverse) {
				if (this.x < tileX * 5) {
					this.x += this.speed * dt;
				} else {
					this.x = this.initialX;
				}
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

	// NOTE: Smooth movement looked nicer but felt much worse to play; snappy
	// movement feels more precise and responsive.
	handleInput(e) {
		if (hasControl && !isPaused) {
			let input;
			if (keybindings[e.key]) {
				input = keybindings[e.key];
			} else if (e.type === "click") {
				// Normalize dimensions of responsive canvas to base values
				let bounds = game.getBoundingClientRect();
				let clickX = (e.clientX - bounds.left) * (500 / bounds.width);
				let clickY = (e.clientY - bounds.top) * (651 / bounds.height);

				// Apply touch target criteria
				if (
					clickX > player.x &&
					clickX < player.x + tileX &&
					clickY > player.y + tileY * 2 &&
					clickY < player.y + tileY * 4
				) {
					input = "down";
				} else if (
					clickX > player.x - tileX * 2 &&
					clickX < player.x &&
					clickY > player.y + tileY &&
					clickY < player.y + tileY * 2
				) {
					input = "left";
				} else if (
					clickX > player.x + tileX &&
					clickX < player.x + tileX * 3 &&
					clickY > player.y + tileY &&
					clickY < player.y + tileY * 2
				) {
					input = "right";
				} else if (
					clickX > player.x &&
					clickX < player.x + tileX &&
					clickY > player.y - tileY &&
					clickY < player.y + tileY
				) {
					input = "up";
				}
			}

			switch (input) {
				case "down":
					if (
						// Top boundaries of screen and terrain
						this.y === tileY * 6 - tileY / 2 ||
						(this.x !== tileX * 2 &&
							this.y == tileY * 5 - tileY / 2) ||
						(this.x === tileX * 2 &&
							this.y == tileY * 2 - tileY / 2)
					) {
						break;
					} else {
						this.y += tileY;
						break;
					}
				case "left":
					if (
						// Right boundaries of screen and terrain
						this.x === 0 ||
						(this.x === tileX * 2 &&
							this.y == tileY * 6 - tileY / 2) ||
						(this.x === tileX * 2 && this.y === 0 - tileY / 2) ||
						(this.x === tileX * 3 &&
							this.y === tileY * 3 - tileY / 2)
					) {
						break;
					} else {
						this.x -= tileX;
						break;
					}
				case "right":
					if (
						// Left boundaries of screen and terrain
						this.x === tileX * 4 ||
						(this.x === tileX * 2 &&
							this.y == tileY * 6 - tileY / 2) ||
						(this.x === tileX * 2 && this.y === 0 - tileY / 2) ||
						(this.x === tileX * 1 &&
							this.y === tileY * 3 - tileY / 2)
					) {
						break;
					} else {
						this.x += tileX;
						break;
					}
				case "up":
					if (
						// Bottom boundaries of screen and terrain
						this.y === 0 - tileY ||
						(this.x !== tileX * 2 &&
							this.y == tileY * 1 - tileY / 2) ||
						(this.x === tileX * 2 &&
							this.y == tileY * 4 - tileY / 2)
					) {
						break;
					} else {
						this.y -= tileY;
						break;
					}
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
			currentChar = 0;
			player.reset();
			unpause();
			togglePlayerControl();
		}, 1500);
	}

	// Defeat
	else if (!hasWon) {
		overlay.textContent = ["WASTED", "YOU DIED"][
			Math.floor(Math.random() * 2)
		];
		if (overlay.textContent === "WASTED") {
			ctx.filter = "grayscale()";
			overlay.style.color = "#f33";
			overlay.style.fontFamily =
				"Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
		} else {
			ctx.filter = "brightness(25%)";
			overlay.style.color = "#f30";
			overlay.style.fontFamily =
				"Garamond, Georgia, 'Times New Roman', Times, serif";
		}
		overlay.classList.remove("hidden");
		if (currentChar >= 3) {
			currentChar = 0;
		} else {
			currentChar++;
		}

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

function togglePause(e) {
	if (keybindings[e.key] === "pause" && hasControl && !isPaused) {
		pause();
	} else if (keybindings[e.key] === "pause" && hasControl && isPaused) {
		unpause();
	}
}

function togglePlayerControl() {
	if (hasControl) {
		hasControl = false;
	} else if (!hasControl) {
		hasControl = true;
	}
}

function unpause() {
	isPaused = false;
}

// AddEventListeners
document.addEventListener("keydown", function (e) {
	togglePause(e);
	player.handleInput(e);
});
document.addEventListener("click", function (e) {
	player.handleInput(e);
});

// Initial state
const allEnemies = [];
const enemy1 = new Enemy(1, 425, true);
const enemy2 = new Enemy(2, 500);
const enemy3 = new Enemy(4, 275, true);
const enemy4 = new Enemy(5, 350);
allEnemies.push(enemy1, enemy2, enemy3, enemy4);
const player = new Hero();
