import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import guideCharacter from '@/assets/guide-character.png';

interface ClickZoneProps {
  path: string;
  className: string;
  ariaLabel: string;
}

function ClickZone({ path, className, ariaLabel }: ClickZoneProps) {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(path)}
      aria-label={ariaLabel}
      className={`absolute cursor-pointer transition-all duration-300 hover:scale-110 ${className}`}
    >
      {/* Invisible clickable area with hover glow effect */}
      <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 bg-primary/20 blur-xl" />
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
      {/* The image includes its own background */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Interactive Character Image */}
        <div className="relative w-full max-w-md aspect-square">
          <img 
            src={guideCharacter} 
            alt="Ascension Guide Character" 
            className="w-full h-full object-contain"
          />
          
          {/* Click zones positioned over the labeled areas in the image */}
          {/* Face - over the glowing face area */}
          <ClickZone 
            path="/guide/face" 
            ariaLabel="Face Guide"
            className="top-[25%] left-1/2 -translate-x-1/2 w-24 h-16"
          />
          
          {/* Hygiene - over the left orb */}
          <ClickZone 
            path="/guide/hygiene" 
            ariaLabel="Hygiene Guide"
            className="top-[45%] left-[12%] w-20 h-20"
          />
          
          {/* Style - over the right orb */}
          <ClickZone 
            path="/guide/style" 
            ariaLabel="Style Guide"
            className="top-[45%] right-[12%] w-20 h-20"
          />
          
          {/* Body - over the body text area */}
          <ClickZone 
            path="/guide/body" 
            ariaLabel="Body Guide"
            className="top-[52%] left-1/2 -translate-x-1/2 w-20 h-12"
          />
        </div>
      </main>
    </div>
  );
}
