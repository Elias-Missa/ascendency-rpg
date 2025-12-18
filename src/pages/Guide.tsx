import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { Loader2 } from 'lucide-react';
import guideCharacter from '@/assets/guide-character.png';

interface HotspotProps {
  label: string;
  path: string;
  className: string;
}

function Hotspot({ label, path, className }: HotspotProps) {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(path)}
      className={`absolute group cursor-pointer transition-all duration-300 ${className}`}
    >
      {/* Glowing highlight area */}
      <div className="absolute inset-0 rounded-full bg-primary/20 group-hover:bg-primary/40 transition-all duration-300 animate-pulse-glow" />
      
      {/* Label */}
      <div className="relative z-10 px-4 py-2 bg-background/80 backdrop-blur-sm border border-primary/50 rounded-lg 
                      group-hover:border-primary group-hover:bg-primary/20 group-hover:scale-110 
                      transition-all duration-300 shadow-lg shadow-primary/20">
        <span className="font-display font-bold text-sm text-primary group-hover:text-primary-foreground 
                        tracking-wider uppercase glow-text">
          {label}
        </span>
      </div>
      
      {/* Animated ring effect on hover */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/60 
                      group-hover:scale-150 transition-all duration-500 opacity-0 group-hover:opacity-100" />
    </button>
  );
}

export default function Guide() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      <CyberBackground />

      <main className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-display font-bold mb-1 glow-text">KNOWLEDGE BASE</h1>
          <p className="text-sm font-mono text-muted-foreground">
            Select an area to explore
          </p>
        </div>

        {/* Interactive Character */}
        <div className="relative mx-auto max-w-md aspect-square flex items-center justify-center">
          {/* Character Image */}
          <img 
            src={guideCharacter} 
            alt="Guide Character" 
            className="w-full h-full object-contain relative z-0 drop-shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
          />
          
          {/* Hotspots positioned over the character */}
          {/* Face Hotspot */}
          <Hotspot 
            label="Face" 
            path="/guide/face" 
            className="top-[8%] left-1/2 -translate-x-1/2"
          />
          
          {/* Left Hand - Hygiene (character's right, viewer's left) */}
          <Hotspot 
            label="Hygiene" 
            path="/guide/hygiene" 
            className="top-[42%] left-[5%]"
          />
          
          {/* Right Hand - Style (character's left, viewer's right) */}
          <Hotspot 
            label="Style" 
            path="/guide/style" 
            className="top-[42%] right-[5%]"
          />
          
          {/* Body Hotspot */}
          <Hotspot 
            label="Body" 
            path="/guide/body" 
            className="top-[55%] left-1/2 -translate-x-1/2"
          />
        </div>

        {/* Instruction text */}
        <p className="text-center text-xs font-mono text-muted-foreground mt-4 animate-pulse">
          TAP A GLOWING AREA TO LEARN MORE
        </p>
      </main>
    </div>
  );
}
