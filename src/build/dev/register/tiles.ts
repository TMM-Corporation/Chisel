function OpenTile(tile_name: string): Carvable.Tile.Description {
	let file = RM.Select(`${__dir__}${ModData.dirs.json}/tiles/${tile_name}.json`)
	return RM.ReadJSON(file)
}
const tiles = []
function createTile(groupId: string, groupName: string, filename: string | Carvable.Tile.Description) {
	var group = new Carvable.Group(groupId, groupName)
	group.addFromDescription(typeof filename == "string" ? OpenTile(filename) : filename)
}
// let chisel_ancient_stone = OpenTile('chisel_ancient_stone')
// chisel_ancient_stone.variations.unshift({
// 	block: {
// 		id: 0,
// 		data: 0
// 	}
// })
// createTile("chisel_ancient_stone", "Ancient Stone", chisel_ancient_stone)
Callback.addCallback("ItemUse", function (coords, item, block, player) {
	console.debug(JSON.stringify({ coords, item, block, player }), "ItemUse")
})
// let chisel_andesite = OpenTile('chisel_andesite')
// chisel_andesite.variations.unshift(
// 	{
// 		block: {
// 			id: 1,
// 			data: 5
// 		}
// 	},
// 	{
// 		block: {
// 			id: 1,
// 			data: 6
// 		}
// 	})
// createTile("chisel_andesite", "Ancient Stone", chisel_andesite)