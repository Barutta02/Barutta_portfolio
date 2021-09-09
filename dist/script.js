import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'

let model;

// Debug
//const gui = new dat.GUI()
let mixer;
let camera;
let renderer;
let sphere;
let cloud;
let galaxy;
let moon;

//for the text animation
//text
var text_path = document.querySelector("#text-path")

function updatetextOffset(offset) {
    text_path.setAttribute('startOffset', offset);
}

const titles = document.querySelectorAll(".anim")

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting == true) {
            entry.target.classList.add("animate")
        }
        /*else {
                   entry.target.classList.remove("animate")
               }*/
    })
})

titles.forEach(title => observer.observe(title))

//ANIMATION PLANE

const planes = document.querySelectorAll(".animPlane")
const observer1 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting == true) {
            entry.target.classList.add("planeAnimation")
        }
    })
})
planes.forEach(planes => observer1.observe(planes))

// Canvas
const canvas = document.querySelector('canvas.webgl')
const body = document.getElementById("body");
// texture
const textureLoader = new THREE.TextureLoader()


//Elements
const scene = new THREE.Scene()

//LIGHT
const light = new THREE.AmbientLight(0xFFFFFF, .5);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
const ambientlight = new THREE.AmbientLight(0xFFFFFF);
scene.add(ambientlight)
const plight = new THREE.PointLight(0xFFFFFF, 1, 10);
scene.add(plight);

const pLightIntensity = 1



const p1light = new THREE.PointLight(0xFFFFFF, pLightIntensity, 10);
p1light.position.set(.2, 0, 1.1);


//LOADER 3DMODEL
//let loader = new THREE.GLTFLoader();

//MOUSE for smooth movement

function init() {

    /*  loader.load("/3dmodel/nome.glb", function(gltf) {
          scene.add(gltf.scene);
          model = gltf.scene.children[0];
          model.scale.set(0.5, 0.5, 0.5);
         ;
          
          tick();
      });*/

    sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 64, 64),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('../static/images/worldBest.jpg'),
            bumpMap: new THREE.TextureLoader().load('../static/images/elev_bump_4k.jpg'),
            bumpScale: 0.005,
            specularMap: new THREE.TextureLoader().load('../static/images/water_4k.png'),
            specular: new THREE.Color('grey')
        })
    )
    directionalLight.target = sphere
    scene.add(directionalLight);
    cloud = new THREE.Mesh(
        new THREE.SphereGeometry(0.503, 32, 32),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('../static/images/fair_clouds_4k.png'),
            transparent: true
        })
    );
    moon = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 32, 32),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('../static/images/moon.jfif'),
        })
    );
    galaxy = new THREE.Mesh(
        new THREE.SphereGeometry(90, 64, 64),
        new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('../static/images/galaxy_starfield.png'),
            side: THREE.BackSide
        })
    );

    moon.position.set(0.7, 0.4, 0)
    sphere.add(moon)
    scene.add(sphere)
    scene.add(cloud)
    scene.add(galaxy)

    //CAMERA
    camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.01, 1000)
    setCameraPositiion()
    scene.add(camera)

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio || 1)

    window.scrollTo(0, 0)
    sphere.rotation.y = 0
    cloud.rotation.y = 0
    galaxy.rotation.y = 0
    sphere.rotation.x = 0
    cloud.rotation.x = 0
    galaxy.rotation.x = 0
}
/* Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

/**
 * Camera
 */
// Base camera

function setCameraPositiion() {
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 2
}



/**
 * Animate
 */

const clock = new THREE.Clock()



const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    directionalLight.position.copy(camera.position);

    p1light.position.set(.2, 0, camera.position.z + .2);




    moon.rotation.y = .1 * elapsedTime
    const delta = clock.getDelta();
    if (mixer != null)
        mixer.update(delta);
    renderer.render(scene, camera)
    updatetextOffset(window.scrollY * 1) // moltiplicate for >1 for more speed
    window.requestAnimationFrame(tick)
        // Call tick again on the next frame
}


let isThereGalaxy = true;

function updateCamera(ev) {
    $(".imageRotate").css("opacity", $(".imageRotate").css("opacity") - 0.05)
    if (window.scrollY == 0) {
        $(".imageRotate").css("opacity", 1)
    }
    if (sphere.rotation.y <= 4.5127998046875 || camera.position.z < 2 - (window.scrollY / 4000.0)) {
        //X
        sphere.rotation.x = (window.scrollY) / 5750;
        cloud.rotation.x = (window.scrollY) / 7000;
        galaxy.rotation.x = (window.scrollY) / 7000;
        //Y
        sphere.rotation.y = (window.scrollY) / 1000
        cloud.rotation.y = (window.scrollY) / 1000
    }
    if (window.scrollY <= 7840) {
        camera.position.z = 2 - (window.scrollY / 4000.0);
    }
    galaxy.rotation.y = (window.scrollY) / 2000
}
window.addEventListener("scroll", updateCamera);




