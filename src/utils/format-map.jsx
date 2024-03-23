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


import { getArea, getLength } from "ol/sphere.js";

const formatLength = function (line) {
	const length = getLength(line);
	let output;
	if (length > 100) {
		output = Math.round((length / 1000) * 100) / 100 + " km";
	} else {
		output = Math.round(length * 100) / 100 + " m";
	}
	return output;
};

const formatArea = function (polygon) {
	const area = getArea(polygon);
	let output;
	if (area > 10000) {
		output = Math.round((area / 1000000) * 100) / 100 + " km\xB2";
	} else {
		output = Math.round(area * 100) / 100 + " m\xB2";
	}
	return output;
};

export { formatArea, formatLength };
