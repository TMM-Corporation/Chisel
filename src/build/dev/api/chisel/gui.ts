namespace ChiselGUI {
	export namespace Data {
		interface Structure {
			containers?: { [cUID: string]: ItemContainer }
		}
		export var containers = {}
		// BUG: data cant's save and read
		Saver.addSavesScope("chisel.data.gui",
			function read(data: Structure) {
				// var savedContainers
				// containers = (savedContainers = data.containers) !== null && savedContainers !== void 0 ? savedContainers : {}
				console.json(containers, "DATA READING")
			}, function save() {
				console.json(containers, "DATA SAVING")
				// return { containers }
				return {}
			}
		)
		/**
		 * Get container by cUID
		 * @param cUID container unique id
		 * @returns ItemContainer
		 */
		export function getContainerByUID(cUID: string = generateUID()): { cUID: string, container: ItemContainer } {
			var container = containerExists(cUID, true)
			bindContainerUID(container, cUID)
			return { cUID, container }
		}
		/**
		 * Check containers with cUID for exists
		 * @param cUID container unique id
		 * @param createNew create new container when not exists
		 * @returns ItemContainer
		 */
		function containerExists(cUID: string, createNew: boolean): ItemContainer {
			let exists = containers[cUID]
			let result = exists ? exists : (createNew ? new ItemContainer() : exists)
			console.info((!exists ? `Created new: ${result}` : `Already Exists: ${exists}`) + `, createNewWhenNotExists: ${createNew}`)
			return result
		}
		/**
		 * Replace container for cUID
		 * @param container ItemContainer to set for cUID
		 * @param cUID container unique id
		 */
		function bindContainerUID(container: ItemContainer, cUID: string) {
			containers[cUID] = container
		}
		export function generateUID() {
			return randomString(10, "a")
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
	export namespace Base {
		/**
		 * Setups ItemContainer screen factory for guiID
		 * @param guiID string name of gui
		 * @param window Window or WindowGroup to be attached to guiID
		 */
		export function setupScreen(guiID: string, window: UI.Window | UI.WindowGroup) {
			ItemContainer.registerScreenFactory(guiID, (container, name) => {
				return window
			})
		}
		/**
		 * Sets up variation slots data
		 * @param gui Chisel gui instance
		 * @param x x coord
		 * @param y y coord
		 * @param count total slot count
		 * @param [prefix] slot name prefix
		 */
		export function setUpVariationSlots(gui: ChiselGUI.Custom, x: number, y: number, count: number, prefix?: string) {
			let variationSlots = gui.variationSlots
			variationSlots.x = x
			variationSlots.y = y
			variationSlots.count = count
			variationSlots.prefix = prefix || variationSlots.prefix
		}
		/**
		 * Sets variation [id:data] for current item.
		 * @param playerUid client uid
		 * @param id block id of variation
		 * @param data block data of variation
		 */
		export function setVariation(playerUid: number, id: number, data: number) {
			let item = Entity.getCarriedItem(playerUid)
			item.extra.putInt("variationId", id)
			item.extra.putInt("variationData", data)
			Entity.setCarriedItem(playerUid, item.id, item.count, item.data, item.extra)
		}
		/**
		 * Clears variation slots inside gui container
		 * @param container ItemContainer
		 * @param variationSlots varitation slots data of current gui
		 */
		export function clearVariationSlots(container: ItemContainer, variationSlots: VariationSlots): void {
			for (let i = 0; i < variationSlots.count; i++)
				container.clearSlot(`${variationSlots.prefix}${i}`)
			container.sendChanges()
		}
		/**
		 * Clears preview slot
		 * @param container ItemContainer
		 */
		export function clearPreviewSlot(container: ItemContainer): void {
			container.clearSlot('slotPreview')
			container.sendChanges()
		}
		/**
		 * Decreases preview slot item count
		 * @param container ItemContainer
		 * @param [amount] amount of item to be decreased
		 */
		export function decreasePreviewSlot(container: ItemContainer, amount: number = 1): void {
			let slot = container.getSlot('slotPreview')
			container.setSlot('slotPreview', slot.id, slot.count - amount, slot.data, slot.extra)
			container.sendChanges()
		}
		/**
		 * Updates variation count for variation slots
		 * @param container ItemContainer
		 * @param gui Chisel gui instance
		 * @param count new count of item
		 * @param [name] skips this variation slot
		 */
		export function updateVariationCount(container: ItemContainer, gui: ChiselGUI.Custom, count: number, name?: string) {
			for (let i = 0, u = 0; i < gui.variationSlots.count; i++) {
				const elementName = `${gui.variationSlots.prefix}${i}`
				if (elementName == name) continue
				let slot = container.getSlot(elementName)
				container.setSlot(elementName, slot.id, count, slot.data)
			}
			container.sendChanges()
		}
		/**
		 * Fills variation slots with Carvable variations
		 * @param container ItemContainer
		 * @param gui Chisel gui instance
		 * @param item ItemInstance of current block
		 */
		export function fillVariationSlots(container: ItemContainer, gui: ChiselGUI.Custom, item: ItemInstance): void {
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
						const elementName = `${gui.variationSlots.prefix}${i - u}`
						container.setSlot(elementName, splitted.id, 1, splitted.data)
						// container.setBinding(elementName, "text", `a${item.count}`)
					}
					console.info(`${splitted.id}:${splitted.data}, ${item.id}:${item.data} - [${item.id == splitted.id}, ${item.data == splitted.data}]`)
				}
			}
			container.sendChanges()
		}
		/**
		 * Prepares background with gui controls
		 * @param gui Chisel gui instance
		 */
		export function prepareBackground(gui: ChiselGUI.Custom) {
			gui.addDrawing(GUI.BG.transparent)
			gui.addDrawing(gui.controls.getControls().drawing)
			gui.addDrawing({ type: "frame", x: 0, y: gui.topPadding, width: 1000, height: 814, scale: 3, bitmap: "style:frame_background_border", color: Color.rgb(198, 198, 198) })
		}
		/**
		 * Creates gui for Chisel
		 * @param elements any UI.Elements
		 * @param gui Chisel gui instance
		 * @returns UI.WindowGroup 
		 */
		export function createGUI(elements: UI.ElementSet, gui: ChiselGUI.Custom): UI.WindowGroup {
			prepareBackground(gui)
			let wh = UI.getScreenHeight(),
				paddings = (1000 - wh) / 2,
				contentWindow = new UI.Window({
					location: { x: paddings, y: 0, width: wh, height: wh },
					drawing: gui.drawing,
					elements: Object.assign({}, elements, gui.controls.getControls().elements),
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
	}
	/**
	 * Variation slots data
	 */
	export interface VariationSlots {
		x: number
		y: number
		count: number
		prefix?: string
	}
	export class Custom {
		group: UI.WindowGroup
		header: Header
		variationSlots: VariationSlots = { x: 0, y: 0, count: 0, prefix: "slotVariation" }
		topPadding: number = 131
		slotSize: number = 73
		elements: UI.ElementSet = {}
		drawing: UI.DrawingSet = []
		controls: GUI.ControlTypes
		constructor(header: Header) {
			this.header = header
			this.controls = new GUI.Controls.PC(916, 55, true, true)
		}
		setupClientSide(container?: ItemContainer) { }
		/**
		 * Setups server side
		 * @param container 
		 */
		setupServerSide(container: ItemContainer) {
			console.info("Chisel gui custom setup")
			// VanillaSlots.registerForWindow(this.group, container)
		}
		/**
		 * Gets header
		 * @returns header 
		 */
		getHeader(): Header {
			return this.header
		}

		addDrawing(element: UI.DrawingElements) {
			this.drawing.push(element)
		}
		/**
		 * Gets gui id
		 * @returns gui id 
		 */
		getGuiID(): string {
			return this.getHeader().guiID
		}
		/**
		 * Gets group
		 * @returns group - WindowGroup
		 */
		getGroup(): UI.WindowGroup {
			return this.group
		}

	}
	export namespace ModeButton {
		interface ModeDescription {
			modeName: ChiselModes.UseModeType
			modeID: ChiselModes.UseMode
			icon: string
		}
		export class BasicButton {
			button: UI.UIButtonElement
			coverImage: UI.UIImageElement = { type: 'image', x: 0, y: 0, scale: 2.083, bitmap: "null", z: 2 }
			modeName: string = ""
			constructor(x: number = 0, y: number = 0, description: ModeDescription) {
				this.modeName = description.modeName
				this.button = {
					type: 'button', x, y,
					bitmap: 'style:classic_button_up',
					bitmap2: 'style:classic_button_down',
					scale: 5, clicker: this.clicker, z: 1
				}
				this.coverImage = Object.assign({}, this.coverImage, { x: x + 15, y: y + 15, bitmap: description.icon })
			}
			get clicker(): UI.UIClickEvent {
				let this_ = this
				return {
					onClick(uiHandler: any, container: ItemContainer, uiElement: UI.UIButtonElement, position: Vector) {
						console.genTSDocFor(uiHandler, "ItemContainerUiHandler")
						console.genTSDocFor(container, "ItemContainer")
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
				super(x, y, { modeName: 'single', modeID: 0, icon: 'modeicons_0' })
			}
		}
		export class Panel extends BasicButton {
			constructor(x: number, y: number) {
				super(x, y, { modeName: 'panel', modeID: 1, icon: 'modeicons_1' })
			}
		}
		export class Column extends BasicButton {
			constructor(x: number, y: number) {
				super(x, y, { modeName: 'column', modeID: 2, icon: 'modeicons_2' })
			}
		}
		export class Row extends BasicButton {
			constructor(x: number, y: number) {
				super(x, y, { modeName: 'row', modeID: 3, icon: 'modeicons_3' })
			}
		}
		export class Contiguous_2D extends BasicButton {
			constructor(x: number, y: number) {
				super(x, y, { modeName: 'contiguous_2d', modeID: 4, icon: 'modeicons_4' })
			}
		}
		export class Contiguous extends BasicButton {
			constructor(x: number, y: number) {
				super(x, y, { modeName: 'contiguous', modeID: 5, icon: 'modeicons_5' })
			}
		}
	}
}