
// let itemGui = new WindowShell.Standart(WindowShell.GUIStyle.classic)
// itemGui.open()
// namespace IronChiselGui {
// 	export function BuildInventory() {
// 		const slots: { [name: string]: UI.UISlotElement } = {}
// 		const slotSize = 60
// 		const slotGrid = [10, 6]
// 		for (let y = 0, i = 0; y < slotGrid[1]; y++)
// 			for (let x = 0; x < slotGrid[0]; x++)
// 				slots["decorativeSlot" + (i++)] = { type: "slot", x: 205 + (x * slotSize), y: 24 + (y * slotSize), size: slotSize + 1, visual:true,isDarkenAtZero:true}
// 		slots["previewSlot"] = { type: "slot", x: 24, y: 24, size: 168, visual: true, isDarkenAtZero: true }
// 		slots["selectionSlot"] = { type: "slot", x: 0, y: 0, size: 60, visual: true, isDarkenAtZero: true, bitmap:"chiseljei_0" }
// 	}
// }
// new UI.StandardWindow({
// 	standart: {
// 		header: { text: { text: "Litherite Solar Panel" } },
// 		inventory: { standart: true },
// 		background: { standart: true }
// 	},

// 	params: {
// 		slot: "default_slot",
// 		invSlot: "default_slot"
// 	},

// 	drawing: [
// 		{ type: "background", color: android.graphics.Color.rgb(179, 179, 179) },
// 	],

// 	elements: {
// 		"textGen": { font: { color: android.graphics.Color.WHITE, shadow: 0.6, size: 18 }, type: "text", x: 660, y: 204, width: 300, height: 39, text: "Generating: " },
// 		"slotEnergy": { type: "slot", x: 600, y: 130, isValid: function (id) { return ChargeItemRegistry.isValidItem(id, "Eu", 0) } },
// 		"sun": { type: "image", x: 608, y: 194, bitmap: "sun_off", scale: GUI_SCALE }
// 	})


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
	class IronChisel {
		slots: [horizontal: number, vertical: number, size: number] = [10, 6, 72]
		header: Header = new Header("container_chisel_title")
		window: UI.Window
		constructor() {
			this.window = this.init()
		}
		getHeader(): Header {
			return this.header
		}
		getWindow(): UI.Window {
			return this.window
		}
		init(): UI.Window {
			let wh = UI.getScreenHeight()
			let paddings = (1000 - wh) / 2
			let slotSize = this.slots[2]
			let topPadding = 100
			let contentWindow = new UI.Window({
				location: { x: paddings, y: 0, width: wh, height: wh },
				drawing: [
					backgroundTransparent(),
					{ type: "frame", x: 0, y: topPadding, width: 1000, height: 1000 - topPadding * 2, scale: 3, bitmap: "style:frame_background_border", color: Color.rgb(198, 198, 198) }
				],
				elements: (() => {
					let elements: UI.ElementSet = {
						textTitle: { type: 'text', x: 130, y: topPadding + 235, font: grayCenter(18), text: this.header.title },
						slotPreview: { type: "slot", x: 25, y: topPadding + 25, bitmap: "chisel2gui_1", size: 200 },
					}
					for (let yy = 0, i = 0; yy < this.slots[1]; yy++)
						for (let xx = 0; xx < this.slots[0]; xx++)
							elements[`slotVariation${i++}`] = { type: "slot", x: 250 + slotSize * xx, y: topPadding + 25 + slotSize * yy, size: slotSize, visual: true, isDarkenAtZero: true }

					for (let i = 0; i < 9; i++) elements[`slotInventory${i}`] = { type: "invSlot", x: 250 + (slotSize / 2) + slotSize * i, y: topPadding + 415 + (slotSize * 4), size: slotSize, index: i }
					for (let i = 9; i < 36; i++) elements[`slotInventory${i}`] = { type: "invSlot", x: 250 + (slotSize / 2) + slotSize * (i % 9), y: topPadding + 400 + Math.floor(i / 9) * slotSize, size: slotSize, index: i }

					return elements
				})()
			})
			let mainWindow = new UI.Window({
				location: { x: 0, y: 0, width: 1000, height: wh + 50 },
				drawing: [backgroundShadow()],
				elements: {}
			})

			mainWindow.setInventoryNeeded(true)
			mainWindow.setCloseOnBackPressed(true)
			mainWindow.addAdjacentWindow(contentWindow)
			return mainWindow
		}
	}
	export var IronChiselGUI = new IronChisel()
	IronChiselGUI.getWindow().open()
}