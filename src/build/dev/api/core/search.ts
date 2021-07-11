namespace Search {
	export interface ResultData {
		element: any
		index: number
	}
	export interface ResultItem {
		prev: ResultData,
		current: ResultData,
		next: ResultData,
	}
	export const NullItem = {
		prev: null,
		current: null,
		next: null
	}
	export enum Direction {
		NEXT, PREV
	}
	export function findIndex(index: number, length: number): { next: number, prev: number } {
		let next: number = (index + 1) % length
		let prev: number = (index + length - 1) % length
		return { next, prev }
	}
	export function find(array: Array<any>, item: any): ResultItem {
		let len = array.length, i = array.lastIndexOf(item)
		let index = findIndex(i, len)

		if (i != -1) {
			console.info(`Current: ${item} next: ${array[index.next]}$${index.next}, prev ${array[index.prev]}$${index.prev}`, `[Additional.ts] Search.find`)
			return {
				prev: { element: array[index.prev], index: index.prev },
				current: { element: item, index: i },
				next: { element: array[index.next], index: index.next },

			}
		}

		console.error(`Cannot find index of ${item}`, `[Additional.ts] Search.find`)
		return NullItem
	}
}