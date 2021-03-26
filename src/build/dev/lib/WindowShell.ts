namespace WindowShell {
	export var WindowMarginLR = 340
	export interface IStyle {
		location?: UI.WindowLocationParams
		elements?: UI.ElementSet
		background?: UI.DrawingSet
	}

	export enum GUIStyle {
		default, classic
	}

	export class Default {
		style: IStyle
		Window: UI.Window = new UI.Window()
		constructor() {
			this.style = { location: {}, background: [], elements: {} }
			this.Window.setContent({ location: {}, drawing: [], elements: {} })
		}

		protected addDrawing(drawing: UI.DrawingElements) {
			this.Window.getContent().drawing.push(drawing)
			this.style.background.push(drawing)
		}

		protected addDrawings(drawings: UI.DrawingSet, rewrite?: boolean) {
			if (!rewrite)
				drawings.forEach(value => this.addDrawing(value))
			else {
				this.Window.getContent().drawing = drawings
				this.style.background = drawings
			}
		}

		protected addElement(name: string, element: UI.Elements, rewrite?: boolean) {
			let elements = this.Window.getContent().elements
			if (!elements[name] || rewrite)
				elements[name] = element
			else
				console.warn(`Cannot add element "${name}, element is exists"`)
		}

		protected addElements(elements: UI.ElementSet, rewrite?: boolean) {
			if (!rewrite)
				for (let name in elements) {
					this.addElement(name, elements[name])
				}
			else
				this.style.elements = elements
		}

		protected setLocation(location: UI.WindowLocationParams) {
			let content = this.Window.getContent()
			content.location = location
			this.Window.setContent(content)
			this.style.location = location
		}

		protected setStyle(style: IStyle) {
			this.addDrawings(style.background || [])
			this.addElements(style.elements || {})
			this.setLocation(style.location || {})
		}

		public open() {
			this.Window.open()
		}

		public close() {
			this.Window.close()
		}
	}

	export class WindowStyle {
		protected style: IStyle
		constructor(style: IStyle) {
			this.style = style
			this.style.location = new UI.WindowLocation(style.location)
		}
		get elements() {
			return this.style.elements
		}
		get location() {
			return this.style.location
		}
		get drawings() {
			return this.style.background
		}
	}

	export class Group {
		protected WindowGroup: UI.WindowGroup = new UI.WindowGroup()
		constructor() { }
		get instance() {
			return this.WindowGroup
		}
		public open() {
			this.WindowGroup.open()
		}
		public close() {
			this.WindowGroup.close()
		}
	}
	export function switchTo(window: any, style?: GUIStyle) {
		switch (style) {
			case GUIStyle.classic:
				window.setupClassic()
				break
			default:
				window.setupDefault()
				break
		}
	}
	export class Inventory extends Default {
		marginLR: number = WindowMarginLR
		constructor(style?: GUIStyle) {
			super()
			switchTo(this, style)
		}
		private setupDefault() {
			this.setLocation({
				padding: {
					top: 105, left: 25, bottom: 25, right: 660
				},
				scrollY: 710 //(315.5 * 2.25) = 1000 - 660 = 340 - 25 = 315 * 2.25 = 708.75 = 315.5 *2.25 = 710 
			})

			this.addDrawing({ type: "color", color: 0 })

			let slotSize = 250

			for (let y = 0, i = 0; y < 9; y++)
				for (let x = 0; x < 4; x++)
					this.addElement("__invSlot" + i, { type: "invSlot", x: x * slotSize, y: y * slotSize, size: slotSize + 1, index: i++ })

			this.Window.setDynamic(false)
			this.Window.setInventoryNeeded(true)
		}
		private setupClassic() {
			this.setLocation({
				padding: {
					top: 280, left: this.marginLR, bottom: 35, right: this.marginLR
				}
			})

			this.addDrawing({ type: "color", color: 0 })

			let slotSize = 111

			for (let y = 0, i = 9; y < 3; y++)
				for (let x = 0; x < 9; x++)
					this.addElement("__invSlot" + i, { type: "invSlot", x: x * slotSize, y: y * slotSize, size: slotSize + 1, index: i++ })

			for (let x = 0; x < 9; x++) {
				this.addElement("__invSlot" + x, { type: "invSlot", x: x * slotSize, y: (slotSize * 3) + slotSize / 2, size: slotSize + 1, index: x })
			}

			this.addDrawings([
				{ type: "color", color: 0 },
				// { type: "frame", x: 0, y: 0, width: this.Window.getLocation().getWindowWidth(), height: this.Window.getLocation().getWindowHeight(), scale: 1, bitmap: "style:frame_background_border", color: Color.rgb(198, 198, 198) }
			])

			this.Window.setDynamic(false)
			this.Window.setInventoryNeeded(true)
		}
	}

	export class Header extends Default {
		marginLR: number = WindowMarginLR
		constructor(style?: GUIStyle) {
			super()
			switchTo(this, style)
		}
		private setupDefault() {
			let WIDTH = 1000
			let HEIGHT = 80

			this.setLocation({
				width: WIDTH, height: HEIGHT
			})

			this.addDrawings([
				{ type: "color", color: Color.TRANSPARENT },
				{ type: "frame", x: 0, y: 0, width: 1000, height: HEIGHT, bitmap: "style:frame_background_border", color: Color.rgb(198, 198, 198), scale: 3 },
				{ type: "text", x: 500, y: HEIGHT * 0.5, text: "No Title", font: { align: 1, size: HEIGHT * 0.25, color: -16777216, shadow: 0 } }
			])

			this.addElement("default-close-button", { type: "closeButton", x: 994.0 - (HEIGHT) * 0.75, y: 15, scale: (HEIGHT / 18) * 0.75, bitmap: "style:close_button_up", bitmap2: "style:close_button_down" })
		}
		private setupClassic() {
			this.setLocation({
				padding: {
					top: 55, left: this.marginLR-10, bottom: 250, right: this.marginLR-10
				}
			})

			let WIDTH = 1000
			let HEIGHT = 80
			this.addDrawings([
				{ type: "color", color: Color.TRANSPARENT },
				{ type: "text", x: 40, y: HEIGHT*0.9, text: "No Title", font: { align: 0, size: HEIGHT * 0.55, color: -16777216, shadow: 0 } }
			])
			this.addElement("default-close-button", { type: "closeButton", x: 994.0 - (HEIGHT) * 1.25, y: 10, scale: (HEIGHT / 18) * 1.25, bitmap: "style:close_button_up", bitmap2: "style:close_button_down" })
		}
	}

	export class ContentWindow extends Default {
		marginLR: number = WindowMarginLR
		constructor(style?: GUIStyle) {
			super()
			switchTo(this, style)
		}

		private setupDefault() {

			this.setLocation({
				width: 640,
				height: this.Window.getLocation().getWindowHeight() - 120,
				padding: {
					top: 85,
					bottom: 25,
					left: 365,
					right: 25
				},
			})
			alert(`ContentWindow: [height = ${this.Window.getLocation().getWindowHeight()}]`)
			this.addDrawings([
				{ type: "color", color: 0 },
				{ type: "frame", x: 0, y: 0, width: this.Window.getLocation().getWindowWidth(), height: this.Window.getLocation().getWindowHeight(), scale: 1, bitmap: "style:frame_background_border", color: Color.rgb(198, 198, 198) }
			])

			this.Window.setBackgroundColor(0)
		}

		private setupClassic() {
			this.setLocation({
				padding: {
					top: 90, left: this.marginLR-3, bottom: 200, right: this.marginLR-5
				}
			})
			alert(`ContentWindow: [height = ${this.Window.getLocation().getWindowHeight()}]`)
			this.addDrawings([
				{ type: "color", color: 0 },
				// { type: "frame", x: 0, y: 0, width: this.Window.getLocation().getWindowWidth(), height: this.Window.getLocation().getWindowHeight(), scale: 1, bitmap: "style:frame_background_border", color: Color.rgb(198, 198, 198) }
			])

			this.Window.setBackgroundColor(0)
		}
	}

	export class BackgroundWindow extends Default {
		marginLR: number = WindowMarginLR
		constructor(style?: GUIStyle) {
			super()
			switchTo(this, style)
		}

		private setupDefault() {
			let window = this.Window
			this.setLocation({
				padding: { top: 60, bottom: -1 },
			})
			this.addDrawings([
				{ type: "color", color: 0 },
				{ type: "frame", x: 0, y: 0, width: window.getLocation().getWindowWidth(), height: window.getLocation().getWindowHeight(), scale: 3, bitmap: "style:frame_background_border", color: Color.rgb(198, 198, 198) },
				{ type: "bitmap", x: 0, y: 15, scale: 2, bitmap: "_standart_header_shadow" }
			])
			this.setStyle(this.style)
		}

		private setupClassic() {
			this.setLocation({
				padding: {
					top: 0, left: 0, bottom: -1, right: 0
				}
			})
			let window = this.Window
			this.addDrawings([
				{ type: "color", color: 0 },
				{ type: "frame", x: this.marginLR - 10, y: 50, width: 340, height: window.getLocation().getWindowHeight() - 70, scale: 2, bitmap: "style:frame_background_border", color: Color.rgb(198, 198, 198) },
			])
			this.setStyle(this.style)
		}
	}

	export class Standart extends Group {
		constructor(style?: GUIStyle) {
			super()
			this.setup(style)
		}
		setup(style?: GUIStyle) {
			this.instance.addWindowInstance("main_default", new BackgroundWindow(style).Window)
			this.instance.addWindowInstance("content_default", new ContentWindow(style).Window)
			this.instance.addWindowInstance("header_default", new Header(style).Window)
			this.instance.addWindowInstance("inventory_default", new Inventory(style).Window)
		}
	}
}