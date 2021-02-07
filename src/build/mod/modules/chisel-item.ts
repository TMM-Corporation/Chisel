
/**
 * Доделать блоки
 * Доделать повороты для чизля
 * Добавить гуй для стаместок
 * Добавть все блоки
 * Протестировать всё
 * Добавить режимы
 * Добавить преводы
 */

interface ChiselMode {
	name: string
	blocks: Vector[]
}

interface ChiselItem {
	item: createItemData
	type: string
	ui: WindowGroup
	langs?: {
		name?: string
		description?: string
	}
	selectedID?: number
	durability?: number
	mode?: string
	mode_list?: Array<ChiselMode>
}

class CustomChiselItem {
	private data: ChiselItem
	private carvableData: Carvable
	constructor(data: ChiselItem) {
		this.data = data
		this.setupDefaults()
	}

	setupDefaults() {
		let data = this.data

		if (!data.mode_list)
			this.chiselModeList = this.chiselDefaultMode

		if (!data.mode)
			if (data.mode_list[0].name)
				this.chiselMode = data.mode_list[0].name
			else
				throw 'Default chisel mode is undefined'

		this.createItem(data)
		this.addCallbacks(data)
	}

	createItem(data: ChiselItem): { item: Item.NativeItem, numID: number } {
		let id = IDRegistry.genItemID(data.item.nameID)
		let item = Item.createItem(data.item.nameID, data.item.name, data.item.texture, data.item.params)
		return { item: item, numID: id }
	}

	/**
	 * Add's default events. Open gui on tap, carve block on block breaking start
	 * @param data item data
	 */
	addCallbacks(data: ChiselItem) {
		Item.registerUseFunction(data.item.nameID, (coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) =>
			this.openUI(player)
		)
		Callback.addCallback("DestroyBlockStart", (coords: Callback.ItemUseCoordinates, block: Tile, player: number) => {
			this.carveBlocks(coords, block, player)
			Game.prevent()
		})
	}

	/**
	 * Add carve mode to change blocks
	 * @param mode carve mode with block coordinates to change style
	 */
	addCarveMode(mode: ChiselMode) {
		this.chiselModeList.push(mode)
	}

	carveBlocks(coords: Callback.ItemUseCoordinates, tile: Tile, player: number) {
		// let playerActor = new PlayerActor(player)
		/* TODO: Добавить поддержку поворота структуры */
		let rotation = new MatrixRotate(new Rotations().ROTATE_360)

		let newCrds = rotation.RotateVectors(player, this.chiselCurrentMode.blocks, coords)
		let bs = BlockSource.getDefaultForActor(player)
		let block = bs.getBlock(coords.x, coords.y, coords.z)
		let group = this.carvableData.getGroupByBlockID(block.id)
		for (let vec in newCrds) {
			let newVector = newCrds[vec]
			let currBlock = bs.getBlock(newVector.x, newVector.y, newVector.z)
			let nextBlock = this.carvable.getNextBlock(currBlock.id, this.data.selectedID, group)
			if (this.carvable.isExistsInGroup(currBlock.id, group))
				bs.setBlock(newVector.x, newVector.y, newVector.z, nextBlock, 0)
			else Logger.Log(`${currBlock} is not exists in group ${group}`, `CustomChiselItem`)
		}
		/* TODO: Доделать переделку блока carvable */
	}

	/**
	 * Opens gui when player sneaking
	 * @param player playerUID to open window on certain player
	 */
	openUI(player: number): boolean {
		if (Entity.getSneaking(player)) {
			this.chiselWindow.open()
			return true
		}
		return false
	}

	get chiselCurrentMode(): ChiselMode {
		let result: ChiselMode
		this.chiselModeList.forEach((value) => {
			if (value.name == this.chiselMode)
				return result = value
		})
		return result
	}

	get chiselMode() {
		return this.data.mode
	}

	get chiselDefaultMode() {
		return [{ name: "default", blocks: [{ x: 0, y: 0, z: 0 }] }]
	}

	get chiselModeList() {
		return this.data.mode_list
	}

	get chiselType() {
		return this.data.type
	}

	get chiselWindow() {
		return this.data.ui
	}

	set chiselMode(mode: string) {
		this.data.mode = mode
	}

	set chiselModeList(modes: Array<ChiselMode>) {
		this.data.mode_list = modes
	}

	set chiselType(type: string) {
		this.data.type = type
	}

	set chiselWindow(window: WindowGroup) {
		this.data.ui = window
	}
	set carvable(carvable: Carvable) {
		this.carvableData = carvable
	}
}