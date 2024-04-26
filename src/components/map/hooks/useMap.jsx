import { useEffect, useRef, useState, useCallback } from "react";

import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import { Draw, Snap, DragRotateAndZoom, defaults as defaultInteractions } from "ol/interaction.js";
import { fromLonLat, toLonLat, get } from "ol/proj";
import { Circle as CircleStyle, Stroke, Style } from "ol/style.js";
import { Overlay } from "ol";
import { unByKey } from "ol/Observable";
import { getVectorContext } from "ol/render";
import { easeOut } from "ol/easing";
import { LineString, Polygon } from "ol/geom";

import { markerStyle, styleLine } from "../data/MarkerStyle";
import { formatArea, formatLength } from "../utils/function/formatMap";

export const useMap = () => {
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
	const outputRef = useRef();
	const sketchRef = useRef();
	const sourceRef = useRef(new VectorSource());
	const vectorRef = useRef(new VectorLayer({ source: sourceRef.current, style: markerStyle }));

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
				layers: [tile, vectorRef.current],
				view: new View({
					center: fromLonLat([107.60981, -6.914744]),
					zoom: 10,
				}),
				target: mapRef.current,
				controls: [],
				extent,
				interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
			});

			map.on("moveend", () => {
				const center = map.getView().getCenter();
				const latLon = toLonLat(center);
				setLatitude(latLon[1].toFixed(6));
				setLongitude(latLon[0].toFixed(6));
			});

			sourceRef.current.on("addfeature", function (e) {
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
	 * Handles zooming in/out of the map.
	 * @param {number} value - Zoom value.
	 */
	const handleZoom = (value) => {
		const view = mapLayerRef.current.getView();
		const currentZoom = view.getZoom();
		view.animate({ zoom: currentZoom + value, duration: 500 });
	};

	/**
	 * Handles tooltip display.
	 * @param {object} geom - Geometry object.
	 * @param {Array} tooltipCoord - Coordinate array for tooltip.
	 */
	const handleTooltip = (geom, tooltipCoord) => {
		switch (geom.constructor) {
			case LineString:
				outputRef.current = formatLength(geom);
				break;
			case Polygon:
				outputRef.current = formatArea(geom) + formatLength(geom);
				break;
			default:
				return;
		}
		measureTooltipElementRef.current.style.display = "block";
		measureTooltipElementRef.current.innerHTML = outputRef.current;
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
				source: sourceRef.current,
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
				sketchRef.current = evt.feature;

				sketchRef.current.getGeometry().on("change", (evt) => {
					const geom = evt.target;
					const tooltipCoord = geom.getLastCoordinate();
					handleTooltip(geom, tooltipCoord);
				});
			});

			draw.on("drawend", () => {
				measureTooltipElementRef.current.style.display = "none";
			});

			const snap = new Snap({ source: sourceRef.current });
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

	return {
		mapRef,
		mapLayerRef,
		handleZoom,
		handleButtonClick,
		toggleOpen,
		latitude,
		longitude,
		activeButton,
		isOpen,
		removeInteractions,
		measureTooltipElementRef,
	};
};
