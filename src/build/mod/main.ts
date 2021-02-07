// var assets = __dir__ + 'resources/'
// var resources = {
//     dir: {
//         assets: 'resources/mod_assets/',
//         chisel: 'resources/mod_assets/chisel/',
//         chisel_guide: 'resources/mod_assets/chisel_guide/',
//         items_opaque: 'resources/mod_assets/items-opaque/',
//         resource_packs: 'minecraft_packs/resource/',
//         behavior_packs: 'minecraft_packs/behavior/',
//         structures: 'resources/mod_assets/structures/',
//         terrain_atlas: 'resources/mod_assets/terrain-atlas/',
//         ui: 'resources/mod_assets/ui/',
//     },
//     files: {
//         contents: 'resources/mod_assets/contents.json',
//         translations: 'resources/mod_assets/translations.json',
//         cache: 'resources/mod_assets/namespaces.cache'
//     }
// }
// var RM = new ResourceManager()
// RM.resources = resources

// var ChiselData: IChiselData = {
//     gen_blocks: RM.ReadJSON(RM.Select(`${assets}/mod_assets/`, 'gen_blocks.json')),
//     mods: {},
//     generators: {},
//     blockIDs: [],
//     gen_assets: assets + 'gen_assets/',
//     terrain_atlas: assets + 'mod_assets/terrain-atlas/',
//     bmpWorker: new BitmapWorker()
// }
// ChiselData.bmpWorker.addCTMSizes({
//     width: 32, height: 32, textureSize: 16, textureSlicesH: 2, textureSlicesV: 2, cols: 2, rows: 2
// })

// var ChiselMod = new Chisel(ChiselData)

// ChiselMod.addGenerator(
//     function (_block: {}, name: string): number[] {
//         let ids = [], src: string, files: string[], filename: string, nameID: string, path: string

//         path = ChiselData.terrain_atlas + name + '/'
//         src = ChiselData.gen_assets + name
//         files = RM.getFilesList(src).files

//         files.forEach(function (file) {
//             if (file.endsWith('.png')) {
//                 let filebase = file.replace('.png', '_0.png').replace(/\+|-/g, '_')
//                 filename = ('chisel_' + name + '_' + filebase)
//                 let isCTM = false
//                 if (new java.io.File(path, filename).exists() === false)
//                     isCTM = ChiselData.bmpWorker.genTexture(RM, {srcPath: src, srcName: file, destPath: path, destName: filename})

//                 nameID = filename.replace('_0.png', '')

//                 IDRegistry.genBlockID(nameID)
//                 Block.createBlock(nameID, [{name: (`${name} ${filebase}`).replace('_0.png','').replace('_', ' '), texture: [[nameID, 0]], inCreative: true}])
//                 if (isCTM) {
//                     let ctmName = (filename.replace('_0.png', '').replace(/_(ctm|ctmv|ctmh)/,''))
//                     Logger.Log(ctmName,'Chisel-CTM-Name')
//                     if (filename.match('glass'))
//                         ConnectedTexture.setModelForGlass(BlockID[nameID], 0, ctmName, name)
//                     else
//                         ConnectedTexture.setModel(BlockID[nameID], 0, ctmName, name)
//                 }
//                 ids.push(nameID)
//                 // Logger.Log((src + ' = ' + typeof src) + ' : ' + (file + ' = ' + typeof file) + ' : ' + (bmp + ' = ' + typeof bmp), "Chisel Writing Textures")
//             }
//             // Logger.Log(file+'_'+(typeof file)+':'+Object.keys(file), "Chisel Textures")
//         })
//         // Tip('[Chisel] Generating block ' + name)
//         return ids
//     }, "default"
// )

// ChiselMod.readBlocks()
// ChiselMod.logData()
// TODO: Система Connectable
// TODO: Система Carvable
// TODO: Система Shared Api для Carvable
/* TODO: Система добавления режимов */
/* TODO: Система создания пк Гуи */
/* TODO:  */

class IronChiselUI extends WindowGroup {
	constructor() {
		super()
		this.setup()
	}
	setup() {
		this.instance.addWindowInstance('inventory_classic', new Inventory('classic').Window)
	}
}

new CustomChiselItem({
	item: {
		name: "Chisel Iron",
		nameID: "chisel_iron",
		texture: { name: "chisel_iron", data: 0 },
		langKey: "item.chisel.chisel_iron.name"
	},
	langs: {
		name: "item.chisel.chisel_iron.name",
		description: "",
	},
	type: "iron",
	ui: new IronChiselUI(),
	mode: "default",
	mode_list: [{ name: "default", blocks: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 0, y: 1, z: 1 }] }]
})

let blocks = new Carvable()

// blocks.createDefaultBlocks(createData)