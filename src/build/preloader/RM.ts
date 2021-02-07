/*
 * ResourceManager.js + ScriptingManager.js
 * By ToxesFoxes & TooManyMods
 *
 * Description:
 * Used for changing reading assets
*/

type obj = {[key: string]: any}
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



class ResourceManager {
	private preloaderModule: boolean = false
	private res: obj
	/**
	 * Set is preloader mode
	 */
	set isPreloader(value: boolean) {
		this.preloaderModule = value
	}
	/**
	 * Returns is preloader mode
	 */
	get isPreloader() {
		return this.preloaderModule
	}
	/**
	 * Set resource for work
	 */
	set resources(value: obj) {
		this.res = value
	}
	/**
	 * Returns resources path
	 */
	get resources(): obj {
		return this.res
	}
	/**
	 * 
	 * @param dir full path with / at the end
	 * @param name file name with extension
	 * @returns File of dir+name
	 */
	Select(dir: string, name?: string): java.io.File {
		let file = name ? new java.io.File(dir, name) : new java.io.File(dir)
		// if (!file.exists())
			// log(`This file is not exisits at ${dir}${(name || "")}`)
		return file
	}
	/**
	 * Read text from file
	 * @param _File java.io.File
	 * @returns string of readed file
	 */
	ReadFrom(_File: java.io.File): string {
		var readed = (new java.io.BufferedReader(new java.io.FileReader(_File)))
		var data = new java.lang.StringBuilder()
		var string: string
		while ((string = readed.readLine()) != null) {
			data.append(string)
			data.append('\n')
		}
		return data.toString()
	}
	/**
	 * Full file rewrite
	 * @param _File java.io.File
	 * @param text string to write into file
	 */
	Rewrite(_File: java.io.File, text: string): void {
		let fos = new java.io.FileOutputStream(_File)
		fos.write(new java.lang.String(text).getBytes())
	}
	/**
	 * Copy file from source to dest
	 * @param src source path to file
	 * @param dst destination path for file
	 */
	CopyToDest(src: string, dst: string): boolean {
		try {
			let srcChannel = new java.io.FileInputStream(src).getChannel()
			let dstChannel = new java.io.FileOutputStream(dst).getChannel()
			dstChannel.transferFrom(srcChannel, 0, srcChannel.size())
			return true
		} catch (e) {
			throw e
		}
	}
	/**
	 * Read image file to android Bitmap
	 * @param path full path to file
	 * @param filename file name with extension
	 */
	ReadBitmap(path: string, filename: string): android.graphics.Bitmap {
		let FIS: java.io.InputStream, BMPF: android.graphics.Bitmap, BMP: android.graphics.Bitmap

		// if (typeof path != 'string')
			// log('Cannot read bitmap from path = ' + path + ' has invalid type ' + typeof path) // 'RM-ReadBitmap'

		// if (typeof filename != 'string')
			// log('Cannot read bitmap, filename = ' + filename + ' has invalid type ' + typeof filename) // 'RM-ReadBitmap'

		try {
			FIS = new java.io.FileInputStream(this.Select(path, filename))
			BMPF = android.graphics.BitmapFactory.decodeStream(FIS)
			BMP = android.graphics.Bitmap.createBitmap(BMPF)

			return BMP
		} catch (e) {
			// log(e)
		}
	}
	/**
	 * Crops bitmap to specified square
	 * @param source any android Bitmap
	 * @param x position from start position on x axis
	 * @param y position from start position on y axis
	 * @param width position to end of Bitmap
	 * @param height position to end of Bitmap
	 */
	CropBitmap(source: android.graphics.Bitmap, x: number, y: number, width: number, height: number): android.graphics.Bitmap {
		return android.graphics.Bitmap.createBitmap(source, x, y, width, height)
	}
	/**
	 * 
	 * @param bitmap android Bitmap
	 * @param path writes bitmap to specified path
	 * @param filename file name with extension
	 */
	WriteBitmap(bitmap: android.graphics.Bitmap, path: string, filename: string): boolean {
		let dir = new java.io.File(path)
		if (!dir.exists())
			dir.mkdirs()
		try {
			let f = new java.io.File(dir, filename)
			f.createNewFile()

			let bos = new java.io.ByteArrayOutputStream()
			bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 0, bos)

			//write the bytes in file
			let fos = new java.io.FileOutputStream(f)
			fos.write(bos.toByteArray())
			fos.flush()
			fos.close()
			return true
		} catch (e) {
			// log(e)
		}
	}
	/**
	 * Returns all files and dirs in path
	 * @param path full path
	 * @returns files: string[], dirs: string[]
	 */
	getFilesList(path: string): IFileList {
		let c: IFileList = {
			files: [],
			dirs: []
		}
		let files = this.Select(path).listFiles()
		for (let i in files) {
			var f = files[i]
			if (f.isDirectory()) c.dirs.push(f.getName() + '')
			if (f.isFile()) c.files.push(f.getName() + '')
		}
		return c
	}
	/**
	 * Returns recursive all file dirs in path
	 * @param path full path
	 * @returns files: string[]
	 */
	getFilesListRecursive(path: string, parentName: string): IFileList {
		let c: IFileList = {
			files: [],
			dirs: []
		}
		// Logger.Log(`${path} : ${parentName}`,'input')
		let list = this.Select(path).listFiles()
		for (let i in list) {
			let f = list[i]
			let name = `${parentName}/${f.getName()}`
			if (f.isDirectory())
				c.files.push.apply(c.files, this.getFilesListRecursive(path + '/' + f.getName(), name).files)

			if (f.isFile())
				c.files.push(name)
		}
		// Logger.Log(`${JSON.stringify(c)}`,'output')
		c.files.sort()
		return c
	}
	/**
	 * Returns build.config of mod
	 */
	getBuildConfig(): IBuildConfig {
		let file = this.Select(`${__dir__}build.config`)
		return this.ReadJSON(file)
	}
	/**
	 * Returns avascript Object if success or null if file is not JSON
	 * @param _File java.io.File
	 */
	ReadJSON(_File: java.io.File): any {
		let file = JSON.parse(this.ReadFrom(_File))
		// log(JSON.stringify(file, null, 4)) // 'Chisel build.config'
		return file
	}
	/**
	 * Writes javascript Object to file
	 * @param _File java.io.File
	 * @param json javascript Object
	 */
	WriteJSON(_File: java.io.File, json: {}): void {
		this.Rewrite(_File, JSON.stringify(json, null, 4))
	}
}


var ScriptingManager = {
	namespaces: {},

	RegexList: {
		reference: new RegExp(/([A-z0-9]\S{0,})(@)([A-z0-9]\S{0,})(\.)([A-z0-9]\S{0,})/),
		variable: new RegExp(/\$([A-z0-9]\S{0,})/)
	},

	readResource(rm: ResourceManager, path: string) {
		let readed = rm.ReadJSON(rm.Select(path))
		if (!this.namespaces[readed.namespace])
			this.namespaces[readed.namespace] = readed
		else
			("Namespace " + readed.namespace + " is exists", "MOD")
	},

	readAllResources(rm: ResourceManager): void {
		let json = rm.ReadJSON(rm.Select(rm.resources.files.contents))
		for (let i in json.files) {
			this.readResource(rm.resources.dir.assets + json.files[i])
		}
		rm.Rewrite(rm.Select(rm.resources.files.cache), JSON.stringify(this.readPropertyRecusive(this.namespaces)))
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
			// log(JSON.stringify(this.namespaces[namespace][property]) + " : " + property) // 'readGlobalVariable'
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
	}
}