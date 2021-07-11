namespace Carvable {
	export var ModuleName = "Chisel-Carvable"
	export var Tileset: {
		[name: string]: Group[]
	}
	export type Localization = string[]

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
			localization?: Localization
			variations: Variation[]
		}
		export interface Variation {
			block?: { id: number, data?: number }
			texture?: Texture
			localization?: Localization
			register?: boolean
			sound?: string
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
		export var List: { [name: string]: Group } = {}

		export function addGroup(group: Group) {
			if (!(group.name.groupName in List))
				List[group.name.groupName] = group
		}

		export function findGroupByBlock(id: number, data: number = 0): Group | null {
			var group: Group
			console.info(`Trying to find group for id:data = ${id}:${data}`, `[Carvable.ts] Groups.findGroupByBlock`)
			for (let name in List) {
				group = List[name]
				console.info(`Group [${name}] = ${JSON.stringify(group)}`, `[Carvable.ts] Groups.findGroupByBlock`)
				if (group.bindingExists(id, data))
					return group
				else continue
			}
			console.info(`Search result ${JSON.stringify(group)}`, `[Carvable.ts] Groups.findGroupByBlock`)
			return null
		}

		export function groupByName(groupName: string): Group | null {
			return List[groupName]
		}

		export function groupExists(name: string) {
			return name in List
		}
		export function searchBlock(id: number, data: number = 0): { result: Search.ResultItem, group: Carvable.Group } {
			let group = findGroupByBlock(id, data)
			return group ?
				{
					result: group.findBlock(id, data), group: group
				} : {
					result: Search.NullItem, group: null
				}
		}

		export function idDataFromSearch(value: Search.ResultItem) {
			if (value.next && value.prev) {
				let result = {
					next: splitIdData(value.next.element),
					prev: splitIdData(value.prev.element)
				}
				console.info(`Result [next=${result.next.id}:${result.next.data}, prev=${result.prev.id}:${result.prev.data}]`, `[Carvable.ts] Group.findBlock`)
				return result
			}
		}
		export function splitIdData(value: string) {
			if (value) {
				let splitted = value.split(":")
				return { id: Number(splitted[0]), data: Number(splitted[1]) }
			}
		}
	}

	export interface GroupData {
		names: string[],
		binding: {
			id: number[],
			data: number[],
		}
		search: string[]
		variations: Tile.Variation[]
	}

	export class Group {
		name: {
			groupName: string,
			display: string
		}
		data: GroupData = {
			names: [],
			binding: {
				id: [],
				data: []
			},
			search: [],
			variations: [],
		}

		constructor(groupName: string, display: string) {
			this.name = { groupName, display }
			Groups.addGroup(this)
		}

		add(tile: Tile.Variation): number {
			return Tile.create(tile)
		}

		addMultiple(tile: Tile.Variation[]): { id: number[], data: number[] } {
			let idList: number[] = []
			let dataList: number[] = []
			tile.forEach((variation: Tile.Variation) => {
				if (variation.register != false) {
					let id = 0, data = 0

					if (variation.block) {
						id = variation.block.id
						data = variation.block.data || 0
					} else {
						id = this.add(variation)
						data = 0
					}

					idList.push(id)
					dataList.push(data)
					this.data.variations.push(variation)
					this.data.search.push(`${id}:${data}`)
				}
			})
			return { id: idList, data: dataList }
		}

		addFromDescription(description: Tile.Description) {
			if (description.register != false) {
				Logger.Log(`Creating group from description, group: { groupName: ${this.name.groupName}, display: ${this.name.display} }, desc name: ${description.name}`, ModuleName)
				this.addMultiple(description.variations)
			}
			else Logger.Log(`Skipping creation from descrption [${description.name}] is disabled`, ModuleName)
		}

		addBinding(id: number, data: number = 0) {
			let binding = this.data.binding
			if (this.bindingExists(id, data))
				console.warn(`Id ${id}:${data} already exists in ${this.name.groupName} group`, `[Carvable.ts] Group.addBinding`)
			else {
				binding.id.push(id)
				binding.data.push(data)
				console.info(`Id ${id}:${data} successfully binded to ${this.name.groupName} group`, `[Carvable.ts] Group.addBinding`)
			}
		}

		bindingExists(id: number, data: number = 0): boolean {
			let i = this.bindingIndex(id, data)
			console.info(`Binding for ${id}:${data} ${!!~i == true ? "exists, index: " + i : "not exists"} in ${this.name.groupName} group`, `[Carvable.ts] Group.bindingExists`)
			return !!~i
		}

		bindingIndex(id: number, data: number = 0): number {
			let i = this.data.search.lastIndexOf(`${id}:${data}`)
			// console.info(`Binding Index for ${id}:${data} = ${i}`)
			return i
		}

		bindingData(id: number, data: number = 0): number {
			return this.data.binding.data[this.bindingIndex(id, data)] || 0
		}

		// creativeGroupFromIds(): void {
		// 	if (this.data.ids.length > 1)
		// 		Item.addCreativeGroup(this.name.groupName, this.name.display, this.data.ids)
		// }

		hasBlockId(id: number): boolean {
			return !!~this.data.binding.id.indexOf(id)
		}

		get bindings() {
			return this.data.binding
		}

		get ids() {
			return this.data.binding.id
		}

		findVariationByIndex(index: number): Tile.Variation {
			let variations = this.data.variations
			return variations[index] ? variations[index] : null
		}

		findBlock(id: number, data: number = 0): Search.ResultItem {
			let blocks = this.data.search
			console.info(`Trying to find block ${id}:${data} in ${this.name.groupName} group`, `[Carvable.ts] Group.findBlock`)
			return Search.find(blocks, `${id}:${data}`)
		}
	}
}
