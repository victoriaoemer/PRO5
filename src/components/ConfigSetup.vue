<template>
  <div class="container">
    <div id="container3D" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp"></div>
    <div class="ui">
      <h1>Einzelzimmer</h1>
      <h4>Wähle deine Ansicht</h4>
      <div style="display: flex; gap: 15px; margin-bottom: 20px; margin: 4px;">
        <!-- <button @click="toggleCameraToWide" id="totaleButton"> Totale </button> -->
        <button alt="Totale" class="button" :class="{ selected: selectedCameraView === 'totale' }"
          @click="toggleCameraToWide">
          <div style="content: url('/PRO5/assets/totale.png'); height: 80px;"></div>
        </button>
        <button alt="Gardarobe" class="button" :class="{ selected: selectedCameraView === 'gardarobe' }"
          @click="toggleCameraToGardarobe">
          <div style="content: url('/PRO5/assets/gardarobe.png'); height: 80px;"></div>
        </button>
        <button alt="Küche" class="button" :class="{ selected: selectedCameraView === 'kueche' }"
          @click="toggleCameraToKueche">
          <div style="content: url('/PRO5/assets/kueche.png'); height: 80px;"></div>
        </button>
      </div>
      <button v-if="selectedCameraView === 'totale'" @click="hideWalls">Wände ausblenden</button>
      <button v-if="selectedCameraView === 'totale'" @click="toggleWireframe">Drahtgestell aktivieren</button>

      <br>
      <br>

      <div>

        <div>
          <h4>Material aller Möbelstücke ändern</h4>

          <div class="buttonContainer">
            <div v-for="(texture, index) in textures" :key="index" class="textureButton"
              :class="{ selected: selectedTexture === texture }" @click="changeAllTextures(index)">
              <img :src="texture" alt="Texture Image">
            </div>
          </div>
        </div>
        <br>
        <div>
          <h4>Material einzelner Möbelstücke ändern</h4>
          <p v-if="selectedObjectName == null"> Wählen Sie ein Möbelstück aus indem Sie darauf klicken!</p>
          <p v-else>Ausgewähltes Möbelstück: {{ selectedObjectName }}</p> <!-- Hier wird der Name angezeigt -->
          <div class="buttonContainer">
            <div v-for="(texture, index) in textures" :key="index" class="textureButton"
              @click="changeOneTexture(index, selectedObjectName)" :class="{ selected: selectedOneTexture === texture }">
              <img :src="texture" alt="Texture Image">
            </div>
          </div>
        </div>
        <br>
        <div>
          <h4>Zusatzobjekte</h4>
          <p>Wähle die Objekte aus, die du hinzufügen möchtest</p>
          <div class="buttonContainer">
            <div v-for="(object, index) in additionalObjects" :key="object" class="textureButton"
              @click="toggleAdditionalObjects(object, index)" :class="{ selected: selectedAdditionalObjects[index] }">
              <img :src="setImagePath(index)" alt="Texture Image" />
            </div>
          </div>
          <br>

          <button class="saveButton" @click="saveData"> <font-awesome-icon class="icon" icon="fa-solid fa-download" />
            Daten
            als PDF speichern</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import * as THREE from 'three';
import { ref, computed, reactive } from 'vue';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
//Modules below are regarded to shader
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { Reflector } from 'three/addons/objects/Reflector.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

// ...


import jsPDF from 'jspdf';


import { onMounted, render } from 'vue';

const loadedObjects = {};
const fixedObjects = {};
const objectTextures = {};
const additionalObjects = {};


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.name = 'camera';
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera2.name = 'camera2';
const camera3 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera3.name = 'camera3';

let activeCamera = camera;
let selectedCameraView = ref('totale');


let mirror, bathrommMirror, windowrefl;

const objectNamesMapping = {
  'room': 'Zimmer',
  'closet': 'Schrank',
  'bedwood': 'Bett',
  'garderobe': 'Garderobe',
  'lowchairwood': 'Stuhl',
  'highchairwood': 'Hoher Stuhl',
  'kitchen': 'Küche',
  'washbasin': 'Waschbecken',
  'desk': 'Schreibtisch'
  // Füge hier alle gewünschten Zuordnungen hinzu
};

