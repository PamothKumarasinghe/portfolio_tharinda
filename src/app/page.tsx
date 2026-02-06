'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'motion/react';
import { Download, Linkedin, Mail, MapPin, Code, Cpu, Wrench, Database, Github, ExternalLink, Calendar, Building2, GraduationCap, Award, Send, User, Menu, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Project as ProjectType } from '@/lib/types';

export default function Page() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    // Fetch recent 4 projects from API
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects?limit=4');
        const data = await res.json();
        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Message sent! (Demo)');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="bg-[#0a0e1a] text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-[#00b4d8]"
          >
            TA
          </motion.div>
          
          {/* Desktop Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex gap-6 lg:gap-8"
          >
            <button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors">About</button>
            <button onClick={() => scrollToSection('skills')} className="text-gray-400 hover:text-white transition-colors">Skills</button>
            <button onClick={() => scrollToSection('projects')} className="text-gray-400 hover:text-white transition-colors">Projects</button>
            <button onClick={() => scrollToSection('experience')} className="text-gray-400 hover:text-white transition-colors">Experience</button>
            <button onClick={() => scrollToSection('education')} className="text-gray-400 hover:text-white transition-colors">Education</button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors">Contact</button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#0a0e1a] border-t border-gray-800/50"
          >
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('about')} className="block w-full text-left text-gray-400 hover:text-white transition-colors py-2">About</button>
              <button onClick={() => scrollToSection('skills')} className="block w-full text-left text-gray-400 hover:text-white transition-colors py-2">Skills</button>
              <button onClick={() => scrollToSection('projects')} className="block w-full text-left text-gray-400 hover:text-white transition-colors py-2">Projects</button>
              <button onClick={() => scrollToSection('experience')} className="block w-full text-left text-gray-400 hover:text-white transition-colors py-2">Experience</button>
              <button onClick={() => scrollToSection('education')} className="block w-full text-left text-gray-400 hover:text-white transition-colors py-2">Education</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-gray-400 hover:text-white transition-colors py-2">Contact</button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section with Vignette */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 relative overflow-hidden">
        {/* Vignette Gradient Background */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at center, #1a3a52 0%, #0f2738 15%, #0a0e1a 40%)'
        }}></div>
        
        <div className="text-center max-w-4xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#00b4d8] text-xs sm:text-sm tracking-widest mb-4 sm:mb-6 uppercase"
          >
            Hello, I'm
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 px-4"
          >
            Tharinda <span className="text-[#00b4d8]">Abeywardana</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 mb-2 sm:mb-4 px-4"
          >
            Electronic & Telecommunication Engineering Undergraduate
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-sm sm:text-base md:text-lg text-gray-400 mb-6 sm:mb-8 px-4"
          >
            University of Moratuwa
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
          >
            <a 
              href="/api/cv/download"
              target="_blank"
              className="bg-[#00b4d8] hover:bg-[#0096b8] text-white px-6 sm:px-8 py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Download size={20} />
              Download CV
            </a>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 sm:px-8 py-3 rounded-md flex items-center justify-center gap-2 transition-colors">
              <Linkedin size={20} />
              LinkedIn
            </button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <AnimatedSection id="about">
        <div className="max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">
              About <span className="text-[#00b4d8]">Me</span>
            </h2>
            <div className="w-24 h-1 bg-[#00b4d8] mx-auto mb-12 sm:mb-16"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 sm:p-12 flex items-center justify-center border border-gray-700/50 overflow-hidden"
            >
              <div className="relative w-full aspect-square max-w-[300px]">
                <Image
                  src="/profilePic.jpeg"
                  alt="Tharinda Abeywardana"
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Electronic & Telecommunication Engineer</h3>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                I am a passionate Electronic and Telecommunication Engineering undergraduate at the University of Moratuwa, Sri Lanka. With a keen interest in embedded systems, signal processing, and innovative technology solutions, I strive to bridge the gap between theoretical knowledge and practical applications.
              </p>
              <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                My academic journey has equipped me with strong analytical and problem-solving skills, and I am constantly exploring new technologies to expand my expertise. I believe in continuous learning and am always eager to take on challenging projects that push my boundaries.
              </p>
              
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center gap-3 text-sm sm:text-base text-gray-400">
                  <MapPin size={20} className="text-[#00b4d8] flex-shrink-0" />
                  <span>Moratuwa, Sri Lanka</span>
                </div>
                <div className="flex items-center gap-3 text-sm sm:text-base text-gray-400">
                  <Mail size={20} className="text-[#00b4d8] flex-shrink-0" />
                  <span className="break-all">tharinda@example.com</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Skills Section */}
      <AnimatedSection id="skills">
        <div className="max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">
              My <span className="text-[#00b4d8]">Skills</span>
            </h2>
            <div className="w-24 h-1 bg-[#00b4d8] mx-auto mb-12 sm:mb-16"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Programming */}
            <SkillCategory
              icon={<Code size={24} className="text-[#00b4d8]" />}
              title="Programming"
              skills={[
                { name: 'Python', percentage: 85 },
                { name: 'C/C++', percentage: 80 },
                { name: 'JavaScript', percentage: 75 },
                { name: 'MATLAB', percentage: 70 }
              ]}
              delay={0.2}
            />

            {/* Hardware */}
            <SkillCategory
              icon={<Cpu size={24} className="text-[#00b4d8]" />}
              title="Hardware"
              skills={[
                { name: 'Arduino', percentage: 90 },
                { name: 'Raspberry Pi', percentage: 85 },
                { name: 'FPGA', percentage: 70 },
                { name: 'PCB Design', percentage: 75 }
              ]}
              delay={0.3}
            />

            {/* Tools */}
            <SkillCategory
              icon={<Wrench size={24} className="text-[#00b4d8]" />}
              title="Tools"
              skills={[
                { name: 'Git', percentage: 80 },
                { name: 'Linux', percentage: 75 },
                { name: 'VS Code', percentage: 85 },
                { name: 'Docker', percentage: 65 }
              ]}
              delay={0.4}
            />

            {/* Technologies */}
            <SkillCategory
              icon={<Database size={24} className="text-[#00b4d8]" />}
              title="Technologies"
              skills={[
                { name: 'IoT', percentage: 85 },
                { name: 'Signal Processing', percentage: 80 },
                { name: 'Machine Learning', percentage: 70 },
                { name: 'Embedded Systems', percentage: 90 }
              ]}
              delay={0.5}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Projects Section */}
      <AnimatedSection id="projects">
        <div className="max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">
              My <span className="text-[#00b4d8]">Projects</span>
            </h2>
            <div className="w-24 h-1 bg-[#00b4d8] mx-auto mb-12 sm:mb-16"></div>
          </motion.div>
          
          {loadingProjects ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#00b4d8]/30 border-t-[#00b4d8] rounded-full animate-spin"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No projects available yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project._id}
                    title={project.title}
                    description={project.description}
                    tags={project.tags}
                    image={project.image}
                    githubUrl={project.githubUrl}
                    liveUrl={project.liveUrl}
                    featured={project.featured}
                    delay={0.2 + index * 0.1}
                  />
                ))}
              </div>
              
              {/* View More Projects Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0096b8] text-white px-8 py-3 rounded-lg transition-colors group"
                >
                  <span>View All Projects</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </AnimatedSection>

      {/* Experience Section */}
      <AnimatedSection id="experience">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">
              Work <span className="text-[#00b4d8]">Experience</span>
            </h2>
            <div className="w-24 h-1 bg-[#00b4d8] mx-auto mb-12 sm:mb-16"></div>
          </motion.div>
          
          <div className="relative pl-6 sm:pl-8 border-l-2 border-gray-700">
            <TimelineItem
              title="Embedded Systems Intern"
              company="Tech Innovations Ltd"
              description="Worked on developing firmware for IoT devices, participated in PCB design reviews, and assisted in testing embedded systems."
              date="Jun 2024 - Aug 2024"
              location="Colombo, Sri Lanka"
              current={false}
              delay={0.2}
            />
            
            <TimelineItem
              title="Research Assistant"
              company="University Research Lab"
              description="Conducting research on wireless communication systems, implementing signal processing algorithms, and publishing research papers."
              date="Jan 2024 - Present"
              location="Moratuwa, Sri Lanka"
              current={true}
              delay={0.4}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Education Section */}
      <AnimatedSection id="education">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="text-[#00b4d8]">Education</span>
            </h2>
            <div className="w-24 h-1 bg-[#00b4d8] mx-auto mb-12 sm:mb-16"></div>
          </motion.div>
          
          <div className="relative pl-6 sm:pl-8 border-l-2 border-gray-700">
            <EducationItem
              degree="Bachelor of Science in Engineering"
              field="Electronic & Telecommunication Engineering"
              institution="University of Moratuwa"
              achievements="Dean's List 2022, 2023 • Member of IEEE Student Branch • Active participant in robotics competitions"
              date="2021 - Present"
              location="Moratuwa, Sri Lanka"
              current={true}
              delay={0.2}
            />
            
            <EducationItem
              degree="G.C.E. Advanced Level"
              field="Physical Science Stream"
              institution="Royal College"
              achievements="District Rank: Top 50 • Science Olympiad Medalist • School Colors for Science"
              date="2018 - 2020"
              location="Colombo, Sri Lanka"
              current={false}
              delay={0.4}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection id="contact">
        <div className="max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">
              Get In <span className="text-[#00b4d8]">Touch</span>
            </h2>
            <div className="w-24 h-1 bg-[#00b4d8] mx-auto mb-12 sm:mb-16"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Let's Connect</h3>
              <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                Have a project in mind or want to discuss potential opportunities? Feel free to reach out. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-[#00b4d8]/20 p-3 rounded-lg flex-shrink-0">
                    <Mail size={24} className="text-[#00b4d8]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Email</div>
                    <div className="text-base sm:text-lg break-all">tharinda@example.com</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-[#00b4d8]/20 p-3 rounded-lg flex-shrink-0">
                    <MapPin size={24} className="text-[#00b4d8]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Location</div>
                    <div className="text-base sm:text-lg">Moratuwa, Sri Lanka</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-[#00b4d8]/20 p-3 rounded-lg flex-shrink-0">
                    <Linkedin size={24} className="text-[#00b4d8]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">LinkedIn</div>
                    <div className="text-base sm:text-lg">Connect with me</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8] transition-colors text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8] transition-colors text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8] transition-colors text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    rows={5}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00b4d8] transition-colors resize-none text-sm sm:text-base"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#00b4d8] hover:bg-[#0096b8] text-white px-6 sm:px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

