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

# Phantom 2D v1.1.0 BETA
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
### v1.0.12
- Added `WallObject`. (+published)
### v1.0.13
- Added `Entity.initState`, `Entity.restoreInitState()`.
### v1.0.14
- Added `Scene.screenshot(string, string?, number?)`.
- Added `Clipboard`.
- Added `Tag`, `TagList`.
### v1.0.15
- Added further tag support (in `Scene` with `findByTag`, `hasByTag`).
- Added `Scene.some(PredicateEntity)`.
- Added `ItemBox.filter(Predicate<T>)`, `ItemBox.find(FindPredicate<T>)`, `ItemBox.some(Predicate<T>)`.
- Added `Items.find(FindPredicateEntity)`, `Items.some(PredicateEntity)`.
### v1.0.16
- Added `Vector.rotBtwn(Vector, Vector)`.
- Added `Scene.rotBtwn(Entity, Entity)`.
- Added `Scene.rotToMouse(Entity)`.
- Added `SavedState`, `Entity.saveState()`, `Entity.restoreState(SavedState)`.
- Changed `Entity.restoreInitState` (and the associated `initState`) to use a `SavedState` with `restoreState`.
- Added `shallow<T>()`.
### v1.0.17
- Added `PointAtComp`, `PointAtMouseComp`.
- Scene no longer assigns default `style="width: ...; height: ...`. (don't ask why it set it to "0px" before, I don't know)
- Fixed some translation issues, fixed some handler function references.
- Fixed an error that caused `Runtime` to not discard its proccess ID.
- Fixed an error that caused incorrect mouse position calculations.
- Fixed an error that caused the wrong angle to be returned when comparing entity-to-mouse. (originally mouse-to-entity)
- Updated documentation regarding the usage of `Sound`.
### v1.0.18
- Added `Scene.config.osnd = boolean`. Checks for off-screen position before drawing.
- Fixed an oversight in `Character` that caused: no gravity updates to occur, no strength to be assigned and the gravity speed to not be updated.
- Fixed an oversight in `Custom`.
- Need to fix an error that causes `Character`s to fall through `WallObject`s.
### v1.0.18.1
- Fixed issue #2.
### v1.0.18.2
- Fixed an oversight to properly cancel out `gravspd` when grounded.
- Added `get`/`set` property `alpha` to `Scene`.
- Updated `init` command.
### v1.0.19
- Added `onValueSet` event trigger to configs.
- Added `ErrorEvent` listener for scene.
### v1.0.20
- Fixed `Character.onGround` issues.
- Added `FloorObject`.
- Added `SceneOptions.border`.
- Updated `Scene` constructor to not assign `canvas.width` and `canvas.height` to 0 if they are not passed.
- Added `Scene.style(CSSStyleDeclaration)` to streamline adding styles.
- Added `Scene.center()`, `Scene.clientCenter()`.
### v1.0.21
- Added `PhantomDestroyedEvent`.
- `BulletObject` now fires `PhantomDestroyedEvent` upon being destroyed.
### v1.0.22
- Fixed the usage of `objIs` to properly accept a constructor.
### v1.0.23
- Added `EnhancedPhysicsComp`.
- Added `PhantomCompOptionsMap` to enforce correct `CompOptions` instead of serving the default `CompOptions`.
- Added `EnhancedPhysicsComp.fric` to dampen velocity output.
- Added cooldowns for key presses.
### v1.0.23.1
- Fixed some oversights in `PlayabaleCharacter.bindCD` handling.
### v1.0.24
- Updated some handling for components.
### v1.0.24.1
- Updated `SoundOptionsIsSOD` to use `o: SoundOptions` instead of `o: any`.
- Added `tol` property to `BulletObject`.
- Added `Scene.onScrn`.
## v1.0.25
- FIxed `PlayableCharacter.bindCD` handling.
- Published latest.
## v1.0.26
- Added `Scene.follow`, `Scene.unfollow` for camera following.
## v1.0.27
- Enhanced `BulletObject` to have its speed be reduced over time.
- TODO: have the scene's gravity direction be enacted upon objects with gravity.
- Fixed a typo in some error documentation.
## v1.0.28
- Added `GravityComp` (needs testing).
## v1.0.29
- Added `ArcMoveOrbitComp`, `ArcMoveSlingComp` for orbit and slingshot arc movement.
## v1.0.30
- Started adding UI support.
## v1.1.0
- Includes major additions to add UI support.
- Added text property getters and setters for `Scene`.
- Added support for UI children.
- Fixed an issue where text wouldn't properly receive a color.
- Fixed button color changing.
- Fixed user interactions with button firing invalid effects.
- Added `Itvl`, `FixedItvl`.
## v1.1.0.1
- Added `disabled` property to `ButtonUI`.
- Updated `Scene.on` listener attached in `ButtonUI` to check for `disabled`.
## v1.1.1
- Fixed an error in `Items` that didn't spread the passed items.
- Added `lerp`.
## v1.1.2
- Updated `Scene` to use the newer method of components and component management.
## v1.2.0
- Updated `Entity` to properly accept children.
- Started adding `SceneFont` interface for internal font management.

# Phantom HTML v0.0.1
### 0.0.1
