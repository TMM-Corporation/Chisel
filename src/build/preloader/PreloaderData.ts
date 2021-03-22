
class Preloader {
	Mod: string
	RM: ResourceManager = new ResourceManager()
	TextureGenerator: TextureGenerator
	constructor(name: string, dirs: IResourceFileList) {
		this.Mod = name
		this.RM.resources = dirs
		this.RM.mod = name
		this.TextureGenerator = new TextureGenerator(this.RM)
	}
}
