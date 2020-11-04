var assets = __dir__ + RM.getBuildConfig().resources[0].path + '/'

var ChiselData: IChiselData = {
    gen_blocks: RM.ReadJSON(RM.Select(assets, 'gen_blocks.json')),
    mods: {},
    generators: {},
    blockIDs: [],
    gen_assets: assets + 'gen_assets/',
    terrain_atlas: assets + 'terrain-atlas/',
    bmpWorker: new BitmapWorker()
}
ChiselData.bmpWorker.addCTMSizes({
    width: 32, height: 32, textureSize: 16, textureSlicesH: 2, textureSlicesV: 2, cols: 2, rows: 2
})

var ChiselMod = new Chisel(ChiselData)

ChiselMod.addGenerator(
    function (_block: {}, name: string): number[] {
        let ids = [], src: string, files: string[], filename: string, nameID: string, path: string

        path = ChiselData.terrain_atlas + name + '/'
        src = ChiselData.gen_assets + name
        files = RM.getFilesList(src).files

        files.forEach(function (file) {
            if (file.endsWith('.png')) {
                let filebase = file.replace('.png', '_0.png').replace(/\+|-/g, '_')
                filename = ('chisel_' + name + '_' + filebase)
                let isCTM = false
                if (new java.io.File(path, filename).exists() === false)
                    isCTM = ChiselData.bmpWorker.genTexture({srcPath: src, srcName: file, destPath: path, destName: filename})

                nameID = filename.replace('_0.png', '')

                IDRegistry.genBlockID(nameID)
                Block.createBlock(nameID, [{name: (`${name} ${filebase}`).replace('_0.png','').replace('_', ' '), texture: [[nameID, 0]], inCreative: true}])
                if (isCTM) {
                    let ctmName = (filename.replace('_0.png', '').replace(/_(ctm|ctmv|ctmh)/,''))
                    Logger.Log(ctmName,'Chisel-CTM-Name')
                    if (filename.match('glass'))
                        ConnectedTexture.setModelForGlass(BlockID[nameID], 0, ctmName, name)
                    else
                        ConnectedTexture.setModel(BlockID[nameID], 0, ctmName, name)
                }
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