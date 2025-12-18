import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard } from '@/components/auth/HUDFrame';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, User, LogOut, Zap, Crown, Settings, Shield, FileText } from 'lucide-react';
import { calculateLevel, getXpForCurrentLevel, getXpProgress, XP_PER_LEVEL } from '@/lib/xp-utils';

interface ProfileData {
  username: string | null;
  current_xp: number;
  level: number;
  is_premium: boolean;
  face_potential_score: number | null;
}

export default function Profile() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('username, current_xp, level, is_premium, face_potential_score')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
      }
      setLoadingProfile(false);
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const level = calculateLevel(profile.current_xp);
  const xpInLevel = getXpForCurrentLevel(profile.current_xp);
  const xpProgress = getXpProgress(profile.current_xp);

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      <CyberBackground />

      <main className="relative z-10 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold mb-1">HUNTER PROFILE</h1>
          <p className="text-sm font-mono text-muted-foreground">
            Your personal dashboard
          </p>
        </div>

        {/* Avatar Card */}
        <HUDCard className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center animate-pulse-glow">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-display font-bold">
                  {profile.username || user.email?.split('@')[0]}
                </h2>
                {profile.is_premium && (
                  <Crown className="w-5 h-5 text-premium" />
                )}
              </div>
              <p className="text-sm font-mono text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-level/20 text-level text-xs font-mono">
                  Level {level}
                </span>
                {profile.face_potential_score && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-mono">
                    Score: {profile.face_potential_score}
                  </span>
                )}
              </div>
            </div>
          </div>
        </HUDCard>

        {/* XP Progress */}
        <HUDCard className="p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono text-muted-foreground">Experience Points</span>
            <div className="flex items-center gap-1 text-xp">
              <Zap className="w-4 h-4" />
              <span className="font-mono text-sm">{profile.current_xp} XP</span>
            </div>
          </div>
          <Progress value={xpProgress} className="h-3 bg-muted mb-2" />
          <p className="text-xs font-mono text-muted-foreground text-right">
            {xpInLevel} / {XP_PER_LEVEL} XP to Level {level + 1}
          </p>
        </HUDCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <HUDCard className="p-4 text-center">
            <p className="text-3xl font-display font-bold text-level">{level}</p>
            <p className="text-xs font-mono text-muted-foreground">Current Level</p>
          </HUDCard>
          <HUDCard className="p-4 text-center">
            <p className="text-3xl font-display font-bold text-primary">
              {profile.face_potential_score || '--'}
            </p>
            <p className="text-xs font-mono text-muted-foreground">Face Score</p>
          </HUDCard>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="cyber" className="w-full justify-start" onClick={() => navigate('/onboarding')}>
            <Settings className="w-4 h-4 mr-2" />
            Update Survey Data
          </Button>
          <Button variant="cyber" className="w-full justify-start" onClick={() => navigate('/face-scan')}>
            <User className="w-4 h-4 mr-2" />
            New Face Scan
          </Button>
          <Button variant="destructive" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Legal Links */}
        <HUDCard className="p-4 mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Legal</h3>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-auto py-2 px-3 text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/privacy-policy')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Privacy Policy
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start h-auto py-2 px-3 text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/terms-of-service')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Terms of Service
            </Button>
          </div>
        </HUDCard>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground mt-6 font-mono">
          Ascendency v1.0.0
        </p>
      </main>
    </div>
  );
}
