namespace CTM {
	export enum TYPE {
		random,
		ctm,
		ctmh,
		ctmv
	}
	export type StrType = "random" | "ctm" | "ctmh" | "ctmv"
	export interface Texture {

		name: string
		extension: string
		type: StrType
	}
	export namespace IVertex {
		export interface UV {
			u: number
			v: number
			scale?: number
		}

		export interface Data {
			textureIndex: number, surfacePart: number
			textures: obj,
			axisList: IAxis.List
			axis: string
		}
	}

	export namespace IAxis {
		export interface List {
			[axis: string]: { [index: number]: string }
		}

		export const CTMAxis: List = {
			y: ["x", "z"],
			z: ["x", "y"],
			x: ["z", "y"]
		}
	}

	namespace AdditionalFuncs {
		export function BLOCK(coords: Vector, group: ICRender.Group, exclude?: boolean): ICRender.CONDITION {
			return ICRender.BLOCK(coords.x || 0, coords.y || 0, coords.z || 0, group, exclude || false)
		}

		export function addCondition(render: ICRender.Model, model: BlockRenderer.Model, condition: ICRender.CONDITION): ICRender.RenderEntry {
			return render.addEntry(model).setCondition(condition)
		}

		export function renderConditions(H: ICRender.CONDITION, V: ICRender.CONDITION, D: ICRender.CONDITION): ICRender.CONDITION[] {
			const NOT = ICRender.NOT
			const AND = ICRender.AND
			return [
				AND(NOT(H), NOT(V)),
				AND(H, NOT(V)),
				AND(NOT(H), V),
				AND(H, V, NOT(D)),
				AND(H, V, D)
			]
		}

		export function addSurfacePart(mesh: RenderMesh, c: Vector, axis: IAxis.List, uv: IVertex.UV, vertexScale?: number): void {
			let surfacePart = mesh, u = uv.u, v = uv.v, scale = vertexScale || 0.5, uvScale = uv.scale || 0.25
			let axisScale0 = AdditionalFuncs.axisScaleFrom(axis, 0, scale)
			let axisScale1 = AdditionalFuncs.axisScaleFrom(axis, 1, scale)
			surfacePart.addVertex(c.x, c.y, c.z, u, v)
			surfacePart.addVertex(c.x + axisScale0[0].x, c.y + axisScale0[0].y, c.z + axisScale0[0].z, u + uvScale, v)
			surfacePart.addVertex(c.x + axisScale1[0].x, c.y + axisScale1[0].y, c.z + axisScale1[0].z, u, v + uvScale)
			surfacePart.addVertex(c.x + axisScale0[0].x, c.y + axisScale0[0].y, c.z + axisScale0[0].z, u + uvScale, v)
			surfacePart.addVertex(c.x + axisScale1[0].x, c.y + axisScale1[0].y, c.z + axisScale1[0].z, u, v + uvScale)
			surfacePart.addVertex(c.x + axisScale1[1].x, c.y + axisScale1[1].y, c.z + axisScale1[1].z, u + uvScale, v + uvScale)
		}

		export function axisScaleFrom(axisList: IAxis.List, value: number, scale: number): [normal: Vector, any: Vector] {
			let normal = {
				x: (axisList[value] === "x" ? scale : 0),
				y: (axisList[value] === "y" ? scale : 0),
				z: (axisList[value] === "z" ? scale : 0)
			}
			let any = {
				x: (axisList[0] === "x" || axisList[1] === "x" ? scale : 0),
				y: (axisList[0] === "y" || axisList[1] === "y" ? scale : 0),
				z: (axisList[0] === "z" || axisList[1] === "z" ? scale : 0)
			}
			return [normal, any]
		}

		export function createSurfaces(data: IVertex.Data, func: UV.GetData): BlockRenderer.Model {
			let mesh = new RenderMesh()
			let uvData = func(data)
			let coords3 = uvData.coords3
			mesh.setBlockTexture(uvData.texture, 0)
			coords3[data.axis] = 0
			AdditionalFuncs.addSurfacePart(mesh, coords3, data.axisList[data.axis], uvData.uv)
			coords3[data.axis] = 1
			AdditionalFuncs.addSurfacePart(mesh, coords3, data.axisList[data.axis], uvData.uv)
			return new BlockRenderer.Model(mesh)
		}

		export function createModel(group: ICRender.Group, textures: obj, uvTexture: UV.GetData): ICRender.Model {
			const render = new ICRender.Model()
			const BLOCK = AdditionalFuncs.BLOCK
			const CTMAxis = IAxis.CTMAxis
			let coords1, coords2, i = 0, j = 0

			for (let axis in CTMAxis) {
				// creating surfrace parts
				for (i = 0; i < 4; i++) {
					coords1 = {}
					coords2 = {}
					coords1[CTMAxis[axis][0]] = i & 1 ? 1 : -1
					coords2[CTMAxis[axis][1]] = i >> 1 ? 1 : -1
					let renderConditions = AdditionalFuncs.renderConditions(
						BLOCK(coords1, group),
						BLOCK(coords2, group),
						BLOCK({
							x: coords1.x || coords2.x,
							y: coords1.y || coords2.y,
							z: coords1.z || coords2.z
						}, group)
					)
					// adding 5 surfaces with textures texture_j.png in original
					for (j = 0; j < 5; j++)
						AdditionalFuncs.addCondition(render,
							AdditionalFuncs.createSurfaces({
								axis: axis, axisList: CTMAxis, textureIndex: j, surfacePart: i, textures
							}, uvTexture), renderConditions[j])
				}
			}
			return render
		}
	}
	export namespace UV {
		export type Condition = { u: number, v: number }
		export type Data = {
			texture: string,
			uv: { u: number, v: number, scale: number },
			coords3: Vector
		}
		export interface GetData {
			(data: IVertex.Data): UV.Data
		}
	}

