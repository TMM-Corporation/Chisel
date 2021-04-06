
namespace ItemName {
	var Data: { [id: number]: NameData }
	export interface NameData {
		inGui: string
		inWorld: string
		toolTip: string
		normal: string
		mod: string
	}
	export class Bind {
		data: NameData
		itemData: ItemInstance
		nameOverrideFunction: Callback.ItemNameOverrideFunction
		constructor(data: NameData, itemData: ItemInstance, nameOverrideFunction: Callback.ItemNameOverrideFunction) {
			this.data = data
			this.itemData = itemData
			this.nameOverrideFunction = nameOverrideFunction
		}
		setCustomNameOverrideFunction(item: ItemInstance, translation: string, name: string) {
			// Item.registerNameOverrideFunction(itemData.id, (itemC: ItemInstance, translationC: string, nameC: string) => {
				switch (MCGUI.Screen.Latest.enumType) {
					case MCGUI.Screen.Types.ENTITY:
					case MCGUI.Screen.Types.NATIVE_TILE:
					case MCGUI.Screen.Types.INVENTORY:
						return this.data.normal + this.data.inGui + this.data.mod
					case MCGUI.Screen.Types.GAMEPLAY:
						return this.data.normal + this.data.inWorld
					default:
						return this.data.normal
				}
			// })
		}
		setBaseName(value: string) {
			this.data.normal = value
		}
		setToolTip(value: string) {
			this.data.toolTip = value
		}
		setModName(value: string) {
			this.data.mod = `${Native.Color.DARK_PURPLE}${value}`
		}
		setInGuiName(value: string) {
			this.data.inGui = value
		}
		setInWorldName(value: string) {
			this.data.inWorld = value
		}
		get default() {
			return this.data.normal
		}
	}

}
