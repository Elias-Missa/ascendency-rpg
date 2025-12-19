import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import guideCharacter from '@/assets/guide-character.png';

interface LabeledZoneProps {
  path: string;
  label: string;
  className: string;
}

function LabeledZone({ path, label, className }: LabeledZoneProps) {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(path)}
      aria-label={`${label} Guide`}
      className={`absolute cursor-pointer transition-all duration-300 hover:scale-110 group ${className}`}
    >
      {/* Purple glowing energy orb effect */}
      <div className="absolute inset-0 rounded-full bg-[hsl(270,100%,50%)]/40 blur-xl animate-pulse" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(270,100%,60%)]/60 to-[hsl(280,100%,40%)]/40 blur-md group-hover:blur-lg transition-all" />
      
      {/* Label text with purple glow */}
      <span className="relative z-10 text-sm font-bold uppercase tracking-wider text-white drop-shadow-[0_0_15px_hsl(270,100%,70%)] group-hover:drop-shadow-[0_0_25px_hsl(270,100%,80%)] transition-all">
        {label}
      </span>
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
    <div className="min-h-screen pb-24 relative overflow-hidden bg-background">
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Interactive Character Image */}
        <div className="relative w-full max-w-lg">
          <img 
            src={guideCharacter} 
            alt="Ascension Guide Character" 
            className="w-full h-auto object-contain"
          />
          
          {/* Face - over the glowing purple eyes */}
          <LabeledZone 
            path="/guide/face" 
            label="Face"
            className="top-[12%] left-1/2 -translate-x-1/2 w-20 h-10 flex items-center justify-center"
          />
          
          {/* Body - over the midsection/chest area */}
          <LabeledZone 
            path="/guide/body" 
            label="Body"
            className="top-[40%] left-1/2 -translate-x-1/2 w-20 h-12 flex items-center justify-center"
          />
          
          {/* Hygiene - in left hand */}
          <LabeledZone 
            path="/guide/hygiene" 
            label="Hygiene"
            className="top-[62%] left-[8%] w-24 h-14 flex items-center justify-center"
          />
          
          {/* Style - in right hand */}
          <LabeledZone 
            path="/guide/style" 
            label="Style"
            className="top-[62%] right-[8%] w-20 h-14 flex items-center justify-center"
          />
        </div>
      </main>
    </div>
  );
}
