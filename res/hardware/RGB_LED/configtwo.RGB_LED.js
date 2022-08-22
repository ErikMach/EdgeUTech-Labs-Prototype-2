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
			RGB_LED: {
				path: "/res/hardware/RGB_LED",
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
		name: "RGB_LED",
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

		function: (r, g, b) => {
			for (let i = 0; i < 2; i++) {
				[
					[-0.52, 0.14, -0.085],
					[-0.48, 0.14, -0.085],
					[-0.44, 0.14, -0.085],
				].forEach((arr, i) => {
					const sprite = new THREE.Sprite(
						new THREE.SpriteMaterial({
							map: new THREE.TextureLoader().load("./res/spark.png"),
							useScreenCoordinates: false,
							color: 0xff0000,
							blending: THREE.CustomBlending,
							blendEquation: THREE.AddEquation,
							blendSrc: THREE.OneMinusDstAlphaFactor,
							blendDst: THREE.OneMinusSrcAlphaFactor,
						})
					);

					sprite.id = keyCounter();
					sprite.scale.set(0.07, 0.07, 0.1 / 32); // imageWidth, imageHeight
					sprite.position.fromArray(arr); //set(-0.48,0.18,-0.14);
					const colorArr = [0, 0, 0];
					colorArr[i] = 1;
					sprite.material.color.setRGB(colorArr[0], colorArr[1], colorArr[2]);
					scene.children[2].add(sprite);
				});
			}
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
							},
							config: {
								duration: 2000,
								mode: "gentile",
							},
						},
						base4x4: {
							props: {
								position: {
									to: [0, 0, 0],
								},
								rotation: {
									to: [0, 0, 0],
								},
							},
							config: {
								duration: 2000,
								mode: "gentile",
							},
						},
						top4x4: {
							props: {
								position: {
									to: [0, 0, 0],
								},
								rotation: {
									to: [0, 0, 0],
								},
							},
							config: {
								duration: 2000,
								mode: "gentile",
							},
						},
					},
				],
			},
			data: {
				labels: [
					{
						label: "led",
						content:
							"This single light contains 3 LEDs. Can you spot them? One Red, one Green and one Blue.<br>These are the 3 primary colors of light.",
						position: [-0.65, 0, -0.07],
					},
					{
						label: "connection",
						content:
							"This single light contains 3 LEDs. Can you spot them? One Red, one Green and one Blue.<br>These are the 3 primary colors of light.",
						position: [0, 0, 1],
					},
					{
						label: "chip",
						content:
							"This single light contains 3 LEDs. Can you spot them? One Red, one Green and one Blue.<br>These are the 3 primary colors of light.",
						position: [0, 0, 0.45],
					},
				],
			},
		},
		3: {
			anims: {
				data: {
					title: "",
				},
			},
		},
	},
};
