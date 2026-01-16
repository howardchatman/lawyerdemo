'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Scale,
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  Mail,
  BarChart3,
  Share2,
} from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/cases', label: 'Cases', icon: Briefcase },
  { href: '/admin/leads', label: 'Leads', icon: Mail },
  { href: '/admin/share', label: 'Share & Referrals', icon: Share2 },
  { href: '/admin/documents', label: 'Documents', icon: FileText },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ full_name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const supabase = createClientComponentClient();
    if (!supabase) return;

    const checkAdmin = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('lawyer_profiles')
          .select('full_name, email, role')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          if (profile.role !== 'admin' && profile.role !== 'attorney') {
            router.push('/portal');
            return;
          }
          setUser(profile);
        }
      } else {
        router.push('/login');
      }
    };

    checkAdmin();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClientComponentClient();
    if (supabase) {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1a1a1a] z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-3">
            <Scale size={32} className="text-[#c9a961]" strokeWidth={1.5} />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">CHATMAN</span>
              <span className="text-xs tracking-[0.3em] text-[#c9a961] font-medium -mt-1">ADMIN</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
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

        {/* Admin Badge */}
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <div className="bg-[#c9a961]/10 border border-[#c9a961]/30 p-3 rounded">
            <p className="text-[#c9a961] text-xs font-medium uppercase tracking-wide">
              {user?.role === 'admin' ? 'Administrator' : 'Attorney'}
            </p>
          </div>
        </div>

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
            <h1 className="lg:hidden text-lg font-semibold text-black">Admin Dashboard</h1>

            {/* Right Side */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-black transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-[#c9a961] font-semibold text-sm">
                      {user?.full_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.full_name || 'Admin'}
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
                      href="/admin/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Settings
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
