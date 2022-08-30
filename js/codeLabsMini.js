'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*=========================================================================
			Text Dimension Functions
=========================================================================*/
const canvas = document.createElement("canvas");
canvas.getContext("2d").font = "24px helvetica";

/** @param {String} text - The text to be rendered.
  * @param {String} font - The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
  */
const getSVGTextWidth = (text) => {
  return Math.ceil(canvas.getContext("2d").measureText(text).width);
};

const getSVGTextWidthMax = (texts = []) => {
  let maxLength = 0;
  texts.forEach(text => {
    maxLength = Math.max(getSVGTextWidth(text), maxLength);
  });
  return maxLength;
};


/*=========================================================================
			HTML Element Shorthand
=========================================================================*/
const c = (tagName, attrs = {}, children = [], listeners = {}) => {
  const elem = ["svg", "g", "text", "path", "rect", "foreignObject", "title"].includes(tagName) ? document.createElementNS("http://www.w3.org/2000/svg", tagName) : document.createElement(tagName);
  for (const [attr, value] of Object.entries(attrs)) {
    if (attr !== "textContent") {// ['d', 'x', 'y', "rx, "ry", "transform", "class"].includes(attr)) {
      elem.setAttribute(attr, value);
    } else if (attr.includes(".")) {
      elem[attr.split(".")[0]][attr.split(".")[1]] = value;
    } else {
      elem[attr] = value;
    }
  }
  children.forEach(child => {
    elem.appendChild(child);
  });
  for (const [evt, handler] of Object.entries(listeners)) {
    elem.addEventListener(evt, handler);
  }
  return elem;
};

/*=========================================================================
				SVG Paths
=========================================================================*/
const paths = {
  "boolean": {
    "draw": (length = 16, size = 16) => {
      return `M ${size} 0 h ${length} l ${size} ${size} l -${size} ${size} h -${length} l -${size} -${size} l ${size} -${size} Z`;
    },
    "height": 40,
    "t0": [8, 20]
  },
  "circular": {
    "draw": (length = 0) => {
      return +length + 32;
    },
    "height": 40,
    "t0": [6, 20]
  },
  "command-single": {
    "draw": (length = 108) => {
      length -= 52;
      return `M 0 4 a4,4,0,0,1,4,-4 h 8 c2,0,3,1,4,2 l 4 4 c1,1,2,2,4,2 h 12 c2,0,3,-1,4,-2 l 4 -4 c1,-1,2,-2,4,-2 h ${length} a4,4,0,0,1,4,4 v 40 a4,4,0,0,1,-4,4 h -${length} c-2,0,-3,1,-4,2 l -4 4 c-1,1,-2,2,-4,2 h -12 c-2,0,-3,-1,-4,-2 l -4 -4 c-1,-1,-2,-2,-4,-2 h -8 a4,4,0,0,1,-4,-4 Z`;
    },
    "height": 56,
    "t0": [8, 24]
  },
  "command-double": {
    "draw": (length = 108, height = 16) => {
      length -= 52;
      return `M 0 4 a4,4,0,0,1,4,-4 h 8 c2,0,3,1,4,2 l 4 4 c1,1,2,2,4,2 h 12 c2,0,3,-1,4,-2 l 4 -4 c1,-1,2,-2,4,-2 h ${length} a4,4,0,0,1,4,4 v 40 a4,4,0,0,1,-4,4 h -${length-16} c-2,0,-3,1,-4,2 l -4 4 c-1,1,-2,2,-4,2 h -12 c-2,0,-3,-1,-4,-2 l -4 -4 c-1,-1,-2,-2,-4,-2 h -8 a4,4,0,0,0,-4,4 v ${height} a4,4,0,0,0,4,4 l 8 0 c2,0,3,1,4,2 l 4 4 c1,1,2,2,4,2 h 12 c2,0,3,-1,4,-2 l 4 -4 c1,-1,2,-2,4,-2 h ${length-16} a4,4,0,0,1,4,4 v 24 a4,4,0,0,1,-4,4 h -${length} c-2,0,-3,1,-4,2 l -4 4 c-1,1,-2,2,-4,2 h -12 c-2,0,-3,-1,-4,-2 l -4 -4 c-1,-1,-2,-2,-4,-2 h -8 a4,4,0,0,1,-4,-4z`;
    },
    "height": 112,
    "t0": [8, 24]
  },
  "command-double-no-after": {
    "draw": (length = 108, height = 16) => {
      length -= 52;
      return `M 0 4 a4,4,0,0,1,4,-4 h 8 c2,0,3,1,4,2 l 4 4 c1,1,2,2,4,2 h 12 c2,0,3,-1,4,-2 l 4 -4 c1,-1,2,-2,4,-2 h ${length} a4,4,0,0,1,4,4 v 40 a4,4,0,0,1,-4,4 h -${length-16} c-2,0,-3,1,-4,2 l -4 4 c-1,1,-2,2,-4,2 h -12 c-2,0,-3,-1,-4,-2 l -4 -4 c-1,-1,-2,-2,-4,-2 h -8 a4,4,0,0,0,-4,4 v ${height} a4,4,0,0,0,4,4 l 8 0 c2,0,3,1,4,2 l 4 4 c1,1,2,2,4,2 h 12 c2,0,3,-1,4,-2 l 4 -4 c1,-1,2,-2,4,-2 h ${length-16} a4,4,0,0,1,4,4 v 24 a4,4,0,0,1,-4,4 h -${length+44} a4,4,0,0,1,-4,-4z`;
    },
    "height": 106,
    "t0": [8, 24]
  },
  "command-triple": {
    "draw": (length = 108) => {
      length -= 52;
      return `M 0 4 a 4 4 0 0 1 4 -4 h 8 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 h ${length} a 4 4 0 0 1 4 4 v 40 a 4 4 0 0 1 -4 4 h -${length-16} c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 l -8 0 a 4 4 0 0 0 -4 4 v 16 a 4 4 0 0 0 4 4 l 8 0 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 h ${length-16} a 4 4 0 0 1 4 4 v 24 a 4 4 0 0 1 -4 4 h -${length-16} c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 h -8 a 4 4 0 0 0 -4 4 v 16 a 4 4 0 0 0 4 4 l 8 0 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 h ${length-16} a 4 4 0 0 1 4 4 v 24 a 4 4 0 0 1 -4 4 h -${length} c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 l -8 0 a 4 4 0 0 1 -4 -4 Z`;
    },
    "height": 168,
    "t0": [8, 24]
  },
  "event": {
    "draw": (length = 0) => {
      length = Math.max(length - 119, 0);
      return `M 0 16 c 25,-22 71,-22 96,0 h${length+39} a 4 4 0 0 1 4 4 v40 a 4 4 0 0 1 -4 4 h-${length+87} c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 h-8 a 4 4 0 0 1 -4 -4 Z`;
    }
  }
};

