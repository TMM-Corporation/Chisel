interface createBlockData {
	nameID: string, defineData: Block.BlockVariation[], blockType?: Block.SpecialType | string
}
interface ItemCreateParams {
	stack?: number, isTech?: boolean
}

interface createItemData {
	nameID: string, name: string, texture: Item.TextureData, params?: ItemCreateParams, langKey?: string
}

function getNextItem(items: Array<any>, currentItem: any): number {
	let currentIndex = items.indexOf(currentItem)
	return items[++currentIndex % items.length]
}


var CarvableData = {
	blocks: {},
	carveThis(group: string, id: number, nextId: number) {
		if (this.blocks[group]) {

			if (nextId == 0)
				return getNextItem(this.blocks, id)

			let findedID = this.blocks[group].find((localid: number) => localid == id)
			let findedNextID = this.blocks[group].find((localid: number) => localid == nextId)
			if (findedID == id)
				return findedNextID != findedID ? findedNextID : findedID
		}
		return id
	}
}

interface CarvableGroups {
	[key: string]: number[]
}
interface CarvableData {
	blockGroups: CarvableGroups
	namedIDs: number[]
}
type CTMType = 'normal' | 'ctm' | 'ctmh' | 'ctmv' | 'bricks-chaotic' | 'cuts' | 'ctm_anim' | 'proto-v4-ctm'
interface CreateCarvable {
	blockType: CTMType
	createData: createBlockData
}

class Carvable {
	private data: CarvableData

	constructor() { }

	add(name: string, blockIDs: number[]) {
		if (this.groupExists(name))
			throw `Group ${name}, already exists`

		this.carvableGroups[name] = blockIDs
	}

	createDefaultBlocks(createData: CreateCarvable[]): number[] {
		let result: number[] = []
		createData.forEach((block) => {
			let data = block.createData
			IDRegistry.genBlockID(data.nameID)
			Block.createBlock(data.nameID, data.defineData, data.blockType)
			if (block.blockType != 'normal')
				this.createCTMBlocks(BlockID[data.nameID], 0, data.defineData[0].texture[0][0])
			result.push(BlockID[data.nameID])
		})
		return result
	}

	createCTMBlocks(id: number, data: number, texture: string, groupName?: string) {
		ConnectedTexture.setModel(id, data, texture, groupName)
	}
	/**
	 * Convetrs
	 * @param blockList namedID[] to numberID[]
	 */
	getIDList(blockList: string[]): number[] {
		let result: number[] = []
		blockList.forEach((str) => {
			result.push(BlockID[str])
		})
		return result
	}
	/**
	 * Returns group of this block id, if block not found returns null
	 * @param id BlockID
	 */
	getGroupByBlockID(id: number): string {
		for (let group in this.carvableGroups) {
			let val = !!~this.carvableGroups[group].indexOf(id)
			if (val)
				return group
		}
		return null
	}

	getNumericBlock(id: string | number): number {
		let idType = typeof id
		if (idType == 'string') return BlockID[id]
		if (idType == 'number') return Number(id)
		throw `ID: ${id}, is not (string | number), id has type: ${idType}`
	}

	groupExists(name: string): boolean {
		return name in this.carvableGroups
	}

	get carvableGroups(): CarvableGroups {
		return this.carvableData.blockGroups
	}

	get carvableData(): CarvableData {
		return this.data
	}
	isExistsInGroup(blockID: number, group: string): number {
		if (blockID in this.carvableGroups[group])
			return blockID
		Logger.Log(`${blockID} is not exists in group ${group}`, `Carvable`)
	}
	getNextBlock(blockID?: number, selectedID?: number, group?: string): number {
		if (!group)
			group = this.getGroupByBlockID(blockID)
		let exists = this.isExistsInGroup(selectedID, group)
		if (exists)
			return exists
		else return getNextItem(this.carvableGroups[group], blockID)
	}
}

