/*
 * Copyright Intern MSIB6 @ PT Len Industri (Persero)
 *
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INDUSTRI (PERSERO), AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INDUSTRI (PERSERO), NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INDUSTRI (PERSERO), AS APPLICABLE.
 *
 * Created Date: Wednesday, April 24th 2024, 3:41:37 pm
 * Author: Rizki Rifani | rizkirifandi7@gmail.com <https://github.com/rizkirifandi7>
 *
 */

/**
 * @file This file contains the Tooltip component which is responsible for rendering a tooltip.
 * @copyright Intern MSIB6 @ PT Len Industri (Persero)
 */

import PropTypes from "prop-types";

/**
 * Tooltip component
 * @component
 * @param {Object} props - The props object
 * @param {React.RefObject} props.measureTooltipElementRef - The ref to the tooltip element
 * @returns {JSX.Element} The rendered Tooltip component
 */
const Tooltip = ({ measureTooltipElementRef }) => {
	return (
		<div
			ref={measureTooltipElementRef}
			className="relative bg-white px-2 py-1 text-black text-sm font-semibold rounded-md shadow-md hidden"
		/>
	);
};

Tooltip.propTypes = {
	measureTooltipElementRef: PropTypes.object.isRequired,
};

export default Tooltip;
