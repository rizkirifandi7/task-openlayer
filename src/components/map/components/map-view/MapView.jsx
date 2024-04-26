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

/**
 * @file This file contains the MapLayout component which is responsible for rendering the map layout.
 * @copyright Intern MSIB6 @ PT Len Industri (Persero)
 */

import { useMap } from "../../hooks/useMap";
import Draw from "../draw/DrawVector";
import LongLatInfo from "../long-lat/LongLatInfo";
import Tooltip from "../tooltip/TooltipMeasure";

/**
 * MapLayout component
 * @component
 * @returns {JSX.Element} The rendered MapLayout component
 */
const MapView = () => {
	const {
		mapRef,
		latitude,
		longitude,
		measureTooltipElementRef,
		handleZoom,
		handleButtonClick,
		toggleOpen,
		activeButton,
		isOpen,
		removeInteractions,
	} = useMap();

	return (
		<div className="relative w-screen h-screen bg-gray-800">
			<div ref={mapRef} className="w-full h-full p-3 rounded-md">
				{/* Tooltip for measurement */}
				<Tooltip measureTooltipElementRef={measureTooltipElementRef} />
				{/* Draw component with handlers and state */}
				<Draw
					handleZoom={handleZoom}
					handleButtonClick={handleButtonClick}
					toggleOpen={toggleOpen}
					activeButton={activeButton}
					isOpen={isOpen}
					removeInteractions={removeInteractions}
				/>
				{/* Display latitude and longitude */}
				<LongLatInfo latitude={latitude} longitude={longitude} />
			</div>
		</div>
	);
};

export default MapView;
