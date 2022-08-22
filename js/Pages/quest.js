/*
const configureQuestPage = () => {
  const titleBar = c("div", {"class":"titleBar"},["Quests"]);
  const codingSpace = c("div", {class:"codingSpace"}, [
    c("div", {class:"blockSpace"}, [
      c("div", {class:"blockMenuCont"}, []),
      c("div", {class:"blockCont"}, []),
      c("div", {class:"blockStage"}, []),
    ]),
    c("div", {class:""}, []),
    c("div", {class:""}, [])
  ]);
  document.getElementById("questPage").appendChild(titleBar);
  document.getElementById("questPage").appendChild(codingSpace);
};
configureQuestPage();
*/

import { GLTFLoader } from "../THREEm/GLTFLoader.js";
import * as THREE from "../THREEm/three.module.js";
import { createBlock } from "../blockCreation.js";
import graphAlgorithm from "../components/quest-algorithm.js";
import { CSS2DObject, CSS2DRenderer } from "../THREEm/CSS2DRenderer.js";

// CONSTANTS

const shadow = document.getElementById("questPage").attachShadow({ mode: "open" });
const link = document.createElement("link");
link.setAttribute("rel", "stylesheet");
link.setAttribute("href", "./css/quest-style.css");
const parent = c("div", { class: "questRoot" });
shadow.appendChild(link);
shadow.appendChild(parent);

const questItems = [
	{ folder: "Desk_Lamp", title: "Lamp", blocked: false, background: "wheat" },
	{ folder: "Clicker_Counter", title: "Counter", blocked: false, background: "wheat" },
	{ folder: "Car", title: "Car", blocked: false, background: "wheat" },
	{ folder: "Christmas_Lights", title: "Christmas Lights", blocked: false, background: "wheat" },
	{ folder: "Doorbell", title: "Doorbell", blocked: false, background: "wheat" },
	{ folder: "Fan", title: "Fan", blocked: false, background: "wheat" },
	{ folder: "Garage_Door", title: "Garage Door", blocked: false, background: "wheat" },
	{ folder: "Street_Light", title: "Street Light", blocked: false, background: "wheat" },
	{ folder: "Washing_Machine", title: "Washing Machine", blocked: false, background: "wheat" },
	{ folder: "Fan", title: "Fan", blocked: true },
	{ folder: "Fan", title: "Fan", blocked: true },
	{ folder: "Fan", title: "Fan", blocked: true },
];

const codingBlocks = {
	Control: {
		color: "#ffab19",
		blocks: ["if", "if-else"],
	},
	Operators: {
		color: "#40bf4a",
		blocks: [],
	},
	EUBlocks: {
		color: "#4c97ff",
		blocks: ["DC-Motor", "LED-Display"],
	},
	Variables: {
		color: "#ff8c1a",
		blocks: [],
	},
	"My Blocks": {
		color: "#ff6680",
		blocks: [],
	},
};

const addScene = (title, body, background, delay = 900) => {
	const cont = document.getElementById("questPage");
	cont.classList.add("questTransitionFadeOut");
	cont.style.transition = "background-color 300ms linear";
	cont.style.backgroundColor = background;

	setTimeout(() => {
		parent.innerHTML = "";
		cont.style.transition = "";

		const titleBar = c("div", { class: "titleBar" }, [c("h1", {}, [title])]);
		const codingSpace = c("div", { class: "codingSpace" }, [
			c("div", { class: "blockSpace" }, [body]),
		]);
		cont.classList.remove("questTransitionFadeOut");
		cont.classList.add("questTransitionFadeIn");

		parent.appendChild(titleBar);
		parent.appendChild(codingSpace);
	}, delay);
};

const menuHandler = (e, i) => {
	const elem = e.currentTarget;
	elem.classList.add("questElemAnimation");

	setTimeout(() => {
		questItem.init(i);
		parent.classList.add("preventOverflow");
	}, 300);
};

const questMenu = () => {
	const items = [];
	parent.classList.remove("preventOverflow");

	questItems.forEach(({ blocked, title, folder }, i) => {
		const src = blocked ? "./res/img/lock.svg" : `./res/quests/${folder}/${folder}.webp`;
		const t = c("h2", {}, [blocked ? "Blocked" : title]);
		const img = c("img", { src: src });

		items.push(
			c("div", { class: `questElement ${blocked && "blocked"}` }, [img, t], {
				click: blocked
					? undefined
					: (e) => {
							menuHandler(e, i);
					  },
			})
		);
	});
	return c("div", { class: "blockMenu" }, items);
};

