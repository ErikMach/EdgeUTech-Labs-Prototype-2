import * as THREE from "../THREEm/three.module.js";

// const parent = c("div", { class: "profileCont" });

const data = {
	// From 0 t0 100
	name: "Jorge Collier",
	roll: "professor",
	quests: ["Car", "Christmas_lights", "Desk_Lamp", "Doorbell", "Fan"],
	coins: 1200,
};

class QuestItem {
	constructor(name) {
		this.name = name.replaceAll("_", " ").toLowerCase();
		this.img = `./res/quests/${name}/${name}.webp`;
		const check = c("img", { class: "check", src: "./res/profile/check.svg", alt: "check" });
		const img = c("img", { src: this.img, alt: this.name });

		// const title = c("h3", {}, [`${this.name}`]);
		const elem = c("div", { class: "questItem" }, [img, check]);
		const cont = c("div", { class: "questItemCont" }, [elem, c("h4", {}, [`${this.name}`])]);
		return cont;
	}
}

const profileCont = () => {
	const ctainer = c("div", { class: "profileCont" });
};

const coin = {
	init() {
		this.setThreeScene();
		this.canvasCont = c("div", { class: "coinCont" }, [this.renderer.domElement], {
			mouseOver: () => {
				this.speedRotation();
			},
		});
		this.addLights();
		this.loadCoin();
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
		const pointLightRight = new THREE.PointLight(0x44ff88, 0.2);
		pointLightRight.position.set(1, 2, 5);
		this.scene.add(pointLightRight);

		const pointLightLeft = new THREE.PointLight(0xff4422, 0.2);
		pointLightLeft.position.set(-1, -1, 5);
		this.scene.add(pointLightLeft);

		const pointLightTop = new THREE.PointLight(0xdd3311, 0.2);
		pointLightTop.position.set(0, 3, 4);
		this.scene.add(pointLightTop);

		this.scene.add(new THREE.AmbientLight(0xffffff, 1));
		this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

		// const light3 = new THREE.DirectionalLight(0xffffff, 0.3 * Math.PI);
		// light3.position.set(0.1, -0.5, 1);
		// light3.lookAt(0, 0, 0);
		// light3.name = "light_two";
		// this.scene.add(light3);

		// const light4 = new THREE.DirectionalLight(0xffffff, 0.3 * Math.PI);
		// light4.position.set(-1, 0, 2);
		// light4.lookAt(0, 0, 0);
		// light4.name = "light_two";
		// this.scene.add(light4);
	},

	loadCoin() {
		const map = new THREE.TextureLoader().load("./res/profile/coin.png");
		const geometry = new THREE.CylinderBufferGeometry(1.5, 1.5, 0.2, 100);
		const material = new THREE.MeshStandardMaterial({
			map: map,
			metalness: 0.5,
			roughness: 0.2,
		});

		this.coin = new THREE.Mesh(geometry, material);
		this.scene.add(this.coin);
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

		this.coin.rotation.y += 0.01;
		this.coin.rotation.z += 0.01;
		requestAnimationFrame(() => {
			this.renderer.render(this.scene, this.camera);
			this.animate();
		});
	},

	animation() {},

	bezierFunc(t, f) {
		return t * t * (3.0 * f - 2.0 * f * t);
	},
};

const profile = {
	init(data) {
		this.data = data;
		this.getImgSec();
		this.getDataSec();
		this.cont = c("div", { class: "profileCont" }, [this.imgSec, this.dataSec]);
		return this.cont;
	},

	getImgSec() {
		const { roll, name } = this.data;
		const folder = `./res/profile/${roll}`;
		const img = c("img", { class: "profileImg", src: `${folder}/img.png`, alt: "profile image" });
		const canvas = c("canvas", { viewBox: "0 0 100 150" });
		this.ctx = canvas.getContext("2d");
		// POSSIBLE--=> Painting in the board
		this.canvasCont = c("div", { class: "boardCanvas" }, [canvas]);

		this.boardCanvas();
		const imgLegend = c("div", { class: "imgLegend" }, [
			c("img", { class: "legendImg", src: `${folder}/legendImg.png`, alt: "role icon" }),
			c("div", { class: "legendText" }, [`${roll}`]),
			c("span"),

			this.canvasCont,
		]);
		const nameElem = c("h2", { class: "name" }, [`${name}`]);
		this.imgSec = c("div", { class: "imgSec" }, [nameElem, img, imgLegend]);
	},

	getDataSec() {
		const coinElem = c("div", { class: "coinRow" }, [
			coin.init(),

			c("h1", {}, [` ${this.data.coins}`]),
			c("h2", {}, [`coins earned!`]),
		]);
		const row1 = c("div", {}, [c("h1", { class: "dataTitle" }, [`COINS`]), coinElem]);

		const questList = this.data.quests.map((e) => {
			return new QuestItem(e);
		});

		const questCont = c("div", { class: "questCont" }, questList);
		const row2 = c("div", {}, [c("h1", { class: "dataTitle" }, ["COMPLETED QUESTS"]), questCont]);
		this.dataSec = c("div", { class: "dataSec" }, [row1, row2]);
	},
	boardCanvas() {},
};

const configProfile = () => {
	const shadow = document.getElementById("profilePage").attachShadow({ mode: "open" });
	const link = c("link", { rel: "stylesheet", href: "./css/profile-style.css" });
	shadow.appendChild(link);
	// shadow.appendChild(parent);
	// shadow.appendChild(coin.init());
	shadow.appendChild(profile.init(data));
};

const boardCanvas = {
	init(target) {
		this.canvas = c("canvas", { viewBox: "0 0 100 150" });
		this.canvasCont = c("div", { class: "canvasCont" });
		this.ctx = this.canvas.getContext("2d");
	},
};

configProfile();
