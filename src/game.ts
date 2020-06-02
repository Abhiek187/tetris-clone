import 'phaser';
import Constants from './constants';
import Block from './block';

export default class Tetris extends Phaser.Scene {
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	shapes: object;
	currentBlock: Block;
	currentBlockImg: Phaser.Physics.Matter.Image;
	holdingLeft: boolean = false;
	holdingRight: boolean = false;
	holdingUp: boolean = false;
	holdingDown: boolean = false;
	holdingSpace: boolean = false;
	level: number = 1;
	fallDelta: number = 1000 / this.level; // ms before falling to the next row
	fallTimer: number = 0;
	score: number = 0;
	scoreText: Phaser.GameObjects.Text;
	// 21x10 array of block space (make each array its own copy, not a common reference)
	occupied: boolean[][] = Array.from({length: 21}, e => Array(10).fill(false));
	completeRows: number[] = [];
	gameOver: boolean = false;

	constructor() {
		super('tetris');
	}

	// Constant class variables
	get borderKeys(): string[] {
		return ['borderSide', 'borderBottom'];
	}
	get blockKeys(): string[] {
		return ['block1', 'block2', 'block3', 'block4', 'block5', 'block6', 'block7'];
	}
	get shapesKey(): string {
		return 'shapes';
	}

	preload() {
		// Load all assets
		this.load.image(this.borderKeys[0], 'assets/Border Side.png');
		this.load.image(this.borderKeys[1], 'assets/Border Bottom.png');
		this.blockKeys.forEach(
			(block, index) => this.load.image(block, `assets/Block ${index + 1}.png`)
		);
		this.load.json(this.shapesKey, 'assets/tetris-shapes.json');
	}

	create() {
		// Start the game scene
		this.cursors = this.input.keyboard.createCursorKeys();

		this.shapes = this.cache.json.get(this.shapesKey);
		this.matter.world.setBounds(0, 0, Constants.width, Constants.height);

		this.matter.add.image(12.5, 275, this.borderKeys[0], null, this.shapes["Border Side"]);
		this.matter.add.image(287.5, 275, this.borderKeys[0], null, this.shapes["Border Side"]);
		this.matter.add.image(150, 537.5, this.borderKeys[1], null, this.shapes["Border Bottom"]);

		this.currentBlock = new Block(this);
		this.currentBlockImg = this.currentBlock.image;

		const style: Phaser.Types.GameObjects.Text.TextStyle = {
			fontFamily: 'Verdana',
			fontSize: '3em',
			color: 'yellow',
			stroke: 'purple',
			strokeThickness: 1,
			align: 'center'
		};
		this.scoreText = this.add.text(Constants.width * 0.25, 10, `Score: ${this.score}`, style);
	}

	update(time: number, delta: number) {
		if (this.gameOver) return;
		// Check properties per frame
		const bounds: Phaser.Geom.Rectangle = this.currentBlockImg.getBounds();

		// Only register pressing down button, not holding it down
		if (this.cursors.left.isDown && !this.holdingLeft && bounds.left > 25) {
			this.moveLeft(); // made as a function in case we can't move left
		} else if (this.cursors.right.isDown && !this.holdingRight && bounds.right < 275) {
			this.moveRight();
		} else if (this.cursors.up.isDown && !this.holdingUp) {
			// Hard drop (go to the bottom immediately)
			this.hardDrop();
			this.holdingUp = true;
		} else if (this.cursors.down.isDown && !this.holdingDown) {
			// Soft drop (speed up)
			this.fallDelta /= 16;
			this.holdingDown = true;
		} else if (this.cursors.space.isDown && !this.holdingSpace) {
			// 0: (x, y), 90: (-y, x), 180: (-x, -y), 270: (y, -x)
			this.currentBlock.rotateBlock();
			this.holdingSpace = true;
		}

		if (this.cursors.left.isUp) {
			this.holdingLeft = false;
		}
		if (this.cursors.right.isUp) {
			this.holdingRight = false;
		}
		if (this.cursors.up.isUp) {
			this.holdingUp = false;
		}
		if (this.cursors.down.isUp && this.holdingDown) {
			this.fallDelta *= 16;
			this.holdingDown = false;
		}
		if (this.cursors.space.isUp) {
			this.holdingSpace = false;
		}

		// Check fall timer
		if (bounds.bottom >= 525) {
			this.stopBlock();
		} else if (this.fallTimer >= this.fallDelta) {
			this.moveDown();
		} else {
			this.fallTimer += delta;
		}
	}

