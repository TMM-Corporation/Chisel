// namespace AutoChisel {
// 	class AutoChiselGUI {
// 		topPadding: number = 131
// 		slotSize: number = 73
// 		setup() {
// 			let wh = UI.getScreenHeight(),
// 				paddings = (1000 - wh) / 2,
// 				contentWindow = new UI.Window({
// 					location: { x: paddings, y: 0, width: wh, height: wh },
// 					drawing: [
// 						GUI.BG.transparent,
// 						{ type: "frame", x: 916, y: 55, width: 84, height: 96, scale: 3, bitmap: "button_frame_close", color: GUI.MCColor.DarkGray },
// 						{ type: "frame", x: 0, y: this.topPadding, width: 1000, height: 814, scale: 3, bitmap: "style:frame_background_border", color: Color.rgb(198, 198, 198) },
// 					],
// 					elements: {}
// 					// elements
// 				}),
// 				mainWindow = new UI.Window({
// 					location: { x: 0, y: 0, width: 1000, height: wh + 50 },
// 					drawing: [GUI.BG.shadow],
// 					elements: {}
// 				})

// 			contentWindow.setInventoryNeeded(true)

// 			let group = new UI.WindowGroup()
// 			group.addWindowInstance("background", mainWindow)
// 			group.addWindowInstance("content", contentWindow)
// 			group.setCloseOnBackPressed(true)
// 			group.setDebugEnabled(true)
// 		}
// 	}
// }