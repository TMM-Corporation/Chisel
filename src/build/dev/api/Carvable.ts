namespace Carvable {
	export var ModuleName = "Chisel-Carvable"
	export var Tileset: {
		[name: string]: Group[]
	}
	export type Localization =
		string[]

	export namespace Tile {
		export var forceCTLib = false
		export interface Texture {
			name: string
			extension: string
			type: string
			ctm?: CTM.Texture
		}
		export interface Description {
			name: string
			register?: boolean
			localization: Localization
			variations: Variation[]
		}
		export interface Variation {
			texture: Texture
			localization?: Localization
			register?: boolean
		}
		export function create(variation: Variation): number {
			let id = variation.texture.name
			let numID = IDRegistry.genBlockID(id) || -1

			Block.createBlock(id, [{ name: id, texture: [[id, 0]], inCreative: true }])

			if (variation.texture.ctm)
				createCTM(variation, numID, 0)
			return numID
		}
		export function createCTM(variation: Variation, id: number, data: number = 0): void {
			if (forceCTLib) {
				ConnectedTexture.setModel(id, data, variation.texture.ctm.name)
			} else {
				let group = CTM.addToGroup(id, data, variation.texture.name), block: ICRender.Model
				let type = variation.texture.ctm.type

				switch (CTM.TYPE[type]) {
					case CTM.TYPE.ctm:
						block = CTM.DefaultCTM.createModel(group, [variation.texture.name, variation.texture.ctm.name])
						break
					case CTM.TYPE.ctmh:
						block = CTM.HorizontalCTM.createModel(group, [variation.texture.name, variation.texture.ctm.name])
						break
					default:
						block = CTM.DefaultCTM.createModel(group, [variation.texture.name, variation.texture.ctm.name])
						break
				}

				CTM.setItemModel.setDefaultModel(id, data, variation.texture.name)
				CTM.setBlockModel.setDefaultModel(id, data, block)
			}
		}
	}
	export namespace Groups {
		export var GroupList: { [name: string]: Group }

		export function addGroup(group: Group) {
			if (!GroupList[group.name.groupName])
				GroupList[group.name.groupName] = group
		}

		export function findGroupByBlockIdOrName(id: number, groupName?: string): Group | null {
			var group: Group
			if (groupName) {
				if (GroupList[groupName])
					if (GroupList[groupName].hasBlockId(id))
						group = GroupList[groupName]
			} else {
				for (let name in GroupList) {
					group = GroupList[name]
					if (group.hasBlockId(id))
						break
					else continue
				}
			}

			return group
		}

		export function groupByName(groupName: string): Group | null {
			return GroupList[groupName]
		}

		export function groupExitsts(name: string) {
			return name in GroupList
		}

		export function nextBlockFor(id: number): number | null {
			let group = findGroupByBlockIdOrName(id)
			if (group)
				return group.getNextBlockFor(id)
			return null
		}

		export function prevBlockFor(id: number): number | null {
			let group = findGroupByBlockIdOrName(id)
			if (group)
				return group.getPrevBlockFor(id)
			return null
		}
	}
	export class Group {

		name: {
			groupName: string,
			display: string
		}
		data: { ids: number[], names: string[] } = {
			ids: [], names: []
		}

		constructor(groupName: string, display: string) {
			this.name = { groupName, display }
		}

		add(tile: Tile.Variation): number {
			return Tile.create(tile)
		}

		addMultiple(tile: Tile.Variation[]): number[] {
			let ids: number[] = []
			tile.forEach((variation: Tile.Variation) => {
				if (variation.register != false) {
					let id = this.add(variation)
					this.data.ids.push(id)
					ids.push(id)
				}
			})
			return ids
		}

		addFromDescription(description: Tile.Description) {
			if (description.register != false) {
				Logger.Log(`Creating group from description, group: { groupName: ${this.name.groupName}, display: ${this.name.display} }, desc name: ${description.name}`, ModuleName)
				this.addMultiple(description.variations)
			}
			else Logger.Log(`Skipping creation from descrption [${description.name}] is disabled`, ModuleName)
		}

		creativeGroupFromIds() {
			if (this.data.ids.length > 1)
				Item.addCreativeGroup(this.name.groupName, this.name.display, this.data.ids)
		}

		hasBlockId(id: number) {
			return !!~this.data.ids.lastIndexOf(id)
		}

		getNextBlockFor(id: number): any {
			let items = this.data.ids
			return Additional.getFor(items, id, Additional.Direction.NEXT)
		}

		getPrevBlockFor(id: number): any {
			let items = this.data.ids
			return Additional.getFor(items, id, Additional.Direction.PREV)
		}
	}
}
