const id = "exploreAnim2D_led";
let animActive = true;
let globalFunc;

// const anode = <path xmlns="http://www.w3.org/2000/svg" id="path26579" />

const animate = (input) => {
	globalFunc(input);
};

const stateHandler = (event) => {
	const input = parseFloat(event.currentTarget.value);
	animate(input);
	if (input === 1) {
		// filter.animate(0, { x: 2, y: 2 })
		// diodes.animate(0, { from: [0, 0, 0], to: [250, 250, 250] })
		// blister.animate(0)
		// blister.explode()
		filter.broke();
		diodes.broke();
		blister.broke();
		animActive = false;
	} else if (animActive) {
		filter.animate(input, { x: 2, y: 2 });
		diodes.animate(input, { from: [0, 0, 0], to: [250, 250, 250] });
		blister.animate(input);
	}
};

// COMPONENTS
const filter = {
	init: function () {
		this.filter = cSvg("feGaussianBlur", { stdDeviation: "0 0" });
		this.isActive = true;
		return cSvg("filter", { id: "gaussian-blur" }, this.filter);
	},

	animate: function (int, interval) {
		if (this.isActive) {
			this.x = lerp(0, interval.x, int);
			this.y = lerp(0, interval.y, int);
			this.applyFilter(this.x, this.y);
			if (this.x !== 0 && this.y !== 0) {
				this.initStatic();
			} else {
				this.cancelStatic();
			}
		}
	},

	initStatic: function () {
		const xi = this.x + Math.random() * this.x;
		const yi = this.y + Math.random() * this.y;
		this.applyFilter(xi, yi);

		if (this.x !== 0 && this.y !== 0 && this.isActive) {
			requestAnimationFrame(() => {
				this.initStatic();
			});
		}
	},

	cancelStatic: function () {
		cancelAnimationFrame(this.animationFrame);
		this.isActive = false;
	},
	broke: function () {
		this.applyFilter(0, 0);
		this.x = 0;
		this.y = 0;
		this.cancelStatic();
	},
	applyFilter: function (x, y) {
		this.filter.setAttribute("stdDeviation", `${x} ${y}`);
	},
};

const diodes = {
	init: function () {
		const anode = cSvg("path", {
			d: "M24 3.0054L24.0159 131.006L47.5159 131.006L48.0159 34.0056L67.5159 27.0056L63.5159 16.0056L40.0159 3.0054L24 3.0054Z",
			filter: "url(#gaussian-blur)",
		});

		const cathode = cSvg("path", {
			d: "M123.5 130.5V1H53L86 20L70.5 43L71.5 99L87.5 130.5H123.5Z",
			filter: "url(#gaussian-blur)",
		});

		const diodes = cSvg(
			"svg",
			{
				class: "diodes",
				width: "100%",
				length: "100%",
				viewBox: "0 0 139 132",
				overflow: "visible",
			},
			[filter.init(), anode, cathode]
		);

		const diodesCont = c("div", { class: "diodesCont" }, [diodes]);
		this.diodes = [anode, cathode];
		return diodesCont;
	},

	animate: function (inp, { from, to }) {
		const i = inp > 0.7 ? 0.7 : inp;
		this.diodes.forEach((e) => {
			const r = lerp(from[0], to[0], scalePercent(0, 0.7, i));
			const b = lerp(from[2], to[2], scalePercent(0, 0.7, i));
			const g = lerp(from[1], to[1], scalePercent(0, 0.7, i));
			e.style.fill = `rgb(${r}, ${b}, ${g})`;
			e.style.stroke = `rgb(${r}, ${b}, ${g})`;
		});
	},
	broke: function () {
		this.diodes.forEach((e) => {
			e.style.fill = `rgb(0, 0,0)`;
			e.style.stroke = `rgb(0, 0, 0)`;
			e.style.opacity = "1";
		});
	},
};

const brokeElem = {
	init: function () {
		const smokeArr = new Array(9).fill("").map((e, i) => {
			return c("span");
		});

		this.pieces = new Array(3).fill("").map((e, i) => {
			return c("span", { class: "blisterPieces" });
		});

		this.smoke = c("div", { class: "smokeInactive smoke" }, smokeArr);
		return [this.smoke, this.pieces];
	},
	boke: function () {
		// Adding the smoke
		this.time = Date.now();
		this.smoke.classList.remove("smokeInactive");
		this.smoke.classList.add("smokeActive");
		// Pieces animation
	},
	fix: function () {
		this.smoke.classList.remove("smokeActive");
		this.smoke.classList.add("smokeInactive");
		this.pieces.forEach((e) => {
			e.style.transform = "translate(0, 0)";
		});
	},
	animatePieces: function () {
		this.pieces.forEach((e) => {});
	},
};

const blister = {
	init: function () {
		this.blister = c("div", { class: "ledBlisterBolb" });
		return c("div", { class: "ledBlister" }, [this.blister, diodes.init()]);
	},
	animate: function (inp) {
		this.blister.style.boxShadow = `0 0 ${inp * 30 + 10}px ${inp * 40}px rgba(255, 72, 72, 0.58)`;
	},
	broke: function () {
		this.blister.classList.add("blisterExploded");
		this.blister.style.boxShadow = `none`;
		this.blister.style.zIndex = "3";
	},
};

const led = () => {
	const ledHead = c("div", { class: "ledHead" }, [blister.init(), c("div", { class: "headRect" })]);
	const ledLegs = c("div", { class: "ledLegs" }, [
		c("div", { class: "ledLegL" }),
		c("div", { class: "ledLegS" }),
	]);

	const container = c("div", { class: "ledCont" }, [ledHead, ledLegs]);

	return container;
};

const slider = () => {
	return c("input", { type: "range", min: "0", max: "1", step: "0.01", value: "0" }, [], {
		input: stateHandler,
	});
};

const animCont = () => {
	const a = c("div", { class: "animCont" }, [slider(), led()]);
	return a;
};

const clearAnim = () => {
	abort.abort();
	document.getElementById(id).remove();
};

const createAnim = (func) => {
	if (document.getElementById(id) || document.querySelector(`[id^="${id.split("-")[0]}"]`)) {
		return;
	}

	globalFunc = func;
	const ledFrag = c("div", { id: id }, [animCont()]);
	const container = document.createElement("div");
	const style = document.createElement("link");
	style.setAttribute("rel", "stylesheet");
	style.setAttribute("href", "./res/hardware/LED/anim.LED.css");

	const shadow = container.attachShadow({ mode: "closed" });
	shadow.appendChild(style);
	shadow.appendChild(ledFrag);

	return container;
};

export { createAnim, clearAnim };
