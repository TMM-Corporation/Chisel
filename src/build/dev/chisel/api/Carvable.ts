
interface ICTMProps {
	// ctm sliceable texture name
	name: string
	extension?: string
	// ctm type name
	type?: string | default_ctm_names
	// texture width
	width?: number | 32
	// texture height
	height?: number | 32
	// base texture slice size
	textureSize?: number | 16
	// horizontal slices count
	textureSlicesH?: number | 2
	// vertical slices count
	textureSlicesV?: number | 2
	// animation frame count
	animFrames?: number | 0
}

type default_ctm_names = 'ctm' | 'ctmh' | 'ctmv'
const default_ctm_values: ICTMProps = {
	name: "ctm",
	width: 32,
	height: 32,
	textureSize: 16,
	textureSlicesH: 2,
	textureSlicesV: 2,
	animFrames: 0,
}
interface ITexture {
	// unique texture name
	name: string
	// custom texture data, default is 0
	data?: number | 0
	// ctm properties for variation
	ctm?: ICTMProps
	// custom variation type, default is 'normal', for example ctm, ctmh, ctmv
	type?: string | 'normal'
	// file extension, default is '.png'
	extension?: string | '.png'
}
interface ILocalization {
	// default name for block
	default?: string
	// use default name as localization string
	default_as_localization?: boolean
	// string or multiple strings for localization name
	localization?: string | string[]
}
interface ITileVariation {
	// fullblock texture
	texture: ITexture
	// tooltip additional name for variation
	localization?: ILocalization | string[]
	// register variation
	register?: boolean
}
interface IChiselTile {
	// register to mod data
	register?: boolean | true
	// block name or localized name
	name?: string
	// tooltip main name for block
	localization: string[]
	// block variations
	variations: ITileVariation[]
}
interface IChiselTiles {
	[tile: string]: IChiselTile
}


// class ChiselVariation implements ITileVariation {
// 	texture: ITexture
// 	register = true
// 	localization: string[]
// 	constructor(name: string, ext: string, type?: string, ctm?: ICTMProps) {
// 		this.texture = {
// 			name: name,
// 			extension: ext || 'png',
// 			type: type || 'normal',
// 			ctm: ctm
// 		}
// 		this.localization = [`tile_${name}_desc`]
// 	}
// }

// class ChiselTile implements IChiselTile {
// 	register = true
// 	name = ''
// 	variations: ITileVariation[]
// 	constructor(name: string, variations: ITileVariation[]) {
// 		this.name = `tile_${name}_name`
// 		this.variations = variations
// 		log(JSON.stringify(this))
// 	}
// }


interface IBlock {
	id: number
	data: number
}

interface Group {
	[group_name: string]: number[]
}

interface ICarvable {
	TileSet: IChiselTiles
	GroupSet: Group[]
	// add and register block and variations
	addTile(Tile: IChiselTile): void
	createTranslation(mod_name: string, strings: string[]): void
	// create default block with type = normal
	createBlock(variation: ITileVariation, Tile: IChiselTile): void
	// if block type != normal, creating ctm block variation
	createCTMBlock(variation: ITileVariation, id: number, data: number, Tile: IChiselTile): void
	createCTMBlockFromLib(variation: ITileVariation): void
	// returns all variations of block for group
	getBlocksByGroupID(group: string): ITileVariation[]
	// return group of block variation
	getGroupByBlockID(block: IBlock): string
}

enum DefaultBlockTypes {
	normal,
	ctm,
	ctmh,
	ctmv
}

var Carvable: ICarvable = {
	TileSet: {},
	GroupSet: [],
	addTile(Tile: IChiselTile): void {
		let ids: number[] = []
		Tile.variations.forEach((v: ITileVariation) => {
			let result = -1
			if (v.register)
				result = this.createBlock(v, Tile)
			if (result != -1)
				ids.push(result)
		})
		if (ids.length > 2)
			Item.addCreativeGroup(Tile.name, `${RM.mod} - ${Tile.name}`, ids)
	},
	createTranslation() {

	},
	createBlock(variation: ITileVariation, Tile: IChiselTile): number {
		let type = variation.texture.type
		let numID = -1
		let id = variation.texture.name
		Logger.Log(`Creating ${id}`, RM.mod)
		numID = IDRegistry.genBlockID(id)
		Block.createBlock(id, [{ name: id, texture: [[id, 0]], inCreative: true }])
		Logger.Log(`New ID = ${numID}`, RM.mod)
		if (variation.texture.ctm)
			this.createCTMBlock(variation, numID, 0, Tile)
		return numID
	},
	createCTMBlock(variation: ITileVariation, id: number, data: number, Tile?: IChiselTile) {
		let group = CTM.addToGroup(id, data, variation.texture.name), block
		if (variation.texture.ctm.type == "ctm")
			block = CTM.DefaultCTM.createModel(group, [variation.texture.name, variation.texture.ctm.name])
		if (variation.texture.ctm.type == "ctmh")
			block = CTM.HorizontalCTM.createModel(group, [variation.texture.name, variation.texture.ctm.name])
		CTM.setItemModel.setDefaultModel(id, data, variation.texture.name)
		CTM.setBlockModel.setDefaultModel(id, data, block)
		Logger.Log(`${variation.texture.name} has CTM`, RM.mod)
	},
	createCTMBlockFromLib(variation: ITileVariation) {
		let id = variation.texture.name
		let numID = IDRegistry.genBlockID(id)
		Block.createBlock(id, [{ name: id, texture: [[id, 0]], inCreative: true }])
		ConnectedTexture.setModel(numID, 0, "chisel_dbg_slice")
	},
	getBlocksByGroupID(group: string): ITileVariation[] {
		return []
	},
	getGroupByBlockID(block: IBlock): string {
		return ''
	}
}
// interface ICarvableGroup {
// 	create(nameID: string, defineData: Block.BlockVariation[], blockType?: Block.SpecialType | string): number
// 	addBlock(variation: ITileVariation)

// }


class CarvableGroup {
	GroupName: string
	BlockList: number[]
	constructor(name: string) {
		this.GroupName = name
	}
	addBlock(block: CarvableBlock) {

	}
	addBlocks(block: CarvableBlock[]) {

	}
}
class CustomPlaceRule {
	name: string
	ruleFunc: Callback.BuildBlockFunction
	constructor(name: string) {
		this.name = name
	}
	setRule(func: Callback.BuildBlockFunction) {
		this.ruleFunc = func
	}
}
interface IBlockData {
	id?: number
	namedID?: string
	name?: string
	texture?: [string, number][]
	group?: string
	rule?: CustomPlaceRule
}
class CarvableBlock {
	BlockData: IBlockData = {}
	constructor(id: string) {
		let numID = IDRegistry.genBlockID(id)
	}
	get id() {
		return this.BlockData.id
	}
	get namedID(): string {
		return this.BlockData.namedID
	}
	setTexture(texture: [string, number][]) {
		this.BlockData.texture = texture
	}
	get texture() {
		return this.BlockData.texture
	}
	setName(name: string) {
		this.BlockData.name = name
	}
	get name() {
		return this.BlockData.name
	}
	setPlaceRule(place_rule: CustomPlaceRule) {
		this.BlockData.rule = place_rule
	}
	get rule() {
		return this.BlockData.rule
	}
	create(namedID: string, variations: Block.BlockVariation[]) {
		Block.createBlock(namedID || this.namedID, variations || [{ name: this.name, texture: this.texture, inCreative: true }])
	}
}