/*=========================================================================
			Select-Menu Creation
=========================================================================*/
const displayOpts = (menuCont, skip) => {
  if (menuCont.classList.contains("openMenuCont")) {
    menuCont.parentElement.parentElement.parentElement.parentElement.classList.remove("editing");
    menuCont.classList.remove("openMenuCont");
    menuCont.parentElement.setAttribute("height", 32);
    menuCont.blur();
  } else if (!skip) {
    menuCont.parentElement.parentElement.parentElement.parentElement.classList.add("editing");
    menuCont.classList.add("openMenuCont");
    menuCont.parentElement.setAttribute("height", menuCont.scrollHeight);
  }
};

const createSelectMenu = (opts, dimsArr, childNum) => {
  const menuCont = c("div", {"class": "menuCont", "tabindex": 0}, [
    c("div", {"class":"selectedOpt", "textContent": opts[0]}),  /* opts[0] will be the default displayed */
    c("div", {"class": "optBoxCont", "style":`width: ${getSVGTextWidthMax(opts) + 12}px`},
      opts.map(opt => {
	const optBox = c("div", {"class": "optBox", "textContent": opt});
	optBox.addEventListener("click", (e) => {
	  e.currentTarget.parentElement.previousElementSibling.textContent = opt;
	  const textWidth = getSVGTextWidth(opt) + 24;
	  e.currentTarget.parentElement.parentElement.parentElement.setAttribute("width", textWidth);
	  e.currentTarget.parentElement.parentElement.parentElement.previousElementSibling.setAttribute("width", textWidth);
	  dimsArr.x[childNum] = textWidth;
	});
	return optBox;
      })
    )]
  );
  let abortKey;
  menuCont.addEventListener("click", (e) => {
    e.stopPropagation();
    displayOpts(menuCont);
  });
  menuCont.addEventListener("focus", () => {
    abortKey = new AbortController();
    document.addEventListener("keydown", (e) => {
      const validKey = ["Enter", "ArrowDown", "ArrowUp"].indexOf(e.key);
      if (validKey === -1) {
	return;
      }
      e.preventDefault();
      if (validKey === 0) {
	displayOpts(menuCont);
      }
    }, {signal: abortKey.signal});
  });
  menuCont.addEventListener("blur", () => {
    displayOpts(menuCont, true);
    abortKey.abort();
  });
  menuCont.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });
  return menuCont;
};

const createSVGSelectMenu = (opts = [], dimsArr, childNum) => {
  const foreignObject = c("foreignObject", {"class": "SVGMenu","width": getSVGTextWidth(opts[0])+24, "height": 32}, [createSelectMenu(opts, dimsArr, childNum)]);
  return foreignObject;
};


/*=========================================================================
			Boolean Input Creation
=========================================================================*/


const boolDropEvt = new CustomEvent("boolDrop", {bubbles: true});

const createBoolDropSpace = (dimsArr, childNum) => {
  const dropSpace = c("div", {"class": "boolSpace"});


  dropSpace.addEventListener("boolDrop", () => {
    const contentWidth = dropSpace.children[0]?.scrollWidth || 48;
    const contentHeight = dropSpace.children[0]?.scrollHeight || 32;
    dimsArr.x[childNum] = contentWidth;
    dropSpace.parentElement.setAttribute("width", contentWidth);
    dropSpace.parentElement.setAttribute("height", contentHeight);
    dropSpace.parentElement.previousElementSibling.setAttribute("d", paths.boolean.draw(contentWidth - 34, 16));
  });

  const resizeBoolCont = function(mutationList, observer) {
    for (const mutation of mutationList) {
      mutation.target.dispatchEvent(boolDropEvt);
    }
  };
  const observer = new MutationObserver(resizeBoolCont);
  observer.observe(dropSpace, {attributes: false, childList: true, subtree: false});

  return dropSpace;
};

const createBooleanInput = (dimsArr, childNum) => {
  const foreignObject = c("foreignObject", {"transform": "translate(-1 -5)", "class": "SVGBool","width": 48, "height": 32}, [createBoolDropSpace(dimsArr, childNum)]);
  return foreignObject;
};

