/**
 * 
 */
class Rotations {
	get ROTATE_NONE(): Matrix {
		return [
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		]
	}

	get ROTATE_90Y(): Matrix {
		return [
			0, 0, -1,
			0, 1, 0,
			1, 0, 0
		]
	}
	get ROTATE_180Y(): Matrix {
		return [
			-1, 0, 0,
			0, 1, 0,
			0, 0, -1
		]
	}
	get ROTATE_270Y(): Matrix {
		return [
			0, 0, 1,
			0, 1, 0,
			-1, 0, 0
		]
	}

	get ROTATE_90X(): Matrix {
		return [
			1, 0, 0,
			0, 0, -1,
			0, 1, 0
		]
	}
	get ROTATE_180X(): Matrix {
		return [
			1, 0, 0,
			0, -1, 0,
			0, 0, -1
		]
	}
	get ROTATE_270X(): Matrix {
		return [
			1, 0, 0,
			0, 0, 1,
			0, -1, 0
		]
	}

	get ROTATE_90Z(): Matrix {
		return [
			0, -1, 0,
			1, 0, 0,
			0, 0, 1
		]
	}
	get ROTATE_180Z(): Matrix {
		return [
			-1, 0, 0,
			0, -1, 0,
			0, 0, 1
		]
	}
	get ROTATE_270Z(): Matrix {
		return [
			0, 1, 0,
			-1, 0, 0,
			0, 0, 1
		]
	}

	get ROTATE_360(): MatrixArray {
		return [
			this.ROTATE_NONE,
			this.ROTATE_90Y,
			this.ROTATE_180Y,
			this.ROTATE_270Y,
			this.ROTATE_90X,
			this.ROTATE_180X,
		]
	}

	get ROTATE_RANDOM(): MatrixArray {
		return this.ROTATE_ALL
	}
	get ROTATE_ALL(): MatrixArray {
		return [
			this.ROTATE_180X,
			this.ROTATE_180Y,
			this.ROTATE_180Z,
			this.ROTATE_270X,
			this.ROTATE_270Y,
			this.ROTATE_270Z,
			this.ROTATE_90X,
			this.ROTATE_90Y,
			this.ROTATE_90Z,
			this.ROTATE_NONE
		]
	}
	get ROTATE_X(): MatrixArray {
		return [
			this.ROTATE_NONE,
			this.ROTATE_90X,
			this.ROTATE_180X,
			this.ROTATE_270X
		]
	}
	get ROTATE_Y(): MatrixArray {
		return [
			this.ROTATE_NONE,
			this.ROTATE_90Y,
			this.ROTATE_180Y,
			this.ROTATE_270Y
		]
	}
	get ROTATE_Z(): MatrixArray {
		return [
			this.ROTATE_NONE,
			this.ROTATE_90Z,
			this.ROTATE_180Z,
			this.ROTATE_270Z
		]
	}

	get MIRROR_X(): Matrix {
		return [
			-1, 0, 0,
			0, 1, 0,
			0, 0, 1
		]
	}
	get MIRROR_Y(): Matrix {
		return [
			1, 0, 0,
			0, -1, 0,
			0, 0, 1
		]
	}
	get MIRROR_Z(): Matrix {
		return [
			1, 0, 0,
			0, 1, 0,
			0, 0, -1
		]
	}
}


interface ProcessFunction {
	(coords: Vector): void
}
interface EntityRotaion {
	yaw: number,
	pitch: number,
	rotation: number
}
interface FixedLengthArray<T extends any, L extends number> extends Array<T> {
	0: T
	length: L
}

type Matrix = FixedLengthArray<number, 9>
type MatrixArray = Matrix[]

class MatrixRotate {
	private rotates = []
	constructor(rotation: any) {
		if (rotation)
			if (rotation instanceof Array && (rotation[0] instanceof Array || rotation[0] instanceof MatrixRotate))
				this.addRotates(rotation)
			else
				this.addRotate(rotation)
	}
	addRotate(matrix: Matrix): void {
		for (let i = 0; i < 9; i++)
			if (Math.abs(matrix[i]) > 1)
				throw "Not normal matrix"

		this.rotates.push(matrix)
	}
	addRotates(rotates: MatrixArray): void {
		for (let i = 0; i < rotates.length; i++)
			this.addRotate(rotates[i])
	}
	get() {
		return this.rotates
	}
	getPosition(x: number, y: number, z: number, rotation: number): Vector {
		let dx = x * this.rotates[rotation][0] + y * this.rotates[rotation][1] + z * this.rotates[rotation][2]
		let dy = x * this.rotates[rotation][3] + y * this.rotates[rotation][4] + z * this.rotates[rotation][5]
		let dz = x * this.rotates[rotation][6] + y * this.rotates[rotation][7] + z * this.rotates[rotation][8]
		x = dx
		y = dy
		z = dz
		return { x: x, y: y, z: z }
	}
	radianToDegrees(radian: number): number {
		return radian * (180 / Math.PI)
	}
	getEntityRotation(entity: number, isFull: boolean): EntityRotaion {
		let angle = Entity.getLookAngle(entity)
		let pitch = this.radianToDegrees(angle.pitch)
		let yaw = this.radianToDegrees(angle.yaw)
		let rotation = 0

		if (isFull) {
			if (pitch > 45) rotation = 4
			if (pitch < -45) rotation = 5
			return { yaw: yaw, pitch: pitch, rotation: rotation }
		}

		rotation = Math.floor((yaw - 45) % 360 / 90) + 1
		rotation = [0, 1, 2, 3][rotation]
		return { yaw: yaw, pitch: pitch, rotation: rotation }
	}
	RotateVectors(playerUID: number, blocks: Vector[], coords: Callback.ItemUseCoordinates): Vector[] {
		let newBlocks: Vector[] = []
		blocks.forEach(block => {
			let x = coords.relative.x + block.x
			let y = coords.relative.y + block.y
			let z = coords.relative.z + block.z
			let coordsNew = this.getPosition(x, y, z, this.getEntityRotation(playerUID, true).rotation)
			newBlocks.push({ x: coordsNew.x, y: coordsNew.y, z: coordsNew.z })
		})
		return newBlocks
	}
}
