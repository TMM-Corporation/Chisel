
new ChiselItem.Custom({
	// gui: itemGui,
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
	// gui: itemGui,
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
	// gui: itemGui,
	item: {
		name: "item_chisel_hitech_name",
		namedId: "chisel_hitech",
		texture: {
			name: "chisel_hitech"
		},
		durability: 10048
	}
})


Item.setProperties("chisel_iron", JSON.stringify({
	"minecraft:explodable": false
}))
Item.setProperties("chisel_diamond", JSON.stringify({
	"minecraft:explodable": false
}))
Item.setProperties("chisel_hitech", JSON.stringify({
	"minecraft:explodable": false
}))