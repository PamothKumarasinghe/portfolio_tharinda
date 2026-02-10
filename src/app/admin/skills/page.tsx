'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, ArrowLeft, Save, X, Code, Cpu, Wrench, Database } from 'lucide-react';
import { authenticatedFetch, isAuthenticated } from '@/lib/authClient';

interface Skill {
  name: string;
  percentage: number;
}

interface SkillCategory {
  _id?: string;
  title: string;
  icon: string;
  skills: Skill[];
  order: number;
}

const iconOptions = [
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Cpu', label: 'Cpu', icon: Cpu },
  { value: 'Wrench', label: 'Wrench', icon: Wrench },
  { value: 'Database', label: 'Database', icon: Database },
];

export default function AdminSkills() {
  const router = useRouter();
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SkillCategory>({
    title: '',
    icon: 'Code',
    skills: [],
    order: 1,
  });
  const [skillInput, setSkillInput] = useState({ name: '', percentage: 50 });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchSkills();
  }, [router]);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      if (data.success) {
        setSkillCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editingId ? 'PUT' : 'POST';
    const payload = editingId ? { ...formData, _id: editingId } : formData;

    try {
      const res = await authenticatedFetch('/api/skills', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(editingId ? 'Skill category updated!' : 'Skill category created!');
        setShowForm(false);
        setEditingId(null);
        resetForm();
        fetchSkills();
      }
    } catch (error) {
      console.error('Error saving skill category:', error);
      alert('Failed to save skill category');
    }
  };

  const handleEdit = (category: SkillCategory) => {
    setFormData(category);
    setEditingId(category._id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill category?')) return;

    try {
      const res = await authenticatedFetch(`/api/skills?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        alert('Skill category deleted!');
        fetchSkills();
      }
    } catch (error) {
      console.error('Error deleting skill category:', error);
      alert('Failed to delete skill category');
    }
  };

  const addSkill = () => {
    if (!skillInput.name.trim()) return;
    setFormData({
      ...formData,
      skills: [...formData.skills, { ...skillInput }],
    });
    setSkillInput({ name: '', percentage: 50 });
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      icon: 'Code',
      skills: [],
      order: 1,
    });
    setSkillInput({ name: '', percentage: 50 });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const getIcon = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Code;
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
            <h1 className="text-2xl font-bold text-[#00b4d8]">Manage Skills</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0096b8] px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Category
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
              {editingId ? 'Edit Skill Category' : 'Add New Skill Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Category Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Programming"
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

              {/* Skills List */}
              <div>
                <label className="block text-sm mb-2">Skills</label>
                <div className="space-y-2 mb-3">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-700/30 p-3 rounded-lg">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{skill.name}</span>
                          <span className="text-sm text-gray-400">{skill.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-600/50 rounded-full h-2">
                          <div
                            className="bg-[#00b4d8] h-2 rounded-full"
                            style={{ width: `${skill.percentage}%` }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Skill Input */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={skillInput.name}
                      onChange={(e) => setSkillInput({ ...skillInput, name: e.target.value })}
                      placeholder="Skill name (e.g., Python)"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00b4d8]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={skillInput.percentage || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value === '' ? 0 : parseInt(value);
                        setSkillInput({ ...skillInput, percentage: isNaN(numValue) ? 0 : numValue });
                      }}
                      placeholder="%"
                      className="w-20 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00b4d8]"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0096b8] px-6 py-3 rounded-lg transition-colors"
                  disabled={formData.skills.length === 0}
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

        {/* Skill Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category) => {
            const IconComponent = getIcon(category.icon);
            return (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 hover:border-[#00b4d8]/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#00b4d8]/20 p-3 rounded-lg">
                    <IconComponent size={24} className="text-[#00b4d8]" />
                  </div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>

                <div className="space-y-4 mb-6">
                  {category.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-300">{skill.name}</span>
                        <span className="text-sm text-gray-400">{skill.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700/30 rounded-full h-2">
                        <div
                          className="bg-[#00b4d8] h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 flex items-center justify-center gap-1 bg-[#00b4d8]/20 hover:bg-[#00b4d8]/30 text-[#00b4d8] px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id!)}
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

        {skillCategories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No skill categories yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#00b4d8] hover:bg-[#0096b8] px-6 py-3 rounded-lg transition-colors"
            >
              Add Your First Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
