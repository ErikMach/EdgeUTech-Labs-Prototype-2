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
	parent.classList.add("questTransitionFadeOut");
	const cont = document.getElementById("questPage");
	setTimeout(() => {
		parent.innerHTML = "";
		console.log(parent);
		cont.style.backgroundColor = background;
		const titleBar = c("div", { class: "titleBar" }, [c("h1", {}, [title])]);
		const codingSpace = c("div", { class: "codingSpace" }, [
			c("div", { class: "blockSpace" }, [body]),
		]);
		parent.classList.add("questTransitionFadeIn");

		parent.appendChild(titleBar);
		parent.appendChild(codingSpace);
	}, delay);
};

const writeText = (elem, text, dur = 25) => {
	if (!text) {
		return;
	}
	const letterArr = Array.from(text);
	setTimeout(() => {
		const interval = setInterval(() => {
			if (letterArr.length > 0) {
				elem.innerHTML += letterArr.shift();
			} else {
				clearInterval(interval);
			}
		}, dur);
	}, 900);

	// const int = setInterval(() => {}, 20);
};

const deleteText = (elem) => {
	const letterArr = Array.from(elem.innerText);
	const interval = setInterval(() => {
		if (letterArr.length > 0) {
			elem.innerHTML = letterArr.join("");
			letterArr.pop();
		} else {
			elem.innerText = "";
			clearInterval(interval);
		}
	}, 10);
};

const easeMov = (x) => {
	return 1 - Math.pow(1 - x, 3);
};

const lerp = (x, y, a) => {
	return (1 - a) * x + a * y;
};

class questAlgorithmBlock {
	constructor(step, reason, trackBlock, stateHandler) {
		this.step = step;
		this.reason = reason;
		this.h3 = c("h3", {}, [step]);
		this.elem = c("div", { class: "questAlgorithmBlock" }, [this.h3], {
			mousedown: (e) => {
				this.mouseDown(e);
			},
		});
		this.trackBlock = trackBlock;
		this.stateHandler = (elem) => {
			stateHandler(elem);
		};
		this.setInitPos();
		this.isNewPos = false;

		return this.elem;
	}

	mouseDown(e) {
		this.dragging;
		const { x, y } = this.elem.getBoundingClientRect();
		this.initX = x;
		this.initY = y;
		this.xo = e.clientX - x;
		this.yo = e.clientY - y;

		this.elem.style.cursor = "grabbing";
		this.elem.classList.add("questAlgorithmBlockActive");
		if (this.reset) {
			this.h3.innerHTML = this.step;
			this.elem.style.backgroundColor = "rgba(14, 199, 45, 0.715)";
		}

		window.onmousemove = (e) => {
			this.drag(e);
		};
		window.onmouseup = () => {
			this.mouseUp();
		};
	}

	drag(e) {
		this.setPos(e.clientX - this.xo, e.clientY - this.yo);
		this.trackBlock(this.elem.getBoundingClientRect(), this);
	}

	mouseUp() {
		window.onmousemove = null;
		window.onmouseup = null;
		this.elem.style.cursor = "grab";
		this.elem.classList.remove("questAlgorithmBlockActive");
		this.stateHandler(this);
		if (this.isNewPos) {
			this.adjustPos();
		}
	}

	setInitPos() {
		const h = window.innerHeight / 3;
		const w = window.innerWidth / 3;
		const y = Math.random() * (h * 2 - h) + h;
		const x = Math.random() * w;
		const { width, height } = this.elem.getBoundingClientRect();
		this.setPos(x - width / 2, y - height / 2);
	}

	adjustPos() {
		this.time = Date.now();
		this.prevX = this.x;
		this.prevY = this.y;
		this.positionLoop();
	}

	positionLoop(duration = 200) {
		const t = (Date.now() - this.time) / duration;
		const x = lerp(this.prevX, this.newX, easeMov(t));
		const y = lerp(this.prevY, this.newY, easeMov(t));
		this.setPos(x, y);

		if (t < 1) {
			this.animFrame = requestAnimationFrame(() => {
				this.positionLoop();
			});
		} else {
			cancelAnimationFrame(this.animFrame);
		}
	}

	setPos(x, y) {
		this.x = x;
		this.y = y;
		this.elem.style.left = `${x}px`;
		this.elem.style.top = `${y}px`;
	}

