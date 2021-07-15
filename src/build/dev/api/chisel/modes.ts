namespace ChiselModes {
	export type UseModeType =
		/* Chisel a 3x1 column of blocks */
		'column' |
		/* Chisel an area of alike blocks, extending 10 blocks in any direction */
		'contiguous' |
		/* Chisel an area of alike blocks, extending 10 blocks along the plane of the current side */
		'contiguous_2d' |
		/* Chisel a 3x3 square of blocks */
		'panel' |
		/* Chisel a 1x3 row of blocks */
		'row' |
		/* Chisel a single block */
		'single'
	export enum UseMode {
		single,
		row,
		column,
		panel,
		contiguous,
		contiguous_2d,
	}
	const ChiselMode = WRAP_JAVA('com.toxesfoxes.chisel.ChiselMode')
	const BlockPos = WRAP_JAVA('net.minecraft.util.math.BlockPos')
	const Direction = WRAP_JAVA('net.minecraft.util.Direction')
	console.genTSDocFor(ChiselMode, 'ChiselMode')
	console.genTSDocFor(BlockPos, 'BlockPos')
	console.genTSDocFor(Direction, 'Direction')
	export function carveBlocks(coords: Callback.ItemUseCoordinates, item: ItemInstance, tile: Tile, playerUID: number): boolean {
		let result = false
		if (item.extra) {
			const mode = item.extra.getInt("carveMode")
			switch (mode) {
				case UseMode.single: result = Single(coords, item, tile, playerUID); break
				// case UseMode.single: result = Single(coords, item, tile, playerUID); break

				default:
					console.warn(`Carving mode '${mode}' not found`)
					break
			}
			Debug(coords, item, tile, playerUID)
		}
		return result
	}
	export function Single(coords: Callback.ItemUseCoordinates, item: ItemInstance, tile: Tile, playerUID: number) {
		const CIC = ChiselItem.Controller
		const carveResults = CIC.getCarvingBlock(playerUID, tile)

		if (carveResults.change == false)
			return false

		const bs = BlockSource.getDefaultForActor(playerUID)
		const itemUse = CIC.onUse(playerUID, item)

		if (itemUse.used) {
			Debug(coords, item, tile, playerUID)
			
			bs.setBlock(coords.x, coords.y, coords.z, carveResults.id, carveResults.data)
			SoundManager.playSoundAtBlock({ x: coords.x, y: coords.y, z: coords.z }, getSoundFromConstName(carveResults.sound), 1, getRandomArbitrary(0.7, 1), 8)
			return true
		}
		return false
	}
	export function Debug(coords: Callback.ItemUseCoordinates, item: ItemInstance, tile: Tile, playerUID: number) {
		console.debug(`[${tile.id}:${tile.data} (${Item.getName(tile.id, tile.data)})], player: ${playerUID} (${Entity.getNameTag(playerUID)}), Coords: (${JSON.stringify(coords)})`)
	}
}