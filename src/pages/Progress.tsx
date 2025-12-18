import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard, GlowingDivider } from '@/components/auth/HUDFrame';
import { BeforeAfterSlider } from '@/components/progress/BeforeAfterSlider';
import { ProgressPhotoCapture } from '@/components/progress/ProgressPhotoCapture';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Camera, 
  Calendar, 
  TrendingUp, 
  ImageIcon, 
  ArrowLeft,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

type ProgressFrequency = 'biweekly' | 'monthly';

interface ProgressPhoto {
  id: string;
  image_path: string;
  photo_date: string;
  created_at: string;
  signedUrl?: string;
}

interface FaceScan {
  id: string;
  image_path: string;
  created_at: string;
  images: { front?: string; smile?: string; side?: string } | null;
}

export default function Progress() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [initialPhoto, setInitialPhoto] = useState<{ url: string; date: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [frequency, setFrequency] = useState<ProgressFrequency>('monthly');
  const [selectedCompare, setSelectedCompare] = useState<{ before: string; after: string; beforeDate: string; afterDate: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch the first face scan as initial baseline
      const { data: scanData } = await supabase
        .from('face_scans')
        .select('id, image_path, created_at, images')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (scanData) {
        // Get signed URL for the front image
        const imagePath = (scanData.images as any)?.front || scanData.image_path;
        const { data: urlData } = await supabase.storage
          .from('face-scans')
          .createSignedUrl(imagePath, 3600);
        
        if (urlData?.signedUrl) {
          setInitialPhoto({
            url: urlData.signedUrl,
            date: scanData.created_at,
          });
        }
      }

      // Fetch progress photos
      const { data: progressData, error } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('photo_date', { ascending: false });

      if (error) throw error;

      // Get signed URLs for all photos
      const photosWithUrls = await Promise.all(
        (progressData || []).map(async (photo) => {
          const { data: urlData } = await supabase.storage
            .from('face-scans')
            .createSignedUrl(photo.image_path, 3600);
          return { ...photo, signedUrl: urlData?.signedUrl };
        })
      );

      setPhotos(photosWithUrls);

      // Set up comparison with initial photo as baseline
      if (initialPhoto && photosWithUrls.length > 0 && photosWithUrls[0].signedUrl) {
        setSelectedCompare({
          before: initialPhoto.url,
          after: photosWithUrls[0].signedUrl,
          beforeDate: initialPhoto.date,
          afterDate: photosWithUrls[0].photo_date,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update comparison when initial photo loads
  useEffect(() => {
    if (initialPhoto && photos.length > 0 && photos[0].signedUrl) {
      setSelectedCompare({
        before: initialPhoto.url,
        after: photos[0].signedUrl,
        beforeDate: initialPhoto.date,
        afterDate: photos[0].photo_date,
      });
    } else if (initialPhoto && photos.length === 0) {
      // If no progress photos yet, just show the initial
      setSelectedCompare(null);
    }
  }, [initialPhoto, photos]);

  const handlePhotoCapture = async (file: File) => {
    if (!user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/progress/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('face-scans')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('progress_photos')
        .insert({
          user_id: user.id,
          image_path: fileName,
          photo_date: new Date().toISOString().split('T')[0],
        });

      if (insertError) throw insertError;

      toast.success('Progress photo saved!');
      fetchData();
    } catch (error) {
      console.error('Error saving progress photo:', error);
      toast.error('Failed to save photo');
    }
  };

  const frequencyDays = frequency === 'biweekly' ? 14 : 30;
  const daysSinceLastPhoto = photos.length > 0 
    ? differenceInDays(new Date(), new Date(photos[0].photo_date))
    : initialPhoto 
      ? differenceInDays(new Date(), new Date(initialPhoto.date))
      : null;

  const shouldTakePhoto = daysSinceLastPhoto === null || daysSinceLastPhoto >= frequencyDays;
  const daysUntilNext = daysSinceLastPhoto !== null 
    ? Math.max(0, frequencyDays - daysSinceLastPhoto) 
    : 0;

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
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">PROGRESS TRACKER</h1>
            <p className="text-sm font-mono text-muted-foreground">
              Track your transformation over time
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Frequency Selector */}
            <HUDCard className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Photo Frequency</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={frequency === 'biweekly' ? 'cyber-fill' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setFrequency('biweekly')}
                >
                  Bi-weekly (14 days)
                </Button>
                <Button
                  variant={frequency === 'monthly' ? 'cyber-fill' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setFrequency('monthly')}
                >
                  Monthly (30 days)
                </Button>
              </div>
            </HUDCard>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              <HUDCard className="p-4 text-center">
                <ImageIcon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{photos.length + (initialPhoto ? 1 : 0)}</p>
                <p className="text-xs text-muted-foreground">Total Photos</p>
              </HUDCard>
              <HUDCard className="p-4 text-center">
                <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                  {shouldTakePhoto ? 'Now!' : `${daysUntilNext}d`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {shouldTakePhoto ? 'Photo Due' : 'Until Next'}
                </p>
              </HUDCard>
            </div>

            {/* Take New Photo Section */}
            {shouldTakePhoto && (
              <HUDCard className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">
                    {photos.length === 0 ? 'Take Your First Progress Photo' : `${frequency === 'biweekly' ? 'Bi-weekly' : 'Monthly'} Check-In Due`}
                  </h2>
                </div>
                <ProgressPhotoCapture
                  onCapture={handlePhotoCapture}
                  ghostImage={photos[0]?.signedUrl || initialPhoto?.url}
                />
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Take a photo in the same spot & lighting as before
                </p>
              </HUDCard>
            )}

            <GlowingDivider />

            {/* Before/After Comparison */}
            {selectedCompare && (
              <HUDCard className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Transformation</h2>
                </div>
                <BeforeAfterSlider
                  beforeImage={selectedCompare.before}
                  afterImage={selectedCompare.after}
                  beforeLabel={format(new Date(selectedCompare.beforeDate), 'MMM yyyy')}
                  afterLabel={format(new Date(selectedCompare.afterDate), 'MMM yyyy')}
                />
              </HUDCard>
            )}

            {/* Initial Photo (Baseline) */}
            {initialPhoto && (
              <HUDCard className="p-4">
                <h2 className="font-semibold text-foreground mb-3">Baseline (First Scan)</h2>
                <div className="aspect-[3/4] max-w-[200px] mx-auto rounded-lg overflow-hidden border border-primary/30">
                  <img
                    src={initialPhoto.url}
                    alt="Initial scan"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2 font-mono">
                  {format(new Date(initialPhoto.date), 'MMMM d, yyyy')}
                </p>
              </HUDCard>
            )}

            {/* Photo Timeline */}
            {photos.length > 0 && (
              <HUDCard className="p-4">
                <h2 className="font-semibold text-foreground mb-4">Progress Timeline</h2>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo) => (
                    <div 
                      key={photo.id}
                      className={cn(
                        "aspect-[3/4] rounded-lg overflow-hidden border relative group cursor-pointer transition-all",
                        selectedCompare?.after === photo.signedUrl 
                          ? "border-primary" 
                          : "border-primary/20 hover:border-primary/50"
                      )}
                      onClick={() => {
                        if (initialPhoto && photo.signedUrl) {
                          setSelectedCompare({
                            before: initialPhoto.url,
                            after: photo.signedUrl,
                            beforeDate: initialPhoto.date,
                            afterDate: photo.photo_date,
                          });
                        }
                      }}
                    >
                      {photo.signedUrl && (
                        <img
                          src={photo.signedUrl}
                          alt={`Progress ${photo.photo_date}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-2">
                        <p className="text-xs font-mono text-foreground">
                          {format(new Date(photo.photo_date), 'MMM d')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </HUDCard>
            )}

            {/* Empty state */}
            {!initialPhoto && photos.length === 0 && (
              <HUDCard className="p-8 text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Complete a face scan first to establish your baseline
                </p>
                <Button variant="cyber" onClick={() => navigate('/face-scan')}>
                  Start Face Scan
                </Button>
              </HUDCard>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
