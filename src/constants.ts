export default class Constants {
	// Tetris board is 12x22 tiles, where each tile is 25 px, so width = 300 px & height = 550 px
	static get width(): number {
		return 300; // width of canvas
	}

	static get height(): number {
		return 550; // height of canvas
	}

	static get startIndices(): number[][][] {
		/* Start point for each block in terms of the 21x10 grid, top to bottom, left to right
		 * (index 0 = y, index 1 = x)
		 */
		return [
			[[0, 4], [0, 5], [1, 3], [1, 4]],
			[[0, 5], [1, 3], [1, 4], [1, 5]],
			[[0, 3], [1, 3], [1, 4], [1, 5]],
			[[0, 4], [1, 3], [1, 4], [1, 5]],
			[[0, 4], [0, 5], [1, 4], [1, 5]],
			[[0, 3], [0, 4], [1, 4], [1, 5]],
			[[0, 3], [0, 4], [0, 5], [0, 6]]
		];
	}

	static get turnDeltas(): object {
		/* The amount to change each block's location upon rotation (90, -180, -90, and 0 resp.)
		 * Note: all columns should add up to 0
		 */
		return {
			"block1": [
				[[1, 1], [2, 0], [-1, 1], [0, 0]],
				[[-1, -1], [-2, 0], [1, -1], [0, 0]]
			],
			"block2": [
				[[2, 0], [-1, 1], [0, 0], [1, -1]],
				[[-1, -2], [0, 1], [-1, 0], [-2, -1]],
				[[-1, 1], [2, 0], [1, 1], [0, 2]],
				[[0, 1], [-1, -2], [0, -1], [1, 0]]
			],
			"block3": [
				[[0, 2], [-1, 1], [0, 0], [1, -1]],
				[[1, 0], [0, 1], [-1, 0], [-2, -1]],
				[[1, -1], [2, 0], [1, 1], [0, 2]],
				[[-2, -1], [-1, -2], [0, -1], [1, 0]]
			],
			"block4": [
				[[1, 1], [-1, 1], [0, 0], [1, -1]],
				[[0, -1], [0, 1], [-1, 0], [-2, -1]],
				[[0, 0], [2, 0], [1, 1], [0, 2]],
				[[-1, 0], [-1, -2], [0, -1], [1, 0]]
			],
			// Nothing for block5 :)
			"block6": [
				[[0, 2], [1, 1], [0, 0], [1, -1]],
				[[0, -2], [-1, -1], [0, 0], [-1, 1]]
			],
			"block7": [
				[[-1, 2], [0, 1], [1, 0], [2, -1]],
				[[1, -2], [0, -1], [-1, 0], [-2, 1]]
			]
		};
	}
}
