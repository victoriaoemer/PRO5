<template>
  <div>
    <div id="container3D"></div>
    <button @click="hideDesk">Toggle Desk</button>
    <button @click="hideBed">Toggle Bed</button>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

export default {
  data() {
    return {
      num: 1, // Initialize the variable you want to change
      loadedObjects: {},
    };
  },
  mounted() {
    this.init3DScene();
   this.num = 1;
    
  },
  computed: {
    scene() {
      return new THREE.Scene();
    },
  },
  methods: {
    init3DScene() {
      console.log(this.num);
      const scene = this.scene; // Reference the computed property
      const loadedObjects=this.loadedObjects;
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById('container3D').appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      let object = new THREE.Group();
      const glTFLoader = new GLTFLoader()

      /*if (this.num == 1) {

        glTFLoader.load('src/assets/gltf/desk.gltf', function (gltf) {

          gltf.scene.scale.set(0.5, 0.5, 0.5)
          gltf.scene.position.set(0, 0, -50)
          scene.add(gltf.scene)

          glTFLoader.load('src/assets/gltf/Bed.gltf', function (gltf) {

            gltf.scene.scale.set(0.5, 0.5, 0.5)
            gltf.scene.position.set(0, 0, 45)
            gltf.scene.rotateY(-1.5)
            scene.add(gltf.scene)
          })
        })
      }
      else {
        glTFLoader.load('src/assets/gltf/Desk_dark01.gltf', function (gltf) {

          gltf.scene.scale.set(5, 5, 5)
          gltf.scene.position.set(0, 0, -50)
          scene.add(gltf.scene)

          glTFLoader.load('src/assets/gltf/Bed_dark.gltf', function (gltf) {

            gltf.scene.scale.set(0.5, 0.5, 0.5)
            gltf.scene.position.set(0, 0, 45)
            gltf.scene.rotateY(-1.5)
            scene.add(gltf.scene)
          })
        })
      }
*/


glTFLoader.load('src/assets/gltf/desk.gltf', function (gltf) {
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(0, 0, -50);
  scene.add(gltf.scene);

  loadedObjects.desk = gltf.scene;

  glTFLoader.load('src/assets/gltf/Bed.gltf', function (gltf) {
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.position.set(0, 0, 45);
    gltf.scene.rotateY(-1.5);
          scene.add(gltf.scene);

    loadedObjects.bed = gltf.scene;
  
  });
});

      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
      camera.position.y = 120;
      camera.position.z = 60;
      camera.position.x = -120;

      //camera.rotateOnAxis(new THREE.Vector3(3,0,0), -0.5); 
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
    clearScene() {
    // Find the container element by its ID
    const container = this.$el.querySelector('#container3D');
    const scene = this.scene;
    // Check if the container exists
    if (container) {
      // Remove all child elements of the container (clear its content)
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }

    // Clear the three.js scene
    while (scene.children.length > 0) {
      const obj = scene.children[0];
      scene.remove(obj);
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((material) => {
              material.dispose();
            });
          } else {
            obj.material.dispose();
          }
        }
      }
    }
  },
    changeModel() {
    // Change the num variable when the button is clicked
    this.num = this.num === 1 ? 2 : 1;
    this.clearScene();
    // Reinitialize the 3D scene with the new model
    this.init3DScene();
  },
  hideDesk() {
      // Hide the desk object
      this.toggleVisibility('desk');
    },
    hideBed() {
      // Hide the bed object
      this.toggleVisibility('bed');
    },
    toggleVisibility(id){
    const loadedObjects= this.loadedObjects;
    const objectToToggleVisibility = loadedObjects[id];
    console.log(objectToToggleVisibility.visible);
  if (objectToToggleVisibility) {
    objectToToggleVisibility.visible = (objectToToggleVisibility.visible) ? false : true; // Hide the object
  }
  },

  },

};
</script>

