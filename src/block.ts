import 'phaser';
import Constants from './constants';

export default class Block {
	// Class for the tetris block
	str: string;
	type: string;
	startX: number;
	startY: number;
	image: Phaser.Physics.Matter.Image;
	gridLoc: number[][]; // 4x2 array of each block location in the grid
	static count: number = 0;

	constructor(scene: any) {
		Block.count++;
		this.str = Phaser.Math.RND.pick(scene.blockKeys);

		if (this.str === 'block5') {
			this.type = 'square';
			this.startX = 150;
			this.startY = 25;
		} else if (this.str === 'block7') {
			this.type = 'wide';
			this.startX = 150;
			this.startY = 12.5;
		} else {
			this.type = 'normal';
			this.startX = 137.5;
			this.startY = 25;
		}

		const index: number = parseInt(this.str.charAt(this.str.length - 1)) - 1;
		this.gridLoc = Constants.startIndices[index];

		this.image = scene.matter.add.image(
			this.startX, this.startY, this.str, null, scene.shapes[this.str]
		);
	}

	rotateBlock() {
		// Adjust position of tetris block to align with the grid
		this.image.angle += 90;
		if (this.str === 'block5') return;

		if (this.image.angle % 180 === 0) {
			// Horizontal
			this.image.x -= 12.5;
			this.image.y -= 12.5;
		} else {
			// Vertical
			this.image.x += 12.5;
			this.image.y += 12.5;
		}

		// Move block again if it's out of bounds
		const bounds: Phaser.Geom.Rectangle = this.image.getBounds();

		if (bounds.left < 0) {
			// Happens when the vertical block is rotated from the far left
			this.image.x += 50;
		} else if (bounds.left < 25) {
			this.image.x += 25;
		} else if (bounds.right > 275) {
			this.image.x -= 25;
		}
		if (bounds.bottom > 525) {
			this.image.y -= 25;
		}
	}
}
