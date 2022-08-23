const abort = new AbortController();
const id = "exploreAnim2D-RGB";
const ranges = {};
let docFrag;
let graphCont;

const animate = (e, func) => {
	const target = e.composedPath()[0];
	console.log(e.target.value);
	// target.labels[0].textContent = target.value;
	func(getColorData());
};

const getColorData = () => {
	const colorData = [];
	for (let i = 0; i < Object.values(ranges).length; i++) {
		colorData.push(Object.values(ranges)[i].value);
	}
	return colorData;
};

const changeVal = (e, func) => {
	const target = e.target;
	if (e.data) {
		if (isNaN(e.data)) {
			target.textContent = target.textContent
				.split("")
				.filter((c) => !isNaN(c))
				.join("");
		}
		if (+target.textContent > 255) {
			target.textContent = "255";
		} else if (+target.textContent < 0) {
			target.textContent = "0";
		}
	} else if (target.textContent === "") {
		target.textContent = "0";
	}
	ranges[target.for].value = target.textContent;
	func(getColorData());
};

const createColorGraph = (func) => {
	const graphTitleCont = c("div", {
		id: id,
		class: "graphTitleCont",
	});

	const xLabelCont = c("div", { class: "xLabelCont" });
	const yLabelCont = c("div", { class: "yLabelCont" });

	const graphContentCont = c("div", { class: "graphContentCont" });

	["R", "G", "B"].forEach((color) => {
		const dataValue = c(
			"label",
			{ class: "dataValue", for: `${color}in`, textContent: "0", contentEditable: "true" },
			[],
			{
				mouseDown: (e) => {
					e.preventDefault();
					e.stopPropagation();
				},
				click: (e) => {
					e.preventDefault();
					e.currentTarget.focus(function (e) {
						e.preventDefault();
						this.setSelectionRange(0, 0, "backward");
					});
				},
				input: (e) => {
					console.log("INPUT! ");
					changeVal(e, func);
				},
			}
		);
		const dataRange = c(
			"input",
			{ id: `${color}in`, class: "dataRange", type: "range", value: "0", min: "0", max: "255" },
			[],
			{
				input: (e) => {
					animate(e, func);
				},
			}
		);

		const dataCont = c("div", { class: "dataCont" }, [dataValue, dataRange]);
		const dataLabel = c("div", { class: "dataLabel", textContent: color });
		const dataColumn = c("div", { class: "dataColumn" }, [dataLabel, dataCont]);
		graphContentCont.appendChild(dataColumn);
		ranges[`${color}in`] = dataRange;
	});

	const graphCont = c("div", { class: "graphCont" }, [
		graphTitleCont,
		xLabelCont,
		yLabelCont,
		graphContentCont,
	]);

	return graphCont;
};

const createAnim = (func) => {
	if (document.getElementById(id)) {
		console.warn(`${id} already exists`);
		return;
	}

	docFrag = c("div", { id: id, style: "width: 500px; height: 500px;" });
	const styleLink = document.createElement("link");
	styleLink.setAttribute("rel", "stylesheet");
	styleLink.setAttribute("href", "./res/hardware/RGB_LED/anim.RGB_LED.css");

	const fragShadow = docFrag.attachShadow({ mode: "closed" });
	fragShadow.appendChild(styleLink);
	graphCont = createColorGraph(func);
	fragShadow.appendChild(graphCont);

	return docFrag;
};

const clearAnim = () => {
	abort.abort();
	document.getElementById(id).remove();
};

export { createAnim, clearAnim };

// styleLink.setAttribute("href", "./res/hardware/LED/anim.LED.css");
