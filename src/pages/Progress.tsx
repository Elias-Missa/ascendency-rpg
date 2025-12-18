import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard, GlowingDivider } from '@/components/auth/HUDFrame';
import { BeforeAfterSlider } from '@/components/progress/BeforeAfterSlider';
import { ProgressPhotoCapture } from '@/components/progress/ProgressPhotoCapture';
import { Loader2, Camera, Calendar, TrendingUp, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';

interface ProgressPhoto {
  id: string;
  image_path: string;
  photo_date: string;
  created_at: string;
  signedUrl?: string;
}

export default function Progress() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompare, setSelectedCompare] = useState<{ before: ProgressPhoto; after: ProgressPhoto } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProgressPhotos();
    }
  }, [user]);

  const fetchProgressPhotos = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('photo_date', { ascending: false });

      if (error) throw error;

      // Get signed URLs for all photos
      const photosWithUrls = await Promise.all(
        (data || []).map(async (photo) => {
          const { data: urlData } = await supabase.storage
            .from('face-scans')
            .createSignedUrl(photo.image_path, 3600);
          return { ...photo, signedUrl: urlData?.signedUrl };
        })
      );

      setPhotos(photosWithUrls);

      // Auto-select first and last for comparison if we have at least 2
      if (photosWithUrls.length >= 2) {
        setSelectedCompare({
          before: photosWithUrls[photosWithUrls.length - 1],
          after: photosWithUrls[0],
        });
      }
    } catch (error) {
      console.error('Error fetching progress photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      fetchProgressPhotos();
    } catch (error) {
      console.error('Error saving progress photo:', error);
      toast.error('Failed to save photo');
    }
  };

  const daysSinceLastPhoto = photos.length > 0 
    ? differenceInDays(new Date(), new Date(photos[0].photo_date))
    : null;

  const shouldTakePhoto = daysSinceLastPhoto === null || daysSinceLastPhoto >= 30;

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
          <h1 className="text-2xl font-display font-bold mb-1">PROGRESS TRACKER</h1>
          <p className="text-sm font-mono text-muted-foreground">
            Track your transformation over time
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              <HUDCard className="p-4 text-center">
                <ImageIcon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{photos.length}</p>
                <p className="text-xs text-muted-foreground">Photos Taken</p>
              </HUDCard>
              <HUDCard className="p-4 text-center">
                <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                  {daysSinceLastPhoto ?? '-'}
                </p>
                <p className="text-xs text-muted-foreground">Days Since Last</p>
              </HUDCard>
            </div>

            {/* Take New Photo Section */}
            {shouldTakePhoto && (
              <HUDCard className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">
                    {photos.length === 0 ? 'Take Your First Photo' : 'Monthly Check-In Due'}
                  </h2>
                </div>
                <ProgressPhotoCapture
                  onCapture={handlePhotoCapture}
                  ghostImage={photos[0]?.signedUrl}
                />
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Take a photo in the same spot & lighting as before
                </p>
              </HUDCard>
            )}

            <GlowingDivider />

            {/* Before/After Comparison */}
            {selectedCompare && selectedCompare.before.signedUrl && selectedCompare.after.signedUrl && (
              <HUDCard className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Transformation</h2>
                </div>
                <BeforeAfterSlider
                  beforeImage={selectedCompare.before.signedUrl}
                  afterImage={selectedCompare.after.signedUrl}
                  beforeLabel={format(new Date(selectedCompare.before.photo_date), 'MMM yyyy')}
                  afterLabel={format(new Date(selectedCompare.after.photo_date), 'MMM yyyy')}
                />
              </HUDCard>
            )}

            {/* Photo Timeline */}
            {photos.length > 0 && (
              <HUDCard className="p-4">
                <h2 className="font-semibold text-foreground mb-4">Photo Timeline</h2>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo) => (
                    <div 
                      key={photo.id}
                      className="aspect-[3/4] rounded-lg overflow-hidden border border-primary/20 relative group cursor-pointer"
                      onClick={() => {
                        if (photos.length >= 2 && photo !== photos[photos.length - 1]) {
                          setSelectedCompare({
                            before: photos[photos.length - 1],
                            after: photo,
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
            {photos.length === 0 && !shouldTakePhoto && (
              <HUDCard className="p-8 text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No progress photos yet. Start tracking your transformation!
                </p>
              </HUDCard>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
