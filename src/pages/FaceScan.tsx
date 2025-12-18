import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { HUDCard, GlowingDivider } from '@/components/auth/HUDFrame';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { Upload, Camera, Scan, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';

export default function FaceScan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    try {
      setUploadState('uploading');
      setProgress(10);

      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      setProgress(30);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('face-scans')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      setProgress(50);

      // Get signed URL (bucket is private)
      const { data: urlData, error: urlError } = await supabase.storage
        .from('face-scans')
        .createSignedUrl(fileName, 3600); // 1 hour expiry

      if (urlError || !urlData?.signedUrl) {
        throw new Error('Failed to get image URL');
      }

      // Create face_scans record
      const { data: scanData, error: scanError } = await supabase
        .from('face_scans')
        .insert({
          user_id: user.id,
          image_path: fileName,
          is_latest: true,
        })
        .select()
        .single();

      if (scanError) {
        console.error('Scan record error:', scanError);
        throw new Error('Failed to save scan record');
      }

      setProgress(70);
      setUploadState('analyzing');

      // Fetch survey data for context
      const { data: surveyData } = await supabase
        .from('onboarding_surveys')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Trigger AI analysis
      const { data: analysisResult, error: analysisError } = await supabase.functions.invoke('analyze-face', {
        body: {
          imageUrl: urlData.signedUrl,
          faceScanId: scanData.id,
          userId: user.id,
          surveyData,
        },
      });

      setProgress(100);

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        throw new Error('AI analysis failed');
      }

      setUploadState('complete');
      toast.success('Analysis complete! Viewing your report...');

      // Navigate to report after short delay
      setTimeout(() => {
        navigate('/report');
      }, 1500);

    } catch (error) {
      console.error('Error:', error);
      setUploadState('error');
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const resetUpload = () => {
    setUploadState('idle');
    setPreviewUrl(null);
    setSelectedFile(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          {uploadState === 'idle' && !previewUrl && (
            <div 
              className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center cursor-pointer hover:border-primary/60 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground font-medium mb-2">Click to upload your selfie</p>
              <p className="text-muted-foreground text-sm">PNG, JPG up to 10MB</p>
            </div>
          )}

          {previewUrl && uploadState === 'idle' && (
            <div className="space-y-6">
              <div className="relative aspect-square max-w-sm mx-auto rounded-lg overflow-hidden border border-primary/30">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-primary/20 rounded-lg pointer-events-none" />
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={resetUpload}>
                  Choose Different
                </Button>
                <Button variant="cyber-fill" onClick={handleUpload}>
                  <Upload className="w-4 h-4 mr-2" />
                  Begin Analysis
                </Button>
              </div>
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
