
interface IBitmapSources {
	srcPath: string
	srcName: string
	destPath: string
	destName: string
	type: string
}
interface ICTMProps {
	width: number | 32
	height: number | 32
	textureSize: number | 16
	textureSlicesH: number | 2
	textureSlicesV: number | 2
	name: string | 'normal'
	rows: number | 2
	cols: number | 2
	animFrames?: number | 0
}
class BitmapWorker {
	public CTMSizes: {[key: string]: ICTMProps} = {}
	public ctmPostfixes: string[] = ["ctm", "ctmv", "ctmh"]
	/**
	 * Add custom ctm sizes
	 * @param dim CTM info
	 */
	addCTMType(dim: ICTMProps) {
		this.CTMSizes[dim.name] = dim
	}

	/**
	 * Generate Texture from source to dest
	 * @param rm ResourceManager for work
	 * @param source File of bitmap, with source and destination path
	 */
	genTexture(rm: ResourceManager, source: IBitmapSources): boolean {
		let bmp = rm.ReadBitmap(source.srcPath, source.srcName)
		if (source.hasOwnProperty('type'))
			if (source.type != 'normal') {
				this.genCTMTexture(rm, source)
				return true
			}
		let outName = source.destName.replace('.png', '_0.png')
		rm.WriteBitmap(bmp, source.destPath, `${rm.Select(source.destPath, outName).exists() ? outName : outName}`)
		this.parseSource(source)
		return false
	}

	/**
	 * Log source data
	 * @param source File of bitmap, with source and destination path
	 */
	parseSource(source: IBitmapSources): void {
		// log(JSON.stringify(source, null, 2))
	}

	/**
	 * Generate CTM Texture from source to dest
	 * @param rm ResourceManager for work
	 * @param source File of bitmap, with source and destination path
	 */
	genCTMTexture(rm: ResourceManager, source: IBitmapSources): void {
		if (source.type in this.CTMSizes)
			this.generateDefaultCTM(rm, source)
		// else log(`Cannot generate ctm texture named ${source.type}`)
	}

	/**
	 * Writing texture from source to dest
	 * @param rm ResourceManager for work
	 * @param source File of bitmap, with source and destination path
	 */
	generateDefaultCTM(rm: ResourceManager, source: IBitmapSources): void {
		let bitmap = rm.ReadBitmap(source.srcPath, source.srcName)
		let w = bitmap.getWidth()
		let h = bitmap.getHeight()

		for (const type in this.CTMSizes) {
			const e = this.CTMSizes[type]

			if (e.height == h && e.width == w && e.textureSize == ((w / e.textureSlicesH) + (h / e.textureSlicesV)) / 2) {
				let i = this.isCTMNameExists(rm, source) ? 1 : 0

				for (let hS = 0; hS < e.textureSlicesH; hS++)
					for (let vS = 0; vS < e.textureSlicesV; vS++)
						rm.WriteBitmap(rm.CropBitmap(bitmap, hS * e.textureSize, vS * e.textureSize, e.textureSize, e.textureSize), source.destPath, `${this.getNormalizedCTMName(source.destName).replace('.png', '')}_${i++}.png`)
				// log(`${bitmap}, ${hS * e.textureSize}, ${vS * e.textureSize}, ${e.textureSize}, ${e.textureSize}, ${source.destPath}, ${source.destName.replace(ctmType, '').replace('_0', '' + (i - 1))}, ${i - 1}`) // 'Chisel-CTM-Gen'
			}
		}
	}
	/**
	 * Check for ctm texture is exists, to change output texture data
	 * @param rm ResourceManager for work
	 * @param source File of bitmap, with source and destination path
	 */
	isCTMNameExists(rm: ResourceManager, source: IBitmapSources): boolean {
		this.ctmPostfixes.forEach(postfix => {
			if (rm.Select(source.srcPath, `${source.srcName.replace(`-${postfix}`, '')}`).exists())
				return true
		})
		return false
	}
	/**
	 * Removes all postfixes from output texture name
	 * @param name name of output texture
	 */
	getNormalizedCTMName(name: string): string {
		this.ctmPostfixes.forEach(postfix => {
			if (name.match(postfix))
				name = name.replace(`-${postfix}`, '').replace(/-|\+/g, '_')
		})
		return name
	}
}

/**
 * Block props:
 * genprops {
 *   transparency: 1
 * }
 * generator = "default"
 * parents = null
 * register = true
 * require_mod = "Chisel"
 * special_type = {
 *   base = 0
 *   destroytime = 1
 *   explosionres = 3
 *   friction = 0.6000000238418579
 *   isApproved = false
 *   lightlevel = false || 0..15
 *   lightopacity = 0 || 0..15
 *   mapcolor = 0
 *   material = 3
 *   name
 *   renderallfaces = false
 *   renderlayer 4
 *   rendertype 0
 *   solid = false(transparent)
 *   sound = "stone"
 *   translucency = 0
 * }
 * subdirs = null || {}
 * variation = string || "stone"
 * variations = null || []
 */