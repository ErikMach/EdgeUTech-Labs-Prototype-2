/*	Nice animation		*/
import exploreActivity from "./exploreActivity.js";

const glbFiles = ["./res/glb/table.glb", "./res/glb/briefcase.glb"];

const animateExplore = (models) => {
	const table = webgl.scene.find("Table");
	const briefcase = webgl.scene.find("Briefcase");
	briefcase.position.set(0, 0.2, 0);
	webgl.animateCam([0.0, 0.37, 0.5], [0.0, 0.23, -0.2]);
	setTimeout(() => {
		webgl.animateCam([-0.001, 0.37, 0.0], [-0.001, 0.35, 0.0]);
		setTimeout(() => {
			pageHolder.visiblePage = "explorePage";
		}, 1800);
	}, 1800);
};

const loadExplore = () => {
	loadGLTF(glbFiles, animateExplore);
};

/*	Config*/
const configureLockageChildren = (index, hardware) => {
	return index > currentUser.tech1.rung
		? [
				c("h1", {}),
				c("div", { class: "lockCont" }, [c("img", { src: "./res/img/lock.svg", draggable: false })]),
		  ]
		: [c("h1", {}, [hardware])];
};

const configureExplore = () => {
	techTree.forEach((row, i) => {
		document.getElementById("explorePage").appendChild(
			c(
				"div",
				{ class: i <= currentUser.tech1.rung ? "techRow" : "techRow lockedTechRow" },
				row.map((hardware) =>
					c(
						"div",
						{
							class: "card",
							style: `flex:1 1 0; background-image: url("./res/hardware/${hardware
								.split(/\s/g)
								.join("_")}/topDown.${hardware.split(/\s/g).join("_")}.webp")`,
						},
						configureLockageChildren(i, hardware),
						{
							click: () => {
								exploreActivity(hardware);
								change("exploreActivity");
							},
						}
					)
				)
			)
		);
	});
};

/*
window.addEventListener("mousedown", () => {
  animateCam([0.0, 0.28, 0.0]);
  setTimeout(() => {
    pageHolder.visiblePage = "explorePage";
  }, 1500);
}, {once: true});
*/
configureExplore();

/* Bottom blur on page */
const blurBott = (e) => {
	const elem = e.target || e;
	if (elem.scrollHeight - elem.scrollTop < elem.clientHeight * 2) {
		elem.style.webkitMaskImage =
			"linear-gradient(black " +
			(100 - 25 * (1 - (elem.scrollHeight - elem.scrollTop - elem.clientHeight) / elem.clientHeight)) +
			"%, transparent 100%)";
	} else if (elem.style.webkitMaskImage !== "linear-gradient(black 100%, transparent 100%)") {
		elem.style.webkitMaskImage = "linear-gradient(black 100%, transparent 100%)";
	}
};

document.getElementById("explorePage").addEventListener("scroll", blurBott, { passive: true });
