<template>
  <div class="container">
    <div>
      <div id="container3D" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">
        <div v-if="additionalObjectsLoaded" class="canvas-menu">
          <font-awesome-icon title="Zurück" @click="undoTextureChange()" icon="fa-solid fa-rotate-left"
            class="canvas-icon" />
          <font-awesome-icon title="Ansicht zurücksetzen" v-if="selectedCameraView === 'totale'"
            @click="resetStartscreen()" icon="fa-solid fa-video" class="canvas-icon" />
          <font-awesome-icon title="Wände aus/einblenden" v-if="selectedCameraView === 'totale'" @click="hideWalls"
            class="canvas-icon" icon="fa-solid fa-cube" />
          <font-awesome-icon title="Wireframe aus/einblenden" v-if="selectedCameraView === 'totale'"
            @click="toggleWireframe" class="canvas-icon" icon="fa-solid fa-pen-to-square" />
          <font-awesome-icon title="Bedienungshilfe" @click="helpScreen()" icon="fa-solid fa-circle-question"
            class="canvas-icon" />
        </div>
        <div v-if="isVisible" class="helpscreen"> <font-awesome-icon icon="fa-solid fa-circle-question" />
          <h4>Hilfestellung</h4>
          <div class="helpscreen-container">
            <div class="mouse-col">
              <div class="mouse">
                <img class="mouse-icon" src="/PRO5/assets/svg/mouse_left.svg" alt="right mouse button" />
                <div class="mouse-descriptions">
                  <h4>linke Maustaste</h4>
                  <br />
                  <p>use left mouse navigate</p>
                </div>
              </div>
              <div class="mouse">
                <img class="mouse-icon" src="/PRO5/assets/svg/mouse_right.svg" alt="right mouse button" />
                <div class="mouse-descriptions">
                  <h4>rechte Maustaste</h4>
                  <br />
                  <p>use right mouse button to pan</p>
                </div>
              </div>
              <div class="mouse">
                <img class="mouse-icon" src="/PRO5/assets/svg/mouse_scrollwheel.svg" alt="right mouse button" />
                <div class="mouse-descriptions">
                  <h4>Scrollwheel</h4>
                  <br />
                  <p>use scroll wheel to zoom</p>
                </div>
              </div>
            </div>
            <div class="mouse-col">
              <div class="mouse">
                <img class="mouse-icon" src="/PRO5/assets/svg/mouse_scrollwheel.svg" alt="right mouse button" />
                <div class="mouse-descriptions">
                  <h4>Material ändern</h4>
                  <br />
                  <p>um ein Material zu verändern, klicken Sie auf das gewünschte Material um es auf alle Möbel anzuwenden
                  </p>
                  <br />
                  <p>um ein Material für ein einzelnes Möbelstück zu verändern, klicken Sie auf das gewünschte Möbelstück
                    und dann auf das Material</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="!additionalObjectsLoaded" class="loadingScreen">
      <!-- Loading screen or indicator -->
      <img src="/PRO5/public/icon_house.png" alt="loading_icon" class="logooutside" />
      <img src="/PRO5/public/icon_inside.png" alt="loading_icon" class="logoinside" />

      <p class="loadingScreenText">Konfigurator lädt...</p>


    </div>


    <div v-else class="ui">
      <h1>Einzelzimmer</h1>
      <div v-for="(category, index) in categories" class="categoryContainer" :key="index">
        <button class="category" @click="toggleCategory(category, index)" style="display: flex;">
          <p style="margin-right: 8px; font-weight: bold;">{{ category.title }}</p>
          <font-awesome-icon v-if="!category.opened" title="Mehr anzeigen" icon="fa-solid fa-chevron-down" />
          <font-awesome-icon v-if="category.opened" title="Weniger anzeigen" icon="fa-solid fa-chevron-up" />
        </button>
        <div v-if="category.opened" class="opened">
          <div v-if="category.name === 'ansicht'">
            <div style="display: flex; gap: 15px; margin-bottom: 20px; margin: 4px;">
              <!-- <button @click="toggleCameraToWide" id="totaleButton"> Totale </button> -->
              <button alt="Totale" class="button" :class="{ selected: selectedCameraView === 'totale' }"
                @click="toggleCameraToWide">
                <div class="totale"></div>
              </button>
              <button alt="Gardarobe" class="button" :class="{ selected: selectedCameraView === 'gardarobe' }"
                @click="toggleCameraToGardarobe">
                <div class="room"></div>
              </button>
              <button alt="Küche" class="button" :class="{ selected: selectedCameraView === 'kueche' }"
                @click="toggleCameraToKueche">
                <div class="kitchen"></div>
              </button>
            </div>
          </div>

          <div v-if="category.name === 'allMaterials'">
            <div class="buttonContainer">
              <div v-for="(texture, index) in textures" :key="index" class="textureButton"
                :class="{ selected: selectedTexture === texture }" @click="changeAllTextures(index)">
                <img :src="texture" alt="Texture Image">
              </div>
            </div>
          </div>

          <div v-if="category.name === 'oneMaterial'">
            <p v-if="selectedObjectName == null"> Wählen Sie ein Möbelstück aus indem Sie darauf klicken!</p>
            <div v-else>
              <p>Ausgewähltes Möbelstück: {{ selectedObjectName }}</p>
              <div class="buttonContainer">
                <div v-for="(texture, index) in textures" :key="index" class="textureButton"
                  @click="changeOneTexture(index, selectedObjectName)"
                  :class="{ selected: selectedOneTexture === texture }">
                  <img :src="texture" alt="Texture Image">
                </div>
              </div>
            </div>
          </div>

          <div v-if="category.name === 'additionalObjects'">
            <p>Wähle die Objekte aus, die du hinzufügen möchtest</p>
            <div>
              <div v-if="additionalObjectsLoaded" class="buttonContainer">
                <!-- Hier kommt dein HTML-Code mit v-for -->
                <div v-for="(object, index) in additionalObjects" :key="index"
                  @click="toggleAdditionalObjects(object, index)" class="textureButton"
                  :class="{ selected: selectedAdditionalObjects[index] }">
                  <img :src="`${'/PRO5/assets/additionalObjects/' + index + '.png'}`" alt="Texture Image" />
                </div>
              </div>
              <div v-else>
                <!-- Hier kannst du einen Ladeindikator oder eine Meldung anzeigen, während die Objekte geladen werden -->
                Lade zusätzliche Objekte...
              </div>
            </div>
          </div>

        </div>
      </div>
      <!-- <div>
        <h4>Wähle deine Ansicht</h4>
        <div style="display: flex; gap: 15px; margin-bottom: 20px; margin: 4px;">
          <button alt="Totale" class="button" :class="{ selected: selectedCameraView === 'totale' }"
            @click="toggleCameraToWide">
            <div class="totale"></div>
          </button>
          <button alt="Gardarobe" class="button" :class="{ selected: selectedCameraView === 'gardarobe' }"
            @click="toggleCameraToGardarobe">
            <div class="room"></div>
          </button>
          <button alt="Küche" class="button" :class="{ selected: selectedCameraView === 'kueche' }"
            @click="toggleCameraToKueche">
            <div class="kitchen"></div>
          </button>
        </div>
      </div>
      <br>
      <br>


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
        <div v-else>
          <p>Ausgewähltes Möbelstück: {{ selectedObjectName }}</p>
          <div class="buttonContainer">
            <div v-for="(texture, index) in textures" :key="index" class="textureButton"
              @click="changeOneTexture(index, selectedObjectName)" :class="{ selected: selectedOneTexture === texture }">
              <img :src="texture" alt="Texture Image">
            </div>
          </div>
        </div>
      </div>


      <br>
      <div>
        <h4>Zusatzobjekte</h4>
        <p>Wähle die Objekte aus, die du hinzufügen möchtest</p>
        <div>
          <div v-if="additionalObjectsLoaded" class="buttonContainer">
            <div v-for="(object, index) in additionalObjects" :key="index" @click="toggleAdditionalObjects(object, index)"
              class="textureButton" :class="{ selected: selectedAdditionalObjects[index] }">
              <img :src="`${'/PRO5/assets/additionalObjects/' + index + '.png'}`" alt="Texture Image" />
            </div>
          </div>
          <div v-else>
            Lade zusätzliche Objekte...
          </div>
        </div>
      </div>
      <br> -->

      <div>
        <button class="saveButton" @click="saveData"> <font-awesome-icon class="icon" icon="fa-solid fa-download" />
          Daten
          als PDF speichern</button>
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
const isVisible = ref(false);


