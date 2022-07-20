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

const configureTinkerPage = (createBlock) => {
	const titleBar = c("div", { class: "titleBar" }, ["Tinker!"]);
	const codingSpace = c("div", { class: "codingSpace" }, [
		c("div", { class: "blockSpace" }, [
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
	document.getElementById("tinkerPage").appendChild(titleBar);
	document.getElementById("tinkerPage").appendChild(codingSpace);
};

import("../blockCreation.js").then((module) => {
	configureTinkerPage(module.createBlock);
});
