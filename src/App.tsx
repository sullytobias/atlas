import { useState } from "react";
import Map from "./components/Map";
import LayerToggles from "./components/LayerToggles";

export default function App() {
    const [showCoastlines, setShowCoastlines] = useState(false);
    const [showSatellite, setShowSatellite] = useState(false);

    return (
        <>
            <LayerToggles
                showCoastlines={showCoastlines}
                onToggleCoastlines={setShowCoastlines}
                showSatellite={showSatellite}
                onToggleSatellite={setShowSatellite}
            />
            <Map
                showCoastlines={showCoastlines}
                showSatellite={showSatellite}
            />
        </>
    );
}
