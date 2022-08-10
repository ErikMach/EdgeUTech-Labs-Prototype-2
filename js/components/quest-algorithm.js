class AlgorithmBlock {
	constructor({ type, step, reason }, needUpdate, removeStateBlock) {
		this.step = step;
		this.text = c("p", {}, [this.step]);
		this.reason = reason;
		this.type = type;
		this.needUpdate = needUpdate;
		this.removeStateBlock = removeStateBlock;
		this.canMove = true;
		switch (type) {
			case "block":
				this.getBlock();
				break;
			case "conditional":
				this.getConditional();
				break;
			case "repeat":
				this.getRepeat();
				break;
			default:
				break;
		}
	}

	getBlock() {
		this.body = c("div", { class: "simpleBlockBody" }, [this.text], {
			mousedown: (e) => {
				this.mouseDown(e);
			},
		});

		this.dashOffset = 70;
		this.dashArray = 70;

		this.arrow = [
			cSvg(
				"svg",
				{
					viewBox: "0 0 30 70",
					class: "arrow blockArrow",
					"stroke-dasharray": this.dashArray,
					"stroke-dashoffset": this.dashOffset,
				},
				[
					cSvg("path", {
						d: "M15 0.5V60",
					}),
					cSvg("path", {
						d: "M3 50L15 60.5L26 50",
					}),
				]
			),
		];

		this.elem = c("div", { class: "algorithmBlock simpleBlock" }, [this.body, ...this.arrow]);
	}

	getConditional() {
		this.dashOffset = 300;
		this.dashArray = 300;

		this.yes = c("p", { class: "hideText" }, ["yes"]);
		this.no = c("p", { class: "hideText" }, ["no"]);
		this.arrow = [
			cSvg(
				"svg",
				{
					viewBox: "0 0 150 120",
					class: "arrow conditionalArrow",
					"stroke-dasharray": this.dashArray,
					"stroke-dashoffset": this.dashOffset,
				},
				[
					cSvg("path", { d: "M149 1H31C19.9543 1 11 9.95431 11 21V109" }),
					cSvg("path", { d: "M1 100L10.8684 110L20.7368 100" }),
				]
			),
			cSvg(
				"svg",
				{
					viewBox: "0 0 150 120",
					class: "arrow conditionalArrowR",
					"stroke-dasharray": this.dashArray,
					"stroke-dashoffset": this.dashOffset,
				},
				[
					cSvg("path", { d: "M149 1H31C19.9543 1 11 9.95431 11 21V109" }),
					cSvg("path", { d: "M1 100L10.8684 110L20.7368 100" }),
				]
			),
		];

		this.body = c(
			"div",
			{ class: "conditionalBody" },
			[
				c("div", { class: "conditionalBorder" }, [c("div", { class: "conditionalCont" }, [this.text])]),
			],
			{
				mousedown: (e) => {
					this.mouseDown(e);
				},
			}
		);

		this.elem = c("div", { class: "algorithmBlock conditionalBlock" }, [
			c("div", { class: "conditionalYes" }, [this.yes, this.arrow[0]]),
			this.body,
			c("div", { class: "conditionalNo" }, [this.no, this.arrow[1]]),
		]);
	}

	getRepeat() {
		this.body = c("div", { class: "repeatBlockBody" }, [this.text], {
			mousedown: (e) => {
				this.mouseDown(e);
			},
		});
		// CAMBIAR
		this.arrow = [c("div")];
		this.elem = c("div", { class: "algorithmBlock repeatBlock" }, [this.body]);
	}

	setPos(x, y) {
		this.x = x;
		this.y = y;
		this.elem.style.left = `${x}px`;
		this.elem.style.top = `${y}px`;
	}

	putBlockInPlace(x, y, root, arrows = true) {
		this.root = root;
		this.xFrom = this.x;
		this.yFrom = this.y;
		this.xTo = x;
		this.yTo = y;

		this.initAnim();
		this.inPlaceAnim();
		if (arrows) {
			this.activeArrows();
		}
	}

	inPlaceAnim() {
		const t = (Date.now() - this.t) / this.dur;
		const newX = lerp(this.xFrom, this.xTo, easeMov(t));
		const newY = lerp(this.yFrom, this.yTo, easeMov(t));

		this.setPos(newX, newY);

		if (t < 1) {
			requestAnimationFrame(() => {
				this.inPlaceAnim();
			});
		}
	}

	returnToInitPos() {
		const { x, y } = this.initPos;
		this.inactiveArrows();
		this.right();
		this.canMove = true;
		this.putBlockInPlace(x, y, undefined, false);
	}

	mouseDown(e) {
		if (this.canMove) {
			this.right();

			const { x, y } = this.elem.getBoundingClientRect();
			this.initX = x;
			this.initY = y;
			this.xo = e.clientX - x;
			this.yo = e.clientY - y;

			this.activeBody();
			this.inactiveArrows();
			this.removeStateBlock(this);
			if (this.type === "repeat") {
				if (this.arrow) {
					this.arrow[0].remove();
				}
			}

			window.onmousemove = (e) => {
				this.drag(e);
			};
			window.onmouseup = () => {
				this.mouseUp();
			};
		}
	}

	drag(e) {
		this.setPos(e.clientX - this.xo, e.clientY - this.yo);
		// this.trackBlock(this.elem.getBoundingClientRect(), this);
	}

	mouseUp() {
		window.onmousemove = null;
		window.onmouseup = null;
		this.inactiveBody();

		const { update, xTo, yTo, root } = this.needUpdate(this);
		if (update) {
			this.putBlockInPlace(xTo, yTo, root);
		}
	}

	inactiveArrows() {
		if (this.arrowsActive) {
			this.arrowFrom = 0;
			this.arrowTo = this.dashOffset;
			this.initAnim(400);
			this.arrowAnim();

			if (this.yes && this.no) {
				this.yes.classList.add("hideText");
				this.no.classList.add("hideText");
			}

			if (this.type === "repeat") {
				this.arrow.forEach((e) => {
					e.remove();
				});
			}
			this.arrowsActive = false;
		}
	}

	activeArrows() {
		if (this.type === "repeat") {
			setTimeout(() => {
				this.repeatArrow();
			}, 500);
		}
		this.initAnim(400);
		this.arrowFrom = this.dashOffset;
		this.arrowTo = 0;
		this.arrowAnim();
		this.arrowsActive = true;

		if (this.yes && this.no) {
			this.yes.classList.remove("hideText");
			this.no.classList.remove("hideText");
		}
	}

	arrowAnim() {
		const t = (Date.now() - this.t) / this.dur;

		const offset = Math.max(0, lerp(this.arrowFrom, this.arrowTo, t));

		this.arrow.forEach((e) => {
			e.style.strokeDashoffset = offset;
		});

		if (t < 1) {
			requestAnimationFrame(() => {
				this.arrowAnim();
			});
		}
	}

	activeBody() {
		this.body.style.cursor = "grabbing";
		this.body.classList.add("grabbingBlock");
		this.elem.style.zIndex = "5";
		if (this.reset) {
			this.h3.innerHTML = this.step;
			this.elem.style.backgroundColor = "rgba(14, 199, 45, 0.715)";
		}
	}

	inactiveBody() {
		this.body.style.cursor = "grab";
		this.body.classList.remove("grabbingBlock");
		this.elem.style.zIndex = "0";
	}

	initAnim(dur = 1000) {
		this.dur = dur;
		this.t = Date.now();
	}

	repeatArrow() {
		const { root: r, limits: l } = this.root;
		const { right: limitR, left: limitL, bottom: limitB } = l;
		const elem = this.elem.getBoundingClientRect();

		const leftDir = r.left + r.width / 2 > elem.left + elem.width / 2 ? true : false;

		// const dimensions = {
		// 	w: Math.abs(r.right - elem.left),
		// 	h: Math.abs(elem.bottom - elem.height / 2 - (r.bottom - r.height)),
		// };

		// const position = { x: elem.left, y: elem.bottom - elem.height / 2 - dimensions.h };

		// this.dashOffset = dimensions.w + dimensions.h;
		// this.dashArray = dimensions.w + dimensions.h;

		const fArr = {
			w: limitR.right - elem.right + elem.width,
			h: 2,
			top: elem.bottom - elem.height / 2,
			left: elem.right,
		};

		const firstArr = c("div", {
			class: "repeatArrow ",
			style: `height: ${fArr.h}px; width: ${fArr.w}px; top:${fArr.top}px; left:${fArr.left}px;`,
		});

		const sArr = {
			w: 2,
			h: fArr.top - (r.bottom - r.height / 2),
			top: r.bottom - r.height / 2,
			left: fArr.left + fArr.w,
		};

		const secondArr = c("div", {
			class: "repeatArrow ",
			style: `height: ${sArr.h}px; width: ${sArr.w}px; top:${sArr.top}px; left:${sArr.left}px;`,
		});

		const tArr = {
			w: sArr.left - r.right - 20,
			h: 2,
			top: r.bottom - r.height / 2,
			left: r.right + 20,
		};

		const thirdArr = c("div", {
			class: "repeatArrow ",
			style: `height: ${tArr.h}px; width: ${tArr.w}px; top:${tArr.top}px; left:${tArr.left}px;`,
		});

		const tArrOne = c("div", {
			class: "repeatArrow ",
			style: `transform-origin:top left ;transform: rotate(45deg); width:10px; height:2px; top: ${
				r.bottom - r.height / 2
			}px; left: ${r.right + 20}px;`,
		});

		const tArrTwo = c("div", {
			class: "repeatArrow",
			style: `transform-origin:top left ;transform: rotate(-45deg); width:10px; height:2px; top: ${
				r.bottom - r.height / 2
			}px; left: ${r.right + 20}px `,
		});

		// this.arrow = [
		// 	cSvg("svg", {
		// 		class: `arrow repeatArrow ${leftDir ? "repeatArrowLeft" : "repeatArrowRight"}`,
		// 		width: `${dimensions.w}px`,
		// 		height: `${dimensions.h}px`,
		// 		// right: `${position.x}px`,
		// 		style: `top:${position.y}px; left:${position.x};`,
		// 		viewBox: `0 0 ${dimensions.w} ${dimensions.h}`,
		// 	}),
		// ];
		this.arrow = [firstArr, secondArr, thirdArr, tArrTwo, tArrOne];

		this.arrow.forEach((e, i) => {
			setTimeout(() => {}, 200 * i + 200);
		});

		const cont = c("div", { class: "repeatArrowContainer" }, this.arrow);
		document.body.appendChild(cont);
	}

	wrongStructure(x) {
		this.wrong();
		this.mark = new BlockMark(x.type, "wrongMark").elem;

		if (this.type === "conditional") {
			this.elem.appendChild(this.mark);
		} else {
			this.body.appendChild(this.mark);
		}

		this.canMove = false;
	}

	wrongBlock() {}

	wrong(canMove = true) {
		this.canMove = canMove;
		if (this.type === "conditional") {
			this.body.children[0].classList.add("wrongBlock");
		} else {
			this.body.classList.add("wrongBlock");
		}
		this.text.innerText = this.reason;
	}

	right() {
		if (this.mark) {
			this.mark.classList.add("wrongMarkRemove");
			setTimeout(() => {
				this.mark.remove();
			}, 1000);
		}
		if (this.type === "conditional") {
			this.body.children[0].classList.remove("wrongBlock");
		} else {
			this.body.classList.remove("wrongBlock");
		}
		this.text.innerText = this.step;
	}
}

