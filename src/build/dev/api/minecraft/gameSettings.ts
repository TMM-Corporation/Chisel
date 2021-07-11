namespace Options {
	export enum UIMode {
		classic, pocket
	}
	function tryRun(module, method) {
		try {
			if (module != null && module[method] != null)
				return module[method]()
		} catch (e) {
			Logger.LogError(e)
		}
		return ""
	}
	export var Module = WRAP_NATIVE("OptionsModule")
	export function Get(name: string): any {
		return tryRun(Options.Module, name)
	}
}

class Settings {
	static getFromFile(data: string) {
		return FileTools.ReadKeyValueFile("games/com.mojang/minecraftpe/options.txt")[data]
	}
	static get language() {
		return ""
	}
	static get uiProfile(): Options.UIMode {
		return Options.Get("getUIProfile")
	}
}