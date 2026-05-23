"use client";

import { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  Github,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { Header } from "@/components/header";

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

import { Category, HeroData, Project, Skill } from "@/lib/types";

interface HomeClientProps {
  initialHero: HeroData | null;
  initialProjects: Project[];
  initialSkills: Skill[];
  initialCategories: Category[];
}

const defaultHero = {
  title: "Freelance Full-Stack & Mobile App Developer",
  description:
    "Crafting high-performance digital experiences with a focus on clean architecture, intuitive design, and technical precision. Transforming complex problems into elegant software solutions.",
  typewriterWords: [
    "Full-Stack Developer",
    "React Native App Builder",
    "FastAPI Backend Engineer",
    "Freelance Problem Solver",
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
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };

    if (!data.name || !data.email || !data.subject || !data.message) {
      setOpen(true);
      return;
    }

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
      .catch(() => {
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
  };

  const activeHero = (hero || defaultHero) as any;
  const socials =
    activeHero.socials || activeHero.socialLinks || defaultHero.socials;
  const contactEmail = socials.email || "gouravdadhich13@gmail.com";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {alertOpen.open && (
        <Alert
          variant={alertOpen.type === "success" ? "default" : "destructive"}
          className="fixed bottom-6 right-6 z-50 w-auto rounded-none border-border bg-card text-foreground shadow-none"
        >
          <AlertTitle className="editorial-label">
            {alertOpen.message}
          </AlertTitle>
        </Alert>
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="rounded-none border-border bg-card text-foreground shadow-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-2xl">
              Please fill all fields
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Please fill all fields to send your message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="editorial-button">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loading && (
        <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-background/80">
          <div className="size-12 animate-spin border border-border border-t-foreground" />
        </div>
      )}

      <Header />

      <main>
        <section
          id="about"
          className="editorial-container flex min-h-[calc(100vh-6rem)] items-center border-b border-border py-20 md:py-28"
        >
          <div data-aos="fade-up" className="max-w-5xl">
            <h1 className="max-w-6xl font-serif text-6xl font-bold leading-[0.95] text-foreground md:text-8xl lg:text-[108px]">
              {activeHero.title}
            </h1>
            <p className="mt-10 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
              {activeHero.description}
            </p>

            <div className="mt-12 flex flex-col gap-5 sm:flex-row">
              <Button
                onClick={() => scrollToSection("contact")}
                size="lg"
                className="editorial-button"
              >
                Hire Me Now
              </Button>

              {activeHero.resumeUrl && (
                <Button
                  onClick={() => window.open(activeHero.resumeUrl)}
                  variant="outline"
                  size="lg"
                  className="editorial-button"
                >
                  Download Resume
                </Button>
              )}
            </div>
          </div>
        </section>

        <section
          id="services"
          className="editorial-container grid gap-12 border-b border-border py-20 md:grid-cols-[0.75fr_1.25fr] md:gap-20 md:py-28"
        >
          <div data-aos="fade-up">
            <h2 className="font-serif text-5xl font-semibold leading-tight md:text-6xl">
              Technical
              <br />
              Proficiencies
            </h2>
            <p className="mt-6 max-w-sm text-base leading-7 text-muted-foreground">
              A curated stack of technologies I utilize to build scalable,
              production-ready applications across web and mobile platforms.
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <SkillsSection initialData={initialSkills} />
          </div>
        </section>

        <section
          id="projects"
          className="editorial-container border-b border-border py-20 md:py-28"
        >
          <div
            data-aos="fade-up"
            className="mb-10 flex flex-col gap-8 border-b border-border pb-10 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="editorial-label mb-6 text-muted-foreground">
                Portfolio
              </p>
              <h2 className="font-serif text-6xl font-semibold leading-none md:text-8xl">
                Selected Works
              </h2>
            </div>
          </div>

          <ProjectsSection
            initialData={initialProjects}
            categories={initialCategories}
          />
        </section>

        <section
          id="contact"
          className="editorial-container border-b border-border py-20 md:py-28"
        >
          <div data-aos="fade-up" className="border-b border-border pb-10">
            <p className="editorial-label mb-8">
              Availability: Currently open for projects
            </p>
            <h2 className="font-serif text-6xl font-semibold leading-none md:text-8xl">
              Let&apos;s Collaborate
            </h2>
          </div>

          <div className="grid gap-14 pt-8 md:grid-cols-[1.2fr_0.8fr] md:gap-20">
            <form
              data-aos="fade-up"
              onSubmit={handleSubmit}
              className="flex flex-col gap-8"
            >
              <label className="flex flex-col gap-3">
                <span className="editorial-label">Name</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  className="editorial-input"
                />
              </label>

              <label className="flex flex-col gap-3">
                <span className="editorial-label">Email</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="hello@yourdomain.com"
                  className="editorial-input"
                />
              </label>

              <label className="flex flex-col gap-3">
                <span className="editorial-label">Subject</span>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Project type or inquiry"
                  className="editorial-input"
                />
              </label>

              <label className="flex flex-col gap-3">
                <span className="editorial-label">Message</span>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Describe your project or inquiry"
                  className="editorial-input resize-none"
                />
              </label>

              <div>
                <Button type="submit" size="lg" className="editorial-button">
                  Send Message
                </Button>
              </div>
            </form>

            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="flex flex-col gap-10"
            >
              <div className="grid gap-8">
                <div>
                  <p className="editorial-label mb-3 text-muted-foreground">
                    Electronic Mail
                  </p>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-lg text-foreground hover:underline"
                  >
                    {contactEmail}
                  </a>
                </div>
                <div>
                  <p className="editorial-label mb-3 text-muted-foreground">
                    Direct Line
                  </p>
                  <a
                    href="tel:+918387840848"
                    className="text-lg text-foreground hover:underline"
                  >
                    +91 8387840848
                  </a>
                </div>
                <div>
                  <p className="editorial-label mb-3 text-muted-foreground">
                    Studio Location
                  </p>
                  <p className="text-lg">Jodhpur, Rajasthan, India</p>
                </div>
              </div>

              <div className="flex gap-4">
                {[
                  { icon: Github, href: socials.github, label: "GitHub" },
                  { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
                  {
                    icon: Instagram,
                    href: socials.instagram,
                    label: "Instagram",
                  },
                  { icon: Mail, href: `mailto:${contactEmail}`, label: "Email" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={
                        item.href?.startsWith("mailto:") ? undefined : "_blank"
                      }
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="flex size-11 items-center justify-center border border-border text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="grid border-b border-border md:grid-cols-2">
          <div className="border-border p-8 md:border-r md:p-20">
            <blockquote className="font-serif text-3xl font-semibold italic leading-tight md:text-4xl">
              &quot;Precision in every pixel, intent in every interaction.&quot;
            </blockquote>
            <p className="mt-8 max-w-xl leading-7 text-muted-foreground">
              We believe in the power of restraint. The process starts with a
              deep understanding of your vision and ends with a solution that is
              as functional as it is beautiful.
            </p>
          </div>
          <div className="bg-card p-8 md:p-20">
            {[
              ["Brand Identity", "2025"],
              ["Web Architecture", "Custom"],
              ["Visual Design", "Editorial"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="editorial-label flex justify-between border-b border-border py-4"
              >
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-card">
        <div className="editorial-container flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-serif text-3xl font-bold">GAURAV DADHICH</div>
            <p className="editorial-label mt-4 text-muted-foreground">
              &copy; 2026 Gaurav Dadhich. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            {[
              ["LinkedIn", socials.linkedin],
              ["GitHub", socials.github],
              ["Instagram", socials.instagram],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target={href === "#" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="editorial-label text-foreground/80 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
