import { ReactNode, CSSProperties } from 'react';

interface HUDFrameProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function HUDFrame({ children, className = '', style }: HUDFrameProps) {
  return (
    <div className={`relative ${className}`} style={style}>
      <div className="absolute -top-px -left-px w-6 h-6 border-l-2 border-t-2 border-primary" />
      <div className="absolute -top-px -right-px w-6 h-6 border-r-2 border-t-2 border-primary" />
      <div className="absolute -bottom-px -left-px w-6 h-6 border-l-2 border-b-2 border-primary" />
      <div className="absolute -bottom-px -right-px w-6 h-6 border-r-2 border-b-2 border-primary" />
      {children}
    </div>
  );
}

export function HUDCard({ children, className = '', style }: HUDFrameProps) {
  return (
    <div className={`relative bg-card/80 backdrop-blur-sm border border-border overflow-hidden ${className}`} style={style}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-50" />
      </div>
      <div className="absolute top-0 left-0 w-4 h-4">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-primary" />
        <div className="absolute top-0 left-0 w-0.5 h-full bg-primary" />
      </div>
      <div className="absolute top-0 right-0 w-4 h-4">
        <div className="absolute top-0 right-0 w-full h-0.5 bg-primary" />
        <div className="absolute top-0 right-0 w-0.5 h-full bg-primary" />
      </div>
      <div className="absolute bottom-0 left-0 w-4 h-4">
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
        <div className="absolute bottom-0 left-0 w-0.5 h-full bg-primary" />
      </div>
      <div className="absolute bottom-0 right-0 w-4 h-4">
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-primary" />
        <div className="absolute bottom-0 right-0 w-0.5 h-full bg-primary" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function GlowingDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-px w-full ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />
    </div>
  );
}