class AlgoritmGuide {
	constructor(type) {
		this.dashArray = "4 4";
		this.stroke = "black";
		this.type = type;

		switch (type) {
			case "block":
				this.getBlock();
				break;
			case "conditional":
				this.getConditional();
				break;
			case "repeat":
				this.getRepeat();
		}
	}

	getBlock() {
		// this.stroke = "blue";

		this.body = c("div", { class: "simpleBlockBody blockGuide" }, [], {});
		this.arrow = [
			cSvg(
				"svg",
				{
					viewBox: "0 0 30 70",
					class: "arrow blockArrow",
					"stroke-dasharray": this.dashArray,
				},
				[
					cSvg("path", {
						d: "M15 0.5V60",
						stroke: this.stroke,
						"stroke-width": 2,
					}),
					cSvg("path", {
						d: "M3 50L15 60.5L26 50",
						stroke: this.stroke,
						"stroke-width": 2,
					}),
				]
			),
		];

		this.elem = c("div", { class: "algorithmBlock simpleBlock guideBlock" }, [
			this.body,
			...this.arrow,
		]);
	}

	getConditional() {
		// this.stroke = "rgb(112, 229, 89)";
		this.yes = c("p", { class: "hideText" }, ["yes"]);
		this.no = c("p", { class: "hideText" }, ["no"]);
		this.arrow = [
			cSvg(
				"svg",
				{
					viewBox: "0 0 150 120",
					class: "arrow conditionalArrow",
					"stroke-dasharray": this.dashArray,
				},
				[
					cSvg("path", {
						d: "M149 1H31C19.9543 1 11 9.95431 11 21V109",
						stroke: this.stroke,
						"stroke-width": 2,
					}),
					cSvg("path", { d: "M1 100L10.8684 110L20.7368 100", stroke: this.stroke, "stroke-width": 2 }),
				]
			),
			cSvg(
				"svg",
				{
					viewBox: "0 0 150 120",
					class: "arrow conditionalArrowR",
					"stroke-dasharray": this.dashArray,
				},
				[
					cSvg("path", {
						d: "M149 1H31C19.9543 1 11 9.95431 11 21V109",
						stroke: this.stroke,
						"stroke-width": 2,
					}),
					cSvg("path", { d: "M1 100L10.8684 110L20.7368 100", stroke: this.stroke, "stroke-width": 2 }),
				]
			),
		];

		this.body = cSvg("svg", { class: "conditionalGuideBody", viewBox: "0 0 190 80" }, [
			cSvg("path", {
				d: "M 0 40 L 95 0 L  190 40 L 95 80 L 0 40",
				fill: "none",
				stroke: this.stroke,
				"stroke-dasharray": "2 2 ",
			}),
		]);

		this.elem = c("div", { class: "algorithmBlock conditionalBlock  guideBlock" }, [
			c("div", { class: "conditionalYes" }, [this.yes, this.arrow[0]]),
			this.body,
			c("div", { class: "conditionalNo" }, [this.no, this.arrow[1]]),
		]);
	}

