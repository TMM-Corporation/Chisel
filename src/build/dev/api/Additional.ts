
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
	export function debug(message: string, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "]" : ""} ${message}`, 'DEBUG')
	}
	export function error(message: string, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "]" : ""} ${message}`, 'ERROR')
	}
	export function exception(exception: java.lang.Throwable) {
		Logger.LogError(exception)
	}
	export function info(message: string, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "]" : ""} ${message}`, 'INFO')
	}
	export function log(message: string, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "]" : ""} ${message}`, 'LOG')
	}
	export function warn(message: string, prefix?: string) {
		Logger.Log(`${prefix ? "[" + prefix + "]" : ""} ${message}`, 'WARN')
	}
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

var Color = android.graphics.Color

namespace Search {
	export enum Direction {
		NEXT, PREV
	}
	export function find(array: Array<any>, item: any, direction: Direction): any {
		let len = array.length, i = array.lastIndexOf(item)
		if (i != -1) {
			console.info(`Direction: ${direction}, Current: ${item} next: ${array[(i + 1) % len]}, prev ${array[(i + len - 1) % len]}`, `[Additional.ts] Search.find`)
			if (direction == Direction.NEXT)
				return array[(i + 1) % len]
			if (direction == Direction.PREV)
				return array[(i + len - 1) % len]
		} else
			console.error(`Cannot find index of ${item}`, `[Additional.ts] Search.find`)

		return null
	}
}
