
namespace ItemName {
	export interface NameData {
		inGui: string
		inWorld: string
		toolTip: string
		normal: string
		mod: string
	}
	export enum State {
		None,
		inGui,
		inWorld
	}
	export var CurrentState = State.None
	export class Manager {
		data: NameData
		constructor(data: NameData, itemData: ItemInstance) {
			this.data = data
			Callback.addCallback("ItemNameOverride", (item: ItemInstance, translation: string, name: string) => {
				if (itemData.id == item.id) {
					switch (CurrentState) {
						case State.inGui:
							return this.data.normal + this.data.inGui + this.data.mod
							break
						case State.inWorld:
							return this.data.normal + this.data.inWorld
							break
						default:
							return this.data.normal
							break
					}
				}
			})
		}
		setBaseName(value: string) {
			this.data.normal = value
		}
		setToolTip(value: string) {
			this.data.toolTip = value
		}
		setModName(value: string) {
			this.data.toolTip = `${Native.Color.DARK_PURPLE}${value}`
		}
		setInGuiName(value: string) {
			this.data.inGui = value
		}
		setInWorldName(value: string) {
			this.data.inWorld = value
		}
	}
	var latestName = ""
	Callback.addCallback("NativeGuiChanged", (name, lastName, isPushEvent) => {
		if (name == "in_game_play_screen")
			CurrentState = State.inWorld
		else if (lastName == "in_game_play_screen" && isPushEvent)
			CurrentState = State.inGui

		if (lastName != "")
			latestName = lastName
		else
			lastName = latestName

		console.info(`${isPushEvent ? lastName + " --> " + name : name + " <--" + lastName} (${isPushEvent ? "pushed" : "popped"}) (${CurrentState == State.inGui ? "inGui" : CurrentState == State.inWorld ? "inWorld" : "None"})`, `[ItemName.ts] ItemName Callback.NativeGuiChanged`)
	})
}