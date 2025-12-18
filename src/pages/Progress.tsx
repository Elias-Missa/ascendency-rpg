import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard } from '@/components/auth/HUDFrame';
import { Loader2, Camera, Construction } from 'lucide-react';

export default function Progress() {
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
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold mb-1">PROGRESS TRACKER</h1>
          <p className="text-sm font-mono text-muted-foreground">
            Track your transformation over time
          </p>
        </div>

        <HUDCard className="p-12 text-center">
          <Construction className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">COMING SOON</h2>
          <p className="text-muted-foreground">
            Monthly progress photos and transformation tracking coming soon.
          </p>
        </HUDCard>
      </main>
    </div>
  );
}
