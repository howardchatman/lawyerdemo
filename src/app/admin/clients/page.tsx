'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, Plus, Mail, Phone, Calendar, MoreVertical } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';

export default function ClientsPage() {
  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      const supabase = createClientComponentClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('lawyer_profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (data) setClients(data);
      setLoading(false);
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-black">Clients</h1>
          <p className="text-gray-600">Manage your client database</p>
        </div>
        <button className="flex items-center gap-2 bg-[#c9a961] hover:bg-black text-black hover:text-white px-4 py-2 font-medium transition-colors">
          <Plus size={18} />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white border border-gray-200 hover:border-[#c9a961] transition-colors p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#c9a961] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">
                    {client.full_name.charAt(0)}
                  </span>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreVertical size={18} />
                </button>
              </div>

              <h3 className="font-bold text-black text-lg mb-1">{client.full_name}</h3>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail size={14} />
                  <span className="truncate">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone size={14} />
                    <span>{client.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Calendar size={14} />
                  <span>Joined {new Date(client.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/admin/clients/${client.id}`}
                  className="flex-1 text-center py-2 text-sm font-medium text-[#c9a961] hover:bg-[#c9a961] hover:text-black border border-[#c9a961] transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  href={`/admin/cases?client=${client.id}`}
                  className="flex-1 text-center py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
                >
                  View Cases
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3 bg-white border border-gray-200 p-12 text-center">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No clients found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search' : 'Add your first client to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
