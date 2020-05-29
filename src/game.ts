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
		const sideDelta: number = Constants.blockData[this.currentBlockType].sideDelta;
		const bottomDelta: number = Constants.blockData[this.currentBlockType].bottomDelta;

		if (this.cursors.left.isDown && !this.holdingLeft
			&& this.currentBlock.x - sideDelta > 25) {
			this.currentBlock.x -= 25;
			this.holdingLeft = true;
		} else if (this.cursors.right.isDown && !this.holdingRight
			&& this.currentBlock.x + sideDelta < 275) {
			this.currentBlock.x += 25;
			this.holdingRight = true;
		} else if (this.cursors.up.isDown && !this.holdingUp) {
			this.currentBlock.y = 525 - bottomDelta;
			this.holdingUp = true;
		} else if (this.cursors.down.isDown && !this.holdingDown) {
			this.fallDelta /= 8;
			this.holdingDown = true;
		} else if (this.cursors.space.isDown && !this.holdingSpace) {
			// 0: (x, y), 90: (-y, x), 180: (-x, -y), 270: (y, -x)
			this.currentBlock.angle += 90;
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
			this.fallDelta *= 8;
			this.holdingDown = false;
		}
		if (this.cursors.space.isUp) {
			this.holdingSpace = false;
		}

		// Check fall timer
		if (this.currentBlock.y + bottomDelta >= 525) {
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

		/*this.currentBlock = this.blocks.create(startX, startY, this.currentBlockStr);
		this.currentBlock.setCollideWorldBounds(true);*/
		const startX: number = Constants.blockData[this.currentBlockType].startX;
		const startY: number = Constants.blockData[this.currentBlockType].startY;
		this.currentBlock = this.matter.add.image(
			startX, startY, this.currentBlockStr, null, shapes[this.currentBlockStr]
		);
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
