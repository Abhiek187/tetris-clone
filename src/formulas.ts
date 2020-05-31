export default class Formulas {
	static canvasToGrid(pos: [number, number]): [number, number] {
		return [(pos[0] - 37.5) / 25, (pos[1] - 12.5) / 25];
	}
}
