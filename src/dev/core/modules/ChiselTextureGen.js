var Chisel = {
    assets: __dir__ + 'src/assets/mod_assets/',
    data: null,
    mods: {},
    generators: {},
}

Chisel.data = ResourceManager.ReadJSON(ResourceManager.Select(Chisel.assets, 'gen_blocks.json'))
Chisel.gen_assets = Chisel.assets + 'gen_assets/'
Chisel.terrain_atlas = Chisel.assets + 'terrain_atlas/'

Chisel.readBlocks = function (data) {
    if (data) //reading object
        for (let blockname in data.blocks) { // reading blocks from data
            let block = data.blocks[blockname]
            BlockWorker.genBlock(block, blockname) // generating block textures
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
        let src = Chisel.gen_assets + name
        let path = ResourceManager.getFilesList(src)
        for (let filename in path) {
            alert(filename)
        }
    }, "default"
)

let BitmapWorker = {}
let BlockWorker = {}
let CTMWorker = {}//TODO: rework ctmlib for chisel

BlockWorker.genBlock = function (block, name) {
    if (!block)
        throw 'Cannot create undefined block with ' + (name ? name : undefined)

    if (Object.keys(block).length) {
        block.register = false
        throw 'Cannot create block ' + name + ', no properties found'
    }

    if (typeof block.subdirs === 'object' && !Array.isArray(block.subdirs))
        for (let key in block.subdirs)
            Chisel.blockWorker(block.subdirs[key], key)

    if (typeof block.generator !== 'string' && block.generator)
        throw 'Cannot get custom generator for block ' + name + ', generator has invalid type=' + block.generator

    if (!block.generator)
        block.generator = "default"

    if (typeof block.require_mod === 'string')
        if (!Chisel.mods[block.require_mod])
            throw 'Cannot add block with name ' + name + ', mod ' + block.require_mod + ' is not found'

    if (typeof block.register === 'undefined')
        block.register = true
    else if (block.register == false)
        return

    if (!block.variation || block.variation !== 'custom')
        block.variation = "stone"

    if (block.variation === 'custom' && !block.variations)
        throw 'Custom variation is set, but variations not found'

    if (block.variation === 'custom' && !Array.isArray(block.variations))
        throw 'Custom variation is set, but variations format is not object'

    if (!Chisel.generators[block.generator])
        throw 'Cannot generate block with ' + block.generator + ', generator not registered'
    else if (typeof Chisel.generators[block.generator] === 'function')
        Chisel.generators[block.generator](block, name)
    else throw 'Cannot execute generator ' + block.generator + ' for block ' + name + ', generator is ' + typeof Chisel.generators[block.generator]
}
BitmapWorker.genTexture = function (filePath, filename, destpath) {
    //TODO: create generating texture

}
BitmapWorker.genCTMTexture = function (param) {
    //TODO: create generating texture
}

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