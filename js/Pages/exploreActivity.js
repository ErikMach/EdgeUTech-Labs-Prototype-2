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

const addScene = (body, background = "#f0f0f0", delay = 200) => {
	sceneRoot.classList.add("exploreTransitionFadeOut");
	const cont = document.getElementById("exploreActivityPage");
	cont.style.transition = "background-color 300ms linear";
	cont.style.backgroundColor = background;

	setTimeout(() => {
		sceneRoot.innerHTML = "";
		cont.style.transition = "";
		sceneRoot.classList.add("exploreTransitionFadeIn");
		sceneRoot.appendChild(body);
	}, delay);
};

// ANIMATION GENERATOR

class ModelAnimation {
	constructor(model, obj = "all", prop, from = "current", to, duration = 1000, mode = "linear") {
		this.model = model;
		this.prop = prop;
		this.obj = obj;
		this.from = from;
		this.to = to;
		this.duration = duration;
		this.mode = mode;
	}

	init() {
		this.t = Date.now();
		// const from = this.from ? this.model.models[this.obj][this.prop] : this.from;
		this.from = this.from = "current" ? [0, 0, 0] : this.from;
		// if (typeof from === "object") {
		// 	this.from = Object.keys(from).map((e, i) => {
		// 		console.log(e);
		// 	});
		// }
		this.animationLoop();
	}

	animationLoop() {
		const t = (Date.now() - this.t) / this.duration;
		if (t <= 1) {
			if (Array.isArray(this.from)) {
				const newVal = [];
				this.from.forEach((e, i) => {
					console.log("TIMING F: ", this);
					newVal.push(lerp(e, this.to[i], this.timingFuction(t)));
				});
				// const newVal = this.from.map((e, i) => {
				// 	console.log(e);
				// 	console.log(e);

				// 	return;
				// });
				// const newVal = this.from.map((e, i) => lerp(e, this.to[i], this.timingFunction(t)));
				this.model.setModelProp(this.obj, this.prop, newVal);
			} else {
				const newVal = lerp(this.from, this.to, this.timingFunction(t));
				this.model.setModelProp(this.obj, this.prop, newVal);
			}

			this.animFrame = requestAnimationFrame(() => {
				this.animationLoop();
			});
		} else {
			cancelAnimationFrame(this.animFrame);
		}
	}

	linear(x) {
		return x;
	}

	elastic(x) {
		const c4 = (2 * Math.PI) / 3;
		return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
	}

	gentile(x) {
		return 1 - Math.pow(1 - x, 5);
	}

	inAndOut(x) {
		return -(Math.cos(Math.PI * x) - 1) / 2;
	}

	timingFuction(t) {
		switch (this.mode) {
			case "linear":
				return this.linear(t);

			case "elastic":
				return this.elastic(t);

			case "gentile":
				return this.gentile(t);

			case "inAndOut":
				return this.inAndOut(t);

			default:
				return this.linear(t);
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
		this.initScene();
		this.initLights();
		this.initModels();
		// setTimeout(() => {
		// 	Object.keys(this.models).forEach((e) => {
		// 		const model = this.models[e];
		// 		const anim = new ModelAnimation(model, "rotation.x", 0, 1, 2000, "gentile");
		// 		anim.init();
		// 	});

		// 	// this.setModelProps("top4x4", "position.x", 0.0001);
		// }, 100);
		// this.setSceneProps();
		// this.camera.rotation.x = 0;
		// -1.4

		// this.setCamera(camera);
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

	initModels() {
		Object.keys(this.modelsData).forEach((name) => {
			const url = `${this.modelsData[name].path}/model.${name}.glb`;
			const loader = new GLTFLoader();
			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath("./js/THREEm/");
			loader.setDRACOLoader(dracoLoader);

			loader.load(
				url,
				(res) => {
					const glb = res.scene.children[0];
					this.models[name] = glb;
					this.scene.add(glb);
				},
				() => {},
				(err) => console.error(err)
			);

			// const { props } = this.modelsData;
			const { props } = this.modelsData[name];

			Object.keys(props).forEach((elem) => {
				setTimeout(() => {
					this.setModelProp(name, elem, props[elem]);
				}, 100);
			});
		});
		this.scene.add(new THREE.AxesHelper(5));
	}

	initLights() {
		const lux = 0.15 * Math.PI;
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
			Object.keys(this.models).forEach((e) => {
				this.setProp(e, propArr, value, this.models);
			});
			return;
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
}

const exploreActivity = {
	async init(hardware) {
		this.hardware = hardware.replace(" ", "_");
		this.data = await fetch(`./res/hardware/${this.hardware}/configtwo.${this.hardware}.JSON`)
			.then((d) => d.json())
			.catch((e) => console.error(e));
		this.model = new ExploreModel(this.data.config_3D.models);
		this.description();
	},

	description() {
		const { title: t, description: d } = this.data.config_3D;
		const title = c("h1", {}, []);
		const descrip = c("p", {}, []);
		const text = c("div", { class: "descriptionTxt" }, [title, descrip]);

		const btn = c("button", { class: "exploreBtn descriptionBtn" }, ["Explore"], {
			click: () => {
				this.uses();
			},
		});

		const description = c("div", { class: "description" }, [text, btn]);
		addScene(description);
		parent.appendChild(this.model.elem);
		parent.appendChild(this.model.elem);

		setTimeout(() => {
			this.getStaticAnim(0);
			this.initStaticAnim();
		}, 100);

		writeText(title, t, 40);
		setTimeout(() => {
			writeText(descrip, d, 10);
		}, 1000);
	},

	uses() {},

	labels() {},

	animation() {},

	coding() {},

	completion() {},

	initStaticAnim() {
		const anim = this.staticAnim;
		let t = 0;

		anim.forEach((e) => {
			setTimeout(() => {
				e.forEach((item) => {
					item.init();
				});
			}, t);
			t += e[0].duration;
		});
	},

	getStaticAnim(index) {
		this.staticAnim = [];
		const { static_anim: anims } = this.data.explore[index];

		Object.keys(anims).forEach((e) => {
			this.getStaticAnimItem(anims[e]);
		});
	},

	getStaticAnimItem({ props, config }) {
		const animArr = [];
		const { mode, duration, from } = config;
		// console.log("MODE: ", mode);
		console.log("PROPS: ", props);
		let obj;
		let prop;
		let to;

		Object.keys(props).forEach((item) => {
			const p = props[item];
			obj = item;

			Object.keys(p).forEach((e) => {
				prop = e;
				to = p[e];

				const anim = new ModelAnimation(this.model, obj, prop, from, to, duration, mode);
				animArr.push(anim);
			});
		});
		this.staticAnim.push(animArr);
	},
};

export default (hardware) => {
	exploreActivity.init(hardware);
};
