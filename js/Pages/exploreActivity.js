import * as THREE from "../THREEm/three.module.js";
import { GLTFLoader } from "../THREEm/GLTFLoader.js";
import { DRACOLoader } from "../THREEm/DRACOLoader.js";

const shadow = document.getElementById("exploreActivityPage").attachShadow({ mode: "open" });
const link = document.createElement("link");
link.setAttribute("rel", "stylesheet");
link.setAttribute("href", "./css/explore-activity-style.css");
const parent = c("div", { class: "exploreRoot" });
shadow.appendChild(link);
shadow.appendChild(parent);

// const zoomTag = (e) => {
// 	if (document.getElementsByClassName("noWidth").length < 3) {
// 		for (i = 0; i < 3; i++) {
// 			if (!document.getElementsByClassName("labelInfo")[i].classList.contains("noWidth")) {
// 				document.getElementsByClassName("labelInfo")[i].classList.add("noWidth");
// 			}
// 		}
// 	}
// 	e.currentTarget.children[0].classList.remove("noWidth");
// 	const b = new THREE.Vector3();
// 	e.currentTarget.parent3D.getWorldPosition(b);
// 	tweenCamera(vecAdd(b.toArray(), [0, 0, 0.03]), b.toArray());

// 	e.currentTarget.classList.add("visitedLabel");
// 	if (document.getElementsByClassName("visitedLabel").length >= 3) {
// 		explrComp = true;
// 		console.log("Next!!");
// 	}
// };

// const unZoomTag = (e) => {
// 	e.stopPropagation();
// 	e.currentTarget.parentElement.classList.add("noWidth");
// 	tweenCamera(pieces["RGB LEDs"]["1"].camera.pos, pieces["RGB LEDs"]["1"].camera.look);
// };

// const pieces = {
// 	"RGB LEDs": {
// 		config: ["base4x4", "top4x4", "RGB LEDs"],
// 		0: {
// 			camera: { pos: [-0.02, 0.1, 0.01], look: [-0.02, 0, 0] },
// 			anim: {
// 				top4x4: { pos: [0, 0, 0] },
// 				"RGB LEDs": {
// 					pos: [-0.00003354529326315969, 0.006070385221391916, -0.00007747599738650024],
// 					rot: [0, 0, 0],
// 				},
// 			},
// 			elems: [
// 				{
// 					children:
// 						"Phones, TVs, Christmas lights - coloured lights are everwhere. An RGB LED combines the primary colours of light to produce any colour imaginable!",
// 				},
// 				{ tag: "img", props: { src: "./res/img/christmas_lights.png" } },
// 				{ tag: "img", props: { src: "./res/img/traffic_lights.png" } },
// 				{
// 					children:
// 						"A combination of a single Red, Green and Blue LED put together in a housing that allows the selection of more colours by combining each coloured light.",
// 				},
// 			],
// 		},
// 		1: {
// 			p: "Let's take a look inside!",
// 			camera: { pos: [0, 0.05, 0.06], look: [0, 0.04, 0] },
// 			anim: {
// 				top4x4: { pos: [0, 0.06, 0] },
// 				"RGB LEDs": { pos: [0, 0.04, 0], rot: [Math.PI / 2.7, 0, 0] },
// 			},
// 			labels: [
// 				{
// 					tag: "div",
// 					content: 1,
// 					class: "",
// 					events: { click: zoomTag },
// 					pos: [0, 0, 1],
// 					children: [3],
// 				},
// 				{
// 					tag: "div",
// 					content: 2,
// 					class: "",
// 					events: { click: zoomTag },
// 					pos: [0, 0, 0.45],
// 					children: [4],
// 				},
// 				{
// 					tag: "div",
// 					content: 3,
// 					class: "",
// 					events: {
// 						click: (e) => {
// 							zoomTag(e);
// 						},
// 					},
// 					pos: [-0.65, 0, -0.07],
// 					children: [5],
// 				},
// 				{ tag: "div", content: "This is where the electricity comes in", class: "labelInfo noWidth" },
// 				{
// 					tag: "div",
// 					content:
// 						"This small black box is a <em>Logic Chip</em>.<br>It tells each light how bright to shine.<br> It sorts the electrical signal, then directs the correct amount of electricity to each LED.",
// 					class: "labelInfo noWidth rightLabel",
// 				},
// 				{
// 					tag: "div",
// 					content:
// 						"This single light contains 3 LEDs. Can you spot them? One Red, one Green and one Blue.<br>These are the 3 primary colors of light.",
// 					class: "labelInfo noWidth rightLabel",
// 				},
// 			],
// 		},
// 		2: {
// 			p: "Change the amounts of Red, Green, and Blue in this LED to make different colours! (Have some goals i.e.: make blue, orange, ...)",
// 			camera: { pos: [-0.02, 0.05, 0.06], look: [-0.02, 0.04, 0] },
// 			anim: {
// 				top4x4: { pos: [0, 0.06, 0] },
// 				"RGB LEDs": { pos: [0, 0.04, 0], rot: [Math.PI / 2.7, 0, 0] },
// 			},
// 		},
// 		3: {
// 			p: "Now use the RGB colour chart to create the right colours.",
// 			camera: { pos: [-0.02, 0.05, 0.06], look: [-0.02, 0.04, 0] },
// 			anim: {
// 				top4x4: { pos: [0, 0.06, 0] },
// 				"RGB LEDs": { pos: [0, 0.04, 0], rot: [Math.PI / 2.7, 0, 0] },
// 			},
// 		},
// 		4: {
// 			p: "Congratulations for completing the RGB LED learning module! Check out the EdgeUQeusts you've unlocked: [list them] || Return to Hardware/EdgeULab/Simulator (??)",
// 			camera: { pos: [0, 0.1, 0.03], look: [0, 0, 0] },
// 			anim: {
// 				top4x4: { pos: [0, 0, 0] },
// 				"RGB LEDs": {
// 					pos: [-0.00003354529326315969, 0.006070385221391916, -0.00007747599738650024],
// 					rot: [0, 0, 0],
// 				},
// 			},
// 		},
// 		functions: {
// 			glow: (r, g, b) => {
// 				var glowMesh = new THREEx.GeometricGlowMesh(scene.children[0]);
// 				scene.children[0].add(glowMesh.object3d);

