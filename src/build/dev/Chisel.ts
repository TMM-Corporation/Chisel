// class Chisel {
// 	// Carvable: ICarvable = new Carvable()
// 	constructor() {

// 	}
// }

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
			}
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

let itemGui = new WindowShell.Standart(WindowShell.GUIStyle.classic)
itemGui.open()
new ChiselItem.Custom({
	gui: itemGui,
	item: {
		name: "item_chisel_iron_name",
		namedId: "chisel_iron",
		description: ["item.chisel"],
		texture: {
			name: "chisel_iron"
		},
		durability: 512
	}
})
new ChiselItem.Custom({
	gui: itemGui,
	item: {
		name: "item_chisel_diamond_name",
		namedId: "chisel_diamond",
		texture: {
			name: "chisel_diamond"
		},
		durability: 5056
	}
})
new ChiselItem.Custom({
	gui: itemGui,
	item: {
		name: "item_chisel_hitech_name",
		namedId: "chisel_hitech",
		texture: {
			name: "chisel_hitech"
		},
		durability: 10048
	}
})

// Carvable.addTile(OpenTile('chisel_ancient_stone'))
// Carvable.addTile(OpenTile('chisel_andesite'))
// Carvable.addTile(OpenTile('chisel_animations'))
// Carvable.addTile(OpenTile('chisel_antiblock'))
// Carvable.addTile(OpenTile('chisel_arcane_stone'))
// Carvable.addTile(OpenTile('chisel_autochisel'))
// Carvable.addTile(OpenTile('chisel_basalt'))
// Carvable.addTile(OpenTile('chisel_basalt_extra'))
// Carvable.addTile(OpenTile('chisel_blood_magic'))
// Carvable.addTile(OpenTile('chisel_blood_magic_diagonal'))
// Carvable.addTile(OpenTile('chisel_bookshelf'))
// Carvable.addTile(OpenTile('chisel_bricks'))
// Carvable.addTile(OpenTile('chisel_certus'))
// Carvable.addTile(OpenTile('chisel_cloud'))
// Carvable.addTile(OpenTile('chisel_coal_charcoal'))
// Carvable.addTile(OpenTile('chisel_coal_coal'))
// Carvable.addTile(OpenTile('chisel_coal_coalcoke'))
// Carvable.addTile(OpenTile('chisel_cobblestone'))
// Carvable.addTile(OpenTile('chisel_cobblestone_extra'))
// Carvable.addTile(OpenTile('chisel_cobblestonemossy'))
// Carvable.addTile(OpenTile('chisel_concrete'))
// Carvable.addTile(OpenTile('chisel_concrete_black'))
// Carvable.addTile(OpenTile('chisel_concrete_blue'))
// Carvable.addTile(OpenTile('chisel_concrete_brown'))
// Carvable.addTile(OpenTile('chisel_concrete_cyan'))
// Carvable.addTile(OpenTile('chisel_concrete_gray'))
// Carvable.addTile(OpenTile('chisel_concrete_green'))
// Carvable.addTile(OpenTile('chisel_concrete_lightblue'))
// Carvable.addTile(OpenTile('chisel_concrete_lightgray'))
// Carvable.addTile(OpenTile('chisel_concrete_lime'))
// Carvable.addTile(OpenTile('chisel_concrete_magenta'))
// Carvable.addTile(OpenTile('chisel_concrete_orange'))
// Carvable.addTile(OpenTile('chisel_concrete_pink'))
// Carvable.addTile(OpenTile('chisel_concrete_powder'))
// Carvable.addTile(OpenTile('chisel_concrete_purple'))
// Carvable.addTile(OpenTile('chisel_concrete_red'))
// Carvable.addTile(OpenTile('chisel_concrete_white'))
// Carvable.addTile(OpenTile('chisel_concrete_yellow'))
// Carvable.addTile(OpenTile('chisel_diamond'))
// Carvable.addTile(OpenTile('chisel_diorite'))
// Carvable.addTile(OpenTile('chisel_dirt'))
// Carvable.addTile(OpenTile('chisel_emerald'))
// Carvable.addTile(OpenTile('chisel_endstone'))
// Carvable.addTile(OpenTile('chisel_factory'))
// Carvable.addTile(OpenTile('chisel_fluid'))
// Carvable.addTile(OpenTile('chisel_futura'))
// Carvable.addTile(OpenTile('chisel_glass'))
// Carvable.addTile(OpenTile('chisel_glass_stained_black'))
// Carvable.addTile(OpenTile('chisel_glass_stained_blue'))
// Carvable.addTile(OpenTile('chisel_glass_stained_brown'))
// Carvable.addTile(OpenTile('chisel_glass_stained_cyan'))
// Carvable.addTile(OpenTile('chisel_glass_stained_gray'))
// Carvable.addTile(OpenTile('chisel_glass_stained_green'))
// Carvable.addTile(OpenTile('chisel_glass_stained_lightblue'))
// Carvable.addTile(OpenTile('chisel_glass_stained_lime'))
// Carvable.addTile(OpenTile('chisel_glass_stained_magenta'))
// Carvable.addTile(OpenTile('chisel_glass_stained_orange'))
// Carvable.addTile(OpenTile('chisel_glass_stained_pink'))
// Carvable.addTile(OpenTile('chisel_glass_stained_purple'))
// Carvable.addTile(OpenTile('chisel_glass_stained_red'))
// Carvable.addTile(OpenTile('chisel_glass_stained_silver'))
// Carvable.addTile(OpenTile('chisel_glass_stained_white'))
// Carvable.addTile(OpenTile('chisel_glass_stained_yellow'))
// Carvable.addTile(OpenTile('chisel_glassdyed'))
// Carvable.addTile(OpenTile('chisel_glasspanedyed'))
// Carvable.addTile(OpenTile('chisel_glowstone'))
// Carvable.addTile(OpenTile('chisel_glowstone_extra'))
// Carvable.addTile(OpenTile('chisel_gold'))
// Carvable.addTile(OpenTile('chisel_granite'))
// Carvable.addTile(OpenTile('chisel_hardenedclay'))
// Carvable.addTile(OpenTile('chisel_hexplating'))
// Carvable.addTile(OpenTile('chisel_ice'))
// Carvable.addTile(OpenTile('chisel_icepillar'))
// Carvable.addTile(OpenTile('chisel_iron'))
// Carvable.addTile(OpenTile('chisel_ironpane'))
// Carvable.addTile(OpenTile('chisel_laboratory'))
// Carvable.addTile(OpenTile('chisel_lapis'))
// Carvable.addTile(OpenTile('chisel_limestone'))
// Carvable.addTile(OpenTile('chisel_limestone_extra'))
// Carvable.addTile(OpenTile('chisel_magma'))
// Carvable.addTile(OpenTile('chisel_marble'))
// Carvable.addTile(OpenTile('chisel_marble_extra'))
// Carvable.addTile(OpenTile('chisel_marblepillar'))
// Carvable.addTile(OpenTile('chisel_marblepillarold'))
// Carvable.addTile(OpenTile('chisel_marblepillarslab'))
// Carvable.addTile(OpenTile('chisel_marblepillarslabold'))
// Carvable.addTile(OpenTile('chisel_marbleslab'))
// Carvable.addTile(OpenTile('chisel_metals_aluminum'))
// Carvable.addTile(OpenTile('chisel_metals_bronze'))
// Carvable.addTile(OpenTile('chisel_metals_cobalt'))
// Carvable.addTile(OpenTile('chisel_metals_copper'))
// Carvable.addTile(OpenTile('chisel_metals_electrum'))
// Carvable.addTile(OpenTile('chisel_metals_gold'))
// Carvable.addTile(OpenTile('chisel_metals_invar'))
// Carvable.addTile(OpenTile('chisel_metals_iron'))
// Carvable.addTile(OpenTile('chisel_metals_lead'))
// Carvable.addTile(OpenTile('chisel_metals_nickel'))
// Carvable.addTile(OpenTile('chisel_metals_platinum'))
// Carvable.addTile(OpenTile('chisel_metals_silver'))
// Carvable.addTile(OpenTile('chisel_metals_steel'))
// Carvable.addTile(OpenTile('chisel_metals_tin'))
// Carvable.addTile(OpenTile('chisel_metals_uranium'))
// Carvable.addTile(OpenTile('chisel_mipmaps_antiblock'))
// Carvable.addTile(OpenTile('chisel_mipmaps_blocks_antiblock'))
// Carvable.addTile(OpenTile('chisel_netherbrick'))
// Carvable.addTile(OpenTile('chisel_netherrack'))
// Carvable.addTile(OpenTile('chisel_obsidian'))
// Carvable.addTile(OpenTile('chisel_paper'))
// Carvable.addTile(OpenTile('chisel_planks_acacia'))
// Carvable.addTile(OpenTile('chisel_planks_birch'))
// Carvable.addTile(OpenTile('chisel_planks_dark_oak'))
// Carvable.addTile(OpenTile('chisel_planks_jungle'))
// Carvable.addTile(OpenTile('chisel_planks_oak'))
// Carvable.addTile(OpenTile('chisel_planks_spruce'))
// Carvable.addTile(OpenTile('chisel_prismarineanim'))
// Carvable.addTile(OpenTile('chisel_purpur'))
// Carvable.addTile(OpenTile('chisel_quartz'))
// Carvable.addTile(OpenTile('chisel_redstone'))
// Carvable.addTile(OpenTile('chisel_redstonelamp'))
// Carvable.addTile(OpenTile('chisel_redstoneold'))
// Carvable.addTile(OpenTile('chisel_sandstone_scribbles'))
// Carvable.addTile(OpenTile('chisel_sandstonered'))
// Carvable.addTile(OpenTile('chisel_sandstonered_extras'))
// Carvable.addTile(OpenTile('chisel_sandstonered_scribbles'))
// Carvable.addTile(OpenTile('chisel_sandstoneyellow'))
// Carvable.addTile(OpenTile('chisel_sandstoneyellow_extra'))
// Carvable.addTile(OpenTile('chisel_stone'))
// Carvable.addTile(OpenTile('chisel_stone_extra'))
// Carvable.addTile(OpenTile('chisel_technical'))
// Carvable.addTile(OpenTile('chisel_technical_new'))
// Carvable.addTile(OpenTile('chisel_technical_new_test'))
// Carvable.addTile(OpenTile('chisel_technical_scaffold'))
// Carvable.addTile(OpenTile('chisel_temple'))
// Carvable.addTile(OpenTile('chisel_templemossy'))
// Carvable.addTile(OpenTile('chisel_tyrian'))
// Carvable.addTile(OpenTile('chisel_valentines'))
// Carvable.addTile(OpenTile('chisel_voidstone'))
// Carvable.addTile(OpenTile('chisel_voidstone_animated'))
// Carvable.addTile(OpenTile('chisel_voidstone_runes'))
// Carvable.addTile(OpenTile('chisel_wool_legacy'))
// Carvable.addTile(OpenTile('chisel_wool_llama'))






