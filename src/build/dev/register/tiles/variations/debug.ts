let debugGroup = new Carvable.Group("debug", "Debug group")
debugGroup.addFromDescription({
	"name": "dbg_mode_horizontal",
	"localization": ["tile_chisel_dbg_horizontal_name"],
	"variations": [
		{
			"localization": ["tile_chisel_dbg_horizontal_left_desc"],
			"texture": {
				"name": "chisel_dbg_horizontal_left_top",
				"extension": "png",
				"type": "normal",
				"ctm": {
					"name": "chisel_dbg_horizontal_left_ctm",
					"extension": "png",
					"type": "ctmh"
				}
			}
		},
		{
			"localization": ["tile_chisel_dbg_horizontal_right_desc"],
			"texture": {
				"name": "chisel_dbg_horizontal_right_top",
				"extension": "png",
				"type": "normal",
				"ctm": {
					"name": "chisel_dbg_horizontal_right_ctm",
					"extension": "png",
					"type": "ctmh"
				}
			}
		}
	]
})
let stoneGroup = new Carvable.Group("stone_group", "Stone Group")
stoneGroup.addFromDescription({
	name: "stone",
	variations: [
		{
			block: {
				id: 1, data: 0
			},
		},
		{
			block: {
				id: 98, data: 0
			}
		},
		{
			block: {
				id: 98, data: 1
			}
		},
		{
			block: {
				id: 98, data: 2
			}
		},
		{
			block: {
				id: 98, data: 3
			}
		}
	]
})