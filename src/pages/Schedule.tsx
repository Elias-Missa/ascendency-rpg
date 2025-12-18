import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard, GlowingDivider } from '@/components/auth/HUDFrame';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Loader2, 
  CalendarClock, 
  Clock, 
  Video, 
  DollarSign, 
  CheckCircle,
  User,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { cn } from '@/lib/utils';

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
];

const consultationTypes = [
  {
    id: 'basic',
    name: 'Quick Consultation',
    duration: '15 min',
    price: 5,
    description: 'Quick questions & basic guidance',
    icon: MessageSquare,
  },
  {
    id: 'standard',
    name: 'Standard Session',
    duration: '30 min',
    price: 15,
    description: 'In-depth analysis & personalized plan',
    icon: User,
  },
  {
    id: 'premium',
    name: 'Premium Session',
    duration: '60 min',
    price: 35,
    description: 'Comprehensive review with follow-up',
    icon: Video,
  },
];

export default function Schedule() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || !selectedType) {
      toast.error('Please select date, time, and consultation type');
      return;
    }

    setIsBooking(true);
    
    // Simulate booking - in production this would integrate with a scheduling API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Consultation booked! Check your email for confirmation.');
    setSelectedDate(undefined);
    setSelectedTime(null);
    setSelectedType(null);
    setIsBooking(false);
  };

  const selectedConsultation = consultationTypes.find(t => t.id === selectedType);

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
          <h1 className="text-2xl font-display font-bold mb-1">SCHEDULE CONSULTATION</h1>
          <p className="text-sm font-mono text-muted-foreground">
            Book a 1-on-1 session with an expert
          </p>
        </div>

        {/* Consultation Types */}
        <div className="space-y-3 mb-6">
          {consultationTypes.map((type) => (
            <div
              key={type.id}
              className="cursor-pointer"
              onClick={() => setSelectedType(type.id)}
            >
              <HUDCard
                className={cn(
                  "p-4 transition-all",
                  selectedType === type.id 
                    ? "border-primary bg-primary/5" 
                    : "hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    selectedType === type.id ? "bg-primary/20" : "bg-muted"
                  )}>
                    <type.icon className={cn(
                      "w-6 h-6",
                      selectedType === type.id ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{type.name}</h3>
                      <div className="flex items-center gap-1 text-primary font-mono">
                        <DollarSign className="w-4 h-4" />
                        <span>{type.price}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{type.duration}</span>
                    </div>
                  </div>
                  {selectedType === type.id && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
              </HUDCard>
            </div>
          ))}
        </div>

        <GlowingDivider className="mb-6" />

        {/* Date Selection */}
        <HUDCard className="p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Select Date</h2>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
            className="rounded-md border border-border/50 mx-auto"
          />
        </HUDCard>

        {/* Time Selection */}
        {selectedDate && (
          <HUDCard className="p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">
                Available Times - {format(selectedDate, 'MMM d, yyyy')}
              </h2>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "cyber-fill" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="font-mono"
                >
                  {time}
                </Button>
              ))}
            </div>
          </HUDCard>
        )}

        {/* Booking Summary */}
        {selectedType && selectedDate && selectedTime && (
          <HUDCard className="p-4 mb-6 border-primary/50">
            <h3 className="font-semibold text-foreground mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="text-foreground">{selectedConsultation?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground">{format(selectedDate, 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="text-foreground">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="text-foreground">{selectedConsultation?.duration}</span>
              </div>
              <GlowingDivider className="my-3" />
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-foreground">Total:</span>
                <span className="text-primary">${selectedConsultation?.price}</span>
              </div>
            </div>
          </HUDCard>
        )}

        {/* Book Button */}
        <Button
          variant="cyber-fill"
          size="lg"
          className="w-full"
          disabled={!selectedType || !selectedDate || !selectedTime || isBooking}
          onClick={handleBook}
        >
          {isBooking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Booking...
            </>
          ) : (
            <>
              <Video className="w-4 h-4 mr-2" />
              Book Consultation
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          You'll receive a confirmation email with meeting details
        </p>
      </main>
    </div>
  );
}
