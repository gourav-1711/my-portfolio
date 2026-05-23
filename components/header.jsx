"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Aos from "aos";
import "aos/dist/aos.css";

import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    Aos.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      const sections = ["about", "services", "projects", "contact"];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (!element) continue;

        const { offsetTop, offsetHeight } = element;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        data-aos="fade"
        className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95"
      >
        <div className="editorial-container flex h-20 items-center justify-between md:h-24">
          <Link
            href="#about"
            onClick={() => handleNavClick("#about")}
            className="font-serif text-2xl font-bold leading-none text-foreground md:text-3xl"
          >
            GAURAV DADHICH
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "editorial-label border-b border-transparent pb-1 text-foreground/80 transition-colors hover:text-foreground",
                    isActive && "border-foreground text-foreground",
                  )}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <Button asChild size="lg" className="editorial-button h-12">
              <a href="#contact">Hire Me</a>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="border border-border p-3 text-foreground md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      <div className="h-20 md:h-24" />

      <div
        className={cn(
          "fixed inset-x-0 top-20 z-40 border-b border-border bg-background transition-all md:hidden",
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none",
        )}
      >
        <div className="editorial-container flex flex-col gap-0 py-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.href)}
              className="editorial-label border-b border-border py-5 text-left text-foreground"
            >
              {item.name}
            </button>
          ))}
          <Button asChild size="lg" className="editorial-button mt-6">
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>
              Hire Me
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
