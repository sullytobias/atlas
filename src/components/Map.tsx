import { useMemo, useRef } from "react";
import type { StyleSpecification } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/map.css";

import { MAP_SOURCES } from "../config/mapSources";
import { MAP_LAYERS } from "../config/mapLayers";
import { useMapInstance } from "../hooks/useMapInstance";
import { useLayerVisibility } from "../hooks/useLayerVisibility";

type Props = {
    showCoastlines: boolean;
    showSatellite: boolean;
    showCapitals?: boolean;
};

export default function Map({
    showCoastlines,
    showSatellite,
    showCapitals = false,
}: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const style = useMemo<StyleSpecification>(
        () => ({
            version: 8,
            sources: MAP_SOURCES,
            layers: MAP_LAYERS,
        }),
        []
    );

    const mapRef = useMapInstance(containerRef, style);

    const visibilityConfigs = useMemo(
        () => [
            { layerId: "satellite-base", condition: showSatellite },
            { layerId: "basic-base", condition: !showSatellite },
            { layerId: "coastline", condition: showCoastlines },
            { layerId: "capitals-points", condition: showCapitals },
            {
                layerId: "capitals-labels",
                condition: showCapitals && showSatellite,
            },
        ],
        [showCoastlines, showSatellite, showCapitals]
    );

    useLayerVisibility(mapRef, visibilityConfigs);

    return <div ref={containerRef} className="map" />;
}