//CALL INITIALIZE
let waitForEnter = false;
var macWinContactID = document.getElementById("contactmeID");
init()
tick()
    //ANIMATION

var trigHook = 0.5;
if (window.innerWidth < 500) {
    trigHook = 0.75;
}

const textPath = {
    values: [
        { x: -300, y: 0 }
    ]
};
const textPath2 = {
    values: [
        { x: 300, y: 0 }
    ]
};

const tween = gsap.timeline();
tween.to('.word1', 1, {
    bezier: textPath,
    triggerHook: .5,
    ease: Power1.easeInOut,
    opacity: 0,
    onComplete: function() {
        document.getElementById("divAstronaut").style.zIndex = 15;
    },
    onReverseComplete: function() {
        document.getElementById("divAstronaut").style.zIndex = 0;
    }
})

.to('.word2', 1, {
        bezier: textPath2,
        triggerHook: .5,
        ease: Power1.easeInOut,
        opacity: 0
    }, 0)
    .to('.word3', 1, {
        bezier: textPath,
        triggerHook: .5,
        ease: Power1.easeInOut,
        opacity: 0
    }, 0)
    .to('.SMcircle', 1, {
        scale: 15,
        borderRadius: 0,
    }, .5)
    .to('.contAs_Elem_animation', 1, {
        top: '0%'
    }, 1.5)
    .to('.cube', 1, {
        transform: 'translateZ(-100px) rotateY( -90deg)',
        ease: Power1.easeOut,
    }, 2.5)
    .to('.cube', .5, {
        transform: '  translateZ(-100px) rotateX(  90deg)',
        ease: Power1.easeOut,
    }, 4)
    .to('.cube', 1, {
        transform: '   translateZ(-100px) rotateX(  -90deg)',
        ease: Power1.easeOut,
    }, 5.5)
    .to('.cube', 2, {
        left: "-200%"
    }, 8.5)
    .to('.q1', 1, {
        rotationX: 360,
        rotationY: 360,
        rotationZ: 360,
        top: '120%',
        ease: Power1.easeOut,
    }, 6)
    .to('.q2', .5, {
        rotationX: 360,
        rotationY: 100,
        rotationZ: 200,
        top: '120%',
        ease: Power1.easeOut,
    }, 6)
    .to('.q3', 1.5, {
        rotationX: 150,
        rotationY: 300,
        rotationZ: 20,
        top: '120%',
        ease: Power1.easeOut,
    }, 6)
    .to('.q4', 2.5, {
        rotationX: 10,
        rotationY: 300,
        rotationZ: 200,
        top: '120%',
        ease: Power1.easeOut,
    }, 6)
    .to('.q5', 2.5, {
        rotationX: 10,
        rotationY: 100,
        rotationZ: 200,
        top: '120%',
        ease: Power1.easeOut,
    }, 6)
    .to('.q6', 1.5, {
        rotationX: 150,
        rotationY: 300,
        rotationZ: 20,
        top: '120%',
        ease: Power1.easeOut,
    }, 6)
    .to('.q7', .5, {
        rotationX: 360,
        rotationY: 100,
        rotationZ: 200,
        top: '120%',
        ease: Power1.easeOut,
    }, 6)
    .to('.q8', 3, {
        rotationX: 360,
        rotationY: 30,
        rotationZ: 360,
        top: '120%',
        ease: Power1.easeOut,
    }, 6)
    .to('.q9', 3.5, {
        rotationX: 100,
        rotationY: 360,
        rotationZ: 20,
        top: '120%',
        ease: Power1.easeOut,
    }, 6)
    .to('.q10', 1, {
        rotationX: 36,
        rotationY: 10,
        rotationZ: 300,
        top: '120%',
        ease: Power1.easeOut,
    }, 6)
    .to('.q11', 2, {
        rotationX: 10,
        rotationY: 30,
        rotationZ: 20,
        top: '120%',
        ease: Power1.easeOut,
    }, 6)
    .to('.q12', 3, {
        rotationX: 50,
        rotationY: 300,
        rotationZ: 200,
        top: '120%',
        ease: Power1.easeOut,
    }, 6)
    .to('.macWin', 1.5, {
        top: '-70%',
        left: '30%',
        ease: Power1.easeInOut,
    }, 8)
    .to('.cursorsTopo', 1, {
        bottom: '0',
        right: '0',
        ease: Power1.easeInOut,
        onComplete: function() {
            changeDisplay(".coderow", "none")
            waitForEnter = true;
        },
        onReverseComplete: function() {
            changeDisplay(".coderow", "block")
            waitForEnter = true;
            // document.getElementsByClassName("macWin")[0].style.zIndex = 0;
            macWinContactID.innerHTML = "Andrea Barutta, Padova IT [Versione 04/03/2002]<BR> > world.getDevelopers().getByName(<p style='font-weight:bold;display:contents; '>'Andrea Barutta'</p>).getContact() <br>            <BR>> PRESS ENTER:<br> ";
        }
    }, 9)
    .to('.macWin', 1, {
        top: '0%',
        left: '40%',
        ease: Power1.easeInOut,
        onReverseComplete: function() {
            $("#tweetDV").hide()
                //document.getElementById("tweetDIV").style.display = 'none';
            document.getElementById("tweet").currentTime = 0;

        }
    }, 12)
    .to('.tweetDIV', 1, {
        display: 'flex',
        ease: Power1.easeInOut,
    }, 13)
    .to('#lamp', 1, {
        top: '0px',
        ease: Power1.easeInOut,
        onComplete: function() {
            $(".radioOn").prop('checked', true);
            $(".radioOff").prop('checked', false);
        },
        onReverseComplete: function() {
            $(".radioOn").prop('checked', false);
            $(".radioOff").prop('checked', true);
        }
    }, 13)
    .to('.tweetDIV', 2, {
        opacity: 0,
        ease: Power1.easeInOut,
        onComplete: function() {
            $("#sottotitoli").text("I have always played volleyball in important clubs in northern Italy.")
        },
        onReverseComplete: function() {
            $("#sottotitoli").text("")
        }

    }, 14)
    .to('.photos', 1, {
        display: "flex",
        ease: Power1.easeInOut,
    }, 16)
    .to('.photos', 1, {
        left: '-50%',
        ease: Power1.easeInOut,
    }, 17)
    .to('.photos img', 1, {
        rotationY: "180deg",
        opacity: 0,
        ease: Power1.easeInOut,
        onComplete: function() {
            $("#sottotitoli").text(" This allowed me to improve my time management skills given the many workouts combined in the studio.")
        },
        onReverseComplete: function() {
            $("#sottotitoli").text("I have always played volleyball in important clubs in northern Italy.")
        }
    }, 18)
    .to('#lamp', 1, {
        top: '-100%',
        ease: Power1.easeInOut,
    }, 18)
    .to('.photos', 1, {
        opacity: 0,
        ease: Power1.easeInOut,
        onComplete: function() {
            $("#sottotitoli").text("In high school I discovered my passion for computer science born from small school projects like this memory.")
            $(".card").css("opacity", "1");
            $(".card").addClass("notDone")
            $(".card").css("background", "")
            cardTurned = 0;
            cardFound = 0;
        },
        onReverseComplete: function() {
            $("#sottotitoli").text("This allowed me to improve my time management skills given the many workouts combined in the studio.")
        }
    }, 19)

