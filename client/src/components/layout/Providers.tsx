'use client';
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { theme, loadUser } = useStore();

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    loadUser();
  }, []);

  return <>{children}</>;
}
