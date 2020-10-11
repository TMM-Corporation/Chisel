var Chisel = {
    assets: __dir__ + 'src/assets/mod_assets/',
    data: null,
    mods: {},
    generators: {},
    blockIDs: []
}
let setLoadingTip = ModAPI.requireGlobal("MCSystem.setLoadingTip")
function Tip(str) {
    if (typeof str === 'string')
        setLoadingTip(str)
}
// Logger.Log = function (message, prefix) {
//     Logger.Log(message, "Chisel" + (prefix ? '$' + prefix : ''))
// }
Chisel.data = ResourceManager.ReadJSON(ResourceManager.Select(Chisel.assets, 'gen_blocks.json'))
Chisel.gen_assets = Chisel.assets + 'gen_assets/'
Chisel.terrain_atlas = Chisel.assets + 'terrain-atlas/'

Chisel.readBlocks = function (data) {
    if (data) //reading object
        for (let blockname in data.blocks) { // reading blocks from data
            let block = data.blocks[blockname]
            BlockWorker.genBlockParams(block, blockname) // generating block textures
            // let path = ResourceManager.getFilesList(src)
            // for (let key in path) { //TODO: rework this loop, and replace this to blockworker
            //     let value = path[key]

            // }
        }
}

Chisel.addGenerator = function (generator, name) {
    if (typeof generator !== 'function')
        throw 'Cannot add generator function, generator is ' + typeof generator
    if (typeof name !== 'string')
        throw 'Cannot add generator with name type ' + typeof name
    if (name in Chisel.generators)
        throw 'Cannot add generator with name ' + name + ', generator is exists'

    Chisel.generators[name] = generator
}

Chisel.addGenerator(
    function (block, name) {
        let ids = [], src, files, filename, nameID, path

        path = Chisel.terrain_atlas + name + '/'
        src = Chisel.gen_assets + name
        files = ResourceManager.getFilesList(src).files

        files.forEach(function (file) {
            if (file.endsWith('.png')) {
                filename = ('chisel_' + name + '_' + file.replace('.png', '_0.png').replace(/-/g, '_'))
                if (new java.io.File(path, filename).exists() === false)
                    BitmapWorker.genTexture(src, file, path, filename)
                nameID = filename.replace('_0.png', '')

                IDRegistry.genBlockID(nameID)
                Block.createBlock(nameID, [{ name: "Test", texture: [[nameID, 0]], inCreative: true }])
                ids.push(nameID)
                // Logger.Log((src + ' = ' + typeof src) + ' : ' + (file + ' = ' + typeof file) + ' : ' + (bmp + ' = ' + typeof bmp), "Chisel Writing Textures")
            }
            // Logger.Log(file+'_'+(typeof file)+':'+Object.keys(file), "Chisel Textures")
        })
        // Tip('[Chisel] Generating block ' + name)
        return ids
    }, "default"
)

let BitmapWorker = {}
let BlockWorker = {}

BlockWorker.genBlockParams = function (block, name, ModPrefix) {
    if (typeof ModPrefix !== 'string')
        ModPrefix = 'chisel'

    if (!block)
        Logger.Log('Cannot create undefined block with ' + (name ? name : undefined), ModPrefix)

    if (typeof block.subdirs === 'object' && !Array.isArray(block.subdirs))
        for (let key in block.subdirs)
            BlockWorker.genBlockParams(block.subdirs[key], key)

    if (typeof block.generator !== 'string' && block.generator)
        Logger.Log('Cannot get custom generator for block ' + name + ', generator has invalid type =' + typeof block.generator, ModPrefix)

    if (!block.generator)
        block.generator = "default"

    if (typeof block.require_mod === 'string')
        if (!Chisel.mods[block.require_mod])
            Logger.Log('Cannot add block with name ' + name + ', mod ' + block.require_mod + ' is not found', ModPrefix)

    if (typeof block.register === 'undefined')
        block.register = true
    else if (block.register == false)
        return

    if (!block.variation || block.variation !== 'custom')
        block.variation = "stone"

    if (block.variation === 'custom' && !block.variations)
        Logger.Log('Custom variation is set, but variations not found', ModPrefix)

    if (block.variation === 'custom' && !Array.isArray(block.variations))
        Logger.Log('Custom variation is set, but variations format is not object', ModPrefix)

    if (!Chisel.generators[block.generator])
        Logger.Log('Cannot generate block with ' + block.generator + ', generator not registered', ModPrefix)
    else if (typeof Chisel.generators[block.generator] === 'function') {
        let ids = Chisel.generators[block.generator](block, name, ModPrefix)

        if (typeof ids === 'object') {
            Item.addCreativeGroup(name, "Chisel " + name, ids.map(function (item) { return BlockID[item] }))
            Chisel.blockIDs[name] = ids
        }
    }
    else Logger.Log('Cannot execute generator ' + block.generator + ' for block ' + name + ', generator is ' + typeof Chisel.generators[block.generator], ModPrefix)
}
BitmapWorker.genTexture = function (src, file, path, filename) {
    let bmp = ResourceManager.ReadBitmap(src, file)
    ResourceManager.WriteBitmap(bmp, path, filename)
}
BitmapWorker.genCTMTexture = function (param) {
    //TODO: create generating texture
}
Chisel.readBlocks(Chisel.data)
/**
 * Block props:
 * genprops {
 *   transparency: 1
 * }
 * generator = "default"
 * parents = null
 * register = true
 * require_mod = "chisel"
 * special_type = {
 *   base = 0
 *   destroytime = 1
 *   explosionres = 3
 *   friction = 0.6000000238418579
 *   isApproved = false
 *   lightlevel = false || 0..15
 *   lightopacity = 0 || 0..15
 *   mapcolor = 0
 *   material = 3
 *   name
 *   renderallfaces = false
 *   renderlayer 4
 *   rendertype 0
 *   solid = false(transparent)
 *   sound = "stone"
 *   translucency = 0
 * }
 * subdirs = null || {}
 * variation = string || "stone"
 * variations = null || []
 */