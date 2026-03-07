# PhantomJS
Phantom.js is a web API to simplify the webgame development proccess.\
Phantom.js is a 2D game development API with readable and simple scripting.\
Phantom.js is a side project, most of my focus is directed to [GhostScript](https://github.com/BeanTheAlien/GhostScript), so sorry for lack of attention on this. <3

# Download
Avalible with `npm`!
```
npm install @beanthealien/phantomjs
```

# Phantom 2D v1.0.2 LEGACY
### 1.0.1
- Added PlayableCharacter.unbindAll().
### 1.0.2
- Fixed some errors of legacy usage of Scene.width(), Scene.height(), replaced with Scene.width, Scene.height.
[Docs](https://docs.google.com/document/d/1928QiduJZWzF_hCdbAx2s4jWh1d92vtkKphrdU-Qttk/edit?usp=sharing)

# Phantom 2D v1.0.10 BETA
### v1.0.1
- Open beta now open!
- Ported most legacy content
### v1.0.2
- New `Local` class.
### v1.0.3
- Added `wait`, `random`.
### v1.0.4
- Updated handling to use `PhantomEventType`/`EventType`, `PhantomEventHandle[]`/`EventHandle[]` for event stores.
- Deprecated `AudioMIME`, `Sound` now uses regular `HTMLAudioElement` (no `HTMLSourceElement`). (**Note**: you can still clarify the `mime` property to use the deprecated version)
### v1.0.5
- Adjusted `Phantom2dEntity.setPos` to have 2 overloads, `(Vector)` and `(number, number)`.
- Adjusted `Sound` to serve a constructor with `SoundOptions` and a constructor with `SoundOptionsDeprecated` (can test for deprecated opts with `SoundOptionsIsSOD`).
- Added `SceneOptions.canvas: ... | string`. Retrieves element, throws `NoCanvasError` if it does not get an element.
- Added `Phantom2dOptions`, `Preset` overloads for `Phantom2dEntity.from` calls.
- Added `ErrRoot` class.
- Enhanced `random` to add `()`, `(number)` and `(number, number)`.
### v1.0.6
- Expanded `Cooldown` to construct with `()`, `(number)`, `(boolean)` and `(number, boolean)`.
- Added `Cookies` class.
- Minor structure changes.
### v1.0.7
- Added `objIs`.
- The start to `Config` are here!
- `FilePicker`, `DirPicker` to handle picking files/dirs.
- (Most) classes have a static `is` method that runs `objIs<PARENT_CLASS_TYPE>`.
- `SceneConfig` now has `resolution`, `master`, `music` and `sfx` properties. `ImgConfig` now has `root` property.
### v1.0.8
- Minor structure changes to pickers.
- Added `ItemBox`.
- Fixed `Callback`, added `Predicate`, `CallbackBase`. Fixed descriptions accordingly.
- Implemented `Img.config.root`.
- Added `Img.rebuild(string)` to rebuild the `src`.
### v1.0.9
- Added `EventManager`, `SceneEventManager`, `PhantomEventManager` for optimization.
- Added `Scene.__listenOn(EventType, EventHandle)` and `Scene.__listenOff(EventType, EventHandle)`.
### v1.0.10
- Added `chance(number)`, `chance(number, number)`.
- Added `bin/`.
### v1.0.11
- Changed `Phantom2dEntity` to just `Entity`.
- Added `Local` and `Session` objects (derived from `StorageRoot`). Deprecated `Local` (now `LocalDeprecated`).

# Phantom 2D Roadmap
- Config for classes

# Phantom HTML v0.0.1
### 0.0.1
