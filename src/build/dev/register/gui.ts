
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