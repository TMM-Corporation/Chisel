
interface ICTMProps {
	// ctm sliceable texture name
	name?: string
	// ctm type name
	type?: string | default_ctm_types
	// file extension, default is '.png'
	extension?: string
	// texture width
	width?: number | 32
	// texture height
	height?: number | 32
	// base texture slice size
	textureSize?: number | 16
	// horizontal slices count
	textureSlicesH?: number | 2
	// vertical slices count
	textureSlicesV?: number | 2
	// animation frame count
	animFrames?: number | 0
}

type default_ctm_types = 'ctm' | 'ctmh' | 'ctmv'
const default_ctm_values: ICTMProps = {
	width: 32,
	height: 32,
	textureSize: 16,
	textureSlicesH: 2,
	textureSlicesV: 2,
	animFrames: 0,
}
interface ITexture {
	// unique texture name
	name: string
	// custom texture data, default is 0
	data?: number | 0
	// ctm properties for variation
	ctm?: ICTMProps
	// custom variation type, default is 'normal', for example ctm, ctmh, ctmv
	type?: string | default_ctm_types
	// file extension, default is '.png'
	extension?: string
}
// interface ILocalization {
// 	// default name for block
// 	default?: string
// 	// use default name as localization string
// 	default_as_localization?: boolean
// 	// string or multiple strings for localization name
// 	localization?: string[]
// }
interface ITileVariation {
	// fullblock texture
	texture: ITexture
	// tooltip additional name for variation
	localization?: string[]
	// register variation
	register?: boolean
}
interface IChiselTile {
	// register tile
	register?: boolean
	// block name or localized name
	name?: string
	// tooltip main name for block
	localization: string[]
	// block variations
	variations: ITileVariation[]
}
interface IChiselTiles {
	[tile: string]: IChiselTile
}

class ChiselVariation implements ITileVariation {
	localization: string[]
	register = true
	texture: ITexture
	constructor(name: string, ext: string, type?: string, ctm?: ICTMProps) {
		this.localization = [`tile_${name}_desc`]
		this.texture = {
			name: name,
			extension: ext || 'png',
			type: type || 'normal',
			ctm: ctm
		}
	}
}

class ChiselTile implements IChiselTile {
	localization: string[]
	name = ''
	register = true
	variations: ITileVariation[]
	constructor(name: string, localization: string[], variations: ITileVariation[]) {
		this.localization = localization
		this.name = name
		this.register = true
		this.variations = variations
		log(JSON.stringify(this))
	}
}

interface ITextureSource {
	texturePath: string
	textureName: string
	additionalSrcPath: string
	srcPath: string
	dstPath: string
	mask?: [srcName: RegExp, outName: RegExp]
}

