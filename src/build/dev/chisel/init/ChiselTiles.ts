// class ChiselTile {
// 	filename: string
// 	constructor(file: string) {
// 		this.filename = file
// 		this.openFile()
// 	}
// 	openFile() {

// 	}
// }
function OpenTile(tile_name: string): any {
	let file = RM.Select(`${__dir__}${RM.resources.dirs.json}/tiles/${tile_name}.json`)
	return RM.ReadJSON(file)
}