import jsPDF from 'jspdf';


import { onMounted, render } from 'vue';

const loadedObjects = {};
const fixedObjects = {};
const objectTextures = {};
const additionalObjects = {};


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.name = 'camera';
const cameraTotale = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.name = 'cameraTotale';
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera2.name = 'camera2';
const camera3 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera3.name = 'camera3';
const camera4 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera4.name = 'camera4';
const camera5 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera5.name = 'camera5';
const camera6 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera6.name = 'camera6';


let activeCamera = camera;
let selectedCameraView = ref('totale');


let mirror, bathrommMirror, windowrefl, windowreflback;
const additionalObjectsLoaded = ref(false);

const selectedAdditionalObjects = reactive({
  curtains: true,
  desklamp: true,
  plant02: true,
  coathanger: true,
  plant01: true
  // Add more objects as needed
});

const categories = reactive({
  'Ansicht': {
    title: 'Ansicht wählen',
    name: 'ansicht',
    opened: true
  },
  'Material': {
    title: 'Material aller Möbelstücke ändern',
    name: 'allMaterials',
    opened: true
  },
  'Material2': {
    title: 'Material einzelner Möbelstücke ändern',
    name: 'oneMaterial',
    opened: false
  },
  'Zusatzobjekte': {
    title: 'Zusatzobjekte',
    name: 'additionalObjects',
    opened: false
  }
})

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

