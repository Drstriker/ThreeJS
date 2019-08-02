let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 3000);
let canvas = document.getElementById("CScene");

let renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setClearColor(0x909090);
renderer.setSize(800, 450);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

ObjectSetPosition(camera, 0, 0.77, 3);
var controls = new THREE.OrbitControls(camera);
controls.target.set(0, 0.77, 0);
controls.mouseButtons = {
    ZOOM: THREE.MOUSE.MIDDLE,
  };
controls.minDistance = 1;
// controls.maxDistance = 3.45;
controls.maxDistance = 5.5;
controls.update();

var slowingFactor = 0.5;

function updateCamera() {
    camera.updateProjectionMatrix();
}

var mouse = new THREE.Vector2();

/****
**  MATERIALS
*/

var silver_material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("../assets/materials/silver.jpg"),
    color: 0xaaaaaa,
    specular: 0x333333,
    shininess: 25,
    transparent: true,
    opacity: 1
});

var wood_material = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("../assets/materials/wood.jpg"),
    color: 0xaaaaaa,
    specular: 0x333333,
    shininess: 25,
    transparent: true,
    opacity: 1
});

/****
**  SCENE & SCENE MATERIAL
*/

var path = "../assets/scene/work/";
var format = '.jpg';
var urls = [
    path + 'white_bg' + format, path + 'white_bg' + format,
    path + 'white_bg' + format, path + 'white_bg' + format,
    path + 'Myself' + format, path + 'white_bg' + format
];

// var urls = [
//     path + 'pos-x' + format, path + 'neg-x' + format,
//     path + 'pos-y' + format, path + 'neg-y' + format,
//     path + 'pos-z' + format, path + 'neg-z' + format
// ];

var reflectionCube = new THREE.CubeTextureLoader().load( urls );
// var reflectionCube = BoxSceneMaterial;

// scene.background = reflectionCube;

var BoxSceneGeometry = new THREE.BoxGeometry(10, 8, 10);

var BoxSceneMaterial = [
    new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('../assets/scene/work/white_bg.jpg'),
        side: THREE.BackSide
    }),
    new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('../assets/scene/work/white_bg.jpg'),
        side: THREE.BackSide
    }),
    new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('../assets/scene/work/white_bg.jpg'),
        side: THREE.BackSide
    }),
    new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('../assets/scene/work/white_bg.jpg'),
        side: THREE.BackSide
    }),
    new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('../assets/scene/work/Myself.jpg'),
        side: THREE.BackSide
    }),
    new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('../assets/scene/work/Rimowa_logo_mini.jpg'),
        side: THREE.BackSide
    })
]

var BoxSceneMesh = new THREE.Mesh(BoxSceneGeometry, BoxSceneMaterial);

BoxSceneMesh.receiveShadow = true;
reflectionCube.receiveShadow = true;

ObjectSetPosition(BoxSceneMesh, 0, 2, 3);

scene.add(BoxSceneMesh);

/****
**  4 WHEELS
*/

const wheel_material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.7,
    envMap: reflectionCube,
    envMapIntensity: 1
});

var wheel_geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1);

var top_left_wheel = new THREE.Mesh(wheel_geometry, wheel_material);
var top_right_wheel = new THREE.Mesh(wheel_geometry, wheel_material);
var bottom_left_wheel = new THREE.Mesh(wheel_geometry, wheel_material);
var bottom_right_wheel = new THREE.Mesh(wheel_geometry, wheel_material);

ObjectSetPosition(top_left_wheel, -0.47, -0.65, -0.54);
ObjectSetPosition(top_right_wheel, 0.42, -0.65, -0.57);
ObjectSetPosition(bottom_left_wheel, 0.45, -0.62, 0.43);
ObjectSetPosition(bottom_right_wheel, -0.43, -0.62, 0.45);

