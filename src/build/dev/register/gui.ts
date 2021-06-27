namespace GUI {
	export namespace Element {
		export class BasicElement {
			type: string
			x: number = 0
			y: number = 0
			constructor(element: UI.Elements) {
				this.setData(element)
			}
			setData(element: UI.Elements) {
				for (let param in element)
					this[param] = element[param]
				return this
			}
		}
		export class CloseButton extends BasicElement implements UI.UICloseButtonElement {
			type: "close_button" | "closeButton"
			constructor(element: UI.UICloseButtonElement) {
				super(element)
			}
		}
		export class Frame extends BasicElement implements UI.UIFrameElement {
			type: "frame"
			constructor(element: UI.UIFrameElement) {
				super(element)
			}
		}
		export class Scale extends BasicElement implements UI.UIScaleElement {
			type: "scale"
			constructor(element: UI.UIScaleElement) {
				super(element)
			}
		}
		export class Scroll extends BasicElement implements UI.UIScrollElement {
			type: "scroll"
			constructor(element: UI.UIScrollElement) {
				super(element)
			}
		}
		export class Slot extends BasicElement implements UI.UISlotElement {
			type: "slot"
			constructor(element: UI.UISlotElement) {
				super(element)
			}
		}
		export class Switch extends BasicElement implements UI.UISwitchElement {
			type: "switch"
			constructor(element: UI.UISwitchElement) {
				super(element)
			}
		}
		export class Tab extends BasicElement implements UI.UITabElement {
			type: "tab"
			constructor(element: UI.UITabElement) {
				super(element)
			}
		}
		export class Text extends BasicElement implements UI.UITextElement {
			type: "text"
			text: string = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, voluptatem."
			constructor(element: UI.UITextElement) {
				super(element)
			}
		}
		export class FPS extends BasicElement implements UI.UIFPSTextElement {
			type: "fps"
			constructor(element: UI.UIFPSTextElement) {
				super(element)
			}
		}
		export class InvSlot extends BasicElement implements UI.UIInvSlotElement {
			type: "invSlot" | "invslot"
			constructor(element: UI.UIInvSlotElement) {
				super(element)
			}
		}
	}
	export namespace Background {
		export class BasicDrawing {
			type: string
			constructor(element: UI.DrawingElements) {
				this.setData(element)
			}
			setData(element: UI.DrawingElements) {
				for (let param in element)
					this[param] = element[param]
				return this
			}
		}
		export class Color extends BasicDrawing implements UI.ColorDrawing {
			type: "background" | "color"
			color: number = android.graphics.Color.MAGENTA
			constructor(element: UI.ColorDrawing) {
				super(element)
			}
		}
		export class Custom extends BasicDrawing implements UI.CustomDrawing {
			type: "custom"
			constructor(element: UI.CustomDrawing) {
				super(element)
			}
		}
		export class Frame extends BasicDrawing implements UI.FrameDrawing {
			type: "frame"
			x: number = 0
			y: number = 0
			bitmap: string
			constructor(element: UI.FrameDrawing) {
				super(element)
			}
		}
		export class Image extends BasicDrawing implements UI.ImageDrawing {
			type: "bitmap"
			x: number = 0
			y: number = 0
			bitmap: string
			constructor(element: UI.ImageDrawing) {
				super(element)
			}
		}
		export class Line extends BasicDrawing implements UI.LineDrawing {
			type: "line"
			x1: number = 0
			y1: number = 0
			x2: number = 60
			y2: number = 60
			constructor(element: UI.LineDrawing) {
				super(element)
			}
		}
		export class Text extends BasicDrawing implements UI.TextDrawing {
			type: "text"
			x: number = 0
			y: number = 0
			text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, voluptatem."
			constructor(element: UI.TextDrawing) {
				super(element)
			}
		}
	}
	export namespace Grid {
		export class Element {
			constructor(elements: UI.ElementSet, gridData: ElementGridData) {
				let gridElement = gridData.element
				for (let yy = 0, i = (gridData.startIndex || 0); yy < gridData.vertical.count; yy++)
					for (let xx = 0; xx < gridData.horizontal.count; xx++)
						elements[`${gridData.name}${i}`] = (() => {
							let element
							switch (gridElement.type) {
								case 'slot':
									element = new GUI.Element.Slot(gridElement).setData({
										type: "slot", x: (gridElement.x + gridElement.size * xx) + gridData.horizontal.offset,
										y: (gridElement.y + gridElement.size * yy) + gridData.vertical.offset
									})
									break
								case 'invSlot' || 'invslot':
									element = new GUI.Element.InvSlot(gridElement).setData({
										type: "invSlot", x: (gridElement.x + gridElement.size * xx) + gridData.horizontal.offset,
										y: (gridElement.y + gridElement.size * yy) + gridData.vertical.offset,
										index: i
									})
									break
								case 'frame':
									if (gridElement.width && gridElement.height)
										element = new GUI.Element.Frame(gridElement).setData({
											type: "frame", x: (gridElement.x + gridElement.width * xx) + gridData.horizontal.offset,
											y: (gridElement.y + gridElement.height * yy) + gridData.vertical.offset
										})
									break
								case 'switch':
									if (gridElement.scale)
										element = new GUI.Element.Switch(gridElement).setData({
											type: "switch", x: (gridElement.x + (gridElement.scale) * xx) + gridData.horizontal.offset,
											y: (gridElement.y + (gridElement.scale) * yy) + gridData.vertical.offset
										})
									break
								default: break
							}
							i++
							return element
						})()
			}

		}
		export interface ElementGridData {
			name: string
			horizontal: { count: number, offset: number }
			vertical: { count: number, offset: number }
			startIndex: number
			element: UI.Elements
		}
	}
}

