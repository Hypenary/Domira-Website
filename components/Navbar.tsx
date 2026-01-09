
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Crown, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { UserProfile } from '../types';
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

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-colors hover:text-domira-gold ${
        isActive(to) 
          ? 'text-domira-gold font-bold' 
          : 'text-slate-300'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-domira-navy sticky top-0 z-50 border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <Logo size={36} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-black text-white tracking-tight">Domira</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" label="Home" />
            <NavLink to="/find-property" label="Properties" />
            <NavLink to="/find-roommate" label="Roommates" />
            <NavLink to="/gigs" label="Gig Hub" />
            {user && <NavLink to="/my-house" label="My House" />}
            <NavLink to="/services" label="Services" />
            <NavLink to="/pricing" label="Pricing" />
            <NavLink to="/for-landlords" label="Landlords" />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-domira-gold transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {user ? (
              <div className="flex items-center gap-3">
                {user.is_gold ? (
                  <Link to="/profile?tab=gold" className="flex items-center gap-1.5 px-3 py-1.5 bg-domira-gold text-domira-navy rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-domira-gold/20">
                    <Crown size={12} fill="currentColor" /> Gold Member
                  </Link>
                ) : (
                  <Link to="/pricing" className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-domira-gold text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                    <Sparkles size={12} /> Go Gold
                  </Link>
                )}
                <Link to="/profile" className="flex items-center space-x-3 hover:bg-white/5 p-1.5 rounded-xl transition-all border border-transparent hover:border-white/5">
                  <div className={`h-9 w-9 rounded-full overflow-hidden border-2 ${user.is_gold ? 'border-domira-gold ring-2 ring-domira-gold/20' : 'border-slate-700'}`}>
                    <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-black text-white leading-none mb-1">{user.full_name}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${user.is_gold ? 'text-domira-gold' : 'text-slate-400'}`}>
                       {user.is_gold ? 'Member' : 'Profile'}
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth" className="text-sm font-bold text-slate-300 hover:text-white">Sign In</Link>
                <Link to="/auth?mode=signup">
                   <Button variant="primary" size="sm" className="font-black uppercase text-[10px] tracking-widest px-4">Join Now</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button onClick={toggleTheme} className="text-slate-300"><Sun size={20}/></button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 p-2"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-domira-navy border-t border-white/5 px-4 pb-8 pt-4 space-y-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="block text-xl font-bold text-white">Home</Link>
            <Link to="/find-property" onClick={() => setIsOpen(false)} className="block text-xl font-bold text-white">Properties</Link>
            <Link to="/find-roommate" onClick={() => setIsOpen(false)} className="block text-xl font-bold text-white">Roommates</Link>
            <Link to="/pricing" onClick={() => setIsOpen(false)} className="block text-xl font-bold text-white">Pricing</Link>
            {user?.is_gold ? null : <Link to="/pricing" onClick={() => setIsOpen(false)} className="block text-xl font-bold text-domira-gold">Go Gold</Link>}
            <div className="pt-4 border-t border-white/5">
              {!user && <Link to="/auth" className="block w-full py-3 bg-domira-gold text-domira-navy font-black text-center rounded-xl">Get Started</Link>}
            </div>
        </div>
      )}
    </nav>
  );
};
