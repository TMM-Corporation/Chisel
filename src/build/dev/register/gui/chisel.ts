

// new ChiselGUI.ModeButton.Single(35, this.topPadding + 270).addTo(elements)
// new ChiselGUI.ModeButton.Panel(135, this.topPadding + 270).addTo(elements)
// new ChiselGUI.ModeButton.Column(35, this.topPadding + 370).addTo(elements)
// new ChiselGUI.ModeButton.Row(135, this.topPadding + 370).addTo(elements)
// class DiamondChisel extends ChiselGUI.Base {
// 	constructor() {
// 		super(new ChiselGUI.Header("Diamond Chisel", "chisel_diamond.ui"))
// 		this.setUpVariationSlots(10, 6, 60)
// 		this.group = this.createGUI(this.getElements())
// 	}
// 	getElements(): UI.ElementSet {
// 		let elements: UI.ElementSet = {
// 			textTitle: { type: 'text', x: 132, y: this.topPadding + 225, font: GUI.Font.Center(GUI.MCColor.DarkGray, 20), text: this.header.title },
// 			slotPreview: { type: "slot", x: 25, y: this.topPadding + 25, bitmap: "chisel2gui_1", size: 202 },
// 		}


// 		new GUI.Grid.Element({
// 			name: this.variationSlots.name,
// 			horizontal: { count: this.variationSlots.x, offset: 0 },
// 			vertical: { count: this.variationSlots.y, offset: 0 },
// 			startIndex: 0,
// 			element: { type: 'slot', x: 245, y: this.topPadding + 25, size: this.slotSize, visual: true, isDarkenAtZero: true }
// 		}, elements)
// 		new GUI.Grid.Element({
// 			name: "slotInventory",
// 			horizontal: { count: 9, offset: 0 },
// 			vertical: { count: 3, offset: 0 },
// 			startIndex: 9,
// 			element: { type: 'invSlot', x: 250 + (this.slotSize / 2), y: this.topPadding + 400 + (this.slotSize), size: this.slotSize }
// 		}, elements)
// 		new GUI.Grid.Element({
// 			name: "slotInventory",
// 			horizontal: { count: 9, offset: 0 },
// 			vertical: { count: 1, offset: 0 },
// 			startIndex: 0,
// 			element: { type: 'invSlot', x: 250 + (this.slotSize / 2), y: this.topPadding + 415 + (this.slotSize * 4), size: this.slotSize }
// 		}, elements)
// 		return elements
// 	}
// }
// this.setUpVariationSlots(9, 6, 54)
// chiselButton: { type: 'button', x: 25, y: this.topPadding + 346, scale: 5, bitmap: "chisel_button_up", bitmap2: "chisel_button_down" },
// modeButton: { type: 'button', x: 25, y: this.topPadding + 436, scale: 5, bitmap: "chisel_button_up", bitmap2: "chisel_button_down" },

// new ChiselGUI.ModeButton.Single(25, this.topPadding + 524).addTo(elements)
// new ChiselGUI.ModeButton.Panel(125, this.topPadding + 524).addTo(elements)
// new ChiselGUI.ModeButton.Column(225, this.topPadding + 524).addTo(elements)

// new ChiselGUI.ModeButton.Row(25, this.topPadding + 624).addTo(elements)
// new ChiselGUI.ModeButton.Contiguous(125, this.topPadding + 624).addTo(elements)
// new ChiselGUI.ModeButton.Contiguous_2D(225, this.topPadding + 624).addTo(elements)
// class HiTechChisel extends ChiselGUI.Base {
// 	constructor() {
// 		super(new ChiselGUI.Header("HiTech Chisel", "chisel_hitech.ui"))
// 		this.group = this.createGUI(this.getElements())
// 	}
// 	getElements(): UI.ElementSet {
// 		let elements: UI.ElementSet = {
// 			textTitle: { type: 'text', x: 166, y: this.topPadding + 305, font: GUI.Font.Center(GUI.MCColor.DarkGray, 20), text: this.header.title },
// 			slotPreview: { type: "slot", x: 25, y: this.topPadding + 25, bitmap: "chiselguihitech_0", size: 280 },
// 		}



// 		new GUI.Grid.Element({
// 			name: this.variationSlots.name,
// 			horizontal: { count: this.variationSlots.x, offset: 0 },
// 			vertical: { count: this.variationSlots.y, offset: 0 },
// 			startIndex: 0,
// 			element: { type: 'slot', x: 318, y: this.topPadding + 25, size: this.slotSize, visual: true, isDarkenAtZero: true }
// 		}, elements)
// 		new GUI.Grid.Element({
// 			name: "slotInventory",
// 			horizontal: { count: 9, offset: 0 },
// 			vertical: { count: 3, offset: 0 },
// 			startIndex: 9,
// 			element: { type: 'invSlot', x: 318, y: this.topPadding + 482, size: this.slotSize }
// 		}, elements)
// 		new GUI.Grid.Element({
// 			name: "slotInventory",
// 			horizontal: { count: 9, offset: 0 },
// 			vertical: { count: 1, offset: 0 },
// 			startIndex: 0,
// 			element: { type: 'invSlot', x: 318, y: this.topPadding + 716, size: this.slotSize }
// 		}, elements)
// 		return elements
// 	}
// }
