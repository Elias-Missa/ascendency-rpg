import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNav } from '@/components/navigation/BottomNav';

// Routes where bottom nav should NOT appear
const noNavRoutes = ['/auth', '/onboarding'];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const showNav = !noNavRoutes.includes(location.pathname);

  return (
    <>
      {children}
      {showNav && <BottomNav />}
    </>
  );
}
