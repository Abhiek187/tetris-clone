export default class Constants {
	static get width(): number {
		return 300; // width of canvas
	}

	static get height(): number {
		return 550; // height of canvas
	}

	static get blockData(): any {
		/* Information about each tetris block
		 * startX: start x point, startY: start y point,
		 * sideDelta: px from center to side edge, bottomDelta: px from center to bottom edge
		 */
		return {
			normal: {
				startX: 137.5,
				startY: 25,
				sideDelta: 37.5,
				bottomDelta: 25
			},
			square: {
				startX: 150,
				startY: 25,
				sideDelta: 25,
				bottomDelta: 25
			},
			wide: {
				startX: 150,
				startY: 12.5,
				sideDelta: 50,
				bottomDelta: 12.5
			}
		};
	}
}
