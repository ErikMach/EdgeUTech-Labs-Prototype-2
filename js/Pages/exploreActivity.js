import * as THREE from "../THREEm/three.module.js";
import { GLTFLoader } from "../THREEm/GLTFLoader.js";
import { DRACOLoader } from "../THREEm/DRACOLoader.js";
import { CSS2DRenderer } from "../THREEm/CSS2DRenderer.js";

const shadow = document.getElementById("exploreActivityPage").attachShadow({ mode: "open" });
const link = document.createElement("link");
const sceneRoot = c("div", { class: "sceneRoot" });
const parent = c("div", { class: "exploreRoot" }, [sceneRoot]);

link.setAttribute("rel", "stylesheet");
link.setAttribute("href", "./css/explore-activity-style.css");
shadow.appendChild(link);
shadow.appendChild(parent);

const addScene = (body, background = "#f0f0f0", delay = 700) => {
	const cont = document.getElementById("exploreActivityPage");

	cont.classList.add("questTransitionFadeOut");
	cont.style.transition = "background-color 300ms linear";
	cont.style.backgroundColor = background;

	setTimeout(() => {
		parent.innerHTML = "";
		cont.style.transition = "";

		const codingSpace = c("div", { class: "codingSpace" }, [
			c("div", { class: "blockSpace" }, [body]),
		]);

		cont.classList.remove("exploreTransitionFadeOut");
		cont.classList.add("exploreTransitionFadeIn");

		parent.appendChild(codingSpace);
	}, delay);
};

// ANIMATION GENERATOR

class ModelAnimation {
	constructor(model, child = "all", prop, from = "current", to, duration = 1000, mode = "linear") {
		this.model = model;
		this.child = child;
		this.prop = prop;
		this.to = to;
		this.duration = duration;
		this.mode = mode;
		this.from = from;
		//
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

			this.model.setModelProp(this.child, this.prop, newVal);

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

		if (this.from === "current") {
			const obj =
				this.child === "all" ? this.model.group[this.prop] : this.model.models[this.child][this.prop];

			this.from = objToArr(obj);
		}
	}

	// parallaxEffect() {
	// 	window.onmousemove = (ev) => {
	// 		this.onMouseMove(ev);
	// 	};
	// }

	// onMouseMove({ clientX, clientY }) {
	// 	const rotX = lerp(-1, 1, clientX / window.innerWidth);
	// 	const rotY = lerp(-1, 1, clientY / window.innerHeight);

	// 	Object.keys(this.models).forEach((e) => {
	// 		const g = this.models[e].elem;
	// 		g.rotation.set(rotY, rotX, 0);
	// 	});
	// }
}

// class ParallaxAnimation {
// 	constructor(hey) {}
// 	chess() {}
// }

class ExploreModel {
	constructor(modelsData) {
		this.modelsData = modelsData;
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

	initScene() {
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
		this.camera.position.set(-0.02, 0.1, 0.01);
		this.camera.lookAt(-0.02, 0, 0);

		this.renderer = new THREE.WebGLRenderer({ alpha: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight, false);
		this.renderer.setPixelRatio(window.devicePixelRatio);

		this.lRenderer = new CSS2DRenderer();
		this.lRenderer.domElement.style.overflow = "visible";
		this.lRenderer.domElement.style.overflowX = "visible";
		this.lRenderer.domElement.style.overflowY = "visible";
		this.lRenderer.setSize(window.innerWidth, window.innerHeight, false);

		// QUITAR
		this.scene.add(new THREE.AxesHelper(5));
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

	// RENDER LOOP
	render() {
		if (this.resize()) {
			const canvas = this.renderer.domElement;
			this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
			this.camera.updateProjectionMatrix();
		}

		requestAnimationFrame(() => {
			this.renderer.render(this.scene, this.camera);
			this.lRenderer.render(this.scene, this.camera);
			this.render();
		});
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

	setModelProp(elem = "all", propArr, value) {
		if (elem === "all") {
			const collection = { all: this.group };
			this.setProp(elem, propArr, value, collection);
		}

		this.setProp(elem, propArr, value, this.models);
	}

	setSceneProp(elem, propArr, value) {
		this.setProps(elem, propArr, value, this);
	}

	setProp(elem, propArr, value, collection) {
		Object.keys(collection).forEach((e) => {
			if (e !== elem) {
				return;
			}
			// if(elem)

			let prop = collection[e];
			const newProps = propArr.split(".");
			const l = newProps.pop();

			newProps.forEach((e) => (prop = prop[e]));

			if (prop[l].set) {
				let val = [].concat(value);
				prop[l].set(...val);
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
		console.log("PARALLAX CANCELLED");
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

		// console.log(this.mouseInitPos);
	}
}

const exploreActivity = {
	async init(hardware) {
		this.hardware = hardware.replace(" ", "_");

		this.data = await fetch(`./res/hardware/${this.hardware}/configtwo.${this.hardware}.JSON`)
			.then((d) => d.json())
			.catch((e) => console.error(e));

		this.description();
	},

	description() {
		const { title: t, description: d } = this.data.config_3D;
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
		this.model = new ExploreModel(this.data.config_3D.models);

		parent.appendChild(this.model.elem);
		parent.appendChild(this.model.elem);
		addScene(description);

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
	},

	uses() {
		this.initAnim("end");
		const title = c("div", { class: "usesTitle" }, [c("h1", { class: "exploreTitle" }, ["USES"])]);

		addScene(title);
		// this.model;
		// writeText(title, "USES", 25);
	},

	labels() {},

	animation() {},

	coding() {},

	completion() {},

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
			myArr.push(this.getAnimItem(arr[child], child));
		});

		return myArr;
	},

	getAnimItem({ config, props }, child) {
		//

		const animArr = [];
		const mode = config?.mode;
		const duration = config?.duration;

		Object.keys(props).map((prop) => {
			const propVals = props[prop];
			const to = propVals.to;
			const from = propVals?.from ? propVals.from : "current";

			animArr.push(new ModelAnimation(this.model, child, prop, from, to, duration, mode));
		});

		return animArr;
	},

	initAnim(tag) {
		const anim = this.anims[tag];
		console.log("ANIM", anim);
		let t = 100;

		anim.forEach((step, i) => {
			setTimeout(() => {
				step.forEach((item) => {
					item.forEach((e) => {
						e.init();
					});
				});
			}, t);
			console.log("STEP: ", step);
			t += step[0][0].duration;
		});
	},
};

export default (hardware) => {
	exploreActivity.init(hardware);
};