	getRepeat() {
		this.body = c("div", { class: "repeatBlockBody guideBlock " });
		// CAMBIAR
		this.arrow = [c("div")];
		this.elem = c("div", { class: "algorithmBlock repeatBlock guideBlock" }, [this.body]);
	}
}

class BlockMark {
	constructor(type, cClass) {
		this.type = type;
		this.cClass = cClass;

		switch (type) {
			case "conditional":
				this.getConditional();
				break;
			case "block":
				this.getBlock();
				break;
			case "repeat":
				this.getRepeat();
				break;
			default:
				this.getBlock();
		}
	}

	getConditional() {
		this.elem = cSvg(
			"svg",
			{ class: `${this.cClass} ${this.cClass}Conditional`, viewBox: "0 0 189 76" },
			[cSvg("path", { d: "M 0 38 L 94.5 0 L 189 38 L 94.5 76 L 0 38" })]
		);
	}

	getBlock() {
		this.elem = cSvg("svg", { class: `${this.cClass} ${this.cClass}Block`, viewBox: "0 0 172 57" }, [
			cSvg("rect", { width: "100%", height: "100%", rx: "10", ry: "10" }),
		]);
	}

	getRepeat() {
		this.elem = cSvg(
			"svg",
			{ class: `${this.cClass} ${this.cClass}Repeat`, viewBox: "0 0 200 200" },
			[cSvg("circle", { cx: "100", cy: "100", r: "70" })]
		);
	}
}

