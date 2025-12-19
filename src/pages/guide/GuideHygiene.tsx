import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard } from '@/components/auth/HUDFrame';
import { Loader2, ArrowLeft, Droplets, Wind, Scissors, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const hygieneTopics = [
  {
    id: 'shower',
    icon: Droplets,
    title: 'Shower Routine',
    content: `Optimize your shower routine for maximum cleanliness:
    
• **Frequency**: Shower daily, especially after workouts
• **Temperature**: Use lukewarm water to protect skin
• **Body Wash**: Choose a quality soap without harsh chemicals
• **Exfoliation**: Scrub body 2-3 times per week
• **Cold Finish**: End with cold water for skin tightening`
  },
  {
    id: 'scent',
    icon: Wind,
    title: 'Scent & Fragrance',
    content: `Smell great without overdoing it:
    
• **Deodorant**: Apply daily, consider aluminum-free options
• **Cologne**: 2-3 sprays on pulse points (wrists, neck)
• **Layering**: Use matching shower gel and lotion
• **Freshness**: Carry travel-size products for touch-ups
• **Clothing**: Wash gym clothes after every use`
  },
  {
    id: 'grooming',
    icon: Scissors,
    title: 'Personal Grooming',
    content: `Maintain a well-groomed appearance:
    
• **Nails**: Trim weekly, keep clean and filed
• **Hair Removal**: Maintain body hair as preferred
• **Ear/Nose Hair**: Check and trim regularly
• **Dental**: Brush 2x, floss daily, regular checkups
• **Haircuts**: Get trimmed every 3-4 weeks`
  },
  {
    id: 'clothing-hygiene',
    icon: Shirt,
    title: 'Clothing Hygiene',
    content: `Clean clothes complete your hygiene routine:
    
• **Underwear**: Change daily, no exceptions
• **Shirts**: Wear once or twice max before washing
• **Pants**: Can go 3-4 wears if not dirty
• **Sheets**: Wash weekly for clear skin
• **Shoes**: Rotate pairs, use shoe spray`
  }
];

export default function GuideHygiene() {
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
            <h1 className="text-2xl font-display font-bold glow-text">HYGIENE</h1>
            <p className="text-sm font-mono text-muted-foreground">
              Master cleanliness and grooming
            </p>
          </div>
        </div>

        {/* Content */}
        <HUDCard className="p-4">
          <Accordion type="single" collapsible className="w-full">
            {hygieneTopics.map((topic) => (
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