const textureShortInfos = {
  '/PRO5/assets/gltf/text/Gold_wood.jpg': 'Eichenholz',
  '/PRO5/assets/gltf/text/plywood03.jpg': 'Birkenholz',
  '/PRO5/assets/gltf/text/walnut.jpg': 'Walnussholz',
  '/PRO5/assets/gltf/text/adthe.jpg': 'Nuhiu',
  // Füge hier weitere Texturen hinzu
};

let textureIndex = 1;
const textures = [
  '/PRO5/assets/gltf/text/Gold_wood.jpg',
  '/PRO5/assets/gltf/text/plywood03.jpg',
  '/PRO5/assets/gltf/text/walnut.jpg',
  '/PRO5/assets/gltf/text/adthe.jpg',
]
const textureloader = new THREE.TextureLoader().load('/PRO5/assets/gltf/text/Gold_wood.jpg');
let selectedTexture = ref('/PRO5/assets/gltf/text/Gold_wood.jpg');
let selectedOneTexture = ref('/PRO5/assets/gltf/text/Gold_wood.jpg');

// const selectedAdditionalObjects = reactive({}); // Verwende ein Reactive-Objekt
const selectedAdditionalObjects = reactive({
  desklamp: true,
  curtains: true,
  plant01: true,
  plant02: true,
  coathanger: true
  // Add more objects as needed
});

console.log(textures[textureIndex]);
///PRO5/assets/gltf/text/plywood03.jpg
console.log(selectedTexture.value)


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// const composer = new EffectComposer(renderer);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", onWindowResize());

function onWindowResize() {
  activeCamera.aspect = window.innerWidth / window.innerHeight;
  activeCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};


let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };


let controls = new OrbitControls(activeCamera, renderer.domElement);
//controls.autoRotate = true;
//controls.autoRotateSpeed = 3.0;


let object = new THREE.Group();

let selectedObjectName = ref(null);
onMounted(() => {
  const container = document.getElementById('container3D');
  if (container) {
    container.appendChild(renderer.domElement);
  } else {
    console.error('Container-Element not found.');
  }
});

//------------------------------------------Load Objects------------------------------------------//


const glTFLoader = new GLTFLoader();

glTFLoader.load('/PRO5/assets/gltf/Room/room_start.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 210);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  fixedObjects.room = gltf.scene;
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
});

glTFLoader.load('/PRO5/assets/gltf/Room/room_complete.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 210);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  fixedObjects.room_complete = gltf.scene;

  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
  toggleVisibility('room_complete') == true; //hide it
});

glTFLoader.load('/PRO5/assets/gltf/Room/room_wire.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 210);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  fixedObjects.room_wireframe = gltf.scene;
  toggleVisibility('room_wireframe') == true; //hide it
});


glTFLoader.load('/PRO5/assets/gltf/Room/floor.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 210);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  fixedObjects.floor = gltf.scene;
  fixedObjects.floor.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.receiveShadow = true;
    }
  });
});

/*glTFLoader.load('/PRO5/assets/gltf/Room/mirror_room.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 210);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  //fixedObjects.mirror_room = gltf.scene;
});*/

glTFLoader.load('/PRO5/assets/gltf/Room/doors.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 210);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  fixedObjects.doors = gltf.scene;
});

glTFLoader.load('/PRO5/assets/gltf/Closet_sep/closet.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-70, 10, 165);
  gltf.scene.rotateY(1.55);

  loadedObjects.closet = gltf.scene;
  loadedObjects.closet.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
      node.castShadow = true;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('/PRO5/assets/gltf/Closet_sep/closet_handle.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-70, 10, 165);
  gltf.scene.rotateY(1.55);

  //loadedObjects.closethandle = gltf.scene;
  scene.add(gltf.scene);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
});

glTFLoader.load('/PRO5/assets/gltf/Bed_sep/bed_stuff.gltf', function (gltf) {
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(0, 10, 80);
  gltf.scene.rotateY(-1.55);
  scene.add(gltf.scene);


  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
  //loadedObjects.bedstuff = gltf.scene;
  //no texture
});

