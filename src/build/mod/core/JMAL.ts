// /**
//  * Java Mod Assets Loader - JMAL
//  */

// interface IAssetsData {
//     folders?: json
// }
// interface IBlockstateData {
//     models: json
//     textures: json
//     blockstate: json
// }

// class BlockstateWorker {
//     private data: IBlockstateData
//     private blockData: json
//     constructor(data: IBlockstateData) {
//         this.data = data
//         this.genBlockstate()
//     }
//     private genBlocks() {

//     }
//     private genBlockstate() {
//         let data = this.data
//         let bs = data.blockstate
//         if (typeof bs === 'string')
//             bs = JSON.parse(bs)
//         for (let variant in bs.variants) {
//             let current = bs.variants[variant]
//             this.variantWorker(variant, current)
//         }
//     }
//     private variantWorker(name: string, data: json) {
        
//     }
//     private textureWorker() {
//         let data = this.data
//         let textures = data.textures
//         if (typeof textures === 'string')
//             textures = JSON.parse(textures)

//     }
//     private modelWorker() {
//         let data = this.data
//         let models = data.models
//         if (typeof models === 'string')
//             models = JSON.parse(models)

//     }
// }

// class JMAL {
//     private data: IAssetsData = {}
//     constructor(namespace: string) {
//         this.data.folders = {namespace: namespace}
//         this.initFolders()
//     }
//     private initFolders() {
//         let f = this.data.folders
//         f.global = __dir__ + f.namespace
//         let files = RM.getFilesList(f.global).dirs
//         for (let i in files)
//             f[files[i]] = f.global + files[i]
//     }
//     loadFilesFrom(name: string) {
//         if (this.data.folders[name])
//             return RM.getFilesListRecursive(this.data.folders[name], name).files
//         throw `Can't locate ${name} folder from ${this.data.folders[name]}`
//     }

//     // get blockstates() {
//     //     return this.loadFilesFrom('blockstates')
//     // }
// }
// let res = new JMAL(resources.dir.java_assets + 'chisel/')
// Logger.Log(JSON.stringify(res.loadFilesFrom('blockstates')), 'json')