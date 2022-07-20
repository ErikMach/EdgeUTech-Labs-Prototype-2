import {
	Scene,
	Color,
	PerspectiveCamera,
	AmbientLight,
	DirectionalLight,
	WebGLRenderer,
	sRGBEncoding,
	LinearToneMapping,
} from "./THREEm/three.module.js";
import * as THREE from "../THREEm/three.module.js";
import { GLTFLoader } from "./THREEm/GLTFLoader.js";

let scene, camera, renderer, animationFrame, cLookAt;
const canvas = document.getElementById("canvas");

const loadGLTF = (dirs = [], func) => {
	const loader = new GLTFLoader();
	const models = {};

	dirs.forEach((dir) => {
		loader.load(
			dir,
			function (glb) {
				if (!scene) {
					console.warn("Need to init before loading objects");
				}
				scene.add(glb.scene.children[0]);
				models[dir.split(/\//g).pop().split(".")[0]] = glb.scene.children[0];
				if (Object.keys(models).length === dirs.length) {
					func(models);
				}
			},
			function (xhr) {
				if (xhr.loaded === xhr.total) {
					console.log(dir, `loaded ${(100 * xhr.loaded) / xhr.total}%`);
				}
			},
			function (err) {
				console.error(err);
			}
		);
	});
};

const init = () => {
	//SCENE
	scene = new Scene();
	scene.background = new Color(0xfff4e2);

	scene.find = (name) => {
		const names = [];
		for (let i = 0; i < scene.children.length; i++) {
			const obj = scene.children[i];
			if (obj.name === name) {
				return obj;
			} else if (obj.name) {
				names.push(obj.name);
			}
		}
		console.warn(name, "is not a child of scene");
		console.log("Try", names);
	};

	scene.rid = (names = []) => {
		names.forEach((name) => {
			scene.remove(scene.find(name));
		});
	};

	scene.ridAll = () => {
		for (let i = scene.children.length; i > 0; i--) {
			const obj = scene.children[i - 1];
			if (obj.name) {
				scene.remove(obj);
			}
		}
	};
	//CAMERA
	camera = new PerspectiveCamera(39.6, canvas.offsetWidth / canvas.offsetHeight, 0.001, 40);
	camera.position.set(1, 1, 1);
	camera.lookAt(0.0, 0.25, -0.2);
	cLookAt = [0.0, 0.25, -0.2];
	//	scene.userData.camera = camera;

	/*
//ADD PIECES TO SCENE
	pieces[piece].config.forEach(elem => {
console.log(`Adding`, elem);
	  scene.add(parts3D.userData[elem]);
	});
*/

	//LIGHTS
	//	scene.add(new THREE.HemisphereLight( 0xffffff, 0x404040, 3 ));

	//PHYSICALLY CORRECT AND ALL

	const lux = 0.25 * Math.PI;

	scene.add(new AmbientLight(0xffffff, 1));

	const dirLight0 = new DirectionalLight(0xffffff, lux / 2);
	dirLight0.position.set(0, 0.8, 0);
	scene.add(dirLight0);

	const dirLight = new DirectionalLight(0xffffff, lux);
	dirLight.position.set(0, 0.8, 1);
	scene.add(dirLight);

	const dirLight1 = new DirectionalLight(0xffffff, lux);
	dirLight1.position.set(0.866, 0.8, -0.5);
	scene.add(dirLight1);

	const dirLight2 = new DirectionalLight(0xffffff, lux);
	dirLight2.position.set(-0.866, 0.8, -0.5);
	scene.add(dirLight2);

	//GROUND (GridHelper)
	//	const gridHelper = new GridHelper( 0.4, 20 );
	//	scene.add(gridHelper);

	//RENDERER FOR ALL SCENES
	renderer = new WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
	renderer.setClearColor(0xf0f0f3, 0);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMap.enabled = false;
	renderer.outputEncoding = sRGBEncoding;
	renderer.physicallyCorrectLights = true;
	renderer.setScissorTest(true);

	renderer.toneMapping = LinearToneMapping;
	renderer.toneMappingExposure = 1;

	//ACTION
	animate();
	setTimeout(() => {
		//      cancelAnimationFrame(animationFrame);
	}, 500);
	window.addEventListener("resize", render);
};

const updateSize = () => {
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	if (canvas.width !== width || canvas.height !== height) {
		renderer.setSize(width, height, false);
		if (scene.userData.labelRenderer) {
			scene.userData.labelRenderer.setSize(
				scene.userData.element.clientWidth,
				scene.userData.element.clientHeight
			);
		}
	}
};

const animate = () => {
	render();
	animationFrame = requestAnimationFrame(animate);
};

const render = () => {
	updateSize();

	if (!renderer) {
		cancelAnimationFrame(animationFrame);
		return;
	}

	renderer.clear();

	// set the viewport
	const element = canvas;
	const rect = element.getBoundingClientRect();
	const width = rect.right - rect.left;
	const height = rect.bottom - rect.top;
	const left = rect.left;
	const bottom = renderer.domElement.clientHeight - rect.bottom;
	//	const camera = scene.userData.camera;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setViewport(left, bottom, width, height);
	renderer.setScissor(left, bottom, width, height);

	renderer.render(scene, camera);

	if (scene.userData.labelRenderer) {
		if (!scene.userData.labelRenderer.width || !scene.userData.labelRenderer.height) {
			scene.userData.labelRenderer.setSize(
				scene.userData.element.clientWidth,
				scene.userData.element.clientHeight
			);
		}
		scene.userData.labelRenderer.render(scene, scene.userData.camera);
	}
};

const animateCam = (toPos = [0, 0, 0], lookAt = [0, 0, 0]) => {
	const dp = 100;
	const diff = camera.position.toArray().map((p, i) => (toPos[i] - p) / dp);
	const dl = cLookAt.map((l, i) => (lookAt[i] - l) / dp);
	let tally = 0;
	const goCam = () => {
		camera.position.set(...camera.position.toArray().map((p, i) => p + diff[i]));
		camera.lookAt(...cLookAt.map((p, i) => p + dl[i]));
		cLookAt = cLookAt.map((p, i) => p + dl[i]);
		tally++;
		if (tally < dp) {
			requestAnimationFrame(goCam);
		} else {
			camera.position.set(...toPos);
		}
	};
	requestAnimationFrame(goCam);
};

let autoRotFrame, timeCheckFrame;
let tick, ticks, radius;
let dt = 15; // milliseconds for 100fps
let msPerRot = 60000;

const autoRot = () => {
	// for 5s/rot @ 100 ticks/s: 0.01 s/ticks => 500 ticks/5s => 500 ticks/rot
	// rot = 2PI rad. 500 ticks/ 2PI rad = 500/2PI ticks/rad => 2PI/500 rad/ticks => trig(2*Math.PI*dt*ticks/(milliSecondsPerRot = 5))
	camera.position.x = -radius * Math.sin((ticks * dt * 2 * Math.PI) / msPerRot);
	camera.position.z = radius * Math.cos((ticks * dt * 2 * Math.PI) / msPerRot);
	/*
  const newPos = [
    camera.position.x - radius * Math.sin(ticks*dt*2*Math.PI/msPerRot),
    1*camera.position.y,
    1*camera.position.z + radius * Math.cos(ticks*dt*2*Math.PI/msPerRot)
  ];
console.log(newPos)
  camera.position.set(...newPos);
*/
	camera.lookAt(0, 0, 0);
};

const startAutoRot = () => {
	tick = window.performance.now();
	ticks = 0;
	radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
	const timeCheck = () => {
		if (window.performance.now() - tick - dt) {
			tick = window.performance.now();
			ticks++;
			autoRotFrame = requestAnimationFrame(autoRot);
		}
		timeCheckFrame = requestAnimationFrame(timeCheck);
	};
	setTimeout(timeCheck, 800);
};

const cancelAutoRot = () => {
	cancelAnimationFrame(timeCheckFrame);
	cancelAnimationFrame(autoRotFrame);
};

const diseng = () => {
	window.removeEventListener("resize", render);
	cancelAnimationFrame(animationFrame);
	if (scene.userData.labelRenderer) {
		document
			.getElementById("labelRenderer")
			.parentElement.removeChild(document.getElementById("labelRenderer"));
		scene = null;
	} else {
		scene = null;
	}
	renderer.render(emptyScene, emptyCamera);
	renderer.dispose();
	renderer = null;
};

window.loadGLTF = loadGLTF;
window.init = init;
window.scene = scene;

export { loadGLTF, init, scene, camera, animateCam, startAutoRot, cancelAutoRot, render };
