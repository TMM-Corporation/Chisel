var assets = __dir__ + RM.getBuildConfig().resources[0].path+'/'

var ChiselData: IChiselData = {
    gen_blocks: RM.ReadJSON(RM.Select(assets, 'gen_blocks.json')),
    mods: {},
    generators: {},
    blockIDs: [],
    gen_assets: assets + 'gen_assets/',
    terrain_atlas: assets + 'terrain-atlas/',
    bmpWorker: new BitmapWorker()
}

var ChiselMod = new Chisel(ChiselData)

ChiselMod.addGenerator(
    function (_block: {}, name: string): number[] {
        let ids = [], src: string, files: string[], filename: string, nameID: string, path: string

        path = ChiselData.terrain_atlas + name + '/'
        src = ChiselData.gen_assets + name
        files = RM.getFilesList(src).files

        files.forEach(function (file) {
            if (file.endsWith('.png')) {
                filename = ('chisel_' + name + '_' + file.replace('.png', '_0.png').replace(/-/g, '_'))
                if (new java.io.File(path, filename).exists() === false)
                    ChiselData.bmpWorker.genTexture(src, file, path, filename)
                nameID = filename.replace('_0.png', '')

                IDRegistry.genBlockID(nameID)
                Block.createBlock(nameID, [{name: "Test", texture: [[nameID, 0]], inCreative: true}])
                ids.push(nameID)
                // Logger.Log((src + ' = ' + typeof src) + ' : ' + (file + ' = ' + typeof file) + ' : ' + (bmp + ' = ' + typeof bmp), "Chisel Writing Textures")
            }
            // Logger.Log(file+'_'+(typeof file)+':'+Object.keys(file), "Chisel Textures")
        })
        // Tip('[Chisel] Generating block ' + name)
        return ids
    }, "default"
)

ChiselMod.readBlocks()
ChiselMod.logData()