const questModel = {
	init(url, folder, labels, scale = 1, position = [0, 0, 0], rotation = 0, light = 1) {
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
		this.iterations = 1;
		this.setThreeScene();
		this.addLights();
		this.loadModel();
		this.canvasCont = c("div", { class: "questModelCont" }, [
			this.renderer.domElement,
			this.lRenderer.domElement,
		]);

		this.animate();
		return this.canvasCont;
	},

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
	},

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
	},

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
	},

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
	},

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
	},

	turn() {
		this.time = Date.now();
		this.prevRot = this.model.rotation.y;
		this.animateTurn();
	},

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
	},

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
	},

	bezierFunc(t, f) {
		return t * t * (3.0 * f - 2.0 * f * t);
	},

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
	},

	getLabels(text, i) {
		const dir = i % 2 === 0 ? "labelLeft" : "labelRight";
		const p = c("p", {}, []);
		const t = c("div", { class: "labelText" }, [p]);

		const vectorRight = c("div", { class: "labelVector labelVectorRight" }, [
			cSvg("svg", { viewBox: "0 0 200 100" }, [
				cSvg("circle", { cx: "190", cy: "10", r: "5", stroke: "black", fill: "black" }, []),
				cSvg("path", { d: "M190 10 L100 50 L0 50", stroke: "black", fill: "none" }),
			]),
		]);

		const cont = c("div", { class: `questLabel ${dir}` }, [t, vectorRight]);

		setTimeout(() => {
			writeText(p, text);
		}, 200 * i);

		return cont;
	},
};

const questAlgorithmSection = {
	init(data, url, folder, model) {
		// Parameters are = data (info, url, folder, model)
		this.data = data;
		this.url = url;
		this.folder = folder;
		this.model = model;
		this.h3 = c("h1", { class: "algorithmTitle" }, [" "]);
		this.grid = c("div", { class: "algorithmGrid" });
		this.gridCont = c("div", { class: "algorithmGridCont" }, [this.grid]);
		this.cont = c("div", { class: "algorithmCoding" }, [this.h3, this.gridCont]);
		this.algorithm = graphAlgorithm.init(
			this.data,
			() => {
				this.codeSection();
			},
			this.grid,
			this.cont
		);

		this.elem = c("div", { class: "questAlgorithm" }, [this.cont, this.algorithm]);
		writeText(this.h3, `Put the algorithm in order: `);
		return this.elem;
	},

	codeSection() {
		const { scale, position, rotation, light, labels } = this.model;

		deleteText(this.h3);

		const btn = c("button", { class: "questButton" }, ["RUN!"], {
			click: () => {
				questItem.congratulations();
			},
		});

		const btnCont = c("div", { class: "questCodeButtonCont" }, [btn]);

		// const modelCont = c("div", { class: "codingModelCont" }, [
		// 	questModel.init(this.url, this.folder, labels, scale, position, rotation, light),
		// ]);

		const cont = c("div", { class: "questCodeCont" }, [
			c("div", { class: "questCode" }, [questCoding()]),
			btnCont,
		]);
		this.gridCont.remove();
		this.cont.appendChild(cont);
		this.cont.appendChild(btnCont);

		setTimeout(() => {
			writeText(this.h3, "Code the solution: ");
		}, 100);
		questModel.parallaxEffect();
	},
};

const questCoding = () => {
	const code = c("div", { class: "codingSpace" }, [
		c("div", { class: "blocCodingSpace" }, [
			c(
				"div",
				{ class: "blockMenuCont" },
				Object.keys(codingBlocks).map((t) =>
					c("div", { class: "blockMenuItem", id: `${t}Menu` }, [
						c("div", {
							class: "blockMenuItemCircle",
							style: `background-color:${codingBlocks[t].color}`,
						}),
						c("a", { textContent: t }),
					])
				)
			),
			c(
				"div",
				{ class: "blockCont" },
				Object.keys(codingBlocks).map((t) => {
					return c("div", { class: "blockSet" }, [
						c("h5", { textContent: t }),
						...codingBlocks[t].blocks.map((b) => createBlock(b)),
					]);
				})
			),
			c("div", { class: "blockStage" }, []),
		]),
		//    c("div", {class:"hardwareMenu"}, [techTree.map(line)]),
		c("div", { class: "hardwareStage" }, []),
	]);
	return code;
};