/*=========================================================================
			Input-Field Creation
=========================================================================*/
const createInput = (specs, dimsArr, childNum, fn) => {
  const input = c("input", {"class": "inputCont", "title": `${specs.subtype}${specs.range ? ` (${(specs.range.min === -Infinity) ? "-∞" : specs.range.min} to ${(specs.range.max === Infinity) ? "∞" : specs.range.max})` : ""}`});

  const validInput = (key, input) => {
    if (["Backspace", "Delete", "Shift", "Alt", "Control", "Tab"].includes(key) || key.includes("Arrow")) {
      return true;
    }
    if (key.length > 1) {
      console.log(key, "not logged");
      return false;
    }
    if (!specs.allowedChars.test(key) && key.length === 1) {
      return false;
    }

    const newInput = input.value.split("");
    newInput.splice(input.selectionStart, 0, key);
    /* Number Range */
    if (specs.type === "number" && newInput.join("") > specs.range.max && key.length === 1) {
      return false;
    }

    /* Leading Negative Sign */
    if (specs.range.min < 0 && key === "-" && (input.value.includes("-") || input.selectionStart !== 0)) {
      return false;
    }

    /* Floating point */
    if (specs.subtype === "float" && input.value.includes(".") && key === ".") {
      return false;
    }
    if (specs.subtype === "float" && newInput.join("").split(".")[1]?.length > specs.dp) {
      return false;
    }
    return true;
  };

  let abortInputValidation;
  input.addEventListener("focus", () => {
    abortInputValidation = new AbortController();
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
	input.blur();
	return;
      }
      if (!e.ctrlKey && !e.altKey && !validInput(e.key, input)) {
	event.preventDefault();
      }
    }, {signal: abortInputValidation.signal});
  });
  input.addEventListener("blur", () => {
    abortInputValidation.abort();
  });
  input.addEventListener("input", (e) => {
    const inp = e.currentTarget;
//    const textWidth = getSVGTextWidth(input.value);
    const width = paths.circular.draw(getSVGTextWidth(input.value));
    inp.parentElement.setAttribute("width", width);
    inp.parentElement.previousElementSibling.setAttribute("width", width);
    dimsArr.x[childNum] = width;
    inp.dataset.width = width;

    fn[0]();
  });
  input.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });
  return input;
};

const inputDropEvt = new CustomEvent("inputDrop", {bubbles: true});

const createSVGInput = (specs = {}, dimsArr, childNum, fn) => {
  const childCont = c("div", {"class":"dataChildCont", "xmlns": "http://www.w3.org/1999/xhtml"});
  const input = createInput(specs, dimsArr, childNum, fn);
  const foreignObject = c("foreignObject", {"class": "SVGInput","width": 32, "height": 32}, [
    childCont,
    input
  ]);

//  childCont.addEventListener("childDrop", () => {
//      dimsArr.y[0] = childCont.scrollHeight;
//  });

  childCont.addEventListener("inputDrop", () => {
    if (childCont.children.length > 0) {
      childCont.classList.add("inFront");
    } else {
      childCont.classList.remove("inFront");
    }
    const contentWidth = childCont.children[0]?.scrollWidth - 5 || input.dataset.width || 32;
    const contentHeight = childCont.children[0]?.scrollHeight || 32;
    dimsArr.x[childNum] = +contentWidth;
    foreignObject.setAttribute("width", contentWidth);
    foreignObject.setAttribute("height", contentHeight);
    foreignObject.previousElementSibling.setAttribute("width", paths.circular.draw(contentWidth - 32));
  });

  const resizeInputCont = function(mutationList, observer) {
    for (const mutation of mutationList) {
      mutation.target.dispatchEvent(inputDropEvt);
    }
  };

  const observer = new MutationObserver(resizeInputCont);
  observer.observe(childCont, {attributes: false, childList: true, subtree: false});

  return foreignObject;
};

/*=========================================================================
			Child-Cont Creation
=========================================================================*/

//const childDrop = new CustomEvent("childDrop", {bubbles: true});

const childDropEvt = document.createEvent("Event");
childDropEvt.initEvent("childDrop", true, true);


const createSVGChildCont = ({transform}, dimsArr) => {
  const childCont = c("div", {"class":"childCont", "xmlns": "http://www.w3.org/1999/xhtml"});
  const foreignObject = c("foreignObject", {"class": "SVGChildCont", "width": 130, "height": 24, "transform": transform}, [childCont]);

  childCont.addEventListener("childDrop", () => {
      dimsArr.y[0] = childCont.scrollHeight;
  });

  const resizeChildCont = function(mutationList, observer) {
    for (const mutation of mutationList) {
      dimsArr.y[0] = mutation.target.scrollHeight;
      mutation.target.dispatchEvent(childDropEvt);
    }
  };
  const observer = new MutationObserver(resizeChildCont);

  observer.observe(childCont, {attributes: false, childList: true, subtree: false});

/*
  observer.disconnect();
*/

  return foreignObject;
};


/*=========================================================================
			XBlock Drop-Check
=========================================================================*/
/* Functionality:
 * Copies values from MenuBlock
 * No Proxies needed
 * Position follows mouse until mouseup event
 * Checking Function!!
   * Delete on menuDrop
   * Can't go outside of Block Space (i.e. not into coding space or anywhere else on screen)
   * if over codingSpace: 
     * if BOOL:
	* in range of a BOOL-space ? => put outline on BOOL-space
	* log BOOL-space as .toDrop || toDrop = BOOL-space
     * if CIRCULAR:
	* in range of a CIRCULAR-space ? => put outline on CIRCULAR-space
	* log CIRCULAR-space as .toDrop || toDrop = CIRCULAR-space
	* (Later: if the data-type is incorrect, make the block red to indicate a TypeError)
     * if command:
	* in range of an `after-drop` ? => create block shadow (pseudo-element?) + reposition necessary blocks
	* in range of a child-space ? => create block shadow (pseudo-element?) + reposition necessary blocks + resize block vertically (should be done by proxy when pseudo-element shadow is appended to inside the ChildSapce)
	* idk wht else
 * CodingSpace -- just append child to different node (body); No config needed in this case
 */
// can proxy "canDrop" later so that it creates the shadow onSet
const dropInfo = {
  "currentBlockType": "command",
  "canDrop": false,
  "canDropIndex": null,
  "dropAction": "delete",
  "returnPos": {x:0, y:0},
  "reset": function() {
    this.canDrop = false;
    this.returnPos = null;
    this.canDropIndex = null;
  }
};
const spaces = [
  "blocksMenuCont",
  "codingSpace",
  "arduinoSpace"
];
const dropError = {
  "top": 10,
  "bottom": 10,
  "left": 10,
  "right": 10
};

