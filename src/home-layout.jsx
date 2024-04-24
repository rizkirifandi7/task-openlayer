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


import { FiPlusCircle, FiMinusCircle  } from "react-icons/fi";
import { MdOutlineDraw } from "react-icons/md";
import { PiCursorBold } from "react-icons/pi";
import { IoAnalyticsOutline } from "react-icons/io5";
import { BiPolygon, BiMapPin  } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";

import { useMap } from "./hooks/useMap";

import Button from "./components/button";

const HomeLayout = () => {
	const {
		mapRef,
		handleZoom,
		handleButtonClick,
		toggleOpen,
		latitude,
		longitude,
		activeButton,
		isOpen,
		removeInteractions,
		measureTooltipElementRef,
	} = useMap();

	return (
		<div className="relative w-screen h-screen bg-gray-800">
			<div ref={mapRef} className="w-full h-full p-3 rounded-md">
				<div
					ref={measureTooltipElementRef}
					className="relative bg-white px-2 py-1 text-black text-sm font-semibold rounded-md shadow-md hidden"
				/>
				<div className="absolute top-0 right-0 h-screen z-10">
					<div className="flex flex-col justify-center items-end w-full h-full pr-5 gap-2">
						<Button className={"bg-btn-bg"} onClick={() => removeInteractions()}>
							<PiCursorBold />
						</Button>
						<div className="bg-btn-bg rounded">
							<Button onClick={() => handleZoom(+2)}>
								<FiPlusCircle />
							</Button>
							<Button onClick={() => handleZoom(-2)}>
								<FiMinusCircle />
							</Button>
						</div>
						<div className="relative flex flex-col gap-2">
							<Button
								onClick={() => {
									toggleOpen();
								}}
								className={!isOpen ? "bg-btn-bg" : "bg-slate-200"}
							>
								<MdOutlineDraw />
							</Button>
							<div className={`absolute right-10 bottom-0 flex gap-2 flex-col-reverse ${isOpen ? "block" : "hidden"}`}>
								<Button
									className={activeButton === "Point" ? "bg-slate-200" : "bg-btn-bg"}
									onClick={() => handleButtonClick("Point")}
								>
									<BiMapPin />
								</Button>
								<Button
									className={activeButton === "LineString" ? "bg-slate-200" : "bg-btn-bg"}
									onClick={() => handleButtonClick("LineString")}
								>
									<IoAnalyticsOutline />
								</Button>
								<Button
									className={activeButton === "Polygon" ? "bg-slate-200" : "bg-btn-bg"}
									onClick={() => handleButtonClick("Polygon")}
								>
									<BiPolygon />
								</Button>
								<Button
									className={activeButton === "Circle" ? "bg-slate-200" : "bg-btn-bg"}
									onClick={() => handleButtonClick("Circle")}
								>
									<FaRegCircle />
								</Button>
							</div>
						</div>
					</div>
				</div>
				<div className="absolute bottom-4 right-10 p-4 bg-transparent z-10">
					<p className="text-base font-semibold text-white">
						Latitude: {latitude} | Longitude: {longitude}
					</p>
				</div>
			</div>
		</div>
	);
};

export default HomeLayout;
