import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { HUDCard, GlowingDivider } from '@/components/auth/HUDFrame';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { MultiImageCapture, CapturedImages, ImageType } from '@/components/face-scan/MultiImageCapture';
import { Scan, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';

export default function FaceScan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [capturedImages, setCapturedImages] = useState<CapturedImages>({
    front: null,
    smile: null,
    side: null,
  });

  const handleImageCapture = (type: ImageType, file: File) => {
    setCapturedImages(prev => ({ ...prev, [type]: file }));
  };

  const handleImageRemove = (type: ImageType) => {
    setCapturedImages(prev => ({ ...prev, [type]: null }));
  };

  const allImagesUploaded = capturedImages.front && capturedImages.smile && capturedImages.side;

  const uploadImage = async (file: File, type: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}/${Date.now()}_${type}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('face-scans')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw new Error(`Failed to upload ${type} image`);

    const { data: urlData, error: urlError } = await supabase.storage
      .from('face-scans')
      .createSignedUrl(fileName, 3600);

    if (urlError || !urlData?.signedUrl) throw new Error(`Failed to get ${type} URL`);

    return urlData.signedUrl;
  };

  const handleUpload = async () => {
    if (!allImagesUploaded || !user) return;

    try {
      setUploadState('uploading');
      setProgress(10);

      // Upload all three images
      const [frontUrl, smileUrl, sideUrl] = await Promise.all([
        uploadImage(capturedImages.front!, 'front'),
        uploadImage(capturedImages.smile!, 'smile'),
        uploadImage(capturedImages.side!, 'side'),
      ]);

      setProgress(50);

      // Create face_scans record with multi-image data
      const imagesData = {
        front: `${user.id}/${Date.now()}_front`,
        smile: `${user.id}/${Date.now()}_smile`,
        side: `${user.id}/${Date.now()}_side`,
      };

      const { data: scanData, error: scanError } = await supabase
        .from('face_scans')
        .insert({
          user_id: user.id,
          image_path: imagesData.front,
          images: imagesData,
          is_latest: true,
        })
        .select()
        .single();

      if (scanError) throw new Error('Failed to save scan record');

      // Update scan count
      const { data: profileData } = await supabase
        .from('profiles')
        .select('scan_count')
        .eq('id', user.id)
        .maybeSingle();
      
      await supabase
        .from('profiles')
        .update({ scan_count: (profileData?.scan_count || 0) + 1 })
        .eq('id', user.id);

      setProgress(70);
      setUploadState('analyzing');

      // Fetch survey data
      const { data: surveyData } = await supabase
        .from('onboarding_surveys')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Trigger AI analysis with all images
      const { error: analysisError } = await supabase.functions.invoke('analyze-face', {
        body: {
          imageUrls: { front: frontUrl, smile: smileUrl, side: sideUrl },
          faceScanId: scanData.id,
          userId: user.id,
          surveyData,
        },
      });

      setProgress(100);

      if (analysisError) throw new Error('AI analysis failed');

      setUploadState('complete');
      toast.success('Analysis complete! Viewing your report...');

      setTimeout(() => navigate('/report'), 1500);

    } catch (error) {
      console.error('Error:', error);
      setUploadState('error');
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const resetUpload = () => {
    setUploadState('idle');
    setCapturedImages({ front: null, smile: null, side: null });
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CyberBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-4">
            <Scan className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-mono">BIOMETRIC SCANNER</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Face Scan</h1>
          <p className="text-muted-foreground">Upload a clear, front-facing photo for AI analysis</p>
        </div>

        {/* Upload Card */}
        <HUDCard className="mb-6">
          {uploadState === 'idle' && (
            <div className="space-y-6">
              <MultiImageCapture
                images={capturedImages}
                onImageCapture={handleImageCapture}
                onImageRemove={handleImageRemove}
              />
              
              {allImagesUploaded && (
                <div className="flex gap-4 justify-center pt-4">
                  <Button variant="outline" onClick={resetUpload}>
                    Reset All
                  </Button>
                  <Button variant="cyber-fill" onClick={handleUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    Begin Analysis
                  </Button>
                </div>
              )}
            </div>
          )}

          {(uploadState === 'uploading' || uploadState === 'analyzing') && (
            <div className="py-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div 
                  className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                  style={{ animationDuration: '1.5s' }}
                />
                <Scan className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              
              <p className="text-primary font-mono text-lg mb-2 animate-pulse">
                {uploadState === 'uploading' ? 'UPLOADING BIOMETRICS...' : 'ANALYZING FACIAL GEOMETRY...'}
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                {uploadState === 'uploading' ? 'Securing your data' : 'AI is processing your features'}
              </p>
              
              {/* Progress bar */}
              <div className="max-w-xs mx-auto h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono">{progress}%</p>
            </div>
          )}

          {uploadState === 'complete' && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-green-500 font-mono text-lg mb-2">ANALYSIS COMPLETE</p>
              <p className="text-muted-foreground">Redirecting to your report...</p>
            </div>
          )}

          {uploadState === 'error' && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
              <p className="text-destructive font-mono text-lg mb-2">ANALYSIS FAILED</p>
              <p className="text-muted-foreground mb-4">Please try again with a different image</p>
              <Button variant="cyber" onClick={resetUpload}>
                Try Again
              </Button>
            </div>
          )}
        </HUDCard>

        <GlowingDivider className="mb-6" />

        {/* Guidelines */}
        <HUDCard>
          <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Scan Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">›</span>
              Use natural lighting, avoid harsh shadows
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">›</span>
              Face the camera directly, neutral expression
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">›</span>
              Remove glasses and pull back hair from face
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">›</span>
              Ensure your entire face is visible in frame
            </li>
          </ul>
        </HUDCard>

        {/* Back button */}
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
