/*
 * Copyright Intern MSIB6 @ PT Len Industri (Persero)
 *
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INDUSTRI (PERSERO), AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INDUSTRI (PERSERO), NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INDUSTRI (PERSERO), AS APPLICABLE.
 *
 * Created Date: Wednesday, April 24th 2024, 1:49:00 pm
 * Author: Rizki Rifani | rizkirifandi7@gmail.com <https://github.com/rizkirifandi7>
 *
 */

/**
 * @file This file contains the Draw component which is responsible for rendering the drawing controls.
 * @copyright Intern MSIB6 @ PT Len Industri (Persero)
 */

import PropTypes from "prop-types";

import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { MdOutlineDraw } from "react-icons/md";
import { PiCursorBold } from "react-icons/pi";
import { IoAnalyticsOutline } from "react-icons/io5";
import { BiPolygon, BiMapPin } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";

import Button from "../../common/components/Button";

/**
 * Draw component
 * @component
 * @param {Object} props - The props object
 * @param {Function} props.handleZoom - The function to handle zooming
 * @param {Function} props.handleButtonClick - The function to handle button clicks
 * @param {Function} props.toggleOpen - The function to toggle the open state
 * @param {string} props.activeButton - The currently active button
 * @param {boolean} props.isOpen - The open state
 * @param {Function} props.removeInteractions - The function to remove interactions
 * @returns {JSX.Element} The rendered Draw component
 */
const Draw = ({ handleZoom, handleButtonClick, toggleOpen, activeButton, isOpen, removeInteractions }) => {
	return (
		<div className="absolute top-0 right-0 h-screen z-10">
			<div className="flex flex-col justify-center items-end w-full h-full pr-5 gap-2">
				<Button className={"bg-btn-bg"} onClick={removeInteractions}>
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
					<Button onClick={toggleOpen} className={!isOpen ? "bg-btn-bg" : "bg-slate-200"}>
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
	);
};

Draw.propTypes = {
	handleZoom: PropTypes.func.isRequired,
	handleButtonClick: PropTypes.func.isRequired,
	toggleOpen: PropTypes.func.isRequired,
	activeButton: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	removeInteractions: PropTypes.func.isRequired,
};

export default Draw;
