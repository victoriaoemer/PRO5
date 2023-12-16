<template>
  <div class="container">
    <div id="container3D" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp"></div>
    <div class="ui">
      <p>Wähle deine Ansicht:</p>
      <div style="display: flex; gap: 8px; margin-bottom: 20px; margin: 4px;">
        <!-- <button @click="toggleCameraToWide" id="totaleButton"> Totale </button> -->
        <img src="/PRO5/assets/totale.png" height="80" alt="Totale" class="button" @click="toggleCameraToWide">
        <img src="/PRO5/assets/gardarobe.png" height="80" alt="Gardarobe" class="button" @click="toggleCameraToGardarobe">
        <img src="/PRO5/assets/kueche.png" height="80" alt="Küche" class="button" @click="toggleCameraToKueche">
      </div>
      

      <button @click="hideWalls">Wände ausblenden</button>
      <button @click="hideDesklamp">Tischlampe ausblenden</button>
      <button @click="saveData">Daten als PDF speichern</button>
      <div>
        <p>Material aller Möbelstücke ändern</p>
        <div class="buttonContainer">
          <div v-for="(texture, index) in textures" :key="index" class="textureButton" @click="changeAllTextures(index)">
            <img :src="texture" alt="Texture Image">
          </div>
        </div>
      </div>
      <div>
        <p>Material einzelner Möbelstücke ändern</p>
        <p>Ausgewähltes Möbelstück: {{ selectedObjectName }}</p> <!-- Hier wird der Name angezeigt -->
        <div class="buttonContainer">
          <div v-for="(texture, index) in textures" :key="index" class="textureButton"
            @click="changeOneTexture(index, selectedObjectName)">
            <img :src="texture" alt="Texture Image">
          </div>
        </div>
      </div>


    </div>
  </div>
</template>


<script setup>
import * as THREE from 'three';
import { ref } from 'vue';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
//Modules below are regarded to shader
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

import jsPDF from 'jspdf';


import { onMounted, render } from 'vue';
const loadedObjects = {};
const fixedObjects = {};
const objectTextures = {};


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const camera3 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
let activeCamera = camera;

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


const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// const composer = new EffectComposer(renderer);

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

  // renderer.domElement.addEventListener('mousemove', onMouseMove, false);
  // renderer.domElement.addEventListener('mouseout', onMouseOut, false);
});

// funct ion o  nMouseMove(event) {
//   const canvasPosition = renderer.domElement.getBoundingClientRect();
//   mouse.x = ((event.clientX - canvasPosition.left) / (renderer.domElement.clientWidth)) * 2 - 1;
//   mouse.y = -((event.clientY - canvasPosition.top) / (renderer.domElement.clientHeight)) * 2 + 1;
//   raycaster.setFromCamera(mouse, activeCamera);
//   const intersects = raycaster.intersectObjects(raycastObjects);

//   if (intersects.length > 0) {
//     outlinePass.selectedObjects = [intersects[0].object];
//   } else {
//     outlinePass.selectedObjects = [];
//   }
// }

// function onMouseOut() {
//   outlinePass.selectedObjects = [];
// }
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

glTFLoader.load('/PRO5/assets/gltf/Room/lights.gltf', function (gltf) {
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


glTFLoader.load('/PRO5/assets/gltf/Room/room_wire.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 210);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  fixedObjects.room_wireframe = gltf.scene;
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

glTFLoader.load('/PRO5/assets/gltf/Room/mirror_room.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 210);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  //fixedObjects.mirror_room = gltf.scene;
});

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
  gltf.scene.position.set(0, 10, 85);
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
  gltf.scene.position.set(0, 10, 85);
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
  gltf.scene.position.set(10, 10, 160);
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
  gltf.scene.position.set(10, 10, 160);
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

  //loadedObjects.washbasinstuff = gltf.scene;
  scene.add(gltf.scene);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
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
  gltf.scene.position.set(37, 10, 160);

  loadedObjects.desk = gltf.scene;
  loadedObjects.desk.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
      node.castShadow = true;
    }
  });
  scene.add(gltf.scene);
});

