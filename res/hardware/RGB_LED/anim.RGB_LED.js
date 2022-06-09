const abort = new AbortController();
const id = "exploreAnim2D-RGB";
const ranges = {};

const c = (tagName, attrs = {}, children = [], events = {}) => {
  const elem = document.createElement(tagName);
  for (const [attr, value] of Object.entries(attrs)) {
    if (["textContent", "className", "htmlFor"].includes(attr)) {
      elem[attr] = value;
    } else {
      elem.setAttribute(attr, value);
    }
  };
  for (const [event, fn] of Object.entries(events)) {
    elem.addEventListener(event, fn, {signal: abort.signal});
  };
  children.forEach(child => {
    elem.appendChild(child);
  });
  return elem;
};

const animate = (e, func) => {
  const target = e.composedPath()[0];
  target.labels[0].textContent = target.value;
  func(getColorData());
};

const getColorData = () => {
  const colorData = [];
  for (let i=0; i<Object.values(ranges).length; i++) {
    colorData.push(Object.values(ranges)[i].value);
  };
  return colorData;
};

const changeVal = (e, func) => {
  const target = e.target;
  if (e.data) {
    if (isNaN(e.data)) {
      target.textContent = target.textContent.split('').filter(c => !isNaN(c)).join('');
    }
    if (+target.textContent > 255) {
      target.textContent = "255";
    } else if (+target.textContent < 0) {
      target.textContent = "0";
    }
  } else if (target.textContent === "") {
    target.textContent = "0";
  }
  ranges[target.htmlFor].value = target.textContent;
  func(getColorData());
};

const createColorGraph = (func) => {
  const graphTitleCont = c("div", {id: id, "className": "graphTitleCont", textContent: "Mix the colours!"});
  const xLabelCont = c("div", {"className": "xLabelCont"});
  const yLabelCont = c("div", {"className": "yLabelCont"});

  const graphContentCont = c("div", {"className": "graphContentCont"});

  ["R", "G", "B"].forEach(color => {
    const dataValue =  c("label", {"className": "dataValue", htmlFor: `${color}in`, textContent: "0", contentEditable: "true"}, [], {
      "mouseDown": (e) => {e.preventDefault(); e.stopPropagation()},
      "click": (e) => {
	e.preventDefault();
	e.currentTarget.focus(function(e) {
	  e.preventDefault();
	  this.setSelectionRange(0, 0, "backward");
	});
      },
      "input": (e) => {changeVal(e, func)}
    });
    const dataRange =  c("input", {id: `${color}in`, "className": "dataRange", type: "range", value: "0", min: "0", max: "255"}, [], {input: (e) => {animate(e, func)}});
    const dataCont =  c("div", {"className": "dataCont"}, [dataValue, dataRange]);
    const dataLabel = c("div", {"className": "dataLabel", textContent: color});
    const dataColumn = c("div", {"className": "dataColumn"}, [dataLabel, dataCont]);
    graphContentCont.appendChild(dataColumn);
    ranges[`${color}in`] = dataRange;
  });

  const graphCont = c("div", {"className": "graphCont"}, [graphTitleCont, xLabelCont, yLabelCont, graphContentCont]);

  return graphCont;
};

const createAnim = (func) => {
  if (document.getElementById(id)) {
    console.warn(`${id} already exists`);
    return;
  }

  const docFrag = c("div", {id: id, style: "width: 500px; height: 500px;"});

  const styleLink = document.createElement("link");
  styleLink.setAttribute("rel", "stylesheet");
  styleLink.setAttribute("href", "./anim.css");

  const fragShadow = docFrag.attachShadow({mode: "closed"});
  fragShadow.appendChild(styleLink);
  fragShadow.appendChild(createColorGraph(func));

  return docFrag;
};


const clearAnim = () => {
  abort.abort();
  document.getElementById(id).remove();
};

export { createAnim, clearAnim };