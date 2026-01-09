
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { FindProperty } from './pages/FindProperty';
import { PropertyDetails } from './pages/PropertyDetails';
import { FindRoommate } from './pages/FindRoommate';
import { RoommateProfile } from './pages/RoommateProfile';
import { ForLandlords } from './pages/ForLandlords';
import { Auth } from './pages/Auth';
import { ProfileSettings } from './pages/ProfileSettings';
import { HouseDashboard } from './pages/HouseDashboard';
import { Explore } from './pages/Explore';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { Services } from './pages/Services';
import { GigHub } from './pages/GigHub';
import { Checkout } from './pages/Checkout';
import { ListProperty } from './pages/ListProperty';
import { VerificationQuestionnaire } from './pages/VerificationQuestionnaire';
import { VerifyDocuments } from './pages/VerifyDocuments';
import { LandlordApply } from './pages/LandlordApply';
import { AgentApply } from './pages/AgentApply';
import { PropertyConversionPlanner } from './pages/PropertyConversionPlanner';
import { UserProfile, Badge } from './types';
import { ShieldAlert, Sparkles, X, FileText, Award } from 'lucide-react';
import { AuthModal } from './components/AuthModal';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const BadgeNotification = ({ badge, onClose }: { badge: Badge | null, onClose: () => void }) => {
  if (!badge) return null;
  return (
    <div className="fixed bottom-8 right-8 z-[200] animate-in slide-in-from-right duration-500">
       <div className="bg-domira-navy border border-domira-gold/50 rounded-2xl p-6 shadow-2xl flex items-center gap-6 max-w-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Award className="text-domira-gold" size={60} /></div>
          <div className="w-16 h-16 bg-domira-gold/20 rounded-2xl flex items-center justify-center shrink-0 border border-domira-gold/30">
             <Award className="text-domira-gold" size={32} />
          </div>
          <div>
             <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">New Badge Unlocked!</h4>
             <p className="text-slate-400 text-xs font-medium">Congrats! You earned <strong className="text-domira-gold">{badge.name}</strong> 🛡️</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white ml-4"><X size={16} /></button>
       </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('domira_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<Badge | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('domira_theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('domira_theme', isDarkMode ? 'dark' : 'light');
    
    // Apply global gold themes
    if (user?.is_gold && user?.gold_theme === 'Sapphire') {
      document.body.classList.add('theme-sapphire');
    } else {
      document.body.classList.remove('theme-sapphire');
    }
  }, [isDarkMode, user]);

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    localStorage.setItem('domira_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('domira_user');
  };

  const handleUpdateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    if (updated.questionnaire_completed && updated.document_verified) updated.is_verified = true;
    setUser(updated);
    localStorage.setItem('domira_user', JSON.stringify(updated));
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen transition-colors duration-300">
        <Navbar user={user} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
        <BadgeNotification badge={earnedBadge} onClose={() => setEarnedBadge(null)} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/find-property" element={<FindProperty />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/checkout" element={user ? <Checkout /> : <Auth onLogin={handleLogin} />} />
            <Route path="/find-roommate" element={<FindRoommate user={user} />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gigs" element={<GigHub user={user} />} />
            
            <Route path="/verify-lifestyle" element={user ? <VerificationQuestionnaire onComplete={(tags) => handleUpdateUser({ lifestyle_tags: tags, questionnaire_completed: true })} /> : <Navigate to="/auth" replace />} />
            <Route path="/verify-documents" element={user ? <VerifyDocuments onComplete={() => handleUpdateUser({ document_verified: true })} /> : <Navigate to="/auth" replace />} />
            <Route path="/landlord-apply" element={user ? <LandlordApply onComplete={() => handleUpdateUser({ landlord_status: 'pending' })} /> : <Navigate to="/auth" replace />} />
            <Route path="/agent-apply" element={user ? <AgentApply onComplete={(ren, agency) => handleUpdateUser({ agent_status: 'pending', ren_number: ren, agency_name: agency })} /> : <Navigate to="/auth" replace />} />
            <Route path="/list-property" element={user ? <ListProperty /> : <Navigate to="/auth" replace />} />
            <Route path="/conversion-planner" element={user ? <PropertyConversionPlanner /> : <Navigate to="/auth" replace />} />
            <Route path="/roommate/:id" element={user ? <RoommateProfile /> : <Navigate to="/auth" replace />} />
            <Route path="/for-landlords" element={user ? <ForLandlords /> : <Navigate to="/auth" replace />} />
            
            <Route path="/my-house/*" element={user ? <HouseDashboard /> : <Auth onLogin={handleLogin} />} />
            <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
            <Route path="/profile" element={user ? <ProfileSettings user={user} onUpdate={handleUpdateUser} onLogout={handleLogout} /> : <Auth onLogin={handleLogin} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
