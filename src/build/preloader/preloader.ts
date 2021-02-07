interface IConvertable {
	name: string
	base: obj
	sourceData: obj
}
interface IBlockConvertable {
	rm: ResourceManager
	basePath: string
	dataPath: string
	convertName: string
}



var assets = __dir__ + 'resources/'
var resources = {
	root: __dir__,
	dir: {
		/**
		 * @returns mod assets path, ends with /
		 */
		assets: "resources/ic_mod/",
		/**
		 * @returns behavior packs path, ends with /
		 */
		behavior_packs: "minecraft_packs/behavior/",
		/**
		 * @returns java chisel resources path, ends with /
		 */
		chisel: "resources/chisel/",
		/**
		 * @returns java chisel guide path, ends with /
		 */
		chisel_guide: "resources/chisel_guide/",
		/**
		 * @returns item textures path, ends with /
		 */
		items_opaque:"resources/ic_mod/items-opaque/",
		/**
		 * @returns resource packs path, ends with /
		 */
		resource_packs: "minecraft_packs/resource/",
		/**
		 * @returns sounds path, ends with /
		 */
		sound: "resources/ic_mod/sounds/",
		/**
		 * @returns structures path, ends with /
		 */
		structures: "resources/ic_mod/structures/",
		/**
		 * @returns block textures path, ends with /
		 */
		terrain_atlas: "resources/ic_mod/terrain-atlas/",
		/**
		 * @returns ui textures path, ends with /
		 */
		ui: "resources/ic_mod/ui/"
	},
	files: {
		data: 'resources/ic_mod/data.json',
		translations: 'resources/ic_mod/translations.json'
	}
}

var RM = new ResourceManager()
RM.resources = resources
RM.isPreloader = true
var BW = new BitmapWorker()
// class BlockWorker {
// 	convertBlock(main: IBlockConvertable) {
// 		let base = main.rm.ReadJSON(main.rm.Select(main.basePath))
// 		let data = main.rm.ReadJSON(main.rm.Select(main.dataPath))
// 		this.convert({name: main.convertName, base: base, sourceData: data})
// 	}
// 	convert(source: IConvertable) {
// 		let base = source.base, name = source.name
// 		base.namespace = name
// 		base.tile.name = name + ".name"
// 		let variants = source.sourceData.variants
// 		base.tile.variations = {}
// 		for (let key in variants) {
// 			let element = variants[key]
// 			base.tile.variations[key] = {
// 				lang: [`tile.${base.mod}.${name}.${key}.desc.1`],
// 				textures: element[0].textures || {},
// 				model: element[0].model || "cube_all"
// 			}
// 		}
// 		return base
// 	}
// }
