namespace Task {
	type Action = () => void
	var tasks: Action[][] = []
	var currentTick: number = 0
	export function run(action: Action, delay: number = 0) {
		if (delay < 0) throw `Task delay can't be lower than zero`
		let key = Math.floor(currentTick + delay) + 1
		if (!tasks[key]) tasks[key] = []
		tasks[key].push(action)
	};

	Callback.addCallback("tick", () => {
		let key = currentTick++
		let list = tasks[key]
		if (!list) return
		for (let i = 0; i < list.length; i++) list[i]()
		delete tasks[key]
	})
}