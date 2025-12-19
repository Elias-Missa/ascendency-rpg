import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard } from '@/components/auth/HUDFrame';
import { Loader2, ArrowLeft, Palette, Watch, Glasses, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const styleTopics = [
  {
    id: 'wardrobe',
    icon: Palette,
    title: 'Wardrobe Essentials',
    content: `Build a versatile wardrobe with these essentials:
    
• **Neutral Colors**: Black, white, navy, gray as base
• **Quality Basics**: Invest in well-fitted t-shirts and jeans
• **Dress Shirts**: Have 2-3 in white, light blue, black
• **Outerwear**: A quality leather jacket or blazer
• **Footwear**: Clean white sneakers + dress shoes`
  },
  {
    id: 'fit',
    icon: Watch,
    title: 'The Perfect Fit',
    content: `Fit is more important than brand:
    
• **Shoulders**: Seams should hit at shoulder bone
• **Chest**: Room for a fist, no more
• **Sleeves**: End at wrist bone
• **Length**: Shirts end at mid-fly
• **Pants**: Slight break or no break at ankle`
  },
  {
    id: 'accessories',
    icon: Glasses,
    title: 'Accessories',
    content: `Elevate outfits with the right accessories:
    
• **Watch**: One quality timepiece beats many cheap ones
• **Sunglasses**: Find frames that suit your face shape
• **Belt**: Match leather color to shoes
• **Jewelry**: Keep it minimal and meaningful
• **Bag**: Quality backpack or messenger bag`
  },
  {
    id: 'hair-style',
    icon: Crown,
    title: 'Hair Styling',
    content: `Your hair is your crown:
    
• **Find Your Style**: Match hairstyle to face shape
• **Products**: Pomade for shine, clay for matte finish
• **Maintenance**: Get regular trims every 3-4 weeks
• **Health**: Use quality shampoo, avoid daily washing
• **Experiment**: Try different styles, take photos`
  }
];

export default function GuideStyle() {
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
            <h1 className="text-2xl font-display font-bold glow-text">STYLE</h1>
            <p className="text-sm font-mono text-muted-foreground">
              Master your personal style
            </p>
          </div>
        </div>

        {/* Content */}
        <HUDCard className="p-4">
          <Accordion type="single" collapsible className="w-full">
            {styleTopics.map((topic) => (
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
