
SoundManager.init(16)
SoundManager.setResourcePath(__dir__ + RM.resources.dirs.sounds)

var SoundList = {
	/* DIR: sounds/chisel/*.ogg */
	"dirt1": "chisel/dirt1.ogg",
	"dirt2": "chisel/dirt2.ogg",
	"dirt3": "chisel/dirt3.ogg",
	"dirt4": "chisel/dirt4.ogg",
	"fallback": "chisel/fallback.ogg",
	"wood2": "chisel/wood2.ogg",
	"wood3": "chisel/wood3.ogg",
	"wood4": "chisel/wood4.ogg",
	"wood5": "chisel/wood5.ogg",
	"wood8": "chisel/wood8.ogg",
	"wood9": "chisel/wood9.ogg",
	"wood11": "chisel/wood11.ogg",

	/* DIR: sounds/dig/*.ogg */
	"grimstone1": "dig/grimstone1.ogg",
	"holystone1": "dig/holystone1.ogg",
	"holystone2": "dig/holystone2.ogg",
	"holystone5": "dig/holystone5.ogg",
	"metal": "dig/metal.ogg",
	"metal1": "dig/metal1.ogg",
	"metal2": "dig/metal2.ogg",
	"metal3": "dig/metal3.ogg",
	"metal7": "dig/metal7.ogg",
	"metal8": "dig/metal8.ogg",

	/* DIR: sounds/random/*.ogg */
	"squash": "random/squash.ogg",
	"squash2": "random/squash2.ogg",

	/* DIR: sounds/step/*.ogg */
	"holystone3": "step/holystone3.ogg",
	"holystone7": "step/holystone7.ogg",
	"metal4": "step/metal4.ogg",
	"metal5": "step/metal5.ogg",
	"metal6": "step/metal6.ogg",
	"metal9": "step/metal9.ogg",
	"templeblock1": "step/templeblock1.ogg",
	"templeblock2": "step/templeblock2.ogg",
	"templeblock3": "step/templeblock3.ogg",
	"templeblock4": "step/templeblock4.ogg",
	"templeblock5": "step/templeblock5.ogg",
}

for (let name in SoundList) {
	SoundManager.registerSound(name, SoundList[name])
}
