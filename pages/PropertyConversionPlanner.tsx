
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  ArrowLeft, 
  Zap, 
  CheckCircle2, 
  Building, 
  Layers, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  Wind, 
  Wrench, 
  Wifi, 
  FireExtinguisher,
  LayoutGrid,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/Button';

const CHECKLIST_ITEMS = [
  { id: 'c1', category: 'Legal & Council', text: 'Obtain DBKK/Local Council renovation permit for partitioning.', mandatory: true },
  { id: 'c2', category: 'Fire Safety', text: 'Install Bomba-approved smoke detectors in every bedroom.', mandatory: true },
  { id: 'c3', category: 'Fire Safety', text: 'Provide 9kg Dry Powder fire extinguisher in kitchen area.', mandatory: true },
  { id: 'c4', category: 'Amenity', text: 'Install high-speed Time/Unifi Fiber (min 100Mbps).', mandatory: false },
  { id: 'c5', category: 'Amenity', text: 'Separate electrical meters (sub-meters) for each room AC.', mandatory: false },
  { id: 'c6', category: 'Amenity', text: 'Fully-equipped halal kitchen with separate storage.', mandatory: true },
  { id: 'c7', category: 'Privacy', text: 'Replace all internal door handles with key-locking sets.', mandatory: true },
  { id: 'c8', category: 'Hygiene', text: 'Weekly communal cleaning contract established.', mandatory: false },
];

