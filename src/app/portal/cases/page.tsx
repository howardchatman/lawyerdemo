'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, Search, Filter, ChevronRight, Calendar, User } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { Case } from '@/lib/supabase';

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
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

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('lawyer_cases')
        .select('*')
        .eq('client_id', user.id)
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
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.case_number.toLowerCase().includes(searchQuery.toLowerCase());
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
          <h1 className="text-2xl font-bold text-black">My Cases</h1>
          <p className="text-gray-600">View and track all your legal matters</p>
        </div>
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

      {/* Cases List */}
      <div className="bg-white border border-gray-200">
        {filteredCases.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredCases.map((caseItem) => (
              <Link
                key={caseItem.id}
                href={`/portal/cases/${caseItem.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">{caseItem.case_number}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-black group-hover:text-[#c9a961] transition-colors">
                      {caseItem.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{caseItem.practice_area}</p>
                    <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Opened: {new Date(caseItem.created_at).toLocaleDateString()}
                      </span>
                      {caseItem.next_hearing_date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Next Hearing: {new Date(caseItem.next_hearing_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-[#c9a961] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No cases found</h3>
            <p className="text-gray-500">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : "You don't have any cases yet. Contact us to discuss your legal needs."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
