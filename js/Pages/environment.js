const envPos1 = {};

const setPositions = (models) => {
  envPos1.list = Object.keys(models);
  Object.keys(models).forEach((m, i) => {
    webgl.scene.find(m).position.set(0,0,100*(i-1));
    if (i-1 === 0) {
      envPos1.showing = m;
    }
  });
  const envPos = new Proxy(envPos1, {
    set(o,p,v) {
      if (p === "showing") {
	if (o.list.includes(v)) {
	  webgl.scene.find(o[p]).position.set(0,0,100);
	  webgl.scene.find(v).position.set(0,0,0);
	  o[p] = v;
	  return true;
	} else {
	  console.warn("Illegal attempt to set", v, "as the visible environment.");
	}
      }
      return false;
    }
  });
  console.log(webgl.scene);

  const changeEnv = (direction) => {
    const i = envPos.list.indexOf(envPos.showing);
    if (i === envPos.list.length - 1 && direction === 1) {
      envPos.showing = envPos.list[0];
    } else if (i === 0 && direction === -1) {
      envPos.showing = envPos.list[envPos.list.length - 1];
    } else {
      envPos.showing = envPos.list[i + direction];
    }
  };

  document.getElementsByClassName("envButton")[0].addEventListener("click", () => {changeEnv(-1)});
  document.getElementsByClassName("envButton")[1].addEventListener("click", () => {changeEnv(1)});
};

const configEnv = () => {
  const envs = [];
  webgl.scene.ridAll();
  for (let i=1; i<4; i++) {
    envs.push(`./res/environments/${Environments[0].split(/\s/g).join("_")}/Level_${i}.glb`);
  }
  webgl.loadGLTF(envs, setPositions); 
  webgl.animateCam([0,"3.7", "8.8"]); //"7.43"
  setTimeout(webgl.startAutoRot, 2000);
};


const configureEnvPage = () => {
  const buttonL = c("div", {"class": "envButton leftSide"}, [c("div", {"class": "arrowBox"})]);
  const buttonR = c("div", {"class": "envButton rightSide"}, [c("div", {"class": "arrowBox"})]);

  document.getElementById("environmentPage").appendChild(buttonL);
  document.getElementById("environmentPage").appendChild(buttonR);
};
configureEnvPage();