glTFLoader.load('/PRO5/assets/gltf/Bed_sep/bedwood.gltf', function (gltf) {
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(0, 10, 80);
  gltf.scene.rotateY(-1.55);

  loadedObjects.bedwood = gltf.scene;
  loadedObjects.bedwood.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
      node.castShadow = true;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('/PRO5/assets/gltf/Garderobe/garderobe.gltf', function (gltf) {
  gltf.scene.scale.set(60, 60, 57);
  gltf.scene.position.set(-35, 0, -143);
  gltf.scene.rotateY(0);

  loadedObjects.garderobe = gltf.scene;
  loadedObjects.garderobe.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
      node.castShadow = true;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('/PRO5/assets/gltf/LowChair_sep/lowChair_feet.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(10, 10, 150);
  gltf.scene.rotateY(1.55);

  //loadedObjects.lowchairfeets = gltf.scene;
  scene.add(gltf.scene);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
});

glTFLoader.load('/PRO5/assets/gltf/LowChair_sep/lowChair_wood.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(10, 10, 150);
  gltf.scene.rotateY(1.55);

  loadedObjects.lowchairwood = gltf.scene;
  loadedObjects.lowchairwood.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
      node.castShadow = true;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('/PRO5/assets/gltf/HighChair_sep/highChair_wood.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-40, 10, -5);
  gltf.scene.rotateY(1.5);


  loadedObjects.highchairwood = gltf.scene;
  loadedObjects.highchairwood.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
      node.castShadow = true;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('/PRO5/assets/gltf/HighChair_sep/highChair_feet.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-40, 10, -5);
  gltf.scene.rotateY(1.5);

  //loadedObjects.highchairfeet = gltf.scene;
  scene.add(gltf.scene);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
});

glTFLoader.load('/PRO5/assets/gltf/Kitchen_sep/kitchen_wood.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-35, 10, 16);
  gltf.scene.rotateY(0);

  loadedObjects.kitchen = gltf.scene;
  loadedObjects.kitchen.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
      node.castShadow = true;
      // node.receiveShadow = true;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('/PRO5/assets/gltf/Kitchen_sep/kitchen_stuff.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-35, 10, 16);
  gltf.scene.rotateY(0);

  //loadedObjects.kitchenstuff = gltf.scene;
  scene.add(gltf.scene);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
});

glTFLoader.load('/PRO5/assets/gltf/Washbasin_sep/washbasin_stuff.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(0, 10, -75);
  gltf.scene.rotateY(-1.55);

  // Durchlaufe alle Materialien im glTF-Modell
  gltf.scene.traverse(function (node) {
    if (node.isMesh) {
      // Verwende MeshStandardMaterial für realistische Reflexionen
      const standardMaterial = new THREE.MeshStandardMaterial({
        color: node.material.color,
        metalness: 0, // Stelle den Metalness-Wert auf 1 für metallische Reflexionen
        roughness: 0 // Experimentiere mit dem Roughness-Wert für die Glätte des Materials
      });

      // Ersetze das Material des Meshes
      node.material = standardMaterial;

      // Aktiviere Schattenwurf für das Mesh
      node.castShadow = true;
    }
  });
  // Füge das glTF-Modell zur Szene hinzu
  scene.add(gltf.scene);
});

glTFLoader.load('/PRO5/assets/gltf/Washbasin_sep/washbasin.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(0, 10, -75);
  gltf.scene.rotateY(-1.55);

  loadedObjects.washbasin = gltf.scene;
  loadedObjects.washbasin.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
      node.castShadow = true;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('/PRO5/assets/gltf/Desk_sep/desk.gltf', function (gltf) {
  gltf.scene.scale.set(5, 5, 5);
  gltf.scene.position.set(37, 10, 150);

  loadedObjects.desk = gltf.scene;
  loadedObjects.desk.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
      node.castShadow = true;
    }
  });
  scene.add(gltf.scene);
  changeAllTextures(0); //changing all textures when last object loads (for PDF material list)
});

glTFLoader.load('/PRO5/assets/gltf/Objects/toilet.gltf', function (gltf) {
  gltf.scene.scale.set(15, 15, 15);
  gltf.scene.position.set(30, 7, -165);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  fixedObjects.doors = gltf.scene;
});

