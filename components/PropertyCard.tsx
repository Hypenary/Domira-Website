import React from 'react';
import { Property } from '../types';
import { MapPin, ShieldCheck, Bed, Bath, Maximize } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="group bg-white dark:bg-domira-navy rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-domira-gold/30 transition-all duration-500 overflow-hidden flex flex-col h-full">
      <div className="relative h-60 overflow-hidden">
        <img 
          src={property.images[0]} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {property.is_verified && (
          <div className="absolute top-4 left-4 bg-domira-gold text-domira-navy px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-xl">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </div>
        )}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">
          {property.category}
        </div>
        <div className="absolute bottom-4 left-4">
           <div className="bg-white dark:bg-domira-navy px-4 py-2 rounded-2xl shadow-2xl border border-white/10 glass">
              <p className="text-xl font-black text-slate-900 dark:text-white">RM {property.price}<span className="text-[10px] text-slate-400 font-bold">/mo</span></p>
           </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-domira-gold transition-colors">{property.title}</h3>
        
        <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-bold mb-6">
          <MapPin className="w-3.5 h-3.5 mr-1 text-domira-gold shrink-0" />
          <span className="truncate">{property.address}</span>
        </div>

        <div className="flex justify-between py-6 border-y border-slate-100 dark:border-slate-800/50 mb-8">
          <div className="flex flex-col items-center gap-1">
            <Bed className="w-4 h-4 text-domira-gold" />
            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">{property.beds} {property.category.includes('Room') ? 'Vacant' : 'Beds'}</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-slate-100 dark:border-slate-800/50 px-6">
            <Bath className="w-4 h-4 text-domira-gold" />
            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">{property.baths} Bath</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Maximize className="w-4 h-4 text-domira-gold" />
            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">{property.sqft} sqft</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <Link to={`/property/${property.id}`}>
             <Button variant="primary" fullWidth size="lg" className="font-black uppercase text-[10px] tracking-widest shadow-lg shadow-domira-gold/10 active:scale-95 transition-all">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};