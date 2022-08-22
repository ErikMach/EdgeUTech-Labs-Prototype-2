import * as THREE from "../THREEm/three.module.js";
import { GLTFLoader } from "../THREEm/GLTFLoader.js";
import { DRACOLoader } from "../THREEm/DRACOLoader.js";
import { CSS2DObject, CSS2DRenderer } from "../THREEm/CSS2DRenderer.js";
import { OrbitControls } from "../THREEm/OrbitControls.js";
import { createBlock } from "../blockCreation.js";

const shadow = document.getElementById("exploreActivityPage").attachShadow({ mode: "open" });
const link = document.createElement("link");
const sceneRoot = c("div", { class: "sceneRoot" });
const modelRoot = c("div", { class: "modelRoot" });
const exploreRoot = c("div", { class: "exploreRoot" }, [modelRoot, sceneRoot]);

link.setAttribute("rel", "stylesheet");
link.setAttribute("href", "./css/explore-activity-style.css");
shadow.appendChild(link);
shadow.appendChild(exploreRoot);

// ANIMATION GENERATOR
// const addScene = (body, model = false, delay = 500) => {
// 	sceneRoot.classList.add("exploreTransitionFadeOut");
// 	if (model) {
// 		// expll.classList.add("exploreTransitionFadeOut");
// 	} else {
// 	}

// 	setTimeout(() => {
// 		sceneRoot.innerHTML = "";
// 		sceneRoot.classList.remove("exploreTransitionFadeOut");
// 		sceneRoot.classList.add("exploreTransitionFadeIn");
// 		sceneRoot.appendChild(body);
// 	}, delay);

// 	// setTimeout(() => {
// 	// 	parent.innerHTML = "";
// 	// }, delay);
// };

const addScene = (body, model = false, delay = 500) => {
	if (model) {
		modelRoot.classList.toggle("exploreTransition");
	}

	sceneRoot.classList.toggle("exploreTransition");

	setTimeout(() => {
		if (model) {
			modelRoot.innerHTML = "";
			modelRoot.classList.toggle("exploreTransition");
			modelRoot.appendChild(model);
		}

		sceneRoot.innerHTML = "";
		sceneRoot.classList.toggle("exploreTransition");
		sceneRoot.appendChild(body);
	}, delay);
};

//CAMBIAR --> Inefficient (only one requestAnimation)
class ModelAnimation {
	constructor(
		model,
		child = "all",
		prop,
		from = "current",
		to,
		duration = 1000,
		mode = "linear",
		callBack = false
	) {
		this.model = model;
		this.child = child;
		this.prop = prop;
		this.to = to;
		this.duration = duration;
		this.mode = mode;
		this.from = from;
		this.callBack = callBack;
	}

	init() {
		this.t = Date.now();
		this.getFrom();
		this.getTimingFunc();
		this.animationLoop();
	}

	animationLoop() {
		const t = (Date.now() - this.t) / this.duration;

		if (t <= 1) {
			const timingFunc = this.getTimingFunc();
			const newVal = this.from.map((e, i) => {
				return lerp(e, this.to[i], timingFunc(t));
			});
			this.model.setModelProp(this.child, this.prop, newVal, this.callBack);
			this.animFrame = requestAnimationFrame(() => {
				this.animationLoop();
			});
		} else {
			this.model.setModelProp(this.child, this.prop, this.to);
			cancelAnimationFrame(this.animFrame);
		}
	}

