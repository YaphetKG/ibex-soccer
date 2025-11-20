import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const RetroButton: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyle = "font-header uppercase text-xs md:text-sm px-6 py-3 border-2 transition-all active:translate-y-1 box-shadow-retro";
  // Updated variants for Red/Gold/Green theme
  const variants = {
    primary: "bg-retro-accent text-white border-white hover:bg-red-700",
    secondary: "bg-retro-gold text-black border-black hover:bg-yellow-500",
    danger: "bg-red-900 text-white border-white hover:bg-red-950",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export const RetroCard: React.FC<{ children: React.ReactNode; title?: string; className?: string; onClick?: () => void }> = ({ children, title, className, onClick }) => {
  return (
    <div 
      className={`bg-retro-bg border-2 border-white p-1 box-shadow-retro ${className || ''}`}
      onClick={onClick}
    >
      {title && (
        <div className="bg-white text-black font-header text-xs p-2 mb-4 text-center uppercase tracking-widest">
          {title}
        </div>
      )}
      <div className="p-2 md:p-4">
        {children}
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 border-4 border-retro-green border-t-transparent rounded-full animate-spin"></div>
    <p className="font-body text-xl text-retro-green animate-pulse">PROCESSING...</p>
  </div>
);