// 				var insideUniforms = glowMesh.insideMesh.material.uniforms;
// 				insideUniforms.glowColor.value.set("hotpink");
// 				var outsideUniforms = glowMesh.outsideMesh.material.uniforms;
// 				outsideUniforms.glowColor.value.set("hotpink");
// 			},
// 		},
// 	},
// };

// const parts = ["base4x4", "top4x4"];

class Model {
	constructor({
		url,
		folder,
		labels,
		scale = 1,
		position = [0, 0, 0],
		rotation = 0,
		light = 1,
		canvasClass,
	}) {
		this.url = url;
		this.folder = folder;
		this.labels = labels;
		this.scale = scale;
		this.position = position;
		this.rotation = rotation;
		this.light = light;
		this.parallax = undefined;
		this.modelAnimation = false;
		this.animDuration = 2000;
		this.setThreeScene();
		this.addLights();
		this.loadModel();
		this.canvasCont = c("div", { class: canvasClass }, [
			this.renderer.domElement,
			this.lRenderer.domElement,
		]);

		this.animate();
		return this.canvasCont;
	}

	setThreeScene() {
		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.updateProjectionMatrix();
		this.camera.position.set(0, 0, 3);

		this.renderer = new THREE.WebGLRenderer({ alpha: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight, false);
		this.renderer.setPixelRatio(window.devicePixelRatio);

		this.lRenderer = new CSS2DRenderer();
		this.lRenderer.domElement.style.overflow = "visible";
		this.lRenderer.domElement.style.overflowX = "visible";
		this.lRenderer.domElement.style.overflowY = "visible";
		this.lRenderer.setSize(window.innerWidth, window.innerHeight, false);
	}

	addLights() {
		// const light1 = new THREE.AmbientLight(0xffffff, 0.2);
		// light1.name = "ambient_light";
		// this.scene.add(light1);

		const light2 = new THREE.DirectionalLight(0xffffff, 0.8 * Math.PI * this.light);
		light2.position.set(0, 1, 1);
		light2.lookAt(0, 0, 0);
		light2.name = "light_one";
		this.scene.add(light2);

		const light3 = new THREE.DirectionalLight(0xffffff, 0.3 * Math.PI * this.light);
		light3.position.set(0.1, -0.5, 1);
		light3.lookAt(0, 0, 0);
		light3.name = "light_two";
		this.scene.add(light3);

		const light4 = new THREE.DirectionalLight(0xffffff, 0.3 * Math.PI * this.light);
		light4.position.set(-1, 0, 2);
		light4.lookAt(0, 0, 0);
		light4.name = "light_two";
		this.scene.add(light4);
	}

	loadModel() {
		const loader = new GLTFLoader();
		const s = this.scale;
		const p = this.position;
		loader.load(
			`${this.url}/model.${this.folder}.glb`,
			(model) => {
				this.model = model.scene;
				this.model.scale.set(s, s, s);
				this.model.position.set(p[0], p[1], p[2]);
				this.model.layers.enableAll();
				this.scene.add(this.model);
			},
			undefined,
			(error) => {
				console.error(error);
			}
		);
	}

	resize() {
		const canvas = this.renderer.domElement;
		const lr = this.lRenderer.domElement;

		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		const needRes =
			w !== canvas.width || h !== canvas.height || w !== lr.clientWidth || h !== lr.clientHeight;

		if (needRes) {
			this.renderer.setSize(w * 2, h * 2, false);
			this.lRenderer.setSize(w, h, false);
		}
		return needRes;
	}

	animate() {
		if (this.resize()) {
			const canvas = this.renderer.domElement;
			this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
			this.camera.updateProjectionMatrix();
		}
		if (this.model) {
			this.model.rotation.x = this.rotationX || 0;
			this.model.rotation.y = this.rotationY || 0;
			if (this.modelAnimation) {
				if (!this.animationController) {
					this.animationController = 0.1;
				}
				this.model.rotation.y += this.bezierFunc(this.animationController, 0.03);
				this.animationController += 0.05;
			}
		}

		requestAnimationFrame(() => {
			this.renderer.render(this.scene, this.camera);
			this.lRenderer.render(this.scene, this.camera);
			this.animate();
		});
	}

	turn() {
		this.time = Date.now();
		this.prevRot = this.model.rotation.y;
		this.animateTurn();
	}

	animateTurn() {
		const t = (Date.now() - this.time) / this.animDuration;

		this.model.rotation.y = lerp(this.prevRot, this.prevRot + Math.PI * 2, easeMov(t));
		this.canvasCont.style.position = "relative";
		this.canvasCont.style.right = `${lerp(0, 25, easeMov(t))}%`;
		this.canvasCont.style.transform = `scale(${lerp(1, 1.2, easeMov(t))})`;
		if (t < 1) {
			this.animFrame = window.requestAnimationFrame(() => {
				this.animateTurn();
			});
		} else {
			this.parallaxEffect();
			window.cancelAnimationFrame(this.animFrame);
		}
	}

	parallaxEffect() {
		if (!this.parallax) {
			this.parallax = (e) => {
				const { right: r } = this.canvasCont.getBoundingClientRect();
				this.rotationX = e.clientY / window.innerHeight / 2;
				this.rotationY = (e.clientX - r) / window.innerWidth / 2 + this.rotation;
			};
			window.onmousemove = this.parallax;
		} else {
			this.parallax = undefined;
			window.onmousemove = null;
		}
	}

	bezierFunc(t, f) {
		return t * t * (3.0 * f - 2.0 * f * t);
	}

	addLabels() {
		Object.keys(this.labels).forEach((k, i) => {
			setTimeout(() => {
				const space = this.model.getObjectByName(k);
				const label = this.getLabels(this.labels[k], i);

				const threeLabel = new CSS2DObject(label);
				threeLabel.element.style.overflow = "visible";
				// threeLabel.position.copy(space.position);
				space.add(threeLabel);
			}, 500 * i);
		});
	}

	// getLabels(text, i) {
	// 	const dir = i % 2 === 0 ? "labelLeft" : "labelRight";
	// 	const p = c("p", {}, []);
	// 	const t = c("div", { class: "labelText" }, [p]);

	// 	const vectorRight = c("div", { class: "labelVector labelVectorRight" }, [
	// 		cSvg("svg", { viewBox: "0 0 200 100" }, [
	// 			cSvg("circle", { cx: "190", cy: "10", r: "5", stroke: "black", fill: "black" }, []),
	// 			cSvg("path", { d: "M190 10 L100 50 L0 50", stroke: "black", fill: "none" }),
	// 		]),
	// 	]);

	// 	const cont = c("div", { class: `questLabel ${dir}` }, [t, vectorRight]);

	// 	setTimeout(() => {
	// 		writeText(p, text);
	// 	}, 200 * i);

	// 	return cont;
	// }
}

const addScene = (body, background = "white", delay = 200) => {
	parent.classList.add("exploreTransitionFadeOut");
	const cont = document.getElementById("exploreActivityPage");
	console.log(cont);
	cont.style.transition = "background-color 300ms linear";
	cont.style.backgroundColor = background;

	setTimeout(() => {
		parent.innerHTML = "";
		cont.style.transition = "";
		parent.classList.add("exploreTransitionFadeIn");
		parent.appendChild(body);
	}, delay);
};

const exploreModel = {
	init(pieces) {
		this.pieces = pieces;
		this.canvas = c("canvas", { class: "canvas" });
		this.initScene();
		this.initLights();
	},

	initScene() {
		this.loader = new GLTFLoader();
		this.dracoLoader = new DRACOLoader();
		this.dracoLoader.setDecoderPath("./js/THREE/");
		// const canvas = document.getElementById("canvas");
		// const parts3D = new THREE.Object3D();
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xfff4e2);
		this.scene.userData.labels = [];
		const element = document.getElementById("exploreActivityPage");
		this.camera = new THREE.PerspectiveCamera(
			39.6,
			element.offsetWidth / element.offsetHeight,
			0.001,
			20
		);

		this.camera.position.set(-0.02, 0.1, 0.01);
		this.camera.lookAt(-0.02, 0, 0);
		this.pieces[piece].config.forEach((elem) => {
			this.scene.add(parts3D.userData[elem]);
		});

		this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
		this.renderer.setClearColor(0xf0f0f3, 0);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = false;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.gammaFactor = 2.2;
		this.renderer.physicallyCorrectLights = true;
		this.renderer.setScissorTest(true);

		this.renderer.toneMapping = THREE.LinearToneMapping;
		this.renderer.toneMappingExposure = 1;
		this.loader.setDRACOLoader(this.dracoLoader);
	},

