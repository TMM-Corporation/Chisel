package com.toxesfoxes.chisel;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.Queue;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.zhekasmirnov.apparatus.adapter.innercore.game.block.BlockState;
import com.zhekasmirnov.apparatus.mcpe.NativeBlockSource;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI.Entity;

import android.support.annotation.Nullable;

import net.minecraft.util.math.AxisAlignedBB;
import net.minecraft.util.math.BlockPos;
import net.minecraft.util.math.Vec3i;

import net.minecraft.util.Direction;
import net.minecraft.util.Direction.Axis;
import net.minecraft.util.Direction.AxisDirection;

public class ChiselMode extends AbstractChiselMode {

    @Override
    public Iterable<BlockPos> getCandidates(long player, BlockPos pos, Direction side)
    {
        return null;
    }

    @Override
    public AxisAlignedBB getBounds(Direction side)
    {
        return null;
    }

    @Override
    public String name()
    {
        return null;
    }
    
    @Override
    public long[] getCacheState(BlockPos origin, Direction side)
    {
        return super.getCacheState(origin, side);
    }

    private static class Node {

        private BlockPos pos;
        private int distance;
        
        public Node(BlockPos pos, int distance)
        {
            this.pos = pos;
            this.distance = distance;
        }

        public BlockPos getPos()
        {
            return this.pos;
        }

        public int getDistance()
        {
            return this.distance;
        }

    }

    public static final int CONTIGUOUS_RANGE = 10;

    private static Iterator<BlockPos> getContiguousIterator(BlockPos origin, NativeBlockSource world, Direction[] directionsToSearch)
    {
        final BlockState state = world.getBlock(origin.getX(), origin.getY(), origin.getZ());
        return new Iterator<BlockPos>()
        {

            private Set<BlockPos> seen = new HashSet<>();
            private Queue<Node> search = new ArrayDeque<>();
            {
                seen.add(origin);
                search.add(new Node(origin, 0));
            }

            @Override
            public boolean hasNext()
            {
                return !search.isEmpty();
            }

            @Override
            public BlockPos next()
            {
                Node ret = search.poll();
                if(ret.getDistance() < CONTIGUOUS_RANGE)
                {
                    for(Direction face : directionsToSearch)
                    {
                        BlockPos bp = ret.getPos().offset(face);
                        if(!seen.contains(bp) && world.getBlock(bp.getX(), bp.getY(), bp.getZ()).equals(state))
                        {
                            search.offer(new Node(bp, ret.getDistance() + 1));
                        }
                        seen.add(bp);
                    }
                }
                return ret.getPos();
            }

        };
    }

    private final String localizedName;
    private final String localizedDescription;

    public final String getLocalizedName()
    {
        return localizedName;
    }

    public final String getLocalizedDescription()
    {
        return localizedDescription;
    }

    private ChiselMode(String desc)
    {
        this(null, desc);
    }

    private ChiselMode(@Nullable String name, String desc)
    {
        this.localizedName = name;
        this.localizedDescription = desc;
    }

    private static Iterable<BlockPos> filteredIterable(Stream<BlockPos> source, NativeBlockSource world, BlockState state)
    {
        return source.filter(p -> world.getBlock(p.getX(), p.getY(), p.getZ()).equals(state))::iterator;
    }

    private static Direction getEntityHorizontalFacing(long entity)
    {
        return Direction.getHorizontal((int)Math.floor((double)(Entity.getYaw(entity) * 4.0F / 360.0F) + 0.5D) & 3);
    }

    public static final ChiselMode SINGLE = new ChiselMode("Chisel a single block.")
    {

        public Iterable<BlockPos> getCandidates(long player, BlockPos pos, Direction side)
        {
            return Collections.singleton(pos);
        }

        @Override
        public AxisAlignedBB getBounds(Direction side)
        {
            return new AxisAlignedBB(0, 0, 0, 1, 1, 1);
        }
        
        @Override
        public String name()
        {
            return "SINGLE";
        }

    };

    public static final ChiselMode PANEL = new ChiselMode("Chisel a 3x3 square of blocks.")
    {

        private final BlockPos ONE = new BlockPos(1, 1, 1);
        private final BlockPos NEG_ONE = new BlockPos(-1, -1, -1);

        public Iterable<BlockPos> getCandidates(long player, BlockPos pos, Direction side)
        {
            if(side.getAxisDirection() == AxisDirection.NEGATIVE)
            {
                side = side.getOpposite();
            }
            Vec3i offset = side.getDirectionVec();
            NativeBlockSource world = NativeBlockSource.getDefaultForActor(player);
            return filteredIterable(BlockPos.getAllInBox(NEG_ONE.add(offset).add(pos), ONE.subtract(offset).add(pos)), world, world.getBlock(pos.getX(), pos.getY(), pos.getZ()));
        }

        @Override
        public AxisAlignedBB getBounds(Direction side)
        {
            switch(side.getAxis())
            {
                case X: default:
                    return new AxisAlignedBB(0, -1, -1, 1, 2, 2);
                case Y:
                    return new AxisAlignedBB(-1, 0, -1, 2, 1, 2);
                case Z:
                    return new AxisAlignedBB(-1, -1, 0, 2, 2, 1);
            }
        }

        @Override
        public String name()
        {
            return "PANEL";
        }

    };

