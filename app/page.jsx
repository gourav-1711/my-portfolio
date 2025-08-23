"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/animated-section";
import { ProjectSlider } from "@/components/project-slider";
import { AnimatedBackground } from "@/components/animated-background";
import { TypewriterEffect } from "@/components/typewriter-effect";
import { SpotlightCard } from "@/components/spotlight-card";
import { AnimatedBorder } from "@/components/animated-border";
import { FloatingDock } from "@/components/floating-dock";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  ShoppingCart,
  User,
  Users,
  FileText,
  MapPin,
  Mail,
  Phone,
  ChevronUp,
  Smartphone,
  Globe,
  Database,
  Palette,
  Home,
  Briefcase,
  FolderOpen,
  MessageCircle,
  Download,
  Video,
  Layout,
  Music,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollProgressBar } from "../components/scroll-progress-bar";
import Aos from "aos";
import "aos/dist/aos.css";
export default function HomePage() {
  const [activeSection, setActiveSection] = useState("about");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    Aos.init({
      duration: 500,


    });
  }, []);

  const typewriterWords = [
    "Full Stack Developer",
    "Electron Js Developer",
    "Problem Solver",
    "Creative Thinker",
  ];

  const projects = [
    {
      id: 1,
      title: "YouTube Downloader Desktop App",
      description:
        "Electron + React desktop app to download YouTube videos and playlists with multiple formats using yt-dlp and ffmpeg.",
      icon: <Download className="w-8 h-8 text-white" />,
      gradient: "bg-gradient-to-r from-red-600 to-black",
      tags: ["Electron", "React", "Node.js", "yt-dlp", "ffmpeg"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      id: 2,
      title: "Screen Recorder Desktop App",
      description:
        "Screen and audio recorder built with Electron and JavaScript, allowing users to select formats for export.",
      icon: <Video className="w-8 h-8 text-white" />,
      gradient: "bg-gradient-to-r from-gray-700 to-black",
      tags: ["Electron", "JavaScript"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      id: 3,
      title: "Blinkit Clone",
      description:
        "A clone of Blinkit app built with React, featuring product listings and Context API for state management.",
      icon: <ShoppingCart className="w-8 h-8 text-white" />,
      gradient: "bg-gradient-to-r from-green-600 to-black",
      tags: ["React", "Context API", "CSS"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      id: 4,
      title: "Shaadi.com Clone",
      description:
        "Marriage portal mockup with responsive UI showcasing profile browsing and matchmaking features.",
      icon: <Users className="w-8 h-8 text-white" />,
      gradient: "bg-gradient-to-r from-pink-600 to-black",
      tags: ["React", "CSS", "Responsive UI"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      id: 5,
      title: "Admin Panel Dashboard",
      description:
        "E-commerce admin dashboard with product, category, and user management system.",
      icon: <Layout className="w-8 h-8 text-white" />,
      gradient: "bg-gradient-to-r from-gray-800 to-gray-600",
      tags: ["React", "Node.js", "MongoDB", "Express"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      id: 6,
      title: "Spotify UI Clone",
      description:
        "A clone of Spotify’s web interface built in React with modern UI styling and responsive layout.",
      icon: <Music className="w-8 h-8 text-white" />,
      gradient: "bg-gradient-to-r from-green-500 to-black",
      tags: ["React", "CSS", "Spotify UI"],
      liveUrl: "#",
      githubUrl: "#",
    },
  ];
  

  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
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
      }
    };

    const handleScroll = () => {
      const sections = ["about", "services", "projects", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }

      setShowScrollTop(window.scrollY > 500);
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => link.addEventListener("click", handleClick));
    window.addEventListener("scroll", handleScroll);

    return () => {
      links.forEach((link) => link.removeEventListener("click", handleClick));
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black relative">
      <AnimatedBackground />
      <ScrollProgressBar />

      <header
        data-aos="fade-down"
        data-aos-duration="500"
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/20 rounded-2xl  max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto">
          <div className="flex items-center space-x-3">
            <AnimatedBorder className="w-10 h-10" duration="2s">
              <div className="w-full h-full bg-gradient-to-r from-gray-600 to-black rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">GD</span>
              </div>
            </AnimatedBorder>
            <div>
              <span className="font-bold text-lg text-white">
                Gaurav Dadhich
              </span>
              <div className="flex items-center text-xs text-gray-300">
                <MapPin className="w-3 h-3 mr-1" />
                Jodhpur
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-gray-600 to-black text-white hover:from-gray-700 hover:to-gray-900 shadow-lg">
              My Projects
            </Button>
          </div>
        </div>
      </header>
      <FloatingDock />
      {/* 
      <nav className=" fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-black/80 border-t border-white/20">
        <div className="flex items-center justify-around px-4 py-3 max-w-md mx-auto">
          <a
            href="#about"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
              activeSection === "about" ? "text-white bg-white/20" : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">About</span>
          </a>
          <a
            href="#services"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
              activeSection === "services"
                ? "text-white bg-white/20"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-xs">Services</span>
          </a>
          <a
            href="#projects"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
              activeSection === "projects"
                ? "text-white bg-white/20"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            <span className="text-xs">Projects</span>
          </a>
          <a
            href="#contact"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
              activeSection === "contact"
                ? "text-white bg-white/20"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Contact</span>
          </a>
        </div>
      </nav> */}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 md:bottom-20 right-4 md:right-8 z-40 p-2 md:p-3 bg-gradient-to-r from-gray-600 to-black text-white rounded-full shadow-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-300 hover:scale-110 animate-bounce hover:animate-none motion-reduce:animate-none"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}



      <section
        id="about"
        className="px-6 py-24 pt-32 max-w-7xl mx-auto relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <AnimatedSection animation="fade-up" delay={200}>
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="text-gray-300 text-sm font-medium">
                    <TypewriterEffect words={typewriterWords} />
                  </span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
                  Creative FullStack Web Developer
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Design and code beautifully simple projects without
                  overwhelming yourself with complexity. Enjoy your passion for
                  creating with ease and love.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="bg-gradient-to-r from-gray-600 to-black text-white hover:from-gray-700 hover:to-gray-900 shadow-lg px-8 py-3"
                >
                  Hire Me Now →
                </Button>
                <Button
                  onClick={() => window.open("https://github.com/gourav-1711")}
                  variant="outline"
                  className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-3"
                >
                  <Github className="w-4 h-4 mr-2" />
                  My Github
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={600}>
              <div className="space-y-3">
                <p className="text-sm text-gray-400">Connect with me:</p>
                <div className="flex space-x-4">
                  <div
                    onClick={() =>
                      window.open(
                        "https://www.linkedin.com/in/gaurav-dadhich-92a571353/"
                      )
                    }
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <Linkedin className="w-5 h-5 text-gray-300 hover:text-white" />
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        "https://www.instagram.com/gaurav.dadhich?igsh=bmQ1MnV0NDM0cDZn"
                      )
                    }
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <Instagram className="w-5 h-5 text-gray-300 hover:text-white" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="scale-up" delay={300}>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-white/20 rounded-3xl blur-3xl"></div>
                <img
                  src="/img/banner.webp"
                  alt="3D Computer Component"
                  className="relative w-full max-w-md h-auto drop-shadow-2xl rounded-4xl"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section id="services" className="px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-gray-300 text-sm font-medium">
                  About Web Development
                </span>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                I create user-friendly, and beautiful websites and applications.
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection animation="fade-up" delay={200}>
              <SpotlightCard>
                <Card className="bg-transparent border-0">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl mb-4 text-white">
                      Front-End Development
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Crafting visually appealing and responsive interfaces
                      using HTML, CSS, and JavaScript frameworks like React and
                      Next.js.
                    </p>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              <SpotlightCard>
                <Card className="bg-transparent border-0">
                  <CardContent className="p-8">
                    
                    <h3 className="font-bold text-xl mb-4 text-white">
                      Back-End Development
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Building robust and scalable server-side applications with
                      Node.js, Express, and databases like MongoDB .
                    </p>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={600}>
              <SpotlightCard>
                <Card className="bg-transparent border-0">
                  <CardContent className="p-8">
                   
                    <h3 className="font-bold text-xl mb-4 text-white">
                      Electron Js 
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Building desktop applications using Electron.js and React. I Have Good Understanding in And Made Some Projects.
                    </p>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section id="projects" className="px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-gray-300 text-sm font-medium">
                  Portfolio Showcase
                </span>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                Projects Showcase
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Take a look at some of my notable projects, showcasing my
                ability to design and develop effective web solutions.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <ProjectSlider projects={projects} />
          </AnimatedSection>
        </div>
      </section>

      <section id="contact" className="px-6 py-16 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8">
                Interested in Working Together?
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-12">
            <AnimatedSection animation="slide-left" delay={400}>
              <SpotlightCard>
                <Card className="bg-transparent border-0">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* box 1 */}
                      <div>
                        <div className="mb-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">
                            Explore My Work
                          </h3>
                          <p className="text-gray-300 mb-6">
                            View my portfolio to see the kind of work I do for
                            you.
                          </p>
                        </div>
                        <Button
                        onClick={() => scrollToSection("projects")}
                        className="bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black shadow-lg w-full">
                          View My Work
                        </Button>
                      </div>

                      {/* box 2 */}
                      <div>
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-white mb-4">
                            Contact Me
                          </h3>
                          <p className="text-gray-300 mb-2">
                            📧 Email:{" "}
                            <span className="text-white">
                              gouravdadhich13@gmail.com
                            </span>
                          </p>
                          <p className="text-gray-300 mb-2">
                            📱 Phone:{" "}
                            <span className="text-white">+91 387840848</span>
                          </p>
                          <p className="text-gray-300 mb-6">
                            📍 Location:{" "}
                            <span className="text-white">Jodhpur, India</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          onClick={() =>
                            window.open("https://github.com/gourav-1711")
                          }
                          variant="outline"
                          className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </Button>

                        <Button
                          onClick={() =>
                            window.open(
                              "https://www.linkedin.com/in/gaurav-dadhich-92a571353/"
                            )
                          }
                          variant="outline"
                          className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                        <Button
                          onClick={() =>
                            window.open(
                              "https://www.instagram.com/gaurav.dadhich?igsh=bmQ1MnV0NDM0cDZn"
                            )
                          }
                          variant="outline"
                          className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                          <Instagram className="w-4 h-4 mr-2" />
                          Instagram
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <AnimatedSection animation="fade-in">
        <footer className="bg-black/50 backdrop-blur-md border-t border-white/10 px-6 py-12 mb-16 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <AnimatedBorder className="w-10 h-10" duration="2s">
                  <div className="w-full h-full bg-gradient-to-r from-gray-600 to-black rounded-xl flex items-center justify-center">
                    <span className="text-white text-sm font-bold">GD</span>
                  </div>
                </AnimatedBorder>
                <div>
                  <span className="font-bold text-lg text-white">
                    Gaurav Dadhich
                  </span>
                  <div className="flex items-center justify-center text-xs text-gray-400">
                    <MapPin className="w-3 h-3 mr-1" />
                    Jodhpur, India
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                2024 Gaurav Dadhich. All rights reserved. | Privacy Policy |
                Terms of Service
              </p>
            </div>
          </div>
        </footer>
      </AnimatedSection>
    </div>
  );
}
