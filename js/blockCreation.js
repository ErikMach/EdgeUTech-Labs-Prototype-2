const canvas = document.createElement("canvas");
canvas.getContext("2d").font = "24px helvetica";

/** @param {String} text The text to be rendered.
  * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
  */
const getSVGTextWidth = (text) => {
  return Math.ceil(canvas.getContext("2d").measureText(text).width);
};

const getSVGTextWidthMax = (texts = []) => {
  let maxLength = 0;
  texts.forEach(text => {
    if (getSVGTextWidth(text) > maxLength) {
      maxLength = getSVGTextWidth(text);
    }
  });
  return maxLength;
};

const c = (tagName, attrs = {}, children = []) => {
  const elem = ["svg","g","text","path", "rect", "foreignObject"].includes(tagName) ? document.createElementNS("http://www.w3.org/2000/svg", tagName) : document.createElement(tagName);
  for (let [attr, value] of Object.entries(attrs)) {
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
  return elem;
};

const displayOpts = (menuCont) => {
  menuCont.classList.add("openMenuCont");
//  menuCont.parentElement.parentElement.parentElement.add("openMenuCont");
};

const createSelectMenu = (opts = []) => {
  const menuCont = c("div", {"class": "menuCont"},
    /* opts[0] will be the default displayed */
    opts.map(opt => c("div", {"class": "optBox", "textContent": opt}))
  );
  menuCont.addEventListener("click", () => {displayOpts(menuCont)});
  return menuCont;
};

const createSVGSelectMenu = (opts = [], dims = {"width": 32, "height": 32}) => {
  const foreignObject = c("foreignObject", {"class": "SVGMenu","width": getSVGTextWidthMax(opts), "height": 32}, [createSelectMenu(opts)]);
  return foreignObject;
};




const paths = {
  "boolean": {
    "draw": (length = 16) => {
      return `M 16 0 h ${length} l 16 16 l -16 16 h -${length} l -16 -16 l 16 -16 Z`;
    },
    "height": 32
  },
  "circular": {
    "draw": (length = 0) => {
      return +length + 32;
    },
    "height": 32
  },
  "command-single": {
    "draw": (length = 108) => {
      return `M 0 4 a4,4,0,0,1,4,-4 h 8 c2,0,3,1,4,2 l 4 4 c1,1,2,2,4,2 h 12 c2,0,3,-1,4,-2 l 4 -4 c1,-1,2,-2,4,-2 h ${length} a4,4,0,0,1,4,4 v 40 a4,4,0,0,1,-4,4 h -${length} c-2,0,-3,1,-4,2 l -4 4 c-1,1,-2,2,-4,2 h -12 c-2,0,-3,-1,-4,-2 l -4 -4 c-1,-1,-2,-2,-4,-2 h -8 a4,4,0,0,1,-4,-4 Z`;
    },
    "height": 56
  },
  "command-double": {
    "draw": (length = 108) => {
      return `M 0 4 a4,4,0,0,1,4,-4 h 8 c2,0,3,1,4,2 l 4 4 c1,1,2,2,4,2 h 12 c2,0,3,-1,4,-2 l 4 -4 c1,-1,2,-2,4,-2 h ${length} a4,4,0,0,1,4,4 v 40 a4,4,0,0,1,-4,4 h -${length-16} c-2,0,-3,1,-4,2 l -4 4 c-1,1,-2,2,-4,2 h -12 c-2,0,-3,-1,-4,-2 l -4 -4 c-1,-1,-2,-2,-4,-2 h -8 a4,4,0,0,0,-4,4 v 16 a4,4,0,0,0,4,4 l 8 0 c2,0,3,1,4,2 l 4 4 c1,1,2,2,4,2 h 12 c2,0,3,-1,4,-2 l 4 -4 c1,-1,2,-2,4,-2 h ${length-16} a4,4,0,0,1,4,4 v 24 a4,4,0,0,1,-4,4 h -${length} c-2,0,-3,1,-4,2 l -4 4 c-1,1,-2,2,-4,2 h -12 c-2,0,-3,-1,-4,-2 l -4 -4 c-1,-1,-2,-2,-4,-2 h -8 a4,4,0,0,1,-4,-4z`;
    },
    "height": 112
  },
  "command-triple": {
    "draw": (length = 108) => {
      return `M 0 4 a 4 4 0 0 1 4 -4 h 8 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 h ${length} a 4 4 0 0 1 4 4 l 0 40 a 4 4 0 0 1 -4 4 h -${length-16} c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 l -8 0 a 4 4 0 0 0 -4 4 l 0 16 a 4 4 0 0 0 4 4 l 8 0 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 h ${length-16} a 4 4 0 0 1 4 4 l 0 24 a 4 4 0 0 1 -4 4 h -${length-16} c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 h -8 a 4 4 0 0 0 -4 4 v 16 a 4 4 0 0 0 4 4 l 8 0 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 h ${length-16} a 4 4 0 0 1 4 4 l 0 24 a 4 4 0 0 1 -4 4 h -${length} c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 l -8 0 a 4 4 0 0 1 -4 -4 Z`;
    },
    "height": 168
  }
};



const config = {
  "if": {
    "shape": "command-double",
    "innerConfig": [
      {"type": "text", "value": "if"},
      {"type": "input", "subtype": "boolean"},
      {"type": "text", "value": "then"},
      {"type": "childSpace"}
    ]
  },
  "if-else": {
    "shape": "command-triple",
    "innerConfig": [
      {"type": "text", "value": "if"},
      {"type": "input", "subtype": "boolean"},
      {"type": "text", "value": "then"},
      {"type": "childSpace"},
      {"type": "text", "value": "else"},
      {"type": "childSpace"}
    ]
  },
  "DC-Motor": {
    "shape": "command-single",
    "shapeSize": 450,
    "innerConfig": [
      {"type": "text", "value":"DC Motor"},
      {"type": "input", "subtype":"menu", "opts": ["clockwise", "anti-clockwise"]},
      {"type": "text", "value": "at power"},
      {"type": "input", "subtype": "circular", "subsubtype": "int", "range": {"min": 0, "max": 255}}
    ]
  },
  "LED-Display": {
    "shape": "command-single",
    "shapeSize": 260,
    "innerConfig": [
      {"type": "text", "value":"LED Display Segment"},
      {"type": "input", "subtype":"menu", "opts": ["1   ",2,3,4,5,6,7]},
      {"type": "text", "value": "on"},
    ]
  },
  "times": {
   "shape": "boolean",
    "shapeSize": 96,
    "innerConfig": [
      {"type": "input", "subtype":"circular"},
      {"type": "text", "value":"×"},
      {"type": "input", "subtype":"circular"}
    ]
  }
};


const createBlock = (blockName) => {
  const BC = config[blockName];
console.log(BC);
  const dimensions = {};

  const p1 = c("path", {"d": paths[BC.shape].draw(BC.shapeSize)});
p1.dataset.length = 108;
  const g1 = c("g", {"class": BC.shapeClass ? `shapePath ${BC.shapeClass}`: "shapePath"}, [p1]);

  const gM = c("g", {"class": "mainPathCont", "transform": "translate(1 1)"}, [g1]);

  const offset = {x:8, y:24}; //position of first element (usually text)
  const textHeight = (blockName === "BetterTech") ? 0 : 14;
  const inputHeight = 32;

  BC.innerConfig.forEach((item, index) => {
    switch(item.type) {
      case "input":
	switch(item.subtype) {
	  case "boolean":
	    offset.x += 16;
	    const p = c("path", {'d': paths.boolean.draw(16)});
	    p.dataset.length = 16;
	    const gs = c("g", {"class": "inputPath", "transform": `translate(${offset.x} ${offset.y - inputHeight/2})`}, [p]);
	    gM.appendChild(gs);
	    offset.x += 64;
//dimensions[index] = ;
	    break;
	  case "circular":
	    const r = c("rect", {"class": "", "rx": 16, "ry": 16, "x": 0, "y": 0, "width": paths.circular.draw(0), "height": 32});
	    const gs1 = c("g", {"class": "", "transform": `translate(${offset.x} ${offset.y - inputHeight/2})`}, [r]);
	    gM.appendChild(gs1);
	    offset.x += 48;   
	    break;
	  case "menu":
	    const r1 = c("rect", {"class": "", "rx": 4, "ry": 4, "x": 0, "y": 0, "width": getSVGTextWidthMax(item.opts), "height": 32});
	    const gs2 = c("g", {"class": "", "transform": `translate(${offset.x} ${offset.y - inputHeight/2})`}, [r1, createSVGSelectMenu(item.opts)]);
	    gM.appendChild(gs2);	 
	    offset.x += 48 + getSVGTextWidthMax(item.opts);   
	    break;
	  default:
	    console.warn(item.type.subtype, "is not a valid type of input.");
	}
	break;
      case "text":
	const text = c("text", {"textContent": item.value, 'x': 0, 'y': textHeight, "transform": `translate(${item.value === "BetterTech" ? 15 : offset.x} ${offset.y - textHeight/2})`}, []); //adjust offset-y because of text height
	gM.appendChild(text);
	offset.x += getSVGTextWidth(item.value) + 8;
	break;
      case "childSpace":
	const g2 = c("g", {"class":"childSpace", "transform": `translate(16 ${offset.y === 17 ? 47 : 105})`}, []);
	gM.appendChild(g2);
	offset.y = 87;
	offset.x = 8;
	break;
    }
  });

  const svg = c("svg", {"width":452, "height": paths[BC.shape].height + 2, "viewbox": `0 0 262 ${paths[BC.shape].height + 2}`}, [gM]);
svg.dimensions = new Proxy(dimensions, {
  set(o, p, v) {
    let tally = 0;
    for (i=0; i<o.length; i++) {
      tally += o[i];
    }
    svg.setAttribute("width", tally);
    svg.children[0].children[p]
console.log();
    o[p] = v;
    return true;
  }
});
console.log(svg);
   return svg;
};


export {createBlock};