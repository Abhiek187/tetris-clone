import 'phaser';
import Constants from './constants';

export default class Block {
	// Class for the tetris block
	str: string;
	startX: number;
	startY: number;
	image: Phaser.Physics.Matter.Image;
	gridLoc: number[][]; // 4x2 array of each block location in the grid
	rotation: number;
	static count: number = 0;

	constructor(scene: any) {
		Block.count++;
		this.str = Phaser.Math.RND.pick(scene.blockKeys);

		if (this.str === 'block5') {
			this.startX = 150;
			this.startY = 25;
		} else if (this.str === 'block7') {
			this.startX = 150;
			this.startY = 12.5;
		} else {
			this.startX = 137.5;
			this.startY = 25;
		}

		const index: number = parseInt(this.str.charAt(this.str.length - 1)) - 1;
		this.gridLoc = Constants.startIndices[index];
		this.rotation = 0;

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

		this.gridLoc.forEach((pos, index) => {
			const delta: number[] = Constants.turnDeltas[this.str][this.rotation][index];
			pos[0] += delta[0];
			pos[1] += delta[1];
		});

		this.rotation = (this.rotation + 1) % Constants.turnDeltas[this.str].length;

		// Move block again if it's out of bounds
		const bounds: Phaser.Geom.Rectangle = this.image.getBounds();

		if (bounds.left < 0) {
			// Happens when the vertical block is rotated from the far left
			this.image.x += 50;

			for (const pos of this.gridLoc) {
				pos[1] += 2;
			}
		} else if (bounds.left < 25) {
			this.image.x += 25;

			for (const pos of this.gridLoc) {
				pos[1]++;
			}
		} else if (bounds.right > 275) {
			this.image.x -= 25;

			for (const pos of this.gridLoc) {
				pos[1]--;
			}
		}

		if (bounds.top < 0) {
			this.image.y += 25;

			for (const pos of this.gridLoc) {
				pos[0]++;
			}
		} else if (bounds.bottom > 525) {
			this.image.y -= 25;

			for (const pos of this.gridLoc) {
				pos[0]--;
			}
		}
	}
}
