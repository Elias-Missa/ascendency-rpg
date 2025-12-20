import { Lock, Play } from 'lucide-react';

interface PremiumVideoPlaceholderProps {
  title?: string;
}

export function PremiumVideoPlaceholder({ title = "Video Tutorial" }: PremiumVideoPlaceholderProps) {
  return (
    <div className="mt-4 relative rounded-lg overflow-hidden">
      {/* Blurred video placeholder */}
      <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm border border-border/50 rounded-lg relative">
        {/* Fake video thumbnail with blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/50 to-accent/10 blur-sm" />
        
        {/* Play button icon (blurred) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 blur-[2px]">
          <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center">
            <Play className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        {/* Premium overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-md">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[hsl(270,70%,50%)] to-[hsl(200,80%,50%)] shadow-lg shadow-primary/30">
            <Lock className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              Premium Only
            </span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground text-center px-4">
            Unlock video tutorials with Premium
          </p>
        </div>
      </div>
      
      {/* Video title */}
      <p className="mt-2 text-xs text-muted-foreground/70 text-center">
        {title}
      </p>
    </div>
  );
}
