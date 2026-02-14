import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gaurav Dadhich | Portfolio",
    short_name: "Gaurav Portfolio",
    description: "Portfolio of Gaurav Dadhich, a Full Stack Developer",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
