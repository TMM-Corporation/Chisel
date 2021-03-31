
#include <hook.h>
#include <mod.h>
#include <logger.h>
#include <symbol.h>

#include <nativejs.h>

#include "shared_headers/options.h"
#include "shared_headers/player.h"

// modules are main structural units of native libraries, all initialization must happen inside of them
class MainModule : public Module
{
public:
	MainModule(const char *id) : Module(id){};

	virtual void initialize()
	{
		// any HookManager::addCallback calls must be in initialize method of a module
		// any other initialization also highly recommended to happen here _ZNK4hbui7Feature9isEnabledEv
		// 08289E62 aIsPublish is_publish
		// HookManager::addCallback(SYMBOL("mcpe", "_ZN4Json5ValueC2Eb"), LAMBDA((), { return false; }, ), HookManager::CONTROLLER | HookManager::CALL | HookManager::REPLACE | HookManager::RESULT);
		// HookManager::addCallback(SYMBOL("mcpe", "_ZN7Options26getDevEnableProfilerOutputEv"), LAMBDA((), { return true; }, ), HookManager::CONTROLLER | HookManager::CALL | HookManager::REPLACE | HookManager::RESULT);
		// HookManager::addCallback(SYMBOL("mcpe", "_ZNK7Options17getDevRenderPathsEv"), LAMBDA((), { return true; }, ), HookManager::CONTROLLER | HookManager::CALL | HookManager::REPLACE | HookManager::RESULT);
		// HookManager::addCallback(SYMBOL("mcpe", "_ZNK13DebugEndPoint9isEnabledEv"), LAMBDA((), { return true; }, ), HookManager::CONTROLLER | HookManager::CALL | HookManager::REPLACE | HookManager::RESULT);
		// HookManager::addCallback(
		// 	SYMBOL("mcpe", "_ZN10ContentLog10writeToLogE7LogArea8LogLevelRSt9__va_list"),
		// 	LAMBDA((LogArea, LogLevel, std::__va_list &), {

		// 	}, ),
		// 	HookManager::CONTROLLER | HookManager::CALL | HookManager::REPLACE | HookManager::RESULT);
	}
};
class ClientInstance
{
public:
	Options *getOptions() const;
};
namespace GlobalContext
{
	ServerPlayer *getServerPlayer();
	ClientInstance *getMinecraftClient();
};

class OtherModule : public Module
{
public:
	OtherModule(Module *parent, const char *id) : Module(parent, id){};
};

// entry point for a native library
// only one MAIN {} allowed per library
MAIN
{
	// create all modules
	Module *main_module = new MainModule("sample_library");
	// to create module hierarchy, create modules with additional parent parameter in constructor
	new OtherModule(main_module, "sample_library.other_module");
}

JS_MODULE_VERSION(SampleNativeModule, 1)
JS_MODULE_VERSION(PlayerModule, 1)
JS_MODULE_VERSION(OptionsModule, 1)

JS_EXPORT(
	SampleNativeModule, hello, "I(II)", (JNIEnv * env, int value1, int value2) {
		return NativeJS::wrapIntegerResult(value1 + value2);
	});

// JS_EXPORT(
// 	PlayerModule, setSleeping, "V(B)", (JNIEnv * env, bool value) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			player->setSleeping(value);
// 		return 0;
// 	});
// JS_EXPORT(
// 	PlayerModule, startSwimming, "V()", (JNIEnv * env) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			player->startSwimming();
// 		return 0;
// 	});
// JS_EXPORT(
// 	PlayerModule, isSleeping, "I()", (JNIEnv * env) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			return NativeJS::wrapIntegerResult(player->isSleeping());
// 		return 0;
// 	});

JS_EXPORT(
	OptionsModule, getUIProfile, "I()", (JNIEnv * env) {
		Options *options = GlobalContext::getMinecraftClient()->getOptions();
		return NativeJS::wrapIntegerResult(options->getUIProfile());
	});
JS_EXPORT(
	OptionsModule, setDevShowDevConsoleButton, "V(B)", (JNIEnv * env, bool value) {
		Options *options = GlobalContext::getMinecraftClient()->getOptions();
		options->setDevShowDevConsoleButton(value);
		return 0;
	});
