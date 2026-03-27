import { useEffect } from "react";
import type { Map as MLMap } from "maplibre-gl";

type LayerVisibilityConfig = {
    layerId: string;
    condition: boolean;
    loadingKey?: string;
};

export function useLayerVisibility(
    map: MLMap | null,
    configs: LayerVisibilityConfig[],
    onLoadingComplete?: (key: string) => void
) {
    useEffect(() => {
        if (!map) return;

        const apply = () => {
            const pendingKeys = new Set<string>();

            configs.forEach(({ layerId, condition, loadingKey }) => {
                if (!map.getLayer(layerId)) {
                    return;
                }

                const nextVisibility = condition ? "visible" : "none";
                const currentVisibility = map.getLayoutProperty(
                    layerId,
                    "visibility"
                );

                if (currentVisibility !== nextVisibility) {
                    map.setLayoutProperty(layerId, "visibility", nextVisibility);
                }

                if (loadingKey && currentVisibility !== nextVisibility) {
                    pendingKeys.add(loadingKey);
                }
            });

            if (pendingKeys.size === 0 || !onLoadingComplete) return;

            const clearPendingKeys = () => {
                pendingKeys.forEach((key) => onLoadingComplete(key));
            };

            window.requestAnimationFrame(clearPendingKeys);
        };

        if (map.isStyleLoaded()) {
            apply();
        } else {
            map.once("load", apply);
        }
    }, [map, configs, onLoadingComplete]);
}
