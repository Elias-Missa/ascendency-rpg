import { Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  currentStreak: number;
  bestStreak: number;
  className?: string;
}

export function StreakBadge({ currentStreak, bestStreak, className }: StreakBadgeProps) {
  const isOnFire = currentStreak >= 3;
  const isNewRecord = currentStreak > 0 && currentStreak >= bestStreak;

  return (
    <div className={cn('flex gap-3', className)}>
      {/* Current Streak */}
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all',
        isOnFire 
          ? 'bg-destructive/20 border-destructive/50' 
          : 'bg-card/50 border-border/50'
      )}>
        <Flame className={cn(
          'w-5 h-5 transition-all',
          isOnFire ? 'text-destructive animate-pulse' : 'text-muted-foreground'
        )} />
        <div className="text-center">
          <p className={cn(
            'text-lg font-display font-bold leading-none',
            isOnFire ? 'text-destructive' : 'text-foreground'
          )}>
            {currentStreak}
          </p>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Streak
          </p>
        </div>
      </div>

      {/* Best Streak */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card/50 border-border/50">
        <Trophy className={cn(
          'w-5 h-5',
          isNewRecord ? 'text-level' : 'text-muted-foreground'
        )} />
        <div className="text-center">
          <p className="text-lg font-display font-bold leading-none">
            {bestStreak}
          </p>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Best
          </p>
        </div>
      </div>
    </div>
  );
}