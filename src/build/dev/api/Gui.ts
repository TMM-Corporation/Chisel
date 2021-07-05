namespace GUI {
	export namespace Grid {
		export class Element {
			constructor(elements: UI.ElementSet, gridData: ElementGridData) {
				let gridElement = gridData.element,
					index = (gridData.startIndex || 0)

				console.json(gridData)

				for (let yy = 0; yy < gridData.vertical.count; yy++)
					for (let xx = 0; xx < gridData.horizontal.count; xx++) {
						const u = index, newElementName = `${gridData.name}${index}`
						var element
						switch (gridElement.type) {
							case 'slot':
								let slot = {
									x: (gridElement.x + gridElement.size * xx) + gridData.horizontal.offset,
									y: (gridElement.y + gridElement.size * yy) + gridData.vertical.offset,
								}
								if (gridData.clicker) {
									slot["clicker"] = {}
									if (gridData.clicker.onClick)
										slot['clicker'].onClick = function (uiHandler: any, container: ItemContainer, slot: UI.UISlotElement, position: Vector) {
											gridData.clicker!.onClick(uiHandler, container, slot, position, newElementName, u)
										}
								}
								element = Object.assign({}, gridElement, slot)
								break
							case 'invSlot' || 'invslot':
								element = Object.assign({}, gridElement, {
									x: (gridElement.x + gridElement.size * xx) + gridData.horizontal.offset,
									y: (gridElement.y + gridElement.size * yy) + gridData.vertical.offset,
									index: index
								})
								break
							case 'frame':
								if (gridElement.width && gridElement.height)
									element = Object.assign({}, gridElement, {
										x: (gridElement.x + gridElement.width * xx) + gridData.horizontal.offset,
										y: (gridElement.y + gridElement.height * yy) + gridData.vertical.offset
									})
								break
							case 'switch':
								if (gridElement.scale)
									element = Object.assign({}, gridElement, {
										x: (gridElement.x + (gridElement.scale) * xx) + gridData.horizontal.offset,
										y: (gridElement.y + (gridElement.scale) * yy) + gridData.vertical.offset
									})
								break
							default: break
						}
						elements[newElementName] = element
						index++
					}
			}

		}
		export interface ElementGridData {
			name: string
			horizontal: { count: number, offset: number }
			vertical: { count: number, offset: number }
			startIndex: number,
			clicker?: {
				onClick(uiHandler: any, container: ItemContainer, slot: UI.UISlotElement, position: Vector, name: string, index: number)
			}
			element: UI.Elements
		}
	}
	export namespace BG {
		export var transparent: UI.ColorDrawing = { type: "background", color: Color.TRANSPARENT }
		export var shadow: UI.ColorDrawing = { type: "background", color: android.graphics.Color.argb(90, 0, 0, 0) }
		export function frame(x: number = 0, y: number = 0, width: number, height: number, bitmap: string): UI.FrameDrawing {
			return { type: "frame", x, y, width, height, bitmap }
		}
	}
	export namespace MCColor {
		export var aColor = android.graphics.Color
		export var DarkGray = aColor.rgb(55, 55, 55)
		export var Gray = aColor.rgb(139, 139, 139)
		export var LightGray = aColor.rgb(212, 212, 212)
	}
	export namespace Font {
		export enum Align {
			START,
			CENTER,
			END
		}
		export function NewFont(color: number, size: number, alignment: Align) {
			return { color, size, align: alignment }
		}
		export function Start(color: number, size: number) {
			return NewFont(color, size, Align.START)
		}
		export function Center(color: number, size: number) {
			return NewFont(color, size, Align.CENTER)
		}
		export function End(color: number, size: number) {
			return NewFont(color, size, Align.END)
		}
	}
	export type ControlTypes = Controls.PC | Controls.PE
	export namespace Controls {
		export class PC {
			x: number
			y: number
			global: boolean
			needHelpButton: boolean
			constructor(x: number, y: number, global: boolean = true, needHelpButton: boolean = false, createButtonOffset: boolean = true) {
				this.x = createButtonOffset ? x - 60 : x
				this.y = y
				this.global = global
				this.needHelpButton = needHelpButton
			}
			getControls() {
				return {
					drawing: this.needHelpButton ? this.createFrame(144, 96) : this.createFrame(84, 96),
					elements: this.createButtons()
				}
			}
			createFrame(width: number, height: number): UI.FrameDrawing {
				return { type: "frame", x: this.x, y: this.y, width, height, scale: 3, bitmap: "button_frame_close", color: Color.rgb(64, 64, 64) }
			}
			createButtons(): UI.ElementSet {
				let { x, y } = { x: this.x, y: this.y },
					_closeButton: UI.UICloseButtonElement = { type: 'closeButton', x: x + 12, y: y + 12, bitmap: "button_close_up_light", bitmap2: "button_close_down_light", scale: 4, global: this.global },
					_helpButton: UI.UIButtonElement = { type: 'button', x: x + 12, y: y + 12, bitmap: "button_how_to_play_up_light", bitmap2: "button_how_to_play_down_light", scale: 4 }

				if (this.needHelpButton)
					_closeButton.x += 60

				return this.needHelpButton ? { _closeButton, _helpButton } : { _closeButton }
			}
		}
		export class PE {
			x: number
			y: number
			global: boolean
			needHelpButton: boolean
			constructor(x: number, y: number, global: boolean = true, needHelpButton: boolean = false, createButtonOffset: boolean = true) {
				this.x = createButtonOffset ? x - 60 : x
				this.y = y
				this.global = global
				this.needHelpButton = needHelpButton
			}
			getControls() {
				return {
					drawing: this.needHelpButton ? this.createFrame(144, 96) : this.createFrame(84, 96),
					elements: this.createButtons()
				}
			}
			createFrame(width: number, height: number): UI.FrameDrawing {
				return { type: "frame", x: this.x, y: this.y, width, height, scale: 3, bitmap: "button_frame_close", color: Color.rgb(64, 64, 64) }
			}
			createButtons(): UI.ElementSet {
				let { x, y } = { x: this.x, y: this.y },
					_closeButton: UI.UICloseButtonElement = { type: 'closeButton', x: x + 12, y: y + 12, bitmap: "button_close_up_light", bitmap2: "button_close_down_light", scale: 4, global: this.global },
					_helpButton: UI.UIButtonElement = { type: 'button', x: x + 12, y: y + 12, bitmap: "button_how_to_play_up_light", bitmap2: "button_how_to_play_down_light", scale: 4 }

				if (this.needHelpButton)
					_closeButton.x += 60

				return this.needHelpButton ? { _closeButton, _helpButton } : { _closeButton }
			}
		}
	}
}
