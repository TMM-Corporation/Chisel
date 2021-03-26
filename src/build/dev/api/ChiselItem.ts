namespace ChiselItem {
	export enum UsageMode {
		/* Shift use to open GUI, BreakBlockStart to chisel */
		Normal
	}
	export enum UseMode {
		/* Chisel a 3x1 column of blocks */
		Column,
		/* Chisel an area of alike blocks, extending 10 blocks in any direction */
		Contiguous,
		/* Chisel an area of alike blocks, extending 10 blocks along the plane of the current side */
		Contiguous_2D,
		/* Chisel a 3x3 square of blocks */
		Panel,
		/* Chisel a 1x3 row of blocks */
		Row,
		/* Chisel a single block */
		Single,
	}
	export interface DefaultData {
		durability: number
		usageMode: UsageMode
		gui: WindowShell.Group

		group: {
			name: string,
			id: number,
			selectedSlot: number
		}
	}
	export class Custom {
		data: DefaultData
		constructor(data: DefaultData) {
			this.data = data
		}
		open(player: number): boolean {
			if (Entity.getSneaking(player)) {
				this.data.gui.open()
				return true
			}
			return false
		}
	}
}