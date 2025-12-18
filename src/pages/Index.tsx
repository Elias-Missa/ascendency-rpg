import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { HUDCard, GlowingDivider } from '@/components/auth/HUDFrame';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { Progress } from '@/components/ui/progress';
import { Loader2, Zap, Target, TrendingUp, Scan, BookOpen, ChevronRight } from 'lucide-react';
import { calculateLevel, getXpForCurrentLevel, getXpProgress, XP_PER_LEVEL } from '@/lib/xp-utils';
import { cn } from '@/lib/utils';

interface ProfileData {
  current_xp: number;
  face_potential_score: number | null;
  username: string | null;
}

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [todayTaskCount, setTodayTaskCount] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      const { data: onboardingData } = await supabase
        .from('onboarding_surveys')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setHasCompletedOnboarding(!!onboardingData);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('current_xp, face_potential_score, username')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      const today = new Date().toISOString().split('T')[0];
      const { data: tasksData } = await supabase
        .from('daily_tasks')
        .select('id, is_completed')
        .eq('user_id', user.id)
        .eq('date_assigned', today);

      setTodayTaskCount(tasksData?.length || 0);
      setCompletedTasks(tasksData?.filter(t => t.is_completed).length || 0);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="font-mono text-muted-foreground text-xs">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const level = profile ? calculateLevel(profile.current_xp) : 1;
  const xpProgress = profile ? getXpProgress(profile.current_xp) : 0;
  const displayName = profile?.username || user.email?.split('@')[0] || 'Hunter';

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      <CyberBackground />
      
      <main className="relative z-10 px-4 pt-4 pb-6">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center animate-pulse-glow">
              <span className="text-lg font-display font-bold text-primary">{level}</span>
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground">WELCOME BACK</p>
              <h1 className="font-display text-lg font-bold leading-tight">{displayName.toUpperCase()}</h1>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/30">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-xs font-mono text-primary">{profile?.current_xp || 0} XP</span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-muted-foreground">LEVEL {level}</span>
            <span className="text-[10px] font-mono text-muted-foreground">LEVEL {level + 1}</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>

        {/* Stats Row - Compact */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <HUDCard className="p-3 text-center">
            <p className="text-2xl font-display font-bold text-primary">{level}</p>
            <p className="text-[10px] font-mono text-muted-foreground">LEVEL</p>
          </HUDCard>
          <HUDCard className="p-3 text-center">
            <p className="text-2xl font-display font-bold text-foreground">
              {profile?.face_potential_score || '--'}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground">FACE SCORE</p>
          </HUDCard>
          <HUDCard className="p-3 text-center">
            <p className="text-2xl font-display font-bold text-foreground">
              {completedTasks}/{todayTaskCount}
            </p>
            <p className="text-[10px] font-mono text-muted-foreground">TASKS</p>
          </HUDCard>
        </div>

        {/* Primary CTA - Face Scan */}
        {!profile?.face_potential_score && (
          <HUDCard 
            className="p-4 mb-4 border-primary/50 bg-gradient-to-r from-primary/10 to-transparent"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Scan className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-sm mb-0.5">START FACE ANALYSIS</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Unlock your personalized looksmax plan with AI analysis
                </p>
              </div>
              <Button 
                variant="cyber-fill" 
                size="sm"
                onClick={() => navigate('/face-scan')}
                className="shrink-0"
              >
                <Zap className="w-4 h-4" />
              </Button>
            </div>
          </HUDCard>
        )}

        {/* Onboarding CTA if not completed */}
        {!hasCompletedOnboarding && (
          <HUDCard className="p-4 mb-4 border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                <Target className="w-7 h-7 text-yellow-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-sm mb-0.5">COMPLETE SURVEY</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Calibrate the system with your profile data
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/onboarding')}
                className="shrink-0 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </HUDCard>
        )}

        <GlowingDivider className="my-5" />

        {/* Quick Actions Grid */}
        <h2 className="text-xs font-mono text-muted-foreground mb-3">QUICK ACTIONS</h2>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <QuickActionCard
            icon={TrendingUp}
            label="VIEW REPORT"
            description="Your quests"
            onClick={() => navigate('/report')}
          />
          <QuickActionCard
            icon={Target}
            label="DAILY TASKS"
            description={`${todayTaskCount} tasks`}
            onClick={() => navigate('/tasks')}
          />
          <QuickActionCard
            icon={BookOpen}
            label="GUIDE"
            description="Learn more"
            onClick={() => navigate('/guide')}
          />
          <QuickActionCard
            icon={Scan}
            label="NEW SCAN"
            description="Analyze face"
            onClick={() => navigate('/face-scan')}
          />
        </div>

        {/* System Status - Compact */}
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[10px] font-mono text-muted-foreground">
            SYSTEM OPERATIONAL
          </p>
        </div>
      </main>
    </div>
  );
}

function QuickActionCard({ 
  icon: Icon, 
  label, 
  description, 
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  description: string;
  onClick: () => void;
}) {
  return (
    <div 
      className="cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      <HUDCard className="p-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-display font-semibold leading-tight truncate">{label}</p>
            <p className="text-[10px] font-mono text-muted-foreground truncate">{description}</p>
          </div>
        </div>
      </HUDCard>
    </div>
  );
}
