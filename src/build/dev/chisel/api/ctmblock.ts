interface CTMLayer {
	0: number
	1: number
	2: number
	3: number
	4: number
}
interface CTMLayers {
	[index: string]: CTMLayer
}
interface CTMCoords {
	0: number
	1: number
}
interface CTMCoordsX extends CTMCoords {}
interface CTMCoordsY extends CTMCoords {}
interface CTMCoordsZ extends CTMCoords {}
interface CTMConditions {
	x?: [CTMCoordsY, CTMCoordsZ]
	y?: [CTMCoordsX, CTMCoordsZ]
	z?: [CTMCoordsX, CTMCoordsY]
}
interface CTMCondition {
	name: string
	layers: CTMLayers,
	conditions: CTMConditions
}
// let asd: CTMCondition = {
// 	"name": "left",
// 	"layers": {
// 		"0": [1, 0, 0, 1, 0],
// 		"4": [0, 1, 1, 0, 0]
// 	},
// 	"conditions": {
// 		"x": [[1, -1], [1, -1]],
// 		"y": [[1, -1], [1, -1]],
// 		"z": [[1, -1], [1, -1]]
// 	}
// }