# PhantomJS
Phantom.js is a web API to simplify the webgame development proccess.
Phantom.js supports both 2D and 3D games with readable and simple scripting!

# Phantom 2D v0.0.2
[Docs](https://docs.google.com/document/d/1928QiduJZWzF_hCdbAx2s4jWh1d92vtkKphrdU-Qttk/edit?usp=sharing)

### StaticObject (extends SceneObject)
**Params**<br>
id: string<br>
shape: string<br>
collide: function | null<br>
color: string<br>
px: number = 0<br>
py: number = 0<br>
rx: number = 0<br>
ry: number = 0<br>
width: number = 0<br>
height: number = 0<br>
**Description**<br>
A static shape. Does not have any unique properties.<br>
**Methods**<br>
none<br>
**Properties**<br>
id: string<br>
shape: string<br>
collide: function | null<br>
color: string<br>

PhysicsObject<br>
MovingObject<br>
BouncyObject<br>
Vector<br>
<!-- **Params**
x: number
y: number
**Description**
A container for x and y values. Represents a point on the canvas.
**Methods**
none -->
ControllableCharacter<br>
NonPlayableCharacter

## Feature Roadmap
- navmesh
- AI-controlled characters
- more ctx methods

# Phantom 3D v0.0.0
