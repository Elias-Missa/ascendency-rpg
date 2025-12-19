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
      <div className="absolute inset-[-6px] rounded-full border-2 border-[hsl(270,100%,70%)]/60 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
      
      {/* Static outer ring */}
      <div className="absolute inset-[-4px] rounded-full border border-[hsl(270,100%,60%)]/80 group-hover:border-[hsl(270,100%,80%)] transition-colors" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-[hsl(270,100%,60%)] blur-md opacity-60 group-hover:opacity-80 transition-opacity" />
      
      {/* Solid core */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(270,100%,75%)] to-[hsl(280,100%,55%)] shadow-[0_0_15px_hsl(270,100%,60%)] group-hover:shadow-[0_0_25px_hsl(270,100%,70%)] transition-shadow" />
      
      {/* Inner highlight */}
      <div className="absolute inset-[30%] rounded-full bg-white/70 blur-[1px]" />

      {/* Label */}
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-[hsl(270,100%,85%)] drop-shadow-[0_0_6px_hsl(270,100%,60%)] group-hover:text-white transition-colors">
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
