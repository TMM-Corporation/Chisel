var Chisel = {
    assets: __dir__ + 'src/assets/mod_assets/',
    data: null,
    generators: {
        stone
    }
}
Chisel.data = ResourceManager.ReadJSON(ResourceManager.Select(Chisel.assets, 'gen_blocks.json'))
Chisel.gen_assets = Chisel.assets + 'gen_assets/'
Chisel.terrain_atlas = Chisel.assets + 'terrain_atlas/'

Chisel.genCtmTexture = function (srcPath, destPath) {
    // TODO: Bitmap manager
}
Chisel.genTextures = function () {
    if (Chisel.data)
        for (let blockname in Chisel.data.blocks) {
            let src = Chisel.gen_assets + blockname
            let path = ResourceManager.getFilesList(src)
            for (let key in path) {
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
Chisel.genBlocks = function () {

}
