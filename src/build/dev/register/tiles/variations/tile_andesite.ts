let chisel_andesite = TileVariation.Import('chisel_andesite')
TileVariation.insertBefore(chisel_andesite, [
	{ block: { id: 1, data: 5 } },
	{ block: { id: 1, data: 6 } }
])
TileVariation.Create("chisel_andesite", "Andesite", chisel_andesite)