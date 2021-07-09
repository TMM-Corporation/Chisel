ItemModel.setCurrentCacheGroup("Chisel", "1.0")
IMPORT("SoundLib")
// IMPORT("VanillaSlots")


var OptionsModule = WRAP_NATIVE("OptionsModule")
function tryRun(module, method) {
	try {
		if (module != null && module[method] != null)
			return module[method]()
	} catch (e) {
		Logger.LogError(e)
	}
	return ""
}
function msg(msg, value) {
	Game.message(msg + ": " + value)
}
// Callback.addCallback("ItemUse", function () {
// 	msg("Ui Profile", tryRun(OptionsModule, "getUIProfile"))
// })