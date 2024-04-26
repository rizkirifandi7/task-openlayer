import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";

const styleLine = new Style({
	fill: new Fill({
		color: "rgba(255,255,255, 0.3)",
	}),
	stroke: new Stroke({
		color: "rgba(1, 186, 239)",
		lineDash: [20, 20],
		width: 3,
	}),
	image: new CircleStyle({
		radius: 5,
		stroke: new Stroke({
			color: "rgba(1, 186, 239)",
		}),
		fill: new Fill({
			color: "rgba(1, 186, 239)",
		}),
	}),
});

const markerStyle = {
	"fill-color": "rgba(255, 255, 255, 0.2)",
	"stroke-color": "#ffcc33",
	"stroke-width": 2,
	"circle-radius": 9,
	"icon-src": "https://api.iconify.design/material-symbols:location-on-rounded.svg?color=%23ffffff",
	"icon-width": 40,
	"icon-height": 40,
};

export { styleLine, markerStyle };
