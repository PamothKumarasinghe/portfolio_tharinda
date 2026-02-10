'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, ArrowLeft, Save, X, GraduationCap, MapPin, Calendar, Award } from 'lucide-react';
import { authenticatedFetch, isAuthenticated } from '@/lib/authClient';

interface Education {
  _id?: string;
  degree: string;
  field: string;
  institution: string;
  achievements: string;
  date: string;
  location: string;
  current: boolean;
}

export default function AdminEducation() {
  const router = useRouter();
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Education>({
    degree: '',
    field: '',
    institution: '',
    achievements: '',
    date: '',
    location: '',
    current: false,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchEducation();
  }, [router]);

  const fetchEducation = async () => {
    try {
      const res = await fetch('/api/education');
      const data = await res.json();
      if (data.success) {
        setEducation(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editingId ? 'PUT' : 'POST';
    const payload = editingId ? { ...formData, _id: editingId } : formData;

    try {
      const res = await authenticatedFetch('/api/education', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(editingId ? 'Education updated!' : 'Education created!');
        setShowForm(false);
        setEditingId(null);
        resetForm();
        fetchEducation();
      }
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Failed to save education');
    }
  };

  const handleEdit = (edu: Education) => {
    setFormData(edu);
    setEditingId(edu._id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;

    try {
      const res = await authenticatedFetch(`/api/education?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        alert('Education deleted!');
        fetchEducation();
      }
    } catch (error) {
      console.error('Error deleting education:', error);
      alert('Failed to delete education');
    }
  };

  const resetForm = () => {
    setFormData({
      degree: '',
      field: '',
      institution: '',
      achievements: '',
      date: '',
      location: '',
      current: false,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00b4d8]/30 border-t-[#00b4d8] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <nav className="bg-gray-800/50 border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-[#00b4d8]">Manage Education</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0096b8] px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Education
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-xl font-bold mb-6">
              {editingId ? 'Edit Education' : 'Add New Education'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Degree *</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g., Bachelor of Science in Engineering"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Field of Study *</label>
                <input
                  type="text"
                  value={formData.field}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                  placeholder="e.g., Electronic & Telecommunication Engineering"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Institution *</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g., University of Moratuwa"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Achievements *</label>
                <textarea
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  rows={3}
                  placeholder="e.g., Dean's List 2022, 2023 • Member of IEEE Student Branch"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Date *</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g., 2021 - Present"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Moratuwa, Sri Lanka"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="current" className="text-sm">Currently studying here</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0096b8] px-6 py-3 rounded-lg transition-colors"
                >
                  <Save size={20} />
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
                >
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Education List */}
        <div className="space-y-6">
          {education.map((edu) => (
            <motion.div
              key={edu._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-[#00b4d8]/50 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
                  <div className="text-[#00b4d8] mb-2">{edu.field}</div>
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <GraduationCap size={16} />
                    <span className="text-sm">{edu.institution}</span>
                  </div>
                  {edu.current && (
                    <span className="inline-block bg-[#00b4d8]/20 text-[#00b4d8] text-xs px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-2 text-gray-400 mb-4">
                <Award size={16} className="mt-1 flex-shrink-0" />
                <p className="text-sm">{edu.achievements}</p>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{edu.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{edu.location}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(edu)}
                  className="flex items-center gap-1 bg-[#00b4d8]/20 hover:bg-[#00b4d8]/30 text-[#00b4d8] px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(edu._id!)}
                  className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {education.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No education records yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#00b4d8] hover:bg-[#0096b8] px-6 py-3 rounded-lg transition-colors"
            >
              Add Your First Education
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
