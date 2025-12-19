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
      <div className="absolute inset-[-10px] rounded-full border-2 border-[hsl(200,100%,70%)]/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
      
      {/* Outer glow aura */}
      <div className="absolute inset-[-6px] rounded-full bg-[hsl(200,100%,55%)]/50 blur-xl group-hover:opacity-80 transition-opacity" />
      
      {/* Main opaque orb */}
      <div className="absolute inset-0 rounded-full bg-[hsl(200,70%,50%)]/50 shadow-[0_0_25px_hsl(200,100%,55%)/50,0_0_50px_hsl(200,100%,45%)/30] group-hover:shadow-[0_0_35px_hsl(200,100%,65%),0_0_60px_hsl(200,100%,55%)] transition-shadow" />
      
      {/* Inner lighter core */}
      <div className="absolute inset-[12%] rounded-full bg-gradient-to-br from-[hsl(200,90%,65%)]/50 to-[hsl(200,70%,50%)]/50" />
      
      {/* Top highlight */}
      <div className="absolute inset-[20%] rounded-full bg-gradient-to-b from-white/20 to-transparent" style={{ height: '35%' }} />

      {/* Label inside orb */}
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold uppercase tracking-wide text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
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
        {/* Title */}
        <h1 className="absolute top-6 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.2em] text-center">
          <span className="bg-gradient-to-r from-[hsl(200,100%,70%)] via-[hsl(180,100%,60%)] to-[hsl(200,100%,70%)] bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(200,100%,60%/0.5)]">
            Full LooksMaxing Guide
          </span>
        </h1>
        
        {/* Interactive Character Image */}
        <div className="relative w-full px-2 sm:px-4 flex justify-center">
          <img
            src={guideCharacter}
            alt="Ascension Guide Character"
            className="mx-auto h-[60vh] w-auto max-w-none object-contain sm:h-auto sm:w-full sm:max-w-4xl"
          />

          {/* Face - above the character's head */}
          <LabeledZone path="/guide/face" label="Face" className="top-[-0.5%] left-1/2 -translate-x-1/2 w-14 h-14" />

          {/* Body - center torso */}
          <LabeledZone path="/guide/body" label="Body" className="top-[55%] left-1/2 -translate-x-1/2 w-14 h-14" />

          {/* Hygiene - in left hand */}
          <LabeledZone path="/guide/hygiene" label="Hygiene" className="top-[52%] left-[2%] w-14 h-14" />

          {/* Style - in right hand */}
          <LabeledZone path="/guide/style" label="Style" className="top-[52%] right-[2%] w-14 h-14" />
        </div>
      </main>
    </div>
  );
}