	loadLights() {
		const lux = 0.25 * Math.PI;

		this.scene.add(new THREE.AmbientLight(0xffffff, 1));

		const dirLight0 = new THREE.DirectionalLight(0xffffff, lux / 2);
		dirLight0.position.set(0, 0.8, 0);
		this.scene.add(dirLight0);

		const dirLight = new THREE.DirectionalLight(0xffffff, lux);
		dirLight.position.set(0, 0.8, 1);
		this.scene.add(dirLight);

		const dirLight1 = new THREE.DirectionalLight(0xffffff, lux);
		dirLight1.position.set(0.866, 0.8, -0.5);
		this.scene.add(dirLight1);

		const dirLight2 = new THREE.DirectionalLight(0xffffff, lux);
		dirLight2.position.set(-0.866, 0.8, -0.5);
		this.scene.add(dirLight2);
	},

	render() {
		this.updateSize();

		if (!this.renderer) {
			cancelAnimationFrame(animationFrame);
			return;
		}

		this.renderer.clear();

		// set the viewport
		const element = this.scene.userData.element;
		const rect = element.getBoundingClientRect();
		const width = rect.right - rect.left;
		const height = rect.bottom - rect.top;
		const left = rect.left;
		const bottom = renderer.domElement.clientHeight - rect.bottom;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.renderer.setViewport(left, bottom, width, height);
		this.renderer.setScissor(left, bottom, width, height);

		this.renderer.render(scene, scene.userData.camera);

		if (this.scene.userData.labelRenderer) {
			if (!this.scene.userData.labelRenderer.width || !this.scene.userData.labelRenderer.height) {
				this.scene.userData.labelRenderer.setSize(
					this.scene.userData.element.clientWidth,
					this.scene.userData.element.clientHeight
				);
			}
			this.scene.userData.labelRenderer.render(scene, scene.userData.camera);
			//const currentPage = document.getElementById('explore3DPage');
			//    ReactDOM.render(currentElems, currentPage);
		}
	},

