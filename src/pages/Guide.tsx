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
      className={`absolute cursor-pointer transition-all duration-300 hover:scale-125 group ${className}`}
    >
      {/* Outer energy ring - pulsing */}
      <div className="absolute inset-[-8px] rounded-full bg-gradient-to-r from-[hsl(270,100%,60%)] via-[hsl(200,100%,50%)]/80 to-[hsl(270,100%,60%)] blur-xl animate-pulse" />
      
      {/* Middle energy sphere */}
      <div className="absolute inset-[-4px] rounded-full bg-gradient-radial from-[hsl(270,100%,70%)] via-[hsl(280,100%,50%)]/90 to-transparent blur-md group-hover:blur-lg transition-all" />
      
      {/* Core energy ball - bright center */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-[hsl(270,100%,70%)] to-[hsl(280,100%,50%)] shadow-[0_0_20px_hsl(270,100%,60%),0_0_40px_hsl(270,100%,50%),0_0_60px_hsl(280,100%,40%)] group-hover:shadow-[0_0_30px_hsl(270,100%,70%),0_0_60px_hsl(270,100%,60%),0_0_90px_hsl(280,100%,50%)] transition-all" />
      
      {/* Inner bright core */}
      <div className="absolute inset-[20%] rounded-full bg-white blur-[1px]" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-[-12px] rounded-full border-2 border-[hsl(270,100%,70%)]/60 animate-[spin_8s_linear_infinite]" />
      <div className="absolute inset-[-16px] rounded-full border border-[hsl(200,100%,60%)]/40 animate-[spin_12s_linear_infinite_reverse]" />
      
      {/* Label text - positioned below the orb */}
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_hsl(270,100%,70%)] group-hover:drop-shadow-[0_0_20px_hsl(270,100%,80%)] transition-all">
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
      <main className="relative z-10 flex flex-col items-center justify-end min-h-screen px-2 sm:px-4">
        {/* Interactive Character Image */}
        <div className="relative w-full px-2 sm:px-4 flex justify-center pb-0">
          <img 
            src={guideCharacter} 
            alt="Ascension Guide Character" 
            className="mx-auto h-[60vh] w-auto max-w-none object-contain sm:h-auto sm:w-full sm:max-w-4xl"
          />
          
          {/* Face - above the character's head */}
          <LabeledZone 
            path="/guide/face" 
            label="Face"
            className="top-[4%] left-1/2 -translate-x-1/2 w-10 h-10"
          />
          
          {/* Body - center torso */}
          <LabeledZone 
            path="/guide/body" 
            label="Body"
            className="top-[55%] left-1/2 -translate-x-1/2 w-10 h-10"
          />
          
          {/* Hygiene - in left hand */}
          <LabeledZone 
            path="/guide/hygiene" 
            label="Hygiene"
            className="top-[68%] left-[22%] w-8 h-8"
          />
          
          {/* Style - in right hand */}
          <LabeledZone 
            path="/guide/style" 
            label="Style"
            className="top-[68%] right-[22%] w-8 h-8"
          />
        </div>
      </main>
    </div>
  );
}
