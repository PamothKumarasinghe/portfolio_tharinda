'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, ArrowLeft, Save, X, Building2, MapPin, Calendar } from 'lucide-react';
import { authenticatedFetch, isAuthenticated } from '@/lib/authClient';

interface Experience {
  _id?: string;
  title: string;
  company: string;
  description: string;
  date: string;
  location: string;
  current: boolean;
}

export default function AdminExperience() {
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Experience>({
    title: '',
    company: '',
    description: '',
    date: '',
    location: '',
    current: false,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchExperiences();
  }, [router]);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experiences');
      const data = await res.json();
      if (data.success) {
        setExperiences(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editingId ? 'PUT' : 'POST';
    const payload = editingId ? { ...formData, _id: editingId } : formData;

    try {
      const res = await authenticatedFetch('/api/experiences', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(editingId ? 'Experience updated!' : 'Experience created!');
        setShowForm(false);
        setEditingId(null);
        resetForm();
        fetchExperiences();
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience');
    }
  };

  const handleEdit = (experience: Experience) => {
    setFormData(experience);
    setEditingId(experience._id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const res = await authenticatedFetch(`/api/experiences?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        alert('Experience deleted!');
        fetchExperiences();
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Failed to delete experience');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      description: '',
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
            <h1 className="text-2xl font-bold text-[#00b4d8]">Manage Experience</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0096b8] px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Experience
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
              {editingId ? 'Edit Experience' : 'Add New Experience'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Embedded Systems Intern"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., Tech Innovations Ltd"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Describe your responsibilities and achievements..."
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
                    placeholder="e.g., Jun 2024 - Aug 2024"
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
                    placeholder="e.g., Colombo, Sri Lanka"
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
                <label htmlFor="current" className="text-sm">Currently working here</label>
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

        {/* Experience List */}
        <div className="space-y-6">
          {experiences.map((exp) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-[#00b4d8]/50 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                  <div className="flex items-center gap-2 text-[#00b4d8] mb-2">
                    <Building2 size={16} />
                    <span className="text-sm">{exp.company}</span>
                  </div>
                  {exp.current && (
                    <span className="inline-block bg-[#00b4d8]/20 text-[#00b4d8] text-xs px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-400 mb-4">{exp.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{exp.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{exp.location}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="flex items-center gap-1 bg-[#00b4d8]/20 hover:bg-[#00b4d8]/30 text-[#00b4d8] px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id!)}
                  className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No experience records yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#00b4d8] hover:bg-[#0096b8] px-6 py-3 rounded-lg transition-colors"
            >
              Add Your First Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
