import { useState, useRef } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProgressPhotoCaptureProps {
  onCapture: (file: File) => Promise<void>;
  ghostImage?: string;
  disabled?: boolean;
}

export function ProgressPhotoCapture({ 
  onCapture, 
  ghostImage,
  disabled = false 
}: ProgressPhotoCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) return;

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);
    
    try {
      await onCapture(file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
      
      <div
        className={cn(
          "aspect-[3/4] rounded-lg border-2 border-dashed relative overflow-hidden cursor-pointer transition-all",
          disabled || isUploading
            ? "border-muted bg-muted/20 cursor-not-allowed"
            : "border-primary/30 hover:border-primary/60"
        )}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
      >
        {/* Ghost overlay from previous photo */}
        {ghostImage && !preview && (
          <div className="absolute inset-0">
            <img
              src={ghostImage}
              alt="Previous photo guide"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                Align with previous photo
              </p>
            </div>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}

        {/* Upload state */}
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!preview && !ghostImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Take Progress Photo</p>
            <p className="text-xs text-muted-foreground text-center">
              Monthly selfie to track your transformation
            </p>
          </div>
        )}
      </div>

      {preview && !isUploading && (
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-2 right-2"
          onClick={(e) => {
            e.stopPropagation();
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        >
          Retake
        </Button>
      )}
    </div>
  );
}
