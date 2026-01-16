'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  Mail,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Scale,
  Gavel,
  FileCheck,
  Timer,
  Award,
  Target,
  Activity,
  Eye,
} from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { Case, ContactSubmission, Appointment } from '@/lib/supabase';

interface Stats {
  totalClients: number;
  activeCases: number;
  newLeads: number;
  revenue: number;
  clientGrowth: number;
  caseGrowth: number;
}

interface CaseStats {
  total: number;
  won: number;
  settled: number;
  active: number;
  pending: number;
  intake: number;
  totalRecovered: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    activeCases: 0,
    newLeads: 0,
    revenue: 0,
    clientGrowth: 12,
    caseGrowth: 8,
  });
  const [recentCases, setRecentCases] = useState<(Case & { client?: { full_name: string } })[]>([]);
  const [recentLeads, setRecentLeads] = useState<ContactSubmission[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<(Appointment & { client?: { full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [caseStats, setCaseStats] = useState<CaseStats>({
    total: 0,
    won: 0,
    settled: 0,
    active: 0,
    pending: 0,
    intake: 0,
    totalRecovered: 0,
  });
  const [priorityCases, setPriorityCases] = useState<(Case & { client?: { full_name: string } })[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClientComponentClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Get total clients
        const { count: clientCount } = await supabase
          .from('lawyer_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'client');

        // Get active cases
        const { count: caseCount } = await supabase
          .from('lawyer_cases')
          .select('*', { count: 'exact', head: true })
          .in('status', ['active', 'pending']);

        // Get new leads (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { count: leadCount } = await supabase
          .from('lawyer_contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new')
          .gte('created_at', weekAgo.toISOString());

        setStats(prev => ({
          ...prev,
          totalClients: clientCount || 0,
          activeCases: caseCount || 0,
          newLeads: leadCount || 0,
        }));

        // Get recent cases with client info
        const { data: cases } = await supabase
          .from('lawyer_cases')
          .select(`
            *,
            client:lawyer_profiles!client_id(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (cases) setRecentCases(cases);

        // Get recent leads
        const { data: leads } = await supabase
          .from('lawyer_contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (leads) setRecentLeads(leads);

        // Get upcoming appointments
        const { data: appointments } = await supabase
          .from('lawyer_appointments')
          .select(`
            *,
            client:lawyer_profiles!client_id(full_name)
          `)
          .eq('status', 'scheduled')
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(5);

        if (appointments) setUpcomingAppointments(appointments);

        // Get case stats for the claims section
        const { data: allCases } = await supabase
          .from('lawyer_cases')
          .select('status, settlement_amount');

        if (allCases) {
          const stats: CaseStats = {
            total: allCases.length,
            won: allCases.filter(c => c.status === 'won').length,
            settled: allCases.filter(c => c.status === 'settled').length,
            active: allCases.filter(c => c.status === 'active').length,
            pending: allCases.filter(c => c.status === 'pending').length,
            intake: allCases.filter(c => c.status === 'intake').length,
            totalRecovered: allCases.reduce((sum, c) => sum + (c.settlement_amount || 0), 0),
          };
          setCaseStats(stats);
        }

        // Get priority/featured cases (active with upcoming hearings or high value)
        const { data: priority } = await supabase
          .from('lawyer_cases')
          .select(`
            *,
            client:lawyer_profiles!client_id(full_name)
          `)
          .in('status', ['active', 'pending'])
          .order('next_hearing_date', { ascending: true, nullsFirst: false })
          .limit(4);

        if (priority) setPriorityCases(priority);
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
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      converted: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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

  const getProgressColor = (status: string) => {
    const colors: Record<string, string> = {
      intake: 'bg-blue-500',
      active: 'bg-green-500',
      pending: 'bg-yellow-500',
      settled: 'bg-purple-500',
      won: 'bg-emerald-500',
      closed: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      intake: 'Intake',
      active: 'Active',
      pending: 'Pending Review',
      settled: 'Settled',
      won: 'Won',
      closed: 'Closed',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your law firm&apos;s performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp size={16} />
              +{stats.clientGrowth}%
            </div>
          </div>
          <p className="text-3xl font-bold text-black">{stats.totalClients}</p>
          <p className="text-gray-600 text-sm">Total Clients</p>
        </div>

        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 flex items-center justify-center">
              <Briefcase size={24} className="text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp size={16} />
              +{stats.caseGrowth}%
            </div>
          </div>
          <p className="text-3xl font-bold text-black">{stats.activeCases}</p>
          <p className="text-gray-600 text-sm">Active Cases</p>
        </div>

        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 flex items-center justify-center">
              <Mail size={24} className="text-yellow-600" />
            </div>
            <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
              This Week
            </span>
          </div>
          <p className="text-3xl font-bold text-black">{stats.newLeads}</p>
          <p className="text-gray-600 text-sm">New Leads</p>
        </div>

        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 flex items-center justify-center">
              <DollarSign size={24} className="text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp size={16} />
              +15%
            </div>
          </div>
          <p className="text-3xl font-bold text-black">$125K</p>
          <p className="text-gray-600 text-sm">Monthly Revenue</p>
        </div>
      </div>

      {/* Enhanced Claims Command Center */}
      <div className="bg-gradient-to-r from-black to-gray-900 p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#c9a961] rounded-full flex items-center justify-center">
              <Gavel size={24} className="text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Claims Command Center</h2>
              <p className="text-gray-400 text-sm">Real-time case pipeline overview</p>
            </div>
          </div>
          <Link
            href="/admin/cases"
            className="px-4 py-2 bg-[#c9a961] text-black font-semibold hover:bg-white transition-colors text-sm flex items-center gap-2"
          >
            Manage All Cases
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Case Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-blue-400" />
              <span className="text-xs text-gray-400 uppercase">Intake</span>
            </div>
            <p className="text-2xl font-bold">{caseStats.intake}</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Timer size={16} className="text-green-400" />
              <span className="text-xs text-gray-400 uppercase">Active</span>
            </div>
            <p className="text-2xl font-bold">{caseStats.active}</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={16} className="text-yellow-400" />
              <span className="text-xs text-gray-400 uppercase">Pending</span>
            </div>
            <p className="text-2xl font-bold">{caseStats.pending}</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck size={16} className="text-purple-400" />
              <span className="text-xs text-gray-400 uppercase">Settled</span>
            </div>
            <p className="text-2xl font-bold">{caseStats.settled}</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Award size={16} className="text-emerald-400" />
              <span className="text-xs text-gray-400 uppercase">Won</span>
            </div>
            <p className="text-2xl font-bold">{caseStats.won}</p>
          </div>
          <div className="bg-[#c9a961]/20 backdrop-blur p-4 rounded-lg border border-[#c9a961]/40">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-[#c9a961]" />
              <span className="text-xs text-[#c9a961] uppercase">Recovered</span>
            </div>
            <p className="text-2xl font-bold text-[#c9a961]">{formatCurrency(caseStats.totalRecovered)}</p>
          </div>
        </div>

        {/* Win Rate Bar */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Case Success Rate</span>
            <span className="text-sm font-bold text-[#c9a961]">
              {caseStats.total > 0
                ? Math.round(((caseStats.won + caseStats.settled) / caseStats.total) * 100)
                : 0}%
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c9a961] to-emerald-500 transition-all duration-1000"
              style={{
                width: `${caseStats.total > 0
                  ? ((caseStats.won + caseStats.settled) / caseStats.total) * 100
                  : 0}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Priority Cases Grid */}
      {priorityCases.length > 0 && (
        <div className="bg-white border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Target size={20} className="text-[#c9a961]" />
              <h2 className="text-lg font-bold text-black">Priority Cases</h2>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Upcoming Deadlines
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {priorityCases.map((caseItem) => (
              <Link
                key={caseItem.id}
                href={`/admin/cases/${caseItem.id}`}
                className="p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-black group-hover:text-[#c9a961] transition-colors truncate">
                      {caseItem.title}
                    </p>
                    <p className="text-xs text-gray-500">{caseItem.case_number}</p>
                  </div>
                  <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded border ${
                    caseItem.status === 'active'
                      ? 'border-green-300 text-green-700 bg-green-50'
                      : 'border-yellow-300 text-yellow-700 bg-yellow-50'
                  }`}>
                    {getStatusLabel(caseItem.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{caseItem.client?.full_name || 'Unassigned'}</p>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{getProgressPercentage(caseItem.status)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(caseItem.status)} transition-all duration-500`}
                      style={{ width: `${getProgressPercentage(caseItem.status)}%` }}
                    />
                  </div>
                </div>

                {caseItem.next_hearing_date && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Calendar size={12} />
                    <span>Next Hearing: {formatDate(caseItem.next_hearing_date)}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <div className="lg:col-span-2 bg-white border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-black">Recent Cases</h2>
            <Link href="/admin/cases" className="text-[#c9a961] hover:text-black text-sm font-medium flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Case</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentCases.length > 0 ? (
                  recentCases.map((caseItem) => (
                    <tr key={caseItem.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/cases/${caseItem.id}`} className="font-medium text-black hover:text-[#c9a961]">
                          {caseItem.title}
                        </Link>
                        <p className="text-xs text-gray-500">{caseItem.case_number}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{caseItem.client?.full_name || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(caseItem.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No cases yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-black">Upcoming</h2>
            <Link href="/admin/appointments" className="text-[#c9a961] hover:text-black text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#c9a961]/10 flex items-center justify-center flex-shrink-0">
                      <Calendar size={16} className="text-[#c9a961]" />
                    </div>
                    <div>
                      <p className="font-medium text-black text-sm">{appointment.title}</p>
                      <p className="text-xs text-gray-500">{appointment.client?.full_name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(appointment.scheduled_at)} at {formatTime(appointment.scheduled_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No upcoming appointments
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-black">Recent Leads</h2>
          <Link href="/admin/leads" className="text-[#c9a961] hover:text-black text-sm font-medium flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Practice Area</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-black">
                      {lead.first_name} {lead.last_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{lead.practice_area}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(lead.status || 'new')}`}>
                        {lead.status || 'new'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(lead.created_at || '')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No leads yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
