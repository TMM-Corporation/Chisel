namespace MinecraftUtils {

    export class Vec3i {

        public static readonly NULL_VECTOR: Vec3i = new Vec3i(0, 0, 0);
    
        constructor(protected readonly x: number, protected readonly y: number, protected readonly z: number){}
    
        public getX(): number { return this.x }
        public getY(): number { return this.y }
        public getZ(): number { return this.z }
    
    }

    /** Giant piece of shit */
    abstract class UnmodifiableIterator<E> extends java.util.Iterator<E> {
        protected constructor(){super()};
        public remove(): void {
            throw new java.lang.UnsupportedOperationException();
        }
    }
    enum AbstractIteratorState {
        READY, NOT_READY, DONE, FAILED
    }
    abstract class AbstractIterator<T> extends UnmodifiableIterator<T> {
        private state: number = AbstractIteratorState.NOT_READY;
        protected constructor(){super()};
        private State = AbstractIteratorState;
        private nextt: Nullable<T>;
        public next(): Nullable<T> {
            if(!this.hasNext()) throw new java.util.NoSuchElementException();
            this.state = this.State.NOT_READY;
            let result: T = this.nextt;
            this.nextt = null;
            return result;
        }
        protected abstract computeNext(): T;
        protected endOfData(): T {
            this.state = this.State.DONE;
            return null;
        }
        public hasNext(): boolean {
            if(!(this.state != this.State.FAILED)) throw new java.lang.IllegalStateException();
            switch(this.state){
                case this.State.DONE: return false;
                case this.State.READY: return true;
                default:
            }
            return this.tryToComputeNext();
        }
        private tryToComputeNext(): boolean {
            this.state = this.State.FAILED;
            this.nextt = this.computeNext();
            if(this.state != this.State.DONE){
                this.state = this.State.READY;
                return true;
            }
            return false;
        }
        public peek(): T {
            if(!this.hasNext()) throw new java.util.NoSuchElementException();
            return this.nextt;
        }
    }
    
    export class BlockPos extends Vec3i {
        
        public static readonly ORIGIN: BlockPos = new BlockPos(0, 0, 0);

        protected readonly x: number;
        protected readonly y: number;
        protected readonly z: number;

        constructor(x: number, y: number, z: number);
        constructor(source: number);//Entity
        constructor(source: Vec3i);

        constructor(x: number | Vec3i, y?: number, z?: number){
            if(typeof y !== "undefined" && typeof z !== "undefined"){
                super(x as number, y, z);
            } else if(typeof x === "number"){
                let pos = Entity.getPosition(x);
                return new BlockPos(pos.x, pos.y, pos.z);
            } else if(typeof x === "object" && x instanceof Vec3i){
                return new BlockPos(x.getX(), x.getY(), x.getZ());
            }
        }

        public add(x: number, y: number, z: number): BlockPos;
        public add(vec: Vec3i): BlockPos;

        public add(x: number | Vec3i, y?: number, z?: number): BlockPos {
            if(typeof x === "number"){
                return x == 0 && y == 0 && z == 0 ? this : new BlockPos(this.getX() + x, this.getY() + y, this.getZ() + z);
            } else return x.getX() == 0 && x.getY() == 0 && x.getZ() == 0 ? this : new BlockPos(this.getX() + x.getX(),
                                                                                                this.getY() + x.getY(), 
                                                                                                this.getZ() + x.getZ());
        }

        public subtract(vec: Vec3i): BlockPos {
            return vec.getX() == 0 && vec.getY() == 0 && vec.getZ() == 0 ? this : new BlockPos(this.getX() - vec.getX(), 
                                                                                                this.getY() - vec.getY(), 
                                                                                                this.getZ() - vec.getZ());
        }

        public up(): BlockPos;
        public up(n: number): BlockPos;
        public up(n?: number): BlockPos {
            if(typeof n !== "undefined"){
                return this.offset(EnumFacing.UP, n);
            } else return this.up(1);
        }

        public south(): BlockPos;
        public south(n: number): BlockPos;
        public south(n?: number): BlockPos {
            if(typeof n !== "undefined"){
                return this.offset(EnumFacing.SOUTH, n);
            } else return this.south(1);
        }

        public east(): BlockPos;
        public east(n: number): BlockPos;
        public east(n?: number): BlockPos {
            if(typeof n !== "undefined"){
                return this.offset(EnumFacing.EAST, n);
            } else return this.east(1);
        }

        public offset(facing: EnumFacing): BlockPos;
        public offset(facing: EnumFacing, n: number): BlockPos;
        public offset(facing: EnumFacing, n?: number): BlockPos {
            if(typeof n !== "undefined"){
                return n == 0 ? this : new BlockPos(this.getX() + facing.getFrontOffsetX() * n, 
                                                    this.getY() + facing.getFrontOffsetY() * n, 
                                                    this.getZ() + facing.getFrontOffsetZ() * n);
            } else return this.offset(facing, 1);
        }

        public equals(obj: any): boolean {
            if(this == obj) return true;
            else if(!(obj instanceof BlockPos)) return false;
            else {
                let pos = obj as BlockPos;
                return this.getX() != pos.getX() ? false : (this.getY() != pos.getY() ? false : this.getZ() != pos.getZ());
            }
        }

        public static getAllInBox(from: BlockPos, to: BlockPos): java.lang.Iterable<BlockPos> {
            const blockpos: BlockPos = new BlockPos(Math.min(from.getX(), to.getX()), 
                                                    Math.min(from.getY(), to.getY()), 
                                                    Math.min(from.getZ(), to.getZ()));
            const blockpos1: BlockPos = new BlockPos(Math.max(from.getX(), to.getX()), 
                                                     Math.max(from.getY(), to.getY()), 
                                                     Math.max(from.getZ(), to.getZ()));
            return new (class extends java.lang.Iterable<BlockPos> {
                public iterator(): java.util.Iterator<BlockPos> {
                    return new (class extends AbstractIterator<BlockPos> {
                        constructor(){super()};
                        private lastReturned: BlockPos;
                        protected computeNext(): BlockPos {
                            if(this.lastReturned == null){
                                this.lastReturned = blockpos;
                                return this.lastReturned;
                            } else if(this.lastReturned.equals(blockpos1)) return this.endOfData(); else {
                                let i: number = this.lastReturned.getX();
                                let j: number = this.lastReturned.getY();
                                let k: number = this.lastReturned.getZ();
                                if(i < blockpos1.getX()) ++i;
                                else if(j < blockpos1.getY()) {i = blockpos.getX(); ++j;}
                                else if(k < blockpos1.getZ()) {i = blockpos.getX(), j = blockpos.getY(); ++k;};
                                this.lastReturned = new BlockPos(i, j, k);
                                return this.lastReturned;
                            }
                        }
                    })();
                }
            })
        }

    }

    export class AxisAlignedBB {

        public readonly minX: number;
        public readonly minY: number;
        public readonly minZ: number;
        public readonly maxX: number;
        public readonly maxY: number;
        public readonly maxZ: number;

        constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number);
        constructor(pos: BlockPos);
        constructor(pos1: BlockPos, pos2: BlockPos);

        constructor(x1: number | BlockPos, y1?: number | BlockPos, z1?: number, x2?: number, y2?: number, z2?: number){
            if(typeof x1 === "number" && typeof y1 === "number" && typeof z1 === "number" &&
               typeof x2 === "number" && typeof y2 === "number" && typeof z2 === "number"){
                this.minX = Math.min(x1, x2), this.minY = Math.min(y1, y2), this.minZ = Math.min(z1, z2),
                this.maxX = Math.max(x1, x2), this.maxY = Math.max(y1, y2), this.maxZ = Math.max(z1, z2);
            } else if(typeof x1 === "object" && typeof y1 === "object"){
                if(x1 instanceof BlockPos && y1 instanceof BlockPos){
                    return new AxisAlignedBB(x1.getX(), x1.getY(), x1.getZ(), y1.getX(), y1.getY(), y1.getZ());
                }
            } else if(typeof x1 === "object" && typeof y1 !== "object" && x1 instanceof BlockPos){
                return new AxisAlignedBB(x1.getX(), x1.getY(), x1.getZ(), x1.getX() + 1, x1.getY() + 1, x1.getZ() + 1);
            }
        }

    }

    export class EnumFacingAxisDirection {

        public static readonly POSITIVE: EnumFacingAxisDirection = new EnumFacingAxisDirection(1, "Towards positive");
        public static readonly NEGATIVE: EnumFacingAxisDirection = new EnumFacingAxisDirection(-1, "Towards negative");

        private constructor(private readonly offset: number, private readonly description: string){}

        public getOffset(): number {
            return this.offset;
        }

    }

    class EnumFacingPlane {
        
        public static readonly HORIZONTAL: EnumFacingPlane = new EnumFacingPlane(0);
        public static readonly VERTICAL: EnumFacingPlane = new EnumFacingPlane(1);
        private constructor(private readonly num: number){}

    }

    export class EnumFacingAxis {
        
        public static readonly X: EnumFacingAxis = new EnumFacingAxis("x", EnumFacingPlane.HORIZONTAL);
        public static readonly Y: EnumFacingAxis = new EnumFacingAxis("y", EnumFacingPlane.VERTICAL);
        public static readonly Z: EnumFacingAxis = new EnumFacingAxis("z", EnumFacingPlane.HORIZONTAL);

        public static readonly VALUES: EnumFacingAxis[] = [EnumFacingAxis.X, EnumFacingAxis.Y, EnumFacingAxis.Z];
        private constructor(private readonly name: string, private readonly plane: EnumFacingPlane){}

        public getPlane(): EnumFacingPlane {
            return this.plane;
        }

    }

    export class EnumFacing {

        public static readonly DOWN: EnumFacing = new EnumFacing(0, 1, -1, "down", EnumFacingAxisDirection.NEGATIVE, EnumFacingAxis.Y, new Vec3i(0, -1, 0));
        public static readonly UP: EnumFacing = new EnumFacing(1, 0, -1, "up", EnumFacingAxisDirection.POSITIVE, EnumFacingAxis.Y, new Vec3i(0, 1, 0));
        public static readonly NORTH: EnumFacing = new EnumFacing(2, 3, 2, "north", EnumFacingAxisDirection.NEGATIVE, EnumFacingAxis.Z, new Vec3i(0, 0, -1));
        public static readonly SOUTH: EnumFacing = new EnumFacing(3, 2, 0, "south", EnumFacingAxisDirection.POSITIVE, EnumFacingAxis.Z, new Vec3i(0, 0, 1));
        public static readonly WEST: EnumFacing = new EnumFacing(4, 5, 1, "west", EnumFacingAxisDirection.NEGATIVE, EnumFacingAxis.X, new Vec3i(-1, 0, 0));
        public static readonly EAST: EnumFacing = new EnumFacing(5, 4, 3, "east", EnumFacingAxisDirection.POSITIVE, EnumFacingAxis.X, new Vec3i(1, 0, 0));

        public static readonly VALUES: EnumFacing[] = [EnumFacing.DOWN, EnumFacing.UP, EnumFacing.NORTH, EnumFacing.SOUTH, EnumFacing.WEST, EnumFacing.EAST];
        public static readonly HORIZONTALS: EnumFacing[] = [EnumFacing.NORTH, EnumFacing.SOUTH, EnumFacing.WEST, EnumFacing.EAST];
        public static readonly NAME_LOOKUP: java.util.Map<string, EnumFacing> = new java.util.HashMap<string, EnumFacing>();

        private constructor(private readonly index: number, private readonly opposite: number, private readonly horizontalIndex: number, private readonly name: string, private readonly axisDirection: EnumFacingAxisDirection, private readonly axis: EnumFacingAxis, private readonly directionVec: Vec3i){}

        public getAxisDirection(): EnumFacingAxisDirection {
            return this.axisDirection;
        }

        public getOpposite(): EnumFacing {
            return EnumFacing.VALUES[this.opposite];
        }

        public getFrontOffsetX(): number {
            return this.axis == EnumFacingAxis.X ? this.axisDirection.getOffset() : 0;
        }

        public getFrontOffsetY(): number {
            return this.axis == EnumFacingAxis.Y ? this.axisDirection.getOffset() : 0;
        }

        public getFrontOffsetZ(): number {
            return this.axis == EnumFacingAxis.Z ? this.axisDirection.getOffset() : 0;
        }

        public getAxis(): EnumFacingAxis {
            return this.axis;
        }

        public getDirectionVec(): Vec3i {
            return this.directionVec;
        }

    }

}