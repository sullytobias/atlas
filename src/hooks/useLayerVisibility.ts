import { useEffect } from "react";
import type { Map as MLMap } from "maplibre-gl";

type LayerVisibilityConfig = {
    layerId: string;
    condition: boolean;
    loadingKey?: string;
};

export function useLayerVisibility(
    mapRef: React.RefObject<MLMap | null>,
    configs: LayerVisibilityConfig[],
    onLoadingComplete?: (key: string) => void
) {
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const apply = () => {
            const pendingKeys = new Set<string>();

            configs.forEach(({ layerId, condition, loadingKey }) => {
                if (map.getLayer(layerId)) {
                    map.setLayoutProperty(
                        layerId,
                        "visibility",
                        condition ? "visible" : "none"
                    );
                }

                if (loadingKey) {
                    pendingKeys.add(loadingKey);
                }
            });

            if (pendingKeys.size === 0 || !onLoadingComplete) return;

            const clearPendingKeys = () => {
                pendingKeys.forEach((key) => onLoadingComplete(key));
            };

            if (map.loaded()) {
                clearPendingKeys();
            } else {
                map.once("idle", clearPendingKeys);
            }
        };

        if (map.isStyleLoaded()) {
            apply();
        } else {
            map.once("styledata", apply);
        }
    }, [mapRef, configs, onLoadingComplete]);
}