let geometry;

geometry = new THREE.PlaneGeometry(20, 85);
mirror = new Reflector(geometry, {
  clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
  color: 0xb5b5b5
});
mirror.position.x = -95;
mirror.position.y = 65;
mirror.position.z = -115;

mirror.rotateY(Math.PI / 2);

scene.add(mirror);

geometry = new THREE.PlaneGeometry(70, 102);
windowrefl = new Reflector(geometry, {
  clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
  color: 0xb5b5b5
});
windowrefl.position.x = -20;
windowrefl.position.y = 64.5;
windowrefl.position.z = 200;

windowrefl.rotateY(Math.PI);

scene.add(windowrefl);

geometry = new THREE.PlaneGeometry(35, 45);
bathrommMirror = new Reflector(geometry, {
  clipBias: 0.003,
  textureWidth: window.innerWidth * window.devicePixelRatio,
  textureHeight: window.innerHeight * window.devicePixelRatio,
  color: 0xb5b5b5
});
bathrommMirror.position.x = 16;
bathrommMirror.position.y = 85;
bathrommMirror.position.z = -52;

bathrommMirror.rotateY(Math.PI);

scene.add(bathrommMirror);

//------------------------------------------Additional objects to toggle------------------------------------------//

glTFLoader.load('/PRO5/assets/gltf/Objects/deskLamp.gltf', function (gltf) {
  gltf.scene.scale.set(5, 5, 5);
  gltf.scene.position.set(45, 47, 170);
  gltf.scene.rotateY(-2.5);
  scene.add(gltf.scene);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
  additionalObjects.desklamp = gltf.scene;
});


glTFLoader.load('/PRO5/assets/gltf/Objects/curtains.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 200);
  gltf.scene.rotateY(0);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
  scene.add(gltf.scene);

  additionalObjects.curtains = gltf.scene;
});



glTFLoader.load('/PRO5/assets/gltf/Objects/plant01.gltf', function (gltf) {
  gltf.scene.scale.set(45, 45, 45);
  gltf.scene.position.set(-90, 10, 120);
  gltf.scene.rotateY(0);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
  scene.add(gltf.scene);

  additionalObjects.plant01 = gltf.scene;
});

glTFLoader.load('/PRO5/assets/gltf/Objects/plant02.gltf', function (gltf) {
  gltf.scene.scale.set(75, 75, 75);
  gltf.scene.position.set(45, 47, 130);
  gltf.scene.rotateY(0);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
  scene.add(gltf.scene);

  additionalObjects.plant02 = gltf.scene;
});

glTFLoader.load('/PRO5/assets/gltf/Garderobe/coathanger.gltf', function (gltf) {
  gltf.scene.scale.set(60, 60, 57);
  gltf.scene.position.set(-35, 0, -143);
  gltf.scene.rotateY(0);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });

  scene.add(gltf.scene);
  additionalObjects.coathanger = gltf.scene;
});


console.log(additionalObjects);

//------------------------------------------Axis and Lights------------------------------------------//

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
camera.position.set(-100, 330, 80);
camera.lookAt(object.position);
camera2.position.set(-90, 80, -20);
camera3.position.set(30, 80, 60);

const pointLight = new THREE.PointLight(0xffffff, 14000); //mitte vom raum
pointLight.position.set(-20, 120, 40);
pointLight.castShadow = true; // Enable shadow casting for the light
pointLight.shadow.mapSize.width = 512; // default
pointLight.shadow.mapSize.height = 512; // default
pointLight.shadow.camera.near = 0.5; // default
pointLight.shadow.camera.far = 300; // default

scene.add(pointLight);

const pointlight1 = new THREE.PointLight(0xffffff, 1400); //bad
pointlight1.position.set(0, 120, -100);
pointlight1.castShadow = true; // Enable shadow casting for the light
pointlight1.shadow.mapSize.width = 512; // default
pointlight1.shadow.mapSize.height = 512; // default
pointlight1.shadow.camera.near = 0.5; // default
pointlight1.shadow.camera.far = 300; // default
scene.add(pointlight1);