	getTimingFunc() {
		switch (this.mode) {
			case "linear":
				return function (x) {
					return x;
				};

			case "elastic":
				return function (x) {
					const c4 = (2 * Math.PI) / 3;

					return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
				};

			case "gentile":
				return function (x) {
					return 1 - Math.pow(1 - x, 5);
				};

			case "inAndOut":
				return function (x) {
					return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
				};

			case "inAndOutExpo":
				return function (x) {
					return x === 0
						? 0
						: x === 1
						? 1
						: x < 0.5
						? Math.pow(2, 20 * x - 10) / 2
						: (2 - Math.pow(2, -20 * x + 10)) / 2;
				};

			case "inAndOutElastic":
				return function (x) {
					const c5 = (2 * Math.PI) / 4.5;

					return x === 0
						? 0
						: x === 1
						? 1
						: x < 0.5
						? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
						: (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
				};

			case "out":
				return function (x) {
					return 1 - Math.pow(1 - x, 4);
				};

			default:
				return function (x) {
					return x;
				};
		}
	}

	getFrom() {
		const objToArr = (obj) => {
			if (typeof obj === "object") {
				const myObj = Object.keys(obj)
					.map((n) => obj[n])
					.filter((e) => typeof e === "number");
				return myObj;
			}
			return obj;
		};

		const keys = Object.keys(this.model);

		for (let i = 0; i < keys.length - 1; i++) {
			const elem = this.model[keys[i]];
			if (this.child === elem) {
			}
		}

		Object.keys(this.model).forEach((e) => {
			if (this.child === e) {
			}
		});

		if (this.from === "current") {
			const obj =
				this.child === "all" ? this.model.group[this.prop] : this.model.models[this.child][this.prop];

			this.from = objToArr(obj);
		}
	}
}

// CAMBIAR --> Way way redundant
class SceneAnimation {
	constructor(model, object, prop, from = "current", to, duration, mode = "linear") {
		// object === model, prop === "camera", from === "from"
		this.model = model;
		this.elem = object;
		this.object = this.model[object];
		this.prop = prop;
		this.from = from;
		this.to = to;
		this.duration = duration;
		this.mode = mode;
	}

	init() {
		this.time = Date.now();
		this.getFrom();
		this.loop();
	}

	loop() {
		const t = (Date.now() - this.time) / this.duration;
		if (t < 1) {
			let newVal;

			if (Array.isArray(this.from)) {
				newVal = this.from.map((e, i) => {
					return lerp(e, this.to[i], this.timingFunc(t));
				});
			} else {
				newVal = lerp(this.from, this.to, this.timingFunc(t));
			}

			this.model.setSceneProp(this.elem, this.prop, newVal);
			this.farameId = requestAnimationFrame(() => this.loop());
		} else {
			this.model.setSceneProp(this.elem, this.prop, this.to);
			cancelAnimationFrame(this.frameId);
		}
	}

	timingFunc(x) {
		switch (this.mode) {
			case "linear":
				return x;

			case "elastic":
				const c4 = (2 * Math.PI) / 3;
				return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;

			case "gentile":
				return 1 - Math.pow(1 - x, 5);

			case "inAndOut":
				return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;

			case "inAndOutExpo":
				return x === 0
					? 0
					: x === 1
					? 1
					: x < 0.5
					? Math.pow(2, 20 * x - 10) / 2
					: (2 - Math.pow(2, -20 * x + 10)) / 2;

			case "inAndOutElastic":
				const c5 = (2 * Math.PI) / 4.5;

				return x === 0
					? 0
					: x === 1
					? 1
					: x < 0.5
					? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
					: (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;

			case "out":
				return 1 - Math.pow(1 - x, 4);

			default:
				return x;
		}
	}

	getFrom() {
		//
		const objToArr = (obj) => {
			if (typeof obj === "object") {
				const myArr = Object.keys(obj)
					.map((n) => obj[n])
					.filter((e) => typeof e === "number");
				return myArr;
			} else {
				return obj;
			}
		};

		const from = this.from === "current" ? this.object[this.prop] : this.from;
		this.from = objToArr(from);
		this.to = objToArr(this.to);

		// const cam = this.model.camera;
		// const controls = this.model.controls;
		// const vectorPos = new THREE.Vector3();
		// const prevLook = new THREE.Vector3(0, 0, -1);
		// const nextPos = [vectorPos.x, vectorPos.y, vectorPos.z];

		// parentMesh.children[0].getWorldPosition(vectorPos);
		// prevLook.applyQuaternion(cam.quaternion);
		// cam.userData.newLookAt = nextPos;
		// labelCont.classList.add("labelActive");
		// // //
		// this.model.animSceneProp("camera", "position", "current", nextPos, 1000, "inAndOut");
	}
}

class ExploreModel {
	constructor(modelsData, hardware, camConfing) {
		this.modelsData = modelsData;
		this.hardware = hardware;

		// QUITAR -->
		if (!camConfing) {
			this.camConfig = { lookAt: [-0.02, 0, 0], position: [-0.02, 0.1, 0.01] };
		} else {
			this.camConfig = camConfing;
		}

		this.models = {};
		this.group = new THREE.Group();

		this.initScene();
		this.initLights();
		this.initModels();
		this.render();

		this.elem = c("div", { class: "modelCont" }, [
			this.renderer.domElement,
			this.lRenderer.domElement,
		]);
	}

