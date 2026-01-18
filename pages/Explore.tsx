
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { MapPin, Star, Shield, CloudRain, Utensils, Info, Navigation, Bus, Hospital, Zap, GraduationCap, X, Plus, Filter, MessageCircle, Map as MapIcon, ChevronRight, ShieldCheck, Target, MousePointer2, Compass, Crosshair } from 'lucide-react';
import { Button } from '../components/Button';
import { MapInsight } from '../types';

const INITIAL_INSIGHTS: MapInsight[] = [
  // Sabah
  { id: 'i1', area_name: 'Sepanggar', author_name: 'Amirul H.', author_avatar: 'https://picsum.photos/seed/i1/100/100', category: 'safety', lat: 6.0554, lng: 116.1424, rating: 4, comment: 'Quiet at night, very safe patrol around Indah Permai area. 4/5 safety rating.' },
  { id: 'i2', area_name: 'Alamesra', author_name: 'Sarah L.', author_avatar: 'https://picsum.photos/seed/i2/100/100', category: 'food', lat: 6.0354, lng: 116.1424, rating: 5, comment: 'Best mamak concentration in North KK. 24/7 food availability!' },
  { id: 'i3', area_name: 'Kingfisher', author_name: 'Kevin T.', author_avatar: 'https://picsum.photos/seed/i3/100/100', category: 'flood', lat: 6.0154, lng: 116.1324, rating: 2, comment: 'Flood risk during monsoon. Avoid ground floors near the river.' },
  // KL
  { id: 'i_kl1', area_name: 'Mont Kiara', author_name: 'Julian S.', author_avatar: 'https://picsum.photos/seed/kl1/100/100', category: 'safety', lat: 3.1678, lng: 101.6500, rating: 5, comment: 'Extremely safe for solo walkers. Private security everywhere.' },
  { id: 'i_kl2', area_name: 'Cheras', author_name: 'Chong W.', author_avatar: 'https://picsum.photos/seed/kl2/100/100', category: 'food', lat: 3.1073, lng: 101.7618, rating: 5, comment: 'Taman Connaught night market is the best in Malaysia. Traffic is bad though.' },
  // Penang
  { id: 'i_p1', area_name: 'Bayan Lepas', author_name: 'Mei L.', author_avatar: 'https://picsum.photos/seed/p1/100/100', category: 'ums', lat: 5.2951, lng: 100.2655, rating: 4, comment: 'Close to industrial zone and airport. Good for factory workers.' },
];

