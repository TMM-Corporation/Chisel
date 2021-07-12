namespace ChiselItem {
	export interface IChiselItem {
		name: string
		durability: number
		texture: Item.TextureData
		namedID: string
		numericID?: number
		gui?: ChiselGUI.Custom
	}
	export namespace Data {
		interface Structure { [key: string]: IChiselItem }
		export const chiselItems: Structure = {}
		
		export namespace ItemRegistry {
			/**
			 * Adds to registered items chisel item with description
			 * @param namedID item string id
			 * @param description chisel description
			 * @returns boolean if item successfully registered
			 */
			export function register(namedID: string, description: IChiselItem): boolean {
				const registered = isRegistered(namedID)
				if (!registered) {
					chiselItems[namedID] = description
					console.info(`Successfully registered chisel item '${namedID}'`)
				} else console.warn(`Cannot register chisel item '${namedID}', because it is already registered`)

				return !registered
			}
			/**
			 * Removes from registered items chisel item
			 * @param namedID item string id
			 * @returns boolean if item successfully unregistered
			 */
			export function unregister(namedID: string): boolean {
				const registered = isRegistered(namedID)
				if (registered) {
					delete chiselItems[namedID]
					console.info(`Successfully unregistered chisel item '${namedID}'`)
				} else console.warn(`Cannot unregister chisel item '${namedID}', because it is not registered`)

				return registered
			}
			/**
			 * Determines whether registered is item as chisel by string id
			 * @param namedID item string id
			 * @returns item is registered as chisel
			 */
			export function isRegistered(namedID: string): boolean {
				return namedID in chiselItems
			}
			/**
			 * Gets description by name for chisel item
			 * @param namedID item string id
			 * @returns chisel description
			 */
			export function getDescriptionByName(namedID: string): IChiselItem {
				return chiselItems[namedID]
			}
		}
		/**
		 * Prevents destroy block when player hand chisel item
		 * @param playerUID client uid
		 */
		function preventDestroy(playerUID: number) {
			for (const name in chiselItems) {
				if (Object.prototype.hasOwnProperty.call(chiselItems, name)) {
					const element = chiselItems[name]
					if (ChiselItem.Controller.isHandleChisel(Entity.getCarriedItem(playerUID), element))
						Game.prevent()
				}
			}
		}
		/**
		 * Initialization of all callbacks
		 */
		export function init() {
			Callback.addCallback("DestroyBlock", (c, tile, playerUID) => preventDestroy(playerUID))
			Callback.addCallback("DestroyBlockStart", (c, tile, playerUID) => preventDestroy(playerUID))
		}
	}
	export namespace Controller {
		/**
		 * Object representing Item damage
		 */
		interface ItemDamage {
			appliedDamage: number
			breaked: boolean
			used: boolean
			playerGM: number
		}
		/**
		 * Object representing Carving results
		 */
		export interface ICarveResults {
			id: number
			data: number
			sound: string
			change: boolean
		}
		export function createChiselItem(item: IChiselItem, extra?: ItemExtraData): { nativeItem: Item.NativeItem, id: number } {
			let id = IDRegistry.genItemID(item.namedID)
			let nativeItem = Item.createItem(item.namedID, item.name, item.texture, { stack: 1, isTech: extra ? true : false })

			if (extra)
				Item.addToCreative(item.namedID, 1, 0, extra)
			if (item.durability)
				Item.setMaxDamage(id, item.durability)

			Data.ItemRegistry.register(item.namedID, item)
			return { nativeItem, id }
		}
		/**
		 * Determines whether the player is holding a chisel
		 * @param item ItemInsance of current item
		 * @param chiselItem registered chisel description
		 * @returns  
		 */
		export function isHandleChisel(item: ItemInstance, chiselItem: IChiselItem) {
			return item.id == chiselItem.numericID
		}
		/**
		 * Gets carving block from current tile and chisel extra data
		 * @param playerUID client uid
		 * @param tile current touched tile [id:data]
		 * @returns carving block results
		 */
		export function getCarvingBlock(playerUID: number, tile: Tile): ICarveResults {
			let defaultResult = { id: -1, data: -1, sound: "chisel.fallback", change: false }
			let finalResult = { id: -1, data: -1, sound: "chisel.fallback", change: false }
			let searchDecoded, sneaking, extra = { id: -1, data: -1 }
			let item = Entity.getCarriedItem(playerUID)
			if (item.extra)
				extra = { id: item.extra.getInt("variationId"), data: item.extra.getInt("variationData") }

			let tileSearch = Carvable.Groups.searchBlock(tile.id, tile.data)

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
				sneaking = Entity.getSneaking(playerUID)
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
		/**
		 * Carves current block in specified coords with current item
		 * @param coords coords where item used
		 * @param item ItemInstance of current item
		 * @param tile current touched tile [id:data]
		 * @param playerUID client uid 
		 * @param chiselItem registered chisel description
		 * @returns boolean if carving block successfull or not 
		 */
		export function carveBlock(coords: Callback.ItemUseCoordinates, item: ItemInstance, tile: Tile, playerUID: number, chiselItem: IChiselItem): boolean {
			if (!isHandleChisel(item, chiselItem))
				return false
			return ChiselModes.carveBlocks(coords, item, tile, playerUID)
		}
		/**
		 * Breaks carried item and playing "item breaked" sound
		 * @param playerUID client uid
		 */
		export function breakItem(playerUID: number): void {
			Entity.setCarriedItem(playerUID, 0, 0, 0)
			SoundManager.playSoundAtEntity(playerUID, "item_break", 1, getRandomArbitrary(0.85, 1))

		}
		/**
		 * Processes item damage
		 * @param playerUID client uid
		 * @param item ItemInstance of handle item
		 * @param [damage] the amount of damage that should be applied
		 * @returns ItemDamage data
		 */
		export function onUse(playerUID: number, item: ItemInstance, damage: number = 1): ItemDamage {
			let maxDamage = Item.getMaxDamage(item.id)
			let playerGM = new PlayerActor(playerUID).getGameMode()
			let breaked = false
			var available = maxDamage - item.data
			var appliedDamage = damage <= available ? damage : available

			if (playerGM == 0) item.data += appliedDamage
			if (item.data >= maxDamage)
				breaked = this.breakItem(playerUID)
			else
				Entity.setCarriedItem(playerUID, item.id, 1, item.data, item.extra)
			console.info(`Data: [${item.data}/${maxDamage}], GameMode: ${playerGM}, damage/applied: [${damage}/${appliedDamage}]`, `[ChiselItem.ts] ChiselItem.Custom.onUse`)
			return {
				appliedDamage: (playerGM == 0 ? appliedDamage : 0),
				used: appliedDamage >= 1,
				playerGM,
				breaked,
			}
		}
	}
	export class Custom {
		description: IChiselItem
		constructor(description: IChiselItem) {
			this.description = description
			let item = Controller.createChiselItem(description, this.buildDefaultExtra())
			this.description.numericID = item.id
			if (description.gui)
				Item.registerNoTargetUseFunction(item.id, (item: ItemInstance, playerUID: number) => this.openGUI(item, playerUID))
			Item.registerUseFunction(item.id, (c: Callback.ItemUseCoordinates, item: ItemInstance, tile: Tile, player: number) => {
				Controller.carveBlock(c, item, tile, player, description)
			})
		}
		/**
		 * Builds default extra for creative item
		 * @returns default extra of chisel item
		 */
		buildDefaultExtra(): ItemExtraData {
			var extra = new ItemExtraData()
			extra.putString("containerUID", 'null')
			extra.putInt("variationId", -1)
			extra.putInt("variationData", -1)
			extra.putInt("variationSelected", -1)
			extra.putInt("carveMode", 0)
			return extra
		}
		/**
		 * Opens gui for client when not sneaking
		 * @param item ItemInstance of current item to setup container and uid
		 * @param playerUID client uid 
		 * @returns true if gui is registered for chisel item
		 */
		openGUI(item: ItemInstance, playerUID: number): boolean {
			const client = Network.getClientForPlayer(playerUID)
			if (!client)
				return false

			const container: ItemContainer = this.setupContainer(item, playerUID)
			const desc = this.description
			// if (Controller.isHandleChisel(item, desc))
			if (!Entity.getSneaking(playerUID))
				if (desc.gui) {
					container.openFor(client, desc.gui.getGuiID())
					return true
				}
			return false
		}
		/**
		 * Setups server container and server side window container
		 * @param item ItemInstance of current item to setup container and uid
		 * @param playerUID client uid
		 * @returns server side ItemContainer 
		 */
		setupContainer(item: ItemInstance, playerUID: number) {
			const cUID: string = this.getChiselExtraData(playerUID, item)
			const container: ItemContainer = ChiselGUI.Data.getContainerByUID(cUID).container

			if (!container.getClientContainerTypeName())
				this.description.gui.setupServerSide(container)

			return container
		}

		/**
		 * Creating item extra data for container.
		 * BUG: catch extra data when new item is created, found why new item has old cUID
		 * @param player - player entity id
		 * @param item - item
		 * @returns container id for this item
		 */
		getChiselExtraData(player: number, item: ItemInstance): string {
			if (!item.extra)
				item.extra = new ItemExtraData()

			let cUID = item.extra.getString("containerUID", 'null')
			console.debug(`Current cUID: '${cUID}'`)

			if (cUID == 'null') {
				cUID = ChiselGUI.Data.getContainerByUID().cUID
				console.warn(`Creating new cUID: '${cUID}'`)
				item.extra.putString("containerUID", cUID)
				item.extra.putInt("variationId", -1)
				item.extra.putInt("variationData", -1)
				item.extra.putInt("variationSelected", -1)
				item.extra.putInt("carveMode", 0)
				Entity.setCarriedItem(player, item.id, item.count, item.data, item.extra)
			}

			console.info(`Result cUID: ${cUID}`)
			return cUID
		}
	}
	Data.init()
}