//------------------------------------------Additional objects to toggle------------------------------------------//

glTFLoader.load('/PRO5/assets/gltf/Objects/deskLamp.gltf', function (gltf) {
  gltf.scene.scale.set(5, 5, 5);
  gltf.scene.position.set(45, 47, 181);
  gltf.scene.rotateY(-2.5);
  scene.add(gltf.scene);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
    }
  });
  fixedObjects.desklamp = gltf.scene;
});


//------------------------------------------Axis and Lights------------------------------------------//

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
camera.position.set(-100, 330, 80);
camera.lookAt(object.position);
camera2.position.set(-90, 80, -20);
camera3.position.set(30, 80, 60);

const pointLight = new THREE.PointLight(0xffffff, 18000);
pointLight.position.set(-30, 120, 30);
pointLight.castShadow = true; // Enable shadow casting for the light
pointLight.shadow.mapSize.width = 512; // default
pointLight.shadow.mapSize.height = 512; // default
pointLight.shadow.camera.near = 0.5; // default
pointLight.shadow.camera.far = 300; // default

scene.add(pointLight);

const pointlight1 = new THREE.PointLight(0xffffff, 1400);
pointlight1.position.set(0, 120, -100);
pointlight1.castShadow = true; // Enable shadow casting for the light
pointlight1.shadow.mapSize.width = 512; // default
pointlight1.shadow.mapSize.height = 512; // default
pointlight1.shadow.camera.near = 0.5; // default
pointlight1.shadow.camera.far = 300; // default
scene.add(pointlight1);

const pointlight2 = new THREE.PointLight(0xffffff, 3000);
pointlight2.position.set(-80, 80, -120);
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


const animate = () => {
  requestAnimationFrame(animate);
  //composer.render();
  controls.update();
  renderer.render(scene, activeCamera)
}
animate();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
renderer.domElement.addEventListener('click', onClick, false);

const raycastObjects = [];

let INTERSECTED;
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
    // console.log('Intersection:', intersects[0]);

    const objectName = intersects[0].object.name;
    //selectedObjectName.value = objectName;
    const cleanedObjectName = objectName.replace(/_[0-9]/g, '');
    console.log(cleanedObjectName);

    selectedObjectName.value = objectNamesMapping[cleanedObjectName] || cleanedObjectName;

    if (INTERSECTED != intersects[0].object) {

      if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xff0000);
    }
  } else {
    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    INTERSECTED = null;
  }
}

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

  controls.dispose();
  controls = new OrbitControls(activeCamera, renderer.domElement);
  controls.addEventListener('change', () => {
    renderer.render(scene, activeCamera);
  });
}

function toggleCameraToGardarobe() {
  activeCamera = camera2;

  controls.dispose();
  controls.addEventListener('change', () => {
    renderer.render(scene, activeCamera);
  });
}


function toggleCameraToKueche() {
  activeCamera = camera3;

  controls.dispose();
  controls.addEventListener('change', () => {
    renderer.render(scene, activeCamera);
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
  toggleVisibility('room');
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

  pdf.text("Materialliste: ", 10, 100);
  for (let key in objectTextures) {
    const textureShortInfo = textureShortInfos[objectTextures[key]] || objectTextures[key];
    const listItemText = `${objectNamesMapping[key] || key}: ${textureShortInfo}`;
    pdf.text(`${listItemNumber}. ${listItemText}`, 10, listPositionY);
    listPositionY += 8; // Verringere den Abstand zwischen den Listenelementen
    listItemNumber++;
  }



  pdf.save("KitzConfig - Datenblatt.pdf");
}

function hideDesklamp() {
  toggleVisibility('desklamp');
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
}
function changeOneTexture(index, object) {

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

  }
}


</script>



<style scoped>
.buttonContainer {
  display: flex;
}

.textureButton {
  border-radius: 10px;
  flex-direction: row;

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
}

#container3D {
  flex-direction: row;
  margin-left: 2rem;
  margin-right: 2rem;
  background-color: rgb(249, 249, 249)
}

canvas {

  width: 1024px !important;
  height: 546px !important;
  ;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 10px;
}
</style>
