import './assets/main.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById('container3D').appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );
let objToRenderer = 'monk';

const loader = new GLTFLoader();

loader.load(
    `src/assets/gltf/Studentenzimmer_01.gltf`,
    function ( gltf ) {
    
        scene.add( gltf.scene );
    },
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        console.log( 'An error happened' );
    }
)


camera.position.z = 0
camera.position.y = 8
camera.position.x = 25
camera.rotation.y = 0.9
camera.rotation.x = -0.6
camera.rotation.z = 0.5



const topLight = new THREE.DirectionalLight( 0xffffff, 1);
topLight.position.set( 500, 500, 500 );
topLight.castShadow = true;
scene.add( topLight );

const ambientLight = new THREE.AmbientLight( 0x333333, 10 ); // soft white light
scene.add( ambientLight );

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}


animate();
