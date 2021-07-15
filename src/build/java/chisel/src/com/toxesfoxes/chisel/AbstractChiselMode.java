package com.toxesfoxes.chisel;

import net.minecraft.util.math.AxisAlignedBB;
import net.minecraft.util.math.BlockPos;

import java.util.Locale;

import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI.Translation;

import net.minecraft.util.Direction;

public abstract class AbstractChiselMode {
    
    public abstract Iterable<BlockPos> getCandidates(long player, BlockPos pos, Direction side);

    public abstract AxisAlignedBB getBounds(Direction side);

    public abstract String name();

    public String getUnlocName()
    {
        return "chisel.mode." + name().toLowerCase(Locale.ROOT);
    }

    public String getUnlocDescription()
    {
        return getUnlocName() + ".desc";
    }

    public String getLocalizedName()
    {
        return Translation.translate(getUnlocName());
    }

    public String getLocalizedDescription()
    {
        return Translation.translate(getUnlocDescription());
    }

    public long[] getCacheState(BlockPos origin, Direction side)
    {
        return new long[] { origin.toLong(), side.ordinal() };
    }
    
}