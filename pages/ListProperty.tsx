
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { 
  Home, MapPin, DollarSign, Image as ImageIcon, Sparkles, 
  CheckCircle, ArrowRight, ArrowLeft, Info, Plus, X, 
  Bed, Bath, Maximize, ShieldCheck, Zap, Search
} from 'lucide-react';
import { api } from '../services/mockSupabase';
import { Property, MALAYSIAN_LOCATIONS } from '../types';

export const ListProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationList, setShowLocationList] = useState(false);

  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    category: 'Entire Unit',
    description: '',
    address: '',
    price: 0,
    beds: 1, // This is "Available Rooms"
    total_rooms: 1,
    baths: 1,
    sqft: 0,
    amenities: [],
    images: [''],
  });

  useEffect(() => {
    if (isEdit) {
      const fetchProperty = async () => {
        const data = await api.properties.getById(id!);
        if (data) setFormData(data);
      };
      fetchProperty();
    }
  }, [id, isEdit]);

  const ALL_AMENITIES = ['Wifi', 'Aircon', 'Gym', 'Pool', 'Washing Machine', 'Security 24/7', 'Private Bath', 'Cooking Allowed', 'Parking', 'Furnished'];

  const filteredLocations = MALAYSIAN_LOCATIONS.filter(loc => 
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  ).slice(0, 5);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' || name === 'beds' || name === 'baths' || name === 'sqft' || name === 'total_rooms' 
        ? parseInt(value) || 0 
        : value 
    }));
  };

  const selectLocation = (loc: string) => {
    setFormData(prev => ({ ...prev, address: loc }));
    setLocationSearch(loc);
    setShowLocationList(false);
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => {
      const current = prev.amenities || [];
      const updated = current.includes(amenity)
        ? current.filter(a => a !== amenity)
        : [...current, amenity];
      return { ...prev, amenities: updated };
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ''] }));
  };

  const removeImageField = (index: number) => {
    const newImages = (formData.images || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages.length ? newImages : [''] }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEdit) {
        await api.properties.update(id!, formData);
      } else {
        await api.properties.create(formData);
      }
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-domira-dark flex items-center justify-center p-4">
        <div className="bg-domira-navy p-10 rounded-2xl border border-slate-700 shadow-2xl text-center max-w-md animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">{isEdit ? 'Updated!' : 'Published!'}</h2>
          <p className="text-slate-400 mb-8">Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-domira-dark py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-domira-gold rounded-lg shadow-lg shadow-domira-gold/20">
                <Home className="w-5 h-5 text-domira-deep" />
              </div>
              {isEdit ? 'Update Your Listing' : 'List Your Property'}
            </h1>
            <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">Step {step} of 4</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-domira-gold transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
        </div>

        <div className="bg-domira-navy rounded-2xl border border-slate-700 shadow-2xl overflow-hidden mb-8">
          
          {step === 1 && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Listing Title</label>
                <input 
                  type="text" name="title"
                  className="w-full px-4 py-3 bg-domira-dark border border-slate-700 rounded-xl text-white outline-none focus:border-domira-gold"
                  value={formData.title} onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select 
                  name="category"
                  className="w-full px-4 py-3 bg-domira-dark border border-slate-700 rounded-xl text-white outline-none"
                  value={formData.category} onChange={handleInputChange}
                >
                  <option value="Entire Unit">Entire Unit</option>
                  <option value="Master Room">Master Room (Shared)</option>
                  <option value="Single Room">Single Room (Shared)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea 
                  name="description" rows={5}
                  className="w-full px-4 py-3 bg-domira-dark border border-slate-700 rounded-xl text-white outline-none resize-none"
                  value={formData.description} onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-2">City / Location in Malaysia</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Type to search city..."
                    className="w-full pl-10 pr-4 py-3 bg-domira-dark border border-slate-700 rounded-xl text-white outline-none focus:border-domira-gold"
                    value={locationSearch || formData.address}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setShowLocationList(true);
                    }}
                  />
                  {showLocationList && locationSearch && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-domira-navy border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-48 overflow-y-auto">
                      {filteredLocations.map(loc => (
                        <button key={loc} onClick={() => selectLocation(loc)} className="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm text-slate-300 border-b border-slate-800 last:border-0">
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Total Rooms in Unit</label>
                  <input 
                    type="number" name="total_rooms"
                    className="w-full px-4 py-2 bg-domira-dark border border-slate-700 rounded-lg text-white outline-none"
                    value={formData.total_rooms} onChange={handleInputChange}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Maximum capacity of the unit.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Available Quantity</label>
                  <input 
                    type="number" name="beds"
                    className="w-full px-4 py-2 bg-domira-dark border border-slate-700 rounded-lg text-white outline-none border-domira-gold/30"
                    value={formData.beds} onChange={handleInputChange}
                  />
                  <p className="text-[10px] text-domira-gold mt-1">Rooms currently ready to rent.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bathrooms</label>
                  <input 
                    type="number" name="baths"
                    className="w-full px-4 py-2 bg-domira-dark border border-slate-700 rounded-lg text-white outline-none"
                    value={formData.baths} onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Size (Sqft)</label>
                  <input 
                    type="number" name="sqft"
                    className="w-full px-4 py-2 bg-domira-dark border border-slate-700 rounded-lg text-white outline-none"
                    value={formData.sqft} onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 space-y-8 animate-in fade-in slide-in-from-right-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Rent (RM)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 text-domira-gold w-5 h-5" />
                  <input 
                    type="number" name="price"
                    className="w-full pl-10 pr-4 py-3 bg-domira-dark border border-slate-700 rounded-xl text-white text-xl font-bold outline-none"
                    value={formData.price} onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ALL_AMENITIES.map(am => (
                    <button key={am} type="button" onClick={() => toggleAmenity(am)} className={`p-3 rounded-xl border text-xs font-bold transition-all ${formData.amenities?.includes(am) ? 'bg-domira-gold text-domira-deep border-domira-gold' : 'bg-domira-dark border-slate-700 text-slate-400'}`}>
                      {am}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right-4">
              <label className="block text-sm font-medium text-slate-300">Property Photo URLs</label>
              {(formData.images || []).map((url, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    type="text" placeholder="https://..."
                    className="w-full px-4 py-3 bg-domira-dark border border-slate-700 rounded-xl text-white outline-none text-sm"
                    value={url} onChange={(e) => handleImageChange(idx, e.target.value)}
                  />
                  {idx > 0 && <button onClick={() => removeImageField(idx)} className="text-red-400 p-2"><X size={18} /></button>}
                </div>
              ))}
              <button onClick={addImageField} className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 text-sm font-bold hover:text-domira-gold hover:border-domira-gold transition-colors">
                <Plus size={16} className="inline mr-2" /> Add Image
              </button>
            </div>
          )}

          <div className="px-8 py-6 bg-domira-deep border-t border-slate-800 flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="text-slate-300">Back</Button>
            ) : <div />}
            {step < 4 ? (
              <Button variant="primary" onClick={() => setStep(step + 1)}>Continue</Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Property' : 'List Property'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
