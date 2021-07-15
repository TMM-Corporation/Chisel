package net.minecraft.util.math;

import java.util.Iterator;
import java.util.NoSuchElementException;

import android.support.annotation.Nullable;
import net.minecraft.util.Direction;

public class BlockPos extends Vec3i {
    
    public static final BlockPos ORIGIN = new BlockPos(0, 0, 0);
    private static final int NUM_X_BITS = 1 + MathHelper.calculateLogBaseTwo(MathHelper.roundUpToPowerOfTwo(30000000));
    private static final int NUM_Z_BITS = NUM_X_BITS;
    private static final int NUM_Y_BITS = 64 - NUM_X_BITS - NUM_Z_BITS;
    private static final int Y_SHIFT = 0 + NUM_Z_BITS;
    private static final int X_SHIFT = Y_SHIFT + NUM_Y_BITS;
    private static final long X_MASK = (1L << NUM_X_BITS) - 1L;
    private static final long Y_MASK = (1L << NUM_Y_BITS) - 1L;
    private static final long Z_MASK = (1L << NUM_Z_BITS) - 1L;

    public BlockPos(int x, int y, int z, int side, Vec3d vec)
    {
        super(x, y, z, side, vec);
    }

    public BlockPos(int x, int y, int z, int side, double dx, double dy, double dz)
    {
        super(x, y, z, 0, new Vec3d(dx,dy,dz));
    }

    public BlockPos(int x, int y, int z)
    {
        super(x, y, z);
    }

    public BlockPos(double x, double y, double z)
    {
        super(x, y, z);
    }

    public BlockPos(Vec3d vec)
    {
        this(vec.xCoord, vec.yCoord, vec.zCoord);
    }

    public BlockPos(Vec3i source)
    {
        this(source.getX(), source.getY(), source.getZ());
    }

    public BlockPos add(double x, double y, double z)
    {
        return x == 0.0D && y == 0.0D && z == 0.0D ? this : new BlockPos( (double) this.getX() + x, (double) this.getY() + y, (double) this.getZ() + z);
    }

    public BlockPos add(int x, int y, int z)
    {
        return x == 0 && y == 0 && z == 0 ? this : new BlockPos(this.getX() + x, this.getY() + y, this.getZ() + z);
    }

    public BlockPos add(Vec3i vec)
    {
        return vec.getX() == 0 && vec.getY() == 0 && vec.getZ() == 0 ? this : new BlockPos(this.getX() + vec.getX(), this.getY() + vec.getY(), this.getZ() + vec.getZ());
    }

    public BlockPos subtract(Vec3i vec)
    {
        return vec.getX() == 0 && vec.getY() == 0 && vec.getZ() == 0 ? this : new BlockPos(this.getX() - vec.getX(), this.getY() - vec.getY(), this.getZ() - vec.getZ());
    }

    public BlockPos up()
    {
        return this.up(1);
    }

    public BlockPos up(int n)
    {
        return this.offset(Direction.UP, n);
    }

    public BlockPos down()
    {
        return this.down(1);
    }

    public BlockPos down(int n)
    {
        return this.offset(Direction.DOWN, n);
    }

    public BlockPos north()
    {
        return this.north(1);
    }

    public BlockPos north(int n)
    {
        return this.offset(Direction.NORTH, n);
    }

    public BlockPos south()
    {
        return this.south(1);
    }

    public BlockPos south(int n)
    {
        return this.offset(Direction.SOUTH, n);
    }

    public BlockPos west()
    {
        return this.west(1);
    }

    public BlockPos west(int n)
    {
        return this.offset(Direction.WEST, n);
    }

    public BlockPos east()
    {
        return this.east(1);
    }

    public BlockPos east(int n)
    {
        return this.offset(Direction.EAST, n);
    }

    public BlockPos offset(Direction facing)
    {
        return this.offset(facing, 1);
    }

