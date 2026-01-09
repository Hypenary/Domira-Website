
import React, { useEffect, useState, useRef } from 'react';
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
  Trophy, Sparkles, Phone, MessageSquare
} from 'lucide-react';
import L from 'leaflet';

const MALAYSIAN_BANKS = [
  { id: 'm2u', name: 'Maybank2u', color: 'bg-[#FFD000]' },
  { id: 'cimb', name: 'CIMB Clicks', color: 'bg-[#ED1C24]' },
  { id: 'pbe', name: 'Public Bank', color: 'bg-[#C1272D]' },
  { id: 'rhb', name: 'RHB Now', color: 'bg-[#0051A0]' },
  { id: 'hlb', name: 'Hong Leong Connect', color: 'bg-[#003399]' },
];

// Neighborhood Data for Insights
const NEIGHBORHOOD_STATS: Record<string, any> = {
  'Alamesra': { safety: 4.5, flood: 'Low', mamak: 'Very High', walk: 'Excellent', bus: 'Every 20m' },
  'Sepanggar': { safety: 3.9, flood: 'Medium', mamak: 'High', walk: 'Moderate', bus: 'Every 30m' },
  'Jesselton Quay': { safety: 5.0, flood: 'None', mamak: 'Medium', walk: 'Superb', bus: 'Shuttle Avail.' },
  'Luyang': { safety: 4.2, flood: 'Low', mamak: 'High', walk: 'Good', bus: 'Regular' },
};

