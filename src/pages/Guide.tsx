import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { CyberBackground } from "@/components/auth/CyberBackground";
import guideCharacter from "@/assets/guide-character-v2.png";

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
      className={`absolute cursor-pointer transition-all duration-500 hover:scale-110 group ${className}`}
    >
      {/* Outer glow aura */}
      <div className="absolute inset-[-12px] bg-gradient-to-br from-[hsl(180,100%,50%)]/40 via-[hsl(270,100%,60%)]/30 to-[hsl(320,100%,50%)]/40 blur-xl animate-pulse opacity-80 group-hover:opacity-100 transition-opacity" 
           style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
      
      {/* Diamond shape - outer facet */}
      <div className="absolute inset-[-4px] bg-gradient-to-br from-[hsl(180,100%,70%)] via-[hsl(270,80%,60%)] to-[hsl(320,100%,60%)] opacity-90 group-hover:opacity-100 transition-all animate-[spin_10s_linear_infinite]"
           style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
      
      {/* Diamond shape - inner facet with holographic effect */}
      <div className="absolute inset-0 bg-gradient-to-tl from-[hsl(200,100%,80%)] via-white/90 to-[hsl(280,100%,75%)] backdrop-blur-sm"
           style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
      
      {/* Central shine/reflection */}
      <div className="absolute inset-[25%] bg-gradient-to-br from-white via-[hsl(180,100%,90%)] to-transparent opacity-80"
           style={{ clipPath: 'polygon(50% 10%, 90% 30%, 90% 70%, 50% 90%, 10% 70%, 10% 30%)' }} />
      
      {/* Floating sparkle particles */}
      <div className="absolute -top-2 left-1/2 w-1 h-1 bg-white rounded-full animate-ping" />
      <div className="absolute -bottom-1 left-1/4 w-0.5 h-0.5 bg-[hsl(180,100%,70%)] rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/4 -right-1 w-0.5 h-0.5 bg-[hsl(270,100%,70%)] rounded-full animate-ping" style={{ animationDelay: '1s' }} />

      {/* Label text */}
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-4 whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] text-white drop-shadow-[0_0_8px_hsl(180,100%,60%)] group-hover:drop-shadow-[0_0_15px_hsl(180,100%,80%)] group-hover:text-[hsl(180,100%,90%)] transition-all">
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
      navigate("/auth");
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
      <main className="relative z-10 flex flex-col items-center justify-end min-h-screen px-2 sm:px-4 pb-14">
        {/* Interactive Character Image */}
        <div className="relative w-full px-2 sm:px-4 flex justify-center">
          <img
            src={guideCharacter}
            alt="Ascension Guide Character"
            className="mx-auto h-[60vh] w-auto max-w-none object-contain sm:h-auto sm:w-full sm:max-w-4xl"
          />

          {/* Face - above the character's head */}
          <LabeledZone path="/guide/face" label="Face" className="top-[-0.5%] left-1/2 -translate-x-1/2 w-10 h-10" />

          {/* Body - center torso */}
          <LabeledZone path="/guide/body" label="Body" className="top-[55%] left-1/2 -translate-x-1/2 w-10 h-10" />

          {/* Hygiene - in left hand */}
          <LabeledZone path="/guide/hygiene" label="Hygiene" className="top-[52%] left-[2%] w-8 h-8" />

          {/* Style - in right hand */}
          <LabeledZone path="/guide/style" label="Style" className="top-[52%] right-[2%] w-8 h-8" />
        </div>
      </main>
    </div>
  );
}