	// Inits camera, scene, renderer, lRenderer, controls
	initScene() {
		const { lookAt, position } = this.camConfig;
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xfff4e2);
		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(
			39.7,
			window.innerWidth / window.innerHeight,
			0.01,
			1000
		);
		this.camera.updateProjectionMatrix();
		this.camera.position.set(...position);
		this.camera.lookAt(...lookAt);
		this.renderer = new THREE.WebGLRenderer({ alpha: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight, false);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.lRenderer = new CSS2DRenderer();
		this.CSSElem = this.lRenderer.domElement;
		this.CSSElem.style.overflow = "visible";
		this.CSSElem.style.overflowX = "visible";
		this.CSSElem.style.overflowY = "visible";
		this.lRenderer.setSize(window.innerWidth, window.innerHeight, false);
		this.controls = new OrbitControls(this.camera, exploreRoot);
		this.controls.target0 = new THREE.Vector3(...lookAt);
		this.controls.position0 = new THREE.Vector3(...position);
		this.controls.reset();
		this.controls.enabled = false;
		this.controls.enableZoom = false;

		// this.scene.add(new THREE.AxesHelper(5));
	}

	async initModels() {
		const getModel = (name) => {
			const url = `${this.modelsData[name].path}/model.${name}.glb`;
			const loader = new GLTFLoader();
			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath("./js/THREEm/");
			loader.setDRACOLoader(dracoLoader);

			return new Promise((resolve, reject) => {
				loader.load(
					url,
					(res) => {
						resolve(res.scene.children[0]);
					},
					() => {},
					(err) => {
						console.error(err);
						reject(error);
					}
				);
			});
		};

		const keys = Object.keys(this.modelsData);
		for (let name of keys) {
			const glb = await getModel(name);
			this.models[name] = glb;
			const { props } = this.modelsData[name];
			this.group.add(glb);
			// this.scene.add(glb);
			Object.keys(props).forEach((elem) => {
				this.setModelProp(name, elem, props[elem]);
			});
		}
		this.scene.add(this.group);
		this.scene.add(new THREE.AxesHelper(5));
	}

	initLights() {
		const lux = 0.15 * Math.PI;
		this.scene.add(new THREE.AmbientLight(0xffffff, 0.1));

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

		const dirLight3 = new THREE.DirectionalLight(0xffffff, lux);
		dirLight3.position.set(0, -0.2, -1);
		this.scene.add(dirLight3);
	}

	render() {
		if (this.resize()) {
			const canvas = this.renderer.domElement;
			this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
			this.camera.updateProjectionMatrix();
		}

		requestAnimationFrame(() => {
			this.renderer.render(this.scene, this.camera);
			this.lRenderer.render(this.scene, this.camera);
			this.controls.update();
			this.render();
		});
	}

