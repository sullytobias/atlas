import { useEffect, useRef } from "react";
import maplibregl, { Map as MLMap } from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";

export function useMapInstance(
    containerRef: React.RefObject<HTMLDivElement | null>,
    style: StyleSpecification
) {
    const mapRef = useRef<MLMap | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = new maplibregl.Map({
            container: containerRef.current,
            style,
            center: [8, 48],
            zoom: 0,
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [containerRef, style]);

    return mapRef;
}