const questItem = {
	async init(i) {
		this.title = questItems[i].title;
		this.folder = questItems[i].folder;
		this.background = questItems[i].background;
		this.url = `./res/quests/${this.folder}`;
		const res = await fetch(`${this.url}/config.${this.folder}.JSON`);
		this.data = await res.json();
		this.problem();
	},

	problem() {
		this.p = c("p", {}, []);
		this.p1 = c("p", {}, []);
		this.btn = c("button", {}, ["Go!"], {
			click: () => {
				this.howItWorks();
			},
		});
		this.h2 = c("h2", {}, ["Problem:"]);
		const { scale, position, rotation, light, labels } = this.data.model;
		const txt = c("div", { class: "questText" }, [this.h2, this.p, this.p1, this.btn]);

		this.model = questModel.init(this.url, this.folder, labels, scale, position, rotation, light);
		questModel.parallaxEffect();
		writeText(this.p, this.data.problem.story);

		setTimeout(() => {
			writeText(this.p1, this.data.problem.imperative);
		}, this.data.problem.story?.length * 25 + 200 || 0);

		addScene(this.title, c("div", { class: "questProblemCont" }, [txt, this.model]), this.background);
		// QUITAR
	},

	howItWorks() {
		deleteText(this.p, 10);
		deleteText(this.p1, 10);
		setTimeout(() => {
			deleteText(this.h2);
			writeText(this.h2, "How it Works: ");
		}, 700);

		this.btn.style.transition = "transform 200ms linear";
		this.btn.style.transform = "scaleX(0)";

		const btn = c("button", { class: "questButton howItWorksBtn" }, [`Next`], {
			click: () => {
				this.objetive();
			},
		});

		setTimeout(() => {
			questModel.parallaxEffect();
			questModel.turn();

			setTimeout(() => {
				questModel.addLabels();
			}, 1000);
		}, 1000);

		setTimeout(() => {
			parent.appendChild(btn);
		}, 3000);
	},

	objetive() {
		const btn = c("button", { class: "questObjetiveBtn" }, ["Continue!"], {
			click: () => {
				this.algorithm();
			},
		});

		const h3 = c("h3", {}, []);
		const txt = c("div", { class: "questText" }, [h3, btn]);

		const elemArr = this.data.objectives.map((e) => {
			const { objective, correct, reason } = e;
			const p = c("p", {}, [objective]);

			const elem = c("div", { class: "questObjetive" }, [p], {
				click: (e) => {
					if (e.currentTarget.dataset.clicked) {
						return;
					}
					if (!correct) {
						e.currentTarget.classList.add("questObjectiveIncorrect");
					} else {
						e.currentTarget.classList.add("questObjectiveCorrect");
						btn.style.transform = "scaleX(1)";
					}
					deleteText(p);
					writeText(p, reason);
					e.currentTarget.dataset.clicked = "clicked";
				},
			});
			return elem;
		});

		writeText(
			h3,
			`Choose an appropiate objective to ${this.data.problem.imperative
				.slice(0, 1)
				.toLowerCase()}${this.data.problem.imperative.slice(1, -1)}:`
		);

		addScene(
			this.title,
			c("div", { class: "questObjetives" }, [txt, c("div", { class: "questObjetivesCont" }, elemArr)]),
			this.background,
			100
		);
	},

	algorithm() {
		const { algorithm, model } = this.data;

		addScene(
			this.title,
			questAlgorithmSection.init(algorithm, this.url, this.folder, model),
			this.background,
			100
		);
	},

	congratulations() {
		const { scale, position, rotation, light, labels } = this.data.model;

		const model = questModel.init(this.url, this.folder, labels, scale, position, rotation, light);
		const h1 = c("h1", {}, [`${this.title} Quest Complete!!`]);
		const button = c("button", {}, ["Return to Quests"], {
			click: () => {
				addScene("Quest", questMenu(), "#FFF4E2", undefined, false);
			},
		});
		const arrows = document.querySelectorAll(".repeatArrow");
		arrows.forEach((e) => {
			e.remove();
		});
		const btnCont = c("div", { class: "questCongratulationsBtnCont" }, [h1, button]);
		const cont = c("div", { class: "questCongratulationsContainer" }, [btnCont, model]);
		addScene("Congratulations!!", cont, this.background);
	},
};

addScene("Quest", questMenu(), "white");
// change("quest");
// questItem.init(1);
/* 	THIS IS NOT THE ORIGINAL VERSION. See Ln121 	*/
