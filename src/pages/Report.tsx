import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard } from '@/components/auth/HUDFrame';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Target, Zap, TrendingUp, ChevronRight, Shield } from 'lucide-react';

interface Recommendation {
  id: string;
  category: string;
  issue: string;
  action_plan: string | null;
  product_recommendation: string | null;
  impact_score: number | null;
  effort_score: number | null;
  roi_score: number | null;
  is_completed: boolean;
}

interface Profile {
  username: string | null;
  avatar_url: string | null;
  level: number;
  current_xp: number;
  face_potential_score: number | null;
}

const SAMPLE_RECOMMENDATIONS = [
  {
    category: 'Jaw',
    issue: 'Mewing / Tongue Posture',
    action_plan: 'Practice proper tongue posture by pressing your entire tongue against the roof of your mouth. Maintain this position throughout the day.',
    product_recommendation: 'Mewing App for tracking and reminders',
    impact_score: 9,
    effort_score: 3,
  },
  {
    category: 'Teeth',
    issue: 'Whitening Strips',
    action_plan: 'Apply whitening strips for 30 minutes daily for 2 weeks. Avoid staining foods and drinks during treatment.',
    product_recommendation: 'Crest 3D White Professional Effects',
    impact_score: 7,
    effort_score: 2,
  },
  {
    category: 'Face',
    issue: 'Lose Body Fat',
    action_plan: 'Reduce body fat to 10-15% to reveal facial bone structure. Focus on caloric deficit and resistance training.',
    product_recommendation: 'MyFitnessPal for calorie tracking',
    impact_score: 8,
    effort_score: 9,
  },
];

export default function Report() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingText, setLoadingText] = useState('CALIBRATING BIOMETRICS...');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, avatar_url, level, current_xp, face_potential_score')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch recommendations
      const { data: recData } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', user.id);

      if (recData && recData.length > 0) {
        // Sort by ROI (impact / effort) descending
        const sorted = recData.sort((a, b) => {
          const roiA = (a.impact_score || 0) / (a.effort_score || 1);
          const roiB = (b.impact_score || 0) / (b.effort_score || 1);
          return roiB - roiA;
        });
        setRecommendations(sorted);
        setIsAnalyzing(false);
      } else {
        // No recommendations - run simulation
        runSimulation();
      }
    };

    fetchData();
  }, [user]);

  const runSimulation = async () => {
    if (!user) return;

    // Simulate analysis text changes
    setTimeout(() => setLoadingText('ANALYZING FACIAL GEOMETRY...'), 1000);
    setTimeout(() => setLoadingText('CALCULATING POTENTIAL...'), 2000);

    // After 3 seconds, insert sample data
    setTimeout(async () => {
      const insertData = SAMPLE_RECOMMENDATIONS.map((rec) => ({
        user_id: user.id,
        category: rec.category,
        issue: rec.issue,
        action_plan: rec.action_plan,
        product_recommendation: rec.product_recommendation,
        impact_score: rec.impact_score,
        effort_score: rec.effort_score,
      }));

      const { data, error } = await supabase
        .from('recommendations')
        .insert(insertData)
        .select();

      if (data && !error) {
        // Sort by ROI descending
        const sorted = data.sort((a, b) => {
          const roiA = (a.impact_score || 0) / (a.effort_score || 1);
          const roiB = (b.impact_score || 0) / (b.effort_score || 1);
          return roiB - roiA;
        });
        setRecommendations(sorted);

        // Update face potential score
        await supabase
          .from('profiles')
          .update({ face_potential_score: 72 })
          .eq('id', user.id);

        setProfile((prev) => prev ? { ...prev, face_potential_score: 72 } : null);
      }

      setIsAnalyzing(false);
    }, 3000);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Jaw: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      Teeth: 'bg-cyan-500/20 text-cyan border-cyan/50',
      Face: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
      Skin: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
      Hair: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
    };
    return colors[category] || 'bg-muted text-muted-foreground border-border';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Loading / Analysis State
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <CyberBackground />
        <div className="relative z-10 text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto rounded-full border-2 border-primary/50 flex items-center justify-center animate-pulse">
              <div className="w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center">
                <Target className="w-12 h-12 text-primary animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            </div>
            <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-primary animate-ping opacity-20" />
          </div>
          
          <h1 className="font-display text-2xl text-primary mb-4 tracking-wider animate-pulse">
            SYSTEM ANALYSIS
          </h1>
          <p className="font-mono text-sm text-muted-foreground tracking-widest">
            {loadingText}
          </p>
          
          <div className="mt-8 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-background relative">
      <CyberBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <HUDCard className="mb-8">
          <div className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-2 border-primary/50">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-display text-2xl">
                  {profile?.username?.charAt(0).toUpperCase() || 'H'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-display text-xl text-foreground">
                    {profile?.username || 'Hunter'}
                  </h1>
                  <Badge className="bg-primary/20 text-primary border-primary/50 font-mono">
                    LVL {profile?.level || 1}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-mono">{profile?.current_xp || 0} XP</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-primary/50 flex items-center justify-center bg-primary/5">
                    <span className="font-display text-3xl text-primary">
                      {profile?.face_potential_score || 72}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-background px-2">
                    <span className="font-mono text-xs text-muted-foreground tracking-wider">
                      /100
                    </span>
                  </div>
                </div>
                <p className="font-mono text-xs text-primary mt-3 tracking-wider">
                  FACE POTENTIAL
                </p>
              </div>
            </div>
          </div>
        </HUDCard>

        {/* Quest List Header */}
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg text-foreground tracking-wide">
            PRIORITY QUESTS
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            SORTED BY ROI
          </span>
        </div>

        {/* Quest Cards */}
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <HUDCard key={rec.id} className="group hover:border-primary/50 transition-all duration-300">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="font-display text-sm text-primary">
                      {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-foreground truncate">
                        {rec.issue}
                      </h3>
                      <Badge className={`${getCategoryColor(rec.category)} border font-mono text-xs`}>
                        {rec.category}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs text-muted-foreground">IMPACT</span>
                          <span className="font-mono text-xs text-emerald-400">{rec.impact_score}/10</span>
                        </div>
                        <Progress 
                          value={(rec.impact_score || 0) * 10} 
                          className="h-2 bg-muted"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs text-muted-foreground">EFFORT</span>
                          <span className="font-mono text-xs text-amber-400">{rec.effort_score}/10</span>
                        </div>
                        <Progress 
                          value={(rec.effort_score || 0) * 10} 
                          className="h-2 bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex-shrink-0 text-primary hover:bg-primary/10 group-hover:translate-x-1 transition-transform"
                  >
                    <span className="font-mono text-xs mr-1">VIEW</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </HUDCard>
          ))}
        </div>

        {/* Legal Footer */}
        <div className="mt-12 pt-6 border-t border-border/50">
          <div className="flex items-center gap-2 justify-center text-muted-foreground">
            <Shield className="w-4 h-4" />
            <p className="font-mono text-xs tracking-wide">
              SYSTEM MESSAGE: NOT MEDICAL ADVICE. COSMETIC SUGGESTIONS ONLY.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
