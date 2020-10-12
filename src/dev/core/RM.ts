/*
 * ResourceManager.js + ScriptingManager.js
 * By ToxesFoxes & TooManyMods
 *
 * Description:
 * Used for changing reading assets
*/

var sdcard = android.os.Environment.getExternalStorageDirectory()
var resources = {
	dir: {
		assets: 'resources/mod_assets/',
		items_opaque: 'resources/mod_assets/items-opaque/',
		resource_packs: 'resources/mod_assets/resource_packs/',
		structures: 'resources/mod_assets/structures/',
		terrain_atlas: 'resources/mod_assets/terrain-atlas/',
		ui: 'resources/mod_assets/ui/',
	},
	files: {
		contents: 'resources/mod_assets/contents.json',
		translations: 'resources/mod_assets/translations.json',
		cache: 'resources/mod_assets/namespaces.cache'
	}
}

interface IFileList {files: string[], dirs: string[]}
interface IBuildConfig {
	resources: [{path: string, resourceType: string}],
	defaultConfig: {
		buildType: string, api: string, libraryDir: string,
		resourcePacksDir: string, behaviorPacksDir: string
	},
	buildDirs: [{targetSource: string, dir: string}],
	compile: [{path: string, sourceType: string}]
}





var ResourceManager = {
	resources: resources,
	Select(dir: string, name?: string): java.io.File {
		let file = name ? new java.io.File(dir, name) : new java.io.File(dir)
		if (!file)
			Logger.Log('This file is not exisits at ' + dir + name, "MOD")
		return file
	},

	ReadFrom(_File: java.io.File): string {
		var readed = (new java.io.BufferedReader(new java.io.FileReader(_File)))
		var data = new java.lang.StringBuilder()
		var string: string
		while ((string = readed.readLine()) != null) {
			data.append(string)
			data.append('\n')
		}
		return data.toString()
	},

	Rewrite(_File: java.io.File, text: string): void {
		let fos = new java.io.FileOutputStream(_File)
		fos.write(new java.lang.String(text).getBytes())
	},

	CopyToDest(src: string, dst: string): boolean {
		try {
			let srcChannel = new java.io.FileInputStream(src).getChannel()
			let dstChannel = new java.io.FileOutputStream(dst).getChannel()
			dstChannel.transferFrom(srcChannel, 0, srcChannel.size())
			return true
		} catch (e) {
			throw e
		}
	},

	ReadBitmap(path: string, filename: string): android.graphics.Bitmap {
		let FIS: java.io.InputStream, BMPF: android.graphics.Bitmap, BMP: android.graphics.Bitmap

		if (typeof path != 'string')
			Logger.Log('Cannot read bitmap from path = ' + path + ' has invalid type ' + typeof path, 'RM-ReadBitmap')

		if (typeof filename != 'string')
			Logger.Log('Cannot read bitmap, filename = ' + filename + ' has invalid type ' + typeof filename, 'RM-ReadBitmap')

		try {
			FIS = new java.io.FileInputStream(ResourceManager.Select(path, filename))
			BMPF = android.graphics.BitmapFactory.decodeStream(FIS)
			BMP = android.graphics.Bitmap.createBitmap(BMPF)

			return BMP
		} catch (e) {
			Logger.LogError(e)
		}
	},

	CropBitmap(source: android.graphics.Bitmap, x: number, y: number, width: number, height: number): android.graphics.Bitmap {
		return android.graphics.Bitmap.createBitmap(source, x, y, width, height)
	},

	WriteBitmap(bitmap: android.graphics.Bitmap, path: string, filename: string): boolean {
		let dir = new java.io.File(path)
		if (!dir.exists())
			dir.mkdirs()
		Uint16Array
		try {
			let f = new java.io.File(dir, filename)
			f.createNewFile()

			//Convert bitmap to byte array
			let bos = new java.io.ByteArrayOutputStream()
			bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 0 /*ignored for PNG*/, bos)

			//write the bytes in file
			let fos = new java.io.FileOutputStream(f)
			fos.write(bos.toByteArray())
			fos.flush()
			fos.close()
			return true
		} catch (e) {
			Logger.LogError(e)
		}
	},
	getFilesList(path: string): IFileList {
		let c = {
			files: [],
			dirs: []
		}, files = ResourceManager.Select(path).listFiles()
		for (let i in files) {
			var f = files[i]
			if (f.isDirectory()) c.dirs.push(f.getName() + '')
			if (f.isFile()) c.files.push(f.getName() + '')
		}
		return c
	},
	getBuildConfig(): IBuildConfig {
		let file = ResourceManager.Select(`${__dir__}build.config`)
		return ResourceManager.ReadJSON(file)
	},
	ReadJSON(_File: java.io.File): any {
		let file = JSON.parse(ResourceManager.ReadFrom(_File))
		Logger.Log(JSON.stringify(file), 'Chisel build.config')
		return file
	},
	WriteJSON(_File: java.io.File, json: {}): void {
		ResourceManager.Rewrite(_File, JSON.stringify(json))
	},
	updateResources() {

	}
}


