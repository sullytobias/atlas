import { useEffect } from "react";
import type { Map as MLMap } from "maplibre-gl";

type LayerVisibilityConfig = {
    layerId: string;
    condition: boolean;
};

export function useLayerVisibility(
    mapRef: React.RefObject<MLMap | null>,
    configs: LayerVisibilityConfig[]
) {
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const apply = () => {
            configs.forEach(({ layerId, condition }) => {
                if (map.getLayer(layerId)) {
                    map.setLayoutProperty(
                        layerId,
                        "visibility",
                        condition ? "visible" : "none"
                    );
                }
            });
        };

        if (map.isStyleLoaded()) {
            apply();
        } else {
            map.once("styledata", apply);
        }
    }, [mapRef, configs]);
}