// Animated Section Wrapper
function AnimatedSection({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
      {children}
    </section>
  );
}

// Skill Category Component with Animation
function SkillCategory({ 
  icon, 
  title, 
  skills, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  skills: { name: string; percentage: number }[]; 
  delay: number;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 sm:p-8 border border-gray-700/30"
    >
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="bg-[#00b4d8]/20 p-3 rounded-lg">
          {icon}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
      </div>
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <SkillBar key={skill.name} name={skill.name} percentage={skill.percentage} delay={delay + index * 0.1} />
        ))}
      </div>
    </motion.div>
  );
}

// Animated Skill Bar Component
function SkillBar({ name, percentage, delay }: { name: string; percentage: number; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        setWidth(percentage);
      }, delay * 1000);
    }
  }, [isInView, percentage, delay]);

  return (
    <div ref={ref}>
      <div className="flex justify-between mb-2">
        <span className="text-sm sm:text-base text-gray-300">{name}</span>
        <span className="text-sm sm:text-base text-gray-400">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${width}%` : 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-[#00b4d8] h-2 rounded-full"
        />
      </div>
    </div>
  );
}

// Project Card Component with Animation
function ProjectCard({ 
  title, 
  description, 
  tags, 
  image,
  githubUrl,
  liveUrl,
  featured,
  delay 
}: { 
  title: string; 
  description: string; 
  tags: string[]; 
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  delay: number;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl overflow-hidden border border-gray-700/30 hover:border-[#00b4d8]/50 transition-all group"
    >
      {/* Project Image */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gray-800/50">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg text-gray-400 hover:text-[#00b4d8] transition-colors"
            >
              <Github size={18} className="sm:w-5 sm:h-5" />
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg text-gray-400 hover:text-[#00b4d8] transition-colors"
            >
              <ExternalLink size={18} className="sm:w-5 sm:h-5" />
            </a>
          )}
        </div>
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute bottom-4 left-4">
            <span className="text-xs text-[#00b4d8] bg-[#00b4d8]/20 backdrop-blur-sm px-3 py-1 rounded-full border border-[#00b4d8]/30">Featured</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-bold mb-3">{title}</h3>
        
        <p className="text-sm sm:text-base text-gray-400 mb-4 leading-relaxed">{description}</p>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs text-gray-400 bg-gray-800 px-2 sm:px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Timeline Item Component with Animation
function TimelineItem({ 
  title, 
  company, 
  description, 
  date, 
  location, 
  current,
  delay 
}: { 
  title: string; 
  company: string; 
  description: string; 
  date: string; 
  location: string; 
  current: boolean;
  delay: number;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="relative mb-8 sm:mb-12 pb-8 sm:pb-12"
    >
      <div className="absolute -left-[25px] sm:-left-[37px] top-0 w-3 h-3 sm:w-4 sm:h-4 bg-[#00b4d8] rounded-full border-2 sm:border-4 border-[#0a0e1a]"></div>
      
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 sm:p-8 border border-gray-700/30">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">{title}</h3>
            <div className="flex items-center gap-2 text-[#00b4d8] mb-3">
              <Building2 size={18} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">{company}</span>
            </div>
          </div>
          {current && (
            <span className="text-xs text-[#00b4d8] bg-[#00b4d8]/20 px-3 py-1 rounded self-start">Current</span>
          )}
        </div>
        
        <p className="text-sm sm:text-base text-gray-400 mb-4 leading-relaxed">{description}</p>
        
        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="flex-shrink-0" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Education Item Component with Animation
function EducationItem({ 
  degree, 
  field, 
  institution, 
  achievements, 
  date, 
  location, 
  current,
  delay 
}: { 
  degree: string; 
  field: string; 
  institution: string; 
  achievements: string; 
  date: string; 
  location: string; 
  current: boolean;
  delay: number;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="relative mb-8 sm:mb-12 pb-8 sm:pb-12"
    >
      <div className="absolute -left-[25px] sm:-left-[37px] top-0 w-3 h-3 sm:w-4 sm:h-4 bg-[#00b4d8] rounded-full border-2 sm:border-4 border-[#0a0e1a]"></div>
      
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 sm:p-8 border border-gray-700/30">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">{degree}</h3>
            <div className="text-[#00b4d8] mb-2 text-sm sm:text-base">{field}</div>
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              <GraduationCap size={18} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">{institution}</span>
            </div>
          </div>
          {current && (
            <span className="text-xs text-[#00b4d8] bg-[#00b4d8]/20 px-3 py-1 rounded self-start">Current</span>
          )}
        </div>
        
        <div className="flex items-start gap-2 text-sm sm:text-base text-gray-400 mb-4">
          <Award size={18} className="mt-1 flex-shrink-0" />
          <p className="leading-relaxed">{achievements}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="flex-shrink-0" />
            <span>{location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
