'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PenSquare, LineChart, Settings } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/journal', icon: PenSquare, label: 'Journal' },
    { href: '/patterns', icon: LineChart, label: 'Patterns' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  // Don't show on public routes
  if (['/login', '/register', '/onboarding', '/'].includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center px-2 pb-safe z-40 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'fill-[var(--color-primary)]/10' : ''}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DesktopSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/journal', icon: PenSquare, label: 'Journal' },
    { href: '/patterns', icon: LineChart, label: 'Patterns' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  if (['/login', '/register', '/onboarding', '/'].includes(pathname)) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-gray-200 bg-white p-6 z-40">
      <div className="text-2xl font-bold text-[var(--color-text-primary)] mb-10 pl-2">MindEase</div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-input)] transition-all ${
                isActive 
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-[var(--color-primary)]/10' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
