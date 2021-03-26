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
			localization?: Localization
			variations: Variation[]
		}
		export interface Variation {
			block?: { id: number, data?: number }
			texture?: Texture
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
		export var List: { [name: string]: Group } = {}

		export function addGroup(group: Group) {
			if (!(group.name.groupName in List))
				List[group.name.groupName] = group
		}

		export function findGroupByBlock(id: number, data: number = 0): Group | null {
			var group: Group
			console.info(`Trying to find group from ${id}:${data}`)
			for (let name in List) {
				console.info(`${group}, ${name}`)
				group = List[name]
				if (group.bindingExists(id, data))
					return group
				else continue
			}
			console.info(`Search result ${JSON.stringify(group)}`)
			return null
		}

		export function groupByName(groupName: string): Group | null {
			return List[groupName]
		}

		export function groupExitsts(name: string) {
			return name in List
		}

		export function nextBlockFor(id: number, data: number = 0): { id: number, data: number } {
			let group = findGroupByBlock(id, data)
			if (group)
				return group.getNextBlockFor(id, data)
			return { id: -1, data: 0 }
		}

		export function prevBlockFor(id: number, data: number = 0): { id: number, data: number } {
			let group = findGroupByBlock(id)
			if (group)
				return group.getPrevBlockFor(id)
			return { id: -1, data: 0 }
		}
	}

	export interface GroupData {
		names: string[],
		binding: {
			id: number[],
			data: number[],
		}
		search: string[]
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
			search: []
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
				console.warn(`Id ${id}:${data} already exists in ${this.name.groupName} group`)
			else {
				binding.id.push(id)
				binding.data.push(data)
				console.info(`Id ${id}:${data} successfully binded to ${this.name.groupName} group`)
			}
		}

		bindingExists(id: number, data: number = 0): boolean {
			let i = this.bindingIndex(id, data)
			console.info(`Binding Index for ${id}:${data} = ${i}, exists: ${!!~i}`)
			return !!~i
		}

		bindingIndex(id: number, data: number = 0): number {
			let i = this.data.search.lastIndexOf(`${id}:${data}`)
			console.info(`Binding Index for ${id}:${data} = ${i}`)
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
			return !!~this.data.binding.id.lastIndexOf(id)
		}

		get bindings() {
			return this.data.binding
		}
		bindingDataFromId(id: number) {
			return this.bindingExists(id) ? this.bindingData(id) : 0
		}

		get ids() {
			return this.data.binding.id
		}

		getNextBlockFor(id: number, data: number = 0): { id: number, data: number } {
			let blocks = this.data.search
			console.info(`Trying to find NEXT block in ${this.name.groupName} group`)
			let result = Additional.findFor(blocks, `${id}:${data}`, Additional.Direction.NEXT)
			if (result != -1) {
				result = result.split(":")
				console.info(`Result ${result[0]}:${result[1]}`)
				return { id: result[0], data: result[1] }
			}
		}

		getPrevBlockFor(id: number, data: number = 0): { id: number, data: number } {
			let blocks = this.data.search
			console.info(`Trying to find PREV block in ${this.name.groupName} group`)
			let result = Additional.findFor(blocks, `${id}:${data}`, Additional.Direction.PREV)
			if (result != -1) {
				result = result.split(":")
				console.info(`Result ${result[0]}:${result[1]}`)
				return { id: result[0], data: result[1] }
			}
		}
	}
}
