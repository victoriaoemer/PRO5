import './assets/main.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById('container3D').appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );
let objecct = new THREE.Group();

const fbxLoader = new FBXLoader()
fbxLoader.load(
    'src/assets/gltf/Studentenzimmer_01.fbx',
    (object) => {
        object.traverse( function ( child ) {
            objecct = object;

            if ( child.isMesh ) {
        
                console.log( child.geometry.attributes.uv );
                const texture = new THREE.TextureLoader().load( "src/assets/gltf/dfg.jpeg" );
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set( 4, 4 );
                child.material.map = texture; 
        
            }
        
        } );
        object.scale.set(0.1, 0.1, 0.1) 
        object.position.set(0, 0, 0)
        
        
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)


const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
camera.position.y = 120;
camera.position.z = 60;
camera.position.x = -120;

//camera.rotateOnAxis(new THREE.Vector3(3,0,0), -0.5); 
camera.lookAt(objecct.position);




// const topLight = new THREE.DirectionalLight( 0xffffff, 0.3);
// topLight.position.set( 0, 3000, 0 );
// topLight.castShadow = true;
// scene.add( topLight );

const ambientLight = new THREE.AmbientLight( 0x333333, 10 ); // soft white light
ambientLight.position.y = 1000
scene.add( ambientLight );

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}


animate();
