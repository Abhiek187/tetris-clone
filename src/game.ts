import 'phaser';

export default class Tetris extends Phaser.Scene {
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	border: Phaser.Physics.Arcade.StaticGroup;
	block: Phaser.Physics.Arcade.Sprite;

	constructor() {
		super('tetris');
	}

	// Constant class variables
	get borderKey(): string {
		return 'border';
	}
	get blocksKeys(): string[] {
		return ['block1', 'block2', 'block3', 'block4', 'block5', 'block6', 'block7'];
	}

	randBlock(blocks: string[]): string {
		// Randomly select a block from the array of tetris blocks
		return blocks[Math.floor(Math.random() * blocks.length)]
	}

	preload() {
		// Load all assets
		// Tetris board is 12x22 tiles, where each tile is 25 px, so width = 300 px & height = 550 px
		this.load.image(this.borderKey, 'assets/Border.png');
		this.blocksKeys.forEach(
			(block, index) => this.load.image(block, `assets/Block ${index + 1}.png`)
		);
	}

	create() {
		// Start the game scene
		this.cursors = this.input.keyboard.createCursorKeys();

		this.border = this.physics.add.staticGroup();
		this.border.create(150, 275, this.borderKey);
		this.block = this.physics.add.sprite(150, 50, this.randBlock(this.blocksKeys));

		this.physics.add.collider(this.border, this.block);
	}

	update() {
		// Check properties per frame
		if (this.cursors.left.isDown) {
			this.block.setVelocityX(-160);
		} else if (this.cursors.right.isDown) {
			this.block.setVelocityX(160);
		} else if (this.cursors.up.isDown) {
			this.block.setVelocityY(-330);
		} else if (this.cursors.down.isDown) {
			this.block.setVelocityY(330);
		} else {
			this.block.setVelocityX(0);
			this.block.setVelocityY(0);
		}
	}
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	backgroundColor: '#000',
	width: 300,
	height: 550,
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
