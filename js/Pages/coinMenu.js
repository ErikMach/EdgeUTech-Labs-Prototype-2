import * as THREE from "../THREEm/three.module.js";

const menuCoinModel = {
	init() {
		this.setThreeScene();
		this.canvasCont = c("div", { class: "coinCont" }, [this.renderer.domElement]);
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
		const geometry = new THREE.CylinderBufferGeometry(1, 1, 0.2, 100);
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

		this.coin.rotation.x += 0.01;
		this.coin.rotation.y += 0.01;

		requestAnimationFrame(() => {
			this.renderer.render(this.scene, this.camera);
			this.animate();
		});
	},

	addCoinsAnim() {},

	bezierFunc(t, f) {
		return t * t * (3.0 * f - 2.0 * f * t);
	},
};

const coinMenu = {
	init() {
		const cont = document.getElementById("coinCont");
		cont.addEventListener("click", () => {
			this.addMoney;
		});
		this.h1 = c("h1", {}, ["1200"]);
		this.model = menuCoinModel.init();
		cont.appendChild(c("div", { class: "coinMenuCont" }, [this.model, this.h1]));
	},

	addMoney() {},
};

coinMenu.init();