const firstDroppable = (b1, conts) => {
  for (let i=0; i<conts.length; i++) {
    const b2 = conts[i].getBoundingClientRect();
    if (inDropRange(b1, b2)) {
      if (conts[i].getElementsByClassName(conts[i].classList[0]).length !== 0) {
	const innerDrops = firstDroppable(b1, conts[i].getElementsByClassName(conts[i].classList[0]));
	if (innerDrops) {
	  return firstDroppable(b1, conts[i].getElementsByClassName(conts[i].classList[0]));
	}
      }
      const canCont = (conts[i].tagName === "foreignObject") ? conts[i].children[0] : conts[i];
      dropInfo.canDropIndex = (canCont.children.length === 0 || (canCont.children.length === 1 && canCont.children[0].classList.contains("pseudoBlock"))) ? null : findDropIndex(b1, canCont.children);
      return canCont;
    }
  }
  dropInfo.canDropIndex = null;
  return false;
};

const findDropIndex = (b1, blocks) => {
  for (let i=0; i<blocks.length; i++) {
    if (blocks[i].classList.contains("pseudoBlock")) {
      continue;
    }
    const b2 = blocks[i].getBoundingClientRect();
    if (b1.top <= (b2.top + b2.bottom)/2 && !blocks[i].classList.contains("arduinoFunction")) {
      return i;
    }
  }
  return blocks.length;
};

const inDropRange = (b1, b2) => {
/* Based on top-left corner (of b1)
 * Truth implies b1's top-left is bounded by b2 + errors
 */
  return (
    b2.left - b1.left < dropError.left &&
    b1.left - b2.right < dropError.right &&
    b2.top - b1.top < dropError.top &&
    b1.top - b2.bottom < dropError.bottom
  );
};

const checkDrops = (blockType, rect, blockShape) => {
  const cont = document.getElementsByClassName("codingSpace")[0];
  /* Command-Single */
  if (blockType === "command-single") {
    const cSs = cont.getElementsByClassName("SVGChildCont");
    const cLs = cont.getElementsByClassName("blockCodeLine");
    dropInfo.canDrop = firstDroppable(rect, cSs) || firstDroppable(rect, cLs);
    if (dropInfo.canDrop && dropInfo.canDrop?.getElementsByClassName("pseudoBlock").length === 0) {
      cont.getElementsByClassName("pseudoBlock")[0]?.remove();
      blockShape.setAttribute("transform", "translate(1 1)");
      const pseudoEl = c("svg", {"class":"pseudoBlock", "xmlns": "http://www.w3.org/2000/svg", "width": rect.width, "height": rect.height}, [blockShape]);
      if (typeof dropInfo.canDropIndex === "number" && dropInfo.canDropIndex >= 0) {
        if (dropInfo.canDropIndex === dropInfo.canDrop.children.length) {
	  dropInfo.canDrop.children[dropInfo.canDropIndex - 1].insertAdjacentElement("afterEnd", pseudoEl);
        } else {
	  dropInfo.canDrop.children[dropInfo.canDropIndex].insertAdjacentElement("beforeBegin", pseudoEl);
        }
      } else {
	dropInfo.canDrop.appendChild(pseudoEl);
      }
    } else if (dropInfo.canDrop && dropInfo.canDropIndex >= 0 && typeof dropInfo.canDropIndex === "number" && ![-1, dropInfo.canDropIndex - 1].includes(Array.prototype.indexOf.call(dropInfo.canDrop.children, dropInfo.canDrop.getElementsByClassName("pseudoBlock")[0]))) {
      /* Change the position of the pseudoElement (if it exists in the current element and is not at the dropIndex)*/
      if (dropInfo.canDropIndex === dropInfo.canDrop.children.length) {
	dropInfo.canDrop.children[dropInfo.canDropIndex - 1].insertAdjacentElement("afterEnd", dropInfo.canDrop.getElementsByClassName("pseudoBlock")[0]);
      } else {
	dropInfo.canDrop.children[dropInfo.canDropIndex].insertAdjacentElement("beforeBegin", dropInfo.canDrop.getElementsByClassName("pseudoBlock")[0]);
      }
    } else if (!dropInfo.canDrop && cont.getElementsByClassName("pseudoBlock").length !== 0) {
      cont.getElementsByClassName("pseudoBlock")[0].remove();
    }
  }

  /* Command-double */
  if (blockType === "command-double") {
    const cSs = cont.getElementsByClassName("SVGChildCont");
    const cLs = cont.getElementsByClassName("blockCodeLine");
    dropInfo.canDrop = firstDroppable(rect, cSs) || firstDroppable(rect, cLs);
    if (dropInfo.canDrop && dropInfo.canDrop?.getElementsByClassName("pseudoBlock").length === 0) {
      cont.getElementsByClassName("pseudoBlock")[0]?.remove();
      blockShape.setAttribute("transform", "translate(1 1)");
      const pseudoEl = c("svg", {"class":"pseudoBlock", "xmlns": "http://www.w3.org/2000/svg", "width": rect.width, "height": rect.height}, [blockShape]);
      if (typeof dropInfo.canDropIndex === "number" && dropInfo.canDropIndex >= 0) {
        if (dropInfo.canDropIndex === dropInfo.canDrop.children.length) {
	  dropInfo.canDrop.children[dropInfo.canDropIndex - 1].insertAdjacentElement("afterEnd", pseudoEl);
        } else {
	  dropInfo.canDrop.children[dropInfo.canDropIndex].insertAdjacentElement("beforeBegin", pseudoEl);
        }
      } else {
	dropInfo.canDrop.appendChild(pseudoEl);
      }
    } else if (dropInfo.canDrop && dropInfo.canDropIndex >= 0 && typeof dropInfo.canDropIndex === "number" && ![-1, dropInfo.canDropIndex - 1].includes(Array.prototype.indexOf.call(dropInfo.canDrop.children, dropInfo.canDrop.getElementsByClassName("pseudoBlock")[0]))) {
      /* Change the position of the pseudoElement (if it exists in the current element and is not at the dropIndex)*/
      if (dropInfo.canDropIndex === dropInfo.canDrop.children.length) {
	dropInfo.canDrop.children[dropInfo.canDropIndex - 1].insertAdjacentElement("afterEnd", dropInfo.canDrop.getElementsByClassName("pseudoBlock")[0]);
      } else {
	dropInfo.canDrop.children[dropInfo.canDropIndex].insertAdjacentElement("beforeBegin", dropInfo.canDrop.getElementsByClassName("pseudoBlock")[0]);
      }
    } else if (!dropInfo.canDrop && cont.getElementsByClassName("pseudoBlock").length !== 0) {
      cont.getElementsByClassName("pseudoBlock")[0].remove();
    }
  }

  /* Boolean */
  if (blockType === "boolean") {
    const Bools = cont.getElementsByClassName("SVGBool");
    dropInfo.canDrop = firstDroppable(rect, Bools);
    if (dropInfo.canDrop && !dropInfo.canDrop?.parentElement.previousElementSibling.classList.contains("canDrop")) {
      cont.getElementsByClassName("canDrop")[0]?.classList.remove("canDrop");
      dropInfo.canDrop.parentElement.previousElementSibling.classList.add("canDrop");
    } else if (!dropInfo.canDrop && cont.getElementsByClassName("canDrop").length !== 0) {
      cont.getElementsByClassName("canDrop")[0].classList.remove("canDrop");
    }
  }

  /* Data */
  if (blockType === "data") {
    const Circs = cont.getElementsByClassName("SVGInput");
    dropInfo.canDrop = firstDroppable(rect, Circs);
    if (dropInfo.canDrop && !dropInfo.canDrop?.parentElement.previousElementSibling.classList.contains("canDrop")) {
      cont.getElementsByClassName("canDrop")[0]?.classList.remove("canDrop");
      cont.getElementsByClassName("canDropInput")[0]?.classList.remove("canDropInput");
      dropInfo.canDrop.parentElement.previousElementSibling.classList.add("canDrop");
      dropInfo.canDrop.nextElementSibling.classList.add("canDropInput");
    } else if (!dropInfo.canDrop && cont.getElementsByClassName("canDrop").length !== 0) {
      cont.getElementsByClassName("canDrop")[0].classList.remove("canDrop");
      cont.getElementsByClassName("canDropInput")[0].classList.remove("canDropInput");
    }
  }
  

  cont.getElementsByClassName("blockCodeLine");
//  console.log(cSs, cLs, BOOLs, CIRCs);
};

