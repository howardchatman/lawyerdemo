'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Share2,
  Link2,
  QrCode,
  Copy,
  Check,
  MessageSquare,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Download,
  Smartphone,
  Users,
  TrendingUp,
  Eye,
} from 'lucide-react';

export default function AdminSharePage() {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);

  const bookingLink = `${baseUrl}/book`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(bookingLink)}&bgcolor=ffffff&color=000000`;

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bookingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaText = () => {
    const message = `Schedule a free consultation with Chatman Legal - Elite Legal Representation: ${bookingLink}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = 'Schedule Your Free Legal Consultation - Chatman Legal';
    const body = `I wanted to share this with you.\n\nChatman Legal offers elite legal representation with over 40 years of excellence.\n\nSchedule your free consultation here:\n${bookingLink}\n\nThey specialize in:\n• Corporate Law\n• Litigation\n• Criminal Defense\n• Personal Injury\n• And more...\n\nDon't wait - get the legal help you deserve.`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(bookingLink)}`, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const text = 'Need legal help? Schedule a free consultation with Chatman Legal - Elite attorneys with 40+ years of excellence.';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(bookingLink)}`, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(bookingLink)}`, '_blank', 'width=600,height=400');
  };

  const downloadQRCode = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chatman-legal-booking-qr.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  // Mock stats
  const stats = {
    totalShares: 47,
    linkClicks: 234,
    bookings: 18,
    conversionRate: 7.7,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Share Booking Link</h1>
        <p className="text-gray-600">Turn every client into a referral machine</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
              <Share2 size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{stats.totalShares}</p>
              <p className="text-xs text-gray-500">Total Shares</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
              <Eye size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{stats.linkClicks}</p>
              <p className="text-xs text-gray-500">Link Clicks</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 flex items-center justify-center">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{stats.bookings}</p>
              <p className="text-xs text-gray-500">Bookings</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{stats.conversionRate}%</p>
              <p className="text-xs text-gray-500">Conversion</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Share Link Section */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Link2 size={20} className="text-[#c9a961]" />
            <h2 className="text-lg font-bold text-black">Your Booking Link</h2>
          </div>

          {/* Link Display */}
          <div className="bg-gray-50 p-4 mb-6">
            <p className="text-sm text-gray-500 mb-2">Share this link with potential clients:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={bookingLink}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-200 bg-white text-black font-medium"
              />
              <button
                onClick={copyToClipboard}
                className={`px-4 py-3 font-medium transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-[#c9a961] text-black hover:bg-black hover:text-white'
                }`}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            {copied && (
              <p className="text-green-600 text-sm mt-2">Link copied to clipboard!</p>
            )}
          </div>

          {/* Quick Share Buttons */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700">Quick Share:</p>

            {/* Primary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareViaText}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 font-medium transition-colors"
              >
                <MessageSquare size={18} />
                Text Message
              </button>
              <button
                onClick={shareViaEmail}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 font-medium transition-colors"
              >
                <Mail size={18} />
                Email
              </button>
            </div>

            {/* Social Media */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={shareToFacebook}
                className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white py-3 px-4 font-medium transition-colors"
              >
                <Facebook size={18} />
              </button>
              <button
                onClick={shareToTwitter}
                className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white py-3 px-4 font-medium transition-colors"
              >
                <Twitter size={18} />
              </button>
              <button
                onClick={shareToLinkedIn}
                className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#094D92] text-white py-3 px-4 font-medium transition-colors"
              >
                <Linkedin size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <QrCode size={20} className="text-[#c9a961]" />
            <h2 className="text-lg font-bold text-black">QR Code</h2>
          </div>

          <div className="text-center">
            <div ref={qrRef} className="inline-block p-6 bg-white border-2 border-gray-200 mb-4">
              {baseUrl && (
                <img
                  src={qrCodeUrl}
                  alt="Booking QR Code"
                  className="w-48 h-48"
                />
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Scan to book a free consultation
            </p>
            <button
              onClick={downloadQRCode}
              className="flex items-center justify-center gap-2 bg-black hover:bg-[#c9a961] text-white hover:text-black py-3 px-6 font-medium transition-colors mx-auto"
            >
              <Download size={18} />
              Download QR Code
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Use this QR code on:</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                Business cards
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                Office signage
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                Marketing materials
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                Social media posts
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Marketing Tips */}
      <div className="bg-black text-white p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-[#c9a961]" />
          Maximize Your Referrals
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-[#c9a961] font-semibold mb-2">After Every Win</p>
            <p className="text-gray-300 text-sm">
              Send a thank you message with your booking link. Happy clients refer 3x more.
            </p>
          </div>
          <div>
            <p className="text-[#c9a961] font-semibold mb-2">Social Proof</p>
            <p className="text-gray-300 text-sm">
              Ask satisfied clients to share your link with a testimonial on social media.
            </p>
          </div>
          <div>
            <p className="text-[#c9a961] font-semibold mb-2">Network Events</p>
            <p className="text-gray-300 text-sm">
              Display your QR code at conferences and networking events for instant connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