export const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Booking State
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'request_sent' | 'payment_success'>('idle');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  
  // Interaction State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState<{show: boolean, message: string, type: 'success' | 'info'}>({ show: false, message: '', type: 'info' });

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

  useEffect(() => {
    if (property && mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([property.lat, property.lng], 15);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      L.marker([property.lat, property.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="bg-domira-gold p-2.5 rounded-2xl shadow-2xl border-4 border-white animate-bounce-slow"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-domira-navy"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
          iconSize: [48, 48],
          iconAnchor: [24, 24]
        })
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, [property]);

  const handleRequestViewing = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('request_sent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setBookingStatus('idle'), 5000);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank) return;
    
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setShowPaymentModal(false);
      setBookingStatus('payment_success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2500);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      triggerToast('Link copied to clipboard!', 'success');
    } catch (err) {
      triggerToast('Failed to copy link.', 'info');
    }
  };

  const handleLike = () => {
    const newState = !isSaved;
    setIsSaved(newState);
    triggerToast(newState ? 'Property saved to favorites.' : 'Property removed from favorites.', newState ? 'success' : 'info');
  };

  const triggerToast = (message: string, type: 'success' | 'info') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-domira-dark"><div className="w-12 h-12 border-4 border-domira-gold border-t-transparent rounded-full animate-spin"></div></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-domira-dark text-slate-900 dark:text-white font-black uppercase tracking-widest">Property not found</div>;

  const isShared = property.category.includes('Room');
  const totalRooms = property.total_rooms || property.beds;
  const availableRooms = property.beds;
  const occupiedRooms = totalRooms - availableRooms;

  // Determine neighborhood insights based on title or address
  const areaKey = Object.keys(NEIGHBORHOOD_STATS).find(key => 
    property.title.includes(key) || property.address.includes(key)
  ) || 'Alamesra';
  const insights = NEIGHBORHOOD_STATS[areaKey];

  return (
    <div className="min-h-screen bg-white dark:bg-domira-dark transition-colors duration-300">
      {/* Dynamic Toast System */}
      {showToast.show && (
         <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-8 py-3.5 rounded-2xl shadow-2xl text-white text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-4 backdrop-blur-md ${showToast.type === 'success' ? 'bg-green-600/90 border border-white/20' : 'bg-slate-900/90 border border-white/10'}`}>
            {showToast.type === 'success' ? <CheckCircle size={18} /> : <Info size={18} />}
            {showToast.message}
         </div>
      )}

      {/* Hero Header Area */}
      <div className="bg-slate-50 dark:bg-domira-deep border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 w-full md:w-auto">
             <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-domira-navy border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-domira-gold transition-all shadow-sm">
                <ArrowLeft size={20} />
             </button>
             <div>
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                   <Link to="/" className="hover:text-domira-gold transition-colors">Home</Link>
                   <ChevronRight size={10} />
                   <Link to="/find-property" className="hover:text-domira-gold transition-colors">Listings</Link>
                   <ChevronRight size={10} />
                   <span className="text-domira-gold">{property.category}</span>
                </nav>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">{property.title}</h1>
             </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
             <button onClick={handleShare} className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-domira-navy border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-domira-gold transition-all shadow-sm">
                <Share2 size={14} /> <span className="hidden sm:inline">Share Listing</span>
             </button>
             <button onClick={handleLike} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isSaved ? 'bg-red-500 text-white' : 'bg-white dark:bg-domira-navy border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 hover:border-red-500'}`}>
                <Heart size={14} className={isSaved ? 'fill-white' : ''} /> <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save Unit'}</span>
             </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Left Column: Visuals & Core Info */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* High-End Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[600px]">
               <div className="md:col-span-3 rounded-[3rem] overflow-hidden relative group">
                  <img src={property.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Main" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-8 left-8 flex items-center gap-4">
                     <span className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
                        Main Perspective
                     </span>
                  </div>
               </div>
               <div className="hidden md:flex flex-col gap-4">
                  {property.images.slice(1, 3).map((img, i) => (
                    <div key={i} className="flex-1 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                       <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`View ${i}`} />
                    </div>
                  ))}
                  <button className="flex-1 rounded-[2rem] bg-slate-50 dark:bg-domira-navy border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-4 hover:border-domira-gold hover:bg-domira-gold/5 transition-all group">
                     <div className="w-10 h-10 bg-white dark:bg-domira-dark rounded-xl flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                        <Waves size={18} className="text-domira-gold" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">View All 12+</span>
                  </button>
               </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="bg-white dark:bg-domira-navy p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="flex flex-col items-center text-center p-4">
                  <div className="p-3 bg-slate-50 dark:bg-domira-dark rounded-2xl mb-4 border border-slate-100 dark:border-slate-700 shadow-sm"><Bed className="w-6 h-6 text-domira-gold" /></div>
                  <span className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">{property.beds}</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isShared ? 'Vacant Rooms' : 'Total Bedrooms'}</p>
               </div>
               <div className="flex flex-col items-center text-center p-4 border-l border-slate-100 dark:border-slate-800">
                  <div className="p-3 bg-slate-50 dark:bg-domira-dark rounded-2xl mb-4 border border-slate-100 dark:border-slate-700 shadow-sm"><Bath className="w-6 h-6 text-domira-gold" /></div>
                  <span className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">{property.baths}</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ensuite Bath</p>
               </div>
               <div className="flex flex-col items-center text-center p-4 border-l border-slate-100 dark:border-slate-800">
                  <div className="p-3 bg-slate-50 dark:bg-domira-dark rounded-2xl mb-4 border border-slate-100 dark:border-slate-700 shadow-sm"><Maximize className="w-6 h-6 text-domira-gold" /></div>
                  <span className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">{property.sqft}</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Sqft</p>
               </div>
               <div className="flex flex-col items-center text-center p-4 border-l border-slate-100 dark:border-slate-800">
                  <div className="p-3 bg-slate-50 dark:bg-domira-dark rounded-2xl mb-4 border border-slate-100 dark:border-slate-700 shadow-sm"><Sofa className="w-6 h-6 text-domira-gold" /></div>
                  <span className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">{property.furnished_status}</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Furnishing</p>
               </div>
            </div>

            {/* Occupancy Chart */}
            {isShared && (
               <div className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Trophy size={120} className="text-domira-gold" /></div>
                  <div className="relative z-10">
                     <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
                           <Users className="text-domira-gold" size={28} /> Shared Harmony
                        </h3>
                        <div className="px-4 py-2 bg-domira-gold/10 border border-domira-gold/30 rounded-xl text-domira-gold text-[10px] font-black uppercase tracking-widest">
                           {occupiedRooms}/{totalRooms} Occupied
                        </div>
                     </div>
                     <div className="flex h-20 w-full rounded-2xl overflow-hidden border border-white/10 mb-8 bg-white/5 shadow-inner p-1.5 gap-1.5">
                        {Array.from({ length: occupiedRooms }).map((_, i) => (
                           <div key={`occ-${i}`} className="flex-1 bg-slate-800 border border-white/5 rounded-xl flex items-center justify-center relative shadow-sm">
                              <User className="w-6 h-6 text-slate-600" />
                              <div className="absolute top-2 right-2 w-2 h-2 bg-slate-700 rounded-full"></div>
                           </div>
                        ))}
                        {Array.from({ length: availableRooms }).map((_, i) => (
                           <div key={`av-${i}`} className="flex-1 bg-domira-gold rounded-xl flex items-center justify-center relative shadow-lg group/slot cursor-pointer hover:scale-105 transition-transform duration-500">
                              <Bed className="w-6 h-6 text-domira-navy group-hover/slot:scale-110 transition-transform" />
                              <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                           </div>
                        ))}
                     </div>
                     <p className="text-sm text-slate-400 font-medium leading-relaxed">
                        Join <strong className="text-white font-black">{occupiedRooms} vetted residents</strong> in this high-end co-living space. Only <strong className="text-domira-gold font-black">{availableRooms} private rooms</strong> remain.
                     </p>
                  </div>
               </div>
            )}

            {/* Neighborhood Insights (Back!) */}
            <div className="space-y-12">
               <div>
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Navigation className="w-6 h-6 text-domira-gold" /> Local Intelligence: {areaKey}
                     </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                     <div className="bg-slate-50 dark:bg-domira-navy p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-green-500/30 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="p-3 bg-green-500/10 rounded-2xl text-green-500"><Shield size={20} /></div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Safety Rating</p>
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{insights.safety}/5.0</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">High Patrol Area</p>
                     </div>
                     <div className="bg-slate-50 dark:bg-domira-navy p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-blue-500/30 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><CloudRain size={20} /></div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flood Risk</p>
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{insights.flood}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Efficient Drainage</p>
                     </div>
                     <div className="bg-slate-50 dark:bg-domira-navy p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-domira-gold/30 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="p-3 bg-domira-gold/10 rounded-2xl text-domira-gold"><Utensils size={20} /></div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mamak Density</p>
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{insights.mamak}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Food at 3 AM</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                     <div className="flex items-center gap-3">
                        <Bus className="text-domira-gold shrink-0" size={14} />
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Bus</p>
                           <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">{insights.bus}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <Hospital className="text-domira-gold shrink-0" size={14} />
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Medical</p>
                           <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Nearby</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle className="text-domira-gold shrink-0" size={14} />
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Walkable</p>
                           <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">{insights.walk}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <Zap className="text-domira-gold shrink-0" size={14} />
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fiber</p>
                           <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Ready</p>
                        </div>
                     </div>
                  </div>

                  <div className="h-[400px] w-full rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative shadow-black/5">
                     <div ref={mapContainerRef} className="absolute inset-0 z-0"></div>
                     <div className="absolute top-6 right-6 z-10">
                        <div className="bg-white/90 dark:bg-domira-navy/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center gap-4">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Local Live</span>
                           </div>
                           <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                           <p className="text-[10px] font-black text-domira-gold uppercase tracking-widest">{areaKey} Hub</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Description & Details */}
               <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight flex items-center gap-3">
                     <Info className="w-6 h-6 text-domira-gold" /> The Residence
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-[1.8] text-lg font-medium whitespace-pre-line italic border-l-4 border-domira-gold pl-6">
                    "{property.description || "A masterfully designed residence focusing on privacy, aesthetic appeal, and community interaction. Located in Kota Kinabalu's most vibrant hub."}"
                  </p>
               </div>

               <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Property Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     {property.amenities.map(item => (
                        <div key={item} className="flex items-center bg-slate-50 dark:bg-domira-navy p-6 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-domira-gold transition-all duration-300">
                           <div className="w-8 h-8 rounded-lg bg-white dark:bg-domira-dark flex items-center justify-center shadow-sm mr-4 group-hover:bg-domira-gold group-hover:text-domira-navy transition-colors">
                              <CheckCircle size={16} />
                           </div>
                           <span className="font-bold text-xs uppercase tracking-wide text-slate-700 dark:text-slate-300">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Sneaky Ad placement 1 (Inline) */}
               {!user?.is_gold && (
                  <div className="bg-blue-600/5 border border-blue-600/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-blue-600/30 transition-all animate-in fade-in duration-1000">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                           <Zap size={32} fill="currentColor" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Ecosystem Partner</p>
                           <h4 className="text-xl font-black text-slate-900 dark:text-white">Need a Faster Connection?</h4>
                           <p className="text-xs text-slate-500 font-medium">Get 500Mbps Unifi for RM 129/mo. Zero installation fees for Domira residents.</p>
                        </div>
                     </div>
                     <button className="px-8 py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-105 transition-all">
                        Check Coverage
                     </button>
                  </div>
               )}
            </div>
          </div>

          {/* Right Column: Sticky Action Panel */}
          <div className="lg:col-span-1">
             <div className="sticky top-28 space-y-8">
                
                {/* Main Action Card */}
                <div className="bg-white dark:bg-domira-navy p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform"><Sparkles size={80} className="text-domira-gold" /></div>
                   
                   <div className="mb-10 relative z-10">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 ml-1">Monthly Investment</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">RM {property.price}</span>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ Month</span>
                      </div>
                   </div>

                   <form onSubmit={handleRequestViewing} className="space-y-6 relative z-10">
                      <div className="bg-slate-50 dark:bg-domira-dark p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
                         <div className="mb-4 border-b border-slate-200 dark:border-slate-700 pb-4">
                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Viewing Date</label>
                            <div className="relative">
                               <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-domira-gold" size={16} />
                               <input required type="date" className="w-full pl-6 bg-transparent outline-none text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest cursor-pointer" />
                            </div>
                         </div>
                         <div>
                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Session Slot</label>
                            <div className="flex items-center gap-3">
                               <Clock className="text-domira-gold shrink-0" size={16} />
                               <select className="w-full bg-transparent outline-none font-black text-xs uppercase tracking-widest text-slate-700 dark:text-white cursor-pointer appearance-none">
                                  <option>Morning (10 AM - 12 PM)</option>
                                  <option>Noon (1 PM - 3 PM)</option>
                                  <option>Evening (5 PM - 7 PM)</option>
                               </select>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4 pt-4">
                         <Button variant="primary" fullWidth size="lg" className="py-6 font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-domira-gold/20 active:scale-95 transition-all bg-domira-gold text-domira-navy border-white/10">
                            Confirm Viewing
                         </Button>
                         <button type="button" onClick={() => setShowPaymentModal(true)} className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-800 shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95">
                            <Lock size={14} className="text-domira-gold" /> Instant Reservation
                         </button>
                      </div>

                      <div className="pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-col items-center">
                         <div className="flex items-center gap-4 mb-4">
                            <img src={property.agent?.image} className="w-14 h-14 rounded-2xl object-cover border-2 border-domira-gold shadow-lg" alt="" />
                            <div>
                               <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-none mb-1">{property.agent?.name}</p>
                               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Authorized Host</p>
                            </div>
                         </div>
                         <div className="flex gap-2 w-full">
                            <button onClick={() => setIsChatOpen(true)} className="flex-1 py-3.5 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-domira-gold transition-all flex items-center justify-center gap-2">
                               <MessageSquare size={12} /> Live Chat
                            </button>
                            <button className="flex-1 py-3.5 bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-domira-gold transition-all flex items-center justify-center gap-2">
                               <Phone size={12} /> Call Landlord
                            </button>
                         </div>
                      </div>
                   </form>
                </div>

                {/* Sneaky Ad placement 2 (Sidebar) */}
                {!user?.is_gold && (
                   <BannerAd user={user} className="animate-in slide-in-from-right duration-700" />
                )}

                {/* Trust Widget */}
                <div className="bg-slate-50 dark:bg-domira-navy p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-center">
                   <div className="w-12 h-12 bg-white dark:bg-domira-dark rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <ShieldCheck size={24} className="text-green-500" />
                   </div>
                   <h5 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Escrow Protection</h5>
                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Your deposit is held securely by Domira and only released 24 hours after keys are handed over.
                   </p>
                </div>

             </div>
          </div>
        </div>
      </main>

      {/* Chat Modal Mount */}
      {isChatOpen && (
        <ChatModal 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)}
          property={property}
        />
      )}

      {/* Payment Modal Mount */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
           <div className="bg-white dark:bg-domira-navy rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
              <div className="p-10">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Reserve Unit</h3>
                    <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={24} /></button>
                 </div>
                 
                 <div className="bg-slate-50 dark:bg-domira-dark p-6 rounded-3xl mb-8 border border-slate-100 dark:border-slate-700 shadow-inner">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Rent</span>
                       <span className="font-black text-slate-900 dark:text-white">RM {property.price}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Deposit (2x)</span>
                       <span className="font-black text-slate-900 dark:text-white">RM {property.price * 2}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                       <span className="text-[11px] font-black text-domira-gold uppercase tracking-widest">Total to Pay</span>
                       <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">RM {property.price * 3}</span>
                    </div>
                 </div>

                 <div className="space-y-4 mb-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select FPX Bank</p>
                    <div className="grid grid-cols-2 gap-2">
                       {MALAYSIAN_BANKS.map(bank => (
                          <button key={bank.id} onClick={() => setSelectedBank(bank.id)} className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all text-left flex items-center gap-2 ${selectedBank === bank.id ? 'bg-domira-gold text-domira-navy border-white shadow-lg' : 'bg-slate-50 dark:bg-domira-dark border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                             <div className={`w-2 h-2 rounded-full ${bank.color}`}></div>
                             {bank.name}
                          </button>
                       ))}
                    </div>
                 </div>

                 <Button 
                    onClick={handlePayment} 
                    variant="primary" 
                    fullWidth 
                    size="lg" 
                    disabled={paymentProcessing || !selectedBank}
                    className="py-6 font-black uppercase text-xs tracking-[0.2em] shadow-2xl bg-domira-gold text-domira-navy"
                 >
                    {paymentProcessing ? 'Connecting Bank...' : 'Confirm Reservation'}
                 </Button>
                 
                 <div className="mt-8 flex items-center justify-center gap-4 opacity-50 grayscale">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/FPX_Logo.svg/1200px-FPX_Logo.svg.png" className="h-5" alt="FPX" />
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">Encrypted Gateway</p>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
