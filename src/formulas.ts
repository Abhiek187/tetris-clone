export default class Formulas {
	static canvasToGrid(pos: [number, number]): [number, number] {
		return [(pos[0] - 37.5) / 25, (pos[1] - 12.5) / 25];
	}

	static gridToCanvas(pos: [number, number]): [number, number] {
		return [pos[0] * 25 + 37.5, pos[1] * 25 + 12.5];
	}
}