const pointlight2 = new THREE.PointLight(0xffffff, 2200); //gardArobe
pointlight2.position.set(-65, 80, -120);
pointlight2.castShadow = true; // Enable shadow casting for the light
pointlight2.shadow.mapSize.width = 512; // default
pointlight2.shadow.mapSize.height = 512; // default
pointlight2.shadow.camera.near = 0.5; // default
pointlight2.shadow.camera.far = 300; // default
scene.add(pointlight2);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // soft white light
ambientLight.position.y = 1000
scene.add(ambientLight);

// const renderPass = new RenderPass(scene, camera);
// composer.addPass(renderPass);

// const outlinePass = new OutlinePass(
//   new THREE.Vector2(window.innerWidth, window.innerHeight), //resolution parameter
//   scene,
//   camera
// );
// composer.addPass(outlinePass);




const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
renderer.domElement.addEventListener('click', onClick, false);

const raycastObjects = [];

let INTERSECTED;

let composer;
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);

let outlinePass;

function init() {
  outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), //resolution parameter
    scene,
    activeCamera
  );
  outlinePass.visibleEdgeColor.set(0xffffff);
  outlinePass.edgeStrength = 3.0;
  outlinePass.edgeGlow = 0.2;
  outlinePass.edgeThickness = 2.0;
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, activeCamera));
  composer.addPass(gammaCorrectionPass);
  composer.addPass(outlinePass);


}
init();


function onClick() {
  //only loaded objects are selectable
  for (const key in loadedObjects) {
    if (Object.hasOwnProperty.call(loadedObjects, key)) {
      const object = loadedObjects[key];
      if (object instanceof THREE.Object3D) {
        raycastObjects.push(object);
      }
    }
  }
  var canvasPosition = renderer.domElement.getBoundingClientRect();

  event.preventDefault();
  mouse.x = ((event.clientX - canvasPosition.left) / (renderer.domElement.clientWidth)) * 2 - 1;
  mouse.y = - ((event.clientY - canvasPosition.top) / (renderer.domElement.clientHeight)) * 2 + 1;
  raycaster.setFromCamera(mouse, activeCamera);
  var intersects = raycaster.intersectObjects(raycastObjects);

  let objectName = null;

  if (intersects.length > 0) {
    const objectName = intersects[0].object.name;
    const cleanedObjectName = objectName.replace(/_[0-9]/g, '');
    console.log(cleanedObjectName);

    selectedObjectName.value = objectNamesMapping[cleanedObjectName] || cleanedObjectName;

    if (INTERSECTED != intersects[0].object) {

      if (INTERSECTED) {
        // Reset the outline effect on the previously selected object
        outlinePass.selectedObjects = [];
      }

      INTERSECTED = intersects[0].object;

      // Set the outline effect on the newly selected object
      outlinePass.selectedObjects = [INTERSECTED];
    }
  } else {
    if (INTERSECTED) {
      // Reset the outline effect on the previously selected object
      outlinePass.selectedObjects = [];
    }
    INTERSECTED = null;
  }
}

const animate = () => {
  requestAnimationFrame(animate);
  //composer.render();
  controls.update();
  composer.render(scene, activeCamera)
}
animate();

// Add an event listener for the resize event to update the outline pass
window.addEventListener('resize', function () {
  const canvasPosition = renderer.domElement.getBoundingClientRect();

});

const supressKeys = (evnt) => {
  if (evnt.key === 'ArrowUp' || evnt.key === 'ArrowDown') {
    evnt.preventDefault();
  }
};
window.addEventListener('keyup', supressKeys);
window.addEventListener('keydown', supressKeys);


//------------------------------------------Functions------------------------------------------//

const virtualCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
virtualCamera.rotation.copy(activeCamera.rotation);

function setImagePath(index) {
  return '/PRO5/assets/additionalObjects/' + index + '.png';
}

