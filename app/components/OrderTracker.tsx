"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LatLngTuple = [number, number];

interface OrderTrackerProps {
  address?: string;
  origin?: LatLngTuple; 
  destination: LatLngTuple; 
  onProgressComplete?: () => void;
  initialProgress?: number;
}

const DEFAULT_ORIGIN: LatLngTuple = [24.3636, 88.6084];

function MapController({ route }: { route: LatLngTuple[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (route && route.length >= 2) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { 
        padding: [40, 40], 
        maxZoom: 16,
        animate: true,
        duration: 1.5 
      });
    }
  }, [route, map]);

  return null;
}

export default function OrderTracker({ 
  address,
  origin = DEFAULT_ORIGIN,
  destination, 
  onProgressComplete, 
  initialProgress = 0 
}: OrderTrackerProps) {
  const [route, setRoute] = useState<LatLngTuple[]>([]);
  const [progress, setProgress] = useState(initialProgress);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => { 
    setMounted(true); 
  }, []);

  const fetchRoute = useCallback(async () => {
    if (!destination || (destination[0] === 0 && destination[1] === 0)) return;
    
    try {
      setError(false);
      const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
      
      const res = await fetch(url);
      const json = await res.json();

      if (json.code === "Ok" && json.routes?.[0]?.geometry?.coordinates) {
        const coords = json.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]] as LatLngTuple);
        if (coords.length > 0) coords[coords.length - 1] = destination;
        setRoute(coords);
      } else {
        throw new Error("Pathing failed");
      }
    } catch (e) {
      setError(true);
      setRoute([origin, destination]);
    }
  }, [destination, origin]);

  useEffect(() => {
    if (mounted) fetchRoute();
  }, [fetchRoute, mounted]);

  // Animation and Completion Sync
  useEffect(() => {
    if (progress >= 100) {
      onProgressComplete?.();
      return;
    }
    if (route.length === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.25; 
        return next >= 100 ? 100 : next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [route, progress, onProgressComplete]);

  const currentPos = useMemo((): LatLngTuple => {
    if (route.length === 0) return origin;
    if (progress >= 100) return destination;

    const totalSegments = route.length - 1;
    const decimalIndex = (progress / 100) * totalSegments;
    const index = Math.floor(decimalIndex);
    const fraction = decimalIndex - index;

    if (index >= totalSegments) return destination;

    const start = route[index];
    const end = route[index + 1];

    return [
      start[0] + (end[0] - start[0]) * fraction,
      start[1] + (end[1] - start[1]) * fraction
    ];
  }, [route, progress, destination, origin]);

  const icons = useMemo(() => {
    if (!mounted || typeof window === 'undefined') return null;
    return {
      rider: L.divIcon({
        html: `<div class="relative flex items-center justify-center"><div class="absolute inset-0 animate-ping rounded-full bg-[#EAB308]/30 scale-125"></div><div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));">🛵</div></div>`,
        className: "bg-transparent",
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      }),
      shop: L.divIcon({
        html: `<div style="font-size: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));">🏪</div>`, 
        className: "bg-transparent",
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      }),
      destination: L.divIcon({
        html: `<div style="font-size: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));">🏠</div>`, 
        className: "bg-transparent",
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })
    };
  }, [mounted]);

  if (!mounted || !icons) return null;

  const currentRouteIndex = Math.floor(((route.length - 1) * progress) / 100);

  return (
    <div className="w-full space-y-3 font-sans">
      
      {/* Map Window */}
      <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-[#E5E0D8] relative z-0 shadow-sm">
        <MapContainer 
          center={origin} 
          zoom={13} 
          zoomControl={false} 
          attributionControl={false}
          style={{ height: "100%", width: "100%", background: "#FAF7F2" }}
        >
          {/* Warm, cozy light tile layer */}
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          
          {route.length > 0 && (
            <>
              <MapController route={route} />
              {/* Completed Path */}
              <Polyline 
                positions={route.slice(0, currentRouteIndex + 1)} 
                pathOptions={{ color: '#EAB308', weight: 4, lineCap: 'round', opacity: 0.9 }}
              />
              {/* Remaining Path */}
              <Polyline 
                positions={route.slice(currentRouteIndex)} 
                pathOptions={{ color: '#F472B6', weight: 3, dashArray: '6, 8', opacity: 0.5 }}
              />
            </>
          )}

          <Marker position={origin} icon={icons.shop} />
          <Marker position={destination} icon={icons.destination} />
          <Marker position={currentPos} icon={icons.rider} />
        </MapContainer>

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-[1000]">
          <div className="flex items-center gap-1.5 bg-[#FFFDF9]/90 backdrop-blur-md border border-[#E5E0D8] px-2.5 py-1 rounded-xl shadow-sm">
            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-400' : 'bg-[#EAB308] animate-pulse'}`} />
            <span className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">
              {error ? 'Offline Mode' : 'Live Tracking'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-[#FFFDF9] border border-[#E5E0D8] p-4 rounded-2xl shadow-sm">
        <div className="flex justify-between items-end mb-2.5">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#F472B6] uppercase tracking-wider block">
              Delivery Route
            </span>
            <p className="text-xs text-[#78716C] font-medium truncate max-w-[200px]">
              {address || "Locating address..."}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-extrabold text-[#EAB308]">
              {Math.floor(progress)}%
            </span>
          </div>
        </div>

        {/* Smooth Warm Progress Bar */}
        <div className="h-2 w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E5E0D8]/60 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-[#EAB308] to-[#F472B6] rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

    </div>
  );
}