import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { CyberBackground } from '@/components/auth/CyberBackground';
import guideCharacter from '@/assets/guide-character-v2.png';

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
      <CyberBackground />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-2 sm:px-4">
        {/* Interactive Character Image */}
        <div className="relative w-full px-2 sm:px-4 flex justify-center">
          <img 
            src={guideCharacter} 
            alt="Ascension Guide Character" 
            className="mx-auto h-[70vh] w-auto max-w-none object-contain sm:h-auto sm:w-full sm:max-w-4xl"
          />
          
          {/* Face - at the chin area */}
          <LabeledZone 
            path="/guide/face" 
            label="Face"
            className="top-[28%] left-1/2 -translate-x-1/2 w-20 h-10 flex items-center justify-center"
          />
          
          {/* Body - lower near the belly */}
          <LabeledZone 
            path="/guide/body" 
            label="Body"
            className="top-[55%] left-1/2 -translate-x-1/2 w-20 h-12 flex items-center justify-center"
          />
          
          {/* Hygiene - in left hand */}
          <LabeledZone 
            path="/guide/hygiene" 
            label="Hygiene"
            className="top-[78%] left-[12%] w-24 h-14 flex items-center justify-center"
          />
          
          {/* Style - in right hand */}
          <LabeledZone 
            path="/guide/style" 
            label="Style"
            className="top-[78%] right-[12%] w-20 h-14 flex items-center justify-center"
          />
        </div>
      </main>
    </div>
  );
}
