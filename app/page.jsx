"use client";

import { Button } from "@/components/ui/button";
import { ProjectsSection } from "@/components/projects-section";
import { AnimatedBackground } from "@/components/animated-background";
import { TypewriterEffect } from "@/components/typewriter-effect";
import { AnimatedBorder } from "@/components/animated-border";
import { FloatingDock } from "@/components/floating-dock";
import { Header } from "@/components/header";
import {
  Github,
  Linkedin,
  Instagram,
  ShoppingCart,
  Users,
  MapPin,
  Mail,
  Phone,
  Download,
  Video,
  Layout,
  Music,
  PopcornIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollProgressBar } from "../components/scroll-progress-bar";
import Aos from "aos";
import "aos/dist/aos.css";
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
import axios from "axios";
import { SkillsSection } from "@/components/skills-section";

export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState({
    open: false,
    type: "success",
    message: "",
  });

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
    "React Native Developer",
    "Problem Solver",
    "Creative Thinker",
  ];

  // projects data moved to ProjectsSection component

  // skills array moved to SkillsSection component

  // email send work
  const handleSubmit = async (e) => {
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
          console.log(response);
          if (response.data.success) {
            setAlertOpen({
              open: true,
              type: response.data.success,
              message: response.data.message,
            });
            setTimeout(() => {
              setAlertOpen({
                open: false,
                type: response.data.success,
                message: response.data.message,
              });
            }, 3000);
            // router.push("/");
            // router.refresh();
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
            setAlertOpen({
              open: false,
              type: "error",
              message: "Email failed to send",
            });
          }, 3000);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400/30 via-gray-800/50 to-blue-500/30 relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <AnimatedBackground />
      </div>

      {/* succes alert */}
      <div
        className={`fixed inset-0 bottom-4 z-50 ${
          alertOpen.open ? "block" : "hidden"
        }`}
      >
        <Alert
          variant={alertOpen.type === "success" ? "success" : "destructive"}
          className="flex fixed bottom-4 items-center gap-3 bg-gradient-to-r from-purple-400/30 via-gray-800/60 to-blue-500/30 backdrop-blur-xl border border-white/20 text-white rounded-xl shadow-lg p-4"
        >
          <PopcornIcon className="w-6 h-6 text-purple-300 drop-shadow-md" />
          <AlertTitle className="text-sm font-semibold tracking-wide">
            {alertOpen.message}
          </AlertTitle>
        </Alert>
      </div>

      {/* alert */}
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

      {/* loading */}
      <div
        className={`fixed bg-black/50 inset-0 z-50 ${
          loading ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>

      <ScrollProgressBar />

      {/* Use the new Header component */}
      <Header />

      <FloatingDock />

      {/* About Section */}
      <section
        id="about"
        className="px-6 py-10 md:py-20 lg:py-24 pt-10 md:pt-20 lg:pt-24 max-w-6xl mx-auto relative z-10"
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

      {/* Skills Section */}
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
            <SkillsSection />
          </div>
        </div>
      </section>

      {/* Projects Section */}
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
            <ProjectsSection />
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
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      name="name"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your Name"
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
                      name="email"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="YourEmail@example.com"
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
                    name="subject"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your Subject Topic"
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
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Hi Gaurav, I'd like to discuss a project..."
                    defaultValue={""}
                  />
                </div>
                <div className="pt-2">
                  <Button
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
                        href="mailto:gouravdadhich13@gmail.com"
                        className="text-white hover:text-purple-300 transition-colors text-sm sm:text-base"
                      >
                        gouravdadhich13@gmail.com
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
                        href="tel:+918387840848"
                        className="text-white hover:text-purple-300 transition-colors text-sm sm:text-base"
                      >
                        +91 8387840848
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
                        href: "https://www.linkedin.com/in/gaurav-dadhich-92a571353/",
                        label: "LinkedIn",
                      },
                      {
                        icon: Instagram,
                        href: "https://www.instagram.com/gaurav.dadhich/?igsh=bmQ1MnV0NDM0cDZn#",
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