const additionalobjectNamesMapping = {
  'curtains': 'Vorhänge',
  'desklamp': 'Tischlampe',
  'plant01': 'Große Pflanze',
  'plant02': 'Kleine Pflanze',
  'coathanger': 'Kleiderbügel',
  // Füge hier alle gewünschten Zuordnungen hinzu
};

const textureShortInfos = {
  '/PRO5/assets/gltf/text/Gold_wood.jpg': 'Eichenholz',
  '/PRO5/assets/gltf/text/plywood03.jpg': 'Birkenholz',
  '/PRO5/assets/gltf/text/walnut.jpg': 'Walnussholz',
  '/PRO5/assets/gltf/text/white.jpg': 'Weiß',
  '/PRO5/assets/gltf/text/black.jpg': 'Schwarz',
  // '/PRO5/assets/gltf/text/adthe.jpg': 'Nuhiu',
  // Füge hier weitere Texturen hinzu
};

let textureIndex = 1;
const textures = [
  '/PRO5/assets/gltf/text/Gold_wood.jpg',
  '/PRO5/assets/gltf/text/plywood03.jpg',
  '/PRO5/assets/gltf/text/walnut.jpg',
  '/PRO5/assets/gltf/text/white.jpg',
  '/PRO5/assets/gltf/text/black.jpg',
  // '/PRO5/assets/gltf/text/adthe.jpg',
]
const textureloader = new THREE.TextureLoader().load('/PRO5/assets/gltf/text/Gold_wood.jpg');
let selectedTexture = ref('/PRO5/assets/gltf/text/Gold_wood.jpg');
let selectedOneTexture = ref(null);



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
controls.minDistance = 100;
controls.maxDistance = 350;


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

//------------------------------------------Additional objects to toggle------------------------------------------//

glTFLoader.load('/PRO5/assets/gltf/Objects/curtains.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 200);
  gltf.scene.rotateY(0);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });

  additionalObjects.curtains = gltf.scene;
  if (alleZusatzObjekteGeladen()) {
    additionalObjectsLoaded.value = true;
  }
  scene.add(gltf.scene);
});