const overElMouse = (x, y) => {
  for (let i=0; i<spaces.length; i++) {
    const spaceRect = document.getElementsByClassName(spaces[i])[0].getBoundingClientRect();
    if (
      x > spaceRect.left &&
      x < spaceRect.right &&
      y > spaceRect.top &&
      y < spaceRect.bottom
    ) {
      return spaces[i];
    }
  }
};

const overElSVG = (XBlock, top, left) => {
  const box = XBlock.getBoundingClientRect();
  const codingBox = document.getElementById("codeLabsCont").getBoundingClientRect();
  if (box.left <= codingBox.left && left <= 0) {
    XBlock.style.left = 0;
  } else if (box.right >= codingBox.right && left >= codingBox.width - box.width) {
    XBlock.style.left = `${codingBox.width - box.width}px`;
  } else {
    XBlock.style.left = `${left}px`;
  }
  if (box.top <= codingBox.top && top <= 0) {
    XBlock.style.top = 0;
  } else if (box.bottom >= codingBox.bottom && top >= codingBox.height - box.height) {
    XBlock.style.top = `${codingBox.height - box.height}px`;
  } else {
    XBlock.style.top = `${top}px`;
  }
};

const checkDragAndDrop = (e, e0, XBlock, codeCont) => {
  switch (overElMouse(e.x, e.y)) {
    case "blocksMenuCont":
      dropInfo.dropAction = "delete";
      break;
    case "codingSpace":
      checkDrops(XBlock.dataset.blockType, XBlock.getBoundingClientRect(), XBlock.getElementsByClassName("shapePath")[0].cloneNode(true));
      dropInfo.dropAction = "drop";
      break;
    case "arduinoSpace":
      dropInfo.dropAction = "return";
      break;
    default:
      dropInfo.dropAction = "return";
      console.log("Mouse is outside the CodeLabs container");
  }  let top = e.clientY - e0.oy - e0.contY;
  let left = e.clientX - e0.ox - e0.contX;
  overElSVG(XBlock, top, left);
};

const dropXBlock = (XBlock, first) => {
  if (first) {
    XBlock.children[0].addEventListener("mousedown", (e) => {
      e.stopPropagation();
      createXBlock(XBlock, {
        ox: e.offsetX,
        oy: e.offsetY,
        cx: e.clientX,
        cy: e.clientY
      }, false);
    });
  }

  XBlock.classList.remove("XBlock", "grabbing");
  XBlock.classList.add("codableBlock");

  const dropSpace = dropInfo.canDrop || document.getElementsByClassName("codingSpace")[0];

  if (dropInfo.canDrop) {
    if (dropSpace.getElementsByClassName("pseudoBlock")[0]) {
      dropSpace.getElementsByClassName("pseudoBlock")[0].replaceWith(XBlock);
    } else { // When does this happen?
      dropInfo.canDrop.parentElement.previousElementSibling.classList.remove("canDrop");
      dropInfo.canDrop.appendChild(XBlock);
    }
    XBlock.style.top = 0;
    XBlock.style.left = 0;
  } else {
    const newCodeLine = c("div", {"class": "blockCodeLine"}, [XBlock]);
    dropSpace.appendChild(newCodeLine);
    newCodeLine.style.top = `${XBlock.style.top.slice(0,-2) - dropSpace.offsetTop}px`;
    newCodeLine.style.left = `${XBlock.style.left.slice(0,-2) - dropSpace.offsetLeft}px`;
    XBlock.style.top = 0;
    XBlock.style.left = 0;
    comments.push(XBlock.dataset.name);
  }
};

