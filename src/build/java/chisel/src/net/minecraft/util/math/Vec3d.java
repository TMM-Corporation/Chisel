package net.minecraft.util.math;

import android.support.annotation.Nullable;

public class Vec3d {
    
    public static final Vec3d ZERO = new Vec3d(0.0D, 0.0D, 0.0D);
    public final double xCoord;
    public final double yCoord;
    public final double zCoord;

    public Vec3d(double x, double y, double z)
    {
        this.xCoord = x;
        this.yCoord = y;
        this.zCoord = z;
    }

    public Vec3d(Vec3i vector)
    {
        this( (double) vector.getX(), (double) vector.getY(), (double) vector.getZ());
    }

    public Vec3d subtractReverse(Vec3d vec)
    {
        return new Vec3d(vec.xCoord - this.xCoord, vec.yCoord - this.yCoord, vec.zCoord - this.zCoord);
    }

    public Vec3d normalize()
    {
        double d0 = (double) Math.sqrt(this.xCoord * this.xCoord + this.yCoord * this.yCoord + this.zCoord * this.zCoord);
        return d0 < 1.0E-4D ? ZERO : new Vec3d(this.xCoord / d0, this.yCoord / d0, this.zCoord / d0);
    }

    public double dotProduct(Vec3d vec)
    {
        return this.xCoord * vec.xCoord + this.yCoord * vec.yCoord + this.zCoord * vec.zCoord;
    }

    public Vec3d crossProduct(Vec3d vec)
    {
        return new Vec3d(this.yCoord * vec.zCoord - this.zCoord * vec.yCoord, this.zCoord * vec.xCoord - this.xCoord * vec.zCoord, this.xCoord * vec.yCoord - this.yCoord * vec.xCoord);
    }

    public Vec3d subtract(Vec3d vec)
    {
        return this.subtract(vec.xCoord, vec.yCoord, vec.zCoord);
    }

    public Vec3d subtract(double x, double y, double z)
    {
        return this.addVector(-x, -y, -z);
    }

    public Vec3d add(Vec3d vec)
    {
        return this.addVector(vec.xCoord, vec.yCoord, vec.zCoord);
    }

    public Vec3d addVector(double x, double y, double z)
    {
        return new Vec3d(this.xCoord + x, this.yCoord + y, this.zCoord + z);
    }

    public double distanceTo(Vec3d vec)
    {
        double d0 = vec.xCoord - this.xCoord;
        double d1 = vec.yCoord - this.yCoord;
        double d2 = vec.zCoord - this.zCoord;
        return (double) Math.sqrt(d0 * d0 + d1 * d1 + d2 * d2);
    }

    public double squareDistanceTo(Vec3d vec)
    {
        double d0 = vec.xCoord - this.xCoord;
        double d1 = vec.yCoord - this.yCoord;
        double d2 = vec.zCoord - this.zCoord;
        return d0 * d0 + d1 * d1 + d2 * d2;
    }

    public double squareDistanceTo(double xIn, double yIn, double zIn)
    {
        double d0 = xIn - this.xCoord;
        double d1 = yIn - this.yCoord;
        double d2 = zIn - this.zCoord;
        return d0 * d0 + d1 * d1 + d2 * d2;
    }

    public Vec3d scale(double val)
    {
        return new Vec3d(this.xCoord * val, this.yCoord * val, this.zCoord * val);
    }

    public double lengthVector()
    {
        return (double) Math.sqrt(this.xCoord * this.xCoord + this.yCoord * this.yCoord + this.zCoord * this.zCoord);
    }

    public double lengthSquared()
    {
        return this.xCoord * this.xCoord + this.yCoord * this.yCoord + this.zCoord * this.zCoord;
    }

    @Nullable
    public Vec3d getIntermediateWithXValue(Vec3d vec, double x)
    {
        double d0 = vec.xCoord - this.xCoord;
        double d1 = vec.yCoord - this.yCoord;
        double d2 = vec.zCoord - this.zCoord;
        if (d0 * d0 < 1.0000000116860974E-7D) return null; else {
            double d3 = (x - this.xCoord) / d0;
            return d3 >= 0.0D && d3 <= 1.0D ? new Vec3d(this.xCoord + d0 * d3, this.yCoord + d1 * d3, this.zCoord + d2 * d3) : null;
        }
    }

