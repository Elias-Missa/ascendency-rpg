import { NavLink, useLocation } from 'react-router-dom';
import { Home, ScrollText, BookOpen, CheckSquare, CalendarClock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/report', icon: ScrollText, label: 'Report' },
  { path: '/guide', icon: BookOpen, label: 'Guide' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/schedule', icon: CalendarClock, label: 'Schedule' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-around py-2 px-1 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <NavLink
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200',
                'hover:bg-primary/10',
                isActive && 'bg-primary/15'
              )}
            >
              <div className={cn(
                'relative p-1.5 rounded-lg transition-all duration-200',
                isActive && 'bg-primary/20'
              )}>
                <Icon className={cn(
                  'w-5 h-5 transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )} />
                {isActive && (
                  <div className="absolute inset-0 rounded-lg animate-pulse-glow" />
                )}
              </div>
              <span className={cn(
                'text-[10px] font-mono uppercase tracking-wider transition-colors duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
