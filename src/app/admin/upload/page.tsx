'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Plus,
  X,
  Eye,
  Send,
  UserPlus,
} from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';

interface Contact {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  practice_area: string;
  notes: string;
  status: 'new' | 'contacted' | 'converted' | 'archived';
}

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

const practiceAreas = [
  'Corporate Law',
  'Litigation',
  'Criminal Defense',
  'Employment Law',
  'Intellectual Property',
  'Real Estate',
  'Personal Injury',
  'Family Law',
  'Other',
];

export default function AdminUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [previewData, setPreviewData] = useState<Contact[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualContact, setManualContact] = useState<Contact>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    practice_area: '',
    notes: '',
    status: 'new',
  });
  const [recentUploads, setRecentUploads] = useState<{
    filename: string;
    count: number;
    date: string;
  }[]>([
    { filename: 'leads_january.csv', count: 45, date: '2024-01-15' },
    { filename: 'referral_contacts.csv', count: 23, date: '2024-01-10' },
    { filename: 'networking_event.csv', count: 18, date: '2024-01-05' },
  ]);

  const parseCSV = (text: string): Contact[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
    const contacts: Contact[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const contact: Contact = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        practice_area: '',
        notes: '',
        status: 'new',
      };

      headers.forEach((header, index) => {
        const value = values[index] || '';
        if (header.includes('first') && header.includes('name')) contact.first_name = value;
        else if (header.includes('last') && header.includes('name')) contact.last_name = value;
        else if (header === 'name' || header === 'full_name' || header === 'fullname') {
          const parts = value.split(' ');
          contact.first_name = parts[0] || '';
          contact.last_name = parts.slice(1).join(' ') || '';
        }
        else if (header.includes('email')) contact.email = value;
        else if (header.includes('phone') || header.includes('tel')) contact.phone = value;
        else if (header.includes('area') || header.includes('practice') || header.includes('type')) contact.practice_area = value;
        else if (header.includes('note') || header.includes('message') || header.includes('comment')) contact.notes = value;
      });

      if (contact.email || (contact.first_name && contact.phone)) {
        contacts.push(contact);
      }
    }

    return contacts;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadResult({
        success: 0,
        failed: 0,
        errors: ['Please upload a CSV file'],
      });
      return;
    }

    const text = await file.text();
    const contacts = parseCSV(text);

    if (contacts.length === 0) {
      setUploadResult({
        success: 0,
        failed: 0,
        errors: ['No valid contacts found in the CSV file'],
      });
      return;
    }

    setPreviewData(contacts);
    setShowPreview(true);
    setUploadResult(null);
  };

  const handleUploadConfirm = async () => {
    setUploading(true);
    const supabase = createClientComponentClient();

    if (!supabase) {
      setUploadResult({
        success: 0,
        failed: previewData.length,
        errors: ['Database connection not available'],
      });
      setUploading(false);
      return;
    }

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const contact of previewData) {
      try {
        const { error } = await supabase.from('lawyer_contact_submissions').insert({
          first_name: contact.first_name,
          last_name: contact.last_name,
          email: contact.email,
          phone: contact.phone,
          practice_area: contact.practice_area || 'other',
          message: contact.notes,
          status: 'new',
        });

        if (error) {
          failed++;
          errors.push(`${contact.email || contact.first_name}: ${error.message}`);
        } else {
          success++;
        }
      } catch (err) {
        failed++;
        errors.push(`${contact.email || contact.first_name}: Unknown error`);
      }
    }

    setUploadResult({ success, failed, errors: errors.slice(0, 5) });
    setShowPreview(false);
    setPreviewData([]);
    setUploading(false);

    // Add to recent uploads
    setRecentUploads(prev => [
      { filename: `upload_${new Date().toISOString().split('T')[0]}.csv`, count: success, date: new Date().toISOString().split('T')[0] },
      ...prev.slice(0, 4),
    ]);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const supabase = createClientComponentClient();
    if (!supabase) {
      setUploadResult({
        success: 0,
        failed: 1,
        errors: ['Database connection not available'],
      });
      setUploading(false);
      return;
    }

    const { error } = await supabase.from('lawyer_contact_submissions').insert({
      first_name: manualContact.first_name,
      last_name: manualContact.last_name,
      email: manualContact.email,
      phone: manualContact.phone,
      practice_area: manualContact.practice_area || 'other',
      message: manualContact.notes,
      status: 'new',
    });

    if (error) {
      setUploadResult({
        success: 0,
        failed: 1,
        errors: [error.message],
      });
    } else {
      setUploadResult({
        success: 1,
        failed: 0,
        errors: [],
      });
      setManualContact({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        practice_area: '',
        notes: '',
        status: 'new',
      });
      setShowManualForm(false);
    }

    setUploading(false);
  };

  const downloadTemplate = () => {
    const template = 'first_name,last_name,email,phone,practice_area,notes\nJohn,Doe,john@example.com,555-123-4567,Personal Injury,Referral from Jane Smith\nJane,Smith,jane@example.com,555-987-6543,Family Law,Networking event contact';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Upload Contacts</h1>
          <p className="text-gray-600">Import leads and contacts in bulk or add them manually</p>
        </div>
        <button
          onClick={() => setShowManualForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#c9a961] text-black font-semibold hover:bg-black hover:text-white transition-colors"
        >
          <UserPlus size={18} />
          Add Contact
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">
                {recentUploads.reduce((sum, u) => sum + u.count, 0)}
              </p>
              <p className="text-sm text-gray-500">Total Uploaded</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 flex items-center justify-center">
              <FileSpreadsheet size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">{recentUploads.length}</p>
              <p className="text-sm text-gray-500">Files Processed</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 flex items-center justify-center">
              <Send size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-black">Ready</p>
              <p className="text-sm text-gray-500">For Outreach</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Result Message */}
      {uploadResult && (
        <div className={`p-4 border ${
          uploadResult.failed === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start gap-3">
            {uploadResult.failed === 0 ? (
              <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-black">
                {uploadResult.success > 0 && `${uploadResult.success} contacts uploaded successfully`}
                {uploadResult.success > 0 && uploadResult.failed > 0 && '. '}
                {uploadResult.failed > 0 && `${uploadResult.failed} failed`}
              </p>
              {uploadResult.errors.length > 0 && (
                <ul className="mt-2 text-sm text-gray-600">
                  {uploadResult.errors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={() => setUploadResult(null)}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Upload size={20} className="text-[#c9a961]" />
            <h2 className="text-lg font-bold text-black">Upload CSV File</h2>
          </div>

          {/* Drag & Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-[#c9a961] bg-[#c9a961]/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileSpreadsheet size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-700 font-medium mb-2">
              Drag and drop your CSV file here
            </p>
            <p className="text-gray-500 text-sm mb-4">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-black text-white font-medium hover:bg-[#c9a961] hover:text-black transition-colors"
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-400 mt-4">
              Supports: CSV files with columns for name, email, phone, practice area
            </p>
          </div>

          {/* Download Template */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-black">Need a template?</p>
                <p className="text-sm text-gray-500">Download our CSV template to get started</p>
              </div>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 hover:border-[#c9a961] hover:text-[#c9a961] transition-colors"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-black">Recent Uploads</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUploads.map((upload, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
                    <FileSpreadsheet size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-black">{upload.filename}</p>
                    <p className="text-xs text-gray-500">{upload.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-black">{upload.count}</p>
                  <p className="text-xs text-gray-500">contacts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSV Format Guide */}
      <div className="bg-gray-50 border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-black mb-4">CSV Format Guide</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="font-medium text-black mb-2">Required Columns</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-500" />
                <code className="bg-gray-200 px-2 py-0.5 rounded">email</code> - Contact email address
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-500" />
                <code className="bg-gray-200 px-2 py-0.5 rounded">first_name</code> - First name
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-500" />
                <code className="bg-gray-200 px-2 py-0.5 rounded">last_name</code> - Last name
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-black mb-2">Optional Columns</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-gray-300 rounded-full flex-shrink-0" />
                <code className="bg-gray-200 px-2 py-0.5 rounded">phone</code> - Phone number
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-gray-300 rounded-full flex-shrink-0" />
                <code className="bg-gray-200 px-2 py-0.5 rounded">practice_area</code> - Legal specialty
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-gray-300 rounded-full flex-shrink-0" />
                <code className="bg-gray-200 px-2 py-0.5 rounded">notes</code> - Additional notes
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-black">Preview Import</h2>
                <p className="text-sm text-gray-500">{previewData.length} contacts ready to import</p>
              </div>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setPreviewData([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Practice Area</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {previewData.slice(0, 50).map((contact, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-black">
                        {contact.first_name} {contact.last_name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                      <td className="px-4 py-3 text-gray-600">{contact.phone || '-'}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{contact.practice_area || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 50 && (
                <p className="p-4 text-center text-gray-500 text-sm">
                  Showing first 50 of {previewData.length} contacts
                </p>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowPreview(false);
                  setPreviewData([]);
                }}
                className="px-6 py-2 border border-gray-200 text-gray-700 font-medium hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadConfirm}
                disabled={uploading}
                className="px-6 py-2 bg-[#c9a961] text-black font-semibold hover:bg-black hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Import {previewData.length} Contacts
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Modal */}
      {showManualForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-black">Add Contact Manually</h2>
              <button
                onClick={() => setShowManualForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={manualContact.first_name}
                    onChange={(e) => setManualContact({ ...manualContact, first_name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={manualContact.last_name}
                    onChange={(e) => setManualContact({ ...manualContact, last_name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={manualContact.email}
                  onChange={(e) => setManualContact({ ...manualContact, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={manualContact.phone}
                  onChange={(e) => setManualContact({ ...manualContact, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Practice Area</label>
                <select
                  value={manualContact.practice_area}
                  onChange={(e) => setManualContact({ ...manualContact, practice_area: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 focus:border-[#c9a961] focus:outline-none"
                >
                  <option value="">Select practice area</option>
                  {practiceAreas.map((area) => (
                    <option key={area} value={area.toLowerCase()}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={manualContact.notes}
                  onChange={(e) => setManualContact({ ...manualContact, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 focus:border-[#c9a961] focus:outline-none resize-none"
                  placeholder="Referral source, how you met, etc."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className="px-6 py-2 border border-gray-200 text-gray-700 font-medium hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-[#c9a961] text-black font-semibold hover:bg-black hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Contact
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
