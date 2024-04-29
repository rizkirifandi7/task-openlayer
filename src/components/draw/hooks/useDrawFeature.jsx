/*
 * Copyright Intern MSIB6 @ PT Len Industri (Persero)
 *
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INDUSTRI (PERSERO), AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INDUSTRI (PERSERO), NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INDUSTRI (PERSERO), AS APPLICABLE.
 *
 * Created Date: Monday, April 29th 2024, 9:49:01 am
 * Author: Rizki Rifani | rizkirifandi7@gmail.com <https://github.com/rizkirifandi7>
 *
 */

/**
 * @file This file contains the useDrawFeature hook which provides functionality for drawing features on a map.
 * @author Rizki Rifani
 */
import { useContext, useCallback, useState } from "react";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import { Draw, Snap } from "ol/interaction.js";
import { Overlay } from "ol";
import { LineString, Polygon } from "ol/geom";

import "ol/ol.css";
import { formatArea, formatLength } from "../utils/function/formatMap";
import { MapContext } from "../../map/hooks/useMap";

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

/**
 * @function useDrawFeature
 * @description A hook that provides functionality for drawing features on a map.
 * @returns {Object} An object containing the following properties:
 * - addInteractions: A function to add interactions to the map.
 * - handleButtonClick: A function to handle button click events.
 * - toggleOpen: A function to toggle the open status.
 * - removeInteractions: A function to remove interactions from the map.
 * - activeButton: The currently active button.
 * - isOpen: A boolean indicating whether the draw feature is open.
 */
export const useDrawFeature = () => {
	const { mapLayerRef, measureTooltipElementRef, outputRef, measureTooltipRef, sketchRef, sourceRef, snapRef } =
		useContext(MapContext);

	const [drawFeature, setDrawFeature] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [activeButton, setActiveButton] = useState(null);

	/**
	 * @function handleButtonClick
	 * @description Handles button click events.
	 * @param {string} type - The type of the button clicked.
	 */
	const handleButtonClick = (type) => {
		addInteractions(type);
		setActiveButton(type);
	};

	/**
	 * @function toggleOpen
	 * @description Toggles the open status.
	 */
	const toggleOpen = () => setIsOpen(!isOpen);

	/**
	 * @function handleTooltip
	 * @description Handles tooltip display.
	 * @param {Object} geom - The geometry object.
	 * @param {Array} tooltipCoord - The coordinate array for the tooltip.
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
	 * @function addInteractions
	 * @description Adds interaction to the map.
	 * @param {string} [type="LineString"] - The type of interaction to add.
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
	 * @function removeInteractions
	 * @description Removes interaction from the map.
	 */
	const removeInteractions = useCallback(() => {
		mapLayerRef.current.removeInteraction(drawFeature);
		mapLayerRef.current.removeOverlay(measureTooltipRef.current);
		setDrawFeature(null);
	}, [drawFeature]);

	return {
		addInteractions,
		handleButtonClick,
		toggleOpen,
		removeInteractions,
		activeButton,
		isOpen,
	};
};
