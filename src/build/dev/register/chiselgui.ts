
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
			var container = isContainerExists(cUID, true)
			setContainerForUID(container, cUID)
			return container
		}
		/**
		 * Check containers with cUID for exists
		 * @param cUID container unique id
		 * @param createNew create new container when not exists
		 * @returns ItemContainer
		 */
		function isContainerExists(cUID: number, createNew: boolean): ItemContainer {
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
		function setContainerForUID(container: ItemContainer, cUID: number) {
			containers[`${keyPrefix}${cUID}`] = container
		}
	}
	function backgroundTransparent(): UI.ColorDrawing {
		return { type: "background", color: Color.TRANSPARENT }
	}
	function backgroundShadow(): UI.ColorDrawing {
		return { type: "background", color: android.graphics.Color.argb(90, 0, 0, 0) }
	}
	function backgroundFrame(height: number): UI.FrameDrawing {
		return { type: "frame", x: 0, y: 0, bitmap: "", width: 1000, height }
	}
	function grayCenter(size: number) {
		return { color: Color.rgb(64, 64, 64), size, alignment: UI.Font.ALIGN_CENTER }
	}
	class Header {
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
		topPadding: number = 131
		slotSize: number = 73
		constructor(header: Header) {
			this.header = header
			this.setupClientSide()
		}
		setupClientSide() {
			ItemContainer.registerScreenFactory(this.getGuiID(), (container, name) => {
				if (name == this.header.guiID)
					return this.group
				return null
			})
		}
		setupServerSide(container: ItemContainer) {

		}
		setupContainer(container: ItemContainer) {
			container.setClientContainerTypeName(this.getGuiID())
		}
		createGUI(elements: UI.ElementSet, innerTopBottomPadding: number = this.topPadding): UI.WindowGroup {
			let wh = UI.getScreenHeight(),
				paddings = (1000 - wh) / 2,
				contentWindow = new UI.Window({
					location: { x: paddings, y: 0, width: wh, height: wh },
					drawing: [
						backgroundTransparent(),
						{ type: "frame", x: 916, y: 55, width: 84, height: 96, scale: 3, bitmap: "button_frame_close", color: Color.rgb(64, 64, 64) },
						{ type: "frame", x: 0, y: innerTopBottomPadding, width: 1000, height: 814, scale: 3, bitmap: "style:frame_background_border", color: Color.rgb(198, 198, 198) },
					],
					elements
				}),
				mainWindow = new UI.Window({
					location: { x: 0, y: 0, width: 1000, height: wh + 50 },
					drawing: [backgroundShadow()],
					elements: {}
				})

			contentWindow.setInventoryNeeded(true)

			let group = new UI.WindowGroup()
			group.addWindowInstance("background", mainWindow)
			group.addWindowInstance("content", contentWindow)
			group.setCloseOnBackPressed(true)
			group.setDebugEnabled(true)

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
	class IronChisel extends Base {
		constructor() {
			super(new Header("Iron Chisel", "chisel_iron.ui"))
			this.group = this.createGUI(this.getElements())
		}
		getElements(): UI.ElementSet {
			let elements: UI.ElementSet = {
				textTitle: { type: 'text', x: 132, y: this.topPadding + 225, font: grayCenter(20), text: this.header.title },
				slotPreview: { type: "slot", x: 25, y: this.topPadding + 25, bitmap: "chisel2gui_1", size: 202 },
				closeButton: { type: 'closeButton', x: 928, y: 67, bitmap: "button_close_up_light", bitmap2: "button_close_down_light", scale: 4.25, global: true }
			}

			new GUI.Grid.Element(elements, {
				name: "slotVariation",
				horizontal: { count: 10, offset: 0 },
				vertical: { count: 6, offset: 0 },
				startIndex: 0,
				element: { type: 'slot', x: 245, y: this.topPadding + 25, size: this.slotSize, visual: true, darken: true, isDarkenAtZero: true }
			})
			new GUI.Grid.Element(elements, {
				name: "slotInventory",
				horizontal: { count: 9, offset: 0 },
				vertical: { count: 3, offset: 0 },
				startIndex: 9,
				element: { type: 'invSlot', x: 250 + (this.slotSize / 2), y: this.topPadding + 400 + (this.slotSize), size: this.slotSize }
			})
			new GUI.Grid.Element(elements, {
				name: "slotInventory",
				horizontal: { count: 9, offset: 0 },
				vertical: { count: 1, offset: 0 },
				startIndex: 0,
				element: { type: 'invSlot', x: 250 + (this.slotSize / 2), y: this.topPadding + 415 + (this.slotSize * 4), size: this.slotSize }
			})
			return elements
		}
	}
	class DiamondChisel extends Base {
		constructor() {
			super(new Header("Diamond Chisel", "chisel_diamond.ui"))
			this.group = this.createGUI(this.getElements())
		}
		getElements(): UI.ElementSet {
			let elements: UI.ElementSet = {
				textTitle: { type: 'text', x: 132, y: this.topPadding + 225, font: grayCenter(20), text: this.header.title },
				slotPreview: { type: "slot", x: 25, y: this.topPadding + 25, bitmap: "chisel2gui_1", size: 202 },
				closeButton: { type: 'closeButton', x: 928, y: 67, bitmap: "button_close_up_light", bitmap2: "button_close_down_light", scale: 4.25, global: true }
			}

			new ModeButton.Single(35, this.topPadding + 270).addTo(elements)
			new ModeButton.Panel(135, this.topPadding + 270).addTo(elements)
			new ModeButton.Column(35, this.topPadding + 370).addTo(elements)
			new ModeButton.Row(135, this.topPadding + 370).addTo(elements)

			new GUI.Grid.Element(elements, {
				name: "slotVariation",
				horizontal: { count: 10, offset: 0 },
				vertical: { count: 6, offset: 0 },
				startIndex: 0,
				element: { type: 'slot', x: 245, y: this.topPadding + 25, size: this.slotSize, visual: true, darken: true, isDarkenAtZero: true }
			})
			new GUI.Grid.Element(elements, {
				name: "slotInventory",
				horizontal: { count: 9, offset: 0 },
				vertical: { count: 3, offset: 0 },
				startIndex: 9,
				element: { type: 'invSlot', x: 250 + (this.slotSize / 2), y: this.topPadding + 400 + (this.slotSize), size: this.slotSize }
			})
			new GUI.Grid.Element(elements, {
				name: "slotInventory",
				horizontal: { count: 9, offset: 0 },
				vertical: { count: 1, offset: 0 },
				startIndex: 0,
				element: { type: 'invSlot', x: 250 + (this.slotSize / 2), y: this.topPadding + 415 + (this.slotSize * 4), size: this.slotSize }
			})
			return elements
		}
	}
	class HiTechChisel extends Base {
		constructor() {
			super(new Header("HiTech Chisel", "chisel_hitech.ui"))
			this.group = this.createGUI(this.getElements())
		}
		getElements(): UI.ElementSet {
			let elements: UI.ElementSet = {
				textTitle: { type: 'text', x: 166, y: this.topPadding + 305, font: grayCenter(20), text: this.header.title },
				slotPreview: { type: "slot", x: 25, y: this.topPadding + 25, bitmap: "chiselguihitech_0", size: 280 },
				closeButton: { type: 'closeButton', x: 928, y: 67, bitmap: "button_close_up_light", bitmap2: "button_close_down_light", scale: 4.25, global: true },
				chiselButton: { type: 'button', x: 25, y: this.topPadding + 346, scale: 5, bitmap: "chisel_button_up", bitmap2: "chisel_button_down" },
				modeButton: { type: 'button', x: 25, y: this.topPadding + 436, scale: 5, bitmap: "chisel_button_up", bitmap2: "chisel_button_down" },
			}

			new ModeButton.Single(25, this.topPadding + 524).addTo(elements)
			new ModeButton.Panel(125, this.topPadding + 524).addTo(elements)
			new ModeButton.Column(225, this.topPadding + 524).addTo(elements)

			new ModeButton.Row(25, this.topPadding + 624).addTo(elements)
			new ModeButton.Contiguous(125, this.topPadding + 624).addTo(elements)
			new ModeButton.Contiguous_2D(225, this.topPadding + 624).addTo(elements)

			new GUI.Grid.Element(elements, {
				name: "slotVariation",
				horizontal: { count: 9, offset: 0 },
				vertical: { count: 6, offset: 0 },
				startIndex: 0,
				element: { type: 'slot', x: 318, y: this.topPadding + 25, size: this.slotSize, visual: true, darken: true, isDarkenAtZero: true }
			})
			new GUI.Grid.Element(elements, {
				name: "slotInventory",
				horizontal: { count: 9, offset: 0 },
				vertical: { count: 3, offset: 0 },
				startIndex: 9,
				element: { type: 'invSlot', x: 318, y: this.topPadding + 482, size: this.slotSize }
			})
			new GUI.Grid.Element(elements, {
				name: "slotInventory",
				horizontal: { count: 9, offset: 0 },
				vertical: { count: 1, offset: 0 },
				startIndex: 0,
				element: { type: 'invSlot', x: 318, y: this.topPadding + 716, size: this.slotSize }
			})
			return elements
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
					onClick(position: Vector, container: ItemContainer) {
						let slot = container.getSlot("slotPreview")
						// container.addServerEventListener("")
						alert(`${this_.modeName}; ID:Data = ${slot.id}:${slot.data}, extra ${slot.extra}`)
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
	export var IronChiselGUI = new IronChisel()
	export var DiamondChiselGUI = new DiamondChisel()
	export var HiTechChiselGUI = new HiTechChisel()
}

