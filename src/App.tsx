import { useState } from "react";
import Map from "./components/Map";
import LayerToggles from "./components/LayerToggles";

export default function App() {
    const [showCoastlines, setShowCoastlines] = useState(false);
    const [showSatellite, setShowSatellite] = useState(false);
    const [showCapitals, setShowCapitals] = useState(false);

    return (
        <>
            <LayerToggles
                showCoastlines={showCoastlines}
                onToggleCoastlines={setShowCoastlines}
                showSatellite={showSatellite}
                onToggleSatellite={setShowSatellite}
                showCapitals={showCapitals}
                onToggleCapitals={setShowCapitals}
            />
            <Map
                showCoastlines={showCoastlines}
                showSatellite={showSatellite}
                showCapitals={showCapitals}
            />
        </>
    );
}