	returnToInitPos() {
		this.newX = this.initX;
		this.newY = this.initY;
		this.adjustPos();
	}

	wrongOrder() {
		this.h3.innerText = this.reason;
		this.elem.style.background = "rgba(199, 14, 14, 0.715)";
		this.reset = true;
	}
}

const menuHandler = (e, i) => {
	const elem = e.currentTarget;
	elem.classList.add("questElemAnimation");
	setTimeout(() => {
		questItem.init(i);
	}, 300);
};

const questMenu = () => {
	const items = [];
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
	init(url, folder, scale = 1, position = [0, 0, 0], rotation = 0, light = 1) {
		this.scale = scale;
		this.position = position;
		this.rotation = rotation;
		this.light = light;
		this.url = url;
		this.folder = folder;
		this.parallax = undefined;
		this.modelAnimation = false;
		this.setThreeScene();
		this.addLights();
		this.loadModel();
		this.canvasCont = c("div", { class: "questModelCont" }, [this.renderer.domElement]);
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
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		const needRes = w !== canvas.width || h !== canvas.height;

		if (needRes) {
			this.renderer.setSize(w * 2, h * 2, false);
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
			this.animate();
		});
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
			window.onmousemove = null;
		}
	},

	bezierFunc(t, f) {
		return t * t * (3.0 * f - 2.0 * f * t);
	},
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
		const p = c("p", {}, []);
		const p1 = c("p", {}, []);
		const { scale, position, rotation, light } = this.data.model;
		const txt = c("div", { class: "questText" }, [
			c("h2", {}, ["Problem:"]),
			p,
			p1,
			c("button", {}, ["Go!"], {
				click: () => {
					this.objetive();
					questModel.parallaxEffect();
					questModel.modelAnimation = true;
				},
			}),
		]);

		questModel.parallaxEffect();
		writeText(p, this.data.problem.story);

		setTimeout(() => {
			writeText(p1, this.data.problem.imperative);
		}, this.data.problem.story?.length * 25 + 200 || 0);

		addScene(
			this.title,
			c("div", { class: "questProblemCont" }, [
				txt,
				questModel.init(this.url, this.folder, scale, position, rotation, light),
			]),
			this.background
		);
	},

	// FFF4E2

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
			2000
		);
	},

	algorithm() {
		const { algorithm, model } = this.data;
		addScene(
			this.title,
			questAlgorithm.init(algorithm, this.url, this.folder, model),
			this.background,
			100
		);
	},

	congratulations() {
		const { scale, position, rotation, light } = this.data.model;

		const model = questModel.init(this.url, this.folder, scale, position, rotation, light);
		const h1 = c("h1", {}, [`${this.title} Quest Complete!!`]);
		const button = c("button", {}, ["Return to Quests"], {
			click: () => {
				addScene("Quest", questMenu(), "#FFF4E2");
			},
		});
		const btnCont = c("div", { class: "questCongratulationsBtnCont" }, [h1, button]);
		const cont = c("div", { class: "questCongratulationsContainer" }, [btnCont, model]);
		addScene("Congratulations!!", cont, this.background);
	},
};

