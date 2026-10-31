"use client";

import { useEffect, useRef, useState } from "react";
import { info } from "@/data/info";

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const QUERY = encodeURIComponent("The Kaffe Loopie, 45 Istiqlaliyyat St, Baku");

/* Brand-tinted map style (used with an API key) */
const style = [
  { elementType: "geometry", stylers: [{ color: "#f5f1e8" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#59615b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#fbf9f4" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#ebe4d5" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#cfdacf" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#e6ece4" }],
  },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

type GMaps = {
  maps: {
    Map: new (el: HTMLElement, opts: object) => unknown;
    Marker: new (opts: object) => unknown;
    SymbolPath: { CIRCLE: number };
  };
};

function loadGoogleMaps(key: string): Promise<GMaps> {
  const w = window as unknown as { google?: GMaps; __gmaps?: Promise<GMaps> };
  if (w.google?.maps) return Promise.resolve(w.google);
  w.__gmaps ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly`;
    s.async = true;
    s.onload = () => resolve(w.google!);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return w.__gmaps;
}

/**
 * Brand-styled Google Map when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set,
 * otherwise the standard keyless embed. Loads only when scrolled near.
 */
export function CafeMap({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { rootMargin: "400px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !KEY || !ref.current) return;
    loadGoogleMaps(KEY).then((g) => {
      if (!ref.current) return;
      const map = new g.maps.Map(ref.current, {
        center: info.geo,
        zoom: 17,
        disableDefaultUI: true,
        zoomControl: true,
        styles: style,
      });
      new g.maps.Marker({
        position: info.geo,
        map,
        title: info.fullName,
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: "#2c4236",
          fillOpacity: 1,
          strokeColor: "#fbf9f4",
          strokeWeight: 4,
        },
      });
    });
  }, [visible]);

  return (
    <div
      ref={ref}
      className="relative size-full bg-surface-2"
      role="region"
      aria-label={label}
    >
      {!KEY && visible && (
        <iframe
          title={label}
          src={`https://www.google.com/maps?q=${QUERY}&z=17&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
      )}
    </div>
  );
}
