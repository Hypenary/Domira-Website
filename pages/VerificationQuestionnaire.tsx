
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Sparkles, CheckCircle, ArrowRight, ArrowLeft, Heart, Zap, Clock, ShieldCheck } from 'lucide-react';

const QUESTIONS = [
  { id: 1, text: "What's your typical wake-up time?", options: ["Early Riser (Before 7 AM)", "Moderate (7-9 AM)", "Late (After 10 AM)"], tag: ["Early Riser", "Moderate Riser", "Late Riser"] },
  { id: 2, text: "How often do you have guests over?", options: ["Rarely", "Weekends Only", "Frequently"], tag: ["Quiet", "Social", "Very Social"] },
  { id: 3, text: "Cleanliness priority in shared spaces?", options: ["Obsessive", "Balanced", "Relaxed"], tag: ["Clean Freak", "Balanced", "Chill"] },
  { id: 4, text: "Do you prefer a quiet house or music/TV?", options: ["Library Quiet", "Ambient Sound", "Lively/Music"], tag: ["Quiet Home", "Ambient", "Lively"] },
  { id: 5, text: "What's your smoking status?", options: ["Non-Smoker", "Smoker (Outside only)", "Smoker (Allowed anywhere)"], tag: ["Non-Smoker", "Outdoor Smoker", "Smoker Friendly"] },
  { id: 6, text: "How often do you cook at home?", options: ["Never/Takeout", "Occasionally", "Daily/Heavy Cooking"], tag: ["Takeout King", "Occasional Chef", "Home Cook"] },
  { id: 7, text: "What is your sleep cycle?", options: ["Day Person", "Night Owl", "Irregular"], tag: ["Day Owl", "Night Owl", "Flex Sleeper"] },
  { id: 8, text: "Pet preference?", options: ["Must have pets", "Allowed", "No pets allowed"], tag: ["Pet Lover", "Pet Neutral", "No Pets"] },
  { id: 9, text: "Work environment?", options: ["Office Work", "Work from Home", "Field/Travel"], tag: ["Office Pro", "WFH Pro", "Field Pro"] },
  { id: 10, text: "Halal food requirements?", options: ["Strictly Halal", "Pork-free shared", "No restrictions"], tag: ["Halal Only", "Pork Free", "No Food Rules"] },
  { id: 11, text: "AC usage preference?", options: ["24/7 Cold", "Night only", "Fan only"], tag: ["AC Lover", "Night AC", "Eco Friendly"] },
  { id: 12, text: "Interaction with housemates?", options: ["Independent", "Casual Greetings", "Best Friends"], tag: ["Independent", "Friendly", "Community Focused"] }
];

export const VerificationQuestionnaire: React.FC<{ onComplete: (tags: string[]) => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = QUESTIONS[currentStep].tag[optionIdx];
    setAnswers(newAnswers);
    
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setFinished(true);
    }
  };

  const handleFinalize = () => {
    onComplete(answers);
    navigate('/profile');
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-domira-dark flex items-center justify-center p-4">
        <div className="bg-white dark:bg-domira-navy p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-center max-w-lg animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-green-500/10 border-4 border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <ShieldCheck className="w-12 h-12 text-green-500" />
           </div>
           <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Lifestyle Match 100%</h2>
           <p className="text-slate-500 dark:text-slate-400 font-medium mb-10">Your behavioral fingerprint has been established. You are now a <strong>Verified Tenant</strong>.</p>
           <div className="flex flex-wrap justify-center gap-2 mb-10">
              {answers.map(a => <span key={a} className="px-3 py-1 bg-domira-gold/10 text-domira-gold text-[10px] font-black uppercase rounded-full border border-domira-gold/20">{a}</span>)}
           </div>
           <Button variant="primary" fullWidth onClick={handleFinalize} className="py-5 font-black uppercase text-xs tracking-widest shadow-2xl shadow-domira-gold/20">Return to Profile</Button>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-domira-dark py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-domira-gold/10 border border-domira-gold/20 rounded-full text-domira-gold text-[10px] font-black uppercase tracking-widest mb-6">
              <Zap className="w-4 h-4 fill-domira-gold" /> Step {currentStep + 1} of {QUESTIONS.length}
           </div>
           <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Build Your Lifestyle Fingerprint</h1>
           <p className="text-slate-500 font-medium text-sm">This helps us find roommates who actually fit your habits.</p>
        </div>

        <div className="bg-white dark:bg-domira-navy rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
           <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full bg-domira-gold transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
           </div>
           
           <div className="p-10 md:p-16 text-center">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-10 leading-tight">
                {QUESTIONS[currentStep].text}
              </h2>
              <div className="space-y-4">
                 {QUESTIONS[currentStep].options.map((opt, i) => (
                   <button 
                    key={i} 
                    onClick={() => handleSelect(i)}
                    className="w-full p-6 text-left rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-domira-gold hover:bg-domira-gold/5 dark:hover:bg-domira-gold/10 transition-all group flex items-center justify-between"
                   >
                      <span className="font-bold text-slate-700 dark:text-slate-200">{opt}</span>
                      <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-domira-gold group-hover:bg-domira-gold transition-all"></div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="px-10 py-6 bg-slate-50 dark:bg-domira-deep border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="text-xs font-black uppercase text-slate-400 hover:text-domira-gold transition-colors disabled:opacity-0"
              >
                 <ArrowLeft className="w-4 h-4 inline mr-2" /> Back
              </button>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mandatory for verification</p>
           </div>
        </div>
      </div>
    </div>
  );
};
