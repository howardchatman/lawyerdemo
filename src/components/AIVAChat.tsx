'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Phone,
  Calendar,
  Bot,
  User,
  Mic,
  MicOff,
  PhoneCall,
  Clock,
  ChevronRight,
  Minimize2,
  Scale,
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const RETELL_PHONE = '713-999-2094';

const quickActions = [
  { id: 'schedule', label: 'Schedule Consultation', icon: Calendar },
  { id: 'call', label: 'Request Callback', icon: PhoneCall },
  { id: 'hours', label: 'Office Hours', icon: Clock },
  { id: 'areas', label: 'Practice Areas', icon: Scale },
];

const botResponses: Record<string, string> = {
  schedule: `I'd be happy to help you schedule a consultation! You can:\n\n📞 **Call us directly:** ${RETELL_PHONE}\n📅 **Book online:** Visit our booking page\n\nWould you like me to connect you with our scheduling team?`,
  call: `I can arrange for one of our attorneys to call you back. Our team typically responds within 1 hour during business hours.\n\n📞 Or call us now: **${RETELL_PHONE}**\n\nWould you like to provide your phone number for a callback?`,
  hours: `**Office Hours:**\n\n🕐 Monday - Friday: 8:00 AM - 6:00 PM\n🕐 Saturday: 9:00 AM - 2:00 PM\n🕐 Sunday: Closed\n\n⚡ **24/7 Emergency Line:** ${RETELL_PHONE}\n\nWe're always available for urgent legal matters.`,
  areas: `**Our Practice Areas:**\n\n⚖️ Corporate Law & Business\n⚖️ Litigation & Trial Work\n⚖️ Criminal Defense\n⚖️ Personal Injury\n⚖️ Family Law\n⚖️ Real Estate\n⚖️ Employment Law\n⚖️ Intellectual Property\n\nWhich area can I help you with today?`,
  default: `Thank you for your message! I'm AIVA, Chatman Legal's AI assistant. I can help you:\n\n• Schedule a free consultation\n• Connect you with an attorney\n• Answer questions about our services\n\nHow can I assist you today?`,
  greeting: `Hello! I'm **AIVA**, your AI legal assistant at Chatman Legal. 👋\n\nI'm here to help you 24/7 with:\n• Scheduling consultations\n• Answering questions\n• Connecting you with our attorneys\n\n📞 Need immediate help? Call **${RETELL_PHONE}**\n\nHow can I assist you today?`,
};

export default function AIVAChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCallPanel, setShowCallPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send greeting when chat is first opened
      setTimeout(() => {
        addBotMessage(botResponses.greeting);
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simple keyword matching for responses
    const lowerInput = inputValue.toLowerCase();
    let response = botResponses.default;

    if (lowerInput.includes('schedule') || lowerInput.includes('appointment') || lowerInput.includes('book')) {
      response = botResponses.schedule;
    } else if (lowerInput.includes('call') || lowerInput.includes('phone') || lowerInput.includes('callback')) {
      response = botResponses.call;
    } else if (lowerInput.includes('hour') || lowerInput.includes('open') || lowerInput.includes('time')) {
      response = botResponses.hours;
    } else if (lowerInput.includes('practice') || lowerInput.includes('area') || lowerInput.includes('service') || lowerInput.includes('help with')) {
      response = botResponses.areas;
    } else if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) {
      response = `Hello! How can I help you today? I can assist with scheduling consultations, answering questions about our practice areas, or connecting you with an attorney.\n\n📞 Direct line: **${RETELL_PHONE}**`;
    } else if (lowerInput.includes('thank')) {
      response = `You're welcome! Is there anything else I can help you with?\n\n📞 Remember, you can always reach us at **${RETELL_PHONE}**`;
    }

    addBotMessage(response);
  };

  const handleQuickAction = (actionId: string) => {
    const response = botResponses[actionId] || botResponses.default;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: quickActions.find(a => a.id === actionId)?.label || '',
      timestamp: new Date(),
    }]);

    addBotMessage(response);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line.split('**').map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#c9a961] hover:bg-black text-black hover:text-white p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
        aria-label="Open AIVA Chat"
      >
        <MessageCircle size={24} className="sm:w-7 sm:h-7" />
        <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
        </span>
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
          Chat with AIVA
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-full sm:w-96 sm:max-w-96'}`}>
      {/* Chat Window */}
      <div className="bg-white sm:rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: isMinimized ? 'auto' : 'min(550px, 100vh)' }}>
        {/* Header */}
        <div className="bg-black text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#c9a961] rounded-full flex items-center justify-center">
                <Bot size={20} className="text-black" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AIVA</h3>
                <p className="text-xs text-gray-300">AI Legal Assistant • Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${RETELL_PHONE}`}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Call Now"
              >
                <Phone size={18} className="text-[#c9a961]" />
              </a>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Call Banner */}
          {!isMinimized && (
            <a
              href={`tel:${RETELL_PHONE}`}
              className="mt-3 flex items-center justify-between bg-[#c9a961]/20 px-3 py-2 rounded hover:bg-[#c9a961]/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <PhoneCall size={16} className="text-[#c9a961]" />
                <span className="text-sm">Speak with an attorney now</span>
              </div>
              <span className="text-[#c9a961] font-bold text-sm">{RETELL_PHONE}</span>
            </a>
          )}
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' ? 'bg-black' : 'bg-[#c9a961]'
                    }`}>
                      {message.type === 'user' ? (
                        <User size={14} className="text-white" />
                      ) : (
                        <Bot size={14} className="text-black" />
                      )}
                    </div>
                    <div className={`px-4 py-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-black text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                      <p className="text-sm leading-relaxed">{formatMessage(message.content)}</p>
                      <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-gray-400' : 'text-gray-400'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#c9a961] flex items-center justify-center">
                    <Bot size={14} className="text-black" />
                  </div>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 py-3 bg-white border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-[#c9a961]/10 border border-gray-200 hover:border-[#c9a961] rounded text-sm text-gray-700 transition-colors"
                    >
                      <action.icon size={14} className="text-[#c9a961]" />
                      <span className="text-xs">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:border-[#c9a961] focus:outline-none text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="p-3 bg-[#c9a961] hover:bg-black text-black hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                Powered by AIVA • Chatman Legal AI
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
