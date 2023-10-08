import * as THREE from "three"
import { OrbitControls } from 'OrbitControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra
import { TrackballControls } from 'TrackballControls'; // importation de l'addon Orbit Controls pour la gestion de la caméra


const NumberPopulation = 10
const Superficy = 10
const halfSuperficy = Superficy / 2
const RapportH_F = 0.48                 // A très grand nombre, il y aurait RapportH_F% d'hommes et 1-RapportH_F% de femmes
const UpAttract = 0.1
const Condition_Crossover = 0.4


function random3() {     // Génère un nombre aléatoire entre 0 et 1 avec 3 chiffres après la virgule
    const randomNum = Math.random().toFixed(3);
    return parseFloat(randomNum);
  }

class Individu {
    constructor(sexe, attractivite, force, vitesse, position) {
      this.sexe = sexe;
      this.attractivite = attractivite;
      this.force = force;
      this.vitesse = vitesse;
      this.position = position
    }
  
    // sexe
    setSexe(sexe) {
      if (sexe === "homme" || sexe === "femme") {   
        this.sexe = sexe;
      } else {
        console.error('Le sexe doit être "homme" ou "femme".');
      }
    }

    // position

    setPosition(x, y) {
        if (x >= -halfSuperficy && x <= halfSuperficy && y >= -halfSuperficy && y <= halfSuperficy) {
          this.x = x;
          this.y = y;
        } else {
          console.error('Les coordonnées doivent être à l\'intérieur de la zone.');
        }
      }
    
    getPosition() {
        return { x: this.x, y: this.y };
    }
}

// POPULATION

var population = [];
for (let i = 0; i < NumberPopulation; i++) {
  const sexe = random3() < RapportH_F ? 'homme' : 'femme'; 
  const attractivite = random3();
  const force = random3();
  const vitesse = random3();
  const individu = new Individu(sexe, attractivite, force, vitesse);
  population.push(individu);
}

// CROSSOVER (H vs F)

function crossover(parent1 , parent2, population) {
// Enfant 1
  const caractéristiquesEnfant1 = {
      attractivite: random3() < 0.5 ? parent1.attractivite : parent2.attractivite,
      force: random3() < 0.5 ? parent1.force : parent2.force,
      vitesse: random3() < 0.5 ? parent1.vitesse : parent2.vitesse
  };

  // Enfant 2
  const caractéristiquesEnfant2 = {
      attractivite: random3() < 0.5 ? parent1.attractivite : parent2.attractivite,
      force: random3() < 0.5 ? parent1.force : parent2.force,
      vitesse: random3() < 0.5 ? parent1.vitesse : parent2.vitesse
  };

  if (caractéristiquesEnfant1.attractivite === parent1.attractivite){ 
      caractéristiquesEnfant2.attractivite = parent2.attractivite 
  }
  else{
      caractéristiquesEnfant2.attractivite = parent1.attractivite
  }

  if (caractéristiquesEnfant1.force === parent1.force){
      caractéristiquesEnfant2.force = parent2.force
  }
  else{
      caractéristiquesEnfant2.force = parent1.force
  }

  if (caractéristiquesEnfant1.vitesse === parent1.vitesse){
      caractéristiquesEnfant2.vitesse = parent2.vitesse
  }
  else{
      caractéristiquesEnfant2.vitesse = parent1.vitesse
  }

  const enfant1 = new Individu(
      random3() < RapportH_F ? 'homme' : 'femme',
      caractéristiquesEnfant1.attractivite,
      caractéristiquesEnfant1.force,
      caractéristiquesEnfant1.vitesse,
      [parent1.position[0] + 1, parent1.position[1] + 1] 
  );

  const enfant2 = new Individu(
      random3() < RapportH_F ? 'homme' : 'femme',
      caractéristiquesEnfant2.attractivite,
      caractéristiquesEnfant2.force,
      caractéristiquesEnfant2.vitesse,
      [parent2.position[0] - 1, parent2.position[1] - 1]
  );

  population.push(enfant1);
  population.push(enfant2);
} 

