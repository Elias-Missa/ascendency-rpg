import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { HUDCard, GlowingDivider } from '@/components/auth/HUDFrame';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { Loader2, LogOut, User, Zap, Target, TrendingUp } from 'lucide-react';

export default function Index() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="font-mono text-muted-foreground text-sm">INITIALIZING SYSTEM...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CyberBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center animate-pulse-glow">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-wider">ASCENDENCY</h1>
              <p className="text-xs font-mono text-muted-foreground">HUNTER SYSTEM v1.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs font-mono text-primary">LEVEL 1 HUNTER</p>
            </div>
            <Button variant="cyber-ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-mono text-primary">SYSTEM ONLINE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 glow-text">
            WELCOME, HUNTER
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Your journey to peak aesthetics begins here. The system will guide your transformation.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: User, label: 'Current Level', value: '1', subtext: '0 / 100 XP' },
            { icon: Target, label: 'Face Score', value: '--', subtext: 'Scan Required' },
            { icon: TrendingUp, label: 'Tasks Today', value: '0', subtext: 'No tasks assigned' },
          ].map(({ icon: Icon, label, value, subtext }, i) => (
            <HUDCard 
              key={label} 
              className="p-6 animate-fade-in" 
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-mono text-muted-foreground uppercase">{label}</span>
              </div>
              <div className="text-4xl font-display font-bold text-foreground mb-1">{value}</div>
              <p className="text-sm font-mono text-muted-foreground">{subtext}</p>
            </HUDCard>
          ))}
        </div>

        {/* Quick Actions */}
        <GlowingDivider className="mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HUDCard className="p-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h3 className="font-display text-lg font-semibold mb-2">FACE ANALYSIS</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your photo for AI-powered facial analysis and personalized recommendations.
            </p>
            <Button variant="cyber" className="w-full" disabled>
              <Zap className="w-4 h-4" />
              Coming Soon
            </Button>
          </HUDCard>

          <HUDCard className="p-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h3 className="font-display text-lg font-semibold mb-2">ONBOARDING SURVEY</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete your profile survey to unlock personalized recommendations and daily tasks.
            </p>
            <Button variant="cyber" className="w-full" disabled>
              <Target className="w-4 h-4" />
              Coming Soon
            </Button>
          </HUDCard>
        </div>

        {/* System Status */}
        <div className="mt-12 text-center">
          <p className="text-xs font-mono text-muted-foreground">
            SYSTEM STATUS: <span className="text-primary">OPERATIONAL</span> | 
            BACKEND: <span className="text-primary">CONNECTED</span> | 
            AUTH: <span className="text-primary">ACTIVE</span>
          </p>
        </div>
      </main>
    </div>
  );
}
