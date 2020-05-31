export default class Constants {
	// Tetris board is 12x22 tiles, where each tile is 25 px, so width = 300 px & height = 550 px
	static get width(): number {
		return 300; // width of canvas
	}

	static get height(): number {
		return 550; // height of canvas
	}

	static get startIndices(): number[][][] {
		// Start point for each block in terms of the 21x10 grid, top to bottom, left to right
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
}
