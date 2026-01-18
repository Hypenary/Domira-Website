
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertyCard } from '../components/PropertyCard';
import { Button } from '../components/Button';
import { Search, SlidersHorizontal, Map as MapIcon, List, X, MapPin, Check, Heart, ShieldCheck, Car, WashingMachine, UtensilsCrossed, ChevronDown, LayoutGrid, Sofa, Layers, Wind, Settings, DollarSign, Filter } from 'lucide-react';
import { api } from '../services/mockSupabase';
import { Property, UserProfile } from '../types';
import { BannerAd } from '../components/BannerAd';
import L from 'leaflet';

export const FindProperty: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filters
  const [filterText, setFilterText] = useState(searchParams.get('location') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('price') || 'any');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'any');
  const [halalFilter, setHalalFilter] = useState(false);
  const [petsFilter, setPetsFilter] = useState(false);
  const [carParkFilter, setCarParkFilter] = useState(false);
  const [laundryFilter, setLaundryFilter] = useState(false);
  const [cookingFilter, setCookingFilter] = useState(false);
  const [genderFilter, setGenderFilter] = useState('Any');
  const [furnishedFilter, setFurnishedFilter] = useState<'Any' | 'Fully' | 'Partially' | 'Unfurnished'>('Any');
  const [floorFilter, setFloorFilter] = useState<'Any' | 'High' | 'Mid' | 'Low'>('Any');
  const [balconyFilter, setBalconyFilter] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('domira_user');
    if (saved) setUser(JSON.parse(saved));
    api.properties.list().then(data => { setProperties(data); setLoading(false); });
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = filterText === '' || p.title.toLowerCase().includes(filterText.toLowerCase()) || p.address.toLowerCase().includes(filterText.toLowerCase());
      const matchesPrice = maxPrice === 'any' || p.price <= parseInt(maxPrice);
      const matchesType = typeFilter === 'any' || p.category === typeFilter;
      const matchesHalal = !halalFilter || p.halal_kitchen === true;
      const matchesPets = !petsFilter || p.pets_allowed === true;
      const matchesCarPark = !carParkFilter || p.car_park === true;
      const matchesLaundry = !laundryFilter || p.laundry === true;
      const matchesCooking = !cookingFilter || p.cooking_allowed === true;
      const matchesGender = genderFilter === 'Any' || p.gender_preference === genderFilter || p.gender_preference === 'Any';
      const matchesFurnished = furnishedFilter === 'Any' || p.furnished_status === furnishedFilter;
      const matchesFloor = floorFilter === 'Any' || p.floor_level === floorFilter;
      const matchesBalcony = !balconyFilter || p.has_balcony === true;
      return matchesSearch && matchesPrice && matchesType && matchesHalal && matchesPets && matchesCarPark && matchesLaundry && matchesCooking && matchesGender && matchesFurnished && matchesFloor && matchesBalcony;
    });
  }, [properties, filterText, maxPrice, typeFilter, halalFilter, petsFilter, carParkFilter, laundryFilter, cookingFilter, genderFilter, furnishedFilter, floorFilter, balconyFilter]);

  useEffect(() => {
    if (viewMode === 'map' && mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([6.0354, 116.1424], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
      mapInstanceRef.current = map;
    }
    if (mapInstanceRef.current) {
       mapInstanceRef.current.eachLayer((layer: any) => { if (layer instanceof L.Marker) mapInstanceRef.current?.removeLayer(layer); });
       filteredProperties.forEach(p => { L.marker([p.lat, p.lng]).bindPopup(`<b>${p.title}</b><br>RM ${p.price}`).addTo(mapInstanceRef.current!); });
    }
  }, [viewMode, filteredProperties]);

  const FilterControls = () => (
    <div className="space-y-12">
      <div className="relative group">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-domira-gold transition-colors" size={18} />
         <input 
          type="text" placeholder="Area or Building..." 
          className="w-full pl-12 pr-4 py-5 bg-slate-50 dark:bg-domira-navy border border-slate-200 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold outline-none focus:border-domira-gold transition-all shadow-inner"
          value={filterText} onChange={e => setFilterText(e.target.value)}
         />
      </div>
      <div>
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3"><DollarSign size={14} className="text-domira-gold"/> Price Ceiling</h3>
         <select className="w-full bg-slate-50 dark:bg-domira-navy border border-slate-200 dark:border-slate-800 p-5 rounded-[1.5rem] text-sm font-bold outline-none cursor-pointer" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
            <option value="any">No Budget Limit</option>
            <option value="500">RM 500 & Below</option>
            <option value="1000">RM 1,000 & Below</option>
            <option value="2000">RM 2,000 & Below</option>
         </select>
      </div>
      <div className="space-y-4">
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Must-Have Essentials</h3>
         {[
           { id: 'carPark', label: 'Car Park', icon: Car, state: carParkFilter, setter: setCarParkFilter },
           { id: 'laundry', label: 'Laundry', icon: WashingMachine, state: laundryFilter, setter: setLaundryFilter },
           { id: 'cooking', label: 'Cooking', icon: UtensilsCrossed, state: cookingFilter, setter: setCookingFilter }
         ].map(item => (
           <button key={item.id} onClick={() => item.setter(!item.state)} className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border transition-all duration-300 ${item.state ? 'bg-domira-gold/10 border-domira-gold text-domira-navy dark:text-domira-gold shadow-md' : 'bg-slate-50 dark:bg-domira-navy border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-300'}`}>
              <div className="flex items-center gap-4"><item.icon size={18}/> <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span></div>
              {item.state && <Check size={16} strokeWidth={3} />}
           </button>
         ))}
      </div>
      <div>
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Identity Preferences</h3>
         <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-domira-navy p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            {['Any', 'Male', 'Female'].map(g => (
              <button key={g} onClick={() => setGenderFilter(g)} className={`p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${genderFilter === g ? 'bg-domira-gold text-domira-navy shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{g}</button>
            ))}
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-domira-dark transition-colors duration-300 pb-20">
      <div className="bg-slate-50 dark:bg-domira-deep border-b border-slate-200 dark:border-slate-800 py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div>
             <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">The <span className="text-domira-gold italic font-black">Residence</span> Index.</h1>
             <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-3 ml-1">{filteredProperties.length} Verified results in Kota Kinabalu.</p>
           </div>
           <div className="flex items-center gap-3 w-full md:w-auto">
              <button onClick={() => setShowMobileFilters(true)} className="lg:hidden flex-1 py-4 bg-white dark:bg-domira-navy border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl">
                 <Filter size={14} className="text-domira-gold" /> Filter Tools
              </button>
              <div className="hidden md:flex bg-white dark:bg-domira-navy p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden shrink-0">
                 <button onClick={() => setViewMode('list')} className={`px-6 md:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${viewMode === 'list' ? 'bg-domira-gold text-domira-navy shadow-lg' : 'text-slate-400'}`}>
                   <List size={14}/> Grid
                 </button>
                 <button onClick={() => setViewMode('map')} className={`px-6 md:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${viewMode === 'map' ? 'bg-domira-gold text-domira-navy shadow-lg' : 'text-slate-400'}`}>
                   <MapIcon size={14}/> Map
                 </button>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-16">
           <div className="hidden lg:block w-80 space-y-12 shrink-0">
              <FilterControls />
              {!user?.is_gold && <BannerAd user={user} className="mt-16 scale-95 origin-top" />}
           </div>

           <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1,2,3,4].map(i => <div key={i} className="h-[450px] bg-slate-50 dark:bg-domira-navy rounded-[3rem] animate-pulse border border-slate-100 dark:border-slate-800"></div>)}
                </div>
              ) : viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
                  {filteredProperties.map(p => <PropertyCard key={p.id} property={p} />)}
                  {filteredProperties.length === 0 && (
                    <div className="col-span-full text-center py-32 bg-slate-50 dark:bg-domira-navy rounded-[4rem] border border-slate-100 dark:border-slate-800">
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">The index is empty.</h3>
                       <p className="text-slate-400 text-sm font-medium mt-2">Try relaxing your search terms.</p>
                       <Button variant="ghost" className="mt-8 text-domira-gold uppercase font-black text-[10px]" onClick={() => {setFilterText(''); setMaxPrice('any'); setCarParkFilter(false);}}>Reset Filters</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div ref={mapContainerRef} className="h-[600px] md:h-[800px] w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl"></div>
              )}
           </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[160] md:hidden">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in" onClick={() => setShowMobileFilters(false)}></div>
           <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-domira-navy rounded-t-[3rem] shadow-2xl p-10 space-y-8 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar border-t border-white/10">
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Search Filters</h2>
                 <button onClick={() => setShowMobileFilters(false)} className="p-3 bg-slate-100 dark:bg-domira-dark rounded-2xl text-slate-500 hover:text-red-500 transition-colors"><X size={20}/></button>
              </div>
              <FilterControls />
              <div className="pt-6">
                 <Button variant="primary" fullWidth size="lg" className="py-6 font-black uppercase text-xs tracking-widest shadow-2xl bg-domira-gold text-domira-navy" onClick={() => setShowMobileFilters(false)}>Show {filteredProperties.length} Results</Button>
              </div>
           </div>
        </div>
      )}

      {/* Mobile Map Toggle */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:hidden z-[100] animate-in slide-in-from-bottom-10 duration-700 delay-500">
         <button 
           onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
           className="px-8 py-4 bg-domira-navy dark:bg-domira-gold text-white dark:text-domira-navy rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
         >
            {viewMode === 'list' ? <><MapIcon size={16}/> Map View</> : <><List size={16}/> List View</>}
         </button>
      </div>
    </div>
  );
};
