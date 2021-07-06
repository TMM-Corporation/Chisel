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