import { useState } from 'react';
import { Check, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TaskCardProps {
  id: string;
  taskName: string;
  xpReward: number;
  isCompleted: boolean;
  onComplete: (xpGained: number) => void;
}

export function TaskCard({ id, taskName, xpReward, isCompleted, onComplete }: TaskCardProps) {
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);
  const [animateComplete, setAnimateComplete] = useState(false);
  const { toast } = useToast();

  const handleComplete = async () => {
    if (completed || completing) return;
    
    setCompleting(true);
    
    try {
      // Update task completion
      const { error: taskError } = await supabase
        .from('daily_tasks')
        .update({ is_completed: true })
        .eq('id', id);

      if (taskError) throw taskError;

      // Get current user XP
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_xp')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Update user XP
      const newXp = (profile?.current_xp || 0) + xpReward;
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ current_xp: newXp })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAnimateComplete(true);
      setTimeout(() => {
        setCompleted(true);
        setAnimateComplete(false);
      }, 300);
      
      onComplete(xpReward);
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete task. Try again.',
        variant: 'destructive',
      });
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div
      onClick={handleComplete}
      className={cn(
        'relative p-3 rounded-lg border transition-all duration-300 cursor-pointer group overflow-hidden',
        completed
          ? 'bg-primary/10 border-primary/30'
          : 'bg-card/50 border-border/50 hover:border-primary/50 hover:bg-card/80 active:scale-[0.98]',
        animateComplete && 'scale-[1.02]'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <div className={cn(
          'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 shrink-0',
          completed
            ? 'bg-primary border-primary'
            : 'border-muted-foreground/50 group-hover:border-primary'
        )}>
          {completing ? (
            <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
          ) : completed ? (
            <Check className="w-3 h-3 text-primary-foreground" />
          ) : null}
        </div>

        {/* Task Info */}
        <p className={cn(
          'flex-1 text-sm font-medium transition-all duration-300 leading-tight',
          completed && 'line-through text-muted-foreground'
        )}>
          {taskName}
        </p>

        {/* XP Badge */}
        <div className={cn(
          'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono shrink-0 transition-all',
          completed
            ? 'bg-primary/20 text-primary'
            : 'bg-xp/20 text-xp'
        )}>
          <Zap className="w-3 h-3" />
          <span>+{xpReward}</span>
        </div>
      </div>

      {/* Completion flash effect */}
      {animateComplete && (
        <div className="absolute inset-0 bg-primary/30 animate-ping rounded-lg" />
      )}
    </div>
  );
}
