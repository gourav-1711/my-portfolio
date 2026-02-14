"use client";

import { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Github,
  Linkedin,
  Instagram,
  MapPin,
  Mail,
  Phone,
  PopcornIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { AnimatedBackground } from "@/components/animated-background";
import { TypewriterEffect } from "@/components/typewriter-effect";
import { AnimatedBorder } from "@/components/animated-border";
import { FloatingDock } from "@/components/floating-dock";
import { Header } from "@/components/header";
import { ScrollProgressBar } from "@/components/scroll-progress-bar";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle } from "@/components/ui/alert";

import { HeroData, Project, Skill, Category } from "@/lib/types";

// -- Interfaces -- (Using imported types)

interface HomeClientProps {
  initialHero: HeroData | null;
  initialProjects: Project[];
  initialSkills: Skill[];
  initialCategories: Category[];
}

export default function HomeClient({
  initialHero,
  initialProjects,
  initialSkills,
  initialCategories,
}: HomeClientProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState({
    open: false,
    type: "success",
    message: "",
  });

  // Fetch Hero Data (Client-side hydration)
  const { data: hero } = useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const res = await fetch("/api/hero");
      const data = await res.json();
      return data.data as HeroData;
    },
    initialData: initialHero || undefined,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    Aos.init({
      duration: 500,
    });
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };

    if (
      data.name == "" ||
      data.email == "" ||
      data.subject == "" ||
      data.message == ""
    ) {
      setOpen(true);
      return;
    } else {
      setOpen(false);
      setLoading(true);
      await axios
        .post("/api/send", data)
        .then((response) => {
          if (response.data.success) {
            setAlertOpen({
              open: true,
              type: "success",
              message: response.data.message,
            });
            setTimeout(() => {
              setAlertOpen((prev) => ({ ...prev, open: false }));
            }, 3000);
            e.target.reset();
          }
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          setAlertOpen({
            open: true,
            type: "error",
            message: "Email failed to send",
          });
          setTimeout(() => {
            setAlertOpen((prev) => ({ ...prev, open: false }));
          }, 3000);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Fallback defaults if no hero data exists
  const defaultHero = {
    title: "Building Scalable Apps from Logic to Layout.",
    description:
      "I build fast, clean, and scalable web & mobile apps. From APIs with FastAPI to smooth UIs with React Native — I turn ideas into real, working products.",
    typewriterWords: [
      "Full-Stack Developer",
      "React Native App Builder",
      "FastAPI Backend Engineer",
      "Freelance Problem Solver",
      "Mobile & Web Specialist",
      "Creative Coder",
    ],
    bannerUrl: "/img/banner.webp",
    resumeUrl: "",
    socials: {
      github: "https://github.com/gourav-1711",
      linkedin: "https://www.linkedin.com/in/gaurav-dadhich-92a571353/",
      instagram:
        "https://www.instagram.com/gaurav.dadhich?igsh=bmQ1MnV0NDM0cDZn",
    },
  };

  const activeHero = hero || defaultHero;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400/30 via-gray-800/50 to-blue-500/30 relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <AnimatedBackground />
      </div>

      {/* Success/Error Alert */}
      <div
        className={`fixed inset-0 bottom-4 z-50 ${
          alertOpen.open ? "block" : "hidden"
        }`}
      >
        <Alert
          variant={alertOpen.type === "success" ? "default" : "destructive"}
          className="flex fixed bottom-4 right-4 w-auto items-center gap-3 bg-gradient-to-r from-purple-400/30 via-gray-800/60 to-blue-500/30 backdrop-blur-xl border border-white/20 text-white rounded-xl shadow-lg p-4"
        >
          <PopcornIcon className="w-6 h-6 text-purple-300 drop-shadow-md" />
          <AlertTitle className="text-sm font-semibold tracking-wide">
            {alertOpen.message}
          </AlertTitle>
        </Alert>
      </div>

      {/* Validation Alert */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-gradient-to-br from-purple-600/20 via-gray-900/20 to-slate-500/20 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-white drop-shadow-md">
              Please fill all fields
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-white/80">
              Please fill all fields to send your message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-2">
            <AlertDialogAction className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white font-medium border border-white/20 shadow-sm">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed bg-black/50 inset-0 z-50 flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      <ScrollProgressBar />

      <Header />

      <FloatingDock />

      {/* HERO SECTION */}
      <section
        id="about"
        className="px-6 py-12 md:py-24 lg:py-32 max-w-7xl mx-auto relative z-10"
      >
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-12 lg:gap-20 items-center">
          <div className="space-y-8 md:space-y-10">
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="space-y-6">
                <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="text-gray-300 text-xs md:text-sm font-medium">
                    <TypewriterEffect words={activeHero.typewriterWords} />
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-lg">
                  {activeHero.title}
                </h1>
                <p className="text-gray-300/90 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl">
                  {activeHero.description}
                </p>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="400">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/25 px-8 py-6 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Hire Me Now
                </Button>

                {activeHero.resumeUrl && (
                  <Button
                    onClick={() => window.open(activeHero.resumeUrl)}
                    variant="outline"
                    className="border-white/10 bg-white/5 hover:bg-white/10 text-white px-8 py-6 rounded-full text-base backdrop-blur-md transition-all duration-300"
                  >
                    Download Resume
                  </Button>
                )}

                <button
                  onClick={() => window.open(activeHero.socials.github)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-base font-medium px-4"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </button>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="600" className="pt-2">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500 font-medium">Connect:</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open(activeHero.socials.linkedin)}
                    className="p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300 backdrop-blur-xl"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => window.open(activeHero.socials.instagram)}
                    className="p-3 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300 backdrop-blur-xl"
                  >
                    <Instagram className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div data-aos="zoom-in" data-aos-delay="300" className="mt-8 md:mt-0">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-white/20 rounded-3xl blur-3xl"></div>
                <img
                  src={activeHero.bannerUrl || "/img/banner.webp"}
                  alt="Hero Banner"
                  className="relative w-full h-auto drop-shadow-2xl rounded-2xl md:rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="services" className="px-6 py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div data-aos="fade-up">
            <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
              <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-gray-300 text-xs md:text-sm font-medium">
                  My Skills
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent px-4">
                I create user-friendly, and beautiful websites and applications.
              </h2>
            </div>
          </div>

          <div className="w-full">
            <SkillsSection initialData={initialSkills} />
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="px-6 py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div data-aos="fade-up">
            <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4">
              <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-gray-300 text-xs md:text-sm font-medium">
                  Portfolio Showcase
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2 md:mb-4">
                Projects Showcase
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto px-4">
                Take a look at some of my notable projects, showcasing my
                ability to design and develop effective web solutions.
              </p>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <ProjectsSection
              initialData={initialProjects}
              categories={initialCategories}
            />
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="px-4 sm:px-6 py-12 md:py-24 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div
            data-aos="fade-up"
            className="text-center mb-12 md:mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              Have a project in mind or want to discuss potential opportunities?
              Feel free to reach out and let's build something amazing together!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">
            {/* Contact Form */}
            <div
              data-aos="fade-right"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col h-full"
            >
              <h3 className="text-2xl font-bold text-white mb-8">
                Send me a message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="relative group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Your Name"
                      className="peer w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-5 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400 pointer-events-none"
                    >
                      Your Name
                    </label>
                  </div>

                  {/* Email Input */}
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="Email Address"
                      className="peer w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-5 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400 pointer-events-none"
                    >
                      Email Address
                    </label>
                  </div>
                </div>

                {/* Subject Input */}
                <div className="relative group">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    placeholder="Subject"
                    className="peer w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <label
                    htmlFor="subject"
                    className="absolute left-5 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400 pointer-events-none"
                  >
                    Subject
                  </label>
                </div>

                {/* Message Input */}
                <div className="relative group">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Your Message"
                    className="peer w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  ></textarea>
                  <label
                    htmlFor="message"
                    className="absolute left-5 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400 pointer-events-none"
                  >
                    Your Message
                  </label>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 text-lg font-semibold h-14 rounded-xl shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_30px_rgba(192,38,211,0.6)] hover:scale-[1.02] transition-all duration-300"
                  size="lg"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div
              data-aos="fade-left"
              data-aos-delay="200"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col h-full justify-between"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-8">
                  Contact Information
                </h3>
                <div className="space-y-8">
                  {/* Email */}
                  <div className="flex items-start gap-6 group">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all duration-300">
                      <Mail className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">
                        Email
                      </h4>
                      <a
                        href={`mailto:${activeHero.socials?.linkedin ? "gouravdadhich13@gmail.com" : "gouravdadhich13@gmail.com"}`}
                        className="text-lg md:text-xl font-semibold text-white hover:text-purple-400 transition-colors"
                      >
                        gouravdadhich13@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-6 group">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all duration-300">
                      <Phone className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">
                        Phone
                      </h4>
                      <a
                        href="tel:+918387840848"
                        className="text-lg md:text-xl font-semibold text-white hover:text-purple-400 transition-colors"
                      >
                        +91 8387840848
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-6 group">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all duration-300">
                      <MapPin className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">
                        Location
                      </h4>
                      <p className="text-lg md:text-xl font-semibold text-white">
                        Jodhpur, Rajasthan, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="mt-12">
                <h4 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
                  Connect with me
                </h4>
                <div className="flex gap-4">
                  {[
                    {
                      icon: Github,
                      href: activeHero.socials?.github,
                      label: "GitHub",
                    },
                    {
                      icon: Linkedin,
                      href: activeHero.socials?.linkedin,
                      label: "LinkedIn",
                    },
                    {
                      icon: Instagram,
                      href: activeHero.socials?.instagram,
                      label: "Instagram",
                    },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white hover:scale-110 hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(192,38,211,0.3)] transition-all duration-300"
                      aria-label={social.label}
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div data-aos="fade">
        <footer className="bg-black/50 backdrop-blur-md border-t border-white/10 px-6 py-8 md:py-12 mb-4 md:mb-0 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3 mb-4 md:mb-6">
                <AnimatedBorder
                  className="w-8 h-8 md:w-10 md:h-10"
                  duration="2s"
                >
                  <div className="w-full h-full bg-gradient-to-r from-gray-600 to-black rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs md:text-sm font-bold">
                      GD
                    </span>
                  </div>
                </AnimatedBorder>
                <div>
                  <span className="font-bold text-sm md:text-lg text-white">
                    Gaurav Dadhich
                  </span>
                  <div className="flex items-center justify-center text-[10px] md:text-xs text-gray-400">
                    <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                    Jodhpur, India
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-xs md:text-sm max-w-2xl mx-auto">
                2025 Gaurav Dadhich. All rights reserved. | Privacy Policy |
                Terms of Service
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