class TextureGenerator {
	RM: ResourceManager
	TileSet: IChiselTiles = {};
	newTextures: obj
	constructor(RM: ResourceManager) {
		this.RM = RM
	}
	/**
	 * @param src texture copy params
	 */
	copyTextureFrom(src: ITextureSource): boolean {
		let rm = this.RM
		let srcFile = rm.Select(__dir__ + src.srcPath + src.additionalSrcPath + src.texturePath + src.textureName)

		// checking file exists
		if (srcFile.exists()) {
			let bmp = rm.ReadBitmap(__dir__ + src.srcPath + src.additionalSrcPath + src.texturePath, src.textureName)

			// checking if texture successfully readed
			if (bmp != null) {
				let outName: any = toFileName(this.RM.mod, [src.texturePath, src.textureName])
				outName = addTextureData0(outName)
				// outName = splitFileName(outName)
				// log(`${toFileName(this.RM.mod, [src.texturePath, src.textureName])}`)
				let dstPath = src.texturePath.replace(/\/.*/g, '')
				let outDirStatus = rm.Select(__dir__ + src.dstPath + dstPath).mkdirs()

				let writeStatus = rm.WriteBitmap(bmp, `${__dir__ + src.dstPath + dstPath}/`, outName)

				if (!writeStatus)
					log(`Bitmap '${src.textureName}' write failed to ${__dir__ + src.dstPath + dstPath + outName}`)

				return writeStatus
			} else {
				log(`Failed to read bitmap ${src.textureName} from ${src.srcPath + src.texturePath}`)
				return false
			}
		} else {
			log(`File: ${src.textureName} not exists in ${src.srcPath + src.additionalSrcPath + src.texturePath}`)
			return false
		}


		// __dir__                                                      - /storage/emulated/0/games/horizon/packs/Inner_Core_Test/innercore/mods/Chisel/
		// texturePath                                                  - glass_stained/black
		// textureName                                                  - framed_ct.png
		// additionalSrcPath                                            - textures/blocks
		// srcPath | resources.dirs.chisel                              - resources/pc_mod/chisel/
		// dstPath | resources.dirs.terrain_atlas                       - resources/ic_mod/terrain-atlas/
		// chisel_texturePath_textureName                               - chisel_glass_stained/black_framed_ct.png
		// texturePath.replace(/\/.*//g, '')                            - glass_stained/black -> glass_stained
		// outName | chisel_texturePath_textureName.replace(/\//g, '_') - chisel_glass_stained/black_framed_ct.png -> chisel_glass_stained_black_framed_ct.png
	}
	copyTexturesFrom(json: any) {
		for (let dir in json) {
			let list: arr = json[dir]
			for (let index in list) {
				let texture: string = list[index]
				this.copyTextureFrom({
					textureName: `${texture}`,
					texturePath: `${dir}/`,
					additionalSrcPath: 'textures/blocks/',
					srcPath: 'resources/pc_mod/chisel/',
					dstPath: 'resources/ic_mod/terrain-atlas/'
				})
			}
		}
	}
	CTMMasks = {
		file: ['-ctm', '-ctmv', '-ctmh', '_ct'],
		type: ['ctm', 'ctmv', 'ctmh', 'ctm']
	}
	checkIsCTM(texture: string, list: arr) {
		let slittedName = texture.split(/(.*)\./gm)
		let result = false
		let masks = this.CTMMasks
		masks.file.forEach(mask => {
			if (slittedName[1].match(mask))
				// let replaced = texture.replace(mask, '')
				// const includes = arrIncludes(list, replaced)
				// if (includes)
				result = true
		})
		return result
	}
	checkHasCTM(curr_name: string, texture: string, list: arr) {
		let slittedName = texture.split(/(.*)\./gm)
		let ctm: ICTMProps, out = '', outName = ''
		let masks = this.CTMMasks
		masks.file.forEach((mask, i) => {
			const name = `${slittedName[1]}${mask}.${slittedName[2]}`
			const type = masks.type[i]
			const includes = arrIncludes(list, name)
			if (includes) {
				let splitted = splitFileName(`chisel_${curr_name}_${name}`.replace(/\//g, '_'))
				ctm = {
					name: toSnakeCase(splitted.name),
					extension: splitted.ext,
					type: type
				}
				// log(`'${texture}' has ctm texture = '${name}' with type '${type}'`)
				outName = name
			}
			out += `${type}=${includes}, `
		})

		// log(`${texture}: ${out}`)
		return {
			ctm: ctm,
			name: outName,
			out: out,
		}
	}
	exportToJsonTiles(contents: { json: any, ctmtypes: any }, addToTileSet?: boolean) {
		// create output dir
		this.RM.Select(__dir__ + this.RM.resources.dirs.json + `/output/tiles`).mkdirs()
		let { json, ctmtypes } = contents
		// log(`${JSON.stringify(ctmtypes)}`)
		for (let dir in json) {
			let list: arr = json[dir]
			let variations: ITileVariation[] = []
			let outDirName = toFileName(this.RM.mod, [dir])

			for (let index in list) {
				let texture: string = list[index]

				if (this.checkIsCTM(texture, list)) continue
				let hasCTM = this.checkHasCTM(outDirName, texture, list)

				// log(`${texture}: isCTM=${isCTM}, hasCTM=${JSON.stringify(hasCTM)}`)
				let outName = toFileName(this.RM.mod, [dir, texture])
				// chisel_glass_stained_black_framed_ct.png -> ["", "chisel_glass_stained_black_framed_ct", "png"]
				let textureData = outName.split(/(.*)\./gm)
				// framed_ct.png -> ["", "framed_ct", "png"]
				let splittedName = texture.split(/(.*)\./gm)

				// log(`${splittedName[1]} in ctmtypes ${splittedName[1] in ctmtypes}`)
				variations.push(new ChiselVariation(textureData[1], textureData[2], ctmtypes[splittedName[1]], hasCTM.ctm))
			}
			let tile = new ChiselTile(dir, [`tile_${outDirName}_name`], variations)
			this.RM.WriteJSON(this.RM.Select(__dir__ + this.RM.resources.dirs.json + `/output/tiles/${outDirName}.json`), tile)
			if (addToTileSet)
				this.TileSet[outDirName] = tile
		}
	}
}
