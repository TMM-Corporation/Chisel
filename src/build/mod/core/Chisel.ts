// let setLoadingTip = ModAPI.requireGlobal("MCSystem.setLoadingTip")
// function Tip(str: string) {
//     if (typeof str === 'string')
//         setLoadingTip(str)
// }
// type _0_15_range = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
// interface BlockProperties {
//     genprops?: {
//         transparency?: number | 1
//     }
//     generator?: string | "default"
//     parents?: string | null
//     register?: boolean | true
//     require_mod?: string | "Chisel"
//     special_type?: {
//         base?: number | 0
//         destroytime?: number | 1
//         explosionres?: number | 3
//         friction?: number | 0.6000000238418579
//         isApproved?: boolean | false
//         lightlevel?: _0_15_range // 0
//         lightopacity?: _0_15_range // 0
//         mapcolor?: number | 0
//         material?: number | 3
//         name?: string
//         renderallfaces?: boolean | false
//         renderlayer?: number | 4
//         rendertype?: number | 0
//         solid?: boolean | false//(transparent)
//         sound?: string | "stone"
//         translucency?: number | 0
//     }
//     subdirs?: null | {}
//     variation?: string | "stone"
//     variations?: null | []
// }

// interface IChiselData {
//     gen_blocks: obj
//     mods: {}
//     generators: {}
//     blockIDs: {}
//     gen_assets: string
//     terrain_atlas: string
//     bmpWorker?: BitmapWorker
// }

// interface IChiselGenerator {
//     (block: {[key: string]: any}, name: string): number[]
// }

// class Chisel {
//     private data: IChiselData
//     constructor(data: IChiselData) {
//         this.data = data
//     }
//     readBlocks() {
//         let blocks = this.data.gen_blocks.blocks
//         for (let blockname in blocks) {
//             let block: BlockProperties = blocks[blockname]
//             Logger.Log(`Name ${blockname}, data: ${JSON.stringify(block)}`, `Chisel-Block`)
//             this.genBlockParams(block, blockname)
//         }
//     }
//     addGenerator(customGenerator: IChiselGenerator, name: string) {
//         let generators = this.data.generators
//         if (typeof customGenerator !== 'function')
//             throw `Cannot add generator function, generator is ${typeof customGenerator}`
//         if (typeof name !== 'string')
//             throw `Cannot add generator with name type ${typeof name}`
//         if (name in generators)
//             throw `Cannot add generator with name ${name}, generator is exists`

//         Logger.Log(`Added new block generator "${name}"`, 'Chisel-Generators')
//         generators[name] = customGenerator
//     }
//     genBlockParams(block: BlockProperties, name: string, ModPrefix?: string) {
//         let data = this.data
//         if (typeof ModPrefix !== 'string')
//             ModPrefix = 'Chisel'
//         Logger.Log(`Adding new block ${name}`, 'Chisel-BlockParams')
//         if (!block)
//             throw `Cannot create block ${(name ? name : undefined)}, ${block}`

//         if (typeof block.subdirs === 'object' && !Array.isArray(block.subdirs))
//             for (let key in block.subdirs)
//                 this.genBlockParams(block.subdirs[key], key)

//         if (typeof block.generator !== 'string' && block.generator)
//             Logger.Log(`Cannot get custom generator for block ${name} generator has invalid type = ${+ typeof block.generator}`, `${ModPrefix}-Custom-Generator`)

//         if (!block.generator)
//             block.generator = "default"

//         if (typeof block.require_mod === 'string')
//             if (!data.mods[block.require_mod])
//                 Logger.Log(`Cannot add block with name ${name}, mod ${block.require_mod} is not found'`, ModPrefix)

//         if (typeof block.register === 'undefined')
//             block.register = true
//         else if (block.register == false)
//             return

//         if (!block.variation || block.variation !== 'custom')
//             block.variation = "stone"

//         if (block.variation === 'custom' && !block.variations)
//             throw 'Custom variation is set, but variations not found'

//         if (block.variation === 'custom' && !Array.isArray(block.variations))
//             throw 'Custom variation is set, but variations format is not object'

//         if (!data.generators[block.generator])
//             Logger.Log(`Cannot generate block with ${block.generator}, generator not registered`, `${ModPrefix}-Data-Generators`)
//         else if (typeof data.generators[block.generator] === 'function') {
//             let ids = data.generators[block.generator](block, name, ModPrefix)

