import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard } from '@/components/auth/HUDFrame';
import { TaskCard } from '@/components/tasks/TaskCard';
import { CalendarView } from '@/components/tasks/CalendarView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Loader2, Zap, Calendar, CheckSquare, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { calculateLevel, getXpForCurrentLevel, getXpProgress, XP_PER_LEVEL } from '@/lib/xp-utils';

interface DailyTask {
  id: string;
  task_name: string;
  xp_reward: number;
  is_completed: boolean;
  date_assigned: string;
}

export default function Tasks() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [currentXp, setCurrentXp] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [levelUp, setLevelUp] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoadingTasks(true);
      
      // Fetch profile for XP
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_xp')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setCurrentXp(profile.current_xp);
      }

      // Fetch tasks for selected date
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const { data: tasksData } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('date_assigned', dateStr)
        .order('created_at', { ascending: true });

      if (tasksData) {
        setTasks(tasksData);
      }
      
      setLoadingTasks(false);
    };

    fetchData();
  }, [user, selectedDate]);

  const handleTaskComplete = (xpGained: number) => {
    const prevLevel = calculateLevel(currentXp);
    const newXp = currentXp + xpGained;
    const newLevel = calculateLevel(newXp);
    
    setCurrentXp(newXp);
    
    if (newLevel > prevLevel) {
      setLevelUp(true);
      setTimeout(() => setLevelUp(false), 3000);
    }
  };

  const generateSampleTasks = async () => {
    if (!user) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const sampleTasks = [
      { task_name: 'Apply moisturizer', xp_reward: 10 },
      { task_name: 'Practice mewing for 10 minutes', xp_reward: 15 },
      { task_name: 'Drink 8 glasses of water', xp_reward: 10 },
      { task_name: 'Do facial exercises', xp_reward: 15 },
      { task_name: 'Apply sunscreen', xp_reward: 10 },
    ];

    const { data, error } = await supabase
      .from('daily_tasks')
      .insert(
        sampleTasks.map(t => ({
          ...t,
          user_id: user.id,
          date_assigned: dateStr,
        }))
      )
      .select();

    if (data && !error) {
      setTasks(data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const level = calculateLevel(currentXp);
  const xpInLevel = getXpForCurrentLevel(currentXp);
  const xpProgress = getXpProgress(currentXp);
  const completedToday = tasks.filter(t => t.is_completed).length;
  const totalToday = tasks.length;

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      <CyberBackground />

      {/* Level Up Animation */}
      {levelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-level bg-level/20 flex items-center justify-center animate-pulse-glow">
              <TrendingUp className="w-12 h-12 text-level" />
            </div>
            <h2 className="text-4xl font-display font-bold text-level glow-text mb-2">
              LEVEL UP!
            </h2>
            <p className="text-xl font-mono text-foreground">
              You are now Level {level}
            </p>
          </div>
        </div>
      )}

      <main className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold mb-1">DAILY QUESTS</h1>
          <p className="text-sm font-mono text-muted-foreground">
            Complete tasks to gain XP and level up
          </p>
        </div>

        {/* XP Progress Card */}
        <HUDCard className="p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-level bg-level/20 flex items-center justify-center">
                <span className="font-display font-bold text-lg text-level">{level}</span>
              </div>
              <div>
                <p className="font-display font-semibold">Level {level} Hunter</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {xpInLevel} / {XP_PER_LEVEL} XP
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-xp/20 border border-xp/30">
              <Zap className="w-4 h-4 text-xp" />
              <span className="font-mono text-sm text-xp">{currentXp} XP</span>
            </div>
          </div>
          <Progress value={xpProgress} className="h-2 bg-muted" />
        </HUDCard>

        {/* Tabs */}
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="w-full bg-card/50 border border-border/50">
            <TabsTrigger value="tasks" className="flex-1 data-[state=active]:bg-primary/20">
              <CheckSquare className="w-4 h-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex-1 data-[state=active]:bg-primary/20">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            {/* Today's Stats */}
            <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg border border-border/30">
              <span className="text-sm font-mono text-muted-foreground">
                {format(selectedDate, 'EEEE, MMM d')}
              </span>
              <span className="text-sm font-mono text-primary">
                {completedToday}/{totalToday} Complete
              </span>
            </div>

            {/* Task List */}
            {loadingTasks ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : tasks.length === 0 ? (
              <HUDCard className="p-8 text-center">
                <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-semibold mb-2">No Tasks Assigned</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate sample tasks to start your journey
                </p>
                <Button variant="cyber-fill" onClick={generateSampleTasks}>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Tasks
                </Button>
              </HUDCard>
            ) : (
              <div className="space-y-3">
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    id={task.id}
                    taskName={task.task_name}
                    xpReward={task.xp_reward}
                    isCompleted={task.is_completed}
                    onComplete={handleTaskComplete}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <CalendarView
              userId={user.id}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
