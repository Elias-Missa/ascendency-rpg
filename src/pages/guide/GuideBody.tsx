import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard } from '@/components/auth/HUDFrame';
import { Loader2, ArrowLeft, Dumbbell, Utensils, Moon, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const bodyTopics = [
  {
    id: 'training',
    icon: Dumbbell,
    title: 'Training & Exercise',
    content: `Build an aesthetic physique through training:
    
• **Consistency**: Train 3-5 days per week minimum
• **Progressive Overload**: Increase weight/reps over time
• **Compound Movements**: Focus on squat, deadlift, bench, rows
• **Isolation Work**: Add targeted exercises for weak points
• **Recovery**: Rest days are when you actually grow`
  },
  {
    id: 'nutrition',
    icon: Utensils,
    title: 'Nutrition Fundamentals',
    content: `Fuel your body for optimal results:
    
• **Protein**: 0.8-1g per pound of bodyweight
• **Calories**: Track intake, adjust based on goals
• **Whole Foods**: 80% from unprocessed sources
• **Hydration**: 0.5-1 gallon of water daily
• **Timing**: Eat protein with every meal`
  },
  {
    id: 'sleep',
    icon: Moon,
    title: 'Sleep & Recovery',
    content: `Recovery is where gains are made:
    
• **Duration**: 7-9 hours per night
• **Schedule**: Same sleep/wake times daily
• **Environment**: Dark, cool, quiet room
• **Pre-Sleep**: No screens 1 hour before bed
• **Stress**: Manage stress for quality rest`
  },
  {
    id: 'posture',
    icon: Flame,
    title: 'Posture & Presence',
    content: `Good posture transforms your appearance:
    
• **Shoulders Back**: Roll shoulders down and back
• **Chin Neutral**: Avoid forward head posture
• **Core Engaged**: Light tension in abs
• **Stretching**: Daily hip flexor and chest stretches
• **Strengthening**: Train rear delts and back`
  }
];

export default function GuideBody() {
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
    <div className="min-h-screen pb-24 relative overflow-y-auto">
      <CyberBackground />

      <main className="relative z-10 container mx-auto px-4 py-6 overflow-visible">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/guide')}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold glow-text">BODY</h1>
            <p className="text-sm font-mono text-muted-foreground">
              Build your ideal physique
            </p>
          </div>
        </div>

        {/* Content */}
        <HUDCard className="p-4">
          <Accordion type="single" collapsible className="w-full">
            {bodyTopics.map((topic) => (
              <AccordionItem key={topic.id} value={topic.id} className="border-border/50">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <topic.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-display font-semibold text-left">{topic.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground whitespace-pre-line pl-13">
                  {topic.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </HUDCard>
      </main>
    </div>
  );
}