function onMouseDown(event) {

  isDragging = true;
  window.addEventListener('mouseup', onMouseUp);
  previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseMove(event) {

  if (isDragging) {
    const deltaX = event.clientX - previousMousePosition.x;
    // const deltaY = event.clientY - previousMousePosition.y;
    const sensitivity = 0.0025;

    // virtualCamera.rotation.x -= deltaY * sensitivity;
    virtualCamera.rotation.y -= deltaX * sensitivity;
    activeCamera.rotation.y = -virtualCamera.rotation.y;
    // activeCamera.rotation.x = -virtualCamera.rotation.x;

    controls.update();
    previousMousePosition = { x: event.clientX, y: event.clientY };
  }
}

function onMouseUp() {
  isDragging = false;
  window.removeEventListener('mouseup', onMouseUp);
}

function toggleCameraToWide() {

  activeCamera = camera;
  init();
  fixedObjects.room.visible = true;
  fixedObjects.room_complete.visible = false;

  selectedCameraView.value = 'totale';
  controls.dispose();
  controls = new OrbitControls(activeCamera, renderer.domElement);

  controls.addEventListener('change', () => {
    composer.render(scene, activeCamera);
  });
}

function toggleCameraToGardarobe() {
  activeCamera = camera2;
  init();
  fixedObjects.room.visible = false;
  fixedObjects.room_complete.visible = true;


  selectedCameraView.value = 'gardarobe';

  fixedObjects.room.visible = false;
  fixedObjects.room_complete.visible = true;


  controls.dispose();
  controls.addEventListener('change', () => {
    composer.render(scene, activeCamera);
  });
}


function toggleCameraToKueche() {
  activeCamera = camera3;
  init();
  fixedObjects.room.visible = false;
  fixedObjects.room_complete.visible = true;
  selectedCameraView.value = 'kueche';

  controls.dispose();
  controls.addEventListener('change', () => {
    composer.render(scene, activeCamera);
  });
}



function toggleVisibility(id) {
  const objectToToggleVisibility = fixedObjects[id];
  console.log(objectToToggleVisibility.visible);
  if (objectToToggleVisibility) {
    objectToToggleVisibility.visible = (objectToToggleVisibility.visible) ? false : true; // Hide the object
  }
}

function hideWalls() {

  if (selectedCameraView.value === 'totale') {
    toggleVisibility('room');
    toggleVisibility('room_wireframe');
  }

}

function toggleWireframe() {
  toggleVisibility('room_wireframe'); //enable it
}

function saveData() {


  renderer.render(scene, camera);
  const canvas = document.getElementsByTagName("canvas", { preserveDrawingBuffer: true })[0];
  const mainImage = canvas.toDataURL("image/png");

  renderer.render(scene, camera2);
  const secondImage = canvas.toDataURL("image/png");

  renderer.render(scene, camera3);
  const thirdImage = canvas.toDataURL("image/png");

  var pdf = new jsPDF();

  // Füge den Titel über dem Bild hinzu
  pdf.text("KitzConfig - Datenblatt", pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });

  // Skaliere das Bild basierend auf der Größe des Canvas und des Bildes
  const canvasWidth = pdf.internal.pageSize.getWidth();
  const canvasHeight = pdf.internal.pageSize.getHeight();
  const imageWidth = 200; // Definiere die Breite des Bildes im PDF
  const imageHeight = (imageWidth / canvas.width) * canvas.height;

  // Füge das Bild hinzu
  pdf.addImage(mainImage, 'PNG', (canvasWidth - imageWidth) / 2, 20, imageWidth / 2.5, imageHeight / 2.5);
  pdf.addImage(secondImage, 'PNG', (canvasWidth - imageWidth) / 2 + 100, 30, imageWidth / 2.5, imageHeight / 2.5);
  pdf.addImage(thirdImage, 'PNG', (canvasWidth - imageWidth) / 2 + 100, 90, imageWidth / 2.5, imageHeight / 2.5);

  // Füge eine nummerierte Liste der Materialinformationen hinzu
  let listPositionY = 0 + imageHeight + 5; // Verringere den Abstand zwischen dem Bild und der Liste
  let listItemNumber = 1;

  pdf.text("Materialliste: ", 10, 90);


  for (let key in objectTextures) {
    const textureShortInfo = textureShortInfos[objectTextures[key]] || objectTextures[key];
    const listItemText = `${objectNamesMapping[key] || key}: ${textureShortInfo}`;
    pdf.text(`${listItemNumber}. ${listItemText}`, 10, listPositionY);
    listPositionY += 8; // Verringere den Abstand zwischen den Listenelementen
    listItemNumber++;
  }


  pdf.save("KitzConfig - Datenblatt.pdf");
}

