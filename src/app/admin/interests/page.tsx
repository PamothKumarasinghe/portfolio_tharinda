'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, ArrowLeft, Save, X, Code, Cpu, Wrench, Database, Award, User } from 'lucide-react';
import { authenticatedFetch, isAuthenticated } from '@/lib/authClient';

interface Interest {
  _id?: string;
  title: string;
  icon: string;
  description: string;
  order: number;
}

const iconOptions = [
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Cpu', label: 'Cpu', icon: Cpu },
  { value: 'Wrench', label: 'Wrench', icon: Wrench },
  { value: 'Database', label: 'Database', icon: Database },
  { value: 'Award', label: 'Award', icon: Award },
  { value: 'User', label: 'User', icon: User },
];

export default function AdminInterests() {
  const router = useRouter();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Interest>({
    title: '',
    icon: 'Cpu',
    description: '',
    order: 1,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchInterests();
  }, [router]);

  const fetchInterests = async () => {
    try {
      const res = await fetch('/api/interests');
      const data = await res.json();
      if (data.success) {
        setInterests(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch interests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editingId ? 'PUT' : 'POST';
    const payload = editingId ? { ...formData, _id: editingId } : formData;

    try {
      const res = await authenticatedFetch('/api/interests', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(editingId ? 'Interest updated!' : 'Interest created!');
        setShowForm(false);
        setEditingId(null);
        resetForm();
        fetchInterests();
      }
    } catch (error) {
      console.error('Error saving interest:', error);
      alert('Failed to save interest');
    }
  };

  const handleEdit = (interest: Interest) => {
    setFormData(interest);
    setEditingId(interest._id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interest?')) return;

    try {
      const res = await authenticatedFetch(`/api/interests?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        alert('Interest deleted!');
        fetchInterests();
      }
    } catch (error) {
      console.error('Error deleting interest:', error);
      alert('Failed to delete interest');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      icon: 'Cpu',
      description: '',
      order: 1,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const getIcon = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Cpu;
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
            <h1 className="text-2xl font-bold text-[#00b4d8]">Manage Interests</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0096b8] px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Interest
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-xl font-bold mb-6">
              {editingId ? 'Edit Interest' : 'Add New Interest'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Interest Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Digital Design"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Icon *</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8]"
                  >
                    {iconOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this interest area..."
                  rows={3}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8] resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Order</label>
                <input
                  type="number"
                  min="1"
                  value={formData.order || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const numValue = value === '' ? 1 : parseInt(value);
                    setFormData({ ...formData, order: isNaN(numValue) ? 1 : numValue });
                  }}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8]"
                />
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

        {/* Interests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interests.map((interest, index) => {
            const IconComponent = getIcon(interest.icon);
            return (
              <motion.div
                key={interest._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-[#00b4d8]/50 transition-all"
              >
                <div className="bg-[#00b4d8]/20 p-4 rounded-lg w-fit mb-4">
                  <IconComponent size={32} className="text-[#00b4d8]" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{interest.title}</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  {interest.description}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(interest)}
                    className="flex-1 flex items-center justify-center gap-1 bg-[#00b4d8]/20 hover:bg-[#00b4d8]/30 text-[#00b4d8] px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(interest._id!)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {interests.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No interests yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#00b4d8] hover:bg-[#0096b8] px-6 py-3 rounded-lg transition-colors"
            >
              Add Your First Interest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
