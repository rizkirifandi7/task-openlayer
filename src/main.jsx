import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import MapPage from "./pages/MainPage";
import { MapContextProvider } from "./components/map/hooks/useMap";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<MapContextProvider>
			<MapPage />
		</MapContextProvider>
	</React.StrictMode>
);
