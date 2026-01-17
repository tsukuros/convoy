'use client';

import maplibregl from 'maplibre-gl';
import { mapStyle } from '@/lib/map-style';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';

type MapProps = {
  center?: [number, number];
  zoom?: number;
};

const OrikhivCoords: [number, number] = [47.5735, 35.7862];

export function MapView({ center = OrikhivCoords, zoom = 11 }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center,
      zoom,
    });

    // Add a marker for Mariupol
    new maplibregl.Marker({ color: '#ef4444' })
      .setLngLat(center)
      .setPopup(
        new maplibregl.Popup({ offset: 25 }).setHTML(
          '<div class="text-sm font-semibold">Mariupol, Ukraine</div>',
        ),
      )
      .addTo(map.current);

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
    };
  }, [center, zoom]);

  return <div ref={mapContainer} className="h-full w-full" />;
}
