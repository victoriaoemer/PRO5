<template>
  <div class="container">
    <div id="container3D"></div>
    <div class="ui">
      <button @click="hideWalls">Toggle Walls</button>
      <button @click="hideDesklamp">Toggle Desk lamp</button>
      <div class="buttonContainer">
        <p>change all textures</p>
        <div v-for="(texture, index) in textures" :key="index" class="textureButton" @click="changeAllTextures(index)">
          <img :src="texture" alt="Texture Image">
        </div>
      </div>
      <div class="buttonContainer">
        <p>change one texture</p>
        <div v-for="(texture, index) in textures" :key="index" class="textureButton"
          @click="changeOneTexture(index, selectedObjectName)">
          <img :src="texture" alt="Texture Image">
        </div>
      </div>
      <button @click="toggleCamera">Toggle Camera</button>
    </div>
  </div>
</template>


<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
//Modules below are regarded to shader
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";


import { onMounted, render } from 'vue';
const loadedObjects = {};
const fixedObjects = {};


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
let activeCamera = camera;




let textureIndex = 1;
const textures = [
  '/PRO5/assets/gltf/text/Gold_wood.jpg',
  '/PRO5/assets/gltf/text/Birch_wood.jpg',
  '/PRO5/assets/gltf/text/ply_wood.jpg',
  //'src/assets/gltf/text/adthe.jpg',
]
const textureloader = new THREE.TextureLoader().load('/PRO5/assets/gltf/text/Gold_wood.jpg');


const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// const composer = new EffectComposer(renderer);


let controls = new OrbitControls(activeCamera, renderer.domElement);



let object = new THREE.Group();

let selectedObjectName = null;
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

// function onMouseMove(event) {
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

glTFLoader.load('/PRO5/assets/gltf/Washbasin_sep/washbasin_wood.gltf', function (gltf) {
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

// const floorGeometry = new THREE.PlaneGeometry(100, 100, 100, 1);
// const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 0 });
// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.rotation.x = -0.5 * Math.PI;
// floor.translateZ(20);	
// floor.receiveShadow = true;

// scene.add(floor);

// const floor11Geometry = new THREE.PlaneGeometry(100, 100, 100, 1);
// const floor11Material = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 0 });
// const floor1 = new THREE.Mesh(floor11Geometry, floor11Material);
// floor1.rotation.x = -0.5 * Math.PI;
// floor1.translateZ(12);	
// floor1.receiveShadow = true;

// scene.add(floor1);




//------------------------------------------Axis and Lights------------------------------------------//

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
camera.position.set(-120, 400, 100);
camera.lookAt(object.position);
camera2.position.set(-60, 80, 50);
camera2.lookAt(object.position);


// const AreaLight = new THREE.RectAreaLight(0xffffff, 500);
// AreaLight.position.set(0, 100, 195); //(x,y,z)
// AreaLight.castShadow = true; // Enable shadow casting for the light
// scene.add(AreaLight);

// const AreaLight02 = new THREE.RectAreaLight(0xffffff, 500);
// AreaLight02.position.set(-100, 100, -20);
// AreaLight02.castShadow = true; // Enable shadow casting for the light
// scene.add(AreaLight02);

// const AreaLight03 = new THREE.RectAreaLight(0xffffff, 1500);
// AreaLight03.position.set(-100, 100, 120);
// AreaLight03.castShadow = true; // Enable shadow casting for the light
// scene.add(AreaLight03);

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

const ambientLight = new THREE.AmbientLight(0xffffff, 2); // soft white light
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

  if (intersects.length > 0) {
    // console.log('Intersection:', intersects[0]);
    selectedObjectName = intersects[0].object.name;
    selectedObjectName = selectedObjectName.replace(/_[0-9]/g, '');
    console.log(selectedObjectName);
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



//------------------------------------------Functions------------------------------------------//

function toggleCamera() {
  activeCamera = (activeCamera === camera) ? camera2 : camera;

  // Remove existing controls
  controls.dispose();

  if (activeCamera === camera) {
    // Create OrbitControls for camera
    controls = new OrbitControls(activeCamera, renderer.domElement);

    controls.update();

  } else {
    // Create PointerLockControls for camera2 (first-person)
    controls = new PointerLockControls(activeCamera, renderer.domElement);
    controls.enabled = true;



    // Enable pointer lock on click for first-person controls
    const element = renderer.domElement;
    element.addEventListener('click', function () {
      controls.lock();
    });
  }

  // Update the controls in the render loop
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

function hideDesklamp() {
  toggleVisibility('desklamp');
}

function changeAllTextures(index) {
  for (let key in loadedObjects) {
    //if (key === 'room' || key === 'lowchairfeets' || key === 'doors' || key === 'bedstuff' || key === 'floor' || key === 'roommirror' || key === 'highchairfeet' || key === 'kitchenstuff' || key === 'washbasinstuff' || key === 'closethandle' || key === 'desklamp') continue;
    const object = loadedObjects[key];
    const textureUrl = textures[index];
    const newTexture = new THREE.TextureLoader().load(textureUrl);

    object.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.material.map = newTexture;
        node.material.needsUpdate = true;
      }
    });
  }
  textureIndex = index;
}
function changeOneTexture(index, object) {

  object = loadedObjects[object];
  const textureUrl = textures[index];
  const newTexture = new THREE.TextureLoader().load(textureUrl);

  object.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = newTexture;
      node.material.needsUpdate = true;
    }
  });

  textureIndex = index;
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
