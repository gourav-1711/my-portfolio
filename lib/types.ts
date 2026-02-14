export interface HeroData {
  title: string;
  description: string;
  typewriterWords: string[];
  bannerUrl: string;
  resumeUrl: string;
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  img: string;
  tags: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  category: string[];
  gradient?: string;
}

export interface Skill {
  id: string;
  name: string;
  img: string;
  description: string;
  proficiency: number;
  category: "Core Web" | "Frontend" | "Backend" | "Mobile" | "Tools";
}

export interface Category {
  id: string;
  name: string;
}
