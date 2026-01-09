
import React from 'react';

interface LogoProps {
  variant?: 'icon' | 'full';
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'icon', className = '', size = 40 }) => {
  const iconOnly = (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 500 500" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Brush Strokes (Simplified) */}
      <circle cx="250" cy="250" r="230" stroke="#FFD700" strokeWidth="8" strokeOpacity="0.6" />
      <circle cx="250" cy="250" r="220" stroke="#FFD700" strokeWidth="4" strokeOpacity="0.4" />
      
      {/* Main Circle Background */}
      <circle cx="250" cy="250" r="200" fill="#1e293b" />
      
      {/* House Icon */}
      <path 
        d="M132 250L250 150L368 250V254L250 154L132 254V250Z" 
        fill="#FFD700" 
      />
      <path 
        d="M250 170L368 270L368 350L250 250V170Z" 
        fill="#FFD700" 
      />
      <rect x="250" y="250" width="86" height="100" fill="#FFD700" />
      <rect x="290" y="200" width="22" height="40" fill="#FFD700" />
    </svg>
  );

  if (variant === 'icon') return iconOnly;

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {iconOnly}
      <div className="mt-4">
        {/* Removed hardcoded dark slate text to allow color inheritance (e.g., from text-white in Hero) */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: 'Inter, sans-serif' }}>
          Domira
        </h1>
        <p className="mt-2 font-medium text-lg md:text-xl tracking-tight opacity-90">
          Rent with Trust, Live with Peace
        </p>
      </div>
    </div>
  );
};