    public BlockPos offset(Direction facing, int n)
    {
        return n == 0 ? this : new BlockPos(this.getX() + facing.getFrontOffsetX() * n, this.getY() + facing.getFrontOffsetY() * n, this.getZ() + facing.getFrontOffsetZ() * n);
    }

    public BlockPos crossProduct(Vec3i vec)
    {
        return new BlockPos(this.getY() * vec.getZ() - this.getZ() * vec.getY(), this.getZ() * vec.getX() - this.getX() * vec.getZ(), this.getX() * vec.getY() - this.getY() * vec.getX());
    }

    public long toLong()
    {
        return ( (long) this.getX() & X_MASK) << X_SHIFT | ( (long) this.getY() & Y_MASK) << Y_SHIFT | ( (long) this.getZ() & Z_MASK) << 0;
    }

    public static BlockPos fromLong(long serialized)
    {
        int i = (int) (serialized << 64 - X_SHIFT - NUM_X_BITS >> 64 - NUM_X_BITS);
        int j = (int) (serialized << 64 - Y_SHIFT - NUM_Y_BITS >> 64 - NUM_Y_BITS);
        int k = (int) (serialized << 64 - NUM_Z_BITS >> 64 - NUM_Z_BITS);
        return new BlockPos(i, j, k);
    }

    public static Iterable<BlockPos> getAllInBox(BlockPos from, BlockPos to)
    {
        final BlockPos blockpos = new BlockPos(Math.min(from.getX(), to.getX()), Math.min(from.getY(), to.getY()), Math.min(from.getZ(), to.getZ()));
        final BlockPos blockpos1 = new BlockPos(Math.max(from.getX(), to.getX()), Math.max(from.getY(), to.getY()), Math.max(from.getZ(), to.getZ()));
        return new Iterable<BlockPos>(){
            public Iterator<BlockPos> iterator(){
                return new AbstractIterator<BlockPos>(){
                    private BlockPos lastReturned;
                    protected BlockPos computeNext()
                    {
                        if (this.lastReturned == null)
                        {
                            this.lastReturned = blockpos;
                            return this.lastReturned;
                        } else if (this.lastReturned.equals(blockpos1)) {
                            return (BlockPos)this.endOfData();
                        } else {
                            int i = this.lastReturned.getX();
                            int j = this.lastReturned.getY();
                            int k = this.lastReturned.getZ();
                            if (i < blockpos1.getX())
                            {
                                ++i;
                            } else if (j < blockpos1.getY())
                            {
                                i = blockpos.getX();
                                ++j;
                            } else if (k < blockpos1.getZ())
                            {
                                i = blockpos.getX();
                                j = blockpos.getY();
                                ++k;
                            }
                            this.lastReturned = new BlockPos(i, j, k);
                            return this.lastReturned;
                        }
                    }
                };
            }
        };
    }

    /**From Google Guava (-_-) */

    private static abstract class UnmodifiableIterator<E> implements Iterator<E> {

        protected UnmodifiableIterator(){}

        @Deprecated
        @Override
        public final void remove()
        {
            throw new UnsupportedOperationException();
        }

    }

    private static abstract class AbstractIterator<E> extends UnmodifiableIterator<E> {

        private State state = State.NOT_READY;
        protected AbstractIterator(){}

        private enum State { READY, NOT_READY, DONE, FAILED }

        private @Nullable E next;

        protected abstract E computeNext();

        protected final E endOfData()
        {
            state = State.DONE; return null;
        }

        @Override
        public final boolean hasNext()
        {
            if(state == State.FAILED) throw new IllegalStateException();
            switch(state)
            {
                case DONE: return false;
                case READY: return true;
                default:
            }
            return tryToComputeNext();
        }

        private boolean tryToComputeNext()
        {
            state = State.FAILED;
            next = computeNext();
            if(state != State.DONE){ state = State.READY; return true; }
            return false;
        }

        public final E next()
        {
            if(!hasNext()) throw new NoSuchElementException();
            state = State.NOT_READY;
            E result = next;
            next = null;
            return result;
        }

    }
    
}