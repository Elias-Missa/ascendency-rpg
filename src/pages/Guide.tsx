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
      className={`absolute cursor-pointer transition-all duration-300 hover:scale-110 group ${className}`}
    >
      {/* Outer pulsing ring */}
      <div className="absolute inset-[-8px] rounded-full border-2 border-[hsl(200,100%,70%)]/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
      
      {/* Outer glow aura */}
      <div className="absolute inset-[-4px] rounded-full bg-[hsl(200,100%,60%)] blur-lg opacity-70 group-hover:opacity-90 transition-opacity" />
      
      {/* Main opaque orb */}
      <div className="absolute inset-0 rounded-full bg-[hsl(200,80%,55%)] shadow-[0_0_20px_hsl(200,100%,60%),0_0_40px_hsl(200,100%,50%)/50] group-hover:shadow-[0_0_30px_hsl(200,100%,70%),0_0_50px_hsl(200,100%,60%)] transition-shadow" />
      
      {/* Inner lighter core */}
      <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-[hsl(200,100%,75%)] to-[hsl(200,80%,60%)]" />
      
      {/* Top highlight */}
      <div className="absolute inset-[25%] rounded-full bg-gradient-to-b from-white/50 to-transparent" style={{ height: '40%' }} />

      {/* Label inside orb */}
      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold uppercase tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
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
