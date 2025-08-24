"use client";

import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCoverflow,
} from "swiper/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Aos from "aos";
import "aos/dist/aos.css";

export function ProjectSlider({ projects = [] }) {

  useEffect(() => {
    Aos.init({
      duration: 500,
      once: true,
    });
  }, []);

  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;

      // Set navigation elements after swiper initialization
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [projects]);

  return (
    <div className="relative w-full px-2 md:px-4">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        spaceBetween={16}
        slidesPerView={1.1}
        centeredSlides={true}
        effect={"coverflow"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 4,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1.2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1.5,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 2.5,
            spaceBetween: 24,
            coverflowEffect: {
              rotate: 0,
              stretch: 0,
              depth: 0,
              modifier: 1,
              slideShadows: false,
            },
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
        }}
        className="w-full py-4 md:py-8"
      >
        {projects.map((project) => (
          <SwiperSlide  key={project.id} className="h-auto">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 group h-full flex flex-col">
              <CardContent className="p-4 md:p-6 flex flex-col flex-grow">
                <div className="mb-4 md:mb-6">
                  {/* <div
                    className={`w-12 h-12 md:w-16 md:h-16 ${project.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-3 md:mb-4`}
                  >
                    {project.icon}
                  </div> */}
                  <div className=" rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-3 md:mb-4">
                    <img src={project.img} alt={project.title} />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl text-white mb-2 md:mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-3 md:mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
                    {project.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 md:px-2.5 md:py-1 bg-white/10 backdrop-blur-sm rounded-full text-[10px] md:text-xs text-gray-300 border border-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex gap-2 md:gap-3">
                  {project.liveUrl && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-gray-600 to-black text-white hover:from-gray-700 hover:to-gray-900 flex-1 text-xs md:text-sm h-8 md:h-9"
                      onClick={() => window.open(project.liveUrl, "_blank")}
                    >
                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
                      Live Demo
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 flex-1 text-xs md:text-sm h-8 md:h-9"
                      onClick={() => window.open(project.githubUrl, "_blank")}
                    >
                      <Github className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
                      Code
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        ref={prevRef}
        aria-label="Previous project"
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      <button
        ref={nextRef}
        aria-label="Next project"
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
      >
        <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
