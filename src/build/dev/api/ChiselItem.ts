
namespace ChiselItem {
	export enum CurrentState {
		Normal,
		Carving,
		OpenGui
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
		gui?: ChiselGUI.Base
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
			// this.setState(CurrentState.Normal)
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
		getCarvingBlock(player: number, tile: Tile): { id: number, data: number, sound: string, change: boolean } {
			let defaultResult = { id: -1, data: -1, sound: "chisel.fallback", change: false }
			let finalResult = { id: -1, data: -1, sound: "chisel.fallback", change: false }
			let searchDecoded, sneaking, extra = { id: -1, data: -1 }
			let item = Entity.getCarriedItem(player)
			if (item.extra)
				extra = { id: item.extra.getInt("variationId"), data: item.extra.getInt("variationData") }

			let tileSearch = Carvable.Groups.searchBlock(tile.id, tile.data)
			console.json(tileSearch)

			//If tile group not exists, nothing to do
			if (!tileSearch.group) {
				console.warn(`Tile not found, nothing to carve`)
				return defaultResult
			}

			// If ID in chisel == -1
			// Searching next/prev tile from current group
			if (extra.id == -1 && tileSearch) {
				let tileSearchResult = tileSearch.result
				searchDecoded = Carvable.Groups.idDataFromSearch(tileSearchResult)
				sneaking = Entity.getSneaking(player)
				let { prev, next } = { prev: tileSearchResult.prev, next: tileSearchResult.next }
				let result = sneaking &&
					prev ? searchDecoded.prev :
					next ? searchDecoded.next : { id: -1, data: -1 }
				finalResult = {
					id: result.id,
					data: result.data,
					sound: tileSearch.group.findVariationByIndex(sneaking ? tileSearchResult.prev.index : tileSearchResult.next.index).sound || "chisel.fallback",
					change: true
				}
				console.info(`Returning ${JSON.stringify(finalResult)}`)
				return finalResult
			}

			// Searching block group inside chisel
			let fromItemSearch = Carvable.Groups.searchBlock(extra.id, extra.data)
			console.json(fromItemSearch)
			let groups = [fromItemSearch.group, tileSearch.group]

			// If ID in chisel and in tile same
			if (extra.id == tile.id && tile.data == extra.data) {
				console.warn(`ID in world and in item is same [${extra.id}:${extra.data} == ${tile.id}:${tile.data}]`)
				return defaultResult
			}

			// If tile group and in chisel block group not same
			if (fromItemSearch.group && tileSearch.group) {
				let names = [groups[0].name || null, groups[1].name || null]
				if (names[1].groupName != names[0].groupName) {
					console.warn(`Carvable Groups in world and in item is not same [${names[1]} != ${names[0]}]`)
					return defaultResult
				} else {
					// If all ok, return block from chisel
					let fromItemSearchResult = fromItemSearch.result
					finalResult = {
						id: extra.id,
						data: extra.data,
						sound: tileSearch.group.findVariationByIndex(fromItemSearchResult.current.index).sound || "chisel.fallback",
						change: true
					}
					console.info(`Returning [${extra.id}:${extra.data}], sound: ${finalResult.sound}`)
					return finalResult
				}
			}

			if (finalResult.id == -1 && !tileSearch.group) {
				console.info(`Group for tile and carve id not found`)
				return finalResult
			}

			console.warn(`${JSON.stringify(finalResult)}, some shit happend, [${JSON.stringify(groups[0])}, ${JSON.stringify(groups[1])}] [${extra.id}:${extra.data} | ${tile.id}:${tile.data}]`)
			return finalResult
		}
		carveBlock(coords: Callback.ItemUseCoordinates, tile: Tile, player: number): boolean {
			if (!this.isHandleChisel(Entity.getCarriedItem(player)))
				return false
			let carveResults = this.getCarvingBlock(player, tile)

			if (carveResults.change == false)
				return false

			let bs = BlockSource.getDefaultForActor(player)
			let itemUse = this.onUse(player, Entity.getCarriedItem(player))

			if (itemUse.used) {
				bs.setBlock(coords.x, coords.y, coords.z, carveResults.id, carveResults.data)
				SoundManager.playSoundAtBlock({ x: coords.x, y: coords.y, z: coords.z }, getSoundFromConstName(carveResults.sound), 1, getRandomArbitrary(0.7, 1), 8)
				return true
			}

			return false
		}
		setWindow(window: ChiselGUI.Base) {
			this.data.gui = window
		}
		isHandleChisel(handItem: ItemInstance) {
			return handItem.id == this.data.item.id
		}
		breakItem(player: number) {
			Entity.setCarriedItem(player, 0, 0, 0)
			SoundManager.playSoundAtEntity(player, "item_break", 1, getRandomArbitrary(0.85, 1))
			return true
		}
		onUse(player: number, item: ItemInstance, damage: number = 1): { appliedDamage: number, breaked: boolean, used: boolean } {
			let maxDamage = Item.getMaxDamage(item.id)
			let playerGM = new PlayerActor(player).getGameMode()
			let breaked = false
			var available = maxDamage - item.data
			var appliedDamage = damage <= available ? damage : available

			if (playerGM == 0) item.data += appliedDamage
			if (item.data >= maxDamage)
				breaked = this.breakItem(player)
			else
				Entity.setCarriedItem(player, item.id, 1, item.data, item.extra)
			console.info(`Data: ${item.data}/${maxDamage}, playerGM: ${playerGM}`, `[ChiselItem.ts] ChiselItem.Custom.onUse`)
			return { appliedDamage, breaked, used: appliedDamage >= 1 }
			// if (playerGM == 0 && item.data <= maxDamage) {
			// 	if (item.data + damage >= maxDamage)
			// 		this.breakItem(player)
			// 	else
			// 		Entity.setCarriedItem(player, item.id, 1, item.data, item.extra)
			// 	return true
			// } else if (item.data > maxDamage) {
			// 	this.breakItem(player)
			// 	console.info(`Data: ${item.data}/${maxDamage}, playerGM: ${playerGM}`, `[ChiselItem.ts] ChiselItem.Custom.onUse`)
			// 	console.error(`How you chiseled with data > maxDamage?`, `[ChiselItem.ts] ChiselItem.Custom.onUse`)
			// 	return false
			// }

			// return true
		}

