// function addCallbacks(list) {
// 	for (let callback in list) {
// 		Callback.addCallback(list[callback], function (p1, p2, p3, p4, p5, p6, p7) {
// 			DebugThis(function () {
// 				Logger.Log(JSON.stringify([Parser.get(p1), Parser.get(p2), Parser.get(p3), Parser.get(p4), Parser.get(p5), Parser.get(p6), Parser.get(p7)]), list[callback])
// 			}, list[callback])
// 		})
// 	}
// }
// var Thread_ = java.lang.Thread
// var Runnable_ = java.lang.Runnable
// function DebugThis(func, name) {
// 	UI.getContext().runOnUiThread(new java.lang.Runnable({
// 		run() {
// 			Logger.Log('Debuggung new function', ' DebugThis ' + ((name + ' ') || ''))
// 			try {
// 				func()
// 			} catch (e) {
// 				Logger.Log(e.name + ': [' + e.message + ']', "ERROR: " + e.fileName + '#' + e.lineNumber)
// 			}
// 		}
// 	}))
// }

// var Parser = {
// 	tCount: 0,
// 	addT() {
// 		let i = 0, text = ''
// 		while (i < this.tCount) {
// 			text += ' '
// 			i++
// 		}
// 		return text
// 	},
// 	get(OBJECT_NAME, isVAR?: boolean, name?: string) {
// 		if (OBJECT_NAME == null || OBJECT_NAME == undefined || OBJECT_NAME == Parser) return ""
// 		// var isOBJ = //(typeof OBJECT_NAME !== "object")
// 		// var isARR = //(Array.isArray(OBJECT_NAME))
// 		var text = ""//(isOBJ ? ('\n' + name + ': {\n') : (isARR ? (isVAR ? 'var ' + name + ' = [\n' : '[\n') : (isVAR ? ('var ' + name + ' = {\n') : '{\n')))
// 		Parser.tCount++
// 		// var OBJECT_VALUE = eval(OBJECT_NAME)
// 		var OBJECT_VALUE = OBJECT_NAME
// 		for (var i in OBJECT_VALUE) {
// 			try {
// 				var code = OBJECT_VALUE[i]
// 				if (code == 'annotations' || code == 'declaredConstructors')
// 					break
// 				if (typeof code === "object") {
// 					code = Parser.get(OBJECT_VALUE[i], false, '')
// 				} else if (typeof code === 'string')
// 					code = "'" + OBJECT_VALUE[i] + "'"
// 				text += Parser.addT()
// 				if (!Array.isArray(OBJECT_NAME))
// 					text += i + ": " + code + ',\n'
// 				else text += code + ', /*' + i + '*/\n'
// 			} catch (e) {
// 				// Logger.Log(Parser.get(e, false, "err"), 'ERRORS :)')
// 				".".endsWith(".")
// 				Logger.Log(e.name + ': [' + e.message + ']', "ERROR: " + e.fileName + '#' + e.lineNumber)
// 				// break
// 			}
// 		}
// 		Parser.tCount--
// 		text += Parser.addT() + ((Array.isArray(OBJECT_NAME)) ? ']' : '}')
// 		// Logger.Log(text, name)
// 		return text
// 	}
// }

namespace Dumper {
	namespace DTS {
		const outputTypes = {
			"java.lang.String": "string",
			"java.lang.Object": "Object",
			"boolean": "boolean",
			"void": "void",
			"undefined": "undefined",
			"float": "number",
			"int": "number",
			"long": "number",
			"false": "boolean",
			"true": "boolean",
			"java.lang.Class": "this",
			"[object Object]": "Object"
		}
		const regexList = {
			func: /(.*), function .*\(\) \{\/\*([\s\S]*?)\*\/\}/gm,
			splitFunc: /(.*) ([A-z]+)\((.*)\)$/gm,
			classFields: /(.*), (.*[^\/\*])$/gm,
		}
		function splitArgs(args: string) {
			if (args === "") return ""
			let splittedArgs = args.split(",")
			let result = ""
			splittedArgs.forEach((type, index) => {
				result += `arg${index}: ${outputTypes[type] || `"${type}"`}, `
			})
			return result.replace(/, $/g, "")
		}
		function setupFunc(name: string, args: string, returns: string) {
			return `${name}(${splitArgs(args)}): ${outputTypes[returns] || `"${returns}"`}`
		}
		function splitFunc(func: string) {
			let parsed = func.split(regexList.splitFunc)
			let parsedCount = (parsed.length - 1) / 4
			let out = ""
			for (let i = 0; i < parsedCount; i++) {
				let u = 4 * i
				out += `\t${setupFunc(
					parsed[u + 2],
					parsed[u + 3],
					parsed[u + 1].replace(/( )+/gm, "")
				)}\n`
			}
			return out
		}
		function exportFunctions(text: string) {
			let list = text.match(regexList.func)
			let out = ""
			list.forEach((element) => {
				out += splitFunc(element)
			})
			return out
		}
		function exportFields(text: string) {
			let list = text.match(regexList.classFields)
			let out = ""
			list.forEach((element) => {
				let splitted = element.split(regexList.classFields)
				if (splitted[1] !== "descriptionWatcher")
					out += `\t${splitted[1]}: ${Number(splitted[2]) ? "number" : outputTypes[splitted[2]] || `"${splitted[2]}"`}\n`
			})
			return out
		}
		export function Generate(klass: string, name: string): string {
			return `declare class ${name} {\n${exportFunctions(klass)}\n${exportFields(klass)}}`
		}
	}
	export function toDTS(data: any, name: string) {
		let input = ""
		for (let i in data)
			input += `${i}, ${data[i]}\n`

		return DTS.Generate(input, name)
	}
	export function dump(data: any) {

	}
}