const questAlgorithm = {
	init(data, call, blockCont, parentElem) {
		this.data = data;
		this.call = call;
		this.blockCont = blockCont;
		this.parentElem = parentElem;
		this.initScene();
		return this.elem;
	},

	initScene() {
		this.getState();

		this.elem = c("div", { class: "algorithmCont" }, [...this.state.blocks.map((e) => e.elem)]);

		// Cambiar --> Poco elegante
		this.setBlocksInitPos();
		this.fBlockAnim(() => {
			this.moveCursorToBlock();
		});
	},

	setBlocksInitPos() {
		setTimeout(() => {
			const blocks = this.shuffle([...this.state.blocks]);

			const cNum = 3;

			this.blockCont.style.height = `${133 * Math.round(blocks.length / 3)}px`;
			const {
				width: rWidth,
				height: rHeight,
				top: rTop,
				left: rLeft,
			} = this.blockCont.getBoundingClientRect();

			const rNum = Math.round(blocks.length / 3);
			let currRow = 0;

			blocks.forEach((e, i) => {
				const { width: w, height: h } = e.body.getBoundingClientRect();
				const centerX = (rWidth / cNum - w) / 2;
				const centerY = (rHeight / rNum - h) / 2;
				const arrW = e.type === "conditional" ? e.arrow[0].getBBox().width / 2 : 0;

				const colum = (rWidth / cNum) * (i % cNum) + rLeft - arrW + centerX;
				const row = (rHeight / rNum) * currRow + rTop + centerY;

				e.initPos = { x: colum, y: row };
				e.setPos(colum, row);

				if (i % cNum === cNum - 1) {
					currRow += 1;
				}
			});

			// const offY = window.innerHeight / 3;
			// const offX = window.innerWidth / 5;
			// // Math.random() * (max - min)) + min
			// // const marginX = Math.random() * (60 - 40) + 40;
			// // const marginY = Math.random() * (40 - 30) + 30;
			// const marginX = 10;
			// const marginY = 10;
			// let x = 0;
			// let y = 0;

			// blocks.forEach((e, i) => {
			// 	const { offsetWidth: w, offsetHeight: h } = e.body;
			// 	let off = 0;
			// 	if (e.type === "conditional") {
			// 		off = w / 2;
			// 	}
			// 	if (x < offX) {
			// 		e.setPos(x + marginX * i - off, y + offY + marginY * i - h / 2);
			// 		x += w;
			// 	} else {
			// 		e.setPos(x + marginX - off, y + offY + marginY * i - h / 2);
			// 		y += h;
			// 		x = 0;
			// 	}
			// });
		}, 190);
	},

	getState() {
		const decomposeArr = (raw) => {
			let arr = [];
			for (const e of raw) {
				if (e.type === "conditional") {
					arr.push(e);
					arr.push(decomposeArr(e.tree.yes));
					arr.push(decomposeArr(e.tree.no));
				} else {
					arr.push(e);
				}
			}
			return arr;
		};

		const initState = decomposeArr(this.data);
		const blocks = this.getArrElems(initState).map((e, i) => {
			const needUpdate = (e) => {
				return this.trackUpdate(e);
			};

			const needRemove = (e) => {
				return this.removeElemState(e);
			};

			return new AlgorithmBlock(e, needUpdate, needRemove);
		});

		const current = [blocks[0]];
		const anchors = [blocks[0]];

		this.state = {
			initState,
			current,
			blocks,
			anchors,
			isStrucRight: false,
			blocksRight: false,
		};
	},

	fBlockAnim(callback) {
		setTimeout(() => {
			this.t = Date.now();
			const anch = this.state.anchors[0];
			this.iBlockX = anch.x;
			this.iBlockY = anch.y;
			this.dur = 1000;
			const { innerHeight: h, innerWidth: w } = window;
			this.root = { x: w / 1.5, y: h / 5 };
			callback();
		}, 500);
	},

	moveCursorToBlock() {
		if (!this.cursor) {
			this.cursor = c("div", { class: "algoCursor" }, [
				c("img", { src: "./res/quests/resources/cursor.png" }),
			]);

			this.prevX = window.innerWidth / 2;
			this.prevY = window.innerHeight * 0.8;
			this.cursor.style.top = `${this.prevY}px`;
			this.cursor.style.left = `${this.prevX}px`;
			this.elem.appendChild(this.cursor);
		}

		const t = (Date.now() - this.t) / this.dur;

		this.cursor.style.left = `${lerp(this.prevX, this.iBlockX + 20, easeMov(t))}px`;
		this.cursor.style.top = `${lerp(this.prevY, this.iBlockY + 20, easeMov(t))}px`;

		if (t < 1) {
			requestAnimationFrame(() => {
				this.moveCursorToBlock();
			});
		} else {
			this.fBlockAnim(() => {
				this.firstBlockToPos();
			});
		}
	},

	firstBlockToPos() {
		const t = (Date.now() - this.t) / this.dur;
		const { x, y } = this.root;
		const newX = lerp(this.iBlockX, x, easeMov(t));
		const newY = lerp(this.iBlockY, y, easeMov(t));
		const anch = this.state.anchors[0];

		anch.setPos(newX, newY);
		this.cursor.style.left = `${newX + 20}px`;
		this.cursor.style.top = `${newY + 20}px`;
		anch.activeBody();

		if (t < 1) {
			requestAnimationFrame(() => {
				this.firstBlockToPos();
			});
		} else {
			console.log("ALGORITHM DISAPPEAR: ", t);
			this.cursor.classList.add("algoCursorDisappear");
			anch.inactiveBody();
			anch.activeArrows();
			anch.canMove = false;

			setTimeout(() => {
				this.cursor.remove();
			}, 1000);
		}
	},

	addElemState(data) {
		let res = false;

		const addStructureElem = (arr, { block, anchor, left }) => {
			for (let e of arr) {
				if (Array.isArray(e)) {
					addStructureElem(e, { block, anchor, left });
				}

				if (e === anchor) {
					if (e.type === "conditional") {
						const index = left ? -2 : -1;
						if (arr.at(index).length === 0) {
							if (block.type === "conditional") {
								arr.at(index).push(block);
								arr.at(index).push([]);
								arr.at(index).push([]);
							} else {
								arr.at(index).push(block);
							}
						} else {
							res = true;
						}
					} else if (e.type !== "repeat") {
						if (block.type === "conditional") {
							arr.push(block);
							arr.push([]);
							arr.push([]);
						} else {
							arr.push(block);
						}
					}
				}
			}
		};

		if (this.state.isStrucRight) {
			// const index = this.wrongBlocks()
		} else {
			addStructureElem(this.state.current, data);
		}

		this.validate();
		this.getAnchors();
		console.log(this.state);

		return res;
	},
	removeElemState(b) {
		const popElem = (arr, b) => {
			for (let e of arr) {
				if (Array.isArray(e) && e.length > 0) {
					popElem(e, b);
				} else {
					if (e === b) {
						if (e.type === "conditional") {
							// if (arr.at(-1).length === 0 && arr.at(-2).length === 0) {
							arr.splice(arr.lastIndexOf(b));
							// }
						} else {
							arr.splice(arr.lastIndexOf(b));
						}
					}
				}
			}
		};

		popElem(this.state.current, b);
		this.getAnchors();
	},

	getAnchors() {
		if (this.state.isStrucRight) {
			const anchors = this.state.guideBlocks;
			this.state = { ...this.state, anchors };
			return;
		}
		const anchors = this.getLastElements(this.state.current).filter((e) => e.type !== "repeat");
		this.state = { ...this.state, anchors };
		this.getArrElems(this.state.current).forEach((e) => {
			if (e.type !== "repeat") {
				e.canMove = false;
			}
		});

		anchors.forEach((e) => {
			if (e !== this.state.blocks[0]) {
				e.canMove = true;
			}
		});
	},

	trackUpdate(b) {
		let data = {};
		this.state.anchors.forEach((e) => {
			const inter = this.checkIntersection(b, e);
			if (inter.intersects) {
				data = { ...inter, block: b, anchor: e };
			} else {
				data = data;
			}
		});

		const res = this.addElemState(data);

		return this.getNewPosition(data, res);
	},

	getNewPosition({ block, anchor, left, intersects }, res) {
		const root = this.getRoot();

		if (!intersects || res) {
			return { update: false, xTo: 0, yTo: 0, root: root };
		}

		const {
			left: lRef,
			right: rRef,
			bottom: bRef,
			width: wRef,
			top: tRef,
		} = anchor.elem.getBoundingClientRect();

		const { width: wBlock } = block.elem.getBoundingClientRect();

		if (this.state.isStrucRight) {
			if (this.state.isBlockStateInit) {
				return { update: true, xTo: lRef, yTo: tRef, root: root };
			} else {
				this.state.isBlockStateInit = true;
			}
		}

		if (anchor.type === "conditional") {
			const xTo = left ? lRef - wBlock / 2 : rRef - wBlock / 2;

			return { update: true, xTo: xTo, yTo: bRef, root: root };
		} else {
			const xTo = lRef + wRef / 2 - wBlock / 2;
			return { update: true, xTo: xTo, yTo: bRef, root: root };
		}
	},

	checkIntersection(b, anchor) {
		const s = this.state.isStrucRight;
		const {
			left: lRef,
			right: rRef,
			bottom: bRef,
			top: tRef,
			height: hRef,
			width: wRef,
		} = anchor.elem.getBoundingClientRect();

		const {
			left: lBlock,
			right: rBlock,
			bottom: bBlock,
			top: tBlock,
			height: hBlock,
			width: wBlock,
		} = b.body.getBoundingClientRect();

		const interX = lRef < rBlock && lBlock < rRef;
		const interY = bRef < tBlock + hBlock / 2 && tBlock < bRef + hBlock / 2;
		const interYs = tRef < bBlock && bRef > tBlock;
		const left = lBlock + wBlock / 2 < lRef + wRef / 2;

		if (s) {
			return { intersects: interX && interYs, left: left };
		} else {
			return { intersects: interX && interY, left: left };
		}
	},

	getArrElems(arr) {
		const blockArr = (raw) => {
			const arr = [];
			for (let e of raw) {
				if (Array.isArray(e)) {
					arr.push(...blockArr(e));
				} else {
					arr.push(e);
				}
			}
			return arr;
		};
		return blockArr(arr);
	},

	getLastElements(arr) {
		const getLastElem = (raw) => {
			const arr = [];
			let a;
			for (let e of raw) {
				if (Array.isArray(e)) {
					if (e.length > 0) {
						arr.unshift(getLastElem(e));
					}
				} else {
					const i = raw.lastIndexOf(e);
					const fArr = Array.isArray(raw[i + 1]) && !raw[i + 1].length > 0;
					const sArr = Array.isArray(raw[i + 2]) && !raw[i + 2].length > 0;

					if (i === raw.length - 1) {
						a = e;
					}

					if (fArr || sArr) {
						a = e;
					}
				}
			}
			if (a) {
				arr.unshift(a);
			}
			return this.getArrElems(arr);
		};

		return getLastElem(arr);
	},

	getRoot() {
		const blocks = this.getArrElems(this.state.current).map((e) => e.elem.getBoundingClientRect());

		const right = blocks.reduce((e, prev) => {
			if (e.right > prev.right) {
				return e;
			} else {
				return prev;
			}
		});

		const left = blocks.reduce((e, prev) => {
			if (e.left < prev.left) {
				return e;
			} else {
				return prev;
			}
		});

		const bottom = blocks.reduce((e, prev) => {
			if (e.bottom > prev.bottom) {
				return e;
			} else {
				return prev;
			}
		});
		const fElem = this.state.blocks[0].elem.getBoundingClientRect();

		return { root: fElem, limits: { right: right, left: left, bottom: bottom } };
	},

	validate() {
		// Structure is initialized
		if (!this.state.isStrucRight) {
			// If not all blocks are in place:
			if (this.getArrElems(this.state.current).length < this.state.blocks.length) {
				return;
			}
			this.validateStructure();
		}

		if (this.state.isStrucRight) {
			// If not all blocks are in place
			if (this.state.wrongBlocks.length !== this.state.rightBlocks.length) {
				return;
			}
			this.validateBlocks();
		}

		// If all the blocks are right
		if (this.state.blocksRight) {
			this.call();
			this.state.blocks.forEach((e) => (e.canMove = false));
		}
	},

	validateStructure() {
		const struc = this.checkStructure();

		if (struc) {
			if (struc.type === "terminals") {
				if (struc.current.length === 0) {
					this.initBlockState();

					setTimeout(() => {}, 10);
					return;
				}

				struc.current.forEach((e) => {
					if (e.length > 0) {
						e.forEach((b, i) => {
							if (i === 0) {
								b.wrongStructure(b);
							} else {
								b.wrong(false);
							}
						});
					}
				});
			} else {
				const a = this.getArrElems(this.state.current);
				const index = a.indexOf(struc.current);

				a.forEach((e, i) => {
					// e.canMove = false;

					if (i >= index) {
						if (i === index) {
							e.wrongStructure(struc.init);
						} else {
							setTimeout(() => {
								e.wrong(false);
							}, 100 * i);
						}
					}
				});
			}

			const btn = c("button", { class: "questButton restoreStructureBtn" }, ["init structure"], {
				click: (e) => {
					this.restoreStructure(struc);
					deleteText(message);
					btn.style.transform = "scaleY(0)";
					setTimeout(() => {
						cont.remove();
					}, 1000);
				},
			});
			const message = c("h4", { class: "structureMessage" });
			const cont = c("div", { class: "wrongStructureCont" }, [message, btn]);

			writeText(message, "Wrong Structure: ");
			this.parentElem.appendChild(cont);
		}
	},

	validateBlocks() {
		this.checkBlocks();
		if (this.state.wrongBlocks.length < 1) {
			this.state.blocksRight = true;
		}

		this.state.blocks.forEach((e) => {
			e.canMove = false;
		});
		console.log(this.state);
		this.state.wrongBlocks.forEach((e) => {
			e.wrong();
			e.canMove = true;
		});
	},

	initBlockState() {
		this.state.isStrucRight = true;

		const curr = this.getArrElems(this.state.current);
		const init = this.getArrElems(this.state.initState);
		const wrongBlocks = [];
		const rightBlocks = [];

		const message = c("h3", { class: "rightStructureMessage" });
		this.parentElem.appendChild(message);
		writeText(message, "Structure");

		for (let i = 0; i < curr.length; i++) {
			if (curr[i].step !== init[i].step) {
				wrongBlocks.push(curr[i]);
				rightBlocks.push(init[i]);
			}
		}

		this.state.wrongBlocks = wrongBlocks;
		this.state.rightBlocks = rightBlocks;
		this.state.current = wrongBlocks;
		this.state.initState = rightBlocks;
		// this.state.current = Object.assign({}, this.state.wrongBlock);
		// this.state.initState = Object.assign({}, this.state.rightBlocks);
		this.addStructureGuide();
	},

	restoreStructure(struc) {
		const { current, type } = struc;

		if (type === "terminals") {
			const blocks = this.getArrElems(current);
			blocks.forEach((e, i) => {
				setTimeout(() => {
					this.removeElemState(e);
					e.returnToInitPos();
				}, 100 * i);
			});
		} else {
			const blocks = this.getArrElems(this.state.current);
			const index = blocks.indexOf(current);
			blocks.forEach((e, i) => {
				if (i >= index) {
					setTimeout(() => {
						this.removeElemState(e);
						e.returnToInitPos();
					}, 100 * (i - index));
				}
			});
		}
	},

	addStructureGuide() {
		this.state.guideBlocks = this.state.wrongBlocks.map((e, i) => {
			const guide = new AlgoritmGuide(e.type);
			const { top, left } = e.elem.getBoundingClientRect();
			guide.elem.style.top = `${top}px`;
			guide.elem.style.left = `${left}px`;

			setTimeout(() => {
				this.elem.appendChild(guide.elem);
			}, 100 * i);

			return guide;
		});
	},

	checkStructure() {
		const { initState, current } = this.state;
		const ref = this.getArrElems(initState);
		const arr = this.getArrElems(current);
		let check;

		const checkArr = (ref, arr) => {
			try {
				for (let i = 0; i < ref.length - 1; i++) {
					if (ref[i].type !== arr[i].type) {
						return { current: arr[i], init: ref[i] };
					}
				}
			} catch {
				if (ref.length !== arr.length) {
					return "BLOCKS MISSING";
				} else {
					console.error("somethingHappend");
				}
			}
		};

		const getLastArr = ({ data, remain }) => {
			const newData = [];
			let newRemain = [];
			let res;
			for (let elem of remain) {
				let hasArrs = false;
				for (let e of elem) {
					if (Array.isArray(e)) {
						newRemain.push(e);
						hasArrs = true;
					}
				}

				if (!hasArrs) {
					newData.push(elem);
				}
			}

			if (remain.length > 0) {
				res = getLastArr({ data: [...data, ...newData], remain: newRemain });
			} else {
				res = { data: [...data, newData], remain: newRemain };
			}

			return res;
		};

		const checkLastArrs = (ref, arr) => {
			const { data: refD } = getLastArr({ data: [], remain: [ref] });
			const { data: arrD } = getLastArr({ data: [], remain: [arr] });
			const terminals = [];

			for (let i = 0; i < refD.length; i++) {
				if (refD[i].length !== arrD[i].length) {
					terminals.push(arrD[i]);
				}
			}

			return terminals;
		};

		check = checkArr(ref, arr);

		if (!check) {
			check = { current: checkLastArrs(initState, current), init: undefined, type: "terminals" };
		} else {
			check = { ...check, type: "structure" };
		}
		return check;
	},

	checkBlocks() {
		const w = this.state.wrongBlocks;
		const r = this.state.rightBlocks;
		const wrongB = [];
		for (let i = 0; i < r.length; i++) {
			if (w[i].step !== r[i].step) {
				wrongB.push(w[i]);
			}
		}

		this.state.wrongBlocks = wrongB;
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

	shuffle(arr) {
		let currI = arr.length,
			randI;

		while (currI != 0) {
			randI = Math.floor(Math.random() * currI);
			currI--;
			[arr[currI], arr[randI]] = [arr[randI], arr[currI]];
		}

		return arr;
	},
};

export default questAlgorithm;
