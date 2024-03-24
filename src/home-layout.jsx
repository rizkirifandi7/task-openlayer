/*
 * Copyright Intern MSIB6 @ PT Len Industri (Persero)
 *
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INDUSTRI (PERSERO), AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INDUSTRI (PERSERO), NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INDUSTRI (PERSERO), AS APPLICABLE.
 *
 * Created Date: Friday, March 22nd 2024, 9:11:41 am
 * Author: Rizki Rifani | rizkirifandi7@gmail.com <https://github.com/rizkirifandi7>
 *
 */

import { useEffect, useRef, useState, useCallback } from "react";

import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import { Draw, Snap } from "ol/interaction.js";
import { fromLonLat, toLonLat } from "ol/proj";
import { Circle as CircleStyle, Stroke, Style } from "ol/style.js";
import { Overlay } from "ol";
import { unByKey } from "ol/Observable";
import { getVectorContext } from "ol/render";
import { easeOut } from "ol/easing";
import { LineString, Polygon } from "ol/geom";

import {
	IconArrow,
	IconCircle,
	IconDraw,
	IconLine,
	IconPoint,
	IconPolygon,
	IconZoomIn,
	IconZoomOut,
} from "./assets/icon-button";
import Button from "./components/button";
import { markerStyle, styleLine } from "./constant/marker-style";
import { formatArea, formatLength } from "./utils/format-map";
import { get } from "ol/proj.js";

/**
 * Represents the vector source for features.
 * @type {object}
 */
const source = new VectorSource();

/**
 * Represents the vector layer for displaying features on the map.
 * @type {object}
 */
const vector = new VectorLayer({
	source: source,
	style: markerStyle,
});

