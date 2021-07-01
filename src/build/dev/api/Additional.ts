
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
namespace TextureSource {

	namespace instance {
		export function getSafe(bitmap: string): android.graphics.Bitmap {
			return RM.ReadBitmap(`${__dir__}gui/`, bitmap + '.png')
		}
	}
}
var ScriptableObjectHelper = new Scriptable()
namespace console {
	export function debug(message: any, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "] " : ""}${message}`, 'DEBUG')
	}
	export function json(message: any, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "] " : ""}${JSON.stringify(message)}`, 'JSON' + (prefix ? "-" + prefix : ""))
	}
	export function error(message: string | number, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "] " : ""}${message}`, 'ERROR')
	}
	export function exception(exception: java.lang.Throwable) {
		Logger.LogError(exception)
	}
	export function info(message: string | number, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "] " : ""}${message}`, 'INFO')
	}
	export function log(message: string | number, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "] " : ""}${message}`, 'LOG')
	}
	export function warn(message: string | number, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "] " : ""}${message}`, 'WARN')
	}
}

UI.getContext().runOnUiThread(new java.lang.Runnable({
	run: function () {
		UI.getContext().getWindow().setFlags(
			android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
			android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
		)
		// UI.getContext().getWindow().getAttributes().layoutInDisplayCutoutMode = android.view.WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
	}
}))

var Color = android.graphics.Color

namespace Search {
	export interface ResultData {
		element: any
		index: number
	}
	export interface ResultItem {
		prev: ResultData,
		current: ResultData,
		next: ResultData,
	}
	export const NullItem = {
		prev: null,
		current: null,
		next: null
	}
	export enum Direction {
		NEXT, PREV
	}
	export function findIndex(index: number, length: number): { next: number, prev: number } {
		let next: number = (index + 1) % length
		let prev: number = (index + length - 1) % length
		return { next, prev }
	}
	export function find(array: Array<any>, item: any): ResultItem {
		let len = array.length, i = array.lastIndexOf(item)
		let index = findIndex(i, len)

		if (i != -1) {
			console.info(`Current: ${item} next: ${array[index.next]}$${index.next}, prev ${array[index.prev]}$${index.prev}`, `[Additional.ts] Search.find`)
			return {
				prev: { element: array[index.prev], index: index.prev },
				current: { element: item, index: i },
				next: { element: array[index.next], index: index.next },

			}
		}

		console.error(`Cannot find index of ${item}`, `[Additional.ts] Search.find`)
		return NullItem
	}
}



namespace GameSetting {
	export var lang: string
	export enum UiMode {
		classic, pocket
	}
	export var UIMode: number

	export function getSetting(data: string) {
		return FileTools.ReadKeyValueFile("games/com.mojang/minecraftpe/options.txt")[data]
	}
	export function getLang() {
		return GameSetting.getSetting("game_language")
	}
	export function getUIMode() {
		return tryRun(OptionsModule, "getUIProfile")
		// return GameSetting.getSetting("gfx_ui_profile")
	}
	// Threading.initThread("AdditionalCallbacks", () => {
	// 	if (lang != getLang())
	// 		Callback.invokeCallback("LanguageChanged", lang = getLang())
	// 	if (UIMode != getUIMode())
	// 		Callback.invokeCallback("UIModeChanged", UIMode = getUIMode())
	// })
	// Callback.addCallback("LanguageChanged", (lang: string) => {
	// 	alert(`Language: ${lang}`)
	// })
	// Callback.addCallback("UIModeChanged", (mode: string) => {
	// 	alert(`UIMode: ${mode}`)
	// })
}
function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min
}