//             if (typeof ids === 'object') {
//                 Item.addCreativeGroup(name, `Chisel ${name}`, ids.map(function (item: string) {return BlockID[item]}))
//                 data.blockIDs[name] = ids
//             }
//         }
//         else Logger.Log(`Cannot execute generator ${block.generator} for block ${name}, generator is ${typeof this.data.generators[block.generator]}`, `${ModPrefix}-Execute-Generator`)
//     }
//     logData() {
//         Logger.Log(JSON.stringify(this.data.gen_blocks), 'Chisel-Data')
//         Logger.Log(JSON.stringify(this.data.mods), 'Chisel-Data')
//         Logger.Log(JSON.stringify(this.data.generators), 'Chisel-Data')
//         Logger.Log(JSON.stringify(this.data.blockIDs), 'Chisel-Data')
//         Logger.Log(this.data.gen_assets, 'Chisel-Data')
//         Logger.Log(this.data.terrain_atlas, 'Chisel-Data')
//     }
// }

// interface IBitmapSources {
//     srcPath: string
//     srcName: string
//     destPath: string
//     destName: string
// }
// interface IBitmapSizes {
//     width: number | 32
//     height: number | 32
//     textureSize: number | 16
//     textureSlicesH: number | 2
//     textureSlicesV: number | 2
//     name?: string | 'default'
//     rows: number | 2
//     cols: number | 2
// }
// class BitmapWorker {
//     public CTMSizes: IBitmapSizes[] = []
//     addCTMSizes(dim: IBitmapSizes) {
//         this.CTMSizes.push(dim)
//     }
//     genTexture(rm: ResourceManager,source: IBitmapSources): boolean {
//         let bmp = rm.ReadBitmap(source.srcPath, source.srcName)
//         let isCTM = this.genCTMTexture(rm, source)
//         if (isCTM == false)
//             rm.WriteBitmap(bmp, source.destPath, source.destName)
//         return isCTM
//     }
//     genCTMTexture(rm: ResourceManager,source: IBitmapSources): boolean {
//         let ctmType = source.destName.match(/(ctm[a-z]|ctm)/)
//         if (!ctmType)
//             return false
//         switch (ctmType[0]) {
//             case 'ctm': case 'ctmv': case 'ctmh': this.generateDefaultCTM(rm, source, ctmType[0]); break
//             default: Logger.Log(`Cannot generate ctm texture named ${ctmType[0]}`, 'Chisel-BitmapWorker'); break
//         }
//         return true
//     }
//     generateDefaultCTM(rm: ResourceManager,source: IBitmapSources, ctmType: string): void {
//         let bitmap = rm.ReadBitmap(source.srcPath, source.srcName)
//         let w = bitmap.getWidth()
//         let h = bitmap.getHeight()
//         // alert(`${ctmType}:${source.destName}`)
//         this.CTMSizes.forEach(e => {
//             if (e.height == h && e.width == w && e.textureSize == ((w / e.textureSlicesH) + (h / e.textureSlicesV)) / 2) {
//                 let i = 1
//                 for (let hS = 0; hS < e.textureSlicesH; hS++)
//                     for (let vS = 0; vS < e.textureSlicesV; vS++) {
//                         rm.WriteBitmap(rm.CropBitmap(bitmap, hS * e.textureSize, vS * e.textureSize, e.textureSize, e.textureSize), source.destPath, source.destName.replace(ctmType, '').replace('_0', '' + (i++)))
//                         Logger.Log(`${bitmap}, ${hS * e.textureSize}, ${vS * e.textureSize}, ${e.textureSize}, ${e.textureSize}, ${source.destPath}, ${source.destName.replace(ctmType, '').replace('_0', '' + (i - 1))}, ${i - 1}`, 'Chisel-CTM-Gen')
//                     }
//             }
//         })
//     }
// }

// /**
//  * Block props:
//  * genprops {
//  *   transparency: 1
//  * }
//  * generator = "default"
//  * parents = null
//  * register = true
//  * require_mod = "Chisel"
//  * special_type = {
//  *   base = 0
//  *   destroytime = 1
//  *   explosionres = 3
//  *   friction = 0.6000000238418579
//  *   isApproved = false
//  *   lightlevel = false || 0..15
//  *   lightopacity = 0 || 0..15
//  *   mapcolor = 0
//  *   material = 3
//  *   name
//  *   renderallfaces = false
//  *   renderlayer 4
//  *   rendertype 0
//  *   solid = false(transparent)
//  *   sound = "stone"
//  *   translucency = 0
//  * }
//  * subdirs = null || {}
//  * variation = string || "stone"
//  * variations = null || []
//  */