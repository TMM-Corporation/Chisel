var DimManager = {}

DimManager.dimList = {}

DimManager.regDimension = function (dimensionName) {
    let get = ScriptingManager.readProperty
    let doWith = ScriptingManager.doWith
    let data = ScriptingManager.namespaces["dimensions"][dimensionName]
    let dimension, generator
    if (data) {
        dimension = new Dimensions.CustomDimension(get(data.name), get(data.dimID))
        generator = Dimensions.newGenerator(get(data.generator.layers))
        
        let genParams = get(data.generator.params)
        if (genParams) {
            doWith(generator.removeModGenerationBaseDimension, genParams.disableModGeneration)
            doWith(generator.setBuildVanillaSurfaces, genParams.vanillaDecorations)
            doWith(generator.setGenerateModStructures, genParams.generateModStructures)
            doWith(generator.setGenerateVanillaStructures, genParams.generateVanillaStructures)
            doWith(generator.setModGenerationBaseDimension, genParams.modGenerationBaseDimension)
        }

        let fogDist = get(data.fogDistance)
        if (fogDist)
            dimension.setFogDistance(fogDist.start, fogDist.end)
        
        doWith(dimension.setHasSkyLight, data.hasSkyLight)
        
        let color = get(data.colors)
        if (color) {
            if (color.cloud)
                dimension.setCloudColor(color.cloud[0], color.cloud[1], color.cloud[2])
            if (color.sky)
                dimension.setSkyColor(color.sky[0], color.sky[1], color.sky[2])
            if (color.fog)
                dimension.setFogColor(color.fog[0], color.fog[1], color.fog[2])
            if (color.sunset)
                dimension.setSunsetColor(color.sunset[0], color.sunset[1], color.sunset[2])
        }

        dimension.setGenerator(generator);
        this.dimList[dimensionName] = {
            dimData: data,
            dimension: dimension,
            generator: generator
        }
        return this.dimList[dimensionName]
    } else
        Logger.Log("Cannot find " + dimensionName + " from dimensions", "MOD")
    return null
}

DimManager.getDimensionByName = function (dimensionName) {
    let dim = this.dimList[dimensionName]
    if(dim)
        return dim
    else
        Logger.Log("Cannot find " + dimensionName + " from dimensions, Dimension not registered", "MOD")
    return null
}