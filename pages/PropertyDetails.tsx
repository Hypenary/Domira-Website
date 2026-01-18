
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/mockSupabase';
import { Property, UserProfile } from '../types';
import { Button } from '../components/Button';
import { ChatModal } from '../components/ChatModal';
import { BannerAd } from '../components/BannerAd';
import { 
  MapPin, Bed, Bath, Maximize, CheckCircle, Calendar, ShieldCheck, 
  Share2, Heart, User, Clock, CreditCard, Lock, X, Info, ArrowLeft, 
  Copy, Users, Landmark, ChevronRight, Star, Navigation, Bus, 
  Hospital, Shield, CloudRain, Utensils, Zap, Sofa, Waves, 
  Trophy, Sparkles, Phone, MessageSquare, ArrowUpRight, ShoppingBag,
  WashingMachine, Stethoscope, Coffee, Car
} from 'lucide-react';
import L from 'leaflet';

interface Amenity {
  id: string;
  name: string;
  type: 'mall' | 'restaurant' | 'bus' | 'laundry' | 'clinic' | 'park';
  dist: string;
  walk: string;
  drive: string;
  lat: number;
  lng: number;
}

const AREA_AMENITIES: Record<string, Amenity[]> = {
  'Alamesra': [
    { id: 'a1', name: '1Borneo Hypermall', type: 'mall', dist: '0.8km', walk: '10m', drive: '2m', lat: 6.036, lng: 116.118 },
    { id: 'a2', name: 'Alamesra Bus Terminal', type: 'bus', dist: '0.4km', walk: '5m', drive: '1m', lat: 6.034, lng: 116.143 },
    { id: 'a3', name: 'Poliklinik Alamesra', type: 'clinic', dist: '0.3km', walk: '4m', drive: '1m', lat: 6.0355, lng: 116.144 },
    { id: 'a4', name: 'DobiQueen Self-Laundry', type: 'laundry', dist: '0.1km', walk: '2m', drive: '1m', lat: 6.0352, lng: 116.1425 },
    { id: 'a5', name: 'Secret Recipe Alamesra', type: 'restaurant', dist: '0.2km', walk: '3m', drive: '1m', lat: 6.0365, lng: 116.145 },
  ],
  'Sepanggar': [
    { id: 's1', name: 'Indah Permai Mall', type: 'mall', dist: '1.2km', walk: '15m', drive: '4m', lat: 6.058, lng: 116.138 },
    { id: 's2', name: 'Sepanggar Bus Stop', type: 'bus', dist: '0.5km', walk: '6m', drive: '1m', lat: 6.054, lng: 116.145 },
    { id: 's3', name: 'Klinik Kesihatan Sepanggar', type: 'clinic', dist: '1.5km', walk: '20m', drive: '5m', lat: 6.062, lng: 116.150 },
    { id: 's4', name: 'Super Laundry Express', type: 'laundry', dist: '0.3km', walk: '4m', drive: '1m', lat: 6.056, lng: 116.141 },
    { id: 's5', name: 'SMC Indah Permai', type: 'restaurant', dist: '0.4km', walk: '5m', drive: '1m', lat: 6.057, lng: 116.140 },
  ],
  'Jesselton Quay': [
    { id: 'j1', name: 'Suria Sabah Shopping Mall', type: 'mall', dist: '0.5km', walk: '6m', drive: '2m', lat: 5.986, lng: 116.078 },
    { id: 'j2', name: 'Jesselton Point Ferry/Bus', type: 'bus', dist: '0.2km', walk: '3m', drive: '1m', lat: 5.992, lng: 116.084 },
    { id: 'j3', name: 'Gleneagles KK', type: 'clinic', dist: '2.5km', walk: '30m', drive: '8m', lat: 5.965, lng: 116.065 },
    { id: 'j4', name: 'The Laundry Room JQ', type: 'laundry', dist: '0.05km', walk: '1m', drive: '1m', lat: 5.991, lng: 116.081 },
    { id: 'j5', name: 'Wisma Merdeka Food Court', type: 'restaurant', dist: '0.8km', walk: '10m', drive: '3m', lat: 5.983, lng: 116.076 },
  ]
};