const questAlgorithm = {
	init(data, url, folder, model) {
		this.data = data;
		this.url = url;
		this.folder = folder;
		this.model = model;
		this.state = new Array(data.length).fill(undefined);
		this.trackBlock;
		window.addEventListener("resize", () => {
			this.resizeHandler();
		});
		this.elem = c("div", { class: "questAlgorithm" }, [this.getBlocks(), this.getList()]);
		return this.elem;
	},

	getBlocks() {
		this.h3 = c("h3", { class: "questAlgorithmTitle" }, []);
		const txt = c("div", { class: "questText" }, [this.h3]);
		const blocks = this.data.map((e) => {
			return new questAlgorithmBlock(
				e.step,
				e.reason,
				(x, y) => {
					this.trackBlock(x, y);
				},
				(elem) => {
					this.stateHandler(elem);
				}
			);
		});
		const blockCont = c("div", { class: "questAlgorithmBlockCont" }, blocks);
		this.txtCont = c("div", {}, [txt, blockCont]);
		writeText(this.h3, "Put the algorithm in order:");
		return this.txtCont;
	},

	getList() {
		const nums = this.data.map((e, i) => {
			return c("span", {}, [c("h2", {}, [(i + 1).toString() + "-"])]);
		});
		this.resizeList = c("div", { class: "questAlgorithmListCont" }, nums);
		this.list = c("div", {}, [this.resizeList]);
		return this.list;
	},

	trackBlock(rect, elem) {
		const listRect = this.list.getBoundingClientRect();

		const { bottom: blockB, top: blockT, width: blockW, height: blockH, right: blockR } = rect;
		const { left: listL, bottom: listB, width: listW, height: listH, top: listT } = listRect;

		const xInter = blockR - blockW / 2 > listL;
		const yInter = blockB - blockH / 2 > listT && blockT + blockH / 2 < listB;
		const needToReturn = xInter && yInter;
		this.index = Math.round(((blockB - blockH / 2 - listT) / listH) * (this.data.length - 1));
		this.isNewPos = needToReturn;
		elem.isNewPos = this.isNewPos;
		elem.newY = listT + listH * (this.index / this.data.length) + 5;
		elem.newX = listL + listW / 2 - blockW / 2;

		// FUNCTION TO DOOO DO STUFF
		// setPosition;
	},

	stateHandler(e) {
		const i = this.index;
		const indexS = this.state.indexOf(e);
		if (this.isNewPos) {
			if (e) {
				if (this.state[i] && this.state[i] !== e) {
					e.returnToInitPos();
					return;
				}
				if (indexS === -1) {
					this.state[i] = e;
				} else {
					this.state[indexS] = undefined;
					this.state[i] = e;
				}
			}
		} else if (this.state[indexS]) {
			this.state[indexS] = undefined;
		}

		const check = () => {
			let complete = this.state.length;
			for (let i = 0; i < this.state.length; i++) {
				if (this.state[i]) complete -= 1;
			}
			return complete;
		};

		if (!check()) {
			let check = this.state.lenght;
			let num = 0;
			for (let i = 0; i < this.state.length; i++) {
				if (this.data[i].step !== this.state[i].step) {
					this.state[i].wrongOrder();
					num += 1;
				} else if (check) {
				}
			}
			if (!num) {
				this.codeSection();
			}
		}
	},
	resizeHandler() {
		this.state.forEach((e, i) => {
			if (e) {
				const listRect = this.resizeList.getBoundingClientRect();
				const rect = e.elem.getBoundingClientRect();
				const { bottom: blockB, top: blockT, width: blockW, height: blockH, right: blockR } = rect;
				const { left: listL, bottom: listB, width: listW, height: listH, top: listT } = listRect;
				const y = listT + listH * (i / this.state.length);
				const x = listL + listW / 2 - blockW / 2;
				e.setPos(x, y);
			}
		});
	},

	codeSection() {
		const { scale, position, rotation, light } = this.model;

		deleteText(this.h3);
		this.state.forEach((e) => {
			e.mouseDown = null;
		});

		const btn = c("button", { class: "questCodeButton" }, ["RUN!"], {
			click: () => {
				questItem.congratulations();
			},
		});

		const btnCont = c("div", { class: "questCodeButtonCont" }, [
			btn,
			questModel.init(this.url, this.folder, scale, position, rotation, light),
		]);

		const cont = c("div", { class: "questCodeCont" }, [
			c("div", { class: "questCode" }, [questCoding()]),
		]);

		this.list.appendChild(btnCont);
		this.txtCont.appendChild(cont);

		setTimeout(() => {
			writeText(this.h3, "Code the solution: ");
		}, 100);
		questModel.parallaxEffect();
	},

	swapArr(array, moveIndex, toIndex) {
		const item = array[moveIndex];
		const length = array.length;
		const diff = moveIndex - toIndex;

		if (diff > 0) {
			// move left
			return [
				...array.slice(0, toIndex),
				item,
				...array.slice(toIndex, moveIndex),
				...array.slice(moveIndex + 1, length),
			];
		} else if (diff < 0) {
			// move right
			const targetIndex = toIndex + 1;
			return [
				...array.slice(0, moveIndex),
				...array.slice(moveIndex + 1, targetIndex),
				item,
				...array.slice(targetIndex, length),
			];
		}
		return array;
	},

	clamp(n, l, u) {
		n = +n;
		l = +l;
		u = +u;
		l = l === l ? l : 0;
		u = u === u ? u : 0;
		if (n === n) {
			n = n <= u ? n : u;
			n = n >= l ? n : l;
		}
		return n;
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

addScene("Quest", questMenu(), "#FFF4E2");
