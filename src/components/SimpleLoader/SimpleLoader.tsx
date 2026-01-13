import { useEffect, useState } from 'react';
import type maplibregl from 'maplibre-gl';
import './SimpleLoader.css';

type Props = {
  map: maplibregl.Map | null;
};

export default function SimpleLoader({ map }: Props) {
  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing map...');

  useEffect(() => {
    if (!map) return;

    let hasStyleLoaded = false;
    let hasSourcesLoaded = false;

    const checkComplete = () => {
      if (hasStyleLoaded && hasSourcesLoaded) {
        setLoadingText('Map ready');
        setIsLoading(false);
      }
    };

    const onStyleData = () => {
      if (map.isStyleLoaded()) {
        setLoadingText('Loading map data...');
        hasStyleLoaded = true;
        checkComplete();
      }
    };

    const onSourceData = (e: any) => {
      if (e.isSourceLoaded) {
        setLoadingText('Rendering map...');
        hasSourcesLoaded = true;
        checkComplete();
      }
    };

    const onIdle = () => {
      setLoadingText('Complete!');
      hasStyleLoaded = true;
      hasSourcesLoaded = true;
      setIsLoading(false);
    };

    if (map.loaded() && map.isStyleLoaded()) {
      setLoadingText('Map ready');
      setIsLoading(false);
    } else {
      map.on('styledata', onStyleData);
      map.on('sourcedata', onSourceData);
      map.once('idle', onIdle);
    }

    return () => {
      map.off('styledata', onStyleData);
      map.off('sourcedata', onSourceData);
    };
  }, [map]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className={`simple-loader ${!isLoading ? 'fade-out' : ''}`}>
      <div className="loader-container">
        <div className="globe-spinner" />
        <h2 className="loader-text">Loading Atlas</h2>
        <p className="loader-status">{loadingText}</p>
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}