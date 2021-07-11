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
