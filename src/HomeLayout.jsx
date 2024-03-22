import { useEffect, useRef, useState, useCallback } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import { Draw, Snap } from "ol/interaction.js";
import { fromLonLat, toLonLat } from "ol/proj";
import { Circle as CircleStyle, Stroke, Style } from "ol/style.js";
import { Overlay } from "ol";
import { unByKey } from "ol/Observable";
import { getVectorContext } from "ol/render";
import { easeOut } from "ol/easing";
import { LineString, Circle, Polygon } from "ol/geom";

import {
	IconArrow,
	IconCircle,
	IconDraw,
	IconLine,
	IconPoint,
	IconPolygon,
	IconZoomIn,
	IconZoomOut,
} from "./assets/iconButton";
import Button from "./components/button";
import { markerStyle, styleLine } from "./assets/style/marker-style";
import { formatArea, formatLength } from "./utils/formatMap";

const duration = 2000;
const source = new VectorSource();

const vector = new VectorLayer({
	source: source,
	style: markerStyle,
});

const HomeLayout = () => {
	const [drawFeature, setDrawFeature] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [activeButton, setActiveButton] = useState(null);

	const mapRef = useRef();
	const mapLayerRef = useRef();
	const snapRef = useRef();
	const measureTooltipElementRef = useRef();
	const measureTooltipRef = useRef();
	const tileRef = useRef();

	const handleButtonClick = (type) => {
		addInteractions(type);
		setActiveButton(type);
	};

	const toggleOpen = () => setIsOpen(!isOpen);

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

			const map = new Map({
				layers: [tile, vector],
				view: new View({
					center: fromLonLat([107.60981, -6.914744]),
					zoom: 10,
				}),
				target: mapRef.current,
				controls: [],
			});

			map.on("moveend", () => {
				const center = map.getView().getCenter();
				const latLon = toLonLat(center);
				setLatitude(latLon[1].toFixed(6));
				setLongitude(latLon[0].toFixed(6));
			});

			source.on("addfeature", function (e) {
				flash(e.feature);
			});

			mapLayerRef.current = map;
			tileRef.current = tile;

			return () => {
				map.setTarget(null);
			};
		}
	}, []);

	const flash = (feature) => {
		const start = Date.now();
		const flashGeom = feature.getGeometry().clone();
		const listenerKey = tileRef.current.on("postrender", animate);

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

	const handleTooltip = (geom, tooltipCoord) => {
		let output;
		switch (geom.constructor) {
			case LineString:
				output = formatLength(geom);
				break;
			case Circle:
				output = formatLength(geom) + formatArea(geom);
				break;
			case Polygon:
				output = formatArea(geom) + formatLength(geom);
				break;
			default:
				return;
		}
		measureTooltipElementRef.current.style.display = "block";
		measureTooltipElementRef.current.innerHTML = output;
		measureTooltipRef.current.setPosition(tooltipCoord);
		
	};

	const addInteractions = useCallback(
		(type = "LineString") => {
			mapLayerRef.current.removeInteraction(drawFeature);
			mapLayerRef.current.removeInteraction(snapRef.current);

			const draw = new Draw({
				source,
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
				let sketch = evt.feature;

				sketch.getGeometry().on("change", (evt) => {
					const geom = evt.target;
					const tooltipCoord = geom.getLastCoordinate();
					handleTooltip(geom, tooltipCoord);
				});
			});

			draw.on("drawend", () => {
				measureTooltipElementRef.current.style.display = "none";
			});

			const snap = new Snap({ source: source });
			snapRef.current = snap;
			mapLayerRef.current.addInteraction(snap);
		},
		[drawFeature]
	);

	const removeInteractions = useCallback(() => {
		mapLayerRef.current.removeInteraction(drawFeature);
		mapLayerRef.current.removeOverlay(measureTooltipRef.current);
		setDrawFeature(null);
	}, [drawFeature]);

	// Function to handle zoom in and zoom out
	const handleZoom = (value) => {
		const view = mapLayerRef.current.getView();
		const currentZoom = view.getZoom();
		view.animate({ zoom: currentZoom + value, duration: 500 });
	};

	return (
		<div className="relative w-full h-full bg-gray-800">
			<div ref={mapRef} className="w-full h-screen p-3 rounded-md">
				<div
					ref={measureTooltipElementRef}
					className="text-white ol-tooltip ol-tooltip-measure bg-black/80 p-1 text-xs"
				/>
				<div className="absolute top-0 right-0 h-screen z-10">
					<div className="flex flex-col justify-center items-end w-full h-full pr-5 gap-2">
						<Button className={"bg-btn-bg"} onClick={() => removeInteractions()}>
							<IconArrow />
						</Button>
						<div className="bg-btn-bg rounded">
							<Button onClick={() => handleZoom(+2)}>
								<IconZoomIn />
							</Button>
							<Button onClick={() => handleZoom(-2)}>
								<IconZoomOut />
							</Button>
						</div>
						<div className="relative">
							<Button
								onClick={() => {
									toggleOpen();
									removeInteractions();
								}}
								className={!isOpen ? "bg-btn-bg" : "bg-slate-200"}
							>
								<IconDraw />
							</Button>
							<div className={`absolute right-10 bottom-0 flex gap-2 flex-col-reverse ${isOpen ? "block" : "hidden"}`}>
								<Button
									className={activeButton === "Point" ? "bg-slate-200" : "bg-btn-bg"}
									onClick={() => handleButtonClick("Point")}
								>
									<IconPoint />
								</Button>
								<Button
									className={activeButton === "LineString" ? "bg-slate-200" : "bg-btn-bg"}
									onClick={() => handleButtonClick("LineString")}
								>
									<IconLine />
								</Button>
								<Button
									className={activeButton === "Polygon" ? "bg-slate-200" : "bg-btn-bg"}
									onClick={() => handleButtonClick("Polygon")}
								>
									<IconPolygon />
								</Button>
								<Button
									className={activeButton === "Circle" ? "bg-slate-200" : "bg-btn-bg"}
									onClick={() => handleButtonClick("Circle")}
								>
									<IconCircle />
								</Button>
							</div>
						</div>
					</div>
				</div>
				<div className="absolute bottom-4 right-10 p-4 bg-transparent z-10">
					<div className="flex gap-2 bg-transparent">
						<p className="text-base font-semibold text-white">Latitude: {latitude} |</p>
						<p className="text-base font-semibold text-white">Longitude: {longitude}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeLayout;
