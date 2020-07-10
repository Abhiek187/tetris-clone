export default class Formulas {
	static canvasToGrid(pos: [number, number]): [number, number] {
		// Convert from canvas coordinates to array indices
		return [(pos[0] - 12.5) / 25, (pos[1] - 37.5) / 25];
	}

	static gridToCanvas(pos: [number, number]): [number, number] {
		// Convert from array indices to canvas coordinates
		return [pos[0] * 25 + 12.5, pos[1] * 25 + 37.5];
	}
}
