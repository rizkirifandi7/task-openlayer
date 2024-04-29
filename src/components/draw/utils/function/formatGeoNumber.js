/*
 * Copyright Intern MSIB6 @ PT Len Industri (Persero)
 *
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INDUSTRI (PERSERO), AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INDUSTRI (PERSERO), NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INDUSTRI (PERSERO), AS APPLICABLE.
 *
 * Created Date: Friday, March 22nd 2024, 11:20:53 am
 * Author: Rizki Rifani | rizkirifandi7@gmail.com <https://github.com/rizkirifandi7>
 *
 */

/**
 * @file This file contains utility functions for formatting the area and length of geometrical features on a map.
 * @author Rizki Rifani
 */
import { getArea, getLength } from "ol/sphere.js";

/**
 * @function formatLength
 * @description Formats the length of a line.
 * @param {LineString} line - The line whose length is to be formatted.
 * @returns {string} The formatted length. If the length is more than 100, it is formatted in kilometers (km), otherwise in meters (m).
 */
const formatLength = function (line) {
	const length = getLength(line);
	let output;
	if (length > 100) {
		output = Math.round((length / 1000) * 100) / 100 + " " + "km";
	} else {
		output = Math.round(length * 100) / 100 + " " + "m";
	}
	return output;
};

/**
 * @function formatArea
 * @description Formats the area of a polygon.
 * @param {Polygon} polygon - The polygon whose area is to be formatted.
 * @returns {string} The formatted area. If the area is more than 10000, it is formatted in square kilometers (km^2), otherwise in square meters (m^2).
 */
const formatArea = function (polygon) {
	const area = getArea(polygon);
	let output;
	if (area > 10000) {
		output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
	} else {
		output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
	}
	return output;
};

export { formatArea, formatLength };