glTFLoader.load('/PRO5/assets/gltf/Objects/deskLamp.gltf', function (gltf) {
  gltf.scene.scale.set(5, 5, 5);
  gltf.scene.position.set(45, 47, 170);
  gltf.scene.rotateY(-2.5);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
  additionalObjects.desklamp = gltf.scene;
  if (alleZusatzObjekteGeladen()) {
    additionalObjectsLoaded.value = true;
  }
  scene.add(gltf.scene);
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

  additionalObjects.plant01 = gltf.scene;
  if (alleZusatzObjekteGeladen()) {
    additionalObjectsLoaded.value = true;
  }
  scene.add(gltf.scene);
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

  additionalObjects.coathanger = gltf.scene;
  if (alleZusatzObjekteGeladen()) {
    additionalObjectsLoaded.value = true;
  }
  scene.add(gltf.scene);
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

  additionalObjects.plant02 = gltf.scene;
  if (alleZusatzObjekteGeladen()) {
    additionalObjectsLoaded.value = true;
  }
  scene.add(gltf.scene);
});





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
const material = new THREE.MeshPhysicalMaterial({
  roughness: 0.1,
  transmission: 0.9,
  thickness: 0.1
});

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

windowreflback = new Reflector(geometry, material);

windowreflback.position.x = -20;
windowreflback.position.y = 64.5;
windowreflback.position.z = 201;

//windowreflback.rotateY(Math.PI /);

scene.add(windowreflback);

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

//------------------------------------------Axis and Lights------------------------------------------//

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
camera.position.set(-150, 300, 0);
camera.lookAt(object.position);

cameraTotale.position.set(-150, 300, 0);
cameraTotale.lookAt(object.position);

camera2.position.set(-90, 80, -20);
camera3.position.set(30, 80, 60);

//cameras for pdf

camera4.position.set(-1, 350, 0);
camera4.lookAt(object.position);

camera5.position.set(-70, 85, -20);
camera5.lookAt(0, 75, 50);

camera6.position.set(30, 80, 60);
camera6.lookAt(-70, 25, 215);

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

// Speichert die Historie der Zustände
let stateHistory = [];
let currentStateIndex = -1;

function saveCurrentState() {
  console.log("Saving state...", stateHistory);
  currentStateIndex++;
  stateHistory = stateHistory.slice(0, currentStateIndex);
  const currentState = {};
  for (let key in loadedObjects) {
    currentState[key] = objectTextures[key];
  }
  stateHistory.push({ ...currentState }); // Hier verwenden wir den Spread Operator, um eine tiefe Kopie zu erstellen
}

function undoTextureChange() {
  console.log("Undoing texture change...", stateHistory, currentStateIndex);
  if (currentStateIndex > 0) {
    currentStateIndex--;
    applyState(stateHistory[currentStateIndex]);
    const originalObjectName = Object.keys(objectNamesMapping).find(key => objectNamesMapping[key] === selectedObjectName.value);
    selectedOneTexture.value = objectTextures[originalObjectName] || '/PRO5/assets/gltf/text/Gold_wood.jpg';
  }
}

function applyState(state) {
  for (let key in loadedObjects) {
    const object = loadedObjects[key];
    const textureUrl = state[key];

    if (textureUrl !== undefined) {
      object.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          if (node.material.map) {
            node.material.map.dispose();
          }
          node.material.map = new THREE.TextureLoader().load(textureUrl);
          node.material.needsUpdate = true;
        }
      });
      objectTextures[key] = textureUrl;
    }
  }
}

