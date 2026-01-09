
import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-domira-navy text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center space-x-3 mb-6">
              <Logo size={42} />
              <span className="text-xl font-bold text-white tracking-tight">Domira</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Rent with trust. The most secure way to find your next home and perfect roommate in Malaysia.
            </p>
            <div className="flex space-x-4">
                <a href="#" className="hover:text-domira-gold transition-colors"><Instagram className="w-5 h-5"/></a>
                <a href="#" className="hover:text-domira-gold transition-colors"><Twitter className="w-5 h-5"/></a>
                <a href="#" className="hover:text-domira-gold transition-colors"><Facebook className="w-5 h-5"/></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-domira-gold transition-colors">Find Property</a></li>
              <li><a href="#" className="hover:text-domira-gold transition-colors">Find Roommate</a></li>
              <li><a href="#" className="hover:text-domira-gold transition-colors">For Landlords</a></li>
              <li><a href="#" className="hover:text-domira-gold transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
             <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-domira-gold transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-domira-gold transition-colors">Safety Center</a></li>
              <li><a href="#" className="hover:text-domira-gold transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-domira-gold transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

           <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
             <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-domira-gold transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-domira-gold transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-domira-gold transition-colors">Report a Bug</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Domira Sdn Bhd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
