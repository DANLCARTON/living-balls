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
const startPopulation = 5
const area = 10
const sexDistrib = 0.48
const minAttractivenessNecessary = 0.4
const attractivenessBoost = 0.001





// ACTUAL CODE
// ----------------------------------------------------------------

// GLOBAL ELEMENTS DEF
const plane = new THREE.PlaneGeometry(area, area)
const groundMaterial = new THREE.MeshPhongMaterial({color: 0x353535})
const ground = new THREE.Mesh(plane, groundMaterial)
ground.receiveShadow = true;
ground.rotation.x = -Math.PI/2
scene.add(ground)

// const sphere = new THREE.SphereGeometry(.2, 8, 8);
// const sphereMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
const attractivenessMaterial = new THREE.MeshPhongMaterial({color: 0xffdddd})
const strengthMaterial = new THREE.MeshPhongMaterial({color: 0xddffdd})
const basicMaterial = new THREE.MeshPhongMaterial({color: 0xffffff})
const maleGeometry = new THREE.BoxGeometry(.4, .4, .4)
const femaleGeometry = new THREE.SphereGeometry(.2, 8, 8)

// CLASS DEF
class Ball {
    constructor(pos, angle, mesh, sex, attractiveness, strength, speed) {
        this.pos = pos;
        this.angle = angle;
        this.mesh = mesh;
        this.sex = sex;
        this.attractiveness = attractiveness
        this.strength = strength
        this.speed = speed
    }
}

// FUNCTION DEF
const generateSphere = (sex, attractiveness, strength, speed) => {
    const ball = new Ball(
        new THREE.Vector3(Math.random()*10-5, .2, Math.random()*10-5), 
        Math.random()*(2*Math.PI), 
        undefined,
        sex,
        attractiveness,
        strength,
        speed
    )

    ball.mesh = new THREE.Mesh(new THREE.SphereGeometry(ball.strength/4+.2, 8, 8), strengthMaterial)

    const attractivenessBall = new THREE.Mesh(new THREE.SphereGeometry(ball.attractiveness/4+.2, 8, 8), attractivenessMaterial)
    attractivenessBall.position.set(0, .5, 0);
    ball.mesh.add(attractivenessBall)
    attractivenessBall.castShadow = true
    attractivenessBall.receiveShadow = true

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

const crossover = (super1, super2) => {
    const kid1Stats = {
        attractiveness: random3() < .5 ? super1.attractiveness : super2.attractiveness,
        strength: random3() < .5 ? super1.strength : super2.strength,
        speed : random3() < .5 ? super1.speed : super2.speed
    }

    const kid2Stats = {
        attractiveness: random3() < .5 ? super1.attractiveness : super2.attractiveness,
        strength: random3() < .5 ? super1.strength : super2.strength,
        speed : random3() < .5 ? super1.speed : super2.speed
    }

    if (kid1Stats.attractiveness == super1.attractiveness) kid2Stats.attractiveness = super2.attractiveness
    else kid2Stats.attractiveness = super1.attractiveness

    if (kid1Stats.strength == super1.strength) kid2Stats.strength = super2.strength
    else kid2Stats.strength = super1.strength

    if (kid1Stats.speed == super1.speed) kid2Stats.speed = super2.speed 
    else kid2Stats.speed = super1.speed

    let kid1 = generateSphere(Math.random() <= sexDistrib ? "M" : "F", kid1Stats.attractiveness, kid1Stats.strength, kid1Stats.speed)
    let kid2 = generateSphere(Math.random() <= sexDistrib ? "M" : "F", kid2Stats.attractiveness, kid2Stats.strength, kid2Stats.speed)

    spheres.push(kid1)
    spheres.push(kid2)
}

const fight = (ball1, ball2, index1, index2) => {
    if (ball1.strength > ball2.strength) {
        spheres.splice(index2, 1)
        scene.remove(ball2.mesh)
        console.log(ball2.strength, "was killed by", ball1.strength)
    } else {
        spheres.splice(index1, 1)
        scene.remove(ball1.mesh)
        console.log(ball1.strength, "was killed by", ball2.strength)
    }
}

const enhanceAttractiveness = (ball1, ball2) => {
    ball1.attractiveness < ball2.attractiveness ? console.log(ball2.attractiveness, "makes", ball1.attractiveness, "more attractive") : console.log(ball1.attractiveness, "makes", ball2.attractiveness, "more attractive")
    ball1.attractiveness < ball2.attractiveness ? ball1.attractiveness += attractivenessBoost : ball2.attractiveness += attractivenessBoost
    ball1.mesh.children[0].scale.set(1+ball1.attractiveness/4 + 0.2, 1+ball1.attractiveness/4 + 0.2, 1+ball1.attractiveness/4 + 0.2);
    ball2.mesh.children[0].scale.set(1+ball2.attractiveness/4 + 0.2, 1+ball2.attractiveness/4 + 0.2, 1+ball2.attractiveness/4 + 0.2);
}

const meet = (ball1, ball2, index1, index2) => {

    if (ball1.sex != ball2.sex) {
        if (Math.abs(ball1.attractiveness - ball2.attractiveness) <= minAttractivenessNecessary) { // ok mais je pense que là il faudrait utiliser tous les paramètres : attractivité, force et vitesse, pas juste l'attractivité. En gros vraaiment calculer un fitness à partir de tout ça | mais sinon ça marche
            crossover(ball1, ball2)
            if (ball1.sex == "F") {
                scene.remove(ball1.mesh)
                spheres.splice(index1, 1)
            } else {
                console.log(ball2.sex)
                scene.remove(ball2.mesh)
                spheres.splice(index2, 1)
            }
            console.log("MUTATION")
        } else {
            console.log(ball1.attractiveness, " & ", ball2.attractiveness, " don't mate")
        }
    } else if (ball1.sex == "M" && ball2.sex == "M") {
        fight(ball1, ball2, index1, index2)
    } else if (ball1.sex == "F" && ball2.sex == "F") {
        enhanceAttractiveness(ball1, ball2)
    }
}

function moveSpheres() {
    for (let i = 0; i < spheres.length; i++) {
        const ball = spheres[i];
        const speed = ball.speed/50+0.01; 
        ball.pos.x += Math.cos(ball.angle) * speed;
        ball.pos.z += Math.sin(ball.angle) * speed;

        // gestion des bords du plan
        if (ball.pos.x < -area/2) ball.pos.x = area/2;
        if (ball.pos.x > area/2) ball.pos.x = -area/2;
        if (ball.pos.z < -area/2) ball.pos.z = area/2;
        if (ball.pos.z > area/2) ball.pos.z = -area/2;

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
                    meet(ball1, ball2, i, j)
                    return spheres
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

for (let i = 0; i < startPopulation; i++) {
    spheres.push(generateSphere(Math.random() <= sexDistrib ? "M" : "F", random3(), random3(), random3()))
}

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