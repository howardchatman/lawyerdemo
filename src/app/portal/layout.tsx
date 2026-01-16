'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Scale,
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Gift,
} from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';

const sidebarLinks = [
  { href: '/portal', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portal/cases', label: 'My Cases', icon: Briefcase },
  { href: '/portal/documents', label: 'Documents', icon: FileText },
  { href: '/portal/messages', label: 'Messages', icon: MessageSquare },
  { href: '/portal/appointments', label: 'Appointments', icon: Calendar },
  { href: '/portal/share', label: 'Refer a Friend', icon: Gift },
  { href: '/portal/profile', label: 'Profile', icon: User },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null);

  useEffect(() => {
    const supabase = createClientComponentClient();
    if (!supabase) return;

    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('lawyer_profiles')
          .select('full_name, email')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          setUser(profile);
        }
      }
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClientComponentClient();
    if (supabase) {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-3">
            <Scale size={32} className="text-[#c9a961]" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">CHATMAN</span>
              <span className="text-xs tracking-[0.3em] text-[#c9a961] font-medium -mt-1">LEGAL</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/portal' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                  isActive
                    ? 'bg-[#c9a961] text-black'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <link.icon size={20} />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-black"
            >
              <Menu size={24} />
            </button>

            {/* Page Title - Mobile */}
            <h1 className="lg:hidden text-lg font-semibold text-black">Client Portal</h1>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-black transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#c9a961] rounded-full" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <div className="w-8 h-8 bg-[#c9a961] rounded-full flex items-center justify-center">
                    <span className="text-black font-semibold text-sm">
                      {user?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.full_name || 'User'}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded z-50">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-medium text-black">{user?.full_name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/portal/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
