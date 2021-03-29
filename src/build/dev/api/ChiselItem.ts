
namespace ChiselItem {
	export enum WorkMode {
		/* Tap to open GUI, BreakBlockStart to chisel */
		PC,
		/* BreakBlockStart to open GUI, Tap to chisel */
		PE
	}

	export var Mode = WorkMode.PE

	export enum CurrentState {
		Normal,
		BreakBlock,
		OpenGui
	}
	export enum UseMode {
		/* Chisel a 3x1 column of blocks */
		Column,
		/* Chisel an area of alike blocks, extending 10 blocks in any direction */
		Contiguous,
		/* Chisel an area of alike blocks, extending 10 blocks along the plane of the current side */
		Contiguous_2D,
		/* Chisel a 3x3 square of blocks */
		Panel,
		/* Chisel a 1x3 row of blocks */
		Row,
		/* Chisel a single block */
		Single,
	}

	export interface ItemData {
		id?: number
		durability: number
		namedId: string
		name: string
		description?: string[]
		from_mod?: string[]
		texture: Item.TextureData
	}
	export interface DefaultData {
		state?: CurrentState
		gui: WindowShell.Group
		item: ItemData
		group?: {
			name: string,
			id: number,
			selectedSlot: number
		}
	}
	export class Custom {
		data: DefaultData
		constructor(data: DefaultData) {
			this.data = data
			let item = this.createItem(data.item)
			this.data.item.id = item.numID
			this.initCallbacks()
			this.setState(CurrentState.Normal)
		}

		private createItem(item: ItemData): { item: Item.NativeItem, numID: number } {
			let id = IDRegistry.genItemID(item.namedId)
			let nativeItem = Item.createItem(item.namedId, item.name, item.texture, { stack: 1, isTech: false })

			if (item.durability)
				Item.setMaxDamage(id, item.durability)

			return { item: nativeItem, numID: id }
		}

		setState(state: CurrentState) {
			this.data.state = state
		}

		carveBlock(c, tile, player): boolean {
			if (!this.isHandleChisel(Entity.getCarriedItem(player)))
				return false

			let result
			if (Entity.getSneaking(player))
				result = Carvable.Groups.searchBlock(tile.id, tile.data, Search.Direction.PREV)
			else
				result = Carvable.Groups.searchBlock(tile.id, tile.data, Search.Direction.NEXT)

			if (result.id != -1) {
				this.setState(CurrentState.BreakBlock)
				console.info(`Result in tap: [${result.id}:${result.data}]`, `[ChiselItem.ts] ChiselItem.Custom.carveBlock`)

				let source = BlockSource.getDefaultForActor(player)
				source.setBlock(c.x, c.y, c.z, result.id, result.data)

				this.onUse(player)
				this.setState(CurrentState.Normal)

				return true
			} else console.warn(`Result id = -1`, `[ChiselItem.ts] ChiselItem.Custom.carveBlock`)

			return false
		}

		setWindow(window: WindowShell.Group) {
			this.data.gui = window
		}

		isHandleChisel(handItem: ItemInstance) {
			return handItem.id == this.data.item.id
		}

		onUse(player: number): boolean {
			let item = Entity.getCarriedItem(player)
			let maxDamage = Item.getMaxDamage(item.id)

			if (item.data >= maxDamage)
				Entity.setCarriedItem(player, 0, 0, 0)
			else if (new PlayerActor(player).getGameMode() != 1)
				Entity.setCarriedItem(player, item.id, 1, ++item.data, item.extra)

			console.info(`Data: ${item.data}/${maxDamage}`, `[ChiselItem.ts] ChiselItem.Custom.onUse`)
			return true
		}

		initCallbacks() {
			Callback.addCallback("ItemUseNoTarget", (item, player) => {
				this.open(player, item)
			})

			Callback.addCallback("DestroyBlockStart", (c, tile, player) => {
				if (this.isHandleChisel(Entity.getCarriedItem(player)))
					Game.prevent()
			})

			Callback.addCallback("ItemUse", (c, item, tile, isExternal, player) => {
				this.carveBlock(c, tile, player)
				// console.debug(`{item: ${Item.getName(item.id, item.data)} [${item.id}:(${item.data}/${Item.getMaxDamage(item.id)})], block: ${Item.getName(tile.id, tile.data)} - ${tile.id}:${tile.data}}`, `[ChiselItem.ts] ChiselItem.Custom.initCallbacks Callback.ItemUse`)
			}) // 1:0, 98:0, 98:1, 98:2, 98:3
		}

		open(player: number, item: ItemInstance): boolean {
			if (this.isHandleChisel(item))
				if (!Entity.getSneaking(player)) {
					this.setState(CurrentState.OpenGui)
					this.data.gui.open()
					this.setState(CurrentState.Normal)
					return true
				}
			return false
		}
	}
}

CLI.reg("mode", (values: string[]) => {
	switch (values[0]) {
		case "0":
			ChiselItem.Mode = ChiselItem.WorkMode.PC
			break
		case "1":
			ChiselItem.Mode = ChiselItem.WorkMode.PE
			break
	}
})