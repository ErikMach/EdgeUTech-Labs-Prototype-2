export default {
	config_3D: {
		models: {
			base4x4: {
				path: "/res/glb/hardware_glb_common",
				props: {
					position: [0, 0, 0],
					rotation: [0, 0, 0],
				},
			},
			top4x4: {
				path: "/res/glb/hardware_glb_common",
				props: {},
			},
			LED: {
				path: "/res/hardware/LED",
				props: {
					position: [-0.00003354529326315969, 0.006070385221391916, -0.00007747599738650024],
				},
			},
		},
	},

	config_coding_block: [
		{
			type: "text",
			value: "RGB LED",
		},
		{
			type: "int",
			value: 0,
			min: 0,
			max: 0,
		},
		{
			type: "int",
			value: 0,
			min: 0,
			max: 0,
		},
		{
			type: "int",
			value: 0,
			min: 0,
			max: 0,
		},
	],

	coding_function: {
		name: "LED",
		args: [
			{
				type: "int",
				default: 0,
				min: 0,
				max: 0,
			},
			{
				type: "int",
				default: 0,
				min: 0,
				max: 0,
			},
			{
				type: "int",
				default: 0,
				min: 0,
				max: 0,
			},
		],
		// RETURNS VALUES OF INPUT
		//

		create_block: {},

		//QUITAR -->  Initialice animation if necessary
		// const space = this.model.group.getObjectByName("led");
		initAnim() {
			const space = this.model.group.getObjectByName("LED_bulb");

			this.animLight = new this.THREE.PointLight(0xfffff, 1, 0);
			this.animLight.position.set(0.005, 0.01, 0);
			space.add(this.animLight);
			this.animLight.castShadow = true;

			this.animLight.shadow.mapSize.width = 512; // default
			this.animLight.shadow.mapSize.height = 512; // default
			this.animLight.shadow.camera.near = 0.5; // default
			this.animLight.shadow.camera.far = 500;

			// this.sprites = [];
			// space.add(this.animLight);
			// for (let i = 0; i < 2; i++) {
			// 	[
			// 		[-0.52, 0.14, -0.085],
			// 		[-0.48, 0.14, -0.085],
			// 		[-0.44, 0.14, -0.085],
			// 	].forEach((arr, i) => {
			// 		const sprite = new this.THREE.Sprite(
			// 			new this.THREE.SpriteMaterial({
			// 				map: new this.THREE.TextureLoader().load("./res/hardware/RGB_LED/spark.png"),
			// 				useScreenCoordinates: false,
			// 				color: 0xff0000,
			// 				blending: this.THREE.CustomBlending,
			// 				blendEquation: this.THREE.AddEquation,
			// 				blendSrc: this.THREE.OneMinusDstAlphaFactor,
			// 				blendDst: this.THREE.OneMinusSrcAlphaFactor,
			// 			})
			// 		);
			// 		sprite.scale.set(0.08, 0.08, 0.1 / 32); // imageWidth, imageHeight
			// 		sprite.position.fromArray(arr); //set(-0.48,0.18,-0.14);
			// 		const colorArr = [0, 0, 0];
			// 		colorArr[i] = 1;
			// 		sprite.material.color.setRGB(colorArr[0], colorArr[1], colorArr[2]);
			// 		this.sprites.push(sprite);
			// 		space.add(sprite);
			// 		// space.add(sprite);
			// 		// this.scene.children[2].add(sprite);
			// 		// if (!this.scene.children[2].userData.sprites) {
			// 		// 	this.scene.children[2].userData.sprites = [];
			// 		// }
			// 	});
			// }
			// const zoom = this.labelList[0];
			// zoom.removeAttribute("class");
			// zoom.innerHTML = "Zoom In!";
			// zoom.style.color = "white";
			// zoom.onclick = () => {
			// 	console.log("clicked!");
			// };
		},

		function(i) {
			console.log();
			if (i === 1) {
				this.cancelAnim = true;
				this.animLight.intensity = 0;
			}

			if (!this.cancelAnim) {
				this.animLight.intensity = lerp(0, 100, i);
			}
			// console.log(this.animLight);
			// this.sprites.forEach((sprite) => {
			// 	const sF = (1 * r + 1 * g + 1 * b) / (255 * 3) + 0.4; //normalised sizeFactor + 1/10
			// 	sprite.material.color.setRGB(r / 255, g / 255, b / 255);
			// 	sprite.scale.set(1 * sF, 1 * sF, (5 * sF) / 112); // smallest: [0.4, 0.4, 1/56]
			// 	sprite.position.y = 0.2;
			// });
			// this.animLight.color = new this.THREE.Color(`rgb(${r}, ${g}, ${b})`);
			// // console.log("RGB", (r + g + b) / 765);
			// this.animLight.intensity = lerp(0.5, 5, (parseInt(r) + parseInt(g) + parseInt(b)) / 765);
			// this.title.style.color = `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
			// this.model.lights.forEach((light) => {
			// 	light.color = new this.THREE.Color(`rgb(${data[0]}, ${data[1]}, ${data[2]})`);
			// });
		},

		comment: "something like: RGB.getLEDs.forEach(LED => glow(LED));",
	},

	explore: {
		0: {
			camera: {
				position: [0, 0.1, 0.01],
				lookAt: [0, 0, 0],
			},
			anims: {
				start: [
					{
						all: {
							props: {
								position: {
									to: [0, 0, 0],
								},
							},
							config: {
								duration: 1000,
							},
						},
					},
					{
						all: {
							props: {
								rotation: {
									to: [-1, -1, 0],
								},
							},
							config: {
								duration: 2000,
								mode: "out",
							},
						},
					},
					{
						all: {
							props: {
								rotation: {
									to: [-1, -1, 0],
								},
							},
							config: {
								duration: 2000,
								mode: "out",
							},
						},
						top4x4: {
							props: {
								position: {
									to: [0, 0.02, 0],
								},
							},
							config: {
								duration: 1000,
								mode: "gentile",
							},
						},
						base4x4: {
							props: {
								position: {
									to: [0, -0.02, 0],
								},
							},
							config: {
								duration: 1000,
								mode: "gentile",
							},
						},
					},
					{
						top4x4: {
							props: {
								position: {
									to: [0, 0, 0],
								},
							},
							config: {
								mode: "inAndOut",
								duration: 1000,
							},
						},
						base4x4: {
							props: {
								position: {
									to: [0, 0, 0],
								},
							},
							config: {
								mode: "inAndOut",
								duration: 1000,
							},
						},
					},
				],
				end: [
					{
						all: {
							props: {
								rotation: {
									to: [0, 0, 0],
								},
							},
							config: {
								mode: "gentile",
								duration: 1000,
							},
						},
						top4x4: {
							config: {
								position: {
									to: [0, 0, 0],
								},
							},
							props: {
								mode: "out",
								duration: 500,
							},
						},
						base4x4: {
							config: {
								position: {
									to: [0, 0, 0],
								},
							},
							props: {
								mode: "out",
								duration: 500,
							},
						},
					},
				],
			},
			data: {
				title: "RGB LEDs",
				description:
					"Phones, TVs, Christmas lights - coloured lights are everwhere. An RGB LED combines the primary colours of light to produce any colour imaginable! A combination of a single Red, Green and Blue LED put together in a housing that allows the selection of more colours by combining each coloured light.",
			},
		},
		1: {
			camera: {
				position: [0, 0.1, 0.01],
				lookAt: [0, 0, 0],
			},
			anims: {
				start: [
					{
						top4x4: {
							props: {
								rotation: {
									to: [-1.5, 0, 0],
								},
							},
							config: {
								duration: 2000,
								mode: "linear",
							},
						},
					},
					{
						top4x4: {
							props: {
								rotation: {
									from: [-1.5, 0, 0],
									to: [1, 0, 0],
								},
							},
							config: {
								duration: 2000,
								mode: "linear",
							},
						},
					},
				],
			},
			data: {
				title: "USES",
				items: [
					{
						models: {
							Christmas_Lights: {
								path: "/res/quests/Christmas_Lights",
								props: {
									scale: [6, 6, 6],
									position: [0, 1.5, 0],
								},
							},
						},
						labels: {
							tag: "Label_LED",
							text: "text",
						},
						camConfig: {
							lookAt: [0, 0, 0],
							position: [0, 0, 4],
						},
						text:
							"A combination of a single Red, Green and Blue LED put together in a housing that allows the selection of more colours by combining each coloured light.",
					},
					{
						models: {
							Desk_Lamp: {
								path: "/res/quests/Desk_Lamp",
								props: {
									position: [0, -0.14, 0],
									rotation: [0, 1, 0],
								},
							},
						},
						labels: {
							tag: "Label_LED",
							text: "LEDs",
						},
						camConfig: {
							lookAt: [0, 0, 0],
							position: [0, 0, 0.6],
						},
						text:
							"Phones, TVs, Christmas lights - coloured lights are everwhere. An RGB LED combines the primary colours of light to produce any colour imaginable!",
					},
				],
			},
		},
		2: {
			title: "Click In the Labels",
			anims: {
				start: [
					{
						all: {
							props: {
								rotation: {
									from: [-1, -1, 0],
									to: [-1, -1, 0],
								},
							},
							config: {
								duration: 1000,
							},
						},
					},
					{
						static: {
							control: true,
						},
						all: {
							props: {
								rotation: {
									to: [0, 0, 0],
								},
								position: {
									to: [-0.02, 0, 0],
								},
								scale: {
									to: [1.3, 1.3, 1.3],
								},
							},
							config: {
								duration: 1000,
								mode: "gentile",
							},
						},
						top4x4: {
							props: {
								position: {
									to: [0, 0.03, -0.007],
								},
								rotation: {
									to: [-1.2, 0, 0],
								},
							},
							config: {
								duration: 1500,
								mode: "inAndOut",
							},
						},
						base4x4: {
							props: {
								position: {
									to: [0, -0.03, -0.007],
								},
								rotation: {
									to: [1.3, 0, 0],
								},
							},
							config: {
								duration: 1500,
								mode: "inAndOut",
							},
						},
					},
				],
				end: [
					{
						all: {
							props: {
								position: {
									to: [0, 0, 0],
								},
								rotation: { to: [-1, -0.6, 0] },
								scale: { to: [1.7, 1.7, 1.7] },
							},
							config: {
								duration: 2000,
								mode: "gentile",
							},
						},
						base4x4: {
							props: {
								position: {
									to: [0, -0.05, 0],
								},
								rotation: {
									to: [0, 0, 0],
								},
							},
							config: {
								duration: 2000,
								mode: "elastic",
							},
						},
						top4x4: {
							props: {
								position: {
									to: [0.05, 0.05, 0],
								},
								rotation: {
									to: [-1, 0, 0],
								},
							},
							config: {
								duration: 2000,
								mode: "elastic",
							},
						},
					},
				],
			},
			data: {
				labels: [
					{
						label: "Empty_Resistor",
						content:
							"This is an empty resistor bla bla bla resistors are boring and this one is emplty of joy",
						position: [0, -0.003, 0],
					},
					{
						label: "circuitry",
						content: "Circuitry is more interesting since it have cables and stuff",
						position: [0, -0.03, 0],
					},
					{
						label: "LED_bulb",
						content: "This is the led bulb",
						position: [0.005, 0.01, 0],
					},
				],
			},
		},
		3: {
			title: "Change the intensity!",
			anims: {},
		},
	},
};
