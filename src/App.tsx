import { useState } from "react";
import Map from "./components/Map";
import LayerToggles from "./components/LayerToggles";
import InfoBanner from "./components/InfoBanner";
import Legend from "./components/Legend";
import { CONTINENTS } from "./constants/continents";

export default function App() {
    const [showCoastlines, setShowCoastlines] = useState(false);
    const [showSatellite, setShowSatellite] = useState(false);
    const [showCapitals, setShowCapitals] = useState(false);
    const [showContinents, setShowContinents] = useState(false);

    return (
        <>
            <InfoBanner />
            <Legend isVisible={showContinents}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    {CONTINENTS.filter((c) => c.name !== "Antarctica").map(
                        (continent) => (
                            <a
                                key={continent.name}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 10px",
                                    borderRadius: "6px",
                                    backgroundColor: "rgba(0,0,0,0.03)",
                                    transition: "background-color 0.15s ease",
                                    textDecoration: "none",
                                }}
                                href={continent.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "rgba(0,0,0,0.08)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "rgba(0,0,0,0.03)";
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: "16px",
                                        height: "16px",
                                        backgroundColor: continent.color,
                                        borderRadius: "3px",
                                        marginRight: "10px",
                                        border: "1px solid rgba(0,0,0,0.1)",
                                    }}
                                ></span>
                                <span
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        marginRight: "auto",
                                    }}
                                >
                                    {continent.name}
                                </span>
                                🔗
                            </a>
                        )
                    )}
                </div>
            </Legend>
            <LayerToggles
                showContinents={showContinents}
                onToggleContinents={setShowContinents}
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
                showContinents={showContinents}
            />
        </>
    );
}
