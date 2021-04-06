
namespace ItemName {
	var Data: { [id: number]: Bind }
	export interface BindingData {
		inGui: string
		inWorld: string
		toolTip: string
		default: string
		mod: string
	}
	export enum State {
		Default,
		World,
		Gui
	}
	export interface OverrideFunction {
		(item: ItemInstance, translation: string, name: string, state: State, data: BindingData): string | void
	}
	export interface BindingRegistration {
		callback: boolean,
		default: boolean
	}
	export class Bind {
		data: BindingData
		formatted: BindingData
		itemID: number
		nameOverrideFunction: OverrideFunction
		registered: BindingRegistration = { callback: false, default: false }
		constructor(data: BindingData, itemID: number) {
			this.data = data
			this.itemID = itemID
			this.setFormattedNames(data)
		}
		registerCustomNameOverrideFunction(nameOverrideFunction: OverrideFunction) {
			Item.registerNameOverrideFunction(this.itemID, (item: ItemInstance, translation: string, name: string) => {
				return nameOverrideFunction(item, translation, name, this.getNameState(), this.data)
			})
			this.registered.default = true
		}
		registerCustomNameOverrideCallback(nameOverrideFunction: OverrideFunction) {
			Callback.addCallback("ItemNameOverride", (item: ItemInstance, translation: string, name: string) => {
				if (item.id == this.itemID)
					return nameOverrideFunction(item, translation, name, this.getNameState(), this.data)
			})
			this.registered.callback = true
		}
		getNameState(): State {
			switch (MCGUI.Screen.Latest.enumType) {
				case MCGUI.Screen.Types.ENTITY:
				case MCGUI.Screen.Types.NATIVE_TILE:
				case MCGUI.Screen.Types.INVENTORY:
					return State.Gui
				case MCGUI.Screen.Types.GAMEPLAY:
					return State.World
				default:
					return State.Default
			}
		}
		setFormattedNames(data: BindingData) {
			this.formatted = {
				default: data.default,
				toolTip: `${Native.Color.GRAY}${data.toolTip}`,
				mod: `${Native.Color.DARK_PURPLE}${data.mod}`,
				inGui: data.inGui,
				inWorld: data.inWorld
			}
		}
		get default() {
			return this.data.default
		}
		get toolTip() {
			return this.data.toolTip
		}
		get mod() {
			return this.data.mod
		}
		get inGui() {
			return this.data.inGui
		}
		get inWorld() {
			return this.data.inWorld
		}
	}
}
