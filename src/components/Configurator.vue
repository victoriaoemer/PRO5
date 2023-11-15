<template>
  <div class="container">
    <div id="container3D"></div>
    <div class="ui">
      <button @click="hideRoom">Toggle Room</button>
      <button @click="hideBed">Toggle Bed</button>
      <div class="buttonContainer">
      <div v-for="(texture, index) in textures" :key="index" class="textureButton" @click="changeTexture(index)">
        <img :src="texture" alt="Texture Image">
      </div>
    </div>
    </div>
  </div>
</template>
<style>
.buttonContainer{
  display: flex;
}
.textureButton{
  border-radius: 10px;
  flex-direction: row;

}
.textureButton img{
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
<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  data() {
    return {
      loadedObjects: {},
      textureIndex: 1,
      textures: [
        'src/assets/gltf/text/Gold_wood.jpg',
        'src/assets/gltf/text/Birch_wood.jpg',
        'src/assets/gltf/text/adthe.jpg',
      ]
    };
  },

  mounted() {
    this.init3DScene();
  },

  computed: {
    scene() {
      return new THREE.Scene();
    },
  },

  methods: {
    init3DScene() {
      const scene = this.scene;
      const loadedObjects = this.loadedObjects;
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById('container3D').appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      let object = new THREE.Group();
      const textureloader = new THREE.TextureLoader().load('src/assets/gltf/text/Gold_wood.jpg');



      //--------------------------------- Load the obejcts ---------------------------------//


      const glTFLoader = new GLTFLoader()

      glTFLoader.load('src/assets/gltf/Room/Room.gltf', function (gltf) {
        gltf.scene.scale.set(50, 50, 50);
        gltf.scene.position.set(-110, 0, 210);
        gltf.scene.rotateY(0);
        scene.add(gltf.scene);

        loadedObjects.room = gltf.scene;
      });

      glTFLoader.load('src/assets/gltf/Room/Floor.gltf', function (gltf) {
        gltf.scene.scale.set(50, 50, 50);
        gltf.scene.position.set(-110, 0, 210);
        gltf.scene.rotateY(0);
        scene.add(gltf.scene);

        loadedObjects.floor = gltf.scene;
      });

      glTFLoader.load('src/assets/gltf/Closet/Closet_light.gltf', function (gltf) {
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

      glTFLoader.load('src/assets/gltf/Bed_sep/Bed_stuff.gltf', function (gltf) {
        gltf.scene.scale.set(0.5, 0.5, 0.5);
        gltf.scene.position.set(0, 10, 85);
        gltf.scene.rotateY(-1.55);
        scene.add(gltf.scene);

        loadedObjects.bedstuff = gltf.scene;
        //no texture
      });

      glTFLoader.load('src/assets/gltf/Bed_sep/Bed_wood.gltf', function (gltf) {
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

      glTFLoader.load('src/assets/gltf/Garderobe/Garderobe_light.gltf', function (gltf) {
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

      glTFLoader.load('src/assets/gltf/LowChair_sep/LowChair_feets.gltf', function (gltf) {
        gltf.scene.scale.set(50, 50, 50);
        gltf.scene.position.set(10, 10, 160);
        gltf.scene.rotateY(1.55);

        loadedObjects.lowchairfeets = gltf.scene;
        scene.add(gltf.scene);
      });

      glTFLoader.load('src/assets/gltf/LowChair_sep/LowChair_wood.gltf', function (gltf) {
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
        gltf.scene.position.set(-40, 0, -5);
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
        gltf.scene.position.set(-40, 0, -5);
        gltf.scene.rotateY(1.5);

        loadedObjects.highchairfeet = gltf.scene;
        scene.add(gltf.scene);
      });

      glTFLoader.load('src/assets/gltf/Kitchen_sep/Kitchen_wood.gltf', function (gltf) {
        gltf.scene.scale.set(50, 50, 50);
        gltf.scene.position.set(-35, 0, 16);
        gltf.scene.rotateY(0);

        loadedObjects.kitchen = gltf.scene;
        loadedObjects.kitchen.traverse(function (node) {
          if (node instanceof THREE.Mesh) {
            node.material.map = textureloader;
          }
        });
        scene.add(gltf.scene);
      });

      glTFLoader.load('src/assets/gltf/Kitchen_sep/Kitchen_stuff.gltf', function (gltf) {
        gltf.scene.scale.set(50, 50, 50);
        gltf.scene.position.set(-35, 0, 16);
        gltf.scene.rotateY(0);

        loadedObjects.kitchenstuff = gltf.scene;
        scene.add(gltf.scene);
      });

      glTFLoader.load('src/assets/gltf/Washbasin_sep/Washbasin_stuff.gltf', function (gltf) {
        gltf.scene.scale.set(50, 50, 50);
        gltf.scene.position.set(0, 0, -75);
        gltf.scene.rotateY(-1.55);

        loadedObjects.washbasinstuff = gltf.scene;
        scene.add(gltf.scene);
      });

      glTFLoader.load('src/assets/gltf/Washbasin_sep/Washbasin_wood.gltf', function (gltf) {
        gltf.scene.scale.set(50, 50, 50);
        gltf.scene.position.set(0, 0, -75);
        gltf.scene.rotateY(-1.55);

        loadedObjects.washbasin = gltf.scene;
        loadedObjects.washbasin.traverse(function (node) {
          if (node instanceof THREE.Mesh) {
            node.material.map = textureloader;
          }
        });
        scene.add(gltf.scene);
      });

      glTFLoader.load('src/assets/gltf/Desk_sep/Desk.gltf', function (gltf) {
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


      
      //--------------------------------- Load the lights and Helpers ---------------------------------//


      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
      camera.position.set(-120, 400, 100);
      camera.lookAt(object.position);

      const topLight = new THREE.DirectionalLight(0xffffff, 3);
      topLight.position.set(100, 100, 0);
      topLight.castShadow = true;
      scene.add(topLight);

      const ambientLight = new THREE.AmbientLight(0xffffff, 2); // soft white light
      ambientLight.position.y = 1000
      scene.add(ambientLight);

      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate();

    },

    changeTexture(index) {
      const loadedObjects = this.loadedObjects;
      const texturePath = this.textures[index];
      const textureloader = new THREE.TextureLoader().load(texturePath);
      
      for (let key in loadedObjects) {
        if (key === 'room' || key === 'lowchairfeets' || key === 'bedstuff' || key === 'floor' || key === 'highchairfeet' || key === 'kitchenstuff' || key === 'washbasinstuff') continue;
        const object = loadedObjects[key];
        object.traverse(function (node) {
          if (node instanceof THREE.Mesh) {
            node.material.map = textureloader;
            node.material.needsUpdate = true;
          }
        });
      }
      console.log("here");
      this.textureIndex = index;
    },

    hideBed() {
      this.toggleVisibility('bedwood');
      this.toggleVisibility('bedstuff');
    },

    hideRoom() {
      this.toggleVisibility('room');
    },

    toggleVisibility(id) {
      const loadedObjects = this.loadedObjects;
      const objectToToggleVisibility = loadedObjects[id];
      console.log(objectToToggleVisibility.visible);
      if (objectToToggleVisibility) {
        objectToToggleVisibility.visible = (objectToToggleVisibility.visible) ? false : true; // Hide the object
      }
    },
  },
};
</script>





