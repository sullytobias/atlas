import { useEffect, useRef, useState } from "react";
import maplibregl, { Map as MLMap } from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";

export function useMapInstance(
    containerRef: React.RefObject<HTMLDivElement | null>,
    style: StyleSpecification
) {
    const mapRef = useRef<MLMap | null>(null);
    const [map, setMap] = useState<MLMap | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const urlParams = new URLSearchParams(window.location.search);
        const urlLng = parseFloat(urlParams.get("lng") ?? "");
        const urlLat = parseFloat(urlParams.get("lat") ?? "");
        const urlZoom = parseFloat(urlParams.get("zoom") ?? "");
        const initialCenter: [number, number] =
            !isNaN(urlLng) && !isNaN(urlLat) ? [urlLng, urlLat] : [8, 48];
        const initialZoom = !isNaN(urlZoom) ? urlZoom : 0;

        const map = new maplibregl.Map({
            container: containerRef.current,
            style,
            center: initialCenter,
            zoom: initialZoom,
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        mapRef.current = map;
        setMap(map);

        return () => {
            map.remove();
            mapRef.current = null;
            setMap(null);
        };
    }, [containerRef, style]);

    return { map, mapRef };
}
