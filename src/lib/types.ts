// TypeScript types for portfolio data

export interface Project {
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  _id?: string;
  title: string;
  company: string;
  description: string;
  date: string;
  location: string;
  current: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  _id?: string;
  degree: string;
  field: string;
  institution: string;
  achievements: string;
  date: string;
  location: string;
  current: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  _id?: string;
  name: string;
  percentage: number;
}

export interface SkillCategory {
  _id?: string;
  title: string;
  icon: string;
  skills: Skill[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  _id?: string;
  username: string;
  password: string; // hashed
  email: string;
  createdAt: Date;
}

export interface AboutMe {
  _id?: string;
  title: string;
  description: string[];
  location: string;
  email: string;
  profileImage: string;
  updatedAt: Date;
}

export interface CVFile {
  _id?: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}

export interface Interest {
  _id?: string;
  title: string;
  icon: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
