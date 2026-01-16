'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Paperclip, Search } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { Message, Case } from '@/lib/supabase';

interface MessageWithSender extends Message {
  sender?: { full_name: string };
}

export default function MessagesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCases = async () => {
      const supabase = createClientComponentClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data } = await supabase
        .from('lawyer_cases')
        .select('*')
        .eq('client_id', user.id)
        .order('updated_at', { ascending: false });

      if (data && data.length > 0) {
        setCases(data);
        setSelectedCase(data[0]);
      }
      setLoading(false);
    };

    fetchCases();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedCase) return;

      const supabase = createClientComponentClient();
      if (!supabase) return;

      const { data } = await supabase
        .from('lawyer_messages')
        .select(`
          *,
          sender:lawyer_profiles!sender_id(full_name)
        `)
        .eq('case_id', selectedCase.id)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);
        // Mark messages as read
        await supabase
          .from('lawyer_messages')
          .update({ is_read: true })
          .eq('case_id', selectedCase.id)
          .neq('sender_id', userId);
      }
    };

    fetchMessages();
  }, [selectedCase, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCase || !userId) return;

    setSending(true);
    const supabase = createClientComponentClient();
    if (!supabase) {
      setSending(false);
      return;
    }

    const { data, error } = await supabase
      .from('lawyer_messages')
      .insert({
        case_id: selectedCase.id,
        sender_id: userId,
        content: newMessage.trim(),
      })
      .select(`
        *,
        sender:lawyer_profiles!sender_id(full_name)
      `)
      .single();

    if (data && !error) {
      setMessages([...messages, data]);
      setNewMessage('');
    }
    setSending(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#c9a961] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-12 text-center">
        <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages</h3>
        <p className="text-gray-500">
          You need an active case to send messages. Contact us to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Messages</h1>
        <p className="text-gray-600">Communicate securely with your legal team</p>
      </div>

      <div className="bg-white border border-gray-200 h-[calc(100vh-250px)] flex">
        {/* Cases Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-black">Your Cases</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {cases.map((caseItem) => (
              <button
                key={caseItem.id}
                onClick={() => setSelectedCase(caseItem)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedCase?.id === caseItem.id ? 'bg-gray-50 border-l-4 border-l-[#c9a961]' : ''
                }`}
              >
                <p className="font-medium text-black truncate">{caseItem.title}</p>
                <p className="text-sm text-gray-500">{caseItem.case_number}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-black">{selectedCase?.title}</h3>
            <p className="text-sm text-gray-500">{selectedCase?.case_number}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => {
                const isOwn = message.sender_id === userId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        isOwn
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-black'
                      } p-4`}
                    >
                      {!isOwn && (
                        <p className="text-xs font-medium text-[#c9a961] mb-1">
                          {message.sender?.full_name || 'Attorney'}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${isOwn ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare size={40} className="text-gray-300 mx-auto mb-2" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="p-2 bg-[#c9a961] text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