JS_EXPORT(
	OptionsModule, setDevRenderBoundingBoxes, "V(B)", (JNIEnv * env, bool value) {
		Options *options = GlobalContext::getMinecraftClient()->getOptions();
		options->setDevRenderBoundingBoxes(value);
		return 0;
	});
JS_EXPORT(
	OptionsModule, setDevFindMobs, "V(B)", (JNIEnv * env, bool value) {
		Options *options = GlobalContext::getMinecraftClient()->getOptions();
		options->setDevFindMobs(value);
		return 0;
	});
JS_EXPORT(
	OptionsModule, setDevDisplayTreatmentPanel, "V(B)", (JNIEnv * env, bool value) {
		Options *options = GlobalContext::getMinecraftClient()->getOptions();
		options->setDevDisplayTreatmentPanel(value);
		return 0;
	});
JS_EXPORT(
	OptionsModule, setDevRenderCoordinateSystems, "V(B)", (JNIEnv * env, bool value) {
		Options *options = GlobalContext::getMinecraftClient()->getOptions();
		options->setDevRenderCoordinateSystems(value);
		return 0;
	});

// JS_EXPORT(
// 	PlayerModule, isBouncing, "I()", (JNIEnv * env) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			return NativeJS::wrapIntegerResult(player->isBouncing());
// 		return 0;
// 	});
// JS_EXPORT(
// 	PlayerModule, isJumping, "I()", (JNIEnv * env) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			return NativeJS::wrapIntegerResult(player->isJumping());
// 		return 0;
// 	});
// JS_EXPORT(
// 	PlayerModule, isBlocking, "I()", (JNIEnv * env) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			return NativeJS::wrapIntegerResult(player->isBlocking());
// 		return 0;
// 	});
// JS_EXPORT(
// 	PlayerModule, isHurt, "I()", (JNIEnv * env) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			return NativeJS::wrapIntegerResult(player->isHurt());
// 		return 0;
// 	});
// JS_EXPORT(
// 	PlayerModule, isSleepingLongEnough, "I()", (JNIEnv * env) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			return NativeJS::wrapIntegerResult(player->isSleepingLongEnough());
// 		return 0;
// 	});
// JS_EXPORT(
// 	PlayerModule, isShootable, "I()", (JNIEnv * env) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			return NativeJS::wrapIntegerResult(player->isShootable());
// 		return 0;
// 	});
// JS_EXPORT(
// 	PlayerModule, isHungry, "I()", (JNIEnv * env) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			return NativeJS::wrapIntegerResult(player->isHungry());
// 		return 0;
// 	});
// JS_EXPORT(
// 	PlayerModule, isInRaid, "I()", (JNIEnv * env) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			return NativeJS::wrapIntegerResult(player->isInRaid());
// 		return 0;
// 	});
// JS_EXPORT(
// 	PlayerModule, isImmobile, "I()", (JNIEnv * env) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			return NativeJS::wrapIntegerResult(player->isImmobile());
// 		return 0;
// 	});
// JS_EXPORT(
// 	PlayerModule, isSlowedByItemUse, "I()", (JNIEnv * env) {
// 		Player *player = GlobalContext::getServerPlayer();
// 		if (player != nullptr)
// 			return NativeJS::wrapIntegerResult(player->isSlowedByItemUse());
// 		return 0;
// 	});
// native js signature rules:
/* signature represents parameters and return type, RETURN_TYPE(PARAMETERS...) example: S(OI)
	return types:
		V - void      - return 0
		I - long int  - wrapIntegerResult
		F - double    - wrapDoubleResult
		S - string    - wrapStringResult
		O - object    - wrapObjectResult
	parameter types:
		I - int (4 bits) 
		L - long (8 bits)
		F - float (4 bits)
		D - double (8 bits)
		B - boolean (1 bit)
		C - char (1 bit)
	as seen, basic call functions cannot receive string and objects for sake of performance, so complex functions come in place
	in case of complex functions parameters are ignored
	JNIEnv* is always passed as first parameter
*/