/*=========================================================================
			XBlock Creation
=========================================================================*/

const createXBlock = (svg, e0 = {x:0, y:0}, clone) => {
  const codeCont = document.getElementById("codeLabsCont");
  e0.contX = codeCont.getBoundingClientRect().x;
  e0.contY = codeCont.getBoundingClientRect().y;

  const top0 = e0.cy - e0.oy - e0.contY;
  const left0 = e0.cx - e0.ox - e0.contX;

  const svgClone = clone ? createBlock(null, svg) /*svg.cloneNode(true)*/ : svg;
  svgClone.classList.add("XBlock", "grabbing");
  svgClone.style.top = `${top0}px`;
  svgClone.style.left = `${left0}px`;

  dropInfo.returnPos = clone ? null : {x: left0, y: top0};

//Needa put the proxies on for when you drop it.

  const abortDrag = new AbortController();
  window.addEventListener("mousemove", (e) => {
    checkDragAndDrop(e, e0, svgClone);
  }, {signal: abortDrag.signal});
  window.addEventListener("mouseup", () => {
    if (dropInfo.dropAction === "delete" || (dropInfo.dropAction === "return" && clone)) {
      svgClone.remove();
    } else if (dropInfo.dropAction === "drop") {
      dropXBlock(svgClone, clone ? true : false);
    } else if (dropInfo.dropAction === "return" && !clone) {
      svgClone.classList.remove("XBlock", "grabbing");
      svgClone.classList.add("codableBlock");
      svgClone.style.top = dropInfo.returnPos.y;
      svgClone.style.left = dropInfo.returnPos.x;
    }
    dropInfo.reset();
    abortDrag.abort();
  }, {once: true});

  codeCont.appendChild(svgClone);
  checkDragAndDrop({x: e0.cx, y: e0.cy}, e0, svgClone);
};


/*=========================================================================
			Block Creation
=========================================================================*/
/*

  document.body.appendChild(createAnim("??", callback));

//...
  clearAnim()
  animElement.replace(createBlock("??", callback));

*/

