namespace CLI {
	export var List: string[] = []
	export var FuncList: Func[] = []
	export interface Func {
		(values: string[]): void
	}
	export function reg(name: string, func: Func) {
		List.push(name)
		FuncList.push(func)
	}
	export function run(name: string, args: string): boolean {
		let index = List.lastIndexOf(name)
		if (index != -1) {
			FuncList[index](args.split(/\W+/gm))
			return true
		}
		return false
	}
}

Callback.addCallback("NativeCommand", function (value: string) {
	let cmd = value.split(/\/(\w+) /gm)
	let name = cmd[1]
	let args = cmd[2]
	if (CLI.run(name, args))
		Game.prevent()

	console.debug(`Command: ${name}, args: [${args}]`)
})