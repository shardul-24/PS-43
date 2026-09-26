'use client';

import React, { useEffect, useState, useRef } from 'react';
import { JHARKHAND_DISTRICTS, DistrictInfo } from '@/data/seedData';
import { MapPin, Layers, Sparkles, Building2, GraduationCap, Briefcase, Filter } from 'lucide-react';

interface JharkhandMapProps {
  onSelectDistrict?: (districtName: string) => void;
  selectedDistrict?: string;
}

export function JharkhandMap({ onSelectDistrict, selectedDistrict }: JharkhandMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [activeDistrict, setActiveDistrict] = useState<DistrictInfo>(
    JHARKHAND_DISTRICTS.find((d) => d.name === (selectedDistrict || 'Ranchi')) || JHARKHAND_DISTRICTS[0]
  );
  const [filterLayer, setFilterLayer] = useState<'all' | 'water' | 'mining' | 'high_priority'>('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    let L: any;
    let isCancelled = false;

    async function initMap() {
      try {
        L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        if (isCancelled || !mapContainerRef.current) return;

        // Clean up previous instance
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Centered on Jharkhand: 23.6° N, 85.5° E, zoom level 7.5
        const map = L.map(mapContainerRef.current, {
          center: [23.65, 85.5],
          zoom: 7.5,
          minZoom: 6,
          maxZoom: 12,
          scrollWheelZoom: false,
        });

        mapInstanceRef.current = map;

        // Clean OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors | Jharkhand Samadhan Sangam',
        }).addTo(map);

        // Add markers for all 24 districts
        JHARKHAND_DISTRICTS.forEach((d) => {
          const isSelected = d.name.toLowerCase() === activeDistrict.name.toLowerCase();

          // Density-based color
          let fillColor = '#10B981'; // Green
          if (d.challengesCount > 60) fillColor = '#EF4444'; // Red
          else if (d.challengesCount > 35) fillColor = '#F59E0B'; // Amber

          const radius = Math.max(10, Math.min(26, Math.sqrt(d.challengesCount) * 2.8));

          const circle = L.circleMarker([d.latitude, d.longitude], {
            radius: isSelected ? radius + 4 : radius,
            fillColor: fillColor,
            color: isSelected ? '#0B192C' : '#FFFFFF',
            weight: isSelected ? 3 : 1.5,
            opacity: 1,
            fillOpacity: 0.85,
          }).addTo(map);

          circle.bindTooltip(`<strong>${d.name}</strong><br/>${d.challengesCount} Challenges | ${d.activeProjects} Projects`, {
            direction: 'top',
            offset: [0, -8],
          });

          circle.on('click', () => {
            setActiveDistrict(d);
            if (onSelectDistrict) onSelectDistrict(d.name);
          });
        });
      } catch (err) {
        console.error('Error initializing Leaflet map:', err);
      }
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, activeDistrict.name]);

  const handleDistrictChange = (dist: DistrictInfo) => {
    setActiveDistrict(dist);
    if (onSelectDistrict) onSelectDistrict(dist.name);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([dist.latitude, dist.longitude], 9, { duration: 0.8 });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            Jharkhand Societal Challenge Density Map
          </h3>
          <p className="text-xs text-slate-500">
            Real-time geospatial distribution of verified challenges and active university pilots across all 24 districts
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-500"></span>
            <span className="text-slate-600 font-medium">&gt; 60 High</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-600 font-medium">35-60 Mod</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 font-medium">&lt; 35 Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Canvas */}
        <div className="lg:col-span-8 relative h-[290px] sm:h-[380px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
          <div ref={mapContainerRef} className="h-full w-full z-0" />

          {/* District Quick Select Overlay */}
          <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-md rounded-lg p-1.5 sm:p-2 shadow-md border border-slate-200 text-xs max-w-[220px] sm:max-w-xs">
            <span className="font-bold text-slate-700 block text-[10px] sm:text-xs mb-0.5 sm:mb-1">Select District:</span>
            <select
              value={activeDistrict.name}
              onChange={(e) => {
                const found = JHARKHAND_DISTRICTS.find((d) => d.name === e.target.value);
                if (found) handleDistrictChange(found);
              }}
              className="w-full rounded border border-slate-300 bg-white px-1.5 sm:px-2 py-1 text-[11px] sm:text-xs text-slate-800 font-medium"
            >
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.challengesCount})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* District Detail Sidebar */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Selected District
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-0.5">{activeDistrict.name}</h4>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                {activeDistrict.activeProjects} Active Pilots
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3">
              <div className="rounded-lg bg-white p-2.5 border border-slate-200 text-center">
                <span className="block text-2xl font-black text-slate-900">
                  {activeDistrict.challengesCount}
                </span>
                <span className="text-[11px] font-medium text-slate-500">Challenges Logged</span>
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-slate-200 text-center">
                <span className="block text-2xl font-black text-emerald-600">
                  {Math.floor(activeDistrict.challengesCount * 0.72)}
                </span>
                <span className="text-[11px] font-medium text-slate-500">Govt Verified</span>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <span className="text-xs font-bold text-slate-700 block">Top Problem Sectors:</span>
              {activeDistrict.topCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-white p-1.5 rounded border border-slate-100">
                  <span className="text-slate-700 font-medium">{cat}</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {Math.max(4, Math.floor(activeDistrict.challengesCount * (0.45 - idx * 0.12)))} reports
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <button
              onClick={() => onSelectDistrict && onSelectDistrict(activeDistrict.name)}
              className="w-full rounded-lg bg-[#0B192C] px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1E3E62] transition text-center block"
            >
              Filter Challenges in {activeDistrict.name} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