export const Explore: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const [insights, setInsights] = useState<MapInsight[]>(INITIAL_INSIGHTS);
  const [selected, setSelected] = useState<MapInsight | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [tempCoords, setTempCoords] = useState<{lat: number, lng: number} | null>(null);
  const [userLocLoading, setUserLocLoading] = useState(false);

  const filteredInsights = useMemo(() => {
    return filter === 'all' ? insights : insights.filter(i => i.category === filter);
  }, [filter, insights]);

  // Handle Automatic Geolocation Centering
  const centerOnUser = () => {
    if (!mapInstance.current) return;
    setUserLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapInstance.current?.flyTo([latitude, longitude], 13, { duration: 2 });
        setUserLocLoading(false);
      },
      (err) => {
        console.warn("Location access denied or unavailable", err);
        setUserLocLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([4.2105, 101.9758], 6); // Centered on Malaysia
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapInstance.current);

      // Map Click Handler for Pin Placement
      mapInstance.current.on('click', (e: L.LeafletMouseEvent) => {
        setTempCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        setShowAddForm(true);
        setSelected(null);
      });

      // Attempt Auto-Centering on Mount
      centerOnUser();
    }

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filteredInsights.forEach(n => {
      const colorClass = n.category === 'safety' ? 'bg-green-500' : n.category === 'flood' ? 'bg-blue-500' : n.category === 'food' ? 'bg-amber-500' : 'bg-domira-gold';
      const marker = L.marker([n.lat, n.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="${colorClass} p-1.5 rounded-full shadow-2xl border-2 border-white transform transition-all hover:scale-125 hover:z-[1000] active:scale-95"><img src="${n.author_avatar}" class="w-7 h-7 rounded-full border border-white/20"/></div>`,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        })
      }).addTo(mapInstance.current!);

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e); // Prevent map click from firing
        setSelected(n);
        setShowAddForm(false);
        if (window.innerWidth < 768) setViewMode('list');
      });
      markersRef.current.push(marker);
    });
  }, [filteredInsights]);

  const handleAddInsight = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const newInsight: MapInsight = {
      id: `custom_${Date.now()}`,
      area_name: formData.get('area') as string,
      author_name: 'Guest User',
      author_avatar: 'https://picsum.photos/seed/guest/100/100',
      category: formData.get('category') as any,
      lat: tempCoords?.lat || 0,
      lng: tempCoords?.lng || 0,
      rating: 5,
      comment: formData.get('comment') as string,
    };

    setInsights([newInsight, ...insights]);
    setShowAddForm(false);
    setTempCoords(null);
    alert("Local Insight Established. Your pin is now live on the global map.");
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row bg-white dark:bg-domira-dark overflow-hidden transition-colors relative">
      
      {/* Search & Filter HUD */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[40] w-[90%] max-w-2xl bg-white/90 dark:bg-domira-navy/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl rounded-2xl p-2 flex items-center gap-1 overflow-x-auto scrollbar-hide md:left-auto md:translate-x-0 md:right-6 md:w-auto">
         {[
           { id: 'all', label: 'All', icon: Zap },
           { id: 'safety', label: 'Safety', icon: Shield },
           { id: 'flood', label: 'Flood Risk', icon: CloudRain },
           { id: 'food', label: 'Food/Dining', icon: Utensils },
         ].map(f => (
           <button 
             key={f.id} id={`filter-${f.id}`}
             onClick={() => setFilter(f.id)}
             className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === f.id ? 'bg-domira-gold text-domira-navy shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'}`}
           >
             <f.icon size={14} /> {f.label}
           </button>
         ))}
      </div>

      {/* Side Content Panel */}
      <div className={`w-full md:w-[450px] bg-white dark:bg-domira-navy border-r border-slate-200 dark:border-slate-800 p-8 overflow-y-auto custom-scrollbar flex flex-col z-[50] transition-transform duration-500 ${viewMode === 'map' && 'max-md:translate-y-full max-md:hidden'}`}>
         <div className="mb-10 flex justify-between items-start">
            <div>
               <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2 uppercase">Neighborhood <span className="text-domira-gold italic">Explorer</span>.</h1>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Malaysia Community Intelligence</p>
            </div>
            <button onClick={() => setViewMode('map')} className="md:hidden p-3 bg-slate-100 dark:bg-slate-800 rounded-xl"><X size={20}/></button>
         </div>

         {selected ? (
           <div className="animate-in slide-in-from-left duration-300">
              <button id="back-to-directory" onClick={() => setSelected(null)} className="flex items-center gap-2 text-[10px] font-black text-domira-gold uppercase tracking-widest mb-8 group">
                 <Navigation size={12} className="rotate-[-90deg] group-hover:translate-x-[-2px] transition-transform" /> Back to Directory
              </button>
              
              <div className="bg-slate-50 dark:bg-domira-dark rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-inner relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><MessageCircle size={100} className="text-domira-gold" /></div>
                 <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <img src={selected.author_avatar} className="w-20 h-20 rounded-[2rem] object-cover border-4 border-white dark:border-domira-navy shadow-xl" alt="" />
                       <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase leading-none mb-1">{selected.author_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selected.area_name} Local</p>
                       </div>
                    </div>
                    
                    <div className="flex gap-1 mb-6">
                       {[1,2,3,4,5].map(i => <Star key={i} size={16} className={i <= selected.rating ? 'text-domira-gold fill-domira-gold' : 'text-slate-200 dark:text-slate-700'} />)}
                    </div>

                    <p className="text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic mb-8">
                       "{selected.comment}"
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white dark:bg-domira-navy rounded-2xl border border-slate-100 dark:border-slate-700">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Area</p>
                          <p className="text-[10px] font-black text-domira-gold uppercase">{selected.category}</p>
                       </div>
                       <div className="p-4 bg-white dark:bg-domira-navy rounded-2xl border border-slate-100 dark:border-slate-700">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Data Source</p>
                          <p className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1"><ShieldCheck size={10}/> Verified</p>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="mt-8 space-y-3">
                 <Link to={`/find-property?location=${selected.area_name}`}>
                    <Button variant="primary" fullWidth className="py-5 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-domira-gold/20">Explore Units in {selected.area_name}</Button>
                 </Link>
                 <button className="w-full py-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Report Discrepancy</button>
              </div>
           </div>
         ) : showAddForm ? (
           <div className="animate-in slide-in-from-right duration-300">
              <button id="cancel-insight" onClick={() => { setShowAddForm(false); setTempCoords(null); }} className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">← Cancel Placement</button>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight uppercase">Establish Local Intel</h2>
              <form id="insight-form" onSubmit={handleAddInsight} className="space-y-6">
                 <div className="p-4 bg-domira-gold/10 rounded-xl border border-domira-gold/20 flex items-center gap-3">
                    <Target className="text-domira-gold" size={20} />
                    <div>
                       <p className="text-[10px] font-black text-domira-navy uppercase">Pin Locked At</p>
                       <p className="text-[8px] font-bold text-slate-500">{tempCoords?.lat.toFixed(4)}, {tempCoords?.lng.toFixed(4)}</p>
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Precise Location Name</label>
                    <input name="area" required placeholder="e.g. Bangsar South" className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none text-sm font-bold text-slate-900 dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Topic</label>
                    <select name="category" required className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl outline-none text-sm font-bold text-slate-900 dark:text-white appearance-none cursor-pointer">
                       <option value="safety">Security/Safety</option>
                       <option value="food">Local Dining</option>
                       <option value="flood">Flood Warning</option>
                       <option value="ums">Public Transport</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Detailed Observations</label>
                    <textarea name="comment" required rows={5} className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-5 rounded-2xl outline-none text-sm font-bold text-slate-900 dark:text-white resize-none shadow-inner" placeholder="E.g. Ground floor here floods during heavy rain..."></textarea>
                 </div>
                 <Button id="submit-insight" variant="primary" fullWidth size="lg" className="py-6 font-black uppercase text-xs tracking-widest shadow-2xl shadow-domira-gold/20">Establish Pin</Button>
              </form>
           </div>
         ) : (
           <div className="space-y-6 animate-in fade-in duration-500">
              <div 
                id="add-insight-trigger"
                className="p-10 bg-slate-50 dark:bg-domira-dark/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] text-center group transition-all" 
              >
                 <div className="w-16 h-16 bg-white dark:bg-domira-navy border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                    <MousePointer2 className="text-domira-gold" size={32} />
                 </div>
                 <h3 className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tight mb-2">Tap to Pin</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Click anywhere on the map to share local intelligence about safety, food, or traffic.</p>
              </div>

              <div className="space-y-4 pt-6">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Community Reports</h4>
                 {filteredInsights.slice(0, 8).map(n => (
                   <button 
                    key={n.id} id={`insight-item-${n.id}`}
                    onClick={() => { setSelected(n); setViewMode('list'); }}
                    className="w-full text-left p-6 bg-white dark:bg-domira-dark rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-domira-gold hover:shadow-xl transition-all group flex items-center gap-5"
                   >
                      <img src={n.author_avatar} className="w-12 h-12 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all border border-slate-100 dark:border-slate-700" alt="" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                           <p className="font-black text-slate-900 dark:text-white text-sm truncate uppercase">{n.area_name}</p>
                           <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase ${n.category === 'safety' ? 'bg-green-100 text-green-600' : n.category === 'flood' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                              {n.category}
                           </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium truncate italic group-hover:text-slate-700 dark:group-hover:text-slate-300">"{n.comment}"</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-domira-gold" />
                   </button>
                 ))}
              </div>
           </div>
         )}
      </div>

      {/* Interactive Map Layer */}
      <div className="flex-1 relative bg-slate-100 dark:bg-domira-deep">
         <div ref={mapRef} id="map-container" className="absolute inset-0 z-0 h-full w-full"></div>
         
         <div className="absolute bottom-10 left-10 z-[45] flex flex-col gap-3">
            <button 
               id="center-user"
               onClick={centerOnUser}
               className={`p-5 bg-white dark:bg-domira-navy rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 text-domira-gold transition-all active:scale-95 ${userLocLoading ? 'animate-pulse' : ''}`}
               title="Center on my location"
            >
               <Crosshair size={24} />
            </button>
         </div>

         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[45] md:hidden">
            <button 
               id="view-toggle"
               onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
               className="px-10 py-5 bg-domira-navy text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-transform active:scale-95"
            >
               {viewMode === 'map' ? <><MessageCircle size={16}/> View Insights</> : <><MapIcon size={16}/> Return to Map</>}
            </button>
         </div>

         <div className="hidden md:block absolute bottom-10 right-10 z-[40] bg-white/80 dark:bg-domira-navy/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Metadata Key</h5>
            <div className="space-y-3">
               {[
                 { color: 'bg-green-500', label: 'High Security' },
                 { color: 'bg-blue-500', label: 'Flood Zone' },
                 { color: 'bg-amber-500', label: 'Food Hub' },
                 { color: 'bg-domira-gold', label: 'Mobility Link' }
               ].map(l => (
                  <div key={l.label} className="flex items-center gap-3">
                     <div className={`w-3 h-3 rounded-full ${l.color}`}></div>
                     <span className="text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{l.label}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
