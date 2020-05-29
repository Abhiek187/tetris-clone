import 'phaser';
import Constants from './constants';

export default class Tetris extends Phaser.Scene {
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	border: Phaser.Physics.Arcade.StaticGroup;
	blocks: Phaser.Physics.Arcade.Group;
	currentBlock: Phaser.Physics.Arcade.Sprite;
	currentBlockStr: string;
	holdingLeft: boolean = false;
	holdingRight: boolean = false;

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

	preload() {
		// Load all assets
		// Tetris board is 12x22 tiles, where each tile is 25 px, so width = 300 px & height = 550 px
		this.load.image(this.borderKeys[0], 'assets/Border Side.png');
		this.load.image(this.borderKeys[1], 'assets/Border Bottom.png');
		this.blockKeys.forEach(
			(block, index) => this.load.image(block, `assets/Block ${index + 1}.png`)
		);
	}

	create() {
		// Start the game scene
		this.cursors = this.input.keyboard.createCursorKeys();

		this.border = this.physics.add.staticGroup();
		this.border.create(12.5, 275, this.borderKeys[0]);
		this.border.create(287.5, 275, this.borderKeys[0]);
		this.border.create(150, 537.5, this.borderKeys[1]);
		this.blocks = this.physics.add.group();

		this.physics.add.collider(this.border, this.blocks);
		this.physics.add.collider(this.blocks, this.blocks);

		this.createNewBlock();
	}

	update() {
		// Check properties per frame
		let sideDelta: number = Constants.blockData.normal.sideDelta;

		if (this.currentBlockStr === 'block5') {
			sideDelta = Constants.blockData.square.sideDelta;
		} else if (this.currentBlockStr === 'block7') {
			sideDelta = Constants.blockData.wide.sideDelta;
		}

		console.log(`Left: ${this.currentBlock.x - sideDelta}`);
		console.log(`Right: ${this.currentBlock.x + sideDelta}`);

		if (this.cursors.left.isDown && !this.holdingLeft
			&& this.currentBlock.x - sideDelta > 25) {
			this.currentBlock.x -= 25;
			this.holdingLeft = true;
		} else if (this.cursors.right.isDown && !this.holdingRight
			&& this.currentBlock.x + sideDelta < 275) {
			this.currentBlock.x += 25;
			this.holdingRight = true;
		} else if (this.cursors.down.isDown) {
			this.currentBlock.setVelocityY(330);
		} else if (this.cursors.space.isDown) {
			this.currentBlock.angle += 90;
		} else {
			this.currentBlock.setVelocity(0);
		}

		if (this.cursors.left.isUp) {
			this.holdingLeft = false;
		}
		if (this.cursors.right.isUp) {
			this.holdingRight = false;
		}

		if (this.currentBlock.body.touching.down) {
			this.currentBlock.setVelocity(0);
			this.createNewBlock();
		}
	}


	randBlock(blocks: string[]): string {
		// Randomly select a block from the array of tetris blocks
		return blocks[Math.floor(Math.random() * blocks.length)]
	}

	createNewBlock() {
		this.currentBlockStr = this.randBlock(this.blockKeys);
		let startX: number = Constants.blockData.normal.startX;
		let startY: number = Constants.blockData.normal.startY;

		if (this.currentBlockStr === 'block5') {
			startX = Constants.blockData.square.startX;
			startY = Constants.blockData.square.startY;
		} else if (this.currentBlockStr === 'block7') {
			startX = Constants.blockData.wide.startX;
			startY = Constants.blockData.square.startY;
		}

		this.currentBlock = this.blocks.create(startX, startY, this.currentBlockStr);
		this.currentBlock.setCollideWorldBounds(true);
	}
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	backgroundColor: '#000',
	width: Constants.width,
	height: Constants.height,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: Tetris
};

const game = new Phaser.Game(config);
