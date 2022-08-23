/*	Ease of Element Creation	*/

const c = (tagName, attrs = {}, children = [], listeners = {}) => {
	const elem = document.createElement(tagName);
	for (let [attr, value] of Object.entries(attrs)) {
		if (["textContent", "style"].includes(attr)) {
			elem[attr] = value;
		} else {
			elem.setAttribute(attr, value);
		}
	}
	for (let [evt, handler] of Object.entries(listeners)) {
		elem.addEventListener(evt, handler);
	}
	children.forEach((child) => {
		if (child.nodeType) {
			elem.appendChild(child);
		} else if (typeof child === "string") {
			elem.textContent += child;
		} else {
			console.warn(`c: an attempt to append ${child} as a child was made.`);
		}
	});
	return elem;
};

/* 	Page Changing*/
const change = (str) => {
	pageHolder.visiblePage = `${str}Page`;
};

const pageHolder = new Proxy(
	{ visiblePage: "menuPage" },
	{
		set(o, p, v) {
			if (v === o[p]) {
				console.warn(`pageHolder: Already on ${v}.`);
				return false;
			} else if (
				[
					"menu",
					"explore",
					"exploreActivity",
					"quest",
					"tinker",
					"environment",
					"blank",
					"profile",
				].includes(v.slice(0, -4))
			) {
				const newPage = document.getElementById(v);
				const visPage = document.getElementById(o[p]);
				visPage.classList.remove("opaque");
				setTimeout(() => {
					newPage.classList.add("visible");
					newPage.classList.add("opaque");
					visPage.classList.remove("visible");
				}, 500);
				o[p] = v;
				return true;
			} else {
				console.warn(`pageHolder: attempted to set ${p} to ${v}. Denied`);
				return false;
			}
		},
	}
);

const writeText = (elem, text, dur = 25) => {
	if (!text) {
		return;
	}
	const letterArr = Array.from(text);
	setTimeout(() => {
		const interval = setInterval(() => {
			if (letterArr.length > 0) {
				elem.innerHTML += letterArr.shift();
			} else {
				clearInterval(interval);
			}
		}, dur);
	}, 900);

	// const int = setInterval(() => {}, 20);
};

const deleteText = (elem, dur = 10) => {
	const letterArr = Array.from(elem.innerText);
	const interval = setInterval(() => {
		if (letterArr.length > 0) {
			elem.innerHTML = letterArr.join("");
			letterArr.pop();
		} else {
			elem.innerText = "";
			clearInterval(interval);
		}
	}, dur);
};

const easeMov = (x) => {
	return 1 - Math.pow(1 - x, 3);
};

const lerp = (x, y, a) => {
	return (1 - a) * x + a * y;
};

const cSvg = (tagName, attrs = {}, children = [], events = {}) => {
	const elem = document.createElementNS("http://www.w3.org/2000/svg", tagName);

	for (const [attr, value] of Object.entries(attrs)) {
		elem.setAttribute(attr, value);
	}

	if (Array.isArray(children)) {
		children.forEach((child) => {
			elem.appendChild(child);
		});
	} else {
		elem.appendChild(children);
	}

	for (const [event, fn] of Object.entries(events)) {
		elem.addEventListener(event, fn, { signal: abort.signal });
	}
	return elem;
};

const scalePercent = (start, end, curr) => {
	return (curr - start) / (end - start);
};

window.addEventListener(
	"DOMContentLoaded",
	() => {
		document.getElementById(pageHolder.visiblePage).classList.add("opaque", "visible");
	},
	{ once: true }
);

/*	User info & General Variables	*/

const currentUser = {
	name: "Erik",
	tech: "3.1,2",
	tech1: { rung: 3, completed: [1, 2] },
};
const techTree = [
	["LED"],
	["Switch", "Buzzer"],
	["DC Motor", "Rotary Knob"],
	["Sound Sensor", "RGB LED", "Keys"],
	["Milestone"],
	["Light Sensor", "LED Digital Display", "RTC"],
];
const Quests = [
	"On-Off Light",
	"Desk Lamp",
	"Morse Code",
	"Doorbell",
	"Fan",
	"Christmas Lights",
	"Displaying Numbers",
	"Clicker Counter",
	"Garage Door",
	"Street Lights",
	"Joystick",
	"Remote Controlled Car",
];
const Environments = [
	"Traffic Lights",
	//  "Office Doors",
	//  "Lighting a room"
];
