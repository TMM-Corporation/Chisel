class IronChiselGUI extends ChiselGUI.Custom {
	constructor() {
		super(new ChiselGUI.Header("Iron Chisel", "chisel_iron.ui"))
		ChiselGUI.Base.setUpVariationSlots(this, 10, 6, 60)
		this.group = ChiselGUI.Base.createGUI(this.getElements(), this)
		ChiselGUI.Base.setupScreen(this.getGuiID(), this.group)
	}
	/**
	 * Gets elements for gui
	 * @returns elements - inventory slots, variation slots, preview slot
	 */
	getElements(): UI.ElementSet {
		let _this = this
		let elements: UI.ElementSet = {
			textTitle: { type: 'text', x: 132, y: this.topPadding + 225, font: GUI.Font.Center(GUI.MCColor.DarkGray, 20), text: this.header.title },
			slotPreview: { type: "slot", x: 25, y: this.topPadding + 25, bitmap: "chisel2gui_1", size: 202 },
			currentUID: { type: 'text', x: 900, y: 980, text: "UID: -000000000", font: { size: 20, } }
		}
		new GUI.Grid.Element({
			name: _this.variationSlots.name,
			horizontal: { count: this.variationSlots.x, offset: 0 },
			vertical: { count: this.variationSlots.y, offset: 0 },
			startIndex: 0,
			element: {
				type: 'slot', x: 245, y: this.topPadding + 25, size: this.slotSize, isDarkenAtZero: true,
			}
		}, elements)
		new GUI.Grid.Element({
			name: "slotInventory",
			horizontal: { count: 9, offset: 0 },
			vertical: { count: 3, offset: 0 },
			startIndex: 9,
			element: { type: 'invSlot', x: 250 + (this.slotSize / 2), y: this.topPadding + 400 + (this.slotSize), size: this.slotSize }
		}, elements)
		new GUI.Grid.Element({
			name: "slotInventory",
			horizontal: { count: 9, offset: 0 },
			vertical: { count: 1, offset: 0 },
			startIndex: 0,
			element: { type: 'invSlot', x: 250 + (this.slotSize / 2), y: this.topPadding + 415 + (this.slotSize * 4), size: this.slotSize }
		}, elements)
		return elements
	}
	/**
	 * Registers variation slot TransferPolicy
	 * @param elementName varitation slot name
	 * @param container [Server] ItemContainer
	 */
	registerSlotTransferPolicy(elementName: string, container: ItemContainer) {
		var GUIBASE = ChiselGUI.Base
		container.setSlotGetTransferPolicy(elementName,
			(itemContainer: ItemContainer, name: string, id: number, amount: number, data: number, extra: ItemExtraData, playerUid: number) => {
				let slot = itemContainer.getSlot(name)
				let item = Entity.getCarriedItem(playerUid)
				let onUsed = ChiselItem.Base.onUse(playerUid, item, amount)
				let totalDamage = onUsed.playerGM == 0 ? onUsed.appliedDamage : amount

				if (slot.count == totalDamage && !onUsed.breaked) {
					GUIBASE.setVariation(playerUid, -1, -1)
					GUIBASE.clearVariationSlots(itemContainer, this.variationSlots)
					GUIBASE.clearPreviewSlot(itemContainer)
				} else {
					GUIBASE.decreasePreviewSlot(itemContainer, totalDamage)
					GUIBASE.updateVariationCount(itemContainer, this, slot.count - totalDamage, name)
				}
				if (onUsed.breaked) {
					let bs = BlockSource.getDefaultForActor(playerUid)
					let { x, y, z } = Entity.getPosition(playerUid)
					itemContainer.dropSlot(bs, "slotPreview", x, y, z)
					itemContainer.closeFor(Network.getClientForPlayer(playerUid))
				}

				SoundManager.playSound(getSoundFromConstName('chisel.fallback'), 0.8, getRandomArbitrary(0.7, 1))
				return totalDamage
			}
		)
		container.setSlotAddTransferPolicy(elementName, () => { return 0 })
	}
	/**
	 * Setups server side container data
	 * @param container [Server] ItemContainer
	 */
	setupServerSide(container: ItemContainer) {
		console.info(`Setting up server side IronChisel: ${this.getGuiID()}`)
		container.setClientContainerTypeName(this.getGuiID())
		this.setupPreviewSlot(container)
		this.setupVariationSlots(container)
	}
	/**
	 * Setups variation slots TransferPolicy
	 * @param container [Server] ItemContainer
	 */
	setupVariationSlots(container: ItemContainer) {
		for (let i = 0; i < this.variationSlots.count; i++) {
			const elementName = `${this.variationSlots.name}${i}`
			this.registerSlotTransferPolicy(elementName, container)
		}
	}
	/**
	 * Setups preview slot TransferPolicy
	 * @param container [Server] ItemContainer
	 */
	setupPreviewSlot(container: ItemContainer) {
		const GUIBASE = ChiselGUI.Base
		container.setSlotGetTransferPolicy('slotPreview',
			(itemContainer: ItemContainer, name: string, id: number, amount: number, data: number, extra: ItemExtraData, playerUid: number) => {
				console.debug(`[FROM] Slot '${name}', Item: [${id}:${data}, ${amount}] (${Item.getName(id, data)}), UID ${playerUid}`, 'TransferPolicy')
				let slot = itemContainer.getSlot(name)

				if (slot.count == amount) {
					GUIBASE.setVariation(playerUid, -1, -1)
					GUIBASE.clearVariationSlots(itemContainer, this.variationSlots)
				} else
					GUIBASE.updateVariationCount(itemContainer, this, slot.count - amount)

				return amount
			}
		)
		container.setSlotAddTransferPolicy('slotPreview',
			(itemContainer: ItemContainer, name: string, id: number, amount: number, data: number, extra: ItemExtraData, playerUid: number) => {
				if (!Carvable.Groups.searchBlock(id, data).group) {
					console.debug(`Player trying to add not valid item [${id}:${data}]`)
					return 0
				}
				console.debug(`[INTO] Slot '${name}', Item: [${id}:${data}, ${amount}] (${Item.getName(id, data)}), UID: ${playerUid}`, 'TransferPolicy')
				let slot = itemContainer.getSlot(name)
				if (slot.id === 0 && amount > 0) {
					// console.json(GUIBASE.variationSlots)
					GUIBASE.setVariation(playerUid, id, data)
					GUIBASE.fillVariationSlots(itemContainer, this, { id, count: amount, data, extra })
				}

				var available = (Item.getMaxStack(id) - slot.count)
				var result = amount <= available ? amount : available
				GUIBASE.updateVariationCount(itemContainer, this, slot.count + result)
				return result
			}
		)
	}
}