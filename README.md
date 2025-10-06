# PhantomJS
Phantom.js is a web API to simplify the webgame development proccess.
Phantom.js supports both 2D and 3D games with readable and simple scripting!

# Phantom 2D v0.0.2
### Scene
**Params**<br>
canvas: HTMLCanvasElement<br>
width: number (sets canvas.width)<br>
height: number (sets canvas.height)<br>
cssWidth: string = "100vw" (sets canvas.style.width)<br>
cssHeight: string = "100vh" (sets canvas.style.height)<br>
**Description**<br>
The core component for Phantom 2D, used to render all components.<br>
**Methods**<br>
add(...comps): void (Adds new components to scene.\#components. Throws an error if any component is not a valid Phantom 2D type.)<br>
remove(...comps): void (Removes components from scene.\#components.)<br>
rect(x: number, y: number, width: number, height: number, colour: string): void (Draws and fills a rectangle given the specified colour using the canvas's context.)<br>
clear(): void (Clears the canvas using the canvas's context.)<br>
render(): void (Renders each component in scene.\#components. Throws an erorr if any component is not a valid Phantom 2D instance.)<br>
getById(id: string): component | null (Runs a find check through scene.\#components. Checks each component with component name equals id.)<br>
getByAttr(name: string, value): component | null (Runs a find check through scene.\#components. Checks each component with component attribute equals value.)<br>
**Properties**<br>
canvas: HTMLCanvasElement<br>
ctx: 2D Context<br>

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

# Phantom 3D v0.0.0
