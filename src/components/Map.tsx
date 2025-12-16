import { useEffect, useMemo, useRef } from "react";
import maplibregl, { Map as MLMap } from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/map.css";

type Props = {
    showCoastlines: boolean;
    showSatellite: boolean;
};

export default function Map({ showCoastlines, showSatellite }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MLMap | null>(null);

    const style = useMemo(
        () =>
            ({
                version: 8,
                sources: {
                    satellite: {
                        type: "raster",
                        tiles: [
                            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                        ],
                        tileSize: 256,
                    },
                    basic: {
                        type: "raster",
                        tiles: [
                            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                        ],
                        tileSize: 256,
                    },
                    coastline: {
                        type: "vector",
                        tiles: [
                            "https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf",
                        ],
                    },
                },
                layers: [
                    {
                        id: "basic-base",
                        type: "raster",
                        source: "basic",
                    },
                    {
                        id: "satellite-base",
                        type: "raster",
                        source: "satellite",
                    },
                    {
                        id: "coastline",
                        source: "coastline",
                        "source-layer": "countries",
                        type: "line",
                        paint: { "line-color": "#198EC8" },
                    },
                ],
            } as StyleSpecification),
        []
    );

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = new maplibregl.Map({
            container: containerRef.current,
            style,
            center: [0, 0],
            zoom: 0,
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [style]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const apply = () => {
            if (map.getLayer("satellite-base")) {
                map.setLayoutProperty(
                    "satellite-base",
                    "visibility",
                    showSatellite ? "visible" : "none"
                );
            }
            if (map.getLayer("basic-base")) {
                map.setLayoutProperty(
                    "basic-base",
                    "visibility",
                    showSatellite ? "none" : "visible"
                );
            }
            if (!map.getLayer("coastline")) return;
            map.setLayoutProperty(
                "coastline",
                "visibility",
                showCoastlines ? "visible" : "none"
            );
        };

        if (map.isStyleLoaded()) {
            apply();
        } else {
            map.once("styledata", apply);
        }
    }, [showCoastlines, showSatellite]);

    return <div ref={containerRef} className="map" />;
}
