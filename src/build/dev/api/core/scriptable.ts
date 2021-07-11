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