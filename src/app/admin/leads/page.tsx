'use client';

import { useState, useEffect } from 'react';
import { Mail, Search, Filter, Phone, Calendar, MessageSquare, CheckCircle2, XCircle, UserPlus } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { ContactSubmission } from '@/lib/supabase';

export default function LeadsPage() {
  const [leads, setLeads] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      const supabase = createClientComponentClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('lawyer_contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setLeads(data);
      setLoading(false);
    };

    fetchLeads();
  }, []);

  const updateLeadStatus = async (leadId: string, status: string) => {
    const supabase = createClientComponentClient();
    if (!supabase) return;

    const { error } = await supabase
      .from('lawyer_contact_submissions')
      .update({ status })
      .eq('id', leadId);

    if (!error) {
      setLeads(leads.map(lead =>
        lead.id === leadId ? { ...lead, status: status as ContactSubmission['status'] } : lead
      ));
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: status as ContactSubmission['status'] });
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      converted: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
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
      <div>
        <h1 className="text-2xl font-bold text-black">Leads</h1>
        <p className="text-gray-600">Manage contact form submissions and potential clients</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {['new', 'contacted', 'converted', 'closed'].map((status) => {
          const count = leads.filter(l => l.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
              className={`p-4 border transition-colors ${
                statusFilter === status ? 'border-[#c9a961] bg-[#c9a961]/5' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="text-2xl font-bold text-black">{count}</p>
              <p className="text-sm text-gray-600 capitalize">{status}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 px-4 py-2 focus:border-[#c9a961] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leads List */}
        <div className="lg:col-span-2 bg-white border border-gray-200">
          <div className="divide-y divide-gray-100">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedLead?.id === lead.id ? 'bg-gray-50 border-l-4 border-l-[#c9a961]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-black">
                          {lead.first_name} {lead.last_name}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(lead.status || 'new')}`}>
                          {lead.status || 'new'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{lead.email}</p>
                      <p className="text-xs text-gray-400 mt-1 capitalize">{lead.practice_area}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(lead.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-12 text-center">
                <Mail size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No leads found</h3>
                <p className="text-gray-500">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'New leads will appear here when clients submit the contact form'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lead Detail */}
        <div className="bg-white border border-gray-200">
          {selectedLead ? (
            <div>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-black">Lead Details</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-black">{selectedLead.first_name} {selectedLead.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${selectedLead.email}`} className="font-medium text-[#c9a961] hover:text-black">
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a href={`tel:${selectedLead.phone}`} className="font-medium text-[#c9a961] hover:text-black">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Practice Area</p>
                  <p className="font-medium text-black capitalize">{selectedLead.practice_area}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Message</p>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 mt-1">{selectedLead.message}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium text-black">
                    {new Date(selectedLead.created_at || '').toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Update Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateLeadStatus(selectedLead.id!, 'contacted')}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-700 text-sm font-medium hover:bg-yellow-200 transition-colors"
                    >
                      <Phone size={14} />
                      Contacted
                    </button>
                    <button
                      onClick={() => updateLeadStatus(selectedLead.id!, 'converted')}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      <UserPlus size={14} />
                      Convert
                    </button>
                    <button
                      onClick={() => updateLeadStatus(selectedLead.id!, 'closed')}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors col-span-2"
                    >
                      <XCircle size={14} />
                      Close Lead
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Select a lead to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