.to('.memoryContenitor', 1.5, {
        display: "flex",
        ease: Power1.easeInOut,
        onComplete: function() {
            $("#sottotitoli").text("So I decided to dedicate some of the time I dedicated to sport to the study of computer programming and web developing.")
            $(".googleSearch").css("display", "block")
        },
        onReverseComplete: function() {
            $("#sottotitoli").text("In high school I discovered my passion for computer science born from small school projects like this memory.")
            $(".memoryContenitor").css("display", "")
        }

    }, 20)
    .to('.blackground', 1.5, {
        background: "#fff",
        ease: Power1.easeInOut,
    }, 19)
    .to('.memoryContenitor', 1, {
        display: "",
        ease: Power1.easeInOut,
    }, 23)
    .to('.googleSearch', 1, {
        opacity: 1,
        ease: Power1.easeInOut,
    }, 23)
    .to('.searchbar', 1, {
        text: "How to center a box html",
        ease: Power1.easeInOut,
    }, 24)
    .to('.searchbar', .5, {
        text: "How to center a ",
        ease: Power1.easeInOut,
    }, 25)
    .to('.searchbar', .5, {
        text: "How to center a div",
        ease: Power1.easeInOut
    }, 25.5)
    .to('.googleSearch', 1, {
        top: "-100%",
        ease: Power1.easeInOut,
        onComplete: function() {
            $("#sottotitoli").text("Today I continue to study whatever can be useful to my passion for programming and when I can I try to add a little creativity and good taste to my ideas.")

        },
        onReverseComplete: function() {
            $("#sottotitoli").text("So I decided to dedicate some of the time I dedicated to sport to the study of computer programming and web developing.")

        }
    }, 26.5)
    .to('.blackground', 1.5, {
        background: "#121113",
        ease: Power1.easeInOut
    }, 26)
    .to('.finalImage', 1, {
        opacity: 1,
        ease: Power1.easeInOut,

    }, 27.5)
    .to('.goodbyeDIV path', 1, {
        strokeDashoffset: 0,
        opacity: 1,
        ease: Power1.easeInOut

    }, 28)








