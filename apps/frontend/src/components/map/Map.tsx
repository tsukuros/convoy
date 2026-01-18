'use client';

import maplibregl from 'maplibre-gl';
import { mapStyle } from '@/lib/map-style';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import { type Asset, AssetType } from '@/types/assets';

type MapProps = {
  center?: [number, number];
  zoom?: number;
  assets?: Asset[];
};

const OrikhivCoords: [number, number] = [35.7862, 47.5735]; // [lng, lat]

const ASSET_COLORS: Record<string, string> = {
  [AssetType.TRUCK]: '#3b82f6', // blue
  [AssetType.HELICOPTER]: '#8b5cf6', // purple
  [AssetType.DRONE]: '#06b6d4', // cyan
  [AssetType.PERSONNEL]: '#22c55e', // green
  [AssetType.SUPPLY]: '#f59e0b', // amber
};

export function MapView({ center = OrikhivCoords, zoom = 11, assets = [] }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center,
      zoom,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add scale control
    map.current.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      }),
      'bottom-left',
    );

    return () => {
      map.current?.remove();
      map.current = null;
      markersRef.current.clear();
    };
  }, [center, zoom]);

  // Update asset markers
  useEffect(() => {
    if (!map.current) return;

    const currentMarkers = markersRef.current;
    const assetIds = new Set(assets.map((a) => a.id));

    // Remove markers for assets that no longer exist
    for (const [id, marker] of currentMarkers) {
      if (!assetIds.has(id)) {
        marker.remove();
        currentMarkers.delete(id);
      }
    }

    // Add or update markers
    for (const asset of assets) {
      const existingMarker = currentMarkers.get(asset.id);
      const color = ASSET_COLORS[asset.type] || '#6b7280';

      if (existingMarker) {
        // Update position with smooth animation
        existingMarker.setLngLat(asset.position);
        // Update popup content
        existingMarker.setPopup(createPopup(asset));
      } else {
        // Create new marker
        const el = createMarkerElement(asset.type, color);
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(asset.position)
          .setPopup(createPopup(asset))
          .addTo(map.current!);

        currentMarkers.set(asset.id, marker);
      }
    }
  }, [assets]);

  return <div ref={mapContainer} className="h-full w-full" />;
}

function createMarkerElement(type: string, color: string): HTMLElement {
  const el = document.createElement('div');
  el.className = 'asset-marker';
  el.style.cssText = `
    width: 24px;
    height: 24px;
    background-color: ${color};
    border: 2px solid white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
    font-weight: bold;
  `;
  // Add icon based on type
  el.innerHTML = getTypeIcon(type);
  return el;
}

function getTypeIcon(type: string): string {
  switch (type) {
    case AssetType.TRUCK:
      return '🚛';
    case AssetType.HELICOPTER:
      return '🚁';
    case AssetType.DRONE:
      return '✈';
    case AssetType.PERSONNEL:
      return '👤';
    case AssetType.SUPPLY:
      return '📦';
    default:
      return '•';
  }
}

function createPopup(asset: Asset): maplibregl.Popup {
  return new maplibregl.Popup({ offset: 25 }).setHTML(`
    <div style="padding: 4px;">
      <div style="font-weight: bold; font-size: 14px;">${asset.callsign || asset.id}</div>
      <div style="font-size: 12px; color: #666;">
        <div>Type: ${asset.type}</div>
        <div>Status: ${asset.status}</div>
        <div>Speed: ${asset.speed.toFixed(1)} km/h</div>
        <div>Heading: ${asset.heading.toFixed(0)}°</div>
      </div>
    </div>
  `);
}
