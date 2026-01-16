'use client';

import { useState, useEffect } from 'react';
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
  Gift,
  Users,
  TrendingUp,
  Star,
  Download,
} from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';

export default function PortalSharePage() {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [userName, setUserName] = useState('');
  const [userSlug, setUserSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    pendingReferrals: 0,
    successfulReferrals: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setBaseUrl(window.location.origin);

      const supabase = createClientComponentClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('lawyer_profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserName(profile.full_name);
          // Create URL-friendly slug from name
          const slug = profile.full_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          setUserSlug(slug);
        }

        // Get referral stats (mock for now)
        // In production, query lawyer_referrals table
        setReferralStats({
          totalReferrals: 5,
          pendingReferrals: 2,
          successfulReferrals: 3,
        });
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const referralLink = userSlug ? `${baseUrl}/r/${userSlug}` : '';
  const qrCodeUrl = referralLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(referralLink)}&bgcolor=ffffff&color=000000`
    : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaText = () => {
    const message = `I've been working with Chatman Legal and they've been amazing! If you need legal help, use my personal referral link to schedule a free consultation: ${referralLink}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = `${userName} recommends Chatman Legal`;
    const body = `Hi,\n\nI wanted to share something with you. I've been working with Chatman Legal and their team has been exceptional.\n\nIf you ever need legal assistance, I highly recommend them. Use my personal referral link to schedule a free consultation:\n\n${referralLink}\n\nThey handle:\n• Corporate Law & Business Disputes\n• Litigation & Trial Work\n• Criminal Defense\n• Personal Injury\n• Family Law\n• And much more...\n\nHope this helps!\n\n${userName}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const text = `If you need legal help, I highly recommend Chatman Legal. Use my referral link for a free consultation:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`, '_blank', 'width=600,height=400');
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chatman-legal-referral-${userSlug}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
    }
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
      <div className="bg-black text-white p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#c9a961] rounded-full flex items-center justify-center">
            <Gift size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Share & Earn</h1>
            <p className="text-gray-300">Refer friends & family to Chatman Legal</p>
          </div>
        </div>
        <p className="text-gray-400 max-w-2xl">
          Know someone who needs legal help? Share your personal referral link and help them
          connect with the best legal team. Your referrals help us grow and serve more people.
        </p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 border border-gray-200 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users size={24} className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-black">{referralStats.totalReferrals}</p>
          <p className="text-gray-500 text-sm">Total Referrals</p>
        </div>
        <div className="bg-white p-6 border border-gray-200 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp size={24} className="text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-black">{referralStats.pendingReferrals}</p>
          <p className="text-gray-500 text-sm">Pending</p>
        </div>
        <div className="bg-white p-6 border border-gray-200 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star size={24} className="text-green-600" />
          </div>
          <p className="text-3xl font-bold text-black">{referralStats.successfulReferrals}</p>
          <p className="text-gray-500 text-sm">Successful</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Share Link */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Link2 size={20} className="text-[#c9a961]" />
            <h2 className="text-lg font-bold text-black">Your Personal Referral Link</h2>
          </div>

          <div className="bg-gray-50 p-4 rounded mb-6">
            <p className="text-xs text-gray-500 mb-2">Your unique link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-200 bg-white text-black font-medium text-sm"
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
              <p className="text-green-600 text-sm mt-2">Copied to clipboard!</p>
            )}
          </div>

          {/* Share Buttons */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700">Share via:</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareViaText}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 font-medium transition-colors"
              >
                <MessageSquare size={18} />
                Text
              </button>
              <button
                onClick={shareViaEmail}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 font-medium transition-colors"
              >
                <Mail size={18} />
                Email
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareToFacebook}
                className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white py-3 px-4 font-medium transition-colors"
              >
                <Facebook size={18} />
                Facebook
              </button>
              <button
                onClick={shareToTwitter}
                className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white py-3 px-4 font-medium transition-colors"
              >
                <Twitter size={18} />
                Twitter
              </button>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <QrCode size={20} className="text-[#c9a961]" />
            <h2 className="text-lg font-bold text-black">Your Personal QR Code</h2>
          </div>

          <div className="text-center">
            <div className="inline-block p-4 bg-white border-2 border-gray-200 mb-4">
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="Your Referral QR Code"
                  className="w-40 h-40"
                />
              )}
            </div>
            <p className="text-sm text-gray-500 mb-1">Referred by</p>
            <p className="font-bold text-black mb-4">{userName}</p>
            <button
              onClick={downloadQRCode}
              className="flex items-center justify-center gap-2 bg-black hover:bg-[#c9a961] text-white hover:text-black py-2 px-4 font-medium transition-colors mx-auto text-sm"
            >
              <Download size={16} />
              Download QR
            </button>
          </div>
        </div>
      </div>

      {/* Message Templates */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-black mb-4">Ready-to-Send Messages</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-xs text-gray-500 mb-2 uppercase font-medium">For a friend in need:</p>
            <p className="text-sm text-gray-700 mb-3">
              &quot;Hey! I know you&apos;ve been dealing with that legal issue. I&apos;ve been working with Chatman Legal and they&apos;re incredible. Here&apos;s my referral link for a free consultation: {referralLink}&quot;
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Hey! I know you've been dealing with that legal issue. I've been working with Chatman Legal and they're incredible. Here's my referral link for a free consultation: ${referralLink}`);
              }}
              className="text-[#c9a961] hover:text-black text-sm font-medium"
            >
              Copy Message
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-xs text-gray-500 mb-2 uppercase font-medium">General share:</p>
            <p className="text-sm text-gray-700 mb-3">
              &quot;If anyone needs a great lawyer, I highly recommend Chatman Legal. Over 40 years of experience and they really care about their clients. Free consultations here: {referralLink}&quot;
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`If anyone needs a great lawyer, I highly recommend Chatman Legal. Over 40 years of experience and they really care about their clients. Free consultations here: ${referralLink}`);
              }}
              className="text-[#c9a961] hover:text-black text-sm font-medium"
            >
              Copy Message
            </button>
          </div>
        </div>
      </div>

      {/* Why Share */}
      <div className="bg-[#c9a961]/10 border border-[#c9a961]/30 p-6">
        <h3 className="text-lg font-bold text-black mb-4">Why Share?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#c9a961] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold">1</span>
            </div>
            <div>
              <p className="font-semibold text-black">Help Those in Need</p>
              <p className="text-sm text-gray-600">Connect friends and family with trusted legal representation.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#c9a961] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold">2</span>
            </div>
            <div>
              <p className="font-semibold text-black">Free Consultations</p>
              <p className="text-sm text-gray-600">Everyone you refer gets a free initial consultation.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#c9a961] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold">3</span>
            </div>
            <div>
              <p className="font-semibold text-black">Track Your Impact</p>
              <p className="text-sm text-gray-600">See how many people you&apos;ve helped with your referrals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
