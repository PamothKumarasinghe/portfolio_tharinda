'use client';

// Admin CV Manager Page
// Upload, replace, delete CV files stored in MongoDB GridFS

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { FileText, Upload, Trash2, Download, ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface CVInfo {
  exists: boolean;
  cv: {
    filename: string;
    uploadedAt: string;
    size: number;
    fileId: string;
  } | null;
}

export default function CVManager() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [cvInfo, setCVInfo] = useState<CVInfo>({ exists: false, cv: null });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Check authentication
    const adminData = sessionStorage.getItem('admin');
    if (!adminData) {
      router.push('/admin/login');
    } else {
      setAdmin(JSON.parse(adminData));
      fetchCVStatus();
    }
  }, [router]);

  const fetchCVStatus = async () => {
    try {
      const res = await fetch('/api/cv/status');
      const data = await res.json();
      if (data.success) {
        setCVInfo(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch CV status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate PDF
      if (file.type !== 'application/pdf') {
        setMessage({ type: 'error', text: 'Only PDF files are allowed' });
        return;
      }
      setSelectedFile(file);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/cv/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'CV uploaded successfully!' });
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('cv-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        // Refresh status
        await fetchCVStatus();
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload CV' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the CV?')) {
      return;
    }

    setDeleting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/cv/delete', {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'CV deleted successfully!' });
        await fetchCVStatus();
      } else {
        setMessage({ type: 'error', text: data.error || 'Delete failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete CV' });
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <nav className="bg-gray-800/50 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-[#00b4d8]">CV Manager</h1>
          </div>
          <span className="text-sm text-gray-400">Welcome, {admin.username}</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Message Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : 'bg-red-500/20 border border-red-500/50 text-red-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}

        {/* CV Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#00b4d8]/20 p-3 rounded-lg">
              <FileText size={24} className="text-[#00b4d8]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Current CV Status</h2>
              <p className="text-gray-400 text-sm">
                {loading ? 'Loading...' : cvInfo.exists ? 'CV is uploaded' : 'No CV uploaded'}
              </p>
            </div>
          </div>

          {!loading && cvInfo.exists && cvInfo.cv && (
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Filename:</span>
                  <p className="font-medium">{cvInfo.cv.filename}</p>
                </div>
                <div>
                  <span className="text-gray-400">Size:</span>
                  <p className="font-medium">{formatFileSize(cvInfo.cv.size)}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400">Uploaded:</span>
                  <p className="font-medium">{formatDate(cvInfo.cv.uploadedAt)}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <a
                  href="/api/cv/download"
                  target="_blank"
                  className="flex items-center gap-2 bg-[#00b4d8]/20 hover:bg-[#00b4d8]/30 text-[#00b4d8] px-4 py-2 rounded-lg transition-colors"
                >
                  <Download size={18} />
                  Preview CV
                </a>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  {deleting ? 'Deleting...' : 'Delete CV'}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50"
        >
          <h2 className="text-2xl font-bold mb-4">
            {cvInfo.exists ? 'Replace CV' : 'Upload New CV'}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {cvInfo.exists
              ? 'Uploading a new CV will automatically replace the current one'
              : 'Upload a PDF file to use as your CV'}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select PDF File</label>
              <input
                id="cv-file-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#00b4d8]/20 file:text-[#00b4d8] hover:file:bg-[#00b4d8]/30 cursor-pointer"
              />
            </div>

            {selectedFile && (
              <div className="bg-gray-800/50 rounded-lg p-3 text-sm">
                <span className="text-gray-400">Selected: </span>
                <span className="font-medium">{selectedFile.name}</span>
                <span className="text-gray-400"> ({formatFileSize(selectedFile.size)})</span>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full flex items-center justify-center gap-2 bg-[#00b4d8] hover:bg-[#0096b8] text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#00b4d8]"
            >
              {uploading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  {cvInfo.exists ? 'Replace CV' : 'Upload CV'}
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Info Note */}
        <div className="mt-6 bg-[#00b4d8]/10 border border-[#00b4d8]/30 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            <strong>Note:</strong> CV files are stored securely in MongoDB GridFS. Only PDF files are accepted. 
            The download link on your portfolio will automatically use the uploaded CV.
          </p>
        </div>
      </div>
    </div>
  );
}
