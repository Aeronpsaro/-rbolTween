let scene, renderer;
let camera;
let objetos = [];

init();
animationLoop();

function attachAnimation(object) {
	var tomove = object;
	// Define keyframes y propiedades a interpolar
	const tween1 = new TWEEN.Tween({ x: object.position.x , y: object.position.y, angy: object.rotation.y})
		.to({ x: object.position.x , y: object.position.y, angy: object.rotation.y+Math.PI}, 2000)
		.onUpdate((coords) => {
			tomove.position.x = coords.x;
			tomove.position.y = coords.y;
			tomove.rotation.y = coords.angy;
		})
		.easing(TWEEN.Easing.Exponential.InOut)
		.delay(100);
	const tween2 = new TWEEN.Tween({ x: object.position.x , y: object.position.y, angy: object.rotation.y+Math.PI})
		.to({ x: object.position.x , y: object.position.y, angy: object.rotation.y+2*Math.PI}, 2000)
		.onUpdate((coords) => {
			tomove.position.x = coords.x;
			tomove.position.y = coords.y;
			tomove.rotation.y = coords.angy;
		})
		.easing(TWEEN.Easing.Exponential.InOut)
		.delay(100)
		//.repeat(Infinity);
	
	tween1.chain(tween2);
	tween2.chain(tween1);
	tween1.start();
}

function init() {
	//Defino cámara
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.set(-4, 0, 25);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	//Objetos
	Esfera(0, 10, 0, 1);
	for (i = 0; i<10; i++) {
		sphere = objetos.pop();
		Esfera(2.0, -2.0, 0, 1, sphere);
		Esfera(-2.0, -2.0, 0, 1, sphere);
		attachAnimation(sphere);
	}
}

function Esfera(px, py, pz, r, father = scene) {
	let geometry = new THREE.SphereGeometry(r, 100, 100);
	//Material con o sin relleno
	let material = new THREE.MeshNormalMaterial({
		//wireframe: true, //Descomenta para activar modelo de alambres
	});

	let mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(px, py, pz);
	if (father != scene) {
		const material = new THREE.LineBasicMaterial({color: 0xffffff});
		const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3( 0, 0, 0 ), mesh.position]);
		const line = new THREE.Line(geometry, material);
		father.add(line);
	}
	father.add(mesh);
	objetos.push(mesh);
}

//Bucle de animación
function animationLoop() {
	requestAnimationFrame(animationLoop);

	TWEEN.update();

	renderer.render(scene, camera);
}

