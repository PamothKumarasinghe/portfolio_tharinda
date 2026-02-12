'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Code, Cpu, Wrench, Database } from 'lucide-react';
import { SkillCategory as SkillCategoryType, Skill } from '@/lib/types';
import Link from 'next/link';

export default function SkillsPage() {
  const [skillCategories, setSkillCategories] = useState<SkillCategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

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

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      'Code': Code,
      'Cpu': Cpu,
      'Wrench': Wrench,
      'Database': Database,
    };
    const IconComponent = icons[iconName] || Code;
    return <IconComponent size={24} className="text-[#00b4d8]" />;
  };

  return (
    <div className="bg-[#0a0e1a] text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-sm border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <div className="text-2xl font-bold text-[#00b4d8]">All Skills</div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4">
              My <span className="text-[#00b4d8]">Skills</span>
            </h1>
            <div className="w-24 h-1 bg-[#00b4d8] mx-auto mb-12"></div>
            <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
              A comprehensive overview of my technical skills and expertise across various domains.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#00b4d8]/30 border-t-[#00b4d8] rounded-full animate-spin"></div>
            </div>
          ) : skillCategories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No skills found. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {skillCategories.map((category, index) => (
                <SkillCategoryCard
                  key={category._id}
                  category={category}
                  icon={getIconComponent(category.icon)}
                  delay={index * 0.1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillCategoryCard({ 
  category, 
  icon, 
  delay 
}: { 
  category: SkillCategoryType; 
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 sm:p-8 border border-gray-700/30 hover:border-[#00b4d8]/30 transition-all"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#00b4d8]/20 p-3 rounded-lg">
          {icon}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold">{category.title}</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill, index) => (
          <span 
            key={index}
            className="bg-[#00b4d8]/10 text-gray-300 px-4 py-2 rounded-lg text-sm sm:text-base border border-[#00b4d8]/30 hover:bg-[#00b4d8]/20 transition-colors"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
