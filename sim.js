import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';

// BASIC SETUP

// définition de la scene et de la caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1100000);
camera.position.y = 5
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// lumières
scene.add(new THREE.AmbientLight(0xd2b48c, 5))
const point1 = new THREE.PointLight(0xffffff, 100)
point1.position.set(5, 5, 5)
point1.castShadow = true
scene.add(point1)
// définition des contrôles de la caméra
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(camera)









// ACTUAL CODE
// ----------------------------------------------------------------

// GLOBAL ELEMENTS DEF
const plane = new THREE.PlaneGeometry(10, 10)
const groundMaterial = new THREE.MeshPhongMaterial({color: 0x003535})
const ground = new THREE.Mesh(plane, groundMaterial)
ground.receiveShadow = true;
ground.castShadow = true;
ground.rotation.x = -Math.PI/2
scene.add(ground)

const sphere = new THREE.SphereGeometry(.2);
const sphereMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});

// CLASS DEF
class Ball {
    constructor(pos, angle, state, mesh) {
        this.pos = pos;
        this.angle = angle;
        this.state = state;
        this.mesh = mesh;
    }
}
// FUNCTION DEF
const generateSpheres = (nb) => {
    let spheres = []
    for (let i = 0; i <= nb; i++) {
        const sphereMesh = new Ball(new THREE.Vector3(Math.random()*10-5, .2, Math.random()*10-5), Math.random()*(2*Math.PI), "none", new THREE.Mesh(sphere, sphereMaterial))
        sphereMesh.mesh.castShadow = true;
        sphereMesh.mesh.receiveShadow = true;
        spheres.push(sphereMesh)
        scene.add(sphereMesh.mesh)
    }
    return spheres
}

function moveSpheres() {
    for (let i = 0; i < spheres.length; i++) {
        const sphere = spheres[i];
        if (sphere.state === "none") {
            const speed = 0.01; // Adjust the speed as needed
            sphere.pos.x += Math.cos(sphere.angle) * speed;
            sphere.pos.z += Math.sin(sphere.angle) * speed;

            // Add logic to handle boundaries if needed
            // For example, if you want to keep the spheres within -5 and 5
            if (sphere.pos.x < -5) sphere.pos.x = 5;
            if (sphere.pos.x > 5) sphere.pos.x = -5;
            if (sphere.pos.z < -5) sphere.pos.z = 5;
            if (sphere.pos.z > 5) sphere.pos.z = -5;

            // Update the position of the mesh
            sphere.mesh.position.copy(sphere.pos);
        }
    }
}

function drawSpheres() {
    for (let i = 0; i < spheres.length; i++) {
        const sphere = spheres[i];
        sphere.mesh.position.copy(sphere.pos);
    }
}

// LA SUITE QUOI
const spheres = generateSpheres(10);



// ----------------------------------------------------------------







// HELPERS
scene.add(new THREE.PointLightHelper(point1, 1))

// LOOP
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    moveSpheres()
    drawSpheres()
    renderer.render(scene, camera);
}

// on applique des règles autant de fois qu'on a défini d'itérations 
animate();