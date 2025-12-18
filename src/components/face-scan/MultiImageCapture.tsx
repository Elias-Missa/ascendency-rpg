import { useState, useRef } from 'react';
import { Camera, Check, User, Smile, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ImageType = 'front' | 'smile' | 'side';

export interface CapturedImages {
  front: File | null;
  smile: File | null;
  side: File | null;
}

interface MultiImageCaptureProps {
  images: CapturedImages;
  onImageCapture: (type: ImageType, file: File) => void;
  onImageRemove: (type: ImageType) => void;
  disabled?: boolean;
}

const imageSlots: { type: ImageType; label: string; description: string; icon: React.ReactNode }[] = [
  { 
    type: 'front', 
    label: 'Front Face', 
    description: 'Neutral expression, look straight',
    icon: <User className="w-8 h-8" />
  },
  { 
    type: 'smile', 
    label: 'Smile', 
    description: 'Natural smile, showing teeth',
    icon: <Smile className="w-8 h-8" />
  },
  { 
    type: 'side', 
    label: 'Side Profile', 
    description: '90° angle, show jawline',
    icon: <UserCircle className="w-8 h-8" />
  },
];

export function MultiImageCapture({ 
  images, 
  onImageCapture, 
  onImageRemove,
  disabled = false 
}: MultiImageCaptureProps) {
  const [previews, setPreviews] = useState<Record<ImageType, string | null>>({
    front: null,
    smile: null,
    side: null,
  });
  
  const fileInputRefs = {
    front: useRef<HTMLInputElement>(null),
    smile: useRef<HTMLInputElement>(null),
    side: useRef<HTMLInputElement>(null),
  };

  const handleFileSelect = (type: ImageType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviews(prev => ({ ...prev, [type]: previewUrl }));
    onImageCapture(type, file);
  };

  const handleRemove = (type: ImageType) => {
    if (previews[type]) {
      URL.revokeObjectURL(previews[type]!);
    }
    setPreviews(prev => ({ ...prev, [type]: null }));
    onImageRemove(type);
    if (fileInputRefs[type].current) {
      fileInputRefs[type].current.value = '';
    }
  };

  const completedCount = Object.values(images).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="text-sm font-mono text-muted-foreground">
          SCAN PROGRESS:
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={cn(
                "w-8 h-2 rounded-full transition-colors",
                completedCount >= num ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <span className="text-sm font-mono text-primary">{completedCount}/3</span>
      </div>

      {/* Image slots */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {imageSlots.map(({ type, label, description, icon }) => (
          <div key={type} className="relative">
            <input
              ref={fileInputRefs[type]}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(type, e)}
              className="hidden"
              disabled={disabled}
            />
            
            {previews[type] ? (
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-primary group">
                <img
                  src={previews[type]!}
                  alt={label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                
                {/* Success indicator */}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                </div>
                
                {/* Hover overlay */}
                {!disabled && (
                  <div 
                    className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={() => handleRemove(type)}
                  >
                    <p className="text-sm text-destructive font-medium">Click to remove</p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={cn(
                  "aspect-[3/4] rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-4 cursor-pointer transition-all",
                  disabled 
                    ? "border-muted bg-muted/20 cursor-not-allowed" 
                    : "border-primary/30 hover:border-primary/60 hover:bg-primary/5"
                )}
                onClick={() => !disabled && fileInputRefs[type].current?.click()}
              >
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-3",
                  disabled ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                )}>
                  {icon}
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
                <p className="text-xs text-muted-foreground text-center">{description}</p>
                
                {!disabled && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-primary">
                    <Camera className="w-3 h-3" />
                    <span>Tap to capture</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
