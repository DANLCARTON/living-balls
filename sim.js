import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { FlyControls } from 'FlyControls';
import { FirstPersonControls } from 'FirstPersonControls';
import {random3} from "./max.js"

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

function getRandomColor() {
    return Math.random() * 0xffffff;
}

scene.add(new THREE.AmbientLight(getRandomColor(), 1))

const point1 = new THREE.PointLight(getRandomColor(), 200)
point1.position.set(0, 2.5, 0)
point1.castShadow = true
scene.add(point1)

// définition des contrôles de la caméra
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(camera)

// PARAMS
const sexDistrib = 0.48
const minAttractivityNecessary = 0.4







// ACTUAL CODE
// ----------------------------------------------------------------

// GLOBAL ELEMENTS DEF
const plane = new THREE.PlaneGeometry(10, 10)
const groundMaterial = new THREE.MeshPhongMaterial({color: 0x353535})
const ground = new THREE.Mesh(plane, groundMaterial)
ground.receiveShadow = true;
ground.castShadow = true;
ground.rotation.x = -Math.PI/2
scene.add(ground)

// const sphere = new THREE.SphereGeometry(.2, 8, 8);
// const sphereMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
const attractivityMaterial = new THREE.MeshPhongMaterial({color: 0xffdddd})
const strengthMaterial = new THREE.MeshPhongMaterial({color: 0xddffdd})
const basicMaterial = new THREE.MeshPhongMaterial({color: 0xffffff})
const maleGeometry = new THREE.BoxGeometry(.4, .4, .4)
const femaleGeometry = new THREE.SphereGeometry(.2, 8, 8)

// CLASS DEF
class Ball {
    constructor(pos, angle, mesh, sex, attractivity, strength, speed) {
        this.pos = pos;
        this.angle = angle;
        this.mesh = mesh;
        this.sex = sex;
        this.attractivity = attractivity
        this.strength = strength
        this.speed = speed
    }
}

// FUNCTION DEF
const generateSphere = (sex, attractivity, strength, speed) => {
    const ball = new Ball(
        new THREE.Vector3(Math.random()*10-5, .2, Math.random()*10-5), 
        Math.random()*(2*Math.PI), 
        undefined,
        sex,
        attractivity,
        strength,
        speed
    )

    console.log(attractivity, strength, sex)

    ball.mesh = new THREE.Mesh(new THREE.SphereGeometry(ball.attractivity/4+.2, 8, 8), attractivityMaterial)

    const strengthBall = new THREE.Mesh(new THREE.SphereGeometry(ball.strength/4+.2, 8, 8), strengthMaterial)
    strengthBall.position.set(0, .5, 0);
    ball.mesh.add(strengthBall)
    strengthBall.castShadow = true
    strengthBall.receiveShadow = true

    const sexGeometry = new THREE.Mesh(ball.sex == "M" ? maleGeometry : femaleGeometry, basicMaterial)
    sexGeometry.position.set(0, 1, 0)
    ball.mesh.add(sexGeometry)
    sexGeometry.castShadow = true
    sexGeometry.receiveShadow = true

    ball.mesh.castShadow = true;
    ball.mesh.receiveShadow = true;

    scene.add(ball.mesh)

    return ball
}

const meet = (ball1, ball2) => {
    if (ball1.sex != ball2.sex) {
        if (Math.abs(ball1.attractivity - ball2.attractivity) <= minAttractivityNecessary) {
            console.log("CROSSOVER")
            console.log("MUTATION")
        } else {
            console.log(ball1, " & ", ball2, " don't mate")
        }
    } else if (ball1.sex == "M" && ball2.sex == "F") {
        console.log("FIGHT")
    } else if (ball1.sex == "F" && ball2.sex == "F") {
        console.log("ATTRACTIVITY")
    }
}

function moveSpheres() {
    for (let i = 0; i < spheres.length; i++) {
        const ball = spheres[i];
        const speed = ball.speed/50; 
        ball.pos.x += Math.cos(ball.angle) * speed;
        ball.pos.z += Math.sin(ball.angle) * speed;

        // gestion des bords du plan
        if (ball.pos.x < -5) ball.pos.x = 5;
        if (ball.pos.x > 5) ball.pos.x = -5;
        if (ball.pos.z < -5) ball.pos.z = 5;
        if (ball.pos.z > 5) ball.pos.z = -5;

        // Update the position of the mesh
        ball.mesh.position.copy(ball.pos);
    }
}

function drawSpheres() {
    for (let i = 0; i < spheres.length; i++) {
        let sphere = spheres[i];
        sphere.mesh.position.copy(sphere.pos);
    }
}

function checkCollisions() {
    for (let i = 0; i < spheres.length; i++) {
        for (let j = 0; j < spheres.length; j++) {
            if (i != j) {
                let ball1 = spheres[i];
                let ball2 = spheres[j];
    
                const distance = ball1.pos.distanceTo(ball2.pos);
                const sumRadii = ball1.mesh.geometry.parameters.radius + ball2.mesh.geometry.parameters.radius;
    
                if (distance < sumRadii) {
                    // code a executer quand deux spheres se rencontrent. 
                    // scene.remove(sphereA.mesh)
                    // scene.remove(sphereB.mesh)
                    // spheres.splice(i, 1)
                    // spheres.splice(j-1, 1)
                    // let newSphere0 = generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3())
                    // let newSphere1 = generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3())
                    // spheres.push(newSphere0)
                    // spheres.push(newSphere1)
                    // return spheres
                    meet(ball1, ball2)
                } 
                if (distance > sumRadii) {
                    continue
                }
            }
        }
    }
    return spheres
}

// LE CODE
let spheres = [] 
spheres.push(generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3()))
spheres.push(generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3()))
spheres.push(generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3()))
spheres.push(generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3()))
spheres.push(generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3()))
spheres.push(generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3()))
spheres.push(generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3()))
spheres.push(generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3()))
spheres.push(generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3()))
spheres.push(generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3()))
console.log(spheres)


// ------------------------------------------------------------------------------------------------








// HELPERS
scene.add(new THREE.PointLightHelper(point1, 1))

// LOOP
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    moveSpheres()
    spheres = checkCollisions();

    drawSpheres()
    renderer.render(scene, camera);
}

animate();