function redoTextureChange() {
  if (currentStateIndex < stateHistory.length - 1) {
    currentStateIndex++;
    applyState(stateHistory[currentStateIndex]);
  }
}








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

    selectedObjectName.value = objectNamesMapping[cleanedObjectName] || cleanedObjectName;

    if (INTERSECTED != intersects[0].object) {

      if (INTERSECTED) {
        // Reset the outline effect on the previously selected object
        outlinePass.selectedObjects = [];
      }

      INTERSECTED = intersects[0].object;

      // Set the outline effect on the newly selected object
      outlinePass.selectedObjects = [INTERSECTED];

      const originalObjectName = Object.keys(objectNamesMapping).find(key => objectNamesMapping[key] === selectedObjectName.value);
      selectedOneTexture.value = objectTextures[originalObjectName] || '/PRO5/assets/gltf/text/Gold_wood.jpg';
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


function helpScreen() {
  console.log(isVisible);
  isVisible.value = !isVisible.value;
}

function resetStartscreen() {
  camera.position.set(-150, 300, 0);
  camera.lookAt(object.position);
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

function toggleCategory(category, index) {
  categories[index].opened = !categories[index].opened;
  console.log('toggleCategory ausgelöst', category, index);
}

function alleZusatzObjekteGeladen() {
  // Überprüfe hier, ob alle zusätzlichen Objekte im additionalObjects-Array vorhanden sind
  return (

    additionalObjects.curtains &&
    additionalObjects.desklamp &&
    additionalObjects.plant01 &&
    additionalObjects.coathanger &&
    additionalObjects.plant02

    // Füge hier weitere Objekte hinzu
  );
}

function toggleCameraToWide() {

  activeCamera = camera;
  init();
  fixedObjects.room.visible = true;
  fixedObjects.room_complete.visible = false;

  selectedCameraView.value = 'totale';
  controls.dispose();
  controls = new OrbitControls(activeCamera, renderer.domElement);
  controls.minDistance = 100;
  controls.maxDistance = 350;


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

  fixedObjects.room.visible = true;
  fixedObjects.room_complete.visible = false;

  const originalWidth = 1920//renderer.domElement.width;
  const originalHeight = 1080//renderer.domElement.height;

  // Setze die gewünschte Auflösung für das Rendern
  const renderWidth = 1920;
  const renderHeight = 1080;


  // Ändere die Größe des Renderers
  renderer.setSize(renderWidth, renderHeight);

  renderer.render(scene, cameraTotale);
  const canvas = document.getElementsByTagName("canvas", { preserveDrawingBuffer: true })[0];
  const mainImage = canvas.toDataURL("image/png", 0.5);

  //console.log("Main Image Data URL:", mainImage);
  console.log("Main Image Size (bytes):", mainImage.length);

  renderer.render(scene, camera5);
  const secondImage = canvas.toDataURL("image/png");

  //console.log("Second Image Data URL:", secondImage);
  console.log("Second Image Size (bytes):", secondImage.length);

  renderer.render(scene, camera6);
  const thirdImage = canvas.toDataURL("image/png");

  //console.log("Third Image Data URL:", thirdImage);
  console.log("Third Image Size (bytes):", thirdImage.length);

  renderer.render(scene, camera4);
  const fourthImage = canvas.toDataURL("image/png", 0.5);





  // Ändere die Größe des Renderers
  renderer.setSize(originalWidth, originalHeight);

  var pdf = new jsPDF({
    compress: true,
  })

  // Wähle die Schriftart aus (z.B., "times", "helvetica", "courier", etc.)
  pdf.setFont("Helvetica", "bold");

  // Wähle die Schriftgröße aus (z.B., 12 für 12pt)
  const fontSize = 12;
  pdf.setFontSize(fontSize);

  // Füge den Titel über dem Bild hinzu
  pdf.text("KitzConfig - Datenblatt", pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

  // Skaliere das Bild basierend auf der Größe des Canvas und des Bildes
  const canvasWidth = 210//pdf.internal.pageSize.getWidth();
  const canvasHeight = 297//pdf.internal.pageSize.getHeight();
  const imageWidth = 200; // Definiere die Breite des Bildes im PDF
  const imageHeight = 105//(imageWidth / canvas.width) * canvas.height;

  console.log(canvasWidth, canvasHeight, imageWidth, imageHeight);

  // Definiere das feste Format für die Bilder im PDF
  const pdfImageWidth = 1920 / 4;
  const pdfImageHeight = 1080 / 4;

  // Füge das Bild hinzu
  pdf.addImage(mainImage, 'PNG', (canvasWidth - imageWidth) / 2, 20, imageWidth, imageHeight / 1);
  pdf.addImage(secondImage, 'PNG', 10, 190, imageWidth / 2.3, imageHeight / 2.3);
  pdf.addImage(thirdImage, 'PNG', 115, 190, imageWidth / 2.3, imageHeight / 2.3);

  pdf.setFontSize(10);
  pdf.setFont("Helvetica", "normal");
  pdf.text('Ansicht: Totale', 90, 102);
  pdf.text('Ansicht: POV-Küche', 40, 242);
  pdf.text('Ansicht: POV-Bett', 140, 242);


  // Füge das Bild hinzu und skaliere es auf das feste Format
  //pdf.addImage(mainImage, 'PNG', 10, 20, pdfImageWidth, pdfImageHeight);
  //pdf.addImage(secondImage, 'PNG', 220, 20, pdfImageWidth, pdfImageHeight);
  //pdf.addImage(thirdImage, 'PNG', 430, 20, pdfImageWidth , pdfImageHeight);

  //pdf.line(10, 115, 200, 115); // Von (20, 30) nach (60, 30)
  //pdf.line(10, 180, 200, 180); // Von (20, 30) nach (60, 30)

  pdf.line(105, 120, 105, 170); // Von (20, 30) nach (60, 30)


  // Füge eine nummerierte Liste der Materialinformationen hinzu
  let listPositionY = 0 + imageHeight + 20; // Verringere den Abstand zwischen dem Bild und der Liste
  let listItemNumber = 1;

  pdf.setFontSize(fontSize);
  pdf.setFont("Helvetica", "bold");
  pdf.text("Materialliste: ", 30, listPositionY);
  pdf.setFont("Helvetica", "normal");

  for (let key in objectTextures) {
    const textureShortInfo = textureShortInfos[objectTextures[key]] || objectTextures[key];
    const listItemText = `${objectNamesMapping[key] || key}: ${textureShortInfo}`;
    pdf.text(`${listItemNumber}. ${listItemText}`, 30, listPositionY + 6);
    listPositionY += 6; // Verringere den Abstand zwischen den Listenelementen
    listItemNumber++;
  }

  // Füge eine nummerierte Liste der Materialinformationen hinzu
  let listPositionY2 = 0 + imageHeight + 20; // Verringere den Abstand zwischen dem Bild und der Liste
  let listItemNumber2 = 1;

  pdf.setFont("Helvetica", "bold");
  pdf.text("Zusätzliche Objekte: ", 130, listPositionY2);
  pdf.setFont("Helvetica", "normal");

  // Iteriere über selectedAdditionalObjects und füge die Informationen zur PDF hinzu
  for (const objectName in selectedAdditionalObjects) {
    const mappedObjectName = additionalobjectNamesMapping[objectName] || objectName;
    const added = selectedAdditionalObjects[objectName];
    const outputText = `${mappedObjectName}: ${added ? 'hinzugefügt' : 'nicht hinzugefügt'}`;
    pdf.text(`${listItemNumber2}. ${outputText}`, 130, listPositionY2 + 6);
    listPositionY2 += 6; // Verringere den Abstand zwischen den Listenelementen
    listItemNumber2++;
  }

  // Neue Seite hinzufügen
  pdf.addPage();

  // Text auf der zweiten Seite hinzufügen


  pdf.addImage(fourthImage, 'PNG', 200, 100, 300, 205, undefined, undefined, 90);
  pdf.text('Ansicht: Vogelperspektive', 90, 262);

  pdf.save("KitzConfig - Datenblatt.pdf");
}


function toggleAdditionalObjects(object, index) {
  object.visible = !object.visible;
  selectedAdditionalObjects[index] = object.visible;
}

function changeAllTextures(index) {
  for (let key in loadedObjects) {
    //if (key === 'room' || key === 'lowchairfeets' || key === 'doors' || key === 'bedstuff' || key === 'floor' || key === 'roommirror' || key === 'highchairfeet' || key === 'kitchenstuff' || key === 'washbasinstuff' || key === 'closethandle' || key === 'desklamp') continue;
    const object = loadedObjects[key];
    const textureUrl = textures[index]; 0
    //const newTexture = new THREE.TextureLoader().load(textureUrl);

    object.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.material.map = new THREE.TextureLoader().load(textureUrl);
        node.material.needsUpdate = true;
      }
    });
    objectTextures[key] = textureUrl; // Speichere die aktuelle Textur für das Objekt
  }
  textureIndex = index;
  selectedTexture.value = textures[textureIndex];
  selectedOneTexture.value = textures[textureIndex];
  saveCurrentState(); // Speichere vor der Änderung den Zustand
}
function changeOneTexture(index, object) {
  selectedTexture.value = null;

  const originalObjectName = Object.keys(objectNamesMapping).find(key => objectNamesMapping[key] === object);
  const loadedObject = loadedObjects[originalObjectName];


  if (loadedObject) {
    const textureUrl = textures[index];
    ///const newTexture = new THREE.TextureLoader().load(textureUrl);

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
    saveCurrentState(); // Speichere vor der Änderung den Zustand
  }
}