	export namespace setItemModel {
		export function setDefaultModel(id: number, data: number, texture: string): ItemModel {
			const render = new ICRender.Model()
			render.addEntry(BlockRenderer.createTexturedBlock([[texture, 0]]))
			return ItemModel.getFor(id, data).setModel(render)
		}

		export function setModelFromRender(id: number, data: number, render: ICRender.Model): ItemModel {
			return ItemModel.getFor(id, data).setModel(render)
		}
	}

	export namespace setBlockModel {
		export function setDefaultModel(id: number, data: number, model: ICRender.Model): void {
			BlockRenderer.setStaticICRender(id, data, model)
		}
	}

	export function addToGroup(id: number, data: number, groupName?: string): ICRender.Group {
		const group = ICRender.getGroup(groupName || ("CTM_" + id + ":" + data))
		group.add(id, data)
		return group
	}

	export namespace DefaultCTM {
		enum CTMTextures {
			Normal,
			Vertical,
			Horizontal,
			Center,
			Full
		}
		export type defaultTextures = [base: string, ctm: string]
		export function getTextureAndUV(data: IVertex.Data): UV.Data {
			let uCond = data.surfacePart & 1,
				vCond = data.surfacePart >> 1,
				t = data.textureIndex,
				textures = data.textures,
				texture, scale

			let u = uCond ? 0.5 : 0, v = vCond ? 0.5 : 0
			let coords3 = { x: 0, y: 0, z: 0 }

			coords3[data.axisList[data.axis][0]] = u
			coords3[data.axisList[data.axis][1]] = v
			if (t == 0)
				texture = textures[0], scale = 0.5
			else {
				texture = textures[1]
				scale = 0.25
				u = uCond ? 0.25 : 0
				v = vCond ? 0.25 : 0
				v += (t == CTMTextures.Vertical || t == CTMTextures.Center) ? 0.5 : 0
				u += (t == CTMTextures.Horizontal || t == CTMTextures.Center) ? 0.5 : 0
			}
			return {
				texture: texture,
				uv: { u: u, v: v, scale: scale },
				coords3: coords3
			}
		}
		export function createModel(group: ICRender.Group, textures: defaultTextures): ICRender.Model {
			return AdditionalFuncs.createModel(group, textures, getTextureAndUV)
		}
	}
	// TODO: Rework this lol
	export namespace HorizontalCTM {
		enum CTMTextures {
			Top,
			DirectionFull,
			DirectionStart,
			DirectionEnd,
			Single
		}
		export type defaultTextures = [top: string, ctm: string]
		export function createModel(group: ICRender.Group, textures: defaultTextures): ICRender.Model {
			const render = new ICRender.Model()
			let mesh = new RenderMesh()
			mesh.setBlockTexture(textures[1], 0)
			addSurface(mesh, { x: 1, y: 0, z: 0 }, IAxis.CTMAxis.x, { u: 0, v: 0 })
			addSurface(mesh, { x: 0, y: 0, z: 0 }, IAxis.CTMAxis.x, { u: 0, v: 0 })
			addSurface(mesh, { x: 0, y: 0, z: 1 }, IAxis.CTMAxis.z, { u: 0, v: 0 })
			addSurface(mesh, { x: 0, y: 0, z: 0 }, IAxis.CTMAxis.z, { u: 0, v: 0 })
			addSurface(mesh, { x: 0, y: 1, z: 0 }, IAxis.CTMAxis.y, { u: 0, v: 0 })
			addSurface(mesh, { x: 0, y: 0, z: 0 }, IAxis.CTMAxis.y, { u: 0, v: 0 })
			render.addEntry(new BlockRenderer.Model(mesh))
			return render
		}
		export function addSurface(mesh: RenderMesh, c: Vector, axis: IAxis.List, uv: IVertex.UV, vertexScale?: number): void {
			let surfacePart = mesh, u = uv.u, v = uv.v, scale = vertexScale || 1, uvScale = uv.scale || 0.5
			let axisScale0 = AdditionalFuncs.axisScaleFrom(axis, 0, scale)
			let axisScale1 = AdditionalFuncs.axisScaleFrom(axis, 1, scale)
			surfacePart.addVertex(c.x, c.y, c.z, u, v)
			surfacePart.addVertex(c.x + axisScale0[0].x, c.y + axisScale0[0].y, c.z + axisScale0[0].z, u + uvScale, v)
			surfacePart.addVertex(c.x + axisScale1[0].x, c.y + axisScale1[0].y, c.z + axisScale1[0].z, u, v + uvScale)
			surfacePart.addVertex(c.x + axisScale0[0].x, c.y + axisScale0[0].y, c.z + axisScale0[0].z, u + uvScale, v)
			surfacePart.addVertex(c.x + axisScale1[0].x, c.y + axisScale1[0].y, c.z + axisScale1[0].z, u, v + uvScale)
			surfacePart.addVertex(c.x + axisScale1[1].x, c.y + axisScale1[1].y, c.z + axisScale1[1].z, u + uvScale, v + uvScale)
		}
	}
}
