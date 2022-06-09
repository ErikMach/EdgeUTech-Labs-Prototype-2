let webgl;

import("./THREEm/init-three.js").then((module) => {
  webgl = module;
  init();
});