'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  FileText,
  MessageSquare,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { Case, Appointment, Message } from '@/lib/supabase';

interface DashboardStats {
  activeCases: number;
  pendingDocuments: number;
  unreadMessages: number;
  upcomingAppointments: number;
}

export default function PortalDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeCases: 0,
    pendingDocuments: 0,
    unreadMessages: 0,
    upcomingAppointments: 0,
  });
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClientComponentClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get profile
        const { data: profile } = await supabase
          .from('lawyer_profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserName(profile.full_name.split(' ')[0]);
        }

        // Get cases
        const { data: cases } = await supabase
          .from('lawyer_cases')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (cases) {
          setRecentCases(cases);
          setStats(prev => ({
            ...prev,
            activeCases: cases.filter(c => ['active', 'pending'].includes(c.status)).length,
          }));
        }

        // Get unread messages count
        const { count: messageCount } = await supabase
          .from('lawyer_messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false)
          .neq('sender_id', user.id);

        setStats(prev => ({ ...prev, unreadMessages: messageCount || 0 }));

        // Get upcoming appointments
        const { data: appointments } = await supabase
          .from('lawyer_appointments')
          .select('*')
          .eq('client_id', user.id)
          .eq('status', 'scheduled')
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(3);

        if (appointments) {
          setUpcomingAppointments(appointments);
          setStats(prev => ({ ...prev, upcomingAppointments: appointments.length }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      intake: 'bg-blue-100 text-blue-700',
      active: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      closed: 'bg-gray-100 text-gray-700',
      won: 'bg-emerald-100 text-emerald-700',
      settled: 'bg-purple-100 text-purple-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#c9a961] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-black text-white p-8 rounded-none">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userName || 'Client'}
        </h1>
        <p className="text-gray-300">
          Here&apos;s an overview of your legal matters and upcoming activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 border border-gray-200 hover:border-[#c9a961] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
              <Briefcase size={24} className="text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-black">{stats.activeCases}</span>
          </div>
          <p className="text-gray-600 font-medium">Active Cases</p>
        </div>

        <div className="bg-white p-6 border border-gray-200 hover:border-[#c9a961] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 flex items-center justify-center">
              <FileText size={24} className="text-yellow-600" />
            </div>
            <span className="text-3xl font-bold text-black">{stats.pendingDocuments}</span>
          </div>
          <p className="text-gray-600 font-medium">Pending Documents</p>
        </div>

        <div className="bg-white p-6 border border-gray-200 hover:border-[#c9a961] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 flex items-center justify-center">
              <MessageSquare size={24} className="text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-black">{stats.unreadMessages}</span>
          </div>
          <p className="text-gray-600 font-medium">Unread Messages</p>
        </div>

        <div className="bg-white p-6 border border-gray-200 hover:border-[#c9a961] transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 flex items-center justify-center">
              <Calendar size={24} className="text-green-600" />
            </div>
            <span className="text-3xl font-bold text-black">{stats.upcomingAppointments}</span>
          </div>
          <p className="text-gray-600 font-medium">Upcoming Appointments</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Cases */}
        <div className="bg-white border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-black">Recent Cases</h2>
            <Link href="/portal/cases" className="text-[#c9a961] hover:text-black text-sm font-medium flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentCases.length > 0 ? (
              recentCases.map((caseItem) => (
                <Link
                  key={caseItem.id}
                  href={`/portal/cases/${caseItem.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-black">{caseItem.title}</p>
                      <p className="text-sm text-gray-500">{caseItem.case_number}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{caseItem.practice_area}</p>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center">
                <Briefcase size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No cases yet</p>
                <p className="text-sm text-gray-400">Contact us to discuss your legal needs</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-black">Upcoming Appointments</h2>
            <Link href="/portal/appointments" className="text-[#c9a961] hover:text-black text-sm font-medium flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#c9a961]/10 flex items-center justify-center flex-shrink-0">
                      <Calendar size={20} className="text-[#c9a961]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-black">{appointment.title}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatDate(appointment.scheduled_at)} at {formatTime(appointment.scheduled_at)}
                        </span>
                      </div>
                      {appointment.location && (
                        <p className="text-sm text-gray-600 mt-1">{appointment.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming appointments</p>
                <p className="text-sm text-gray-400">Schedule a consultation with your attorney</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-black mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/portal/messages"
            className="flex flex-col items-center p-4 border border-gray-200 hover:border-[#c9a961] hover:bg-gray-50 transition-all"
          >
            <MessageSquare size={24} className="text-[#c9a961] mb-2" />
            <span className="text-sm font-medium text-gray-700">Send Message</span>
          </Link>
          <Link
            href="/portal/documents"
            className="flex flex-col items-center p-4 border border-gray-200 hover:border-[#c9a961] hover:bg-gray-50 transition-all"
          >
            <FileText size={24} className="text-[#c9a961] mb-2" />
            <span className="text-sm font-medium text-gray-700">Upload Document</span>
          </Link>
          <Link
            href="/portal/appointments"
            className="flex flex-col items-center p-4 border border-gray-200 hover:border-[#c9a961] hover:bg-gray-50 transition-all"
          >
            <Calendar size={24} className="text-[#c9a961] mb-2" />
            <span className="text-sm font-medium text-gray-700">Schedule Meeting</span>
          </Link>
          <a
            href="tel:1-800-CHATMAN"
            className="flex flex-col items-center p-4 border border-gray-200 hover:border-[#c9a961] hover:bg-gray-50 transition-all"
          >
            <Phone size={24} className="text-[#c9a961] mb-2" />
            <span className="text-sm font-medium text-gray-700">Call Attorney</span>
          </a>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-yellow-800">Need immediate assistance?</p>
          <p className="text-sm text-yellow-700 mt-1">
            For urgent matters, please call our 24/7 emergency line at{' '}
            <a href="tel:1-800-CHATMAN" className="font-semibold underline">1-800-CHATMAN</a>
          </p>
        </div>
      </div>
    </div>
  );
}