// Mutation (Enfants)

function mutation(enfant1, enfant2) {
  const enfants = [enfant1, enfant2]
  const enfantsIndex = Math.floor(Math.random() * 2);
  const enfant = enfants[enfantsIndex];

  const caracteristiqueIndex = Math.floor(Math.random() * 3);

  if (caracteristiqueIndex === 0) {
    enfant.attactivite = random3();
  } 
  else if (caracteristiqueIndex === 1) {
    enfant.force = random3();
  } 
  else if (caracteristiqueIndex === 2) {
    enfant.vitesse = random3();
  } 
  else {
    console.error('Caractéristique invalide.');
  }
}
  
// COMBAT (H vs H)

function fight(individu1, individu2, population) {
  if (individu1.force > individu2.force) {
    const index = population.indexOf(individu2);
    if (index !== -1) {
      population.splice(index, 1);
      console.log("Un homme est mort");
    }
  } else {
    const index = population.indexOf(individu1);
    if (index !== -1) {
      population.splice(index, 1);
      console.log("Un homme est mort");
    }
  }
}

// ATTRACTIVITÉ FEMININE (F vs F)

function UpAttractivity(individu1, individu2){
  individu1.attractivite += UpAttract
  individu2.attractivite += UpAttract
}

// RENCONTRE

function meet(individu1, individu2, population) {
    if (individu1.sexe !== individu2.sexe)
      if (Math.abs(individu1.attractivite - individu2.attractivite) <= Condition_Crossover){
        crossover(individu1, individu2, population)
        mutation(population(population.length() - 1), population(population.length() - 2))
      }  
      else {
        console.log('Les individus ne veuleut pas s\'accoupler')
      }
    else if (individu1.sexe === "homme" || individu2.sexe === "homme")
    {
      return fight(individu1, individu2, population)
    }
    else if (individu1.sexe === "femme" || individu2.sexe === "femme"){
      UpAttractivity(individu1, individu2)
    }
}

// TEST


const individu0 = new Individu('homme', 0.256, 0.459, 0.146, [2, 3])
const individu1 = new Individu('femme', 0.657, 0.542, 0.842, [-1, -2])
const individu2 = new Individu('homme', 0.821, 0.154, 0.478, [0, 4])
const individu3 = new Individu('femme', 0.745, 0.527, 0.245, [-1, 3])

const population1 = [individu0, individu1, individu2, individu3]

// const enfants = meet(individu0, individu1, population1)
const enfants = meet(individu0, individu3, population1)
// const meet1 = meet(individu0, individu2, population1)
// const meet2 = meet(individu1, individu3, population1)


console.log('Population :', population1);
// console.log('individu1 :', individu1)
// console.log('individu2 :', individu2)
// console.log('Nouveaux individus créés :', enfants)
// console.log('fight :', individu0, individu2)
// console.log('up attract :', individu1, individu3)


mutation(enfants);

console.log('Nouveaux individus créés après mutation :', enfants);

















// définition de la scene et de la caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1100000 );
camera.position.z = 50
camera.position.y = 50
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// lumières
scene.add(new THREE.AmbientLight(0xd2b48c, 5))

const point = new THREE.PointLight(0xff8888, 12)
point.position.set(0, 2, 0)
point.castShadow = true
camera.add(point)

const point2 = new THREE.PointLight(0x88ff88, 12)
point2.position.set(0, -2, 0)
point2.castShadow = true
camera.add(point2)

const point3 = new THREE.PointLight(0x8888ff, 12)
point3.position.set(2, 0, 0)
point3.castShadow = true
camera.add(point3)

const point4 = new THREE.PointLight(0xffff88, 12)
point4.position.set(-2, 0, 0)
point4.castShadow = true
camera.add(point4)

// définition des contrôles de la caméra
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(camera)


// boucle de rendu
function animate() {
    requestAnimationFrame( animate );
controls.update()
    renderer.render( scene, camera );
}

animate();