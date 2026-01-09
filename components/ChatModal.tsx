import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Send, ShieldCheck, User, Paperclip, CheckCheck, Phone, Info, MapPin, ExternalLink, Calendar, DollarSign, ChevronRight, UserCheck, MessageCircle } from 'lucide-react';
import { Property } from '../types';
import { Button } from './Button';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  recipient?: { 
    id: string;
    name: string; 
    avatar: string; 
    role: 'tenant' | 'landlord';
    bio?: string;
  };
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, property, recipient }) => {
  const [message, setMessage] = useState('');
  
  // Determine if the current view is from a Landlord's perspective
  // If recipient is a tenant, the user is likely a landlord
  const isLandlordView = recipient?.role === 'tenant';

  const [messages, setMessages] = useState<{id: number, text: string, sender: 'me' | 'them', time: string}[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      // Initialize chat based on context
      if (isLandlordView) {
        setMessages([
          { id: 1, text: `Hi, I noticed you're interested in my property "${property.title}". How can I help you?`, sender: 'me', time: '10:00 AM' },
          { id: 2, text: `Hello! Yes, I was wondering if the utilities are included in the RM ${property.price} rent?`, sender: 'them', time: '10:05 AM' }
        ]);
      } else {
        setMessages([
          { id: 1, text: `Hi! I'm interested in ${property.title}. Is it still available?`, sender: 'me', time: '10:30 AM' }
        ]);
      }
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, isLandlordView, property.title]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate auto-reply for tenant view
  useEffect(() => {
    if (isOpen && !isLandlordView && messages.length === 1 && messages[0].sender === 'me') {
        const timer = setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: `Hello! Yes, this unit is currently available. I've had a few inquiries this morning, but no deposit has been placed yet. When would you like to come for a viewing?`,
                sender: 'them',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [isOpen, isLandlordView, messages]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, {
        id: Date.now(),
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessage('');
  };

  const chatPartner = recipient || { 
    name: property.agent?.name || 'Landlord', 
    avatar: property.agent?.image || '', 
    role: 'landlord' as const 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-domira-navy w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[85vh] animate-in zoom-in-95 duration-300 border border-slate-700">
        
        {/* Main Conversation Area */}
        <div className="flex-1 flex flex-col bg-slate-50 relative">
          {/* Header */}
          <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-200">
             <div className="flex items-center gap-4">
                <div className="relative">
                   <img src={chatPartner.avatar} className="w-10 h-10 rounded-full object-cover border-2 border-domira-gold" alt={chatPartner.name} />
                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                   <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                     {chatPartner.name}
                     {chatPartner.role === 'landlord' && <ShieldCheck className="w-3.5 h-3.5 text-domira-gold" />}
                   </h3>
                   <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                     {isLandlordView ? 'Prospective Tenant' : 'Verified Landlord'} • Online
                   </p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   <ShieldCheck className="w-3 h-3" /> Encrypted
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
             </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 custom-scrollbar">
              <div className="flex flex-col items-center mb-8">
                 <div className="bg-slate-200/50 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
                   {new Date().toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long' })}
                 </div>
                 <p className="text-slate-400 text-[10px] text-center max-w-xs uppercase tracking-tighter">
                   Property: {property.title}
                 </p>
              </div>
              
              {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      {msg.sender === 'them' && (
                         <div className="w-8 h-8 rounded-full bg-slate-200 mr-2 flex-shrink-0 overflow-hidden border border-slate-300">
                            <img src={chatPartner.avatar} className="w-full h-full object-cover" alt="" />
                         </div>
                      )}
                      <div className={`max-w-[70%] group relative ${msg.sender === 'me' ? 'order-1' : 'order-2'}`}>
                          <div className={`rounded-2xl px-5 py-3 text-sm shadow-sm leading-relaxed ${
                              msg.sender === 'me' 
                              ? 'bg-domira-navy text-white rounded-br-none' 
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                          }`}>
                              <p>{msg.text}</p>
                          </div>
                          <div className={`text-[10px] mt-1 flex items-center gap-1.5 ${msg.sender === 'me' ? 'justify-end text-slate-400' : 'justify-start text-slate-500'}`}>
                              <span>{msg.time}</span>
                              {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                          </div>
                      </div>
                  </div>
              ))}
              <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-200">
              <form onSubmit={handleSend} className="flex items-center gap-4">
                  <button type="button" className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                      <Paperclip className="w-5 h-5" />
                  </button>
                  <input 
                      type="text" 
                      placeholder={isLandlordView ? "Type your reply..." : "Ask the landlord a question..."} 
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-domira-gold outline-none transition-all text-slate-800"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                  />
                  <button 
                      type="submit" 
                      className={`p-3 rounded-2xl transition-all ${message.trim() ? 'bg-domira-gold text-domira-navy shadow-lg shadow-domira-gold/20' : 'bg-slate-100 text-slate-300'}`}
                      disabled={!message.trim()}
                  >
                      <Send className="w-5 h-5" />
                  </button>
              </form>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="hidden lg:flex w-[340px] flex-col bg-domira-deep border-l border-slate-800">
           {isLandlordView ? (
             // Landlord View: Show Tenant Profile
             <div className="flex flex-col h-full">
                <div className="p-8 border-b border-slate-800 flex flex-col items-center text-center">
                   <div className="relative mb-4">
                      <img src={chatPartner.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-2xl" alt="" />
                      <div className="absolute -bottom-2 -right-2 bg-domira-gold text-domira-navy p-1.5 rounded-lg border-2 border-domira-deep">
                         <UserCheck className="w-4 h-4" />
                      </div>
                   </div>
                   <h4 className="text-xl font-bold text-white mb-1">{chatPartner.name}</h4>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Prospective Tenant</p>
                   
                   <div className="flex gap-2 w-full">
                      <div className="flex-1 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Inquiries</p>
                        <p className="text-white font-bold text-sm">3 Total</p>
                      </div>
                      <div className="flex-1 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Rating</p>
                        <p className="text-white font-bold text-sm">New</p>
                      </div>
                   </div>
                </div>

                <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                   <div>
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Context Property</h5>
                      <div className="bg-domira-navy border border-slate-700 rounded-xl overflow-hidden p-3 flex gap-3">
                         <img src={property.images[0]} className="w-16 h-16 rounded-lg object-cover" alt="" />
                         <div className="flex-1 min-w-0">
                            <p className="text-white font-bold text-xs truncate">{property.title}</p>
                            <p className="text-domira-gold font-bold text-xs mt-1">RM {property.price}</p>
                            <Link to={`/property/${property.id}`} target="_blank" className="text-[10px] text-slate-500 hover:text-white underline mt-1 block">View Details</Link>
                         </div>
                      </div>
                   </div>

                   <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                      <h6 className="text-blue-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                        <Info className="w-3 h-3" /> Tenant Verification
                      </h6>
                      <p className="text-slate-400 text-[10px] leading-relaxed">
                        This tenant has provided a valid identity document and is currently in the background check phase.
                      </p>
                   </div>
                </div>

                <div className="p-6 border-t border-slate-800">
                   <Button variant="outline" fullWidth className="border-slate-700 text-slate-300 text-xs mb-3">
                      View Full Profile
                   </Button>
                   <button className="w-full text-red-500/50 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors">
                      Report Conversation
                   </button>
                </div>
             </div>
           ) : (
             // Tenant View: Show Property Summary
             <>
               <div className="p-6 border-b border-slate-800">
                  <div className="relative rounded-xl overflow-hidden mb-4 shadow-xl">
                     <img src={property.images[0]} className="w-full h-44 object-cover" alt={property.title} />
                     <div className="absolute inset-0 bg-gradient-to-t from-domira-deep/80 to-transparent"></div>
                     <div className="absolute bottom-3 left-3">
                       <span className="bg-domira-gold text-domira-deep text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">{property.category}</span>
                     </div>
                  </div>
                  <h4 className="font-bold text-white text-lg mb-1 line-clamp-1">{property.title}</h4>
                  <p className="text-slate-400 text-xs flex items-center mb-4 truncate">
                    <MapPin className="w-3 h-3 mr-1 text-domira-gold" /> {property.address}
                  </p>
                  <div className="text-2xl font-bold text-white">RM {property.price}<span className="text-xs text-slate-500 font-normal">/mo</span></div>
               </div>

               <div className="p-6 border-b border-slate-800">
                  <div className="flex items-center gap-4 mb-4">
                     <img src={property.agent?.image} className="w-14 h-14 rounded-full border-2 border-domira-gold object-cover" alt="Agent" />
                     <div>
                        <h5 className="font-bold text-white text-sm flex items-center gap-1">
                          {property.agent?.name}
                          <ShieldCheck className="w-3 h-3 text-domira-gold" />
                        </h5>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Verified Landlord</p>
                     </div>
                  </div>
                  <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-2">
                     <Phone className="w-4 h-4" /> Request Call
                  </button>
               </div>

               <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                     <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                        <h6 className="text-amber-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                          <ShieldCheck className="w-3 h-3" /> Secure Rental
                        </h6>
                        <p className="text-slate-400 text-[10px] leading-relaxed">
                          Always communicate through Domira. Never pay cash outside the platform to stay protected.
                        </p>
                     </div>
                     <button className="w-full flex items-center justify-between p-3 rounded-xl bg-domira-navy border border-slate-700 hover:border-domira-gold transition-all group">
                        <span className="text-xs font-bold text-white flex items-center gap-3">
                           <Calendar className="w-4 h-4 text-domira-gold" /> Book Viewing
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                     </button>
                  </div>
                  <button className="text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-red-400 transition-colors mt-4 self-center">
                     Report User
                  </button>
               </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
};