namespace ChiselGui {
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
		constructor(name: string) {
			this.name = name
		}
		get title() {
			return Translation.translate(this.name)
		}
	}
	class DefaultGUI {
		window: UI.Window
		header: Header
		constructor(header: Header) {
			this.header = header
		}
		createGUI(elements: UI.ElementSet, innerTopBottomPadding: number = 100): UI.Window {
			let wh = UI.getScreenHeight(),
				paddings = (1000 - wh) / 2,
				contentWindow = new UI.Window({
					location: { x: paddings, y: 0, width: wh, height: wh },
					drawing: [
						backgroundTransparent(),
						{ type: "frame", x: 0, y: innerTopBottomPadding, width: 1000, height: 1000 - innerTopBottomPadding * 2, scale: 3, bitmap: "style:frame_background_border", color: Color.rgb(198, 198, 198) }
					],
					elements
				}),
				mainWindow = new UI.Window({
					location: { x: 0, y: 0, width: 1000, height: wh + 50 },
					drawing: [backgroundShadow()],
					elements: {}
				})

			mainWindow.setInventoryNeeded(true)
			mainWindow.setCloseOnBackPressed(true)
			mainWindow.addAdjacentWindow(contentWindow)
			return mainWindow
		}
		getHeader(): Header {
			return this.header
		}
		getWindow(): UI.Window {
			return this.window
		}
	}

	class IronChisel extends DefaultGUI {
		constructor() {
			super(new Header("container_chisel_title"))
			this.window = this.createGUI(this.getElements())
		}
		topPadding: number = 100
		slotSize: number = 72
		getElements(): UI.ElementSet {
			let elements: UI.ElementSet = {
				textTitle: { type: 'text', x: 132, y: this.topPadding + 247, font: grayCenter(18), text: this.header.title },
				slotPreview: { type: "slot", x: 25, y: this.topPadding + 25, bitmap: "chisel2gui_1", size: 200 },
			}

			new GUI.Grid.Element(elements, {
				name: "slotVariation",
				horizontal: { count: 10, offset: 0 },
				vertical: { count: 6, offset: 0 },
				startIndex: 0,
				element: { type: 'slot', x: 250, y: this.topPadding + 25, size: this.slotSize, visual: true, darken: true, isDarkenAtZero: true }
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
	export var IronChiselGUI = new IronChisel()
	IronChiselGUI.getWindow().open()
}