'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, Search, Plus, Filter, Calendar, User } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { Case } from '@/lib/supabase';

interface CaseWithRelations extends Case {
  client?: { full_name: string };
  attorney?: { full_name: string };
}

export default function AdminCasesPage() {
  const [cases, setCases] = useState<CaseWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchCases = async () => {
      const supabase = createClientComponentClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('lawyer_cases')
        .select(`
          *,
          client:lawyer_profiles!client_id(full_name),
          attorney:lawyer_profiles!attorney_id(full_name)
        `)
        .order('created_at', { ascending: false });

      if (data) setCases(data);
      setLoading(false);
    };

    fetchCases();
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

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.case_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Cases</h1>
          <p className="text-gray-600">Manage all legal cases</p>
        </div>
        <button className="flex items-center gap-2 bg-[#c9a961] hover:bg-black text-black hover:text-white px-4 py-2 font-medium transition-colors">
          <Plus size={18} />
          New Case
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 px-4 py-2 focus:border-[#c9a961] focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="intake">Intake</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
              <option value="won">Won</option>
              <option value="settled">Settled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Case</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Attorney</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Practice Area</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/cases/${caseItem.id}`}
                        className="font-medium text-black hover:text-[#c9a961]"
                      >
                        {caseItem.title}
                      </Link>
                      <p className="text-xs text-gray-500">{caseItem.case_number}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={14} className="text-gray-500" />
                        </div>
                        <span className="text-gray-700">{caseItem.client?.full_name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {caseItem.attorney?.full_name || 'Unassigned'}
                    </td>
                    <td className="px-4 py-4 text-gray-600 capitalize">{caseItem.practice_area}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      {new Date(caseItem.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No cases found</h3>
                    <p className="text-gray-500">
                      {searchQuery || statusFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Create your first case to get started'}
                    </p>
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
