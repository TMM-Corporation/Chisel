
interface ICTMProps {
	// ctm sliceable texture name
	name: string
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
	localization?: ILocalization
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
		let block = new CTMBLock([variation.texture.name, variation.texture.ctm.name])
		block.addToGroup(id, data, variation.texture.name)
		block.createModel()
		block.setItemModel(id, data, variation.texture.name)
		block.setRender(id, data, block.model)
		Logger.Log(`${variation.texture.name} has CTM`, RM.mod)
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
interface IVertexUV {
	u: number
	v: number
	scale?: number
}
interface ICTMAxisList {
	[index: number]: string
}
interface ICTMAxis {
	[axis: string]: ICTMAxisList
}
const CTMAxis: ICTMAxis = {
	y: ["x", "z"],
	z: ["x", "y"],
	x: ["z", "y"]
}
class CTMBLock {
	textures: [base: string, ctm: string]
	group: ICRender.Group
	model: ICRender.Model
	currentMesh: RenderMesh
	constructor(textures: [base: string, ctm: string], mesh?: RenderMesh) {
		this.textures = textures
		this.currentMesh = mesh || new RenderMesh()
	}
	addToGroup(id: number, data: number, groupName?: string) {
		const group = ICRender.getGroup(groupName || ("CTM_" + id + ":" + data))
		group.add(id, data)
		this.group = group
	}
	BLOCK(coords: Vector, group: ICRender.Group, mode?: boolean) {
		return ICRender.BLOCK(coords.x || 0, coords.y || 0, coords.z || 0, group, mode || false)
	}
	addCondition(render: ICRender.Model, model: BlockRenderer.Model, condition: ICRender.CONDITION) {
		render.addEntry(model).setCondition(condition)
	}
	setItemModel(id: number, data: number, texture: string) {
		const render = new ICRender.Model()
		render.addEntry(BlockRenderer.createTexturedBlock([[texture, 0]]))
		ItemModel.getFor(id, data).setModel(render)
	}
	setRender(id: number, data: number, model: ICRender.Model) {
		BlockRenderer.setStaticICRender(id, data, model)
	}
	createModel() {
		const render = new ICRender.Model()
		const group = this.group
		const BLOCK = this.BLOCK
		let coords1, coords2, coords3
		let i = 0, j = 0, u = 0, v = 0

		for (let axis in CTMAxis) {
			for (i = 0; i < 4; i++) {
				coords1 = {}
				coords2 = {}
				coords3 = {}
				coords1[CTMAxis[axis][0]] = i & 1 ? 1 : -1
				coords2[CTMAxis[axis][1]] = i >> 1 ? 1 : -1
				u = i & 1 ? 0.5 : 0
				v = i >> 1 ? 0.5 : 0
				coords3[CTMAxis[axis][0]] = u
				coords3[CTMAxis[axis][1]] = v
				let renderConditions = this.renderConditions(
					BLOCK(coords1, group),
					BLOCK(coords2, group),
					BLOCK({
						x: coords1.x || coords2.x,
						y: coords1.y || coords2.y,
						z: coords1.z || coords2.z
					}, group)
				)
				for (j = 0; j < 5; j++) {
					this.addCondition(render, this.createSurfaces(j, coords3, axis), renderConditions[j])
				}
			}
		}
		this.model = render
	}
	getTextureAndUV(key: number) {
		let texture = this.textures
		let out = {
			texture: texture[0],
			uv: {
				u: 0,
				v: 0,
				scale: 0.5
			}
		}
		if (key > 0) {
			out.texture = texture[1]
			out.uv.scale = 0.25
			switch (key) {
				case 2:
					out.uv.u = 0.5
					break
				case 3:
					out.uv.v = 0.5
					break
				case 4:
					out.uv.u = 0.5
					out.uv.v = 0.5
					break
			}
		}
		return out
	}
	createSurfaces(j, coords3, axis) {
		let texture_uv = this.getTextureAndUV(j)
		let mesh = new RenderMesh()
		mesh.setBlockTexture(texture_uv.texture, 0)
		coords3[axis] = 0
		this.addSurface(coords3, CTMAxis[axis], texture_uv.uv)
		coords3[axis] = 1
		this.addSurface(coords3, CTMAxis[axis], texture_uv.uv)
		return new BlockRenderer.Model(mesh)
	}
	renderConditions(H, V, D) {
		const NOT = ICRender.NOT
		const AND = ICRender.AND
		return [
			AND(NOT(H), NOT(V)),
			AND(H, NOT(V)),
			AND(NOT(H), V),
			AND(H, V, NOT(D)),
			AND(H, V, D)
		]
	}
	addSurface(c: Vector, axis: ICTMAxisList, uv: IVertexUV, vertexScale?: number) {
		this.addSurfacePart(c, axis, uv)
	}
	getAxisScale(axis: ICTMAxisList, value: number, scale: number) {
		let normal = {
			x: (axis[value] === "x" ? scale : 0),
			y: (axis[value] === "y" ? scale : 0),
			z: (axis[value] === "z" ? scale : 0)
		}
		let any = {
			x: (axis[0] === "x" || axis[1] === "x" ? scale : 0),
			y: (axis[0] === "y" || axis[1] === "y" ? scale : 0),
			z: (axis[0] === "z" || axis[1] === "z" ? scale : 0)
		}
		return [normal, any]
	}
	addSurfacePart(c: Vector, axis: ICTMAxisList, uv: IVertexUV, vertexScale?: number) {
		let mesh = this.currentMesh, u = uv.u, v = uv.v, scale = uv.scale || 0.5
		let axisScale0 = this.getAxisScale(axis, 0, scale)
		let axisScale1 = this.getAxisScale(axis, 1, scale)
		mesh.addVertex(c.x + axisScale0[0].x, c.y + axisScale0[0].y, c.z + axisScale0[0].z, u + scale, v)
		mesh.addVertex(c.x + axisScale1[0].x, c.y + axisScale1[0].y, c.z + axisScale1[0].z, u, v + scale)
		mesh.addVertex(c.x + axisScale0[0].x, c.y + axisScale0[0].y, c.z + axisScale0[0].z, u + scale, v)
		mesh.addVertex(c.x + axisScale1[0].x, c.y + axisScale1[0].y, c.z + axisScale1[0].z, u, v + scale)
		mesh.addVertex(c.x + axisScale1[1].x, c.y + axisScale1[1].y, c.z + axisScale1[1].z, u + scale, v + scale)
	}
}

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