	resize() {
		const canvas = this.renderer.domElement;
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		const needRes = w !== canvas.width || h !== canvas.height;
		if (needRes) {
			this.renderer.setSize(w, h, false);
			this.lRenderer.setSize(w, h, false);
		}
		return needRes;
	}

	setModelProp(elem = "all", propArr, value, callBack) {
		if (elem === "all") {
			const collection = { all: this.group };
			this.setProp(elem, propArr, value, collection, callBack);
		}

		this.setProp(elem, propArr, value, this.models);
	}

	// CAMBIAR
	setSceneProp(elem, propArr, value) {
		this.setProp(elem, propArr, value, this);
	}

	// CAMBIAR
	animSceneProp(elem, prop, from, to, duration, timingF = "linear") {
		const anim = new SceneAnimation(this, elem, prop, from, to, duration, timingF);
		anim.init();
	}

	// CAMBIAR
	setProp(elem, propArr, value, collection) {
		Object.keys(collection).forEach((e) => {
			if (e !== elem) {
				return;
			}

			let prop = collection[e];
			const newProps = propArr.split(".");
			const l = newProps.pop();

			newProps.forEach((e) => (prop = prop[e]));

			let val = [].concat(value);
			if (prop[l]?.set) {
				prop[l].set(...val);
			} else if (typeof prop[l] === "function") {
				prop[l](...val);
			} else {
				prop[l] = value;
			}
		});
	}

	initParallax() {
		window.onmousemove = (e) => {
			this.onParallaxMove(e);
		};
	}

	cancelParallax() {
		window.onmousemove = () => {};
	}

	onParallaxMove({ clientX, clientY }) {
		if (!this.mouseInitPos) {
			this.mouseInitPos = { x: clientX, y: clientY };
			this.prevRot = { x: this.group.rotation.x, y: this.group.rotation.y };
		}
		const { x, y } = this.mouseInitPos;

		const rotY = (clientX + y / 2) / window.innerWidth;
		const rotX = (clientY + x / 2) / window.innerWidth;

		this.group.rotation.x = this.prevRot.x + lerp(-0.3, 0.3, rotX);
		this.group.rotation.y = this.prevRot.y + lerp(-0.3, 0.3, rotY);
	}

	addLabels(k, text) {
		//
		setTimeout(() => {
			const space = this.group.getObjectByName(k);

			if (!space) {
				return;
			}

			const label = this.getLabels(text, 1);

			const threeLabel = new CSS2DObject(label);
			threeLabel.element.style.overflow = "visible";
			// threeLabel.position.copy(space.position);
			space.add(threeLabel);
		}, 1000);

		//
	}

