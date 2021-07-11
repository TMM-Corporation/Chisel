namespace TileVariation {
	export function Import(tile_name: string): Carvable.Tile.Description {
		let file = RM.Select(`${__dir__}${ModData.dirs.json}/tiles/${tile_name}.json`)
		return RM.ReadJSON(file)
	}
	export function insertBefore(json: Carvable.Tile.Description, data: Carvable.Tile.Variation[]) {
		json.variations = [...json.variations, ...data]
	}
	export function insertAfter(json: Carvable.Tile.Description, data: Carvable.Tile.Variation[]) {
		json.variations = [...data, ...json.variations]
	}
	export function Create(groupID: string, displayName: string, filename: string | Carvable.Tile.Description) {
		var group = new Carvable.Group(groupID, displayName)
		group.addFromDescription(typeof filename == "string" ? TileVariation.Import(filename) : filename)
	}
}