var ScriptingManager = {
	namespaces: {},

	RegexList: {
		reference: new RegExp(/([A-z0-9]\S{0,})(@)([A-z0-9]\S{0,})(\.)([A-z0-9]\S{0,})/),
		variable: new RegExp(/\$([A-z0-9]\S{0,})/)
	},

	readResource(path: string) {
		let readed = ResourceManager.ReadJSON(ResourceManager.Select(path))
		if (!this.namespaces[readed.namespace])
			this.namespaces[readed.namespace] = readed
		else
			("Namespace " + readed.namespace + " is exists", "MOD")
	},

	readAllResources() {
		let json = ResourceManager.ReadJSON(ResourceManager.Select(ResourceManager.resources.files.contents))
		for (let i in json.files) {
			this.readResource(ResourceManager.resources.dir.assets + json.files[i])
		}
		ResourceManager.Rewrite(ResourceManager.Select(ResourceManager.resources.files.cache), JSON.stringify(this.readPropertyRecusive(this.namespaces)))
	},

	readReference(str: string) {
		let matching = str.match(this.RegexList.reference)
		if (matching) {
			let namespace = matching[3]
			let property = matching[5]
			// Game.dialogMessage(JSON.stringify(res), "readReference")
			return this.namespaces[namespace][property]
		}
		return null
	},

	readGlobalVariable(namespace: string, property: string) {
		if (property.startsWith("$")) {
			Game.dialogMessage(JSON.stringify(this.namespaces[namespace][property]) + " : " + property, "readGlobalVariable")
			return this.namespaces[namespace][property]
		}
		return null
	},

	readProperty(property: string) {
		if (property && typeof property !== 'object' && !Array.isArray(property)) {
			let matchingRef = property.match(this.RegexList.reference)
			if (property.startsWith("$")) {
				return this.readGlobalVariable("_global", property) // TODO: Fix global var reading
			} else if (matchingRef)
				return this.readReference(property)
		} else if (typeof property === 'object') {
			return this.readPropertyRecusive(property)
		}
		return property
	},

	readPropertyRecusive(arr1: string) {
		var arr = eval(arr1)
		for (var i in arr) {
			try {
				var code = arr[i]
				if (typeof code === "object") {
					code = this.readPropertyRecusive(code)
				} else if (typeof code === 'string')
					code = this.readProperty(code)
			} catch (e) {
				// Logger.Log(i, "undefined")
			}
		}
		return arr
	},

	// doWith(data, func) {
	// 	if (!Array.isArray(data) && typeof data === 'object') {
	// 		if (data.length > 0) {

	// 		}
	// 	} else
	// 		data = this.readProperty(data);
	// 	if (data)
	// 		func(data);
	// },

}
var RM = ResourceManager
var SM = ScriptingManager

