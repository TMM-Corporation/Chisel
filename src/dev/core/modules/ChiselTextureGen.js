var Chisel = {
    assets: __dir__ + 'src/assets/mod_assets/',
    data: null,
    mods: {},
    generators: {
        default(block, variation) {

        },
        bookshelfGen(block, variation) {

        }
    },
}
Chisel.data = ResourceManager.ReadJSON(ResourceManager.Select(Chisel.assets, 'gen_blocks.json'))
Chisel.gen_assets = Chisel.assets + 'gen_assets/'
Chisel.terrain_atlas = Chisel.assets + 'terrain_atlas/'

Chisel.genCtmTexture = function (srcPath, destPath) {
    // TODO: CTM Bitmap manager
}
Chisel.genTexture = function (srcPath, destPath) {
    // TODO: Bitmap manager
}
Chisel.readBlocks = function () {
    if (Chisel.data)
        for (let blockname in Chisel.data.blocks) {
            let src = Chisel.gen_assets + blockname
            let path = ResourceManager.getFilesList(src)
            for (let key in path) { //TODO: rework this loop, and replace this to blockworker
                let value = path[key]
                switch (key) {
                    case "variation":
                        switch (value) {
                            case "stone":
                                let stone = Chisel.data.block_variations.stone
                                for (let variation in stone) {
                                    // if (stone[variation].search(/ctm[A-z]|ctm/)) // TODO: add ctm check
                                    // TODO: Gen ctm textures
                                    // TODO: Rewrite current ctm lib for chisel
                                    ResourceManager.CopyToDest(src + '/' + stone[variation] + '.png', Chisel.terrain_atlas + blockname + variation + '.png')
                                }
                                break
                        }

                        break
                }
            }
        }
}
function BitmapWorker() { }
function BlockWorker() { }
function CTMWorker() { }//TODO: rework ctmlib for chisel

BlockWorker.prototype.genBlock = function (block, name) {
    if (!block)
        throw 'Cannot create undefined block with ' + (name ? name : undefined) + name

    if (typeof block.subdirs === 'object' && !Array.isArray(block.subdirs)) {
        for (let key in block)
            Chisel.blockWorker(key[block], block)
        return
    }

    if (typeof block.generator !== 'string' && block.generator)
        throw 'Cannot get custom generator for block ' + name + ', generator has invalid type=' + block.generator

    if (!block.generator)
        block.generator = "default"

    if (typeof block.require_mod === 'string')
        if (!Chisel.mods[block.require_mod])
            return

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
    //TODO: check all conditions and generate texture
}
BitmapWorker.prototype.genTexture = function (param) {
    //TODO: create generating texture
}
BitmapWorker.prototype.genCTMTexture = function (param) {
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