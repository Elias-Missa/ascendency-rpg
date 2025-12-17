import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HUDCard, GlowingDivider } from '@/components/auth/HUDFrame';
import { CyberBackground } from '@/components/auth/CyberBackground';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2, Zap, Shield, Trophy } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; username?: string }>({});
  
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    try {
      if (isLogin) {
        authSchema.pick({ email: true, password: true }).parse({ email, password });
      } else {
        authSchema.parse({ email, password, username: username || undefined });
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            fieldErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Access Denied",
            description: error.message === 'Invalid login credentials' 
              ? "Invalid credentials. Check your email and password."
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "System Access Granted",
            description: "Welcome back, Hunter.",
          });
        }
      } else {
        const { error } = await signUp(email, password, username);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: "Registration Failed",
              description: "This email is already registered. Try logging in.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Registration Failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Hunter Registered",
            description: "Your ascension begins now.",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <CyberBackground />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-primary/20 rotate-45 animate-float opacity-30" />
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-primary/20 rotate-12 animate-float opacity-20" style={{ animationDelay: '1s' }} />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Title Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary mb-4 animate-pulse-glow">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground tracking-wider glow-text">
            ASCENDENCY
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm tracking-widest">
            HUNTER AUTHENTICATION SYSTEM
          </p>
        </div>

        {/* Auth Card */}
        <HUDCard className="p-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          {/* Mode Toggle */}
          <div className="flex mb-6 bg-surface-dark rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md font-display text-sm uppercase tracking-wider transition-all duration-300 ${
                isLogin
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md font-display text-sm uppercase tracking-wider transition-all duration-300 ${
                !isLogin
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Register
            </button>
          </div>

          <GlowingDivider className="mb-6" />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field (Register only) */}
            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="username" className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                  Hunter Name
                </Label>
                <Input
                  id="username"
                  type="text"
                  variant="cyber-glow"
                  placeholder="Enter your hunter name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                />
                {errors.username && (
                  <p className="text-destructive text-xs font-mono">{errors.username}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                variant="cyber-glow"
                placeholder="hunter@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
              {errors.email && (
                <p className="text-destructive text-xs font-mono">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                Access Code
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  variant="cyber-glow"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs font-mono">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="cyber-fill"
              size="xl"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                <>
                  <Shield className="w-5 h-5" />
                  Authenticate
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  Begin Ascension
                </>
              )}
            </Button>
          </form>

          <GlowingDivider className="my-6" />

          {/* Info Text */}
          <p className="text-center text-xs text-muted-foreground font-mono">
            {isLogin
              ? 'Access your hunter profile and continue your journey.'
              : 'Create your hunter profile and start your transformation.'}
          </p>
        </HUDCard>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { icon: Zap, label: 'AI Analysis' },
            { icon: Shield, label: 'Secure Data' },
            { icon: Trophy, label: 'Gamified XP' },
          ].map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-xs font-mono text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
