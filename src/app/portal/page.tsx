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
  Scale,
  TrendingUp,
  Award,
  Gavel,
  DollarSign,
  Timer,
  ChevronRight,
  Shield,
  Gift,
} from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { Case, Appointment } from '@/lib/supabase';

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
  const [cases, setCases] = useState<Case[]>([]);
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

        const { data: profile } = await supabase
          .from('lawyer_profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserName(profile.full_name.split(' ')[0]);
        }

        const { data: casesData } = await supabase
          .from('lawyer_cases')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });

        if (casesData) {
          setCases(casesData);
          setStats(prev => ({
            ...prev,
            activeCases: casesData.filter(c => ['active', 'pending'].includes(c.status)).length,
          }));
        }

        const { count: messageCount } = await supabase
          .from('lawyer_messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false)
          .neq('sender_id', user.id);

        setStats(prev => ({ ...prev, unreadMessages: messageCount || 0 }));

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
      intake: 'bg-blue-500',
      active: 'bg-green-500',
      pending: 'bg-yellow-500',
      closed: 'bg-gray-400',
      won: 'bg-emerald-500',
      settled: 'bg-purple-500',
    };
    return colors[status] || 'bg-gray-400';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      intake: 'bg-blue-100 text-blue-700 border-blue-200',
      active: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      closed: 'bg-gray-100 text-gray-700 border-gray-200',
      won: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      settled: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
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

  const getProgressPercentage = (status: string) => {
    const progress: Record<string, number> = {
      intake: 10,
      active: 50,
      pending: 70,
      settled: 90,
      won: 100,
      closed: 100,
    };
    return progress[status] || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#c9a961] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeCases = cases.filter(c => ['active', 'pending', 'intake'].includes(c.status));
  const resolvedCases = cases.filter(c => ['won', 'settled', 'closed'].includes(c.status));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userName || 'Client'}
            </h1>
            <p className="text-gray-300">
              Track your legal matters and stay connected with your legal team.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/portal/share"
              className="flex items-center gap-2 bg-[#c9a961] hover:bg-[#d4b87a] text-black px-4 py-2 font-medium transition-colors"
            >
              <Gift size={18} />
              Refer a Friend
            </Link>
            <a
              href="tel:1-800-CHATMAN"
              className="flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white px-4 py-2 font-medium transition-colors"
            >
              <Phone size={18} />
              Call Us
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 border border-gray-200 hover:border-[#c9a961] hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
              <Briefcase size={24} className="text-blue-600" />
            </div>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-black">{stats.activeCases}</p>
          <p className="text-gray-500 text-sm">Active Cases</p>
        </div>

        <div className="bg-white p-6 border border-gray-200 hover:border-[#c9a961] hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 flex items-center justify-center">
              <MessageSquare size={24} className="text-purple-600" />
            </div>
            {stats.unreadMessages > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-black">{stats.unreadMessages}</p>
          <p className="text-gray-500 text-sm">Unread Messages</p>
        </div>

        <div className="bg-white p-6 border border-gray-200 hover:border-[#c9a961] hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 flex items-center justify-center">
              <Calendar size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-black">{stats.upcomingAppointments}</p>
          <p className="text-gray-500 text-sm">Upcoming Meetings</p>
        </div>

        <div className="bg-white p-6 border border-gray-200 hover:border-[#c9a961] hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center">
              <Award size={24} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-black">{resolvedCases.length}</p>
          <p className="text-gray-500 text-sm">Cases Resolved</p>
        </div>
      </div>

      {/* Claims/Cases Section - FEATURED */}
      <div className="bg-white border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c9a961] flex items-center justify-center">
              <Scale size={20} className="text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">My Legal Cases</h2>
              <p className="text-sm text-gray-500">Track the progress of all your matters</p>
            </div>
          </div>
          <Link
            href="/portal/cases"
            className="flex items-center gap-1 text-[#c9a961] hover:text-black font-medium transition-colors"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {cases.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {cases.slice(0, 5).map((caseItem) => (
              <Link
                key={caseItem.id}
                href={`/portal/cases/${caseItem.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusBadge(caseItem.status)}`}>
                        {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-400">{caseItem.case_number}</span>
                    </div>
                    <h3 className="text-lg font-bold text-black group-hover:text-[#c9a961] transition-colors">
                      {caseItem.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{caseItem.practice_area}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-[#c9a961] transition-colors" />
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Case Progress</span>
                    <span>{getProgressPercentage(caseItem.status)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStatusColor(caseItem.status)} transition-all duration-500`}
                      style={{ width: `${getProgressPercentage(caseItem.status)}%` }}
                    />
                  </div>
                </div>

                {/* Case Details */}
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Opened: {formatDate(caseItem.created_at)}
                  </span>
                  {caseItem.next_hearing_date && (
                    <span className="flex items-center gap-1 text-[#c9a961]">
                      <Gavel size={14} />
                      Next Hearing: {formatDate(caseItem.next_hearing_date)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Active Cases</h3>
            <p className="text-gray-500 mb-6">
              You don't have any legal cases yet. Contact us to discuss your legal needs.
            </p>
            <a
              href="tel:1-800-CHATMAN"
              className="inline-flex items-center gap-2 bg-[#c9a961] hover:bg-black text-black hover:text-white px-6 py-3 font-semibold transition-colors"
            >
              <Phone size={18} />
              Schedule Consultation
            </a>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-black">Upcoming Appointments</h2>
            <Link href="/portal/appointments" className="text-[#c9a961] hover:text-black text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-[#c9a961]/10 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-[#c9a961]">
                        {new Date(appointment.scheduled_at).getDate()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(appointment.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-black">{appointment.title}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Clock size={14} />
                        {formatTime(appointment.scheduled_at)}
                      </p>
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
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-black">Quick Actions</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            <Link
              href="/portal/messages"
              className="flex items-center gap-3 p-4 border border-gray-200 hover:border-[#c9a961] hover:bg-[#c9a961]/5 transition-all group"
            >
              <div className="w-10 h-10 bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <MessageSquare size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-black">Message</p>
                <p className="text-xs text-gray-500">Contact attorney</p>
              </div>
            </Link>
            <Link
              href="/portal/documents"
              className="flex items-center gap-3 p-4 border border-gray-200 hover:border-[#c9a961] hover:bg-[#c9a961]/5 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-black">Documents</p>
                <p className="text-xs text-gray-500">Upload files</p>
              </div>
            </Link>
            <Link
              href="/portal/appointments"
              className="flex items-center gap-3 p-4 border border-gray-200 hover:border-[#c9a961] hover:bg-[#c9a961]/5 transition-all group"
            >
              <div className="w-10 h-10 bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Calendar size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-black">Schedule</p>
                <p className="text-xs text-gray-500">Book meeting</p>
              </div>
            </Link>
            <Link
              href="/portal/share"
              className="flex items-center gap-3 p-4 border border-gray-200 hover:border-[#c9a961] hover:bg-[#c9a961]/5 transition-all group"
            >
              <div className="w-10 h-10 bg-[#c9a961]/20 flex items-center justify-center group-hover:bg-[#c9a961]/30 transition-colors">
                <Gift size={20} className="text-[#c9a961]" />
              </div>
              <div>
                <p className="font-medium text-black">Refer</p>
                <p className="text-xs text-gray-500">Share & earn</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Why Chatman Legal */}
      <div className="bg-black text-white p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Shield size={20} className="text-[#c9a961]" />
          You're in Good Hands
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <p className="text-3xl font-bold text-[#c9a961]">40+</p>
            <p className="text-gray-400 text-sm">Years Experience</p>
          </div>
          <div className="text-center p-4">
            <p className="text-3xl font-bold text-[#c9a961]">98%</p>
            <p className="text-gray-400 text-sm">Success Rate</p>
          </div>
          <div className="text-center p-4">
            <p className="text-3xl font-bold text-[#c9a961]">$2.5B+</p>
            <p className="text-gray-400 text-sm">Recovered</p>
          </div>
          <div className="text-center p-4">
            <p className="text-3xl font-bold text-[#c9a961]">500+</p>
            <p className="text-gray-400 text-sm">Attorneys</p>
          </div>
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
