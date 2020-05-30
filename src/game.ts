import 'phaser';
import Constants from './constants';

export default class Tetris extends Phaser.Scene {
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	shapes: object;
	/*border: Phaser.Physics.Arcade.StaticGroup;
	blocks: Phaser.Physics.Arcade.Group;*/
	currentBlock: Phaser.Physics.Matter.Image;
	currentBlockStr: string;
	currentBlockType: string;
	holdingLeft: boolean = false;
	holdingRight: boolean = false;
	holdingUp: boolean = false;
	holdingDown: boolean = false;
	holdingSpace: boolean = false;
	fallDelta: number = 1000; // ms before falling to the next row
	fallTimer: number = 0;

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
		// Tetris board is 12x22 tiles, where each tile is 25 px, so width = 300 px & height = 550 px
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

		/*this.border = this.physics.add.staticGroup();
		this.border.create(12.5, 275, this.borderKeys[0]); // left border
		this.border.create(287.5, 275, this.borderKeys[0]); // right border
		this.border.create(150, 537.5, this.borderKeys[1]); // bottom border
		this.blocks = this.physics.add.group();

		this.physics.add.collider(this.border, this.blocks);
		this.physics.add.collider(this.blocks, this.blocks);*/

		this.createNewBlock(this.shapes);
	}

	update(time: number, delta: number) {
		// Check properties per frame
		const bounds: Phaser.Geom.Rectangle = this.currentBlock.getBounds();

		// Only register pressing down button, not holding it down
		if (this.cursors.left.isDown && !this.holdingLeft && bounds.left > 25) {
			this.currentBlock.x -= 25;
			this.holdingLeft = true;
		} else if (this.cursors.right.isDown && !this.holdingRight && bounds.right < 275) {
			this.currentBlock.x += 25;
			this.holdingRight = true;
		} else if (this.cursors.up.isDown && !this.holdingUp) {
			// Hard drop (go to the bottom immediately)
			this.currentBlock.y = 525 - bounds.height / 2;
			this.holdingUp = true;
		} else if (this.cursors.down.isDown && !this.holdingDown) {
			// Soft drop (speed up)
			this.fallDelta /= 16;
			this.holdingDown = true;
		} else if (this.cursors.space.isDown && !this.holdingSpace) {
			// 0: (x, y), 90: (-y, x), 180: (-x, -y), 270: (y, -x)
			this.rotateBlock();
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
			this.createNewBlock(this.shapes);
			this.fallTimer = 0;
		} else if (this.fallTimer >= this.fallDelta) {
			this.currentBlock.y += 25;
			this.fallTimer = 0;
		} else {
			this.fallTimer += delta;
		}
	}

	createNewBlock(shapes: object) {
		// Spawn a new random tetris block from the array of blocks
		this.currentBlockStr = Phaser.Math.RND.pick(this.blockKeys);

		if (this.currentBlockStr === 'block5') {
			this.currentBlockType = 'square';
		} else if (this.currentBlockStr === 'block7') {
			this.currentBlockType = 'wide';
		} else {
			this.currentBlockType = 'normal';
		}

		const startX: number = Constants.blockData[this.currentBlockType].startX;
		const startY: number = Constants.blockData[this.currentBlockType].startY;
		this.currentBlock = this.matter.add.image(
			startX, startY, this.currentBlockStr, null, shapes[this.currentBlockStr]
		);
	}

	rotateBlock() {
		// Adjust position of tetris block to align with the grid
		this.currentBlock.angle += 90;
		if (this.currentBlockStr === 'block5') return;

		if (this.currentBlock.angle % 180 === 0) {
			// Horizontal
			this.currentBlock.x -= 12.5;
			this.currentBlock.y -= 12.5;
		} else {
			// Vertical
			this.currentBlock.x += 12.5;
			this.currentBlock.y += 12.5;
		}

		// Move block again if it's out of bounds
		const bounds: Phaser.Geom.Rectangle = this.currentBlock.getBounds();

		if (bounds.left < 0) {
			// Happens when the vertical block is rotated from the far left
			this.currentBlock.x += 50;
		} else if (bounds.left < 25) {
			this.currentBlock.x += 25;
		} else if (bounds.right > 275) {
			this.currentBlock.x -= 25;
		}
		if (bounds.bottom > 525) {
			this.currentBlock.y -= 25;
		}
	}
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	backgroundColor: '#000',
	width: Constants.width,
	height: Constants.height,
	physics: {
		default: 'matter',
		matter: {
			debug: true
		}
	},
	scene: Tetris
};

const game = new Phaser.Game(config);
