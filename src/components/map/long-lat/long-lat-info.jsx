/*
 * Copyright Intern MSIB6 @ PT Len Industri (Persero)
 *
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INDUSTRI (PERSERO), AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INDUSTRI (PERSERO), NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INDUSTRI (PERSERO), AS APPLICABLE.
 *
 * Created Date: Wednesday, April 24th 2024, 3:01:30 pm
 * Author: Rizki Rifani | rizkirifandi7@gmail.com <https://github.com/rizkirifandi7>
 *
 */

/**
 * @file This file contains the LongLatInfo component which is responsible for displaying longitude and latitude information.
 * @copyright Intern MSIB6 @ PT Len Industri (Persero)
 */

import PropTypes from "prop-types";

/**
 * LongLatInfo component
 * @component
 * @param {Object} props - The props object
 * @param {number} props.latitude - The latitude to display
 * @param {number} props.longitude - The longitude to display
 * @returns {JSX.Element} The rendered LongLatInfo component
 */
const LongLatInfo = ({ latitude, longitude }) => {
	return (
		<div className="absolute bottom-5 right-10 px-4 py-2 mb-4 bg-btn-bg text-white z-10 rounded-md">
			<p className="text-base font-semibold text-white">
				Latitude: {latitude} | Longitude: {longitude}
			</p>
		</div>
	);
};

LongLatInfo.propTypes = {
	latitude: PropTypes.number.isRequired,
	longitude: PropTypes.number.isRequired,
};

export default LongLatInfo;
