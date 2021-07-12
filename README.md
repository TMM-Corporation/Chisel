# Chisel
Chisel PE mod by TooManyMods

### GitHub
![GitHub repo size](https://img.shields.io/github/repo-size/ToxesFoxes/Chisel?label=Вес%20Репозитория&style=flat-square)
![GitHub all releases](https://img.shields.io/github/downloads/ToxesFoxes/Chisel/total?label=Загрузок&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues-raw/ToxesFoxes/Chisel?label=Открытых%20проблем&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues-closed-raw/ToxesFoxes/Chisel?label=Закрытых%20проблем&style=flat-square)

![GitHub](https://img.shields.io/github/license/ToxesFoxes/Chisel?label=Лицензия&style=flat-square)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/ToxesFoxes/Chisel?include_prereleases&label=Последняя%20Версия&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/ToxesFoxes/Chisel?label=Последнее%20изменение&style=flat-square)
<!-- ### ICMods
![](https://img.shields.io/badge/dynamic/json?color=green&label=Версия&query=%24.version&url=https%3A%2F%2Ficmods.mineprogramming.org%2Fapi%2Fdescription.php%3Fid%3D420?style=for-the-badge) 
![](https://img.shields.io/badge/dynamic/json?color=green&label=Понравилось&query=%24.likes&url=https%3A%2F%2Ficmods.mineprogramming.org%2Fapi%2Fdescription.php%3Fid%3D420?style=for-the-badge) 
![](https://img.shields.io/badge/dynamic/json?color=green&label=Последнее%20обновление&query=%24.last_update&url=https%3A%2F%2Ficmods.mineprogramming.org%2Fapi%2Fdescription.php%3Fid%3D420?style=for-the-badge)
-->
## Summary

Chisel adds a huge variety of decorative blocks to the game. The mod is very useful for people who like the construction aspect of Minecraft. 

Access to new blocks is provided mostly through one tool, the chisel. The iron chisel is created with a iron ingot and a stick in a diagonal pattern.

This is port for Minecraft Bedrock Edition, working under InnerCore for Horizon. At the current moment this is alpha version, that contains only core features of the original mod.

---

## To setup properly requires:
1. [toolchain](https://github.com/ToxesFoxes/innercore-mod-toolchain)
2. [Python](https://www.python.org/) 3.6 or higher
3. [node.js](https://nodejs.org/en/) 10.15.1 or higher, you need to have `typescript` installed 
4. [Java Development Kit 1.8](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html) or higher

## Environment setup:
1. Clone this mod into `/toolchain-mod/mods/`
2. Configure debug.json and release from root folder of mod (pushTo)
3. Configure projects.json (projects)
```
{
  "current": "chisel-debug",
    "projects": {
      "chisel-release": {
        "folder": "mods/Chisel",
        "make_config": "release.json"
      },
      "chisel-debug": {
        "folder": "mods/Chisel",
        "make_config": "debug.json"
      }
    }
  }
```
4. Configure ADB path if you have problems with connections.

## Build mod
1. Connect to phone using ADB if you need push.
2. Choose task build everything from build menu(ctrl+shift+B) or use VS Code `Task Explorer` extension.

## Note
I'm not associated with Chisel developer team which develop original mod for PC, this is unofficial port of their mod to Minecraft on Android.
All rights for textures from Chisel for PC reserved by Chisel developer team.

## Credits
Thanks to:
* Zheka Smirnov for InnerCore modloader.
* All [contributors](https://github.com/ToxesFoxes/Chisel/graphs/contributors)