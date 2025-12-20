import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard } from '@/components/auth/HUDFrame';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowLeft, Target, CheckCircle, ShoppingBag, Zap, Clock, TrendingUp } from 'lucide-react';

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

// Detailed content for each quest type (will be personalized later)
const QUEST_DETAILS: Record<string, {
  overview: string;
  steps: string[];
  tips: string[];
  timeline: string;
  products: { name: string; description: string }[];
}> = {
  'Mewing / Tongue Posture': {
    overview: 'Mewing is the practice of proper tongue posture to potentially improve jawline definition and facial structure over time. By keeping your tongue pressed against the roof of your mouth, you engage muscles that may help sculpt your face.',
    steps: [
      'Rest your entire tongue flat against the roof of your mouth',
      'Ensure the back third of your tongue is also pressed up',
      'Keep your lips sealed and teeth lightly touching',
      'Breathe through your nose at all times',
      'Maintain this position throughout the day',
    ],
    tips: [
      'Set hourly reminders to check your tongue posture',
      'Practice the "swallow and hold" technique to find correct position',
      'Be patient - results may take 6-12 months to become visible',
      'Combine with proper neck posture for best results',
    ],
    timeline: '6-12 months for noticeable changes',
    products: [
      { name: 'Mewing.app', description: 'Track your mewing progress with daily reminders' },
      { name: 'Jawline Exerciser', description: 'Complement mewing with targeted jaw exercises' },
    ],
  },
  'Whitening Strips': {
    overview: 'Teeth whitening strips are an effective at-home solution for removing surface stains and brightening your smile. Consistent use can result in teeth several shades whiter.',
    steps: [
      'Brush and floss teeth before applying strips',
      'Apply strips to upper and lower teeth, pressing firmly',
      'Leave on for the recommended time (usually 30 minutes)',
      'Remove strips and rinse mouth',
      'Avoid staining foods/drinks for 30 minutes after',
    ],
    tips: [
      'Use once daily for 2 weeks for best results',
      'Avoid coffee, tea, and red wine during treatment',
      'If sensitivity occurs, use every other day',
      'Store strips in a cool, dry place',
    ],
    timeline: '7-14 days for visible whitening',
    products: [
      { name: 'Crest 3D White Professional Effects', description: 'Professional-level whitening at home' },
      { name: 'Sensodyne Pronamel', description: 'Toothpaste for sensitive teeth during whitening' },
    ],
  },
  'Lose Body Fat': {
    overview: 'Reducing body fat to 10-15% reveals facial bone structure and creates a more defined, angular appearance. This is one of the highest-impact changes you can make for facial aesthetics.',
    steps: [
      'Calculate your TDEE and create a 300-500 calorie deficit',
      'Prioritize protein intake (0.8-1g per lb bodyweight)',
      'Incorporate resistance training 3-4x per week',
      'Add 2-3 cardio sessions weekly for fat burning',
      'Track progress weekly, not daily',
    ],
    tips: [
      'Take weekly progress photos in same lighting',
      'Focus on strength gains while in a deficit',
      'Stay hydrated - it helps reduce water retention',
      'Get 7-9 hours of sleep for optimal fat loss',
    ],
    timeline: '3-6 months depending on starting point',
    products: [
      { name: 'MyFitnessPal', description: 'Track calories and macros accurately' },
      { name: 'WHOOP or Oura Ring', description: 'Monitor recovery and sleep quality' },
    ],
  },
};

const DEFAULT_DETAILS = {
  overview: 'This quest focuses on improving a specific aspect of your appearance. Follow the action plan below to see results.',
  steps: [
    'Review the action plan carefully',
    'Gather any necessary products or tools',
    'Set a daily reminder to work on this quest',
    'Track your progress consistently',
    'Be patient and stay committed',
  ],
  tips: [
    'Consistency is more important than intensity',
    'Take before photos to track progress',
    'Join communities for motivation and advice',
  ],
  timeline: '4-8 weeks for initial results',
  products: [],
};

export default function QuestDetail() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user || !id) return;

    const fetchRecommendation = async () => {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (data && !error) {
        setRecommendation(data);
      }
      setLoading(false);
    };

    fetchRecommendation();
  }, [user, id]);

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

  const handleAddToTasks = async () => {
    if (!user || !recommendation) return;

    // Add as a daily task
    await supabase.from('daily_tasks').insert({
      user_id: user.id,
      task_name: recommendation.issue,
      xp_reward: 15,
    });

    navigate('/tasks');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-background relative">
        <CyberBackground />
        <div className="relative z-10 container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Quest not found</p>
          <Button onClick={() => navigate('/report')} className="mt-4">
            Back to Report
          </Button>
        </div>
      </div>
    );
  }

  const details = QUEST_DETAILS[recommendation.issue] || DEFAULT_DETAILS;

  return (
    <div className="min-h-screen pb-24 bg-background relative">
      <CyberBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/report')}
            className="text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <Badge className={`${getCategoryColor(recommendation.category)} border font-mono text-xs`}>
              {recommendation.category}
            </Badge>
          </div>
        </div>

        {/* Quest Title */}
        <HUDCard className="mb-6">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-xl text-foreground leading-tight mb-3">
                  {recommendation.issue}
                </h1>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-muted-foreground">IMPACT</span>
                      <span className="font-mono text-xs text-emerald-400">{recommendation.impact_score}/10</span>
                    </div>
                    <Progress value={(recommendation.impact_score || 0) * 10} className="h-2 bg-muted" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-muted-foreground">EFFORT</span>
                      <span className="font-mono text-xs text-amber-400">{recommendation.effort_score}/10</span>
                    </div>
                    <Progress value={(recommendation.effort_score || 0) * 10} className="h-2 bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </HUDCard>

        {/* Timeline */}
        <HUDCard className="mb-4">
          <div className="p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-mono text-xs text-muted-foreground">ESTIMATED TIMELINE</p>
              <p className="font-display text-sm text-foreground">{details.timeline}</p>
            </div>
          </div>
        </HUDCard>

        {/* Overview */}
        <HUDCard className="mb-4">
          <div className="p-5">
            <h2 className="font-display text-sm text-primary mb-3 tracking-wider">OVERVIEW</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {details.overview}
            </p>
          </div>
        </HUDCard>

        {/* Action Plan */}
        <HUDCard className="mb-4">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="font-display text-sm text-primary tracking-wider">ACTION PLAN</h2>
            </div>
            <div className="space-y-3">
              {details.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="font-mono text-xs text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </HUDCard>

        {/* Tips */}
        <HUDCard className="mb-4">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="font-display text-sm text-amber-400 tracking-wider">PRO TIPS</h2>
            </div>
            <ul className="space-y-2">
              {details.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </HUDCard>

        {/* Product Recommendations */}
        {details.products.length > 0 && (
          <HUDCard className="mb-6">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <h2 className="font-display text-sm text-primary tracking-wider">RECOMMENDED PRODUCTS</h2>
              </div>
              <div className="space-y-3">
                {details.products.map((product, index) => (
                  <div key={index} className="p-3 rounded bg-muted/50 border border-border/50">
                    <p className="font-display text-sm text-foreground mb-1">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </HUDCard>
        )}

        {/* Add to Tasks Button */}
        <Button
          onClick={handleAddToTasks}
          className="w-full h-14 font-display text-base tracking-wider glow-cyan"
        >
          <Zap className="w-5 h-5 mr-2" />
          ADD TO DAILY TASKS
        </Button>
      </div>
    </div>
  );
}
