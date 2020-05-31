import 'phaser';
import Constants from './constants';
import Formulas from './formulas';
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
	fallDelta: number = 1000; // ms before falling to the next row
	fallTimer: number = 0;
	score: number = 0;
	scoreText: Phaser.GameObjects.Text;
	// 21x10 array of block space (make each array its own copy, not a common reference)
	occupied: boolean[][] = Array.from({length: 21}, e => Array(10).fill(false));

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
		// Check properties per frame
		const bounds: Phaser.Geom.Rectangle = this.currentBlockImg.getBounds();

		// Only register pressing down button, not holding it down
		if (this.cursors.left.isDown && !this.holdingLeft && bounds.left > 25) {
			this.moveLeft(); // made as a function in case we can't move left
		} else if (this.cursors.right.isDown && !this.holdingRight && bounds.right < 275) {
			this.moveRight();
		} else if (this.cursors.up.isDown && !this.holdingUp) {
			// Hard drop (go to the bottom immediately)
			this.currentBlockImg.y = 525 - bounds.height / 2;
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
		// Get the leftmost block(s) (the one with the smallest x pos)
		let leftmostX: number = this.occupied[0].length;

		for (const pos of this.currentBlock.gridLoc) {
			if (pos[1] < leftmostX) {
				leftmostX = pos[1];
			}
		}

		const leftBlocks: number[][] = this.currentBlock.gridLoc.filter(
			pos => pos[1] === leftmostX
		);

		// Check if there's a block in the way of the leftmost block(s)
		for (const pos of leftBlocks) {
			if (this.occupied[pos[0]][pos[1] - 1]) {
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
		// Get the rightmost block(s) (the one with the largest x pos)
		let rightMostX: number = 0;

		for (const pos of this.currentBlock.gridLoc) {
			if (pos[1] > rightMostX) {
				rightMostX = pos[1];
			}
		}

		const rightBlocks: number[][] = this.currentBlock.gridLoc.filter(
			pos => pos[1] === rightMostX
		);

		// Check if there's a block in the way of the rightmost block(s)
		for (const pos of rightBlocks) {
			if (this.occupied[pos[0]][pos[1] + 1]) {
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

	stopBlock() {
		// Mark cells where blocks are as occupied
		for (const pos of this.currentBlock.gridLoc) {
			this.occupied[pos[0]][pos[1]] = true;
		}

		this.score += 10;
		this.scoreText.setText(`Score: ${this.score}`);
		this.currentBlock = new Block(this);
		this.currentBlockImg = this.currentBlock.image;
		this.fallTimer = 0;
	}

	moveDown() {
		// Stop the block if there's another block below us (check max y's)
		let highestY: number = 0;

		for (const pos of this.currentBlock.gridLoc) {
			if (pos[0] > highestY) {
				highestY = pos[0];
			}
		}

		const downBlocks: number[][] = this.currentBlock.gridLoc.filter(
			pos => pos[0] === highestY
		);

		for (const pos of downBlocks) {
			if (this.occupied[pos[0] + 1][pos[1]]) {
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