const createBlock = (blockConfig, blockDeets = {"lib": "", "cat": "", "name": ""}, ops = {draggable: false}, callback) => {
//console.log(blockConfig);
/*
Block Config:
  [

    {
      "type": "input", functionArgIndex: 0, max: 100, min: 0...
    },
    {
      "type": "input", "subtype": "menu", functionArgIndex: 2, max: 100, min: 0...
    },
    {
      "type": "input", functionArgIndex: 1, max: 100, min: 0...
    }
  ]

  const stage = c("div",{}, [
    c("button", {}, [], {click: () => {
      // Get values from SVG inputs (in order of FAI)
      let values = [];
      for (i=0; i<svg.querySelector([data-FAI]).length; i++) {
	values.push(svg.querySelector([data-FAI=i]));
      }

      callback(values);
    }}),
    svg
  ]);

*/
  const dimensions = {x:[]};

  const BC = blockConfig;// || libsObj[blockDeets.lib][blockDeets.cat].blocks[blockDeets.name];

  const g1 = c("g", {"class": BC.shapeClass ? `shapePath ${BC.shapeClass}`: "shapePath"});

  const gM = c("g", {"class": "mainPathCont", "transform": "translate(1 1)"}, [g1]);

  const offset = {x: paths[BC.shape].t0[0], y: paths[BC.shape].t0[1]}; //position of first element (usually text)
  const textHeight = 14;
  const inputHeight = 32;

  const funcs = [
    () => {
//      console.warn("No function bound to update title");
    }
  ];

  const dims = {"x":[],"y":[56]};
  const setPadding = 10;

  /* Complete inner-config function
   * MISSING: (block-drop handlers in input[subtype="boolean"|"circular"]) 
   * No non-text elements can occur on 2nd prong of "command-triple" (the only case being "else" in "if-else")
   * Nothing can occur on last prong of command-double" & "command-triple"
   * Assumes that the only "command-double" & "command-triple" blocks are "if", "if-else", "repeat", "for", "while", ... (finite, known list). I.e. "command-double" & "command-triple" cannot be "Make-a-Block"s
   */
  BC.innerConfig.forEach((item, index) => {
    switch(item.type) {
      case "input":
	switch(item.subtype) {
	  case "boolean":
	    const p = c("path", {'d': paths.boolean.draw(16)});
	    p.dataset.length = 16;
	    const gs = c("g", {"class": "inputPath", "transform": `translate(${offset.x} ${offset.y - inputHeight/2})`}, [p, createBooleanInput(dimensions, dims.x.length)]);
	    gM.appendChild(gs);
	    offset.x += 48; //width of empty boolean
	    dims.x.push(48);
	    gs.dataset.childNum = dims.x.length;
	    break;
	  case "circular":
	    const r = c("rect", {"class": "", "rx": 16, "ry": 16, "x": 0, "y": 0, "width": paths.circular.draw(0), "height": 32});
	    const gs1 = c("g", {"class": "inputPath", "transform": `translate(${offset.x + ((dims.x.length === 0 && BC.shape === "boolean") ? 8 : 0)} ${offset.y - inputHeight/2})`}, [r, createSVGInput(item.specs, dimensions, dims.x.length, funcs)]);
//gs1.dataset.FAI = ...;
	    gM.appendChild(gs1);
	    offset.x += 32 + ((dims.x.length === 0 && BC.shape === "boolean") ? 8 : 0); //width of empty circle
	    dims.x.push(32 + ((dims.x.length === 0 && BC.shape === "boolean") ? 8 : 0));
	    gs1.dataset.childNum = dims.x.length;
	    break;
	  case "menu":
	    const r1 = c("rect", {"class": "", "rx": 4, "ry": 4, "x": 0, "y": 0, "width": getSVGTextWidth(item.opts[0])+24, "height": 32});
	    const gs2 = c("g", {"class": "", "transform": `translate(${offset.x} ${offset.y - inputHeight/2})`}, [r1, createSVGSelectMenu(item.opts, dimensions, dims.x.length)]);
	    gM.appendChild(gs2);	 
	    offset.x += getSVGTextWidth(item.opts[0]) + 24; //width of initial-opt menu
	    dims.x.push(getSVGTextWidth(item.opts[0]) + 24);
	    gs2.dataset.childNum = dims.x.length;
	    break;
	  default:
	    console.warn(item.type.subtype, "is not a valid type of input.");
	}
	offset.x += setPadding;
	break;
      case "text":
	const text = c("text", {"textContent": item.value, 'x': 0, 'y': textHeight, "transform": `translate(${(dims.x.length === 0 && BC.shape === "circular") ? offset.x + 10 : offset.x} ${offset.y - textHeight/2})`}); //adjust offset-y because of text height
	gM.appendChild(text);
	if (dims.y.length === 1) {
	  offset.x += getSVGTextWidth(item.value) + setPadding + ((dims.x.length === 0 && BC.shape === "circular") ? 0 : 0);
	  dims.x.push(getSVGTextWidth(item.value) + ((dims.x.length === 0 && BC.shape === "circular") ? 10 : 0));
	  text.dataset.childNum = dims.x.length;
	}
	break;
      case "childSpace":
	/* Only relevant for paths["command-double" | "command-triple"] */
//Current Child space in the mainPath is 16
//Height of average command block is 40
	const g2 = c("g", {"class":"childSpace", "transform": `translate(16 ${offset.y === 24 ? 49 : 105})`}, []);
	if (!dimensions.y) {
	  dimensions.y = [];
	}
	const d1 = createSVGChildCont({"transform": `translate(15 ${offset.y === 24 ? 47 : 105})`}, dimensions);
	gM.appendChild(g2);
	gM.appendChild(d1);
	offset.y = 91;
	offset.x = 8;
	dims.y.push(24, 56);
	break;
    }
  });


const getLengthX = (dimsArr, sliceTo = undefined) => {
  return dimsArr.slice(0, sliceTo).reduce((a, b) => a + b + setPadding, 0);// + dimsArr.slice(0, sliceTo).length*setPadding;
};

  const totalLength = (BC.shape === "circular" && gM.children[1].tagName === "text") ? getLengthX(dims.x) + paths[BC.shape].t0[0] + 18 : getLengthX(dims.x) + paths[BC.shape].t0[0]; // paths[BC.shape].t0[0] is the distance from the start of the SVG Main Path to the start of the first element (usually text)

  const totalLengthBool = dims.x.reduce((a, b) => a + b, 0);

  let p1;
  if (BC.shape === "circular") {
    p1 = c("rect", {"class": "", "rx": 20, "ry": 20, "x": 0, "y": 0, "width": paths.circular.draw(totalLengthBool + (dims.x.length === 1 ? -10 : 0)), "height": 40});
  } else if (BC.shape === "boolean") {
    p1 = c("path", {"class": "boolPath", "d": paths[BC.shape].draw(totalLength - ((BC.innerConfig[BC.innerConfig.length -1].subtype === "circular") ? 36 : 42), 20)});
  } else {
    p1 = c("path", {"d": paths[BC.shape].draw(totalLength)});
  }
  g1.appendChild(p1);

  const svg = c("svg", {"xmlns": "http://www.w3.org/2000/svg", "class": blockDeets.cat.toLowerCase(), "width": (BC.shape === "circular") ? totalLength + (dims.x.length === 1 ? -10 : 0): totalLength, "height": paths[BC.shape].height + 2 - (["boolean", "circular"].includes(BC.shape)?0:10)/*, "viewbox": `0 0 ${totalLength} ${paths[BC.shape].height + 2}`*/}, [gM]);

  if (!ops.draggable) {
    svg.classList.add("noDrag");
  }

/*
 *	YEEEEET
 */
  svg.runFunc = blockConfig.function;

  svg.dataset.lib = blockDeets.lib;
  svg.dataset.category = blockDeets.cat;
  svg.dataset.name = blockDeets.name;

  svg.dataset.blockType = BC.shape;
  if (BC.shape === "circular") {
    svg.dataset.blockType = "data";
// gotta do the function
/* E.g.
 * ([0-9999]) + ([0-9999])
 * function f(data1, data2) {
 *   return data1 + data2;
 * }
 * const range = {
 *   min: Math.min(f(data1.min, data2.min), f(data1.max, data2.max)),
 *   max: Math.max()
 * };
 *
 * ...gee, sounds like I needa evaluate this onCreation (forAll values) and store it as a `range = {min: 0, max: 255}`
 * But that's untenable forAll Real values -- what if there's an asymptote at 0.05?
 */
//    svg.dataset.dataType = "";
  }

  if (blockDeets.name === "+") {
    const titleEl = c("title", {"textContent": 0});
//    svg.insertBefore(titleEl, svg.firstChild);
    svg.appendChild(titleEl);
    funcs[0] = () => {
      titleEl.textContent = BC.fn(svg); 
    };
  }


  if (blockConfig && ops.draggable) {
    gM.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      createXBlock(blockDeets, {
        ox: e.offsetX,
        oy: e.offsetY,
        cx: e.clientX,
        cy: e.clientY
      }, true);
    });
  }

  if (gM.children.length - 1 === gM.getElementsByTagName("text").length) { // equivalent to: (BC.innerConfig.map(el => el.type === "text" ? "y" : "n").indexOf("n") === -1) ?
    //console.log("No proxies on", BC);
    return svg;
  }

  dimensions.x = new Proxy(dims.x, {
    set(o, p, v) {
      o[p] = v;
      if (p1.getAttribute("class") === "boolPath") { // if the block is a Boolean block
console.log("Boolean length changing from:", svg.getAttribute("width"), "to", dimensions.x.reduce((a, b) => a + b + setPadding, setPadding));
console.log(dimensions.x);
        const totalLengthNew = dimensions.x.reduce((a, b) => a + b + setPadding, setPadding);
        svg.setAttribute("width", totalLengthNew);
        p1.setAttribute("d", paths[BC.shape].draw(totalLengthNew - ((BC.innerConfig[BC.innerConfig.length -1].subtype === "circular") ? 36 : 42), svg.getAttribute("height") - 22));
      } else if (p1.tagName === "path") { // if the block is a command block
        const totalLengthNew = getLengthX(dimensions.x) + paths[BC.shape].t0[0];
        svg.setAttribute("width", totalLengthNew);
        p1.setAttribute("d", paths[BC.shape].draw(totalLengthNew));
      } else if (p1.tagName === "rect") { // if the block is a Data block
        const totalLengthNew = dimensions.x.reduce((a, b) => a + b, 0);
        svg.setAttribute("width", paths.circular.draw(totalLengthNew) + 4);
        p1.setAttribute("width", paths.circular.draw(totalLengthNew));
      }
//      const topLevelChildren = [...svg.querySelectorAll("[data-child-num]")].filter(value => !array2.includes(value));

//      let topLevelChildren = [...svg.querySelectorAll("[data-child-num]")].filter(elem => elem.parentElement === svg.children[0]);
//      console.log(topLevelChildren);


      [...svg.querySelectorAll("[data-child-num]")].filter(elem => elem.parentElement === svg.children[0]).forEach((child, index) => {
	if (index > p) {
	  child.setAttribute("transform", `translate(${getLengthX(dimensions.x, index)+paths[BC.shape].t0[0]} ${child.attributes.transform.value.split(/\s/)[1]}`);
	}
      });
      return true;
    }
  });

