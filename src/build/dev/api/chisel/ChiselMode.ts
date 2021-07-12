class ChiselMode {

    private readonly localizedName: Nullable<string>
    private readonly localizedDescription: string

    public getLocalizedName(): Nullable<string> { return this.localizedName }
    public getLocalizedDescription(): string { return this.localizedDescription }

    constructor(par1: Nullable<string>, par2?: string) {
        if (par2) {
            this.localizedName = par1
            this.localizedDescription = par2
        } else return new ChiselMode(null, par1)
    }

    public getCandidates(player: number, pos: MinecraftUtils.BlockPos, side: MinecraftUtils.EnumFacing): java.lang.Iterable<MinecraftUtils.BlockPos> {
        return null
    }

    public getBounds(side: MinecraftUtils.EnumFacing): MinecraftUtils.AxisAlignedBB {
        return null
    }

}

namespace ChiselMode {

    class Node {

        constructor(private pos: MinecraftUtils.BlockPos, public distance: number) { }

        public getPos(): MinecraftUtils.BlockPos { return this.pos };
        public getDistance(): number { return this.distance };

    }

    export const CONTIGUOUS_RANGE = 10

    function getContiguousIterator(origin: MinecraftUtils.BlockPos, world: BlockSource, directionsToSearch: MinecraftUtils.EnumFacing[]): java.util.Iterator<MinecraftUtils.BlockPos> {
        const state = world.getBlock(origin.getX(), origin.getY(), origin.getZ())
        return new (class extends java.util.Iterator<MinecraftUtils.BlockPos> {
            private seen: java.util.Set<MinecraftUtils.BlockPos> = new java.util.HashSet();
            private search: java.util.Queue<Node> = new java.util.ArrayDeque();
            constructor() {
                super()
                this.search.add(new Node(origin, 0))
            }
            public hasNext(): boolean { return !this.search.isEmpty() }
            public next(): MinecraftUtils.BlockPos {
                let ret: Node = this.search.poll()
                if (ret.getDistance() < CONTIGUOUS_RANGE)
                    for (let i in directionsToSearch) {
                        let face = directionsToSearch[i],
                            bp = ret.getPos().offset(face),
                            newState = world.getBlock(bp.getX(), bp.getY(), bp.getZ())
                        if (!this.seen.contains(bp) && newState.equals(state))
                            // for(let i in MinecraftUtils.EnumFacing.VALUES){
                            // let obscureCheck = MinecraftUtils.EnumFacing.VALUES[i];
                            // obscuringPos = bp.offset(obscureCheck);
                            // TODO newState.isStateSolid(world, bp, obscureCheck.getOpposite(), BlockVoxelShape.FULL)
                            this.search.offer(new Node(bp, ret.getDistance() + 1))
                        // break;
                        // }
                        this.seen.add(bp)
                    }
                return ret.getPos()
            }
        })()
    }

    function filteredIterable(source: java.lang.Iterable<MinecraftUtils.BlockPos>, world: BlockSource, state: BlockState): java.lang.Iterable<MinecraftUtils.BlockPos> {
        return java.util.stream.StreamSupport.stream(source.spliterator(), false).filter((p: MinecraftUtils.BlockPos) => world.getBlock(p.getX(), p.getY(), p.getZ()).equals(state))
    }

    export const SINGLE: ChiselMode = new (class extends ChiselMode {
        public getCandidates(player: number, pos: MinecraftUtils.BlockPos, side: MinecraftUtils.EnumFacing): java.lang.Iterable<MinecraftUtils.BlockPos> {
            return java.util.Collections.singleton(pos)
        }
        public getBounds(side: MinecraftUtils.EnumFacing): MinecraftUtils.AxisAlignedBB {
            return new MinecraftUtils.AxisAlignedBB(0, 0, 0, 1, 1, 1)
        }
    })("Chisel a single block.")

    export const PANEL: ChiselMode = new (class extends ChiselMode {
        private readonly ONE = new MinecraftUtils.BlockPos(1, 1, 1);
        private readonly NEG_ONE = new MinecraftUtils.BlockPos(-1, -1, -1);
        public getCandidates(player: number, pos: MinecraftUtils.BlockPos, side: MinecraftUtils.EnumFacing): java.lang.Iterable<MinecraftUtils.BlockPos> {
            if (side.getAxisDirection() == MinecraftUtils.EnumFacingAxisDirection.NEGATIVE) side = side.getOpposite()
            let offset: MinecraftUtils.Vec3i = side.getDirectionVec(),
                world = BlockSource.getDefaultForActor(player)
            return filteredIterable(MinecraftUtils.BlockPos.getAllInBox(this.NEG_ONE.add(offset).add(pos), this.ONE.subtract(offset).add(pos)), world, world.getBlock(pos.getX(), pos.getY(), pos.getZ()))
        }
        public getBounds(side: MinecraftUtils.EnumFacing): MinecraftUtils.AxisAlignedBB {
            switch (side.getAxis()) {
                case MinecraftUtils.EnumFacingAxis.X: default:
                    return new MinecraftUtils.AxisAlignedBB(0, -1, -1, 1, 2, 2)
                case MinecraftUtils.EnumFacingAxis.Y:
                    return new MinecraftUtils.AxisAlignedBB(-1, 0, -1, 2, 1, 2)
                case MinecraftUtils.EnumFacingAxis.Z:
                    return new MinecraftUtils.AxisAlignedBB(-1, -1, 0, 2, 2, 1)
            }
        }
    })("Chisel a 3x3 square of blocks.")