ObjectSetRotation(top_left_wheel, 0, 0, 1.57);
ObjectSetRotation(top_right_wheel, 0, 0, 1.57);
ObjectSetRotation(bottom_left_wheel, 0, 0, 1.57);
ObjectSetRotation(bottom_right_wheel, 0, 0, 1.57);

top_left_wheel.updateMatrix();
top_right_wheel.updateMatrix();
bottom_left_wheel.updateMatrix();
bottom_right_wheel.updateMatrix();

top_left_wheel.castShadow = true;
top_right_wheel.castShadow = true;
bottom_left_wheel.castShadow = true;
bottom_right_wheel.castShadow = true;

var wheels = new THREE.Group();
wheels.material = wheel_material;
wheels.add(top_left_wheel);
wheels.add(top_right_wheel);
wheels.add(bottom_left_wheel);
wheels.add(bottom_right_wheel);

/****
**  RENDER
*/

function render() {
    requestAnimationFrame(render);

    // luggage.rotation.y += 0.01;
    // pivot.rotation.y += 0.02;

    renderer.render(scene,camera);
}

/****
**  UTILITIES FUNCTIONS
*/

function ObjectSetPosition(ItemObject, x, y, z) {
    ItemObject.position.set(x, y, z);
}

function ObjectSetRotation(ItemObject, x, y, z) {
    ItemObject.rotation.set(x, y, z);
}

function ObjectSetScale(ItemObject, x, y, z) {
    ItemObject.scale.set(x, y, z);
}

function ObjectUpdateMatrix(ItemObject) {
    ItemObject.updateMatrix();
}

/****
**  DRAG AND ROTATE & EVENTS
*/

var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};

function degToRad(angle) {
	return angle * (Math.PI / 180);
}

canvas.addEventListener('mousedown', function(){
    isDragging = true;
})

canvas.addEventListener('mouseup', function(){
    isDragging = false;
})

canvas.addEventListener('mousemove', function(event){
    var deltaMove = {
        x: event.offsetX - previousMousePosition.x,
        y: event.offsetY - previousMousePosition.y
    };

    if(isDragging) {
        var deltaRotationQuaternion = new THREE.Quaternion()
            deltaRotationQuaternion.setFromEuler(new THREE.Euler(
                degToRad(deltaMove.y * 1 * 0.25),
                degToRad(deltaMove.x * 1 * 0.25),
                0,
                'XYZ'
            ));
        pivot.quaternion.multiplyQuaternions(deltaRotationQuaternion, pivot.quaternion);
    }

    previousMousePosition = {
        x: event.offsetX,
        y: event.offsetY
    };
})

window.addEventListener('resize', () => {
    renderer.setSize(800, 450);
    camera.aspect = 800 / 450;
    camera.updateProjectionMatrix();
});

/****
**  LOAD LUGGAGE 3D MODEL
*/

const luggage_material = new THREE.MeshStandardMaterial({
    color: 0xe3e3e3,
    roughness: 0.3,
    metalness: 0.7,
    envMap: reflectionCube,
    envMapIntensity: 1
});

function load_object(ObjectFile) {
    var obj = new THREE.Object3D;
    var loader = new THREE.OBJLoader();

    loader.load(
        ObjectFile + '.obj', function (object) {
            ObjectSetScale(object, 3, 3, 3);
            ObjectSetRotation(object, -1.6, 0, 1.6);
            object.traverse(function(child){
                // child.material = wood_material;
                child.castShadow = true;
                child.material = luggage_material;
                // child.envMapIntensity = 1;
                // child.metalness = 0.2;
                // child.receiveShadow = true;
            })
            obj.add(object);
        }
    )
    return obj;
}

var luggage = load_object('../assets/models/testval2');
var center_box = new THREE.Box3().setFromObject(luggage);
center_box.getCenter(luggage.position);
luggage.position.multiplyScalar(-1);
var pivot = new THREE.Group();
pivot.add(luggage);
pivot.add(wheels);
scene.add(pivot);

