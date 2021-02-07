
BW.addCTMType({
	width: 32, height: 32, textureSize: 16,
	textureSlicesH: 2, textureSlicesV: 2, cols: 2, rows: 2, name: 'ctm'
})
BW.addCTMType({
	width: 32, height: 32, textureSize: 16,
	textureSlicesH: 2, textureSlicesV: 2, cols: 2, rows: 8, name: 'ctm_anim', animFrames: 4
})
BW.addCTMType({
	width: 32, height: 32, textureSize: 16,
	textureSlicesH: 2, textureSlicesV: 2, cols: 2, rows: 2, name: 'ctmh'
})
BW.addCTMType({
	width: 32, height: 32, textureSize: 16,
	textureSlicesH: 2, textureSlicesV: 2, cols: 2, rows: 2, name: 'ctmv'
})
BW.addCTMType({
	width: 48, height: 48, textureSize: 16,
	textureSlicesH: 3, textureSlicesV: 3, cols: 3, rows: 3, name: 'bricks-chaotic'
})
BW.addCTMType({
	width: 64, height: 64, textureSize: 16,
	textureSlicesH: 4, textureSlicesV: 4, cols: 4, rows: 4, name: 'cuts'
})
BW.addCTMType({
	width: 64, height: 64, textureSize: 16,
	textureSlicesH: 4, textureSlicesV: 4, cols: 4, rows: 4, name: 'proto-v4-ctm'
})

// print(`${__dir__}${resources.dir.assets}data.json`)
let data = RM.ReadJSON(RM.Select(`${__dir__}${resources.dir.assets}data.json`))

for (let name in data.textures) {
	let values = data.textures[name]
	for (let textureName in values) {
		let type = values[textureName]
		BW.genTexture(RM, {
			srcPath: `${__dir__}${resources.dir.chisel}textures/blocks/${name}/`,
			srcName: textureName,
			destPath: `${__dir__}${resources.dir.terrain_atlas}${name}/`,
			destName: `chisel_${name}_${textureName}`,
			type: type
		})
	}
}