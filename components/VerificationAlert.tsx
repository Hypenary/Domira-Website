
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface VerificationAlertProps {
  user: UserProfile | null;
}

export const VerificationAlert: React.FC<VerificationAlertProps> = ({ user }) => {
  if (!user || user.is_verified || user.is_gold) return null;

  const progress = (user.questionnaire_completed ? 50 : 0) + (user.document_verified ? 50 : 0);

  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border-b border-amber-200 dark:border-amber-800/50 py-3 px-4 animate-in slide-in-from-top duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
            <ShieldAlert size={18} className="text-amber-600 dark:text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-widest">
              Trust Audit Incomplete ({progress}%)
            </p>
            <p className="text-[10px] text-amber-700/70 dark:text-amber-400/70 font-medium">
              Verified tenants get 4x more replies from landlords in Kota Kinabalu.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-[10px] font-black text-amber-600 uppercase">{progress}%</span>
          </div>
          <Link to="/profile?tab=verification">
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-600/20">
              Complete Audit <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
