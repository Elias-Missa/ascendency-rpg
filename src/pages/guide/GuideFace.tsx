import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard } from '@/components/auth/HUDFrame';
import { Loader2, ArrowLeft, Eye, Smile, Sparkles, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faceTopics = [
  {
    id: 'skin',
    icon: Sparkles,
    title: 'Skin Care Fundamentals',
    content: `Clear, healthy skin is the foundation of facial aesthetics. Key practices include:
    
• **Cleansing**: Wash face twice daily with a gentle cleanser
• **Moisturizing**: Use a quality moisturizer suited to your skin type
• **Sunscreen**: Apply SPF 30+ daily to prevent aging and damage
• **Retinoids**: Consider retinol products for anti-aging and acne
• **Hydration**: Drink at least 8 glasses of water daily`
  },
  {
    id: 'eyes',
    icon: Eye,
    title: 'Eye Area Enhancement',
    content: `The eyes are a focal point of the face. Improve them with:
    
• **Sleep**: Get 7-9 hours to reduce dark circles
• **Eye Cream**: Use caffeine-based products for puffiness
• **Cold Compress**: Reduce morning puffiness with cold spoons
• **Eyebrow Grooming**: Shape brows to frame your face
• **Sclera Health**: Reduce redness with proper sleep and hydration`
  },
  {
    id: 'facial-structure',
    icon: Smile,
    title: 'Facial Structure Optimization',
    content: `Enhance your facial structure through:
    
• **Mewing**: Proper tongue posture for jawline definition
• **Chewing**: Use mastic gum to develop masseter muscles
• **Face Fat Reduction**: Lower body fat % to reveal bone structure
• **Bloat Reduction**: Reduce sodium, alcohol, and processed foods
• **Posture**: Proper neck posture for better facial appearance`
  },
  {
    id: 'teeth',
    icon: Sun,
    title: 'Teeth & Smile',
    content: `A great smile transforms your appearance:
    
• **Whitening**: Use whitening strips or professional treatments
• **Oral Hygiene**: Brush 2x daily, floss, and use mouthwash
• **Alignment**: Consider orthodontics if needed
• **Lip Care**: Keep lips moisturized and healthy
• **Smile Practice**: Train your natural smile in the mirror`
  }
];

export default function GuideFace() {
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
            <h1 className="text-2xl font-display font-bold glow-text">FACE</h1>
            <p className="text-sm font-mono text-muted-foreground">
              Master your facial aesthetics
            </p>
          </div>
        </div>

        {/* Content */}
        <HUDCard className="p-4">
          <Accordion type="single" collapsible className="w-full">
            {faceTopics.map((topic) => (
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