	getLabels(text, i) {
		const dir = i % 2 === 0 ? "usesLabelRight" : "usesLabelLeft";
		const p = c("p", {}, []);
		const t = c("div", { class: "usesLabelText" }, [p]);

		const vectorRight = c("div", { class: "usesLabelVector usesLabelVectorRight" }, [
			cSvg("svg", { viewBox: "0 0 200 100" }, [
				cSvg("circle", { cx: "190", cy: "10", r: "5", stroke: "black", fill: "black" }, []),
				cSvg("path", { d: "M190 10 L100 50 L0 50", stroke: "black", fill: "none" }),
			]),
		]);

		const cont = c("div", { class: `usesLabel ${dir}` }, [t, vectorRight]);

		writeText(p, text);

		return cont;
	}
}

const exploreActivity = {
	async init(hardware) {
		this.hardware = hardware.replace(" ", "_");
		// this.data = await fetch(`./res/hardware/${this.hardware}/configtwo.${this.hardware}.JSON`)
		// 	.then((d) => d.json())
		// 	.catch((e) => console.error(e));
		// CAMBIAR

		this.data = await import(`/res/hardware/${this.hardware}/configtwo.${this.hardware}.js`).then(
			(module) => module.default
		);

		this.model = new ExploreModel(this.data.config_3D.models, this.hardware);

		setTimeout(() => {
			// this.model.pruebaLabels();
		}, 1000);

		this.animFunctions = await import(`/res/hardware/${this.hardware}/anim.${this.hardware}.js`);
		this.labels();
	},

	description() {
		const { title: t, description: d } = this.data.explore[0].data;
		const title = c("h1", { class: "exploreTitle" }, [t]);
		const descrip = c("p", {}, []);
		const text = c("div", { class: "descriptionTxt" }, [title, descrip]);
		const btn = c("button", { class: "exploreBtn descriptionBtn" }, ["Explore"], {
			click: () => {
				this.uses();
				this.model.cancelParallax();
			},
		});
		const description = c("div", { class: "description" }, [text, btn]);

		setTimeout(() => {
			this.getAnims(0);
			this.initAnim("start");
		}, 200);

		setTimeout(() => {
			writeText(descrip, d, 5);
		}, 1000);

		setTimeout(() => {
			this.model.initParallax();
		}, 5000);

		addScene(description, this.model.elem);
	},

	uses() {
		const { items } = this.data.explore[1].data;
		const title = c("h1", { class: "exploreTitle" }, []);
		const btn = c("button", { class: "exploreBtn usesBtn" }, ["NEXT"], {
			click: () => {
				this.labels();
			},
		});
		const uses = c("div", { class: "usesTitle" }, [title]);

		setTimeout(() => {
			const itemArr = [];

			items.forEach((item, i) => {
				const {
					models,
					labels: { tag, text },
					camConfig,
				} = item;

				const dir = i % 2 === 0 ? "userItemRight" : "userItemLeft ";
				const model = new ExploreModel(models, undefined, camConfig);
				const a = model.elem;
				const labelCont = c("div", { class: "usesLabelCont" }, [a]);
				const itemText = c("p", { class: "usesItemText" }, [item.text]);

				const itemCont = c("div", { class: `usesItemCont ${dir}` }, [labelCont, itemText]);
				model.initParallax();
				itemArr.push(itemCont);

				model.addLabels(tag, text);
				//
			});
			const allItemsCont = c("div", { class: "allItemsCont" }, itemArr);
			usesCont.appendChild(allItemsCont);
		}, 400);

		const usesCont = c("div", { class: "usesContainer" }, [uses, btn]);

		addScene(usesCont, c("div"));

		setTimeout(() => {
			writeText(title, "USES");
		}, 300);

		// this.model;
		// writeText(title, "USES", 25);
	},

	labels() {
		this.getAnims(2);
		this.initAnim("start");

		const onNextSection = () => {
			const b = document.body;
			const m = this.model;

			b.removeEventListener("mousedown", mouseDown);
			b.removeEventListener("mouseup", mouseUp);
			b.style.cursor = "default";
			this.initAnim("end");

			m.animSceneProp("camera", "zoom", "current", 1.1, 2000, "inAndOut");
			m.animSceneProp("camera", "position", "current", [-0.02, 0.1, 0.01], 2000, "gentile");
			m.animSceneProp("controls", "target", m.controls.target, m.controls.target0, 2000, "gentile");
			m.controls.enabled = false;

			this.labelList.forEach((e) => e.classList.add("inactiveExploreLabel"));
			this.animation();
		};

		document.body.style.cursor = "grab";
		const mouseDown = () => (document.body.style.cursor = "grabbing");
		const mouseUp = () => (document.body.style.cursor = "grab");
		document.body.addEventListener("mousedown", mouseDown);
		document.body.addEventListener("mouseup", mouseUp);

		const nextSectionBtn = c("button", { class: "exploreBtn labelsBtn" }, ["NEXT"], {
			mousedown: onNextSection,
		});

		setTimeout(() => {
			this.model.setSceneProp("controls", "enabled", true);
			this.addLabels(2);
		}, 2000);

		for (let i = 0; i < 2; i++) {
			[
				[-0.52, 0.14, -0.085],
				[-0.48, 0.14, -0.085],
				[-0.44, 0.14, -0.085],
			].forEach((arr, i) => {
				const sprite = new THREE.Sprite(
					new THREE.SpriteMaterial({
						map: new THREE.TextureLoader().load(`./res/hardware/${this.hardware}/spark.png`),
						useScreenCoordinates: false,
						color: 0xff0000,
						blending: THREE.CustomBlending,
						blendEquation: THREE.AddEquation,
						blendSrc: THREE.OneMinusDstAlphaFactor,
						blendDst: THREE.OneMinusSrcAlphaFactor,
					})
				);

				// sprite.id = 0;
				sprite.scale.set(0.07, 0.07, 0.1 / 32); // imageWidth, imageHeight
				sprite.position.fromArray(arr); //set(-0.48,0.18,-0.14);
				const colorArr = [0, 0, 0];
				colorArr[i] = 1;
				sprite.material.color.setRGB(colorArr[0], colorArr[1], colorArr[2]);
				this.model.scene.children[2].add(sprite);
			});
		}

		addScene(nextSectionBtn, this.model.elem);
	},

	animation() {
		this.model.setSceneProp("controls", "enabled", false);
		const { createAnim } = this.animFunctions;
		const myFunc = () => {};
		const a = createAnim(myFunc);
		const title = c("h1", { class: "exploreTitle" });
		const nexBtn = c("button", { class: "exploreBtn labelsBtn" }, ["Next"], {
			click: () => {
				this.coding();
			},
		});
		addScene(a, undefined, 2000);
	},

	coding() {},

	completion() {},

	// CAMBIAR-->
	getAnims(index) {
		this.anims = {};

		const { anims } = this.data.explore[index];
		const arr = Object.keys(anims);
		for (let name of arr) {
			const elem = anims[name].map((animArr) => this.getAnimStep(animArr));
			this.anims[name] = elem;
		}
	},

	getAnimStep(arr) {
		const myArr = [];

		Object.keys(arr).forEach((child) => {
			if (child === "static") {
				return;
			}
			myArr.push(this.getAnimItem(arr[child], child));
		});

		return myArr;
	},

	getAnimItem(element, child) {
		const { config, props } = element;
		const animArr = [];
		const mode = config?.mode;
		const duration = config?.duration;

		Object.keys(props).map((prop) => {
			const propVals = props[prop];
			const to = propVals.to;
			const from = propVals?.from;

			animArr.push(new ModelAnimation(this.model, child, prop, from, to, duration, mode));
		});

		return animArr;
	},

	initAnim(tag) {
		const anim = this.anims[tag];
		let t = 100;

		anim.forEach((step) => {
			setTimeout(() => {
				step.forEach((item) => {
					item.forEach((e) => {
						e.init();
					});
				});
			}, t);
			t += step[0][0].duration;
		});
	},

	addLabels() {
		const { labels } = this.data.explore[2].data;
		const model = this.model.models[this.hardware];

		this.labelList = labels.map((elem, i) => {
			const { label: l, content: c, position: p } = elem;
			const parentMesh = model.getObjectByName(l);
			const label = this.getLabel(c, i, p[0], parentMesh, p);

			const threeLabel = new CSS2DObject(label);
			threeLabel.position.set(p[0], p[1], p[2]);

			threeLabel.element.style.overflow = "visible";
			parentMesh.add(threeLabel);
			return label;
		});
	},

	getLabel(content, i, labelX, parentMesh) {
		const dir =
			labelX === 0
				? i % 2 === 0
					? "labelLeft"
					: "labelRight"
				: labelX < 0
				? "labelLeft"
				: "labelRight";

		const onClickFunc = () => {
			const cam = this.model.camera;
			const nextLook = new THREE.Vector3();
			const prevLook = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion);

			const dirVector = new THREE.Vector3();

			parentMesh.children[0].getWorldPosition(nextLook);

			labelCont.classList.add("labelActive");
			cam.userData.prevLook = prevLook;
			cam.getWorldDirection(dirVector);

			this.model.animSceneProp("camera", "lookAt", prevLook, nextLook, 1000, "gentile");
			this.model.animSceneProp("controls", "target", "current", nextLook, 1000, "gentile");
			this.model.anim;
			this.model.animSceneProp("camera", "zoom", 1, 3, 1000, "inAndOut");
		};

		const onCloseBtn = () => {
			const cam = this.model.camera;
			const controls = this.model.controls;
			const nextLook = new THREE.Vector3(0, 0, -1);
			nextLook.applyQuaternion(cam.quaternion);
			labelCont.classList.remove("labelActive");
			this.model.animSceneProp("controls", "target", nextLook, controls.target0, 1000, "gentile");
			this.model.animSceneProp("camera", "zoom", 3, 1, 1000, "inAndOut");
		};

		const number = c("div", { class: "glow" }, [c("h1", {}, [i.toString()])], {
			pointerdown: onClickFunc,
		});

		const path = cSvg("path", { d: "M190 10 L100 50 L0 50", stroke: "gold", fill: "none" });
		const vectorRight = c("div", { class: "labelVector labelVectorRight" }, [
			cSvg("svg", { viewBox: "0 0 200 100" }, [
				cSvg("circle", { cx: "190", cy: "10", r: "5", stroke: "gold", fill: "gold" }, []),
				path,
			]),
		]);
		const closeBtn = c("div", { class: "labelCloseBtn" }, [c("h2", {}, ["X"])], {
			mousedown: onCloseBtn,
		});
		const slideTxt = c("p", {}, [content]);
		const slideCont = c("div", { class: "slideCont" }, [closeBtn, slideTxt]);
		const labelTextCont = c("div", { class: `labelTagCont ${dir} labelInactive` }, [
			c("div", {}, [slideCont, vectorRight]),
		]);

		const labelCont = c("div", { class: "labelCont" }, [number, labelTextCont]);

		this.model.controls.addEventListener("change", () => {
			const cam = this.model.camera;
			const rot = Math.abs(cam.quaternion.x / (Math.PI / 4));

			const tFunc = (x) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2);
			const pathAng = lerp(90, 10, tFunc(rot));
			const slideTrans = lerp(100, 0, tFunc(rot));

			path.setAttribute("d", `M190 10 L100 ${pathAng} L0 ${pathAng}`);
			slideCont.style.transform = `translateY(calc(-50% + ${slideTrans}px)) rotateX(180deg)`;
		});

		return labelCont;
	},
};

export default (hardware) => {
	exploreActivity.init(hardware);
};

//
//
// "anims": {
// 	"start": [
// 		{
// 			"all": {
// 				"props": {
// 					"rotation": { "from": [-1, -1, 0], "to": [-1, -1, 0] }
// 				},
// 				"config": {
// 					"duration": 1000
// 				}
// 			}
// 		},
// 		{
// 			"all": {
// 				"props": {
// 					"scale": { "to": [1.3, 1.3, 1.3] },
// 					"position": { "to": [-0.02, 0, 0] },
// 					"rotation": { "to": [0, 0, 0] }
// 				},

// 				"config": {
// 					"mode": "gentile",
// 					"duration": 3000
// 				}
// 			},
// 			"top4x4": {
// 				"props": {
// 					"rotation": { "to": [-1.4, 0, 0] },
// 					"position": { "to": [0, 0.02, -0.02] }
// 				},
// 				"config": {
// 					"duration": 3000,
// 					"mode": "gentile"
// 				}
// 			},
// 			"base4x4": {
// 				"props": {
// 					"position": { "to": [0, -0.02, 0] }
// 				},
// 				"config": {}
// 			}
// 		}
// 	],
// 	"end": []
// },