const HomeLayout = () => {
	const [drawFeature, setDrawFeature] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [activeButton, setActiveButton] = useState(null);

	const mapRef = useRef();
	const mapLayerRef = useRef();
	const snapRef = useRef();
	const measureTooltipElementRef = useRef();
	const measureTooltipRef = useRef();
	const tileRef = useRef();

	/**
	 * Handles button click event.
	 * @param {string} type - Type of the button clicked.
	 */
	const handleButtonClick = (type) => {
		addInteractions(type);
		setActiveButton(type);
	};

	/**
	 * Toggles the open status.
	 */
	const toggleOpen = () => setIsOpen(!isOpen);

	useEffect(() => {
		if (mapRef.current) {
			const tile = new TileLayer({ source: new OSM() });

			tile.on("prerender", (evt) => {
				if (evt.context) {
					const context = evt.context;
					context.filter = "grayscale(80%) invert(100%) ";
					context.globalCompositeOperation = "source-over";
				}
			});

			tile.on("postrender", (evt) => {
				if (evt.context) {
					const context = evt.context;
					context.filter = "none";
				}
			});

			const extent = get("EPSG:3857").getExtent().slice();
			extent[0] += extent[0];
			extent[2] += extent[2];

			const map = new Map({
				layers: [tile, vector],
				view: new View({
					center: fromLonLat([107.60981, -6.914744]),
					zoom: 10,
				}),
				target: mapRef.current,
				controls: [],
			});

			map.on("moveend", () => {
				const center = map.getView().getCenter();
				const latLon = toLonLat(center);
				setLatitude(latLon[1].toFixed(6));
				setLongitude(latLon[0].toFixed(6));
			});

			source.on("addfeature", function (e) {
				flash(e.feature);
			});

			mapLayerRef.current = map;
			tileRef.current = tile;

			return () => {
				map.setTarget(null);
			};
		}
	}, []);

	/**
	 * Flashes a feature on the map.
	 * @param {object} feature - The feature to flash.
	 */
	const flash = (feature) => {
		const duration = 3000;
		const start = Date.now();
		const flashGeom = feature.getGeometry().clone();
		const listenerKey = tileRef.current.on("postrender", animate);

		function animate(event) {
			const frameState = event.frameState;
			const elapsed = frameState.time - start;
			const vectorContext = getVectorContext(event);
			const elapsedRatio = elapsed / duration;
			const radius = easeOut(elapsedRatio) * 50 + 5;
			const opacity = easeOut(1 - elapsedRatio);

			const style = new Style({
				image: new CircleStyle({
					radius: radius,
					stroke: new Stroke({
						color: "rgba(255, 0, 0, " + opacity + ")",
						width: 0.25 + opacity,
					}),
				}),
			});

			vectorContext.setStyle(style);
			vectorContext.drawGeometry(flashGeom);
			mapLayerRef.current.render();

			if (elapsed >= duration) {
				unByKey(listenerKey);
				flash(feature);
			}
		}
	};

	/**
	 * Handles tooltip display.
	 * @param {object} geom - Geometry object.
	 * @param {Array} tooltipCoord - Coordinate array for tooltip.
	 */
	const handleTooltip = (geom, tooltipCoord) => {
		let output;
		switch (geom.constructor) {
			case LineString:
				output = formatLength(geom);
				break;
			case Polygon:
				output = formatArea(geom) + formatLength(geom);
				break;
			default:
				return;
		}
		measureTooltipElementRef.current.style.display = "block";
		measureTooltipElementRef.current.innerHTML = output;
		measureTooltipRef.current.setPosition(tooltipCoord);
	};

	/**
	 * Adds interaction to the map.
	 * @param {string} [type="LineString"] - Type of interaction to add.
	 *
	 */
	const addInteractions = useCallback(
		(type = "LineString") => {
			mapLayerRef.current.removeInteraction(drawFeature);
			mapLayerRef.current.removeInteraction(snapRef.current);

			const draw = new Draw({
				source,
				type: type,
				style: styleLine,
			});

			setDrawFeature(draw);
			mapLayerRef.current.addInteraction(draw);

			measureTooltipRef.current = new Overlay({
				element: measureTooltipElementRef.current,
				offset: [15, -15],
				positioning: "bottom-center",
				stopEvent: false,
				insertFirst: false,
			});

			mapLayerRef.current.addOverlay(measureTooltipRef.current);

			draw.on("drawstart", (evt) => {
				let sketch = evt.feature;

				sketch.getGeometry().on("change", (evt) => {
					const geom = evt.target;
					const tooltipCoord = geom.getLastCoordinate();
					handleTooltip(geom, tooltipCoord);
				});
			});

			draw.on("drawend", () => {
				measureTooltipElementRef.current.style.display = "none";
			});

			const snap = new Snap({ source: source });
			snapRef.current = snap;
			mapLayerRef.current.addInteraction(snap);
		},
		[drawFeature]
	);

	/**
	 * Removes interaction from the map.
	 */
	const removeInteractions = useCallback(() => {
		mapLayerRef.current.removeInteraction(drawFeature);
		mapLayerRef.current.removeOverlay(measureTooltipRef.current);
		setDrawFeature(null);
	}, [drawFeature]);

	/**
	 * Handles zooming in/out of the map.
	 * @param {number} value - Zoom value.
	 */
	const handleZoom = (value) => {
		const view = mapLayerRef.current.getView();
		const currentZoom = view.getZoom();
		view.animate({ zoom: currentZoom + value, duration: 500 });
	};

	return (
		<div className="relative w-screen h-screen bg-gray-800">
			<div
				ref={measureTooltipElementRef}
				className="absolute bg-white w-20 h-8 p-2 text-black text-sm font-semibold rounded-md shadow-md hidden"
			/>
			<div ref={mapRef} className="w-full h-full p-3 rounded-md">
				<div className="absolute top-0 right-0 h-screen z-10">
					<div className="flex flex-col justify-center items-end w-full h-full pr-5 gap-2">
						<Button className={"bg-btn-bg"} onClick={() => removeInteractions()}>
							<IconArrow />
						</Button>
						<div className="bg-btn-bg rounded">
							<Button onClick={() => handleZoom(+2)}>
								<IconZoomIn />
							</Button>
							<Button onClick={() => handleZoom(-2)}>
								<IconZoomOut />
							</Button>
						</div>
						<div className="relative">
							<Button
								onClick={() => {
									toggleOpen();
								}}
								className={!isOpen ? "bg-btn-bg" : "bg-slate-200"}
							>
								<IconDraw />
							</Button>
							<div className={`absolute right-10 bottom-0 flex gap-2 flex-col-reverse ${isOpen ? "block" : "hidden"}`}>
								<Button
									className={activeButton === "Point" ? "bg-slate-200" : "bg-btn-bg"}
									onClick={() => handleButtonClick("Point")}
								>
									<IconPoint />
								</Button>
								<Button
									className={activeButton === "LineString" ? "bg-slate-200" : "bg-btn-bg"}
									onClick={() => handleButtonClick("LineString")}
								>
									<IconLine />
								</Button>
								<Button
									className={activeButton === "Polygon" ? "bg-slate-200" : "bg-btn-bg"}
									onClick={() => handleButtonClick("Polygon")}
								>
									<IconPolygon />
								</Button>
								<Button
									className={activeButton === "Circle" ? "bg-slate-200" : "bg-btn-bg"}
									onClick={() => handleButtonClick("Circle")}
								>
									<IconCircle />
								</Button>
							</div>
						</div>
					</div>
				</div>
				<div className="absolute bottom-4 right-10 p-4 bg-transparent z-10">
					<div className="flex gap-2 bg-transparent">
						<p className="text-base font-semibold text-white">Latitude: {latitude} |</p>
						<p className="text-base font-semibold text-white">Longitude: {longitude}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeLayout;