function toggleAdditionalObjects(object, index) {
  object.visible = !object.visible;
  selectedAdditionalObjects[index] = object.visible;
}

function changeAllTextures(index) {
  console.log(index);
  for (let key in loadedObjects) {
    //if (key === 'room' || key === 'lowchairfeets' || key === 'doors' || key === 'bedstuff' || key === 'floor' || key === 'roommirror' || key === 'highchairfeet' || key === 'kitchenstuff' || key === 'washbasinstuff' || key === 'closethandle' || key === 'desklamp') continue;
    const object = loadedObjects[key];
    const textureUrl = textures[index];
    //const newTexture = new THREE.TextureLoader().load(textureUrl);

    object.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.material.map = new THREE.TextureLoader().load(textureUrl);
        node.material.needsUpdate = true;
        //console.log(`Changed texture of ${key} to ${textureUrl}`);
      }
    });
    objectTextures[key] = textureUrl; // Speichere die aktuelle Textur für das Objekt
  }
  textureIndex = index;
  selectedTexture.value = textures[textureIndex];
  selectedOneTexture.value = textures[textureIndex];
}
function changeOneTexture(index, object) {

  const originalObjectName = Object.keys(objectNamesMapping).find(key => objectNamesMapping[key] === object);
  const loadedObject = loadedObjects[originalObjectName];


  if (loadedObject) {
    const textureUrl = textures[index];
    ///const newTexture = new THREE.TextureLoader().load(textureUrl);
    console.log(loadedObject)

    loadedObject.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.material.map = new THREE.TextureLoader().load(textureUrl);
        node.material.needsUpdate = true;
        console.log(`Changed texture of ${originalObjectName} to ${textureUrl}`);
      }
    });
    objectTextures[originalObjectName] = textureUrl; // Speichere die aktuelle Textur für das Objekt
    textureIndex = index;
    selectedOneTexture.value = textures[textureIndex];

  }
}


</script>



<style scoped>
h1 {
  font-weight: 800;
}

.buttonContainer {
  display: flex;
}

.textureButton {
  border-radius: 10px;
  flex-direction: row;

}

.textureButton.selected {
  position: relative;
}

.textureButton.selected::after {
  /* content: '✓'; */
  content: url('/PRO5/assets/check.svg');
  position: absolute;
  bottom: -10px;
  right: -10px;
  color: #3C4F64;
}

.textureButton img {
  background-color: white;
  border-radius: 20px;
  width: 40px;
  height: 40px;
  box-shadow: rgba(91, 91, 97, 0.2) 0px 5px 5px 0px;
  padding: 2px;
  margin: 4px;
}

.container {
  display: flex;
  padding: 2rem;
  flex-direction: row;
}

.ui {
  margin-left: 2rem;
  margin-right: 2rem;
  flex-direction: column;

}

button {
  margin: 4px;
  justify-content: start;
  background-color: white;
  border-width: 0px;
  border-radius: 4px;
  box-shadow: rgba(91, 91, 97, 0.2) 0px 7px 29px 0px;
  padding-block: 20px;
  padding-inline: 12px
}



.button {
  border-radius: 4px;
  box-shadow: rgba(91, 91, 97, 0.2) 0px 7px 29px 0px;
  padding: 0;
  margin: 0;
}

.button div {
  border-radius: 4px;
}

.button.selected {
  position: relative;
}

.button.selected::after {
  /* content: '✓'; */
  content: url('/PRO5/assets/check.svg');
  position: absolute;
  bottom: -10px;
  right: -10px;
  color: #3C4F64;
}

#container3D {
  flex-direction: row;
  margin-left: 2rem;
  margin-right: 2rem;
  background-color: rgb(255, 255, 255)
}

.saveButton {
  color: white;
  background-color: var(--vt-c-text-light-1);
  cursor: pointer;
}

.icon {
  margin-left: 2px;
  margin-right: 4px;
  font-size: 18px;
}

h4 {
  font-weight: 600;
}

canvas {

  width: 100%;
  height: 100%;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 10px;
}
</style>
