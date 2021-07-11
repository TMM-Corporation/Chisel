
namespace ChiselGUI {
	export namespace Data {
		interface Structure {
			nextUniquieID?: number
			containers?: { [name: string]: ItemContainer }
		}
		const keyPrefix = 'cUID'
		export var nextUniqueID = 0
		export var containers = {}

		Saver.addSavesScope("ChiselGUI.Data",
			function read(data: Structure) {
				var nUID, savedContainers
				nextUniqueID = (nUID = data.nextUniquieID) !== null && nUID !== void 0 ? nUID : 1
				containers = (savedContainers = data.containers) !== null && savedContainers !== void 0 ? savedContainers : {}
			}, function save() { return { nextUniqueID, containers } }
		)
		/**
		 * Get container by cUID
		 * @param cUID container unique id
		 * @returns ItemContainer
		 */
		export function getContainerByUID(cUID: number): ItemContainer {
			var container = containerExists(cUID, true)
			bindContainerUID(container, cUID)
			return container
		}
		/**
		 * Check containers with cUID for exists
		 * @param cUID container unique id
		 * @param createNew create new container when not exists
		 * @returns ItemContainer
		 */
		function containerExists(cUID: number, createNew: boolean): ItemContainer {
			let exists = containers[`${keyPrefix}${cUID}`]
			let result = exists ? exists : (createNew ? new ItemContainer() : exists)
			console.info((!exists ? `Created new: ${result}` : `Already Exists: ${exists}`) + `, createNewWhenNotExists: ${createNew}`)
			return result
		}
		/**
		 * Replace container for cUID
		 * @param container ItemContainer to set for cUID
		 * @param cUID container unique id
		 */
		function bindContainerUID(container: ItemContainer, cUID: number) {
			containers[`${keyPrefix}${cUID}`] = container
		}
	}
	export class Header {
		name: string = ""
		guiName: string = "chisel.ui"
		constructor(name: string, guiName: string) {
			this.name = name
			this.guiName = guiName
		}
		get title(): string {
			return Translation.translate(this.name)
		}
		get guiID(): string {
			return this.guiName
		}
	}
	export class Base {
		group: UI.WindowGroup
		header: Header
		variationSlots: {
			x: number
			y: number
			count: number
			name?: string
		} = { x: 0, y: 0, count: 0, name: "slotVariation" }
		topPadding: number = 131
		slotSize: number = 73
		elements: UI.ElementSet = {}
		drawing: UI.DrawingSet = []
		controls: GUI.ControlTypes
		constructor(header: Header) {
			this.header = header
			this.setupClientSide()
			this.controls = new GUI.Controls.PC(916, 55, true, true)
		}
		setUpVariationSlots(x: number, y: number, count: number, name?: string) {
			let variationSlots = this.variationSlots
			variationSlots.x = x
			variationSlots.y = y
			variationSlots.count = count
			variationSlots.name = name || variationSlots.name
		}
		setupClientSide() {
			ItemContainer.registerScreenFactory(this.getGuiID(), (container, name) => {
				return this.group
			})
		}
		setupContainer(container: ItemContainer) {
			var GUIBASE = this
			container.setClientContainerTypeName(this.getGuiID())

			container.setSlotGetTransferPolicy('slotPreview',
				function (itemContainer: ItemContainer, name: string, id: number, amount: number, data: number, extra: ItemExtraData, playerUid: number) {
					console.debug(`[FROM] Slot '${name}', Item: [${id}:${data}, ${amount}] (${Item.getName(id, data)}), UID ${playerUid}`, 'TransferPolicy')
					let slot = itemContainer.getSlot(name)

					if (slot.count == amount) {
						GUIBASE.setVariation(playerUid, -1, -1)
						GUIBASE.clearVariationSlots(container)
					} else
						GUIBASE.updateVariationCount(itemContainer, slot.count - amount)


					return amount
				}
			)
			container.setSlotAddTransferPolicy('slotPreview',
				function (itemContainer: ItemContainer, name: string, id: number, amount: number, data: number, extra: ItemExtraData, playerUid: number) {
					if (!Carvable.Groups.searchBlock(id, data).group) {
						console.debug(`Player trying to add not valid item [${id}:${data}]`)
						return 0
					}
					console.debug(`[INTO] Slot '${name}', Item: [${id}:${data}, ${amount}] (${Item.getName(id, data)}), UID: ${playerUid}`, 'TransferPolicy')
					let slot = itemContainer.getSlot(name)
					if (slot.id === 0 && amount > 0) {
						// console.json(GUIBASE.variationSlots)
						GUIBASE.setVariation(playerUid, id, data)
						GUIBASE.fillVariationSlots(itemContainer, { id, count: amount, data, extra })
					}

					var available = (Item.getMaxStack(id) - slot.count)
					var result = amount <= available ? amount : available
					GUIBASE.updateVariationCount(itemContainer, slot.count + result)
					return result
				}
			)
			VanillaSlots.registerForWindow(this.group, container)
		}
		additionalContainerSetup(container: ItemContainer) { }
		setVariation(playerUid: number, id: number, data: number) {
			let item = Entity.getCarriedItem(playerUid)
			item.extra.putInt("variationId", id)
			item.extra.putInt("variationData", data)
			Entity.setCarriedItem(playerUid, item.id, item.count, item.data, item.extra)
		}
		clearVariationSlots(container: ItemContainer): void {
			for (let i = 0; i < this.variationSlots.count; i++)
				container.clearSlot(`${this.variationSlots.name}${i}`)
			container.sendChanges()
		}
		clearPreviewSlot(container: ItemContainer): void {
			container.clearSlot('slotPreview')
			container.sendChanges()
		}
		decreasePreviewSlot(container: ItemContainer, amount: number = 1): void {
			let slot = container.getSlot('slotPreview')
			container.setSlot('slotPreview', slot.id, slot.count - amount, slot.data, slot.extra)
			container.sendChanges()
		}
		updateVariationCount(container: ItemContainer, count: number, name?: string) {
			for (let i = 0, u = 0; i < this.variationSlots.count; i++) {
				const elementName = `${this.variationSlots.name}${i}`
				if (elementName == name) continue
				let slot = container.getSlot(elementName)
				container.setSlot(elementName, slot.id, count, slot.data)
			}
			container.sendChanges()
		}
		fillVariationSlots(container: ItemContainer, item: ItemInstance): void {
			let ids, result = Carvable.Groups.searchBlock(item.id, item.data)

			if (result.group)
				ids = result.group.data.search

			if (ids) {
				let slotPreview = container.getSlot("slotPreview")
				for (let i = 0, u = 0; i < ids.length; i++) {
					const element = ids[i]
					let splitted = Carvable.Groups.splitIdData(element)
					if ((item.id == splitted.id && item.data == splitted.data))
						u += 1
					else {
						const elementName = `${this.variationSlots.name}${i - u}`
						container.setSlot(elementName, splitted.id, 1, splitted.data)
						// container.setBinding(elementName, "text", `a${item.count}`)
					}
					console.info(`${splitted.id}:${splitted.data}, ${item.id}:${item.data} - [${item.id == splitted.id}, ${item.data == splitted.data}]`)
				}
			}
			container.sendChanges()
		}
		addDrawing(element: UI.DrawingElements) {
			this.drawing.push(element)
		}
		prepareBackground() {
			this.addDrawing(GUI.BG.transparent)
			this.addDrawing(this.controls.getControls().drawing)
			this.addDrawing({ type: "frame", x: 0, y: this.topPadding, width: 1000, height: 814, scale: 3, bitmap: "style:frame_background_border", color: Color.rgb(198, 198, 198) },)
		}
		createGUI(elements: UI.ElementSet): UI.WindowGroup {
			this.prepareBackground()
			let wh = UI.getScreenHeight(),
				paddings = (1000 - wh) / 2,
				contentWindow = new UI.Window({
					location: { x: paddings, y: 0, width: wh, height: wh },
					drawing: this.drawing,
					elements: Object.assign({}, elements, this.controls.getControls().elements),
					params: {
						selection: "chisel2gui_selection",
					}
				}),
				mainWindow = new UI.Window({
					location: { x: 0, y: 0, width: 1000, height: wh + 50 },
					drawing: [GUI.BG.shadow],
					elements: {}
				})

			contentWindow.setInventoryNeeded(true)

			let group = new UI.WindowGroup()
			group.addWindowInstance("background", mainWindow)
			group.addWindowInstance("content", contentWindow)
			group.setCloseOnBackPressed(true)
			// group.setDebugEnabled(true)

			return group
		}
		getHeader(): Header {
			return this.header
		}
		getGuiID(): string {
			return this.getHeader().guiID
		}
		getGroup(): UI.WindowGroup {
			return this.group
		}
	}
	export namespace ModeButton {
		type UseMode =
			/* Chisel a 3x1 column of blocks */
			'column' |
			/* Chisel an area of alike blocks, extending 10 blocks in any direction */
			'contiguous' |
			/* Chisel an area of alike blocks, extending 10 blocks along the plane of the current side */
			'contiguous_2d' |
			/* Chisel a 3x3 square of blocks */
			'panel' |
			/* Chisel a 1x3 row of blocks */
			'row' |
			/* Chisel a single block */
			'single'
		export class BasicButton {
			button: UI.UIButtonElement
			coverImage: UI.UIImageElement
			modeName: string = ""
			constructor(x: number = 0, y: number = 0, mode: UseMode, icon: string) {
				this.modeName = mode
				this.button = {
					type: 'button', x, y,
					bitmap: 'style:classic_button_up',
					bitmap2: 'style:classic_button_down',
					scale: 5, clicker: this.clicker, z: 1
				}
				this.coverImage = { type: 'image', x: x + 15, y: y + 15, scale: 2.083, bitmap: icon, z: 2 }
			}
			get clicker(): UI.UIClickEvent {
				let this_ = this
				return {
					onClick(uiHandler: any, container: ItemContainer, uiElement: UI.UIButtonElement, position: Vector) {
						// console.info('Start container')
						// for (let i in container) {
						// 	console.debug(`${i}, ${container[i]}`)
						// }
						console.debug(Dumper.toDTS(uiHandler, "ItemContainerUiHandler"))
						console.debug(Dumper.toDTS(container, "ItemContainer"))
						// console.info('Start uiElement')
						// for (let i in uiElement) {
						// 	console.debug(`${i}, ${uiElement[i]}`)
						// }
					}
				}
			}
			addTo(elements: UI.ElementSet) {
				elements[`cover_image_mode_${this.modeName}`] = this.coverImage
				elements[`button_mode_${this.modeName}`] = this.button
			}
		}

		export class Single extends BasicButton {
			constructor(x: number, y: number) {
				super(x, y, 'single', 'modeicons_0')
			}
		}
		export class Panel extends BasicButton {
			constructor(x: number, y: number) {
				super(x, y, 'panel', 'modeicons_1')
			}
		}
		export class Column extends BasicButton {
			constructor(x: number, y: number) {
				super(x, y, 'column', 'modeicons_2')
			}
		}
		export class Row extends BasicButton {
			constructor(x: number, y: number) {
				super(x, y, 'row', 'modeicons_3')
			}
		}
		export class Contiguous_2D extends BasicButton {
			constructor(x: number, y: number) {
				super(x, y, 'contiguous_2d', 'modeicons_4')
			}
		}
		export class Contiguous extends BasicButton {
			constructor(x: number, y: number) {
				super(x, y, 'contiguous', 'modeicons_5')
			}
		}
	}
}