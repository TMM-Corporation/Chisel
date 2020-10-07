var BlockManager = {}
var SpecialTypes = {}

BlockManager.registerBlock = function (blockname) {
    let get = ScriptingManager.readProperty
    let doWith = ScriptingManager.doWith
    let data = ScriptingManager.namespaces["blocks"][blockname]
    let id = get(data.namedID)

    IDRegistry.genBlockID(id)
    Block.createBlock(id, get(data.defineData), get(data.special_type) || null)

    let shp = get(data.shape)
    if (shp) {
        let p1 = shp.start, p2 = shp.end
        Block.setShape(id, p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], 0)
    }

}

BlockManager.checkDefineData = function (defData) {
    
}

BlockManager.registerList = function (list) {
    for(let i in list) {
        this.registerBlock(list[i])
    }
}

BlockManager.getDrop = function (property) {
    // if (data.drop) {
    //     let drop = data.drop
    //     Block.registerDropFunction(id, function (coords, blockID, blockData, level, enchant) {
    //         if (drop.modifiers)
    //             BlockManager.getModifiers(drop.modifiers)

    //         if (drop.breakLevel)
    //             for (let level in drop.breakLevel) {
    //                 let curr = Number(level)
    //                     BlockManager.getModifiers(property)

    //             }
    //     })
    // }
}