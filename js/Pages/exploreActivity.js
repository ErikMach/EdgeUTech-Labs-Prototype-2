
const exploreActivitySections = {
  "0": () => {
    return [
      c("div", {class: "hardwareTitle"}),
      c("div", {class: "hardwareInfo"})
    ];
  },
  "1": () => {
    return [
      c("div", {class: "applicationTitle"}),
      c("div", {class: "applicationInfo"})
    ];
  },
  "2": (labels = []) => {
    return [
      c("div", {class: "explodeTitle"}),
      c("div", {class: "explodeInfo"}),
      ...labels.map((l,i) => {return [c(""), c("")]})
    ];
  },
  "3": () => {
    return [
      c("div", {class: "animationTitle"}),
      c("div", {class: "animationInfo"})//questions
    ];
  },
  "4": () => {
    return [
      c("div", {class: "codingTitle"}),
      c("div", {class: "codingInfo"})//questions
    ];
  },
  "5": () => {
    return [
      c("div", {class: "newQuestsTitle"}),
      c("div", {class: "newQuestsInfo"})
    ];
  },
  "6": () => {
    return [
      c("div", {class: "explodeTitle"}),
      c("div", {class: "explodeInfo"})
    ];
  },
};


const configureExploreActivity = (hardware) => {
  let config;
  webgl.scene.rid(["Table", "Briefcase"]);

  const configModel = (models) => {
    for (let [name, anims] of Object.entries(config.explore["0"].anim)) {
      for (let [prop, values] of Object.entries(anims)) {
	const obj = webgl.scene.find(name);
	obj[prop].set(...values);
      }
    }
    webgl.animateCam(config.explore["0"].camera.position, config.explore["0"].camera.lookAt);
  };

  const h = hardware.split(/\s/g).join('_');
  fetch(`./res/hardware/${h}/config.${h}.JSON`)
    .then(response => response.json())
    .then(data => {
	config = data;
	const allFiles = [];
	  for ([dir, files] of Object.entries(data["models-3D"])) {
	    files.forEach(file => {
	      allFiles.push(`./res/hardware/${h}/`+dir + file);
	    });
	  }
	  webgl.loadGLTF(allFiles, configModel);
    });
};

const exploreActivity = (hardware) => {
  configureExploreActivity(hardware);
  change("exploreActivity");
};