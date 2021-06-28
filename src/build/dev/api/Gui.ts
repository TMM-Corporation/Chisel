namespace GUI {
	export namespace Grid {
		export class Element {
			constructor(elements: UI.ElementSet, gridData: ElementGridData) {
				let gridElement = gridData.element
				for (let yy = 0, i = (gridData.startIndex || 0); yy < gridData.vertical.count; yy++)
					for (let xx = 0; xx < gridData.horizontal.count; xx++)
						elements[`${gridData.name}${i}`] = (() => {
							let element
							switch (gridElement.type) {
								case 'slot':
									element = Object.assign({}, gridElement, {
										x: (gridElement.x + gridElement.size * xx) + gridData.horizontal.offset,
										y: (gridElement.y + gridElement.size * yy) + gridData.vertical.offset
									})
									break
								case 'invSlot' || 'invslot':
									element = Object.assign({}, gridElement, {
										x: (gridElement.x + gridElement.size * xx) + gridData.horizontal.offset,
										y: (gridElement.y + gridElement.size * yy) + gridData.vertical.offset,
										index: i
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
							i++
							return element
						})()
			}

		}
		export interface ElementGridData {
			name: string
			horizontal: { count: number, offset: number }
			vertical: { count: number, offset: number }
			startIndex: number
			element: UI.Elements
		}
	}
}
