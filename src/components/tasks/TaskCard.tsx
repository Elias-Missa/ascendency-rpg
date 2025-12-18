import { useState } from 'react';
import { Check, Zap } from 'lucide-react';
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

      setCompleted(true);
      onComplete(xpReward);
      
      toast({
        title: `+${xpReward} XP`,
        description: 'Quest completed! Keep pushing, Hunter.',
      });
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
        'relative p-4 rounded-lg border transition-all duration-300 cursor-pointer group',
        completed
          ? 'bg-primary/10 border-primary/30'
          : 'bg-card/50 border-border/50 hover:border-primary/50 hover:bg-card/80'
      )}
    >
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <div className={cn(
          'w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300',
          completed
            ? 'bg-primary border-primary'
            : 'border-muted-foreground group-hover:border-primary'
        )}>
          {completed && <Check className="w-4 h-4 text-primary-foreground" />}
          {completing && (
            <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Task Info */}
        <div className="flex-1">
          <p className={cn(
            'font-medium transition-all duration-300',
            completed && 'line-through text-muted-foreground'
          )}>
            {taskName}
          </p>
        </div>

        {/* XP Badge */}
        <div className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono',
          completed
            ? 'bg-primary/20 text-primary'
            : 'bg-level/20 text-level'
        )}>
          <Zap className="w-3 h-3" />
          <span>+{xpReward} XP</span>
        </div>
      </div>

      {/* Glow effect on completion */}
      {completed && (
        <div className="absolute inset-0 rounded-lg bg-primary/5 animate-pulse-glow pointer-events-none" />
      )}
    </div>
  );
}
