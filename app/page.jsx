"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectSlider } from "@/components/project-slider";
import { AnimatedBackground } from "@/components/animated-background";
import { TypewriterEffect } from "@/components/typewriter-effect";
import { SpotlightCard } from "@/components/spotlight-card";
import { AnimatedBorder } from "@/components/animated-border";
import { FloatingDock } from "@/components/floating-dock";
import { Header } from "@/components/header";
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    Aos.init({
      duration: 500,
    });

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <AnimatedBackground />
      </div>

      <ScrollProgressBar />

      {/* Use the new Header component */}
      <Header />

      <FloatingDock />

     

      {/* About Section */}
      <section
        id="about"
        className="px-6 py-24 pt-32 max-w-7xl mx-auto relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 md:space-y-8">
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="text-gray-300 text-xs md:text-sm font-medium">
                    <TypewriterEffect words={typewriterWords} />
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
                  Creative FullStack Web Developer
                </h1>
                <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed">
                  Design and code beautifully simple projects without
                  overwhelming yourself with complexity. Enjoy your passion for
                  creating with ease and love.
                </p>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="400">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="bg-gradient-to-r from-gray-600 to-black text-white hover:from-gray-700 hover:to-gray-900 shadow-lg px-4 py-2 md:px-6 md:py-3 text-sm md:text-base"
                >
                  Hire Me Now →
                </Button>
                <Button
                  onClick={() => window.open("https://github.com/gourav-1711")}
                  variant="outline"
                  className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base"
                >
                  <Github className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  My Github
                </Button>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="600">
              <div className="space-y-2 md:space-y-3">
                <p className="text-xs md:text-sm text-gray-400">
                  Connect with me:
                </p>
                <div className="flex space-x-3">
                  <div
                    onClick={() =>
                      window.open(
                        "https://www.linkedin.com/in/gaurav-dadhich-92a571353/"
                      )
                    }
                    className="p-1.5 md:p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-gray-300 hover:text-white" />
                  </div>
                  <div
                    onClick={() =>
                      window.open(
                        "https://www.instagram.com/gaurav.dadhich?igsh=bmQ1MnV0NDM0cDZn"
                      )
                    }
                    className="p-1.5 md:p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <Instagram className="w-4 h-4 md:w-5 md:h-5 text-gray-300 hover:text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div data-aos="zoom-in" data-aos-delay="300" className="mt-8 md:mt-0">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-white/20 rounded-3xl blur-3xl"></div>
                <img
                  src="/img/banner.webp"
                  alt="3D Computer Component"
                  className="relative w-full h-auto drop-shadow-2xl rounded-2xl md:rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-6 py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div data-aos="fade-up">
            <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
              <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-gray-300 text-xs md:text-sm font-medium">
                  About Web Development
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent px-4">
                I create user-friendly, and beautiful websites and applications.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Service cards with similar responsive updates */}
            {/* ... (rest of the service cards with responsive classes) */}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="px-6 py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div data-aos="fade-up">
            <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
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

          <div data-aos="fade-up" data-aos-delay="400">
            <ProjectSlider projects={projects} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="px-4 sm:px-6 py-12 md:py-16 pb-16 md:pb-24 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div data-aos="fade-up">
            <div className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Get In Touch
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
                Have a project in mind or want to discuss potential
                opportunities? Feel free to reach out and let's build something
                amazing together!
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <div
              data-aos="fade-right"
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8"
            >
              <h3 className="text-xl font-semibold text-white mb-6">
                Send me a message
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Hi Gaurav, I'd like to discuss a project..."
                    defaultValue={""}
                  />
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    size="lg"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div
              data-aos="fade-left"
              data-aos-delay="200"
              className="space-y-6 md:space-y-8"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <Mail className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300">
                        Email
                      </h4>
                      <a
                        href="mailto:contact@example.com"
                        className="text-white hover:text-purple-300 transition-colors text-sm sm:text-base"
                      >
                        contact@example.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <Phone className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300">
                        Phone
                      </h4>
                      <a
                        href="tel:+1234567890"
                        className="text-white hover:text-purple-300 transition-colors text-sm sm:text-base"
                      >
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300">
                        Location
                      </h4>
                      <p className="text-white text-sm sm:text-base">
                        Jodhpur, Rajasthan, India
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-medium text-gray-300 mb-4">
                    Follow Me
                  </h4>
                  <div className="flex space-x-4">
                    {[
                      {
                        icon: Github,
                        href: "https://github.com/gourav-1711",
                        label: "GitHub",
                      },
                      {
                        icon: Linkedin,
                        href: "https://linkedin.com/in/yourprofile",
                        label: "LinkedIn",
                      },
                      {
                        icon: Twitter,
                        href: "https://twitter.com/yourhandle",
                        label: "Twitter",
                      },
                      {
                        icon: Instagram,
                        href: "https://instagram.com/yourhandle",
                        label: "Instagram",
                      },
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div data-aos="fade">
        <footer className="bg-black/50 backdrop-blur-md border-t border-white/10 px-6 py-8 md:py-12 mb-16 md:mb-0 relative z-10">
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
                2024 Gaurav Dadhich. All rights reserved. | Privacy Policy |
                Terms of Service
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
