import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { AddTaskDialog } from './AddTaskDialog';

interface CalendarViewProps {
  userId: string;
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  onTaskAdded?: () => void;
}

export function CalendarView({ userId, onDateSelect, selectedDate, onTaskAdded }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    const fetchCompletedDays = async () => {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      
      const { data } = await supabase
        .from('daily_tasks')
        .select('date_assigned')
        .eq('user_id', userId)
        .eq('is_completed', true)
        .gte('date_assigned', format(start, 'yyyy-MM-dd'))
        .lte('date_assigned', format(end, 'yyyy-MM-dd'));

      if (data) {
        const days = new Set(data.map(d => d.date_assigned));
        setCompletedDays(days);
      }
    };

    fetchCompletedDays();
  }, [userId, currentMonth]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startDayOffset = startOfMonth(currentMonth).getDay();

  const handleDateClick = (day: Date) => {
    onDateSelect(day);
    setShowAddTask(true);
  };

  const handleTaskAdded = () => {
    onTaskAdded?.();
  };

  return (
    <>
      <div className="bg-card/50 border border-border/50 rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h3 className="font-display font-semibold text-lg">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="text-muted-foreground hover:text-primary"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-mono text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {/* Days */}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isCompleted = completedDays.has(dateStr);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={cn(
                  'aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all duration-200 relative',
                  isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/50',
                  isSelected && 'ring-2 ring-primary bg-primary/20',
                  isToday && !isSelected && 'border border-primary/50',
                  !isSelected && 'hover:bg-primary/10'
                )}
              >
                <span className={cn(
                  'font-mono',
                  isCompleted && 'font-bold'
                )}>
                  {format(day, 'd')}
                </span>
                {isCompleted && (
                  <Flame className="w-3 h-3 text-level absolute -top-0.5 -right-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend & Add Task Button */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Flame className="w-3 h-3 text-level" />
            <span>Tasks Completed</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddTask(true)}
            className="text-primary hover:text-primary/80"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>
      </div>

      <AddTaskDialog
        open={showAddTask}
        onOpenChange={setShowAddTask}
        selectedDate={selectedDate}
        userId={userId}
        onTaskAdded={handleTaskAdded}
      />
    </>
  );
}
