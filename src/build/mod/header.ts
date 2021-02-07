IMPORT("ConnectedTexture")

const Color = android.graphics.Color
var assets = __dir__ + 'resources/'
var resources = {
	root: __dir__,
	dir: {
		/**
		 * @returns mod assets path, ends with /
		 */
		assets: "resources/ic_mod/",
		/**
		 * @returns behavior packs path, ends with /
		 */
		behavior_packs: "minecraft_packs/behavior/",
		/**
		 * @returns java chisel resources path, ends with /
		 */
		chisel: "resources/chisel/",
		/**
		 * @returns java chisel guide path, ends with /
		 */
		chisel_guide: "resources/chisel_guide/",
		/**
		 * @returns item textures path, ends with /
		 */
		items_opaque: "resources/ic_mod/items-opaque/",
		/**
		 * @returns resource packs path, ends with /
		 */
		resource_packs: "minecraft_packs/resource/",
		/**
		 * @returns sounds path, ends with /
		 */
		sound: "resources/ic_mod/sounds/",
		/**
		 * @returns structures path, ends with /
		 */
		structures: "resources/ic_mod/structures/",
		/**
		 * @returns block textures path, ends with /
		 */
		terrain_atlas: "resources/ic_mod/terrain-atlas/",
		/**
		 * @returns ui textures path, ends with /
		 */
		ui: "resources/ic_mod/ui/"
	},
	files: {
		data: 'resources/ic_mod/data.json',
		translations: 'resources/ic_mod/translations.json'
	}
}

var RM = new ResourceManager()
RM.resources = resources

ItemModel.setCurrentCacheGroup("chisel", "1.0")



class ScriptableObject {
	private obj: any
	constructor() {
		this.obj = {}
	}
	getThis() {
		return this.obj
	}
	put(key: string, object: Object, value: any) {
		object[key] = value
	}
}
var Integer = {
	valueOf(value: number): number {
		return parseInt(`${value}`)
	}
}
var Float = {
	valueOf(value: number): number {
		return parseFloat(`${value}`)
	}
}
var Double = {
	valueOf(value: number): number {
		return Float.valueOf(value)
	}
}
var ImageUtil = {
	LARGE_PHONE: 640,
	LARGE_TABLET: 800,
	MEDIUM_PHONE: 300,
	MEDIUM_TABLET: 424,
	SMALL: 200,
	TINY: 100
}

class Scriptable {
	createEmpty() {
		return new ScriptableObject()
	}
	getProperty(obj: Object, value: string, ifFalse: any, log?: string): any {
		try {
			return obj[value] || ifFalse
		} catch (e) {
			Logger.Log(JSON.stringify(`${obj}; ${value}; ${ifFalse}.`), log)
			Logger.LogError(e)
		}
		return ifFalse
	}
	getBooleanProperty(obj: Object, value: string, ifFalse: any): any {
		this.getProperty(obj, value, ifFalse, "Boolean")
	}
	getStringProperty(obj: Object, value: string, ifFalse: any): any {
		this.getProperty(obj, value, ifFalse, "String")
	}
	getIntProperty(obj: Object, value: string, ifFalse: any): any {
		this.getProperty(obj, value, ifFalse, "Int")
	}
	getScriptableObjectProperty(obj: Object, value: string, ifFalse: any): any {
		this.getProperty(obj, value, ifFalse, "ScriptableObject")
	}
	getFloatProperty(obj: Object, value: string, ifFalse: any): any {
		this.getProperty(obj, value, ifFalse, "Float")
	}
}
var TextureSource = {
	instance: {
		getSafe(bitmap: string): android.graphics.Bitmap {
			return RM.ReadBitmap(resources.dir.ui, bitmap + '.png')
		}
	}
}
var ScriptableObjectHelper = new Scriptable()
var console = {
	debug(message: string, prefix?: string) {
		Logger.Log(`${message}`, prefix || 'DEBUG')
	},
	error(exception: java.lang.Throwable) {
		Logger.LogError(exception)
	},
	info(message: string, prefix?: string) {
		Logger.Log(`${message}`, prefix || 'INFO')
	},
	log(message: string, prefix?: string) {
		Logger.Log(`${message}`, prefix || 'LOG')
	},
	warn(message: string, prefix?: string) {
		Logger.Log(`${message}`, prefix || 'WARN')
	},
}


var ctx = UI.getContext()
ctx.runOnUiThread(new java.lang.Runnable({
	run: function () {
		ctx.getWindow().setFlags(
			android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
			android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
		)
	}
}))