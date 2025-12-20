import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2, Plus, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  userId: string;
  onTaskAdded: () => void;
}

export function AddTaskDialog({ 
  open, 
  onOpenChange, 
  selectedDate, 
  userId, 
  onTaskAdded 
}: AddTaskDialogProps) {
  const { toast } = useToast();
  const [taskName, setTaskName] = useState('');
  const [xpReward, setXpReward] = useState(15);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = async () => {
    if (!taskName.trim()) {
      toast({
        title: 'Task name required',
        description: 'Please enter a name for your task.',
        variant: 'destructive',
      });
      return;
    }

    setIsAdding(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    const { error } = await supabase.from('daily_tasks').insert({
      user_id: userId,
      task_name: taskName.trim(),
      xp_reward: xpReward,
      date_assigned: dateStr,
    });

    setIsAdding(false);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add task. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Task Added!',
      description: `"${taskName}" scheduled for ${format(selectedDate, 'MMM d')}.`,
    });

    // Reset form and close
    setTaskName('');
    setXpReward(15);
    onOpenChange(false);
    onTaskAdded();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Add Custom Quest</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Schedule a task for {format(selectedDate, 'EEEE, MMMM d')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="task-name" className="text-sm font-mono">
              Quest Name
            </Label>
            <Input
              id="task-name"
              placeholder="e.g., Practice mewing for 15 minutes"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="bg-background/50 border-border/50"
              maxLength={100}
            />
          </div>

          {/* XP Reward */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-mono">XP Reward</Label>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-xp/20 border border-xp/30">
                <Zap className="w-3 h-3 text-xp" />
                <span className="text-sm font-mono text-xp">{xpReward}</span>
              </div>
            </div>
            <Slider
              value={[xpReward]}
              onValueChange={(value) => setXpReward(value[0])}
              min={5}
              max={50}
              step={5}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>Easy (5)</span>
              <span>Hard (50)</span>
            </div>
          </div>

          {/* Add Button */}
          <Button
            onClick={handleAddTask}
            disabled={isAdding || !taskName.trim()}
            className="w-full h-12 font-display tracking-wider"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {isAdding ? 'ADDING...' : 'ADD QUEST'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
