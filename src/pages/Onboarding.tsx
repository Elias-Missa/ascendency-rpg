import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard, GlowingDivider } from '@/components/auth/HUDFrame';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { StepVitalStats, type VitalStatsData } from '@/components/onboarding/StepVitalStats';
import { StepLifestyle, type LifestyleData } from '@/components/onboarding/StepLifestyle';
import { StepInventory, type InventoryData } from '@/components/onboarding/StepInventory';

const STEPS = [
  { id: 1, label: 'VITAL STATS', description: 'The Basics' },
  { id: 2, label: 'LIFESTYLE', description: 'Hunter Habits' },
  { id: 3, label: 'INVENTORY', description: 'Calibration' },
];

export default function Onboarding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [vitalStats, setVitalStats] = useState<VitalStatsData>({
    age: 25,
    gender: '',
    heightUnit: 'cm',
    heightCm: 170,
    heightFt: 5,
    heightIn: 7,
    weightUnit: 'kg',
    weightKg: 70,
    weightLbs: 154,
    ethnicity: '',
    bodyFatPercent: 15,
  });
  
  const [lifestyle, setLifestyle] = useState<LifestyleData>({
    workoutsPerWeek: 3,
    waterIntake: '2L',
    wearsGlasses: false,
    usesMouthTape: false,
  });
  
  const [inventory, setInventory] = useState<InventoryData>({
    supplements: [],
    consentedToBiometrics: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const canProceed = () => {
    if (currentStep === 1) {
      return vitalStats.gender && vitalStats.ethnicity;
    }
    if (currentStep === 2) {
      return true; // All lifestyle fields have defaults
    }
    if (currentStep === 3) {
      return inventory.consentedToBiometrics;
    }
    return false;
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user || !inventory.consentedToBiometrics) return;
    
    setIsSubmitting(true);
    
    try {
      // Convert height to cm
      const heightCm = vitalStats.heightUnit === 'cm' 
        ? vitalStats.heightCm 
        : Math.round((vitalStats.heightFt * 30.48) + (vitalStats.heightIn * 2.54));
      
      // Convert weight to kg
      const weightKg = vitalStats.weightUnit === 'kg'
        ? vitalStats.weightKg
        : Math.round(vitalStats.weightLbs / 2.205);

      // Build habits JSONB
      const habits = {
        gender: vitalStats.gender,
        bodyFatPercent: vitalStats.bodyFatPercent,
        workoutsPerWeek: lifestyle.workoutsPerWeek,
        waterIntake: lifestyle.waterIntake,
        wearsGlasses: lifestyle.wearsGlasses,
        usesMouthTape: lifestyle.usesMouthTape,
        supplements: inventory.supplements,
      };

      const { error } = await supabase
        .from('onboarding_surveys')
        .upsert({
          user_id: user.id,
          age: vitalStats.age,
          height_cm: heightCm,
          weight_kg: weightKg,
          ethnicity: vitalStats.ethnicity,
          habits,
          consented_to_biometrics: inventory.consentedToBiometrics,
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      toast({
        title: 'Hunter Profile Complete',
        description: 'Your calibration data has been recorded.',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: 'Calibration Failed',
        description: 'Could not save your data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <CyberBackground />
      
      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary mb-4 animate-pulse-glow">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-wider glow-text">
            HUNTER REGISTRATION
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm tracking-widest">
            SYSTEM CALIBRATION REQUIRED
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.id
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-border text-muted-foreground'
                  } ${currentStep === step.id ? 'shadow-[0_0_20px_hsl(var(--primary)/0.4)]' : ''}`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-mono text-sm">{step.id}</span>
                  )}
                </div>
                <span className={`text-xs font-mono mt-2 hidden sm:block ${
                  currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-12 md:w-20 h-0.5 mx-2 transition-colors duration-300 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <HUDCard className="p-6 md:p-8 animate-scale-in">
          <div className="mb-6">
            <h2 className="text-xl font-display font-semibold text-foreground">
              {STEPS[currentStep - 1].label}
            </h2>
            <p className="text-sm text-muted-foreground font-mono">
              {STEPS[currentStep - 1].description}
            </p>
          </div>
          
          <GlowingDivider className="mb-6" />

          {/* Step Forms */}
          <div className="min-h-[300px]">
            {currentStep === 1 && (
              <StepVitalStats data={vitalStats} onChange={setVitalStats} />
            )}
            {currentStep === 2 && (
              <StepLifestyle data={lifestyle} onChange={setLifestyle} />
            )}
            {currentStep === 3 && (
              <StepInventory data={inventory} onChange={setInventory} />
            )}
          </div>

          <GlowingDivider className="my-6" />

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="cyber-ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={currentStep === 1 ? 'invisible' : ''}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < 3 ? (
              <Button
                variant="cyber"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="cyber-fill"
                onClick={handleComplete}
                disabled={!canProceed() || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Complete
                  </>
                )}
              </Button>
            )}
          </div>
        </HUDCard>
      </div>
    </div>
  );
}
