/*
 * Copyright Intern MSIB6 @ PT Len Industri (Persero)
 *
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INDUSTRI (PERSERO), AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INDUSTRI (PERSERO), NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INDUSTRI (PERSERO), AS APPLICABLE.
 *
 * Created Date: Wednesday, April 24th 2024, 3:28:17 pm
 * Author: Rizki Rifani | rizkirifandi7@gmail.com <https://github.com/rizkirifandi7>
 *
 */

/**
 * @file This file contains the MapContextProvider component which provides a context for map-related operations.
 * @author Rizki Rifani
 */
import { useEffect, useRef, useState, createContext, useMemo } from "react";
import PropTypes from "prop-types";

import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import { DragRotateAndZoom, defaults as defaultInteractions } from "ol/interaction.js";
import { fromLonLat, toLonLat, get } from "ol/proj";
import { Circle as CircleStyle, Stroke, Style } from "ol/style.js";
import { unByKey } from "ol/Observable";
import { getVectorContext } from "ol/render";
import { easeOut } from "ol/easing";

export const MapContext = createContext();

const markerStyle = {
	"fill-color": "rgba(255, 255, 255, 0.2)",
	"stroke-color": "#ffcc33",
	"stroke-width": 2,
	"circle-radius": 9,
	"icon-src": "https://api.iconify.design/material-symbols:location-on-rounded.svg?color=%23ffffff",
	"icon-width": 40,
	"icon-height": 40,
};

/**
 * @function MapContextProvider
 * @description A context provider for map-related operations.
 * @param {Object} props - The properties passed to this component.
 * @param {ReactNode} props.children - The children components.
 * @returns {ReactElement} The MapContext.Provider component.
 */
export const MapContextProvider = ({ children }) => {
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);

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
	 * @function flash
	 * @description Flashes a feature on the map.
	 * @param {Object} feature - The feature to flash.
	 */
	const flash = (feature) => {
		const duration = 3000;
		const start = Date.now();
		const flashGeom = feature.getGeometry().clone();
		const listenerKey = tileRef.current.on("postrender", animate);

		/**
		 * @function animate
		 * @description Animates a feature on the map.
		 * @param {Object} event - The event object.
		 */
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

	const contextValue = useMemo(
		() => ({
			mapRef,
			mapLayerRef,
			latitude,
			longitude,
			measureTooltipElementRef,
			outputRef,
			measureTooltipRef,
			sketchRef,
			snapRef,
			sourceRef,
		}),
		[
			mapRef,
			mapLayerRef,
			latitude,
			longitude,
			measureTooltipElementRef,
			outputRef,
			measureTooltipRef,
			sketchRef,
			snapRef,
			sourceRef,
		]
	);

	return <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>;
};

MapContextProvider.propTypes = {
	children: PropTypes.node,
};
