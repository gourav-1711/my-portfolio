"use client";
import React, { useState } from "react";
import { FocusCards } from "@/components/ui/focus-cards";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Video,
  Users,
  ShoppingCart,
  Layout,
  Music,
} from "lucide-react";

const projects = [
  {
    id: 9,
    title: "Jewellery Walla",
    description:
      "A premium jewelry e-commerce platform offering a wide range of exquisite jewelry pieces. Built with modern web technologies for a seamless shopping experience.",
    icon: <Users className="w-8 h-8 text-white" />,
    img: "/img/projects/jewelleryWallaClientImg.png",
    gradient: "bg-gradient-to-r from-yellow-600 to-black",
    tags: ["React", "Tailwind CSS", "E-commerce"],
    liveUrl: "https://jewellerywalla.com/",
    githubUrl: null,
    category: ["all", "client-projects", "e-commerce"],
  },
  {
    id: 10,
    title: "Gurukripa Tours",
    description:
      "A travel agency website showcasing tour packages and travel services. Features a user-friendly interface for browsing destinations and booking trips.",
    icon: <Users className="w-8 h-8 text-white" />,
    img: "/img/projects/gurukripaTourClientImg.png",
    gradient: "bg-gradient-to-r from-blue-600 to-black",
    tags: ["React", "CSS", "Travel"],
    liveUrl: "https://gurukripatourandtravels.in/",
    githubUrl: null,
    category: ["all", "client-projects"],
  },
  {
    id: 1,
    title: "Videos Downloader Desktop App",
    description:
      "Electron + React desktop app to download Videos  and playlists with multiple formats using yt-dlp and ffmpeg.",
    icon: <Download className="w-8 h-8 text-white" />,
    img: "/img/projects/pngeasy-downloader.png",
    gradient: "bg-gradient-to-r from-red-600 to-black",
    tags: ["Electron", "React", "Node.js", "yt-dlp", "ffmpeg"],
    liveUrl: null,
    githubUrl: "https://github.com/gourav-1711/video-downloader-desktop/",
    category: ["all", "desktop-app"],
  },
  {
    id: 2,
    title: "Screen Recorder Desktop App",
    description:
      "Screen and audio recorder built with Electron and JavaScript, allowing users to select formats for export.",
    icon: <Video className="w-8 h-8 text-white" />,
    img: "/img/projects/screenRecorder.png",
    gradient: "bg-gradient-to-r from-gray-700 to-black",
    tags: ["Electron", "JavaScript"],
    liveUrl: null,
    githubUrl: "https://github.com/gourav-1711/screen-recorder",
    category: ["all", "desktop-app"],
  },
  {
    id: 3,
    title: "A FullStack Furniture E-commerce Website",
    description:
      "E-commerce website built with Next.js and Tailwind CSS, featuring Premium UI and Responsive Design. and Smooth Animation.",
    icon: <Users className="w-8 h-8 text-white" />,
    img: "/img/projects/monsta.png",
    gradient: "bg-gradient-to-r from-pink-600 to-black",
    tags: ["Next", "Tailwind", "FullStack", "E-commerce"],
    liveUrl: "https://monsta-ruddy.vercel.app/",
    githubUrl: "https://github.com/gourav-1711/monsta",
    category: ["all", "fullstack", "e-commerce"],
  },
  {
    id: 4,
    title: "Blinkit UI Clone",
    description:
      "A clone of Blinkit app built with React, featuring product listings and Context API for state management.",
    icon: <ShoppingCart className="w-8 h-8 text-white" />,
    img: "/img/projects/blinkit.png",
    gradient: "bg-gradient-to-r from-green-600 to-black",
    tags: ["React", "Context API", "CSS"],
    liveUrl: "https://blinkit-lake.vercel.app/",
    githubUrl: "https://github.com/gourav-1711/blinkit-clone",
    category: ["all", "ui-clones", "e-commerce"],
  },
  {
    id: 5,
    title: "Jewelry E-commerce Website UI",
    description:
      "E-commerce website built with React and Tailwind CSS, featuring Premium UI and Responsive Design. and Smooth Animation.",
    icon: <Users className="w-8 h-8 text-white" />,
    img: "/img/projects/jewellery.png",
    gradient: "bg-gradient-to-r from-pink-600 to-black",
    tags: ["React", "CSS", "Responsive UI"],
    liveUrl: "https://jewellery-demo-eight.vercel.app/",
    githubUrl: "https://github.com/gourav-1711/jewellery-demo",
    category: ["all"],
  },
  {
    id: 6,
    title: "Admin Panel Dashboard",
    description:
      "E-commerce admin dashboard with product, category, and user management system.",
    icon: <Layout className="w-8 h-8 text-white" />,
    img: "/img/projects/admin-panel.png",
    gradient: "bg-gradient-to-r from-gray-800 to-gray-600",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    liveUrl: "https://admin-panel-9tak.vercel.app/",
    githubUrl: "https://github.com/gourav-1711/adminPanel",
    category: ["all", "fullstack"],
  },
  {
    id: 7,
    title: "Spotify UI Clone",
    description:
      "A clone of Spotify’s web interface built in React with modern UI styling and responsive layout.",
    icon: <Music className="w-8 h-8 text-white" />,
    img: "/img/projects/spotify.png",
    gradient: "bg-gradient-to-r from-green-500 to-black",
    tags: ["React", "CSS", "Spotify UI"],
    liveUrl: "https://spotify-ten-opal-97.vercel.app/",
    githubUrl: "https://github.com/gourav-1711/Spotify-clone",
    category: ["all", "ui-clones"],
  },
  {
    id: 8,
    title: "A Next js Music Player",
    description:
      "A FullStack Music Player built with Next.js and Tailwind CSS, featuring YT Api ",
    icon: <Music className="w-8 h-8 text-white" />,
    img: "/img/projects/yt-music.png",
    gradient: "bg-gradient-to-r from-green-500 to-black",
    tags: ["Next", "Tailwind", "FullStack", "Music Player", "YT Api"],
    liveUrl: "https://music-player-app-eosin.vercel.app/",
    githubUrl: "https://github.com/gourav-1711/music-player-app",
    category: ["all", "fullstack"],
  },
  {
    id: 11,
    title: "React Native E-commerce App",
    description:
      "A feature-rich e-commerce application built with React Native and Expo, utilizing Zustand for efficient global state management.",
    icon: <ShoppingCart className="w-8 h-8 text-white" />,
    img: "/img/projects/rn-ecommerce.png",
    gradient: "bg-gradient-to-r from-purple-600 to-black",
    tags: ["React Native", "Expo", "Zustand"],
    liveUrl: null,
    githubUrl:
      "https://github.com/gourav-1711/react-native_e-commerce-application",
    category: ["all", "react-native", "e-commerce"],
  },
  {
    id: 12,
    title: "Image Optimizer App",
    description:
      "An efficient image optimization tool built with React Native and Expo that significantly reduces image file sizes.",
    icon: <Layout className="w-8 h-8 text-white" />,
    img: "/img/projects/image-optimizer.jpg",
    gradient: "bg-gradient-to-r from-blue-600 to-black",
    tags: ["React Native", "Expo", "Image Processing"],
    liveUrl: null,
    githubUrl: "https://github.com/gourav-1711/image-optimizer",
    category: ["all", "react-native"],
  },
];

const tabs = [
  { id: "all", label: "All" },
  { id: "client-projects", label: "Client Projects" },
  { id: "e-commerce", label: "E-Commerce" },
  { id: "fullstack", label: "FullStack" },
  { id: "react-native", label: "React Native" },
  { id: "ui-clones", label: "UI Clones" },
  { id: "desktop-app", label: "Desktop App" },
];

export function ProjectsSection() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects = projects.filter((project) =>
    project.category.includes(activeTab)
  );

  return (
    <div className="w-full space-y-8">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
              activeTab === tab.id
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <FocusCards
            cards={filteredProjects.map((project) => ({
              ...project,
              src: project.img,
            }))}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