export const PropertyConversionPlanner: React.FC = () => {
  const [originalRooms, setOriginalRooms] = useState(3);
  const [originalRent, setOriginalRent] = useState(1500);
  const [addedPartitions, setAddedPartitions] = useState(1);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  
  const avgRoomRent = 650; // Average KK student room rent

  const calculations = useMemo(() => {
    const totalRooms = originalRooms + addedPartitions;
    const hmoRevenue = totalRooms * avgRoomRent;
    const surplus = hmoRevenue - originalRent;
    const annualSurplus = surplus * 12;
    const estConversionCost = addedPartitions * 2500 + 2000; // Partition + basic furnishing
    const paybackMonths = Math.ceil(estConversionCost / surplus);

    return {
      totalRooms,
      hmoRevenue,
      surplus,
      annualSurplus,
      paybackMonths
    };
  }, [originalRooms, originalRent, addedPartitions]);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const progress = Math.round((checkedItems.length / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="min-h-screen bg-white dark:bg-domira-dark transition-colors duration-300 pb-20">
      <div className="bg-domira-navy pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-domira-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link to="/for-landlords" className="inline-flex items-center text-slate-400 hover:text-domira-gold mb-8 font-black uppercase text-[10px] tracking-widest transition-all">
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
             <div className="max-w-2xl">
                <div className="inline-flex gap-2 px-4 py-2 bg-domira-gold/10 border border-domira-gold/20 rounded-full text-domira-gold text-[10px] font-black uppercase tracking-widest mb-6">
                  <Calculator size={14} className="fill-domira-gold" /> ROI Accelerator Tool
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none uppercase">Conversion <span className="text-domira-gold italic">Planner</span>.</h1>
                <p className="text-xl text-slate-400 font-medium leading-relaxed">
                   Turn your standard family terrace or condo into a high-yield student shared house (HMO) with our data-driven projection tool.
                </p>
             </div>
             
             <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 glass w-full md:w-80">
                <div className="flex justify-between items-center mb-6">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Readiness Score</p>
                   <p className="text-2xl font-black text-domira-gold">{progress}%</p>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                   <div className="h-full bg-domira-gold transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Complete the checklist below to reach 100%.</p>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Calculator Column */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-domira-navy p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-3">
                    <TrendingUp className="text-domira-gold" /> Yield Estimator (KK Market)
                 </h2>
                 
                 <div className="grid md:grid-cols-2 gap-12 mb-12">
                    <div className="space-y-8">
                       <div>
                          <div className="flex justify-between mb-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Original Bedrooms</label>
                             <span className="font-black text-slate-900 dark:text-white">{originalRooms}</span>
                          </div>
                          <input 
                            type="range" min="1" max="5" 
                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-domira-gold"
                            value={originalRooms} onChange={(e) => setOriginalRooms(parseInt(e.target.value))}
                          />
                       </div>
                       <div>
                          <div className="flex justify-between mb-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Proposed Partitions</label>
                             <span className="font-black text-domira-gold">+{addedPartitions}</span>
                          </div>
                          <input 
                            type="range" min="0" max="3" 
                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-domira-gold"
                            value={addedPartitions} onChange={(e) => setAddedPartitions(parseInt(e.target.value))}
                          />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Current Family Rent (RM)</label>
                          <input 
                            type="number" 
                            className="w-full bg-slate-50 dark:bg-domira-dark border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white font-black"
                            value={originalRent} onChange={(e) => setOriginalRent(parseInt(e.target.value) || 0)}
                          />
                       </div>
                    </div>

                    <div className="bg-domira-gold/5 border-2 border-domira-gold/20 rounded-[2.5rem] p-8 flex flex-col justify-between">
                       <div>
                          <h4 className="text-[10px] font-black text-domira-gold uppercase tracking-widest mb-8">Estimated HMO Yield</h4>
                          <div className="space-y-6">
                             <div className="flex justify-between items-end border-b border-domira-gold/10 pb-4">
                                <span className="text-slate-500 text-xs font-bold uppercase">Monthly Income</span>
                                <span className="text-3xl font-black text-slate-900 dark:text-white">RM {calculations.hmoRevenue}</span>
                             </div>
                             <div className="flex justify-between items-end border-b border-domira-gold/10 pb-4">
                                <span className="text-slate-500 text-xs font-bold uppercase">Monthly Surplus</span>
                                <span className="text-3xl font-black text-green-500">+ RM {calculations.surplus}</span>
                             </div>
                             <div className="flex justify-between items-end">
                                <span className="text-slate-500 text-xs font-bold uppercase">Annual Profit Boost</span>
                                <span className="text-3xl font-black text-domira-gold">RM {calculations.annualSurplus}</span>
                             </div>
                          </div>
                       </div>
                       <div className="mt-8 pt-8 border-t border-domira-gold/10 flex items-center gap-4">
                          <div className="p-3 bg-domira-gold rounded-2xl"><Zap className="w-5 h-5 text-domira-navy" /></div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                             Projected Payback on conversion cost: <span className="text-slate-900 dark:text-white">{calculations.paybackMonths} Months</span>
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-4">
                    <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-[10px] text-blue-500/80 font-bold uppercase leading-relaxed">
                       Note: Projections are based on current market averages for North KK (Alamesra/Sepanggar). Actual room rates may vary by ±15% based on interior quality and proximity to UMS.
                    </p>
                 </div>
              </div>

              {/* Conversion Checklist */}
              <div className="bg-white dark:bg-domira-navy p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
                 <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                       <CheckCircle2 className="text-domira-gold" /> Compliance & UX Checklist
                    </h2>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{progress}% Complete</span>
                 </div>

                 <div className="grid gap-4">
                    {CHECKLIST_ITEMS.map((item) => (
                       <button 
                         key={item.id}
                         onClick={() => toggleCheck(item.id)}
                         className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-6 group ${checkedItems.includes(item.id) ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-50 dark:bg-domira-dark border-slate-100 dark:border-slate-800 hover:border-domira-gold/40'}`}
                       >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${checkedItems.includes(item.id) ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                             {checkedItems.includes(item.id) && <CheckCircle2 size={14} />}
                          </div>
                          <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-black uppercase tracking-widest ${item.mandatory ? 'text-red-500' : 'text-blue-500'}`}>
                                   {item.category} • {item.mandatory ? 'Mandatory' : 'Optional'}
                                </span>
                             </div>
                             <p className={`text-sm font-bold transition-all ${checkedItems.includes(item.id) ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                                {item.text}
                             </p>
                          </div>
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Support Column */}
           <div className="space-y-8">
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-domira-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
                 <Sparkles className="text-domira-gold mb-6" size={32} />
                 <h3 className="text-2xl font-black mb-4 tracking-tight">Need a professional audit?</h3>
                 <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    Our verified agents can visit your unit, provide a floorplan optimization report, and link you with Bomia-certified contractors.
                 </p>
                 <Button variant="primary" fullWidth className="bg-domira-gold text-domira-navy font-black uppercase text-[10px] py-4 shadow-xl shadow-domira-gold/20">
                    Book On-Site Visit (RM 350)
                 </Button>
              </div>

              <div className="bg-white dark:bg-domira-navy p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 border-b border-slate-100 dark:border-slate-800 pb-2">Student Demands 2024</h3>
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-slate-50 dark:bg-domira-dark rounded-xl"><Wifi className="w-5 h-5 text-domira-gold" /></div>
                       <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase">Stable Fiber</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Requested by 98%</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-slate-50 dark:bg-domira-dark rounded-xl"><ShieldCheck className="w-5 h-5 text-domira-gold" /></div>
                       <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase">Female-Only Units</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Highest Search Volume</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-slate-50 dark:bg-domira-dark rounded-xl"><Wind className="w-5 h-5 text-domira-gold" /></div>
                       <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase">AC Sub-metering</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Reduces Utility Disputes</p>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 text-center">
                 <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Did you know?</p>
                 <p className="text-xs text-slate-500 font-medium">HMOs typically return 12-18% ROI compared to 4-6% for single-family rentals in Kota Kinabalu.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
