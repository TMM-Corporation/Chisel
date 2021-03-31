#include <stdlib.h>

#ifndef NATIVE_PLAYER_H
#define NATIVE_PLAYER_H

class Player
{
public:
	void startSwimming();
	void stopSwimming();
	void setSleeping(bool value);
	bool isSleeping() const;
	bool isBouncing() const;
	bool isJumping() const;
	bool isBlocking() const;
	bool isHurt() const;
	bool isSleepingLongEnough() const;
	bool isShootable() const;
	bool isHungry() const;
	bool isInRaid() const;
	bool isImmobile() const;
	bool isSlowedByItemUse() const;
	int64_t getSleepTimer() const;
};

class ServerPlayer : public Player
{
public:
};

class LocalPlayer : public Player
{
};

#endif //NATIVE_PLAYER_H