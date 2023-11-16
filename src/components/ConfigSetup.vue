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
        <div v-for="(texture, index) in textures" :key="index" class="textureButton" @click="changeOneTexture(index, selectedObjectName)">
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
import { onMounted } from 'vue';
const loadedObjects = {};
const fixedObjects = {};


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
let activeCamera = camera;


let textureIndex = 1;
const textures = [
  'src/assets/gltf/text/Gold_wood.jpg',
  'src/assets/gltf/text/Birch_wood.jpg',
  'src/assets/gltf/text/adthe.jpg',
]
const textureloader = new THREE.TextureLoader().load('src/assets/gltf/text/Gold_wood.jpg');


const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new OrbitControls(activeCamera, renderer.domElement);
let object = new THREE.Group();

let selectedObjectName = null;
onMounted(() => {
  const container = document.getElementById('container3D');
  if (container) {
    container.appendChild(renderer.domElement);
  } else {
    console.error('Container-Element nicht gefunden.');
  }

});


//------------------------------------------Load Objects------------------------------------------//


const glTFLoader = new GLTFLoader();

glTFLoader.load('src/assets/gltf/Room/room.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 210);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  fixedObjects.room = gltf.scene;
});

glTFLoader.load('src/assets/gltf/Room/floor.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 210);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  fixedObjects.floor = gltf.scene;
});

glTFLoader.load('src/assets/gltf/Room/mirror_room.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 210);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  //fixedObjects.mirror_room = gltf.scene;
});

glTFLoader.load('src/assets/gltf/Room/doors.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-110, 0, 210);
  gltf.scene.rotateY(0);
  scene.add(gltf.scene);

  fixedObjects.doors = gltf.scene;
});

glTFLoader.load('src/assets/gltf/Closet_sep/closet.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-70, 10, 165);
  gltf.scene.rotateY(1.55);

  loadedObjects.closet = gltf.scene;
  loadedObjects.closet.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('src/assets/gltf/Closet_sep/closet_handle.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-70, 10, 165);
  gltf.scene.rotateY(1.55);

  //loadedObjects.closethandle = gltf.scene;
  scene.add(gltf.scene);
});

glTFLoader.load('src/assets/gltf/Bed_sep/bed_stuff.gltf', function (gltf) {
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(0, 10, 85);
  gltf.scene.rotateY(-1.55);
  scene.add(gltf.scene);

  //loadedObjects.bedstuff = gltf.scene;
  //no texture
});

glTFLoader.load('src/assets/gltf/Bed_sep/bedwood.gltf', function (gltf) {
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(0, 10, 85);
  gltf.scene.rotateY(-1.55);

  loadedObjects.bedwood = gltf.scene;
  loadedObjects.bedwood.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('src/assets/gltf/Garderobe/garderobe.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-35, 0, -142);
  gltf.scene.rotateY(0);

  loadedObjects.garderobe = gltf.scene;
  loadedObjects.garderobe.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('src/assets/gltf/LowChair_sep/lowchair_feet.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(10, 10, 160);
  gltf.scene.rotateY(1.55);

  //loadedObjects.lowchairfeets = gltf.scene;
  scene.add(gltf.scene);
});

glTFLoader.load('src/assets/gltf/LowChair_sep/lowchair_wood.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(10, 10, 160);
  gltf.scene.rotateY(1.55);

  loadedObjects.lowchairwood = gltf.scene;
  loadedObjects.lowchairwood.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('src/assets/gltf/HighChair_sep/HighChair_wood.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-40, 10, -5);
  gltf.scene.rotateY(1.5);

  loadedObjects.highchairwood = gltf.scene;
  loadedObjects.highchairwood.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('src/assets/gltf/HighChair_sep/HighChair_feet.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-40, 10, -5);
  gltf.scene.rotateY(1.5);

  //loadedObjects.highchairfeet = gltf.scene;
  scene.add(gltf.scene);
});

glTFLoader.load('src/assets/gltf/Kitchen_sep/kitchen_wood.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-35, 10, 16);
  gltf.scene.rotateY(0);

  loadedObjects.kitchen = gltf.scene;
  loadedObjects.kitchen.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('src/assets/gltf/Kitchen_sep/kitchen_stuff.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(-35, 10, 16);
  gltf.scene.rotateY(0);

  //loadedObjects.kitchenstuff = gltf.scene;
  scene.add(gltf.scene);
});

glTFLoader.load('src/assets/gltf/Washbasin_sep/Washbasin_stuff.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(0, 10, -75);
  gltf.scene.rotateY(-1.55);

  //loadedObjects.washbasinstuff = gltf.scene;
  scene.add(gltf.scene);
});

glTFLoader.load('src/assets/gltf/Washbasin_sep/Washbasin_wood.gltf', function (gltf) {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.set(0, 10, -75);
  gltf.scene.rotateY(-1.55);

  loadedObjects.washbasin = gltf.scene;
  loadedObjects.washbasin.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
    }
  });
  scene.add(gltf.scene);
});

glTFLoader.load('src/assets/gltf/Desk_sep/desk.gltf', function (gltf) {
  gltf.scene.scale.set(5, 5, 5);
  gltf.scene.position.set(37, 10, 160);

  loadedObjects.desk = gltf.scene;
  loadedObjects.desk.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.map = textureloader;
    }
  });
  scene.add(gltf.scene);
});

//------------------------------------------Additional objects to toggle------------------------------------------//

glTFLoader.load('src/assets/gltf/Objects/DeskLamp.gltf', function (gltf) {
  gltf.scene.scale.set(5, 5, 5);
  gltf.scene.position.set(45, 47, 181);
  gltf.scene.rotateY(-2.5);
  scene.add(gltf.scene);

  fixedObjects.desklamp = gltf.scene;
});



//------------------------------------------Axis and Lights------------------------------------------//

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
camera.position.set(-120, 400, 100);
camera.lookAt(object.position);
camera2.position.set(-60, 200, 50);
camera2.lookAt(object.position);


const directionalLight = new THREE.DirectionalLight(0xffffff, 1.4);
directionalLight.position.set(100, 100, 100);
directionalLight.castShadow = true; // Enable shadow casting for the light
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 2); // soft white light
ambientLight.position.y = 1000
scene.add(ambientLight);


const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, activeCamera);
  controls.update();
}
animate();

const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        renderer.domElement.addEventListener('click', onClick, false);



let INTERSECTED;
        function onClick() {
            event.preventDefault();

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, activeCamera);

            var intersects = raycaster.intersectObjects(scene.children);
      
            if (intersects.length > 0) {
               // console.log('Intersection:', intersects[0]);
                console.log(loadedObjects);
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
 
    object=loadedObjects[object];
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

function toggleCamera() {
  activeCamera = (activeCamera === camera) ? camera2 : camera;
  renderer.render(scene, activeCamera);
  controls.object = activeCamera;
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