// addCallbacks(['LevelSelected', 'LevelPreLoaded', 'LevelLoaded', 'LevelPreLeft', 'LevelLeft', 'ReadSaves', 'WriteSaves', 'GenerateNetherChunk', 'GenerateEndChunk', 'GenerateChunk', 'GenerateChunkUndeground', 'DestroyBlock', 'DestroyBlockStart', 'DestroyBlockContinue', 'Explosion', 'BuildBlock', 'CustomBlockTessellation', 'NativeCommand', 'ClientChat', 'ServerChat', 'ItemUse', 'FoodEaten', 'ItemIconOverride', 'ItemNameOverride', 'ItemUseNoTarget', 'ItemUsingReleased', 'ItemUsingComplete', 'ItemDispensed', 'PlayerAttack', 'ExpAdd', 'ExpLevelAdd', 'EntityAdded', 'EntityRemoved', 'EntityDeath', 'EntityHurt', 'EntityInteract', 'ProjectileHit', 'ProjectileHitBlock', 'ProjectileHitEntity', 'NativeGuiChanged', 'ModDirLoaded', 'PreBlocksDefined', 'BlocksDefined', 'PreLoaded', 'APILoaded', 'ModsLoaded', 'PostLoaded', 'AppSuspended', 'DimensionLoaded'])
// DebugThis(function () {
// new Thread_(function () {
// Logger.Log(Parser.get(this, true, "this"), "this")
// Logger.Log(Parser.get(__name__, true, "__name__"), "__name__")
// Logger.Log(Parser.get(__dir__, true, "__dir__"), "__dir__")
// Logger.Log(Parser.get(__config__, true, "__config__"), "__config__")
// Logger.Log(Parser.get(__debug_typecheck__, true, "__debug_typecheck__"), "__debug_typecheck__")
// Logger.Log(Parser.get(runCustomSource, true, "runCustomSource"), "runCustomSource")
// Logger.Log(Parser.get(importLib, true, "importLib"), "importLib")
// Logger.Log(Parser.get(IMPORT, true, "IMPORT"), "IMPORT")
// Logger.Log(Parser.get(getCoreAPILevel, true, "getCoreAPILevel"), "getCoreAPILevel")
// Logger.Log(Parser.get(runOnMainThread, true, "runOnMainThread"), "runOnMainThread")
// Logger.Log(Parser.get(getMCPEVersion, true, "getMCPEVersion"), "getMCPEVersion")
// Logger.Log(Parser.get(Debug, true, "Debug"), "Debug")
// Logger.Log(Parser.get(FileTools, true, "FileTools"), "FileTools")
// Logger.Log(Parser.get(Threading, true, "Threading"), "Threading")
// Logger.Log(Parser.get(Config, true, "Config"), "Config")
// Logger.Log(Parser.get(TileEntity, true, "TileEntity"), "TileEntity")
// Logger.Log(Parser.get(MobRegistry, true, "MobRegistry"), "MobRegistry")
// Logger.Log(Parser.get(MobSpawnRegistry, true, "MobSpawnRegistry"), "MobSpawnRegistry")
// Logger.Log(Parser.get(GameObject, true, "GameObject"), "GameObject")
// Logger.Log(Parser.get(GameObjectRegistry, true, "GameObjectRegistry"), "GameObjectRegistry")
// Logger.Log(Parser.get(ModAPI, true, "ModAPI"), "ModAPI")
// Logger.Log(Parser.get(Saver, true, "Saver"), "Saver")
// Logger.Log(Parser.get(World, true, "World"), "World")
// Logger.Log(Parser.get(Entity, true, "Entity"), "Entity")
// Logger.Log(Parser.get(Player, true, "Player"), "Player")
// Logger.Log(Parser.get(Game, true, "Game"), "Game")
// Logger.Log(Parser.get(Render, true, "Render"), "Render")
// Logger.Log(Parser.get(Texture, true, "Texture"), "Texture")
// Logger.Log(Parser.get(EntityModel, true, "EntityModel"), "EntityModel")
// Logger.Log(Parser.get(EntityModelWatcher, true, "EntityModelWatcher"), "EntityModelWatcher")
// Logger.Log(Parser.get(EntityAIClass, true, "EntityAIClass"), "EntityAIClass")
// Logger.Log(Parser.get(EntityAIWatcher, true, "EntityAIWatcher"), "EntityAIWatcher")
// Logger.Log(Parser.get(EntityAI, true, "EntityAI"), "EntityAI")
// Logger.Log(Parser.get(GenerationUtils, true, "GenerationUtils"), "GenerationUtils")
// Logger.Log(Parser.get(Animation, true, "Animation"), "Animation")
// Logger.Log(Parser.get(IDData, true, "IDData"), "IDData")
// Logger.Log(Parser.get(Block, true, "Block"), "Block")
// Logger.Log(Parser.get(Item, true, "Item"), "Item")
// Logger.Log(Parser.get(ToolAPI, true, "ToolAPI"), "ToolAPI")
// Logger.Log(Parser.get(Armor, true, "Armor"), "Armor")
// Logger.Log(Parser.get(LiquidRegistry, true, "LiquidRegistry"), "LiquidRegistry")
// Logger.Log(Parser.get(Native, true, "Native"), "Native")
// Logger.Log(Parser.get(alert, true, "alert"), "alert")
// Logger.Log(Parser.get(ItemExtraData, true, "ItemExtraData"), "ItemExtraData")
// Logger.Log(Parser.get(RenderMesh, true, "RenderMesh"), "RenderMesh")
	// Parser.get(th, true, 'InnerCoreAPI')//, 'InnerCoreAPI')
	// }).start()
// }, 'InnerCoreAPI')