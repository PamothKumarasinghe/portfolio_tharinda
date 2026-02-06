'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { FolderOpen, Briefcase, GraduationCap, Code, LogOut, Plus, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    // Check if admin is logged in
    const adminData = sessionStorage.getItem('admin');
    if (!adminData) {
      router.push('/admin/login');
    } else {
      setAdmin(JSON.parse(adminData));
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin');
    router.push('/admin/login');
  };

  if (!admin) return null;

  const sections = [
    { name: 'Projects', icon: FolderOpen, color: '#00b4d8', path: '/admin/projects' },
    { name: 'Experience', icon: Briefcase, color: '#90e0ef', path: '/admin/experience' },
    { name: 'Education', icon: GraduationCap, color: '#48cae4', path: '/admin/education' },
    { name: 'Skills', icon: Code, color: '#0096c7', path: '/admin/skills' },
    { name: 'CV Manager', icon: FileText, color: '#0077b6', path: '/admin/cv' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <nav className="bg-gray-800/50 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#00b4d8]">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Welcome, {admin.username}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-8">Manage Portfolio Content</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {sections.map((section, index) => (
              <motion.a
                key={section.name}
                href={section.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-[#00b4d8]/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-[#00b4d8]/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                    <section.icon size={24} style={{ color: section.color }} />
                  </div>
                  <Plus size={20} className="text-gray-500 group-hover:text-[#00b4d8] transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2">{section.name}</h3>
                <p className="text-sm text-gray-400">Manage {section.name.toLowerCase()}</p>
              </motion.a>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 border border-gray-700/30">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/"
                target="_blank"
                className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 p-4 rounded-lg transition-colors"
              >
                <span>View Live Portfolio</span>
                <span className="text-[#00b4d8]">→</span>
              </a>
              <a
                href="/projects"
                target="_blank"
                className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 p-4 rounded-lg transition-colors"
              >
                <span>View All Projects Page</span>
                <span className="text-[#00b4d8]">→</span>
              </a>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 bg-[#00b4d8]/10 border border-[#00b4d8]/30 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              <strong>Note:</strong> The admin panel pages for managing individual sections will be created next. 
              For now, you can use the API endpoints directly or I'll create the full CRUD interfaces for each section.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
