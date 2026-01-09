
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Star, Shield, CloudRain, Utensils, Info, Navigation, Bus, Hospital, Zap } from 'lucide-react';
import { Button } from '../components/Button';

const NEIGHBORHOODS = [
  { 
    id: 1, 
    name: 'Alamesra', 
    lat: 6.0354, 
    lng: 116.1424, 
    safety: 4.5, 
    flood: 'Low', 
    mamak: 'Very High',
    desc: 'Perfect for students. High density of student housing and cafes.',
    insights: {
       traffic: 'Moderate during peak',
       walkable: 'Yes (to UMS)',
       bus: 'Every 20 mins',
       emergency: 'KPJ Hospital (5 mins)'
    }
  },
  { 
    id: 2, 
    name: 'Inanam', 
    lat: 5.9912, 
    lng: 116.1287, 
    safety: 3.8, 
    flood: 'Medium', 
    mamak: 'High',
    desc: 'Bustling industrial and residential mix. Affordable local eats.',
    insights: {
       traffic: 'Heavy during rains',
       walkable: 'Limited',
       bus: 'Major terminal nearby',
       emergency: 'Clinic Kesihatan (3 mins)'
    }
  },
  { 
    id: 3, 
    name: 'Jesselton Quay', 
    lat: 5.9904, 
    lng: 116.0824, 
    safety: 5.0, 
    flood: 'None', 
    mamak: 'Medium',
    desc: 'Modern waterfront living. High security and premium facilities.',
    insights: {
       traffic: 'Light',
       walkable: 'Excellent to CBD',
       bus: 'Free Shuttle available',
       emergency: 'Gleaneagles (10 mins)'
    }
  }
];

export const Explore: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<typeof NEIGHBORHOODS[0] | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = L.map(mapRef.current).setView([6.0154, 116.1124], 12);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      NEIGHBORHOODS.forEach(n => {
        const marker = L.marker([n.lat, n.lng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="bg-domira-gold p-2 rounded-full shadow-xl border-4 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          })
        }).addTo(map);

        marker.on('click', () => setSelected(n));
      });

      return () => { map.remove(); };
    }
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-white dark:bg-domira-dark overflow-hidden transition-colors">
      <div className="w-full md:w-[450px] bg-slate-50 dark:bg-domira-navy border-r border-slate-200 dark:border-slate-800 p-8 overflow-y-auto custom-scrollbar flex flex-col">
         <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Neighborhood Explorer</h1>
            <p className="text-slate-500 font-medium text-sm">Real-time local insights for Kota Kinabalu residents.</p>
         </div>

         {selected ? (
           <div className="animate-in slide-in-from-left duration-500">
              <button onClick={() => setSelected(null)} className="text-xs font-black text-domira-gold uppercase tracking-widest mb-6 hover:underline">← Back to Overview</button>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{selected.name}</h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium mb-8 leading-relaxed italic">"{selected.desc}"</p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className="bg-white dark:bg-domira-dark p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Safety Rating</p>
                    <div className="flex items-center gap-2">
                       <Shield className="w-4 h-4 text-green-500" />
                       <span className="font-black text-slate-900 dark:text-white">{selected.safety}/5.0</span>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-domira-dark p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Flood Risk</p>
                    <div className="flex items-center gap-2">
                       <CloudRain className="w-4 h-4 text-blue-500" />
                       <span className="font-black text-slate-900 dark:text-white">{selected.flood}</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">Tenant Insights</h3>
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Bus className="w-4 h-4 text-domira-gold"/></div>
                    <div>
                       <p className="text-xs font-black text-slate-900 dark:text-white">Public Transport</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase">{selected.insights.bus}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Hospital className="w-4 h-4 text-domira-gold"/></div>
                    <div>
                       <p className="text-xs font-black text-slate-900 dark:text-white">Emergency Services</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase">{selected.insights.emergency}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Navigation className="w-4 h-4 text-domira-gold"/></div>
                    <div>
                       <p className="text-xs font-black text-slate-900 dark:text-white">Walkability</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase">{selected.insights.walkable}</p>
                    </div>
                 </div>
              </div>
              
              <Button variant="primary" fullWidth className="mt-12 py-5 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-domira-gold/20">Find Units Here</Button>
           </div>
         ) : (
           <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-domira-dark rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                 <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight mb-2">How it works?</h3>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">Click on map pins to view verified community insights for each area in Kota Kinabalu.</p>
              </div>
              <div className="grid gap-4">
                 {NEIGHBORHOODS.map(n => (
                   <button 
                    key={n.id} 
                    onClick={() => setSelected(n)}
                    className="w-full text-left p-6 bg-white dark:bg-domira-dark rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-domira-gold transition-all group flex justify-between items-center"
                   >
                      <div>
                        <p className="font-black text-slate-900 dark:text-white tracking-tight">{n.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Safe Area • {n.safety}/5.0</p>
                      </div>
                      <Navigation className="w-4 h-4 text-slate-300 group-hover:text-domira-gold transition-colors" />
                   </button>
                 ))}
              </div>
           </div>
         )}
      </div>

      <div className="flex-1 relative">
         <div ref={mapRef} className="absolute inset-0 z-0"></div>
         <div className="absolute top-6 right-6 z-10 bg-white dark:bg-domira-navy p-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-500/20">
               <Zap className="w-3.5 h-3.5 fill-green-500" /> Live Updates
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Map View: Kota Kinabalu</p>
         </div>
      </div>
    </div>
  );
};
