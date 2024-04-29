/*
 * Copyright Intern MSIB6 @ PT Len Industri (Persero)
 *
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INDUSTRI (PERSERO), AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INDUSTRI (PERSERO), NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INDUSTRI (PERSERO), AS APPLICABLE.
 *
 * Created Date: Monday, April 29th 2024, 8:23:05 am
 * Author: Rizki Rifani | rizkirifandi7@gmail.com <https://github.com/rizkirifandi7>
 *
 */

/**
 * @file This file contains the useZoomFeature hook which provides functionality for zooming in and out on a map.
 * @author Your Name
 */
import { useContext } from "react";
import { MapContext } from "../map/hooks/useMap";

/**
 * @function useZoomFeature
 * @description A hook that provides functionality for zooming in and out on a map.
 * @returns {Object} An object containing the following properties:
 * - handleZoom: A function to handle zooming in/out of the map.
 */
export const useZoom = () => {
	const { mapLayerRef } = useContext(MapContext);

	/**
	 * @function handleZoom
	 * @description Handles zooming in/out of the map.
	 * @param {number} value - The zoom value. Positive values zoom in, negative values zoom out.
	 */
	const handleZoom = (value) => {
		const mapLayer = mapLayerRef.current;
		const view = mapLayer.getView();
		const currentZoom = view.getZoom();
		view.animate({ zoom: currentZoom + value, duration: 500 });
	};

	return { handleZoom };
};