		initCallbacks() {
			Item.registerNoTargetUseFunction(this.data.item.id,
				(item, player) => this.openGuiFor(player, item)
			)
			Callback.addCallback("DestroyBlockStart", (c, tile, player) => {
				if (this.isHandleChisel(Entity.getCarriedItem(player)))
					Game.prevent()
			})
			Callback.addCallback("DestroyBlock", (c, tile, player) => {
				if (this.isHandleChisel(Entity.getCarriedItem(player)))
					Game.prevent()
			})
			Callback.addCallback("ItemUse", (c, item, tile, isExternal, player) => {
				this.carveBlock(c, tile, player)
			})
		}
		/**
		 * Creating item extra data for container
		 * @param player - player entity id
		 * @param item - item
		 * @returns container id for this item
		 */
		//BUG: catch extra data when new item is created, found why new item has old cUID
		getChiselExtraData(player: number, item: ItemInstance): number {
			console.json(item.extra)
			if (!item.extra)
				item.extra = new ItemExtraData()
			let cUID = item.extra.getInt("containerUID", -1)
			console.debug(`Current cUID: ${cUID}`)
			if (cUID === -1) {
				cUID = ChiselGUI.Data.nextUniqueID++
				console.warn(`Creating new cUID: ${cUID}`)
				item.extra.putInt("containerUID", cUID)
				item.extra.putInt("variationId", -1)
				item.extra.putInt("variationData", -1)
				item.extra.putInt("orangeSlot", -1)
				Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra)
			}
			console.info(`Result cUID: ${cUID}`)
			return cUID
		}
		prepareContainer(gui: ChiselGUI.Base, client: NetworkClient, player: number, item: ItemInstance): ItemContainer {
			var container, cUID
			cUID = this.getChiselExtraData(player, item)
			container = ChiselGUI.Data.getContainerByUID(cUID)
			// var container = new ItemContainer()
			if (!container.getClientContainerTypeName()) {
				gui.setupContainer(container)
				gui.additionalContainerSetup(container)
			}
			container.openFor(client, gui.getGuiID())
			return container
		}
		openGuiFor(player: number, item: ItemInstance): boolean {
			var client = Network.getClientForPlayer(player)
			if (!client)
				return false

			if (this.isHandleChisel(item))
				if (!Entity.getSneaking(player))
					if (this.data.gui) {
						this.prepareContainer(this.data.gui, client, player, item)
						return true
					}
			return false
		}
	}
}
