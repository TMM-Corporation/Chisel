RM.mod = 'chisel'
RM.resources = {
	dirs: {
		/** @returns mod assets path, ends with / */
		assets: "resources/ic_mod/",
		/** @returns java chisel resources path, ends with / */
		chisel: "resources/pc_mod/chisel/",
		/** @returns java chisel guide path, ends with / */
		chisel_guide: "resources/pc_mod/chisel_guide/",
		/** @returns item textures path, ends with / */
		items_opaque: "resources/ic_mod/items-opaque/",
		/** @returns block textures path, ends with / */
		terrain_atlas: "resources/ic_mod/terrain-atlas/",
		/** @returns sounds path, ends with / */
		sound: "resources/ic_mod/sounds/",
		/** @returns ui textures path, ends with / */
		ui: "gui/ui/",
		/** @returns ui textures path, ends with / */
		json: "json/"
	},
	files: {
		test: 'json/test.json',
		textures: 'json/textures.json',
		ctmtypes: 'json/ctmtypes.json',
		blocks: 'json/blocks.json',
	}
}
function OpenTile(tile_name: string): any {
	let file = RM.Select(`${__dir__}${RM.resources.dirs.json}/tiles/${tile_name}.json`)
	return RM.ReadJSON(file)
}