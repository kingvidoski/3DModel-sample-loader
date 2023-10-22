import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light to the scene (simulates sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize(); // Direction of the light
scene.add(directionalLight);

// Load 3D model
const mtlLoader = new MTLLoader();
mtlLoader.load("./models/3DModel.mtl", function (materials) {
  materials.preload();

  // Create an OBJLoader and set the loaded materials
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);

  // Load the OBJ file
  objLoader.load("./models/model1.obj", function (object) {
    console.log("Model loaded successfully!");

    // Traverse the loaded object and apply operations if necessary
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        // Center the geometry of each child mesh if needed
        child.geometry.center();
      }
    });

    // Add the loaded object to the scene
    scene.add(object);
  });
});

// Handle window resize
window.addEventListener("resize", function () {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  renderer.setSize(newWidth, newHeight);
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
});

// Set up mouse controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.rotateSpeed = 0.35;

// Set initial camera position
camera.position.set(0, 0, 5);

// Render function
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