if (dimensions.y) { //["command-double", "command-triple"].includes(BC.shape)) {
  dimensions.y = new Proxy(dims.y, {
    set(o, p, v) {
      const totalLengthNew = v;
        p1.setAttribute("d", paths[BC.shape].draw(getLengthX(dimensions.x) + paths[BC.shape].t0[0], Math.max(totalLengthNew - 8, 16)));
	svg.getElementsByClassName("SVGChildCont")[0].setAttribute("width", Math.max(130, svg.getElementsByClassName("SVGChildCont")[0].children[0].scrollWidth));
	svg.getElementsByClassName("SVGChildCont")[0].setAttribute("height", Math.max(24, v));
      svg.setAttribute("height", p1.getBoundingClientRect().height - 8);
//console.log(o,"'s", p, "is now", v);
      o[p] = v;
      return true;
    }
  });
}

  return svg;
};

/* Object version for dynamic loading and stuff
const libs = {
  "ArduinoBlocks": "./libs/ArdionoBlocks.js",
  "EBlocks": "./libs/EBlocks.js"
};
*/
/*


createCodeBlock by `name` (if in Arduino std lib)
		   `config` (for all other & custom blocks)

Make draggable-configurable, resizeable blocks.

No menu... only blocks to drag.

tabs to switch to text-based. (or toggle split/full view)

Arduino blocks already have bound functions
Custom blocks must be passed a function to execute ONCLICK of:

Button for simulation/running of code.



*/


let allowedMenus;


new Proxy({"selected": "Control"}, {
  set(o,p,v) {
    if (p !== "selected") {
      console.warn("Non-existant property", p, "of selectedBlocksMenu was not changed to", v);
      return false;
    } else if (!allowedMenus.includes(v)) {
      console.warn("Illegal attempt to set selectedBlocksMenu to", v, `(not one of: ${allowedMenus})`);
      return false;
    } else {
      document.getElementById(`menuItem${o[p]}`).classList.remove("selectedBlocksMenu");
      document.getElementById(`menuItem${v}`).classList.add("selectedBlocksMenu");
      document.getElementById(`menuSection${v}`).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      return o[p] = v;
    }  }
});


const attachStyledShadow = (elem, mode = "closed", style_dir) => {
  const style = document.createElement("link");
  style.setAttribute("rel", "stylesheet");
  style.setAttribute("href", style_dir);

  const shadow = elem.attachShadow({ mode: "closed" });
  shadow.appendChild(style);
  return shadow;
};

const createCodeLabsMini = (container, withBlocks = [], ops = {draggable: false}, callback) => {
  const shadow = attachStyledShadow(container, "closed", "./css/blockStyles.css");

  let blocksArr = [...withBlocks.map(b => createBlock(b, {"lib": "EUTBlocks", "cat": "EUTBlocks", "name": "RGB_LED"}, ops)),
    c("div", {"class": "buttonHolder"}, [
      c("button", {"textContent": "Run!", "class": "runBtn"}, [], {})
    ])
  ];
  blocksArr[blocksArr.length-1].children[0].addEventListener("click", () => {callback(blocksArr[0].runFunc());});

  shadow.appendChild(
    c("div", {"class": "codingSpace"}, blocksArr)
  );
};

exports.createCodeLabsMini = createCodeLabsMini;
