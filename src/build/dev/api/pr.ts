class Preloader {
	Mod: string
	TileSet: IChiselTiles = {};
	ItemSet: obj = {};
	Localization_strings: obj = {};
	RM: ResourceManager = new ResourceManager()
	TextureGenerator: TextureGenerator
	constructor(name: string, dirs: IResourceFileList) {
		this.Mod = name
		this.RM.resources = dirs
		this.TextureGenerator = new TextureGenerator(this.RM)
	}
	//validate any value 
	validate(value: any, first: any, second?: any): void {
		if (value != undefined)
			value ? value : first
		else
			value = second || first
	}
	//validates multiple variations
	validateVariations(variations: ITileVariation[]) {
		variations.forEach(variation =>
			this.validateVariation(variation)
		)
	}
	//validates ctm params
	validateCTM(ctm: ICTMProps | string) {
		let def = default_ctm_values
		if (typeof ctm == 'string') {
			ctm = def
		} else {
			this.validate(ctm.name, 'ctm')
			this.validate(ctm.width, def.width)
			this.validate(ctm.height, def.height)
			this.validate(ctm.textureSize, def.textureSize)
			this.validate(ctm.textureSlicesH, def.textureSlicesH)
			this.validate(ctm.textureSlicesV, def.textureSlicesV)
			this.validate(ctm.animFrames, def.animFrames)
		}
		return ctm
	}
	//validates variation of block
	validateVariation(variation: ITileVariation) {
		let texture = variation.texture
		//validating variation texture
		this.validate(texture.name, 'stone')
		this.validate(texture.data, 0)
		this.validate(texture.type, 'normal')
		this.validate(texture.extension, '.png')

		//validating variation
		this.validate(variation.register, true)

		//validating variation localization
		if (isObject(variation.localization) && typeof variation.localization != 'string')
			this.validate(variation.localization.default_as_localization, false)
		else
			this.validate(variation.localization, null)
		if (texture.ctm)
			this.validateCTM(texture.ctm)

		return variation
	}
	// adds new tile to TileSet
	addTile(name: string, prototype: IChiselTile) {
		this.validate(prototype.register, true)
		this.validate(prototype.skip, false)

		if (isObject(prototype.name) && typeof prototype.name != 'string')
			this.validate(prototype.name.default_as_localization, false)
		else
			this.validate(prototype.name, 'Chisel Block')

		this.validateVariations(prototype.variations)
	}
	addTiles(object: obj) {
		for (let tile_name in object) {
			let tile = object[tile_name]
			this.addTile(tile_name, tile)
		}
	}
	//add variation to registered tile
	addVariation(tile_name: string, variation: ITileVariation) {
		if (this.TileSet[tile_name] != undefined)
			if (this.TileSet[tile_name].variations)
				if (Array.isArray(this.TileSet[tile_name].variations))
					this.TileSet[tile_name].variations.push(this.validateVariation(variation))
	}
}