    export const COLUMN: ChiselMode = new (class extends ChiselMode {
        public getCandidates(player: number, pos: MinecraftUtils.BlockPos, side: MinecraftUtils.EnumFacing): java.lang.Iterable<MinecraftUtils.BlockPos> {
            let facing = Math.floor(Entity.getLookAngle(player).yaw * 4.0 / 360.0 + .5) & 3
            let ret: java.util.Set<MinecraftUtils.BlockPos> = new java.util.LinkedHashSet()
            for (let i = -1; i <= 1; i++)
                if (side != MinecraftUtils.EnumFacing.DOWN && side != MinecraftUtils.EnumFacing.UP) ret.add(pos.up(i))
                else if (facing == 0 || facing == 2) ret.add(pos.south(i))
                else ret.add(pos.east(i))
            let world = BlockSource.getDefaultForActor(player)
            return filteredIterable(ret.stream(), world, world.getBlock(pos.getX(), pos.getY(), pos.getZ()))
        }
        public getBounds(side: MinecraftUtils.EnumFacing): MinecraftUtils.AxisAlignedBB {
            return PANEL.getBounds(side)
        }
        // TODO getCacheState, idk whether it is needed or not
    })("Chisel a 3x1 column of blocks.")

    export const ROW: ChiselMode = new (class extends ChiselMode {
        public getCandidates(player: number, pos: MinecraftUtils.BlockPos, side: MinecraftUtils.EnumFacing): java.lang.Iterable<MinecraftUtils.BlockPos> {
            let facing = Math.floor(Entity.getLookAngle(player).yaw * 4.0 / 360.0 + .5) & 3
            let ret: java.util.Set<MinecraftUtils.BlockPos> = new java.util.LinkedHashSet()
            for (let i = -1; i <= 1; i++)
                if (side != MinecraftUtils.EnumFacing.DOWN && side != MinecraftUtils.EnumFacing.UP) {
                    if (side == MinecraftUtils.EnumFacing.EAST || side == MinecraftUtils.EnumFacing.WEST) ret.add(pos.south(i))
                    else ret.add(pos.east(i))
                } else if (facing == 0 || facing == 2) ret.add(pos.east(i))
                else ret.add(pos.south(i))
            let world = BlockSource.getDefaultForActor(player)
            return filteredIterable(ret.stream(), world, world.getBlock(pos.getX(), pos.getY(), pos.getZ()))
        }
        public getBounds(side: MinecraftUtils.EnumFacing): MinecraftUtils.AxisAlignedBB {
            return PANEL.getBounds(side)
        }
        // getCacheState nada ili ne nada ???
    })("Chisel a 1x3 row of blocks.")

    export const CONTIGUOUS: ChiselMode = new (class extends ChiselMode {
        public getCandidates(player: number, pos: MinecraftUtils.BlockPos, side: MinecraftUtils.EnumFacing): java.lang.Iterable<MinecraftUtils.BlockPos> {
            let iterator = getContiguousIterator(pos, BlockSource.getDefaultForActor(player), MinecraftUtils.EnumFacing.VALUES)
            return new (class extends java.lang.Iterable<MinecraftUtils.BlockPos> {
                public iterator() {
                    return iterator
                }
            })()
        }
        public getBounds(side: MinecraftUtils.EnumFacing): MinecraftUtils.AxisAlignedBB {
            let r = CONTIGUOUS_RANGE
            return new MinecraftUtils.AxisAlignedBB(-r - 1, -r - 1, -r - 1, r + 2, r + 2, r + 2)
        }
    })("Chisel an area of alike blocks, extending 10 blocks in any direction")

    export const CONTIGUOUS_2D: ChiselMode = new (class extends ChiselMode {
        public getCandidates(player: number, pos: MinecraftUtils.BlockPos, side: MinecraftUtils.EnumFacing): java.lang.Iterable<MinecraftUtils.BlockPos> {
            let dirs = [...MinecraftUtils.EnumFacing.VALUES]
            dirs = dirs.splice(dirs.indexOf(side, 0), 1)
            dirs = dirs.splice(dirs.indexOf(side.getOpposite(), 0), 1)
            let iterator = getContiguousIterator(pos, BlockSource.getDefaultForActor(player), dirs)
            return new (class extends java.lang.Iterable<MinecraftUtils.BlockPos> {
                public iterator() {
                    return iterator
                }
            })()
        }
        public getBounds(side: MinecraftUtils.EnumFacing): MinecraftUtils.AxisAlignedBB {
            let r = CONTIGUOUS_RANGE
            switch (side.getAxis()) {
                case MinecraftUtils.EnumFacingAxis.X: default:
                    return new MinecraftUtils.AxisAlignedBB(0, -r - 1, -r - 1, 1, r + 2, r + 2)
                case MinecraftUtils.EnumFacingAxis.Y:
                    return new MinecraftUtils.AxisAlignedBB(-r - 1, 0, -r - 1, r + 2, 1, r + 2)
                case MinecraftUtils.EnumFacingAxis.Z:
                    return new MinecraftUtils.AxisAlignedBB(-r - 1, -r - 1, 0, r + 2, r + 2, 1)
            }
        }
    })("Contiguous (2D)", "Chisel an area of alike blocks, extending 10 blocks along the plane of the current side.")

}
