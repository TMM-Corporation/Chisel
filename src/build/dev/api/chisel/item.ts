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
		export function registerItem(namedID: string, description: IChiselItem) {
			chiselItems[namedID] = description
		}
		export function unregisterItem(namedID: string) {
			delete chiselItems[namedID]
		}
		export function isRegistered(namedID: string) {
			return namedID in chiselItems
		}
		export function getDescriptionByName(namedID: string) {
			return chiselItems[namedID]
		}
		function preventDestroy(playerUID: number) {
			for (const name in chiselItems) {
				if (Object.prototype.hasOwnProperty.call(chiselItems, name)) {
					const element = chiselItems[name]
					if (ChiselItem.Controller.isHandleChisel(Entity.getCarriedItem(playerUID), element))
						Game.prevent()
				}
			}
		}
		export function init() {
			Callback.addCallback("DestroyBlock", (c, tile, playerUID) => preventDestroy(playerUID))
			Callback.addCallback("DestroyBlockStart", (c, tile, playerUID) => preventDestroy(playerUID))
		}
	}

	export namespace Controller {
		export function createChiselItem(item: IChiselItem, extra?: ItemExtraData): { nativeItem: Item.NativeItem, id: number } {
			let id = IDRegistry.genItemID(item.namedID)
			let nativeItem = Item.createItem(item.namedID, item.name, item.texture, { stack: 1, isTech: extra ? true : false })

			if (extra)
				Item.addToCreative(item.namedID, 1, 0, extra)
			if (item.durability)
				Item.setMaxDamage(id, item.durability)

			return { nativeItem, id }
		}
		export function isHandleChisel(item: ItemInstance, chisel: IChiselItem) {
			return item.id == chisel.numericID
		}
		export interface ICarveResults { id: number, data: number, sound: string, change: boolean }
		export function getCarvingBlock(player: number, tile: Tile): ICarveResults {
			let defaultResult = { id: -1, data: -1, sound: "chisel.fallback", change: false }
			let finalResult = { id: -1, data: -1, sound: "chisel.fallback", change: false }
			let searchDecoded, sneaking, extra = { id: -1, data: -1 }
			let item = Entity.getCarriedItem(player)
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
		export function carveBlock(coords: Callback.ItemUseCoordinates, item: ItemInstance, tile: Tile, player: number, chiselItem: IChiselItem): boolean {
			if (!isHandleChisel(item, chiselItem))
				return false
			return ChiselModes.carveBlocks(coords, item, tile, player)
			return false
		}
		export function breakItem(player: number) {
			Entity.setCarriedItem(player, 0, 0, 0)
			SoundManager.playSoundAtEntity(player, "item_break", 1, getRandomArbitrary(0.85, 1))
			return true
		}
		export function onUse(player: number, item: ItemInstance, damage: number = 1): { appliedDamage: number, breaked: boolean, used: boolean, playerGM: number } {
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
		buildDefaultExtra(): ItemExtraData {
			var extra = new ItemExtraData()
			extra.putString("containerUID", 'null')
			extra.putInt("variationId", -1)
			extra.putInt("variationData", -1)
			extra.putInt("variationSelected", -1)
			extra.putInt("carveMode", 0)
			return extra
		}
		openGUI(item: ItemInstance, playerUID: number): boolean {
			const client = Network.getClientForPlayer(playerUID)
			if (!client)
				return false

			var container: ItemContainer = this.setupContainer(item, playerUID)
			var desc = this.description
			// if (Controller.isHandleChisel(item, desc))
			if (!Entity.getSneaking(playerUID))
				if (desc.gui) {
					container.openFor(client, desc.gui.getGuiID())
					return true
				}
			return false
		}
		setupContainer(item: ItemInstance, playerUID: number) {
			const cUID: string = this.getChiselExtraData(playerUID, item)
			const container: ItemContainer = ChiselGUI.Data.getContainerByUID(cUID).container

			if (!container.getClientContainerTypeName())
				this.description.gui.setupServerSide(container)

			return container
		}
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