//var tween = TweenMax.to(".scrollAnimationDIV'", 1, { scale: 2, opacity: 0, ease: Linear.easeNone });


let masterTl = gsap.timeline({ repeat: -1 })
const words = ["Creative full stack developer", "Creative web developer", "Creative developer", "Developer"]

words.forEach(word => {
    let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 })
    tl.to('.text', { duration: 1, text: word })

    masterTl.add(tl)
})


/*
 
*/



//
const controller = new ScrollMagic.Controller();

const scene1 = new ScrollMagic.Scene({
        triggerElement: '.scrollAnimationDIV',
        duration: 30000,
        triggerHook: trigHook

    })
    .setTween(tween)
    .setPin('.scrollAnimationDIV')
    .addTo(controller);


//TIMELINE 2

const tween2 = new TimelineLite();
tween2
    .to('.alien', { duration: 1, translateX: "-300%", translateY: "80%", rotationZ: '-30deg' })
    .to('.alien', { duration: 1, translateX: "60%", translateY: "160%", rotationZ: '30deg' })

const scene2 = new ScrollMagic.Scene({
        triggerElement: '.textContenitor',
        duration: 1500,
        triggerHook: trigHook

    })
    .setTween(tween2)
    .addTo(controller)


//WAIT FOR ENTER KEY

// Get the input field
var bodyElem = document.getElementById("body");
var input = bodyElem;

document.getElementById("macWin").onclick = function() {

    launchCMD();
}

input.addEventListener("keyup", function(event) {

    if (event.keyCode === 13) {

        launchCMD();

    }
});

function launchCMD() {
    console.log(waitForEnter)
    if (waitForEnter) {
        waitForEnter = false;
        setTimeout(function() {
            macWinContactID.innerHTML += "> .. <br>"
        }, 1000);
        setTimeout(function() {
            macWinContactID.innerHTML += "> ... <br>"
        }, 2000);
        setTimeout(function() {
            macWinContactID.innerHTML += "> .... <br>"
        }, 3000);
        setTimeout(function() {
            typeWriter()

        }, 4000);
    }
}



//____________________________-

function changeDisplay(className, display) {
    var elems = document.querySelectorAll(className);
    var index = 0,
        length = elems.length;
    for (index; index < length; index++) {
        elems[index].style.display = display;
    }
    if (display == 'none') {
        document.getElementsByClassName("contactme")[0].style.display = 'flex';
    } else {
        document.getElementsByClassName("contactme")[0].style.display = 'none';
    }
}

//----------------------------
function contactInput() {
    document.getElementById("errorID").style.display = "flex";
    setTimeout(function() {
        document.getElementById("errorID").style.display = "none";
    }, 1000);
    typeWriter()
}
var j = 0;
var txt = "< > email: andreabarutta123@gmail.com < > instagram: andrea.barutta < > To continue my story keep scrolling... ";
var speed = 50;


function typeWriter() {
    if (j < txt.length) {
        if (txt.charAt(j) == '<') {
            document.getElementById("contactmeID").innerHTML += "<br>";
        } else {
            document.getElementById("contactmeID").innerHTML += txt.charAt(j);
        }

        j = j + 1;
        setTimeout(typeWriter, speed);
    } else {
        j = 0
    }
}


//______________________________-

let memory = [0, 0, 0, 0, 0, 0, 0, 0];
let colors = ["purple", "tomato", "blue", "yellow"]

function initializecard() {
    var index;
    colors.forEach(element => {

        for (var i = 0; i < 2; i++) {
            index = getRandomInt(8);

            while (memory[index] != 0) {
                index = getRandomInt(8);
            }
            memory[index] = element;

        }
    });
}

initializecard()

var cardTurned = 0;
var cardTurn = [0, 0],
    cardFound = 0,
    canGo = true;

$(".card").click(function() {
    if (canGo) {
        $(this).css({
            "background": memory[this.id.split("_")[1]],
            "transform": "rotateY(180deg)"
        });
        cardTurn[cardTurned] = $(this).attr('id')
        cardTurned++;
        controlCardTurned();
    }


});


function controlCardTurned() {
    if (cardTurned == 2) {
        cardTurned = 0;
        canGo = false;
        controlSameColor();
        setTimeout(function() {
            $(".notDone").css("background", "")
            canGo = true;
        }, 1000);
    }
}


function controlSameColor() {
    if (memory[cardTurn[0].split("_")[1]] == memory[cardTurn[1].split("_")[1]] && cardTurn[0] != cardTurn[1]) {
        cardFound++;
        cardTurn.forEach(element => {
            document.getElementById(element).classList.remove("notDone");

            if (controlWin()) {
                setTimeout(function() {
                    $(".card").css("opacity", "0")
                }, 1000);
            }
        });
    }

}




function controlWin() {

    return (cardFound == 4);

}



function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}