</script>



<style scoped>
.category {
  padding: 5px;
  width: 100%;
  text-align: start;
  margin: 0;
  box-shadow: none;
}

.opened {
  padding: 11px 12px;
}

.categoryContainer {
  margin-bottom: 20px;
}

.loadingScreen {
  width: 100%;
  background-color: white;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  align-items: center;
  display: flex;
  justify-content: center;
}

.logooutside {
  height: 150px;
  width: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  /* Stellen Sie sicher, dass es über dem Text liegt */
}

.logoinside {
  height: 120px;
  width: auto;
  position: absolute;
  top: 50.6%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(0);
  /* Rotation hinzufügen */
  animation: spin 2s infinite ease-in-out;
  z-index: 2;
  /* Stellen Sie sicher, dass es über logooutside liegt */
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.loadingScreenText {
  /* Stellen Sie sicher, dass der Text über den Bildern liegt */
  margin-top: 170px;
  /* Passen Sie den Abstand nach Bedarf an */
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
}

.loadingScreenText:first-of-type {
  animation: showup 7s infinite;
}

@keyframes showup {
  0% {
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}




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
  bottom: -5px;
  right: -5px;
  color: #3C4F64;
  scale: 70%;
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

.totale {
  content: url('/PRO5/assets/totale.png');
  height: 80px;
}

.totale:hover {
  content: url('/PRO5/assets/POVTotale.gif');
  height: 80px;
}

.kitchen {
  content: url('/PRO5/assets/kitchen.png');
  height: 80px;
}

.kitchen:hover {
  content: url('/PRO5/assets/POVKitchen.gif');
  height: 80px;
}

.room {
  content: url('/PRO5/assets/room.png');
  height: 80px;
}

.room:hover {
  content: url('/PRO5/assets/POVRoom.gif');
  height: 80px;
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
  position: relative;
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

.canvas-menu {
  right: 0px;
  position: absolute;
  display: flex;
}

.canvas-icon {
  margin: 6px;
  padding: 8px;
  height: 16px;
  width: 16px;
  z-index: 100;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  cursor: pointer;
  font-size: 12px !important;
}

font-awesome-icon {
  font-size: 12px;
}

.canvas-icon {
  background-color: rgb(228, 228, 228);
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.canvas-icon:hover {
  color: grey;
  transition: 0.1s ease-in;
}

.helpscreen {
  padding: 20px;
  text-align: center;
  position: absolute;
  width: 800px;
  height: 400px;
  background-color: white;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mouse-icon {
  height: 40px;
  width: auto;
}

.mouse {
  padding: 20px;
  display: flex !important;
  text-align: left;
  line-height: 0.9;

}

.mouse-descriptions {
  margin-left: 20px;
}

.helpscreen-container {
  padding: 20px;
  display: flex;
  justify-content: space-between;
}

.mouse-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
