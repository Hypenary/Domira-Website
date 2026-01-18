
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Crown, Sparkles, User, Home, Search, Users, Briefcase, Settings, LogOut, ChevronRight, Building, Handshake, MapPin, Compass } from 'lucide-react';
import { Button } from './Button';
import { UserProfile, UserRole } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  user: UserProfile | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, isDarkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, label, icon: Icon, id }: { to: string; label: string; icon?: any; id?: string }) => (
    <Link 
      to={to} 
      id={id}
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-3 text-sm font-bold transition-all py-2.5 px-3 rounded-xl ${
        isActive(to) 
          ? 'bg-domira-gold/10 text-domira-gold' 
          : 'text-slate-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {Icon && <Icon size={18} className={isActive(to) ? 'text-domira-gold' : 'text-slate-500'} />}
      {label}
    </Link>
  );

  return (
    <nav className="bg-domira-navy sticky top-0 z-[100] border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <Logo size={36} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-black text-white tracking-tight">Domira</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <Link id="nav-home" to="/" className={`px-4 py-2 text-sm font-bold transition-all ${isActive('/') ? 'text-domira-gold' : 'text-slate-300 hover:text-white'}`}>Home</Link>
            <Link id="nav-properties" to="/find-property" className={`px-4 py-2 text-sm font-bold transition-all ${isActive('/find-property') ? 'text-domira-gold' : 'text-slate-300 hover:text-white'}`}>Properties</Link>
            <Link id="nav-roommates" to="/find-roommate" className={`px-4 py-2 text-sm font-bold transition-all ${isActive('/find-roommate') ? 'text-domira-gold' : 'text-slate-300 hover:text-white'}`}>Roommates</Link>
            <Link id="nav-explore" to="/explore" className={`px-4 py-2 text-sm font-bold transition-all ${isActive('/explore') ? 'text-domira-gold' : 'text-slate-300 hover:text-white'}`}>Explorer</Link>
            <Link id="nav-services" to="/services" className={`px-4 py-2 text-sm font-bold transition-all ${isActive('/services') ? 'text-domira-gold' : 'text-slate-300 hover:text-white'}`}>Services</Link>
            <Link id="nav-landlords" to="/for-landlords" className={`px-4 py-2 text-sm font-bold transition-all ${isActive('/for-landlords') ? 'text-domira-gold' : 'text-slate-300 hover:text-white'}`}>Landlords</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-domira-gold transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-3">
                {user.is_gold && (
                  <Link to="/profile?tab=gold" className="px-3 py-1.5 bg-domira-gold text-domira-navy rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                    <Crown size={12} fill="currentColor" /> Gold
                  </Link>
                )}
                <Link to="/profile" className="flex items-center space-x-3 hover:bg-white/5 p-1.5 rounded-xl transition-all border border-transparent hover:border-white/5">
                  <img src={user.avatar_url} className={`h-9 w-9 rounded-full object-cover border-2 ${user.is_gold ? 'border-domira-gold' : 'border-slate-700'}`} alt="" />
                </Link>
              </div>
            ) : (
              <Link to="/auth?mode=signup">
                 <Button id="nav-join-btn" variant="primary" size="sm" className="font-black uppercase text-[10px] tracking-widest px-4">Join Now</Button>
              </Link>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="text-slate-300 p-2"><Sun size={20}/></button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 bg-white/5 rounded-xl border border-white/10"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] md:hidden">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in" onClick={() => setIsOpen(false)}></div>
           <div className="absolute right-0 top-0 bottom-0 w-80 bg-domira-navy border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                 <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                    <Logo size={28} />
                    <span className="text-lg font-black text-white">Domira</span>
                 </Link>
                 <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Navigation</p>
                    <div className="grid gap-1">
                      <NavLink id="mob-nav-home" to="/" label="Home" icon={Home} />
                      <NavLink id="mob-nav-properties" to="/find-property" label="Properties" icon={Search} />
                      <NavLink id="mob-nav-roommates" to="/find-roommate" label="Roommates" icon={Users} />
                      <NavLink id="mob-nav-explore" to="/explore" label="Explorer" icon={Compass} />
                      <NavLink id="mob-nav-services" to="/services" label="Services Hub" icon={Handshake} />
                      <NavLink id="mob-nav-landlords" to="/for-landlords" label="Landlord Hub" icon={Building} />
                    </div>
                 </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-slate-950/20">
                 {user ? (
                    <button 
                      id="mob-signout"
                      onClick={() => {
                        localStorage.removeItem('domira_user');
                        window.location.reload();
                      }}
                      className="flex items-center gap-3 w-full p-4 text-red-400 font-bold text-sm hover:bg-red-500/10 rounded-xl transition-all"
                    >
                       <LogOut size={18} /> Sign Out
                    </button>
                 ) : (
                    <Link id="mob-signin" to="/auth" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full py-4 border border-white/10 rounded-xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all">Sign In</Link>
                 )}
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};
