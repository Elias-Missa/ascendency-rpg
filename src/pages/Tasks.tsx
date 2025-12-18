import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { HUDCard } from '@/components/auth/HUDFrame';
import { TaskCard } from '@/components/tasks/TaskCard';
import { CalendarView } from '@/components/tasks/CalendarView';
import { StreakBadge } from '@/components/tasks/StreakBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Loader2, Zap, Calendar, CheckSquare, TrendingUp, Sparkles } from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { calculateLevel, getXpForCurrentLevel, getXpProgress, XP_PER_LEVEL } from '@/lib/xp-utils';
import { useToast } from '@/hooks/use-toast';

interface DailyTask {
  id: string;
  task_name: string;
  xp_reward: number;
  is_completed: boolean;
  date_assigned: string;
}

interface ProfileData {
  current_xp: number;
  current_streak: number;
  best_streak: number;
  last_task_date: string | null;
}

export default function Tasks() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [profile, setProfile] = useState<ProfileData>({ current_xp: 0, current_streak: 0, best_streak: 0, last_task_date: null });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [levelUp, setLevelUp] = useState(false);
  const [showXpGain, setShowXpGain] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoadingTasks(true);
      
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('current_xp, current_streak, best_streak, last_task_date')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData as ProfileData);
      }

      // Fetch tasks for selected date
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const { data: tasksData } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('date_assigned', dateStr)
        .order('is_completed', { ascending: true })
        .order('created_at', { ascending: true });

      if (tasksData) {
        setTasks(tasksData);
      }
      
      setLoadingTasks(false);
    };

    fetchData();
  }, [user, selectedDate]);

  const updateStreak = async (userId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastDate = profile.last_task_date;
    
    let newStreak = profile.current_streak;
    
    if (!lastDate || lastDate !== today) {
      if (lastDate && isYesterday(parseISO(lastDate))) {
        // Continue streak
        newStreak = profile.current_streak + 1;
      } else if (!lastDate || !isToday(parseISO(lastDate))) {
        // Reset or start new streak
        newStreak = 1;
      }
      
      const newBest = Math.max(newStreak, profile.best_streak);
      
      await supabase
        .from('profiles')
        .update({ 
          current_streak: newStreak, 
          best_streak: newBest,
          last_task_date: today 
        })
        .eq('id', userId);
      
      setProfile(prev => ({ 
        ...prev, 
        current_streak: newStreak, 
        best_streak: newBest,
        last_task_date: today 
      }));
      
      if (newStreak > 1) {
        toast({
          title: `🔥 ${newStreak} Day Streak!`,
          description: newStreak >= profile.best_streak ? 'New personal best!' : 'Keep it going, Hunter!',
        });
      }
    }
  };

  const handleTaskComplete = async (xpGained: number) => {
    const prevLevel = calculateLevel(profile.current_xp);
    const newXp = profile.current_xp + xpGained;
    const newLevel = calculateLevel(newXp);
    
    setProfile(prev => ({ ...prev, current_xp: newXp }));
    setShowXpGain(xpGained);
    setTimeout(() => setShowXpGain(null), 1500);
    
    if (newLevel > prevLevel) {
      setLevelUp(true);
      setTimeout(() => setLevelUp(false), 3000);
    }

    // Update streak if this is today
    if (isToday(selectedDate) && user) {
      await updateStreak(user.id);
    }
  };

  const generateDailyTasks = async () => {
    if (!user) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    // Generate tasks based on common looksmaxing routines
    const taskTemplates = [
      { task_name: 'Apply moisturizer (AM routine)', xp_reward: 10 },
      { task_name: 'Practice mewing for 10 minutes', xp_reward: 15 },
      { task_name: 'Drink 8 glasses of water', xp_reward: 15 },
      { task_name: 'Apply sunscreen SPF 30+', xp_reward: 10 },
      { task_name: '10 min facial massage', xp_reward: 20 },
      { task_name: 'Cold shower (2 min minimum)', xp_reward: 25 },
      { task_name: 'Sleep 7+ hours tonight', xp_reward: 20 },
    ];

    // Select 5 random tasks
    const shuffled = taskTemplates.sort(() => 0.5 - Math.random());
    const selectedTasks = shuffled.slice(0, 5);

    const { data, error } = await supabase
      .from('daily_tasks')
      .insert(
        selectedTasks.map(t => ({
          ...t,
          user_id: user.id,
          date_assigned: dateStr,
        }))
      )
      .select();

    if (data && !error) {
      setTasks(data);
      toast({
        title: 'Daily Quests Generated',
        description: 'Complete all tasks to maximize your gains!',
      });
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

  const level = calculateLevel(profile.current_xp);
  const xpInLevel = getXpForCurrentLevel(profile.current_xp);
  const xpProgress = getXpProgress(profile.current_xp);
  const completedToday = tasks.filter(t => t.is_completed).length;
  const totalToday = tasks.length;
  const completionPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const totalXpAvailable = tasks.filter(t => !t.is_completed).reduce((sum, t) => sum + t.xp_reward, 0);

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      <CyberBackground />

      {/* XP Gain Animation */}
      {showXpGain && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="px-4 py-2 bg-xp rounded-full text-background font-display font-bold text-lg shadow-lg shadow-xp/30">
            +{showXpGain} XP
          </div>
        </div>
      )}

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
        {/* Header with Streak */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold">DAILY QUESTS</h1>
            <p className="text-xs font-mono text-muted-foreground">
              Complete tasks • Gain XP • Level Up
            </p>
          </div>
          <StreakBadge 
            currentStreak={profile.current_streak} 
            bestStreak={profile.best_streak} 
          />
        </div>

        {/* XP Progress Card - Compact */}
        <HUDCard className="p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-level bg-level/20 flex items-center justify-center shrink-0">
              <span className="font-display font-bold text-level">{level}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-display">Level {level}</span>
                <span className="text-xs font-mono text-muted-foreground">
                  {xpInLevel}/{XP_PER_LEVEL} XP
                </span>
              </div>
              <Progress value={xpProgress} className="h-2 bg-muted" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-xp/20 border border-xp/30 shrink-0">
              <Zap className="w-3 h-3 text-xp" />
              <span className="text-xs font-mono text-xp">{profile.current_xp}</span>
            </div>
          </div>
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
          <TabsContent value="tasks" className="space-y-3">
            {/* Today's Progress */}
            {totalToday > 0 && (
              <div className="p-3 bg-card/30 rounded-lg border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-muted-foreground">
                    {format(selectedDate, 'EEEE, MMM d')}
                  </span>
                  <div className="flex items-center gap-2">
                    {totalXpAvailable > 0 && (
                      <span className="text-xs font-mono text-xp">
                        {totalXpAvailable} XP left
                      </span>
                    )}
                    <span className={`text-sm font-display font-bold ${completionPercent === 100 ? 'text-primary' : 'text-foreground'}`}>
                      {completedToday}/{totalToday}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={completionPercent} 
                  className="h-1.5 bg-muted"
                />
                {completionPercent === 100 && (
                  <p className="text-xs text-primary font-mono mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    All quests complete! You're crushing it.
                  </p>
                )}
              </div>
            )}

            {/* Task List */}
            {loadingTasks ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : tasks.length === 0 ? (
              <HUDCard className="p-6 text-center">
                <CheckSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-display font-semibold mb-1">No Quests Today</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Generate your daily quests to start earning XP
                </p>
                <Button variant="cyber-fill" size="sm" onClick={generateDailyTasks}>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Quests
                </Button>
              </HUDCard>
            ) : (
              <div className="space-y-2">
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