const AMENITY_ICONS = {
  mall: ShoppingBag,
  restaurant: Utensils,
  bus: Bus,
  laundry: WashingMachine,
  clinic: Stethoscope,
  park: MapPin
};

export const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAmenity, setActiveAmenity] = useState<Amenity | null>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const amenityMarkersRef = useRef<L.Marker[]>([]);

  const [bookingStatus, setBookingStatus] = useState<'idle' | 'request_sent' | 'payment_success'>('idle');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState<{show: boolean, message: string, type: 'success' | 'info'}>({ show: false, message: '', type: 'info' });

  const areaKey = useMemo(() => {
    if (!property) return 'Alamesra';
    return Object.keys(AREA_AMENITIES).find(key => property.title.includes(key) || property.address.includes(key)) || 'Alamesra';
  }, [property]);

  const amenities = useMemo(() => AREA_AMENITIES[areaKey] || AREA_AMENITIES['Alamesra'], [areaKey]);

  useEffect(() => {
    const saved = localStorage.getItem('domira_user');
    if (saved) setUser(JSON.parse(saved));

    const fetchProp = async () => {
      if (id) {
        const data = await api.properties.getById(id);
        setProperty(data || null);
        setLoading(false);
      }
    };
    fetchProp();
  }, [id]);

  // Map Initialization and Update
  useEffect(() => {
    if (property && mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([property.lat, property.lng], 15);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
      
      // Main Property Marker
      L.marker([property.lat, property.lng], {
        icon: L.divIcon({
          className: 'property-main-icon',
          html: `<div class="bg-domira-navy p-3 rounded-2xl shadow-2xl border-4 border-domira-gold scale-125 z-[100]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-domira-gold"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
          iconSize: [48, 48], iconAnchor: [24, 24]
        })
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    // Refresh Amenity Markers
    if (mapInstanceRef.current && amenities) {
      amenityMarkersRef.current.forEach(m => m.remove());
      amenityMarkersRef.current = [];

      amenities.forEach(am => {
        const marker = L.marker([am.lat, am.lng], {
          icon: L.divIcon({
            className: 'amenity-marker',
            html: `<div class="p-2 rounded-xl border-2 border-white shadow-lg transition-all duration-300 ${activeAmenity?.id === am.id ? 'bg-domira-gold scale-125 z-50' : 'bg-white text-slate-400'}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="${activeAmenity?.id === am.id ? 'text-domira-navy' : 'text-slate-400'}"><circle cx="12" cy="12" r="10"/></svg></div>`,
            iconSize: [32, 32], iconAnchor: [16, 16]
          })
        }).addTo(mapInstanceRef.current!);
        
        marker.on('click', () => setActiveAmenity(am));
        amenityMarkersRef.current.push(marker);
      });
    }
  }, [property, amenities, activeAmenity]);

  const triggerToast = (message: string, type: 'success' | 'info') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleAmenityClick = (am: Amenity) => {
    setActiveAmenity(am);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([am.lat, am.lng], 16, { duration: 1.5 });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-domira-dark"><div className="w-12 h-12 border-4 border-domira-gold border-t-transparent rounded-full animate-spin"></div></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-domira-dark text-slate-900 dark:text-white font-black uppercase tracking-widest">Property not found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-domira-dark transition-colors duration-300 pb-32">
      {showToast.show && (
         <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[150] px-8 py-3.5 rounded-2xl shadow-2xl text-white text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-md ${showToast.type === 'success' ? 'bg-green-600/90 border border-white/20' : 'bg-slate-900/90 border border-white/10'}`}>
            {showToast.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
            {showToast.message}
         </div>
      )}

      {/* Hero Navigation */}
      <div className="bg-slate-50 dark:bg-domira-deep border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 w-full md:w-auto">
             <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-domira-navy border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-domira-gold shadow-sm">
                <ArrowLeft size={20} />
             </button>
             <div className="min-w-0">
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 overflow-hidden whitespace-nowrap">
                   <Link to="/find-property" className="hover:text-domira-gold transition-colors">Marketplace</Link>
                   <ChevronRight size={10} />
                   <span className="text-domira-gold truncate">{property.category}</span>
                </nav>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase truncate">{property.title}</h1>
             </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-start md:justify-end">
             <button onClick={() => triggerToast('Link Copied!', 'success')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-domira-navy border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-domira-gold transition-all shadow-sm">
                <Share2 size={14} /> <span className="hidden sm:inline">Share</span>
             </button>
             <button onClick={() => setIsSaved(!isSaved)} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isSaved ? 'bg-red-500 text-white border-red-500' : 'bg-white dark:bg-domira-navy border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500'}`}>
                <Heart size={14} className={isSaved ? 'fill-white' : ''} /> <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
             </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-12">
            {/* Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:h-[500px]">
               <div className="md:col-span-3 rounded-[3rem] overflow-hidden relative group">
                  <img src={property.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Main" />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">Verified Reality</div>
               </div>
               <div className="flex md:flex-col gap-4">
                  {property.images.slice(1, 3).map((img, i) => (
                    <div key={i} className="flex-1 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800">
                       <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt={`View ${i}`} />
                    </div>
                  ))}
                  <button className="flex-1 rounded-[2rem] bg-slate-50 dark:bg-domira-navy border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-4 hover:border-domira-gold transition-all">
                     <Waves size={18} className="text-domira-gold mb-1" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">View All</span>
                  </button>
               </div>
            </div>

            {/* Neighborhood Explorer Section */}
            <div id="neighborhood-explorer" className="space-y-8">
               <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">Neighborhood <span className="text-domira-gold italic">Explorer</span>.</h2>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Lifestyle Proximity at {areaKey}</p>
                  </div>
                  <div className="hidden md:flex gap-4">
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><Bus size={14} className="text-blue-500"/> Mobility</div>
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><ShoppingBag size={14} className="text-domira-gold"/> Leisure</div>
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><Stethoscope size={14} className="text-red-500"/> Care</div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-[500px]">
                  {/* Amenity List Panel */}
                  <div className="md:col-span-2 bg-slate-50 dark:bg-domira-navy rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                     <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-domira-deep/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Closest Essentials</p>
                     </div>
                     <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                        {amenities.map((am) => {
                          const Icon = AMENITY_ICONS[am.type];
                          return (
                            <button 
                              key={am.id}
                              onClick={() => handleAmenityClick(am)}
                              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${activeAmenity?.id === am.id ? 'bg-domira-gold border-domira-gold shadow-xl' : 'bg-white dark:bg-domira-dark border-slate-100 dark:border-slate-800 hover:border-domira-gold'}`}
                            >
                               <div className="flex items-center gap-4">
                                  <div className={`p-2.5 rounded-xl ${activeAmenity?.id === am.id ? 'bg-domira-navy text-domira-gold' : 'bg-slate-50 dark:bg-domira-navy text-slate-400 group-hover:text-domira-gold'}`}>
                                     <Icon size={16} />
                                  </div>
                                  <div>
                                     <p className={`text-xs font-black uppercase tracking-tight ${activeAmenity?.id === am.id ? 'text-domira-navy' : 'text-slate-900 dark:text-white'}`}>{am.name}</p>
                                     <p className={`text-[9px] font-bold uppercase tracking-widest ${activeAmenity?.id === am.id ? 'text-domira-navy/60' : 'text-slate-400'}`}>{am.dist}</p>
                                  </div>
                               </div>
                               <ChevronRight size={14} className={activeAmenity?.id === am.id ? 'text-domira-navy' : 'text-slate-300 group-hover:text-domira-gold'} />
                            </button>
                          );
                        })}
                     </div>
                  </div>

                  {/* Context Map */}
                  <div className="md:col-span-3 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden relative shadow-2xl">
                     <div ref={mapContainerRef} className="absolute inset-0 z-0 h-full w-full"></div>
                     
                     {activeAmenity && (
                        <div className="absolute bottom-6 left-6 right-6 z-10 animate-in slide-in-from-bottom-4">
                           <div className="bg-domira-navy/90 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-2xl flex items-center justify-between gap-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-domira-gold rounded-xl flex items-center justify-center text-domira-navy shadow-lg">
                                    {React.createElement(AMENITY_ICONS[activeAmenity.type], { size: 20 })}
                                 </div>
                                 <div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1.5">{activeAmenity.name}</h4>
                                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                       <span className="flex items-center gap-1"><Navigation size={10} className="text-domira-gold" /> {activeAmenity.dist}</span>
                                       <span className="flex items-center gap-1"><Clock size={10} className="text-blue-400" /> Walk: {activeAmenity.walk}</span>
                                       <span className="flex items-center gap-1"><Car size={10} className="text-green-400" /> Drive: {activeAmenity.drive}</span>
                                    </div>
                                 </div>
                              </div>
                              <button onClick={() => setActiveAmenity(null)} className="p-2 text-slate-500 hover:text-white"><X size={18}/></button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Description and Lifestyle */}
            <div className="space-y-12">
               <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight flex items-center gap-3 uppercase">
                     <Info className="w-6 h-6 text-domira-gold" /> The Lifestyle Blueprint
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-[1.8] text-lg font-medium whitespace-pre-line italic border-l-4 border-domira-gold pl-8 py-2">
                    "{property.description || "Designed for maximum functionality in the heart of KK. This unit offers seamless access to campus shuttle routes and the Alamesra food hub. High-speed 100Mbps fiber-ready environment for serious students and professionals."}"
                  </p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map(am => (
                    <div key={am} className="p-5 bg-slate-50 dark:bg-domira-navy border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center gap-4 group hover:border-domira-gold/40 transition-colors shadow-sm">
                       <CheckCircle size={18} className="text-domira-gold" />
                       <span className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-widest">{am}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-28 space-y-8">
                <div className="bg-white dark:bg-domira-navy p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700"><Sparkles size={100} className="text-domira-gold" /></div>
                   <div className="mb-10 relative z-10">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 ml-1">Monthly Investment</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">RM {property.price}</span>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ Month</span>
                      </div>
                   </div>
                   <div className="space-y-6 relative z-10">
                      <Button variant="primary" fullWidth size="lg" className="py-6 font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-domira-gold/20 active:scale-95 transition-all bg-domira-gold text-domira-navy border-white/10" onClick={() => setBookingStatus('request_sent')}>
                         Confirm Viewing
                      </Button>
                      <button onClick={() => setShowPaymentModal(true)} className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-800 shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95">
                         <Lock size={14} className="text-domira-gold" /> Instant Reservation
                      </button>
                   </div>
                   <div className="pt-10 border-t border-slate-100 dark:border-slate-800/50 mt-10">
                      <div className="flex items-center gap-4 mb-6">
                         <img src={property.agent?.image} className="w-14 h-14 rounded-2xl object-cover border-2 border-domira-gold shadow-lg" alt="" />
                         <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-none mb-1">{property.agent?.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={10}/> Verified Host</p>
                         </div>
                      </div>
                      <div className="flex gap-3">
                         <button onClick={() => setIsChatOpen(true)} className="flex-1 py-4 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-domira-gold transition-all flex items-center justify-center gap-2">
                            <MessageSquare size={14} /> Message
                         </button>
                         <button className="flex-1 py-4 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-domira-gold transition-all flex items-center justify-center gap-2">
                            <Phone size={14} /> Call
                         </button>
                      </div>
                   </div>
                </div>
                {!user?.is_gold && <BannerAd user={user} />}
             </div>
          </div>
        </div>
      </main>

      {isChatOpen && <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} property={property} />}
    </div>
  );
};