ObjectSetPosition(luggage, 0, -0.7, 0);
ObjectSetPosition(pivot, 0, -1.2, 0);

/****
**  VIDEO LOADER
*/

var video = document.createElement('video');
video.src = "../assets/videos/Rimowa_video.mp4";
video.load();
video.loop = true;
video.play();

var videotexture2 = new THREE.VideoTexture(video);
videotexture2.minFilter = THREE.LinearFilter;
videotexture2.magFilter = THREE.LinearFilter;
videotexture2.format = THREE.RGBFormat;

var planeGeometry2 = new THREE.PlaneGeometry();
var planeTexture2 = new THREE.MeshBasicMaterial({map: videotexture2});
var TVScreen = new THREE.Mesh(planeGeometry2, planeTexture2);

ObjectSetPosition(TVScreen, -4.9, 2, 0);
ObjectSetRotation(TVScreen, 0, 1.55, 0);
ObjectSetScale(TVScreen, 4, 4, 4);

scene.add(TVScreen);

/****
**  BUTTONS
*/

/// Wheels
// Colors

function WheelsColorToRed() {
    top_left_wheel.material.color.set(0xff0000);
    top_right_wheel.material.color.set(0xff0000);
    bottom_left_wheel.material.color.set(0xff0000);
    bottom_right_wheel.material.color.set(0xff0000);
}

function WheelsColorToBlue() {
    top_left_wheel.material.color.set(0x0000ff);
    top_right_wheel.material.color.set(0x0000ff);
    bottom_left_wheel.material.color.set(0x0000ff);
    bottom_right_wheel.material.color.set(0x0000ff);
}

function WheelsColorToGrey() {
    top_left_wheel.material.color.set(0x888888);
    top_right_wheel.material.color.set(0x888888);
    bottom_left_wheel.material.color.set(0x888888);
    bottom_right_wheel.material.color.set(0x888888);
}

function WheelsColorToWhite() {
    top_left_wheel.material.color.set(0xffffff);
    top_right_wheel.material.color.set(0xffffff);
    bottom_left_wheel.material.color.set(0xffffff);
    bottom_right_wheel.material.color.set(0xffffff);
}

// Material

function WheelsMaterialToWood() {
    top_left_wheel.material = wood_material;
    top_right_wheel.material = wood_material;
    bottom_left_wheel.material = wood_material;
    bottom_right_wheel.material = wood_material;
}

function WheelsMaterialToMetal() {
    top_left_wheel.material = silver_material;
    top_right_wheel.material = silver_material;
    bottom_left_wheel.material = silver_material;
    bottom_right_wheel.material = silver_material;
}

function WheelsMaterialToNormal() {
    top_left_wheel.material = wheel_material;
    top_right_wheel.material = wheel_material;
    bottom_left_wheel.material = wheel_material;
    bottom_right_wheel.material = wheel_material;
}

/// Luggage
// Colors

function LuggageColorToWhite() {
    luggage_material.color.set(0xe3e3e3);
}

function LuggageColorToRed() {
    luggage_material.color.set(0xff0000);
}

/****
**  LIGHT
*/

var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

var fancyLight = new THREE.SpotLight(0xffffff, 1.5, 13);
fancyLight.target = pivot;

var fancyLight1 = new THREE.SpotLight(0xffffff, 1.5, 100);
fancyLight1.target = pivot

fancyLight.castShadow = true;
fancyLight.shadow.bias = 0.00001;
fancyLight.shadow.mapSize.width = 2048 * 2;
fancyLight.shadow.mapSize.height = 2048 * 2;

ObjectSetPosition(fancyLight, 0, 5, 5);
ObjectSetPosition(fancyLight1, 0, -5, 5);

scene.add(ambientLight);
scene.add(fancyLight);
scene.add(fancyLight1);

/****
**  Finalize and add to scene
**/

render();
document.body.appendChild(renderer.domElement);