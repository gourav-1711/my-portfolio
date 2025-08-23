"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Menu,
  X,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
} from "lucide-react";
import { Button } from "./ui/button";
import { AnimatedBorder } from "./animated-border";
import Link from "next/link";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/gourav-1711", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/gaurav-dadhich-92a571353/",
    label: "LinkedIn",
  },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Mail, href: "mailto:contact@example.com", label: "Email" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Update active section based on scroll position
      const scrollPosition = window.scrollY + 100;
      const sections = ["about", "services", "projects", "contact"];

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
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking on a nav item
  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.getElementById("mobile-menu");
      const menuButton = document.getElementById("menu-button");
      if (
        menu &&
        menuButton &&
        !menu.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`max-w-5xl w-full  mt-2 mx-auto px-4  rounded-full fixed  top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "" : ""
        }`}
      >
        <div
          className={`${
            isScrolled
              ? "w-[90%] md:w-[87%] lg:w-[83%] bg-gray-700/20 backdrop-blur-md border-b border-white/30"
              : "w-full bg-transparent"
          } mx-auto px-4 sm:px-6 lg:px-8 rounded-full duration-500`}
        >
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="#" className="flex items-center space-x-3 group">
                {/* <AnimatedBorder
                  className="w-10 h-10 md:w-12 md:h-12"
                  duration="2s"
                >
                  <div className="w-full h-full bg-gradient-to-r from-gray-600 to-black rounded-xl flex items-center justify-center">
                    <span className="text-white text-sm font-bold">GD</span>
                  </div>
                </AnimatedBorder> */}
                <div className="hidden sm:block">
                  <span className="font-bold text-lg text-white">
                    Gaurav Dadhich
                  </span>
                  <div className="flex items-center text-xs text-gray-300">
                    <MapPin className="w-3 h-3 mr-1" />
                    Jodhpur
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={` px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === item.href.substring(1)
                      ? "text-white bg-white/10"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.name}
                </Button>
              ))}
              <Button
                asChild
                className="ml-2 bg-gradient-to-r from-gray-600 to-black text-white hover:from-gray-700 hover:to-gray-900"
              >
                <a href="#contact">Hire Me</a>
              </Button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                id="menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
                aria-expanded="false"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`md:hidden fixed inset-0 bg-black/50 rounded-2xl backdrop-blur-sm z-[-1] transform transition-all duration-300 ease-in-out p-5 ${
            isMenuOpen
              ? "translate-y-16 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="pt-2 pb-3 space-y-1 px-4 h-[calc(100%-4rem)] overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`w-full text-left px-3 py-3 rounded-md text-base font-medium ${
                  activeSection === item.href.substring(1)
                    ? "text-white bg-white/10"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.name}
              </button>
            ))}

            <div className="pt-4 border-t border-white/10 mt-4">
              <p className="px-3 text-sm text-gray-400 mb-3">Connect with me</p>
              <div className="grid grid-cols-2 gap-2">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="fixed bottom-4 left-4 right-4">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-gray-600 to-black text-white hover:from-gray-700 hover:to-gray-900 h-12 text-base"
              >
                <a href="#contact">Hire Me</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Add padding to prevent content from being hidden behind fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