	moveLeft() {
		// Check if there's a block in the way of the leftmost block(s)
		for (const pos of this.currentBlock.gridLoc) {
			const leftCell: number[] = [pos[0], pos[1] - 1];
			if (!this.currentBlock.gridLoc.includes(leftCell) && this.occupied[pos[0]][pos[1] - 1]) {
				return;
			}
		}

		// Then update the entire block's position
		this.currentBlockImg.x -= 25;

		for (const pos of this.currentBlock.gridLoc) {
			pos[1]--;
		}

		this.holdingLeft = true;
	}

	moveRight() {
		// Check if there's a block in the way of the rightmost block(s)
		for (const pos of this.currentBlock.gridLoc) {
			const rightCell: number[] = [pos[0], pos[1] + 1];
			if (!this.currentBlock.gridLoc.includes(rightCell) && this.occupied[pos[0]][pos[1] + 1]) {
				return;
			}
		}

		// Then update the entire block's position
		this.currentBlockImg.x += 25;

		for (const pos of this.currentBlock.gridLoc) {
			pos[1]++;
		}

		this.holdingRight = true;
	}

	hardDrop() {
		// Move block down the farthest it can go
		const originalCount: number = Block.count; // the count will change if another block is made

		do {
			this.moveDown();
		} while (Block.count === originalCount && !this.gameOver);
	}

	stopBlock() {
		// Mark cells where blocks are as occupied
		for (const pos of this.currentBlock.gridLoc) {
			this.occupied[pos[0]][pos[1]] = true;
		}

		if (this.occupied[0][3] && this.occupied[0][4] && this.occupied[0][5]) {
			this.gameOver = true;
			this.scoreText.setText(`Score: ${this.score}\nGame Over`);
			this.scoreText.setColor('red');
			this.scoreText.setDepth(this.scoreText.depth + 1); // put score in front of blocks
		} else {
			this.updateScore();
			this.currentBlock = new Block(this);
			this.currentBlockImg = this.currentBlock.image;
			this.fallTimer = 0;
		}
	}

	moveDown() {
		// Stop the block if there's another block below us
		const bounds: Phaser.Geom.Rectangle = this.currentBlockImg.getBounds();

		for (const pos of this.currentBlock.gridLoc) {
			const downCell: number[] = [pos[0] + 1, pos[1]];
			if (bounds.bottom >=  525 || !this.currentBlock.gridLoc.includes(downCell)
				&& this.occupied[pos[0] + 1][pos[1]]) {
				this.stopBlock();
				return;
			}
		}

		// Update y grid locations of each block
		this.currentBlockImg.y += 25;
		this.fallTimer = 0;

		for (const pos of this.currentBlock.gridLoc) {
			pos[0]++;
		}
	}

	updateScore() {
		// Check if any rows are filled up
		let total: number = this.score;

		this.occupied.forEach((row, index) => {
			if (row.every(Boolean) && !this.completeRows.includes(index)) {
				total += 10 * this.level; // if every cell is true
				this.completeRows.push(index); // prevent counting the same row twice
			}
		});

		if (total > this.score) {
			this.level++;
			this.fallDelta = 1000 / this.level;

			if (this.holdingDown) {
				this.fallDelta /= 16;
			}
		}

		this.score = total;
		this.scoreText.setText(`Score: ${this.score}\nLevel ${this.level}`);
	}
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	backgroundColor: '#000',
	width: Constants.width,
	height: Constants.height,
	physics: {
		default: 'matter'
	},
	scene: Tetris
};

const game = new Phaser.Game(config);