    @Nullable
    public Vec3d getIntermediateWithYValue(Vec3d vec, double y)
    {
        double d0 = vec.xCoord - this.xCoord;
        double d1 = vec.yCoord - this.yCoord;
        double d2 = vec.zCoord - this.zCoord;
        if (d1 * d1 < 1.0000000116860974E-7D) return null; else {
            double d3 = (y - this.yCoord) / d1;
            return d3 >= 0.0D && d3 <= 1.0D ? new Vec3d(this.xCoord + d0 * d3, this.yCoord + d1 * d3, this.zCoord + d2 * d3) : null;
        }
    }

    @Nullable
    public Vec3d getIntermediateWithZValue(Vec3d vec, double z)
    {
        double d0 = vec.xCoord - this.xCoord;
        double d1 = vec.yCoord - this.yCoord;
        double d2 = vec.zCoord - this.zCoord;
        if (d2 * d2 < 1.0000000116860974E-7D) return null; else {
            double d3 = (z - this.zCoord) / d2;
            return d3 >= 0.0D && d3 <= 1.0D ? new Vec3d(this.xCoord + d0 * d3, this.yCoord + d1 * d3, this.zCoord + d2 * d3) : null;
        }
    }

    public boolean equals(Object obj)
    {
        if (this == obj) return true;
        else if (!(obj instanceof Vec3d)) return false; else {
            Vec3d vec3d = (Vec3d) obj;
            return Double.compare(vec3d.xCoord, this.xCoord) != 0 ? false : (Double.compare(vec3d.yCoord, this.yCoord) != 0 ? false : Double.compare(vec3d.zCoord, this.zCoord) == 0);
        }
    }

    public int hashCode()
    {
        long j = Double.doubleToLongBits(this.xCoord);
        int i = (int) (j ^ j >>> 32);
        j = Double.doubleToLongBits(this.yCoord);
        i = 31 * i + (int) (j ^ j >>> 32);
        j = Double.doubleToLongBits(this.zCoord);
        i = 31 * i + (int) (j ^ j >>> 32);
        return i;
    }

    public String toString()
    {
        return "(" + this.xCoord + ", " + this.yCoord + ", " + this.zCoord + ")";
    }

    public Vec3d rotatePitch(float pitch)
    {
        float f = (float) Math.cos(pitch);
        float f1 = (float) Math.sin(pitch);
        double d0 = this.xCoord;
        double d1 = this.yCoord * (double)f + this.zCoord * (double)f1;
        double d2 = this.zCoord * (double)f - this.yCoord * (double)f1;
        return new Vec3d(d0, d1, d2);
    }

    public Vec3d rotateYaw(float yaw)
    {
        float f = (float) Math.cos(yaw);
        float f1 = (float) Math.sin(yaw);
        double d0 = this.xCoord * (double)f + this.zCoord * (double)f1;
        double d1 = this.yCoord;
        double d2 = this.zCoord * (double)f - this.xCoord * (double)f1;
        return new Vec3d(d0, d1, d2);
    }
    
    public static Vec3d fromPitchYawVector(Vec2f p_189984_0_)
    {
        return fromPitchYaw(p_189984_0_.x, p_189984_0_.y);
    }

    public static Vec3d fromPitchYaw(float p_189986_0_, float p_189986_1_)
    {
        float f = (float) Math.cos(-p_189986_1_ * 0.017453292F - (float)Math.PI);
        float f1 = (float) Math.sin(-p_189986_1_ * 0.017453292F - (float)Math.PI);
        float f2 = (float) -Math.cos(-p_189986_0_ * 0.017453292F);
        float f3 = (float) Math.sin(-p_189986_0_ * 0.017453292F);
        return new Vec3d((double)(f1 * f2), (double)f3, (double)(f * f2));
    }

}