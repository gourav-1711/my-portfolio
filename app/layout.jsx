import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "swiper/css";
import "swiper/css/pagination";

export const metadata = {
  title: "Gaurav Dadhich - Portfolio",
  description: "Creative FullStack Web Developer from Jodhpur",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="dark overflow-x-hidden">{children}</body>
    </html>
  );
}
