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
		assets: __dir__ + 'assets/',
		items_opaque: __dir__ + 'assets/items-opaque/',
		resource_packs: __dir__ + 'assets/resource_packs/',
		structures: __dir__ + 'assets/structures/',
		terrain_atlas: __dir__ + 'assets/terrain-atlas/',
		ui: __dir__ + 'assets/ui/',
	},
	files: {
		contents: __dir__ + 'assets/contents.json',
		translations: __dir__ + 'assets/translations.json',
		cache: __dir__ + 'assets/namespaces.cache'
	}
}

var ResourceManager = function () { }

ResourceManager.resources = resources

ResourceManager.Select = function (dir, name) {
	let file = name ? new java.io.File(dir, name) : new java.io.File(dir)
	if (!file)
		Logger.Log('This file is not exisits at ' + dir + name, "MOD")
	return file
}

ResourceManager.ReadFrom = function (_File) {
	var readed = (new java.io.BufferedReader(new java.io.FileReader(_File)))
	var data = new java.lang.StringBuilder()
	var string
	while ((string = readed.readLine()) != null) {
		data.append(string)
		data.append('\n')
	}
	return data.toString()
}

ResourceManager.Rewrite = function (_File, text) {
	let fos = new java.io.FileOutputStream(_File)
	fos.write(new java.lang.String(text).getBytes())
}

ResourceManager.CopyToDest = function (src, dst) {
	try {
		let srcChannel = new java.io.FileInputStream(src).getChannel()
		let dstChannel = new java.io.FileOutputStream(dst).getChannel()
		dstChannel.transferFrom(srcChannel, 0, srcChannel.size())
		return true
	} catch (e) {
		throw e
	} finally {
		return false
	}
}

ResourceManager.ReadBitmap = function (path, filename) {
	let FIS, BMP
	if (typeof path !== 'string')
		throw 'Cannot read bitmap from path = ' + path + ' has invalid type ' + typeof path

	if (typeof filename !== 'string')
		throw 'Cannot read bitmap, filename = ' + filename + ' has invalid type ' + typeof filename

	try {
		FIS = new java.io.FileInputStream(ResourceManager.Select(path, filename))
		BMP = new android.graphics.BitmapFactory.decodeStream(FIS)
		return BMP
	} catch (e) {
		throw e
	} finally {
		return null
	}
}

ResourceManager.CropBitmap = function (source, x, y, width, height) {
	return new android.graphics.Bitmap.createBitmap(source, x, y, width, height)
}

ResourceManager.WriteBitmap = function (bitmap, path, filename) {
	let dir = new java.io.File(path)
	if (!dir.exists())
		dir.mkdirs()
	
	try {
		let file = new java.io.File(dir, filename + '.png')
		let FOS = new java.io.FileOutputStream(file)

		bitmap.compress(new android.graphics.Bitmap.CompressFormat.PNG, 100, FOS)

		FOS.flush()
		FOS.close()
		return true
	} catch (e) {
		throw e
	} finally {
		return false
	}
}


ResourceManager.getFilesList = function (path) {
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
}

ResourceManager.ReadJSON = function (_File) {
	let file = ""
	eval('file=' + ResourceManager.ReadFrom(_File))
	return file || {}
}

ResourceManager.WriteJSON = function (_File, json) {
	ResourceManager.Rewrite(_File, JSON.stringify(json))
}


var ScriptingManager = {}

ScriptingManager.namespaces = {}

ScriptingManager.RegexList = {
	reference: new RegExp(/([A-z0-9]\S{0,})(@)([A-z0-9]\S{0,})(\.)([A-z0-9]\S{0,})/),
	variable: new RegExp(/\$([A-z0-9]\S{0,})/)
}

ScriptingManager.readResource = function (path) {
	let readed = ResourceManager.ReadJSON(ResourceManager.Select(path))
	if (!ScriptingManager.namespaces[readed.namespace])
		ScriptingManager.namespaces[readed.namespace] = readed
	else
		("Namespace " + readed.namespace + " is exists", "MOD")
}

ScriptingManager.readAllResources = function () {
	let json = ResourceManager.ReadJSON(ResourceManager.Select(ResourceManager.resources.files.contents))
	for (let i in json.files) {
		ScriptingManager.readResource(ResourceManager.resources.dir.assets + json.files[i])
	}
	ResourceManager.Rewrite(ResourceManager.Select(ResourceManager.resources.files.cache), JSON.stringify(ScriptingManager.readPropertyRecusive(ScriptingManager.namespaces)))
}

ScriptingManager.readReference = function (_String) {
	let matching = _String.match(ScriptingManager.RegexList.reference)
	if (matching) {
		let namespace = matching[3]
		let property = matching[5]
		// Game.dialogMessage(JSON.stringify(res), "ScriptingManager.readReference")
		return ScriptingManager.namespaces[namespace][property]
	}
	return null
}

ScriptingManager.readGlobalVariable = function (namespace, property) {
	if (property.startsWith("$")) {
		Game.dialogMessage(JSON.stringify(ScriptingManager.namespaces[namespace][property]) + " : " + property, "ScriptingManager.readGlobalVariable")
		return ScriptingManager.namespaces[namespace][property]
	}
	return null
}

ScriptingManager.readProperty = function (property) {
	if (property && typeof property !== 'object' && !Array.isArray(property)) {
		let matchingRef = property.match(ScriptingManager.RegexList.reference)
		if (property.startsWith("$")) {
			return ScriptingManager.readGlobalVariable("_global", property) // TODO: Fix global var reading
		} else if (matchingRef)
			return ScriptingManager.readReference(property)
	} else if (typeof property === 'object') {
		return ScriptingManager.readPropertyRecusive(property)
	}
	return property
}

ScriptingManager.readPropertyRecusive = function (arr1) {
	var arr = eval(arr1)
	for (var i in arr) {
		try {
			var code = arr[i]
			if (typeof code === "object") {
				code = ScriptingManager.readPropertyRecusive(code)
			} else if (typeof code === 'string')
				code = ScriptingManager.readProperty(code)
		} catch (e) {
			// Logger.Log(i, "undefined")
		}
	}
	return arr
}

ScriptingManager.doWith = function (data, func) {
	if (!Array.isArray(data) && typeof data === 'object') {
		if (data.length > 0) {

		}
	} else
		data = ScriptingManager.readProperty(data)
	if (data)
		func(data)
}