	updateSize() {
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;

		if (this.canvas.width !== width || this.canvas.height !== height) {
			this.renderer.setSize(width, height, false);
			if (this.scene.userData.labelRenderer) {
				this.scene.userData.labelRenderer.setSize(
					this.scene.userData.element.clientWidth,
					this.scene.userData.element.clientHeight
				);
			}
		}
	},
};

const exploreActivity = {
	async init(folder) {
		this.folder = folder;
		this.url = `./res/explore/${this.folder}`;

		const res = await fetch(`${this.url}/config.${this.folder}.JSON`);
		this.data = await res.json();
		this.elem = c("h1", {}, ["hola"]);
		this.description();
	},

	description() {
		const { description } = this.data;

		this.h1 = c("h1", { class: "exploreTitle" }, []);
		const p = c("p", { class: "descriptionParagraph" }, []);
		const btn = c("button", { class: "exploreBtn" }, [`Explore`], {
			click: () => {
				this.uses();
			},
		});

		const text = c("div", { class: "descriptionText" }, [this.h1, p, btn]);

		const cont = c("div", { class: "descriptionCont" }, [text]);

		addScene(cont, "wheat");
		writeText(this.h1, description.title, 30);
		writeText(p, description.paragraph, 10);
	},

	uses() {
		const a = c("div", {}, ["HOLAAA!"]);
		addScene(a);
	},

	labels() {},

	animations() {},

	coding() {},

	complete() {},
};

export default (hardware) => {
	exploreActivity.init(hardware);
};