    public static final ChiselMode COLUMN = new ChiselMode("Chisel a 3x1 column of blocks.")
    {

        public Iterable<BlockPos> getCandidates(long player, BlockPos pos, Direction side)
        {
            int facing = (int) Math.floor(Entity.getYaw(player) * 4.0F / 360.0F + 0.5D) & 3;
            Set<BlockPos> ret = new LinkedHashSet<>();
            for(int i = -1; i <= 1; i++)
            {
                if(side != Direction.DOWN && side != Direction.UP)
                {
                    ret.add(pos.up(i));
                } else {
                    if(facing == 0 || facing == 2)
                    {
                        ret.add(pos.south(i));
                    } else {
                        ret.add(pos.east(i));
                    }
                }
            }
            NativeBlockSource world = NativeBlockSource.getDefaultForActor(player);
            return filteredIterable(ret.stream(), world, world.getBlock(pos.getX(), pos.getY(), pos.getZ()));
        }

        @Override
        public AxisAlignedBB getBounds(Direction side)
        {
            return PANEL.getBounds(side);
        }

        @Override
        public String name()
        {
            return "COLUMN";
        }

        @Override
        public long[] getCacheState(BlockPos origin, Direction side)
        {
            long[] s = super.getCacheState(origin, side);
            s[s.length] = getEntityHorizontalFacing(Player.get()).ordinal();
            return s;
        }

    };

    public static final ChiselMode ROW = new ChiselMode("Chisel a 1x3 row of blocks.")
    {

        public Iterable<BlockPos> getCandidates(long player, BlockPos pos, Direction side)
        {
            int facing = (int) Math.floor(Entity.getYaw(player) * 4.0F / 360.0F + 0.5D) & 3;
            Set<BlockPos> ret = new LinkedHashSet<>();
            for(int i = -1; i <= 1; i++)
            {
                if(side != Direction.DOWN && side != Direction.UP)
                {
                    if(side == Direction.EAST || side == Direction.WEST)
                    {
                        ret.add(pos.south(i));
                    } else {
                        ret.add(pos.east(i));
                    }
                } else {
                    if(facing == 0 || facing == 2)
                    {
                        ret.add(pos.east(i));
                    } else {
                        ret.add(pos.south(i));
                    }
                }
            }
            NativeBlockSource world = NativeBlockSource.getDefaultForActor(player);
            return filteredIterable(ret.stream(), world, world.getBlock(pos.getX(), pos.getY(), pos.getZ()));
        }

        @Override
        public AxisAlignedBB getBounds(Direction side)
        {
            return PANEL.getBounds(side);
        }

        @Override
        public String name()
        {
            return "ROW";
        }

        @Override
        public long[] getCacheState(BlockPos origin, Direction side)
        {
            return COLUMN.getCacheState(origin, side);
        }
        
    };

    public static final ChiselMode CONTIGUOUS = new ChiselMode("Chisel an area of alike blocks, extending 10 blocks in any direction.")
    {

        public Iterable<? extends BlockPos> getCandidates(long player, BlockPos pos, Direction side)
        {
            return () -> getContiguousIterator(pos, NativeBlockSource.getDefaultForActor(player), Direction.values());
        }

        @Override
        public AxisAlignedBB getBounds(Direction side)
        {
            int r = CONTIGUOUS_RANGE;
            return new AxisAlignedBB(-r - 1, -r - 1, -r - 1, r + 2, r + 2, r + 2);
        }

        @Override
        public String name()
        {
            return "CONTIGUOUS";
        }

    };

    public static final ChiselMode CONTIGUOUS_2D = new ChiselMode("Contiguous (2D)", "Chisel an area of alike blocks, extending 10 blocks along the plane of the current side.")
    {

        public Iterable<? extends BlockPos> getCandidates(long player, BlockPos pos, Direction side)
        {
            Direction[] neededSides = Arrays.asList(Direction.values())
                                            .stream()
                                            .filter(dir -> dir != side && dir != side.getOpposite())
                                            .collect(Collectors.toList())
                                            .toArray();
            return () -> getContiguousIterator(pos, NativeBlockSource.getDefaultForActor(player), neededSides);
        }

        @Override
        public AxisAlignedBB getBounds(Direction side)
        {
            int r = CONTIGUOUS_RANGE;
            switch(side.getAxis())
            {
                case X: default:
                    return new AxisAlignedBB(0, -r - 1, -r - 1, 1, r + 2, r + 2);
                case Y:
                    return new AxisAlignedBB(-r - 1, 0, -r - 1, r + 2, 1, r + 2);
                case Z:
                    return new AxisAlignedBB(-r - 1, -r - 1, 0, r + 2, r + 2, 1);
            }
        }

        @Override
        public String name()
        {
            return "CONTIGUOUS_2D";
        }

    };
    
}